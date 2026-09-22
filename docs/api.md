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
| `relations` | 地支关系派生：`hits`（命中清单）、`groups`（六组关系各自的 `ruleId` 与证据类别）、`xun`（日柱所在旬、旬名、两个空亡地支）、`skipped`（缺表而整体跳过的分组） |
| `manifest` | 版本清单 |

输入契约由 `validateCivilInput()` 统一执行：月份、日期、时分秒和经度越界会在进入天文计算前抛出
`code === 'INVALID_INPUT'` 的错误，并带有 `field` 字段。页面可以把同一错误映射为表单提示，
不会因为 JavaScript 日期自动进位而悄悄换成另一张盘。

第二个参数可指定规则集：`castBazi(input, { ruleSetId: 'bazi-zichu-0.1.0' })`（默认 `bazi-core-0.1.0`）。

## 紫微斗数

```js
import { castZiwei, validateZiweiChart, palaceNameAliases } from 'suanming-core';

const ziwei = castZiwei({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});
// 第二参数可指定规则集：castZiwei(input, { ruleSetId: 'ziwei-core-0.1.0' })（仅主星辅星骨架）
// 默认 ziwei-core-0.2.0：含 38 杂曜与长生/博士/将前/岁前四组十二神
```

返回字段：

| 字段 | 内容 |
| --- | --- |
| `kind` | `'ziwei'`，与四柱结果区分 |
| `time` | UTC 儒略日、真太阳时分钟数、时辰索引与时辰地支 |
| `lunar` | 农历年干支（正月初一换年）、月序、闰月、日数、月长、起宫用月索引 |
| `soul` / `body` | 命宫与身宫（`palaceIndex` / `branch` / `stem`） |
| `fiveElements` | 五行局：`name` / `element` / `value`（局数） |
| `palaces` | 十二宫（寅基）：宫干、宫支、宫名、三层星曜、四化、四组十二神、大限、小限 |
| `stars` | 全盘 66 颗星，各带 `tier`（`major` / `auxiliary` / `minor`）/ `group` / `palaceIndex` / `branch` / `palaceName` |
| `masters` | 命主与身主：`soulMaster`（按命宫地支）/ `bodyMaster`（按生年地支） |
| `twelveGods` | 四组十二神：`changsheng` / `boshi` / `jiangqian` / `suiqian`，各带 `gods` / 起宫 / 方向 |
| `mutagens` | 生年四化（星名 + 禄权科忌） |
| `decadal` | 大限顺逆与十二限；**未传 `gender` 时为 `null`** |
| `xiaoxian` | 小限起宫与方向；**未传 `gender` 时为 `null`** |
| `facts` / `manifest` | 与四柱同一套事实图与版本清单 |

`validateZiweiChart(ziwei)` 校验十二宫齐全、干支与宫名合法、主星不重不漏。

宫位级字段：`majorStars` / `auxiliaryStars` / `minorStars` 是三层星名的扁平数组，
`changsheng12` / `boshi12` / `jiangqian12` / `suiqian12` 是该宫的四组十二神取值。
**取层请用 `tier` 字段**，不要用「有无某字段」来判层——加新星曜时会静默出错。
未传 `gender` 时，`changsheng12` 与 `boshi12` 为 `null`（方向依赖性别），将前与岁前照常生成。

宫名别名（通行派「交友」= 古法「奴仆」= 参照实现「仆役」）用 `palaceNameAliases('交友')` 取，
跨实现比对时先对齐名称再逐宫比较，避免把名称差异当成星曜差异。

索引约定、计算顺序与未纳入范围见 [紫微斗数盘系](ziwei-model.md)。

## 多流派并列

```js
import { compareSchools } from 'suanming-core';

const result = compareSchools(input);
// compareSchools(input, { ruleSetIds: ['bazi-core-0.1.0', 'bazi-zichu-0.1.0'] })

result.schools;      // [{ ruleSetId, ruleSetHash, system, school, chart, wuxing, facts, manifest }]
result.divergences;  // [{ path, values: [{ ruleSetId, value }], rules: [{ ruleSetId, rule }] }]
result.agreement;    // 各派取值一致的字段路径
result.disclaimer;   // 并列展示、不判定孰是孰非
```

不返回 `answer` / `winner` / `recommended`：本工程并列分歧，不做裁决。
少于两套规则集或 id 重复会直接抛错，不会退化成单流派结果冒充对比。

并列**只在同盘系内成立**：默认取 `listRuleSets({ system: 'bazi' })`。
四柱有 `pillars`、紫微有 `palaces`，字段不同构，跨盘系比较没有意义。
可用 `listRuleSets({ system })` 查看某个盘系下有哪些规则集。

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

## 地支关系派生

```js
import { deriveRelations, relationHits, RELATION_GROUPS, PILLAR_LABELS } from 'suanming-core';

const rel = deriveRelations(chart.pillars, getRuleSet());
// → {
//     dayPillar: '丙寅',
//     xun: { index: 0, name: '甲子旬', voidBranches: ['戌', '亥'] },
//     hits: [{ kind, name, branches, positions, complete, element, ruleId }],
//     groups: { clash: { ruleId, evidence }, combine: {...}, ... },
//     skipped: []
//   }
```

