/**
 * 紫微斗数杂曜层（L3 盘系层）
 * ---------------------------------------------------------------------------
 * 安 38 颗杂曜：年系、月系、日系、时系四组，加上红鸾天喜与命主身主。
 * 与 stars.js 的分工：stars.js 管十四主星与十四辅星（决定盘面骨架），
 * 本文件管「加出来才准」的细节星，两者都只做算术，口诀与对照表在规则集里。
 *
 * 为什么杂曜值得单列一层：
 *   主星决定格局，杂曜决定细节。少了杂曜，同一张盘上「哪一年容易动、
 *   哪一宫带桃花、哪一宫主孤克」这类问题就没有事实可引，
 *   解读层只能靠猜 —— 那正是本工程要避免的事。
 *
 * 索引一律为寅基（0=寅），与 palace.js 一致。三处容易写错的地方在此声明：
 *   1. 日系星用「日序」而不是农历日：日序 = 晚子时取当日，其余时辰取前一日。
 *   2. 年系星里的「天伤、天使」按宫位（交友宫、疾厄宫）定位，不按地支。
 *   3. 台辅、封诰取时辰时，晚子归子（与早子同宫），而不是顺延一位。
 *
 * 与旧规则集的关系：0.1.0 不声明杂曜表。缺表时**整组跳过并返回空数组**，
 * 而不是抛错 —— 「换规则集」对引擎必须透明，引擎不该知道哪个版本有杂曜。
 */
import { fixIndex, stemsOf, branchIndexOf, palaceIndexOf } from './palace.js';
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';

const RULE_SET = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);

/** 从已安好的星表里取某颗星的宫位；缺失即规则集与安星表不一致，属缺陷。 */
function palaceOfStar(name, stars) {
  const star = stars.find((s) => s.name === name);
  if (!star) throw new Error('minor star depends on an unplaced star: ' + name);
  return fixIndex(star.palaceIndex);
}

/**
 * 安 38 颗杂曜。
 *
 * @param {object} input
 *   yearStem / yearBranch —— 农历年干支（紫微以正月初一换年）
 *   monthIndex           —— 生月宫索引（寅基，已含闰月切分修正）
 *   timeIndex            —— 0..12 十三值时辰（12 为晚子）
 *   lunarDay             —— 农历日数（民用日，不因晚子进日）
 *   soulIndex / bodyIndex—— 命宫与身宫索引（寅基）
 *   stars                —— 已安好的主星与辅星（用于取左辅右弼文昌文曲的宫位）
 * @returns {Array} 每颗杂曜 { name, palaceIndex, tier, group, ruleId }
 */
