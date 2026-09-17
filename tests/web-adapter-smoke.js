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
 */
import { readFileSync } from 'node:fs';
import { paipan, ziwei, GAN, ZHI, CANG, ENGINE_INFO } from '../web/engine-adapter.js';

function assert(condition, message) {
  if (!condition) throw new Error('[web-adapter] ' + message);
}
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error('[web-adapter] ' + label + '：期望 ' + b + '，实际 ' + a);
}

const base = { name: '测试', gender: '男', year: 1990, month: 1, day: 1, hour: 12, minute: 0, lng: 118.18 };
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

console.log('[web-adapter] ok  四柱=' + p.gz.join(' ') + '  大运=' + p.daYun.list[0].gz + '  紫微=' + z.fiveElements.name);
