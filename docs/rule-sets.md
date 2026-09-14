# 规则集与证据分级

## 为什么把规则抽出来

排盘里有两类东西，混在一起就永远说不清一个结论到底靠什么：

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

## 盘系分组

规则集带 `system` 字段（`bazi` / `ziwei`）。**分歧只在同盘系内定义**：
四柱与紫微是两套不同的盘，`ruleId` 命名空间也不同，互相比较会把「另一个盘系的全部规则」
误报成分歧，分歧清单随之失去意义。因此：

- `listRuleSets()` 返回全部，每项带 `system`。
- `listRuleSets({ system: 'bazi' })` 只返回四柱流派；`compareSchools()` 默认即按此过滤。
- 跨盘系不能并列比较：它们的字段根本不同构（四柱有 `pillars`，紫微有 `palaces`）。

## 已登记的规则集

| 规则集 | 盘系 | 流派 | 换日基准 | 大运/大限顺逆 | 起运取整 | 五行力量 |
| --- | --- | --- | --- | --- | --- | --- |
| `bazi-core-0.1.0`（四柱默认） | bazi | 通用派 | 子正换日（民用日零点） | 阳年干男／阴年干女顺行 | 精确分数 | 天干 + 地支本气各计一次 |
| `bazi-zichu-0.1.0` | bazi | 子初派 | 子初换日（真太阳时 23:00） | 男顺女逆，不问年干阴阳 | 取整到整年 | 藏干加权 `[1, 0.5, 0.3]` |
| `ziwei-core-0.1.0`（紫微默认） | ziwei | 通行派 | 晚子时进日 | 阳支男／阴支女顺行，余逆行 | — | — |

紫微规则集覆盖命身宫、五行局、十四主星、十四辅星、生年四化、大限与小限，
其分歧点与四柱不共用命名空间，也不参与四柱的 `divergences` 计算。
详见 [紫微斗数盘系](ziwei-model.md)。


分歧点是**可枚举**的：`listRuleSets()` 的每一项都带 `divergences`，列出该规则集相对默认集取值不同的 `ruleId`。

```js
listRuleSets({ system: 'bazi' }).find(r => r.id === 'bazi-zichu-0.1.0').divergences;
// ['bazi.day.zi-chu-true-solar', 'bazi.luck.gender-only',
//  'bazi.luck.days-to-boundary-rounded-year', 'bazi.wuxing.element-weighted']
```

## 多流派并列

```js
import { compareSchools } from 'suanming-core';

const result = compareSchools(input);
// 也可只对比指定流派：
// compareSchools(input, { ruleSetIds: ['bazi-core-0.1.0', 'bazi-zichu-0.1.0'] })
```

返回结构：

| 字段 | 内容 |
| --- | --- |
| `schools` | 每个流派一份完整命盘，各带自己的 `ruleSetHash`、`manifest` 与事实图 |
| `divergences` | 逐字段列出分歧：`path`、各派取值、各派对应的 `ruleId` 与 `source` |
| `agreement` | 各派取值一致的字段 |
| `disclaimer` | 说明本结果并列展示、不判定孰是孰非 |
| `fieldOrder` | 参与对比的全部字段，`agreement` 与 `divergences` 的并集必须等于它 |

**设计红线**：`compareSchools()` 不返回 `answer` / `winner` / `recommended` 之类的裁决字段，也不把两套结果合并成一个「综合命盘」。分歧只能被呈现，不能被抹平。测试会断言这一点。

只有两侧取值确实不同时，字段才会进入 `divergences`：既不制造虚假分歧，也不隐藏真实分歧。

## 新增流派

1. 新建 `rules/<流派>-<版本>/ruleset.js`，沿用同一结构，声明 `system`，并在 `parameters` 里用机器可读的取值声明差异（如 `dayBoundaryMode`、`luckDirectionMode`、`hiddenStemWeights`）。
2. 在 `rules/index.js` 的 `RULE_SETS` 登记，并在 `REFERENCE_BY_SYSTEM` 里为该盘系指定参照规则集（分歧是相对参照集算的）。
3. 调用时传 `castBazi(input, { ruleSetId: '<流派>-<版本>' })`，或直接用 `compareSchools` 并列。
4. 新增流派会让 `listRuleSets()` 的项数变化，但不应让任何测试失败——测试断言的是「至少两套」与「每套都自洽」，不是写死的数量。

规则集还必须声明 `engineCompatibility`（如 `">=0.4.0 <0.5.0"`）。审计会校验当前 `ENGINE_VERSION` 落在区间内，版本对不上会让 CI 失败。

新增**盘系**（而非新增流派）的成本不同：需要新增一个盘系目录与排盘入口，
时间层（L0）与农历层（L2）应原样复用。紫微的引入验证了这一点，见 [ADR-0005](decisions/ADR-0005-ziwei-as-second-chart-system.md)。
