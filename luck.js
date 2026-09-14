import { luckDirection, ganzhi } from './pillars.js';

/**
 * 大运基础计算。起运岁数采用“出生时刻到顺/逆方向下一节气的天数 / 3”。
 * 不同门派对起运取整、子初换日有差异，因此结果保留算法参数。
 */
export function startLuckAge(daysToBoundary, options = {}) {
  const divisor = options.daysPerYear ?? 3;
  return daysToBoundary / divisor;
}
export function luckPillars(monthPillar, direction, count = 10) {
  const stem = '甲乙丙丁戊己庚辛壬癸'.indexOf(monthPillar[0]);
  const branch = '子丑寅卯辰巳午未申酉戌亥'.indexOf(monthPillar[1]);
  const base = Array.from({length:60}, (_, i) => ganzhi(i)).indexOf(monthPillar);
  if (base < 0 || stem < 0 || branch < 0) throw new Error('invalid month pillar: ' + monthPillar);
  return Array.from({length: count}, (_, i) => ganzhi(base + direction * (i + 1)));
}
export function buildLuck({ monthPillar, yearStem, gender, daysToBoundary, options = {} }) {
  const direction = options.direction ?? luckDirection(yearStem, gender);
  return { direction, startAgeYears: startLuckAge(Math.abs(daysToBoundary), options), pillars: luckPillars(monthPillar, direction, options.count ?? 10), method: 'days-to-boundary-divided-by-3', options };
}
