import { getRuleSet, resolveRule } from '../../rules/index.js';
import { relationHits, PILLAR_LABELS } from '../derive/relations.js';
import { tenGod, yearPillar } from '../charts/bazi/pillars.js';

/**
 * 前事清单（解释层）
 * ---------------------------------------------------------------------------
 * 这一层只做一件事：把已经算出的结构翻译成「可以用你自己的经历去核对」的清单。
 *
 * 三条纪律：
 *   1. 只读不重算：输入是 castBazi 的输出，本文件不碰历法、不排盘、不读当前时间。
 *      需要年份时必须由调用方显式传入 asOfYear；缺省就省略流年类条目，
 *      绝不用「现在」当默认值 —— 否则同一份盘在不同日子会得出不同清单。
 *   2. 每条都能指回规则：判词的程度分档、宫位口径、十神口径各有自己的 ruleId，
 *      条目的 basis.ruleId 一律来自规则集，不在本文件里写死取值。
 *   3. 不夸功、不恐吓：只给方向与程度区间（轻／中／重），并逐条标注不确定性来源。
 *      这两条来自项目修正规则 R-01（凶象不得往轻里读）与 R-02（表述纪律）。
 *
 * 与 derive/relations.js 的分工：那边只输出「哪个柱位与哪个柱位构成了什么关系」，
 * 不判轻重；宫位映射与程度分档是解释层口径，写在这里，两层不混。
 */

/** 宫位口径：四柱 → 宫位名。用于 basis.palace 与判词，取值不参与任何计算。 */
const PALACE_NAMES = Object.freeze({
  year: '祖上宫',
  month: '父母宫',
  day: '夫妻宫',
  hour: '子女宫'
});

/** 造成结构性冲击的关系类型（R-01 的适用范围）：刑、冲、害、空亡。 */
const STRUCTURAL_KINDS = ['clash', 'punishment', 'self-punishment', 'harm', 'void'];

/** 关系类型 → 关系分组，用于反查该组在规则集里的 ruleId。 */
const GROUP_OF_KIND = Object.freeze({
  clash: 'clash',
  combine: 'combine',
  trine: 'trine',
  'half-trine': 'trine',
  punishment: 'punishment',
  'self-punishment': 'punishment',
  harm: 'harm',
  void: 'void'
});

/**
 * 关系类型 → 中文名。只作为规则表漏写 name 时的兜底：
 * 判词与依据栏里**只能出现中文关系名**，英文枚举（clash / harm / void …）
 * 是内部实现细节，一旦泄漏到页面上，用户看到的就是「关系 clash」这种半成品。
 * 规则集里逐项写明的 name（子午冲、子丑合土、寅巳害）优先于这张表。
 */
const KIND_LABELS = Object.freeze({
  clash: '六冲',
  combine: '六合',
  trine: '三合',
  'half-trine': '半合',
  punishment: '相刑',
  'self-punishment': '自刑',
  harm: '六害',
  void: '空亡'
});

/**
 * 宫位条目的先后顺序：跨柱关系由**最早一个在清单里有条目的宫位**展开，
 * 其它相关宫位只以「共见」引用。年柱不进前事清单（祖上宫没有独立条目），
 * 因此年柱参与的关系一律由月／日／时柱的条目承接。
 *
 * 为什么要有这条口径：一条跨柱关系（例如月支子与时支午相冲）在结构上确实
 * 同时落在两个宫位，但若两个条目都把「子午冲（月柱—时柱）」当成自己的发现完整展开，
 * 用户看到的就是同一句话写了两遍，清单立刻显得像在凑条数。
 */
const PALACE_ITEM_ORDER = ['month', 'day', 'hour'];

function ownerPosition(hit) {
  for (const position of PALACE_ITEM_ORDER) {
    if (hit.positions.indexOf(position) >= 0) return position;
  }
  return hit.positions[0];
}

