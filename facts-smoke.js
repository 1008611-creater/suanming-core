import assert from 'node:assert/strict';
import { castBazi, explain } from '../src/index.js';
const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18});
const claims = explain(chart.facts, [{text:'年柱已计算', factIds:['pillar.year']},{text:'不存在来源的结论',factIds:['missing']}]);
assert.equal(claims.length, 1);
assert.equal(claims[0].evidence[0], 'pillar.year');
console.log('facts smoke passed');
