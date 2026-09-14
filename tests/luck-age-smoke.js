import assert from 'node:assert/strict';
import { castBazi } from '../src/index.js';
const chart = castBazi({year:2005,month:7,day:13,hour:8,minute:58,longitude:118.18,gender:'male'});
assert.ok(chart.luck.startAgeYears > 0);
assert.equal(chart.luck.pillars.length, 10);
console.log('luck age smoke passed', chart.luck.startAgeYears.toFixed(3));
