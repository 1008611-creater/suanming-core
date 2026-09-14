import assert from 'node:assert/strict';
import {
  compareSchools, listRuleSets, getRuleSet, ruleIndex, validateTraceability,
  DEFAULT_BAZI_RULE_SET, auditRuleSet
} from '../src/index.js';

const input = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };

// 至少要有两套**同盘系**规则集，否则「流派可并列」这条设计原则无法被验证。
// 注意按盘系过滤：紫微规则集是另一个盘系，不能被拿去跑 castBazi，也不参与四柱流派并列。
const listed = listRuleSets();
const baziListed = listRuleSets({ system: 'bazi' });
assert.ok(baziListed.length >= 2, 'need at least two bazi rule sets to compare, got ' + baziListed.length);
assert.ok(listed.length > baziListed.length, 'registry must also contain the ziwei rule set');
for (const entry of listed) assert.ok(entry.system, entry.id + ' must declare its chart system');

const result = compareSchools(input);

// 每个流派各自带自己的规则指纹与清单，不是合并成一份。
assert.equal(result.schools.length, baziListed.length);
for (const school of result.schools) {
  assert.match(school.ruleSetHash, /^[0-9a-f]{16}$/, school.ruleSetId + ' must carry its own hash');
  assert.equal(school.manifest.ruleSet, school.ruleSetId);
  assert.equal(school.manifest.ruleSetHash, school.ruleSetHash);
  // 每个流派的事实图必须独立通过溯源校验。
  assert.deepEqual(validateTraceability(school.chart), { valid: true, errors: [] }, school.ruleSetId + ' facts must be traceable');
}

// 指纹必须彼此不同：两套规则集若指纹相同，说明它们其实是一套。
const hashes = new Set(result.schools.map(s => s.ruleSetHash));
assert.equal(hashes.size, result.schools.length, 'each rule set must have a distinct fingerprint');

// 分歧必须可枚举，且每条分歧都带上两侧各自的 ruleId 与 source。
assert.ok(result.divergences.length > 0, 'expected at least one divergence');
for (const d of result.divergences) {
  assert.equal(d.values.length, result.schools.length);
  const distinct = new Set(d.values.map(v => JSON.stringify(v.value)));
  assert.ok(distinct.size > 1, d.path + ' is listed as a divergence but all values are equal');
  for (const entry of d.rules) {
    assert.ok(entry.rule, d.path + ' must resolve a rule for ' + entry.ruleSetId);
    assert.ok(Array.isArray(entry.rule.source) && entry.rule.source.length > 0,
      d.path + ' rule for ' + entry.ruleSetId + ' must carry sources');
  }
}

// 一致项与分歧项不得重叠，也不得漏掉任何被对比的字段。
const paths = new Set([...result.agreement, ...result.divergences.map(d => d.path)]);
assert.equal(paths.size, result.fieldOrder.length, 'every compared field must be classified as agreement or divergence');

// 设计红线：结果里不能出现「哪个更准」的裁决字段。
assert.ok(!('answer' in result) && !('winner' in result) && !('recommended' in result));
assert.ok(result.disclaimer.includes('不判定孰是孰非'));

// 子初换日必须真的改变日柱：23:30 出生时两派日柱不同，且时干随之改变（不能日柱换了时干没换）。
const late = compareSchools({ ...input, hour: 23, minute: 30 });
const dayDivergence = late.divergences.find(d => d.path === 'pillars.day');
assert.ok(dayDivergence, '23:30 出生必须暴露日柱分歧');
const byId = Object.fromEntries(late.schools.map(s => [s.ruleSetId, s.chart.pillars]));
assert.notEqual(byId['bazi-core-0.1.0'].day, byId['bazi-zichu-0.1.0'].day);
assert.notEqual(byId['bazi-core-0.1.0'].hour, byId['bazi-zichu-0.1.0'].hour, '日柱换日后时干必须同步换');
// 通用派仍是子正换日：23:30 与同日 08:58 日柱相同。
assert.equal(byId['bazi-core-0.1.0'].day, '戊戌');

// 指定子集对比时，不参与对比的流派不得出现在结果里。
const only = compareSchools(input, { ruleSetIds: [DEFAULT_BAZI_RULE_SET, 'bazi-zichu-0.1.0'] });
assert.deepEqual(only.schools.map(s => s.ruleSetId), [DEFAULT_BAZI_RULE_SET, 'bazi-zichu-0.1.0']);

// 少于两套规则集时直接报错，而不是悄悄返回单流派结果冒充对比。
assert.throws(() => compareSchools(input, { ruleSetIds: [DEFAULT_BAZI_RULE_SET] }), /at least two/);
assert.throws(() => compareSchools(input, { ruleSetIds: [DEFAULT_BAZI_RULE_SET, DEFAULT_BAZI_RULE_SET] }), /duplicate/);

console.log('multi school smoke passed', result.schools.length + ' schools, ' + result.divergences.length + ' divergences');
