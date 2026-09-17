# 更新记录

## 0.5.1

### 网页端与核心引擎合并为单一算法源

- **删除 `web/bazi.js`**：网页此前自带一份与 `src/` 平行演化的排盘代码，两处会各自漂移。
  现在 `web/engine.js` 由 `scripts/build-web-engine.mjs` 从 `src/` + `rules/` 打包生成，
  产物内嵌 `WEB_ENGINE_SOURCE_HASH`（内容指纹）与 `WEB_ENGINE_SOURCE_FILES`（源文件数）。
- 新增 `web/engine-adapter.js`：把引擎的契约输出翻译成页面视图模型，**不做任何历法计算**。
  真太阳时、旬空、大运、流年、旺衰口径全部来自引擎，页面不再自算。
- `web/app.js` 改为 `import { API } from './engine-adapter.js'`；`web/analysis.js` 明确限定为
  解释与评分层，阈值口径集中到 `WANG_SHUAI_THRESHOLDS` 表并随口径切换。
- 新增 `tests/web-engine-sync-smoke.js`（指纹、源文件数、关键导出、黄金盘、两套校验）与
  `tests/web-adapter-smoke.js`（四柱回读、真太阳时、五行口径、大运、流年、紫微），
  页面与核心算法一旦分叉立即失败。

### 排盘页新增紫微斗数盘面

- 4×4 传统盘式：外圈十二宫按地支固定方位，宫心显示农历年、五行局、命身宫、命主身主与生年四化。
- 每宫显示宫名、宫干支、主星（带禄权科忌标记）、辅星杂曜、大限年龄、长生与博士。
- 四化按 `palaceIndex` 取全局表，修正「宫上四化为空数组」导致的漏标。

### 计算修正

- 月柱口径统一到节气边界，新增 `tests/month-pillar-invariant-smoke.js`（120 个月干全表核对）。
- 新增均时差计算（Meeus 28.b）与 `tests/true-solar-time-smoke.js`；真太阳时不再只做经度修正。
- 旺衰阈值按五行口径分档，新增 ADR-0007 记录 4000 样本标定结果。

### 网页端可复核性

- 排盘结果新增「计算口径与来源」卡片：引擎版本、星历模型、四柱/紫微规则集、
  五行与旺衰口径、引擎内容指纹与源文件数。
- 补充 favicon 与页面描述，消除线上控制台的 404 噪声。

### 工程化

- 新增 `npm run verify` 交付质量门：重建网页引擎 → 全量测试 → 隐私扫描 → 交付物完整性。
  CI 由 `npm test` 切换为 `npm run verify`。
- 新增 `scripts/privacy-scan.mjs`：扫描所有将入库文件，拦截凭据形态、私钥与硬编码生日。
- 新增产品规格、工程约束、验收标准、实施计划四份文档与 ADR-0006/0007/0008。

## 0.5.0

### 紫微斗数：杂曜与十二神（把「细节星」变成可引用的确定事实）

- 新增规则集 `ziwei-core-0.2.0`（通行派，33 条 ruleId），在 0.1.0 的骨架之上补入
  38 颗杂曜与四组十二神、命主身主。旧的 `ziwei-core-0.1.0` **保留且仍可用**，
  用来证明「换规则集对引擎透明」——引擎不判断哪个版本有杂曜，缺表就整组跳过。
- 新增 `src/charts/ziwei/minor-stars.js`：38 颗杂曜按年系 26（含红鸾天喜）、
  月系 6、日系 4、时系 2 分五组安放，以及命主身主查表。
- 新增 `src/charts/ziwei/twelve-gods.js`：长生、博士、将前、岁前四组十二神，
  各带起宫与方向，供下游按宫检索。
- `palaces[]` 新增 `majorStars` / `auxiliaryStars` / `minorStars` /
  `changsheng12` / `boshi12` / `jiangqian12` / `suiqian12`；
  盘对象新增 `masters`（命主身主）与 `twelveGods`。全盘星数从 28 增至 **66**。
