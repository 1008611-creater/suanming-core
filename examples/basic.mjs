/**
 * 最小可运行示例：排盘、溯源审计、确定性指纹、农历月份编号。
 * 运行：npm run example
 */
import {
  castBazi, explain, validateChart, validateTraceability,
  auditRuleSet, auditFactGraph, listRuleSets,
  hashInput, hashFacts, numberedLunarMonths,
  compareSchools, elementStrength
} from '../src/index.js';

const input = {
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
};

const chart = castBazi(input);

console.log('四柱           ', chart.pillars);
console.log('大运           ', chart.luck.pillars.join(' '), '（起运 ' + chart.luck.startAgeYears.toFixed(2) + ' 岁，方向 ' + (chart.luck.direction === 1 ? '顺' : '逆') + '）');
console.log('版本清单       ', chart.manifest);
console.log('规则集         ', listRuleSets());
console.log('规则审计       ', auditRuleSet());
console.log('结构校验       ', validateChart(chart));
console.log('溯源校验       ', validateTraceability(chart));
console.log('事实图审计     ', auditFactGraph(chart.facts));
console.log('输入指纹       ', hashInput(input));
console.log('事实图指纹     ', hashFacts(chart.facts));

console.log('\n事实图（每条结论都能回溯到规则）：');
for (const fact of chart.facts.facts) {
  console.log('  ' + fact.fact_id.padEnd(16), String(fact.value).padEnd(28), fact.rule_id, '置信度 ' + fact.confidence, '[' + fact.evidence + ']');
}

console.log('\n解读（引用不到事实的结论会被丢弃）：');
for (const claim of explain(chart.facts, [
  { text: '年柱已计算', factIds: ['pillar.year'] },
  { text: '没有事实来源的结论', factIds: ['missing'] }
])) {
  console.log('  ' + claim.text, '← ' + claim.evidence.join(', '), '置信度 ' + claim.confidence);
}

console.log('\n多流派并列（不判定孰是孰非，也不合并）：');
const compared = compareSchools(input);
for (const school of compared.schools) {
  console.log('  ' + school.ruleSetId.padEnd(20), JSON.stringify(school.chart.pillars),
    '方向 ' + (school.chart.luck.direction === 1 ? '顺' : '逆'),
    '起运 ' + school.chart.luck.startAgeYears.toFixed(2) + ' 岁',
    '主导五行 ' + school.wuxing.dominant,
    '指纹 ' + school.ruleSetHash);
}
console.log('  分歧字段：');
for (const d of compared.divergences) {
  console.log('    ' + d.path);
  for (const v of d.values) console.log('      ' + v.ruleSetId.padEnd(20), JSON.stringify(v.value));
}
console.log('  一致字段：', compared.agreement.join(', '));
console.log('  ' + compared.disclaimer);

console.log('\n五行力量（权重来自规则集，换流派就换结果）：');
for (const school of compared.schools) {
  console.log('  ' + school.ruleSetId.padEnd(20), '权重 ' + JSON.stringify(school.wuxing.weights),
    JSON.stringify(school.wuxing.totals), '主导 ' + school.wuxing.dominant);
}

console.log('\n2024 年农历月份编号：');
console.log('  ' + numberedLunarMonths(2024).map(m => (m.leap ? '闰' : '') + m.monthNumber).join(' '));
