export function fact({id, value, ruleId, school='common', confidence=1, source=[]}) {
  return Object.freeze({fact_id:id, value, rule_id:ruleId, school, confidence, source});
}
export function factGraph(facts, manifest) { return { version:'1.0.0', facts:[...facts], manifest }; }
export function requireFacts(graph, ids) { return ids.map(id=>graph.facts.find(f=>f.fact_id===id)).filter(Boolean); }

