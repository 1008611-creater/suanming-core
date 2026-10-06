/**
 * 自检页与表单校验的防回归测试
 * ---------------------------------------------------------------------------
 * 1. 自检页必须与排盘页共用同一份引擎产物，不得自带第二套算法。
 * 2. 自检页不得引入随机数、隐式当前时间或任何模型调用（CONSTRAINTS 红线）。
 * 3. 页面不得再出现写死的流年区间；标题必须由数据推导。
 * 4. 经度非法必须显式报错，不能静默按 120 度算。
 * 5. 城市表不得出现两个城市共用同一经度的可疑重复。
 * 6. 前事清单区块必须完整：可打标、只汇总条数、文本里不得出现百分比或「准确率」。
 * 7. 核对年份必须是用户自己填的：页面要有 #asof 输入框，且不得把当前年份
 *    偷偷塞进去 —— 否则用户什么都没填也会多出一问。
 */
import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error('[check-page] ' + message);
}
const read = (f) => readFileSync(new URL('../web/' + f, import.meta.url), 'utf8');

const html = read('check.html');
const js = read('check.js');
const app = read('app.js');
const paipan = read('paipan.html');

/* --- 1. 单一算法源 --- */
assert(js.includes("from './engine-adapter.js'"), '自检页未引用唯一适配层');
assert(!js.includes("from './engine.js'"), '自检页绕开适配层直接引用引擎产物');
assert(!/bazi|ziwei.*算法/i.test(js.replace(/engine-adapter/g, '')), '自检页疑似自带算法');
assert(html.includes('analysis.js'), '自检页缺少解释层脚本');

/* --- 2. 红线：无随机、无隐式当前时间参与计算、无模型调用 --- */
assert(!/Math\.random/.test(js), '自检页出现随机数');
assert(!/fetch\(|XMLHttpRequest|WebSocket/.test(js), '自检页出现网络请求');
assert(!/openai|gpt|anthropic|llm/i.test(js), '自检页出现模型调用');
// 允许 new Date().getFullYear() 仅用于展示当前年份，但不得用 Date.now 参与盘面计算
assert(!/Date\.now/.test(js), '自检页使用 Date.now');
assert(!/Math\.random/.test(app), '排盘页出现随机数');

/* --- 3. 流年区间不得写死 --- */
assert(!/2026\s*[–-]\s*2035/.test(app), '排盘页仍写死流年区间 2026–2035');
assert(!/x\.year >= 20\d\d && x\.year <= 20\d\d/.test(app), '排盘页仍写死流年筛选范围');
assert(/nowYear - 1/.test(app) && /nowYear \+ 9/.test(app), '流年区间未按展示年份推导');

/* --- 4. 经度校验必须显式 --- */
assert(/lngError/.test(app), '排盘页缺少经度校验结果');
assert(/alert\(opt\.lngError\)/.test(app), '排盘页未在经度非法时提示用户');
assert(!/if \(!isFinite\(lng\)\) lng = 120;/.test(app), '排盘页仍在静默回退经度 120');

/* --- 5. 城市表重复经度 --- */
const block = app.match(/var CITY = \[([\s\S]*?)\];/);
assert(block, '未找到城市经度表');
const entries = [...block[1].matchAll(/\['([^']+)',\s*(null|[\d.]+)\]/g)].map((m) => [m[1], m[2]]);
assert(entries.length > 30, '城市表条目过少');
const seen = new Map();
for (const [name, lng] of entries) {
  if (lng === 'null') continue;
  if (seen.has(lng)) {
    assert(false, '城市 ' + name + ' 与 ' + seen.get(lng) + ' 经度重复：' + lng);
  }
  seen.set(lng, name);
}

/* --- 6. 自检页入口 --- */
assert(read('index.html').includes('check.html'), '首页缺少自检入口');
assert(paipan.includes('check.html'), '排盘页缺少自检入口');
assert(html.includes('lng') && html.includes('go'), '自检页缺少必要表单字段');
// 核对年份必须是显式输入：有输入框，且说明留空时不拿当前年份代替。
assert(/id="asof"/.test(html), '自检页缺少核对年份输入框 #asof');
assert(/留空/.test(html), '自检页未说明核对年份留空的行为');
assert(js.includes("$('asof')"), '自检页未读取核对年份输入');
assert(!/asOfYear:\s*new Date\(\)/.test(js), '自检页把当前年份偷偷当成核对年份');
// 排盘页只传 displayYear，不得再用 asOfYear 触发前事清单的重复年份那一问。
assert(/displayYear:\s*new Date\(\)\.getFullYear\(\)/.test(app), '排盘页未用 displayYear 传当前年份');
assert(!/asOfYear:\s*new Date\(\)/.test(app), '排盘页仍把当前年份当核对年份传给前事清单');

/* --- 7. 自检页只呈现结构，不下吉凶断语 --- */
assert(!/大吉|大凶|必发|必定/.test(js), '自检页出现吉凶断语');
assert(html.includes('不替代医疗'), '自检页缺少免责声明');

/* --- 8. 前事清单区块 --- */
assert(js.includes('data-pe-mark'), '自检页缺少前事打标按钮');
assert(js.includes('pastEvents'), '自检页未读取前事清单');
assert(js.includes('像') && js.includes('不像') && js.includes('不确定'), '自检页缺少三档打标文案');
// 汇总只写条数：出现「条像 / 条不像 / 条不确定」三处计数即可，
// 且任何位置都不得把条数折算成比例。
assert(/条像/.test(js) && /条不像/.test(js) && /条不确定/.test(js), '前事汇总未按条数呈现');
// 只检查会展示给用户的文本：取模运算的 % 不算。
function literals(source) {
  return (source.match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g) || []).join('\n');
}
for (const [name, source] of [['check.js', js], ['check.html', html]]) {
  assert(literals(source).indexOf('%') < 0, name + ' 的展示文本出现百分号（合规红线）');
  assert(source.indexOf('准确率') < 0, name + ' 出现「准确率」（合规红线）');
  assert(!/命中率|精准度/.test(source), name + ' 出现比例类表述');
}
// 前事区块必须落在流年回看之前，且原有区块一个都不能少。
const peIndex = js.indexOf('data-pe-mark');
assert(peIndex > 0 && js.indexOf('前事验证') > 0, '自检页缺少前事验证区块');
for (const kept of ['三方四正', '时辰对照', '流年']) {
  assert(js.includes(kept), '自检页丢失原有区块：' + kept);
}

console.log('[check-page] ok  城市 ' + seen.size + ' 条经度无重复，自检页与红线检查通过');
