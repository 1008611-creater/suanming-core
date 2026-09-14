# suanming-core

可复核的传统历法与命理计算核心。输入、天文历法、排盘、规则事实图、解读、服务分层；计算层不调用大模型。

## 设计原则

- **同输入同输出**：同输入 + 同引擎版本 + 同星历版本 + 同规则集指纹，必须得到完全相同的输出。
- **可溯源**：每个结论都指向事实图中的 `fact_id`，每条事实都指向规则集中已登记的 `rule_id`。引用不到来源的结论会被丢弃。
- **流派可并列**：规则集带版本与内容指纹。同一输入可用不同规则集分别计算，结果各自标注来源，不合并成单一「正确答案」。
- **证据分级**：天文可验证的量与传统约定分开标注，不共用同一个置信度口径。
- **隐私边界**：真实出生资料、地址与私人命盘不进入版本库。

## 使用

```js
import { castBazi, explain, validateChart, validateTraceability } from 'suanming-core';

const chart = castBazi({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});

chart.pillars;                  // 四柱
chart.luck;                     // 大运（含顺逆与起运算法标识）
chart.facts;                    // 事实图：每条事实带 rule_id / source / confidence / evidence
chart.manifest;                 // 版本清单：引擎、星历、Schema、规则集与规则指纹

validateChart(chart).valid;         // 结构校验
validateTraceability(chart).valid;  // 溯源校验
```

解读必须引用事实 ID，没有匹配事实的结论不会输出：

```js
explain(chart.facts, [
  { text: '年柱已计算', factIds: ['pillar.year'] },
  { text: '没有来源的结论', factIds: ['missing'] }   // 会被丢弃
]);
```

## 规则集

四柱取值、藏干表、十神映射、大运顺逆与起运算法都定义在版本化规则集里，计算代码不内嵌流派字面量。

```js
import { listRuleSets, auditRuleSet, getRuleSet } from 'suanming-core';

listRuleSets();        // 已登记的规则集及其内容指纹
auditRuleSet(getRuleSet()).ok;   // 规则是否都有出处、置信度与证据类别
```

详见 [docs/rule-sets.md](docs/rule-sets.md)。新增流派只需新增一个规则集目录并登记，不改计算代码。

## 文档

- [架构与核心不变量](docs/architecture.md)
- [规则集与证据分级](docs/rule-sets.md)
- [API 快速参考](docs/api.md)
- [四柱与大运计算边界](docs/bazi-luck.md)
- [天文模型](docs/astro-model.md)
- [验证策略](docs/validation.md)
- [使用边界](docs/compliance.md)
- [架构决策记录](docs/decisions/)

## 开发

```bash
npm test          # 必需文件检查 + tests/ 下全部测试
npm run example   # 运行示例
```

自检会自动发现 `tests/` 下的全部测试，新增测试不会被静默跳过。GitHub Actions 在 push 与 pull request 时运行 `npm test`。

## 状态

当前完成 L0 时间、L1 天文基础、L2 农历天文事实、L3 四柱与大运、L4 事实图与溯源审计、L5 解读骨架、L6 API 与自检。
**规则集 0.1.0 只覆盖通用派四柱**；更多流派、完整农历历书显示与解释语料仍在建设中，不会被伪装成已完成的能力。

版本变更见 [CHANGELOG.md](CHANGELOG.md)。
