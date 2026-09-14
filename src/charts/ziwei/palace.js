/**
 * 紫微斗数宫位层（L3 盘系层）
 * ---------------------------------------------------------------------------
 * 只负责宫位、五行局、大限与小限。所有取值来自 rules/ziwei-core-0.2.0（默认）或 0.1.0，
 * 本文件不内嵌任何流派字面量：换派 = 换规则集，不改这里。
 *
 * 索引约定（全目录统一；错一处就整盘错位，故在此集中声明）
 *   palaceIndex —— 寅基，0=寅 1=卯 2=辰 … 11=丑。十二宫自寅起布，用寅基可省去每处 ±2。
 *   branchIndex —— 子基，0=子 1=丑 2=寅 … 11=亥。干支表天然是子基。
 *   换算：branchIndex = (palaceIndex + 2) % 12。
 *   timeIndex   —— 0..12 的十三值时辰：0=早子(00:00-01:00) … 11=亥 … 12=晚子(23:00-00:00)。
 *                  取地支时用 fixIndex(timeIndex, 12)：晚子自然归子，与早子同宫。
 *
 * 与四柱的分工：四柱以节气立年、以真太阳时定时，紫微以农历正月初一立年、
 * 以农历月与时辰起宫。两者共用时间层与农历层，但**不互相换算**。
 */
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';

/** 循环取模，负数也回到 [0, max)。 */
export function fixIndex(i, max = 12) {
  return ((i % max) + max) % max;
}

/** 天干表：兼容字符串数组与 {name} 对象数组两种写法。 */
export function stemsOf(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return ruleSet.tables.stems.map((s) => (typeof s === 'string' ? s : s.name));
}

/** 地支表：同上。 */
export function branchesOf(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return ruleSet.tables.branches.map((b) => (typeof b === 'string' ? b : b.name));
}

/** 地支名 -> 子基索引；未知地支抛错而不是静默返回 -1。 */
export function branchIndexOf(branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const index = branchesOf(ruleSet).indexOf(branch);
  if (index < 0) throw new Error('unknown branch: ' + branch);
  return index;
}

/** 地支名 -> 寅基宫位索引。 */
export function palaceIndexOf(branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return fixIndex(branchIndexOf(branch, ruleSet) - 2);
}

/** 寅基宫位索引 -> 地支名。 */
export function palaceBranch(palaceIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return branchesOf(ruleSet)[fixIndex(palaceIndex + 2)];
}

/**
 * 真太阳时 -> 十三值时辰索引。
 * 必须用「经度与均时差修正后的分钟数」判定，不能用钟表读数：
 * 新疆出生者钟表 09:00 时真太阳时可能仍在卯时，用钟表读数会整体错一个时辰。
 */
export function timeIndexOf(trueSolarMinutes, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const m = fixIndex(trueSolarMinutes, 1440);
  const hour = Math.floor(m / 60);
  if (hour === (ruleSet.parameters.earlyZiHour ?? 0)) return 0;
  if (hour === (ruleSet.parameters.lateZiHour ?? 23)) return ruleSet.parameters.lateZiTimeIndex ?? 12;
  return Math.floor((hour + 1) / 2);
}

/** 时辰索引 -> 地支名（晚子归子）。 */
export function timeBranch(timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return branchesOf(ruleSet)[fixIndex(timeIndex, 12)];
}

/**
 * 生月宫索引（寅基）。
 *   寅宫起正月，顺数至生月；闰月按规则集口径切分：
 *   前十五日（含十五）仍作本月，十六日起作下月，晚子时不参与该修正。
 */
