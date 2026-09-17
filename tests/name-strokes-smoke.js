/**
 * 姓名五格与康熙笔画数据表冒烟测试
 * ---------------------------------------------------------------------------
 * 背景：早期版本只手工收录 294 个字的康熙笔画，真实姓名（张三、王菲、
 * 欧阳娜娜、司马相如）直接报「笔画未收录」，五格对绝大多数用户不可用。
 * 这里把覆盖面、优先级与异说标注一并钉住：
 *
 *   1. 生成的数据表存在且规模达标（基本区覆盖率 ≥ 98%）。
 *   2. 常用姓名都能算出五格，不再出现「未收录」。
 *   3. 人工校订表优先于自动取值（生成脚本不得覆盖人工结论）。
 *   4. 异说标注保留，不静默合并两家取法。
 *   5. 输入异常（空姓名、超长姓名）给出可区分的原因，页面才能说清话。
 *   6. 合婚称呼随双方性别变化，同性别组合不得写成「男方/女方」。
 */
import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) throw new Error('[name-strokes] ' + message);
}
function eq(actual, expected, label) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error('[name-strokes] ' + label + '：期望 ' + b + '，实际 ' + a);
}

/* ---------- 加载：与页面同序（先数据表，后分析层） ---------- */
const dataSource = readFileSync(new URL('../web/bihua-data.js', import.meta.url), 'utf8');
const analysisSource = readFileSync(new URL('../web/analysis.js', import.meta.url), 'utf8');

const sandbox = { module: { exports: {} } };
sandbox.module.exports = {};
new Function('module', 'exports', 'self', dataSource)(sandbox.module, sandbox.module.exports, undefined);
const DATA = sandbox.module.exports;

const shared = { SUANMING_BIHUA: DATA };
const box2 = { module: { exports: {} }, self: shared };
box2.module.exports = {};
new Function('module', 'exports', 'self', analysisSource)(box2.module, box2.module.exports, shared);
const MingLi = box2.module.exports;

/* ---------- 1. 数据表规模与覆盖率 ---------- */
assert(DATA && DATA.bihua && DATA.note && DATA.meta, '数据表结构缺失');
assert(DATA.meta.characters >= 20000, '收录字数不足：' + DATA.meta.characters);
assert(DATA.meta.noted >= 100, '异说标注条数异常：' + DATA.meta.noted);

let basicTotal = 0, basicHit = 0;
for (let cp = 0x4e00; cp <= 0x9fff; cp++) {
  basicTotal++;
  if (DATA.bihua[String.fromCodePoint(cp)] !== undefined) basicHit++;
}
const coverage = basicHit / basicTotal;
assert(coverage >= 0.98, '基本区覆盖率不足：' + (coverage * 100).toFixed(2) + '%');

/* ---------- 2. 常用姓名都能算出五格 ---------- */
const names = ['张三', '王菲', '欧阳娜娜', '司马相如', '刘德华', '李娜', '陈晓明', '慕容复'];
for (const name of names) {
  const r = MingLi.wuGe(name);
  assert(r.ok, name + ' 仍算不出五格：' + JSON.stringify(r.unknown || r.reason));
  eq(r.bi.length, name.length, name + ' 笔画条数与字数不符');
  assert(r.bi.every(n => Number.isInteger(n) && n > 0), name + ' 存在非法笔画值');
  assert(r.detail['总格'].num >= 1 && r.detail['总格'].num <= 81, name + ' 总格越界');
}

/* 逐字取值抽查：五格剖象法用康熙字典笔画，与现行字形笔画不同 */
eq(DATA.bihua['张'], 11, '张');
eq(DATA.bihua['三'], 3, '三');
eq(DATA.bihua['菲'], 14, '菲');
eq(DATA.bihua['欧'], 15, '欧');
eq(DATA.bihua['阳'], 17, '阳');
eq(DATA.bihua['娜'], 10, '娜');
eq(DATA.bihua['司'], 5, '司');
eq(DATA.bihua['马'], 10, '马');
eq(DATA.bihua['相'], 9, '相');
eq(DATA.bihua['如'], 6, '如');
eq(DATA.bihua['万'], 15, '万（康熙 15，非现行 3）');
eq(DATA.bihua['学'], 16, '学（康熙 16，非现行 8）');

/* ---------- 3. 人工校订表优先于自动取值 ---------- */
const curatedMatch = analysisSource.match(/var BIHUA = \{([\s\S]*?)\n  \};/);
assert(curatedMatch, '人工校订表解析失败');
const curated = {};
for (const part of curatedMatch[1].split(/,\s*/)) {
  const kv = part.match(/^\s*([^:]+):(\d+)\s*$/);
  if (kv) curated[kv[1].trim()] = +kv[2];
}
assert(Object.keys(curated).length >= 200, '人工校订表字数异常：' + Object.keys(curated).length);

// 产物里人工校订字必须等于人工值。
for (const [c, v] of Object.entries(curated)) {
  if (DATA.bihua[c] === undefined) continue;
  eq(DATA.bihua[c], v, '人工校订字 ' + c + ' 在产物中被自动取值覆盖');
  eq(MingLi.BIHUA[c], v, '人工校订字 ' + c + ' 在分析层被自动取值覆盖');
}

/* 分析层返回的 BIHUA 必须已并入全量表（否则页面仍会缺字） */
assert(Object.keys(MingLi.BIHUA).length >= 20000, '分析层未并入全量表');

