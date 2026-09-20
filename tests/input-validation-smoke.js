import assert from 'node:assert/strict';
import { castBazi, castZiwei } from '../src/index.js';

const base = { year: 2024, month: 2, day: 29, hour: 12, minute: 0, longitude: 120 };
assert.doesNotThrow(() => castBazi(base), '合法闰日应可排盘');
assert.doesNotThrow(() => castZiwei(base), '合法闰日应可排紫微');

for (const [field, value] of [
  ['month', 13], ['day', 30], ['hour', 24], ['minute', 60], ['longitude', 181]
]) {
  assert.throws(
    () => castBazi({ ...base, [field]: value }),
    (error) => error.code === 'INVALID_INPUT' && error.field === field,
    `${field} 越界必须在计算前失败`
  );
}

assert.throws(
  () => castBazi({ ...base, year: 2023, month: 2, day: 29 }),
  (error) => error.code === 'INVALID_INPUT' && error.field === 'day',
  '非闰年 2 月 29 日必须失败'
);
assert.throws(
  () => castBazi({ ...base, gender: 'unknown' }),
  (error) => error.code === 'INVALID_INPUT' && error.field === 'gender',
  '未知性别枚举必须失败'
);

console.log('[input-validation] ok  日期/时间/经度/枚举边界在排盘前拒绝');
