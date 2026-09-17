/* 本文件由 scripts/build-web-engine.mjs 生成，请勿手工编辑。源码：src/ + rules/ */
// src/astro/vsop87.js
var EARTH_L = [
  [[175347046, 0, 0], [3341656, 4.6692568, 6283.07585], [34894, 4.6261, 12566.1517], [3497, 2.7441, 5753.3849], [3418, 2.8289, 3.5231], [3136, 3.6277, 77713.7715], [2676, 4.4181, 7860.4194], [2343, 6.1352, 3930.2097], [1324, 0.7425, 11506.7698], [1273, 2.0371, 529.691], [1199, 1.1096, 1577.3435], [990, 5.233, 5884.927], [902, 2.045, 26.298], [857, 3.508, 398.149], [780, 1.179, 5223.694], [753, 2.533, 5507.553], [505, 4.583, 18849.228], [492, 4.205, 775.523], [357, 2.92, 0.067], [317, 5.849, 11790.629], [284, 1.899, 796.298], [271, 0.315, 10977.079], [243, 0.345, 5486.778], [206, 4.806, 2544.314], [205, 1.869, 5573.143], [202, 2.458, 6069.777], [156, 0.833, 213.299], [132, 3.411, 2942.463], [126, 1.083, 20.775], [115, 0.645, 0.98], [103, 0.636, 4694.003], [102, 0.976, 15720.839], [102, 4.267, 7.114], [99, 6.21, 2146.17], [98, 0.68, 155.42], [86, 5.98, 161000.69], [85, 1.3, 6275.96], [85, 3.67, 71430.7], [80, 1.81, 17260.15], [79, 3.04, 12036.46], [75, 1.76, 5088.63], [74, 3.5, 3154.69], [74, 4.68, 801.82], [70, 0.83, 9437.76], [62, 3.98, 8827.39], [61, 1.82, 7084.9], [57, 2.78, 6286.6], [56, 4.39, 14143.5], [56, 3.47, 6279.55], [52, 0.19, 12139.55], [52, 1.33, 1748.02], [51, 0.28, 5856.48], [49, 0.49, 1194.45], [41, 5.37, 8429.24], [41, 2.4, 19651.05], [39, 6.17, 10447.39], [37, 6.04, 10213.29], [37, 2.57, 1059.38], [36, 1.71, 2352.87], [36, 1.78, 6812.77], [33, 0.59, 17789.85], [30, 0.44, 83996.85], [30, 2.74, 1349.87], [25, 3.16, 4690.48]],
  [[628331966747, 0, 0], [206059, 2.678235, 6283.07585], [4303, 2.6351, 12566.1517], [425, 1.59, 3.523], [119, 5.796, 26.298], [109, 2.966, 1577.344], [93, 2.59, 18849.23], [72, 1.14, 529.69], [68, 1.87, 398.15], [67, 4.41, 5507.55], [59, 2.89, 5223.69], [56, 2.17, 155.42], [45, 0.4, 796.3], [36, 0.47, 775.52], [29, 2.65, 7.11], [21, 5.34, 0.98], [19, 1.85, 5486.78], [19, 4.97, 213.3], [17, 2.99, 6275.96], [16, 0.03, 2544.31], [16, 1.43, 2146.17], [15, 1.21, 10977.08], [12, 2.83, 1748.02], [12, 3.26, 5088.63], [12, 5.27, 1194.45], [12, 2.08, 4694], [11, 0.77, 553.57], [10, 1.3, 6286.6], [10, 4.24, 1349.87], [9, 2.7, 242.73], [9, 5.64, 951.72], [8, 5.3, 2352.87], [6, 2.65, 9437.76], [6, 4.67, 4690.48]],
  [[52919, 0, 0], [8720, 1.0721, 6283.0758], [309, 0.867, 12566.152], [27, 0.05, 3.52], [16, 5.19, 26.3], [16, 3.68, 155.42], [10, 0.76, 18849.23], [9, 2.06, 77713.77], [7, 0.83, 775.52], [5, 4.66, 1577.34], [4, 1.03, 7.11], [4, 3.44, 5573.14], [3, 5.14, 796.3], [3, 6.05, 5507.55], [3, 1.19, 242.73], [3, 6.12, 529.69], [3, 0.31, 398.15], [3, 2.28, 553.57], [2, 4.38, 5223.69], [2, 3.75, 0.98]],
  [[289, 5.844, 6283.076], [35, 0, 0], [17, 5.49, 12566.15], [3, 5.2, 155.42], [1, 4.72, 3.52], [1, 5.3, 18849.23], [1, 5.97, 242.73]],
  [[114, 3.142, 0], [8, 4.13, 6283.08], [1, 3.84, 12566.15]],
  [[1, 3.14, 0]]
];
var EARTH_R = [
  [[100013989, 0, 0], [1670700, 3.0984635, 6283.07585], [13956, 3.05525, 12566.1517], [3084, 5.1985, 77713.7715], [1628, 1.1739, 5753.3849], [1576, 2.8469, 7860.4194], [925, 5.453, 11506.77], [542, 4.564, 3930.21], [472, 3.661, 5884.927], [346, 0.964, 5507.553], [329, 5.9, 5223.694], [307, 0.299, 5573.143], [243, 4.273, 11790.629], [212, 5.847, 1577.344], [186, 5.022, 10977.079], [175, 3.012, 18849.228], [110, 5.055, 5486.778], [98, 0.89, 6069.78], [86, 5.69, 15720.84], [86, 1.27, 161000.69], [65, 0.27, 17260.15], [63, 0.92, 529.69], [57, 2.01, 83996.85], [56, 5.24, 71430.7], [49, 3.25, 2544.31], [47, 2.58, 775.52], [45, 5.54, 9437.76], [43, 6.01, 6275.96], [39, 5.36, 4694], [38, 2.39, 8827.39], [37, 0.83, 19651.05], [37, 4.9, 12139.55], [36, 1.67, 12036.46], [35, 1.84, 2942.46], [33, 0.24, 7084.9], [32, 0.18, 5088.63], [32, 1.78, 398.15], [28, 1.21, 6286.6], [28, 1.9, 6279.55], [26, 4.59, 10447.39]],
  [[103019, 1.10749, 6283.07585], [1721, 1.0644, 12566.1517], [702, 3.142, 0], [32, 1.02, 18849.23], [31, 2.84, 5507.55], [25, 1.32, 5223.69], [18, 1.42, 1577.34], [10, 5.91, 10977.08], [9, 1.42, 6275.96], [9, 0.27, 5486.78]],
  [[4359, 5.7846, 6283.0758], [124, 5.579, 12566.152], [12, 3.14, 0], [9, 3.63, 77713.77], [6, 1.87, 5573.14], [3, 5.47, 18849.23]],
  [[145, 4.273, 6283.076], [7, 3.92, 12566.15]],
  [[4, 2.56, 6283.08]]
];
var TAU = 2 * Math.PI;
function seriesSum(terms, t) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    s += term[0] * Math.cos(term[1] + term[2] * t);
  }
  return s;
}
function seriesPoly(powers, t) {
  let total = 0;
  for (let i = 0; i < powers.length; i++) {
    total += seriesSum(powers[i], t) * Math.pow(t, i);
  }
  return total;
}
function earthHeliocentricLongitude(jde) {
  const t = (jde - 2451545) / 365250;
  return seriesPoly(EARTH_L, t) / 1e8;
}
function earthRadiusVector(jde) {
  const t = (jde - 2451545) / 365250;
  return seriesPoly(EARTH_R, t) / 1e8;
}

// src/astro/nutation.js
var NUTATION_IAU1980 = [
  [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
  [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
  [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
  [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
  [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
  [0, 0, 1, 0, 0, 712, 0.1, -7, 0],
  [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
  [0, 0, 0, 2, 1, -386, -0.4, 200, 0],
  [0, 0, 1, 2, 2, -301, 0, 129, -0.1],
  [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
  [-2, 0, 1, 0, 0, -158, 0, 0, 0],
  [-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
  [0, 0, -1, 2, 2, 123, 0, -53, 0],
  [2, 0, 0, 0, 0, 63, 0, 0, 0],
  [0, 0, 1, 0, 1, 63, 0.1, -33, 0],
  [2, 0, -1, 2, 2, -59, 0, 26, 0],
  [0, 0, -1, 0, 1, -58, -0.1, 32, 0],
  [0, 0, 1, 2, 1, -51, 0, 27, 0],
  [-2, 0, 2, 0, 0, 48, 0, 0, 0],
  [0, 0, -2, 2, 1, 46, 0, -24, 0],
  [2, 0, 0, 2, 2, -38, 0, 16, 0],
  [0, 0, 2, 2, 2, -31, 0, 13, 0],
  [0, 0, 2, 0, 0, 29, 0, 0, 0],
  [-2, 0, 1, 2, 2, 29, 0, -12, 0],
  [0, 0, 0, 2, 0, 26, 0, 0, 0],
  [-2, 0, 0, 2, 0, -22, 0, 0, 0],
  [0, 0, -1, 2, 1, 21, 0, -10, 0],
  [0, 2, 0, 0, 0, 17, -0.1, 0, 0],
  [2, 0, -1, 0, 1, 16, 0, -8, 0],
  [-2, 2, 0, 2, 2, -16, 0.1, 7, 0],
  [0, 1, 0, 0, 1, -15, 0, 9, 0],
  [-2, 0, 1, 0, 1, -13, 0, 7, 0],
  [0, -1, 0, 0, 1, -12, 0, 6, 0],
  [0, 0, 2, -2, 0, 11, 0, 0, 0],
  [2, 0, -1, 2, 1, -10, 0, 5, 0],
  [2, 0, 1, 2, 2, -8, 0, 3, 0],
  [0, 1, 0, 2, 2, 7, 0, -3, 0],
  [-2, 1, 1, 0, 0, -7, 0, 0, 0],
  [0, -1, 0, 2, 2, -7, 0, 3, 0],
  [2, 0, 0, 2, 1, -7, 0, 3, 0],
  [2, 0, 1, 0, 0, 6, 0, 0, 0],
  [-2, 0, 2, 2, 2, 6, 0, -3, 0],
  [-2, 0, 1, 2, 1, 6, 0, -3, 0],
  [2, 0, -2, 0, 1, -6, 0, 3, 0],
  [2, 0, 0, 0, 1, -6, 0, 3, 0],
  [0, -1, 1, 0, 0, 5, 0, 0, 0],
  [-2, -1, 0, 2, 1, -5, 0, 3, 0],
  [-2, 0, 0, 0, 1, -5, 0, 3, 0],
  [0, 0, 2, 2, 1, -5, 0, 3, 0],
  [-2, 0, 2, 0, 1, 4, 0, 0, 0],
  [-2, 1, 0, 2, 1, 4, 0, 0, 0],
  [0, 0, 1, -2, 0, 4, 0, 0, 0],
  [-1, 0, 1, 0, 0, -4, 0, 0, 0],
  [-2, 1, 0, 0, 0, -4, 0, 0, 0],
  [1, 0, 0, 0, 0, -4, 0, 0, 0],
  [0, 0, 1, 2, 0, 3, 0, 0, 0],
  [0, 0, -2, 2, 2, -3, 0, 0, 0],
  [-1, -1, 1, 0, 0, -3, 0, 0, 0],
  [0, 1, 1, 0, 0, -3, 0, 0, 0],
  [0, -1, 1, 2, 2, -3, 0, 0, 0],
  [2, -1, -1, 2, 2, -3, 0, 0, 0],
  [0, 0, 3, 2, 2, -3, 0, 0, 0],
  [2, -1, 0, 2, 2, -3, 0, 0, 0]
];
var ARCSEC_PER_DEGREE = 3600;
function fundamentalArguments(T) {
  return {
    // 月球与太阳的平距角
    D: 297.85036 + 445267.11148 * T - 19142e-7 * T * T + T * T * T / 189474,
    // 太阳平近点角
    M: 357.52772 + 35999.05034 * T - 1603e-7 * T * T - T * T * T / 3e5,
    // 月球平近点角
    Mp: 134.96298 + 477198.867398 * T + 86972e-7 * T * T + T * T * T / 56250,
    // 月球升交点平角距
    F: 93.27191 + 483202.017538 * T - 36825e-7 * T * T + T * T * T / 327270,
    // 月球升交点黄经
    Om: 125.04452 - 1934.136261 * T + 20708e-7 * T * T + T * T * T / 45e4
  };
}
var DEG_TO_RAD = Math.PI / 180;
function nutation(jde) {
  const T = (jde - 2451545) / 36525;
  const a = fundamentalArguments(T);
  let dpsi = 0;
  let deps = 0;
  for (let i = 0; i < NUTATION_IAU1980.length; i++) {
    const row = NUTATION_IAU1980[i];
    const arg = (row[0] * a.D + row[1] * a.M + row[2] * a.Mp + row[3] * a.F + row[4] * a.Om) * DEG_TO_RAD;
    dpsi += (row[5] + row[6] * T) * Math.sin(arg);
    deps += (row[7] + row[8] * T) * Math.cos(arg);
  }
  return {
    dpsi: dpsi / 1e4 / ARCSEC_PER_DEGREE,
    deps: deps / 1e4 / ARCSEC_PER_DEGREE
  };
}
function nutationInLongitude(jde) {
  return nutation(jde).dpsi;
}
function nutationInObliquity(jde) {
  return nutation(jde).deps;
}
function meanObliquity(T) {
  return 23.4392911111 - 0.0130041667 * T - 163889e-12 * T * T + 503611e-12 * T * T * T;
}
function trueObliquity(jde) {
  const T = (jde - 2451545) / 36525;
  return meanObliquity(T) + nutationInObliquity(jde);
}

// src/time/julian.js
var J2000 = 2451545;
var JD_UNIX_EPOCH = 24405875e-1;
var JULIAN_CENTURY = 36525;
var JULIAN_MILLENNIUM = 365250;
var SECONDS_PER_DAY = 86400;
function julianDayFromGregorian(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const isGregorian = year > 1582 || year === 1582 && (month > 10 || month === 10 && day >= 15);
  const a = Math.floor(y / 100);
  const b = isGregorian ? 2 - a + Math.floor(a / 4) : 0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}
function julianDayFromUTC(parts) {
  const { year, month, day } = parts;
  const hour = parts.hour ?? 0;
  const minute = parts.minute ?? 0;
  const second = parts.second ?? 0;
  const millisecond = parts.millisecond ?? 0;
  const dayFraction2 = (hour + minute / 60 + (second + millisecond / 1e3) / 3600) / 24;
  return julianDayFromGregorian(year, month, day + dayFraction2);
}
function utcFromJulianDay(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 186721625e-2) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const dayWithFraction = b - d - Math.floor(30.6001 * e) + f;
  const day = Math.floor(dayWithFraction);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  let totalSeconds = Math.round((dayWithFraction - day) * SECONDS_PER_DAY);
  let extraDays = 0;
  if (totalSeconds >= SECONDS_PER_DAY) {
    totalSeconds -= SECONDS_PER_DAY;
    extraDays = 1;
  }
  const hour = Math.floor(totalSeconds / 3600);
  const minute = Math.floor(totalSeconds % 3600 / 60);
  const second = totalSeconds % 60;
  if (extraDays === 1) {
    const next = julianDayFromGregorian(year, month, day + 1);
    return utcFromJulianDay(next + totalSeconds / SECONDS_PER_DAY);
  }
  return { year, month, day, hour, minute, second, millisecond: 0 };
}
function julianDayFromDate(date) {
  return date.getTime() / 864e5 + JD_UNIX_EPOCH;
}
function dateFromJulianDay(jd) {
  return new Date((jd - JD_UNIX_EPOCH) * 864e5);
}
function dayFraction(jd) {
  return ((jd + 0.5) % 1 + 1) % 1;
}
function julianCenturies(jde) {
  return (jde - J2000) / JULIAN_CENTURY;
}
function julianMillennia(jde) {
  return (jde - J2000) / JULIAN_MILLENNIUM;
}
function normalizeDegrees(deg) {
  return (deg % 360 + 360) % 360;
}
function normalizeSignedDegrees(deg) {
  return ((deg + 180) % 360 + 360) % 360 - 180;
}

// src/astro/sun.js
var AS2DEG = 1 / ARCSEC_PER_DEGREE;
var FK5_DELTA_LONGITUDE_ARCSEC = -0.09033;
var ABERRATION_ARCSEC_AU = -20.4898;
var MEAN_MOTION_DEG_PER_DAY = 0.98564736;
function sunGeometricLongitude(jde) {
  return normalizeDegrees(earthHeliocentricLongitude(jde) * 180 / Math.PI + 180);
}
function sunApparentLongitude(jde) {
  const L = earthHeliocentricLongitude(jde) * 180 / Math.PI;
  const R = earthRadiusVector(jde);
  const dpsi = nutation(jde).dpsi;
  return normalizeDegrees(
    L + 180 + FK5_DELTA_LONGITUDE_ARCSEC * AS2DEG + dpsi + ABERRATION_ARCSEC_AU / R * AS2DEG
  );
}
function sunLongitudeRate(jde) {
  const h = 0.01;
  const d = normalizeSignedDegrees(sunApparentLongitude(jde + h) - sunApparentLongitude(jde - h));
  return d / (2 * h);
}
function solveSunLongitude(targetDeg, approxJD) {
  let jde = approxJD;
  const tol = 1e-9;
  for (let i = 0; i < 30; i++) {
    const diff = normalizeSignedDegrees(sunApparentLongitude(jde) - targetDeg);
    if (Math.abs(diff) < tol) return jde;
    const rate = sunLongitudeRate(jde) || MEAN_MOTION_DEG_PER_DAY;
    jde -= diff / rate;
  }
  throw new Error("solveSunLongitude did not converge for target " + targetDeg + " from JD " + approxJD);
}
function aberrationArcsec(jde) {
  return ABERRATION_ARCSEC_AU / earthRadiusVector(jde);
}

// src/astro/delta-t.js
var DELTA_T_ANCHORS = [
  [1900, -2.72],
  [1910, 10.46],
  [1920, 21.2],
  [1930, 24.25],
  [1940, 24.35],
  [1950, 29.07],
  [1955, 31.1],
  [1960, 33.15],
  [1965, 35.73],
  [1970, 40.18],
  [1975, 45.48],
  [1980, 50.54],
  [1985, 54.34],
  [1990, 56.86],
  [1995, 60.78],
  [2e3, 63.83],
  [2005, 64.69],
  [2010, 66.07],
  [2015, 67.64],
  [2020, 69.36],
  [2021, 69.36],
  [2022, 69.29],
  [2023, 69.2],
  [2024, 69.18],
  [2025, 69.2]
];
var MEASURED_UNTIL = 2025;
function deltaTSeconds(year) {
  const anchors = DELTA_T_ANCHORS;
  if (year <= anchors[0][0]) {
    const u = (year - 1820) / 100;
    return -20 + 32 * u * u;
  }
  if (year >= anchors[anchors.length - 1][0]) {
    const t = year - MEASURED_UNTIL;
    return 69.2 + 0.1 * t - 5e-3 * t * t;
  }
  for (let i = 0; i < anchors.length - 1; i++) {
    const [y0, d0] = anchors[i];
    const [y1, d1] = anchors[i + 1];
    if (year >= y0 && year <= y1) {
      const f = (year - y0) / (y1 - y0);
      return d0 + (d1 - d0) * (0.5 - 0.5 * Math.cos(Math.PI * f));
    }
  }
  return 69.2;
}
function deltaTUncertaintySeconds(year) {
  if (year >= 1900 && year <= MEASURED_UNTIL) return 1;
  if (year < 1900) return 5;
  const t = year - MEASURED_UNTIL;
  return Math.min(60, 1 + 1.2 * t);
}
function deltaTDays(year) {
  return deltaTSeconds(year) / 86400;
}

// src/astro/solar-terms.js
var SOLAR_TERMS = [
  { key: "xiaohan", name: "\u5C0F\u5BD2", degree: 285, approxMonth: 1, approxDay: 6 },
  { key: "dahan", name: "\u5927\u5BD2", degree: 300, approxMonth: 1, approxDay: 20 },
  { key: "lichun", name: "\u7ACB\u6625", degree: 315, approxMonth: 2, approxDay: 4 },
  { key: "yushui", name: "\u96E8\u6C34", degree: 330, approxMonth: 2, approxDay: 19 },
  { key: "jingzhe", name: "\u60CA\u86F0", degree: 345, approxMonth: 3, approxDay: 6 },
  { key: "chunfen", name: "\u6625\u5206", degree: 0, approxMonth: 3, approxDay: 20 },
  { key: "qingming", name: "\u6E05\u660E", degree: 15, approxMonth: 4, approxDay: 5 },
  { key: "guyu", name: "\u8C37\u96E8", degree: 30, approxMonth: 4, approxDay: 20 },
  { key: "lixia", name: "\u7ACB\u590F", degree: 45, approxMonth: 5, approxDay: 6 },
  { key: "xiaoman", name: "\u5C0F\u6EE1", degree: 60, approxMonth: 5, approxDay: 21 },
  { key: "mangzhong", name: "\u8292\u79CD", degree: 75, approxMonth: 6, approxDay: 6 },
  { key: "xiazhi", name: "\u590F\u81F3", degree: 90, approxMonth: 6, approxDay: 21 },
  { key: "xiaoshu", name: "\u5C0F\u6691", degree: 105, approxMonth: 7, approxDay: 7 },
  { key: "dashu", name: "\u5927\u6691", degree: 120, approxMonth: 7, approxDay: 23 },
  { key: "liqiu", name: "\u7ACB\u79CB", degree: 135, approxMonth: 8, approxDay: 8 },
  { key: "chushu", name: "\u5904\u6691", degree: 150, approxMonth: 8, approxDay: 23 },
  { key: "bailu", name: "\u767D\u9732", degree: 165, approxMonth: 9, approxDay: 8 },
  { key: "qiufen", name: "\u79CB\u5206", degree: 180, approxMonth: 9, approxDay: 23 },
  { key: "hanlu", name: "\u5BD2\u9732", degree: 195, approxMonth: 10, approxDay: 8 },
  { key: "shuangjiang", name: "\u971C\u964D", degree: 210, approxMonth: 10, approxDay: 23 },
  { key: "lidong", name: "\u7ACB\u51AC", degree: 225, approxMonth: 11, approxDay: 7 },
  { key: "xiaoxue", name: "\u5C0F\u96EA", degree: 240, approxMonth: 11, approxDay: 22 },
  { key: "daxue", name: "\u5927\u96EA", degree: 255, approxMonth: 12, approxDay: 7 },
  { key: "dongzhi", name: "\u51AC\u81F3", degree: 270, approxMonth: 12, approxDay: 22 }
];
function isJie(degree) {
  return (degree % 30 + 30) % 30 === 15;
}
function isZhongqi(degree) {
  return (degree % 30 + 30) % 30 === 0;
}
var SOLAR_TERM_BY_KEY = Object.fromEntries(SOLAR_TERMS.map((t) => [t.key, t]));
var SOLAR_TERM_BY_NAME = Object.fromEntries(SOLAR_TERMS.map((t) => [t.name, t]));
function anchorYearForTerm(year, degree) {
  return degree >= 285 ? year - 1 : year;
}
function solarTermInstant(year, degree) {
  const ay = anchorYearForTerm(year, degree);
  const term = SOLAR_TERMS.find((t) => t.degree === degree);
  const approxMonth = term ? term.approxMonth : 1;
  const approxDay = term ? term.approxDay : 1;
  const equinoxAnchor = julianDayFromGregorian(ay, 3, 20 + 0.5);
  const base = equinoxAnchor + degree / 360 * 365.2422;
  const tt = solveSunLongitude(degree, base);
  const dT = deltaTSeconds(ay + (approxMonth - 0.5) / 12);
  return { tt, utc: tt - dT / 86400, year: ay, deltaT: dT };
}
function solarTermsOfYear(year) {
  const out = SOLAR_TERMS.map((t) => {
    const inst = solarTermInstant(year, t.degree);
    return { key: t.key, name: t.name, degree: t.degree, tt: inst.tt, utc: inst.utc, deltaT: inst.deltaT };
  });
  out.sort((a, b) => a.tt - b.tt);
  return out;
}
function currentMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 24405875e-1) * 864e5).getUTCFullYear();
  let best = null;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) {
    for (const t of SOLAR_TERMS) {
      if (!isJie(t.degree)) continue;
      const inst = solarTermInstant(y, t.degree);
      if (inst.utc <= jdUTC && (best === null || inst.utc > best.utc)) {
        best = { key: t.key, name: t.name, degree: t.degree, utc: inst.utc, tt: inst.tt };
      }
    }
  }
  return best;
}
function nextMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 24405875e-1) * 864e5).getUTCFullYear();
  let best = null;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) for (const t of SOLAR_TERMS) {
    if (!isJie(t.degree)) continue;
    const inst = solarTermInstant(y, t.degree);
    if (inst.utc > jdUTC && (best === null || inst.utc < best.utc)) best = { key: t.key, name: t.name, degree: t.degree, utc: inst.utc, tt: inst.tt };
  }
  return best;
}
function nearestMonthBoundary(jdUTC) {
  const yearGuess = new Date((jdUTC - 24405875e-1) * 864e5).getUTCFullYear();
  let best = null;
  let bestAbs = Infinity;
  for (const y of [yearGuess - 1, yearGuess, yearGuess + 1]) {
    for (const t of SOLAR_TERMS) {
      if (t.degree % 30 !== 0) continue;
      const inst = solarTermInstant(y, t.degree);
      const d = (inst.utc - jdUTC) * 86400;
      if (Math.abs(d) < bestAbs) {
        bestAbs = Math.abs(d);
        best = { key: t.key, name: t.name, degree: t.degree, utc: inst.utc, secondsAway: d };
      }
    }
  }
  return best ? { secondsToBoundary: best.secondsAway, boundary: best } : null;
}
function sunLongitudeAtUTC(jdUTC) {
  const y = new Date((jdUTC - 24405875e-1) * 864e5).getUTCFullYear();
  const dT = deltaTSeconds(y);
  return normalizeDegrees(sunApparentLongitude(jdUTC + dT / 86400));
}

