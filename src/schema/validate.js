/**
 * 运行时结构校验（不依赖任何第三方库）
 * ---------------------------------------------------------------------------
 * 权威 Schema 在仓库顶层 schema/ 目录；本文件是同一份契约的可执行实现，
 * 让运行时不引入 ajv 之类的依赖也能给出确定性的校验结果。
 */
import { ruleIndex, getRuleSet, isKnownRuleSet } from '../../rules/index.js';

const GANZHI = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
const HEX64 = /^[0-9a-f]{16}$/;

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateChart(chart) {
  const errors = [];
  if (!isPlainObject(chart)) return { valid: false, errors: ['chart must be an object'] };
  if (chart.schemaVersion !== '1.0.0') errors.push('schemaVersion must be 1.0.0');

  if (!isPlainObject(chart.input)) errors.push('input must be an object');
  else {
    for (const key of ['year', 'month', 'day']) {
      if (!Number.isInteger(chart.input[key])) errors.push('input.' + key + ' must be an integer');
    }
  }

  if (!isPlainObject(chart.pillars)) errors.push('pillars must be an object');
  else {
    for (const key of ['year', 'month', 'day', 'hour']) {
      if (!GANZHI.test(chart.pillars[key] ?? '')) errors.push('pillars.' + key + ' is invalid');
    }
  }

  if (!isPlainObject(chart.manifest)) errors.push('manifest must be an object');
  else {
    if (!chart.manifest.engineVersion) errors.push('manifest.engineVersion is required');
    if (!chart.manifest.ephemerisModel) errors.push('manifest.ephemerisModel is required');
    if (!chart.manifest.ruleSet) errors.push('manifest.ruleSet is required');
    else if (!isKnownRuleSet(chart.manifest.ruleSet)) errors.push('manifest.ruleSet is not registered: ' + chart.manifest.ruleSet);
    if (!chart.manifest.ruleSetVersion) errors.push('manifest.ruleSetVersion is required');
    if (chart.manifest.ruleSetHash != null && !HEX64.test(chart.manifest.ruleSetHash)) {
      errors.push('manifest.ruleSetHash must be a 16-char hex string');
    }
  }

  errors.push(...validateFactGraph(chart.facts).errors);
  return { valid: errors.length === 0, errors };
}

/** 事实图结构校验：事实必须成组、ID 唯一、置信度在区间内。 */
export function validateFactGraph(graph) {
  const errors = [];
  if (!isPlainObject(graph)) return { valid: false, errors: ['facts must be an object'] };
  if (graph.version !== '1.0.0') errors.push('facts.version must be 1.0.0');
  if (!Array.isArray(graph.facts)) { errors.push('facts.facts must be an array'); return { valid: false, errors }; }
  const seen = new Set();
  for (const f of graph.facts) {
    if (!isPlainObject(f)) { errors.push('fact must be an object'); continue; }
    if (!f.fact_id) errors.push('fact.fact_id is required');
    else if (seen.has(f.fact_id)) errors.push('duplicate fact_id: ' + f.fact_id);
    else seen.add(f.fact_id);
    if (!f.rule_id) errors.push('fact ' + f.fact_id + ': rule_id is required');
    if (typeof f.confidence !== 'number' || f.confidence < 0 || f.confidence > 1) {
      errors.push('fact ' + f.fact_id + ': confidence must be within [0, 1]');
    }
    if (!Array.isArray(f.source)) errors.push('fact ' + f.fact_id + ': source must be an array');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * 溯源校验：每个事实的 rule_id 必须能在对应规则集里找到，且置信度不得超过规则本身。
 * 这是「解读必须引用事实来源」这条原则的执行点。
 */
export function validateTraceability(chart, ruleSet = getRuleSet(chart?.manifest?.ruleSet)) {
  const errors = [];
  const index = ruleIndex(ruleSet);
  for (const f of chart?.facts?.facts ?? []) {
    const rule = index.get(f.rule_id);
    if (!rule) { errors.push(f.fact_id + ': unknown rule_id ' + f.rule_id); continue; }
    if (typeof f.confidence === 'number' && f.confidence > rule.confidence + 1e-9) {
      errors.push(f.fact_id + ': confidence exceeds rule ' + f.rule_id);
    }
  }
  return { valid: errors.length === 0, errors };
}
