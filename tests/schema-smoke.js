import assert from 'node:assert/strict';
import { castBazi, validateChart, validateFactGraph, validateTraceability, createManifest, factGraph } from '../src/index.js';

const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18});
assert.deepEqual(validateChart(chart), {valid:true,errors:[]});
assert.deepEqual(validateFactGraph(chart.facts), {valid:true,errors:[]});
assert.deepEqual(validateTraceability(chart), {valid:true,errors:[]});

// 非法输入必须被拒绝。
assert.equal(validateChart({}).valid, false);
assert.equal(validateChart(null).valid, false);
assert.equal(validateFactGraph({version:'1.0.0'}).valid, false);

// 未登记的规则集必须被拒绝。
const bad = JSON.parse(JSON.stringify(chart));
bad.manifest.ruleSet = 'not-a-rule-set';
assert.equal(validateChart(bad).valid, false);

// 事实图必须与 manifest 一同产出。
assert.equal(factGraph([], createManifest()).manifest.engineVersion, createManifest().engineVersion);

console.log('schema smoke passed');
