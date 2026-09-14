# API 快速参考

## 排盘

```js
import { castBazi } from 'suanming-core';

const chart = castBazi({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});
```

返回字段：

| 字段 | 内容 |
| --- | --- |
| `schemaVersion` | 结构契约版本，当前 `1.0.0` |
| `input` | 归一化后的输入（含补齐的时区） |
| `pillars` | 四柱 `{year, month, day, hour}` |
| `time` | UTC 儒略日与真太阳时时辰 |
| `luck` | 大运：`direction`、`startAgeYears`、`pillars`、`method`、`ruleId` |
| `facts` | 事实图，每条事实带 `rule_id` / `source` / `confidence` / `evidence` |
| `manifest` | 版本清单 |

第二个参数可指定规则集：`castBazi(input, { ruleSetId: 'bazi-zichu-0.1.0' })`（默认 `bazi-core-0.1.0`）。

## 多流派并列

```js
import { compareSchools } from 'suanming-core';

const result = compareSchools(input);
// compareSchools(input, { ruleSetIds: ['bazi-core-0.1.0', 'bazi-zichu-0.1.0'] })

result.schools;      // [{ ruleSetId, ruleSetHash, school, chart, wuxing, facts, manifest }]
result.divergences;  // [{ path, values: [{ ruleSetId, value }], rules: [{ ruleSetId, rule }] }]
result.agreement;    // 各派取值一致的字段路径
result.disclaimer;   // 并列展示、不判定孰是孰非
```

不返回 `answer` / `winner` / `recommended`：本工程并列分歧，不做裁决。
少于两套规则集或 id 重复会直接抛错，不会退化成单流派结果冒充对比。

## 五行力量

```js
import { elementStrength, ELEMENT_ORDER } from 'suanming-core';

elementStrength(chart.pillars);   // 用默认规则集
elementStrength(chart.pillars, getRuleSet('bazi-zichu-0.1.0'));  // 用藏干加权口径
// → { weights, totals, share, total, dominant, weakest, ranking, method, ruleSet }
```

权重来自规则集的 `parameters.hiddenStemWeights`，因此换规则集就换结果，代码里没有写死的计法。

## 解读

```js
import { explain } from 'suanming-core';

const claims = explain(chart.facts, [
  { text: '年柱已计算', factIds: ['pillar.year'] }
]);
```

只保留能引用到事实的结论，置信度取所引用事实的最小值。没有事实来源的结论被丢弃。

## 校验

```js
import { validateChart, validateFactGraph, validateTraceability } from 'suanming-core';

validateChart(chart);        // 结构与必需字段
validateFactGraph(chart.facts);
validateTraceability(chart); // 每条事实是否指向已登记规则，且置信度未超过规则本身
```

## 规则集

```js
import { listRuleSets, getRuleSet, ruleEntries, ruleIndex, auditRuleSet, auditFactGraph } from 'suanming-core';

listRuleSets();                     // [{ id, version, school, hash, ruleCount, divergences }]
ruleEntries(getRuleSet());          // 全部带 ruleId 的规则条目
auditRuleSet(getRuleSet());         // { ok, errors, warnings, ruleCount, sourceCount }
auditFactGraph(chart.facts);        // { ok, errors, factCount }
```

## 版本工具

```js
import { ENGINE_VERSION, parseVersion, compareVersions, satisfiesRange } from 'suanming-core';

satisfiesRange('>=0.3.0 <0.4.0', ENGINE_VERSION);   // 规则集的引擎版本区间是否覆盖当前引擎
parseVersion('0.3.0');                              // { major, minor, patch, pre }
```

无法解析的版本区间一律返回 `false`：宁可判为不兼容，也不静默放过。

## 确定性指纹

```js
import { hashInput, hashFacts, stableStringify, fnv1a64 } from 'suanming-core';

hashInput(input);        // 输入指纹，与对象键顺序无关
hashFacts(chart.facts);  // 事实图指纹，可被外部复算比对
```

指纹用于验证「同输入同输出」，不用于安全用途。

## 时间与天文

```js
import { civilToUTC, shichenOfCivil, solarTermInstant, solarTermsOfYear } from 'suanming-core';

civilToUTC({ year: 1988, month: 7, day: 1, hour: 12 }, 'Asia/Shanghai');
shichenOfCivil({ hour: 8, minute: 58 }, 118.18);
solarTermInstant(2024, 315);   // 立春
```

## 农历

```js
import { lunarMonthAnchors, annotateLunarMonths, numberedLunarMonths, monthHasZhongqi } from 'suanming-core';
```

其中无中气月份只标记为闰月候选，完整历书还需要继续校验年界和历法规则。

## 示例

```bash
npm run example
```
