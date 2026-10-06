/**
 * 前事清单（解释层）冒烟测试
 * ---------------------------------------------------------------------------
 * 前事清单是唯一直接面向用户的解释层产物，四条底线必须钉死：
 *
 *   1. 只读不重算：同一份盘两次调用必须逐字一致；不传 asOfYear 时不得出现
 *      任何依赖「现在」的条目 —— 否则同一份盘在不同日子给出不同清单。
 *   2. 条数是固定合同（PAST_EVENT_BOUNDS = { min: 6, max: 7 }）：
 *      不给核对年份出 6 问，给了出 7 问（多一条重复年份）。固定问题
 *      而不是「有几条算几条」，用户两次核对才有可比性。
 *   3. 每条都能指回规则：basis.ruleId 必须能在同一套规则集里解析出来，
 *      且程度档只能是 轻／中／重 三档之一。
 *   4. 表述纪律（R-02）：清单文本里不得出现百分比与「准确率」字样。
 *   5. 每问都自带「什么算像 / 什么不算」两段判据，页面不再自己编文案。
 *
 * 另断言规则集缺条目时整组跳过（skipped 有记录），而不是回退默认值。
 */
import assert from 'node:assert/strict';
import { castBazi, pastEvents, PAST_EVENT_BOUNDS, getRuleSet, resolveRule } from '../src/index.js';

const ruleSet = getRuleSet();
const input = { year: 1990, month: 1, day: 1, hour: 12, minute: 0, longitude: 118.18, gender: 'male' };
const chart = castBazi(input);
const TIERS = ['轻', '中', '重'];

/** 逐条检查清单的公共约束，返回清单本身便于继续断言。 */
function check(items, label) {
  assert.ok(Array.isArray(items), label + '：清单不是数组');
  assert.ok(items.length >= PAST_EVENT_BOUNDS.min && items.length <= PAST_EVENT_BOUNDS.max,
    label + '：条数 ' + items.length + ' 超出 ' + PAST_EVENT_BOUNDS.min + '–' + PAST_EVENT_BOUNDS.max);
  assert.deepEqual(items.skipped, [], label + '：默认规则集不应跳过任何条目');
  const ids = new Set();
  for (const item of items) {
    assert.ok(item.id && !ids.has(item.id), label + '：条目 id 缺失或重复：' + item.id);
    ids.add(item.id);
    assert.equal(typeof item.statement, 'string', label + '：' + item.id + ' 缺少判词');
    assert.ok(item.statement.length > 10, label + '：' + item.id + ' 判词过短');
    assert.equal(typeof item.question, 'string', label + '：' + item.id + ' 缺少问题');
    assert.ok(item.question.length > 6, label + '：' + item.id + ' 问题过短');
    assert.equal(typeof item.counts, 'string', label + '：' + item.id + ' 缺少「什么算像」');
    assert.equal(typeof item.doesNotCount, 'string', label + '：' + item.id + ' 缺少「什么不算」');
    assert.ok(item.counts.length > 6 && item.doesNotCount.length > 6,
      label + '：' + item.id + ' 的判据过短');
    assert.ok(TIERS.indexOf(item.tier) >= 0, label + '：' + item.id + ' 程度档非法：' + item.tier);
    assert.ok(item.uncertainty && item.uncertainty.length > 10, label + '：' + item.id + ' 缺少不确定性说明');
    assert.ok(item.basis && typeof item.basis === 'object', label + '：' + item.id + ' 缺少依据');
    const rule = resolveRule(item.basis.ruleId, ruleSet);
    assert.ok(rule, label + '：' + item.id + ' 的 ruleId 无法解析：' + item.basis.ruleId);
    assert.ok(rule.source && rule.source.length > 0, label + '：' + item.id + ' 的规则缺少来源');
    assert.ok(typeof rule.confidence === 'number', label + '：' + item.id + ' 的规则缺少置信度');
  }
  return items;
}

/* ---------- 1. 条数、可追溯、程度档 ---------- */
{
  const items = check(pastEvents(chart, { ruleSet, asOfYear: 2026 }), '固定年份');
  assert.equal(items.length, PAST_EVENT_BOUNDS.max, '给定核对年份时应是 7 问');
  assert.deepEqual(items.omitted, [], '七问齐全时不应有省略说明');
  assert.ok(items.some(function (i) { return i.id === 'month-palace'; }), '缺少父母宫条目');
  assert.ok(items.some(function (i) { return i.id === 'spouse-palace'; }), '缺少夫妻宫条目');
  assert.ok(items.some(function (i) { return i.id === 'flow-repeat'; }), '给定 asOfYear 后应有流年反复条目');
  // 程度分档必须真的在分档，而不是所有条目都记同一档。
  const tiers = new Set(items.map(function (i) { return i.tier; }));
  assert.ok(tiers.size >= 2, '黄金盘应至少落在两个程度档上，实际：' + [...tiers].join(''));
  assert.equal(items.ruleSet, ruleSet.id, '清单未带出规则集 id');
}

