# suanming-core

可复核的传统历法与命理计算核心。输入、天文历法、排盘、规则事实图、解读、服务分层；计算层不调用大模型。

支持**并列盘系**：四柱与大运（`bazi`）、紫微斗数十二宫与限运（`ziwei`）。两套盘系共用同一套时间层与农历层，各自独立可溯源。

## 设计原则

- **同输入同输出**：同输入 + 同引擎版本 + 同星历版本 + 同规则集指纹，必须得到完全相同的输出。
- **可溯源**：每个结论都指向事实图中的 `fact_id`，每条事实都指向规则集中已登记的 `rule_id`。引用不到来源的结论会被丢弃。
- **流派可并列**：规则集带版本与内容指纹。同一输入可用不同规则集分别计算，结果各自标注来源，不合并成单一「正确答案」。`compareSchools()` 会把分歧逐字段列出，并附上两侧各自的 `ruleId` 与出处。
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

紫微斗数是并列的第二盘系，同样输出事实图与版本清单：

```js
import { castZiwei, validateZiweiChart } from 'suanming-core';

const ziwei = castZiwei({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});

ziwei.palaces;       // 十二宫：宫干、宫支、宫名、星曜、四化、大限、小限
ziwei.soul;          // 命宫
ziwei.fiveElements;  // 五行局
ziwei.mutagens;      // 生年四化
ziwei.manifest;      // 版本清单

validateZiweiChart(ziwei).valid;
```

四柱以立春换年，紫微以农历正月初一换年；两者共用时间层与农历层，但**不互相换算**。
详见 [docs/ziwei-model.md](docs/ziwei-model.md)。

解读必须引用事实 ID，没有匹配事实的结论不会输出：

```js
explain(chart.facts, [
  { text: '年柱已计算', factIds: ['pillar.year'] },
  { text: '没有来源的结论', factIds: ['missing'] }   // 会被丢弃
]);
```

## 规则集

四柱取值、藏干表、十神映射、大运顺逆、起运算法与五行力量都定义在版本化规则集里，计算代码不内嵌流派字面量。

```js
import { listRuleSets, auditRuleSet, getRuleSet } from 'suanming-core';

listRuleSets();        // 已登记的规则集及其内容指纹与可枚举分歧点
auditRuleSet(getRuleSet()).ok;   // 规则是否都有出处、置信度与证据类别
```

已登记三套规则集，分属两个盘系。四柱两套在四处真实分歧上取值不同：

| 规则集 | 流派 | 换日 | 大运顺逆 | 五行力量 |
| --- | --- | --- | --- | --- |
| `bazi-core-0.1.0` | 通用派（默认） | 子正换日（民用日零点） | 阳年干男／阴年干女顺行 | 天干 + 地支本气各计一次 |
| `bazi-zichu-0.1.0` | 子初派 | 子初换日（真太阳时 23:00） | 男顺女逆，不看年干 | 藏干本气／中气／余气加权 |

同一输入并列两派：

```js
import { compareSchools } from 'suanming-core';

const result = compareSchools(input);
result.schools;      // 每派一份完整命盘，各带自己的规则指纹与事实图
result.divergences;  // 逐字段列出分歧，附两侧 ruleId 与 source
result.agreement;    // 两派取值相同的字段
// 没有 result.answer —— 本工程不判定哪个流派更对
```

第三套 `ziwei-core-0.1.0` 属紫微盘系，与四柱规则集并列而不互比——
分歧只在同盘系内定义，`listRuleSets({ system: 'bazi' })` 可只取四柱流派。

详见 [docs/rule-sets.md](docs/rule-sets.md)、[docs/ziwei-model.md](docs/ziwei-model.md) 与
[ADR-0004](docs/decisions/ADR-0004-multi-school-parallel.md)、[ADR-0005](docs/decisions/ADR-0005-ziwei-as-second-chart-system.md)。
新增流派只需新增一个规则集目录并登记，不改计算代码；新增盘系再加一个盘系目录，时间层与农历层不变。

## 文档

- [架构与核心不变量](docs/architecture.md)
- [规则集与证据分级](docs/rule-sets.md)
- [API 快速参考](docs/api.md)
- [四柱与大运计算边界](docs/bazi-luck.md)
- [紫微斗数盘系](docs/ziwei-model.md)
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

当前完成 L0 时间、L1 天文基础、L2 农历天文事实、L3 并列盘系（四柱与大运、紫微斗数十二宫与限运）、
L4 事实图与溯源审计（含同盘系多流派并列）、L5 解读骨架、L6 API 与自检。

已登记三套规则集：四柱两套（通用派、子初派）在换日基准、大运顺逆、起运取整与五行力量计法上取值不同；
紫微一套（通行派）覆盖命身宫、五行局、十四主星、十四辅星、生年四化、大限与小限。
四柱与紫微共用时间层与农历层，但年界与日界各按自己的口径，**并列展示而不合并**。

**尚未完成**：紫微的杂曜（年、月、日、时系二十余颗）、长生/博士/将前/岁前十二神、流年流月流日流时四化、
四柱神煞与格局、完整解释语料；农历历书显示仍只到月份编号层。这些不会被伪装成已完成的能力。

版本变更见 [CHANGELOG.md](CHANGELOG.md)。
