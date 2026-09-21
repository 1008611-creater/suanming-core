/**
 * 本地出报告工具的防回归测试
 * ---------------------------------------------------------------------------
 * 1. 报告页必须与排盘页、自检页共用同一份引擎产物，不得自带第二套算法。
 * 2. 报告页不得引入随机数、隐式当前时间、网络请求或任何模型调用（CONSTRAINTS 红线）。
 * 3. 模板 18 节必须齐全，且两处必填章（〇、十六）有显式校验。
 * 4. 展示文本不得出现百分比、「准确率」或吉凶断语；缺表章节必须显式留空。
 * 5. 所有用户可控文本必须经 esc() 转义后再进 innerHTML。
 */
import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error('[report-page] ' + message);
}
// 报告工具不进 web/：线上站点产物保持原样，工具只在本机由 scripts/serve-report.mjs 服务。
const read = (f) => readFileSync(new URL('../tools/report/' + f, import.meta.url), 'utf8');

const html = read('report.html');
const js = read('report.js');

/* --- 1. 单一算法源 --- */
assert(js.includes("from './engine-adapter.js'"), '报告页未引用唯一适配层');
assert(!js.includes("from './engine.js'"), '报告页绕开适配层直接引用引擎产物');
assert(html.includes('/analysis.js'), '报告页缺少解释层脚本');
assert(html.includes('/bihua-data.js'), '报告页缺少姓名笔画数据');
assert(!/<script[^>]+src=["']bazi\.js/.test(html), '报告页引入旧算法入口');

/* --- 2. 红线：无随机、无隐式当前时间、无网络、无模型 --- */
assert(!/Math\.random/.test(js), '报告页出现随机数');
assert(!/Date\.now/.test(js), '报告页使用 Date.now');
assert(!/new Date\(/.test(js), '报告页隐式读取当前时间');
assert(!/fetch\(|XMLHttpRequest|WebSocket/.test(js), '报告页出现网络请求');
assert(!/openai|gpt|anthropic|llm/i.test(js), '报告页出现模型调用');
assert(!/localStorage|sessionStorage|indexedDB/i.test(js), '报告页写入本地存储（客户资料不得落盘）');

/* --- 3. 转义：用户可控文本必须先过 esc --- */
assert(js.includes('function esc(s)'), '报告页缺少转义函数');
assert(js.includes('esc(opt.name)'), '报告页未转义客户姓名');
assert(js.includes('esc(opt.gender)') || js.includes('esc(p0.gender)'), '报告页未转义性别');
assert(js.includes('esc((n5.unknown || []).join'), '报告页未转义未收录字形');
assert(js.includes('n5.notes.map(esc)') || js.includes('esc(n5.notes.join'), '报告页未转义笔画异说');

/* --- 4. 模板 18 节齐全 --- */
const sections = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九',
  '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七'];
for (const no of sections) {
  assert(js.includes("sec('" + no + "'"), '报告页缺少第 ' + no + ' 节');
}

/* --- 5. 两处必填章与打印校验 --- */
assert(js.includes("area('sec0'"), '报告页缺少〇章填写区');
assert(js.includes("area('sec16'"), '报告页缺少十六章填写区');
assert(js.includes('missingSections'), '报告页缺少必填校验');
assert(js.includes('missingSections()') && js.includes('window.print()'), '打印前未做必填校验');
assert(html.includes('no-print'), '报告页缺少打印隐藏样式');
assert(/@media print/.test(html), '报告页缺少打印样式');

/* --- 6. 缺表章节必须显式留空，不许编造 --- */
assert(js.includes('本工具不计算飞星'), '飞星章节未显式声明不计算');
assert(js.includes('缺表即整组跳过'), '缺表章节未说明整组跳过');

/* --- 7. 合规：展示文本不得出现百分比、比例类表述或吉凶断语 --- */
function literals(source) {
  return (source.match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g) || []).join('\n');
}
for (const [name, source] of [['report.js', js], ['report.html', html]]) {
  assert(literals(source).indexOf('%') < 0, name + ' 的展示文本出现百分号（合规红线）');
  assert(source.indexOf('准确率') < 0, name + ' 出现「准确率」（合规红线）');
  assert(!/命中率|精准度/.test(source), name + ' 出现比例类表述');
}
assert(!/大吉|大凶|必发|必定/.test(js), '报告页出现吉凶断语');
// 五行只给绝对条数与计权口径，不折算成比例。
assert(js.includes('五行力量只给绝对条数'), '报告页缺少「只给条数」的口径说明');
// 八宅只读方位/星名/含义，不读吉凶字段。
assert(!/x\.ji\b/.test(js), '报告页读取了八宅吉凶字段');

/* --- 8. 日期锚点与口径可核验 --- */
assert(js.includes('dayAnchor(ruleSet, 1949, 10, 1)'), '报告页缺少 1949 日柱校验锚点');
assert(js.includes('dayAnchor(ruleSet, 2000, 1, 1)'), '报告页缺少 2000 日柱校验锚点');
assert(js.includes('sourceHash'), '报告页未带内容指纹');

/* --- 9. 入口与免责 --- */
assert(html.includes('不替代医疗'), '报告页缺少免责声明');
assert(html.includes('lang="zh-CN"'), '报告页缺少文档语言');

/* --- 10. 关系名只走引擎的中文名，工具里不得自建英文枚举映射 --- */
// 引擎内部把关系分成 clash / harm / void 等枚举，这是实现细节。
// 一旦报告页自己拿枚举名拼展示文本，纸上就会出现「关系 clash」这种半成品，
// 所以这里直接钉死：这些英文枚举名不允许出现在工具源码里。
for (const kind of ['clash', 'combine', 'trine', 'half-trine', 'punishment', 'self-punishment', 'harm', 'void']) {
  assert(js.indexOf(kind) < 0, 'report.js 出现内部关系枚举 ' + kind + '（应只展示引擎给出的中文关系名）');
}
// 命中清单与依据栏都必须取引擎已经译好的中文名。
assert(js.includes("return h.name + '（'"), '报告页未使用引擎给出的关系名');
assert(js.includes("parts.push('关系 ' + basis.relation)"), '报告页依据栏未使用引擎给出的关系名');

console.log('[report-page] ok  18 节齐全，必填校验与合规红线检查通过');
