# 贡献约定

提交前运行 `npm test`。涉及天文、时区、节气、月相或干支边界的修改必须增加回归样例，并记录参考数据或误差预算。

排盘计算必须保持确定性；解读层不能反向修改排盘结果，也不能输出没有 `fact_id` 来源的结论。真实出生资料、地址和私人命盘不得提交到仓库。

## 新增流派

流派差异优先写成规则集的 `parameters` 取值（`dayBoundaryMode`、`luckDirectionMode`、`luckStartRounding`、`hiddenStemWeights`），
不要让计算代码出现 `if (流派 === ...)` 分支。新增规则集必须：

1. 声明 `engineCompatibility`，覆盖当前 `ENGINE_VERSION`；
2. 每条规则带 `ruleId` / `label` / `confidence` / `evidence` 与已登记的 `source`；
3. 通过 `auditRuleSet`，并补一个测试证明它相对默认集的分歧是真实且可枚举的。

不得为「多流派」引入裁决逻辑：不输出 `answer` / `winner` / `recommended`，不把多套结果加权合并。
