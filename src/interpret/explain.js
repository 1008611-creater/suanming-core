import { requireFacts } from '../derive/facts.js';
export function explain(graph, claims) {
  return claims.map(c=>{ const refs=requireFacts(graph,c.factIds||[]); if(!refs.length) return null; return {...c, evidence:refs.map(r=>r.fact_id), confidence:Math.min(...refs.map(r=>r.confidence))}; }).filter(Boolean);
}

