import { getRuleSet } from '../../rules/index.js';

/**
 * 地支关系派生（L4 派生层）
 * ---------------------------------------------------------------------------
 * 输入：四柱（L3 的确定性输出）+ 规则集；输出：六冲、六合、三合与半合、
 * 相刑（含自刑）、相害、空亡的命中清单。
 *
 * 三条纪律：
 *   1. 纯确定性：不读当前时间、不用随机数、不看系统时区。同输入必得同输出。
 *   2. 缺表即整组跳过：规则集没有对应表格时该组进 skipped，绝不内嵌「备用表」补默认值。
 *   3. 只描述结构、不判吉凶：程度分档与措辞属于解释层（interpret/past-events.js）。
 *
 * 宫位口径：本文件只输出位置（year/month/day/hour）。四柱到宫位的映射
 * （月支为父母宫、日支为夫妻宫、时支为子女宫）是解释层口径，不写进结构派生，
 * 免得「结构」与「解读」两层混成一份无法审计的中间物。
 */

export const PILLAR_ORDER = ['year', 'month', 'day', 'hour'];
export const PILLAR_LABELS = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };

/** 分组顺序：输出 groups 的键顺序与之一致。 */
export const RELATION_GROUPS = ['clash', 'combine', 'trine', 'punishment', 'harm', 'void'];

/** 命中类型：trine 为三合全、half-trine 为半合；punishment 为相刑、self-punishment 为自刑。 */
export const RELATION_KINDS = [
  'clash', 'combine', 'trine', 'half-trine', 'punishment', 'self-punishment', 'harm', 'void'
];

/** 分组 → 规则集 tables 中的表名。表名缺失即整组跳过。 */
const GROUP_TABLE_KEYS = {
  clash: 'branchClashRule',
  combine: 'branchCombineRule',
  trine: 'branchTrineRule',
  punishment: 'branchPunishmentRule',
  harm: 'branchHarmRule',
  void: 'xunVoidRule'
};

/** 六十甲子周期长度；旬数 = 6。 */
const CYCLE = 60;
const XUN_SIZE = 10;

function pairKey(a, b) { return a <= b ? a + b : b + a; }

function ganzhiOf(index, stems, branches) {
  const s = ((index % stems.length) + stems.length) % stems.length;
  const b = ((index % branches.length) + branches.length) % branches.length;
  return stems[s] + branches[b];
}

/**
 * 校验并规范化四柱。
 * 每柱必须是「天干 + 地支」两位，且地支必须出现在规则集的地支表里 ——
 * 地支表是唯一口径来源，表里没有的地支一律判为非法输入，不做猜测。
 */
function normalizePillars(pillars, ruleSet) {
  const branches = ruleSet.tables.branches.map(function (b) { return b.name; });
  const out = {};
  for (const position of PILLAR_ORDER) {
    const value = pillars ? pillars[position] : undefined;
    if (typeof value !== 'string' || value.length !== 2) {
      throw new Error('invalid pillar ' + position + ': ' + String(value));
    }
    if (branches.indexOf(value[1]) < 0) {
      throw new Error('invalid pillar ' + position + ': ' + value);
    }
    out[position] = value;
  }
  return out;
}

/** 地支 → 出现该地支的柱位列表（同一地支可出现在多柱）。 */
function positionsByBranch(ordered) {
  const map = new Map();
  for (const position of PILLAR_ORDER) {
    const branch = ordered[position][1];
    if (!map.has(branch)) map.set(branch, []);
    map.get(branch).push(position);
  }
  return map;
}

/**
 * 两两成对的关系：六冲、六合、相害、互刑共用这一条枚举路径。
 * 表结构：{ pairs: [{ branches:[a,b], element?, name? }] }
 * 只枚举「不同柱」的六种组合：同一柱的干与支之间不构成地支关系。
 */
function pairHits(ordered, table, kind) {
  const index = new Map();
  const pairs = Array.isArray(table.pairs) ? table.pairs : [];
  for (const entry of pairs) {
    if (!entry || !Array.isArray(entry.branches) || entry.branches.length !== 2) continue;
    index.set(pairKey(entry.branches[0], entry.branches[1]), entry);
  }
  const hits = [];
  for (let i = 0; i < PILLAR_ORDER.length; i++) {
    for (let j = i + 1; j < PILLAR_ORDER.length; j++) {
      const left = PILLAR_ORDER[i];
      const right = PILLAR_ORDER[j];
      const a = ordered[left][1];
      const b = ordered[right][1];
      const entry = index.get(pairKey(a, b));
      if (!entry) continue;
      hits.push({
        kind: kind,
        branches: [a, b],
        positions: [left, right],
        name: entry.name ? entry.name : a + b,
        element: entry.element ? entry.element : null,
        complete: true
      });
    }
  }
  return hits;
}

