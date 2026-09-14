/**
 * 规则集注册表
 * ---------------------------------------------------------------------------
 * 计算层只通过本模块取规则，不直接 import 具体版本文件，也不内嵌任何流派字面量。
 * 新增流派 = 新增一个版本化规则集目录 + 在 RULE_SETS 登记，不改计算代码。
 */
import baziCore from './bazi-core-0.1.0/ruleset.js';
import baziZichu from './bazi-zichu-0.1.0/ruleset.js';
import ziweiCore from './ziwei-core-0.1.0/ruleset.js';
import { stableStringify, fnv1a64 } from '../src/derive/hash.js';
import { ENGINE_VERSION, satisfiesRange } from '../src/version.js';

/** 规则集内容指纹：规则一旦改动，指纹随之变化，结果可被外部复算比对。 */
function withHash(ruleSet) {
  return Object.freeze({ ...ruleSet, hash: fnv1a64(stableStringify({ ...ruleSet, hash: undefined })) });
}

export const RULE_SETS = Object.freeze({
  'bazi-core-0.1.0': withHash(baziCore),
  'bazi-zichu-0.1.0': withHash(baziZichu),
  'ziwei-core-0.1.0': withHash(ziweiCore)
});

/** 默认四柱规则集 */
export const DEFAULT_BAZI_RULE_SET = 'bazi-core-0.1.0';
/** 默认紫微规则集 */
export const DEFAULT_ZIWEI_RULE_SET = 'ziwei-core-0.1.0';

/** 各盘系的参照规则集：分歧只与**同盘系**的参照集比较。 */
const REFERENCE_BY_SYSTEM = Object.freeze({
  bazi: 'bazi-core-0.1.0',
  ziwei: 'ziwei-core-0.1.0'
});

/** 规则集的盘系；未声明时按四柱处理（早期规则集没有该字段）。 */
export function systemOf(ruleSet) {
  return ruleSet?.system ?? 'bazi';
}

/** 某盘系下的全部规则集 id；不传盘系则返回全部。 */
export function ruleSetIdsOf(system) {
  const all = Object.keys(RULE_SETS);
  if (!system) return all;
  return all.filter((id) => systemOf(RULE_SETS[id]) === system);
}

export function isKnownRuleSet(id) { return Object.prototype.hasOwnProperty.call(RULE_SETS, id); }

export function getRuleSet(id = DEFAULT_BAZI_RULE_SET) {
  const ruleSet = RULE_SETS[id];
  if (!ruleSet) throw new Error('unknown rule set: ' + id);
  return ruleSet;
}

/**
 * 列出已登记的规则集。
 * 传 { system } 可只看某一盘系 —— 上层若要拿「全部四柱流派」去并列，必须显式过滤，
 * 否则会把紫微规则集喂给四柱排盘函数，得到的是崩溃而不是结果。
 */
export function listRuleSets(options = {}) {
  const system = typeof options === 'string' ? options : options.system;
  return Object.entries(RULE_SETS)
    .filter(([, r]) => !system || systemOf(r) === system)
    .map(([id, r]) => ({
      id, system: systemOf(r), version: r.version, title: r.title, school: r.school,
      engineCompatibility: r.engineCompatibility, hash: r.hash, ruleCount: ruleEntries(r).length,
      divergences: divergenceKeys(r)
    }));
}

/**
 * 规则集的可枚举分歧点：凡是与**同盘系参照规则集**取值不同的规则条目，都登记为分歧。
 * 用途是让上层可以问「这两套流派到底哪里不一样」，而不是只能凭肉眼比对两份结果。
 *
 * 分歧只在同一盘系内定义：四柱与紫微是两套不同的盘，ruleId 命名空间也不同，
 * 把它们互相比较会把「另一个盘系的全部规则」误报成分歧，分歧清单随之失去意义。
 */
export function divergenceKeys(ruleSet) {
  const referenceId = REFERENCE_BY_SYSTEM[systemOf(ruleSet)];
  const reference = RULE_SETS[referenceId];
  if (!reference || ruleSet.id === referenceId) return [];
  const ref = new Map(ruleEntries(reference).map(e => [e.ruleId, e]));
  const out = [];
  for (const entry of ruleEntries(ruleSet)) {
    const base = ref.get(entry.ruleId);
    if (!base) { out.push(entry.ruleId); continue; }
    if (base.value !== entry.value) out.push(entry.ruleId);
  }
  return out;
}

