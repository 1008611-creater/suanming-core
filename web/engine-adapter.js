/**
 * engine-adapter.js —— 引擎输出 → 页面视图模型
 * ---------------------------------------------------------------------------
 * 为什么需要这一层：
 *   网页曾经自带一份手写八字实现（web/bazi.js），与 src/ 各自演化，
 *   结果页面上的盘和引擎算出的盘是两份东西。现在网页只保留一条算法源：
 *   src/ + rules/ 打包成 engine.js，本文件负责把引擎的「契约输出」
 *   翻译成渲染层要用的「视图模型」。
 *
 * 分层原则：
 *   engine.js 只负责算，输出带 manifest / facts 的可追溯结构；
 *   本文件只做形状转换与展示所需的少量派生（旬空、生肖、流年表），
 *   不重新实现任何历法或干支算法 —— 一旦在这里重算，就又会出现两份口径。
 *
 * 单位与命名对照（引擎 → 页面）：
 *   input.longitude      → input.lng
 *   gender 'male'/'female' → '男'/'女'
 *   pillars.year '己巳'  → pillars[0].gan = 5, pillars[0].zhi = 5（索引）
 */
import * as Engine from './engine.js';

/* ---------- 引擎常量（唯一来源：rules/ 规则集表） ---------- */
export const GAN = [...Engine.STEMS];
export const ZHI = [...Engine.BRANCHES];
export const CANG = Engine.hiddenStems;
export const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

const GENDER_TO_ENGINE = { 男: 'male', 女: 'female' };
const GENDER_TO_VIEW = { male: '男', female: '女' };

/** 引擎身份信息，供页面标注口径与来源（首页承诺「每个结果都标明计算口径」）。 */
export const ENGINE_INFO = Object.freeze({
  version: Engine.ENGINE_VERSION,
  ephemeris: Engine.EPHEMERIS_MODEL,
  ruleSetId: Engine.DEFAULT_BAZI_RULE_SET,
  ziweiRuleSetId: Engine.DEFAULT_ZIWEI_RULE_SET,
  sourceHash: Engine.WEB_ENGINE_SOURCE_HASH,
  sourceFiles: Engine.WEB_ENGINE_SOURCE_FILES
});

function pillarToIndex(pillar) {
  return { gan: GAN.indexOf(pillar[0]), zhi: ZHI.indexOf(pillar[1]) };
}

/**
 * 排一份四柱盘，输出渲染层直接可用的视图模型。
 *
 * @param {object} opt
 *   name 姓名（仅展示）
 *   gender '男' | '女'
 *   year month day hour minute 民用（钟表）时间
 *   lng 出生地东经度数
 *   useTrueSolar 是否启用真太阳时（经度差 + 均时差）
 * @returns {object} 视图模型；数值一律为引擎原值，不做二次四舍五入之外的加工
 */
