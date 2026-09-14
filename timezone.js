/**
 * 时区与夏令时（L0 时间层）
 * ---------------------------------------------------------------------------
 * 本模块只回答一个问题：把「某个时区的墙上钟时刻」换成「UTC 儒略日」。
 * 这是整个排盘链条上最容易出错、也最少被检视的一步。
 *
 * 为什么不能直接用 new Date('2005-07-13 08:58')？
 *   1. 不带时区后缀时，不同运行环境的解释不一致（有的当本地时，有的当 UTC）；
 *   2. 中国 1986-1991 年实行过夏令时，朴素做法不会替你补这一小时；
 *   3. 1949 年前中国有多个时区，统一用「北京时间」会系统性偏移。
 *
 * 实现策略：
 *   - 用平台 ICU 的 IANA tzdata 作为唯一事实来源，而不是自建偏移表。
 *     tzdata 由 IANA 维护、有版本号、可追溯，且已被 Node 内置。
 *   - 同时内置一张中国夏令时时段表做交叉校验（见 CHINA_DST_RANGES）。
 *     测试用这张表去验 ICU，两边不一致就报警。这不是冗余，是防错。
 *
 * 已知边界：
 *   - small-icu 构建的 Node 可能缺 tzdata，本模块会抛错而不是静默降级。
 *   - 1901 年前的历史时区在 tzdata 中为 LMT（上海 LMT = UTC+8:05:43），
 *     若命例早于此，必须由用户显式确认出生地实际使用的钟表制度。
 */

import { julianDayFromGregorian, utcFromJulianDay, SECONDS_PER_DAY } from './julian.js';

/**
 * 中国实行过夏令时的时段（北京时间 UTC+9），用于交叉校验 ICU 数据。
 * 数据来源：国务院 1986 年 4 月《关于在全国范围内实行夏时制的通知》及后续调整。
 *
 * 注意 1986 年是特例：起始日为 5 月 4 日（不是往年的 4 月中旬），
 * 因为当年通知发布较晚。不少排盘软件在这里错一天。
 * @type {{start:string, end:string, note:string}[]}
 */
export const CHINA_DST_RANGES = [
  { start: '1986-05-04T02:00:00+08:00', end: '1986-09-14T02:00:00+09:00', note: '首年，起始日特例为 5 月 4 日' },
  { start: '1987-04-12T02:00:00+08:00', end: '1987-09-13T02:00:00+09:00', note: '' },
  { start: '1988-04-17T02:00:00+08:00', end: '1988-09-11T02:00:00+09:00', note: '' },
  { start: '1989-04-16T02:00:00+08:00', end: '1989-09-17T02:00:00+09:00', note: '' },
  { start: '1990-04-15T02:00:00+08:00', end: '1990-09-16T02:00:00+09:00', note: '' },
  { start: '1991-04-14T02:00:00+08:00', end: '1991-09-15T02:00:00+09:00', note: '最后一年' }
];

/** 中国标准时区 */
export const CHINA_ZONE = 'Asia/Shanghai';

const formatterCache = new Map();

function getFormatter(zone) {
  let f = formatterCache.get(zone);
  if (f) return f;
  try {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch (e) {
    throw new Error('未知或不可用的时区 ' + zone + '：' + e.message +
      '。若运行在 small-icu 环境，请改用完整 ICU 的 Node 构建。');
  }
  formatterCache.set(zone, f);
  return f;
}

function partsToMs(parts) {
  const g = (t) => Number(parts.find((p) => p.type === t).value);
  let hour = g('hour');
  if (hour === 24) hour = 0;
  return { ms: Date.UTC(g('year'), g('month') - 1, g('day'), hour, g('minute'), g('second')),
           wall: [g('year'), g('month'), g('day'), hour, g('minute'), g('second')] };
}

/** 把一串 UTC 毫秒直接解读成墙上钟字段（不做时区换算）。
 * 仅用于 candidateOffsets：此时 wallMs 代表的是「用户写的那个钟面读数」。
 * @returns {number[]} [年,月,日,时,分,秒]
 */
function wallFieldsFromMs(wallMs) {
  const d = new Date(wallMs);
  return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
          d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()];
}

/**
 * 求某 UTC 时刻在指定时区的偏移（分钟，东为正）。
 * @param {string} zone IANA 时区名
 * @param {number} utcMs Unix 毫秒
 */
export function zoneOffsetMinutes(zone, utcMs) {
  const { ms } = partsToMs(getFormatter(zone).formatToParts(new Date(utcMs)));
  return (ms - utcMs) / 60000;
}