// src/astro/moon.js
var SYNODIC_MONTH = 29.530588861;
var MONTHS_PER_YEAR = 12.3685;
var DEG = Math.PI / 180;
function norm360(x) {
  return (x % 360 + 360) % 360;
}
function moonPhaseJDE(k, phase) {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  let jde = 245155009766e-5 + SYNODIC_MONTH * k + 15437e-8 * T2 - 15e-8 * T3 + 73e-11 * T4;
  const E = 1 - 2516e-6 * T - 74e-7 * T2;
  const M = norm360(2.5534 + 29.1053567 * k - 14e-7 * T2 - 11e-8 * T3);
  const Mp = norm360(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 1238e-8 * T3 - 58e-9 * T4);
  const F = norm360(160.7108 + 390.67050284 * k - 16118e-7 * T2 - 227e-8 * T3 + 11e-9 * T4);
  const Om = norm360(124.7746 - 1.56375588 * k + 20672e-7 * T2 + 215e-8 * T3);
  const sin = (d) => Math.sin(d * DEG);
  const cos = (d) => Math.cos(d * DEG);
  let c = 0;
  if (phase === 0 || phase === 2) {
    const isNew = phase === 0;
    const table = [
      [1, 0, 0, isNew ? -0.4072 : -0.40614],
      [0, 1, 0, isNew ? 0.17241 : 0.17302],
      [2, 0, 0, isNew ? 0.01608 : 0.01614],
      [0, 0, 2, isNew ? 0.01039 : 0.01043],
      [1, -1, 0, isNew ? 739e-5 : 734e-5],
      [1, 1, 0, isNew ? -514e-5 : -515e-5],
      [0, 2, 0, isNew ? 208e-5 : 209e-5],
      [1, 0, -2, isNew ? -111e-5 : -111e-5],
      [1, 0, 2, isNew ? -57e-5 : -57e-5],
      [2, 1, 0, isNew ? 56e-5 : 56e-5],
      [3, 0, 0, isNew ? -42e-5 : -42e-5],
      [0, 1, 2, isNew ? 42e-5 : 42e-5],
      [0, 1, -2, isNew ? 38e-5 : 38e-5],
      [2, -1, 0, isNew ? -24e-5 : -24e-5],
      [0, 0, 0, isNew ? -17e-5 : -17e-5],
      [1, 2, 0, isNew ? -7e-5 : -7e-5],
      [2, 0, -2, isNew ? 4e-5 : 4e-5],
      [0, 3, 0, isNew ? 4e-5 : 4e-5],
      [1, 1, -2, isNew ? 3e-5 : 3e-5],
      [2, 0, 2, isNew ? 3e-5 : 3e-5],
      [1, 1, 2, isNew ? -3e-5 : -3e-5],
      [1, -1, 2, isNew ? 3e-5 : 3e-5],
      [1, -1, -2, isNew ? -2e-5 : -2e-5],
      [3, 1, 0, isNew ? -2e-5 : -2e-5],
      [4, 0, 0, isNew ? 2e-5 : 2e-5]
    ];
    for (const [a, b, d, coef] of table) {
      let term = coef * sin(a * Mp + b * M + d * F);
      if (Math.abs(b) === 1) term *= E;
      else if (Math.abs(b) === 2) term *= E * E;
      c += term;
    }
    c += -17e-5 * sin(Om);
  } else {
    const table = [
      [1, 0, 0, -0.62801],
      [0, 1, 0, 0.17172],
      [1, 1, 0, -0.01183],
      [2, 0, 0, 862e-5],
      [0, 0, 2, 804e-5],
      [1, -1, 0, 454e-5],
      [0, 2, 0, 204e-5],
      [1, 0, -2, -18e-4],
      [1, 0, 2, -7e-4],
      [3, 0, 0, -4e-4],
      [2, -1, 0, -34e-5],
      [0, 1, 2, 32e-5],
      [0, 1, -2, 32e-5],
      [1, 2, 0, -28e-5],
      [2, 1, 0, 27e-5],
      [0, 0, 0, -17e-5],
      [1, -1, -2, -5e-5],
      [2, 0, 2, 4e-5],
      [1, 1, 2, -4e-5],
      [1, -2, 0, 4e-5],
      [1, 1, -2, 3e-5],
      [0, 3, 0, 3e-5],
      [2, 0, -2, 2e-5],
      [1, -1, 2, 2e-5],
      [3, 1, 0, -2e-5]
    ];
    for (const [a, b, d, coef] of table) {
      let term = coef * sin(a * Mp + b * M + d * F);
      if (Math.abs(b) === 1) term *= E;
      else if (Math.abs(b) === 2) term *= E * E;
      c += term;
    }
    const Wc = 306e-5 - 38e-5 * E * cos(M) + 26e-5 * cos(Mp) - 2e-5 * cos(Mp - M) + 2e-5 * cos(Mp + M) + 2e-5 * cos(2 * F);
    c += phase === 1 ? Wc : -Wc;
  }
  const A = [
    [299.77, 0.107408, -9173e-6],
    [251.88, 0.016321, 0],
    [251.83, 26.651886, 0],
    [349.42, 36.412478, 0],
    [84.66, 18.206239, 0],
    [141.74, 53.303771, 0],
    [207.14, 2.453732, 0],
    [154.84, 7.30686, 0],
    [34.52, 27.261239, 0],
    [207.19, 0.121824, 0],
    [291.34, 1.844379, 0],
    [161.72, 24.198154, 0],
    [239.56, 25.513099, 0],
    [331.55, 3.592518, 0]
  ];
  const AC = [
    325e-6,
    165e-6,
    164e-6,
    126e-6,
    11e-5,
    62e-6,
    6e-5,
    56e-6,
    47e-6,
    42e-6,
    4e-5,
    37e-6,
    35e-6,
    23e-6
  ];
  for (let i = 0; i < A.length; i++) {
    const ang = A[i][0] + A[i][1] * k + A[i][2] * T2;
    c += AC[i] * sin(ang);
  }
  return jde + c;
}
function kFromYear(year) {
  return Math.round((year - 2e3) * MONTHS_PER_YEAR);
}
function newMoonsNearYear(year, pad = 2) {
  const k0 = kFromYear(year - 1);
  const k1 = kFromYear(year + 1);
  const out = [];
  for (let k = k0 - pad; k <= k1 + pad; k++) out.push(moonPhaseJDE(k, 0));
  out.sort((a, b) => a - b);
  return out;
}
function newMoonsBetween(jdeStart, jdeEnd) {
  const midYear = 2e3 + (jdeStart - 2451545) / 365.2425;
  const k0 = Math.floor((jdeStart - 245155009766e-5) / SYNODIC_MONTH) - 3;
  const k1 = Math.ceil((jdeEnd - 245155009766e-5) / SYNODIC_MONTH) + 3;
  const out = [];
  for (let k = k0; k <= k1; k++) {
    const jde = moonPhaseJDE(k, 0);
    if (jde >= jdeStart && jde <= jdeEnd) out.push(jde);
  }
  return out;
}
function ttToUTC(jde) {
  const year = 2e3 + (jde - 2451545) / 365.2425;
  return jde - deltaTSeconds(year) / 86400;
}
function utcToTT(jdUTC) {
  const year = 2e3 + (jdUTC - 2451545) / 365.2425;
  return jdUTC + deltaTSeconds(year) / 86400;
}

// src/astro/equation-of-time.js
var DEG2 = Math.PI / 180;
function sunMeanLongitude(jde) {
  const T = julianCenturies(jde);
  const tau = T / 10;
  const tau2 = tau * tau, tau3 = tau2 * tau, tau4 = tau3 * tau, tau5 = tau4 * tau;
  return normalizeDegrees(
    280.4664567 + 360007.6982779 * tau + 0.03032028 * tau2 + tau3 / 49931 - tau4 / 15300 - tau5 / 2e6
  );
}
function sunApparentRightAscension(jde) {
  const lambda = sunApparentLongitude(jde) * DEG2;
  const eps = trueObliquity(jde) * DEG2;
  const alpha = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  return normalizeDegrees(alpha / DEG2);
}
function equationOfTimeMinutes(jde) {
  const L0 = sunMeanLongitude(jde);
  const alpha = sunApparentRightAscension(jde);
  const eps = trueObliquity(jde);
  const dpsi = nutationInLongitude(jde);
  let e = L0 - 57183e-7 - alpha + dpsi * Math.cos(eps * DEG2);
  e = ((e + 180) % 360 + 360) % 360 - 180;
  return e * 4;
}
function equationOfTimeSeconds(jde) {
  return equationOfTimeMinutes(jde) * 60;
}

// src/time/timezone.js
var CHINA_DST_RANGES = [
  { start: "1986-05-04T02:00:00+08:00", end: "1986-09-14T02:00:00+09:00", note: "\u9996\u5E74\uFF0C\u8D77\u59CB\u65E5\u7279\u4F8B\u4E3A 5 \u6708 4 \u65E5" },
  { start: "1987-04-12T02:00:00+08:00", end: "1987-09-13T02:00:00+09:00", note: "" },
  { start: "1988-04-17T02:00:00+08:00", end: "1988-09-11T02:00:00+09:00", note: "" },
  { start: "1989-04-16T02:00:00+08:00", end: "1989-09-17T02:00:00+09:00", note: "" },
  { start: "1990-04-15T02:00:00+08:00", end: "1990-09-16T02:00:00+09:00", note: "" },
  { start: "1991-04-14T02:00:00+08:00", end: "1991-09-15T02:00:00+09:00", note: "\u6700\u540E\u4E00\u5E74" }
];
var CHINA_ZONE = "Asia/Shanghai";
var formatterCache = /* @__PURE__ */ new Map();
function getFormatter(zone) {
  let f = formatterCache.get(zone);
  if (f) return f;
  try {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch (e) {
    throw new Error("\u672A\u77E5\u6216\u4E0D\u53EF\u7528\u7684\u65F6\u533A " + zone + "\uFF1A" + e.message + "\u3002\u82E5\u8FD0\u884C\u5728 small-icu \u73AF\u5883\uFF0C\u8BF7\u6539\u7528\u5B8C\u6574 ICU \u7684 Node \u6784\u5EFA\u3002");
  }
  formatterCache.set(zone, f);
  return f;
}
function partsToMs(parts) {
  const g = (t) => Number(parts.find((p) => p.type === t).value);
  let hour = g("hour");
  if (hour === 24) hour = 0;
  return {
    ms: Date.UTC(g("year"), g("month") - 1, g("day"), hour, g("minute"), g("second")),
    wall: [g("year"), g("month"), g("day"), hour, g("minute"), g("second")]
  };
}
function wallFieldsFromMs(wallMs) {
  const d = new Date(wallMs);
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
  ];
}
function zoneOffsetMinutes(zone, utcMs) {
  const { ms } = partsToMs(getFormatter(zone).formatToParts(new Date(utcMs)));
  return (ms - utcMs) / 6e4;
}
function wallOf(zone, utcMs) {
  return partsToMs(getFormatter(zone).formatToParts(new Date(utcMs))).wall;
}
function sameWall(a, b) {
  for (let i = 0; i < 6; i++) if (a[i] !== b[i]) return false;
  return true;
}
function candidateOffsets(zone, wallMs) {
  const target = wallFieldsFromMs(wallMs);
  const seen = /* @__PURE__ */ new Set();
  const valid = [];
  for (let h = -30; h <= 30; h += 3) {
    const o = zoneOffsetMinutes(zone, wallMs + h * 36e5);
    if (seen.has(o)) continue;
    seen.add(o);
    const t = wallMs - o * 6e4;
    if (sameWall(wallOf(zone, t), target)) valid.push(o);
  }
  return valid.sort((a, b) => a - b);
}
function civilToUTC(civil, zone = CHINA_ZONE) {
  const { year, month, day } = civil;
  const hour = civil.hour ?? 0;
  const minute = civil.minute ?? 0;
  const second = civil.second ?? 0;
  const wallMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const candidates = candidateOffsets(zone, wallMs);
  if (candidates.length === 0) {
    const msg = "\u65F6\u523B " + year + "-" + month + "-" + day + " " + hour + ":" + String(minute).padStart(2, "0") + " \u5728\u65F6\u533A " + zone + " \u4E0D\u5B58\u5728\uFF08\u590F\u4EE4\u65F6\u8DF3\u53D8\u9020\u6210\u7684\u7A7A\u6D1E\uFF09\u3002\u8BF7\u786E\u8BA4\u51FA\u751F\u8BB0\u5F55\u4F7F\u7528\u7684\u662F\u590F\u4EE4\u65F6\u8FD8\u662F\u6807\u51C6\u65F6\u3002";
    const err = new Error(msg);
    err.code = "NONEXISTENT_LOCAL_TIME";
    throw err;
  }
  const offset = candidates[candidates.length - 1];
  const jdUTC = (wallMs - offset * 6e4) / 864e5 + 24405875e-1;
  const standard = standardOffsetFor(zone, year);
  return {
    jdUTC,
    offsetMinutes: offset,
    dst: offset > standard,
    ambiguous: candidates.length > 1,
    nonexistent: false
  };
}
function standardOffsetFor(zone, year) {
  let min = Infinity;
  for (let m = 0; m < 12; m++) {
    const o = zoneOffsetMinutes(zone, Date.UTC(year, m, 15, 12));
    if (o < min) min = o;
  }
  return min;
}
function utcToCivil(jdUTC, zone = CHINA_ZONE) {
  const utcMs = Math.round((jdUTC - 24405875e-1) * 864e5);
  const w = wallOf(zone, utcMs);
  return {
    year: w[0],
    month: w[1],
    day: w[2],
    hour: w[3],
    minute: w[4],
    second: w[5],
    offsetMinutes: zoneOffsetMinutes(zone, utcMs)
  };
}
function isChinaDST(jdUTC) {
  const utcMs = (jdUTC - 24405875e-1) * 864e5;
  return zoneOffsetMinutes(CHINA_ZONE, utcMs) === 540;
}
function chinaDstRangesAsJD() {
  return CHINA_DST_RANGES.map((r) => ({
    start: Date.parse(r.start) / 864e5 + 24405875e-1,
    end: Date.parse(r.end) / 864e5 + 24405875e-1,
    note: r.note
  }));
}
function jdFromUTCFields(y, mo, d, h = 0, mi = 0, s = 0) {
  return julianDayFromGregorian(y, mo, d + (h * 3600 + mi * 60 + s) / 86400);
}

// src/time/shichen.js
var SHICHEN = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
function trueSolarMinutes({ hour = 0, minute = 0, second = 0 }, longitude = 120, equationOfTime = 0) {
  return hour * 60 + minute + second / 60 + (longitude - 120) * 4 + equationOfTime;
}
function equationOfTimeForCivil(civil, zone = CHINA_ZONE) {
  const { year, month, day } = civil ?? {};
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 0;
  let jdUTC;
  try {
    jdUTC = civilToUTC(civil, zone).jdUTC;
  } catch {
    const hour = civil.hour ?? 0, minute = civil.minute ?? 0, second = civil.second ?? 0;
    jdUTC = julianDayFromGregorian(year, month, day + (hour * 3600 + minute * 60 + second) / 86400);
  }
  return equationOfTimeMinutes(utcToTT(jdUTC));
}
function shichenOfCivil(civil, longitude = 120, options = {}) {
  const eot = options.equationOfTimeMinutes ?? equationOfTimeForCivil(civil, options.timezone ?? CHINA_ZONE);
  let m = trueSolarMinutes(civil, longitude, eot);
  m = (m % 1440 + 1440) % 1440;
  const index = Math.floor((m + 60) / 120) % 12;
  return {
    name: SHICHEN[index],
    index,
    trueSolarMinutes: m,
    equationOfTimeMinutes: eot,
    boundaryMinutes: index === 0 ? 1380 : index * 120 - 60,
    timePrecision: options.timePrecision ?? "exact"
  };
}

// rules/bazi-core-0.1.0/ruleset.js
var RULE_SET_ID = "bazi-core-0.1.0";
var ruleset_default = {
  id: RULE_SET_ID,
  version: "0.1.0",
  title: "\u56DB\u67F1\u6838\u5FC3\u89C4\u5219\u96C6\uFF08\u901A\u7528\u6D3E\uFF09",
  school: "common",
  locale: "zh-Hans",
  system: "bazi",
  engineCompatibility: ">=0.3.0 <0.6.0",
  conventions: {
    yearBoundary: {
      ruleId: "bazi.year.solar-term-boundary",
      value: "lichun",
      label: "\u5E74\u67F1\u4EE5\u7ACB\u6625\u4E3A\u754C\uFF1A\u592A\u9633\u89C6\u9EC4\u7ECF\u8FBE\u5230 315\xB0 \u7684\u77AC\u95F4\u6362\u5E74",
      evidence: "astronomical",
      source: ["meeus-aa2", "jie-zhongqi"],
      confidence: 0.97
    },
    monthBoundary: {
      ruleId: "bazi.month.jie-boundary",
      value: "nearest-jie-before-instant",
      label: "\u6708\u67F1\u53D6\u51FA\u751F\u77AC\u95F4\u4E4B\u524D\u6700\u8FD1\u7684\u300C\u8282\u300D\uFF08\u9EC4\u7ECF 15\xB0 \u7684\u5947\u6570\u500D\uFF09",
      evidence: "astronomical",
      source: ["meeus-aa2", "jie-zhongqi"],
      confidence: 0.95
    },
    dayBoundary: {
      ruleId: "bazi.day.local-midnight",
      value: "local-midnight",
      label: "\u65E5\u67F1\u4EE5\u51FA\u751F\u5730\u6C11\u7528\u65E5\u96F6\u70B9\u6362\u65E5\uFF08\u5B50\u6B63\u6362\u65E5\uFF09",
      evidence: "convention",
      source: ["jdn-anchor"],
      confidence: 0.9
    },
    hourBoundary: {
      ruleId: "bazi.hour.true-solar-time",
      value: "true-solar-two-hour",
      label: "\u65F6\u67F1\u4EE5\u771F\u592A\u9633\u65F6\u6BCF\u4E24\u5C0F\u65F6\u4E00\u65F6\u8FB0\uFF0C\u5B50\u65F6\u8D77\u4E8E\u771F\u592A\u9633\u65F6 23:00",
      evidence: "convention",
      source: ["true-solar-time"],
      confidence: 0.88
    },
    luckDirection: {
      ruleId: "bazi.luck.year-stem-polarity",
      value: "yang-male-yin-female-forward",
      label: "\u9633\u5E74\u5E72\u7537\u547D\u3001\u9634\u5E74\u5E72\u5973\u547D\u987A\u884C\uFF0C\u5176\u4F59\u9006\u884C",
      evidence: "traditional",
      source: ["yuan-hai-zi-ping"],
      confidence: 0.85
    },
    lunarMonthNumbering: {
      ruleId: "lunar.month.winter-solstice-anchor",
      value: "solstice-month-is-eleven",
      label: "\u542B\u51AC\u81F3\uFF08\u9EC4\u7ECF 270\xB0\uFF09\u7684\u6708\u56FA\u5B9A\u4E3A\u5341\u4E00\u6708\uFF0C\u5176\u4F59\u6708\u4EFD\u81EA\u8BE5\u951A\u70B9\u5411\u524D\u540E\u63A8\u6392",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.95
    },
    lunarLeapMonth: {
      ruleId: "lunar.leap.no-zhongqi",
      value: "no-zhongqi-month-is-leap",
      label: "\u4E0D\u542B\u4E2D\u6C14\u7684\u6708\u4E3A\u95F0\u6708\uFF0C\u6CBF\u7528\u524D\u4E00\u6708\u6708\u5E8F",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.95
    },
    lunarDayBoundary: {
      ruleId: "lunar.month.civil-day-boundary",
      value: "china-civil-midnight",
      label: "\u519C\u5386\u6708\u4ECE\u300C\u5305\u542B\u6714\u65F6\u523B\u7684\u4E2D\u56FD\u6C11\u7528\u65E5\u300D\u96F6\u65F6\u8D77\u7B97\uFF0C\u4E0D\u6309\u6714\u7684\u77AC\u95F4\u5207\u5206",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.92
    },
    luckStart: {
      ruleId: "bazi.luck.days-to-boundary-over-3",
      value: "exact-fraction",
      label: "\u8D77\u8FD0\u5E74\u9F84 = \u51FA\u751F\u5230\u987A\uFF0F\u9006\u65B9\u5411\u76F8\u90BB\u300C\u8282\u300D\u7684\u5929\u6570 \xF7 3",
      evidence: "traditional",
      source: ["yuan-hai-zi-ping"],
      confidence: 0.8
    }
  },
  tables: {
    stems: [
      { name: "\u7532", yinYang: "yang", element: "\u6728" },
      { name: "\u4E59", yinYang: "yin", element: "\u6728" },
      { name: "\u4E19", yinYang: "yang", element: "\u706B" },
      { name: "\u4E01", yinYang: "yin", element: "\u706B" },
      { name: "\u620A", yinYang: "yang", element: "\u571F" },
      { name: "\u5DF1", yinYang: "yin", element: "\u571F" },
      { name: "\u5E9A", yinYang: "yang", element: "\u91D1" },
      { name: "\u8F9B", yinYang: "yin", element: "\u91D1" },
      { name: "\u58EC", yinYang: "yang", element: "\u6C34" },
      { name: "\u7678", yinYang: "yin", element: "\u6C34" }
    ],
    branches: [
      { name: "\u5B50", element: "\u6C34", hiddenStems: ["\u7678"] },
      { name: "\u4E11", element: "\u571F", hiddenStems: ["\u5DF1", "\u7678", "\u8F9B"] },
      { name: "\u5BC5", element: "\u6728", hiddenStems: ["\u7532", "\u4E19", "\u620A"] },
      { name: "\u536F", element: "\u6728", hiddenStems: ["\u4E59"] },
      { name: "\u8FB0", element: "\u571F", hiddenStems: ["\u620A", "\u4E59", "\u7678"] },
      { name: "\u5DF3", element: "\u706B", hiddenStems: ["\u4E19", "\u620A", "\u5E9A"] },
      { name: "\u5348", element: "\u706B", hiddenStems: ["\u4E01", "\u5DF1"] },
      { name: "\u672A", element: "\u571F", hiddenStems: ["\u5DF1", "\u4E01", "\u4E59"] },
      { name: "\u7533", element: "\u91D1", hiddenStems: ["\u5E9A", "\u58EC", "\u620A"] },
      { name: "\u9149", element: "\u91D1", hiddenStems: ["\u8F9B"] },
      { name: "\u620C", element: "\u571F", hiddenStems: ["\u620A", "\u8F9B", "\u4E01"] },
      { name: "\u4EA5", element: "\u6C34", hiddenStems: ["\u58EC", "\u7532"] }
    ],
    tenGodNames: ["\u6BD4\u80A9", "\u52AB\u8D22", "\u98DF\u795E", "\u4F24\u5B98", "\u504F\u8D22", "\u6B63\u8D22", "\u4E03\u6740", "\u6B63\u5B98", "\u504F\u5370", "\u6B63\u5370"],
    tenGodRule: {
      ruleId: "bazi.ten-god.same-polarity-cycle",
      label: "\u5341\u795E\u6309\u300C\u65E5\u5E72\u2192\u4ED6\u5E72\u300D\u5728\u5341\u5E72\u5E8F\u5217\u4E0A\u7684\u540C\u9634\u9633\u7B49\u8DDD\u6620\u5C04\uFF0C\u5E8F\u53F7\u5DEE\u53D6\u6A21 10",
      evidence: "traditional",
      source: ["san-ming-tong-hui"],
      confidence: 0.8
    },
    hiddenStemsRule: {
      ruleId: "bazi.hidden-stems.branch-table",
      label: "\u85CF\u5E72\u53D6\u5730\u652F\u672C\u6C14\u3001\u4E2D\u6C14\u3001\u4F59\u6C14\u4E09\u6863\uFF0C\u8868\u5E8F\u5373\u4F18\u5148\u7EA7",
      evidence: "traditional",
      source: ["san-ming-tong-hui"],
      confidence: 0.8
    },
    elementCountRule: {
      ruleId: "bazi.wuxing.element-count",
      label: "\u4E94\u884C\u529B\u91CF\u6309\u56DB\u67F1\u5929\u5E72\u4E0E\u5730\u652F\u672C\u6C14\u5404\u8BA1\u4E00\u6B21\uFF08\u85CF\u5E72\u6743\u91CD [1, 0, 0]\uFF09",
      evidence: "traditional",
      source: ["san-ming-tong-hui"],
      confidence: 0.7
    },
    dayPillarRule: {
      ruleId: "bazi.day.sexagenary-jdn",
      label: "\u65E5\u5E72\u652F = (\u5112\u7565\u65E5\u6570 JDN + 49) mod 60\uFF0C\u951A\u70B9 1900-01-01 \u4E3A\u7532\u620C\u65E5",
      evidence: "convention",
      source: ["jdn-anchor"],
      confidence: 0.92
    }
  },
  parameters: {
    monthBoundaryStepDegrees: 30,
    monthBoundaryOffsetDegrees: 15,
    dayPillarJdnOffset: 49,
    dayBoundaryMode: "civil-midnight",
    ziChuStartTrueSolarMinutes: 1380,
    hiddenStemWeights: [1, 0, 0],
    luckDaysPerYear: 3,
    luckDaysPerMonth: 0.25,
    sexagenaryCycleLength: 60
  },
  sources: {
    "meeus-aa2": {
      citation: "Meeus, Astronomical Algorithms, 2nd ed. (1998), ch. 7 / 22 / 25 / 27 / 49",
      kind: "astronomical-reference"
    },
    "jie-zhongqi": {
      citation: "\u672C\u9879\u76EE ADR-0003\uFF1A\u8282\u4E3A\u9EC4\u7ECF 15\xB0+30\xB0k\uFF0C\u4E2D\u6C14\u4E3A 30\xB0k",
      kind: "project-decision"
    },
    "jdn-anchor": {
      citation: "\u5112\u7565\u65E5\u6570\u4E0E\u5E72\u652F\u7EAA\u65E5\u951A\u70B9\uFF1A1900-01-01 \u4E3A\u7532\u620C\u65E5\uFF08JDN 2415021\uFF0C\u516D\u5341\u7532\u5B50\u5E8F 10\uFF09",
      kind: "calibration-anchor"
    },
    "true-solar-time": {
      citation: "\u771F\u592A\u9633\u65F6 = \u5E73\u592A\u9633\u65F6 + (\u7ECF\u5EA6 \u2212 120\xB0)\xD74 \u5206\u949F + \u5747\u65F6\u5DEE",
      kind: "astronomical-reference"
    },
    "yuan-hai-zi-ping": {
      citation: "\u300A\u6E0A\u6D77\u5B50\u5E73\u300B\u5B50\u5E73\u6CD5\uFF1A\u56DB\u67F1\u3001\u5927\u8FD0\u987A\u9006\u4E0E\u8D77\u8FD0",
      kind: "traditional-text"
    },
    "chinese-calendar-rule": {
      citation: "\u519C\u5386\u7F16\u6392\u89C4\u5219\uFF1A\u6714\u65E5\u4E3A\u6708\u9996\u3001\u51AC\u81F3\u6240\u5728\u6708\u4E3A\u5341\u4E00\u6708\u3001\u65E0\u4E2D\u6C14\u4E4B\u6708\u4E3A\u95F0\u6708\uFF08\u4E0E ADR-0003 \u914D\u5957\uFF09",
      kind: "calendar-convention"
    },
    "san-ming-tong-hui": {
      citation: "\u300A\u4E09\u547D\u901A\u4F1A\u300B\uFF1A\u5341\u795E\u4E0E\u5730\u652F\u85CF\u5E72\u4F53\u7CFB",
      kind: "traditional-text"
    }
  }
};

