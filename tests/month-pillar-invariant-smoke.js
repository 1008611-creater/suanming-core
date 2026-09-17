import assert from 'node:assert/strict';
import { castBazi, monthPillar, STEMS, BRANCHES } from '../src/index.js';

/**
 * 月柱天干全表不变式（回归测试）
 * ---------------------------------------------------------------------------
 * 五虎遁把年干映射到寅月月干，之后每过一个「节」月干前进一位。
 * 这里不查表对答案，而是直接验证不变式本身：任意一年、任意一个节气月，
 * 月干都必须等于「寅月月干 + 距寅月的月数」，且该月地支必须与黄经一致。
 *
 * 这条测试的存在理由：旧实现用地支序号减二当地支偏移，子月与丑月会绕回地支环
 * 另一侧，月干少进两位（甲年子月错成甲子，正确为丙子）。该错误只在 11 月到次年 1 月
 * 出现，抽查固定日期很容易漏掉，因此必须按整圈黄经逐月验证。
 */

// 年干 -> 寅月月干（甲己丙作首、乙庚戊为头、丙辛寻庚起、丁壬壬位流、戊癸甲寅求）
const YIN_MONTH_STEM = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

// 十二个「节」对应的太阳视黄经：立春 315°，此后每 30° 一个节。
const JIE = [
  { lon: 315, branch: '寅' }, { lon: 345, branch: '卯' }, { lon: 15, branch: '辰' },
  { lon: 45, branch: '巳' }, { lon: 75, branch: '午' }, { lon: 105, branch: '未' },
  { lon: 135, branch: '申' }, { lon: 165, branch: '酉' }, { lon: 195, branch: '戌' },
  { lon: 225, branch: '亥' }, { lon: 255, branch: '子' }, { lon: 285, branch: '丑' }
];

let checked = 0;
for (const yearStem of STEMS) {
  for (let i = 0; i < JIE.length; i++) {
    const { lon, branch } = JIE[i];
    const expectedStem = STEMS[(STEMS.indexOf(YIN_MONTH_STEM[yearStem]) + i) % 10];
    const actual = monthPillar(yearStem, lon);
    assert.equal(actual, expectedStem + branch, yearStem + '年 ' + lon + '° 应为 ' + expectedStem + branch + '，实得 ' + actual);
    checked++;
  }
}

// 年柱进位：子月、丑月虽在公历 12 月与 1 月，月干仍必须由**本年**年干推出，
// 不能因为跨了公历年而少进两位。用真实盘交叉验证 1990-01-01（己巳年丙子月）。
const winter = castBazi({ year: 1990, month: 1, day: 1, hour: 12, minute: 0, longitude: 120 });
assert.equal(winter.pillars.year, '己巳');
assert.equal(winter.pillars.month, '丙子', '1990-01-01 应为丙子月（己巳年子月），实得 ' + winter.pillars.month);

// 年末丑月同理：2024-12-31 属甲辰年丙子月。
const yearEnd = castBazi({ year: 2024, month: 12, day: 31, hour: 12, minute: 0, longitude: 120 });
assert.equal(yearEnd.pillars.month, '丙子', '2024-12-31 应为丙子月（甲辰年子月），实得 ' + yearEnd.pillars.month);

// 立春前后仍是同一个「丑月」，但年干已换 —— 月干随之改变，这是正确行为。
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 16, minute: 0, longitude: 120 }).pillars.month, '乙丑');
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, longitude: 120 }).pillars.month, '丙寅');

console.log('month pillar invariant passed', checked + ' 个月干全表核对');
