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

第二个参数可指定规则集：`castBazi(input, { ruleSetId: 'bazi-core-0.1.0' })`。

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

listRuleSets();                     // [{ id, version, school, hash, ruleCount }]
ruleEntries(getRuleSet());          // 全部带 ruleId 的规则条目
auditRuleSet(getRuleSet());         // { ok, errors, warnings, ruleCount, sourceCount }
auditFactGraph(chart.facts);        // { ok, errors, factCount }
```

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
