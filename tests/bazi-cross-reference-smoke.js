/**
 * 四柱跨实现交叉验证（10 张参照盘）
 * ---------------------------------------------------------------------------
 * 参照结果由 6tail/lunar-javascript v1.7.7（MIT License）生成，
 * 覆盖 1950–2028 年、不同节气月与不同时辰，含跨年、跨月边界附近的样本。
 *
 * 为什么需要这一层（对应产品规格成功标准第 4 条）：
 *   黄金样本只钉住少数几张盘，能发现「算错」，但发现不了「整体口径偏移」
 *   —— 比如节气月界的偏移量、五虎遁的起点、闰月与跨年处理。
 *   本工程与参照实现独立编写，两者在 10 张盘上逐柱一致，
 *   说明四柱不是「自己跟自己一致」，而是与外部实现也对得上。
 *
 * 口径对齐说明（不比较这些差异，故不构成失败）：
 *   1. 参照实现按钟表时间排盘，不做真太阳时修正。本测试因此显式传
 *      longitude: 120 且 equationOfTimeMinutes: 0，把经度差与均时差同时归零，
 *      与参照实现处在同一口径上；真太阳时本身的正确性由 true-solar-time-smoke.js 覆盖。
 *   2. 日界两派并存：参照实现取子初换日，本测试用默认的通用派（子正换日）。
 *      为避免把流派分歧误报成算错，样本全部避开 23:00–24:00 的跨日子时。
 *   3. 参照实现不做真太阳时，故其「时」柱对应钟表时辰；
 *      本测试同样在归零口径下比较，两者一致。
 *
 * 一致率必须为 100%：任何一张盘不一致都说明四柱层出现了系统性偏移。
 */
import assert from 'node:assert/strict';
import { castBazi, validateChart, validateTraceability } from '../src/index.js';

const REFERENCE_LIBRARY = '6tail/lunar-javascript v1.7.7 (MIT)';

const CASES = [
  { year: 1950, month: 6, day: 15, hour: 10, minute: 30, expect: ['庚寅', '壬午', '辛巳', '癸巳'] },
  { year: 1962, month: 2, day: 20, hour: 14, minute: 0, expect: ['壬寅', '壬寅', '己丑', '辛未'] },
  { year: 1971, month: 9, day: 8, hour: 6, minute: 15, expect: ['辛亥', '丙申', '丙申', '辛卯'] },
  { year: 1983, month: 11, day: 3, hour: 20, minute: 45, expect: ['癸亥', '壬戌', '乙未', '丙戌'] },
  { year: 1990, month: 1, day: 1, hour: 12, minute: 0, expect: ['己巳', '丙子', '丙寅', '甲午'] },
  { year: 1997, month: 4, day: 25, hour: 3, minute: 20, expect: ['丁丑', '甲辰', '丁酉', '壬寅'] },
  { year: 2005, month: 7, day: 13, hour: 8, minute: 58, expect: ['乙酉', '癸未', '戊戌', '丙辰'] },
  { year: 2011, month: 12, day: 24, hour: 17, minute: 10, expect: ['辛卯', '庚子', '癸丑', '辛酉'] },
  { year: 2019, month: 8, day: 9, hour: 22, minute: 5, expect: ['己亥', '壬申', '戊寅', '癸亥'] },
  { year: 2028, month: 5, day: 30, hour: 11, minute: 40, expect: ['戊申', '丁巳', '乙卯', '壬午'] }
];

// 参照盘覆盖的时辰必须避开跨日子时，否则两派日界口径会把分歧误报成算错。
for (const c of CASES) {
  assert.ok(c.hour !== 23, c.year + ' 样本不得落在 23 时（跨日子时），避免流派日界分歧干扰交叉验证');
}

const PILLAR_KEYS = ['year', 'month', 'day', 'hour'];
let matchedPillars = 0;
let matchedCharts = 0;

for (const c of CASES) {
  const label = c.year + '-' + c.month + '-' + c.day + ' ' + c.hour + ':' + c.minute;
  const chart = castBazi(
    { year: c.year, month: c.month, day: c.day, hour: c.hour, minute: c.minute, longitude: 120, gender: 'male' },
    // 与参照实现同口径：归零经度差与均时差，按钟表时间排盘。
    { equationOfTimeMinutes: 0 }
  );

  const actual = PILLAR_KEYS.map(function (key) { return chart.pillars[key]; });
  actual.forEach(function (value, i) {
    assert.equal(value, c.expect[i], label + ' ' + PILLAR_KEYS[i] + ' 柱与参照实现不一致');
    matchedPillars += 1;
  });
  matchedCharts += 1;

  // 交叉验证通过还不够：盘本身必须自洽且可溯源，否则「一致」只是两份错法相同。
  assert.deepEqual(validateChart(chart), { valid: true, errors: [] }, label + ' 结构校验');
  assert.deepEqual(validateTraceability(chart), { valid: true, errors: [] }, label + ' 溯源校验');
}

assert.equal(CASES.length, 10, '参照盘必须为 10 张（产品规格成功标准第 4 条）');
assert.equal(matchedCharts, 10, '每张参照盘都必须完成比对');
assert.equal(matchedPillars, 40, '每张盘四柱都要逐柱比对');

console.log('bazi cross-reference smoke passed ' + matchedCharts + ' 张参照盘 / ' +
  matchedPillars + ' 柱逐柱一致（参照：' + REFERENCE_LIBRARY + '）');