/* 优先级要真正可验证：喂一份「人工字被改过」的数据表，分析层必须仍按人工值。
 * 只比对产物无法证明优先级，因为生成阶段已经写入了人工值。 */
const probeChar = Object.keys(curated)[0];
const probeCurated = curated[probeChar];
const probeValue = probeCurated === 1 ? 2 : 1;
const probeData = {
  bihua: { [probeChar]: probeValue, '龘': 48 },
  note: { [probeChar]: '自动标注不应覆盖人工说明', '龘': '自动标注' }
};
const box4 = { module: { exports: {} }, self: { SUANMING_BIHUA: probeData } };
box4.module.exports = {};
new Function('module', 'exports', 'self', analysisSource)(box4.module, box4.module.exports, box4.self);
const merged = box4.module.exports;
eq(merged.BIHUA[probeChar], probeCurated, '人工校订值被外部数据覆盖（优先级失效）');
eq(merged.BIHUA['龘'], 48, '外部数据的新字未并入');
const probeResult = merged.wuGe('曙' + probeChar);
assert(probeResult.notes.some(n => n.indexOf('曙：') === 0), '人工异说说明被自动标注覆盖');

/* ---------- 4. 异说标注保留 ---------- */
assert(DATA.note['曙'], '曙 的人工异说说明丢失');
const noted = Object.keys(DATA.note);
assert(noted.length >= 100, '异说标注过少：' + noted.length);
// 抽查一条自动标注：文案必须同时给出另一家取值与本处取值
const autoNoted = noted.find(c => c !== '曙');
assert(autoNoted, '没有自动异说标注');
const noteText = DATA.note[autoNoted];
assert(/另一通行字表作 \d+ 画/.test(noteText) && /此处按 \d+ 画/.test(noteText), '异说文案格式不符：' + noteText);
assert(MingLi.BIHUA[autoNoted] !== undefined, '被标注异说的字反而算不出笔画');

// 标注出现在 wuGe 的 notes 里，页面才会展示
const notedResult = MingLi.wuGe('曙' + autoNoted);
assert(notedResult.ok, '带异说字的姓名应仍可计算');
assert(notedResult.notes.some(n => n.indexOf(autoNoted + '：') === 0), '异说标注未随姓名结果返回');

/* ---------- 5. 输入异常可区分 ---------- */
eq(MingLi.wuGe('').reason, 'no-name', '空姓名');
eq(MingLi.wuGe('   ').reason, 'no-name', '纯空白姓名');
eq(MingLi.wuGe('张').reason, 'unsupported-length', '单字姓名');
eq(MingLi.wuGe('一二三四五').reason, 'unsupported-length', '五字姓名');
const oneChar = MingLi.wuGe('张');
eq(oneChar.length, 1, '单字姓名的长度回传');

/* ---------- 6. 合婚称呼随性别变化 ---------- */
const male = { gender: '男', zhi: ['子', '丑', '寅', '卯'], wx: { score: { 木: 2, 火: 3, 土: 2, 金: 2, 水: 1 } } };
const female = { gender: '女', zhi: ['午', '丑', '寅', '卯'], wx: { score: { 木: 2, 火: 1, 土: 2, 金: 2, 水: 3 } } };
const h1 = MingLi.hehun(male, female);
eq(h1.labels, { a: '男方', b: '女方' }, '一男一女的称呼');
const h2 = MingLi.hehun(female, female);
eq(h2.labels, { a: '本人', b: '对方' }, '女女组合的称呼');
assert(h2.complement.every(s => s.indexOf('男方') < 0 && s.indexOf('女方') < 0),
  '同性别组合仍出现「男方/女方」：' + h2.complement.join(' | '));
const h3 = MingLi.hehun(male, male);
eq(h3.labels, { a: '本人', b: '对方' }, '男男组合的称呼');
assert(h3.complement.every(s => s.indexOf('男方') < 0 && s.indexOf('女方') < 0),
  '男男组合仍出现「男方/女方」：' + h3.complement.join(' | '));
// 一男一女时仍要保留原有称呼
assert(h1.complement.every(s => /男方|女方/.test(s)), '异性组合的称呼丢失：' + h1.complement.join(' | '));

/* ---------- 7. 数据表未加载时的回退 ---------- */
const box3 = { module: { exports: {} }, self: {} };
box3.module.exports = {};
new Function('module', 'exports', 'self', analysisSource)(box3.module, box3.module.exports, {});
const fallback = box3.module.exports;
// 回退表只有人工校订的 294 字：命中的人工字仍要能算，
// 不在表内的字要如实报缺，而不是硬凑一个数出来。
const fallbackHit = fallback.wuGe('刘德华');
assert(fallbackHit.ok, '数据表缺失时，人工表内姓名应仍可计算：' + JSON.stringify(fallbackHit.unknown));
assert(!fallback.wuGe('慕容复').ok, '数据表缺失时应如实报告缺字，而不是硬凑');
assert(Object.keys(fallback.BIHUA).length < 400, '回退表规模异常：' + Object.keys(fallback.BIHUA).length);

console.log('[name-strokes] ok  收录 ' + DATA.meta.characters + ' 字，基本区覆盖 ' +
  (coverage * 100).toFixed(2) + '%，异说标注 ' + DATA.meta.noted + ' 条，常用姓名五格可算');