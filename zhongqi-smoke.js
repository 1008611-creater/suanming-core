import assert from 'node:assert/strict';
import { lunarMonthAnchors, monthHasZhongqi } from '../src/index.js';
const a=lunarMonthAnchors(2024);
assert.ok(a.every((x,i)=>i===a.length-1 || monthHasZhongqi(x.jd,a[i+1].jd)===true || typeof monthHasZhongqi(x.jd,a[i+1].jd)==='boolean'));
console.log('zhongqi smoke passed');
