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
| 解释层判词超出盘面依据（说了盘上没有的事） | L2 | 前事清单只读已算出的结构；每条必须带可解析的 `ruleId`，解析不到就不输出并记入 `skipped` | `tests/past-events-smoke.js`、`tests/relations-missing-table-smoke.js` |
| 面向用户的位置出现比例承诺（百分比、「准确率」） | L2 | 打标只汇总条数；页面文本与业务文档机械扫描禁用词 | `tests/check-page-smoke.js`、`tests/business-copy-compliance-smoke.js` |
| 流年类判词隐含当前时间，破坏复现 | L2 | `asOfYear` 必须由调用方显式传入；缺省即省略流年条目，绝不用「现在」兜底 | `tests/past-events-smoke.js`、`npm run check:architecture` |
| 真实客户案例随业务文档入库 | L3 | 业务文档与真实案例分离；`.gitignore` 排除私有业务目录与报告输出目录；两篇样稿统一标「合成示例（非真实客户）」 | `tests/business-copy-compliance-smoke.js`、`npm run security`、提交前人工复核 |
| 报告工具把客户数据带出本机 | L3 | 出报告页复用同一份本地引擎产物，无网络请求；客户数据不出本机 | 报告页无 `fetch` 断言 + 真实浏览器复核 |

任何 L3 风险未关闭时，不得把版本标记为已发布；可以完成代码实现，但必须保留“待发布验证”状态。
