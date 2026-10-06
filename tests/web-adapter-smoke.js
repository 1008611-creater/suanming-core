/**
 * 网页适配层冒烟测试
 * ---------------------------------------------------------------------------
 * web/engine-adapter.js 是「引擎契约输出 → 页面视图模型」的唯一转换点。
 * 页面渲染完全依赖它的字段名与取值，一旦这里和引擎脱节，浏览器里就是白屏
 * 或错盘，而 Node 端的引擎测试仍然全绿。因此这里单独把适配层钉住：
 *
 *   1. 四柱黄金样本与引擎一致（己巳 丙子 丙寅 甲午）。
 *   2. 干支被正确转成索引，且 GAN/ZHI/CANG 与引擎常量同源。
 *   3. 真太阳时明细（经度差、均时差、跨日）与关闭真太阳时的回退。
 *   4. 五行力量口径（method / weights / ruleSet）来自规则集，不在页面重算。
 *   5. 大运、流年条数与首步干支。
 *   6. 旺衰分档随口径切换（analysis.js 阈值表按 method 选档）。
 *   7. 紫微盘可用。
 *   8. 关系派生与前事清单随适配层一并交付：旬空必须与引擎的 relations.xun
 *      同源（页面不再自带第二张表），清单条数与 ruleId 必须在契约里。
 */
import { readFileSync } from 'node:fs';
import { paipan, ziwei, flowYear, palaceTriad, GAN, ZHI, CANG, ENGINE_INFO } from '../web/engine-adapter.js';
import { PAST_EVENT_BOUNDS, resolveRule, getRuleSet } from '../src/index.js';

function assert(condition, message) {
  if (!condition) throw new Error('[web-adapter] ' + message);
}
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error('[web-adapter] ' + label + '：期望 ' + b + '，实际 ' + a);
}

const nowYear = new Date().getFullYear();
// 排盘页的口径：只传 displayYear（当前年份），不传 asOfYear。
const base = { name: '测试', gender: '男', year: 1990, month: 1, day: 1, hour: 12, minute: 0, lng: 118.18, displayYear: nowYear };
const p = paipan(base);

/* --- 1. 四柱与基本信息 --- */
eq(p.gz, ['己巳', '丙子', '丙寅', '甲午'], '四柱');
eq(p.pillars.map(x => GAN[x.gan] + ZHI[x.zhi]), ['己巳', '丙子', '丙寅', '甲午'], '四柱索引回读');
eq(p.gender, '男', '性别');
eq(p.input.useTrueSolar, true, '真太阳时开关');
eq(p.dayGan, GAN.indexOf('丙'), '日干索引');
eq(p.dayGanWx, '火', '日主五行');
eq(p.zodiac, '蛇', '生肖');
eq(p.xunKong, ['戌', '亥'], '旬空');
eq(p.monthTerm, '大雪', '月令节气');
eq(p.shiShen.day, '日主', '日柱十神');
eq(p.displayYear, nowYear, '展示年份显式传入');
eq(p.displayYearSource, 'explicit', '展示年份来源');
// 排盘页的当前年份只决定流年窗口，不得凭空生成「重复年份」那一问。
assert(!p.pastEvents.some((i) => i.id === 'flow-repeat'),
  '排盘页只传 displayYear 时，前事清单不得出现重复年份条目');

// 核对年份（前事页专用）走 asOfYear，同时决定展示窗口与第七问。
const withAsOf = paipan({ ...base, displayYear: undefined, asOfYear: 2026 });
eq(withAsOf.displayYear, 2026, '核对年份同时作为展示年份');
eq(withAsOf.displayYearSource, 'explicit', '核对年份的展示年份来源');
assert(withAsOf.pastEvents.some((i) => i.id === 'flow-repeat'), '给了核对年份后应有重复年份条目');

const deterministic = paipan({ ...base, displayYear: 2000 });
eq(deterministic.displayYear, 2000, '固定展示年份');
eq(deterministic.liuNian[0].year, 1990, '固定展示年份下流年起点');

