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

/** 造成结构性冲击的关系类型：刑、冲、害、空亡。 */
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
 * 程度分档（宫位条目）：
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
  return extra;
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
  const detail = describePalaceHits(split);
  const tail = palaceTail(position, tier, split);
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

/**
 * 宫位命中 → 人话。
 *
 * 跨柱关系只在归属宫完整展开，别的宫写作「共见」。共见不是「没有这回事」，
 * 而是这宫本身没有独立的刑冲害空亡，但和别的宫之间有一处，影响会传过来。
 * 以前写成「未见……记中档」，用户读起来像自相矛盾。
 */
function describePalaceHits(split) {
  if (!split.owned.length && !split.shared.length) return '无刑、冲、害、空亡';
  if (split.owned.length && split.shared.length) {
    return describeHits(split.owned) + '；另与别宫共见 ' + describeHits(split.shared);
  }
  if (split.owned.length) return describeHits(split.owned);
  return '本宫本身没有独立的刑、冲、害、空亡，但与别宫共见 ' + describeHits(split.shared)
    + '，影响会从那一宫传过来';
}

/**
 * 宫位判词的后半句：告诉用户该回想哪一类事，不念规则编号，也不重复程度档。
 * 程度档由条目的 tier 字段单独展示。
 */
function palaceTail(position, tier, split) {
  const topic = position === 'month'
    ? '父母、长辈，以及你从小长大的那个家'
    : position === 'hour'
      ? '子女、晚辈、下属，以及你自己做出来的成果和投出去的钱'
      : '这一宫对应的人与事';
  if (tier === TIER_HEAVY) {
    return '这一宫既逢空亡又逢刑冲，变动往往不是吵一架就过去的。'
      + '请回想' + topic + '，有没有一次搬家、分开、换人接手，或职责被整个换掉。';
  }
  if (!split.owned.length && split.shared.length) {
    return '请顺着这处共见的关系，回想' + topic + '是否跟着另一宫一起动过，'
      + '而不是只在这一宫里找一件独立的事。';
  }
  if (tier === TIER_MEDIUM) {
    return '请回想' + topic + '，有没有一次说得清年份的变动：分开、搬家、换人，或职责换手。'
      + '一时拌嘴、过两天就和好的，不算这一条。';
  }
  return '这一宫没有刑、冲、害、空亡。请回想' + topic
    + '是否大体按原来的方式延续，没有一次被整个换掉。没有冲击，也不等于这段关系顺利。';
}

