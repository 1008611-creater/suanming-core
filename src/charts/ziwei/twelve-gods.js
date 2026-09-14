/**
 * 紫微斗数十二神层（L3 盘系层）
 * ---------------------------------------------------------------------------
 * 四组十二神：长生十二神、博士十二神、将前十二神、岁前十二神。
 *
 * 为什么要把「神」和「星」分开：
 *   星曜回答「这宫有什么」，十二神回答「这宫处在什么阶段」。
 *   长生十二神给的是宫气的生旺衰绝，博士十二神给的是年干带来的贵贱起伏，
 *   将前与岁前十二神给的是年支带来的岁运神煞。四者起点与顺逆各不相同，
 *   混在一起算必然错位，因此各自独立成函数、各自从规则集取起宫与方向。
 *
 * 顺逆只有两类：
 *   1. 随性别与年支阴阳（长生、博士）：阳男阴女顺行，阴男阳女逆行。
 *   2. 一律顺行（将前、岁前）。
 * 把「方向」写死在代码里会让换派变成改代码，因此方向常量也在规则集里。
 *
 * 与旧规则集的关系：0.1.0 不声明十二神表。缺表时该组返回 null，
 * 而不是抛错或退回一套内置默认值 —— 内置默认值会让「换规则集」看起来生效、
 * 实际仍用旧口径，这是比缺字段更危险的失败模式。
 *
 * 索引一律为寅基（0=寅），与 palace.js 一致。
 */
import { fixIndex, branchIndexOf, palaceIndexOf } from './palace.js';
import { getRuleSet, DEFAULT_ZIWEI_RULE_SET } from '../../../rules/index.js';

const RULE_SET = () => getRuleSet(DEFAULT_ZIWEI_RULE_SET);

/**
 * 由性别与年支阴阳求顺逆。
 *   年支阴阳按子基序号的奇偶：子（0）为阳、丑（1）为阴，依次相间。
 *   顺逆不是「男顺女逆」，而是「同性相合则顺」——
 *   阴年男命与阳年女命都是逆行，写成「男顺女逆」会在半数盘上整体反向。
 */
function directionOf({ gender, yearBranch, rule, ruleSet }) {
  const genderPolarity = rule.genderPolarity?.[gender];
  if (!genderPolarity) throw new Error('unknown gender: ' + gender);
  const branchIndex = branchIndexOf(yearBranch, ruleSet);
  const branchPolarity = branchIndex % 2 === 0 ? rule.branchPolarity.even : rule.branchPolarity.odd;
  const direction = genderPolarity === branchPolarity ? rule.direction.same : rule.direction.opposite;
  return { direction, genderPolarity, branchPolarity };
}

/** 按「起宫 + 顺序 + 方向」铺满十二宫，返回长度 12 的数组（下标即宫位索引）。 */
function spread({ startIndex, order, direction }) {
  const gods = Array.from({ length: 12 }, () => null);
  order.forEach((name, i) => {
    gods[fixIndex(startIndex + direction * i)] = name;
  });
  return Object.freeze(gods);
}

/**
 * 长生十二神：起宫由五行局决定，顺逆由性别与年支阴阳决定。
 * 规则集未登记该组时返回 null。
 */
export function changsheng12({ fiveElementsValue, yearBranch, gender, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.changshengRule;
  if (!rule) return null;
  const startBranch = rule.startByClass[fiveElementsValue];
  if (!startBranch) throw new Error('unknown five elements class for changsheng12: ' + fiveElementsValue);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  const { direction, genderPolarity, branchPolarity } = directionOf({ gender, yearBranch, rule, ruleSet });
  return Object.freeze({
    startBranch, startIndex, direction, genderPolarity, branchPolarity,
    order: rule.order, gods: spread({ startIndex, order: rule.order, direction })
  });
}

/**
 * 博士十二神：起宫固定为禄存所在宫，方向与长生十二神同一口径。
 * 起点取禄存的实际落宫而不是重新查年干 —— 两处各查一次，早晚会漂移。
 */
export function boshi12({ stars, yearBranch, gender, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.boshiRule;
  if (!rule) return null;
  const lucun = stars.find((s) => s.name === rule.startFrom);
  if (!lucun) throw new Error('boshi12 depends on an unplaced star: ' + rule.startFrom);
  const startIndex = fixIndex(lucun.palaceIndex);
  const { direction, genderPolarity, branchPolarity } = directionOf({ gender, yearBranch, rule, ruleSet });
  return Object.freeze({
    startFrom: rule.startFrom, startIndex, direction, genderPolarity, branchPolarity,
    order: rule.order, gods: spread({ startIndex, order: rule.order, direction })
  });
}

/**
 * 将前十二神：起宫按年支三合，一律顺行，与性别无关。
 * 三合局的「将星」位就是该局的帝旺位（寅午戌在午、申子辰在子、巳酉丑在酉、亥卯未在卯）。
 */
export function jiangqian12({ yearBranch, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.jiangqianRule;
  if (!rule) return null;
  const startBranch = rule.startTable[yearBranch];
  if (!startBranch) throw new Error('unknown year branch for jiangqian12: ' + yearBranch);
  const startIndex = palaceIndexOf(startBranch, ruleSet);
  return Object.freeze({
    startBranch, startIndex, direction: rule.direction,
    order: rule.order, gods: spread({ startIndex, order: rule.order, direction: rule.direction })
  });
}

/**
 * 岁前十二神：起宫为年支本宫，一律顺行，与性别无关。
 * 第七位通行派作「大耗」、中州派作「岁破」；本规则集只登记通行派，
 * 换派 = 换规则集，不改这里。
 */
export function suiqian12({ yearBranch, ruleSet = RULE_SET() }) {
  const rule = ruleSet.tables.suiqianRule;
  if (!rule) return null;
  const startIndex = palaceIndexOf(yearBranch, ruleSet);
  return Object.freeze({
    startBranch: yearBranch, startIndex, direction: rule.direction,
    order: rule.order, gods: spread({ startIndex, order: rule.order, direction: rule.direction })
  });
}

/**
 * 四组十二神一次算齐。
 * 长生与博士需要性别（顺逆随性别），未提供性别时这两组为 null；
 * 将前与岁前只随年支，任何情况下都有值。旧规则集缺表时对应组为 null。
 */
export function twelveGods({ fiveElementsValue, yearBranch, gender, stars = [], ruleSet = RULE_SET() }) {
  return Object.freeze({
    changsheng: gender ? changsheng12({ fiveElementsValue, yearBranch, gender, ruleSet }) : null,
    boshi: gender ? boshi12({ stars, yearBranch, gender, ruleSet }) : null,
    jiangqian: jiangqian12({ yearBranch, ruleSet }),
    suiqian: suiqian12({ yearBranch, ruleSet })
  });
}
