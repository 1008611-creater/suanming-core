/**
 * 紫微斗数排盘（L3 盘系层入口）
 * ---------------------------------------------------------------------------
 * 输入与四柱共用同一套时间层（时区、真太阳时）与农历层（朔日、闰月、月长），
 * 但年界与日界各按自己的口径：四柱以立春换年、以子初/子正换日；
 * 紫微以农历正月初一换年、以晚子时进日。两者并列，不互相换算。
 *
 * 计算顺序不可交换（每一步都是下一步的输入）：
 *   农历 → 时辰索引 → 年干支 → 命身宫 → 五行局 → 十二宫天干 → 十二宫名
 *        → 紫微天府 → 十四主星 → 十四辅星 → 生年四化 → 大限小限
 * 其中「五行局」被起紫微星与大限起运共用，因此只算一次往下传，
 * 两处各算一次必然漂移，会让星盘与限运对不上。
 */
import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { lunarDateOf, lunarYearOf } from '../../calendar/lunar.js';
import { createManifest } from '../../manifest.js';
import { factGraph, factFromRule } from '../../derive/facts.js';
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';
import {
  fixIndex, stemsOf, branchesOf, timeIndexOf, timeBranch, monthIndexFor, soulBodyIndex,
  palaceStems, fiveElementsClass, palaceNames, decadalLimits, xiaoxian, palaceBranch
} from './palace.js';
import { ziweiTianfuIndex, majorStars, auxiliaryStars, mutagen, starsByPalace } from './stars.js';

/**
 * 排紫微斗数盘。
 *
 * @param {object} input { year, month, day, hour, minute, longitude?, timezone?, gender? }
 * @param {object} options { ruleSet?, ruleSetId?, timePrecision? }
 */