/* --- 2. 常量与引擎同源 --- */
eq(GAN.join(''), '甲乙丙丁戊己庚辛壬癸', '天干表');
eq(ZHI.join(''), '子丑寅卯辰巳午未申酉戌亥', '地支表');
eq(CANG['寅'], ['甲', '丙', '戊'], '藏干表');
assert(ENGINE_INFO.version && ENGINE_INFO.sourceHash, '引擎身份信息缺失');

/* --- 3. 真太阳时 --- */
eq(p.trueSolar.h, 11, '真太阳时小时');
eq(p.trueSolar.mi, 49, '真太阳时分钟');
assert(Math.abs(p.trueSolar.lonFix - (-7.28)) < 1e-6, '经度时差应为 -7.28 分钟');
assert(Math.abs(p.trueSolar.eqt - (-3.365)) < 0.01, '均时差应为 -3.365 分钟');
eq(p.solarUsed.h, 11, 'solarUsed 与真太阳时一致');

const civil = paipan({ ...base, useTrueSolar: false });
eq(civil.trueSolar, null, '关闭真太阳时后不再输出明细');
eq(civil.gz, ['己巳', '丙子', '丙寅', '甲午'], '关闭真太阳时四柱不变（本样本同辰）');
eq(civil.solarUsed, { y: 1990, m: 1, d: 1, h: 12, mi: 0 }, 'solarUsed 回退到钟表时间');

/* --- 4. 五行力量口径 --- */
eq(p.wx.method, 'bazi.wuxing.element-count', '五行计权口径');
eq(p.wx.ruleSet, 'bazi-core-0.1.0', '规则集');
eq(p.wx.weights, [1, 0, 0], '藏干权重来自规则集');
eq(
  ['木', '火', '土', '金', '水'].map(w => p.wx.score[w]),
  [2, 4, 1, 0, 1],
  '五行分值'
);

/* --- 5. 大运与流年 --- */
assert(p.daYun && p.daYun.list.length >= 8, '大运列表缺失');
eq(p.daYun.forward, false, '阴男逆排');
assert(Math.abs(p.daYun.startAge - 8.342) < 0.01, '起运年龄应约 8.34 岁');
eq(p.daYun.list.slice(0, 3).map(d => d.gz), ['乙亥', '甲戌', '癸酉'], '大运首三步');
assert(p.liuNian.length >= 12, '流年表过短');
eq(p.liuNian[0].year, 1990, '流年起始年份');
assert(p.liuNian.every(x => x.gz.length === 2 && x.shiShen), '流年干支/十神缺失');

/* --- 6. 旺衰分档随口径切换 --- */
const analysisSource = readFileSync(new URL('../web/analysis.js', import.meta.url), 'utf8');
const sandbox = { module: { exports: {} } };
sandbox.module.exports = {};
new Function('module', 'exports', 'self', analysisSource)(sandbox.module, sandbox.module.exports, undefined);
const MingLi = sandbox.module.exports;

const ws = MingLi.wangShuai(p);
assert(ws.strong === '身强' || ws.strong === '偏强', '本样本应为偏强或以上，实际 ' + ws.strong);
eq(ws.method, 'bazi.wuxing.element-count', '旺衰结果带出口径');
eq(ws.ruleSet, 'bazi-core-0.1.0', '旺衰结果带出规则集');
eq(ws.thresholds, { strong: 0.6875, slightlyStrong: 0.5625, slightlyWeak: 0.4375 }, '计权口径阈值');
assert(Array.isArray(ws.yong) && ws.yong.length > 0, '用神缺失');

// 同一份分值时，换口径必须换阈值，否则分档会失真。
const weighted = MingLi.wangShuai({ ...p, wx: { ...p.wx, method: 'bazi.wuxing.element-weighted' } });
eq(weighted.thresholds, { strong: 0.62, slightlyStrong: 0.52, slightlyWeak: 0.44 }, '计重口径阈值');