- 星曜新增 `tier` 字段（`major` / `auxiliary` / `minor`）与 `group` 字段
  （年/月/日/时系）。**下游必须按 `tier` 取层**，不能再用「有无 `series`」判层。

### 命主身主的口径修正

- **命主按命宫地支取表内 `[0]` 位，身主按生年地支取 `[1]` 位**，两者取支口径不同。
  身主常被误写成「按身宫地支取」：基准盘命宫卯、身宫亥、生年支酉，
  按身宫取会得「天机」，按生年支取得「天同」——参照实现为后者。
  12 张参照盘逐张核对后确认，已在代码注释、规则集 label 与文档三处显式声明。

### 计算

- 三处依赖改为显式传递而非各算一次：五行局（起紫微 / 大限起运 / 长生十二神）、
  禄存宫位（博士十二神）、左辅右弼文昌文曲宫位（日系杂曜）。
  各算一次必然漂移，会让星盘与限运、十二神互相对不上。
- 日系星用「日序」而不是农历日：晚子时取当日、其余时辰取前一日，一位之差整组错宫。
- 天伤、天使按宫位（交友宫、疾厄宫）定位，随命宫移动，与年支无关。
- 未提供 `gender` 时长生与博士十二神为 `null`，将前与岁前照常生成——宁缺勿造。

### 验证

- **新增 12 张参照盘交叉验证**（1949—2030，男女各半，含闰月与跨年）：
  每盘逐宫比对三层星曜与四组十二神，外加五行局、命宫、身宫、命主、身主，
  合计 144 宫 × 9 项，与 `iztro` v2.6.1 官方打包产物**差异为 0**。
  该测试把期望值硬编码在 `tests/ziwei-cross-reference-smoke.js` 中，不依赖外部参照目录，CI 可独立复现。
- 新增 `tests/ziwei-minor-stars-smoke.js`（38 颗杂曜逐宫、命主身主、日系联动）、
  `tests/ziwei-twelve-gods-smoke.js`（4 组 × 12 宫、起宫与方向可溯源、缺性别留空）。
- `tests/ziwei-golden-smoke.js` 改按 `tier` 判层。原先用 `series` 判主星、
  用 `!series` 判辅星，会把新加入的 38 颗杂曜误判成辅星——这是加杂曜时暴露出的测试假设缺陷，
  已作为回归点写进注释。测试从 26 项增加到 29 项。

### 版本

- `ENGINE_VERSION` 与 `package.json` 升到 `0.5.0`；三套规则集的
  `engineCompatibility` 上界放宽到 `<0.6.0`，使旧规则集在新引擎下仍通过审计。

## 0.4.0

### 紫微斗数：第二盘系落地（验证架构不是四柱专用）

- 新增 `ziwei-core-0.1.0` 规则集（通行派，23 条 ruleId）：年界、月索引、时辰索引、晚子进日、
  命身宫、宫名与别名、大限顺逆与起运、小限起宫、五虎遁、五行局纳音、起紫微诀、十四主星安星、
  禄存天马魁钺辅弼昌曲空劫火铃、生年四化。全部带 `evidence` / `source` / `confidence`。
- 新增 `src/charts/ziwei/`（palace / stars / chart）与排盘入口 `castZiwei(input)`，
  输出 `palaces` / `stars` / `soul` / `body` / `fiveElements` / `mutagens` / `decadal` / `xiaoxian` / `facts` / `manifest`。
- 新增 `validateZiweiChart(chart)`：十二宫齐全、干支与宫名合法、主星不重不漏。
- 紫微与四柱**共用 L0 时间层与 L2 农历层**，但年界（农历正月初一 vs 立春）与日界
  （晚子进日 vs 子正/子初）各按自己的口径，并列而不互相换算。见
  [ADR-0005](docs/decisions/ADR-0005-ziwei-as-second-chart-system.md) 与 [紫微斗数盘系](docs/ziwei-model.md)。

### 规则集按盘系分组