`kind` 取 `clash`（六冲）/ `combine`（六合）/ `trine`（三合）/ `half-trine`（半合）/
`punishment`（相刑）/ `self-punishment`（自刑）/ `harm`（六害）/ `void`（旬空）。
`positions` 是 `year` / `month` / `day` / `hour` 的子集，`complete` 表示三合、三刑是否三支全见。

`relationHits(rel, { kinds, position })` 按类型与柱位筛选；两者都可省略。
空亡按**日柱所在旬**判定，因此日柱自己永远不会落在自身旬空内。

每个 `hit.name` 都是规则集登记的中文关系名（`子午冲`、`子丑合土`、`寅巳害`、
`寅巳申三刑`、`戌空亡` …）。`kind` 里的英文枚举是内部实现细节，**不要直接拿去展示**；
规则表万一漏写 `name`，派生层兜底为「表内两支 + 关系后缀」，绝不返回裸地支对。

**缺表即整组跳过**：规则集没有登记某组关系时，该组不出现在 `groups` 里，
分组名进入 `skipped`，不会回退到内置默认表。

## 前事清单

```js
import { pastEvents, PAST_EVENT_BOUNDS } from 'suanming-core';

const items = pastEvents(chart, { ruleSet, asOfYear: 2026 });
// items: [{ id, statement, basis: { palace, tenGod, relation, ruleId }, tier, uncertainty }]
// items.skipped  — 因规则集缺条目而整体跳过的清单项（非枚举）
// items.ruleSet  — 本次使用的规则集 id（非枚举）
```

- 输出 5–8 条（`PAST_EVENT_BOUNDS` 为 `{ min: 5, max: 8 }`），只读 `castBazi` 的输出，
  不碰历法、不排盘、不读当前时间。
- `tier` 只有「轻 / 中 / 重」三档。宫位条目按项目修正规则 R-01 分档
  （空亡再逢刑冲记重，见刑／冲／害／空亡任一记中，无冲击记轻）；
  其余条目按结构偏离中性的程度分档：月令克日主记重、日主克月令记中，
  十神某一类占七处落点的 4 处及以上记重、3 处记中，
  流年同一类反复 5 次及以上记重、4 次记中。只描述结构，不判吉凶。
- `asOfYear` 必须由调用方显式传入；缺省时省略流年类条目 —— 不用「现在」当默认值，
  否则同一份盘在不同日子会得出不同清单。
- 每条 `basis.ruleId` 都能在传入的规则集里解析出来；解析不到的条目不输出，记入 `skipped`。
- `basis.relation` 只出现中文关系名（`子午冲`、`丑午害` …），英文枚举不上展示层。
  一条跨柱关系只在最早一个在清单里有条目的宫位（月 → 日 → 时）完整展开，
  其它相关宫位写作「共见」，因此同一条关系不会在清单里被写两遍。
- `statement` 只给盘面结构和可核对的具体方向，不出现内部规则编号、档位字样，
  也不把程度档再念一遍；程度仍只看 `tier`。

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

listRuleSets();                     // [{ id, system, version, title, school, hash, ruleCount, divergences }]
listRuleSets({ system: 'bazi' });   // 只要四柱流派；'ziwei' 同理
systemOf(getRuleSet());             // 规则集所属盘系
ruleSetIdsOf('ziwei');              // 某盘系下的全部规则集 id
ruleEntries(getRuleSet());          // 全部带 ruleId 的规则条目
auditRuleSet(getRuleSet());         // { ok, errors, warnings, ruleCount, sourceCount }
auditFactGraph(chart.facts);        // { ok, errors, factCount }；按事实图清单解析盘系规则集
auditFactGraph(ziwei.facts);        // 紫微事实图同样可审计，无需手动指定规则集
```

## 版本工具

```js
import { ENGINE_VERSION, parseVersion, compareVersions, satisfiesRange } from 'suanming-core';

satisfiesRange('>=0.5.0 <0.6.0', ENGINE_VERSION);   // 规则集的引擎版本区间是否覆盖当前引擎
parseVersion('0.4.0');                              // { major, minor, patch, pre }
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
import { lunarDateOf, lunarYearOf, lunarMonthAnchors, numberedLunarMonths } from 'suanming-core';

lunarDateOf(2005, 7, 13);   // { monthNumber, leap, day, days, monthStartJd, endJd }
lunarYearOf(2005, 7, 13);   // 以正月初一换年：{ lunarYear, ganzhi, monthNumber, leap, day, ... }
```

`lunarYearOf` 的换年口径是**农历正月初一**（紫微用），与四柱的立春换年不同；
两者各自可溯源，不互相换算。其中无中气月份只标记为闰月候选，完整历书还需要继续校验年界和历法规则。

## 示例

```bash
npm run example
```
