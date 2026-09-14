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
const listed = listRuleSets();
assert.equal(listed.length, 1);
assert.equal(listed[0].id, DEFAULT_BAZI_RULE_SET);
assert.match(listed[0].hash, /^[0-9a-f]{16}$/);

console.log('rule set smoke passed', audit.ruleCount + ' rules / ' + audit.sourceCount + ' sources');