- 规则集新增 `system` 字段（`bazi` / `ziwei`）。分歧只在**同盘系内**定义：
  两套盘系的 `ruleId` 命名空间不同，互相比较会把「另一盘系的全部规则」误报成分歧。
- `listRuleSets({ system })` 可按盘系过滤；`compareSchools()` 默认只并列四柱流派。
  新增 `systemOf()` / `ruleSetIdsOf(system)` / `REFERENCE_BY_SYSTEM`。
- `auditFactGraph(graph)` 默认按事实图清单里的 `ruleSet` 解析盘系，不再硬编码四柱默认集——
  否则紫微事实图的每一条都会被判成「未知 ruleId」。
- `compareSchools()` 每项新增 `system` 字段。

### 计算

- 新增 `lunarYearOf(year, month, day)`：以**农历正月初一**换年，供紫微使用；
  与四柱的立春换年并存，两者各自可溯源。
- `lunarDateOf` 返回值补 `days`（当月天数）与 `endJd`（月末儒略日），
  供起紫微与晚子进日的跨月回落使用。
- 五行局只计算一次并向下传递：它同时是「起紫微星的除数」与「大限起运虚岁」，
  两处各算一次必然漂移，会让星盘与限运对不上。
- 宫名别名显式登记（通行派「交友」/ 古法「奴仆」/ 参照实现「仆役」），
  由 `palaceNameAliases()` 导出，避免下游把名称差异当成星曜差异。
- 星曜规范顺序写入规则集 `starOrder`，避免星序随函数书写顺序漂移造成假差异。

### 验证

- 安星结果与 `iztro` v2.6.1 官方打包产物逐宫交叉核对：基准盘、闰月专项 21 项、
  随机批次 48 项、早晚子时密集 22 项、大限 12 限、小限 208 项，**差异为 0**
  （唯一系统性差异是宫名「交友/仆役」，已按别名登记）。
- 新增 `tests/ziwei-golden-smoke.js`、`tests/ziwei-boundary-smoke.js`（早晚子时 / 闰月切分 / 真太阳时 / 确定性）、
  `tests/dual-system-smoke.js`（四柱与紫微并列共存、互不污染）。测试从 23 项增加到 26 项。
- `rules/index.js` 的 `divergenceKeys` 改为同盘系比较，`tests/multi-school-smoke.js` 相应按盘系断言。

### 版本

- `ENGINE_VERSION` 与 `package.json` 升到 `0.4.0`；两套四柱规则集的
  `engineCompatibility` 放宽到 `">=0.3.0 <0.5.0"`，紫微规则集为 `">=0.4.0 <0.5.0"`。
- `package.json` 新增 `./ziwei` 导出子路径。

## 0.3.0

### 多流派并列（把文档承诺变成代码能力）

- 新增第二套规则集 `bazi-zichu-0.1.0`（子初派），与默认的 `bazi-core-0.1.0`（通用派）在四处取值不同：换日基准、大运顺逆、起运取整、五行力量计法。
- 新增 `compareSchools(input)`：同一输入跑多套规则集，输出每派各自的命盘、事实图与规则指纹，外加逐字段分歧清单。
  **不返回裁决字段，不合并成综合命盘**——分歧只能被呈现，不能被抹平。见 [ADR-0004](docs/decisions/ADR-0004-multi-school-parallel.md)。
- `listRuleSets()` 的每项新增 `divergences`：枚举该规则集相对默认集取值不同的 `ruleId`。
- 流派分歧改用机器可读参数表达，计算代码不再分叉：`dayBoundaryMode`、`luckDirectionMode`、`luckStartRounding`、`hiddenStemWeights`。
- 新增 `engineCompatibility` 强制校验：规则集必须声明所支持的引擎版本区间，当前 `ENGINE_VERSION` 落在区间外会让审计失败。

### 计算

- **子初换日落地**：`dayBoundaryMode: 'zi-chu-true-solar'` 时，真太阳时 23:00 后即进次日日柱。
  日柱换日后**时干同步使用次日日干**——否则日柱换了时干没换，两柱会自相矛盾。
