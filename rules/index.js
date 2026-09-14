/**
 * 规则集注册表
 * ---------------------------------------------------------------------------
 * 计算层只通过本模块取规则，不直接 import 具体版本文件，也不内嵌任何流派字面量。
 * 新增流派 = 新增一个版本化规则集目录 + 在 RULE_SETS 登记，不改计算代码。
 */
import baziCore from './bazi-core-0.1.0/ruleset.js';
import { stableStringify, fnv1a64 } from '../src/derive/hash.js';

/** 规则集内容指纹：规则一旦改动，指纹随之变化，结果可被外部复算比对。 */
function withHash(ruleSet) {
  return Object.freeze({ ...ruleSet, hash: fnv1a64(stableStringify({ ...ruleSet, hash: undefined })) });
}

export const RULE_SETS = Object.freeze({
  'bazi-core-0.1.0': withHash(baziCore)
});

/** 默认四柱规则集 */
export const DEFAULT_BAZI_RULE_SET = 'bazi-core-0.1.0';

export function isKnownRuleSet(id) { return Object.prototype.hasOwnProperty.call(RULE_SETS, id); }

export function getRuleSet(id = DEFAULT_BAZI_RULE_SET) {
  const ruleSet = RULE_SETS[id];
  if (!ruleSet) throw new Error('unknown rule set: ' + id);
  return ruleSet;
}

export function listRuleSets() {
  return Object.entries(RULE_SETS).map(([id, r]) => ({
    id, version: r.version, title: r.title, school: r.school,
    engineCompatibility: r.engineCompatibility, hash: r.hash, ruleCount: ruleEntries(r).length
  }));
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
 */
export function auditFactGraph(graph, ruleSet = getRuleSet()) {
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
