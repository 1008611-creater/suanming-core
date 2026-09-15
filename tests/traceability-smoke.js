import assert from 'node:assert/strict';
import { castBazi, validateChart, validateTraceability, auditFactGraph, getRuleSet, ruleIndex } from '../src/index.js';

const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18,gender:'male'});

// 结构校验与溯源校验都必须通过。
assert.deepEqual(validateChart(chart), {valid:true,errors:[]});
assert.deepEqual(validateTraceability(chart), {valid:true,errors:[]});
assert.deepEqual(auditFactGraph(chart.facts).errors, []);

// 每条事实都必须指向规则集中真实存在的规则，且带出来源与证据类别。
const index = ruleIndex(getRuleSet());
for (const f of chart.facts.facts) {
  const rule = index.get(f.rule_id);
  assert.ok(rule, 'fact ' + f.fact_id + ' must resolve to a rule');
  assert.ok(Array.isArray(f.source) && f.source.length > 0, f.fact_id + ' must carry sources');
  assert.ok(f.confidence <= rule.confidence + 1e-9, f.fact_id + ' confidence must not exceed its rule');
  assert.equal(f.rule_label, rule.label);
}

// 篡改置信度必须被溯源校验抓到。
const tampered = JSON.parse(JSON.stringify(chart));
tampered.facts.facts[0].confidence = 1;
assert.equal(validateTraceability(tampered).valid, false);

// 引用不存在的规则必须被拒绝。
const bogus = JSON.parse(JSON.stringify(chart));
bogus.facts.facts[0].rule_id = 'bazi.nonexistent';
assert.equal(validateTraceability(bogus).valid, false);

console.log('traceability smoke passed', chart.facts.facts.length + ' facts traced');
