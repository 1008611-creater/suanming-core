# 规则集与证据分级

## 为什么把规则抽出来

四柱里有两类东西，混在一起就永远说不清一个结论到底靠什么：

- **天文可验证的量**：节气时刻、朔望时刻、太阳视黄经。这些有真实误差预算，可以拿天文台数据比对。
- **传统约定**：子初换日、大运顺逆、藏干取法、十神映射。这些是约定，不是实测，不同师承取值不同。

规则集把两者都写成带 `ruleId`、`source`、`confidence`、`evidence` 的数据条目，计算代码不再内嵌任何流派字面量。

## 证据类别

| evidence | 含义 | 置信度口径 |
| --- | --- | --- |
| `astronomical` | 可由天文模型复算，有误差预算 | 模型与参考数据的吻合程度 |
| `calibration` | 有明确锚点的校准约定 | 锚点本身的可靠性 |
| `convention` | 历法或工程约定（换日、时区） | 约定的确定性，不是正确性 |
| `traditional` | 传统命理体系约定 | 体系内部一致性与流传广度，**不是**实测准确率 |

这个区分是硬性的：审计会拒绝没有 `evidence` 的规则。把 `traditional` 的置信度读成「算命准确率」是误用。

## 版本与指纹

每条规则的 `ruleId` 一旦发布不得改变含义；语义变化必须发布新的规则集版本（`bazi-core-0.2.0`）。

规则集整体还有一个 16 位十六进制内容指纹，写入 `manifest.ruleSetHash`。规则被改动而版本号没动，指纹会立刻暴露差异。

## 强制审计

```js
import { castBazi, auditRuleSet, auditFactGraph, validateTraceability } from 'suanming-core';

const chart = castBazi({ year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18 });

auditRuleSet().ok;                     // 规则是否都有出处、置信度、证据类别
auditFactGraph(chart.facts).ok;        // 每个结论是否都指向已登记的规则
validateTraceability(chart).valid;     // 结论置信度是否超过其规则本身
```

CI 会跑这三项。人为把某个结论的置信度调到高于其规则，构建立即失败（见 `tests/traceability-smoke.js`）。

## 新增流派

1. 新建 `rules/<流派>-<版本>/ruleset.js`，沿用同一结构。
2. 在 `rules/index.js` 的 `RULE_SETS` 登记。
3. 调用时传 `castBazi(input, { ruleSetId: '<流派>-<版本>' })`。

同一份输入可以用两套规则集分别排盘，两份结果各自带自己的规则指纹，可以并列展示而不必假装只有一个正确答案。