export function paipan(opt) {
  const displayYear = Number.isInteger(Number(opt.asOfYear)) ? Number(opt.asOfYear) : Number(opt.year);
  const gender = opt.gender === '女' ? '女' : '男';
  const lng = Number.isFinite(Number(opt.lng)) && opt.lng !== '' && opt.lng !== null
    ? Number(opt.lng) : 120;
  const useTrueSolar = opt.useTrueSolar !== false;

  const input = {
    year: opt.year, month: opt.month, day: opt.day,
    hour: opt.hour, minute: opt.minute || 0,
    // 「钟表时间」= 不做经度修正也不做均时差修正，等价于把出生地当作东经 120° 的标准时。
    longitude: useTrueSolar ? lng : 120,
    timezone: 'Asia/Shanghai',
    gender: GENDER_TO_ENGINE[gender]
  };
  const options = useTrueSolar ? {} : { equationOfTimeMinutes: 0 };

  const chart = Engine.castBazi(input, options);
  const ruleSet = Engine.getRuleSet(chart.manifest.ruleSetId);
  const pillars = [chart.pillars.year, chart.pillars.month, chart.pillars.day, chart.pillars.hour];
  const dayStem = chart.pillars.day[0];
  const shi = chart.time.shichen;

  /* ---------- 真太阳时明细（页面展示用） ---------- */
  let trueSolar = null;
  if (useTrueSolar) {
    const lonFix = (lng - 120) * 4;
    const eqt = shi.equationOfTimeMinutes;
    const total = opt.hour * 60 + (opt.minute || 0) + lonFix + eqt;
    const dayShift = Math.floor(total / 1440);
    const wrapped = ((total % 1440) + 1440) % 1440;
    // 日期用 UTC 字段承载民用日，避免本地时区把跨日样本算错。
    const base = new Date(Date.UTC(opt.year, opt.month - 1, opt.day));
    base.setUTCDate(base.getUTCDate() + dayShift);
    trueSolar = {
      y: base.getUTCFullYear(), m: base.getUTCMonth() + 1, d: base.getUTCDate(),
      h: Math.floor(wrapped / 60), mi: Math.floor(wrapped % 60),
      lonFix, eqt, dayShift
    };
  }

  /* ---------- 五行力量：口径与权重全部来自规则集 ---------- */
  const strength = Engine.elementStrength(chart.pillars, ruleSet);

  /* ---------- 大运：干支序列由引擎给出，页面只补十神与年份 ---------- */
  const daYun = chart.luck ? {
    forward: chart.luck.direction === 1,
    startAge: chart.luck.startAgeYears,
    method: chart.luck.method,
    ruleId: chart.luck.ruleId,
    list: chart.luck.pillars.map((gz, i) => ({
      gan: GAN.indexOf(gz[0]), zhi: ZHI.indexOf(gz[1]), gz,
      shiShen: Engine.tenGod(dayStem, gz[0], ruleSet),
      startAge: chart.luck.startAgeYears + i * 10,
      startYear: input.year + Math.floor(chart.luck.startAgeYears) + i * 10
    }))
  } : null;

  /* ---------- 流年：年柱由引擎的年柱规则给出，不在这里另写一套 ---------- */
  // 区间要同时覆盖「展示年份前后」与「出生年之后」：只按展示年份生成的话，
  // 出生年份晚于展示年份的人（表单允许填未来日期）会拿到一整段出生前的年份，
  // 流年卡片就会显示出生前的年份、虚岁为负。
  const fromYear = Math.min(input.year, displayYear - 1);
  const toYear = Math.max(displayYear + 11, input.year + 11);
  const liuNian = [];
  for (let y = fromYear; y <= toYear; y++) {
    const gz = Engine.yearPillar(y, 6, 1, { yearBoundary: 'calendar', ruleSet });
    liuNian.push({
      year: y, gan: GAN.indexOf(gz[0]), zhi: ZHI.indexOf(gz[1]), gz,
      shiShen: Engine.tenGod(dayStem, gz[0], ruleSet)
    });
  }

  /* ---------- 命卦用年：必须与年柱同口径（立春换年） ----------
   * 三元命卦按立春分年，而表单里的 year 是公历年。1 月 1 日出生者在立春前，
   * 年柱已退到上一年，命卦若仍用公历年就会与四柱自相矛盾。
   * 这里只比较引擎自己算出的年柱，不在页面重写立春算法。 */
  const guaYear = Engine.yearPillar(input.year, input.month, input.day, {
    yearBoundary: 'calendar', ruleSet
  }) === chart.pillars.year ? input.year : input.year - 1;

  /* ---------- 前事清单：由解释层产出，适配层只透传 ----------
   * 年份必须显式：调用方给了 asOfYear 才带上「流年反复」类条目，
   * 没给就省略那一条 —— 页面不替用户假定「现在是哪一年」。 */
  const asOfYear = Number.isInteger(Number(opt.asOfYear)) ? Number(opt.asOfYear) : undefined;
  const pastEventItems = Engine.pastEvents(chart, { ruleSet, asOfYear });

  return {
    name: opt.name || '无名',
    gender,
    input: { year: input.year, month: input.month, day: input.day, hour: input.hour, minute: input.minute, lng, useTrueSolar },
    trueSolar,
    solarUsed: trueSolar
      ? { y: trueSolar.y, m: trueSolar.m, d: trueSolar.d, h: trueSolar.h, mi: trueSolar.mi }
      : { y: input.year, m: input.month, d: input.day, h: input.hour, mi: input.minute },
    pillars: pillars.map(pillarToIndex),
    gz: pillars,
    gan: pillars.map((p) => p[0]),
    zhi: pillars.map((p) => p[1]),
    shiShen: {
      year: Engine.tenGod(dayStem, chart.pillars.year[0], ruleSet),
      month: Engine.tenGod(dayStem, chart.pillars.month[0], ruleSet),
      day: '日主',
      hour: Engine.tenGod(dayStem, chart.pillars.hour[0], ruleSet)
    },
    zhiShiShen: pillars.map((p) => Engine.tenGod(dayStem, CANG[p[1]][0], ruleSet)),
    dayGan: GAN.indexOf(dayStem),
    dayGanWx: Engine.elementOfStem(dayStem, ruleSet),
    zodiac: SHENGXIAO[ZHI.indexOf(chart.pillars.year[1])],
    // 旬空来自引擎的 relations.xun（按日柱所在旬定），页面不再自带一张表：
    // 表若与引擎口径分家，盘上标了空亡而旬空栏却写别的两支，两处会自相矛盾。
    // 规则集缺空亡表时 relations.xun 为 null，此时返回空数组表示「未判定」，
    // 而不是补一个默认值冒充已判定。
    xunKong: chart.relations && chart.relations.xun ? [...chart.relations.xun.voidBranches] : [],
    guaYear,
    monthTerm: Engine.currentMonthBoundary(chart.time.jdUTC)?.name ?? '',
    wx: { score: { ...strength.totals }, weights: [...strength.weights], method: strength.method, ruleSet: strength.ruleSet },
    daYun,
    liuNian,
    relations: chart.relations,
    pastEvents: pastEventItems,
    displayYear,
    displayYearSource: Number.isInteger(Number(opt.asOfYear)) ? 'explicit' : 'birth-year-default',
    chart,
    engine: ENGINE_INFO
  };
}

