/**
 * 紫微斗数排盘（L3 盘系层入口）
 * ---------------------------------------------------------------------------
 * 输入与四柱共用同一套时间层（时区、真太阳时）与农历层（朔日、闰月、月长），
 * 但年界与日界各按自己的口径：四柱以立春换年、以子初/子正换日；
 * 紫微以农历正月初一换年、以晚子时进日。两者并列，不互相换算。
 *
 * 计算顺序不可交换（每一步都是下一步的输入）：
 *   农历 → 时辰索引 → 年干支 → 命身宫 → 五行局 → 十二宫天干 → 十二宫名
 *        → 紫微天府 → 十四主星 → 十四辅星 → 生年四化
 *        → 三十八杂曜 → 命主身主 → 四组十二神 → 大限小限
 * 其中三处依赖必须显式传参而不是各算一次：
 *   「五行局」被起紫微星、大限起运与长生十二神共用；
 *   「禄存宫位」被博士十二神直接取用；
 *   「左辅右弼文昌文曲宫位」被日系杂曜直接取用。
 * 两处各算一次必然漂移，会让星盘、限运与十二神互相对不上。
 */
import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { lunarDateOf, lunarYearOf } from '../../calendar/lunar.js';
import { createManifest } from '../../manifest.js';
import { factGraph, factFromRule } from '../../derive/facts.js';
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';
import { validateCivilInput } from '../../input/validate.js';
import {
  fixIndex, stemsOf, branchesOf, timeIndexOf, timeBranch, monthIndexFor, soulBodyIndex,
  palaceStems, fiveElementsClass, palaceNames, decadalLimits, xiaoxian, palaceBranch
} from './palace.js';
import { ziweiTianfuIndex, majorStars, auxiliaryStars, mutagen, starsByPalace } from './stars.js';
import { minorStars, soulBodyMaster } from './minor-stars.js';
import { twelveGods } from './twelve-gods.js';

/** 三十八杂曜的 ruleId 清单：用于逐组生成事实，避免把「哪颗星属于哪条规则」写死在事实层。 */
const MINOR_RULE_KEYS = ['yearMinorRule', 'monthMinorRule', 'dayMinorRule', 'hourMinorRule', 'hongluanTianxiRule'];

/**
 * 排紫微斗数盘。
 *
 * @param {object} input { year, month, day, hour, minute, longitude?, timezone?, gender? }
 * @param {object} options { ruleSet?, ruleSetId?, timePrecision? }
 */
