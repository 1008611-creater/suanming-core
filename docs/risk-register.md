# 当前风险登记表

风险等级沿用 `AGENTS.md`：L0 文档/样式，L1 单模块逻辑，L2 跨模块/API，L3 权限、数据、部署或架构。

| 风险 | 等级 | 当前控制 | 证据/下一步 |
| --- | --- | --- | --- |
| 网页与核心算法漂移 | L3 | `web/engine.js` 由 `src/` + `rules/` 生成；镜像自动同步；来源指纹回归 | `npm run verify`、`web-engine-sync-smoke` |
| 非法输入导致错误或静默换盘 | L2 | `validateCivilInput` 在四柱/紫微入口拒绝边界值；页面显示具体错误 | `tests/input-validation-smoke.js` |
| 用户输入形成 HTML 注入 | L2 | 页面层统一转义；姓名安全回归；浏览器恶意姓名验证 | `tests/web-security-smoke.js`、Chromium 复核 |
| 隐式当前时间破坏复现 | L2 | 核心层禁止 `Date.now()`；展示层显式传入 `asOfYear` | `npm run check:architecture` |
| 发布后线上版本未更新或缓存旧产物 | L3 | 发布清单、入口 no-cache 约束、回滚方案 | 已发布 `df4bcf80acfc899b` 并完成真实 Chromium 复核；发布前备份仍保留，可按回滚方案恢复 |
| 紫微未完成能力被误认为已实现 | L1 | 产品规格、README 和 review 明确标注后续范围；未登记能力整组跳过 | `docs/product-spec.md`、`docs/architecture.md` |
| 第三方数据许可证或供应链变化 | L2 | 生成脚本记录来源与许可证；运行时无外部依赖 | 依赖变更时补依赖审计 |

任何 L3 风险未关闭时，不得把版本标记为已发布；可以完成代码实现，但必须保留“待发布验证”状态。
