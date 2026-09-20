# 项目上下文

## 当前系统

`suanming-core` 是确定性的传统历法与命理计算核心，包含四柱/大运与紫微两个并列盘系。时间层和农历层共享，但两个盘系不互相换算，也不合并成一张综合盘。

## 依赖边界

```text
web/app.js -> web/engine-adapter.js -> web/engine.js
                                         ↑
                               src/ + rules/（唯一算法源）
src/interpret -> facts（只解释，不重算）
```

页面端 `app/` 是 `suanming-core/web/` 的部署镜像；不得恢复旧的 `bazi.js`、第二套旺衰算法或写死的个人资料。

## 质量入口

- `npm test`：自动发现并运行 `tests/` 下全部测试。
- `npm run verify`：类型/契约检查、语法/静态检查、重建网页引擎、部署镜像同步、架构扫描、全量测试、隐私扫描和交付物完整性检查。
- `npm run typecheck`：检查 JavaScript 公共 API、package exports 与 Schema 契约。
- `npm run lint`：检查所有源文件语法并拦截动态执行语法。
- `npm run test:performance`：检查网页静态资源预算，防止生成物无意膨胀。
- `npm run check:architecture`：检查单一算法源、解释层边界和显式展示时间。
- 真实浏览器验收：按 `docs/acceptance.md` 的 B/C 组执行。
- 发布与回滚：按 `docs/release-checklist.md` 和 `docs/rollback.md` 执行。

## 已知边界

当前明确未完成的能力写在 README 的“尚未完成”段落中。未完成能力必须显式跳过，不得用默认值或文案伪装成已实现。
