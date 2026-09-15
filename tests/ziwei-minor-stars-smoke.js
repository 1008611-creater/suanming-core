/**
 * 紫微斗数杂曜黄金测试（0.5.0 起）
 * ---------------------------------------------------------------------------
 * 覆盖 38 颗杂曜：年系 26（含红鸾天喜）、月系 6、日系 4、时系 2。
 * 期望值来自「通行派」安星口诀的人工推演，并与 SylarLong/iztro（MIT）逐宫核对。
 * 测试写死的是**结果**，换实现方式不影响；只有算错星位才会失败。
 *
 * 基准盘：公历 2005-07-13 08:58，东经 118.18°，男。
 *   农历 乙酉年六月初八 辰时；命宫在卯、身宫在亥；土五局。
 *   年支酉、年干乙、生月宫索引 5（寅基）、时辰索引 4。
 *
 * 为什么杂曜值得单独一套测试：
 *   主星错了整盘皆错、一眼可见；杂曜错了只错一两颗，肉眼很难发现，
 *   但下游解读会照着错的星位讲出「哪年动、哪宫带桃花」，
 *   所以必须逐宫钉死，而不是只断言总数。
 */
import assert from 'node:assert/strict';
import { castZiwei } from '../src/index.js';

const INPUT = { year: 2005, month: 7, day: 13, hour: 8, minute: 58, longitude: 118.18, gender: 'male' };
const chart = castZiwei(INPUT);

// 逐宫期望值：键为地支，值为该宫杂曜（顺序无关，比较时排序）。
const EXPECTED_MINOR = {
  寅: ['天贵', '月德', '天刑'],
  卯: ['天月', '天虚'],
  辰: ['三台', '天官', '阴煞'],
  巳: ['破碎'],
  午: ['红鸾', '天姚', '咸池', '封诰', '天厨', '天德', '截路'],
  未: ['旬空', '空亡', '寡宿'],
  申: ['天寿', '天巫', '天福', '天伤'],
  酉: ['天哭'],
  戌: ['八座', '台辅', '天空', '天使'],
  亥: ['孤辰', '蜚廉'],
  子: ['天喜', '解神', '恩光', '天才'],
  丑: ['龙池', '凤阁', '华盖', '年解']
};

for (const palace of chart.palaces) {
  const expected = EXPECTED_MINOR[palace.branch];
  assert.ok(expected, '未预期的宫位地支：' + palace.branch);
  assert.deepEqual(
    [...palace.minorStars].sort(),
    [...expected].sort(),
    palace.branch + ' 宫（' + palace.name + '）杂曜'
  );
  // 分层字段必须自洽：minorStars 恰好是本宫 tier === 'minor' 的星。
  assert.deepEqual(
    [...palace.minorStars].sort(),
    palace.stars.filter((s) => s.tier === 'minor').map((s) => s.name).sort(),
    palace.branch + ' 宫 minorStars 与 stars 分层一致'
  );
}

// 38 颗杂曜必须各出现且仅出现一次：少一颗说明某组整组没安，多一颗说明重复推送。
const MINOR_NAMES = [
  '华盖', '咸池', '孤辰', '寡宿', '天才', '天寿', '天厨', '破碎', '蜚廉',
  '龙池', '凤阁', '天哭', '天虚', '天官', '天福', '天德', '月德', '天空',
  '截路', '空亡', '旬空', '年解', '天伤', '天使', '红鸾', '天喜',
  '解神', '天姚', '天刑', '阴煞', '天月', '天巫',
  '三台', '八座', '恩光', '天贵',
  '台辅', '封诰'
];
assert.equal(MINOR_NAMES.length, 38, '杂曜清单应为 38 颗');
const minorStars = chart.stars.filter((s) => s.tier === 'minor').map((s) => s.name);
assert.deepEqual([...minorStars].sort(), [...MINOR_NAMES].sort(), '38 颗杂曜各安一次');

// 全盘星数 = 14 主星 + 14 辅星 + 38 杂曜。
assert.equal(chart.stars.length, 66, '全盘星数');

// 分组标记必须齐全：五组各归其位，供下游按「年系/月系/日系/时系」检索。
const groups = new Set(chart.stars.filter((s) => s.tier === 'minor').map((s) => s.group));
assert.deepEqual([...groups].sort(), ['day', 'hour', 'month', 'year'], '杂曜分组标记');

// 日系星依赖左辅右弼文昌文曲的实际落宫，必须与辅星严格联动。
// 基准盘：左辅在酉、右弼在巳、文昌在午、文曲在申，日序 dayIndex = 8 - 1 = 7。
const byName = new Map(chart.stars.map((s) => [s.name, s]));
assert.equal(byName.get('左辅').branch, '酉', '左辅落宫（日系基准）');
assert.equal(byName.get('右弼').branch, '巳', '右弼落宫（日系基准）');
assert.equal(byName.get('文昌').branch, '午', '文昌落宫（日系基准）');
assert.equal(byName.get('文曲').branch, '申', '文曲落宫（日系基准）');
assert.equal(byName.get('三台').branch, '辰', '三台 = 左辅 + 日序');
assert.equal(byName.get('八座').branch, '戌', '八座 = 右弼 - 日序');
assert.equal(byName.get('恩光').branch, '子', '恩光 = 文昌 + 日序 - 1');
assert.equal(byName.get('天贵').branch, '寅', '天贵 = 文曲 + 日序 - 1');

// 天伤、天使按宫位定位（交友宫、疾厄宫），随命宫走，与年支无关。
assert.equal(byName.get('天伤').palaceName, '交友', '天伤固定在交友宫');
assert.equal(byName.get('天使').palaceName, '疾厄', '天使固定在疾厄宫');

// 命主身主：命主取命宫地支 [0]，身主取**生年地支** [1]（不是身宫地支）。
assert.equal(chart.masters.soulMaster, '文曲', '命主按命宫卯取文曲');
assert.equal(chart.masters.bodyMaster, '天同', '身主按生年支酉取天同');
assert.equal(chart.masters.soulBranch, '卯', '命主取命宫地支');
assert.equal(chart.masters.yearBranch, '酉', '身主取生年地支');

// 每条杂曜事实都必须能回溯到规则集，且值里带落宫地支。
const minorFactIds = ['ziwei.yearMinorRule', 'ziwei.monthMinorRule', 'ziwei.dayMinorRule', 'ziwei.hourMinorRule', 'ziwei.hongluanTianxiRule'];
for (const id of minorFactIds) {
  const fact = chart.facts.facts.find((f) => f.fact_id === id);
  assert.ok(fact, '缺少杂曜事实：' + id);
  assert.ok(fact.value.length > 0, id + ' 事实不应为空');
  assert.ok(fact.value.every((v) => /@/.test(v)), id + ' 事实值应带落宫地支');
}
const masterFact = chart.facts.facts.find((f) => f.fact_id === 'ziwei.soul-body-master');
assert.deepEqual(masterFact.value, { soul: '文曲', body: '天同' }, '命主身主事实');

console.log('ziwei minor stars smoke passed 38 杂曜逐宫 / 命主身主 / 日系联动');
