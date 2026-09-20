# ADR 统一入口

本项目早期把架构决策存放在 `docs/decisions/`。为兼容通用工程模板，`docs/adr/` 作为统一入口目录保留；现有 ADR 的事实内容仍以 `docs/decisions/` 为准。

新增架构决策时：

1. 使用下一个 `ADR-NNNN` 编号；
2. 写清背景、决策、替代方案、影响和验证命令；
3. 放入 `docs/decisions/`，并在本文件或 `docs/INDEX.md` 增加链接；
4. 若改变 API、规则集、部署或隐私边界，必须同时更新 `CONSTRAINTS.md` 与 `docs/acceptance.md`。

当前 ADR：

- [ADR-0001：VSOP87 参考系](../decisions/ADR-0001-vsop87-reference-frame.md)
- [ADR-0003：节气/中气边界](../decisions/ADR-0003-jie-zhongqi.md)
- [ADR-0004：同盘系多流派并列](../decisions/ADR-0004-multi-school-parallel.md)
- [ADR-0005：紫微作为第二盘系](../decisions/ADR-0005-ziwei-as-second-chart-system.md)
- [ADR-0006：网页单一引擎源](../decisions/ADR-0006-web-single-engine-source.md)
- [ADR-0007：旺衰阈值](../decisions/ADR-0007-wangshuai-thresholds.md)
- [ADR-0008：均时差](../decisions/ADR-0008-equation-of-time.md)