// rules/bazi-zichu-0.1.0/ruleset.js
var RULE_SET_ID2 = "bazi-zichu-0.1.0";
var ruleset_default2 = {
  id: RULE_SET_ID2,
  version: "0.1.0",
  title: "\u56DB\u67F1\u89C4\u5219\u96C6\uFF08\u5B50\u521D\u6362\u65E5\u6D3E\uFF09",
  school: "zichu",
  locale: "zh-Hans",
  system: "bazi",
  engineCompatibility: ">=0.3.0 <0.6.0",
  conventions: {
    yearBoundary: {
      ruleId: "bazi.year.solar-term-boundary",
      value: "lichun",
      label: "\u5E74\u67F1\u4EE5\u7ACB\u6625\u4E3A\u754C\uFF1A\u592A\u9633\u89C6\u9EC4\u7ECF\u8FBE\u5230 315\xB0 \u7684\u77AC\u95F4\u6362\u5E74",
      evidence: "astronomical",
      source: ["meeus-aa2", "jie-zhongqi"],
      confidence: 0.97
    },
    monthBoundary: {
      ruleId: "bazi.month.jie-boundary",
      value: "nearest-jie-before-instant",
      label: "\u6708\u67F1\u53D6\u51FA\u751F\u77AC\u95F4\u4E4B\u524D\u6700\u8FD1\u7684\u300C\u8282\u300D\uFF08\u9EC4\u7ECF 15\xB0 \u7684\u5947\u6570\u500D\uFF09",
      evidence: "astronomical",
      source: ["meeus-aa2", "jie-zhongqi"],
      confidence: 0.95
    },
    dayBoundary: {
      ruleId: "bazi.day.zi-chu-true-solar",
      value: "zi-chu-true-solar",
      label: "\u65E5\u67F1\u4EE5\u771F\u592A\u9633\u65F6 23:00\uFF08\u5B50\u521D\uFF09\u6362\u65E5\uFF0C23:00 \u540E\u5373\u5C5E\u6B21\u65E5\u65E5\u67F1",
      evidence: "traditional",
      source: ["san-ming-tong-hui", "zi-chu-commentary"],
      confidence: 0.72
    },
    hourBoundary: {
      ruleId: "bazi.hour.true-solar-time",
      value: "true-solar-two-hour",
      label: "\u65F6\u67F1\u4EE5\u771F\u592A\u9633\u65F6\u6BCF\u4E24\u5C0F\u65F6\u4E00\u65F6\u8FB0\uFF0C\u5B50\u65F6\u8D77\u4E8E\u771F\u592A\u9633\u65F6 23:00",
      evidence: "convention",
      source: ["true-solar-time"],
      confidence: 0.88
    },
    luckDirection: {
      ruleId: "bazi.luck.gender-only",
      value: "male-forward-female-backward",
      label: "\u5927\u8FD0\u4E00\u5F8B\u7537\u547D\u987A\u884C\u3001\u5973\u547D\u9006\u884C\uFF0C\u4E0D\u770B\u5E74\u5E72\u9634\u9633",
      evidence: "traditional",
      source: ["zi-ping-she-yi"],
      confidence: 0.6
    },
    lunarMonthNumbering: {
      ruleId: "lunar.month.winter-solstice-anchor",
      value: "solstice-month-is-eleven",
      label: "\u542B\u51AC\u81F3\uFF08\u9EC4\u7ECF 270\xB0\uFF09\u7684\u6708\u56FA\u5B9A\u4E3A\u5341\u4E00\u6708\uFF0C\u5176\u4F59\u6708\u4EFD\u81EA\u8BE5\u951A\u70B9\u5411\u524D\u540E\u63A8\u6392",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.95
    },
    lunarLeapMonth: {
      ruleId: "lunar.leap.no-zhongqi",
      value: "no-zhongqi-month-is-leap",
      label: "\u4E0D\u542B\u4E2D\u6C14\u7684\u6708\u4E3A\u95F0\u6708\uFF0C\u6CBF\u7528\u524D\u4E00\u6708\u6708\u5E8F",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.95
    },
    lunarDayBoundary: {
      ruleId: "lunar.month.civil-day-boundary",
      value: "china-civil-midnight",
      label: "\u519C\u5386\u6708\u4ECE\u300C\u5305\u542B\u6714\u65F6\u523B\u7684\u4E2D\u56FD\u6C11\u7528\u65E5\u300D\u96F6\u65F6\u8D77\u7B97\uFF0C\u4E0D\u6309\u6714\u7684\u77AC\u95F4\u5207\u5206",
      evidence: "convention",
      source: ["chinese-calendar-rule"],
      confidence: 0.92
    },
    luckStart: {
      ruleId: "bazi.luck.days-to-boundary-rounded-year",
      value: "round-to-whole-year",
      label: "\u8D77\u8FD0\u5E74\u9F84\u6309\u51FA\u751F\u5230\u987A\uFF0F\u9006\u65B9\u5411\u76F8\u90BB\u300C\u8282\u300D\u7684\u5929\u6570 \xF7 3 \u540E\u53D6\u6574\u5230\u6574\u5E74",
      evidence: "traditional",
      source: ["zi-ping-she-yi"],
      confidence: 0.65
    }
  },
  tables: {
    stems: [
      { name: "\u7532", yinYang: "yang", element: "\u6728" },
      { name: "\u4E59", yinYang: "yin", element: "\u6728" },
      { name: "\u4E19", yinYang: "yang", element: "\u706B" },
      { name: "\u4E01", yinYang: "yin", element: "\u706B" },
      { name: "\u620A", yinYang: "yang", element: "\u571F" },
      { name: "\u5DF1", yinYang: "yin", element: "\u571F" },
      { name: "\u5E9A", yinYang: "yang", element: "\u91D1" },
      { name: "\u8F9B", yinYang: "yin", element: "\u91D1" },
      { name: "\u58EC", yinYang: "yang", element: "\u6C34" },
      { name: "\u7678", yinYang: "yin", element: "\u6C34" }
    ],
    branches: [
      { name: "\u5B50", element: "\u6C34", hiddenStems: ["\u7678"] },
      { name: "\u4E11", element: "\u571F", hiddenStems: ["\u5DF1", "\u7678", "\u8F9B"] },
      { name: "\u5BC5", element: "\u6728", hiddenStems: ["\u7532", "\u4E19", "\u620A"] },
      { name: "\u536F", element: "\u6728", hiddenStems: ["\u4E59"] },
      { name: "\u8FB0", element: "\u571F", hiddenStems: ["\u620A", "\u4E59", "\u7678"] },
      { name: "\u5DF3", element: "\u706B", hiddenStems: ["\u4E19", "\u620A", "\u5E9A"] },
      { name: "\u5348", element: "\u706B", hiddenStems: ["\u4E01", "\u5DF1"] },
      { name: "\u672A", element: "\u571F", hiddenStems: ["\u5DF1", "\u4E01", "\u4E59"] },
      { name: "\u7533", element: "\u91D1", hiddenStems: ["\u5E9A", "\u58EC", "\u620A"] },
      { name: "\u9149", element: "\u91D1", hiddenStems: ["\u8F9B"] },
      { name: "\u620C", element: "\u571F", hiddenStems: ["\u620A", "\u8F9B", "\u4E01"] },
      { name: "\u4EA5", element: "\u6C34", hiddenStems: ["\u58EC", "\u7532"] }
    ],
    tenGodNames: ["\u6BD4\u80A9", "\u52AB\u8D22", "\u98DF\u795E", "\u4F24\u5B98", "\u504F\u8D22", "\u6B63\u8D22", "\u4E03\u6740", "\u6B63\u5B98", "\u504F\u5370", "\u6B63\u5370"],
    tenGodRule: {
      ruleId: "bazi.ten-god.same-polarity-cycle",
      label: "\u5341\u795E\u6309\u300C\u65E5\u5E72\u2192\u4ED6\u5E72\u300D\u5728\u5341\u5E72\u5E8F\u5217\u4E0A\u7684\u540C\u9634\u9633\u7B49\u8DDD\u6620\u5C04\uFF0C\u5E8F\u53F7\u5DEE\u53D6\u6A21 10",
      evidence: "traditional",
      source: ["san-ming-tong-hui"],
      confidence: 0.8
    },
    hiddenStemsRule: {
      ruleId: "bazi.hidden-stems.branch-table",
      label: "\u85CF\u5E72\u53D6\u5730\u652F\u672C\u6C14\u3001\u4E2D\u6C14\u3001\u4F59\u6C14\u4E09\u6863\uFF0C\u8868\u5E8F\u5373\u4F18\u5148\u7EA7",
      evidence: "traditional",
      source: ["san-ming-tong-hui"],
      confidence: 0.8
    },
    elementCountRule: {
      ruleId: "bazi.wuxing.element-weighted",
      label: "\u4E94\u884C\u529B\u91CF\u6309\u85CF\u5E72\u672C\u6C14\uFF0F\u4E2D\u6C14\uFF0F\u4F59\u6C14\u52A0\u6743 [1, 0.5, 0.3]\uFF0C\u5929\u5E72\u5404\u8BA1\u4E00\u6B21",
      evidence: "traditional",
      source: ["di-tian-sui"],
      confidence: 0.62
    },
    dayPillarRule: {
      ruleId: "bazi.day.sexagenary-jdn",
      label: "\u65E5\u5E72\u652F = (\u5112\u7565\u65E5\u6570 JDN + 49) mod 60\uFF0C\u951A\u70B9 1900-01-01 \u4E3A\u7532\u620C\u65E5",
      evidence: "convention",
      source: ["jdn-anchor"],
      confidence: 0.92
    }
  },
  parameters: {
    monthBoundaryStepDegrees: 30,
    monthBoundaryOffsetDegrees: 15,
    dayPillarJdnOffset: 49,
    dayBoundaryMode: "zi-chu-true-solar",
    ziChuStartTrueSolarMinutes: 1380,
    hiddenStemWeights: [1, 0.5, 0.3],
    luckDirectionMode: "gender-only",
    luckStartRounding: "whole-year",
    luckDaysPerYear: 3,
    luckDaysPerMonth: 0.25,
    sexagenaryCycleLength: 60
  },
  sources: {
    "meeus-aa2": {
      citation: "Meeus, Astronomical Algorithms, 2nd ed. (1998), ch. 7 / 22 / 25 / 27 / 49",
      kind: "astronomical-reference"
    },
    "jie-zhongqi": {
      citation: "\u672C\u9879\u76EE ADR-0003\uFF1A\u8282\u4E3A\u9EC4\u7ECF 15\xB0+30\xB0k\uFF0C\u4E2D\u6C14\u4E3A 30\xB0k",
      kind: "project-decision"
    },
    "jdn-anchor": {
      citation: "\u5112\u7565\u65E5\u6570\u4E0E\u5E72\u652F\u7EAA\u65E5\u951A\u70B9\uFF1A1900-01-01 \u4E3A\u7532\u620C\u65E5\uFF08JDN 2415021\uFF0C\u516D\u5341\u7532\u5B50\u5E8F 10\uFF09",
      kind: "calibration-anchor"
    },
    "true-solar-time": {
      citation: "\u771F\u592A\u9633\u65F6 = \u5E73\u592A\u9633\u65F6 + (\u7ECF\u5EA6 \u2212 120\xB0)\xD74 \u5206\u949F + \u5747\u65F6\u5DEE",
      kind: "astronomical-reference"
    },
    "chinese-calendar-rule": {
      citation: "\u519C\u5386\u7F16\u6392\u89C4\u5219\uFF1A\u6714\u65E5\u4E3A\u6708\u9996\u3001\u51AC\u81F3\u6240\u5728\u6708\u4E3A\u5341\u4E00\u6708\u3001\u65E0\u4E2D\u6C14\u4E4B\u6708\u4E3A\u95F0\u6708\uFF08\u4E0E ADR-0003 \u914D\u5957\uFF09",
      kind: "calendar-convention"
    },
    "san-ming-tong-hui": {
      citation: "\u300A\u4E09\u547D\u901A\u4F1A\u300B\uFF1A\u5341\u795E\u4E0E\u5730\u652F\u85CF\u5E72\u4F53\u7CFB",
      kind: "traditional-text"
    },
    "zi-chu-commentary": {
      citation: "\u5B50\u521D\u6362\u65E5\u8BF4\uFF1A\u4EE5\u771F\u592A\u9633\u65F6\u5B50\u65F6\u521D\uFF0823:00\uFF09\u4E3A\u65E5\u754C\uFF0C\u4E0E\u5B50\u6B63\u6362\u65E5\u8BF4\u5E76\u5217\u4E3A\u4F20\u7EDF\u5206\u6B67",
      kind: "traditional-text"
    },
    "zi-ping-she-yi": {
      citation: "\u5B50\u5E73\u64AE\u8981\u7C7B\u6587\u732E\u4E2D\u300C\u7537\u987A\u5973\u9006\uFF0C\u4E0D\u95EE\u5E74\u5E72\u9634\u9633\u300D\u7684\u6392\u8FD0\u53E3\u5F84",
      kind: "traditional-text"
    },
    "di-tian-sui": {
      citation: "\u300A\u6EF4\u5929\u9AD3\u300B\u4F53\u7CFB\u4E2D\u7684\u85CF\u5E72\u8F7B\u91CD\u6743\u8861\u601D\u8DEF\uFF1A\u672C\u6C14\u91CD\u4E8E\u4E2D\u6C14\uFF0C\u4E2D\u6C14\u91CD\u4E8E\u4F59\u6C14",
      kind: "traditional-text"
    }
  }
};

// rules/ziwei-core-0.1.0/ruleset.js
var RULE_SET_ID3 = "ziwei-core-0.1.0";
var ruleset_default3 = {
  id: RULE_SET_ID3,
  version: "0.1.0",
  title: "\u7D2B\u5FAE\u6597\u6570\u6838\u5FC3\u89C4\u5219\u96C6\uFF08\u901A\u884C\u6D3E\uFF09",
  school: "common",
  system: "ziwei",
  locale: "zh-Hans",
  engineCompatibility: ">=0.4.0 <0.6.0",
  conventions: {
    yearBoundary: {
      ruleId: "ziwei.year.lunar-new-year",
      value: "lunar-new-year",
      label: "\u5E74\u5E72\u652F\u4EE5\u519C\u5386\u6B63\u6708\u521D\u4E00\u4E3A\u754C\uFF08\u7D2B\u5FAE\u6597\u6570\u901A\u884C\u53E3\u5F84\uFF09\uFF0C\u4E0E\u56DB\u67F1\u7684\u7ACB\u6625\u6362\u5E74\u5E76\u5217\u800C\u4E0D\u6DF7\u7528",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.8
    },
    monthIndex: {
      ruleId: "ziwei.month.leap-split-fifteen",
      value: "leap-second-half-as-next-month",
      label: "\u95F0\u6708\u524D\u5341\u4E94\u65E5\uFF08\u542B\u5341\u4E94\uFF09\u4ECD\u6309\u672C\u6708\u8D77\u5BAB\uFF0C\u5341\u516D\u65E5\u8D77\u6309\u4E0B\u6708\u8D77\u5BAB\uFF1B\u665A\u5B50\u65F6\u4E0D\u53C2\u4E0E\u8BE5\u4FEE\u6B63",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.7
    },
    timeIndex: {
      ruleId: "ziwei.time.early-late-zi",
      value: "thirteen-index-true-solar",
      label: "\u65F6\u8FB0\u6309\u771F\u592A\u9633\u65F6\u5207\u5206\uFF0C\u5B50\u65F6\u5206\u65E9\u665A\uFF1A00:00-01:00 \u4E3A\u65E9\u5B50\uFF08\u7D22\u5F15 0\uFF09\uFF0C23:00-00:00 \u4E3A\u665A\u5B50\uFF08\u7D22\u5F15 12\uFF09",
      evidence: "convention",
      source: ["true-solar-time"],
      confidence: 0.8
    },
    lateZiDay: {
      ruleId: "ziwei.day.late-zi-next-day",
      value: "next-day",
      label: "\u665A\u5B50\u65F6\uFF0823:00 \u540E\uFF09\u8D77\u7D2B\u5FAE\u65F6\uFF0C\u519C\u5386\u65E5\u6570\u8FDB\u4E00\u65E5\uFF1B\u82E5\u8D8A\u8FC7\u5F53\u6708\u6700\u540E\u4E00\u65E5\u5219\u56DE\u843D\u5230\u4E0B\u6708\u521D\u4E00",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.68
    },
    soulBody: {
      ruleId: "ziwei.palace.soul-body-rule",
      value: "month-forward-hour-backward",
      label: "\u5BC5\u5BAB\u8D77\u6B63\u6708\u987A\u6570\u81F3\u751F\u6708\uFF0C\u518D\u81EA\u8BE5\u5BAB\u9006\u6570\u751F\u65F6\u5B89\u547D\u5BAB\uFF1B\u987A\u6570\u751F\u65F6\u5B89\u8EAB\u5BAB",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88
    },
    palaceNaming: {
      ruleId: "ziwei.palace.naming",
      value: "soul-palace-counter-clockwise",
      label: "\u5341\u4E8C\u5BAB\u81EA\u547D\u5BAB\u8D77\u9006\u5E03\uFF1A\u5144\u5F1F\u3001\u592B\u59BB\u3001\u5B50\u5973\u3001\u8D22\u5E1B\u3001\u75BE\u5384\u3001\u8FC1\u79FB\u3001\u4EA4\u53CB\u3001\u5B98\u7984\u3001\u7530\u5B85\u3001\u798F\u5FB7\u3001\u7236\u6BCD",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9
    },
    decadalDirection: {
      ruleId: "ziwei.decadal.direction",
      value: "yang-male-yin-female-forward",
      label: "\u751F\u5E74\u652F\u4E3A\u9633\u4E14\u7537\u547D\u3001\u751F\u5E74\u652F\u4E3A\u9634\u4E14\u5973\u547D\u8005\uFF0C\u5927\u9650\u81EA\u547D\u5BAB\u987A\u884C\uFF1B\u5176\u4F59\u9006\u884C",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      genderPolarity: { male: "\u9633", female: "\u9634" }
    },
    decadalStart: {
      ruleId: "ziwei.decadal.start-age",
      value: "five-elements-class-value",
      label: "\u5927\u9650\u8D77\u8FD0\u865A\u5C81\u7B49\u4E8E\u4E94\u884C\u5C40\u6570\uFF08\u6C34\u4E8C\u5C40 2 \u5C81\u8D77\uFF0C\u6728\u4E09\u5C40 3 \u5C81\u8D77\uFF0C\u4F9D\u6B64\u7C7B\u63A8\uFF09\uFF0C\u6BCF\u5BAB\u5341\u5E74",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85
    },
    xiaoxian: {
      ruleId: "ziwei.xiaoxian.start-and-direction",
      value: "year-branch-triad-start",
      label: "\u5C0F\u9650\u8D77\u5BAB\uFF1A\u5BC5\u5348\u620C\u5E74\u8FB0\u4E0A\u8D77\uFF0C\u7533\u5B50\u8FB0\u5E74\u620C\u4E0A\u8D77\uFF0C\u5DF3\u9149\u4E11\u5E74\u672A\u4E0A\u8D77\uFF0C\u4EA5\u536F\u672A\u5E74\u4E11\u4E0A\u8D77\uFF1B\u7537\u987A\u5973\u9006\uFF0C\u4E00\u5E74\u4E00\u5BAB",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.8,
      direction: { male: 1, female: -1 },
      table: {
        \u5BC5: "\u8FB0",
        \u5348: "\u8FB0",
        \u620C: "\u8FB0",
        \u7533: "\u620C",
        \u5B50: "\u620C",
        \u8FB0: "\u620C",
        \u5DF3: "\u672A",
        \u9149: "\u672A",
        \u4E11: "\u672A",
        \u4EA5: "\u4E11",
        \u536F: "\u4E11",
        \u672A: "\u4E11"
      }
    }
  },
  tables: {
    stems: ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"],
    branches: ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"],
    // 宫名本身也是流派变量：命盘上同一宫，通行派称「交友」，古法（紫微斗数全书）称「奴仆」，
    // 参照实现 iztro 用「仆役」。名称不影响星曜分布，但会让逐宫比对报出假差异，
    // 因此把别名显式登记，而不是让下游各自猜。
    palaceNames: {
      ruleId: "ziwei.palace.names",
      label: "\u5341\u4E8C\u5BAB\u540D\uFF08\u5BC5\u57FA\u987A\u5E8F\uFF09\uFF1A\u547D\u5BAB\u3001\u7236\u6BCD\u3001\u798F\u5FB7\u3001\u7530\u5B85\u3001\u5B98\u7984\u3001\u4EA4\u53CB\u3001\u8FC1\u79FB\u3001\u75BE\u5384\u3001\u8D22\u5E1B\u3001\u5B50\u5973\u3001\u592B\u59BB\u3001\u5144\u5F1F",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.85,
      order: ["\u547D\u5BAB", "\u7236\u6BCD", "\u798F\u5FB7", "\u7530\u5B85", "\u5B98\u7984", "\u4EA4\u53CB", "\u8FC1\u79FB", "\u75BE\u5384", "\u8D22\u5E1B", "\u5B50\u5973", "\u592B\u59BB", "\u5144\u5F1F"],
      aliases: {
        \u4EA4\u53CB: ["\u4EC6\u5F79", "\u5974\u4EC6"],
        \u7236\u6BCD: ["\u76F8\u8C8C"],
        \u75BE\u5384: ["\u75BE\u5384\u5BAB"]
      }
    },
    tigerRule: {
      ruleId: "ziwei.palace.tiger-rule",
      label: "\u4E94\u864E\u9041\u5B9A\u5BC5\u5BAB\u5929\u5E72\uFF1A\u7532\u5DF1\u4E4B\u5E74\u4E19\u4F5C\u9996\uFF0C\u4E59\u5E9A\u4E4B\u5C81\u620A\u4E3A\u5934\uFF0C\u4E19\u8F9B\u5FC5\u5B9A\u5BFB\u5E9A\u8D77\uFF0C\u4E01\u58EC\u58EC\u4F4D\u987A\u884C\u6D41\uFF0C\u620A\u7678\u4E4B\u5E74\u7532\u5BC5\u6C42",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9,
      table: {
        \u7532: "\u4E19",
        \u5DF1: "\u4E19",
        \u4E59: "\u620A",
        \u5E9A: "\u620A",
        \u4E19: "\u5E9A",
        \u8F9B: "\u5E9A",
        \u4E01: "\u58EC",
        \u58EC: "\u58EC",
        \u620A: "\u7532",
        \u7678: "\u7532"
      }
    },
    fiveElementsClassRule: {
      ruleId: "ziwei.five-elements.na-yin",
      label: "\u4E94\u884C\u5C40\u53D6\u547D\u5BAB\u5E72\u652F\u7684\u7EB3\u97F3\u4E94\u884C\uFF1A\u5929\u5E72\u6570\uFF08\u7532\u4E591\u4E19\u4E012\u620A\u5DF13\u5E9A\u8F9B4\u58EC\u76785\uFF09\u52A0\u5730\u652F\u6570\uFF08\u5B50\u5348\u4E11\u672A1\u5BC5\u7533\u536F\u91492\u8FB0\u620C\u5DF3\u4EA53\uFF09\uFF0C\u8D85\u8FC7 5 \u8005\u51CF 5\uFF0C\u5F97\u4E00\u6728\u4E8C\u91D1\u4E09\u6C34\u56DB\u706B\u4E94\u571F",
      evidence: "traditional",
      source: ["ziwei-quanshu", "na-yin-table"],
      confidence: 0.88,
      stemNumbers: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      branchNumbers: [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3],
      order: [
        { name: "\u6728\u4E09\u5C40", element: "\u6728", value: 3 },
        { name: "\u91D1\u56DB\u5C40", element: "\u91D1", value: 4 },
        { name: "\u6C34\u4E8C\u5C40", element: "\u6C34", value: 2 },
        { name: "\u706B\u516D\u5C40", element: "\u706B", value: 6 },
        { name: "\u571F\u4E94\u5C40", element: "\u571F", value: 5 }
      ]
    },
    ziweiPositionRule: {
      ruleId: "ziwei.star.ziwei-position",
      label: "\u8D77\u7D2B\u5FAE\u661F\u8BC0\uFF1A\u4EE5\u519C\u5386\u65E5\u6570\uFF08\u665A\u5B50\u8FDB\u4E00\u65E5\uFF09\u4E3A\u88AB\u9664\u6570\uFF0C\u81EA\u504F\u79FB\u91CF 0 \u8D77\u9010\u6B21\u52A0\u4E00\uFF0C\u76F4\u81F3\u80FD\u88AB\u4E94\u884C\u5C40\u6570\u6574\u9664\uFF1B\u5546\u51CF\u4E00\u5F97\u5BAB\u4F4D\uFF0C\u504F\u79FB\u91CF\u4E3A\u5076\u5219\u987A\u52A0\u504F\u79FB\u3001\u4E3A\u5947\u5219\u9006\u51CF\u504F\u79FB\uFF1B\u5929\u5E9C\u4E0E\u7D2B\u5FAE\u4EE5\u5BC5\u7533\u8F74\u5BF9\u79F0\uFF0C\u5BAB\u4F4D\u7D22\u5F15\u4E4B\u548C\u6052\u4E3A 12",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88
    },
    // 星曜规范顺序：同一宫内的星曜按此顺序排列。
    // 不排序的话，星曜顺序会随安星函数的书写顺序变化，外部逐宫比对时会报出大量假差异。
    starOrder: {
      ruleId: "ziwei.star.canonical-order",
      label: "\u661F\u66DC\u89C4\u8303\u987A\u5E8F\uFF1A\u5341\u56DB\u4E3B\u661F\uFF08\u7D2B\u5FAE\u3001\u5929\u673A\u3001\u592A\u9633\u3001\u6B66\u66F2\u3001\u5929\u540C\u3001\u5EC9\u8D1E\u3001\u5929\u5E9C\u3001\u592A\u9634\u3001\u8D2A\u72FC\u3001\u5DE8\u95E8\u3001\u5929\u76F8\u3001\u5929\u6881\u3001\u4E03\u6740\u3001\u7834\u519B\uFF09\u5728\u524D\uFF0C\u8F85\u661F\u6309\u516D\u5409\u3001\u516D\u715E\u3001\u7984\u9A6C\u6392\u5217",
      evidence: "convention",
      source: ["iztro"],
      confidence: 0.7,
      order: [
        "\u7D2B\u5FAE",
        "\u5929\u673A",
        "\u592A\u9633",
        "\u6B66\u66F2",
        "\u5929\u540C",
        "\u5EC9\u8D1E",
        "\u5929\u5E9C",
        "\u592A\u9634",
        "\u8D2A\u72FC",
        "\u5DE8\u95E8",
        "\u5929\u76F8",
        "\u5929\u6881",
        "\u4E03\u6740",
        "\u7834\u519B",
        "\u5DE6\u8F85",
        "\u53F3\u5F3C",
        "\u6587\u660C",
        "\u6587\u66F2",
        "\u5929\u9B41",
        "\u5929\u94BA",
        "\u64CE\u7F8A",
        "\u9640\u7F57",
        "\u706B\u661F",
        "\u94C3\u661F",
        "\u5730\u7A7A",
        "\u5730\u52AB",
        "\u7984\u5B58",
        "\u5929\u9A6C"
      ]
    },
    majorStarRule: {
      ruleId: "ziwei.star.major-placement",
      label: "\u7D2B\u5FAE\u661F\u7CFB\u81EA\u7D2B\u5FAE\u9006\u884C\u5B89\u516D\u661F\uFF08\u7D2B\u5FAE\u3001\u5929\u673A\u3001\u592A\u9633\u3001\u6B66\u66F2\u3001\u5929\u540C\u3001\u5EC9\u8D1E\uFF09\uFF0C\u5929\u5E9C\u661F\u7CFB\u81EA\u5929\u5E9C\u987A\u884C\u5B89\u516B\u661F\uFF08\u5929\u5E9C\u3001\u592A\u9634\u3001\u8D2A\u72FC\u3001\u5DE8\u95E8\u3001\u5929\u76F8\u3001\u5929\u6881\u3001\u4E03\u6740\u3001\u7834\u519B\uFF09",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9,
      ziweiSeries: ["\u7D2B\u5FAE", "\u5929\u673A", null, "\u592A\u9633", "\u6B66\u66F2", "\u5929\u540C", null, null, "\u5EC9\u8D1E"],
      tianfuSeries: ["\u5929\u5E9C", "\u592A\u9634", "\u8D2A\u72FC", "\u5DE8\u95E8", "\u5929\u76F8", "\u5929\u6881", "\u4E03\u6740", null, null, null, "\u7834\u519B"],
      ziweiDirection: -1,
      tianfuDirection: 1,
      mirrorSum: 12
    },
    lucunRule: {
      ruleId: "ziwei.star.lucun",
      label: "\u7984\u5B58\u6309\u5E74\u5E72\u5B9A\u4F4D\uFF1A\u7532\u7984\u5728\u5BC5\u3001\u4E59\u7984\u5728\u536F\u3001\u4E19\u620A\u7984\u5728\u5DF3\u3001\u4E01\u5DF1\u7984\u5728\u5348\u3001\u5E9A\u7984\u5728\u7533\u3001\u8F9B\u7984\u5728\u9149\u3001\u58EC\u7984\u5728\u4EA5\u3001\u7678\u7984\u5728\u5B50\uFF1B\u7984\u524D\u4E00\u4F4D\u64CE\u7F8A\uFF0C\u7984\u540E\u4E00\u4F4D\u9640\u7F57",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      table: { \u7532: "\u5BC5", \u4E59: "\u536F", \u4E19: "\u5DF3", \u4E01: "\u5348", \u620A: "\u5DF3", \u5DF1: "\u5348", \u5E9A: "\u7533", \u8F9B: "\u9149", \u58EC: "\u4EA5", \u7678: "\u5B50" },
      yangOffset: 1,
      tuoOffset: -1
    },
    tianmaRule: {
      ruleId: "ziwei.star.tianma",
      label: "\u5929\u9A6C\u6309\u5E74\u652F\u4E09\u5408\u5B9A\u4F4D\uFF1A\u5BC5\u5348\u620C\u5E74\u5929\u9A6C\u5728\u7533\uFF0C\u7533\u5B50\u8FB0\u5E74\u5728\u5BC5\uFF0C\u5DF3\u9149\u4E11\u5E74\u5728\u4EA5\uFF0C\u4EA5\u536F\u672A\u5E74\u5728\u5DF3",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      table: {
        \u5BC5: "\u7533",
        \u5348: "\u7533",
        \u620C: "\u7533",
        \u7533: "\u5BC5",
        \u5B50: "\u5BC5",
        \u8FB0: "\u5BC5",
        \u5DF3: "\u4EA5",
        \u9149: "\u4EA5",
        \u4E11: "\u4EA5",
        \u4EA5: "\u5DF3",
        \u536F: "\u5DF3",
        \u672A: "\u5DF3"
      }
    },
    kuiyueRule: {
      ruleId: "ziwei.star.kuiyue",
      label: "\u5929\u9B41\u5929\u94BA\u6309\u5E74\u5E72\u5B9A\u4F4D\uFF1A\u7532\u620A\u5E9A\u5E74\u4E11\u672A\uFF0C\u4E59\u5DF1\u5E74\u5B50\u7533\uFF0C\u8F9B\u5E74\u5348\u5BC5\uFF0C\u4E19\u4E01\u5E74\u4EA5\u9149\uFF0C\u58EC\u7678\u5E74\u536F\u5DF3",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      table: {
        \u7532: ["\u4E11", "\u672A"],
        \u620A: ["\u4E11", "\u672A"],
        \u5E9A: ["\u4E11", "\u672A"],
        \u4E59: ["\u5B50", "\u7533"],
        \u5DF1: ["\u5B50", "\u7533"],
        \u8F9B: ["\u5348", "\u5BC5"],
        \u4E19: ["\u4EA5", "\u9149"],
        \u4E01: ["\u4EA5", "\u9149"],
        \u58EC: ["\u536F", "\u5DF3"],
        \u7678: ["\u536F", "\u5DF3"]
      }
    },
    zuoyouRule: {
      ruleId: "ziwei.star.zuoyou",
      label: "\u5DE6\u8F85\u81EA\u8FB0\u5BAB\u8D77\u6B63\u6708\u987A\u6570\u81F3\u751F\u6708\uFF0C\u53F3\u5F3C\u81EA\u620C\u5BAB\u8D77\u6B63\u6708\u9006\u6570\u81F3\u751F\u6708",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      zuoBase: "\u8FB0",
      youBase: "\u620C",
      zuoDirection: 1,
      youDirection: -1
    },
    wenchangWenquRule: {
      ruleId: "ziwei.star.wenchang-wenqu",
      label: "\u6587\u66F2\u81EA\u8FB0\u5BAB\u8D77\u5B50\u65F6\u987A\u6570\u81F3\u751F\u65F6\uFF0C\u6587\u660C\u81EA\u620C\u5BAB\u8D77\u5B50\u65F6\u9006\u6570\u81F3\u751F\u65F6",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      quBase: "\u8FB0",
      changBase: "\u620C",
      quDirection: 1,
      changDirection: -1
    },
    dikongDijieRule: {
      ruleId: "ziwei.star.dikong-dijie",
      label: "\u5730\u52AB\u81EA\u4EA5\u5BAB\u8D77\u5B50\u65F6\u987A\u6570\u81F3\u751F\u65F6\uFF0C\u5730\u7A7A\u81EA\u4EA5\u5BAB\u8D77\u5B50\u65F6\u9006\u6570\u81F3\u751F\u65F6",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      base: "\u4EA5",
      jieDirection: 1,
      kongDirection: -1
    },
    huolingRule: {
      ruleId: "ziwei.star.huoling",
      label: "\u706B\u661F\u94C3\u661F\u6309\u5E74\u652F\u4E09\u5408\u5B9A\u8D77\u5B50\u65F6\u5BAB\u4F4D\uFF0C\u518D\u987A\u6570\u81F3\u751F\u65F6\uFF1A\u5BC5\u5348\u620C\u5E74\u4E11\u536F\uFF0C\u7533\u5B50\u8FB0\u5E74\u5BC5\u620C\uFF0C\u5DF3\u9149\u4E11\u5E74\u536F\u620C\uFF0C\u4EA5\u536F\u672A\u5E74\u9149\u620C",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.82,
      table: {
        \u5BC5: ["\u4E11", "\u536F"],
        \u5348: ["\u4E11", "\u536F"],
        \u620C: ["\u4E11", "\u536F"],
        \u7533: ["\u5BC5", "\u620C"],
        \u5B50: ["\u5BC5", "\u620C"],
        \u8FB0: ["\u5BC5", "\u620C"],
        \u5DF3: ["\u536F", "\u620C"],
        \u9149: ["\u536F", "\u620C"],
        \u4E11: ["\u536F", "\u620C"],
        \u4EA5: ["\u9149", "\u620C"],
        \u536F: ["\u9149", "\u620C"],
        \u672A: ["\u9149", "\u620C"]
      }
    },
    mutagenRule: {
      ruleId: "ziwei.mutagen.year-stem",
      label: "\u751F\u5E74\u56DB\u5316\u6309\u5E74\u5E72\u5B9A\u7984\u6743\u79D1\u5FCC\uFF1A\u7532\u5EC9\u7834\u6B66\u9633\uFF0C\u4E59\u673A\u6881\u7D2B\u9634\uFF0C\u4E19\u540C\u673A\u660C\u5EC9\uFF0C\u4E01\u9634\u540C\u673A\u5DE8\uFF0C\u620A\u8D2A\u9634\u5F3C\u673A\uFF0C\u5DF1\u6B66\u8D2A\u6881\u66F2\uFF0C\u5E9A\u9633\u6B66\u9634\u540C\uFF0C\u8F9B\u5DE8\u9633\u66F2\u660C\uFF0C\u58EC\u6881\u7D2B\u5DE6\u6B66\uFF0C\u7678\u7834\u5DE8\u9634\u8D2A",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      order: ["\u7984", "\u6743", "\u79D1", "\u5FCC"],
      table: {
        \u7532: ["\u5EC9\u8D1E", "\u7834\u519B", "\u6B66\u66F2", "\u592A\u9633"],
        \u4E59: ["\u5929\u673A", "\u5929\u6881", "\u7D2B\u5FAE", "\u592A\u9634"],
        \u4E19: ["\u5929\u540C", "\u5929\u673A", "\u6587\u660C", "\u5EC9\u8D1E"],
        \u4E01: ["\u592A\u9634", "\u5929\u540C", "\u5929\u673A", "\u5DE8\u95E8"],
        \u620A: ["\u8D2A\u72FC", "\u592A\u9634", "\u53F3\u5F3C", "\u5929\u673A"],
        \u5DF1: ["\u6B66\u66F2", "\u8D2A\u72FC", "\u5929\u6881", "\u6587\u66F2"],
        \u5E9A: ["\u592A\u9633", "\u6B66\u66F2", "\u592A\u9634", "\u5929\u540C"],
        \u8F9B: ["\u5DE8\u95E8", "\u592A\u9633", "\u6587\u66F2", "\u6587\u660C"],
        \u58EC: ["\u5929\u6881", "\u7D2B\u5FAE", "\u5DE6\u8F85", "\u6B66\u66F2"],
        \u7678: ["\u7834\u519B", "\u5DE8\u95E8", "\u592A\u9634", "\u8D2A\u72FC"]
      }
    }
  },
  parameters: {
    yearBoundaryMode: "lunar-new-year",
    leapMonthMode: "split-fifteen",
    lateZiDayMode: "next-day",
    timeIndexBasis: "true-solar",
    palaceCount: 12,
    firstPalaceBranch: "\u5BC5",
    decadalYears: 10,
    xiaoxianCycleYears: 12,
    xiaoxianCycles: 10,
    leapSplitDay: 15,
    leapFixAppliesToLateZi: false,
    earlyZiHour: 0,
    lateZiHour: 23,
    lateZiTimeIndex: 12,
    timeIndexCount: 13
  },
  sources: {
    "ziwei-quanshu": {
      citation: "\u300A\u7D2B\u5FAE\u6597\u6570\u5168\u4E66\u300B\uFF08\u660E\uFF0C\u6258\u540D\u9648\u629F\uFF09\uFF1A\u5B89\u547D\u8EAB\u5BAB\u8BC0\u3001\u5B9A\u4E94\u884C\u5C40\u6CD5\u3001\u8D77\u7D2B\u5FAE\u661F\u8BC0\u3001\u5B89\u5341\u56DB\u4E3B\u661F\u4E0E\u5341\u56DB\u8F85\u661F\u3001\u8D77\u5927\u9650\u5C0F\u9650\u3001\u751F\u5E74\u56DB\u5316",
      kind: "traditional-text"
    },
    "na-yin-table": {
      citation: "\u516D\u5341\u7532\u5B50\u7EB3\u97F3\u8868\uFF1A\u4E94\u884C\u5C40\u53D6\u547D\u5BAB\u5E72\u652F\u4E4B\u7EB3\u97F3\uFF0C\u6C34\u4E8C\u5C40\u3001\u6728\u4E09\u5C40\u3001\u91D1\u56DB\u5C40\u3001\u571F\u4E94\u5C40\u3001\u706B\u516D\u5C40",
      kind: "traditional-table"
    },
    "true-solar-time": {
      citation: "\u771F\u592A\u9633\u65F6 = \u5E73\u592A\u9633\u65F6 + (\u7ECF\u5EA6 \u2212 120\xB0)\xD74 \u5206\u949F + \u5747\u65F6\u5DEE",
      kind: "astronomical-reference"
    },
    iztro: {
      citation: "SylarLong/iztro\uFF08MIT\uFF09\uFF1A\u5B89\u661F\u7B97\u6CD5\u53C2\u7167\u5B9E\u73B0\uFF0C\u7528\u4E8E\u4EA4\u53C9\u6838\u5BF9\uFF0C\u4E0D\u6539\u53D8\u4F20\u7EDF\u51FA\u5904\u7684\u8BC1\u636E\u7C7B\u522B",
      kind: "reference-implementation"
    },
    "lunar-calendar-rule": {
      citation: "\u519C\u5386\u7F16\u6392\u89C4\u5219\uFF1A\u6714\u65E5\u4E3A\u6708\u9996\u3001\u51AC\u81F3\u6240\u5728\u6708\u4E3A\u5341\u4E00\u6708\u3001\u65E0\u4E2D\u6C14\u4E4B\u6708\u4E3A\u95F0\u6708\uFF08ADR-0003\uFF09",
      kind: "calendar-convention"
    }
  }
};

