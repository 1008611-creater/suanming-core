/**
 * 最小可运行示例：排盘、溯源审计、确定性指纹、农历月份编号。
 * 运行：npm run example
 */
import {
  castBazi, explain, validateChart, validateTraceability,
  auditRuleSet, auditFactGraph, listRuleSets,
  hashInput, hashFacts, numberedLunarMonths,
  compareSchools, elementStrength,
  castZiwei, validateZiweiChart, palaceNameAliases
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

console.log('\n紫微斗数（并列盘系，与四柱互不换算）：');
const ziwei = castZiwei(input);
console.log('  农历         ', ziwei.lunar.ganzhi + '年' + (ziwei.lunar.leap ? '闰' : '') + ziwei.lunar.monthNumber + '月' + ziwei.lunar.day + '日');
console.log('  命宫 / 身宫  ', ziwei.soul.branch + '（' + ziwei.soul.stem + '） / ' + ziwei.body.branch);
console.log('  五行局       ', ziwei.fiveElements.name);
console.log('  大限方向     ', ziwei.decadal.direction === 1 ? '顺行' : '逆行', '起运虚岁 ' + ziwei.fiveElements.value);
console.log('  结构校验     ', validateZiweiChart(ziwei));
console.log('  溯源审计     ', auditFactGraph(ziwei.facts));
console.log('  事实图指纹   ', hashFacts(ziwei.facts));
console.log('  宫名别名     ', palaceNameAliases('交友').join(' / '));
console.log('  十二宫：');
for (const palace of ziwei.palaces) {
  const label = palace.name + (palace.isSoulPalace ? '·命' : '') + (palace.isBodyPalace ? '·身' : '');
  console.log('    ' + (palace.stem + palace.branch).padEnd(4), label.padEnd(6),
    (palace.starNames.join(' ') || '—').padEnd(30),
    palace.mutagens.length ? '四化 ' + palace.mutagens.join('') : '',
    palace.decadal ? '大限 ' + palace.decadal.startAge + '-' + palace.decadal.endAge : '');
}

console.log('\n2024 年农历月份编号：');
console.log('  ' + numberedLunarMonths(2024).map(m => (m.leap ? '闰' : '') + m.monthNumber).join(' '));