/** 按归属把命中拆成「本宫展开」与「别宫展开、本宫共见」两组。 */
function splitByOwnership(hits, position) {
  const owned = [];
  const shared = [];
  for (const hit of hits) {
    if (ownerPosition(hit) === position) owned.push(hit);
    else shared.push(hit);
  }
  return { owned: owned, shared: shared };
}

/** 命中 → 中文关系名；规则表漏写 name 时退回类型中文名，绝不外泄英文枚举。 */
function relationLabel(hit) {
  const name = hit && typeof hit.name === 'string' ? hit.name : '';
  if (name && !/[A-Za-z]/.test(name)) return name;
  return KIND_LABELS[hit && hit.kind] ?? '关系';
}

/** 命中清单 → 关系名串，供依据栏使用。 */
function relationText(hits) {
  return hits.map(relationLabel).join('、');
}

/**
 * 依据栏里的关系名：本宫独立命中的排在前，别宫展开、本宫共见的排在后。
 * 两段都为空（本宫只有别宫展开的关系）时，退回共见那一组，避免依据栏比判词还空。
 */
function basisRelations(primary, primarySplit, secondary, secondarySplit) {
  const parts = [];
  const own = primarySplit.owned.concat(secondarySplit.owned);
  const shared = primarySplit.shared.concat(secondarySplit.shared);
  if (own.length) parts.push(relationText(own));
  if (shared.length) parts.push(relationText(shared));
  if (!parts.length) {
    const all = primary.concat(secondary);
    if (all.length) parts.push(relationText(all));
  }
  return parts.join('；');
}

const TIER_LIGHT = '轻';
const TIER_MEDIUM = '中';
const TIER_HEAVY = '重';

/** 清单条数上下限：少于 5 条不足以让用户比对，多于 8 条会让人放弃逐条打标。 */
const MIN_ITEMS = 5;
const MAX_ITEMS = 8;

/**
 * 流年回看的年数：只看已经发生的年份，且年份由 asOfYear 显式给定。
 *
 * 为什么是 12 年而不是 10 年：十天干一轮正好 10 年，若只回看 10 年，
 * 每一个天干恰好出现一次，「反复」永远不可能发生 —— 这条判词会变成死代码。
 * 12 年 = 一轮 + 2 年，必然有 1–2 类十神出现三次，条目才真的在筛选信息。
 */
const FLOW_LOOKBACK_YEARS = 12;
/** 同一类十神在这 12 年里出现几次算「反复」。 */
const FLOW_REPEAT_THRESHOLD = 3;
/** 十神类别的固定顺序：排序用它而不是 localeCompare，避免环境差异影响结果。 */
const TEN_GOD_CATEGORY_ORDER = ['财', '官', '印', '食伤', '比劫'];

function tieringRuleId(ruleSet) {
  return ruleSet.conventions.pastEventTiering.ruleId;
}

function uncertaintyRuleId(ruleSet) {
  return ruleSet.conventions.pastEventUncertainty.ruleId;
}

function palaceRuleId(ruleSet) {
  return ruleSet.conventions.palaceOfPillar.ruleId;
}

function tenGodRuleId(ruleSet) {
  return ruleSet.tables.tenGodRule.ruleId;
}

/** 取某柱位上的结构性冲击（刑／冲／害／空亡），已按固定顺序排好。 */
function structuralHits(relations, position) {
  return relationHits(relations, { kinds: STRUCTURAL_KINDS, position });
}

/**
 * 程度分档（R-01）：
 *   空亡之宫再逢刑或冲 → 重（宫位被击穿）
 *   见刑／冲／害／空亡任一 → 中（结构性，不按摩擦性读）
 *   无冲击 → 轻
 */
function tierOf(hits) {
  if (!hits.length) return TIER_LIGHT;
  const hasVoid = hits.some(function (h) { return h.kind === 'void'; });
  const hasBreak = hits.some(function (h) { return h.kind === 'clash' || h.kind === 'punishment'; });
  if (hasVoid && hasBreak) return TIER_HEAVY;
  return TIER_MEDIUM;
}