/* ---------- 2. 确定性：同输入两次调用逐字一致 ---------- */
{
  const a = pastEvents(chart, { ruleSet, asOfYear: 2026 });
  const b = pastEvents(chart, { ruleSet, asOfYear: 2026 });
  assert.equal(JSON.stringify(a), JSON.stringify(b), '同输入两次调用结果必须逐字一致');
}

/* ---------- 3. 不读时钟：缺 asOfYear 时省略流年类条目 ---------- */
{
  const items = check(pastEvents(chart, { ruleSet }), '缺省年份');
  assert.equal(items.length, PAST_EVENT_BOUNDS.min, '不给核对年份时应是 6 问');
  assert.equal(items.omitted.length, 1, '缺年份时应带出省略说明');
  assert.equal(items.omitted[0].id, 'flow-repeat', '省略说明应指向重复年份那一问');
  assert.ok(/重复年份/.test(items.omitted[0].notice), '省略说明应点明省略了重复年份那一问');
  assert.equal(items.some(function (i) { return i.id === 'flow-repeat'; }), false,
    '未给 asOfYear 时不得产出流年反复条目');
  // 6 问与 7 问之间只差「重复年份」一条，其余逐字一致 —— 否则用户两次核对不可比。
  const seven = pastEvents(chart, { ruleSet, asOfYear: 2026 });
  assert.deepEqual(
    seven.filter(function (i) { return i.id !== 'flow-repeat'; }).map(function (i) { return i.id + '|' + i.question + '|' + i.statement; }),
    items.map(function (i) { return i.id + '|' + i.question + '|' + i.statement; }),
    '多出的一问之外，6 问与 7 问的内容必须逐字一致');
  // 换一个 asOfYear 不得改变与流年无关的条目。
  const other = pastEvents(chart, { ruleSet, asOfYear: 2000 });
  assert.equal(other.omitted.length, 1, '核对年份早于出生年时，重复年份这一问同样省略');
  const structural = function (list) {
    return list.filter(function (i) { return i.id !== 'flow-repeat'; }).map(function (i) { return i.id + '|' + i.statement; });
  };
  assert.deepEqual(structural(other), structural(items), '换年份不得影响结构类条目');
  assert.equal(other.some(function (i) { return i.id === 'flow-repeat'; }), false,
    'asOfYear 早于出生年时不应产出流年反复条目');
}

/* ---------- 4. 表述纪律：不出现百分比与「准确率」 ---------- */
{
  const text = JSON.stringify(pastEvents(chart, { ruleSet, asOfYear: 2026 }));
  assert.equal(text.indexOf('%'), -1, '清单文本出现百分号');
  assert.equal(text.indexOf('％'), -1, '清单文本出现全角百分号');
  assert.equal(text.indexOf('准确率'), -1, '清单文本出现「准确率」');
  assert.equal(/命中率|精准度|大吉|大凶|必发|必定/.test(text), false, '清单文本出现禁用表述');
  // 内部枚举名（clash / combine / trine / punishment / harm / void …）是英文实现细节，
  // 一旦随判词或依据栏泄漏到页面，用户看到的就是「关系 clash」这种半成品。
  // 只扫展示字段：ruleId 本身就是给审计用的技术标识（bazi.relation.branch-clash），
  // 它按设计要原样露出，不算泄漏。
  const shown = pastEvents(chart, { ruleSet, asOfYear: 2026 }).map(function (i) {
    return [i.id, i.statement, i.tier, i.uncertainty,
      i.basis.palace, i.basis.tenGod, i.basis.relation].join('\u0001');
  }).join('\n');
  const enums = ['clash', 'combine', 'trine', 'punishment', 'harm', 'void', 'self-punishment'];
  for (const word of enums) {
    assert.equal(shown.indexOf(word), -1, '清单展示文本泄漏内部枚举名：' + word);
  }
}