/** 夫妻宫（日支）条目：除了刑冲破害空亡，也把六合／三合／半合作为结构一并列出。 */
function spousePalaceItem(relations, ruleSet) {
  const hits = structuralHits(relations, 'day');
  const bonds = relationHits(relations, { kinds: ['combine', 'trine', 'half-trine'], position: 'day' });
  const tier = tierOf(hits);
  const split = splitByOwnership(hits, 'day');
  const bondSplit = splitByOwnership(bonds, 'day');
  const parts = [];
  parts.push(describePalaceHits(split));
  if (bonds.length) {
    parts.push('另有 ' + (bondSplit.owned.length ? describeHits(bondSplit.owned) : '无独立命中')
      + (bondSplit.shared.length ? '，与别宫共见 ' + describeHits(bondSplit.shared) : ''));
  }
  const tail = spouseTail(tier, split, bonds);
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

/** 夫妻宫核对方向：婚姻、长期伴侣、一起做事的合作关系。 */
function spouseTail(tier, split, bonds) {
  const topic = '婚姻、长期伴侣，或一起做事、一起担责任的合作关系';
  if (tier === TIER_HEAVY) {
    return '这一宫既逢空亡又逢刑冲。请回想' + topic + '里，有没有一次分开、名分变化，或合作被整个拆掉。';
  }
  if (!split.owned.length && split.shared.length) {
    return '请顺着这处共见的关系，回想' + topic + '是否跟着另一宫一起动过。';
  }
  if (tier === TIER_MEDIUM) {
    return '请回想' + topic + '里，有没有一次说得清时间的分开、冷淡变长期，或合作换人。'
      + '吵完就和好的，不算这一条。';
  }
  if (bonds.length) {
    return '这一宫没有刑、冲、害、空亡，看到的是合。请回想' + topic
      + '是否更像长期绑在一起，而不是一次被拆开。合在一起，也不等于这段关系顺利。';
  }
  return '这一宫没有刑、冲、害、空亡。请回想' + topic + '是否大体按原来的方式延续。没有冲击，也不等于顺利。';
}

/**
 * 十神类别 → 你可以核对的事。
 * 只给方向，不判吉凶，不指认具体的人和年份。
 */
const CATEGORY_TOPICS = Object.freeze({
  财: '钱从哪来、收入是否稳定、你靠什么吃饭',
  官: '职位、考核、上司与规矩、你被别人管到什么程度',
  印: '学习、证件、长辈照应，以及有没有人在背后托你',
  食伤: '你做出来的东西、说出去的话、手艺和表达有没有人接',
  比劫: '同辈、同事、兄弟姐妹之间的比较，以及钱或机会被分走'
});

function categoryTopic(category) {
  return CATEGORY_TOPICS[category] ?? '这一类对应的事';
}

/** 父母宫天干十神：月干相对日干。 */
function monthTenGodItem(pillars, ruleSet) {
  const dayStem = pillars.day[0];
  const name = tenGod(dayStem, pillars.month[0], ruleSet);
  const category = tenGodCategory(name);
  return {
    id: 'month-ten-god',
    statement: '父母宫（月柱 ' + pillars.month + '）天干是 ' + name + '，落在' + (category ?? '十神') + '这一类。'
      + '请回想父母和长辈，是不是更多从「' + categoryTopic(category) + '」这件事上影响你：'
      + '帮你、压你，或让你不得不跟着做。这一条只看方向，不判断这段关系好不好；'
      + '地支那一条看的是有没有一次被换掉，两条合在一起读。',
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
  const qiTail = relation === '月令克日主'
    ? '请回想：是不是常常先被环境压住，得扛过一段，事情才开始按你的方式走。'
    : relation === '日主克月令'
      ? '请回想：是不是常常得自己先动手把局面撑开，环境不会自动让出位置。'
      : relation === '月令生日主'
        ? '请回想：成长环境里，是不是常有现成的条件或人在托你，你不用从零开始争。'
        : relation === '日主生月令'
          ? '请回想：是不是常常先把自己的时间、钱或精力交出去，事情才转得动。'
          : relation === '同气比助'
            ? '请回想：身边是不是常有和你站在同一边的人，事情靠互相帮衬往前走。'
            : '这一条的生克方向未能判定，请不要用它核对具体经历。';
  return {
    id: 'month-qi',
    statement: '日主 ' + pillars.day[0] + '（' + (dayElement ?? '—') + '）生于 ' + pillars.month[1]
      + ' 月（' + (monthElement ?? '—') + '），月令与日主为「' + (relation ?? '未判定') + '」。'
      + qiTail
      + '这一条只说明你和成长环境谁在推、谁在压，不判断你强还是弱。',
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
  const leaders = Object.keys(counts).filter(function (k) { return counts[k] === peak && peak > 0; });
  const focus = leaders.length
    ? '核对时先看最密的一类：' + leaders.map(function (k) { return k + '（' + categoryTopic(k) + '）'; }).join('、') + '。'
    : '五类都没有落点，这一条先不要用来核对具体经历。';
  return {
    id: 'ten-god-structure',
    statement: '十神分布（按四柱天干与地支本气计）：' + tally + '。'
      + focus
      + (absent.length
        ? '盘面上没直接落到' + absent.join('、') + '，核对时别拿缺的这一类当主线；不是说你人生里没有这些事。'
        : '五类都有落点。'),
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
  const age = luck.startAgeYears;
  const wholeAge = Math.floor(age);
  const startYear = Number(chart.input.year) + wholeAge;
  const first = luck.pillars[0];
  const direction = luck.direction === 1 ? '顺行' : '逆行';
  const ask = wholeAge <= 6
    ? '家里有没有搬家，或换过照看你的人'
    : wholeAge <= 12
      ? '有没有转学、搬家，或家里谁开始长年不在身边'
      : wholeAge <= 18
        ? '有没有转学、住校、离家，或家里的生活节奏整个换过'
        : '有没有升学、离家、换城市或换一份维持生活的事';
  return {
    id: 'luck-start',
    statement: '大运' + direction + '，起运 ' + age.toFixed(2) + ' 岁，'
      + '约在 ' + startYear + ' 年前后交入第一步大运 ' + first + '。'
      + '那一年你大约 ' + wholeAge + ' 岁。请回想前后一两年：' + ask + '。',
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
    statement: '从 ' + from + ' 到 ' + asOfYear + '，'
      + top[0] + '这一类反复出现 ' + years.length + ' 次，年份是 ' + years.join('、') + '（对应 ' + names + '）。'
      + '请逐个年份回想「' + categoryTopic(top[0]) + '」：是不是同一类事在这些年份里又被推到你面前。'
      + '如果这些年份你想起的完全是另一类事，先回去核对出生时辰。',
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