/**
 * 程度分档（非宫位条目）：把「结构有多极端」映射到三档。
 *
 * 宫位条目的分档看刑冲破害空亡（见 tierOf）；其余条目没有这些命中，
 * 若一律记「轻」，程度档就变成摆设 —— 80 盘实测里月令生克、十神分布、
 * 流年反复三条永远是「轻」，用户看到的档位完全不随盘而变。
 *
 * 这里按「偏离中性有多远」分三档，阈值都是确定性常量：
 *   轻 —— 接近中性（生克相生、分布均衡、流年反复刚过门槛）
 *   中 —— 明显偏向一侧
 *   重 —— 极端（月令克日主、某一类十神压倒其余、流年同一类反复密集）
 */
function tierByDegree(degree) {
  if (degree >= 2) return TIER_HEAVY;
  if (degree >= 1) return TIER_MEDIUM;
  return TIER_LIGHT;
}

/** 命中清单 → 依据里的一句话描述，例如「子午冲（月柱—时柱）」。 */
function describeHits(hits) {
  return hits.map(function (h) {
    const where = h.positions.map(function (p) { return PILLAR_LABELS[p]; }).join('—');
    return relationLabel(h) + '（' + where + '）';
  }).join('、');
}

/** 取第一条命中的关系类型所对应的规则 ruleId；没有命中时退回分档规则。 */
function hitRuleId(relations, hits, ruleSet) {
  if (!hits.length) return tieringRuleId(ruleSet);
  const group = GROUP_OF_KIND[hits[0].kind];
  const entry = group ? relations.groups[group] : null;
  return entry && entry.ruleId ? entry.ruleId : tieringRuleId(ruleSet);
}

function uncertaintyFor(ruleSet, extra) {
  const base = '本条只判断方向与程度区间，不指认具体事件、不指认发生时间；'
    + '若与你的实际经历不符，优先复核出生时辰（尤其靠近时辰交界）与出生地经度。';
  return extra ? base + extra : base;
}

/** 十神 → 财官印食四类；比劫与食伤分列，未归类返回 null。 */
function tenGodCategory(name) {
  if (name === '正财' || name === '偏财') return '财';
  if (name === '正官' || name === '七杀') return '官';
  if (name === '正印' || name === '偏印') return '印';
  if (name === '食神' || name === '伤官') return '食伤';
  if (name === '比肩' || name === '劫财') return '比劫';
  return null;
}

const GENERATES = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

/** 日主与月令的五行关系：只描述生克方向，不判强弱吉凶。 */
function dayMasterMonthRelation(dayElement, monthElement) {
  if (!dayElement || !monthElement) return null;
  if (dayElement === monthElement) return '同气比助';
  if (GENERATES[monthElement] === dayElement) return '月令生日主';
  if (GENERATES[dayElement] === monthElement) return '日主生月令';
  if (CONTROLS[monthElement] === dayElement) return '月令克日主';
  if (CONTROLS[dayElement] === monthElement) return '日主克月令';
  return null;
}

/** 某柱位的结构性冲击条目（父母宫／夫妻宫／祖上宫／子女宫共用）。 */
function palaceItem(position, relations, ruleSet, wording) {
  const hits = structuralHits(relations, position);
  const tier = tierOf(hits);
  const split = splitByOwnership(hits, position);
  const detail = hits.length
    ? (split.owned.length
      ? describeHits(split.owned)
      : '本宫未见独立命中的刑、冲、害、空亡')
      + (split.shared.length
        ? (split.owned.length ? '；另与别宫共见 ' : '，仅与别宫共见 ') + describeHits(split.shared)
        : '')
    : '无刑、冲、害、空亡';
  const tail = tier === TIER_HEAVY
    ? '按项目修正规则 R-01，空亡之宫再逢刑冲视为宫位被击穿，记最重一档；请按结构性变化核对，不要按一时摩擦理解。'
    : tier === TIER_MEDIUM
      ? '按项目修正规则 R-01，这一宫见刑、冲、害、空亡任一即按结构性处理，记中档，不按摩擦性读。'
      : '这一宫未见刑、冲、害、空亡，记轻档；仍请以你自己的实际经历为准。';
  return {
    id: position + '-palace',
    statement: wording + '：' + detail + '。' + tail,
    basis: {
      palace: PALACE_NAMES[position],
      tenGod: null,
      relation: hits.length ? basisRelations(hits, split, [], { owned: [], shared: [] }) : null,
      ruleId: hitRuleId(relations, hits, ruleSet)
    },
    tier: tier,
    uncertainty: uncertaintyFor(ruleSet, hits.length
      ? '关系命中的柱位固定，但「家里发生了什么」由现实决定，清单只给方向。'
      : '未见冲击不等于这一宫顺利，只表示结构上没有可指认的破损。')
  };
}

