import assert from 'node:assert/strict';
import { castBazi } from '../src/index.js';
const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18});
assert.equal(chart.pillars.year, '乙酉');
assert.equal(chart.input.year, 2005);
assert.equal(chart.manifest.engineVersion, '0.1.0');
console.log('chart smoke passed', chart.pillars);
