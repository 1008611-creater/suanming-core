# 架构审查记录：2026-09-21

## 范围

审查本轮“单一算法源 + 可验证生命周期”改造，覆盖目录边界、质量门、输入校验、网页镜像、隐私和发布回滚。

## 结论

**通过，blocking 问题为 0。** 当前变更符合 `docs/product-spec.md`、`CONSTRAINTS.md` 和 `docs/architecture.md` 的核心不变量。

## 检查证据

- 单一算法源、解释层边界和显式展示时间：`npm run check:architecture` 通过。
- 公共 API、package exports、Schema：`npm run typecheck` 通过。
- `package.json` 与 `ENGINE_VERSION` 版本一致性：`npm run typecheck` 通过。
- JavaScript 语法和动态执行风险：`npm run lint` 通过（56 个文件）。
- 网页资源性能预算：`npm run test:performance` 通过（总量 359,712 bytes，引擎 176,452 bytes）。
- 3 个网页的标签关联、语言声明、标题、描述和按钮名称：`npm run test:accessibility` 通过。
- 38 项工程测试、3 项 Node 测试、隐私扫描和交付物检查：`npm run verify` 通过。
- 真实 Chromium 排盘页与自检页：控制台错误数均为 0；恶意姓名以文本显示，不执行 HTML。
- `web/engine.js` 与根目录 `app/engine.js` 指纹一致。

## 非阻塞遗留风险

1. 紫微斗君、流年流月流日流时四化与流曜尚未实现，已在产品规格和 README 明确标为后续范围。
2. 线上部署已完成并复核：提交 `57b158b` 已发布，线上引擎指纹为 `df4bcf80acfc899b`，黄金盘、自检页与恶意姓名回归均通过；发布前备份仍保留，支持按回滚方案恢复。
3. `docs/decisions/` 是历史 ADR 目录，已通过 `docs/adr/README.md` 提供模板兼容入口；后续新增 ADR 按统一入口登记。
