/**
 * 网页引擎同步检查（防漂移）
 * ---------------------------------------------------------------------------
 * 背景：网页曾经自带一份手写八字实现（web/bazi.js），与 src/ 各自演化，
 * 结果两边算出的盘不一致，而首页却承诺「每个结果都标明计算口径与来源」。
 * 现在网页只加载由 scripts/build-web-engine.mjs 从 src/ + rules/ 打包出的
 * web/engine.js，本测试保证「源码改了但忘记重新打包」会立刻失败。
 *
 * 断言：
 *   1. web/engine.js 存在，且是 ESM 产物（含 export）。
 *   2. 产物内的 WEB_ENGINE_SOURCE_HASH 与当前 src/ + rules/ 的指纹一致。
 *   3. 产物内的 WEB_ENGINE_SOURCE_FILES 与当前参与打包的文件数一致。
 *   4. 产物确实导出了页面依赖的关键 API。
 */
import { readFileSync } from 'node:fs';
import { sourceFingerprint } from '../scripts/build-web-engine.mjs';

function assert(condition, message) {
  if (!condition) throw new Error('[web-engine-sync] ' + message);
}

const url = new URL('../web/engine.js', import.meta.url);
const source = readFileSync(url, 'utf8');
const { hash, fileCount } = sourceFingerprint();

assert(source.includes('export'), 'web/engine.js 不是 ESM 产物，无法被 <script type=module> 加载');

const hashMatch = source.match(/export const WEB_ENGINE_SOURCE_HASH = "?([0-9a-f]{16})"?;/);
assert(hashMatch, 'web/engine.js 缺少 WEB_ENGINE_SOURCE_HASH 标记');
assert(
  hashMatch[1] === hash,
  'web/engine.js 已过期：产物指纹 ' + hashMatch[1] + '，当前源码指纹 ' + hash
    + '。请运行 node scripts/build-web-engine.mjs 重新打包'
);

const filesMatch = source.match(/export const WEB_ENGINE_SOURCE_FILES = (\d+);/);
assert(filesMatch, 'web/engine.js 缺少 WEB_ENGINE_SOURCE_FILES 标记');
assert(
  Number(filesMatch[1]) === fileCount,
  'web/engine.js 参与打包的文件数 ' + filesMatch[1] + ' 与当前 ' + fileCount + ' 不一致'
);

// 页面真正会用到的 API：任何一个缺失都会让排盘页在浏览器里直接白屏。
const module = await import(url.href);
const requiredExports = [
  'castBazi', 'castZiwei', 'elementStrength', 'currentMonthBoundary', 'tenGod',
  'STEMS', 'BRANCHES', 'hiddenStems', 'elementOfStem', 'elementOfBranch',
  'equationOfTimeMinutes', 'getRuleSet', 'validateChart', 'validateTraceability',
  'ENGINE_VERSION', 'EPHEMERIS_MODEL', 'DEFAULT_BAZI_RULE_SET'
];
for (const name of requiredExports) {
  assert(module[name] !== undefined, '网页引擎缺少导出：' + name);
}

// 网页引擎必须与 Node 端算出同一份盘，否则「同输入同结果」的承诺不成立。
const chart = module.castBazi({
  year: 1990, month: 1, day: 1, hour: 12, minute: 0, longitude: 118.18, gender: 'male'
});
const pillars = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour].join(' ');
assert(pillars === '己巳 丙子 丙寅 甲午', '网页引擎四柱与基准不一致：' + pillars);
assert(module.validateChart(chart).valid, '网页引擎产出未通过结构校验');
assert(module.validateTraceability(chart).valid, '网页引擎产出未通过可追溯性校验');

console.log('[web-engine-sync] ok  hash=' + hash + ' files=' + fileCount + ' exports=' + Object.keys(module).length);
