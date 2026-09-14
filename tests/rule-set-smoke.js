import assert from 'node:assert/strict';
import { getRuleSet, listRuleSets, ruleEntries, auditRuleSet, DEFAULT_BAZI_RULE_SET } from '../src/index.js';

const ruleSet = getRuleSet();
const audit = auditRuleSet(ruleSet);

// 规则集必须自洽：每条规则都有 ruleId、说明、置信度与已登记的出处。
assert.deepEqual(audit.errors, [], 'rule set audit must be clean');
assert.ok(audit.ruleCount >= 9, 'expected at least 9 ruleId entries, got ' + audit.ruleCount);
assert.ok(audit.sourceCount >= 5, 'expected at least 5 registered sources');

// ruleId 不得重复。
const ids = ruleEntries(ruleSet).map(r => r.ruleId);
assert.equal(new Set(ids).size, ids.length, 'ruleId must be unique');

// 证据类别必须分类，天文可验证与传统约定不得混为一谈。
const evidences = new Set(ruleEntries(ruleSet).map(r => r.evidence));
assert.ok(evidences.has('astronomical'));
assert.ok(evidences.has('traditional'));

// 注册表必须可枚举，且指纹为 16 位十六进制。
// 数量不写死：新增流派是常规操作，写死会让「加一个流派」变成改测试。
const listed = listRuleSets();
assert.ok(listed.length >= 1, 'registry must not be empty');
for (const entry of listed) {
  assert.match(entry.hash, /^[0-9a-f]{16}$/, entry.id + ' hash must be 16 hex chars');
  assert.ok(entry.ruleCount > 0, entry.id + ' must expose ruleCount');
  assert.ok(entry.engineCompatibility, entry.id + ' must declare engineCompatibility');
}
const defaultEntry = listed.find(r => r.id === DEFAULT_BAZI_RULE_SET);
assert.ok(defaultEntry, 'default rule set must stay registered');

// 每一套已登记的规则集都必须自洽，不能只有默认集被审计。
for (const entry of listed) {
  const auditOne = auditRuleSet(getRuleSet(entry.id));
  assert.deepEqual(auditOne.errors, [], entry.id + ' must pass audit');
}

console.log('rule set smoke passed', audit.ruleCount + ' rules / ' + audit.sourceCount + ' sources');