/**
 * 三合与半合。
 * 表结构：{ groups: [{ branches:[生,旺,墓], element }], halfTrine: 'requires-strong-branch' }
 * 半合只在规则集显式声明 halfTrine === 'requires-strong-branch' 时产出：
 *   生+旺（长生+帝旺）与 旺+墓 为半合；生+墓 只是「拱」，本实现不产出半合。
 * 未声明 halfTrine 时半合整组跳过 —— 宁可少给，也不替流派补默认值。
 */
function trineHits(ordered, table) {
  const positions = positionsByBranch(ordered);
  const allowHalf = table.halfTrine === 'requires-strong-branch';
  const hits = [];
  const groups = Array.isArray(table.groups) ? table.groups : [];
  for (const group of groups) {
    if (!group || !Array.isArray(group.branches) || group.branches.length !== 3) continue;
    const birth = group.branches[0];
    const peak = group.branches[1];
    const tomb = group.branches[2];
    const has = function (branch) { return positions.has(branch); };
    const first = function (branch) { return positions.get(branch)[0]; };
    if (has(birth) && has(peak) && has(tomb)) {
      hits.push({
        kind: 'trine',
        branches: [birth, peak, tomb],
        positions: [first(birth), first(peak), first(tomb)],
        name: group.name ? group.name : group.branches.join('') + '三合',
        element: group.element ? group.element : null,
        complete: true
      });
      continue;
    }
    if (!allowHalf) continue;
    if (has(birth) && has(peak)) {
      hits.push({
        kind: 'half-trine',
        branches: [birth, peak],
        positions: [first(birth), first(peak)],
        name: birth + peak + '半合',
        element: group.element ? group.element : null,
        complete: false
      });
    } else if (has(peak) && has(tomb)) {
      hits.push({
        kind: 'half-trine',
        branches: [peak, tomb],
        positions: [first(peak), first(tomb)],
        name: peak + tomb + '半合',
        element: group.element ? group.element : null,
        complete: false
      });
    }
  }
  return hits;
}

/**
 * 相刑与自刑。
 * 表结构：{ triads:[{name, branches:[...]}], mutual:[{branches:[a,b], name}], self:[branch...] }
 *   三刑：三者全见 → 一条 complete 命中；只见其二 → 一条 complete:false 命中。
 *   互刑：子卯之类两两相见，按柱对枚举。
 *   自刑：必须落在**两个不同柱位**上才算；同一柱只有一支，不构成自刑。
 */
function punishmentHits(ordered, table) {
  const positions = positionsByBranch(ordered);
  const hits = [];
  const triads = Array.isArray(table.triads) ? table.triads : [];
  for (const triad of triads) {
    if (!triad || !Array.isArray(triad.branches)) continue;
    const present = triad.branches.filter(function (b) { return positions.has(b); });
    if (present.length < 2) continue;
    hits.push({
      kind: 'punishment',
      branches: present.slice(),
      positions: present.map(function (b) { return positions.get(b)[0]; }),
      name: triad.name ? triad.name : present.join('') + '相刑',
      element: null,
      complete: present.length === triad.branches.length
    });
  }
  const mutual = Array.isArray(table.mutual) ? table.mutual : [];
  for (const hit of pairHits(ordered, { pairs: mutual }, 'punishment')) hits.push(hit);
  const self = Array.isArray(table.self) ? table.self : [];
  for (const branch of self) {
    const list = positions.get(branch);
    if (!list || list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        hits.push({
          kind: 'self-punishment',
          branches: [branch, branch],
          positions: [list[i], list[j]],
          name: branch + '自刑',
          element: null,
          complete: true
        });
      }
    }
  }
  return hits;
}

/**
 * 空亡（旬空）：以**日柱**在六十甲子中的位置定旬，该旬所缺的两支即空亡。
 * 表结构：{ voidByXun: [['戌','亥'], ...] }，下标 = 旬序（日柱序号 ÷ 10）。
 * 日支按构造永远不会落进自己那一旬的空亡 —— 这是旬空定义本身的结果，
 * 不是特例处理：本函数不做任何「排除日柱」的额外判断。
 * 表格缺行时返回 null，由调用方把整组记为 skipped。
 */
