import assert from 'node:assert/strict';
import { castBazi } from '../src/index.js';
const before = castBazi({year:2024,month:2,day:4,hour:16,minute:0,longitude:120});
const after = castBazi({year:2024,month:2,day:4,hour:17,minute:0,longitude:120});
assert.equal(before.pillars.year, '癸卯');
assert.equal(after.pillars.year, '甲辰');
console.log('lichun boundary smoke passed', before.pillars.year, after.pillars.year);
