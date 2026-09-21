/**
 * 前事清单（解释层）冒烟测试
 * ---------------------------------------------------------------------------
 * 前事清单是唯一直接面向用户的解释层产物，四条底线必须钉死：
 *
 *   1. 只读不重算：同一份盘两次调用必须逐字一致；不传 asOfYear 时不得出现
 *      任何依赖「现在」的条目 —— 否则同一份盘在不同日子给出不同清单。
 *   2. 条数落在公开区间内（PAST_EVENT_BOUNDS）：少于 5 条用户没法比对，
 *      多于 8 条没人愿意逐条打标。
 *   3. 每条都能指回规则：basis.ruleId 必须能在同一套规则集里解析出来，
 *      且程度档只能是 轻／中／重 三档之一。
 *   4. 表述纪律（R-02）：清单文本里不得出现百分比与「准确率」字样。
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
  assert.equal(items.some(function (i) { return i.id === 'flow-repeat'; }), false,
    '未给 asOfYear 时不得产出流年反复条目');
  // 换一个 asOfYear 不得改变与流年无关的条目。
  const other = pastEvents(chart, { ruleSet, asOfYear: 2000 });
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

console.log('[past-events] ok  条数 ' + pastEvents(chart, { ruleSet, asOfYear: 2026 }).length
  + '  区间 ' + PAST_EVENT_BOUNDS.min + '–' + PAST_EVENT_BOUNDS.max);