/** 夫妻宫（日支）条目：除了刑冲破害空亡，也把六合／三合／半合作为结构一并列出。 */
function spousePalaceItem(relations, ruleSet) {
  const hits = structuralHits(relations, 'day');
  const bonds = relationHits(relations, { kinds: ['combine', 'trine', 'half-trine'], position: 'day' });
  const tier = tierOf(hits);
  const split = splitByOwnership(hits, 'day');
  const bondSplit = splitByOwnership(bonds, 'day');
  const parts = [];
  parts.push(hits.length
    ? (split.owned.length ? describeHits(split.owned) : '本宫未见独立命中的刑、冲、害、空亡')
      + (split.shared.length
        ? (split.owned.length ? '；另与别宫共见 ' : '，仅与别宫共见 ') + describeHits(split.shared)
        : '')
    : '无刑、冲、害、空亡');
  if (bonds.length) {
    parts.push('另有 ' + (bondSplit.owned.length ? describeHits(bondSplit.owned) : '无独立命中')
      + (bondSplit.shared.length ? '，与别宫共见 ' + describeHits(bondSplit.shared) : ''));
  }
  const tail = tier === TIER_HEAVY
    ? '按 R-01，空亡再逢刑冲记最重一档，请按结构性变化核对。'
    : tier === TIER_MEDIUM
      ? '按 R-01，夫妻宫见刑、冲、害、空亡任一按结构性处理，记中档。'
      : bonds.length
        ? '未见冲击而见合，结构上以联结为主，记轻档。'
        : '未见冲击，记轻档。';
  return {
    id: 'spouse-palace',
    statement: '夫妻宫（日支 ' + relations.dayPillar[1] + '）：' + parts.join('；') + '。' + tail,
    basis: {
      palace: PALACE_NAMES.day,
      tenGod: null,
      relation: basisRelations(hits, split, bonds, bondSplit) || null,
      ruleId: hitRuleId(relations, hits.length ? hits : bonds, ruleSet)
    },
    tier: tier,
    uncertainty: uncertaintyFor(ruleSet, '婚姻与长期关系的走向受双方与环境共同影响，本条只描述盘面结构。')
  };
}

/** 父母宫天干十神：月干相对日干。 */
function monthTenGodItem(pillars, ruleSet) {
  const dayStem = pillars.day[0];
  const name = tenGod(dayStem, pillars.month[0], ruleSet);
  return {
    id: 'month-ten-god',
    statement: '父母宫（月柱 ' + pillars.month + '）天干为 ' + name + '，'
      + '即以日主 ' + dayStem + ' 论月干的十神关系。十神只描述这一宫的着力方向，'
      + '不单独判吉凶；请与父母宫地支结构一条合看。',
    basis: {
      palace: PALACE_NAMES.month,
      tenGod: name,
      relation: null,
      ruleId: tenGodRuleId(ruleSet)
    },
    tier: TIER_LIGHT,
    uncertainty: uncertaintyFor(ruleSet, '同一十神在不同盘中的实际表现差异很大，本条只给方向。')
  };
}