// rules/ziwei-core-0.2.0/ruleset.js
var RULE_SET_ID4 = "ziwei-core-0.2.0";
var ruleset_default4 = {
  id: RULE_SET_ID4,
  version: "0.2.0",
  title: "\u7D2B\u5FAE\u6597\u6570\u6838\u5FC3\u89C4\u5219\u96C6\uFF08\u901A\u884C\u6D3E\uFF09",
  school: "common",
  system: "ziwei",
  locale: "zh-Hans",
  engineCompatibility: ">=0.5.0 <0.6.0",
  conventions: {
    yearBoundary: {
      ruleId: "ziwei.year.lunar-new-year",
      value: "lunar-new-year",
      label: "\u5E74\u5E72\u652F\u4EE5\u519C\u5386\u6B63\u6708\u521D\u4E00\u4E3A\u754C\uFF08\u7D2B\u5FAE\u6597\u6570\u901A\u884C\u53E3\u5F84\uFF09\uFF0C\u4E0E\u56DB\u67F1\u7684\u7ACB\u6625\u6362\u5E74\u5E76\u5217\u800C\u4E0D\u6DF7\u7528",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.8
    },
    monthIndex: {
      ruleId: "ziwei.month.leap-split-fifteen",
      value: "leap-second-half-as-next-month",
      label: "\u95F0\u6708\u524D\u5341\u4E94\u65E5\uFF08\u542B\u5341\u4E94\uFF09\u4ECD\u6309\u672C\u6708\u8D77\u5BAB\uFF0C\u5341\u516D\u65E5\u8D77\u6309\u4E0B\u6708\u8D77\u5BAB\uFF1B\u665A\u5B50\u65F6\u4E0D\u53C2\u4E0E\u8BE5\u4FEE\u6B63",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.7
    },
    timeIndex: {
      ruleId: "ziwei.time.early-late-zi",
      value: "thirteen-index-true-solar",
      label: "\u65F6\u8FB0\u6309\u771F\u592A\u9633\u65F6\u5207\u5206\uFF0C\u5B50\u65F6\u5206\u65E9\u665A\uFF1A00:00-01:00 \u4E3A\u65E9\u5B50\uFF08\u7D22\u5F15 0\uFF09\uFF0C23:00-00:00 \u4E3A\u665A\u5B50\uFF08\u7D22\u5F15 12\uFF09",
      evidence: "convention",
      source: ["true-solar-time"],
      confidence: 0.8
    },
    lateZiDay: {
      ruleId: "ziwei.day.late-zi-next-day",
      value: "next-day",
      label: "\u665A\u5B50\u65F6\uFF0823:00 \u540E\uFF09\u8D77\u7D2B\u5FAE\u65F6\uFF0C\u519C\u5386\u65E5\u6570\u8FDB\u4E00\u65E5\uFF1B\u82E5\u8D8A\u8FC7\u5F53\u6708\u6700\u540E\u4E00\u65E5\u5219\u56DE\u843D\u5230\u4E0B\u6708\u521D\u4E00",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.68
    },
    soulBody: {
      ruleId: "ziwei.palace.soul-body-rule",
      value: "month-forward-hour-backward",
      label: "\u5BC5\u5BAB\u8D77\u6B63\u6708\u987A\u6570\u81F3\u751F\u6708\uFF0C\u518D\u81EA\u8BE5\u5BAB\u9006\u6570\u751F\u65F6\u5B89\u547D\u5BAB\uFF1B\u987A\u6570\u751F\u65F6\u5B89\u8EAB\u5BAB",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88
    },
    palaceNaming: {
      ruleId: "ziwei.palace.naming",
      value: "soul-palace-counter-clockwise",
      label: "\u5341\u4E8C\u5BAB\u81EA\u547D\u5BAB\u8D77\u9006\u5E03\uFF1A\u5144\u5F1F\u3001\u592B\u59BB\u3001\u5B50\u5973\u3001\u8D22\u5E1B\u3001\u75BE\u5384\u3001\u8FC1\u79FB\u3001\u4EA4\u53CB\u3001\u5B98\u7984\u3001\u7530\u5B85\u3001\u798F\u5FB7\u3001\u7236\u6BCD",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9
    },
    decadalDirection: {
      ruleId: "ziwei.decadal.direction",
      value: "yang-male-yin-female-forward",
      label: "\u751F\u5E74\u652F\u4E3A\u9633\u4E14\u7537\u547D\u3001\u751F\u5E74\u652F\u4E3A\u9634\u4E14\u5973\u547D\u8005\uFF0C\u5927\u9650\u81EA\u547D\u5BAB\u987A\u884C\uFF1B\u5176\u4F59\u9006\u884C",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      genderPolarity: { male: "\u9633", female: "\u9634" }
    },
    decadalStart: {
      ruleId: "ziwei.decadal.start-age",
      value: "five-elements-class-value",
      label: "\u5927\u9650\u8D77\u8FD0\u865A\u5C81\u7B49\u4E8E\u4E94\u884C\u5C40\u6570\uFF08\u6C34\u4E8C\u5C40 2 \u5C81\u8D77\uFF0C\u6728\u4E09\u5C40 3 \u5C81\u8D77\uFF0C\u4F9D\u6B64\u7C7B\u63A8\uFF09\uFF0C\u6BCF\u5BAB\u5341\u5E74",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85
    },
    xiaoxian: {
      ruleId: "ziwei.xiaoxian.start-and-direction",
      value: "year-branch-triad-start",
      label: "\u5C0F\u9650\u8D77\u5BAB\uFF1A\u5BC5\u5348\u620C\u5E74\u8FB0\u4E0A\u8D77\uFF0C\u7533\u5B50\u8FB0\u5E74\u620C\u4E0A\u8D77\uFF0C\u5DF3\u9149\u4E11\u5E74\u672A\u4E0A\u8D77\uFF0C\u4EA5\u536F\u672A\u5E74\u4E11\u4E0A\u8D77\uFF1B\u7537\u987A\u5973\u9006\uFF0C\u4E00\u5E74\u4E00\u5BAB",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.8,
      direction: { male: 1, female: -1 },
      table: {
        \u5BC5: "\u8FB0",
        \u5348: "\u8FB0",
        \u620C: "\u8FB0",
        \u7533: "\u620C",
        \u5B50: "\u620C",
        \u8FB0: "\u620C",
        \u5DF3: "\u672A",
        \u9149: "\u672A",
        \u4E11: "\u672A",
        \u4EA5: "\u4E11",
        \u536F: "\u4E11",
        \u672A: "\u4E11"
      }
    }
  },
  tables: {
    stems: ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"],
    branches: ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"],
    // 宫名本身也是流派变量：命盘上同一宫，通行派称「交友」，古法（紫微斗数全书）称「奴仆」，
    // 参照实现 iztro 用「仆役」。名称不影响星曜分布，但会让逐宫比对报出假差异，
    // 因此把别名显式登记，而不是让下游各自猜。
    palaceNames: {
      ruleId: "ziwei.palace.names",
      label: "\u5341\u4E8C\u5BAB\u540D\uFF08\u5BC5\u57FA\u987A\u5E8F\uFF09\uFF1A\u547D\u5BAB\u3001\u7236\u6BCD\u3001\u798F\u5FB7\u3001\u7530\u5B85\u3001\u5B98\u7984\u3001\u4EA4\u53CB\u3001\u8FC1\u79FB\u3001\u75BE\u5384\u3001\u8D22\u5E1B\u3001\u5B50\u5973\u3001\u592B\u59BB\u3001\u5144\u5F1F",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.85,
      order: ["\u547D\u5BAB", "\u7236\u6BCD", "\u798F\u5FB7", "\u7530\u5B85", "\u5B98\u7984", "\u4EA4\u53CB", "\u8FC1\u79FB", "\u75BE\u5384", "\u8D22\u5E1B", "\u5B50\u5973", "\u592B\u59BB", "\u5144\u5F1F"],
      aliases: {
        \u4EA4\u53CB: ["\u4EC6\u5F79", "\u5974\u4EC6"],
        \u7236\u6BCD: ["\u76F8\u8C8C"],
        \u75BE\u5384: ["\u75BE\u5384\u5BAB"]
      }
    },
    tigerRule: {
      ruleId: "ziwei.palace.tiger-rule",
      label: "\u4E94\u864E\u9041\u5B9A\u5BC5\u5BAB\u5929\u5E72\uFF1A\u7532\u5DF1\u4E4B\u5E74\u4E19\u4F5C\u9996\uFF0C\u4E59\u5E9A\u4E4B\u5C81\u620A\u4E3A\u5934\uFF0C\u4E19\u8F9B\u5FC5\u5B9A\u5BFB\u5E9A\u8D77\uFF0C\u4E01\u58EC\u58EC\u4F4D\u987A\u884C\u6D41\uFF0C\u620A\u7678\u4E4B\u5E74\u7532\u5BC5\u6C42",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9,
      table: {
        \u7532: "\u4E19",
        \u5DF1: "\u4E19",
        \u4E59: "\u620A",
        \u5E9A: "\u620A",
        \u4E19: "\u5E9A",
        \u8F9B: "\u5E9A",
        \u4E01: "\u58EC",
        \u58EC: "\u58EC",
        \u620A: "\u7532",
        \u7678: "\u7532"
      }
    },
    fiveElementsClassRule: {
      ruleId: "ziwei.five-elements.na-yin",
      label: "\u4E94\u884C\u5C40\u53D6\u547D\u5BAB\u5E72\u652F\u7684\u7EB3\u97F3\u4E94\u884C\uFF1A\u5929\u5E72\u6570\uFF08\u7532\u4E591\u4E19\u4E012\u620A\u5DF13\u5E9A\u8F9B4\u58EC\u76785\uFF09\u52A0\u5730\u652F\u6570\uFF08\u5B50\u5348\u4E11\u672A1\u5BC5\u7533\u536F\u91492\u8FB0\u620C\u5DF3\u4EA53\uFF09\uFF0C\u8D85\u8FC7 5 \u8005\u51CF 5\uFF0C\u5F97\u4E00\u6728\u4E8C\u91D1\u4E09\u6C34\u56DB\u706B\u4E94\u571F",
      evidence: "traditional",
      source: ["ziwei-quanshu", "na-yin-table"],
      confidence: 0.88,
      stemNumbers: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      branchNumbers: [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3],
      order: [
        { name: "\u6728\u4E09\u5C40", element: "\u6728", value: 3 },
        { name: "\u91D1\u56DB\u5C40", element: "\u91D1", value: 4 },
        { name: "\u6C34\u4E8C\u5C40", element: "\u6C34", value: 2 },
        { name: "\u706B\u516D\u5C40", element: "\u706B", value: 6 },
        { name: "\u571F\u4E94\u5C40", element: "\u571F", value: 5 }
      ]
    },
    ziweiPositionRule: {
      ruleId: "ziwei.star.ziwei-position",
      label: "\u8D77\u7D2B\u5FAE\u661F\u8BC0\uFF1A\u4EE5\u519C\u5386\u65E5\u6570\uFF08\u665A\u5B50\u8FDB\u4E00\u65E5\uFF09\u4E3A\u88AB\u9664\u6570\uFF0C\u81EA\u504F\u79FB\u91CF 0 \u8D77\u9010\u6B21\u52A0\u4E00\uFF0C\u76F4\u81F3\u80FD\u88AB\u4E94\u884C\u5C40\u6570\u6574\u9664\uFF1B\u5546\u51CF\u4E00\u5F97\u5BAB\u4F4D\uFF0C\u504F\u79FB\u91CF\u4E3A\u5076\u5219\u987A\u52A0\u504F\u79FB\u3001\u4E3A\u5947\u5219\u9006\u51CF\u504F\u79FB\uFF1B\u5929\u5E9C\u4E0E\u7D2B\u5FAE\u4EE5\u5BC5\u7533\u8F74\u5BF9\u79F0\uFF0C\u5BAB\u4F4D\u7D22\u5F15\u4E4B\u548C\u6052\u4E3A 12",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88
    },
    // 星曜规范顺序：同一宫内的星曜按此顺序排列。
    // 不排序的话，星曜顺序会随安星函数的书写顺序变化，外部逐宫比对时会报出大量假差异。
    starOrder: {
      ruleId: "ziwei.star.canonical-order",
      label: "\u661F\u66DC\u89C4\u8303\u987A\u5E8F\uFF1A\u5341\u56DB\u4E3B\u661F\u5728\u524D\uFF0C\u5341\u56DB\u8F85\u661F\u6309\u516D\u5409\u3001\u516D\u715E\u3001\u7984\u9A6C\u6392\u5217\uFF0C\u5176\u540E\u4E3A\u5E74\u7CFB/\u6708\u7CFB/\u65E5\u7CFB/\u65F6\u7CFB\u6742\u66DC\uFF1B\u540C\u5BAB\u5185\u6309\u6B64\u6392\u5E8F\uFF0C\u4FDD\u8BC1\u8F93\u51FA\u987A\u5E8F\u786E\u5B9A\u3001\u53EF\u9010\u5BAB\u6BD4\u5BF9",
      evidence: "convention",
      source: ["iztro"],
      confidence: 0.7,
      order: [
        "\u7D2B\u5FAE",
        "\u5929\u673A",
        "\u592A\u9633",
        "\u6B66\u66F2",
        "\u5929\u540C",
        "\u5EC9\u8D1E",
        "\u5929\u5E9C",
        "\u592A\u9634",
        "\u8D2A\u72FC",
        "\u5DE8\u95E8",
        "\u5929\u76F8",
        "\u5929\u6881",
        "\u4E03\u6740",
        "\u7834\u519B",
        "\u5DE6\u8F85",
        "\u53F3\u5F3C",
        "\u6587\u660C",
        "\u6587\u66F2",
        "\u5929\u9B41",
        "\u5929\u94BA",
        "\u64CE\u7F8A",
        "\u9640\u7F57",
        "\u706B\u661F",
        "\u94C3\u661F",
        "\u5730\u7A7A",
        "\u5730\u52AB",
        "\u7984\u5B58",
        "\u5929\u9A6C",
        "\u7EA2\u9E3E",
        "\u5929\u559C",
        "\u5929\u59DA",
        "\u54B8\u6C60",
        "\u89E3\u795E",
        "\u4E09\u53F0",
        "\u516B\u5EA7",
        "\u6069\u5149",
        "\u5929\u8D35",
        "\u9F99\u6C60",
        "\u51E4\u9601",
        "\u5929\u624D",
        "\u5929\u5BFF",
        "\u53F0\u8F85",
        "\u5C01\u8BF0",
        "\u5929\u5DEB",
        "\u534E\u76D6",
        "\u5929\u5B98",
        "\u5929\u798F",
        "\u5929\u53A8",
        "\u5929\u6708",
        "\u5929\u5FB7",
        "\u6708\u5FB7",
        "\u5929\u7A7A",
        "\u65EC\u7A7A",
        "\u622A\u8DEF",
        "\u7A7A\u4EA1",
        "\u5B64\u8FB0",
        "\u5BE1\u5BBF",
        "\u871A\u5EC9",
        "\u7834\u788E",
        "\u5929\u5211",
        "\u9634\u715E",
        "\u5929\u54ED",
        "\u5929\u865A",
        "\u5929\u4F24",
        "\u5929\u4F7F",
        "\u5E74\u89E3"
      ]
    },
    majorStarRule: {
      ruleId: "ziwei.star.major-placement",
      label: "\u7D2B\u5FAE\u661F\u7CFB\u81EA\u7D2B\u5FAE\u9006\u884C\u5B89\u516D\u661F\uFF08\u7D2B\u5FAE\u3001\u5929\u673A\u3001\u592A\u9633\u3001\u6B66\u66F2\u3001\u5929\u540C\u3001\u5EC9\u8D1E\uFF09\uFF0C\u5929\u5E9C\u661F\u7CFB\u81EA\u5929\u5E9C\u987A\u884C\u5B89\u516B\u661F\uFF08\u5929\u5E9C\u3001\u592A\u9634\u3001\u8D2A\u72FC\u3001\u5DE8\u95E8\u3001\u5929\u76F8\u3001\u5929\u6881\u3001\u4E03\u6740\u3001\u7834\u519B\uFF09",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.9,
      ziweiSeries: ["\u7D2B\u5FAE", "\u5929\u673A", null, "\u592A\u9633", "\u6B66\u66F2", "\u5929\u540C", null, null, "\u5EC9\u8D1E"],
      tianfuSeries: ["\u5929\u5E9C", "\u592A\u9634", "\u8D2A\u72FC", "\u5DE8\u95E8", "\u5929\u76F8", "\u5929\u6881", "\u4E03\u6740", null, null, null, "\u7834\u519B"],
      ziweiDirection: -1,
      tianfuDirection: 1,
      mirrorSum: 12
    },
    lucunRule: {
      ruleId: "ziwei.star.lucun",
      label: "\u7984\u5B58\u6309\u5E74\u5E72\u5B9A\u4F4D\uFF1A\u7532\u7984\u5728\u5BC5\u3001\u4E59\u7984\u5728\u536F\u3001\u4E19\u620A\u7984\u5728\u5DF3\u3001\u4E01\u5DF1\u7984\u5728\u5348\u3001\u5E9A\u7984\u5728\u7533\u3001\u8F9B\u7984\u5728\u9149\u3001\u58EC\u7984\u5728\u4EA5\u3001\u7678\u7984\u5728\u5B50\uFF1B\u7984\u524D\u4E00\u4F4D\u64CE\u7F8A\uFF0C\u7984\u540E\u4E00\u4F4D\u9640\u7F57",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      table: { \u7532: "\u5BC5", \u4E59: "\u536F", \u4E19: "\u5DF3", \u4E01: "\u5348", \u620A: "\u5DF3", \u5DF1: "\u5348", \u5E9A: "\u7533", \u8F9B: "\u9149", \u58EC: "\u4EA5", \u7678: "\u5B50" },
      yangOffset: 1,
      tuoOffset: -1
    },
    tianmaRule: {
      ruleId: "ziwei.star.tianma",
      label: "\u5929\u9A6C\u6309\u5E74\u652F\u4E09\u5408\u5B9A\u4F4D\uFF1A\u5BC5\u5348\u620C\u5E74\u5929\u9A6C\u5728\u7533\uFF0C\u7533\u5B50\u8FB0\u5E74\u5728\u5BC5\uFF0C\u5DF3\u9149\u4E11\u5E74\u5728\u4EA5\uFF0C\u4EA5\u536F\u672A\u5E74\u5728\u5DF3",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      table: {
        \u5BC5: "\u7533",
        \u5348: "\u7533",
        \u620C: "\u7533",
        \u7533: "\u5BC5",
        \u5B50: "\u5BC5",
        \u8FB0: "\u5BC5",
        \u5DF3: "\u4EA5",
        \u9149: "\u4EA5",
        \u4E11: "\u4EA5",
        \u4EA5: "\u5DF3",
        \u536F: "\u5DF3",
        \u672A: "\u5DF3"
      }
    },
    kuiyueRule: {
      ruleId: "ziwei.star.kuiyue",
      label: "\u5929\u9B41\u5929\u94BA\u6309\u5E74\u5E72\u5B9A\u4F4D\uFF1A\u7532\u620A\u5E9A\u5E74\u4E11\u672A\uFF0C\u4E59\u5DF1\u5E74\u5B50\u7533\uFF0C\u8F9B\u5E74\u5348\u5BC5\uFF0C\u4E19\u4E01\u5E74\u4EA5\u9149\uFF0C\u58EC\u7678\u5E74\u536F\u5DF3",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      table: {
        \u7532: ["\u4E11", "\u672A"],
        \u620A: ["\u4E11", "\u672A"],
        \u5E9A: ["\u4E11", "\u672A"],
        \u4E59: ["\u5B50", "\u7533"],
        \u5DF1: ["\u5B50", "\u7533"],
        \u8F9B: ["\u5348", "\u5BC5"],
        \u4E19: ["\u4EA5", "\u9149"],
        \u4E01: ["\u4EA5", "\u9149"],
        \u58EC: ["\u536F", "\u5DF3"],
        \u7678: ["\u536F", "\u5DF3"]
      }
    },
    zuoyouRule: {
      ruleId: "ziwei.star.zuoyou",
      label: "\u5DE6\u8F85\u81EA\u8FB0\u5BAB\u8D77\u6B63\u6708\u987A\u6570\u81F3\u751F\u6708\uFF0C\u53F3\u5F3C\u81EA\u620C\u5BAB\u8D77\u6B63\u6708\u9006\u6570\u81F3\u751F\u6708",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      zuoBase: "\u8FB0",
      youBase: "\u620C",
      zuoDirection: 1,
      youDirection: -1
    },
    wenchangWenquRule: {
      ruleId: "ziwei.star.wenchang-wenqu",
      label: "\u6587\u66F2\u81EA\u8FB0\u5BAB\u8D77\u5B50\u65F6\u987A\u6570\u81F3\u751F\u65F6\uFF0C\u6587\u660C\u81EA\u620C\u5BAB\u8D77\u5B50\u65F6\u9006\u6570\u81F3\u751F\u65F6",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.88,
      quBase: "\u8FB0",
      changBase: "\u620C",
      quDirection: 1,
      changDirection: -1
    },
    dikongDijieRule: {
      ruleId: "ziwei.star.dikong-dijie",
      label: "\u5730\u52AB\u81EA\u4EA5\u5BAB\u8D77\u5B50\u65F6\u987A\u6570\u81F3\u751F\u65F6\uFF0C\u5730\u7A7A\u81EA\u4EA5\u5BAB\u8D77\u5B50\u65F6\u9006\u6570\u81F3\u751F\u65F6",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      base: "\u4EA5",
      jieDirection: 1,
      kongDirection: -1
    },
    huolingRule: {
      ruleId: "ziwei.star.huoling",
      label: "\u706B\u661F\u94C3\u661F\u6309\u5E74\u652F\u4E09\u5408\u5B9A\u8D77\u5B50\u65F6\u5BAB\u4F4D\uFF0C\u518D\u987A\u6570\u81F3\u751F\u65F6\uFF1A\u5BC5\u5348\u620C\u5E74\u4E11\u536F\uFF0C\u7533\u5B50\u8FB0\u5E74\u5BC5\u620C\uFF0C\u5DF3\u9149\u4E11\u5E74\u536F\u620C\uFF0C\u4EA5\u536F\u672A\u5E74\u9149\u620C",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.82,
      table: {
        \u5BC5: ["\u4E11", "\u536F"],
        \u5348: ["\u4E11", "\u536F"],
        \u620C: ["\u4E11", "\u536F"],
        \u7533: ["\u5BC5", "\u620C"],
        \u5B50: ["\u5BC5", "\u620C"],
        \u8FB0: ["\u5BC5", "\u620C"],
        \u5DF3: ["\u536F", "\u620C"],
        \u9149: ["\u536F", "\u620C"],
        \u4E11: ["\u536F", "\u620C"],
        \u4EA5: ["\u9149", "\u620C"],
        \u536F: ["\u9149", "\u620C"],
        \u672A: ["\u9149", "\u620C"]
      }
    },
    mutagenRule: {
      ruleId: "ziwei.mutagen.year-stem",
      label: "\u751F\u5E74\u56DB\u5316\u6309\u5E74\u5E72\u5B9A\u7984\u6743\u79D1\u5FCC\uFF1A\u7532\u5EC9\u7834\u6B66\u9633\uFF0C\u4E59\u673A\u6881\u7D2B\u9634\uFF0C\u4E19\u540C\u673A\u660C\u5EC9\uFF0C\u4E01\u9634\u540C\u673A\u5DE8\uFF0C\u620A\u8D2A\u9634\u5F3C\u673A\uFF0C\u5DF1\u6B66\u8D2A\u6881\u66F2\uFF0C\u5E9A\u9633\u6B66\u9634\u540C\uFF0C\u8F9B\u5DE8\u9633\u66F2\u660C\uFF0C\u58EC\u6881\u7D2B\u5DE6\u6B66\uFF0C\u7678\u7834\u5DE8\u9634\u8D2A",
      evidence: "traditional",
      source: ["ziwei-quanshu"],
      confidence: 0.85,
      order: ["\u7984", "\u6743", "\u79D1", "\u5FCC"],
      table: {
        \u7532: ["\u5EC9\u8D1E", "\u7834\u519B", "\u6B66\u66F2", "\u592A\u9633"],
        \u4E59: ["\u5929\u673A", "\u5929\u6881", "\u7D2B\u5FAE", "\u592A\u9634"],
        \u4E19: ["\u5929\u540C", "\u5929\u673A", "\u6587\u660C", "\u5EC9\u8D1E"],
        \u4E01: ["\u592A\u9634", "\u5929\u540C", "\u5929\u673A", "\u5DE8\u95E8"],
        \u620A: ["\u8D2A\u72FC", "\u592A\u9634", "\u53F3\u5F3C", "\u5929\u673A"],
        \u5DF1: ["\u6B66\u66F2", "\u8D2A\u72FC", "\u5929\u6881", "\u6587\u66F2"],
        \u5E9A: ["\u592A\u9633", "\u6B66\u66F2", "\u592A\u9634", "\u5929\u540C"],
        \u8F9B: ["\u5DE8\u95E8", "\u592A\u9633", "\u6587\u66F2", "\u6587\u660C"],
        \u58EC: ["\u5929\u6881", "\u7D2B\u5FAE", "\u5DE6\u8F85", "\u6B66\u66F2"],
        \u7678: ["\u7834\u519B", "\u5DE8\u95E8", "\u592A\u9634", "\u8D2A\u72FC"]
      }
    },
    yearMinorRule: {
      ruleId: "ziwei.star.year-minor",
      label: "\u5E74\u7CFB\u6742\u66DC\uFF1A\u534E\u76D6\u54B8\u6C60\u6309\u5E74\u652F\u4E09\u5408\uFF0C\u5B64\u8FB0\u5BE1\u5BBF\u6309\u5E74\u652F\u56DB\u5B63\uFF0C\u5929\u624D\u5929\u5BFF\u4EE5\u547D\u5BAB\u8EAB\u5BAB\u52A0\u5E74\u652F\u5B50\u57FA\u5E8F\u53F7\uFF0C\u9F99\u6C60\u51E4\u9601\u5929\u54ED\u5929\u865A\u4EE5\u8FB0\u620C\u5348\u5BAB\u52A0\u51CF\u5E74\u652F\u5E8F\u53F7\uFF0C\u5929\u5B98\u5929\u798F\u5929\u53A8\u6309\u5E74\u5E72\uFF0C\u622A\u8DEF\u7A7A\u4EA1\u6309\u5E74\u5E72\u5BF9\u4E94\u53D6\u6A21\uFF0C\u7834\u788E\u6309\u5E74\u652F\u5BF9\u4E09\u53D6\u6A21\uFF0C\u871A\u5EC9\u5E74\u89E3\u6309\u5E74\u652F\u76F4\u53D6\uFF0C\u5929\u7A7A\u4E3A\u5E74\u652F\u5BAB\u987A\u4E00\u4F4D\uFF0C\u65EC\u7A7A\u6309\u5E74\u5E72\u4E0E\u5E74\u652F\u540C\u5947\u5076\u4FEE\u6B63\uFF0C\u5929\u4F24\u5929\u4F7F\u81EA\u4EA4\u53CB\u5BAB\u4E0E\u75BE\u5384\u5BAB\u8D77\u547D\u5BAB",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.78,
      huagaiXianchi: {
        \u5BC5: ["\u620C", "\u536F"],
        \u5348: ["\u620C", "\u536F"],
        \u620C: ["\u620C", "\u536F"],
        \u7533: ["\u8FB0", "\u9149"],
        \u5B50: ["\u8FB0", "\u9149"],
        \u8FB0: ["\u8FB0", "\u9149"],
        \u5DF3: ["\u4E11", "\u5348"],
        \u9149: ["\u4E11", "\u5348"],
        \u4E11: ["\u4E11", "\u5348"],
        \u4EA5: ["\u672A", "\u5B50"],
        \u536F: ["\u672A", "\u5B50"],
        \u672A: ["\u672A", "\u5B50"]
      },
      guchenGuasu: {
        \u5BC5: ["\u5DF3", "\u4E11"],
        \u536F: ["\u5DF3", "\u4E11"],
        \u8FB0: ["\u5DF3", "\u4E11"],
        \u5DF3: ["\u7533", "\u8FB0"],
        \u5348: ["\u7533", "\u8FB0"],
        \u672A: ["\u7533", "\u8FB0"],
        \u7533: ["\u4EA5", "\u672A"],
        \u9149: ["\u4EA5", "\u672A"],
        \u620C: ["\u4EA5", "\u672A"],
        \u4EA5: ["\u5BC5", "\u620C"],
        \u5B50: ["\u5BC5", "\u620C"],
        \u4E11: ["\u5BC5", "\u620C"]
      },
      tianchuByStem: ["\u5DF3", "\u5348", "\u5B50", "\u5DF3", "\u5348", "\u7533", "\u5BC5", "\u5348", "\u9149", "\u4EA5"],
      posuiByBranchMod3: ["\u5DF3", "\u4E11", "\u9149"],
      feilianByBranch: ["\u7533", "\u9149", "\u620C", "\u5DF3", "\u5348", "\u672A", "\u5BC5", "\u536F", "\u8FB0", "\u4EA5", "\u5B50", "\u4E11"],
      tianguanByStem: ["\u672A", "\u8FB0", "\u5DF3", "\u5BC5", "\u536F", "\u9149", "\u4EA5", "\u9149", "\u620C", "\u5348"],
      tianfuByStem: ["\u9149", "\u7533", "\u5B50", "\u4EA5", "\u536F", "\u5BC5", "\u5348", "\u5DF3", "\u5348", "\u5DF3"],
      jieluByStemMod5: ["\u7533", "\u5348", "\u8FB0", "\u5BC5", "\u5B50"],
      kongwangByStemMod5: ["\u9149", "\u672A", "\u5DF3", "\u536F", "\u4E11"],
      nianjieByBranch: ["\u620C", "\u9149", "\u7533", "\u672A", "\u5348", "\u5DF3", "\u8FB0", "\u536F", "\u5BC5", "\u4E11", "\u5B50", "\u4EA5"],
      bases: { longchi: "\u8FB0", fengge: "\u620C", tianku: "\u5348", tianxu: "\u5348", tiande: "\u9149", yuede: "\u5DF3" },
      tiankongOffset: 1,
      tianShangPalaceOffset: 5,
      tianShiPalaceOffset: 7,
      xunkongAnchorStem: "\u7678"
    },
    monthMinorRule: {
      ruleId: "ziwei.star.month-minor",
      label: "\u6708\u7CFB\u6742\u66DC\uFF1A\u89E3\u795E\u81EA\u7533\u620C\u5B50\u5BC5\u8FB0\u5348\u516D\u5BAB\u6309\u751F\u6708\u4E24\u6708\u4E00\u7EC4\u53D6\u4E00\u5BAB\uFF0C\u5929\u59DA\u81EA\u4E11\u5BAB\u987A\u6570\u751F\u6708\uFF0C\u5929\u5211\u81EA\u9149\u5BAB\u987A\u6570\u751F\u6708\uFF0C\u9634\u715E\u81EA\u5BC5\u5B50\u620C\u7533\u5348\u8FB0\u516D\u5BAB\u6309\u751F\u6708\u5BF9\u516D\u53D6\u6A21\uFF0C\u5929\u6708\u6309\u751F\u6708\u76F4\u53D6\u5341\u4E8C\u6708\u8868\uFF0C\u5929\u5DEB\u81EA\u5DF3\u7533\u5BC5\u4EA5\u56DB\u5BAB\u6309\u751F\u6708\u5BF9\u56DB\u53D6\u6A21",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.78,
      yuejieByMonthHalf: ["\u7533", "\u620C", "\u5B50", "\u5BC5", "\u8FB0", "\u5348"],
      tianyaoBase: "\u4E11",
      tianxingBase: "\u9149",
      yinshaByMonthMod6: ["\u5BC5", "\u5B50", "\u620C", "\u7533", "\u5348", "\u8FB0"],
      tianyueByMonth: ["\u620C", "\u5DF3", "\u8FB0", "\u5BC5", "\u672A", "\u536F", "\u4EA5", "\u672A", "\u5BC5", "\u5348", "\u620C", "\u5BC5"],
      tianwuByMonthMod4: ["\u5DF3", "\u7533", "\u5BC5", "\u4EA5"]
    },
    dayMinorRule: {
      ruleId: "ziwei.star.day-minor",
      label: "\u65E5\u7CFB\u6742\u66DC\uFF1A\u4E09\u53F0\u81EA\u5DE6\u8F85\u5BAB\u4F4D\u987A\u6570\u65E5\u5E8F\uFF0C\u516B\u5EA7\u81EA\u53F3\u5F3C\u5BAB\u4F4D\u9006\u6570\u65E5\u5E8F\uFF0C\u6069\u5149\u81EA\u6587\u660C\u5BAB\u4F4D\u987A\u6570\u65E5\u5E8F\u518D\u9000\u4E00\u4F4D\uFF0C\u5929\u8D35\u81EA\u6587\u66F2\u5BAB\u4F4D\u987A\u6570\u65E5\u5E8F\u518D\u9000\u4E00\u4F4D\uFF1B\u65E5\u5E8F\u4EE5\u519C\u5386\u65E5\u6570\u8BA1\uFF0C\u665A\u5B50\u65F6\u7528\u5F53\u65E5\u3001\u5176\u4F59\u65F6\u8FB0\u7528\u524D\u4E00\u65E5",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.75,
      santaiFrom: "zuofu",
      bazuoFrom: "youbi",
      enguangFrom: "wenchang",
      tianguiFrom: "wenqu",
      enguangOffset: -1,
      tianguiOffset: -1,
      dayIndexLateZiOffset: 0,
      dayIndexOtherOffset: -1
    },
    hourMinorRule: {
      ruleId: "ziwei.star.hour-minor",
      label: "\u65F6\u7CFB\u6742\u66DC\uFF1A\u53F0\u8F85\u81EA\u5348\u5BAB\u987A\u6570\u751F\u65F6\uFF0C\u5C01\u8BF0\u81EA\u5BC5\u5BAB\u987A\u6570\u751F\u65F6",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.78,
      taifuBase: "\u5348",
      fenggaoBase: "\u5BC5",
      direction: 1
    },
    hongluanTianxiRule: {
      ruleId: "ziwei.star.hongluan-tianxi",
      label: "\u7EA2\u9E3E\u5929\u559C\u6309\u5E74\u652F\u5B9A\u4F4D\uFF1A\u81EA\u536F\u5BAB\u9006\u6570\u5E74\u652F\u5B50\u57FA\u5E8F\u53F7\u5F97\u7EA2\u9E3E\uFF0C\u7EA2\u9E3E\u5BF9\u5BAB\uFF08\u987A\u516D\u4F4D\uFF09\u5F97\u5929\u559C",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.8,
      hongluanBase: "\u536F",
      direction: -1,
      tianxiOffset: 6
    },
    changshengRule: {
      ruleId: "ziwei.twelve-gods.changsheng",
      label: "\u957F\u751F\u5341\u4E8C\u795E\uFF1A\u8D77\u5BAB\u6309\u4E94\u884C\u5C40\uFF08\u6C34\u4E8C\u5C40\u4E0E\u571F\u4E94\u5C40\u8D77\u7533\u3001\u6728\u4E09\u5C40\u8D77\u4EA5\u3001\u91D1\u56DB\u5C40\u8D77\u5DF3\u3001\u706B\u516D\u5C40\u8D77\u5BC5\uFF09\uFF0C\u987A\u5E8F\u4E3A\u957F\u751F\u6C90\u6D74\u51A0\u5E26\u4E34\u5B98\u5E1D\u65FA\u8870\u75C5\u6B7B\u5893\u7EDD\u80CE\u517B\uFF0C\u9633\u7537\u9634\u5973\u987A\u884C\u3001\u9634\u7537\u9633\u5973\u9006\u884C",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.82,
      startByClass: { 2: "\u7533", 3: "\u4EA5", 4: "\u5DF3", 5: "\u7533", 6: "\u5BC5" },
      order: ["\u957F\u751F", "\u6C90\u6D74", "\u51A0\u5E26", "\u4E34\u5B98", "\u5E1D\u65FA", "\u8870", "\u75C5", "\u6B7B", "\u5893", "\u7EDD", "\u80CE", "\u517B"],
      genderPolarity: { male: "\u9633", female: "\u9634" },
      branchPolarity: { even: "\u9633", odd: "\u9634" },
      direction: { same: 1, opposite: -1 }
    },
    boshiRule: {
      ruleId: "ziwei.twelve-gods.boshi",
      label: "\u535A\u58EB\u5341\u4E8C\u795E\uFF1A\u81EA\u7984\u5B58\u5BAB\u4F4D\u8D77\u535A\u58EB\uFF0C\u987A\u5E8F\u4E3A\u535A\u58EB\u529B\u58EB\u9752\u9F99\u5C0F\u8017\u5C06\u519B\u594F\u4E66\u98DE\u5EC9\u559C\u795E\u75C5\u7B26\u5927\u8017\u4F0F\u5175\u5B98\u5E9C\uFF0C\u65B9\u5411\u4E0E\u957F\u751F\u5341\u4E8C\u795E\u4E00\u81F4\uFF08\u9633\u7537\u9634\u5973\u987A\u884C\u3001\u9634\u7537\u9633\u5973\u9006\u884C\uFF09",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.8,
      startFrom: "\u7984\u5B58",
      order: ["\u535A\u58EB", "\u529B\u58EB", "\u9752\u9F99", "\u5C0F\u8017", "\u5C06\u519B", "\u594F\u4E66", "\u98DE\u5EC9", "\u559C\u795E", "\u75C5\u7B26", "\u5927\u8017", "\u4F0F\u5175", "\u5B98\u5E9C"],
      genderPolarity: { male: "\u9633", female: "\u9634" },
      branchPolarity: { even: "\u9633", odd: "\u9634" },
      direction: { same: 1, opposite: -1 }
    },
    jiangqianRule: {
      ruleId: "ziwei.twelve-gods.jiangqian",
      label: "\u5C06\u524D\u5341\u4E8C\u795E\uFF1A\u8D77\u5BAB\u6309\u5E74\u652F\u4E09\u5408\uFF08\u5BC5\u5348\u620C\u5E74\u8D77\u5348\u3001\u7533\u5B50\u8FB0\u5E74\u8D77\u5B50\u3001\u5DF3\u9149\u4E11\u5E74\u8D77\u9149\u3001\u4EA5\u536F\u672A\u5E74\u8D77\u536F\uFF09\uFF0C\u987A\u5E8F\u4E3A\u5C06\u661F\u6500\u978D\u5C81\u9A7F\u606F\u795E\u534E\u76D6\u52AB\u715E\u707E\u715E\u5929\u715E\u6307\u80CC\u54B8\u6C60\u6708\u715E\u4EA1\u795E\uFF0C\u4E00\u5F8B\u987A\u884C",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.8,
      startTable: {
        \u5BC5: "\u5348",
        \u5348: "\u5348",
        \u620C: "\u5348",
        \u7533: "\u5B50",
        \u5B50: "\u5B50",
        \u8FB0: "\u5B50",
        \u5DF3: "\u9149",
        \u9149: "\u9149",
        \u4E11: "\u9149",
        \u4EA5: "\u536F",
        \u536F: "\u536F",
        \u672A: "\u536F"
      },
      order: ["\u5C06\u661F", "\u6500\u978D", "\u5C81\u9A7F", "\u606F\u795E", "\u534E\u76D6", "\u52AB\u715E", "\u707E\u715E", "\u5929\u715E", "\u6307\u80CC", "\u54B8\u6C60", "\u6708\u715E", "\u4EA1\u795E"],
      direction: 1
    },
    suiqianRule: {
      ruleId: "ziwei.twelve-gods.suiqian",
      label: "\u5C81\u524D\u5341\u4E8C\u795E\uFF1A\u81EA\u5E74\u652F\u5BAB\u4F4D\u8D77\u5C81\u5EFA\uFF0C\u987A\u5E8F\u4E3A\u5C81\u5EFA\u6666\u6C14\u4E27\u95E8\u8D2F\u7D22\u5B98\u7B26\u5C0F\u8017\u5927\u8017\u9F99\u5FB7\u767D\u864E\u5929\u5FB7\u540A\u5BA2\u75C5\u7B26\uFF0C\u4E00\u5F8B\u987A\u884C\uFF08\u901A\u884C\u6D3E\u7B2C\u4E03\u4F4D\u4F5C\u5927\u8017\uFF0C\u4E2D\u5DDE\u6D3E\u4F5C\u5C81\u7834\uFF0C\u672C\u89C4\u5219\u96C6\u53EA\u767B\u8BB0\u901A\u884C\u6D3E\uFF09",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.78,
      startFromYearBranch: true,
      order: ["\u5C81\u5EFA", "\u6666\u6C14", "\u4E27\u95E8", "\u8D2F\u7D22", "\u5B98\u7B26", "\u5C0F\u8017", "\u5927\u8017", "\u9F99\u5FB7", "\u767D\u864E", "\u5929\u5FB7", "\u540A\u5BA2", "\u75C5\u7B26"],
      direction: 1
    },
    soulBodyMasterRule: {
      ruleId: "ziwei.star.soul-body-master",
      label: "\u547D\u4E3B\u8EAB\u4E3B\uFF1A\u547D\u4E3B\u6309\u547D\u5BAB\u5730\u652F\u53D6 [0] \u4F4D\uFF08\u5B50\u8D2A\u72FC\u3001\u4E11\u4EA5\u5DE8\u95E8\u3001\u5BC5\u620C\u7984\u5B58\u3001\u536F\u9149\u6587\u66F2\u3001\u8FB0\u7533\u5EC9\u8D1E\u3001\u5DF3\u672A\u6B66\u66F2\u3001\u5348\u7834\u519B\uFF09\uFF0C\u8EAB\u4E3B\u6309\u751F\u5E74\u5730\u652F\u53D6 [1] \u4F4D\uFF08\u5B50\u5348\u706B\u661F\u3001\u4E11\u672A\u5929\u76F8\u3001\u5BC5\u7533\u5929\u6881\u3001\u536F\u9149\u5929\u540C\u3001\u8FB0\u620C\u6587\u660C\u3001\u5DF3\u4EA5\u5929\u673A\uFF09",
      evidence: "traditional",
      source: ["ziwei-quanshu", "iztro"],
      confidence: 0.8,
      table: {
        \u5B50: ["\u8D2A\u72FC", "\u706B\u661F"],
        \u4E11: ["\u5DE8\u95E8", "\u5929\u76F8"],
        \u5BC5: ["\u7984\u5B58", "\u5929\u6881"],
        \u536F: ["\u6587\u66F2", "\u5929\u540C"],
        \u8FB0: ["\u5EC9\u8D1E", "\u6587\u660C"],
        \u5DF3: ["\u6B66\u66F2", "\u5929\u673A"],
        \u5348: ["\u7834\u519B", "\u706B\u661F"],
        \u672A: ["\u6B66\u66F2", "\u5929\u76F8"],
        \u7533: ["\u5EC9\u8D1E", "\u5929\u6881"],
        \u9149: ["\u6587\u66F2", "\u5929\u540C"],
        \u620C: ["\u7984\u5B58", "\u6587\u660C"],
        \u4EA5: ["\u5DE8\u95E8", "\u5929\u673A"]
      }
    }
  },
  parameters: {
    yearBoundaryMode: "lunar-new-year",
    leapMonthMode: "split-fifteen",
    lateZiDayMode: "next-day",
    timeIndexBasis: "true-solar",
    palaceCount: 12,
    firstPalaceBranch: "\u5BC5",
    decadalYears: 10,
    xiaoxianCycleYears: 12,
    xiaoxianCycles: 10,
    leapSplitDay: 15,
    leapFixAppliesToLateZi: false,
    earlyZiHour: 0,
    lateZiHour: 23,
    lateZiTimeIndex: 12,
    timeIndexCount: 13
  },
  sources: {
    "ziwei-quanshu": {
      citation: "\u300A\u7D2B\u5FAE\u6597\u6570\u5168\u4E66\u300B\uFF08\u660E\uFF0C\u6258\u540D\u9648\u629F\uFF09\uFF1A\u5B89\u547D\u8EAB\u5BAB\u8BC0\u3001\u5B9A\u4E94\u884C\u5C40\u6CD5\u3001\u8D77\u7D2B\u5FAE\u661F\u8BC0\u3001\u5B89\u5341\u56DB\u4E3B\u661F\u4E0E\u5341\u56DB\u8F85\u661F\u3001\u5E74\u7CFB/\u6708\u7CFB/\u65E5\u7CFB/\u65F6\u7CFB\u6742\u66DC\u3001\u957F\u751F\u4E0E\u535A\u58EB\u5341\u4E8C\u795E\u3001\u5C06\u524D\u4E0E\u5C81\u524D\u5341\u4E8C\u795E\u3001\u547D\u4E3B\u8EAB\u4E3B\u3001\u8D77\u5927\u9650\u5C0F\u9650\u3001\u751F\u5E74\u56DB\u5316",
      kind: "traditional-text"
    },
    "na-yin-table": {
      citation: "\u516D\u5341\u7532\u5B50\u7EB3\u97F3\u8868\uFF1A\u4E94\u884C\u5C40\u53D6\u547D\u5BAB\u5E72\u652F\u4E4B\u7EB3\u97F3\uFF0C\u6C34\u4E8C\u5C40\u3001\u6728\u4E09\u5C40\u3001\u91D1\u56DB\u5C40\u3001\u571F\u4E94\u5C40\u3001\u706B\u516D\u5C40",
      kind: "traditional-table"
    },
    "true-solar-time": {
      citation: "\u771F\u592A\u9633\u65F6 = \u5E73\u592A\u9633\u65F6 + (\u7ECF\u5EA6 \u2212 120\xB0)\xD74 \u5206\u949F + \u5747\u65F6\u5DEE",
      kind: "astronomical-reference"
    },
    iztro: {
      citation: "SylarLong/iztro\uFF08MIT\uFF09\uFF1A\u5B89\u661F\u7B97\u6CD5\u53C2\u7167\u5B9E\u73B0\uFF0C\u7528\u4E8E\u4EA4\u53C9\u6838\u5BF9\uFF0C\u4E0D\u6539\u53D8\u4F20\u7EDF\u51FA\u5904\u7684\u8BC1\u636E\u7C7B\u522B",
      kind: "reference-implementation"
    },
    "lunar-calendar-rule": {
      citation: "\u519C\u5386\u7F16\u6392\u89C4\u5219\uFF1A\u6714\u65E5\u4E3A\u6708\u9996\u3001\u51AC\u81F3\u6240\u5728\u6708\u4E3A\u5341\u4E00\u6708\u3001\u65E0\u4E2D\u6C14\u4E4B\u6708\u4E3A\u95F0\u6708\uFF08ADR-0003\uFF09",
      kind: "calendar-convention"
    }
  }
};

