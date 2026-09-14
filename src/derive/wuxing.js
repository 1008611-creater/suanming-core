import { getRuleSet } from '../../rules/index.js';

/**
 * 五行力量（L4 派生层）
 * ---------------------------------------------------------------------------
 * 权重来自规则集 parameters.hiddenStemWeights，而不是代码里的常数：
 *   [1, 0, 0]       —— 天干 + 地支本气各计一次（通用派计数法）
 *   [1, 0.5, 0.3]   —— 藏干本气 / 中气 / 余气加权（加权派）
 * 藏干表序即优先级（本气、中气、余气），因此权重按序套用。
 * 权重不同 → 结果不同 → 这是真实的流派分歧，必须并列保留，不能合并。
 */

export const ELEMENT_ORDER = ['木', '火', '土', '金', '水'];

export function elementStrength(pillars, ruleSet = getRuleSet()) {
  const weights = Array.isArray(ruleSet.parameters.hiddenStemWeights)
    ? ruleSet.parameters.hiddenStemWeights
    : [1, 0, 0];
  const stems = ruleSet.tables.stems;
  const branches = ruleSet.tables.branches;
  const elementOfStem = (name) => stems.find((s) => s.name === name)?.element ?? null;

  const totals = Object.fromEntries(ELEMENT_ORDER.map((element) => [element, 0]));
  for (const pillar of Object.values(pillars)) {
    if (typeof pillar !== 'string' || pillar.length < 2) continue;
    const stemElement = elementOfStem(pillar[0]);
    if (stemElement) totals[stemElement] += weights[0] ?? 0;
    const hidden = branches.find((b) => b.name === pillar[1])?.hiddenStems ?? [];
    hidden.forEach((name, index) => {
      const element = elementOfStem(name);
      if (!element) return;
      totals[element] += weights[Math.min(index, weights.length - 1)] ?? 0;
    });
  }

  const round = (n) => Math.round(n * 1000) / 1000;
  const total = round(Object.values(totals).reduce((a, b) => a + b, 0));
  const ranked = ELEMENT_ORDER
    .map((element) => ({ element, value: round(totals[element]), share: total ? round(totals[element] / total) : 0 }))
    .sort((a, b) => b.value - a.value || ELEMENT_ORDER.indexOf(a.element) - ELEMENT_ORDER.indexOf(b.element));

  return Object.freeze({
    weights: [...weights],
    totals: Object.fromEntries(ranked.map((r) => [r.element, r.value])),
    share: Object.fromEntries(ranked.map((r) => [r.element, r.share])),
    total,
    dominant: ranked[0]?.element ?? null,
    weakest: ranked[ranked.length - 1]?.element ?? null,
    ranking: ranked.map((r) => r.element),
    method: ruleSet.tables.elementCountRule?.ruleId ?? null,
    ruleSet: ruleSet.id
  });
}