// 引擎原样返回的结构也要在：页面「可追溯」承诺依赖 manifest。
assert(p.chart && p.chart.manifest && p.chart.manifest.engineVersion, '适配层丢失引擎 manifest');

/* --- 7. 紫微 --- */
const z = ziwei({ gender: '男', year: 1990, month: 1, day: 1, hour: 12, minute: 0, lng: 118.18 });
eq(z.lunar.ganzhi, '己巳', '紫微农历年');
eq(z.fiveElements.name, '土五局', '紫微五行局');
eq(z.palaces.length, 12, '紫微十二宫');
eq(z.soul.branch, '未', '紫微命宫地支');
eq(z.soul.stem, '辛', '紫微命宫天干');
assert(z.palaces.some(x => x.branch === '未'), '紫微命宫未出现在十二宫中');

/* --- 8. 命卦用年：必须与年柱同口径（立春换年） --- */
// 1990-01-01 在立春前，年柱已是己巳（1989）。命卦若用公历年会得出另一个卦。
eq(p.guaYear, 1989, '立春前出生者的命卦用年');
const summer = paipan({ ...base, month: 6, day: 1 });
eq(summer.guaYear, 1990, '立春后出生者的命卦用年仍为当年');
eq(summer.gz[0], '庚午', '立春后年柱为当年干支');

/* --- 9. 自检页取数：flowYear 与 palaceTriad --- */
const fy = flowYear(2015, p);
eq(fy.gz, '乙未', '指定流年干支');
eq(fy.shiShen, '正印', '指定流年十神');
eq(fy.xuSui, 26, '指定流年虚岁');
eq(fy.daYun.gz, '甲戌', '指定流年所处大运');
// 流年干支必须与引擎的流年表逐字一致，避免自检页出现第二套口径。
const inTable = p.liuNian.find((x) => x.year === 2015);
eq(fy.gz, inTable.gz, 'flowYear 与流年表同源');
eq(fy.shiShen, inTable.shiShen, 'flowYear 十神与流年表一致');

eq(palaceTriad(5), { self: 5, opposite: 11, trine: [9, 1] }, '三方四正索引');
eq(palaceTriad(0).trine, [4, 8], '三方四正回绕');

/* --- 10. 未来出生年份：流年表不得整体落在出生之前 --- */
// 反例：表单允许填未来日期。若流年表只按「今年」起算，2040 年出生者会拿到
// 2025 起的年份，流年卡片显示出生前的年份、虚岁为负数。
const future = paipan({ ...base, year: nowYear + 14, month: 5, day: 5 });
const bornYear = future.input.year;
assert(future.liuNian.some((x) => x.year >= bornYear), '未来出生者的流年表不含出生当年及以后');
assert(future.liuNian.some((x) => x.year >= bornYear + 9), '未来出生者的流年表未覆盖出生后十年');
assert(future.liuNian[future.liuNian.length - 1].year >= nowYear + 11, '流年表上界未随出生年顺延');

// 出生当年及之后的虚岁必须为正，出生前不得出现。
const after = future.liuNian.filter((x) => x.year >= bornYear);
assert(after.length >= 10, '出生年及之后的流年不足十条：' + after.length);
assert(after.every((x) => x.year - bornYear + 1 >= 1), '出生年及之后出现非正虚岁');
// 出生前的年份允许存在（用于回看历史大运），但页面必须能把它们过滤掉。
assert(future.liuNian.some((x) => x.year < bornYear), '未来出生者应保留出生前年份供历史对照');

