/**
 * 紫微斗数安星层（L3 盘系层）
 * ---------------------------------------------------------------------------
 * 安十四主星、十四辅星与生年四化。所有起宫口诀、偏移量与对照表均来自
 * rules/ziwei-core-0.2.0（默认）或 0.1.0，本文件只做算术，不内嵌任何流派字面量。
 *
 * 十四辅星的构成（与规则集 sources 的声明一致，不多不少）：
 *   六吉 —— 左辅、右弼、文昌、文曲、天魁、天钺
 *   六煞 —— 擎羊、陀罗、火星、铃星、地空、地劫
 *   禄马 —— 禄存、天马
 * 其余年系/月系/日系/时系杂曜属下一版范围，见 ADR-0005 的「未纳入」一节：
 * 宁可先少安星，也不安一颗出处存疑的星。
 *
 * 索引一律为寅基（0=寅），与 palace.js 保持一致。
 */
import { fixIndex, stemsOf, branchesOf, branchIndexOf, palaceIndexOf, palaceBranch } from './palace.js';
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';

const RULE_SET = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);

/**
 * 紫微星与天府星的宫位索引。
 *   起紫微：以农历日数（晚子进一日）为被除数，逐次加偏移量直到能被五行局数整除，
 *           商即宫位，偏移量为偶数则顺加、奇数则逆减 —— 这一「奇逆偶顺」是起紫微诀的关键，
 *           写成「商 ± 偏移」会整体错位。
 *   起天府：天府与紫微以寅申轴对称，索引和为 12。
 */
export function ziweiTianfuIndex({ lunarDay, monthDays, timeIndex, fiveElementsValue, ruleSet = RULE_SET() }) {
  const params = ruleSet.parameters;
  const lateZiIndex = params.lateZiTimeIndex ?? 12;
  const dayDivide = params.lateZiDayMode ?? 'next-day';
  let day = Number(lunarDay);
  if (timeIndex === lateZiIndex && dayDivide === 'next-day') day += 1;
  if (day > monthDays) day -= monthDays;

  const divisorBase = Number(fiveElementsValue);
  if (!Number.isInteger(divisorBase) || divisorBase <= 0) throw new Error('invalid five elements value: ' + fiveElementsValue);

  let offset = -1;
  let quotient = 0;
  let remainder = 1;
  while (remainder !== 0) {
    offset += 1;
    const divisor = day + offset;
    quotient = Math.floor(divisor / divisorBase);
    remainder = divisor % divisorBase;
    if (offset > 12 * divisorBase + 12) throw new Error('failed to locate ziwei star');
  }

  quotient %= 12;
  let ziweiIndex = quotient - 1;
  ziweiIndex = offset % 2 === 0 ? ziweiIndex + offset : ziweiIndex - offset;
  ziweiIndex = fixIndex(ziweiIndex);
  const mirrorSum = ruleSet.tables.majorStarRule.mirrorSum ?? 12;
  return { ziweiIndex, tianfuIndex: fixIndex(mirrorSum - ziweiIndex), day, offset, quotient };
}

/**
 * 十四主星。
 *   紫微星系自紫微逆行（direction = -1），天府星系自天府顺行（direction = +1）。
 *   星系表里的 null 是空位 —— 保留空位才能让「第 i 项」与「第 i 宫」严格对应，
 *   压缩掉空位会让太阳、武曲等星整体偏移。
 */