/**
 * 排一份紫微斗数盘（原样返回引擎结构，另附引擎身份信息）。
 * 紫微与四柱共用同一套时间层与农历层，但年界、日界各按自己的口径，两者不互相换算。
 */
export function ziwei(opt) {
  const useTrueSolar = opt.useTrueSolar !== false;
  const lng = Number.isFinite(Number(opt.lng)) && opt.lng !== '' && opt.lng !== null ? Number(opt.lng) : 120;
  const input = {
    year: opt.year, month: opt.month, day: opt.day,
    hour: opt.hour, minute: opt.minute || 0,
    // 与四柱同一口径：关闭真太阳时即按东经 120° 的钟表时间处理，两盘不会各用一套时间。
    longitude: useTrueSolar ? lng : 120,
    timezone: 'Asia/Shanghai',
    gender: GENDER_TO_ENGINE[opt.gender === '女' ? '女' : '男']
  };
  const options = useTrueSolar ? {} : { equationOfTimeMinutes: 0 };
  const chart = Engine.castZiwei(input, options);
  return { ...chart, gender: GENDER_TO_VIEW[input.gender], useTrueSolar, engine: ENGINE_INFO };
}

/**
 * 指定公历年的流年信息。
 *
 * 自检页要让用户拿「已经发生过的某一年」来核对结构，年份由用户给定，
 * 因此不能只依赖 paipan() 里那张固定区间的流年表。年柱仍由引擎的年柱规则
 * 给出，这里只补十神、虚岁与当年所处大运，不重写任何干支算法。
 *
 * @param {number} year 公历年
 * @param {object} p paipan() 的返回值（取日干、大运与规则集）
 */
export function flowYear(year, p) {
  const ruleSet = Engine.getRuleSet(p.chart.manifest.ruleSetId);
  const gz = Engine.yearPillar(year, 6, 1, { yearBoundary: 'calendar', ruleSet });
  const dayStem = p.gz[2][0];
  const luck = p.daYun ? p.daYun.list.filter((d) => year >= d.startYear).pop() ?? null : null;
  return {
    year,
    gz,
    gan: GAN.indexOf(gz[0]),
    zhi: ZHI.indexOf(gz[1]),
    shiShen: Engine.tenGod(dayStem, gz[0], ruleSet),
    zhiShiShen: Engine.tenGod(dayStem, CANG[gz[1]][0], ruleSet),
    xuSui: year - p.input.year + 1,
    daYun: luck
      ? { gz: luck.gz, shiShen: luck.shiShen, startAge: luck.startAge, startYear: luck.startYear }
      : null
  };
}

/**
 * 三方四正：以寅基宫位索引取本宫、对宫（+6）与三合两宫（+4、+8）。
 *
 * 这是宫位几何关系（寅午戌三合、寅申相冲），不含任何取值口径，
 * 与具体流派无关，因此放在适配层而不是解释层。
 */
export function palaceTriad(palaceIndex) {
  const fix = (i) => ((i % 12) + 12) % 12;
  return {
    self: fix(palaceIndex),
    opposite: fix(palaceIndex + 6),
    trine: [fix(palaceIndex + 4), fix(palaceIndex + 8)]
  };
}

export const API = {
  paipan, ziwei, flowYear, palaceTriad, GAN, ZHI, CANG, SHENGXIAO, ENGINE_INFO,
  engine: Engine
};

// 浏览器里挂到全局，供 app.js 使用；Node 下（测试）不做任何全局写入。
if (typeof window !== 'undefined') window.SuanmingEngine = API;
