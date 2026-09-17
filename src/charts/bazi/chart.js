import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { julianDayFromGregorian } from '../../time/julian.js';
import { createManifest } from '../../manifest.js';
import { yearPillar, monthPillar, dayPillar, hourPillar, pillarDetail, luckDirection, dayNumberForBoundary } from './pillars.js';
import { buildLuck } from './luck.js';
import { factGraph, factFromRule } from '../../derive/facts.js';
import { currentMonthBoundary, nextMonthBoundary, solarTermInstant } from '../../astro/solar-terms.js';
import { getRuleSet, DEFAULT_BAZI_RULE_SET } from '../../../rules/index.js';

/**
 * 排盘：输入经时间层与天文层，落到四柱与事实图。
 *
 * 关键边界（都对应规则集中的 ruleId）：
 *   - 年柱：立春（黄经 315°）瞬间换年。
 *   - 月柱：出生瞬间之前最近的「节」。
 *   - 日柱：换日基准由规则集参数 dayBoundaryMode 决定（子正换日 / 子初换日）。
 *           **绝不能用 UTC 儒略日的日序**——东八区凌晨出生时 UTC 仍是前一天，
 *           用 UTC 日序会把日柱整体算错一天。子初换日则再按真太阳时 23:00 判定是否进次日。
 *   - 时柱：真太阳时两小时一时辰，配五鼠遁取天干。日柱换日基准同样作用于时干：
 *           子初换日后 23:00—24:00 的时干必须用次日日干，否则日柱与时干会自相矛盾。
 */
export function castBazi(input, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet(options.ruleSetId ?? DEFAULT_BAZI_RULE_SET);
  const zone = input.timezone ?? 'Asia/Shanghai';
  const utc = civilToUTC(input, zone);
  const longitude = input.longitude ?? 120;
  // 真太阳时含经度修正与均时差，两者都在 shichenOfCivil 内部完成。
  // options.equationOfTimeMinutes 仅用于对比研究：显式给出时覆盖自动计算。
  const shi = shichenOfCivil(input, longitude, {
    timePrecision: input.timePrecision ?? 'exact',
    timezone: zone,
    equationOfTimeMinutes: options.equationOfTimeMinutes
  });

  // 日柱：先取出生地民用日的日期序号（不是 UTC 时刻的日序），再按流派换日基准判定。
  const civilDayNumber = julianDayFromGregorian(input.year, input.month, input.day);
  const dayNumber = dayNumberForBoundary(civilDayNumber, shi, ruleSet);
  const day = dayPillar(dayNumber, ruleSet);

  const lichun = solarTermInstant(input.year, 315).utc;
  const year = yearPillar(input.year, input.month, input.day, {
    yearBoundary: 'calendar', forcePrevious: utc.jdUTC < lichun, ruleSet
  });
  const boundary = currentMonthBoundary(utc.jdUTC);
  const month = monthPillar(year[0], boundary?.degree ?? 315, { ruleSet });
  const hour = hourPillar(day[0], shi.index, ruleSet);

  const direction = input.gender ? luckDirection(year[0], input.gender, ruleSet) : null;
  const adjacent = direction === 1 ? nextMonthBoundary(utc.jdUTC) : boundary;
  const daysToBoundary = adjacent ? (adjacent.utc - utc.jdUTC) : 0;
  const luck = input.gender
    ? buildLuck({ monthPillar: month, yearStem: year[0], gender: input.gender, daysToBoundary, options: { direction, ruleSet } })
    : null;

  const manifest = createManifest({ timezone: zone, longitude, ruleSetId: ruleSet.id, ruleSetVersion: ruleSet.version });
  const pillars = { year, month, day, hour };
  const facts = factGraph([
    factFromRule(ruleSet.conventions.yearBoundary.ruleId, { id: 'pillar.year', value: year, ruleSet }),
    factFromRule(ruleSet.conventions.monthBoundary.ruleId, { id: 'pillar.month', value: month, ruleSet }),
    factFromRule(ruleSet.tables.dayPillarRule.ruleId, { id: 'pillar.day', value: day, ruleSet }),
    factFromRule(ruleSet.conventions.hourBoundary.ruleId, { id: 'pillar.hour', value: hour, ruleSet }),
    factFromRule(ruleSet.tables.hiddenStemsRule.ruleId, { id: 'pillars.detail', value: pillarDetail(pillars, ruleSet), ruleSet }),
    ...(luck ? [factFromRule(ruleSet.conventions.luckStart.ruleId, { id: 'luck.start-age', value: luck.startAgeYears, ruleSet })] : [])
  ], manifest);

  return {
    schemaVersion: '1.0.0',
    input: { ...input, timezone: zone },
    pillars,
    time: { ...utc, civilDayNumber, dayNumber, dayBoundaryMode: ruleSet.parameters.dayBoundaryMode ?? 'civil-midnight', shichen: shi },
    luck,
    facts,
    manifest
  };
}