export function majorStars({ ziweiIndex, tianfuIndex, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.majorStarRule;
  const out = [];
  rule.ziweiSeries.forEach((name, i) => {
    if (!name) return;
    out.push({ name, palaceIndex: fixIndex(ziweiIndex + rule.ziweiDirection * i), tier: 'major', series: 'ziwei', order: i });
  });
  rule.tianfuSeries.forEach((name, i) => {
    if (!name) return;
    out.push({ name, palaceIndex: fixIndex(tianfuIndex + rule.tianfuDirection * i), tier: 'major', series: 'tianfu', order: i });
  });
  return out;
}

/**
 * 十四辅星。
 * 每颗星各自的口诀不同，但都归结为「某宫起某数，顺数或逆数至生月/生时」：
 * 把「起宫」与「方向」都放进规则集，算法只做 fixIndex(base + direction * step)。
 */
export function auxiliaryStars({
  yearStem, yearBranch, monthIndex, timeIndex, ruleSet = RULE_SET()
}) {
  const t = ruleSet.tables;
  const out = [];
  const push = (name, palaceIndex, group, ruleId) => out.push({ name, palaceIndex: fixIndex(palaceIndex), tier: 'auxiliary', group, ruleId });

  // 禄存 + 擎羊 + 陀罗：同一「禄位」派生的三颗星，禄前一位擎羊、禄后一位陀罗。
  const lucunBranch = t.lucunRule.table[yearStem];
  if (!lucunBranch) throw new Error('unknown year stem for lucun: ' + yearStem);
  const lucunIndex = palaceIndexOf(lucunBranch, ruleSet);
  push('禄存', lucunIndex, 'lu-ma', t.lucunRule.ruleId);
  push('擎羊', lucunIndex + t.lucunRule.yangOffset, 'sha', t.lucunRule.ruleId);
  push('陀罗', lucunIndex + t.lucunRule.tuoOffset, 'sha', t.lucunRule.ruleId);

  // 天马：按年支三合，落在三合局的「驿马」位。
  const tianmaBranch = t.tianmaRule.table[yearBranch];
  if (!tianmaBranch) throw new Error('unknown year branch for tianma: ' + yearBranch);
  push('天马', palaceIndexOf(tianmaBranch, ruleSet), 'lu-ma', t.tianmaRule.ruleId);

  // 天魁天钺：按年干定，成对出现，一前一后。
  const kuiyue = t.kuiyueRule.table[yearStem];
  if (!kuiyue) throw new Error('unknown year stem for kuiyue: ' + yearStem);
  push('天魁', palaceIndexOf(kuiyue[0], ruleSet), 'ji', t.kuiyueRule.ruleId);
  push('天钺', palaceIndexOf(kuiyue[1], ruleSet), 'ji', t.kuiyueRule.ruleId);

  // 左辅右弼：按生月（已含闰月修正）自辰、戌起分道顺逆。
  const zuoBase = palaceIndexOf(t.zuoyouRule.zuoBase, ruleSet);
  const youBase = palaceIndexOf(t.zuoyouRule.youBase, ruleSet);
  push('左辅', zuoBase + t.zuoyouRule.zuoDirection * monthIndex, 'ji', t.zuoyouRule.ruleId);
  push('右弼', youBase + t.zuoyouRule.youDirection * monthIndex, 'ji', t.zuoyouRule.ruleId);

  // 文昌文曲：按生时自戌、辰起分道顺逆。时支取 fixIndex(timeIndex,12)，晚子与早子同宫。
  const hourBranch = fixIndex(timeIndex, 12);
  const changBase = palaceIndexOf(t.wenchangWenquRule.changBase, ruleSet);
  const quBase = palaceIndexOf(t.wenchangWenquRule.quBase, ruleSet);
  push('文昌', changBase + t.wenchangWenquRule.changDirection * hourBranch, 'ji', t.wenchangWenquRule.ruleId);
  push('文曲', quBase + t.wenchangWenquRule.quDirection * hourBranch, 'ji', t.wenchangWenquRule.ruleId);

  // 地空地劫：按生时自亥起分道顺逆。
  const kongBase = palaceIndexOf(t.dikongDijieRule.base, ruleSet);
  push('地劫', kongBase + t.dikongDijieRule.jieDirection * hourBranch, 'sha', t.dikongDijieRule.ruleId);
  push('地空', kongBase + t.dikongDijieRule.kongDirection * hourBranch, 'sha', t.dikongDijieRule.ruleId);

  // 火星铃星：先按年支三合定「子时起宫」，再自该宫顺数至生时。
  const huoling = t.huolingRule.table[yearBranch];
  if (!huoling) throw new Error('unknown year branch for huoling: ' + yearBranch);
  push('火星', palaceIndexOf(huoling[0], ruleSet) + hourBranch, 'sha', t.huolingRule.ruleId);
  push('铃星', palaceIndexOf(huoling[1], ruleSet) + hourBranch, 'sha', t.huolingRule.ruleId);

  return out;
}

/**
 * 生年四化。
 * 四化落在哪一宫由「该星被安在哪一宫」决定，因此必须在安星之后调用。
 * 四化星可能是主星（廉贞、破军…）也可能是辅星（文昌、文曲、左辅、右弼），
 * 找不到对应星时不静默跳过 —— 那意味着规则集与安星表不一致，属于缺陷。
 */
export function mutagen({ yearStem, stars, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.mutagenRule;
  const names = rule.table[yearStem];
  if (!names) throw new Error('unknown year stem for mutagen: ' + yearStem);
  const byName = new Map(stars.map((s) => [s.name, s]));
  return rule.order.map((mutagenName, i) => {
    const starName = names[i];
    const star = byName.get(starName);
    if (!star) throw new Error('mutagen star not placed on chart: ' + starName + ' (' + yearStem + mutagenName + ')');
    return Object.freeze({
      name: starName,
      mutagen: mutagenName,
      palaceIndex: star.palaceIndex,
      branch: palaceBranch(star.palaceIndex, ruleSet),
      ruleId: rule.ruleId
    });
  });
}

/**
 * 把星按宫聚合：每个宫位拿到自己的星列表。
 * 这是「盘」而不是「星表」的转换点 —— 解读层要问的是「某宫有哪些星」，
 * 而不是「某星在哪一宫」，因此在这里就按宫索引归位，避免上层反复扫描。
 * 宫内星曜按规则集的 starOrder 排序，保证输出顺序确定、可逐宫比对。
 */
export function starsByPalace(stars, ruleSet = RULE_SET()) {
  const order = ruleSet.tables.starOrder?.order ?? [];
  const rank = new Map(order.map((name, i) => [name, i]));
  const palaces = Array.from({ length: 12 }, (_, i) => ({ palaceIndex: i, branch: palaceBranch(i, ruleSet), stars: [] }));
  for (const star of stars) palaces[fixIndex(star.palaceIndex)].stars.push(star);
  for (const palace of palaces) {
    palace.stars.sort((a, b) => (rank.get(a.name) ?? 99) - (rank.get(b.name) ?? 99));
  }
  return palaces;
}