function voidHits(ordered, table, ruleSet) {
  const stems = ruleSet.tables.stems.map(function (s) { return s.name; });
  const branches = ruleSet.tables.branches.map(function (b) { return b.name; });
  const day = ordered.day;
  const stemIndex = stems.indexOf(day[0]);
  const branchIndex = branches.indexOf(day[1]);
  let index = -1;
  for (let i = 0; i < CYCLE; i++) {
    if (i % 10 === stemIndex && i % 12 === branchIndex) { index = i; break; }
  }
  if (index < 0) throw new Error('invalid day pillar: ' + day);
  const xunIndex = Math.floor(index / XUN_SIZE);
  const voidByXun = Array.isArray(table.voidByXun) ? table.voidByXun : [];
  const voidBranches = voidByXun[xunIndex];
  if (!Array.isArray(voidBranches) || voidBranches.length === 0) return null;
  const xun = {
    index: xunIndex,
    name: ganzhiOf(xunIndex * XUN_SIZE, stems, branches) + '旬',
    voidBranches: voidBranches.slice()
  };
  const hits = [];
  for (const position of PILLAR_ORDER) {
    const branch = ordered[position][1];
    if (voidBranches.indexOf(branch) < 0) continue;
    hits.push({
      kind: 'void',
      branches: [branch],
      positions: [position],
      name: branch + '空亡',
      element: null,
      complete: true
    });
  }
  return { xun: xun, hits: hits };
}

/** 命中排序：先按类型固定顺序，再按柱位先后，保证同输入必得同顺序。 */
function compareHits(a, b) {
  const ka = RELATION_KINDS.indexOf(a.kind);
  const kb = RELATION_KINDS.indexOf(b.kind);
  if (ka !== kb) return ka - kb;
  const n = Math.min(a.positions.length, b.positions.length);
  for (let i = 0; i < n; i++) {
    const pa = PILLAR_ORDER.indexOf(a.positions[i]);
    const pb = PILLAR_ORDER.indexOf(b.positions[i]);
    if (pa !== pb) return pa - pb;
  }
  return a.positions.length - b.positions.length;
}

/**
 * 派生一份盘的全部地支关系。
 *
 * @param {{year:string,month:string,day:string,hour:string}} pillars 四柱
 * @param {object} ruleSet 规则集；默认取四柱默认集
 * @returns {object} 冻结结构：
 *   ruleSet / dayPillar / pillarOrder / xun / groups / skipped / hits
 *   groups[group] = { ruleId, label, evidence, hits, xun? }
 *   skipped 列出规则集缺少表格而被整体跳过的分组
 */
export function deriveRelations(pillars, ruleSet = getRuleSet()) {
  const ordered = normalizePillars(pillars, ruleSet);
  const tables = ruleSet.tables || {};
  const groups = {};
  const skipped = [];
  const hits = [];

  for (const group of RELATION_GROUPS) {
    const table = tables[GROUP_TABLE_KEYS[group]];
    if (!table || typeof table !== 'object' || typeof table.ruleId !== 'string') {
      skipped.push(group);
      continue;
    }
    let groupHits = [];
    let extra = null;
    if (group === 'clash') groupHits = pairHits(ordered, table, 'clash');
    else if (group === 'combine') groupHits = pairHits(ordered, table, 'combine');
    else if (group === 'trine') groupHits = trineHits(ordered, table);
    else if (group === 'punishment') groupHits = punishmentHits(ordered, table);
    else if (group === 'harm') groupHits = pairHits(ordered, table, 'harm');
    else if (group === 'void') {
      const result = voidHits(ordered, table, ruleSet);
      if (!result) { skipped.push(group); continue; }
      groupHits = result.hits;
      extra = { xun: result.xun };
    }
    groups[group] = {
      ruleId: table.ruleId,
      label: table.label ? table.label : null,
      evidence: table.evidence ? table.evidence : null,
      hits: groupHits,
      ...(extra || {})
    };
    for (const hit of groupHits) hits.push(hit);
  }

  hits.sort(compareHits);
  return Object.freeze({
    ruleSet: ruleSet.id,
    dayPillar: ordered.day,
    pillarOrder: PILLAR_ORDER.slice(),
    xun: groups.void && groups.void.xun ? groups.void.xun : null,
    groups: Object.freeze(groups),
    skipped: Object.freeze(skipped),
    hits: Object.freeze(hits)
  });
}

/**
 * 从派生结果里筛命中，供解释层按需取用。
 * @param {object} relations deriveRelations 的输出
 * @param {object} [options] { kinds?: string|string[], position?: string }
 */
export function relationHits(relations, options = {}) {
  const kinds = options.kinds == null
    ? null
    : new Set(Array.isArray(options.kinds) ? options.kinds : [options.kinds]);
  const position = options.position == null ? null : options.position;
  return (relations && relations.hits ? relations.hits : []).filter(function (hit) {
    if (kinds && !kinds.has(hit.kind)) return false;
    if (position && hit.positions.indexOf(position) < 0) return false;
    return true;
  });
}
