import assert from 'node:assert/strict';
import { lunarMonthAnchors, lunarDayFromNewMoon } from '../src/index.js';
const anchors = lunarMonthAnchors(2024);
assert.ok(anchors.length >= 12);
const spring = anchors.find(x => x.jd > 2460350 && x.jd < 2460370);
assert.ok(spring);
assert.equal(lunarDayFromNewMoon(spring.jd, spring.jd), 1);
console.log('lunar smoke passed', anchors.length, spring.jd.toFixed(5));
