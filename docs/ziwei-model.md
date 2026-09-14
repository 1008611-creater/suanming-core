# 紫微斗数盘系

四柱与紫微是**两套并列的盘系**，不是同一张盘的不同算法。它们共用时间层与农历层，
但年界、日界、起盘依据各不相同，因此**不可互相换算**，也不共用 `ruleId` 命名空间。
详见 [ADR-0005](decisions/ADR-0005-ziwei-as-second-chart-system.md)。

## 与四柱的口径差异

| 维度 | 四柱 | 紫微 |
| --- | --- | --- |
| 换年 | 立春 | 农历正月初一 |
| 换日 | 子正（通用派）/ 子初（子初派） | 晚子时（23:00 后）进日 |
| 起盘依据 | 节气与干支 | 农历月、时辰、宫位 |
| 时间基准 | 真太阳时定时辰 | 真太阳时定时辰 |
| 性别 | 只影响大运顺逆 | 影响大限顺逆与小限方向 |
| 规则集 | `bazi-core-0.1.0` / `bazi-zichu-0.1.0` | `ziwei-core-0.1.0` |

两者的时间层与农历层是**同一份实现**：时区、历史夏令时、真太阳时、朔日与闰月只有一套，
避免同一时刻在两套盘里被算成两个农历日。

## 索引约定

索引错一位就整盘错位，因此全目录统一约定并集中声明在 `src/charts/ziwei/palace.js` 顶部：

| 名称 | 基准 | 范围 | 说明 |
| --- | --- | --- | --- |
| `palaceIndex` | 寅基 | 0=寅 … 11=丑 | 十二宫自寅起布 |
| `branchIndex` | 子基 | 0=子 … 11=亥 | 干支表天然子基 |
| `timeIndex` | 十三值 | 0=早子 … 11=亥，12=晚子 | 取地支时用 `fixIndex(timeIndex, 12)`，晚子自然归子 |

换算：`branchIndex = (palaceIndex + 2) % 12`。

## 计算顺序

顺序不可交换，每一步都是下一步的输入：

```
农历 → 时辰索引 → 年干支 → 命身宫 → 五行局 → 十二宫天干 → 十二宫名
     → 紫微天府 → 十四主星 → 十四辅星 → 生年四化 → 大限小限
```

**五行局只算一次**。它同时是「起紫微星的除数」与「大限起运虚岁」：两处各算一次必然漂移，
会让星盘与限运对不上。实现里 `fiveElementsClass()` 只返回一个 `value`，往下传。

## 与四柱一致的证据分级

规则集里的每条取值同样带 `ruleId` / `evidence` / `source` / `confidence`。
紫微的取值绝大多数是 `traditional`：置信度表达的是**体系内部一致性与流传广度**，
不是算命准确率。唯一带天文可验证成分的是真太阳时（`convention`）。

`iztro`（MIT）在本规则集里登记为 **reference-implementation**：它用于交叉核对安星结果，
不把传统口诀升级成天文事实，也不改变 `evidence` 类别。

## 未纳入范围

以下内容**故意不做**，等有可核对的出处与交叉验证再加，而不是先安上再找依据：

- 年系、月系、日系、时系的杂曜（红鸾、天喜、孤辰、寡宿、三台、八座、恩光、天贵等二十余颗）。
- 长生十二神、博士十二神、将前十二神、岁前十二神。
- 命主身主、斗君、流年流月流日流时四化。
- 格局判定与解释语料——那属于 L5，必须引用事实图中的 `fact_id`，不能反向计算。

原则：**宁可先少安一颗星，也不安一颗出处存疑的星**。盘上多一颗来源不明的星，
比少一颗更危险，因为它看起来同样确定。

## 交叉验证

安星结果已与 `iztro` v2.6.1 官方打包产物逐宫对照：

| 用例 | 项数 | 差异 |
| --- | --- | --- |
| 基准盘 2005-07-13 08:58 东经 118.18 男 | 全盘 | 0（宫名别名除外） |
| 闰月专项（2023 闰二月、2025 闰六月） | 21 | 0 |
| 随机批次（1940—2025） | 48 | 0 |
| 早晚子时密集 | 22 | 0 |
| 大限 | 12 限 | 0 |
| 小限 | 208 | 0 |

唯一系统性差异是宫名：通行派称「交友」，古法称「奴仆」，`iztro` 用「仆役」。
这已作为别名登记在规则集 `palaceNames.aliases` 中，由 `palaceNameAliases()` 导出，
而不是让下游各自猜测。名称不影响星曜分布。

## 用法

```js
import { castZiwei, validateZiweiChart, auditFactGraph } from 'suanming-core';

const chart = castZiwei({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});

chart.palaces;        // 十二宫：宫干、宫支、宫名、星曜、四化、大限、小限
chart.stars;          // 全盘星曜，各带 palaceIndex / branch / palaceName
chart.soul;           // 命宫
chart.body;           // 身宫
chart.fiveElements;   // 五行局（含局数 value）
chart.mutagens;       // 生年四化
chart.decadal;        // 大限顺逆与十二限
chart.xiaoxian;       // 小限起宫与方向
chart.facts;          // 事实图，每条带 rule_id
chart.manifest;       // 版本清单

validateZiweiChart(chart).valid;   // 结构校验
auditFactGraph(chart.facts).ok;    // 溯源审计（按清单解析盘系规则集）
```

未提供 `gender` 时，`decadal` 与 `xiaoxian` 为 `null`，而不是编造一个默认性别——
编造会让「男顺女逆」静默变成男命结果。

## 相关

- [架构与核心不变量](architecture.md)
- [规则集与证据分级](rule-sets.md)
- [ADR-0005：紫微斗数作为第二盘系](decisions/ADR-0005-ziwei-as-second-chart-system.md)
- [验证策略](validation.md)
