import { luckDirection, ganzhi, stemsOf, branchesOf } from './pillars.js';
import { getRuleSet } from '../../../rules/index.js';

/**
 * 大运基础计算。
 * 起运年龄 = 出生时刻到顺／逆方向相邻「节」的天数 ÷ 3（规则 bazi.luck.days-to-boundary-over-3）。
 * 取整方式、子初换日、性别规则在不同门派有差异，因此结果保留 method 与 options，不单独解释。
 */
export function startLuckAge(daysToBoundary, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const divisor = options.daysPerYear ?? ruleSet.parameters.luckDaysPerYear;
  if (!(divisor > 0)) throw new Error('daysPerYear must be positive');
  return Math.abs(daysToBoundary) / divisor;
}

export function luckPillars(monthPillar, direction, count = 10, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const stem = stems.indexOf(monthPillar[0]);
  const branch = branches.indexOf(monthPillar[1]);
  const cycle = ruleSet.parameters.sexagenaryCycleLength;
  const base = Array.from({length: cycle}, (_, i) => ganzhi(i, ruleSet)).indexOf(monthPillar);
  if (base < 0 || stem < 0 || branch < 0) throw new Error('invalid month pillar: ' + monthPillar);
  return Array.from({length: count}, (_, i) => ganzhi(base + direction * (i + 1), ruleSet));
}

export function buildLuck({ monthPillar, yearStem, gender, daysToBoundary, options = {} }) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const direction = options.direction ?? luckDirection(yearStem, gender, ruleSet);
  return {
    direction,
    startAgeYears: startLuckAge(daysToBoundary, { ...options, ruleSet }),
    pillars: luckPillars(monthPillar, direction, options.count ?? 10, { ruleSet }),
    method: 'days-to-boundary-divided-by-3',
    ruleId: ruleSet.conventions.luckStart.ruleId,
    directionRuleId: ruleSet.conventions.luckDirection.ruleId,
    ruleSet: ruleSet.id,
    options
  };
}