/** 日主与月令的五行关系：只描述生克方向。 */
function monthQiItem(pillars, ruleSet) {
  const stems = ruleSet.tables.stems;
  const branches = ruleSet.tables.branches;
  const dayElement = stems.find(function (s) { return s.name === pillars.day[0]; })?.element ?? null;
  const monthElement = branches.find(function (b) { return b.name === pillars.month[1]; })?.element ?? null;
  const relation = dayMasterMonthRelation(dayElement, monthElement);
  // 月令克日主是结构性压制，记重；日主克月令是主动消耗，记中；
  // 同气与相生接近中性，记轻。只描述生克方向，不判强弱吉凶。
  const qiDegree = relation === '月令克日主' ? 2 : relation === '日主克月令' ? 1 : 0;
  return {
    id: 'month-qi',
    statement: '日主 ' + pillars.day[0] + '（' + (dayElement ?? '—') + '）生于 ' + pillars.month[1]
      + ' 月（' + (monthElement ?? '—') + '），月令与日主为「' + (relation ?? '未判定') + '」。'
      + '这一条只说明月令对日主是生是克，不直接推出强弱结论；'
      + '按项目修正规则 R-01，星曜不透干不等于力量弱，须先看地支根气。',
    basis: {
      palace: PALACE_NAMES.month,
      tenGod: null,
      relation: null,
      ruleId: tieringRuleId(ruleSet)
    },
    tier: tierByDegree(qiDegree),
    uncertainty: uncertaintyFor(ruleSet, '强弱另需按规则集的藏干权重口径单独计算，本条不替代那一步。')
  };
}

/** 财官印食结构：统计四柱天干与地支本气所对应的十神类别。 */
function tenGodStructureItem(pillars, relations, ruleSet) {
  const dayStem = pillars.day[0];
  const branches = ruleSet.tables.branches;
  const counts = { 财: 0, 官: 0, 印: 0, 食伤: 0, 比劫: 0 };
  const seen = [];
  for (const position of ['year', 'month', 'hour']) {
    const name = tenGod(dayStem, pillars[position][0], ruleSet);
    const category = tenGodCategory(name);
    if (category) counts[category] += 1;
    seen.push(PILLAR_LABELS[position] + '干 ' + name);
  }
  for (const position of ['year', 'month', 'day', 'hour']) {
    const branch = pillars[position][1];
    const hidden = branches.find(function (b) { return b.name === branch; })?.hiddenStems ?? [];
    if (!hidden.length) continue;
    const name = tenGod(dayStem, hidden[0], ruleSet);
    const category = tenGodCategory(name);
    if (category) counts[category] += 1;
    seen.push(PILLAR_LABELS[position] + '支本气 ' + name);
  }
  const present = Object.keys(counts).filter(function (k) { return counts[k] > 0; });
  const absent = Object.keys(counts).filter(function (k) { return counts[k] === 0; });
  const tally = Object.keys(counts).map(function (k) { return k + ' ' + counts[k] + ' 处'; }).join('、');
  // 七处落点里某一类达到 4 处即过半，记重；达到 3 处记中；其余记轻。
  // 只看集中程度，不判哪一类吉凶。
  const peak = Math.max(...Object.keys(counts).map(function (k) { return counts[k]; }));
  const structureDegree = peak >= 4 ? 2 : peak >= 3 ? 1 : 0;
  return {
    id: 'ten-god-structure',
    statement: '十神分布（按四柱天干与地支本气计）：' + tally + '。'
      + '其中' + (present.length ? present.join('、') + ' 有见' : '无任何类别有见')
      + (absent.length ? '，' + absent.join('、') + ' 未见' : '') + '。'
      + '未见某一类不等于人生里没有对应的事，只表示这一层结构上没有直接落点；'
      + '请对照你实际的收入方式、职业约束与学习经历来核对。',
    basis: {
      palace: null,
      tenGod: present.join('、') || null,
      relation: null,
      ruleId: tenGodRuleId(ruleSet)
    },
    tier: tierByDegree(structureDegree),
    uncertainty: uncertaintyFor(ruleSet, '十神分布受藏干口径影响，换一套规则集的权重会改变计数。')
  };
}

