/**
 * 紫微斗数边界与确定性测试
 * ---------------------------------------------------------------------------
 * 覆盖三类最容易出错的边界：
 *   1. 早晚子时：23:00 后出生者，农历日数进一日（起紫微用），但命身宫仍按子位。
 *   2. 闰月切分：闰月十六日起按下月起宫，前十五日仍作本月。
 *   3. 真太阳时：经度修正跨时辰时，时辰索引必须跟着变。
 * 外加确定性与事实溯源：同输入同输出、每条事实都能在规则集里找到出处。
 */
import assert from 'node:assert/strict';
import {
  castZiwei, hashInput, hashFacts, stableStringify, getRuleSet, ruleIndex,
  DEFAULT_ZIWEI_RULE_SET, listRuleSets, validateZiweiChart, validateTraceability, auditRuleSet, auditFactGraph
} from '../src/index.js';

const BASE = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };

// 确定性与事实溯源。
const a = castZiwei(BASE), b = castZiwei(BASE);
assert.equal(hashFacts(a.facts), hashFacts(b.facts), '同输入必须同事实图');
assert.equal(a.manifest.ruleSetHash, b.manifest.ruleSetHash, '同输入必须同规则指纹');
assert.deepEqual(a.palaces.map((p) => p.name), b.palaces.map((p) => p.name), '同输入必须同宫位');
assert.equal(stableStringify({ b: 1, a: 2 }), stableStringify({ a: 2, b: 1 }), '键顺序不得影响指纹');
assert.notEqual(hashInput(BASE), hashInput({ ...BASE, minute: 59 }), '不同输入必须不同指纹');

const index = ruleIndex(getRuleSet(DEFAULT_ZIWEI_RULE_SET));
for (const fact of a.facts.facts) {
  const rule = index.get(fact.rule_id);
  assert.ok(rule, 'fact ' + fact.fact_id + ' 必须指向已登记的规则');
  assert.ok(fact.source.length > 0, fact.fact_id + ' 必须带出处');
  assert.ok(fact.confidence <= rule.confidence + 1e-9, fact.fact_id + ' 置信度不得超过规则本身');
}

// 事实图必须覆盖全部关键结论，否则解读层会「无据可引」。
// 0.5.0 起杂曜、命主身主、四组十二神也必须有事实：解读层引用了却查不到出处，就是无据可引。
const requiredFacts = [
  'ziwei.year', 'ziwei.time-index', 'ziwei.month-index', 'ziwei.soul-body', 'ziwei.five-elements',
  'ziwei.palace-names', 'ziwei.ziwei-position', 'ziwei.major-stars', 'ziwei.mutagen', 'ziwei.decadal-direction',
  'ziwei.yearMinorRule', 'ziwei.monthMinorRule', 'ziwei.dayMinorRule', 'ziwei.hourMinorRule', 'ziwei.hongluanTianxiRule',
  'ziwei.soul-body-master', 'ziwei.changsheng12', 'ziwei.boshi12', 'ziwei.jiangqian12', 'ziwei.suiqian12'
];
for (const id of requiredFacts) assert.ok(a.facts.facts.some((f) => f.fact_id === id), 'missing fact: ' + id);

// 篡改事实必须被溯源校验抓到。
const tampered = JSON.parse(JSON.stringify(a));
tampered.facts.facts[0].rule_id = 'ziwei.nonexistent';
assert.equal(validateTraceability(tampered).valid, false, '伪造 rule_id 必须被拒');
assert.equal(validateZiweiChart({ ...a, palaces: a.palaces.slice(0, 11) }).valid, false, '缺宫的盘必须被拒');

// 早子时（00:30）与晚子时（23:30）：命宫地支相同，但起紫微用的日数不同。
const earlyZi = castZiwei({ ...BASE, hour: 0, minute: 30 });
const lateZi = castZiwei({ ...BASE, hour: 23, minute: 30 });
assert.equal(earlyZi.time.timeIndex, 0, '00:30 是早子（索引 0）');
assert.equal(lateZi.time.timeIndex, 12, '23:30 是晚子（索引 12）');
assert.equal(earlyZi.time.hourBranch, '子');
assert.equal(lateZi.time.hourBranch, '子', '晚子取地支时归子');
assert.equal(earlyZi.soul.branch, lateZi.soul.branch, '早晚子时命宫相同（命身宫按生时地支）');
const earlyDay = earlyZi.facts.facts.find((f) => f.fact_id === 'ziwei.late-zi-day').value;
const lateDay = lateZi.facts.facts.find((f) => f.fact_id === 'ziwei.late-zi-day').value;
assert.equal(lateDay, earlyDay + 1, '晚子时起紫微日数进一日');
assert.notEqual(earlyZi.facts.facts.find((f) => f.fact_id === 'ziwei.ziwei-position').value.ziwei,
  lateZi.facts.facts.find((f) => f.fact_id === 'ziwei.ziwei-position').value.ziwei,
  '晚子进日必须改变紫微星位置');

// 闰月切分：2023 闰二月十五仍作二月，十六起作三月。
const leap15 = castZiwei({ ...BASE, year: 2023, month: 4, day: 5 });
const leap16 = castZiwei({ ...BASE, year: 2023, month: 4, day: 6 });
assert.equal(leap15.lunar.leap, true, '2023-04-05 是闰二月');
assert.equal(leap15.lunar.monthNumber, 2);
assert.equal(leap15.lunar.day, 15, '闰二月十五');
assert.equal(leap15.lunar.monthIndex, 1, '闰月十五仍作本月起宫');
assert.equal(leap16.lunar.day, 16, '闰二月十六');
assert.equal(leap16.lunar.monthIndex, 2, '闰月十六起按下月起宫');

// 真太阳时：同一钟表时刻，经度不同则时辰可能不同 —— 时柱与紫微都必须跟随。
// 样本刻意避开时辰分界（09:30 离巳时两端各 30 分钟），这样断言的是经度修正本身，
// 不会因为均时差的季节变化而变得脆弱。
const east = castZiwei({ ...BASE, hour: 9, minute: 30, longitude: 120 });
const west = castZiwei({ ...BASE, hour: 9, minute: 30, longitude: 75 });
assert.equal(east.time.timeIndex, 5, '东经 120° 的 09:30 是巳时');
assert.equal(west.time.timeIndex, 3, '东经 75° 同刻是卯时');
assert.notEqual(west.time.timeIndex, east.time.timeIndex, '西经修正后时辰必须不同');

// 均时差必须参与真太阳时，而不是只做经度修正。
// 2005-07-13 的均时差约 −5.7 分钟，正好把 09:05 从巳时压回辰时。
// 若有人把均时差改回默认 0，这条断言会立刻失败。
const eotCase = castZiwei({ ...BASE, hour: 9, minute: 5, longitude: 120 });
assert.equal(eotCase.time.shichen.equationOfTimeMinutes.toFixed(1), '-5.7', '均时差必须被计算');
assert.equal(eotCase.time.timeIndex, 4, '计入均时差后 09:05 应为辰时');
assert.equal(eotCase.time.trueSolarMinutes.toFixed(1), '539.3', '真太阳时 = 平太阳时 + 经度修正 + 均时差');

// 规则集自洽。
assert.deepEqual(auditRuleSet(getRuleSet(DEFAULT_ZIWEI_RULE_SET)).errors, [], '紫微规则集必须通过审计');
assert.deepEqual(auditFactGraph(a.facts).errors, [], '事实图审计必须通过');

console.log('ziwei boundary smoke passed 早晚子时 / 闰月切分 / 真太阳时 / 确定性');
