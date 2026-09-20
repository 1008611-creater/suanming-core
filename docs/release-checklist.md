# 发布清单

发布属于 L3 变更，必须完成以下清单并保留证据：

## 发布前

- [ ] 阅读 `AGENTS.md`、`CONSTRAINTS.md`、`docs/product-spec.md` 和本版本 `docs/acceptance.md`。
- [ ] `npm run verify` 通过；记录引擎来源指纹和测试数量。
- [ ] `npm run package:release` 生成带版本与引擎指纹的静态发布包；上传前核对 `release-manifest.json`。
- [ ] 真实浏览器验证首页、排盘页、自检页；记录桌面、窄屏、空输入和错误输入结果。
- [ ] 确认 `app/` 已由 `web/` 自动同步，且入口不包含真实个人资料。
- [ ] 检查 `git diff`、隐私扫描和依赖许可证；不得提交凭据、私人命盘或临时产物。
- [ ] 确认回滚目标、执行人和验证方式，见 `docs/rollback.md`。

## 发布动作

- [ ] 只发布 `web/` 同步后的 `app/` 静态产物和必要文档。
- [ ] 部署后先验证 HTTPS、入口 HTML、脚本加载和关键用户流程。
- [ ] 记录线上来源指纹与本地 `web/engine.js` 一致。

## 发布后

- [ ] 页面控制台无 4xx/5xx 和未捕获异常。
- [ ] 若关键流程失败，停止继续扩大流量并按回滚方案恢复上一版本。
- [ ] 更新 `docs/acceptance.md`、`CHANGELOG.md` 和版本状态。