/** 大运交脱：起运年龄与第一步大运。起运口径由规则集给出，这里只读结果。 */
function luckStartItem(chart, ruleSet) {
  const luck = chart.luck;
  if (!luck) return null;
  const startAge = luck.startAgeYears;
  const startYear = Number(chart.input.year) + Math.floor(startAge);
  const first = luck.pillars[0];
  const direction = luck.direction === 1 ? '顺行' : '逆行';
  return {
    id: 'luck-start',
    statement: '大运' + direction + '，起运 ' + startAge.toFixed(2) + ' 岁，'
      + '约在 ' + startYear + ' 年前后交入第一步大运 ' + first + '。'
      + '传统上交运前后一两年常有环境变动（升学、离家、换城市、换行业）。'
      + '请回想那个年份前后，你的生活节奏是否真的换过一次轨。',
    basis: {
      palace: null,
      tenGod: null,
      relation: null,
      ruleId: luck.ruleId
    },
    tier: TIER_LIGHT,
    uncertainty: uncertaintyFor(ruleSet, '起运年龄按「天数 ÷ 3」换算，流派间有取整差异；换一套规则集会得到不同的交运年份。')
  };
}

/**
 * 流年十神反复：只看已经发生的年份，年份由调用方显式给定。
 * 缺 asOfYear 时本函数返回 null，条目整体省略 —— 不用「现在」当默认值。
 */
function flowRepeatItem(chart, ruleSet, asOfYear) {
  if (!Number.isInteger(asOfYear)) return null;
  const birthYear = Number(chart.input.year);
  if (asOfYear <= birthYear) return null;
  const dayStem = chart.pillars.day[0];
  const from = Math.max(birthYear + 1, asOfYear - FLOW_LOOKBACK_YEARS + 1);
  // 按「类别」而不是按单一十神计数：财含正财与偏财，同属一类的事被反复推到台面上，
  // 比「同一个天干又来了」更接近用户能回忆起来的经历。
  const byCategory = new Map();
  for (let year = from; year <= asOfYear; year++) {
    const gz = yearPillar(year, 6, 1, { yearBoundary: 'calendar', ruleSet });
    const name = tenGod(dayStem, gz[0], ruleSet);
    const category = tenGodCategory(name);
    if (!category) continue;
    if (!byCategory.has(category)) byCategory.set(category, { names: new Set(), years: [] });
    const bucket = byCategory.get(category);
    bucket.names.add(name);
    bucket.years.push(year);
  }
  const repeated = [...byCategory.entries()]
    .filter(function (entry) { return entry[1].years.length >= FLOW_REPEAT_THRESHOLD; })
    .sort(function (a, b) {
      return b[1].years.length - a[1].years.length
        || TEN_GOD_CATEGORY_ORDER.indexOf(a[0]) - TEN_GOD_CATEGORY_ORDER.indexOf(b[0]);
    });
  if (!repeated.length) return null;
  const top = repeated[0];
  const years = top[1].years;
  const names = [...top[1].names].join('、');
  // 门槛是 3 次（刚算「反复」），记轻；4 次记中；5 次及以上记重。
  // 只统计出现密度，不判断这些年份的好坏。
  const flowDegree = years.length >= 5 ? 2 : years.length >= 4 ? 1 : 0;
  return {
    id: 'flow-repeat',
    statement: '从 ' + from + ' 到 ' + asOfYear + ' 的流年里，'
      + top[0] + '类（' + names + '）反复出现 ' + years.length + ' 次（' + years.join('、') + '）。'
      + '同一类十神反复出现，通常对应同一类事被反复推到台面上。'
      + '请回想这几年里是否真有一件同类型的事一再发生；'
      + '若同类年份你的感受完全相反，通常要先怀疑出生时辰。',
    basis: {
      palace: null,
      tenGod: names,
      relation: null,
      ruleId: tenGodRuleId(ruleSet)
    },
    tier: tierByDegree(flowDegree),
    uncertainty: uncertaintyFor(ruleSet, '本条只统计十神出现次数，不判断这些年份的好坏。')
  };
}