// src/derive/hash.js
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(value).sort().filter((k) => value[k] !== void 0).map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}
function fnv1a64(text) {
  const FNV_OFFSET = 0xcbf29ce484222325n;
  const FNV_PRIME = 0x100000001b3n;
  const MASK = 0xffffffffffffffffn;
  let hash = FNV_OFFSET;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    hash ^= BigInt(byte);
    hash = hash * FNV_PRIME & MASK;
  }
  return hash.toString(16).padStart(16, "0");
}
function fnv1a32(text) {
  let hash = 2166136261;
  const bytes = new TextEncoder().encode(text);
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
function hashInput(input) {
  return fnv1a64(stableStringify(input));
}
function hashFacts(graph) {
  return fnv1a64(stableStringify(graph?.facts ?? []));
}

// src/version.js
var ENGINE_VERSION = "0.5.1";
var EPHEMERIS_MODEL = "VSOP87D+IAU1980+Meeus49";
var SCHEMA_VERSION = "1.0.0";
function parseVersion(value) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:[-+]([0-9A-Za-z.-]+))?$/.exec(String(value).trim());
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]), pre: m[4] ?? null };
}
function compareVersions(a, b) {
  const pa = parseVersion(a), pb = parseVersion(b);
  if (!pa) throw new Error("invalid version: " + a);
  if (!pb) throw new Error("invalid version: " + b);
  for (const key of ["major", "minor", "patch"]) {
    if (pa[key] !== pb[key]) return pa[key] < pb[key] ? -1 : 1;
  }
  if (pa.pre === pb.pre) return 0;
  if (pa.pre === null) return 1;
  if (pb.pre === null) return -1;
  return pa.pre < pb.pre ? -1 : 1;
}
function satisfiesRange(range, version) {
  const terms = String(range ?? "").trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return false;
  for (const term of terms) {
    const m = /^(>=|<=|>|<|==|=)?\s*(.+)$/.exec(term);
    const op = m[1] ?? "=";
    if (!parseVersion(m[2])) return false;
    const c = compareVersions(version, m[2]);
    const ok = op === ">=" ? c >= 0 : op === "<=" ? c <= 0 : op === ">" ? c > 0 : op === "<" ? c < 0 : c === 0;
    if (!ok) return false;
  }
  return true;
}

