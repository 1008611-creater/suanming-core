import assert from 'node:assert/strict';
import { solarTermInstant } from '../src/astro/solar-terms.js';
import { castBazi } from '../src/index.js';
const lichun = solarTermInstant(2024, 315);
assert.equal(lichun.year, 2023);
const before = castBazi({year:2024,month:2,day:4,hour:16,minute:0,longitude:120});
const after = castBazi({year:2024,month:2,day:4,hour:17,minute:0,longitude:120});
assert.notEqual(before.pillars.month, after.pillars.month);
console.log('term boundary smoke passed', before.pillars.month, after.pillars.month);
