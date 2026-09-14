import assert from 'node:assert/strict';
import {
  elementStrength, ELEMENT_ORDER, getRuleSet, castBazi,
  parseVersion, compareVersions, satisfiesRange, ENGINE_VERSION
} from '../src/index.js';

const pillars = { year: '乙酉', month: '癸未', day: '戊戌', hour: '丙辰' };

// 两套规则集的藏干权重不同，同一命盘必须给出不同力量，且各自记录自己用的权重。
const core = elementStrength(pillars, getRuleSet('bazi-core-0.1.0'));
const zichu = elementStrength(pillars, getRuleSet('bazi-zichu-0.1.0'));
assert.deepEqual(core.weights, [1, 0, 0]);
assert.deepEqual(zichu.weights, [1, 0.5, 0.3]);
assert.notDeepEqual(core.totals, zichu.totals);

// 计数法：天干 + 地支本气各计一次 → 总量等于 8（四柱 × 2）。
assert.equal(core.total, 8);
for (const element of ELEMENT_ORDER) assert.ok(element in core.totals, element + ' must appear in totals');

// 加权法只加不减：任何一行的力量不得低于计数法（权重非负且首项为 1）。
for (const element of ELEMENT_ORDER) {
  assert.ok(zichu.totals[element] >= core.totals[element] - 1e-9,
    element + ': weighted strength must not fall below counted strength');
}

// 占比之和为 1（四舍五入到 3 位后允许极小残差），排名与实际力量一致。
const shareSum = ELEMENT_ORDER.reduce((sum, e) => sum + zichu.share[e], 0);
assert.ok(Math.abs(shareSum - 1) < 0.01, 'shares must sum to ~1, got ' + shareSum);
const sorted = [...ELEMENT_ORDER].sort((a, b) => zichu.totals[b] - zichu.totals[a]);
assert.deepEqual(zichu.ranking, sorted, 'ranking must follow strength order');

// 五行必须随规则集走：换规则集就换结果，不能写死在代码里。
const viaChart = elementStrength(castBazi({ year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18 }).pillars);
assert.deepEqual(viaChart.totals, core.totals);

// 版本工具：区间判定必须支持多条件，且拒绝无法解析的区间。
assert.deepEqual(parseVersion('0.3.0'), { major: 0, minor: 3, patch: 0, pre: null });
assert.equal(parseVersion('0.3'), null);
assert.equal(compareVersions('0.3.0', '0.2.9'), 1);
assert.equal(compareVersions('0.3.0', '0.3.0'), 0);
assert.ok(satisfiesRange('>=0.2.0 <0.4.0', '0.3.0'));
assert.ok(!satisfiesRange('>=0.2.0 <0.3.0', '0.3.0'));
assert.ok(!satisfiesRange('not-a-range', '0.3.0'));
assert.ok(!satisfiesRange('', '0.3.0'));

// 每套规则集都必须声明覆盖当前引擎版本，否则审计会失败。
for (const id of ['bazi-core-0.1.0', 'bazi-zichu-0.1.0']) {
  assert.ok(satisfiesRange(getRuleSet(id).engineCompatibility, ENGINE_VERSION),
    id + ' must support engine ' + ENGINE_VERSION);
}

console.log('wuxing smoke passed', JSON.stringify(core.totals), JSON.stringify(zichu.totals));