// rules/index.js
function withHash(ruleSet) {
  return Object.freeze({ ...ruleSet, hash: fnv1a64(stableStringify({ ...ruleSet, hash: void 0 })) });
}
var RULE_SETS = Object.freeze({
  "bazi-core-0.1.0": withHash(ruleset_default),
  "bazi-zichu-0.1.0": withHash(ruleset_default2),
  "ziwei-core-0.1.0": withHash(ruleset_default3),
  "ziwei-core-0.2.0": withHash(ruleset_default4)
});
var DEFAULT_BAZI_RULE_SET = "bazi-core-0.1.0";
var DEFAULT_ZIWEI_RULE_SET = "ziwei-core-0.2.0";
var REFERENCE_BY_SYSTEM = Object.freeze({
  bazi: "bazi-core-0.1.0",
  ziwei: "ziwei-core-0.2.0"
});
function systemOf(ruleSet) {
  return ruleSet?.system ?? "bazi";
}
function ruleSetIdsOf(system) {
  const all = Object.keys(RULE_SETS);
  if (!system) return all;
  return all.filter((id) => systemOf(RULE_SETS[id]) === system);
}
function isKnownRuleSet(id) {
  return Object.prototype.hasOwnProperty.call(RULE_SETS, id);
}
function getRuleSet(id = DEFAULT_BAZI_RULE_SET) {
  const ruleSet = RULE_SETS[id];
  if (!ruleSet) throw new Error("unknown rule set: " + id);
  return ruleSet;
}
function listRuleSets(options = {}) {
  const system = typeof options === "string" ? options : options.system;
  return Object.entries(RULE_SETS).filter(([, r]) => !system || systemOf(r) === system).map(([id, r]) => ({
    id,
    system: systemOf(r),
    version: r.version,
    title: r.title,
    school: r.school,
    engineCompatibility: r.engineCompatibility,
    hash: r.hash,
    ruleCount: ruleEntries(r).length,
    divergences: divergenceKeys(r)
  }));
}
function divergenceKeys(ruleSet) {
  const referenceId = REFERENCE_BY_SYSTEM[systemOf(ruleSet)];
  const reference = RULE_SETS[referenceId];
  if (!reference || ruleSet.id === referenceId) return [];
  const ref = new Map(ruleEntries(reference).map((e) => [e.ruleId, e]));
  const out = [];
  for (const entry of ruleEntries(ruleSet)) {
    const base = ref.get(entry.ruleId);
    if (!base) {
      out.push(entry.ruleId);
      continue;
    }
    if (base.value !== entry.value) out.push(entry.ruleId);
  }
  return out;
}
function ruleEntries(ruleSet = getRuleSet()) {
  const out = [];
  const push = (group, key, entry) => {
    if (entry && typeof entry === "object" && typeof entry.ruleId === "string") {
      out.push({ group, key, ...entry });
    }
  };
  for (const [key, entry] of Object.entries(ruleSet.conventions ?? {})) push("conventions", key, entry);
  for (const [key, entry] of Object.entries(ruleSet.tables ?? {})) push("tables", key, entry);
  return out;
}
function ruleIndex(ruleSet = getRuleSet()) {
  const index = /* @__PURE__ */ new Map();
  for (const entry of ruleEntries(ruleSet)) {
    if (index.has(entry.ruleId)) throw new Error("duplicate ruleId: " + entry.ruleId);
    index.set(entry.ruleId, entry);
  }
  return index;
}
function resolveRule(ruleId, ruleSet = getRuleSet()) {
  return ruleIndex(ruleSet).get(ruleId) ?? null;
}
function auditRuleSet(ruleSet = getRuleSet()) {
  const errors = [];
  const warnings = [];
  if (!ruleSet.id) errors.push("ruleSet.id is required");
  if (!ruleSet.version) errors.push("ruleSet.version is required");
  if (!ruleSet.sources || typeof ruleSet.sources !== "object") errors.push("ruleSet.sources is required");
  if (!ruleSet.engineCompatibility) {
    errors.push("ruleSet.engineCompatibility is required");
  } else if (!satisfiesRange(ruleSet.engineCompatibility, ENGINE_VERSION)) {
    errors.push('ruleSet.engineCompatibility "' + ruleSet.engineCompatibility + '" does not include current engine version ' + ENGINE_VERSION);
  }
  const sources = ruleSet.sources ?? {};
  const entries = ruleEntries(ruleSet);
  if (!entries.length) errors.push("rule set has no ruleId entries");
  const seen = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    const where = entry.group + "." + entry.key + " (" + entry.ruleId + ")";
    if (seen.has(entry.ruleId)) errors.push("duplicate ruleId: " + entry.ruleId);
    seen.add(entry.ruleId);
    if (!entry.label) errors.push(where + ": label is required");
    if (typeof entry.confidence !== "number" || entry.confidence < 0 || entry.confidence > 1) {
      errors.push(where + ": confidence must be within [0, 1]");
    }
    if (!["astronomical", "convention", "traditional", "calibration"].includes(entry.evidence)) {
      errors.push(where + ": evidence must be one of astronomical/convention/traditional/calibration");
    }
    if (!Array.isArray(entry.source) || entry.source.length === 0) {
      errors.push(where + ": source must be a non-empty array");
      continue;
    }
    for (const key of entry.source) {
      if (!sources[key]) errors.push(where + ': unregistered source "' + key + '"');
    }
  }
  for (const [key, source] of Object.entries(sources)) {
    if (!source.citation) errors.push("sources." + key + ": citation is required");
    if (!source.kind) warnings.push("sources." + key + ": kind is recommended");
  }
  return { ok: errors.length === 0, errors, warnings, ruleCount: entries.length, sourceCount: Object.keys(sources).length };
}
function auditFactGraph(graph, ruleSet = getRuleSet(graph?.manifest?.ruleSet)) {
  const index = ruleIndex(ruleSet);
  const errors = [];
  const facts = graph?.facts ?? [];
  const seen = /* @__PURE__ */ new Set();
  for (const f of facts) {
    if (!f?.fact_id) {
      errors.push("fact without fact_id");
      continue;
    }
    if (seen.has(f.fact_id)) errors.push("duplicate fact_id: " + f.fact_id);
    seen.add(f.fact_id);
    const rule = index.get(f.rule_id);
    if (!rule) {
      errors.push(f.fact_id + ': unknown rule_id "' + f.rule_id + '"');
      continue;
    }
    if (typeof f.confidence !== "number") {
      errors.push(f.fact_id + ": confidence must be a number");
      continue;
    }
    if (f.confidence > rule.confidence + 1e-9) {
      errors.push(f.fact_id + ": confidence " + f.confidence + " exceeds rule " + f.rule_id + " (" + rule.confidence + ")");
    }
  }
  return { ok: errors.length === 0, errors, factCount: facts.length };
}

// src/derive/facts.js
function fact({ id, value, ruleId, school = "common", confidence = 1, source = [], evidence = null }) {
  return Object.freeze({ fact_id: id, value, rule_id: ruleId, school, confidence, source, evidence });
}
function factFromRule(ruleId, { id, value, ruleSet = getRuleSet(), extra = {} } = {}) {
  const rule = resolveRule(ruleId, ruleSet);
  if (!rule) throw new Error("unknown ruleId: " + ruleId);
  return Object.freeze({
    fact_id: id,
    value,
    rule_id: ruleId,
    school: rule.school ?? ruleSet.school ?? "common",
    confidence: rule.confidence,
    source: [...rule.source],
    evidence: rule.evidence,
    rule_label: rule.label,
    ...extra
  });
}
function factGraph(facts, manifest) {
  return { version: "1.0.0", facts: [...facts], manifest };
}
function requireFacts(graph, ids) {
  return ids.map((id) => graph.facts.find((f) => f.fact_id === id)).filter(Boolean);
}
function factsByEvidence(graph, evidence) {
  return graph.facts.filter((f) => f.evidence === evidence);
}

// src/derive/wuxing.js
var ELEMENT_ORDER = ["\u6728", "\u706B", "\u571F", "\u91D1", "\u6C34"];
function elementStrength(pillars, ruleSet = getRuleSet()) {
  const weights = Array.isArray(ruleSet.parameters.hiddenStemWeights) ? ruleSet.parameters.hiddenStemWeights : [1, 0, 0];
  const stems = ruleSet.tables.stems;
  const branches = ruleSet.tables.branches;
  const elementOfStem2 = (name) => stems.find((s) => s.name === name)?.element ?? null;
  const totals = Object.fromEntries(ELEMENT_ORDER.map((element) => [element, 0]));
  for (const pillar of Object.values(pillars)) {
    if (typeof pillar !== "string" || pillar.length < 2) continue;
    const stemElement = elementOfStem2(pillar[0]);
    if (stemElement) totals[stemElement] += weights[0] ?? 0;
    const hidden = branches.find((b) => b.name === pillar[1])?.hiddenStems ?? [];
    hidden.forEach((name, index) => {
      const element = elementOfStem2(name);
      if (!element) return;
      totals[element] += weights[Math.min(index, weights.length - 1)] ?? 0;
    });
  }
  const round = (n) => Math.round(n * 1e3) / 1e3;
  const total = round(Object.values(totals).reduce((a, b) => a + b, 0));
  const ranked = ELEMENT_ORDER.map((element) => ({ element, value: round(totals[element]), share: total ? round(totals[element] / total) : 0 })).sort((a, b) => b.value - a.value || ELEMENT_ORDER.indexOf(a.element) - ELEMENT_ORDER.indexOf(b.element));
  return Object.freeze({
    weights: [...weights],
    totals: Object.fromEntries(ranked.map((r) => [r.element, r.value])),
    share: Object.fromEntries(ranked.map((r) => [r.element, r.share])),
    total,
    dominant: ranked[0]?.element ?? null,
    weakest: ranked[ranked.length - 1]?.element ?? null,
    ranking: ranked.map((r) => r.element),
    method: ruleSet.tables.elementCountRule?.ruleId ?? null,
    ruleSet: ruleSet.id
  });
}

// src/manifest.js
var DEFAULT_RULE_SET_ID = DEFAULT_BAZI_RULE_SET;
var RULE_SET_VERSION = getRuleSet(DEFAULT_BAZI_RULE_SET).version;
var RULE_SET = DEFAULT_BAZI_RULE_SET;
function createManifest(overrides = {}) {
  const ruleSetId = overrides.ruleSetId ?? DEFAULT_RULE_SET_ID;
  const ruleSet = getRuleSet(ruleSetId);
  return Object.freeze({
    engineVersion: ENGINE_VERSION,
    ephemerisModel: EPHEMERIS_MODEL,
    schemaVersion: SCHEMA_VERSION,
    ruleSet: ruleSetId,
    ruleSetVersion: ruleSet.version,
    ruleSetHash: ruleSet.hash ?? null,
    ...overrides
  });
}
function manifestForInput(input, overrides = {}) {
  return createManifest({ inputHash: hashInput(input), ...overrides });
}

// src/charts/bazi/pillars.js
var DEFAULT = getRuleSet();
function stemsOf(ruleSet = DEFAULT) {
  return ruleSet.tables.stems.map((s) => s.name);
}
function branchesOf(ruleSet = DEFAULT) {
  return ruleSet.tables.branches.map((b) => b.name);
}
function hiddenStemsOf(ruleSet = DEFAULT) {
  return Object.fromEntries(ruleSet.tables.branches.map((b) => [b.name, [...b.hiddenStems]]));
}
function tenGodNamesOf(ruleSet = DEFAULT) {
  return [...ruleSet.tables.tenGodNames];
}
function elementOfStem(stem, ruleSet = DEFAULT) {
  return ruleSet.tables.stems.find((s) => s.name === stem)?.element ?? null;
}
function elementOfBranch(branch, ruleSet = DEFAULT) {
  return ruleSet.tables.branches.find((b) => b.name === branch)?.element ?? null;
}
var STEMS = stemsOf();
var BRANCHES = branchesOf();
var hiddenStems = hiddenStemsOf();
function ganzhi(i, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  return stems[(i % stems.length + stems.length) % stems.length] + branches[(i % branches.length + branches.length) % branches.length];
}
function sexagenaryDay(jd, ruleSet = DEFAULT) {
  return ganzhi(Math.floor(jd + 0.5) + ruleSet.parameters.dayPillarJdnOffset, ruleSet);
}
function dayNumberForBoundary(civilDayNumber, shichen, ruleSet = DEFAULT) {
  const mode = ruleSet.parameters.dayBoundaryMode ?? "civil-midnight";
  if (mode === "civil-midnight") return civilDayNumber;
  if (mode === "zi-chu-true-solar") {
    const start = ruleSet.parameters.ziChuStartTrueSolarMinutes ?? 1380;
    const minutes = ((shichen?.trueSolarMinutes ?? 0) % 1440 + 1440) % 1440;
    return minutes >= start ? civilDayNumber + 1 : civilDayNumber;
  }
  throw new Error("unknown dayBoundaryMode: " + mode);
}
function yearPillar(y, m, d, o = {}) {
  const ruleSet = o.ruleSet ?? DEFAULT;
  const v = o.forcePrevious ? y - 1 : o.yearBoundary === "calendar" ? y : m < 2 || m === 2 && d < 4 ? y - 1 : y;
  return ganzhi(v - 4, ruleSet);
}
function monthPillar(yearOrStem, lon = 315, o = {}) {
  const ruleSet = o.ruleSet ?? DEFAULT;
  const { monthBoundaryStepDegrees: step } = ruleSet.parameters;
  const branches = branchesOf(ruleSet), stems = stemsOf(ruleSet);
  const b = (Math.floor((lon - 315 + 360) % 360 / step) + 2) % 12;
  const ys = typeof yearOrStem === "string" ? stems.indexOf(yearOrStem) : ((yearOrStem - 4) % 10 + 10) % 10;
  const s = (ys % 5 * 2 + 2) % 10;
  const position = ((b - 2) % 12 + 12) % 12;
  return stems[(s + position) % 10] + branches[b];
}
function dayPillar(jd, ruleSet = DEFAULT) {
  return sexagenaryDay(jd, ruleSet);
}
function hourPillar(dayStem, hourBranch, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const s = stems.indexOf(dayStem);
  const b = typeof hourBranch === "number" ? hourBranch : branches.indexOf(hourBranch);
  if (s < 0) throw new Error("unknown day stem: " + dayStem);
  if (b < 0 || b > 11) throw new Error("unknown hour branch: " + hourBranch);
  return stems[(s % 5 * 2 + b) % 10] + branches[b];
}
function tenGod(dayStem, otherStem, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), names = tenGodNamesOf(ruleSet);
  return names[(stems.indexOf(otherStem) - stems.indexOf(dayStem) + 10) % 10];
}
function luckDirection(yearStem, gender, ruleSet = DEFAULT) {
  const mode = ruleSet.parameters.luckDirectionMode ?? "year-stem-polarity";
  if (gender !== "male" && gender !== "female") throw new Error("unknown gender: " + gender);
  if (mode === "gender-only") return gender === "male" ? 1 : -1;
  if (mode !== "year-stem-polarity") throw new Error("unknown luckDirectionMode: " + mode);
  const stems = stemsOf(ruleSet);
  return stems.indexOf(yearStem) % 2 === 0 === (gender === "male") ? 1 : -1;
}
function pillarDetail(pillars, ruleSet = DEFAULT) {
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const hidden = hiddenStemsOf(ruleSet);
  return Object.fromEntries(Object.entries(pillars).map(([key, pillar]) => {
    const [stem, branch] = [pillar[0], pillar[1]];
    return [key, {
      pillar,
      stem,
      branch,
      stemIndex: stems.indexOf(stem),
      branchIndex: branches.indexOf(branch),
      stemElement: elementOfStem(stem, ruleSet),
      branchElement: elementOfBranch(branch, ruleSet),
      hiddenStems: [...hidden[branch] ?? []]
    }];
  }));
}

// src/charts/bazi/luck.js
function startLuckAge(daysToBoundary, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const divisor = options.daysPerYear ?? ruleSet.parameters.luckDaysPerYear;
  if (!(divisor > 0)) throw new Error("daysPerYear must be positive");
  const exact = Math.abs(daysToBoundary) / divisor;
  const rounding = options.rounding ?? ruleSet.parameters.luckStartRounding ?? "exact";
  if (rounding === "exact") return exact;
  if (rounding === "whole-year") return Math.round(exact);
  throw new Error("unknown luckStartRounding: " + rounding);
}
function luckPillars(monthPillar2, direction, count = 10, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const stems = stemsOf(ruleSet), branches = branchesOf(ruleSet);
  const stem = stems.indexOf(monthPillar2[0]);
  const branch = branches.indexOf(monthPillar2[1]);
  const cycle = ruleSet.parameters.sexagenaryCycleLength;
  const base = Array.from({ length: cycle }, (_, i) => ganzhi(i, ruleSet)).indexOf(monthPillar2);
  if (base < 0 || stem < 0 || branch < 0) throw new Error("invalid month pillar: " + monthPillar2);
  return Array.from({ length: count }, (_, i) => ganzhi(base + direction * (i + 1), ruleSet));
}
function buildLuck({ monthPillar: monthPillar2, yearStem, gender, daysToBoundary, options = {} }) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const direction = options.direction ?? luckDirection(yearStem, gender, ruleSet);
  return {
    direction,
    startAgeYears: startLuckAge(daysToBoundary, { ...options, ruleSet }),
    pillars: luckPillars(monthPillar2, direction, options.count ?? 10, { ruleSet }),
    method: ruleSet.parameters.luckStartRounding === "whole-year" ? "days-to-boundary-divided-by-3-rounded" : "days-to-boundary-divided-by-3",
    ruleId: ruleSet.conventions.luckStart.ruleId,
    directionRuleId: ruleSet.conventions.luckDirection.ruleId,
    ruleSet: ruleSet.id,
    options
  };
}

// src/charts/bazi/chart.js
function castBazi(input, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet(options.ruleSetId ?? DEFAULT_BAZI_RULE_SET);
  const zone = input.timezone ?? "Asia/Shanghai";
  const utc = civilToUTC(input, zone);
  const longitude = input.longitude ?? 120;
  const shi = shichenOfCivil(input, longitude, {
    timePrecision: input.timePrecision ?? "exact",
    timezone: zone,
    equationOfTimeMinutes: options.equationOfTimeMinutes
  });
  const civilDayNumber = julianDayFromGregorian(input.year, input.month, input.day);
  const dayNumber = dayNumberForBoundary(civilDayNumber, shi, ruleSet);
  const day = dayPillar(dayNumber, ruleSet);
  const lichun = solarTermInstant(input.year, 315).utc;
  const year = yearPillar(input.year, input.month, input.day, {
    yearBoundary: "calendar",
    forcePrevious: utc.jdUTC < lichun,
    ruleSet
  });
  const boundary = currentMonthBoundary(utc.jdUTC);
  const month = monthPillar(year[0], boundary?.degree ?? 315, { ruleSet });
  const hour = hourPillar(day[0], shi.index, ruleSet);
  const direction = input.gender ? luckDirection(year[0], input.gender, ruleSet) : null;
  const adjacent = direction === 1 ? nextMonthBoundary(utc.jdUTC) : boundary;
  const daysToBoundary = adjacent ? adjacent.utc - utc.jdUTC : 0;
  const luck = input.gender ? buildLuck({ monthPillar: month, yearStem: year[0], gender: input.gender, daysToBoundary, options: { direction, ruleSet } }) : null;
  const manifest = createManifest({ timezone: zone, longitude, ruleSetId: ruleSet.id, ruleSetVersion: ruleSet.version });
  const pillars = { year, month, day, hour };
  const facts = factGraph([
    factFromRule(ruleSet.conventions.yearBoundary.ruleId, { id: "pillar.year", value: year, ruleSet }),
    factFromRule(ruleSet.conventions.monthBoundary.ruleId, { id: "pillar.month", value: month, ruleSet }),
    factFromRule(ruleSet.tables.dayPillarRule.ruleId, { id: "pillar.day", value: day, ruleSet }),
    factFromRule(ruleSet.conventions.hourBoundary.ruleId, { id: "pillar.hour", value: hour, ruleSet }),
    factFromRule(ruleSet.tables.hiddenStemsRule.ruleId, { id: "pillars.detail", value: pillarDetail(pillars, ruleSet), ruleSet }),
    ...luck ? [factFromRule(ruleSet.conventions.luckStart.ruleId, { id: "luck.start-age", value: luck.startAgeYears, ruleSet })] : []
  ], manifest);
  return {
    schemaVersion: "1.0.0",
    input: { ...input, timezone: zone },
    pillars,
    time: { ...utc, civilDayNumber, dayNumber, dayBoundaryMode: ruleSet.parameters.dayBoundaryMode ?? "civil-midnight", shichen: shi },
    luck,
    facts,
    manifest
  };
}

