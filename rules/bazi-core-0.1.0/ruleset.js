/**
 * bazi-core-0.1.0 —— 四柱核心规则集（通用派）
 * ---------------------------------------------------------------------------
 * 本文件是「规则即数据」的落点：所有会随流派变化的取值、表格与阈值都写在这里，
 * 并逐条标注 ruleId、出处与置信度。计算代码只读取本文件，不再内嵌字面量。
 *
 * 约定：
 *   - ruleId 一旦发布不得改变含义；语义变化必须发布新的规则集版本。
 *   - evidence 区分「天文可验证」(astronomical) 与「传统约定」(traditional/convention)，
 *     二者不可混用同一个置信度口径。
 *   - source 数组引用本文件 sources 中的键，不得引用未登记的出处。
 */

export const RULE_SET_ID = 'bazi-core-0.1.0';

export default {
  id: RULE_SET_ID,
  version: '0.1.0',
  title: '四柱核心规则集（通用派）',
  school: 'common',
  locale: 'zh-Hans',
  system: 'bazi',
  engineCompatibility: '>=0.3.0 <0.5.0',

  conventions: {
    yearBoundary: {
      ruleId: 'bazi.year.solar-term-boundary',
      value: 'lichun',
      label: '年柱以立春为界：太阳视黄经达到 315° 的瞬间换年',
      evidence: 'astronomical',
      source: ['meeus-aa2', 'jie-zhongqi'],
      confidence: 0.97
    },
    monthBoundary: {
      ruleId: 'bazi.month.jie-boundary',
      value: 'nearest-jie-before-instant',
      label: '月柱取出生瞬间之前最近的「节」（黄经 15° 的奇数倍）',
      evidence: 'astronomical',
      source: ['meeus-aa2', 'jie-zhongqi'],
      confidence: 0.95
    },
    dayBoundary: {
      ruleId: 'bazi.day.local-midnight',
      value: 'local-midnight',
      label: '日柱以出生地民用日零点换日（子正换日）',
      evidence: 'convention',
      source: ['jdn-anchor'],
      confidence: 0.9
    },
    hourBoundary: {
      ruleId: 'bazi.hour.true-solar-time',
      value: 'true-solar-two-hour',
      label: '时柱以真太阳时每两小时一时辰，子时起于真太阳时 23:00',
      evidence: 'convention',
      source: ['true-solar-time'],
      confidence: 0.88
    },
    luckDirection: {
      ruleId: 'bazi.luck.year-stem-polarity',
      value: 'yang-male-yin-female-forward',
      label: '阳年干男命、阴年干女命顺行，其余逆行',
      evidence: 'traditional',
      source: ['yuan-hai-zi-ping'],
      confidence: 0.85
    },
    lunarMonthNumbering: {
      ruleId: 'lunar.month.winter-solstice-anchor',
      value: 'solstice-month-is-eleven',
      label: '含冬至（黄经 270°）的月固定为十一月，其余月份自该锚点向前后推排',
      evidence: 'convention',
      source: ['chinese-calendar-rule'],
      confidence: 0.95
    },
    lunarLeapMonth: {
      ruleId: 'lunar.leap.no-zhongqi',
      value: 'no-zhongqi-month-is-leap',
      label: '不含中气的月为闰月，沿用前一月月序',
      evidence: 'convention',
      source: ['chinese-calendar-rule'],
      confidence: 0.95
    },
    lunarDayBoundary: {
      ruleId: 'lunar.month.civil-day-boundary',
      value: 'china-civil-midnight',
      label: '农历月从「包含朔时刻的中国民用日」零时起算，不按朔的瞬间切分',
      evidence: 'convention',
      source: ['chinese-calendar-rule'],
      confidence: 0.92
    },
    luckStart: {
      ruleId: 'bazi.luck.days-to-boundary-over-3',
      value: 'exact-fraction',
      label: '起运年龄 = 出生到顺／逆方向相邻「节」的天数 ÷ 3',
      evidence: 'traditional',
      source: ['yuan-hai-zi-ping'],
      confidence: 0.8
    }
  },

  tables: {
    stems: [
      { name: '甲', yinYang: 'yang', element: '木' },
      { name: '乙', yinYang: 'yin', element: '木' },
      { name: '丙', yinYang: 'yang', element: '火' },
      { name: '丁', yinYang: 'yin', element: '火' },
      { name: '戊', yinYang: 'yang', element: '土' },
      { name: '己', yinYang: 'yin', element: '土' },
      { name: '庚', yinYang: 'yang', element: '金' },
      { name: '辛', yinYang: 'yin', element: '金' },
      { name: '壬', yinYang: 'yang', element: '水' },
      { name: '癸', yinYang: 'yin', element: '水' }
    ],
    branches: [
      { name: '子', element: '水', hiddenStems: ['癸'] },
      { name: '丑', element: '土', hiddenStems: ['己', '癸', '辛'] },
      { name: '寅', element: '木', hiddenStems: ['甲', '丙', '戊'] },
      { name: '卯', element: '木', hiddenStems: ['乙'] },
      { name: '辰', element: '土', hiddenStems: ['戊', '乙', '癸'] },
      { name: '巳', element: '火', hiddenStems: ['丙', '戊', '庚'] },
      { name: '午', element: '火', hiddenStems: ['丁', '己'] },
      { name: '未', element: '土', hiddenStems: ['己', '丁', '乙'] },
      { name: '申', element: '金', hiddenStems: ['庚', '壬', '戊'] },
      { name: '酉', element: '金', hiddenStems: ['辛'] },
      { name: '戌', element: '土', hiddenStems: ['戊', '辛', '丁'] },
      { name: '亥', element: '水', hiddenStems: ['壬', '甲'] }
    ],
    tenGodNames: ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'],
    tenGodRule: {
      ruleId: 'bazi.ten-god.same-polarity-cycle',
      label: '十神按「日干→他干」在十干序列上的同阴阳等距映射，序号差取模 10',
      evidence: 'traditional',
      source: ['san-ming-tong-hui'],
      confidence: 0.8
    },
    hiddenStemsRule: {
      ruleId: 'bazi.hidden-stems.branch-table',
      label: '藏干取地支本气、中气、余气三档，表序即优先级',
      evidence: 'traditional',
      source: ['san-ming-tong-hui'],
      confidence: 0.8
    },
    elementCountRule: {
      ruleId: 'bazi.wuxing.element-count',
      label: '五行力量按四柱天干与地支本气各计一次（藏干权重 [1, 0, 0]）',
      evidence: 'traditional',
      source: ['san-ming-tong-hui'],
      confidence: 0.7
    },
    dayPillarRule: {
      ruleId: 'bazi.day.sexagenary-jdn',
      label: '日干支 = (儒略日数 JDN + 49) mod 60，锚点 1900-01-01 为甲戌日',
      evidence: 'convention',
      source: ['jdn-anchor'],
      confidence: 0.92
    }
  },

  parameters: {
    monthBoundaryStepDegrees: 30,
    monthBoundaryOffsetDegrees: 15,
    dayPillarJdnOffset: 49,
    dayBoundaryMode: 'civil-midnight',
    ziChuStartTrueSolarMinutes: 1380,
    hiddenStemWeights: [1, 0, 0],
    luckDaysPerYear: 3,
    luckDaysPerMonth: 0.25,
    sexagenaryCycleLength: 60
  },

  sources: {
    'meeus-aa2': {
      citation: 'Meeus, Astronomical Algorithms, 2nd ed. (1998), ch. 7 / 22 / 25 / 27 / 49',
      kind: 'astronomical-reference'
    },
    'jie-zhongqi': {
      citation: '本项目 ADR-0003：节为黄经 15°+30°k，中气为 30°k',
      kind: 'project-decision'
    },
    'jdn-anchor': {
      citation: '儒略日数与干支纪日锚点：1900-01-01 为甲戌日（JDN 2415021，六十甲子序 10）',
      kind: 'calibration-anchor'
    },
    'true-solar-time': {
      citation: '真太阳时 = 平太阳时 + (经度 − 120°)×4 分钟 + 均时差',
      kind: 'astronomical-reference'
    },
    'yuan-hai-zi-ping': {
      citation: '《渊海子平》子平法：四柱、大运顺逆与起运',
      kind: 'traditional-text'
    },
    'chinese-calendar-rule': {
      citation: '农历编排规则：朔日为月首、冬至所在月为十一月、无中气之月为闰月（与 ADR-0003 配套）',
      kind: 'calendar-convention'
    },
    'san-ming-tong-hui': {
      citation: '《三命通会》：十神与地支藏干体系',
      kind: 'traditional-text'
    }
  }
};
