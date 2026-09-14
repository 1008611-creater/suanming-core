# suanming-core

可复核的传统历法与命理计算核心。输入、天文历法、排盘、规则事实图、解读、服务分层；计算层不调用大模型。

## 设计原则

- 同输入、同星历版本、同规则集得到同输出。
- 节气、时区、夏令时、真太阳时都保留来源与不确定度。
- 流派差异作为参数或并列结果，不伪装成唯一答案。
- 解读必须引用 `fact_id`，没有事实来源的结论会被丢弃。

## 使用

```js
import { civilToUTC, shichenOfCivil } from 'suanming-core';
const utc = civilToUTC({year:2005,month:7,day:13,hour:8,minute:58}, 'Asia/Shanghai');
const hour = shichenOfCivil({hour:8,minute:58}, 118.18);
```

## 状态

当前完成 L0 时间与 L1 天文基础、事实图和 Schema 骨架；农历、四柱、规则集和黄金测试继续建设中。

每份结果都应携带 `createManifest()` 生成的版本清单，记录计算引擎、星历模型和规则集版本。

仓库的 GitHub Actions 会在 push 和 pull request 时自动运行 `npm test`。

版本变更见 [CHANGELOG.md](CHANGELOG.md)。