// src/compare/schools.js
var FIELD_EXTRACTORS = [
  { path: "pillars.year", get: (c) => c.pillars.year },
  { path: "pillars.month", get: (c) => c.pillars.month },
  { path: "pillars.day", get: (c) => c.pillars.day },
  { path: "pillars.hour", get: (c) => c.pillars.hour },
  { path: "luck.direction", get: (c) => c.luck?.direction ?? null },
  { path: "luck.startAgeYears", get: (c) => c.luck?.startAgeYears ?? null },
  { path: "luck.pillars", get: (c) => c.luck?.pillars ?? null },
  { path: "wuxing.dominant", get: (c) => c.wuxing?.dominant ?? null },
  { path: "wuxing.totals", get: (c) => c.wuxing?.totals ?? null }
];
var FIELD_RULES = {
  "pillars.year": "bazi.year.solar-term-boundary",
  "pillars.month": "bazi.month.jie-boundary",
  "pillars.day": "bazi.day.sexagenary-jdn",
  "pillars.hour": "bazi.hour.true-solar-time",
  "luck.direction": "bazi.luck.year-stem-polarity",
  "luck.startAgeYears": "bazi.luck.days-to-boundary-over-3",
  "luck.pillars": "bazi.luck.year-stem-polarity",
  "wuxing.dominant": "bazi.wuxing.element-count",
  "wuxing.totals": "bazi.wuxing.element-count"
};
var DIVERGENCE_RULE_ALIASES = {
  "pillars.day": ["bazi.day.sexagenary-jdn", "bazi.day.zi-chu-true-solar"],
  "luck.direction": ["bazi.luck.year-stem-polarity", "bazi.luck.gender-only"],
  "luck.pillars": ["bazi.luck.year-stem-polarity", "bazi.luck.gender-only"],
  "luck.startAgeYears": ["bazi.luck.days-to-boundary-over-3", "bazi.luck.days-to-boundary-rounded-year"],
  "wuxing.dominant": ["bazi.wuxing.element-count", "bazi.wuxing.element-weighted"],
  "wuxing.totals": ["bazi.wuxing.element-count", "bazi.wuxing.element-weighted"]
};
function resolveRuleRef(ruleSet, path) {
  const candidates = DIVERGENCE_RULE_ALIASES[path] ?? [FIELD_RULES[path]];
  for (const ruleId of candidates) {
    if (!ruleId) continue;
    const rule = findRule(ruleSet, ruleId);
    if (rule) return { ruleId, label: rule.label, source: [...rule.source], confidence: rule.confidence, evidence: rule.evidence };
  }
  return null;
}
function findRule(ruleSet, ruleId) {
  for (const group of ["conventions", "tables"]) {
    for (const entry of Object.values(ruleSet[group] ?? {})) {
      if (entry?.ruleId === ruleId) return entry;
    }
  }
  return null;
}
function sameValue(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function compareSchools(input, options = {}) {
  const ids = options.ruleSetIds ?? listRuleSets({ system: "bazi" }).map((r) => r.id);
  if (!Array.isArray(ids) || ids.length < 2) {
    throw new Error("compareSchools requires at least two rule set ids");
  }
  const seen = /* @__PURE__ */ new Set();
  for (const id of ids) {
    if (seen.has(id)) throw new Error("duplicate rule set id: " + id);
    seen.add(id);
  }
  const schools = ids.map((id) => {
    const ruleSet = getRuleSet(id);
    const chart = castBazi(input, { ...options.baseOptions, ruleSet });
    const wuxing = elementStrength(chart.pillars, ruleSet);
    return {
      ruleSetId: ruleSet.id,
      ruleSetVersion: ruleSet.version,
      ruleSetHash: ruleSet.hash,
      system: ruleSet.system ?? "bazi",
      school: ruleSet.school,
      title: ruleSet.title,
      engineCompatibility: ruleSet.engineCompatibility,
      chart,
      wuxing,
      facts: chart.facts,
      manifest: chart.manifest
    };
  });
  const divergences = [];
  const agreement = [];
  for (const { path, get } of FIELD_EXTRACTORS) {
    const values = schools.map((s) => ({ ruleSetId: s.ruleSetId, value: get({ ...s.chart, wuxing: s.wuxing }) }));
    const first = values[0].value;
    const differs = values.some((v) => !sameValue(v.value, first));
    if (!differs) {
      agreement.push(path);
      continue;
    }
    divergences.push({
      path,
      values: values.map((v) => ({ ruleSetId: v.ruleSetId, value: v.value })),
      rules: schools.map((s) => ({ ruleSetId: s.ruleSetId, rule: resolveRuleRef(getRuleSet(s.ruleSetId), path) }))
    });
  }
  return Object.freeze({
    input: Object.freeze({ ...input }),
    schools: Object.freeze(schools),
    divergences: Object.freeze(divergences),
    agreement: Object.freeze(agreement),
    fieldOrder: Object.freeze(FIELD_EXTRACTORS.map((f) => f.path)),
    elementOrder: Object.freeze([...ELEMENT_ORDER]),
    disclaimer: "\u672C\u7ED3\u679C\u5E76\u5217\u5C55\u793A\u5404\u6D41\u6D3E\u53D6\u503C\uFF0C\u4E0D\u5224\u5B9A\u5B70\u662F\u5B70\u975E\uFF0C\u4E5F\u4E0D\u5408\u5E76\u4E3A\u5355\u4E00\u7B54\u6848\u3002\u6BCF\u4E2A\u5206\u6B67\u70B9\u8BF7\u8FDE\u540C\u5176 ruleId \u4E0E source \u4E00\u5E76\u9605\u8BFB\u3002",
    defaultRuleSet: DEFAULT_BAZI_RULE_SET
  });
}

// src/interpret/explain.js
function explain(graph, claims) {
  return claims.map((c) => {
    const refs = requireFacts(graph, c.factIds || []);
    if (!refs.length) return null;
    return { ...c, evidence: refs.map((r) => r.fact_id), confidence: Math.min(...refs.map((r) => r.confidence)) };
  }).filter(Boolean);
}

// src/charts/ziwei/palace.js
function fixIndex(i, max = 12) {
  return (i % max + max) % max;
}
function stemsOf2(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return ruleSet.tables.stems.map((s) => typeof s === "string" ? s : s.name);
}
function branchesOf2(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return ruleSet.tables.branches.map((b) => typeof b === "string" ? b : b.name);
}
function branchIndexOf(branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const index = branchesOf2(ruleSet).indexOf(branch);
  if (index < 0) throw new Error("unknown branch: " + branch);
  return index;
}
function palaceIndexOf(branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return fixIndex(branchIndexOf(branch, ruleSet) - 2);
}
function palaceBranch(palaceIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return branchesOf2(ruleSet)[fixIndex(palaceIndex + 2)];
}
function timeIndexOf(trueSolarMinutes2, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const m = fixIndex(trueSolarMinutes2, 1440);
  const hour = Math.floor(m / 60);
  if (hour === (ruleSet.parameters.earlyZiHour ?? 0)) return 0;
  if (hour === (ruleSet.parameters.lateZiHour ?? 23)) return ruleSet.parameters.lateZiTimeIndex ?? 12;
  return Math.floor((hour + 1) / 2);
}
function timeBranch(timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  return branchesOf2(ruleSet)[fixIndex(timeIndex, 12)];
}
function monthIndexFor({ monthNumber, leap = false, day, timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const mode = ruleSet.parameters.leapMonthMode ?? "split-fifteen";
  let index = fixIndex(Number(monthNumber) - 1);
  if (!leap) return index;
  if (mode !== "split-fifteen") throw new Error("unknown leapMonthMode: " + mode);
  const splitDay = ruleSet.parameters.leapSplitDay ?? 15;
  const skipLateZi = ruleSet.parameters.leapFixAppliesToLateZi !== true;
  const lateZiIndex = ruleSet.parameters.lateZiTimeIndex ?? 12;
  if (day > splitDay && !(skipLateZi && timeIndex === lateZiIndex)) index = fixIndex(index + 1);
  return index;
}
function soulBodyIndex({ monthIndex, timeIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const hourBranchIndex = fixIndex(timeIndex, 12);
  return {
    soulIndex: fixIndex(monthIndex - hourBranchIndex),
    bodyIndex: fixIndex(monthIndex + hourBranchIndex),
    hourBranchIndex
  };
}
function palaceStems({ yearStem, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const stems = stemsOf2(ruleSet);
  const tigerStem = ruleSet.tables.tigerRule.table[yearStem];
  if (!tigerStem) throw new Error("unknown year stem for tiger rule: " + yearStem);
  const base = stems.indexOf(tigerStem);
  if (base < 0) throw new Error("tiger rule returned unknown stem: " + tigerStem);
  return Array.from({ length: 12 }, (_, i) => stems[fixIndex(base + i, 10)]);
}
function fiveElementsClass({ stem, branch, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const rule = ruleSet.tables.fiveElementsClassRule;
  const stemIndex = stemsOf2(ruleSet).indexOf(stem);
  const branchIndex = branchIndexOf(branch, ruleSet);
  if (stemIndex < 0) throw new Error("unknown stem: " + stem);
  const stemNumber = rule.stemNumbers[stemIndex];
  const branchNumber = rule.branchNumbers[branchIndex];
  let index = stemNumber + branchNumber;
  while (index > 5) index -= 5;
  const entry = rule.order[index - 1];
  if (!entry) throw new Error("five elements class out of range: " + index);
  return Object.freeze({ name: entry.name, element: entry.element, value: entry.value, stemNumber, branchNumber, ruleIndex: index });
}
function palaceNames({ soulIndex, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const names = palaceNameOrder(ruleSet);
  return Array.from({ length: 12 }, (_, i) => names[fixIndex(i - soulIndex, 12)]);
}
function palaceNameOrder(ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const table = ruleSet.tables.palaceNames;
  const names = Array.isArray(table) ? table : table.order;
  if (!Array.isArray(names) || names.length !== 12) throw new Error("palaceNames must provide 12 names");
  return names;
}
function palaceNameAliases(name, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)) {
  const aliases = ruleSet.tables.palaceNames?.aliases ?? {};
  return [name, ...aliases[name] ?? []];
}
function decadalLimits({
  soulIndex,
  fiveElementsValue,
  yearBranch,
  gender,
  palaceStems: stems,
  ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET)
}) {
  const rule = ruleSet.conventions.decadalDirection;
  const genderPolarity = rule.genderPolarity?.[gender];
  if (!genderPolarity) throw new Error("unknown gender: " + gender);
  const branchPolarity = fixIndex(branchIndexOf(yearBranch, ruleSet), 2) === 0 ? "\u9633" : "\u9634";
  const direction = genderPolarity === branchPolarity ? 1 : -1;
  const perLimit = ruleSet.parameters.decadalYears ?? 10;
  const limits = Array.from({ length: 12 }, (_, i) => {
    const palaceIndex = fixIndex(soulIndex + direction * i);
    const startAge = fiveElementsValue + perLimit * i;
    return Object.freeze({
      order: i,
      palaceIndex,
      branch: palaceBranch(palaceIndex, ruleSet),
      stem: stems[palaceIndex],
      startAge,
      endAge: startAge + perLimit - 1
    });
  });
  return Object.freeze({ direction, forward: direction === 1, branchPolarity, genderPolarity, perLimit, limits });
}
function xiaoxian({ yearBranch, gender, ruleSet = getRuleSet(DEFAULT_ZIWEI_RULE_SET) }) {
  const rule = ruleSet.conventions.xiaoxian;
  const startBranch = rule.table[yearBranch];
  if (!startBranch) throw new Error("unknown year branch for xiaoxian: " + yearBranch);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  const direction = rule.direction?.[gender];
  if (!direction) throw new Error("unknown gender: " + gender);
  const perCycle = ruleSet.parameters.xiaoxianCycleYears ?? 12;
  const cycles = ruleSet.parameters.xiaoxianCycles ?? 10;
  const ages = Array.from({ length: 12 }, () => []);
  for (let i = 0; i < 12; i++) {
    const palaceIndex = fixIndex(startIndex + direction * i);
    ages[palaceIndex] = Array.from({ length: cycles }, (_, j) => i + 1 + perCycle * j);
  }
  return Object.freeze({
    startBranch,
    startIndex,
    direction,
    perCycle,
    ages: Object.freeze(ages.map((a) => Object.freeze(a)))
  });
}

// src/charts/ziwei/stars.js
var RULE_SET2 = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);
function ziweiTianfuIndex({ lunarDay, monthDays, timeIndex, fiveElementsValue, ruleSet = RULE_SET2() }) {
  const params = ruleSet.parameters;
  const lateZiIndex = params.lateZiTimeIndex ?? 12;
  const dayDivide = params.lateZiDayMode ?? "next-day";
  let day = Number(lunarDay);
  if (timeIndex === lateZiIndex && dayDivide === "next-day") day += 1;
  if (day > monthDays) day -= monthDays;
  const divisorBase = Number(fiveElementsValue);
  if (!Number.isInteger(divisorBase) || divisorBase <= 0) throw new Error("invalid five elements value: " + fiveElementsValue);
  let offset = -1;
  let quotient = 0;
  let remainder = 1;
  while (remainder !== 0) {
    offset += 1;
    const divisor = day + offset;
    quotient = Math.floor(divisor / divisorBase);
    remainder = divisor % divisorBase;
    if (offset > 12 * divisorBase + 12) throw new Error("failed to locate ziwei star");
  }
  quotient %= 12;
  let ziweiIndex = quotient - 1;
  ziweiIndex = offset % 2 === 0 ? ziweiIndex + offset : ziweiIndex - offset;
  ziweiIndex = fixIndex(ziweiIndex);
  const mirrorSum = ruleSet.tables.majorStarRule.mirrorSum ?? 12;
  return { ziweiIndex, tianfuIndex: fixIndex(mirrorSum - ziweiIndex), day, offset, quotient };
}
function majorStars({ ziweiIndex, tianfuIndex, ruleSet = RULE_SET2() }) {
  const rule = ruleSet.tables.majorStarRule;
  const out = [];
  rule.ziweiSeries.forEach((name, i) => {
    if (!name) return;
    out.push({ name, palaceIndex: fixIndex(ziweiIndex + rule.ziweiDirection * i), tier: "major", series: "ziwei", order: i });
  });
  rule.tianfuSeries.forEach((name, i) => {
    if (!name) return;
    out.push({ name, palaceIndex: fixIndex(tianfuIndex + rule.tianfuDirection * i), tier: "major", series: "tianfu", order: i });
  });
  return out;
}
function auxiliaryStars({
  yearStem,
  yearBranch,
  monthIndex,
  timeIndex,
  ruleSet = RULE_SET2()
}) {
  const t = ruleSet.tables;
  const out = [];
  const push = (name, palaceIndex, group, ruleId) => out.push({ name, palaceIndex: fixIndex(palaceIndex), tier: "auxiliary", group, ruleId });
  const lucunBranch = t.lucunRule.table[yearStem];
  if (!lucunBranch) throw new Error("unknown year stem for lucun: " + yearStem);
  const lucunIndex = palaceIndexOf(lucunBranch, ruleSet);
  push("\u7984\u5B58", lucunIndex, "lu-ma", t.lucunRule.ruleId);
  push("\u64CE\u7F8A", lucunIndex + t.lucunRule.yangOffset, "sha", t.lucunRule.ruleId);
  push("\u9640\u7F57", lucunIndex + t.lucunRule.tuoOffset, "sha", t.lucunRule.ruleId);
  const tianmaBranch = t.tianmaRule.table[yearBranch];
  if (!tianmaBranch) throw new Error("unknown year branch for tianma: " + yearBranch);
  push("\u5929\u9A6C", palaceIndexOf(tianmaBranch, ruleSet), "lu-ma", t.tianmaRule.ruleId);
  const kuiyue = t.kuiyueRule.table[yearStem];
  if (!kuiyue) throw new Error("unknown year stem for kuiyue: " + yearStem);
  push("\u5929\u9B41", palaceIndexOf(kuiyue[0], ruleSet), "ji", t.kuiyueRule.ruleId);
  push("\u5929\u94BA", palaceIndexOf(kuiyue[1], ruleSet), "ji", t.kuiyueRule.ruleId);
  const zuoBase = palaceIndexOf(t.zuoyouRule.zuoBase, ruleSet);
  const youBase = palaceIndexOf(t.zuoyouRule.youBase, ruleSet);
  push("\u5DE6\u8F85", zuoBase + t.zuoyouRule.zuoDirection * monthIndex, "ji", t.zuoyouRule.ruleId);
  push("\u53F3\u5F3C", youBase + t.zuoyouRule.youDirection * monthIndex, "ji", t.zuoyouRule.ruleId);
  const hourBranch = fixIndex(timeIndex, 12);
  const changBase = palaceIndexOf(t.wenchangWenquRule.changBase, ruleSet);
  const quBase = palaceIndexOf(t.wenchangWenquRule.quBase, ruleSet);
  push("\u6587\u660C", changBase + t.wenchangWenquRule.changDirection * hourBranch, "ji", t.wenchangWenquRule.ruleId);
  push("\u6587\u66F2", quBase + t.wenchangWenquRule.quDirection * hourBranch, "ji", t.wenchangWenquRule.ruleId);
  const kongBase = palaceIndexOf(t.dikongDijieRule.base, ruleSet);
  push("\u5730\u52AB", kongBase + t.dikongDijieRule.jieDirection * hourBranch, "sha", t.dikongDijieRule.ruleId);
  push("\u5730\u7A7A", kongBase + t.dikongDijieRule.kongDirection * hourBranch, "sha", t.dikongDijieRule.ruleId);
  const huoling = t.huolingRule.table[yearBranch];
  if (!huoling) throw new Error("unknown year branch for huoling: " + yearBranch);
  push("\u706B\u661F", palaceIndexOf(huoling[0], ruleSet) + hourBranch, "sha", t.huolingRule.ruleId);
  push("\u94C3\u661F", palaceIndexOf(huoling[1], ruleSet) + hourBranch, "sha", t.huolingRule.ruleId);
  return out;
}
function mutagen({ yearStem, stars, ruleSet = RULE_SET2() }) {
  const rule = ruleSet.tables.mutagenRule;
  const names = rule.table[yearStem];
  if (!names) throw new Error("unknown year stem for mutagen: " + yearStem);
  const byName = new Map(stars.map((s) => [s.name, s]));
  return rule.order.map((mutagenName, i) => {
    const starName = names[i];
    const star = byName.get(starName);
    if (!star) throw new Error("mutagen star not placed on chart: " + starName + " (" + yearStem + mutagenName + ")");
    return Object.freeze({
      name: starName,
      mutagen: mutagenName,
      palaceIndex: star.palaceIndex,
      branch: palaceBranch(star.palaceIndex, ruleSet),
      ruleId: rule.ruleId
    });
  });
}
function starsByPalace(stars, ruleSet = RULE_SET2()) {
  const order = ruleSet.tables.starOrder?.order ?? [];
  const rank = new Map(order.map((name, i) => [name, i]));
  const palaces = Array.from({ length: 12 }, (_, i) => ({ palaceIndex: i, branch: palaceBranch(i, ruleSet), stars: [] }));
  for (const star of stars) palaces[fixIndex(star.palaceIndex)].stars.push(star);
  for (const palace of palaces) {
    palace.stars.sort((a, b) => (rank.get(a.name) ?? 99) - (rank.get(b.name) ?? 99));
  }
  return palaces;
}

// src/charts/ziwei/minor-stars.js
var RULE_SET3 = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);
function palaceOfStar(name, stars) {
  const star = stars.find((s) => s.name === name);
  if (!star) throw new Error("minor star depends on an unplaced star: " + name);
  return fixIndex(star.palaceIndex);
}
function minorStars({
  yearStem,
  yearBranch,
  monthIndex,
  timeIndex,
  lunarDay,
  soulIndex,
  bodyIndex,
  stars = [],
  ruleSet = RULE_SET3()
}) {
  const t = ruleSet.tables;
  const out = [];
  const push = (name, palaceIndex, group, ruleId) => out.push(Object.freeze({
    name,
    palaceIndex: fixIndex(palaceIndex),
    tier: "minor",
    group,
    ruleId
  }));
  const branchIndex = branchIndexOf(yearBranch, ruleSet);
  const stemIndex = stemsOf2(ruleSet).indexOf(yearStem);
  if (stemIndex < 0) throw new Error("unknown year stem: " + yearStem);
  const hourBranchIndex = fixIndex(timeIndex, 12);
  const y = t.yearMinorRule;
  if (y) {
    const hx = y.huagaiXianchi[yearBranch];
    const gg = y.guchenGuasu[yearBranch];
    if (!hx || !gg) throw new Error("unknown year branch for year minor stars: " + yearBranch);
    push("\u534E\u76D6", palaceIndexOf(hx[0], ruleSet), "year", y.ruleId);
    push("\u54B8\u6C60", palaceIndexOf(hx[1], ruleSet), "year", y.ruleId);
    push("\u5B64\u8FB0", palaceIndexOf(gg[0], ruleSet), "year", y.ruleId);
    push("\u5BE1\u5BBF", palaceIndexOf(gg[1], ruleSet), "year", y.ruleId);
    push("\u5929\u624D", soulIndex + branchIndex, "year", y.ruleId);
    push("\u5929\u5BFF", bodyIndex + branchIndex, "year", y.ruleId);
    push("\u5929\u53A8", palaceIndexOf(y.tianchuByStem[stemIndex], ruleSet), "year", y.ruleId);
    push("\u7834\u788E", palaceIndexOf(y.posuiByBranchMod3[branchIndex % 3], ruleSet), "year", y.ruleId);
    push("\u871A\u5EC9", palaceIndexOf(y.feilianByBranch[branchIndex], ruleSet), "year", y.ruleId);
    push("\u9F99\u6C60", palaceIndexOf(y.bases.longchi, ruleSet) + branchIndex, "year", y.ruleId);
    push("\u51E4\u9601", palaceIndexOf(y.bases.fengge, ruleSet) - branchIndex, "year", y.ruleId);
    push("\u5929\u54ED", palaceIndexOf(y.bases.tianku, ruleSet) - branchIndex, "year", y.ruleId);
    push("\u5929\u865A", palaceIndexOf(y.bases.tianxu, ruleSet) + branchIndex, "year", y.ruleId);
    push("\u5929\u5B98", palaceIndexOf(y.tianguanByStem[stemIndex], ruleSet), "year", y.ruleId);
    push("\u5929\u798F", palaceIndexOf(y.tianfuByStem[stemIndex], ruleSet), "year", y.ruleId);
    push("\u5929\u5FB7", palaceIndexOf(y.bases.tiande, ruleSet) + branchIndex, "year", y.ruleId);
    push("\u6708\u5FB7", palaceIndexOf(y.bases.yuede, ruleSet) + branchIndex, "year", y.ruleId);
    push("\u5929\u7A7A", palaceIndexOf(yearBranch, ruleSet) + y.tiankongOffset, "year", y.ruleId);
    push("\u622A\u8DEF", palaceIndexOf(y.jieluByStemMod5[stemIndex % 5], ruleSet), "year", y.ruleId);
    push("\u7A7A\u4EA1", palaceIndexOf(y.kongwangByStemMod5[stemIndex % 5], ruleSet), "year", y.ruleId);
    let xunkong = palaceIndexOf(yearBranch, ruleSet) + stemsOf2(ruleSet).indexOf(y.xunkongAnchorStem) - stemIndex + 1;
    xunkong = fixIndex(xunkong);
    if (branchIndex % 2 !== xunkong % 2) xunkong = fixIndex(xunkong + 1);
    push("\u65EC\u7A7A", xunkong, "year", y.ruleId);
    push("\u5E74\u89E3", palaceIndexOf(y.nianjieByBranch[branchIndex], ruleSet), "year", y.ruleId);
    push("\u5929\u4F24", soulIndex + y.tianShangPalaceOffset, "year", y.ruleId);
    push("\u5929\u4F7F", soulIndex + y.tianShiPalaceOffset, "year", y.ruleId);
  }
  const m = t.monthMinorRule;
  if (m) {
    push("\u89E3\u795E", palaceIndexOf(m.yuejieByMonthHalf[Math.floor(monthIndex / 2)], ruleSet), "month", m.ruleId);
    push("\u5929\u59DA", palaceIndexOf(m.tianyaoBase, ruleSet) + monthIndex, "month", m.ruleId);
    push("\u5929\u5211", palaceIndexOf(m.tianxingBase, ruleSet) + monthIndex, "month", m.ruleId);
    push("\u9634\u715E", palaceIndexOf(m.yinshaByMonthMod6[monthIndex % 6], ruleSet), "month", m.ruleId);
    push("\u5929\u6708", palaceIndexOf(m.tianyueByMonth[monthIndex], ruleSet), "month", m.ruleId);
    push("\u5929\u5DEB", palaceIndexOf(m.tianwuByMonthMod4[monthIndex % 4], ruleSet), "month", m.ruleId);
  }
  const d = t.dayMinorRule;
  if (d) {
    const dayIndex = timeIndex === (ruleSet.parameters.lateZiTimeIndex ?? 12) ? Number(lunarDay) + d.dayIndexLateZiOffset : Number(lunarDay) + d.dayIndexOtherOffset;
    push("\u4E09\u53F0", palaceOfStar(d.santaiFrom === "zuofu" ? "\u5DE6\u8F85" : d.santaiFrom, stars) + dayIndex, "day", d.ruleId);
    push("\u516B\u5EA7", palaceOfStar(d.bazuoFrom === "youbi" ? "\u53F3\u5F3C" : d.bazuoFrom, stars) - dayIndex, "day", d.ruleId);
    push("\u6069\u5149", palaceOfStar(d.enguangFrom === "wenchang" ? "\u6587\u660C" : d.enguangFrom, stars) + dayIndex + d.enguangOffset, "day", d.ruleId);
    push("\u5929\u8D35", palaceOfStar(d.tianguiFrom === "wenqu" ? "\u6587\u66F2" : d.tianguiFrom, stars) + dayIndex + d.tianguiOffset, "day", d.ruleId);
  }
  const h = t.hourMinorRule;
  if (h) {
    push("\u53F0\u8F85", palaceIndexOf(h.taifuBase, ruleSet) + h.direction * hourBranchIndex, "hour", h.ruleId);
    push("\u5C01\u8BF0", palaceIndexOf(h.fenggaoBase, ruleSet) + h.direction * hourBranchIndex, "hour", h.ruleId);
  }
  const lx = t.hongluanTianxiRule;
  if (lx) {
    const hongluan = palaceIndexOf(lx.hongluanBase, ruleSet) + lx.direction * branchIndex;
    push("\u7EA2\u9E3E", hongluan, "year", lx.ruleId);
    push("\u5929\u559C", hongluan + lx.tianxiOffset, "year", lx.ruleId);
  }
  return out;
}
function soulBodyMaster({ soulBranch, yearBranch, ruleSet = RULE_SET3() }) {
  const rule = ruleSet.tables.soulBodyMasterRule;
  if (!rule) return null;
  const soulEntry = rule.table[soulBranch];
  const bodyEntry = rule.table[yearBranch];
  if (!soulEntry || !bodyEntry) throw new Error("unknown branch for soul/body master: " + soulBranch + "/" + yearBranch);
  return Object.freeze({
    soulMaster: soulEntry[0],
    bodyMaster: bodyEntry[1],
    soulBranch,
    yearBranch,
    ruleId: rule.ruleId
  });
}

// src/charts/ziwei/twelve-gods.js
var RULE_SET4 = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);
function directionOf({ gender, yearBranch, rule, ruleSet }) {
  const genderPolarity = rule.genderPolarity?.[gender];
  if (!genderPolarity) throw new Error("unknown gender: " + gender);
  const branchIndex = branchIndexOf(yearBranch, ruleSet);
  const branchPolarity = branchIndex % 2 === 0 ? rule.branchPolarity.even : rule.branchPolarity.odd;
  const direction = genderPolarity === branchPolarity ? rule.direction.same : rule.direction.opposite;
  return { direction, genderPolarity, branchPolarity };
}
function spread({ startIndex, order, direction }) {
  const gods = Array.from({ length: 12 }, () => null);
  order.forEach((name, i) => {
    gods[fixIndex(startIndex + direction * i)] = name;
  });
  return Object.freeze(gods);
}
function changsheng12({ fiveElementsValue, yearBranch, gender, ruleSet = RULE_SET4() }) {
  const rule = ruleSet.tables.changshengRule;
  if (!rule) return null;
  const startBranch = rule.startByClass[fiveElementsValue];
  if (!startBranch) throw new Error("unknown five elements class for changsheng12: " + fiveElementsValue);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  const { direction, genderPolarity, branchPolarity } = directionOf({ gender, yearBranch, rule, ruleSet });
  return Object.freeze({
    startBranch,
    startIndex,
    direction,
    genderPolarity,
    branchPolarity,
    order: rule.order,
    gods: spread({ startIndex, order: rule.order, direction })
  });
}
function boshi12({ stars, yearBranch, gender, ruleSet = RULE_SET4() }) {
  const rule = ruleSet.tables.boshiRule;
  if (!rule) return null;
  const lucun = stars.find((s) => s.name === rule.startFrom);
  if (!lucun) throw new Error("boshi12 depends on an unplaced star: " + rule.startFrom);
  const startIndex = fixIndex(lucun.palaceIndex);
  const { direction, genderPolarity, branchPolarity } = directionOf({ gender, yearBranch, rule, ruleSet });
  return Object.freeze({
    startFrom: rule.startFrom,
    startIndex,
    direction,
    genderPolarity,
    branchPolarity,
    order: rule.order,
    gods: spread({ startIndex, order: rule.order, direction })
  });
}
function jiangqian12({ yearBranch, ruleSet = RULE_SET4() }) {
  const rule = ruleSet.tables.jiangqianRule;
  if (!rule) return null;
  const startBranch = rule.startTable[yearBranch];
  if (!startBranch) throw new Error("unknown year branch for jiangqian12: " + yearBranch);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  return Object.freeze({
    startBranch,
    startIndex,
    direction: rule.direction,
    order: rule.order,
    gods: spread({ startIndex, order: rule.order, direction: rule.direction })
  });
}
function suiqian12({ yearBranch, ruleSet = RULE_SET4() }) {
  const rule = ruleSet.tables.suiqianRule;
  if (!rule) return null;
  const startIndex = palaceIndexOf(yearBranch, ruleSet);
  return Object.freeze({
    startBranch: yearBranch,
    startIndex,
    direction: rule.direction,
    order: rule.order,
    gods: spread({ startIndex, order: rule.order, direction: rule.direction })
  });
}
function twelveGods({ fiveElementsValue, yearBranch, gender, stars = [], ruleSet = RULE_SET4() }) {
  return Object.freeze({
    changsheng: gender ? changsheng12({ fiveElementsValue, yearBranch, gender, ruleSet }) : null,
    boshi: gender ? boshi12({ stars, yearBranch, gender, ruleSet }) : null,
    jiangqian: jiangqian12({ yearBranch, ruleSet }),
    suiqian: suiqian12({ yearBranch, ruleSet })
  });
}

// src/calendar/lunar.js
var CHINA_OFFSET_DAYS = 8 / 24;
function chinaCivilDateNumber(jd) {
  const d = dateFromJulianDay(jd + CHINA_OFFSET_DAYS);
  return julianDayFromGregorian(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}
function newMoonCivilAnchors(startJd, endJd) {
  const startYear = dateFromJulianDay(startJd + CHINA_OFFSET_DAYS).getUTCFullYear();
  const out = [];
  const base = Math.floor((startYear - 2e3) * 12.3685);
  for (let k = base - 3; k < base + 40; k++) {
    const jd = moonPhaseJDE(k, 0);
    if (!Number.isFinite(jd)) continue;
    const day = chinaCivilDateNumber(jd);
    if (day >= startJd - 35 && day <= endJd + 35) out.push({ k, jd, day });
  }
  const unique = new Map(out.map((a) => [a.day, a]));
  return [...unique.values()].sort((a, b) => a.day - b.day);
}
function zhongqiTermsBetween(startDay, endDay) {
  const y = dateFromJulianDay(startDay + CHINA_OFFSET_DAYS).getUTCFullYear();
  const terms = [];
  for (const yy of [y - 1, y, y + 1, y + 2]) {
    for (const t of solarTermsOfYear(yy)) {
      if (t.degree % 30 !== 0) continue;
      const civilDay = chinaCivilDateNumber(t.utc);
      if (civilDay >= startDay && civilDay < endDay) terms.push({ ...t, civilDay });
    }
  }
  const unique = new Map(terms.map((t) => [t.degree + ":" + t.civilDay, t]));
  return [...unique.values()].sort((a, b) => a.utc - b.utc);
}
function numberedMonthsCovering(startJd, endJd) {
  const anchors = newMoonCivilAnchors(startJd, endJd);
  if (anchors.length < 2) throw new Error("insufficient new moon anchors");
  const months = anchors.slice(0, -1).map((a, i) => {
    const endJd2 = anchors[i + 1].day;
    const zhongqi = zhongqiTermsBetween(a.day, anchors[i + 1].day);
    return {
      jd: a.day,
      newMoonJd: a.jd,
      endJd: endJd2,
      zhongqiDegrees: zhongqi.map((t) => t.degree),
      hasZhongqi: zhongqi.length > 0
    };
  });
  const anchorIndex = months.findIndex((m) => m.zhongqiDegrees.includes(270));
  if (anchorIndex < 0) throw new Error("cannot locate winter solstice month");
  const result = months.map((m) => ({ ...m }));
  result[anchorIndex].monthNumber = 11;
  result[anchorIndex].leap = false;
  result[anchorIndex].isSolsticeMonth = true;
  for (let i = anchorIndex + 1; i < result.length; i++) {
    const leap = !result[i].hasZhongqi && !result[i - 1].leap;
    const prev = result[i - 1].monthNumber;
    result[i].leap = leap;
    result[i].monthNumber = leap ? prev : prev % 12 + 1;
  }
  const previousNumber = (n) => (n - 2 + 12) % 12 + 1;
  for (let i = anchorIndex - 1; i >= 0; i--) {
    const next = result[i + 1];
    const leap = !result[i].hasZhongqi && !next.leap;
    result[i].leap = leap;
    result[i].monthNumber = next.leap ? next.monthNumber : previousNumber(next.monthNumber);
  }
  return result;
}
function numberedLunarMonths(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return numberedMonthsCovering(start, end).filter((m) => m.jd >= start && m.jd < end).map((m) => ({ ...m, leapCandidate: !m.hasZhongqi }));
}
function lunarMonthAnchors(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return newMoonCivilAnchors(start, end).map((a) => ({ k: a.k, jd: a.jd, day: a.day }));
}
function lunarDayFromNewMoon(jd, anchorJd) {
  return Math.round(chinaCivilDateNumber(jd) - chinaCivilDateNumber(anchorJd)) + 1;
}
function monthHasZhongqi(startJd, endJd) {
  return zhongqiTermsBetween(chinaCivilDateNumber(startJd), chinaCivilDateNumber(endJd)).length > 0;
}
function annotateLunarMonths(year) {
  const start = julianDayFromGregorian(year, 1, 1);
  const end = julianDayFromGregorian(year + 1, 1, 1);
  return numberedMonthsCovering(start, end).filter((m) => m.jd >= start && m.jd < end).map((m) => ({ ...m, leapCandidate: !m.hasZhongqi }));
}
function lunarYearOf(year, month, day) {
  const jd = julianDayFromGregorian(year, month, day);
  const months = numberedMonthsCovering(jd - 400, jd + 400);
  const found = months.find((m) => jd >= m.jd && jd < m.endJd);
  if (!found) return null;
  const newYearMonth = [...months].reverse().find((m) => m.monthNumber === 1 && !m.leap && m.jd <= jd);
  if (!newYearMonth) return null;
  const lunarYear = dateFromJulianDay(newYearMonth.jd + CHINA_OFFSET_DAYS).getUTCFullYear();
  const stems = ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"];
  const branches = ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"];
  const offset = ((lunarYear - 4) % 60 + 60) % 60;
  return {
    lunarYear,
    stem: stems[offset % 10],
    branch: branches[offset % 12],
    ganzhi: stems[offset % 10] + branches[offset % 12],
    monthNumber: found.monthNumber,
    leap: found.leap,
    day: jd - found.jd + 1,
    days: found.endJd - found.jd,
    monthStartJd: found.jd,
    endJd: found.endJd
  };
}
function lunarDateOf(year, month, day) {
  const jd = julianDayFromGregorian(year, month, day);
  const months = numberedMonthsCovering(jd - 200, jd + 200);
  const found = months.find((m) => jd >= m.jd && jd < m.endJd);
  if (!found) return null;
  return {
    monthNumber: found.monthNumber,
    leap: found.leap,
    day: jd - found.jd + 1,
    // 本月共几日：起紫微星时「晚子进一日」可能越过月末，需要回落到下月初一，
    // 因此月长是必需量，不是展示用的附加信息。
    days: found.endJd - found.jd,
    hasZhongqi: found.hasZhongqi,
    monthStartJd: found.jd,
    endJd: found.endJd,
    newMoonJd: found.newMoonJd
  };
}

// src/charts/ziwei/chart.js
var MINOR_RULE_KEYS = ["yearMinorRule", "monthMinorRule", "dayMinorRule", "hourMinorRule", "hongluanTianxiRule"];
function castZiwei(input, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet(options.ruleSetId ?? DEFAULT_ZIWEI_RULE_SET);
  const zone = input.timezone ?? "Asia/Shanghai";
  const longitude = input.longitude ?? 120;
  const utc = civilToUTC(input, zone);
  const shi = shichenOfCivil(input, longitude, {
    timePrecision: input.timePrecision ?? "exact",
    timezone: zone,
    equationOfTimeMinutes: options.equationOfTimeMinutes
  });
  const timeIndex = timeIndexOf(shi.trueSolarMinutes, ruleSet);
  const hourBranch = timeBranch(timeIndex, ruleSet);
  const lunar = lunarDateOf(input.year, input.month, input.day);
  if (!lunar) throw new Error("cannot resolve lunar date for input");
  const lunarYear = lunarYearOf(input.year, input.month, input.day);
  if (!lunarYear) throw new Error("cannot resolve lunar year for input");
  const monthIndex = monthIndexFor({
    monthNumber: lunar.monthNumber,
    leap: lunar.leap,
    day: lunar.day,
    timeIndex,
    ruleSet
  });
  const { soulIndex, bodyIndex } = soulBodyIndex({ monthIndex, timeIndex, ruleSet });
  const stems = palaceStems({ yearStem: lunarYear.stem, ruleSet });
  const branches = Array.from({ length: 12 }, (_, i) => palaceBranch(i, ruleSet));
  const soulStem = stems[soulIndex];
  const soulBranch = branches[soulIndex];
  const bodyBranch = branches[bodyIndex];
  const fiveElements = fiveElementsClass({ stem: soulStem, branch: soulBranch, ruleSet });
  const names = palaceNames({ soulIndex, ruleSet });
  const { ziweiIndex, tianfuIndex } = ziweiTianfuIndex({
    lunarDay: lunar.day,
    monthDays: lunar.days,
    timeIndex,
    fiveElementsValue: fiveElements.value,
    ruleSet
  });
  const majors = majorStars({ ziweiIndex, tianfuIndex, ruleSet });
  const auxiliaries = auxiliaryStars({ yearStem: lunarYear.stem, yearBranch: lunarYear.branch, monthIndex, timeIndex, ruleSet });
  const skeletal = [...majors, ...auxiliaries];
  const minors = minorStars({
    yearStem: lunarYear.stem,
    yearBranch: lunarYear.branch,
    monthIndex,
    timeIndex,
    lunarDay: lunar.day,
    soulIndex,
    bodyIndex,
    stars: skeletal,
    ruleSet
  });
  const stars = [...skeletal, ...minors];
  const mutagens = mutagen({ yearStem: lunarYear.stem, stars, ruleSet });
  const grouped = starsByPalace(stars, ruleSet);
  const masters = soulBodyMaster({ soulBranch, yearBranch: lunarYear.branch, ruleSet });
  const gods = twelveGods({
    fiveElementsValue: fiveElements.value,
    yearBranch: lunarYear.branch,
    gender: input.gender,
    stars,
    ruleSet
  });
  const limits = input.gender ? decadalLimits({
    soulIndex,
    fiveElementsValue: fiveElements.value,
    yearBranch: lunarYear.branch,
    gender: input.gender,
    palaceStems: stems,
    ruleSet
  }) : null;
  const xiaoxianResult = input.gender ? xiaoxian({ yearBranch: lunarYear.branch, gender: input.gender, ruleSet }) : null;
  const palaces = grouped.map((p, i) => ({
    palaceIndex: i,
    branch: branches[i],
    stem: stems[i],
    name: names[i],
    isSoulPalace: i === soulIndex,
    isBodyPalace: i === bodyIndex,
    stars: Object.freeze(p.stars.map((s) => Object.freeze({ ...s }))),
    starNames: Object.freeze(p.stars.map((s) => s.name)),
    majorStars: Object.freeze(p.stars.filter((s) => s.tier === "major").map((s) => s.name)),
    auxiliaryStars: Object.freeze(p.stars.filter((s) => s.tier === "auxiliary").map((s) => s.name)),
    minorStars: Object.freeze(p.stars.filter((s) => s.tier === "minor").map((s) => s.name)),
    mutagens: Object.freeze(mutagens.filter((m) => m.palaceIndex === i).map((m) => m.mutagen)),
    changsheng12: gods.changsheng ? gods.changsheng.gods[i] : null,
    boshi12: gods.boshi ? gods.boshi.gods[i] : null,
    jiangqian12: gods.jiangqian ? gods.jiangqian.gods[i] : null,
    suiqian12: gods.suiqian ? gods.suiqian.gods[i] : null,
    decadal: limits ? limits.limits.find((l) => l.palaceIndex === i) ?? null : null,
    xiaoxianAges: xiaoxianResult ? xiaoxianResult.ages[i] : null
  }));
  const manifest = createManifest({
    timezone: zone,
    longitude,
    ruleSetId: ruleSet.id,
    ruleSetVersion: ruleSet.version
  });
  const facts = factGraph([
    factFromRule(ruleSet.conventions.yearBoundary.ruleId, { id: "ziwei.year", value: lunarYear.ganzhi, ruleSet }),
    factFromRule(ruleSet.conventions.timeIndex.ruleId, {
      id: "ziwei.time-index",
      value: timeIndex,
      ruleSet,
      extra: { trueSolarMinutes: shi.trueSolarMinutes, branch: hourBranch }
    }),
    factFromRule(ruleSet.conventions.monthIndex.ruleId, {
      id: "ziwei.month-index",
      value: monthIndex,
      ruleSet,
      extra: { lunarMonth: lunar.monthNumber, leap: lunar.leap, lunarDay: lunar.day }
    }),
    factFromRule(ruleSet.conventions.lateZiDay.ruleId, {
      id: "ziwei.late-zi-day",
      value: timeIndex === 12 ? lunar.day + 1 : lunar.day,
      ruleSet,
      extra: { lunarDay: lunar.day, monthDays: lunar.days }
    }),
    factFromRule(ruleSet.conventions.soulBody.ruleId, {
      id: "ziwei.soul-body",
      value: { soul: soulBranch, body: bodyBranch },
      ruleSet,
      extra: { soulIndex, bodyIndex }
    }),
    factFromRule(ruleSet.tables.tigerRule.ruleId, {
      id: "ziwei.palace-stems",
      value: stems,
      ruleSet,
      extra: { tigerStem: ruleSet.tables.tigerRule.table[lunarYear.stem] }
    }),
    factFromRule(ruleSet.tables.fiveElementsClassRule.ruleId, {
      id: "ziwei.five-elements",
      value: fiveElements.name,
      ruleSet,
      extra: { soulStem, soulBranch, value: fiveElements.value, element: fiveElements.element }
    }),
    factFromRule(ruleSet.conventions.palaceNaming.ruleId, { id: "ziwei.palace-names", value: names, ruleSet }),
    factFromRule(ruleSet.tables.ziweiPositionRule.ruleId, {
      id: "ziwei.ziwei-position",
      value: { ziwei: branches[ziweiIndex], tianfu: branches[tianfuIndex] },
      ruleSet,
      extra: { ziweiIndex, tianfuIndex }
    }),
    factFromRule(ruleSet.tables.majorStarRule.ruleId, { id: "ziwei.major-stars", value: majors.map((s) => s.name), ruleSet }),
    ...["lucunRule", "tianmaRule", "kuiyueRule", "zuoyouRule", "wenchangWenquRule", "dikongDijieRule", "huolingRule"].map((key) => factFromRule(ruleSet.tables[key].ruleId, { id: "ziwei." + key, value: auxiliaries.filter((s) => s.ruleId === ruleSet.tables[key].ruleId).map((s) => s.name), ruleSet })),
    factFromRule(ruleSet.tables.mutagenRule.ruleId, { id: "ziwei.mutagen", value: mutagens.map((m) => m.name + m.mutagen), ruleSet }),
    // 杂曜按「年/月/日/时/红鸾天喜」五组分别成事实，一组算错只影响一条事实，
    // 不会让整张杂曜表看起来都对。
    ...MINOR_RULE_KEYS.filter((key) => ruleSet.tables[key]).map((key) => factFromRule(ruleSet.tables[key].ruleId, {
      id: "ziwei." + key,
      value: minors.filter((s) => s.ruleId === ruleSet.tables[key].ruleId).map((s) => s.name + "@" + branches[s.palaceIndex]),
      ruleSet
    })),
    ...masters ? [factFromRule(ruleSet.tables.soulBodyMasterRule.ruleId, {
      id: "ziwei.soul-body-master",
      value: { soul: masters.soulMaster, body: masters.bodyMaster },
      ruleSet,
      extra: { soulBranch, yearBranch: lunarYear.branch }
    })] : [],
    // 十二神：长生与博士的顺逆随性别，未给性别时这两条事实不生成（宁缺勿造）。
    ...gods.changsheng ? [factFromRule(ruleSet.tables.changshengRule.ruleId, {
      id: "ziwei.changsheng12",
      value: gods.changsheng.gods,
      ruleSet,
      extra: { startBranch: gods.changsheng.startBranch, direction: gods.changsheng.direction }
    })] : [],
    ...gods.boshi ? [factFromRule(ruleSet.tables.boshiRule.ruleId, {
      id: "ziwei.boshi12",
      value: gods.boshi.gods,
      ruleSet,
      extra: { startFrom: gods.boshi.startFrom, direction: gods.boshi.direction }
    })] : [],
    ...gods.jiangqian ? [factFromRule(ruleSet.tables.jiangqianRule.ruleId, {
      id: "ziwei.jiangqian12",
      value: gods.jiangqian.gods,
      ruleSet,
      extra: { startBranch: gods.jiangqian.startBranch, direction: gods.jiangqian.direction }
    })] : [],
    ...gods.suiqian ? [factFromRule(ruleSet.tables.suiqianRule.ruleId, {
      id: "ziwei.suiqian12",
      value: gods.suiqian.gods,
      ruleSet,
      extra: { startBranch: gods.suiqian.startBranch, direction: gods.suiqian.direction }
    })] : [],
    ...limits ? [
      factFromRule(ruleSet.conventions.decadalDirection.ruleId, {
        id: "ziwei.decadal-direction",
        value: limits.direction,
        ruleSet,
        extra: { branchPolarity: limits.branchPolarity, genderPolarity: limits.genderPolarity }
      }),
      factFromRule(ruleSet.conventions.decadalStart.ruleId, { id: "ziwei.decadal-start", value: fiveElements.value, ruleSet }),
      factFromRule(ruleSet.conventions.xiaoxian.ruleId, {
        id: "ziwei.xiaoxian",
        value: xiaoxianResult.startBranch,
        ruleSet,
        extra: { direction: xiaoxianResult.direction }
      })
    ] : []
  ], manifest);
  return {
    schemaVersion: "1.0.0",
    kind: "ziwei",
    input: { ...input, timezone: zone },
    time: { ...utc, trueSolarMinutes: shi.trueSolarMinutes, timeIndex, hourBranch, shichen: shi },
    lunar: Object.freeze({
      year: lunarYear.lunarYear,
      stem: lunarYear.stem,
      branch: lunarYear.branch,
      ganzhi: lunarYear.ganzhi,
      monthNumber: lunar.monthNumber,
      leap: lunar.leap,
      day: lunar.day,
      days: lunar.days,
      monthIndex
    }),
    soul: Object.freeze({ palaceIndex: soulIndex, branch: soulBranch, stem: soulStem }),
    body: Object.freeze({ palaceIndex: bodyIndex, branch: bodyBranch }),
    fiveElements,
    masters,
    palaces: Object.freeze(palaces),
    stars: Object.freeze(stars.map((s) => Object.freeze({ ...s, branch: branches[s.palaceIndex], palaceName: names[s.palaceIndex] }))),
    twelveGods: gods,
    mutagens: Object.freeze(mutagens),
    decadal: limits,
    xiaoxian: xiaoxianResult,
    facts,
    manifest
  };
}

// src/calendar/lunar-facts.js
function lunarMonthFacts(year, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const months = numberedLunarMonths(year);
  const facts = [];
  for (const m of months) {
    const label = (m.leap ? "leap-" : "") + m.monthNumber;
    facts.push(factFromRule(ruleSet.conventions.lunarMonthNumbering.ruleId, {
      id: "lunar.month." + label,
      value: m,
      ruleSet
    }));
    if (m.leap) {
      facts.push(factFromRule(ruleSet.conventions.lunarLeapMonth.ruleId, {
        id: "lunar.leap." + label,
        value: { monthNumber: m.monthNumber, jd: m.jd, endJd: m.endJd },
        ruleSet
      }));
    }
  }
  return facts;
}
function lunarDateFacts(year, month, day, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const value = lunarDateOf(year, month, day);
  if (!value) return [];
  return [factFromRule(ruleSet.conventions.lunarDayBoundary.ruleId, {
    id: "lunar.date." + year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0"),
    value,
    ruleSet
  })];
}

// src/schema/validate.js
var GANZHI = /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/;
var HEX64 = /^[0-9a-f]{16}$/;
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function validateChart(chart) {
  const errors = [];
  if (!isPlainObject(chart)) return { valid: false, errors: ["chart must be an object"] };
  if (chart.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0");
  if (!isPlainObject(chart.input)) errors.push("input must be an object");
  else {
    for (const key of ["year", "month", "day"]) {
      if (!Number.isInteger(chart.input[key])) errors.push("input." + key + " must be an integer");
    }
  }
  if (!isPlainObject(chart.pillars)) errors.push("pillars must be an object");
  else {
    for (const key of ["year", "month", "day", "hour"]) {
      if (!GANZHI.test(chart.pillars[key] ?? "")) errors.push("pillars." + key + " is invalid");
    }
  }
  if (!isPlainObject(chart.manifest)) errors.push("manifest must be an object");
  else {
    if (!chart.manifest.engineVersion) errors.push("manifest.engineVersion is required");
    if (!chart.manifest.ephemerisModel) errors.push("manifest.ephemerisModel is required");
    if (!chart.manifest.ruleSet) errors.push("manifest.ruleSet is required");
    else if (!isKnownRuleSet(chart.manifest.ruleSet)) errors.push("manifest.ruleSet is not registered: " + chart.manifest.ruleSet);
    if (!chart.manifest.ruleSetVersion) errors.push("manifest.ruleSetVersion is required");
    if (chart.manifest.ruleSetHash != null && !HEX64.test(chart.manifest.ruleSetHash)) {
      errors.push("manifest.ruleSetHash must be a 16-char hex string");
    }
  }
  errors.push(...validateFactGraph(chart.facts).errors);
  return { valid: errors.length === 0, errors };
}
function validateFactGraph(graph) {
  const errors = [];
  if (!isPlainObject(graph)) return { valid: false, errors: ["facts must be an object"] };
  if (graph.version !== "1.0.0") errors.push("facts.version must be 1.0.0");
  if (!Array.isArray(graph.facts)) {
    errors.push("facts.facts must be an array");
    return { valid: false, errors };
  }
  const seen = /* @__PURE__ */ new Set();
  for (const f of graph.facts) {
    if (!isPlainObject(f)) {
      errors.push("fact must be an object");
      continue;
    }
    if (!f.fact_id) errors.push("fact.fact_id is required");
    else if (seen.has(f.fact_id)) errors.push("duplicate fact_id: " + f.fact_id);
    else seen.add(f.fact_id);
    if (!f.rule_id) errors.push("fact " + f.fact_id + ": rule_id is required");
    if (typeof f.confidence !== "number" || f.confidence < 0 || f.confidence > 1) {
      errors.push("fact " + f.fact_id + ": confidence must be within [0, 1]");
    }
    if (!Array.isArray(f.source)) errors.push("fact " + f.fact_id + ": source must be an array");
  }
  return { valid: errors.length === 0, errors };
}
function validateTraceability(chart, ruleSet = getRuleSet(chart?.manifest?.ruleSet)) {
  const errors = [];
  const index = ruleIndex(ruleSet);
  for (const f of chart?.facts?.facts ?? []) {
    const rule = index.get(f.rule_id);
    if (!rule) {
      errors.push(f.fact_id + ": unknown rule_id " + f.rule_id);
      continue;
    }
    if (typeof f.confidence === "number" && f.confidence > rule.confidence + 1e-9) {
      errors.push(f.fact_id + ": confidence exceeds rule " + f.rule_id);
    }
  }
  return { valid: errors.length === 0, errors };
}
var PALACE_NAME_POOL = /* @__PURE__ */ new Set(["\u547D\u5BAB", "\u7236\u6BCD", "\u798F\u5FB7", "\u7530\u5B85", "\u5B98\u7984", "\u4EA4\u53CB", "\u8FC1\u79FB", "\u75BE\u5384", "\u8D22\u5E1B", "\u5B50\u5973", "\u592B\u59BB", "\u5144\u5F1F", "\u4EC6\u5F79", "\u5974\u4EC6", "\u76F8\u8C8C"]);
function validateZiweiChart(chart) {
  const errors = [];
  if (!isPlainObject(chart)) return { valid: false, errors: ["chart must be an object"] };
  if (chart.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0");
  if (chart.kind !== "ziwei") errors.push("kind must be ziwei");
  if (!isPlainObject(chart.input)) errors.push("input must be an object");
  else {
    for (const key of ["year", "month", "day"]) {
      if (!Number.isInteger(chart.input[key])) errors.push("input." + key + " must be an integer");
    }
  }
  if (!isPlainObject(chart.manifest)) errors.push("manifest must be an object");
  else {
    if (!chart.manifest.engineVersion) errors.push("manifest.engineVersion is required");
    if (!chart.manifest.ephemerisModel) errors.push("manifest.ephemerisModel is required");
    if (!chart.manifest.ruleSet) errors.push("manifest.ruleSet is required");
    else if (!isKnownRuleSet(chart.manifest.ruleSet)) errors.push("manifest.ruleSet is not registered: " + chart.manifest.ruleSet);
    if (!chart.manifest.ruleSetVersion) errors.push("manifest.ruleSetVersion is required");
    if (chart.manifest.ruleSetHash != null && !HEX64.test(chart.manifest.ruleSetHash)) {
      errors.push("manifest.ruleSetHash must be a 16-char hex string");
    }
  }
  if (!Array.isArray(chart.palaces) || chart.palaces.length !== 12) {
    errors.push("palaces must contain exactly 12 entries");
  } else {
    const branches = /* @__PURE__ */ new Set();
    const names = /* @__PURE__ */ new Set();
    for (const palace of chart.palaces) {
      if (!GANZHI.test((palace.stem ?? "") + (palace.branch ?? ""))) errors.push("palace \u5E72\u652F invalid: " + palace.stem + palace.branch);
      else if (branches.has(palace.branch)) errors.push("duplicate palace branch: " + palace.branch);
      else branches.add(palace.branch);
      if (!PALACE_NAME_POOL.has(palace.name)) errors.push("unknown palace name: " + palace.name);
      else if (names.has(palace.name)) errors.push("duplicate palace name: " + palace.name);
      else names.add(palace.name);
      if (!Array.isArray(palace.stars)) errors.push("palace " + palace.branch + ": stars must be an array");
    }
    if (branches.size !== 12) errors.push("palaces must cover all 12 branches");
  }
  if (!isPlainObject(chart.fiveElements) || !chart.fiveElements.name) errors.push("fiveElements.name is required");
  if (!isPlainObject(chart.soul) || !chart.soul.branch) errors.push("soul.branch is required");
  if (!isPlainObject(chart.body) || !chart.body.branch) errors.push("body.branch is required");
  errors.push(...validateFactGraph(chart.facts).errors);
  return { valid: errors.length === 0, errors };
}
export {
  BRANCHES,
  CHINA_DST_RANGES,
  CHINA_ZONE,
  DEFAULT_BAZI_RULE_SET,
  DEFAULT_RULE_SET_ID,
  DEFAULT_ZIWEI_RULE_SET,
  DELTA_T_ANCHORS,
  ELEMENT_ORDER,
  ENGINE_VERSION,
  EPHEMERIS_MODEL,
  FK5_DELTA_LONGITUDE_ARCSEC,
  J2000,
  JD_UNIX_EPOCH,
  JULIAN_CENTURY,
  JULIAN_MILLENNIUM,
  MEAN_MOTION_DEG_PER_DAY,
  MEASURED_UNTIL,
  MONTHS_PER_YEAR,
  RULE_SET,
  RULE_SETS,
  RULE_SET_VERSION,
  SCHEMA_VERSION,
  SECONDS_PER_DAY,
  SHICHEN,
  SOLAR_TERMS,
  SOLAR_TERM_BY_KEY,
  SOLAR_TERM_BY_NAME,
  STEMS,
  SYNODIC_MONTH,
  aberrationArcsec,
  anchorYearForTerm,
  annotateLunarMonths,
  auditFactGraph,
  auditRuleSet,
  auxiliaryStars,
  boshi12,
  branchIndexOf,
  buildLuck,
  candidateOffsets,
  castBazi,
  castZiwei,
  changsheng12,
  chinaDstRangesAsJD,
  civilToUTC,
  compareSchools,
  compareVersions,
  createManifest,
  currentMonthBoundary,
  dateFromJulianDay,
  dayFraction,
  dayNumberForBoundary,
  dayPillar,
  decadalLimits,
  deltaTDays,
  deltaTSeconds,
  deltaTUncertaintySeconds,
  divergenceKeys,
  elementOfBranch,
  elementOfStem,
  elementStrength,
  equationOfTimeForCivil,
  equationOfTimeMinutes,
  equationOfTimeSeconds,
  explain,
  fact,
  factFromRule,
  factGraph,
  factsByEvidence,
  fiveElementsClass,
  fixIndex,
  fnv1a32,
  fnv1a64,
  ganzhi,
  getRuleSet,
  hashFacts,
  hashInput,
  hiddenStems,
  hiddenStemsOf,
  hourPillar,
  isChinaDST,
  isJie,
  isKnownRuleSet,
  isZhongqi,
  jdFromUTCFields,
  jiangqian12,
  julianCenturies,
  julianDayFromDate,
  julianDayFromGregorian,
  julianDayFromUTC,
  julianMillennia,
  kFromYear,
  listRuleSets,
  luckDirection,
  luckPillars,
  lunarDateFacts,
  lunarDateOf,
  lunarDayFromNewMoon,
  lunarMonthAnchors,
  lunarMonthFacts,
  lunarYearOf,
  majorStars,
  manifestForInput,
  minorStars,
  monthHasZhongqi,
  monthIndexFor,
  monthPillar,
  moonPhaseJDE,
  mutagen,
  nearestMonthBoundary,
  newMoonsBetween,
  newMoonsNearYear,
  nextMonthBoundary,
  norm360,
  normalizeDegrees,
  normalizeSignedDegrees,
  numberedLunarMonths,
  palaceBranch,
  palaceIndexOf,
  palaceNameAliases,
  palaceNameOrder,
  palaceNames,
  palaceStems,
  parseVersion,
  pillarDetail,
  requireFacts,
  resolveRule,
  ruleEntries,
  ruleIndex,
  ruleSetIdsOf,
  satisfiesRange,
  sexagenaryDay,
  shichenOfCivil,
  solarTermInstant,
  solarTermsOfYear,
  solveSunLongitude,
  soulBodyIndex,
  soulBodyMaster,
  stableStringify,
  starsByPalace,
  startLuckAge,
  suiqian12,
  sunApparentLongitude,
  sunApparentRightAscension,
  sunGeometricLongitude,
  sunLongitudeAtUTC,
  sunLongitudeRate,
  sunMeanLongitude,
  systemOf,
  tenGod,
  tenGodNamesOf,
  timeBranch,
  timeIndexOf,
  trueSolarMinutes,
  ttToUTC,
  twelveGods,
  utcFromJulianDay,
  utcToCivil,
  utcToTT,
  validateChart,
  validateFactGraph,
  validateTraceability,
  validateZiweiChart,
  xiaoxian,
  yearPillar,
  zhongqiTermsBetween,
  ziweiTianfuIndex,
  zoneOffsetMinutes
};

export const WEB_ENGINE_SOURCE_HASH = "c8b0094493d7f989";
export const WEB_ENGINE_SOURCE_FILES = 37;
