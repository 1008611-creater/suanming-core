/**
 * 地支关系派生冒烟测试
 * ---------------------------------------------------------------------------
 * 覆盖六冲、六合、三合与半合、相刑与自刑、六害、空亡的黄金样本，
 * 以及三类最容易写错的边界反例：
 *   1. 半合缺「旺支」：申辰只作拱，不得产出半合。
 *   2. 自刑落在同一柱：同一柱只有一个地支，不构成自刑。
 *   3. 跨旬空亡：日柱换旬后，空亡支随之改变，不能沿用上一旬的表。
 * 另断言纯确定性：同输入两次派生结果完全一致。
 */
import assert from 'node:assert/strict';
import { deriveRelations, relationHits, getRuleSet, castBazi, RELATION_GROUPS } from '../src/index.js';

const ruleSet = getRuleSet();

/** 取命中清单的简要描述，便于比对。 */
function shape(relations) {
  return relations.hits.map(function (h) {
    return h.kind + ':' + h.branches.join('') + '@' + h.positions.join('-') + (h.complete ? '' : '(缺)');
  });
}
function kindsOf(relations, kind) {
  return relationHits(relations, { kinds: kind });
}

/* ---------- 1. 六冲 ---------- */
{
  const r = deriveRelations({ year: '甲子', month: '丙午', day: '丁卯', hour: '辛酉' }, ruleSet);
  const clash = kindsOf(r, 'clash');
  const ziWu = clash.filter(function (h) { return h.name === '子午'; });
  assert.equal(ziWu.length, 1, '子午必须判为冲');
  assert.deepEqual(ziWu[0].positions, ['year', 'month']);
  assert.deepEqual(ziWu[0].branches, ['子', '午']);
  assert.equal(ziWu[0].complete, true);
  assert.equal(kindsOf(r, 'half-trine').length, 0, '本样本不含三合任意两支，不得产出半合');
}

/* ---------- 2. 六合 ---------- */
{
  const r = deriveRelations({ year: '乙丑', month: '甲子', day: '丙寅', hour: '丁酉' }, ruleSet);
  const combine = kindsOf(r, 'combine');
  assert.equal(combine.length, 1, '子丑必须判为六合');
  assert.deepEqual(combine[0].positions, ['year', 'month']);
  assert.equal(combine[0].element, '土', '子丑合土，五行由规则表给出');
  // 同一组地支不得被同时判为冲与合。
  assert.equal(kindsOf(r, 'clash').length, 0);
}

/* ---------- 3. 三合全与半合 ---------- */
{
  const full = deriveRelations({ year: '壬申', month: '丙子', day: '戊辰', hour: '庚午' }, ruleSet);
  const trine = kindsOf(full, 'trine');
  assert.equal(trine.length, 1, '申子辰三支全见必须判为三合');
  assert.deepEqual(trine[0].branches, ['申', '子', '辰']);
  assert.equal(trine[0].element, '水');
  assert.equal(trine[0].complete, true);
  assert.equal(kindsOf(full, 'half-trine').length, 0, '三合全见时不再另出半合');

  // 生+旺（申子）为半合。
  const birthPeak = deriveRelations({ year: '壬申', month: '丙子', day: '戊寅', hour: '乙丑' }, ruleSet);
  const bp = kindsOf(birthPeak, 'half-trine');
  assert.equal(bp.length, 1, '申子必须判为半合');
  assert.deepEqual(bp[0].branches, ['申', '子']);
  assert.equal(bp[0].complete, false, '半合不是三合，complete 必须为 false');

  // 旺+墓（子辰）为半合。
  const peakTomb = deriveRelations({ year: '丙子', month: '戊辰', day: '庚午', hour: '辛巳' }, ruleSet);
  const pt = kindsOf(peakTomb, 'half-trine');
  assert.equal(pt.length, 1, '子辰必须判为半合');
  assert.deepEqual(pt[0].branches, ['子', '辰']);

  // 生+墓（申辰、巳丑）只作拱 —— 本实现不产出半合。
  const arch = deriveRelations({ year: '壬申', month: '戊辰', day: '丁巳', hour: '辛丑' }, ruleSet);
  assert.equal(kindsOf(arch, 'half-trine').length, 0, '申辰缺旺支，只作拱，不得判为半合');
  assert.equal(kindsOf(arch, 'trine').length, 0);
}

/* ---------- 4. 相刑与自刑 ---------- */
{
  const triad = deriveRelations({ year: '甲寅', month: '丁巳', day: '庚申', hour: '丙子' }, ruleSet);
  const full = kindsOf(triad, 'punishment').filter(function (h) { return h.name === '寅巳申三刑'; });
  assert.equal(full.length, 1, '寅巳申三支全见为一条完整三刑');
  assert.equal(full[0].complete, true);
  assert.deepEqual(full[0].branches, ['寅', '巳', '申']);

  const partial = deriveRelations({ year: '甲寅', month: '丁巳', day: '戊子', hour: '丙辰' }, ruleSet);
  const part = kindsOf(partial, 'punishment').filter(function (h) { return h.name === '寅巳申三刑'; });
  assert.equal(part.length, 1, '寅巳二支相见仍成刑，但标为不完整');
  assert.equal(part[0].complete, false);

  const mutual = deriveRelations({ year: '甲子', month: '乙卯', day: '戊辰', hour: '庚午' }, ruleSet);
  const wuLi = kindsOf(mutual, 'punishment').filter(function (h) { return h.name === '子卯无礼之刑'; });
  assert.equal(wuLi.length, 1, '子卯为互刑');
  assert.deepEqual(wuLi[0].positions, ['year', 'month']);

  // 自刑：同一地支落在两个不同柱位。
  const self = deriveRelations({ year: '甲辰', month: '丙午', day: '戊辰', hour: '庚申' }, ruleSet);
  const selfHits = kindsOf(self, 'self-punishment');
  assert.equal(selfHits.length, 1, '辰落在年、日两柱必须判为自刑');
  assert.deepEqual(selfHits[0].positions, ['year', 'day']);
  assert.deepEqual(selfHits[0].branches, ['辰', '辰']);

  // 反例：同一柱只有一个地支，不构成自刑。
  const single = deriveRelations({ year: '甲子', month: '丙辰', day: '戊寅', hour: '庚申' }, ruleSet);
  assert.equal(kindsOf(single, 'self-punishment').length, 0, '辰只出现一次，不得判为自刑');
}

