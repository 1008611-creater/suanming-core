/**
 * L0/L3 共享输入契约。
 * 页面表单会做一层友好提示，但核心入口不能假设调用方来自浏览器；
 * 任何非法日期或越界时间都必须在进入天文/排盘计算前失败。
 */

function invalid(field, message) {
  const error = new Error(`输入字段 ${field} 无效：${message}`);
  error.code = 'INVALID_INPUT';
  error.field = field;
  return error;
}

function integer(value, field, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw invalid(field, `必须是 ${min}–${max} 的整数`);
  }
}

function daysInMonth(year, month) {
  if (month === 2) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return leap ? 29 : 28;
  }
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/**
 * 校验并返回原输入对象（不修改调用方对象）。
 * longitude 缺省为 120，由盘系入口处理；gender 允许缺省，以支持只求结构的调用。
 */
export function validateCivilInput(input, { requireGender = false } = {}) {
  if (!input || typeof input !== 'object') throw invalid('input', '必须是对象');

  const year = Number(input.year);
  const month = Number(input.month);
  const day = Number(input.day);
  const hour = Number(input.hour ?? 0);
  const minute = Number(input.minute ?? 0);
  const second = Number(input.second ?? 0);

  integer(year, 'year', 1, 9999);
  integer(month, 'month', 1, 12);
  integer(day, 'day', 1, daysInMonth(year, month));
  integer(hour, 'hour', 0, 23);
  integer(minute, 'minute', 0, 59);
  integer(second, 'second', 0, 59);

  if (input.longitude !== undefined && input.longitude !== null) {
    const longitude = Number(input.longitude);
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw invalid('longitude', '必须是 -180–180 之间的数字');
    }
  }

  if (input.timezone !== undefined && (typeof input.timezone !== 'string' || !input.timezone.trim())) {
    throw invalid('timezone', '必须是非空 IANA 时区字符串');
  }

  if (input.gender !== undefined && input.gender !== null && !['male', 'female'].includes(input.gender)) {
    throw invalid('gender', '只能是 male 或 female');
  }
  if (requireGender && !input.gender) throw invalid('gender', '此盘系需要性别');

  const normalized = { ...input, year, month, day, hour, minute };
  if (input.second !== undefined) normalized.second = second;
  return normalized;
}
