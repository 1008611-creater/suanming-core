import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { castBazi } from '../src/index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => JSON.parse(readFileSync(resolve(ROOT, rel), 'utf8'));

const top = read('schema/chart.schema.json');
const pointer = read('src/schema/chart.schema.json');

// 顶层 Schema 是权威契约，必须自洽且覆盖运行时输出的所有顶层字段。
assert.equal(top.$schema, 'https://json-schema.org/draft/2020-12/schema');
for (const key of ['schemaVersion','input','pillars','time','facts','manifest']) {
  assert.ok(top.required.includes(key), 'schema must require ' + key);
  assert.ok(top.properties[key], 'schema must describe ' + key);
}

// 干支与清单版本必须用同一套约束。
assert.equal(top.$defs.ganzhi.pattern, '^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$');
assert.equal(top.$defs.manifest.properties.schemaVersion.const, '1.0.0');
assert.equal(top.$defs.fact.properties.confidence.maximum, 1);

// src 下的同名文件必须是指向顶层契约的指针，不允许出现第二份定义。
assert.equal(pointer.$ref, '../../schema/chart.schema.json');
assert.equal(pointer.properties, undefined, 'pointer must not redefine properties');

// 实际输出必须满足 Schema 声明的必需字段。
const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18});
for (const key of top.required) assert.ok(chart[key] !== undefined, 'chart is missing ' + key);
assert.match(chart.pillars.year, new RegExp(top.$defs.ganzhi.pattern));

console.log('schema file smoke passed');