/* ---------- 5. 六害 ---------- */
{
  const r = deriveRelations({ year: '甲子', month: '乙未', day: '戊寅', hour: '庚申' }, ruleSet);
  const harm = kindsOf(r, 'harm');
  assert.equal(harm.length, 1, '子未必须判为害');
  assert.deepEqual(harm[0].positions, ['year', 'month']);
}

/* ---------- 6. 空亡 ---------- */
{
  const r = deriveRelations({ year: '甲戌', month: '丙子', day: '甲子', hour: '庚午' }, ruleSet);
  assert.equal(r.xun.index, 0);
  assert.equal(r.xun.name, '甲子旬');
  assert.deepEqual(r.xun.voidBranches, ['戌', '亥']);
  const voids = kindsOf(r, 'void');
  assert.equal(voids.length, 1, '年支戌落在甲子旬空亡内');
  assert.deepEqual(voids[0].positions, ['year']);
  assert.equal(r.dayPillar, '甲子');
  // 日柱按构造不落进自己那一旬的空亡。
  assert.equal(voids.some(function (h) { return h.positions.indexOf('day') >= 0; }), false,
    '日柱不可能落在自身旬空内');

  // 跨旬：换一旬后空亡支随之改变，不得沿用上一旬的表。
  const next = deriveRelations({ year: '甲戌', month: '丙子', day: '甲戌', hour: '庚午' }, ruleSet);
  assert.equal(next.xun.index, 1);
  assert.equal(next.xun.name, '甲戌旬');
  assert.deepEqual(next.xun.voidBranches, ['申', '酉']);
  assert.equal(kindsOf(next, 'void').length, 0, '戌不在甲戌旬的空亡内');

  const last = deriveRelations({ year: '甲子', month: '丙寅', day: '甲寅', hour: '庚午' }, ruleSet);
  assert.equal(last.xun.index, 5);
  assert.deepEqual(last.xun.voidBranches, ['子', '丑']);
  const lastVoids = kindsOf(last, 'void');
  assert.deepEqual(lastVoids.map(function (h) { return h.positions[0]; }), ['year'],
    '甲寅旬空子丑，年支子落空');
}

/* ---------- 7. 六旬空亡全表 ---------- */
{
  const table = [['甲子', ['戌', '亥']], ['甲戌', ['申', '酉']], ['甲申', ['午', '未']],
    ['甲午', ['辰', '巳']], ['甲辰', ['寅', '卯']], ['甲寅', ['子', '丑']]];
  table.forEach(function (entry, i) {
    const r = deriveRelations({ year: '丙子', month: '丙寅', day: entry[0], hour: '庚午' }, ruleSet);
    assert.equal(r.xun.index, i, entry[0] + ' 应落在第 ' + i + ' 旬');
    assert.deepEqual(r.xun.voidBranches, entry[1], entry[0] + ' 的空亡支');
  });
}

/* ---------- 8. 输入校验与分组完整性 ---------- */
{
  assert.throws(function () { deriveRelations({ year: '甲', month: '丙子', day: '甲子', hour: '庚午' }, ruleSet); },
    /invalid pillar year/, '长度不为 2 的柱必须被拒绝');
  assert.throws(function () { deriveRelations({ year: '甲壬', month: '丙子', day: '甲子', hour: '庚午' }, ruleSet); },
    /invalid pillar year/, '地支不在规则表内必须被拒绝');

  const r = deriveRelations({ year: '甲子', month: '丙午', day: '丁卯', hour: '辛酉' }, ruleSet);
  assert.deepEqual(Object.keys(r.groups), RELATION_GROUPS, '分组必须齐全且顺序固定');
  assert.deepEqual(r.skipped, [], '默认规则集不得跳过任何分组');
  for (const group of RELATION_GROUPS) {
    assert.match(r.groups[group].ruleId, /^bazi\.relation\./, group + ' 必须带 ruleId');
    assert.equal(r.groups[group].evidence, 'traditional', group + ' 的证据类别');
  }
}

/* ---------- 9. 确定性 ---------- */
{
  const input = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };
  const a = castBazi(input);
  const b = castBazi(input);
  assert.deepEqual(shape(a.relations), shape(b.relations), '同输入必须同关系');
  assert.equal(JSON.stringify(a.relations), JSON.stringify(b.relations), '关系结构必须逐字一致');
  // 关系事实必须进事实图，才能被解释层引用与溯源。
  const ids = a.facts.facts.map(function (f) { return f.fact_id; });
  RELATION_GROUPS.forEach(function (group) {
    assert.ok(ids.indexOf('relations.' + group) >= 0, '事实图缺少 relations.' + group);
  });
}

console.log('relations smoke passed');
