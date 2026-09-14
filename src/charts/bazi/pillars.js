import { getRuleSet } from '../../../rules/index.js';

/**
 * 四柱基础运算。所有取值、表格与阈值均来自规则集，本文件不内嵌流派字面量。
 * 默认使用 bazi-core-0.1.0（通用派）；需要其他流派时传入自己的规则集。
 */
const DEFAULT = getRuleSet();

export function stemsOf(ruleSet = DEFAULT) { return ruleSet.tables.stems.map(s => s.name); }
export function branchesOf(ruleSet = DEFAULT) { return ruleSet.tables.branches.map(b => b.name); }
export function hiddenStemsOf(ruleSet = DEFAULT) {
  return Object.fromEntries(ruleSet.tables.branches.map(b => [b.name, [...b.hiddenStems]]));
}
export function tenGodNamesOf(ruleSet = DEFAULT) { return [...ruleSet.tables.tenGodNames]; }
export function elementOfStem(stem, ruleSet = DEFAULT) { return ruleSet.tables.stems.find(s => s.name === stem)?.element ?? null; }
export function elementOfBranch(branch, ruleSet = DEFAULT) { return ruleSet.tables.branches.find(b => b.name === branch)?.element ?? null; }

export const STEMS = stemsOf();
export const BRANCHES = branchesOf();
export const hiddenStems = hiddenStemsOf();

export function ganzhi(i, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  return stems[((i % stems.length) + stems.length) % stems.length]
       + branches[((i % branches.length) + branches.length) % branches.length];
}

export function sexagenaryDay(jd, ruleSet = DEFAULT) {
  return ganzhi(Math.floor(jd + 0.5) + ruleSet.parameters.dayPillarJdnOffset, ruleSet);
}

export function yearPillar(y, m, d, o = {}) {
  const ruleSet = o.ruleSet ?? DEFAULT;
  const v = o.forcePrevious ? y - 1
    : (o.yearBoundary === 'calendar' ? y : (m < 2 || (m === 2 && d < 4) ? y - 1 : y));
  return ganzhi(v - 4, ruleSet);
}

/** 由太阳视黄经求月柱；边界黄经来自规则集的步长与偏移参数。 */
export function monthPillar(yearOrStem, lon = 315, o = {}) {
  const ruleSet = o.ruleSet ?? DEFAULT;
  const { monthBoundaryStepDegrees: step, monthBoundaryOffsetDegrees: offset } = ruleSet.parameters;
  const branches = branchesOf(ruleSet), stems = stemsOf(ruleSet);
  const b = (Math.floor((((lon - 315) + 360) % 360) / step) + 2) % 12;
  const ys = typeof yearOrStem === 'string' ? stems.indexOf(yearOrStem) : ((yearOrStem - 4) % 10 + 10) % 10;
  const s = ((ys % 5) * 2 + 2) % 10;
  return stems[(s + b - 2 + 10) % 10] + branches[b];
}

export function dayPillar(jd, ruleSet = DEFAULT) { return sexagenaryDay(jd, ruleSet); }

/**
 * 时柱：五鼠遁。
 *   甲己日起甲子时，乙庚日起丙子时，丙辛日起戊子时，丁壬日起庚子时，戊癸日起壬子时。
 *   子时基准天干 = (日干序号 % 5) × 2；此后每进一个时辰（一个地支）天干前进一位，
 *   因此偏移量就是地支序号本身，不能折半——折半会让丑、卯等偶数序地支重复前一柱的天干。
 */
export function hourPillar(dayStem, hourBranch, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const s = stems.indexOf(dayStem);
  const b = typeof hourBranch === 'number' ? hourBranch : branches.indexOf(hourBranch);
  if (s < 0) throw new Error('unknown day stem: ' + dayStem);
  if (b < 0 || b > 11) throw new Error('unknown hour branch: ' + hourBranch);
  return stems[((s % 5) * 2 + b) % 10] + branches[b];
}

/** 十神：以日干为主，映射他干。 */
export function tenGod(dayStem, otherStem, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), names = tenGodNamesOf(ruleSet);
  return names[(stems.indexOf(otherStem) - stems.indexOf(dayStem) + 10) % 10];
}

/** 大运顺逆：阳年干男命、阴年干女命顺行。 */
export function luckDirection(yearStem, gender, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet);
  return ((stems.indexOf(yearStem) % 2 === 0) === (gender === 'male')) ? 1 : -1;
}

/** 四柱干支与藏干、十神的完整结构，供派生层使用。 */
export function pillarDetail(pillars, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const hidden = hiddenStemsOf(ruleSet);
  return Object.fromEntries(Object.entries(pillars).map(([key, pillar]) => {
    const [stem, branch] = [pillar[0], pillar[1]];
    return [key, {
      pillar,
      stem,
      branch,
      stemIndex: stems.indexOf(stem),
      branchIndex: branches.indexOf(branch),
      stemElement: elementOfStem(stem, ruleSet),
      branchElement: elementOfBranch(branch, ruleSet),
      hiddenStems: [...(hidden[branch] ?? [])]
    }];
  }));
}