export function monthIndexFor({ monthNumber, leap = false, day, timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const mode = ruleSet.parameters.leapMonthMode ?? 'split-fifteen';
  let index = fixIndex(Number(monthNumber) - 1);
  if (!leap) return index;
  if (mode !== 'split-fifteen') throw new Error('unknown leapMonthMode: ' + mode);
  const splitDay = ruleSet.parameters.leapSplitDay ?? 15;
  const skipLateZi = ruleSet.parameters.leapFixAppliesToLateZi !== true;
  const lateZiIndex = ruleSet.parameters.lateZiTimeIndex ?? 12;
  if (day > splitDay && !(skipLateZi && timeIndex === lateZiIndex)) index = fixIndex(index + 1);
  return index;
}

/**
 * 命宫与身宫（均为寅基索引）。
 *   命宫：自生月宫起子时，逆数至生时。
 *   身宫：自生月宫起子时，顺数至生时。
 * 生时取地支（晚子归子），因此早子与晚子同宫 —— 这是紫微的通行口径，
 * 「晚子进日」影响的是农历日数与紫微星定位，不影响命身宫。
 */
export function soulBodyIndex({ monthIndex, timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const hourBranchIndex = fixIndex(timeIndex, 12);
  return {
    soulIndex: fixIndex(monthIndex - hourBranchIndex),
    bodyIndex: fixIndex(monthIndex + hourBranchIndex),
    hourBranchIndex
  };
}

/**
 * 十二宫天干（寅基数组，索引即 palaceIndex）。
 *   寅宫天干由五虎遁从年干取得，其后逐宫顺行一位天干。
 */
export function palaceStems({ yearStem, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const stems = stemsOf(ruleSet);
  const tigerStem = ruleSet.tables.tigerRule.table[yearStem];
  if (!tigerStem) throw new Error('unknown year stem for tiger rule: ' + yearStem);
  const base = stems.indexOf(tigerStem);
  if (base < 0) throw new Error('tiger rule returned unknown stem: ' + tigerStem);
  return Array.from({ length: 12 }, (_, i) => stems[fixIndex(base + i, 10)]);
}

/**
 * 五行局：命宫干支的纳音五行。
 *   局数 = 天干数 + 地支数（超过 5 者减 5），落到木三/金四/水二/火六/土五局。
 * 局数同时是「起紫微星的除数」与「大限起运虚岁」，两处必须取同一个值，
 * 否则星盘与限运会对不上，因此这里只算一次、只暴露一个 value。
 */
export function fiveElementsClass({ stem, branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const rule = ruleSet.tables.fiveElementsClassRule;
  const stemIndex = stemsOf(ruleSet).indexOf(stem);
  const branchIndex = branchIndexOf(branch, ruleSet);
  if (stemIndex < 0) throw new Error('unknown stem: ' + stem);
  const stemNumber = rule.stemNumbers[stemIndex];
  const branchNumber = rule.branchNumbers[branchIndex];
  let index = stemNumber + branchNumber;
  while (index > 5) index -= 5;
  const entry = rule.order[index - 1];
  if (!entry) throw new Error('five elements class out of range: ' + index);
  return Object.freeze({ name: entry.name, element: entry.element, value: entry.value, stemNumber, branchNumber, ruleIndex: index });
}

/**
 * 十二宫名（寅基数组）。
 *   自命宫起逆布：兄弟、夫妻、子女、财帛、疾厄、迁移、交友、官禄、田宅、福德、父母。
 *   逆布 = 寅基索引递减。
 */
export function palaceNames({ soulIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const names = palaceNameOrder(ruleSet);
  return Array.from({ length: 12 }, (_, i) => names[fixIndex(i - soulIndex, 12)]);
}

/** 宫名顺序表：兼容 {order:[...]} 与纯数组两种写法。 */
export function palaceNameOrder(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const table = ruleSet.tables.palaceNames;
  const names = Array.isArray(table) ? table : table.order;
  if (!Array.isArray(names) || names.length !== 12) throw new Error('palaceNames must provide 12 names');
  return names;
}

/** 宫名别名：同一宫在不同流派下的别称，供下游做跨流派比对时对齐。 */
export function palaceNameAliases(name, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const aliases = ruleSet.tables.palaceNames?.aliases ?? {};
  return [name, ...(aliases[name] ?? [])];
}

/**
 * 大限。
 *   顺逆：生年支为阳且男命、生年支为阴且女命者顺行，其余逆行。
 *   起运：虚岁等于五行局数，每宫十年。
 */
export function decadalLimits({
  soulIndex, fiveElementsValue, yearBranch, gender, palaceStems: stems, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)
}) {
  const rule = ruleSet.conventions.decadalDirection;
  const genderPolarity = rule.genderPolarity?.[gender];
  if (!genderPolarity) throw new Error('unknown gender: ' + gender);
  const branchPolarity = fixIndex(branchIndexOf(yearBranch, ruleSet), 2) === 0 ? '阳' : '阴';
  const direction = genderPolarity === branchPolarity ? 1 : -1;
  const perLimit = ruleSet.parameters.decadalYears ?? 10;
  const limits = Array.from({ length: 12 }, (_, i) => {
    const palaceIndex = fixIndex(soulIndex + direction * i);
    const startAge = fiveElementsValue + perLimit * i;
    return Object.freeze({
      order: i,
      palaceIndex,
      branch: palaceBranch(palaceIndex, ruleSet),
      stem: stems[palaceIndex],
      startAge,
      endAge: startAge + perLimit - 1
    });
  });
  return Object.freeze({ direction, forward: direction === 1, branchPolarity, genderPolarity, perLimit, limits });
}

/**
 * 小限。
 *   起宫按年支三合：寅午戌年辰上起，申子辰年戌上起，巳酉丑年未上起，亥卯未年丑上起。
 *   男顺女逆，一年一宫，十二年一轮。
 */
export function xiaoxian({ yearBranch, gender, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const rule = ruleSet.conventions.xiaoxian;
  const startBranch = rule.table[yearBranch];
  if (!startBranch) throw new Error('unknown year branch for xiaoxian: ' + yearBranch);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  const direction = rule.direction?.[gender];
  if (!direction) throw new Error('unknown gender: ' + gender);
  const perCycle = ruleSet.parameters.xiaoxianCycleYears ?? 12;
  const cycles = ruleSet.parameters.xiaoxianCycles ?? 10;
  const ages = Array.from({ length: 12 }, () => []);
  for (let i = 0; i < 12; i++) {
    const palaceIndex = fixIndex(startIndex + direction * i);
    ages[palaceIndex] = Array.from({ length: cycles }, (_, j) => i + 1 + perCycle * j);
  }
  return Object.freeze({
    startBranch,
    startIndex,
    direction,
    perCycle,
    ages: Object.freeze(ages.map((a) => Object.freeze(a)))
  });
}
