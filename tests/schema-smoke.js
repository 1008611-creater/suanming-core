import assert from 'node:assert/strict';
import { castBazi, validateChart } from '../src/index.js';
const chart=castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18});
assert.deepEqual(validateChart(chart), {valid:true,errors:[]});
assert.equal(validateChart({}).valid, false);
console.log('schema smoke passed');
