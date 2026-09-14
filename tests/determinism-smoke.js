import assert from 'node:assert/strict';
import { castBazi, hashInput, hashFacts, stableStringify, fnv1a64, manifestForInput } from '../src/index.js';

const input = {year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18,timezone:'Asia/Shanghai',gender:'male'};

// 同输入必须得到同输出：四柱、事实图指纹、规则指纹都一致。
const a = castBazi(input);
const b = castBazi(input);
assert.deepEqual(a.pillars, b.pillars);
assert.equal(hashFacts(a.facts), hashFacts(b.facts));
assert.equal(a.manifest.ruleSetHash, b.manifest.ruleSetHash);

// 键顺序不得影响指纹（否则「同输入」会被误判为不同）。
assert.equal(stableStringify({b:1,a:2}), stableStringify({a:2,b:1}));
assert.equal(hashInput({b:1,a:2}), hashInput({a:2,b:1}));

// 不同输入必须得到不同指纹。
assert.notEqual(hashInput(input), hashInput({...input, minute:59}));

// 指纹格式固定，便于外部复算比对。
assert.match(fnv1a64('suanming-core'), /^[0-9a-f]{16}$/);
assert.match(manifestForInput(input).inputHash, /^[0-9a-f]{16}$/);

console.log('determinism smoke passed', hashFacts(a.facts));
