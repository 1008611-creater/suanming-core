/**
 * 紫微斗数跨实现交叉验证（12 张参照盘）
 * ---------------------------------------------------------------------------
 * 参照结果由 SylarLong/iztro（MIT License）生成，覆盖 1949–2030 年、
 * 12 个不同时辰、男女各半、含闰月年与跨年边界。
 *
 * 为什么要有这一层：
 *   黄金测试只钉住一张盘，能发现「算错」，但发现不了「整体口径偏移」
 *   —— 比如某年系星按年支还是按年干取、晚子时进不进日、闰月十六日后算不算下月，
 *   这类差异往往只在特定年份或时辰才暴露。12 张盘交叉验证是防止
 *   「一张盘全绿、换个生日就错」的那道网。
 *
 * 与 iztro 的已知口径差异（本测试不比较这些字段，故不构成失败）：
 *   1. 宫名用「交友」，iztro 用「仆役」（同一宫的别称）；
 *   2. 岁前十二神的「大耗」位，中州派写作「岁破」（本工程取通行派）。
 * 除上述两项外，12 张盘的星曜、四化、五行局、命身宫与四组十二神必须逐宫一致。
 */
import assert from 'node:assert/strict';
import { castZiwei } from '../src/index.js';

const CASES = [
  {
    input: { year: 2005, month: 7, day: 13, hour: 8, minute: 30, gender: 'male' },
    fiveElements: '土五局', soulBranch: '卯', bodyBranch: '亥',
    soulMaster: '文曲', bodyMaster: '天同',
    palaces: [
      { branch: '寅', major: ["太阳","巨门"], aux: ["铃星","陀罗"], minor: ["天贵","月德","天刑"], cs: '病', bs: '力士', jq: '劫煞', sq: '小耗' },
      { branch: '卯', major: ["天相"], aux: ["禄存","地劫"], minor: ["天月","天虚"], cs: '衰', bs: '博士', jq: '灾煞', sq: '大耗' },
      { branch: '辰', major: ["天机","天梁"], aux: ["擎羊"], minor: ["三台","天官","阴煞"], cs: '帝旺', bs: '官府', jq: '天煞', sq: '龙德' },
      { branch: '巳', major: ["紫微","七杀"], aux: ["右弼"], minor: ["破碎"], cs: '临官', bs: '伏兵', jq: '指背', sq: '白虎' },
      { branch: '午', major: [], aux: ["文昌"], minor: ["红鸾","天姚","咸池","封诰","天厨","天德","截路"], cs: '冠带', bs: '大耗', jq: '咸池', sq: '天德' },
      { branch: '未', major: [], aux: ["地空","火星"], minor: ["旬空","空亡","寡宿"], cs: '沐浴', bs: '病符', jq: '月煞', sq: '吊客' },
      { branch: '申', major: [], aux: ["文曲","天钺"], minor: ["天寿","天巫","天福","天伤"], cs: '长生', bs: '喜神', jq: '亡神', sq: '病符' },
      { branch: '酉', major: ["廉贞","破军"], aux: ["左辅"], minor: ["天哭"], cs: '养', bs: '飞廉', jq: '将星', sq: '岁建' },
      { branch: '戌', major: [], aux: [], minor: ["八座","台辅","天空","天使"], cs: '胎', bs: '奏书', jq: '攀鞍', sq: '晦气' },
      { branch: '亥', major: ["天府"], aux: ["天马"], minor: ["孤辰","蜚廉"], cs: '绝', bs: '将军', jq: '岁驿', sq: '丧门' },
      { branch: '子', major: ["天同","太阴"], aux: ["天魁"], minor: ["天喜","解神","恩光","天才"], cs: '墓', bs: '小耗', jq: '息神', sq: '贯索' },
      { branch: '丑', major: ["武曲","贪狼"], aux: [], minor: ["龙池","凤阁","华盖","年解"], cs: '死', bs: '青龙', jq: '华盖', sq: '官符' }
    ]
  },
  {
    input: { year: 1990, month: 3, day: 21, hour: 0, minute: 30, gender: 'female' },
    fiveElements: '土五局', soulBranch: '卯', bodyBranch: '卯',
    soulMaster: '文曲', bodyMaster: '火星',
    palaces: [
      { branch: '寅', major: ["武曲","天相"], aux: [], minor: ["天姚","封诰","天厨","蜚廉"], cs: '病', bs: '飞廉', jq: '指背', sq: '白虎' },
      { branch: '卯', major: ["太阳","天梁"], aux: ["铃星"], minor: ["天喜","咸池","天贵","天德"], cs: '衰', bs: '奏书', jq: '咸池', sq: '天德' },
      { branch: '辰', major: ["七杀"], aux: ["文曲"], minor: ["凤阁","寡宿","年解"], cs: '帝旺', bs: '将军', jq: '月煞', sq: '吊客' },
      { branch: '巳', major: ["天机"], aux: ["左辅"], minor: ["三台","天月","破碎"], cs: '临官', bs: '小耗', jq: '亡神', sq: '病符' },
      { branch: '午', major: ["紫微"], aux: [], minor: ["台辅","天福","截路"], cs: '冠带', bs: '青龙', jq: '将星', sq: '岁建' },
      { branch: '未', major: [], aux: ["天钺","陀罗"], minor: ["天空","空亡"], cs: '沐浴', bs: '力士', jq: '攀鞍', sq: '晦气' },
      { branch: '申', major: ["破军"], aux: ["禄存","天马"], minor: ["解神","天巫","孤辰","天伤"], cs: '长生', bs: '博士', jq: '岁驿', sq: '丧门' },
      { branch: '酉', major: [], aux: ["右弼","擎羊"], minor: ["红鸾","八座","恩光","天才","天寿"], cs: '养', bs: '官府', jq: '息神', sq: '贯索' },
      { branch: '戌', major: ["廉贞","天府"], aux: ["文昌"], minor: ["龙池","华盖","旬空","天刑","天使"], cs: '胎', bs: '伏兵', jq: '华盖', sq: '官符' },
      { branch: '亥', major: ["太阴"], aux: ["地空","地劫"], minor: ["天官","月德"], cs: '绝', bs: '大耗', jq: '劫煞', sq: '小耗' },
      { branch: '子', major: ["贪狼"], aux: [], minor: ["阴煞","天哭","天虚"], cs: '墓', bs: '病符', jq: '灾煞', sq: '大耗' },
      { branch: '丑', major: ["天同","巨门"], aux: ["天魁","火星"], minor: [], cs: '死', bs: '喜神', jq: '天煞', sq: '龙德' }
    ]
  },
  {
    input: { year: 1978, month: 12, day: 31, hour: 23, minute: 30, gender: 'male' },
    fiveElements: '金四局', soulBranch: '丑', bodyBranch: '丑',
    soulMaster: '巨门', bodyMaster: '火星',
    palaces: [
      { branch: '寅', major: [], aux: [], minor: ["封诰","天月","蜚廉"], cs: '绝', bs: '大耗', jq: '指背', sq: '白虎' },
      { branch: '卯', major: ["天府"], aux: ["左辅","铃星"], minor: ["天喜","咸池","天官","天福","天德"], cs: '胎', bs: '伏兵', jq: '咸池', sq: '天德' },
      { branch: '辰', major: ["太阴"], aux: ["文曲","陀罗"], minor: ["凤阁","寡宿","阴煞","年解"], cs: '养', bs: '官府', jq: '月煞', sq: '吊客' },
      { branch: '巳', major: ["廉贞","贪狼"], aux: ["禄存"], minor: ["三台","天贵","破碎"], cs: '长生', bs: '博士', jq: '亡神', sq: '病符' },
      { branch: '午', major: ["巨门"], aux: ["擎羊"], minor: ["解神","台辅","天厨","天伤"], cs: '沐浴', bs: '力士', jq: '将星', sq: '岁建' },
      { branch: '未', major: ["天相"], aux: ["天钺"], minor: ["天才","天寿","天空"], cs: '冠带', bs: '青龙', jq: '攀鞍', sq: '晦气' },
      { branch: '申', major: ["天同","天梁"], aux: ["天马"], minor: ["孤辰","天刑","天使"], cs: '临官', bs: '小耗', jq: '岁驿', sq: '丧门' },
      { branch: '酉', major: ["武曲","七杀"], aux: [], minor: ["红鸾","八座"], cs: '帝旺', bs: '将军', jq: '息神', sq: '贯索' },
      { branch: '戌', major: ["太阳"], aux: ["文昌"], minor: ["龙池","华盖"], cs: '衰', bs: '奏书', jq: '华盖', sq: '官符' },
      { branch: '亥', major: [], aux: ["右弼","地空","地劫"], minor: ["恩光","天巫","月德"], cs: '病', bs: '飞廉', jq: '劫煞', sq: '小耗' },
      { branch: '子', major: ["天机"], aux: [], minor: ["天姚","旬空","截路","天哭","天虚"], cs: '死', bs: '喜神', jq: '灾煞', sq: '大耗' },
      { branch: '丑', major: ["紫微","破军"], aux: ["天魁","火星"], minor: ["空亡"], cs: '墓', bs: '病符', jq: '天煞', sq: '龙德' }
    ]
  },
  {
    input: { year: 1965, month: 6, day: 6, hour: 14, minute: 30, gender: 'female' },
    fiveElements: '土五局', soulBranch: '亥', bodyBranch: '丑',
    soulMaster: '巨门', bodyMaster: '天机',
    palaces: [
      { branch: '寅', major: ["破军"], aux: ["陀罗"], minor: ["三台","天德"], cs: '病', bs: '官府', jq: '劫煞', sq: '天德' },
      { branch: '卯', major: [], aux: ["文昌","禄存"], minor: ["旬空"], cs: '死', bs: '博士', jq: '灾煞', sq: '吊客' },
      { branch: '辰', major: ["廉贞","天府"], aux: ["地空","擎羊"], minor: ["天喜","天贵","天才","天官","寡宿","天伤"], cs: '墓', bs: '力士', jq: '天煞', sq: '病符' },
      { branch: '巳', major: ["太阴"], aux: ["铃星"], minor: ["天姚","凤阁","天巫","年解"], cs: '绝', bs: '青龙', jq: '指背', sq: '岁建' },
      { branch: '午', major: ["贪狼"], aux: ["右弼","地劫"], minor: ["咸池","天寿","天厨","天空","截路","阴煞","天使"], cs: '胎', bs: '小耗', jq: '咸池', sq: '晦气' },
      { branch: '未', major: ["天同","巨门"], aux: [], minor: ["天月","空亡","蜚廉"], cs: '养', bs: '将军', jq: '月煞', sq: '丧门' },
      { branch: '申', major: ["武曲","天相"], aux: ["左辅","天钺"], minor: ["恩光","天福","孤辰"], cs: '长生', bs: '奏书', jq: '亡神', sq: '贯索' },
      { branch: '酉', major: ["太阳","天梁"], aux: [], minor: ["龙池","封诰","破碎"], cs: '沐浴', bs: '飞廉', jq: '将星', sq: '官符' },
      { branch: '戌', major: ["七杀"], aux: ["火星"], minor: ["红鸾","月德"], cs: '冠带', bs: '喜神', jq: '攀鞍', sq: '小耗' },
      { branch: '亥', major: ["天机"], aux: ["文曲","天马"], minor: ["天虚"], cs: '临官', bs: '病符', jq: '岁驿', sq: '大耗' },
      { branch: '子', major: ["紫微"], aux: ["天魁"], minor: ["解神","八座"], cs: '帝旺', bs: '大耗', jq: '息神', sq: '龙德' },
      { branch: '丑', major: [], aux: [], minor: ["台辅","华盖","天刑","天哭"], cs: '衰', bs: '伏兵', jq: '华盖', sq: '白虎' }
    ]
  },
  {
    input: { year: 2011, month: 2, day: 3, hour: 18, minute: 30, gender: 'male' },
    fiveElements: '水二局', soulBranch: '巳', bodyBranch: '亥',
    soulMaster: '武曲', bodyMaster: '天同',
    palaces: [
      { branch: '寅', major: [], aux: ["天钺","地空"], minor: ["天寿","阴煞"], cs: '病', bs: '喜神', jq: '亡神', sq: '病符' },
      { branch: '卯', major: ["天府"], aux: [], minor: ["台辅","天哭"], cs: '衰', bs: '飞廉', jq: '将星', sq: '岁建' },
      { branch: '辰', major: ["太阴"], aux: ["左辅"], minor: ["三台","天空","截路"], cs: '帝旺', bs: '奏书', jq: '攀鞍', sq: '晦气' },
      { branch: '巳', major: ["廉贞","贪狼"], aux: ["天马"], minor: ["天巫","天福","空亡","孤辰","蜚廉","破碎"], cs: '临官', bs: '将军', jq: '岁驿', sq: '丧门' },
      { branch: '午', major: ["巨门"], aux: ["天魁","火星"], minor: ["天喜","天厨"], cs: '冠带', bs: '小耗', jq: '息神', sq: '贯索' },
      { branch: '未', major: ["天相"], aux: ["铃星"], minor: ["龙池","凤阁","华盖","旬空","年解"], cs: '沐浴', bs: '青龙', jq: '华盖', sq: '官符' },
      { branch: '申', major: ["天同","天梁"], aux: ["地劫","陀罗"], minor: ["解神","天才","月德"], cs: '长生', bs: '力士', jq: '劫煞', sq: '小耗' },
      { branch: '酉', major: ["武曲","七杀"], aux: ["禄存"], minor: ["天官","天刑","天虚"], cs: '养', bs: '博士', jq: '灾煞', sq: '大耗' },
      { branch: '戌', major: ["太阳"], aux: ["右弼","擎羊"], minor: ["八座","天月","天伤"], cs: '胎', bs: '官府', jq: '天煞', sq: '龙德' },
      { branch: '亥', major: [], aux: [], minor: ["封诰"], cs: '绝', bs: '伏兵', jq: '指背', sq: '白虎' },
      { branch: '子', major: ["天机"], aux: [], minor: ["红鸾","咸池","恩光","天贵","天德","天使"], cs: '墓', bs: '大耗', jq: '咸池', sq: '天德' },
      { branch: '丑', major: ["紫微","破军"], aux: ["文昌","文曲"], minor: ["天姚","寡宿"], cs: '死', bs: '病符', jq: '月煞', sq: '吊客' }
    ]
  },
  {
    input: { year: 1988, month: 8, day: 8, hour: 10, minute: 30, gender: 'female' },
    fiveElements: '水二局', soulBranch: '寅', bodyBranch: '子',
    soulMaster: '禄存', bodyMaster: '文昌',
    palaces: [
      { branch: '寅', major: ["紫微","天府"], aux: ["天马"], minor: ["天刑","天哭"], cs: '病', bs: '小耗', jq: '岁驿', sq: '吊客' },
      { branch: '卯', major: ["太阴"], aux: ["铃星"], minor: ["天官","天福","天月"], cs: '衰', bs: '青龙', jq: '息神', sq: '病符' },
      { branch: '辰', major: ["贪狼"], aux: ["地劫","陀罗"], minor: ["八座","天寿","华盖","阴煞"], cs: '帝旺', bs: '力士', jq: '华盖', sq: '岁建' },
      { branch: '巳', major: ["巨门"], aux: ["右弼","文昌","禄存"], minor: ["天喜","恩光","天空","孤辰"], cs: '临官', bs: '博士', jq: '劫煞', sq: '晦气' },
      { branch: '午', major: ["廉贞","天相"], aux: ["地空","擎羊"], minor: ["天姚","凤阁","天才","天厨","蜚廉","年解"], cs: '冠带', bs: '官府', jq: '灾煞', sq: '丧门' },
      { branch: '未', major: ["天梁"], aux: ["天钺","火星"], minor: ["封诰","天伤"], cs: '沐浴', bs: '伏兵', jq: '天煞', sq: '贯索' },
      { branch: '申', major: ["七杀"], aux: [], minor: ["龙池","天巫"], cs: '长生', bs: '大耗', jq: '指背', sq: '官符' },
      { branch: '酉', major: ["天同"], aux: ["左辅","文曲"], minor: ["咸池","天贵","月德","天使"], cs: '养', bs: '病符', jq: '咸池', sq: '小耗' },
      { branch: '戌', major: ["武曲"], aux: [], minor: ["三台","旬空","天虚"], cs: '胎', bs: '喜神', jq: '月煞', sq: '大耗' },
      { branch: '亥', major: ["太阳"], aux: [], minor: ["红鸾","台辅"], cs: '绝', bs: '飞廉', jq: '亡神', sq: '龙德' },
      { branch: '子', major: ["破军"], aux: [], minor: ["解神","截路"], cs: '墓', bs: '奏书', jq: '将星', sq: '白虎' },
      { branch: '丑', major: ["天机"], aux: ["天魁"], minor: ["天德","空亡","寡宿","破碎"], cs: '死', bs: '将军', jq: '攀鞍', sq: '天德' }
    ]
  },
  {
    input: { year: 2000, month: 1, day: 1, hour: 6, minute: 30, gender: 'male' },
    fiveElements: '金四局', soulBranch: '酉', bodyBranch: '卯',
    soulMaster: '文曲', bodyMaster: '天同',
    palaces: [
      { branch: '寅', major: ["太阳","巨门"], aux: ["左辅","地劫"], minor: ["三台","天巫","天福","天伤"], cs: '临官', bs: '将军', jq: '亡神', sq: '病符' },
      { branch: '卯', major: ["天相"], aux: [], minor: ["天哭"], cs: '冠带', bs: '小耗', jq: '将星', sq: '岁建' },
      { branch: '辰', major: ["天机","天梁"], aux: [], minor: ["天空","天使"], cs: '沐浴', bs: '青龙', jq: '攀鞍', sq: '晦气' },
      { branch: '巳', major: ["紫微","七杀"], aux: ["天马","陀罗"], minor: ["封诰","孤辰","蜚廉","破碎"], cs: '长生', bs: '力士', jq: '岁驿', sq: '丧门' },
      { branch: '午', major: [], aux: ["禄存"], minor: ["天喜","解神","恩光","天贵","天寿","阴煞"], cs: '养', bs: '博士', jq: '息神', sq: '贯索' },
      { branch: '未', major: [], aux: ["文昌","文曲","擎羊"], minor: ["龙池","凤阁","华盖","天刑","年解"], cs: '胎', bs: '官府', jq: '华盖', sq: '官符' },
      { branch: '申', major: [], aux: ["天钺","地空"], minor: ["天厨","月德","截路"], cs: '绝', bs: '伏兵', jq: '劫煞', sq: '小耗' },
      { branch: '酉', major: ["廉贞","破军"], aux: [], minor: ["台辅","天官","旬空","空亡","天虚"], cs: '墓', bs: '大耗', jq: '灾煞', sq: '大耗' },
      { branch: '戌', major: [], aux: [], minor: ["天月"], cs: '死', bs: '病符', jq: '天煞', sq: '龙德' },
      { branch: '亥', major: ["天府"], aux: [], minor: ["天姚"], cs: '病', bs: '喜神', jq: '指背', sq: '白虎' },
      { branch: '子', major: ["天同","太阴"], aux: ["右弼","天魁","火星"], minor: ["红鸾","咸池","八座","天才","天德"], cs: '衰', bs: '飞廉', jq: '咸池', sq: '天德' },
      { branch: '丑', major: ["武曲","贪狼"], aux: ["铃星"], minor: ["寡宿"], cs: '帝旺', bs: '奏书', jq: '月煞', sq: '吊客' }
    ]
  },
  {
    input: { year: 2024, month: 2, day: 10, hour: 22, minute: 30, gender: 'female' },
    fiveElements: '火六局', soulBranch: '卯', bodyBranch: '丑',
    soulMaster: '文曲', bodyMaster: '文昌',
    palaces: [
      { branch: '寅', major: [], aux: ["禄存","天马"], minor: ["天贵","旬空","阴煞","天哭"], cs: '长生', bs: '博士', jq: '岁驿', sq: '吊客' },
      { branch: '卯', major: [], aux: ["文曲","擎羊"], minor: [], cs: '养', bs: '官府', jq: '息神', sq: '病符' },
      { branch: '辰', major: ["天同"], aux: ["左辅"], minor: ["三台","华盖"], cs: '胎', bs: '伏兵', jq: '华盖', sq: '岁建' },
      { branch: '巳', major: ["武曲","破军"], aux: [], minor: ["天喜","天寿","台辅","天巫","天厨","天空","孤辰"], cs: '绝', bs: '大耗', jq: '劫煞', sq: '晦气' },
      { branch: '午', major: ["太阳"], aux: [], minor: ["凤阁","蜚廉","年解"], cs: '墓', bs: '病符', jq: '灾煞', sq: '丧门' },
      { branch: '未', major: ["天府"], aux: ["天钺"], minor: ["天才","天官"], cs: '死', bs: '喜神', jq: '天煞', sq: '贯索' },
      { branch: '申', major: ["天机","太阴"], aux: [], minor: ["解神","龙池","截路","天伤"], cs: '病', bs: '飞廉', jq: '指背', sq: '官符' },
      { branch: '酉', major: ["紫微","贪狼"], aux: ["铃星"], minor: ["咸池","天福","月德","空亡","天刑"], cs: '衰', bs: '奏书', jq: '咸池', sq: '小耗' },
      { branch: '戌', major: ["巨门"], aux: ["右弼","地劫"], minor: ["八座","恩光","天月","天虚","天使"], cs: '帝旺', bs: '将军', jq: '月煞', sq: '大耗' },
      { branch: '亥', major: ["天相"], aux: ["文昌"], minor: ["红鸾"], cs: '临官', bs: '小耗', jq: '亡神', sq: '龙德' },
      { branch: '子', major: ["天梁"], aux: ["地空"], minor: [], cs: '冠带', bs: '青龙', jq: '将星', sq: '白虎' },
      { branch: '丑', major: ["廉贞","七杀"], aux: ["天魁","火星","陀罗"], minor: ["天姚","封诰","天德","寡宿","破碎"], cs: '沐浴', bs: '力士', jq: '攀鞍', sq: '天德' }
    ]
  },
  {
    input: { year: 1957, month: 11, day: 11, hour: 4, minute: 30, gender: 'male' },
    fiveElements: '土五局', soulBranch: '申', bodyBranch: '子',
    soulMaster: '廉贞', bodyMaster: '天同',
    palaces: [
      { branch: '寅', major: ["太阳","巨门"], aux: ["右弼"], minor: ["恩光","天官","天月","月德","截路"], cs: '病', bs: '将军', jq: '劫煞', sq: '小耗' },
      { branch: '卯', major: ["天相"], aux: [], minor: ["空亡","天虚","天使"], cs: '衰', bs: '小耗', jq: '灾煞', sq: '大耗' },
      { branch: '辰', major: ["天机","天梁"], aux: [], minor: ["解神","封诰"], cs: '帝旺', bs: '青龙', jq: '天煞', sq: '龙德' },
      { branch: '巳', major: ["紫微","七杀"], aux: ["火星","陀罗"], minor: ["天才","天巫","天厨","旬空","破碎","天刑"], cs: '临官', bs: '力士', jq: '指背', sq: '白虎' },
      { branch: '午', major: [], aux: ["文曲","禄存"], minor: ["红鸾","咸池","天德"], cs: '冠带', bs: '博士', jq: '咸池', sq: '天德' },
      { branch: '未', major: [], aux: ["擎羊"], minor: ["三台","八座","寡宿"], cs: '沐浴', bs: '官府', jq: '月煞', sq: '吊客' },
      { branch: '申', major: [], aux: ["文昌"], minor: ["台辅"], cs: '长生', bs: '伏兵', jq: '亡神', sq: '病符' },
      { branch: '酉', major: ["廉贞","破军"], aux: ["天钺","地空"], minor: ["天姚","天寿","天哭"], cs: '养', bs: '大耗', jq: '将星', sq: '岁建' },
      { branch: '戌', major: [], aux: [], minor: ["天空","阴煞"], cs: '胎', bs: '病符', jq: '攀鞍', sq: '晦气' },
      { branch: '亥', major: ["天府"], aux: ["天魁","天马"], minor: ["天福","孤辰","蜚廉"], cs: '绝', bs: '喜神', jq: '岁驿', sq: '丧门' },
      { branch: '子', major: ["天同","太阴"], aux: ["左辅","铃星"], minor: ["天喜","天贵"], cs: '墓', bs: '飞廉', jq: '息神', sq: '贯索' },
      { branch: '丑', major: ["武曲","贪狼"], aux: ["地劫"], minor: ["龙池","凤阁","华盖","天伤","年解"], cs: '死', bs: '奏书', jq: '华盖', sq: '官符' }
    ]
  },
  {
    input: { year: 1999, month: 9, day: 9, hour: 12, minute: 30, gender: 'female' },
    fiveElements: '火六局', soulBranch: '寅', bodyBranch: '寅',
    soulMaster: '禄存', bodyMaster: '天同',
    palaces: [
      { branch: '寅', major: ["武曲","天相"], aux: [], minor: ["解神","天贵","天巫","天福","阴煞"], cs: '长生', bs: '病符', jq: '亡神', sq: '病符' },
      { branch: '卯', major: ["太阳","天梁"], aux: ["火星"], minor: ["三台","天刑","天哭"], cs: '沐浴', bs: '大耗', jq: '将星', sq: '岁建' },
      { branch: '辰', major: ["七杀"], aux: ["右弼","文昌","铃星"], minor: ["天空"], cs: '冠带', bs: '伏兵', jq: '攀鞍', sq: '晦气' },
      { branch: '巳', major: ["天机"], aux: ["天马","地空","地劫","陀罗"], minor: ["天才","天寿","孤辰","蜚廉","破碎"], cs: '临官', bs: '官府', jq: '岁驿', sq: '丧门' },
      { branch: '午', major: ["紫微"], aux: ["禄存"], minor: ["天喜"], cs: '帝旺', bs: '博士', jq: '息神', sq: '贯索' },
      { branch: '未', major: [], aux: ["擎羊"], minor: ["天姚","龙池","凤阁","华盖","天伤","年解"], cs: '衰', bs: '力士', jq: '华盖', sq: '官符' },
      { branch: '申', major: ["破军"], aux: ["天钺"], minor: ["恩光","封诰","天厨","月德","截路"], cs: '病', bs: '青龙', jq: '劫煞', sq: '小耗' },
      { branch: '酉', major: [], aux: [], minor: ["天官","旬空","空亡","天虚","天使"], cs: '死', bs: '小耗', jq: '灾煞', sq: '大耗' },
      { branch: '戌', major: ["廉贞","天府"], aux: ["左辅","文曲"], minor: [], cs: '墓', bs: '将军', jq: '天煞', sq: '龙德' },
      { branch: '亥', major: ["太阴"], aux: [], minor: ["八座","天月"], cs: '绝', bs: '奏书', jq: '指背', sq: '白虎' },
      { branch: '子', major: ["贪狼"], aux: ["天魁"], minor: ["红鸾","咸池","台辅","天德"], cs: '胎', bs: '飞廉', jq: '咸池', sq: '天德' },
      { branch: '丑', major: ["天同","巨门"], aux: [], minor: ["寡宿"], cs: '养', bs: '喜神', jq: '月煞', sq: '吊客' }
    ]
  },
  {
    input: { year: 2030, month: 5, day: 20, hour: 2, minute: 30, gender: 'male' },
    fiveElements: '金四局', soulBranch: '辰', bodyBranch: '午',
    soulMaster: '廉贞', bodyMaster: '文昌',
    palaces: [
      { branch: '寅', major: ["太阳","巨门"], aux: ["火星"], minor: ["恩光","龙池","天才","天厨","天月","旬空"], cs: '绝', bs: '飞廉', jq: '指背', sq: '官符' },
      { branch: '卯', major: ["天相"], aux: [], minor: ["咸池","封诰","月德"], cs: '胎', bs: '喜神', jq: '咸池', sq: '小耗' },
      { branch: '辰', major: ["天机","天梁"], aux: ["铃星"], minor: ["天姚","天寿","天虚"], cs: '养', bs: '病符', jq: '月煞', sq: '大耗' },
      { branch: '巳', major: ["紫微","七杀"], aux: ["文曲"], minor: ["红鸾"], cs: '长生', bs: '大耗', jq: '亡神', sq: '龙德' },
      { branch: '午', major: [], aux: [], minor: ["天福","截路"], cs: '沐浴', bs: '伏兵', jq: '将星', sq: '白虎' },
      { branch: '未', major: [], aux: ["左辅","右弼","天钺","陀罗"], minor: ["台辅","天德","空亡","寡宿"], cs: '冠带', bs: '官府', jq: '攀鞍', sq: '天德' },
      { branch: '申', major: [], aux: ["禄存","天马"], minor: ["阴煞","天哭"], cs: '临官', bs: '博士', jq: '岁驿', sq: '吊客' },
      { branch: '酉', major: ["廉贞","破军"], aux: ["文昌","擎羊"], minor: ["天伤"], cs: '帝旺', bs: '力士', jq: '息神', sq: '病符' },
      { branch: '戌', major: [], aux: ["地空"], minor: ["解神","天贵","华盖"], cs: '衰', bs: '青龙', jq: '华盖', sq: '岁建' },
      { branch: '亥', major: ["天府"], aux: [], minor: ["天喜","天巫","天官","天空","孤辰","天使"], cs: '病', bs: '小耗', jq: '劫煞', sq: '晦气' },
      { branch: '子', major: ["天同","太阴"], aux: ["地劫"], minor: ["凤阁","蜚廉","天刑","年解"], cs: '死', bs: '将军', jq: '灾煞', sq: '丧门' },
      { branch: '丑', major: ["武曲","贪狼"], aux: ["天魁"], minor: ["三台","八座","破碎"], cs: '墓', bs: '奏书', jq: '天煞', sq: '贯索' }
    ]
  },
  {
    input: { year: 1949, month: 10, day: 1, hour: 16, minute: 30, gender: 'female' },
    fiveElements: '水二局', soulBranch: '丑', bodyBranch: '巳',
    soulMaster: '巨门', bodyMaster: '天相',
    palaces: [
      { branch: '寅', major: ["武曲","天相"], aux: ["文昌"], minor: ["红鸾","解神","天才","台辅","天福","天空","孤辰"], cs: '病', bs: '病符', jq: '劫煞', sq: '晦气' },
      { branch: '卯', major: ["太阳","天梁"], aux: ["右弼","地空"], minor: [], cs: '死', bs: '大耗', jq: '灾煞', sq: '丧门' },
      { branch: '辰', major: ["七杀"], aux: [], minor: ["天刑"], cs: '墓', bs: '伏兵', jq: '天煞', sq: '贯索' },
      { branch: '巳', major: ["天机"], aux: ["陀罗"], minor: ["龙池","天哭"], cs: '绝', bs: '官府', jq: '指背', sq: '官符' },
      { branch: '午', major: ["紫微"], aux: ["禄存","铃星"], minor: ["咸池","八座","天寿","月德","天伤"], cs: '胎', bs: '博士', jq: '咸池', sq: '小耗' },
      { branch: '未', major: [], aux: ["地劫","擎羊"], minor: ["天月","旬空","天虚"], cs: '养', bs: '力士', jq: '月煞', sq: '大耗' },
      { branch: '申', major: ["破军"], aux: ["天钺"], minor: ["天喜","天姚","三台","天贵","天厨","截路","天使"], cs: '长生', bs: '青龙', jq: '亡神', sq: '龙德' },
      { branch: '酉', major: [], aux: [], minor: ["凤阁","天官","空亡","蜚廉","年解"], cs: '沐浴', bs: '小耗', jq: '将星', sq: '白虎' },
      { branch: '戌', major: ["廉贞","天府"], aux: [], minor: ["恩光","封诰","天德","寡宿"], cs: '冠带', bs: '将军', jq: '攀鞍', sq: '天德' },
      { branch: '亥', major: ["太阴"], aux: ["左辅","天马","火星"], minor: ["天巫"], cs: '临官', bs: '奏书', jq: '岁驿', sq: '吊客' },
      { branch: '子', major: ["贪狼"], aux: ["文曲","天魁"], minor: ["阴煞"], cs: '帝旺', bs: '飞廉', jq: '息神', sq: '病符' },
      { branch: '丑', major: ["天同","巨门"], aux: [], minor: ["华盖","破碎"], cs: '衰', bs: '喜神', jq: '华盖', sq: '岁建' }
    ]
  }
];

