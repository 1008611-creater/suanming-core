/**
 * 生成 web/bihua-data.js（康熙字典笔画数据表）
 * ---------------------------------------------------------------------------
 * 五格剖象法用「康熙字典笔画」，它既不是现行字形笔画，也不是繁体笔画。
 * 例：万 = 15 画（不是 3），学 = 16 画（不是 8），与 = 14 画（不是 3）。
 * 早期版本只手工收录了 294 个常用字，导致「张三」「王菲」这类真实姓名
 * 直接报「笔画未收录」而算不出五格。本脚本把覆盖面补到基本区全字。
 *
 * 取值优先级（自上而下，先命中先用）：
 *   1. web/analysis.js 中人工校订的 294 字表 —— 视为权威，外部数据不得覆盖。
 *   2. shunshi-kangxi-core 的康熙笔画（kx 字段）。
 * 交叉校验（不直接取值，只用于标注异说）：
 *   3. breezyreeds/kangxi-strokecount —— 与来源 2 在共同覆盖的字上一致率约 97.8%。
 *      两源分歧且属 GB2312 常用字的，逐字写入 NOTE 异说标注，不做静默合并。
 *
 * 数据源不随仓库分发（体积大且可由公开来源重新取得）。运行前请把下列文件
 * 放到同一目录，并通过环境变量 SUANMING_BIHUA_SOURCE_DIR 指向该目录：
 *
 *   kangxi-core/package/data/chars.json.gz   npm 包 shunshi-kangxi-core 解包所得
 *   kangxi-strokecount.csv                   breezyreeds/kangxi-strokecount 仓库 CSV
 *
 * 许可：
 *   shunshi-kangxi-core            MIT License, Copyright (c) 2026 Shunshi.AI
 *   breezyreeds/kangxi-strokecount MIT License, Copyright (c) 2018 Kawai Lo
 *
 * 用法：node scripts/build-bihua-data.mjs
 * 产物：web/bihua-data.js —— 生成物，请勿手工编辑。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = resolve(process.env.SUANMING_BIHUA_SOURCE_DIR || resolve(ROOT, '..', '_trash-20260917'));
const OUT = resolve(ROOT, 'web/bihua-data.js');
const ANALYSIS = resolve(ROOT, 'web/analysis.js');

const CHARS_GZ = resolve(SOURCE_DIR, 'kangxi-core/package/data/chars.json.gz');
const CSV = resolve(SOURCE_DIR, 'kangxi-strokecount.csv');

for (const file of [CHARS_GZ, CSV]) {
  if (!existsSync(file)) {
    console.error('[bihua] 缺少数据源：' + file);
    console.error('[bihua] 请把数据源放到该目录，或用 SUANMING_BIHUA_SOURCE_DIR 指定目录。');
    console.error('[bihua] 数据源获取方式见本脚本头部注释。');
    process.exit(1);
  }
}

/* ---------- 1. 人工校订表：从 analysis.js 里读出来，作为最高优先级 ---------- */
const analysisSource = readFileSync(ANALYSIS, 'utf8');
const curatedMatch = analysisSource.match(/var BIHUA = \{([\s\S]*?)\n  \};/);
if (!curatedMatch) {
  console.error('[bihua] 无法从 web/analysis.js 解析人工校订笔画表，脚本与源码已脱节。');
  process.exit(1);
}
const curated = {};
for (const part of curatedMatch[1].split(/,\s*/)) {
  const kv = part.match(/^\s*([^:]+):(\d+)\s*$/);
  if (kv) curated[kv[1].trim()] = +kv[2];
}
if (Object.keys(curated).length < 200) {
  console.error('[bihua] 人工校订表解析结果异常，只有 ' + Object.keys(curated).length + ' 字，中止。');
  process.exit(1);
}

/* ---------- 2. 来源 A：shunshi-kangxi-core ---------- */
const pkg = JSON.parse(gunzipSync(readFileSync(CHARS_GZ)).toString('utf8')).chars;

/* ---------- 3. 来源 B：breezyreeds/kangxi-strokecount（逐字形，用于交叉校验） ---------- */
const csvLines = readFileSync(CSV, 'utf8').split(/\r?\n/);
const csvStart = csvLines.findIndex((line) => line.startsWith('CodePoint,'));
if (csvStart < 0) {
  console.error('[bihua] 交叉校验 CSV 格式不符合预期（找不到表头 CodePoint,）。');
  process.exit(1);
}
const crossCheck = new Map();
for (let i = csvStart + 1; i < csvLines.length; i++) {
  const parts = csvLines[i].split(',');
  if (parts.length !== 4) continue;
  crossCheck.set(parts[2], Number(parts[3]));
}