// 页面筛选口径：不得早于出生年，且要覆盖出生后十年。
const lnFrom = Math.max(nowYear - 1, bornYear);
const lnTo = Math.max(nowYear + 9, bornYear + 9);
const shown = future.liuNian.filter((x) => x.year >= lnFrom && x.year <= lnTo);
assert(shown.length >= 10, '页面筛选后流年不足十条：' + shown.length);
assert(shown.every((x) => x.year >= bornYear), '页面筛选后仍出现出生前的年份');
assert(shown.every((x) => x.year - bornYear + 1 >= 1), '页面筛选后仍出现非正虚岁');
assert(shown[0].year === bornYear, '页面筛选后应从出生年开始：' + shown[0].year);

// 已出生者不受影响：仍是「今年前后」的窗口。
const past = p.liuNian.filter((x) => x.year >= Math.max(nowYear - 1, p.input.year) && x.year <= Math.max(nowYear + 9, p.input.year + 9));
assert(past.some((x) => x.year === nowYear), '已出生者的流年窗口未包含今年');
assert(past[0].year === nowYear - 1, '已出生者的流年窗口起点应为去年：' + past[0].year);

/* --- 11. 关系派生与前事清单的契约 --- */
// 旬空必须与引擎同源：页面过去自带一张旬空表，两套口径迟早会分叉。
eq(p.xunKong, p.relations.xun.voidBranches, '旬空与 relations.xun 同源');
assert(p.relations.hits.length > 0, '适配层未带出关系命中');
assert(Array.isArray(p.relations.groups) === false && typeof p.relations.groups === 'object',
  '关系分组结构缺失');
eq(p.relations.skipped, [], '默认规则集不得跳过任何关系分组');

// 前事清单：条数、依据、程度档。
assert(Array.isArray(p.pastEvents), '适配层未带出前事清单');
assert(p.pastEvents.length >= PAST_EVENT_BOUNDS.min && p.pastEvents.length <= PAST_EVENT_BOUNDS.max,
  '前事清单条数超出区间：' + p.pastEvents.length);
const adapterRuleSet = getRuleSet(p.chart.manifest.ruleSet);
for (const item of p.pastEvents) {
  assert(item.basis && item.basis.ruleId, '前事条目缺少 ruleId：' + item.id);
  assert(resolveRule(item.basis.ruleId, adapterRuleSet), '前事条目的 ruleId 无法解析：' + item.basis.ruleId);
  assert(['轻', '中', '重'].indexOf(item.tier) >= 0, '前事条目程度档非法：' + item.tier);
}
// 页面展示的文本里不得出现百分比或「准确率」（合规红线）。
const peText = JSON.stringify(p.pastEvents);
assert(peText.indexOf('%') < 0 && peText.indexOf('准确率') < 0, '前事清单出现百分比或「准确率」');

// 两个年份都不给时，展示年份退回出生年，清单里也不得出现重复年份条目。
const noYear = paipan({ ...base, displayYear: undefined, asOfYear: undefined });
eq(noYear.displayYearSource, 'birth-year-default', '缺年份时的展示年份来源');
eq(noYear.displayYear, 1990, '缺年份时展示年份退回出生年');
assert(!noYear.pastEvents.some((i) => i.id === 'flow-repeat'), '缺 asOfYear 时不应有重复年份条目');
// 缺 asOfYear 时固定 6 问，给了才 7 问；省略说明随清单一起交给页面。
eq(noYear.pastEvents.length, 6, '缺 asOfYear 时固定 6 问');
eq(noYear.pastEvents.omitted.length, 1, '缺 asOfYear 时应有省略说明');
assert(/重复年份/.test(noYear.pastEvents.omitted[0].notice), '省略说明应点明省略的是重复年份那一问');
eq(p.pastEvents.length, 6, '排盘页口径同样是 6 问');
eq(withAsOf.pastEvents.length, 7, '给了核对年份后固定 7 问');
eq(withAsOf.pastEvents.omitted.length, 0, '七问齐全时不应有省略说明');

console.log('[web-adapter] ok  四柱=' + p.gz.join(' ') + '  大运=' + p.daYun.list[0].gz + '  紫微=' + z.fiveElements.name + '  命卦年=' + p.guaYear);
