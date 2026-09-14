import assert from 'node:assert/strict';
import { numberedLunarMonths } from '../src/index.js';
const months = numberedLunarMonths(2024);
assert.ok(months.some(m => m.monthNumber === 11));
assert.ok(months.every(m => m.monthNumber >= 1 && m.monthNumber <= 12));
console.log('lunar numbering smoke passed');
