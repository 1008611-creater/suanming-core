import assert from 'node:assert/strict';
import { castBazi, dayPillar, hourPillar, monthPillar, yearPillar, STEMS, BRANCHES, julianDayFromGregorian } from '../src/index.js';

// ---- 日柱锚点：1900-01-01 为甲戌日（规则 bazi.day.sexagenary-jdn 的校准锚点）----
const anchors = [
  { date: [1900, 1, 1], expect: '甲戌', note: '锚点' },
  { date: [2000, 1, 1], expect: '戊午', note: '公开万年历' },
  { date: [2024, 1, 1], expect: '甲子', note: '公开万年历' },
  { date: [1949, 10, 1], expect: '甲子', note: '公开万年历' }
];
for (const { date, expect, note } of anchors) {
  const jd = julianDayFromGregorian(...date);
  assert.equal(dayPillar(jd), expect, date.join('-') + ' (' + note + ')');
}

// ---- 日柱边界：必须按出生地民用日换日，不能按 UTC 日序 ----
// 2005-07-13 凌晨 02:00（北京）对应 UTC 前一天 18:00，用 UTC 日序会算成前一天。
const earlyMorning = castBazi({ year: 2005, month: 7, day: 13, hour: 2, minute: 0, longitude: 118.18 });
const lateMorning = castBazi({ year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18 });
assert.equal(earlyMorning.pillars.day, '戊戌', '同日凌晨必须与前一日区分开');
assert.equal(lateMorning.pillars.day, '戊戌');
assert.equal(earlyMorning.pillars.day, lateMorning.pillars.day, '同一民用日必须同日柱');

// 前一天则必须不同。
const previousDay = castBazi({ year: 2005, month: 7, day: 12, hour: 23, minute: 0, longitude: 118.18 });
assert.notEqual(previousDay.pillars.day, earlyMorning.pillars.day);

// ---- 时柱：五鼠遁全表 ----
// 甲己日起甲子时，乙庚日起丙子时，丙辛日起戊子时，丁壬日起庚子时，戊癸日起壬子时。
const ziStemByDayStem = { 甲: '甲', 己: '甲', 乙: '丙', 庚: '丙', 丙: '戊', 辛: '戊', 丁: '庚', 壬: '庚', 戊: '壬', 癸: '壬' };
for (const dayStem of STEMS) {
  for (let b = 0; b < 12; b++) {
    const expectedStem = STEMS[(STEMS.indexOf(ziStemByDayStem[dayStem]) + b) % 10];
    assert.equal(hourPillar(dayStem, b), expectedStem + BRANCHES[b], dayStem + '日 ' + BRANCHES[b] + '时');
  }
}
// 具体一例：戊日辰时为丙辰（不是甲辰）。
assert.equal(hourPillar('戊', 4), '丙辰');
assert.equal(castBazi({ year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18 }).pillars.hour, '丙辰');

// ---- 年柱：立春瞬间换年 ----
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 16, minute: 0, longitude: 120 }).pillars.year, '癸卯');
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, longitude: 120 }).pillars.year, '甲辰');

// ---- 月柱：节为界 ----
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 16, minute: 0, longitude: 120 }).pillars.month, '癸丑');
assert.equal(castBazi({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, longitude: 120 }).pillars.month, '丙寅');

// ---- 五虎遁：年干定正月月干 ----
// 甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸何方发，甲寅之上好追求。
const zhengYueStem = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };
// 315° = 立春 = 寅月（正月）；345° = 惊蛰 = 卯月。
for (const stem of STEMS) {
  assert.equal(monthPillar(stem, 315), zhengYueStem[stem] + '寅', stem + '年正月（寅月）');
}
assert.equal(monthPillar('甲', 345), '丁卯', '惊蛰后进入卯月');

console.log('bazi golden smoke passed', anchors.length + ' day anchors, 五鼠遁/五虎遁 full tables');
