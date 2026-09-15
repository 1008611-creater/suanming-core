/**
 * 双盘系共存测试
 * ---------------------------------------------------------------------------
 * 工程从「一套四柱」长成「多盘系平台」，必须证明两件事：
 *   1. 四柱与紫微可以在同一进程里各排各的，互不干扰；
 *   2. 盘系之间不会互相污染 —— 紫微规则集不得被四柱的并列逻辑当成一个流派。
 * 第 2 条是真实缺陷的回归：紫微规则集混进 compareSchools 会直接崩溃，
 * 因为它没有四柱所需的 tables.stems 结构。
 */
import assert from 'node:assert/strict';
import {
  castBazi, castZiwei, compareSchools, listRuleSets, ruleSetIdsOf, systemOf,
  getRuleSet, DEFAULT_BAZI_RULE_SET, DEFAULT_ZIWEI_RULE_SET, validateChart, validateZiweiChart
} from '../src/index.js';

const INPUT = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };

// 两个盘系对同一输入各排一盘。
const bazi = castBazi(INPUT);
const ziwei = castZiwei(INPUT);
assert.deepEqual(validateChart(bazi), { valid: true, errors: [] });
assert.deepEqual(validateZiweiChart(ziwei), { valid: true, errors: [] });
assert.equal(bazi.manifest.ruleSet, DEFAULT_BAZI_RULE_SET);
assert.equal(ziwei.manifest.ruleSet, DEFAULT_ZIWEI_RULE_SET);
assert.notEqual(bazi.manifest.ruleSetHash, ziwei.manifest.ruleSetHash, '两个盘系的规则指纹必须不同');

// 关键：两者对「年」的口径不同，必须各自成篇，不能互相借用。
assert.equal(bazi.pillars.year, '乙酉', '四柱年柱');
assert.equal(ziwei.lunar.ganzhi, '乙酉', '紫微年干支');
// 立春前出生者两者会分歧：四柱已进新年，紫微仍在旧年。
const beforeLichun = { ...INPUT, year: 2005, month: 2, day: 5 };
assert.notEqual(
  castBazi(beforeLichun).pillars.year,
  castZiwei(beforeLichun).lunar.ganzhi,
  '立春与正月初一之间的日期，两盘系年干支必须分歧（这正是它们不能互相换算的原因）'
);

// 注册表按盘系可枚举。
const all = listRuleSets();
const baziOnly = listRuleSets({ system: 'bazi' });
const ziweiOnly = listRuleSets({ system: 'ziwei' });
assert.equal(all.length, baziOnly.length + ziweiOnly.length, '盘系分组必须覆盖全部规则集');
// 紫微已有 0.1.0（主星辅星）与 0.2.0（杂曜十二神）两套：旧版保留是为了证明
// 「换规则集对引擎透明」，新版是默认参照集，故此处按集合比较而不是写死单元素。
const ZIWEI_IDS = ruleSetIdsOf('ziwei');
assert.equal(ziweiOnly.length, ZIWEI_IDS.length, '盘系分组数量与 id 清单一致');
assert.equal(ziweiOnly.length, 2, '紫微当前应有 0.1.0 与 0.2.0 两套规则集');
assert.ok(ZIWEI_IDS.includes(DEFAULT_ZIWEI_RULE_SET), '默认规则集必须在紫微 id 清单内');
assert.ok(ZIWEI_IDS.includes('ziwei-core-0.1.0'), '旧版规则集应保留');
assert.equal(systemOf(getRuleSet(DEFAULT_ZIWEI_RULE_SET)), 'ziwei');
assert.ok(ziweiOnly.every((r) => r.id === 'ziwei-core-0.1.0' || r.id === DEFAULT_ZIWEI_RULE_SET));

// 紫微规则集的分歧清单必须为空（它是自己盘系的参照集），不能把四柱规则报成分歧。
assert.ok(ziweiOnly.every((r) => r.divergences.length === 0), '紫微规则集不得与四柱比较');
assert.ok(baziOnly.find((r) => r.id === 'bazi-zichu-0.1.0').divergences.length > 0, '四柱内部仍应报出真实分歧');

// 多流派并列只覆盖同盘系：紫微不得出现在四柱并列结果里。
const compared = compareSchools(INPUT);
assert.deepEqual(compared.schools.map((s) => s.ruleSetId).sort(), baziOnly.map((r) => r.id).sort());
assert.ok(!compared.schools.some((s) => s.ruleSetId === DEFAULT_ZIWEI_RULE_SET), '紫微规则集不得进入四柱并列');

// 两个盘系的事实图各自可溯源，互不串用规则集。
assert.ok(bazi.facts.facts.every((f) => f.rule_id.startsWith('bazi.')));
assert.ok(ziwei.facts.facts.every((f) => f.rule_id.startsWith('ziwei.')));

console.log('dual system smoke passed 四柱与紫微并列共存，互不污染');