export function castZiwei(input, options = {}) {
  input = validateCivilInput(input);
  const ruleSet = options.ruleSet ?? getRuleSet(options.ruleSetId ?? DEFAULT_ZIWEI_RULE_SET);
  const zone = input.timezone ?? 'Asia/Shanghai';
  const longitude = input.longitude ?? 120;
  const utc = civilToUTC(input, zone);

  // 真太阳时：紫微按时辰起宫，用钟表读数会在西部出生者身上整体错一个时辰。
  const shi = shichenOfCivil(input, longitude, {
    timePrecision: input.timePrecision ?? 'exact',
    timezone: zone,
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
  const bodyBranch = branches[bodyIndex];
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
  const auxiliaries = auxiliaryStars({ yearStem: lunarYear.stem, yearBranch: lunarYear.branch, monthIndex, timeIndex, ruleSet });
  // 杂曜依赖辅星的实际落宫（日系星自左辅右弼文昌文曲起算），因此必须排在辅星之后。
  const skeletal = [...majors, ...auxiliaries];
  const minors = minorStars({
    yearStem: lunarYear.stem, yearBranch: lunarYear.branch, monthIndex, timeIndex,
    lunarDay: lunar.day, soulIndex, bodyIndex, stars: skeletal, ruleSet
  });
  const stars = [...skeletal, ...minors];
  const mutagens = mutagen({ yearStem: lunarYear.stem, stars, ruleSet });
  const grouped = starsByPalace(stars, ruleSet);

  // 命主按命宫地支取，身主按生年地支取 —— 两者口径不同，见 minor-stars.js 注释。
  const masters = soulBodyMaster({ soulBranch, yearBranch: lunarYear.branch, ruleSet });

  // 十二神：将前与岁前只随年支，长生与博士随性别与年支阴阳，缺性别时后两组留空。
  const gods = twelveGods({
    fiveElementsValue: fiveElements.value, yearBranch: lunarYear.branch,
    gender: input.gender, stars, ruleSet
  });

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
    majorStars: Object.freeze(p.stars.filter((s) => s.tier === 'major').map((s) => s.name)),
    auxiliaryStars: Object.freeze(p.stars.filter((s) => s.tier === 'auxiliary').map((s) => s.name)),
    minorStars: Object.freeze(p.stars.filter((s) => s.tier === 'minor').map((s) => s.name)),
    mutagens: Object.freeze(mutagens.filter((m) => m.palaceIndex === i).map((m) => m.mutagen)),
    changsheng12: gods.changsheng ? gods.changsheng.gods[i] : null,
    boshi12: gods.boshi ? gods.boshi.gods[i] : null,
    jiangqian12: gods.jiangqian ? gods.jiangqian.gods[i] : null,
    suiqian12: gods.suiqian ? gods.suiqian.gods[i] : null,
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
    factFromRule(ruleSet.conventions.soulBody.ruleId, { id: 'ziwei.soul-body', value: { soul: soulBranch, body: bodyBranch }, ruleSet,
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
      .map((key) => factFromRule(ruleSet.tables[key].ruleId, { id: 'ziwei.' + key, value: auxiliaries.filter((s) => s.ruleId === ruleSet.tables[key].ruleId).map((s) => s.name), ruleSet })),
    factFromRule(ruleSet.tables.mutagenRule.ruleId, { id: 'ziwei.mutagen', value: mutagens.map((m) => m.name + m.mutagen), ruleSet }),
    // 杂曜按「年/月/日/时/红鸾天喜」五组分别成事实，一组算错只影响一条事实，
    // 不会让整张杂曜表看起来都对。
    ...MINOR_RULE_KEYS.filter((key) => ruleSet.tables[key]).map((key) => factFromRule(ruleSet.tables[key].ruleId, {
      id: 'ziwei.' + key,
      value: minors.filter((s) => s.ruleId === ruleSet.tables[key].ruleId).map((s) => s.name + '@' + branches[s.palaceIndex]),
      ruleSet
    })),
    ...(masters ? [factFromRule(ruleSet.tables.soulBodyMasterRule.ruleId, {
      id: 'ziwei.soul-body-master', value: { soul: masters.soulMaster, body: masters.bodyMaster }, ruleSet,
      extra: { soulBranch, yearBranch: lunarYear.branch }
    })] : []),
    // 十二神：长生与博士的顺逆随性别，未给性别时这两条事实不生成（宁缺勿造）。
    ...(gods.changsheng ? [factFromRule(ruleSet.tables.changshengRule.ruleId, {
      id: 'ziwei.changsheng12', value: gods.changsheng.gods, ruleSet,
      extra: { startBranch: gods.changsheng.startBranch, direction: gods.changsheng.direction }
    })] : []),
    ...(gods.boshi ? [factFromRule(ruleSet.tables.boshiRule.ruleId, {
      id: 'ziwei.boshi12', value: gods.boshi.gods, ruleSet,
      extra: { startFrom: gods.boshi.startFrom, direction: gods.boshi.direction }
    })] : []),
    ...(gods.jiangqian ? [factFromRule(ruleSet.tables.jiangqianRule.ruleId, {
      id: 'ziwei.jiangqian12', value: gods.jiangqian.gods, ruleSet,
      extra: { startBranch: gods.jiangqian.startBranch, direction: gods.jiangqian.direction }
    })] : []),
    ...(gods.suiqian ? [factFromRule(ruleSet.tables.suiqianRule.ruleId, {
      id: 'ziwei.suiqian12', value: gods.suiqian.gods, ruleSet,
      extra: { startBranch: gods.suiqian.startBranch, direction: gods.suiqian.direction }
    })] : []),
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
    body: Object.freeze({ palaceIndex: bodyIndex, branch: bodyBranch }),
    fiveElements,
    masters,
    palaces: Object.freeze(palaces),
    stars: Object.freeze(stars.map((s) => Object.freeze({ ...s, branch: branches[s.palaceIndex], palaceName: names[s.palaceIndex] }))),
    twelveGods: gods,
    mutagens: Object.freeze(mutagens),
    decadal: limits,
    xiaoxian: xiaoxianResult,
    facts,
    manifest
  };
}

export { stemsOf, branchesOf, fixIndex };
