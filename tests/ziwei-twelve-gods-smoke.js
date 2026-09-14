/**
 * 紫微斗数十二神黄金测试（0.5.0 起）
 * ---------------------------------------------------------------------------
 * 覆盖四组十二神，共 48 个宫位取值：
 *   长生十二神 —— 起宫随五行局，顺逆随「年支阴阳 × 性别」；
 *   博士十二神 —— 起宫取禄存宫，顺逆同上；
 *   将前十二神 —— 起宫随年支三合，恒顺行；
 *   岁前十二神 —— 起宫即年支宫，恒顺行。
 * 期望值来自通行派口诀的人工推演，并与 SylarLong/iztro（MIT）逐宫核对。
 *
 * 基准盘：公历 2005-07-13 08:58，东经 118.18°，男（乙酉年，土五局，命宫卯）。
 *   土五局 → 长生起申；乙为阴干、酉为阴支，阴年男命 → 四组顺逆按口诀取反（逆行）。
 *
 * 为什么十二神要独立成测试：
 *   它们不影响星曜落宫，所以主星测试全绿也照样可能整体错位或整组反向；
 *   而它们正是判断「这一年顺不顺、这一宫吉不吉」的常用依据，必须单独钉死。
 */
import assert from 'node:assert/strict';
import { castZiwei } from '../src/index.js';

const INPUT = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };
const chart = castZiwei(INPUT);

// 逐宫期望值：键为地支。
const EXPECTED = {
  寅: { cs: '病', bs: '力士', jq: '劫煞', sq: '小耗' },
  卯: { cs: '衰', bs: '博士', jq: '灾煞', sq: '大耗' },
  辰: { cs: '帝旺', bs: '官府', jq: '天煞', sq: '龙德' },
  巳: { cs: '临官', bs: '伏兵', jq: '指背', sq: '白虎' },
  午: { cs: '冠带', bs: '大耗', jq: '咸池', sq: '天德' },
  未: { cs: '沐浴', bs: '病符', jq: '月煞', sq: '吊客' },
  申: { cs: '长生', bs: '喜神', jq: '亡神', sq: '病符' },
  酉: { cs: '养', bs: '飞廉', jq: '将星', sq: '岁建' },
  戌: { cs: '胎', bs: '奏书', jq: '攀鞍', sq: '晦气' },
  亥: { cs: '绝', bs: '将军', jq: '岁驿', sq: '丧门' },
  子: { cs: '墓', bs: '小耗', jq: '息神', sq: '贯索' },
  丑: { cs: '死', bs: '青龙', jq: '华盖', sq: '官符' }
};

for (const palace of chart.palaces) {
  const expected = EXPECTED[palace.branch];
  assert.ok(expected, '未预期的宫位地支：' + palace.branch);
  const label = palace.branch + ' 宫（' + palace.name + '）';
  assert.equal(palace.changsheng12, expected.cs, label + ' 长生十二神');
  assert.equal(palace.boshi12, expected.bs, label + ' 博士十二神');
  assert.equal(palace.jiangqian12, expected.jq, label + ' 将前十二神');
  assert.equal(palace.suiqian12, expected.sq, label + ' 岁前十二神');
}

// 十二神是「十二宫各一个」的枚举，不允许缺项或重名 —— 重名说明起宫与方向不一致。
const ORDER = {
  changsheng: ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'],
  boshi: ['博士', '力士', '青龙', '小耗', '将军', '奏书', '飞廉', '喜神', '病符', '大耗', '伏兵', '官府'],
  jiangqian: ['将星', '攀鞍', '岁驿', '息神', '华盖', '劫煞', '灾煞', '天煞', '指背', '咸池', '月煞', '亡神'],
  suiqian: ['岁建', '晦气', '丧门', '贯索', '官符', '小耗', '大耗', '龙德', '白虎', '天德', '吊客', '病符']
};
const KEYS = { changsheng: 'changsheng12', boshi: 'boshi12', jiangqian: 'jiangqian12', suiqian: 'suiqian12' };
for (const [group, order] of Object.entries(ORDER)) {
  const actual = chart.palaces.map((p) => p[KEYS[group]]);
  assert.deepEqual([...actual].sort(), [...order].sort(), group + ' 十二神应各出现一次');
}

// 起点与方向必须可溯源：长生起申、博士起禄存宫、将前起子（申子辰三合）、岁前起年支酉。
assert.equal(chart.twelveGods.changsheng.startBranch, '申', '长生起宫随五行局');
assert.equal(chart.twelveGods.changsheng.direction, -1, '阴年男命长生逆行');
assert.equal(chart.twelveGods.boshi.direction, -1, '博士与长生同向');
// 年支酉属「巳酉丑」三合，将前起酉（酉宫得将星，与逐宫期望值自洽）。
assert.equal(chart.twelveGods.jiangqian.startBranch, '酉', '将前起宫按年支三合');
assert.equal(chart.twelveGods.jiangqian.direction, 1, '将前恒顺行');
assert.equal(chart.twelveGods.suiqian.startBranch, '酉', '岁前起宫即年支宫');
assert.equal(chart.twelveGods.suiqian.direction, 1, '岁前恒顺行');
assert.equal(chart.twelveGods.boshi.startFrom, '禄存', '博士起宫取禄存');

// 四组事实各一条，值必须是 12 项数组（寅基顺序），供下游按宫检索。
for (const id of ['ziwei.changsheng12', 'ziwei.boshi12', 'ziwei.jiangqian12', 'ziwei.suiqian12']) {
  const fact = chart.facts.facts.find((f) => f.fact_id === id);
  assert.ok(fact, '缺少十二神事实：' + id);
  assert.equal(fact.value.length, 12, id + ' 应为 12 项');
}

// 未给性别时，长生与博士必须留空而不是按男命默认 —— 静默取默认会让女命得到男命结果。
const noGender = castZiwei({ ...INPUT, gender: undefined });
assert.equal(noGender.twelveGods.changsheng, null, '缺性别时长生留空');
assert.equal(noGender.twelveGods.boshi, null, '缺性别时博士留空');
assert.ok(noGender.twelveGods.jiangqian, '将前不依赖性别，仍应生成');
assert.ok(noGender.twelveGods.suiqian, '岁前不依赖性别，仍应生成');
assert.equal(noGender.palaces[0].changsheng12, null, '缺性别时宫位字段留空');

console.log('ziwei twelve gods smoke passed 4 组 × 12 宫 / 起宫与方向可溯源');
