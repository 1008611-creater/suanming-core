import assert from 'node:assert/strict';
import { lunarDateOf, numberedLunarMonths, createManifest, factGraph, lunarDateFacts, auditFactGraph } from '../src/index.js';

/**
 * 农历黄金测试。
 * 期望值取自公开发布的农历日期（春节、元宵、端午、中秋、闰月），
 * 覆盖：闰月月序、跨年冬月、朔日换日边界、中气归属。
 */
const cases = [
  { date: [2023, 1, 22], expect: { monthNumber: 1, leap: false, day: 1 }, note: '2023 春节' },
  { date: [2023, 2, 5],  expect: { monthNumber: 1, leap: false, day: 15 }, note: '2023 元宵' },
  { date: [2023, 3, 22], expect: { monthNumber: 2, leap: true, day: 1 }, note: '2023 闰二月初一' },
  { date: [2023, 4, 20], expect: { monthNumber: 3, leap: false, day: 1 }, note: '2023 三月初一' },
  { date: [2023, 6, 22], expect: { monthNumber: 5, leap: false, day: 5 }, note: '2023 端午' },
  { date: [2023, 8, 1],  expect: { monthNumber: 6, leap: false, day: 15 }, note: '2023 六月十五' },
  { date: [2024, 1, 1],  expect: { monthNumber: 11, leap: false, day: 20 }, note: '跨年冬月' },
  { date: [2024, 2, 10], expect: { monthNumber: 1, leap: false, day: 1 }, note: '2024 春节' },
  { date: [2024, 6, 10], expect: { monthNumber: 5, leap: false, day: 5 }, note: '2024 端午' },
  { date: [2024, 9, 17], expect: { monthNumber: 8, leap: false, day: 15 }, note: '2024 中秋' },
  { date: [2025, 1, 29], expect: { monthNumber: 1, leap: false, day: 1 }, note: '2025 春节' },
  { date: [2025, 7, 25], expect: { monthNumber: 6, leap: true, day: 1 }, note: '2025 闰六月初一' },
  { date: [2025, 8, 23], expect: { monthNumber: 7, leap: false, day: 1 }, note: '2025 七月初一' },
  { date: [2025, 10, 6], expect: { monthNumber: 8, leap: false, day: 15 }, note: '2025 中秋' },
  { date: [2026, 2, 17], expect: { monthNumber: 1, leap: false, day: 1 }, note: '2026 春节' },
  { date: [2026, 6, 19], expect: { monthNumber: 5, leap: false, day: 5 }, note: '2026 端午' }
];

for (const { date, expect, note } of cases) {
  const got = lunarDateOf(...date);
  assert.ok(got, note + ': must resolve');
  assert.equal(got.monthNumber, expect.monthNumber, note + ' monthNumber');
  assert.equal(got.leap, expect.leap, note + ' leap');
  assert.equal(got.day, expect.day, note + ' day');
}

// 月份序列必须自洽：无重复编号（闰月除外），闰月紧跟同序月份。
for (const year of [2023, 2024, 2025, 2026]) {
  const months = numberedLunarMonths(year);
  assert.ok(months.length >= 12 && months.length <= 13, year + ' must have 12 or 13 months');
  for (let i = 1; i < months.length; i++) {
    const prev = months[i - 1], cur = months[i];
    if (cur.leap) assert.equal(cur.monthNumber, prev.monthNumber, year + ': leap month must repeat previous number');
    else assert.equal(cur.monthNumber, (prev.monthNumber % 12) + 1, year + ': month number must advance');
    assert.equal(prev.endJd, cur.jd, year + ': months must be contiguous');
  }
  assert.equal(months.filter(m => m.leap).length <= 1, true, year + ': at most one leap month');
}

// 农历结论同样必须可溯源。
const facts = lunarDateFacts(2024, 9, 17);
assert.equal(facts.length, 1);
assert.equal(facts[0].fact_id, 'lunar.date.2024-09-17');
assert.ok(facts[0].rule_id);
assert.ok(facts[0].source.length > 0);
const graph = factGraph(facts, createManifest());
assert.deepEqual(auditFactGraph(graph).errors, []);

console.log('lunar golden smoke passed', cases.length + ' golden dates');
