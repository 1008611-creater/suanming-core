import assert from 'node:assert/strict';
import { buildLuck } from '../src/index.js';
const luck = buildLuck({monthPillar:'丙寅',yearStem:'甲',gender:'male',daysToBoundary:30});
assert.equal(luck.direction, 1);
assert.equal(luck.startAgeYears, 10);
assert.equal(luck.pillars.length, 10);
console.log('luck smoke passed', luck.pillars.join(' '));
