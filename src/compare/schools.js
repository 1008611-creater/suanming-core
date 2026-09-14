import { castBazi } from '../charts/bazi/chart.js';
import { elementStrength, ELEMENT_ORDER } from '../derive/wuxing.js';
import { getRuleSet, listRuleSets, DEFAULT_BAZI_RULE_SET } from '../../rules/index.js';

/**
 * 多流派并列（L4 派生层）
 * ---------------------------------------------------------------------------
 * 设计红线：本模块**只做并列，不做裁决**。
 *   - 不输出「哪个流派更对」；
 *   - 不把两套结果合并成单一答案；
 *   - 每个分歧点都必须带上两侧各自的 ruleId 与 source，读者自行判断。
 *
 * 一个分歧点只有在「两侧取值确实不同」时才会出现。若两套规则集在某个字段上取值相同，
 * 该字段不进入 divergences —— 不制造虚假分歧，也不隐藏真实分歧。
 */

/** 参与对比的字段：路径 → 取值函数。 */
const FIELD_EXTRACTORS = [
  { path: 'pillars.year', get: (c) => c.pillars.year },
  { path: 'pillars.month', get: (c) => c.pillars.month },
  { path: 'pillars.day', get: (c) => c.pillars.day },
  { path: 'pillars.hour', get: (c) => c.pillars.hour },
  { path: 'luck.direction', get: (c) => c.luck?.direction ?? null },
  { path: 'luck.startAgeYears', get: (c) => c.luck?.startAgeYears ?? null },
  { path: 'luck.pillars', get: (c) => c.luck?.pillars ?? null },
  { path: 'wuxing.dominant', get: (c) => c.wuxing?.dominant ?? null },
  { path: 'wuxing.totals', get: (c) => c.wuxing?.totals ?? null }
];

/** 字段 → 该字段受哪条规则支配。 */
const FIELD_RULES = {
  'pillars.year': 'bazi.year.solar-term-boundary',
  'pillars.month': 'bazi.month.jie-boundary',
  'pillars.day': 'bazi.day.sexagenary-jdn',
  'pillars.hour': 'bazi.hour.true-solar-time',
  'luck.direction': 'bazi.luck.year-stem-polarity',
  'luck.startAgeYears': 'bazi.luck.days-to-boundary-over-3',
  'luck.pillars': 'bazi.luck.year-stem-polarity',
  'wuxing.dominant': 'bazi.wuxing.element-count',
  'wuxing.totals': 'bazi.wuxing.element-count'
};

/** 分歧判定用的规则 ID 映射：同一条规则在不同流派里可能改了 ruleId（如子初换日）。 */
const DIVERGENCE_RULE_ALIASES = {
  'pillars.day': ['bazi.day.sexagenary-jdn', 'bazi.day.zi-chu-true-solar'],
  'luck.direction': ['bazi.luck.year-stem-polarity', 'bazi.luck.gender-only'],
  'luck.pillars': ['bazi.luck.year-stem-polarity', 'bazi.luck.gender-only'],
  'luck.startAgeYears': ['bazi.luck.days-to-boundary-over-3', 'bazi.luck.days-to-boundary-rounded-year'],
  'wuxing.dominant': ['bazi.wuxing.element-count', 'bazi.wuxing.element-weighted'],
  'wuxing.totals': ['bazi.wuxing.element-count', 'bazi.wuxing.element-weighted']
};

function resolveRuleRef(ruleSet, path) {
  const candidates = DIVERGENCE_RULE_ALIASES[path] ?? [FIELD_RULES[path]];
  for (const ruleId of candidates) {
    if (!ruleId) continue;
    const rule = findRule(ruleSet, ruleId);
    if (rule) return { ruleId, label: rule.label, source: [...rule.source], confidence: rule.confidence, evidence: rule.evidence };
  }
  return null;
}

function findRule(ruleSet, ruleId) {
  for (const group of ['conventions', 'tables']) {
    for (const entry of Object.values(ruleSet[group] ?? {})) {
      if (entry?.ruleId === ruleId) return entry;
    }
  }
  return null;
}

function sameValue(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

/**
 * 对同一输入分别用多套规则集排盘，输出并列结果与分歧清单。
 *
 * @param {object} input castBazi 的输入
 * @param {{ruleSetIds?:string[], baseOptions?:object}} options
 * @returns {{input:object, schools:object[], divergences:object[], agreement:string[], fieldOrder:string[], disclaimer:string}}
 */
export function compareSchools(input, options = {}) {
  const ids = options.ruleSetIds ?? listRuleSets().map((r) => r.id);
  if (!Array.isArray(ids) || ids.length < 2) {
    throw new Error('compareSchools requires at least two rule set ids');
  }
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error('duplicate rule set id: ' + id);
    seen.add(id);
  }

  const schools = ids.map((id) => {
    const ruleSet = getRuleSet(id);
    const chart = castBazi(input, { ...options.baseOptions, ruleSet });
    const wuxing = elementStrength(chart.pillars, ruleSet);
    return {
      ruleSetId: ruleSet.id,
      ruleSetVersion: ruleSet.version,
      ruleSetHash: ruleSet.hash,
      school: ruleSet.school,
      title: ruleSet.title,
      engineCompatibility: ruleSet.engineCompatibility,
      chart,
      wuxing,
      facts: chart.facts,
      manifest: chart.manifest
    };
  });

  const divergences = [];
  const agreement = [];
  for (const { path, get } of FIELD_EXTRACTORS) {
    const values = schools.map((s) => ({ ruleSetId: s.ruleSetId, value: get({ ...s.chart, wuxing: s.wuxing }) }));
    const first = values[0].value;
    const differs = values.some((v) => !sameValue(v.value, first));
    if (!differs) { agreement.push(path); continue; }
    divergences.push({
      path,
      values: values.map((v) => ({ ruleSetId: v.ruleSetId, value: v.value })),
      rules: schools.map((s) => ({ ruleSetId: s.ruleSetId, rule: resolveRuleRef(getRuleSet(s.ruleSetId), path) }))
    });
  }

  return Object.freeze({
    input: Object.freeze({ ...input }),
    schools: Object.freeze(schools),
    divergences: Object.freeze(divergences),
    agreement: Object.freeze(agreement),
    fieldOrder: Object.freeze(FIELD_EXTRACTORS.map((f) => f.path)),
    elementOrder: Object.freeze([...ELEMENT_ORDER]),
    disclaimer: '本结果并列展示各流派取值，不判定孰是孰非，也不合并为单一答案。每个分歧点请连同其 ruleId 与 source 一并阅读。',
    defaultRuleSet: DEFAULT_BAZI_RULE_SET
  });
}
