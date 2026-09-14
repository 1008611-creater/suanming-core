# 规则集

规则即数据。所有会随流派、师承或版本变化的取值都放在这里，计算代码只读取规则集。

## 目录约定

```
rules/
  index.js                  注册表：按 id 取规则集、审计规则集与事实图
  bazi-core-0.1.0/
    ruleset.js              四柱核心规则集（通用派）
```

## 一条规则的形状

```js
{
  ruleId: 'bazi.year.solar-term-boundary',   // 发布后不得改变含义
  value: 'lichun',                           // 机器可读的取值
  label: '年柱以立春为界……',                  // 人类可读的说明
  evidence: 'astronomical',                  // astronomical | convention | traditional | calibration
  source: ['meeus-aa2', 'jie-zhongqi'],      // 必须指向 sources 中已登记的键
  confidence: 0.97                           // [0, 1]
}
```

## 为什么 evidence 必须分类

天文可验证的量（节气时刻、朔望）有真实误差预算；传统约定（子初换日、大运顺逆）没有同一量纲的「准确率」。
两者混用会让读者误以为后者也经过了实测校准。分类之后，解读层才能只引用它真正有依据的那一类。

## 审计

```js
import { auditRuleSet, auditFactGraph, getRuleSet } from './rules/index.js';
auditRuleSet(getRuleSet()).ok;                 // 规则是否都有出处与置信度
auditFactGraph(chart.facts).ok;                // 每个结论是否都能回溯到已登记的规则
```

CI 会运行这两项审计，缺出处或置信度超过规则本身都会让构建失败。