/* ---------- 4. GB2312 常用字集合：异说标注只标常用字，避免表体膨胀 ---------- */
function gb2312Chars() {
  const out = new Set();
  for (const [lo, hi] of [[0xB0A1, 0xD7F9], [0xD8A1, 0xF7FE]]) {
    for (let h = lo >> 8; h <= hi >> 8; h++) {
      for (let l = 0xA1; l <= 0xFE; l++) {
        const s = new TextDecoder('gb2312').decode(Buffer.from([h, l]));
        if ([...s].length === 1 && s !== '\uFFFD') out.add(s);
      }
    }
  }
  return out;
}
const GB2312 = gb2312Chars();

/* ---------- 5. 合并取值 ---------- */
const inBasicBlock = (c) => {
  const cp = c.codePointAt(0);
  return cp >= 0x4E00 && cp <= 0x9FFF;
};

const final = new Map();
for (const [c, entry] of Object.entries(pkg)) {
  if (typeof entry.kx === 'number' && inBasicBlock(c)) final.set(c, entry.kx);
}
for (const [c, v] of Object.entries(curated)) final.set(c, v); // 人工校订覆盖自动取值

// 曙 的人工说明优先于自动标注。
const MANUAL_NOTE = {
  曙: '康熙字典日部 13 画计 17 画；部分姓名学书作 18 画，两家取法不同，需以你采用的版本为准。'
};
const note = { ...MANUAL_NOTE };
let divergent = 0;
for (const [c, entry] of Object.entries(pkg)) {
  if (!inBasicBlock(c)) continue;
  if (curated[c] !== undefined) continue;          // 人工校订过的不再自动标注
  const traditional = entry.t && entry.t !== c ? entry.t : c;
  const other = crossCheck.get(traditional);
  if (other === undefined || other === entry.kx) continue;
  divergent++;
  if (!GB2312.has(c)) continue;
  const own = final.get(c);
  if (own === other) continue;
  note[c] = '康熙字典与另一通行字表作 ' + other + ' 画，两家取法不同，此处按 ' + own +
    ' 画；需以你采用的版本为准。';
}

/* ---------- 6. 按笔画分组打包，减少产物体积 ---------- */
const groups = {};
for (const [c, v] of [...final.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))) {
  (groups[v] = groups[v] || []).push(c);
}
const packed = {};
for (const k of Object.keys(groups).sort((a, b) => a - b)) packed[k] = groups[k].join('');

const body = [
  '/* ============================================================',
  ' *  bihua-data.js —— 康熙笔画数据表（生成物，请勿手工编辑）',
  ' *',
  ' *  数据来源：',
  ' *    shunshi-kangxi-core —— MIT License, Copyright (c) 2026 Shunshi.AI',
  ' *      https://www.npmjs.com/package/shunshi-kangxi-core',
  ' *      康熙字典笔画，20794 字，含简→繁字形映射。',
  ' *    交叉校验：breezyreeds/kangxi-strokecount',
  ' *      MIT License, Copyright (c) 2018 Kawai Lo',
  ' *      https://github.com/breezyreeds/kangxi-strokecount',
  ' *',
  ' *  口径：五格剖象法用康熙字典笔画，与现行字形笔画、繁体笔画三者互不相同。',
  ' *       例：万=15（非 3）、学=16（非 8）、与=14（非 3）。',
  ' *       两源分歧的常用字逐字标注异说，不做静默合并。',
  ' *',
  ' *  生成：node scripts/build-bihua-data.mjs（数据源不随仓库分发）',
  ' * ============================================================ */',
  '(function (root, factory) {',
  '  if (typeof module === \'object\' && module.exports) module.exports = factory();',
  '  else root.SUANMING_BIHUA = factory();',
  '})(typeof self !== \'undefined\' ? self : this, function () {',
  '  \'use strict\';',
  '  var PACKED = ' + JSON.stringify(packed) + ';',
  '  var NOTE = ' + JSON.stringify(note, null, 0).replace(/\},/g, '},\n    ') + ';',
  '  var BIHUA = {};',
  '  Object.keys(PACKED).forEach(function (n) {',
  '    var s = PACKED[n];',
  '    for (var i = 0; i < s.length; i++) BIHUA[s[i]] = +n;',
  '  });',
  '  return {',
  '    bihua: BIHUA,',
  '    note: NOTE,',
  '    meta: {',
  '      characters: ' + final.size + ',',
  '      noted: ' + Object.keys(note).length + ',',
  '      source: \'shunshi-kangxi-core (MIT) + breezyreeds/kangxi-strokecount (MIT)\',',
  '      caliber: \'康熙字典笔画，五格剖象法口径\'',
  '    }',
  '  };',
  '});',
  ''
].join('\n');

writeFileSync(OUT, body, 'utf8');
console.log('[bihua] 收录 ' + final.size + ' 字，两源分歧 ' + divergent +
  ' 处，异说标注 ' + Object.keys(note).length + ' 条（含人工 ' + Object.keys(MANUAL_NOTE).length + ' 条）');
console.log('[bihua] 产物 ' + OUT + '（' + (Buffer.byteLength(body, 'utf8') / 1024).toFixed(1) + ' KB）');