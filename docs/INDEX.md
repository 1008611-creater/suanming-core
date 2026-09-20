# 文档索引

按任务读取最小必要上下文：

| 任务 | 必读文档 |
| --- | --- |
| 需求与范围 | `product-spec.md`、`acceptance.md` |
| 架构或依赖边界 | `architecture.md`、`../CONSTRAINTS.md` |
| 时间/历法修复 | `astro-model.md`、`validation.md`、相关 ADR |
| 四柱与大运 | `bazi-luck.md`、`rule-sets.md` |
| 紫微 | `ziwei-model.md`、`rule-sets.md` |
| API 或输出字段 | `api.md`、`../schema/chart.schema.json` |
| 发布与交付 | `acceptance.md`、`implementation-plan.md`、`../SECURITY.md` |
| 发布清单与回滚 | `release-checklist.md`、`rollback.md` |
| 风险与变更等级 | `risk-register.md`、`../AGENTS.md` |
| 性能与可访问性 | `../CONSTRAINTS.md`、`acceptance.md`、`../scripts/performance-smoke.mjs` |
| 代码审查 | `reviews/`、`decisions/` |
| 架构回归 | `npm run check:architecture` |

阶段产物约定：

```text
需求 -> docs/product-spec.md
约束 -> CONSTRAINTS.md
架构 -> docs/architecture.md / docs/decisions/
计划 -> docs/implementation-plan.md
验收 -> docs/acceptance.md
质量门 -> npm run verify
```

`docs/decisions/` 是历史 ADR 的事实目录；`docs/adr/README.md` 提供统一入口，新增架构决策优先使用 ADR 编号并同步两处索引。