/* ---------- 4b. 关系名必须是中文，且同一条关系不在两个宫位重复展开 ---------- */
{
  const items = pastEvents(chart, { ruleSet, asOfYear: 2026 });
  for (const item of items) {
    if (!item.basis.relation) continue;
    assert.equal(/[A-Za-z]/.test(item.basis.relation), false,
      item.id + ' 的关系名含英文：' + item.basis.relation);
    assert.ok(/冲|合|刑|害|空亡/.test(item.basis.relation),
      item.id + ' 的关系名看不出关系类型：' + item.basis.relation);
  }
  // 一条跨柱关系在结构上落在两个宫位，但判词只能在一处展开，
  // 另一处只作共见标注 —— 否则用户看到同一句话写两遍，清单像在凑条数。
  const statements = items.map(function (i) { return i.statement; });
  assert.equal(new Set(statements).size, statements.length, '清单里出现重复判词');
  const palaceItems = items.filter(function (i) { return /-palace$|^spouse-palace$/.test(i.id); });
  const expanded = palaceItems.filter(function (i) { return i.statement.indexOf('共见') < 0; });
  const clashes = expanded.filter(function (i) { return i.statement.indexOf('子午冲') >= 0; });
  assert.equal(clashes.length, 1, '子午冲应在且仅在一个宫位展开，实际 ' + clashes.length + ' 处');
}

/* ---------- 5. 规则集缺条目时整组跳过，不回退默认值 ---------- */
{
  const stripped = JSON.parse(JSON.stringify(ruleSet));
  delete stripped.conventions.pastEventTiering;
  delete stripped.conventions.pastEventUncertainty;
  const items = pastEvents(chart, { ruleSet: stripped, asOfYear: 2026 });
  assert.ok(items.skipped.length > 0, '规则集缺解释层条目时应记录跳过原因');
  assert.ok(items.skipped.every(function (s) { return typeof s.reason === 'string' && s.reason.length > 0; }),
    '跳过原因必须是可读字符串');
  // 被跳过的条目不得以默认值形式出现在清单里。
  for (const item of items) {
    assert.ok(resolveRule(item.basis.ruleId, stripped), '残留了规则集里不存在的 ruleId：' + item.basis.ruleId);
  }
}

/* ---------- 6. 输入校验 ---------- */
{
  assert.throws(function () { pastEvents(null); }, /chart is required/);
  assert.throws(function () { pastEvents({ pillars: chart.pillars }); }, /relations/,
    '缺少 relations 时必须报错，而不是静默给出无依据的清单');
}

/* ---------- 7. 程度档必须随结构变化，不能写死同一档 ----------
 * 0.6.1 之前月令生克、十神分布、流年反复三条被写死为「轻」，80 盘实测档位完全不动。
 * 这里用极端盘钉住分档：月令克日主记重、日主克月令记中、相生记轻；
 * 十神某一类占七处落点 4 处记重；流年同一类反复 4 次记中。
 */
{
  function tier(input, id, year) {
    const items = pastEvents(castBazi(input), { ruleSet, asOfYear: year });
    const item = items.find(function (i) { return i.id === id; });
    assert.ok(item, id + ' 缺失：' + JSON.stringify(input));
    return item.tier;
  }
  const base = { day: 6, hour: 12, minute: 0, longitude: 118.18, gender: 'male' };
  // 月令生克：戊土生卯月，月令克日主 → 重；丁火生申月，日主克月令 → 中；癸水生子月，同气 → 轻。
  assert.equal(tier(Object.assign({ year: 1961, month: 3 }, base), 'month-qi', 2026), '重', '月令克日主应记重');
  assert.equal(tier(Object.assign({ year: 1960, month: 9 }, base), 'month-qi', 2026), '中', '日主克月令应记中');
  assert.equal(tier(Object.assign({ year: 1960, month: 1 }, base), 'month-qi', 2026), '轻', '同气比助应记轻');
  // 十神分布：七处落点里某一类达到 4 处 → 重。
  assert.equal(tier(Object.assign({ year: 1961, month: 1 }, base), 'ten-god-structure', 2026), '重', '十神某一类占 4 处应记重');
  // 流年反复：同一类出现 4 次 → 中（3 次是门槛，记轻）。
  assert.equal(tier(Object.assign({ year: 1960, month: 1 }, base), 'flow-repeat', 2026), '中', '流年同一类反复 4 次应记中');
}

console.log('[past-events] ok  条数 ' + pastEvents(chart, { ruleSet, asOfYear: 2026 }).length
  + '  区间 ' + PAST_EVENT_BOUNDS.min + '–' + PAST_EVENT_BOUNDS.max);