- **大运顺逆可换口径**：`luckDirectionMode: 'gender-only'` 支持「男顺女逆，不问年干阴阳」的流派。
- **起运取整可换口径**：`luckStartRounding: 'whole-year'` 支持取整到整年，`method` 字段随口径变化，结果不会被误读。
- 新增五行力量派生层 `elementStrength()`：权重来自规则集，输出力量、占比、排名与主导五行。
- 版本常量集中到 `src/version.js`，新增 `parseVersion` / `compareVersions` / `satisfiesRange`，无法解析的版本区间一律判为不兼容。

### 工程

- 新增 `tests/multi-school-smoke.js`（并列、分歧可枚举、各派独立可溯源、红线断言）与 `tests/wuxing-smoke.js`（权重、排名、版本区间）。
- `tests/rule-set-smoke.js` 改为断言「至少一套且每套自洽」，不再写死规则集数量——新增流派不该让测试失败。
- 自检清单补入第二套规则集与三个新模块。测试从 21 项增加到 23 项。

## 0.2.0

### 规则集独立成层

- 新增 `rules/` 目录与 `bazi-core-0.1.0` 版本化规则集，四柱取值、藏干表、十神映射、大运顺逆与起运算法全部改为从规则集读取，计算代码不再内嵌流派字面量。
- 每条规则标注 `evidence`（astronomical / calibration / convention / traditional），天文可验证的量与传统约定不再共用同一置信度口径。
- 规则集计算内容指纹并写入 `manifest.ruleSetHash`；规则改动而版本未升会被指纹暴露。
- 新增 `auditRuleSet`、`auditFactGraph`、`validateTraceability`，缺出处、缺证据类别、置信度超过规则本身都会让 CI 失败。

### 计算正确性修复

- **修复日柱换日基准**：原先按 UTC 儒略日取日序，东八区凌晨出生会整体错一天。改为按出生地民用日计算，并加入回归用例。
- **修复时柱天干**：原先偏移量误用「地支序号折半」，导致偶数序地支重复前一柱天干（戊日辰时错算为甲辰）。改为五鼠遁的正确步长，并加入 10 日干 × 12 时辰的全表校验。
- **修复农历闰月月序**：闰月必须沿用前一月月序，反向推排原先取错参考月，2023 年闰二月被错标为闰三月。
- **修复农历换日边界**：农历月改为从「包含朔时刻的中国民用日」起算，不再按朔的瞬间切分。
- **修复中气比较单位**：中气改用中国民用日与月份边界比较，避免深夜中气被算进前一天而导致闰月误判（2025 年闰六月）。

### 农历层

- 农历编号以含冬至之月为十一月向前后推排，无中气之月为闰月。
- 新增 `lunarDateOf` 公历转农历，以及把农历结论接入事实图的 `lunarMonthFacts` / `lunarDateFacts`。
- 新增 16 个公开发布日期的黄金用例（2023—2026 春节、元宵、端午、中秋、闰二月、闰六月、跨年冬月）。

### 工程

- 新增纯 JS 的 FNV-1a 哈希与稳定序列化，可对输入与事实图复算比对。
- 权威 Schema 移到顶层 `schema/chart.schema.json` 并补全；`src/schema/` 下改为指针，消除两份定义漂移的风险。
- `scripts/check.js` 改为自动发现 `tests/` 下全部测试，路径相对文件定位，任意工作目录都能运行。
- 测试从 12 项增加到 21 项。

## 0.1.0

- 建立 VSOP87D、章动、Delta-T、节气和月相基础计算。
- 支持 IANA 时区、中国历史夏令时和真太阳时。
- 支持四柱、藏干、十神、大运和事实图输出。
- 支持农历朔日、月份区间、中气判断和闰月候选标记。
- 增加命盘 Schema、结构校验、示例、回归检查和 GitHub Actions。

## 后续

紫微的斗君、流年流月流日流时四化与流曜，以及四柱神煞、格局判定与完整解释语料仍是后续版本工作；
农历历书显示目前只到月份编号层。
这些部分不会被伪装成已经完成的确定能力。
