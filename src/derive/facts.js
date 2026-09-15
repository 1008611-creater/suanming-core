import { resolveRule, getRuleSet } from '../../rules/index.js';

/** 手工构造事实（需要显式给出置信度与来源）。 */
export function fact({id, value, ruleId, school='common', confidence=1, source=[], evidence=null}) {
  return Object.freeze({fact_id:id, value, rule_id:ruleId, school, confidence, source, evidence});
}

/**
 * 由规则生成事实：rule_id、置信度、来源、流派、证据类别全部取自规则集。
 * 计算层不得自行填写置信度，否则审计会以「置信度超过规则本身」拒绝。
 */
export function factFromRule(ruleId, { id, value, ruleSet = getRuleSet(), extra = {} } = {}) {
  const rule = resolveRule(ruleId, ruleSet);
  if (!rule) throw new Error('unknown ruleId: ' + ruleId);
  return Object.freeze({
    fact_id: id,
    value,
    rule_id: ruleId,
    school: rule.school ?? ruleSet.school ?? 'common',
    confidence: rule.confidence,
    source: [...rule.source],
    evidence: rule.evidence,
    rule_label: rule.label,
    ...extra
  });
}

export function factGraph(facts, manifest) { return { version:'1.0.0', facts:[...facts], manifest }; }
export function requireFacts(graph, ids) { return ids.map(id=>graph.facts.find(f=>f.fact_id===id)).filter(Boolean); }

/** 按证据类别筛选事实：天文可验证的与流派约定的分开使用。 */
export function factsByEvidence(graph, evidence) { return graph.facts.filter(f => f.evidence === evidence); }