export function minorStars({
  yearStem, yearBranch, monthIndex, timeIndex, lunarDay, soulIndex, bodyIndex, stars = [], ruleSet = RULE_SET()
}) {
  const t = ruleSet.tables;
  const out = [];
  const push = (name, palaceIndex, group, ruleId) => out.push(Object.freeze({
    name, palaceIndex: fixIndex(palaceIndex), tier: 'minor', group, ruleId
  }));

  const branchIndex = branchIndexOf(yearBranch, ruleSet);
  const stemIndex = stemsOf(ruleSet).indexOf(yearStem);
  if (stemIndex < 0) throw new Error('unknown year stem: ' + yearStem);
  const hourBranchIndex = fixIndex(timeIndex, 12);

  // ---- 年系（26 颗）--------------------------------------------------------
  const y = t.yearMinorRule;
  if (y) {
    const hx = y.huagaiXianchi[yearBranch];
    const gg = y.guchenGuasu[yearBranch];
    if (!hx || !gg) throw new Error('unknown year branch for year minor stars: ' + yearBranch);
    push('华盖', palaceIndexOf(hx[0], ruleSet), 'year', y.ruleId);
    push('咸池', palaceIndexOf(hx[1], ruleSet), 'year', y.ruleId);
    push('孤辰', palaceIndexOf(gg[0], ruleSet), 'year', y.ruleId);
    push('寡宿', palaceIndexOf(gg[1], ruleSet), 'year', y.ruleId);
    // 天才、天寿：以命宫、身宫为起点，加年支的子基序号（不是宫位序号）。
    push('天才', soulIndex + branchIndex, 'year', y.ruleId);
    push('天寿', bodyIndex + branchIndex, 'year', y.ruleId);
    push('天厨', palaceIndexOf(y.tianchuByStem[stemIndex], ruleSet), 'year', y.ruleId);
    push('破碎', palaceIndexOf(y.posuiByBranchMod3[branchIndex % 3], ruleSet), 'year', y.ruleId);
    push('蜚廉', palaceIndexOf(y.feilianByBranch[branchIndex], ruleSet), 'year', y.ruleId);
    push('龙池', palaceIndexOf(y.bases.longchi, ruleSet) + branchIndex, 'year', y.ruleId);
    push('凤阁', palaceIndexOf(y.bases.fengge, ruleSet) - branchIndex, 'year', y.ruleId);
    push('天哭', palaceIndexOf(y.bases.tianku, ruleSet) - branchIndex, 'year', y.ruleId);
    push('天虚', palaceIndexOf(y.bases.tianxu, ruleSet) + branchIndex, 'year', y.ruleId);
    push('天官', palaceIndexOf(y.tianguanByStem[stemIndex], ruleSet), 'year', y.ruleId);
    push('天福', palaceIndexOf(y.tianfuByStem[stemIndex], ruleSet), 'year', y.ruleId);
    push('天德', palaceIndexOf(y.bases.tiande, ruleSet) + branchIndex, 'year', y.ruleId);
    push('月德', palaceIndexOf(y.bases.yuede, ruleSet) + branchIndex, 'year', y.ruleId);
    push('天空', palaceIndexOf(yearBranch, ruleSet) + y.tiankongOffset, 'year', y.ruleId);
    push('截路', palaceIndexOf(y.jieluByStemMod5[stemIndex % 5], ruleSet), 'year', y.ruleId);
    push('空亡', palaceIndexOf(y.kongwangByStemMod5[stemIndex % 5], ruleSet), 'year', y.ruleId);
    // 旬空：先自年支宫推一位基准，再用「年支与旬空必须同奇偶」修正。
    // 修正的是**奇偶性**而不是固定加一，少了这一步会有半数年份落在错宫。
    let xunkong = palaceIndexOf(yearBranch, ruleSet) + stemsOf(ruleSet).indexOf(y.xunkongAnchorStem) - stemIndex + 1;
    xunkong = fixIndex(xunkong);
    if (branchIndex % 2 !== xunkong % 2) xunkong = fixIndex(xunkong + 1);
    push('旬空', xunkong, 'year', y.ruleId);
    push('年解', palaceIndexOf(y.nianjieByBranch[branchIndex], ruleSet), 'year', y.ruleId);
    // 天伤、天使固定在交友宫与疾厄宫，随命宫移动，与年支无关。
    push('天伤', soulIndex + y.tianShangPalaceOffset, 'year', y.ruleId);
    push('天使', soulIndex + y.tianShiPalaceOffset, 'year', y.ruleId);
  }

  // ---- 月系（6 颗）---------------------------------------------------------
  const m = t.monthMinorRule;
  if (m) {
    push('解神', palaceIndexOf(m.yuejieByMonthHalf[Math.floor(monthIndex / 2)], ruleSet), 'month', m.ruleId);
    push('天姚', palaceIndexOf(m.tianyaoBase, ruleSet) + monthIndex, 'month', m.ruleId);
    push('天刑', palaceIndexOf(m.tianxingBase, ruleSet) + monthIndex, 'month', m.ruleId);
    push('阴煞', palaceIndexOf(m.yinshaByMonthMod6[monthIndex % 6], ruleSet), 'month', m.ruleId);
    push('天月', palaceIndexOf(m.tianyueByMonth[monthIndex], ruleSet), 'month', m.ruleId);
    push('天巫', palaceIndexOf(m.tianwuByMonthMod4[monthIndex % 4], ruleSet), 'month', m.ruleId);
  }

  // ---- 日系（4 颗）---------------------------------------------------------
  // 日序不是农历日：晚子时用当日，其余时辰用前一日 —— 这一位之差会让四颗星整体错宫。
  const d = t.dayMinorRule;
  if (d) {
    const dayIndex = timeIndex === (ruleSet.parameters.lateZiTimeIndex ?? 12)
      ? Number(lunarDay) + d.dayIndexLateZiOffset
      : Number(lunarDay) + d.dayIndexOtherOffset;
    push('三台', palaceOfStar(d.santaiFrom === 'zuofu' ? '左辅' : d.santaiFrom, stars) + dayIndex, 'day', d.ruleId);
    push('八座', palaceOfStar(d.bazuoFrom === 'youbi' ? '右弼' : d.bazuoFrom, stars) - dayIndex, 'day', d.ruleId);
    push('恩光', palaceOfStar(d.enguangFrom === 'wenchang' ? '文昌' : d.enguangFrom, stars) + dayIndex + d.enguangOffset, 'day', d.ruleId);
    push('天贵', palaceOfStar(d.tianguiFrom === 'wenqu' ? '文曲' : d.tianguiFrom, stars) + dayIndex + d.tianguiOffset, 'day', d.ruleId);
  }

  // ---- 时系（2 颗）---------------------------------------------------------
  const h = t.hourMinorRule;
  if (h) {
    push('台辅', palaceIndexOf(h.taifuBase, ruleSet) + h.direction * hourBranchIndex, 'hour', h.ruleId);
    push('封诰', palaceIndexOf(h.fenggaoBase, ruleSet) + h.direction * hourBranchIndex, 'hour', h.ruleId);
  }

  // ---- 红鸾天喜（2 颗）-----------------------------------------------------
  // 归在「年系」而不是「时系」：它们只随年支走，与时辰无关。
  const lx = t.hongluanTianxiRule;
  if (lx) {
    const hongluan = palaceIndexOf(lx.hongluanBase, ruleSet) + lx.direction * branchIndex;
    push('红鸾', hongluan, 'year', lx.ruleId);
    push('天喜', hongluan + lx.tianxiOffset, 'year', lx.ruleId);
  }

  return out;
}

/**
 * 命主与身主。
 *
 * 两个「取哪一支」的口径不同，这是本函数最容易写错的地方，故显式写死：
 *   命主取**命宫地支**的 [0] 位（子贪狼、丑亥巨门、寅戌禄存、卯酉文曲、
 *     辰申廉贞、巳未武曲、午破军）；
 *   身主取**生年地支**的 [1] 位（子午火星、丑未天相、寅申天梁、卯酉天同、
 *     辰戌文昌、巳亥天机）—— 是生年支，不是身宫支。
 * 两者都是「查表」而不是算术，因此表放在规则集里，换派只需换表。
 * 规则集未登记该规则时返回 null（0.1.0 就没有），而不是抛错。
 */
export function soulBodyMaster({ soulBranch, yearBranch, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.soulBodyMasterRule;
  if (!rule) return null;
  const soulEntry = rule.table[soulBranch];
  const bodyEntry = rule.table[yearBranch];
  if (!soulEntry || !bodyEntry) throw new Error('unknown branch for soul/body master: ' + soulBranch + '/' + yearBranch);
  return Object.freeze({
    soulMaster: soulEntry[0],
    bodyMaster: bodyEntry[1],
    soulBranch,
    yearBranch,
    ruleId: rule.ruleId
  });
}
