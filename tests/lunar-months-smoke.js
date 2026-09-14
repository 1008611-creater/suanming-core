import assert from 'node:assert/strict';
import { annotateLunarMonths } from '../src/index.js';
const months = annotateLunarMonths(2024);
assert.ok(months.length >= 12);
assert.ok(months.every(m => typeof m.hasZhongqi === 'boolean'));
assert.ok(months.every(m => m.endJd > m.jd));
console.log('lunar months smoke passed', months.length);
