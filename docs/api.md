# API 快速参考

```js
import { castBazi, numberedLunarMonths, explain } from 'suanming-core';

const chart = castBazi({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});
```

`chart.pillars` 是四柱，`chart.luck` 是带算法说明的大运，`chart.facts` 是事实图，`chart.manifest` 是版本清单。解读必须把事实 ID 传给 `explain`，没有匹配事实的结论不会输出。

农历层提供 `lunarMonthAnchors`、`annotateLunarMonths`、`numberedLunarMonths`。其中无中气月份只标记为闰月候选，完整历书还需要继续校验年界和历法规则。

运行示例：

```powershell
node examples/basic.mjs
```
