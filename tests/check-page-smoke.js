/**
 * 自检页与表单校验的防回归测试
 * ---------------------------------------------------------------------------
 * 1. 自检页必须与排盘页共用同一份引擎产物，不得自带第二套算法。
 * 2. 自检页不得引入随机数、隐式当前时间或任何模型调用（CONSTRAINTS 红线）。
 * 3. 页面不得再出现写死的流年区间；标题必须由数据推导。
 * 4. 经度非法必须显式报错，不能静默按 120 度算。
 * 5. 城市表不得出现两个城市共用同一经度的可疑重复。
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

/* --- 7. 自检页只呈现结构，不下吉凶断语 --- */
assert(!/大吉|大凶|必发|必定/.test(js), '自检页出现吉凶断语');
assert(html.includes('不替代医疗'), '自检页缺少免责声明');

console.log('[check-page] ok  城市 ' + seen.size + ' 条经度无重复，自检页与红线检查通过');
