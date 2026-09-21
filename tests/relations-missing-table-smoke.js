/**
 * 地支关系「缺表即整组跳过」反例测试
 * ---------------------------------------------------------------------------
 * docs/rule-sets.md 的硬规则：新增能力对旧规则集必须透明 ——
 * 规则集缺少某张表时，该组必须整体跳过并显式登记，绝不回退到代码内嵌的默认值。
 *
 * 这条规则最容易在实现里被破坏：只要有人写一行「表不存在就用内置表」，
 * 所有旧规则集都会静默获得新能力，而 manifest 与事实图却仍然声称
 * 「这份结果只依据该规则集」—— 结果是无法审计的口径漂移。
 *
 * 因此这里用**合成规则集**（不是仓库里任何一套真实规则集）做反例：
 * 逐张删除表格，断言该组进 skipped、不产出事实、且不影响其它组。
 */
import assert from 'node:assert/strict';
import { deriveRelations, getRuleSet, RELATION_GROUPS, castBazi } from '../src/index.js';

const base = getRuleSet();
const pillars = { year: '甲子', month: '丙午', day: '戊寅', hour: '庚申' };

/** 造一份「删掉指定表格」的规则集；不改动已登记的规则集对象。 */
function without(...keys) {
  const tables = { ...base.tables };
  for (const key of keys) delete tables[key];
  return { ...base, tables };
}

const TABLE_KEY = {
  clash: 'branchClashRule',
  combine: 'branchCombineRule',
  trine: 'branchTrineRule',
  punishment: 'branchPunishmentRule',
  harm: 'branchHarmRule',
  void: 'xunVoidRule'
};

/* ---------- 1. 全表齐全时不得跳过任何一组 ---------- */
{
  const full = deriveRelations(pillars, base);
  assert.deepEqual(full.skipped, [], '默认规则集不得跳过任何分组');
  assert.equal(Object.keys(full.groups).length, RELATION_GROUPS.length);
}

/* ---------- 2. 逐组删表：该组必须整体跳过 ---------- */
for (const group of RELATION_GROUPS) {
  const key = TABLE_KEY[group];
  const partial = deriveRelations(pillars, without(key));
  assert.deepEqual(partial.skipped, [group], '删除 ' + key + ' 后只有 ' + group + ' 应被跳过');
  assert.equal(partial.groups[group], undefined, group + ' 缺表时不得出现在 groups 里');
  // 关键反例：缺表不能变成「命中为空」——「没检查」与「检查了没命中」是两件事。
  const others = RELATION_GROUPS.filter(function (g) { return g !== group; });
  assert.deepEqual(Object.keys(partial.groups), others, '其余分组必须照常产出');
}

/* ---------- 3. 缺空亡表时不得回退到内置旬空表 ---------- */
{
  const noVoid = deriveRelations(pillars, without('xunVoidRule'));
  assert.equal(noVoid.xun, null, '缺空亡表时不得凭空给出旬与空亡支');
  assert.equal(noVoid.hits.some(function (h) { return h.kind === 'void'; }), false,
    '缺空亡表时不得产出空亡命中');
}

/* ---------- 4. 缺表时事实图必须同步缺事实，不能只缺结构 ---------- */
{
  // castBazi 接受外部 ruleSet；用它验证「结构缺 → 事实也缺」这条链是连通的。
  const chart = castBazi(
    { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 120, gender: 'male' },
    { ruleSet: without('branchHarmRule') }
  );
  assert.equal(chart.relations.skipped.includes('harm'), true, '缺表的分组必须登记在 skipped');
  const ids = chart.facts.facts.map(function (f) { return f.fact_id; });
  assert.equal(ids.includes('relations.harm'), false, '缺表时不得生成 relations.harm 事实');
  assert.equal(ids.includes('relations.clash'), true, '未缺表的分组事实必须照常生成');
}

/* ---------- 5. 缺表不影响其它组的结果值 ---------- */
{
  const full = deriveRelations(pillars, base);
  const partial = deriveRelations(pillars, without('xunVoidRule', 'branchTrineRule'));
  const same = function (kind) {
    return JSON.stringify(full.hits.filter(function (h) { return h.kind === kind; }))
      === JSON.stringify(partial.hits.filter(function (h) { return h.kind === kind; }));
  };
  assert.ok(same('clash'), '删除无关表后冲的结果必须逐字不变');
  assert.ok(same('harm'), '删除无关表后害的结果必须逐字不变');
  assert.deepEqual(partial.skipped, ['trine', 'void'], '跳过顺序按分组固定顺序登记');
}

console.log('relations missing-table smoke passed (' + RELATION_GROUPS.length + ' groups checked)');
