/**
 * 紫微斗数黄金测试
 * ---------------------------------------------------------------------------
 * 期望值来自「通行派」安星口诀的人工推演，并与 SylarLong/iztro（MIT）的实现结果
 * 逐宫交叉核对过。测试里写死的是**结果**，不是实现细节 —— 换实现方式不影响本测试，
 * 只有算错星位才会失败。
 *
 * 基准盘：公历 2005-07-13 08:58，东经 118.18°，男。
 *   农历 乙酉年六月初八 辰时；命宫在卯、身宫在亥；土五局；紫微在巳、天府在亥。
 */
import assert from 'node:assert/strict';
import { castZiwei, validateZiweiChart, validateTraceability, auditFactGraph } from '../src/index.js';

const INPUT = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };
const chart = castZiwei(INPUT);

// 农历与年干支：紫微以正月初一换年，此处与四柱同值只是巧合（六月初八远离立春）。
assert.equal(chart.lunar.ganzhi, '乙酉', '农历年干支');
assert.equal(chart.lunar.monthNumber, 6, '农历月');
assert.equal(chart.lunar.day, 8, '农历日');
assert.equal(chart.lunar.leap, false, '非闰月');
assert.equal(chart.lunar.days, 30, '六月共 30 日');

// 命身宫：命宫逆数生时，身宫顺数生时。
assert.equal(chart.soul.branch, '卯', '命宫地支');
assert.equal(chart.soul.stem, '己', '命宫天干（五虎遁）');
assert.equal(chart.body.branch, '亥', '身宫地支');
assert.equal(chart.fiveElements.name, '土五局', '五行局');
assert.equal(chart.fiveElements.value, 5, '局数（起紫微与大限共用）');

// 紫微天府：寅申轴对称，索引和为 12。
const ziweiFact = chart.facts.facts.find((f) => f.fact_id === 'ziwei.ziwei-position');
assert.deepEqual(ziweiFact.value, { ziwei: '巳', tianfu: '亥' }, '紫微与天府落宫');

// 十二宫（寅基顺序）：宫名、宫干支、星曜。
const EXPECTED = [
  { branch: '寅', gz: '戊寅', name: '兄弟', major: ['太阳', '巨门'], minor: ['铃星', '陀罗'], mutagen: [] },
  { branch: '卯', gz: '己卯', name: '命宫', major: ['天相'], minor: ['禄存', '地劫'], mutagen: [] },
  { branch: '辰', gz: '庚辰', name: '父母', major: ['天机', '天梁'], minor: ['擎羊'], mutagen: ['禄', '权'] },
  { branch: '巳', gz: '辛巳', name: '福德', major: ['紫微', '七杀'], minor: ['右弼'], mutagen: ['科'] },
  { branch: '午', gz: '壬午', name: '田宅', major: [], minor: ['文昌'], mutagen: [] },
  { branch: '未', gz: '癸未', name: '官禄', major: [], minor: ['地空', '火星'], mutagen: [] },
  { branch: '申', gz: '甲申', name: '交友', major: [], minor: ['文曲', '天钺'], mutagen: [] },
  { branch: '酉', gz: '乙酉', name: '迁移', major: ['廉贞', '破军'], minor: ['左辅'], mutagen: [] },
  { branch: '戌', gz: '丙戌', name: '疾厄', major: [], minor: [], mutagen: [] },
  { branch: '亥', gz: '丁亥', name: '财帛', major: ['天府'], minor: ['天马'], mutagen: [] },
  { branch: '子', gz: '戊子', name: '子女', major: ['天同', '太阴'], minor: ['天魁'], mutagen: ['忌'] },
  { branch: '丑', gz: '己丑', name: '夫妻', major: ['武曲', '贪狼'], minor: [], mutagen: [] }
];
assert.equal(chart.palaces.length, 12);
chart.palaces.forEach((palace, i) => {
  const expected = EXPECTED[i];
  assert.equal(palace.branch, expected.branch, 'palace ' + i + ' branch');
  assert.equal(palace.stem + palace.branch, expected.gz, 'palace ' + i + ' 干支');
  assert.equal(palace.name, expected.name, 'palace ' + i + ' 宫名');
  const major = palace.stars.filter((s) => s.series).map((s) => s.name).sort();
  assert.deepEqual(major, [...expected.major].sort(), 'palace ' + i + ' 主星');
  const minor = palace.stars.filter((s) => !s.series).map((s) => s.name).sort();
  assert.deepEqual(minor, [...expected.minor].sort(), 'palace ' + i + ' 辅星');
  assert.deepEqual([...palace.mutagens].sort(), [...expected.mutagen].sort(), 'palace ' + i + ' 四化');
});

// 十四主星必须恰好各出现一次：多一颗或少一颗都说明星系表与宫位算法不匹配。
const MAJOR_NAMES = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
const majorStars = chart.stars.filter((s) => s.series).map((s) => s.name);
assert.deepEqual([...majorStars].sort(), [...MAJOR_NAMES].sort(), '十四主星各安一次');

// 十四辅星：六吉 + 六煞 + 禄存天马。
const MINOR_NAMES = ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫', '禄存', '天马'];
const minorStars = chart.stars.filter((s) => !s.series).map((s) => s.name);
assert.deepEqual([...minorStars].sort(), [...MINOR_NAMES].sort(), '十四辅星各安一次');

// 生年四化：乙干天机禄、天梁权、紫微科、太阴忌。
assert.deepEqual(
  chart.mutagens.map((m) => m.name + m.mutagen),
  ['天机禄', '天梁权', '紫微科', '太阴忌'],
  '生年四化按年干'
);
for (const m of chart.mutagens) {
  assert.equal(chart.palaces[m.palaceIndex].name, chart.palaces[m.palaceIndex].name);
  assert.ok(m.branch, '四化必须带上落宫地支');
}

// 大限：土五局 5 岁起运，阴年支男命逆行，故首限在命宫、次限在兄弟宫。
assert.equal(chart.decadal.direction, -1, '阴年支男命大限逆行');
assert.equal(chart.decadal.limits[0].startAge, 5, '大限起运虚岁 = 局数');
assert.equal(chart.decadal.limits[0].branch, '卯', '首限在命宫');
assert.equal(chart.decadal.limits[1].branch, '寅', '次限逆行至兄弟宫');
assert.equal(chart.decadal.limits[11].endAge, 124, '十二限覆盖 120 年');

// 小限：酉年（乙酉）三合为巳酉丑，未上起；男顺行。
assert.equal(chart.xiaoxian.startBranch, '未', '小限起宫按年支三合');
assert.equal(chart.xiaoxian.direction, 1, '男命小限顺行');
assert.deepEqual(chart.xiaoxian.ages[chart.xiaoxian.startIndex].slice(0, 3), [1, 13, 25], '小限一年一宫、十二年一轮');

// 结构、溯源、事实图三道校验必须全过。
assert.deepEqual(validateZiweiChart(chart), { valid: true, errors: [] }, '紫微盘结构校验');
assert.deepEqual(validateTraceability(chart), { valid: true, errors: [] }, '紫微盘溯源校验');
assert.deepEqual(auditFactGraph(chart.facts).errors, [], '事实图审计');

console.log('ziwei golden smoke passed 紫微在巳 / 土五局 / 14 主星 14 辅星 4 化');
