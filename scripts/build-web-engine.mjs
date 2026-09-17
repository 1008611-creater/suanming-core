/**
 * 构建网页版引擎（web/engine.js）
 * ---------------------------------------------------------------------------
 * 为什么需要这一步：网页与 Node 必须跑**同一份**计算代码。
 * 曾经网页里另有一份手写实现（web/bazi.js），它与 src/ 各自演化，
 * 结果两边算出的月柱不一致 —— 用户看到的盘和引擎给出的盘是两套东西，
 * 而首页却写着「每个结果都标明计算口径与来源」。
 *
 * 现在只保留一个算法源：src/ + rules/。本脚本把它们打包成浏览器可直接加载的
 * 单个 ESM 文件，并在产物里嵌入源码指纹。tests/web-engine-sync-smoke.js 会重新
 * 计算指纹并与产物比对 —— 源码改了却忘记重新构建，测试立即失败，不会静默漂移。
 *
 * 用法：node scripts/build-web-engine.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fnv1a64 } from '../src/derive/hash.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'web/engine.js');

/** 参与打包的源码目录；遍历顺序固定，保证指纹可复现。 */
const SOURCE_DIRS = ['src', 'rules'];

export function listSources() {
  const out = [];
  for (const dir of SOURCE_DIRS) {
    const walk = (abs) => {
      for (const entry of readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const child = resolve(abs, entry.name);
        if (entry.isDirectory()) walk(child);
        else if (entry.name.endsWith('.js')) out.push(child);
      }
    };
    walk(resolve(ROOT, dir));
  }
  return out.map((abs) => relative(ROOT, abs).replace(/\\/g, '/')).sort();
}

/**
 * 源码指纹：对「路径 + 内容」的稳定序列求 FNV-1a 64 位散列。
 * 路径一并参与，因此改名、移动、增删文件都会改变指纹。
 */
export function sourceFingerprint() {
  const files = listSources();
  const payload = files
    .map((rel) => rel + '\u0000' + readFileSync(resolve(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'))
    .join('\u0001');
  return { hash: fnv1a64(payload), fileCount: files.length, files };
}

function runEsbuild() {
  const result = spawnSync('npx', [
    '--yes', 'esbuild@0.23.1',
    resolve(ROOT, 'src/index.js'),
    '--bundle', '--format=esm', '--platform=browser', '--target=es2020',
    '--outfile=' + OUTPUT,
    '--log-level=warning'
  ], { cwd: ROOT, encoding: 'utf8', shell: true });
  if (result.status !== 0) {
    throw new Error('esbuild failed: ' + (result.stdout || '') + (result.stderr || ''));
  }
}

export function build() {
  const { hash, fileCount } = sourceFingerprint();
  runEsbuild();
  // 产物头尾由本脚本写入：不通过命令行参数传递，避免注释里的空格被 shell 拆开。
  const banner = '/* 本文件由 scripts/build-web-engine.mjs 生成，请勿手工编辑。源码：src/ + rules/ */\n';
  const footer = '\nexport const WEB_ENGINE_SOURCE_HASH = ' + JSON.stringify(hash) + ';\n'
    + 'export const WEB_ENGINE_SOURCE_FILES = ' + fileCount + ';\n';
  const body = readFileSync(OUTPUT, 'utf8');
  writeFileSync(OUTPUT, banner + body + footer, 'utf8');
  return { hash, fileCount, output: OUTPUT };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const result = build();
  console.log('web engine built: ' + relative(ROOT, result.output).replace(/\\/g, '/')
    + ' (source hash ' + result.hash + ', ' + result.fileCount + ' files)');
}