export function castZiwei(input, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet(options.ruleSetId ?? DEFAULT_ZIWEI_RULE_SET);
  const zone = input.timezone ?? 'Asia/Shanghai';
  const longitude = input.longitude ?? 120;
  const utc = civilToUTC(input, zone);

  // 真太阳时：紫微按时辰起宫，用钟表读数会在西部出生者身上整体错一个时辰。
  const shi = shichenOfCivil(input, longitude, {
    timePrecision: input.timePrecision ?? 'exact',
    equationOfTimeMinutes: options.equationOfTimeMinutes
  });
  const timeIndex = timeIndexOf(shi.trueSolarMinutes, ruleSet);
  const hourBranch = timeBranch(timeIndex, ruleSet);

  // 农历：日界用民用日（真太阳时只影响时辰，不改变农历日期）。
  const lunar = lunarDateOf(input.year, input.month, input.day);
  if (!lunar) throw new Error('cannot resolve lunar date for input');
  const lunarYear = lunarYearOf(input.year, input.month, input.day);
  if (!lunarYear) throw new Error('cannot resolve lunar year for input');

  const monthIndex = monthIndexFor({
    monthNumber: lunar.monthNumber, leap: lunar.leap, day: lunar.day, timeIndex, ruleSet
  });
  const { soulIndex, bodyIndex } = soulBodyIndex({ monthIndex, timeIndex, ruleSet });

  const stems = palaceStems({ yearStem: lunarYear.stem, ruleSet });
  const branches = Array.from({ length: 12 }, (_, i) => palaceBranch(i, ruleSet));
  const soulStem = stems[soulIndex];
  const soulBranch = branches[soulIndex];
  const fiveElements = fiveElementsClass({ stem: soulStem, branch: soulBranch, ruleSet });
  const names = palaceNames({ soulIndex, ruleSet });

  const { ziweiIndex, tianfuIndex } = ziweiTianfuIndex({
    lunarDay: lunar.day,
    monthDays: lunar.days,
    timeIndex,
    fiveElementsValue: fiveElements.value,
    ruleSet
  });

  const majors = majorStars({ ziweiIndex, tianfuIndex, ruleSet });
  const minors = auxiliaryStars({ yearStem: lunarYear.stem, yearBranch: lunarYear.branch, monthIndex, timeIndex, ruleSet });
  const stars = [...majors, ...minors];
  const mutagens = mutagen({ yearStem: lunarYear.stem, stars, ruleSet });
  const grouped = starsByPalace(stars, ruleSet);

  // 限运需要性别；未提供时留空而不是编造默认值 —— 编造会让「男顺女逆」静默变成男命结果。
  const limits = input.gender
    ? decadalLimits({
        soulIndex, fiveElementsValue: fiveElements.value, yearBranch: lunarYear.branch,
        gender: input.gender, palaceStems: stems, ruleSet
      })
    : null;
  const xiaoxianResult = input.gender ? xiaoxian({ yearBranch: lunarYear.branch, gender: input.gender, ruleSet }) : null;

  const palaces = grouped.map((p, i) => ({
    palaceIndex: i,
    branch: branches[i],
    stem: stems[i],
    name: names[i],
    isSoulPalace: i === soulIndex,
    isBodyPalace: i === bodyIndex,
    stars: Object.freeze(p.stars.map((s) => Object.freeze({ ...s }))),
    starNames: Object.freeze(p.stars.map((s) => s.name)),
    mutagens: Object.freeze(mutagens.filter((m) => m.palaceIndex === i).map((m) => m.mutagen)),
    decadal: limits ? limits.limits.find((l) => l.palaceIndex === i) ?? null : null,
    xiaoxianAges: xiaoxianResult ? xiaoxianResult.ages[i] : null
  }));

  const manifest = createManifest({
    timezone: zone, longitude, ruleSetId: ruleSet.id, ruleSetVersion: ruleSet.version
  });

  // 每条事实都指向规则集中的 ruleId，置信度由规则给出，计算层不得自行填写。
  const facts = factGraph([
    factFromRule(ruleSet.conventions.yearBoundary.ruleId, { id: 'ziwei.year', value: lunarYear.ganzhi, ruleSet }),
    factFromRule(ruleSet.conventions.timeIndex.ruleId, { id: 'ziwei.time-index', value: timeIndex, ruleSet,
      extra: { trueSolarMinutes: shi.trueSolarMinutes, branch: hourBranch } }),
    factFromRule(ruleSet.conventions.monthIndex.ruleId, { id: 'ziwei.month-index', value: monthIndex, ruleSet,
      extra: { lunarMonth: lunar.monthNumber, leap: lunar.leap, lunarDay: lunar.day } }),
    factFromRule(ruleSet.conventions.lateZiDay.ruleId, { id: 'ziwei.late-zi-day', value: timeIndex === 12 ? lunar.day + 1 : lunar.day, ruleSet,
      extra: { lunarDay: lunar.day, monthDays: lunar.days } }),
    factFromRule(ruleSet.conventions.soulBody.ruleId, { id: 'ziwei.soul-body', value: { soul: soulBranch, body: branches[bodyIndex] }, ruleSet,
      extra: { soulIndex, bodyIndex } }),
    factFromRule(ruleSet.tables.tigerRule.ruleId, { id: 'ziwei.palace-stems', value: stems, ruleSet,
      extra: { tigerStem: ruleSet.tables.tigerRule.table[lunarYear.stem] } }),
    factFromRule(ruleSet.tables.fiveElementsClassRule.ruleId, { id: 'ziwei.five-elements', value: fiveElements.name, ruleSet,
      extra: { soulStem, soulBranch, value: fiveElements.value, element: fiveElements.element } }),
    factFromRule(ruleSet.conventions.palaceNaming.ruleId, { id: 'ziwei.palace-names', value: names, ruleSet }),
    factFromRule(ruleSet.tables.ziweiPositionRule.ruleId, { id: 'ziwei.ziwei-position', value: { ziwei: branches[ziweiIndex], tianfu: branches[tianfuIndex] }, ruleSet,
      extra: { ziweiIndex, tianfuIndex } }),
    factFromRule(ruleSet.tables.majorStarRule.ruleId, { id: 'ziwei.major-stars', value: majors.map((s) => s.name), ruleSet }),
    ...['lucunRule', 'tianmaRule', 'kuiyueRule', 'zuoyouRule', 'wenchangWenquRule', 'dikongDijieRule', 'huolingRule']
      .map((key) => factFromRule(ruleSet.tables[key].ruleId, { id: 'ziwei.' + key, value: minors.filter((s) => s.ruleId === ruleSet.tables[key].ruleId).map((s) => s.name), ruleSet })),
    factFromRule(ruleSet.tables.mutagenRule.ruleId, { id: 'ziwei.mutagen', value: mutagens.map((m) => m.name + m.mutagen), ruleSet }),
    ...(limits ? [
      factFromRule(ruleSet.conventions.decadalDirection.ruleId, { id: 'ziwei.decadal-direction', value: limits.direction, ruleSet,
        extra: { branchPolarity: limits.branchPolarity, genderPolarity: limits.genderPolarity } }),
      factFromRule(ruleSet.conventions.decadalStart.ruleId, { id: 'ziwei.decadal-start', value: fiveElements.value, ruleSet }),
      factFromRule(ruleSet.conventions.xiaoxian.ruleId, { id: 'ziwei.xiaoxian', value: xiaoxianResult.startBranch, ruleSet,
        extra: { direction: xiaoxianResult.direction } })
    ] : [])
  ], manifest);

  return {
    schemaVersion: '1.0.0',
    kind: 'ziwei',
    input: { ...input, timezone: zone },
    time: { ...utc, trueSolarMinutes: shi.trueSolarMinutes, timeIndex, hourBranch, shichen: shi },
    lunar: Object.freeze({
      year: lunarYear.lunarYear, stem: lunarYear.stem, branch: lunarYear.branch, ganzhi: lunarYear.ganzhi,
      monthNumber: lunar.monthNumber, leap: lunar.leap, day: lunar.day, days: lunar.days, monthIndex
    }),
    soul: Object.freeze({ palaceIndex: soulIndex, branch: soulBranch, stem: soulStem }),
    body: Object.freeze({ palaceIndex: bodyIndex, branch: branches[bodyIndex] }),
    fiveElements,
    palaces: Object.freeze(palaces),
    stars: Object.freeze(stars.map((s) => Object.freeze({ ...s, branch: branches[s.palaceIndex], palaceName: names[s.palaceIndex] }))),
    mutagens: Object.freeze(mutagens),
    decadal: limits,
    xiaoxian: xiaoxianResult,
    facts,
    manifest
  };
}

export { stemsOf, branchesOf, fixIndex };
