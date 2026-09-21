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
  engineCompatibility: '>=0.3.0 <0.7.0',

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
    },
    palaceOfPillar: {
      ruleId: 'bazi.interpret.palace-of-pillar',
      value: 'year-ancestor-month-parents-day-spouse-hour-children',
      label: '四柱宫位：年柱为祖上宫，月柱为父母宫，日支为夫妻宫，时柱为子女宫',
      evidence: 'traditional',
      source: ['san-ming-tong-hui'],
      confidence: 0.75
    },
    pastEventTiering: {
      ruleId: 'bazi.interpret.past-event-tiering',
      value: 'three-tier-structural',
      label: '前事程度按轻／中／重三档：父母宫（月支）见刑、冲、害、空亡任一按结构性记中档；空亡之宫再逢刑冲按最重一档；无冲击记轻档。禁止只给单点温和解读',
      evidence: 'traditional',
      source: ['san-ming-tong-hui', 'r-01-correction'],
      confidence: 0.7
    },
    pastEventUncertainty: {
      ruleId: 'bazi.interpret.past-event-uncertainty',
      value: 'direction-and-band-only',
      label: '前事判词只写方向与程度区间，不做事后夸功；对未发生之事禁用恐吓性表述，不确定处须标注不确定性来源',
      evidence: 'convention',
      source: ['r-02-correction'],
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
    },

    /* ---- 地支关系表（L4 派生层读取；缺表即整组跳过，代码内不设备用表） ----
     * 这些是「固定组合表」而不是算法：冲、合、刑、害的组合自古一致，
     * 真正因流派而异的是「见之为吉为凶」与「程度轻重」，那属于解释层。
     * 因此本表在通用派与子初派之间保持同一取值，只有出处与置信度按各派文献登记。
     */
    branchClashRule: {
      ruleId: 'bazi.relation.branch-clash',
      label: '六冲：子午、丑未、寅申、卯酉、辰戌、巳亥，两柱地支相见即为冲',
      evidence: 'traditional',
      source: ['branch-relations'],
      confidence: 0.78,
      pairs: [
        { branches: ['子', '午'] },
        { branches: ['丑', '未'] },
        { branches: ['寅', '申'] },
        { branches: ['卯', '酉'] },
        { branches: ['辰', '戌'] },
        { branches: ['巳', '亥'] }
      ]
    },
    branchCombineRule: {
      ruleId: 'bazi.relation.branch-combine',
      label: '六合：子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土',
      evidence: 'traditional',
      source: ['branch-relations'],
      confidence: 0.75,
      pairs: [
        { branches: ['子', '丑'], element: '土' },
        { branches: ['寅', '亥'], element: '木' },
        { branches: ['卯', '戌'], element: '火' },
        { branches: ['辰', '酉'], element: '金' },
        { branches: ['巳', '申'], element: '水' },
        { branches: ['午', '未'], element: '土' }
      ]
    },
    branchTrineRule: {
      ruleId: 'bazi.relation.branch-trine',
      label: '三合：申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金；半合取「生+旺」或「旺+墓」，生+墓只作拱不作半合',
      evidence: 'traditional',
      source: ['branch-relations'],
      confidence: 0.72,
      halfTrine: 'requires-strong-branch',
      groups: [
        { branches: ['申', '子', '辰'], element: '水' },
        { branches: ['亥', '卯', '未'], element: '木' },
        { branches: ['寅', '午', '戌'], element: '火' },
        { branches: ['巳', '酉', '丑'], element: '金' }
      ]
    },
    branchPunishmentRule: {
      ruleId: 'bazi.relation.branch-punishment',
      label: '相刑：三刑寅巳申、丑戌未，互刑子卯，自刑辰午酉亥（自刑须落两柱）',
      evidence: 'traditional',
      source: ['branch-relations'],
      confidence: 0.65,
      triads: [
        { name: '寅巳申三刑', branches: ['寅', '巳', '申'] },
        { name: '丑戌未三刑', branches: ['丑', '戌', '未'] }
      ],
      mutual: [
        { branches: ['子', '卯'], name: '子卯无礼之刑' }
      ],
      self: ['辰', '午', '酉', '亥']
    },
    branchHarmRule: {
      ruleId: 'bazi.relation.branch-harm',
      label: '六害：子未、丑午、寅巳、卯辰、申亥、酉戌，两柱地支相见即为害',
      evidence: 'traditional',
      source: ['branch-relations'],
      confidence: 0.68,
      pairs: [
        { branches: ['子', '未'] },
        { branches: ['丑', '午'] },
        { branches: ['寅', '巳'] },
        { branches: ['卯', '辰'] },
        { branches: ['申', '亥'] },
        { branches: ['酉', '戌'] }
      ]
    },
    xunVoidRule: {
      ruleId: 'bazi.relation.xun-void',
      label: '旬空（空亡）：以日柱所在旬所缺的两支为空亡，六旬依次空戌亥、申酉、午未、辰巳、寅卯、子丑',
      evidence: 'traditional',
      source: ['xun-kong'],
      confidence: 0.7,
      voidByXun: [['戌', '亥'], ['申', '酉'], ['午', '未'], ['辰', '巳'], ['寅', '卯'], ['子', '丑']]
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
    },
    'branch-relations': {
      citation: '《三命通会》地支关系体系：六冲、六合、三合、相刑、六害的固定组合（组合表为历代一致口径，非流派取值）',
      kind: 'traditional-text'
    },
    'xun-kong': {
      citation: '六甲旬空体系：以日柱所在旬所缺两支为旬空（《三命通会》空亡条）',
      kind: 'traditional-text'
    },
    'r-01-correction': {
      citation: '本项目 codex-suanming.md 修正规则 R-01「凶象不得往轻里读」（2026-09-13 立）',
      kind: 'project-decision'
    },
    'r-02-correction': {
      citation: '本项目 codex-suanming.md 修正规则 R-02「命理判词的表述纪律」（2026-09-13 立）',
      kind: 'project-decision'
    }
  }
};