/**
 * 组装前事清单。
 *
 * @param {object} chart castBazi 的输出（必须含 pillars、relations、manifest）
 * @param {object} [options]
 *   ruleSet  —— 规则集对象；缺省按 chart.manifest.ruleSetId 取
 *   asOfYear —— 显式给定的「现在」年份（整数）。缺省时省略流年类条目。
 * @returns {ReadonlyArray} 冻结数组，元素形如：
 *   { id, statement, basis:{palace,tenGod,relation,ruleId}, tier, uncertainty }
 *   数组上另挂 skipped：因规则集缺条目而被整体跳过的清单项，便于审计。
 */
export function pastEvents(chart, options = {}) {
  if (!chart || typeof chart !== 'object') throw new Error('pastEvents: chart is required');
  if (!chart.pillars || !chart.relations) {
    throw new Error('pastEvents: chart must carry pillars and relations (castBazi output)');
  }
  const ruleSet = options.ruleSet ?? getRuleSet(chart.manifest?.ruleSetId);
  const pillars = chart.pillars;
  const relations = chart.relations;
  const asOfYear = Number.isInteger(options.asOfYear) ? options.asOfYear : null;
  const skipped = [];

  // 每一项都先构造，再按「规则集里真的有这条 ruleId」过滤：
  // 规则集没有登记解释层条目时，宁可少给一条，也不让页面显示一条无出处的判词。
  const builders = [
    function () { return palaceItem('month', relations, ruleSet,
      '父母宫（月柱 ' + pillars.month + '）地支 ' + pillars.month[1] + ' 的结构'); },
    function () { return monthTenGodItem(pillars, ruleSet); },
    function () { return monthQiItem(pillars, ruleSet); },
    function () { return spousePalaceItem(relations, ruleSet); },
    function () { return tenGodStructureItem(pillars, relations, ruleSet); },
    function () { return luckStartItem(chart, ruleSet); },
    function () { return flowRepeatItem(chart, ruleSet, asOfYear); },
    function () { return palaceItem('hour', relations, ruleSet,
      '子女宫（时柱 ' + pillars.hour + '）地支 ' + pillars.hour[1] + ' 的结构'); }
  ];

  const items = [];
  const seen = new Set();
  for (const build of builders) {
    if (items.length >= MAX_ITEMS) break;
    let item;
    try {
      item = build();
    } catch (error) {
      skipped.push({ id: null, reason: String(error?.message ?? error) });
      continue;
    }
    if (!item) continue;
    if (seen.has(item.id)) continue;
    const rule = resolveRule(item.basis.ruleId, ruleSet);
    if (!rule) {
      skipped.push({ id: item.id, reason: 'unregistered ruleId: ' + item.basis.ruleId });
      continue;
    }
    seen.add(item.id);
    items.push(Object.freeze({
      id: item.id,
      statement: item.statement,
      basis: Object.freeze({ ...item.basis }),
      tier: item.tier,
      uncertainty: item.uncertainty
    }));
  }

  // 数组先挂审计用的非枚举字段再冻结：冻结之后无法再添加属性，
  // 而审计信息（跳过了哪些项、用的哪套规则集）必须随结果一起交出去。
  Object.defineProperty(items, 'skipped', { value: Object.freeze(skipped), enumerable: false });
  Object.defineProperty(items, 'ruleSet', { value: ruleSet.id, enumerable: false });
  return Object.freeze(items);
}

/** 清单条数的公开区间，供页面与测试共用，避免两边各写一个数字。 */
export const PAST_EVENT_BOUNDS = Object.freeze({ min: MIN_ITEMS, max: MAX_ITEMS });
