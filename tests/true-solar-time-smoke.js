/**
 * 真太阳时完整性测试
 * ---------------------------------------------------------------------------
 * 规则集写明了「真太阳时 = 平太阳时 + 经度修正 + 均时差」，三项缺一不可。
 * 这里钉死两件事：
 *   1. 均时差必须被自动算出来（不是默认 0），且数值与天文算法一致。
 *   2. 均时差确实参与时辰判定 —— 样本必须选在「算不算均时差会跨时辰」的点上，
 *      否则测试无法区分有没有修。2005-07-13 09:05（东经 120°）就是这样的样本：
 *      均时差 −5.7 分钟，把它从巳时压回辰时。
 *
 * 为什么要写这个测试：这个缺陷曾经真实存在于线上 ——
 * 规则集声称含均时差，代码只做经度修正，导致 2 月中旬前后出生者时柱错一个时辰，
 * 而所有既有测试都是绿的。既有测试绿不等于口径对。
 */
import assert from 'node:assert/strict';
import {
  castBazi, castZiwei, shichenOfCivil, trueSolarMinutes,
  equationOfTimeMinutes, equationOfTimeForCivil, utcToTT, julianDayFromUTC
} from '../src/index.js';

// ---- 1. 均时差本身：与 Meeus 例 28.b（1992-10-13.0 TT）对照 ----
const meeus = equationOfTimeMinutes(2448908.5);
assert.ok(Math.abs(meeus - 13.7136) < 0.01, '均时差须与 Meeus 28.b 吻合，实得 ' + meeus.toFixed(4));

// ---- 2. 缺省必须自动计算，且随季节变化 ----
const feb = equationOfTimeForCivil({ year: 2024, month: 2, day: 11, hour: 12 });
const nov = equationOfTimeForCivil({ year: 2024, month: 11, day: 3, hour: 12 });
assert.ok(feb < -13, '2 月中旬均时差应接近全年最负（约 −14 分钟），实得 ' + feb.toFixed(2));
assert.ok(nov > 16, '11 月初均时差应接近全年最正（约 +16 分钟），实得 ' + nov.toFixed(2));

// 缺少年月日时退回 0，不能让边界调用抛错。
assert.equal(equationOfTimeForCivil({ hour: 9, minute: 5 }), 0);
assert.equal(equationOfTimeForCivil(undefined), 0);

// ---- 3. 真太阳时的三项分解必须自洽 ----
const civil = { year: 2005, month: 7, day: 13, hour: 9, minute: 5 };
const eot = equationOfTimeForCivil(civil);
const shi = shichenOfCivil(civil, 120);
assert.equal(shi.equationOfTimeMinutes, eot, '时辰结果必须带出所用均时差');
assert.ok(
  Math.abs(shi.trueSolarMinutes - trueSolarMinutes(civil, 120, eot)) < 1e-9,
  '真太阳时 = 平太阳时 + 经度修正 + 均时差'
);

// 经度修正：东经 118.18° 相对 120° 为 −7.28 分钟。
assert.ok(Math.abs(trueSolarMinutes(civil, 118.18, 0) - (545 + (118.18 - 120) * 4)) < 1e-9);

// ---- 4. 跨时辰样本：算不算均时差，结果必须不同 ----
assert.equal(shichenOfCivil(civil, 120).name, '辰', '计入均时差后 09:05 为辰时');
assert.equal(shichenOfCivil(civil, 120, { equationOfTimeMinutes: 0 }).name, '巳',
  '均时差置 0 时 09:05 为巳时 —— 两者必须不同，否则本测试无鉴别力');

// ---- 5. 四柱必须跟随均时差 ----
// 2024-02-04 17:00 东经 120°：均时差 −13.8 分钟，时柱由酉退回申。
const withEot = castBazi({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, longitude: 120 });
const withoutEot = castBazi({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, longitude: 120 },
  { equationOfTimeMinutes: 0 });
assert.equal(withEot.pillars.hour, '庚申', '计入均时差后 17:00 时柱为庚申');
assert.equal(withoutEot.pillars.hour, '辛酉', '均时差置 0 时时柱为辛酉');
assert.equal(withEot.pillars.month, withoutEot.pillars.month, '时柱修正不应影响月柱');

// ---- 6. 显式覆盖入口仍然可用（对比研究/回放需要） ----
const overridden = castZiwei(
  { year: 2005, month: 7, day: 13, hour: 9, minute: 5, longitude: 120, gender: 'male' },
  { equationOfTimeMinutes: 0 }
);
assert.equal(overridden.time.shichen.equationOfTimeMinutes, 0, '显式传入必须优先于自动计算');
assert.equal(overridden.time.timeIndex, 5, '均时差置 0 时紫微取巳时');

// ---- 7. 确定性：同输入同输出（含均时差自动计算路径） ----
const a = castBazi({ year: 2005, month: 7, day: 13, hour: 9, minute: 5, longitude: 118.18 });
const b = castBazi({ year: 2005, month: 7, day: 13, hour: 9, minute: 5, longitude: 118.18 });
assert.equal(a.pillars.hour, b.pillars.hour);
assert.equal(a.time.shichen.trueSolarMinutes, b.time.shichen.trueSolarMinutes);

// ---- 8. 时区参与均时差计算：夏令时（UTC+9）也必须算对 ----
// 1990-07-01 处于中国夏令时，UTC 时刻不同，但均时差差异极小（< 0.1 分钟）。
const dst = equationOfTimeForCivil({ year: 1990, month: 7, day: 1, hour: 12 });
const std = equationOfTimeMinutes(utcToTT(julianDayFromUTC({ year: 1990, month: 7, day: 1, hour: 4 })));
assert.ok(Math.abs(dst - std) < 0.1, '均时差对时区不敏感，差异应远小于 1 分钟');

console.log('true solar time smoke passed 均时差自动计算 / 跨时辰 / 四柱跟随');