/** 墙上时刻的字段数组 */
function wallOf(zone, utcMs) {
  return partsToMs(getFormatter(zone).formatToParts(new Date(utcMs))).wall;
}
function sameWall(a, b) {
  for (let i = 0; i < 6; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * 列出墙上时刻对应的所有合法偏移（分钟）。
 *
 * 这是处理夏令时的标准做法：把「墙上时刻 → UTC」反解成「候选偏移验证」。
 *   0 个候选  → 该墙上时刻不存在（夏令时跳变的空洞）
 *   1 个候选  → 正常
 *   2 个候选  → 歧义（夏令时结束时的重复小时）
 *
 * 候选偏移通过「在 ±30 小时窗口内每 3 小时采样一次」收集，
 * 足以覆盖任何单次时区跳变，且不依赖对某国规则的硬编码。
 */
export function candidateOffsets(zone, wallMs) {
  const target = wallFieldsFromMs(wallMs);
  const seen = new Set();
  const valid = [];
  for (let h = -30; h <= 30; h += 3) {
    const o = zoneOffsetMinutes(zone, wallMs + h * 3600000);
    if (seen.has(o)) continue;
    seen.add(o);
    const t = wallMs - o * 60000;
    if (sameWall(wallOf(zone, t), target)) valid.push(o);
  }
  return valid.sort((a, b) => a - b);
}

/**
 * 墙上钟时刻 → UTC 儒略日。
 * @param {{year:number,month:number,day:number,hour?:number,minute?:number,second?:number}} civil
 * @param {string} zone
 * @returns {{jdUTC:number, offsetMinutes:number, dst:boolean, ambiguous:boolean, nonexistent:boolean}}
 */
export function civilToUTC(civil, zone = CHINA_ZONE) {
  const { year, month, day } = civil;
  const hour = civil.hour ?? 0;
  const minute = civil.minute ?? 0;
  const second = civil.second ?? 0;
  const wallMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const candidates = candidateOffsets(zone, wallMs);

  if (candidates.length === 0) {
    const msg = '时刻 ' + year + '-' + month + '-' + day + ' ' + hour + ':' +
      String(minute).padStart(2, '0') + ' 在时区 ' + zone +
      ' 不存在（夏令时跳变造成的空洞）。请确认出生记录使用的是夏令时还是标准时。';
    const err = new Error(msg);
    err.code = 'NONEXISTENT_LOCAL_TIME';
    throw err;
  }

  // 歧义时取较大偏移（夏令时那一支），但显式标记，由上层决定是否提示用户
  const offset = candidates[candidates.length - 1];
  const jdUTC = (wallMs - offset * 60000) / 86400000 + 2440587.5;
  const standard = standardOffsetFor(zone, year);

  return {
    jdUTC,
    offsetMinutes: offset,
    dst: offset > standard,
    ambiguous: candidates.length > 1,
    nonexistent: false
  };
}

/**
 * 该年在指定时区的标准时偏移（分钟）。
 * 做法：全年逐月采样取最小偏移。夏令时只会让偏移变大，
 * 所以最小值就是该年的标准时；南半球（1 月处在夏令时）也成立。
 */
function standardOffsetFor(zone, year) {
  let min = Infinity;
  for (let m = 0; m < 12; m++) {
    const o = zoneOffsetMinutes(zone, Date.UTC(year, m, 15, 12));
    if (o < min) min = o;
  }
  return min;
}

/**
 * UTC 儒略日 → 墙上钟时刻。
 * @param {number} jdUTC
 * @param {string} zone
 */
export function utcToCivil(jdUTC, zone = CHINA_ZONE) {
  const utcMs = Math.round((jdUTC - 2440587.5) * 86400000);
  const w = wallOf(zone, utcMs);
  return {
    year: w[0], month: w[1], day: w[2], hour: w[3], minute: w[4], second: w[5],
    offsetMinutes: zoneOffsetMinutes(zone, utcMs)
  };
}

/** 某时刻是否处于中国夏令时（UTC+9） */
export function isChinaDST(jdUTC) {
  const utcMs = (jdUTC - 2440587.5) * 86400000;
  return zoneOffsetMinutes(CHINA_ZONE, utcMs) === 540;
}

/** 中国夏令时时段转为 UTC 儒略日区间，供测试比对 ICU 数据 */
export function chinaDstRangesAsJD() {
  return CHINA_DST_RANGES.map((r) => ({
    start: Date.parse(r.start) / 86400000 + 2440587.5,
    end: Date.parse(r.end) / 86400000 + 2440587.5,
    note: r.note
  }));
}

/** 由公历 UTC 字段构造儒略日（转出便于调用方使用） */
export function jdFromUTCFields(y, mo, d, h = 0, mi = 0, s = 0) {
  return julianDayFromGregorian(y, mo, d + (h * 3600 + mi * 60 + s) / 86400);
}

export { julianDayFromGregorian, utcFromJulianDay, SECONDS_PER_DAY };
