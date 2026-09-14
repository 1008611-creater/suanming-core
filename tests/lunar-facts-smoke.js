import assert from 'node:assert/strict';
import { lunarMonthFacts, lunarDateFacts, auditFactGraph, createManifest, factGraph, getRuleSet } from '../src/index.js';

const ruleSet = getRuleSet();
const facts = lunarMonthFacts(2025, { ruleSet });

// 按公历年窗口统计：2025 年有闰六月，年内共 12 个农历月，其中 1 个闰月。
// （农历年本身有 13 个月，但第 13 个月落在 2026 年 1 月，不属于 2025 年窗口。）
const months = facts.filter(f => f.fact_id.startsWith('lunar.month.'));
const leaps = facts.filter(f => f.fact_id.startsWith('lunar.leap.'));
assert.equal(months.length, 12);
assert.equal(new Set(months.map(f => f.value.monthNumber + (f.value.leap ? 'L' : ''))).size, 12);
assert.equal(leaps.length, 1);
assert.equal(leaps[0].rule_id, 'lunar.leap.no-zhongqi');
assert.equal(leaps[0].value.monthNumber, 6);

// 每条农历事实都必须指向已登记规则，并通过事实图审计。
const graph = factGraph(facts, createManifest());
assert.deepEqual(auditFactGraph(graph).errors, []);
for (const f of facts) {
  assert.ok(f.rule_label, f.fact_id + ' must carry its rule label');
  assert.equal(f.evidence, 'convention');
}

// 单个日期的农历结论也要带溯源。
const one = lunarDateFacts(2023, 3, 22, { ruleSet });
assert.equal(one.length, 1);
assert.equal(one[0].value.leap, true);
assert.equal(one[0].value.monthNumber, 2);

console.log('lunar facts smoke passed');
