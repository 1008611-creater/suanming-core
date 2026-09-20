# 贡献约定

提交前运行 `npm run verify`。涉及天文、时区、节气、月相或干支边界的修改必须增加回归样例，并记录参考数据或误差预算。

排盘计算必须保持确定性；解读层不能反向修改排盘结果，也不能输出没有 `fact_id` 来源的结论。真实出生资料、地址和私人命盘不得提交到仓库。

## 交付顺序

先阅读 `AGENTS.md`、`PROJECT_CONTEXT.md` 与 `docs/INDEX.md`，再按任务类型补齐产品规格、架构决策、实施计划和验收条目。修改 `src/` 或 `rules/` 后必须重建 `web/engine.js`，不要手工编辑生成物；修改网页后通过 `npm run verify` 同步根目录 `app/` 镜像。若新增展示时间或未来流年，必须显式传入 `asOfYear`，不得在核心模块调用 `Date.now()` 或隐式读取当前年份。

## 新增流派

流派差异优先写成规则集的 `parameters` 取值（`dayBoundaryMode`、`luckDirectionMode`、`luckStartRounding`、`hiddenStemWeights`），
不要让计算代码出现 `if (流派 === ...)` 分支。新增规则集必须：

1. 声明 `engineCompatibility`，覆盖当前 `ENGINE_VERSION`；
2. 每条规则带 `ruleId` / `label` / `confidence` / `evidence` 与已登记的 `source`；
3. 通过 `auditRuleSet`，并补一个测试证明它相对默认集的分歧是真实且可枚举的；
4. **新增能力对旧规则集必须透明**：计算层不得出现「某个版本才有某张表」的判断，
   而要写成「规则集登记了就安，没登记就整组跳过」。0.1.0 与 0.2.0 并存是这条约束的实例。

新增星曜时必须同时更新：规则集的 `starOrder`、盘系层的事实生成、以及按 `tier` 分层的测试。
**不要用「有无某个字段」判断星曜层级**——加新星曜时会静默出错（0.5.0 加杂曜时曾把 38 颗杂曜判成辅星）。

不得为「多流派」引入裁决逻辑：不输出 `answer` / `winner` / `recommended`，不把多套结果加权合并。