/** 取出规则集内所有带 ruleId 的条目，供审计与事实溯源使用。 */
export function ruleEntries(ruleSet = getRuleSet()) {
  const out = [];
  const push = (group, key, entry) => {
    if (entry && typeof entry === 'object' && typeof entry.ruleId === 'string') {
      out.push({ group, key, ...entry });
    }
  };
  for (const [key, entry] of Object.entries(ruleSet.conventions ?? {})) push('conventions', key, entry);
  for (const [key, entry] of Object.entries(ruleSet.tables ?? {})) push('tables', key, entry);
  return out;
}

/** ruleId -> 规则条目 */
export function ruleIndex(ruleSet = getRuleSet()) {
  const index = new Map();
  for (const entry of ruleEntries(ruleSet)) {
    if (index.has(entry.ruleId)) throw new Error('duplicate ruleId: ' + entry.ruleId);
    index.set(entry.ruleId, entry);
  }
  return index;
}

export function resolveRule(ruleId, ruleSet = getRuleSet()) {
  return ruleIndex(ruleSet).get(ruleId) ?? null;
}

/**
 * 规则集审计：没有出处、没有置信度、出处未登记、ruleId 重复的规则一律视为缺陷。
 * 这是「结论必须可溯源」这条设计原则的强制入口。
 */
export function auditRuleSet(ruleSet = getRuleSet()) {
  const errors = [];
  const warnings = [];
  if (!ruleSet.id) errors.push('ruleSet.id is required');
  if (!ruleSet.version) errors.push('ruleSet.version is required');
  if (!ruleSet.sources || typeof ruleSet.sources !== 'object') errors.push('ruleSet.sources is required');
  if (!ruleSet.engineCompatibility) {
    errors.push('ruleSet.engineCompatibility is required');
  } else if (!satisfiesRange(ruleSet.engineCompatibility, ENGINE_VERSION)) {
    errors.push('ruleSet.engineCompatibility "' + ruleSet.engineCompatibility +
      '" does not include current engine version ' + ENGINE_VERSION);
  }

  const sources = ruleSet.sources ?? {};
  const entries = ruleEntries(ruleSet);
  if (!entries.length) errors.push('rule set has no ruleId entries');

  const seen = new Set();
  for (const entry of entries) {
    const where = entry.group + '.' + entry.key + ' (' + entry.ruleId + ')';
    if (seen.has(entry.ruleId)) errors.push('duplicate ruleId: ' + entry.ruleId);
    seen.add(entry.ruleId);
    if (!entry.label) errors.push(where + ': label is required');
    if (typeof entry.confidence !== 'number' || entry.confidence < 0 || entry.confidence > 1) {
      errors.push(where + ': confidence must be within [0, 1]');
    }
    if (!['astronomical', 'convention', 'traditional', 'calibration'].includes(entry.evidence)) {
      errors.push(where + ': evidence must be one of astronomical/convention/traditional/calibration');
    }
    if (!Array.isArray(entry.source) || entry.source.length === 0) {
      errors.push(where + ': source must be a non-empty array');
      continue;
    }
    for (const key of entry.source) {
      if (!sources[key]) errors.push(where + ': unregistered source "' + key + '"');
    }
  }

  for (const [key, source] of Object.entries(sources)) {
    if (!source.citation) errors.push('sources.' + key + ': citation is required');
    if (!source.kind) warnings.push('sources.' + key + ': kind is recommended');
  }

  return { ok: errors.length === 0, errors, warnings, ruleCount: entries.length, sourceCount: Object.keys(sources).length };
}

/**
 * 事实图溯源审计：每个事实必须指向已登记的 ruleId，且置信度不得超过规则本身。
 *
 * 默认规则集从事实图自带的清单里解析，而不是一律取四柱默认集：
 * 事实图可能是紫微盘产出的，用四柱规则集去查会把每一条都判成「未知 ruleId」。
 */
export function auditFactGraph(graph, ruleSet = getRuleSet(graph?.manifest?.ruleSet)) {
  const index = ruleIndex(ruleSet);
  const errors = [];
  const facts = graph?.facts ?? [];
  const seen = new Set();
  for (const f of facts) {
    if (!f?.fact_id) { errors.push('fact without fact_id'); continue; }
    if (seen.has(f.fact_id)) errors.push('duplicate fact_id: ' + f.fact_id);
    seen.add(f.fact_id);
    const rule = index.get(f.rule_id);
    if (!rule) { errors.push(f.fact_id + ': unknown rule_id "' + f.rule_id + '"'); continue; }
    if (typeof f.confidence !== 'number') { errors.push(f.fact_id + ': confidence must be a number'); continue; }
    if (f.confidence > rule.confidence + 1e-9) {
      errors.push(f.fact_id + ': confidence ' + f.confidence + ' exceeds rule ' + f.rule_id + ' (' + rule.confidence + ')');
    }
  }
  return { ok: errors.length === 0, errors, factCount: facts.length };
}