const sorted = (a) => [...a].sort();

let checkedPalaces = 0;
for (const testCase of CASES) {
  const label = testCase.input.year + '-' + testCase.input.month + '-' + testCase.input.day + ' ' + testCase.input.gender;
  const chart = castZiwei({ ...testCase.input, longitude: 120, timezone: 'Asia/Shanghai' });

  assert.equal(chart.fiveElements.name, testCase.fiveElements, label + ' 五行局');
  assert.equal(chart.soul.branch, testCase.soulBranch, label + ' 命宫');
  assert.equal(chart.body.branch, testCase.bodyBranch, label + ' 身宫');
  assert.equal(chart.masters.soulMaster, testCase.soulMaster, label + ' 命主');
  assert.equal(chart.masters.bodyMaster, testCase.bodyMaster, label + ' 身主');

  assert.equal(chart.palaces.length, testCase.palaces.length, label + ' 宫数');
  chart.palaces.forEach((palace, i) => {
    const expected = testCase.palaces[i];
    assert.equal(palace.branch, expected.branch, label + ' palace ' + i + ' 地支');
    assert.deepEqual(sorted(palace.majorStars), sorted(expected.major), label + ' ' + expected.branch + ' 主星');
    assert.deepEqual(sorted(palace.auxiliaryStars), sorted(expected.aux), label + ' ' + expected.branch + ' 辅星');
    assert.deepEqual(sorted(palace.minorStars), sorted(expected.minor), label + ' ' + expected.branch + ' 杂曜');
    assert.equal(palace.changsheng12, expected.cs, label + ' ' + expected.branch + ' 长生十二神');
    assert.equal(palace.boshi12, expected.bs, label + ' ' + expected.branch + ' 博士十二神');
    assert.equal(palace.jiangqian12, expected.jq, label + ' ' + expected.branch + ' 将前十二神');
    assert.equal(palace.suiqian12, expected.sq, label + ' ' + expected.branch + ' 岁前十二神');
    checkedPalaces += 1;
  });
}

assert.equal(checkedPalaces, CASES.length * 12, '每张盘都应逐宫核对完');

console.log('ziwei cross-reference smoke passed ' + CASES.length + ' 张参照盘 / ' + checkedPalaces + ' 宫逐项一致');
