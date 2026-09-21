/**
 * ziwei-core-0.2.0 —— 紫微斗数核心规则集（通行派）
 * ---------------------------------------------------------------------------
 * 与 bazi-* 规则集共用同一套「规则即数据」契约，但服务的是**另一个盘系**：
 * 四柱以节气与干支为本，紫微以农历月、时辰与宫位为本。两者不可互相换算，
 * 也不共用 ruleId 命名空间，因此规则集必须声明 system 字段。
 *
 * 本文件只放取值、表格与阈值，安星算法在 src/charts/ziwei/ 下。
 * 每条规则都带 ruleId / label / evidence / source / confidence，审计会强制校验。
 *
 * 0.2.0 相对 0.1.0 为**纯增量**：新增 38 颗杂曜、四组十二神与命主身主。
 * 0.1.0 已登记的 ruleId 含义一律未变，仅版本号与覆盖范围前进。
 *
 * 出处说明：安星口诀取自《紫微斗数全书》系统，算法实现与 SylarLong/iztro（MIT）
 * 交叉核对。iztro 在本规则集中作为「参照实现」登记，不改变传统出处的证据类别。
 */

export const RULE_SET_ID = 'ziwei-core-0.2.0';

export default {
  id: RULE_SET_ID,
  version: '0.2.0',
  title: '紫微斗数核心规则集（通行派）',
  school: 'common',
  system: 'ziwei',
  locale: 'zh-Hans',
  engineCompatibility: '>=0.5.0 <0.7.0',

  conventions: {
    yearBoundary: {
      ruleId: 'ziwei.year.lunar-new-year',
      value: 'lunar-new-year',
      label: '年干支以农历正月初一为界（紫微斗数通行口径），与四柱的立春换年并列而不混用',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.8
    },
    monthIndex: {
      ruleId: 'ziwei.month.leap-split-fifteen',
      value: 'leap-second-half-as-next-month',
      label: '闰月前十五日（含十五）仍按本月起宫，十六日起按下月起宫；晚子时不参与该修正',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.7
    },
    timeIndex: {
      ruleId: 'ziwei.time.early-late-zi',
      value: 'thirteen-index-true-solar',
      label: '时辰按真太阳时切分，子时分早晚：00:00-01:00 为早子（索引 0），23:00-00:00 为晚子（索引 12）',
      evidence: 'convention',
      source: ['true-solar-time'],
      confidence: 0.8
    },
    lateZiDay: {
      ruleId: 'ziwei.day.late-zi-next-day',
      value: 'next-day',
      label: '晚子时（23:00 后）起紫微时，农历日数进一日；若越过当月最后一日则回落到下月初一',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.68
    },
    soulBody: {
      ruleId: 'ziwei.palace.soul-body-rule',
      value: 'month-forward-hour-backward',
      label: '寅宫起正月顺数至生月，再自该宫逆数生时安命宫；顺数生时安身宫',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88
    },
    palaceNaming: {
      ruleId: 'ziwei.palace.naming',
      value: 'soul-palace-counter-clockwise',
      label: '十二宫自命宫起逆布：兄弟、夫妻、子女、财帛、疾厄、迁移、交友、官禄、田宅、福德、父母',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.9
    },
    decadalDirection: {
      ruleId: 'ziwei.decadal.direction',
      value: 'yang-male-yin-female-forward',
      label: '生年支为阳且男命、生年支为阴且女命者，大限自命宫顺行；其余逆行',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.85,
      genderPolarity: { male: '阳', female: '阴' }
    },
    decadalStart: {
      ruleId: 'ziwei.decadal.start-age',
      value: 'five-elements-class-value',
      label: '大限起运虚岁等于五行局数（水二局 2 岁起，木三局 3 岁起，依此类推），每宫十年',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.85
    },
    xiaoxian: {
      ruleId: 'ziwei.xiaoxian.start-and-direction',
      value: 'year-branch-triad-start',
      label: '小限起宫：寅午戌年辰上起，申子辰年戌上起，巳酉丑年未上起，亥卯未年丑上起；男顺女逆，一年一宫',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.8,
      direction: { male: 1, female: -1 },
      table: {
        寅: '辰', 午: '辰', 戌: '辰',
        申: '戌', 子: '戌', 辰: '戌',
        巳: '未', 酉: '未', 丑: '未',
        亥: '丑', 卯: '丑', 未: '丑'
      }
    }
  },

  tables: {
    stems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    branches: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    // 宫名本身也是流派变量：命盘上同一宫，通行派称「交友」，古法（紫微斗数全书）称「奴仆」，
    // 参照实现 iztro 用「仆役」。名称不影响星曜分布，但会让逐宫比对报出假差异，
    // 因此把别名显式登记，而不是让下游各自猜。
    palaceNames: {
      ruleId: 'ziwei.palace.names',
      label: '十二宫名（寅基顺序）：命宫、父母、福德、田宅、官禄、交友、迁移、疾厄、财帛、子女、夫妻、兄弟',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.85,
      order: ['命宫', '父母', '福德', '田宅', '官禄', '交友', '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟'],
      aliases: {
        交友: ['仆役', '奴仆'],
        父母: ['相貌'],
        疾厄: ['疾厄宫']
      }
    },

    tigerRule: {
      ruleId: 'ziwei.palace.tiger-rule',
      label: '五虎遁定寅宫天干：甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸之年甲寅求',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.9,
      table: {
        甲: '丙', 己: '丙',
        乙: '戊', 庚: '戊',
        丙: '庚', 辛: '庚',
        丁: '壬', 壬: '壬',
        戊: '甲', 癸: '甲'
      }
    },

    fiveElementsClassRule: {
      ruleId: 'ziwei.five-elements.na-yin',
      label: '五行局取命宫干支的纳音五行：天干数（甲乙1丙丁2戊己3庚辛4壬癸5）加地支数（子午丑未1寅申卯酉2辰戌巳亥3），超过 5 者减 5，得一木二金三水四火五土',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'na-yin-table'],
      confidence: 0.88,
      stemNumbers: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      branchNumbers: [1, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 3],
      order: [
        { name: '木三局', element: '木', value: 3 },
        { name: '金四局', element: '金', value: 4 },
        { name: '水二局', element: '水', value: 2 },
        { name: '火六局', element: '火', value: 6 },
        { name: '土五局', element: '土', value: 5 }
      ]
    },

    ziweiPositionRule: {
      ruleId: 'ziwei.star.ziwei-position',
      label: '起紫微星诀：以农历日数（晚子进一日）为被除数，自偏移量 0 起逐次加一，直至能被五行局数整除；商减一得宫位，偏移量为偶则顺加偏移、为奇则逆减偏移；天府与紫微以寅申轴对称，宫位索引之和恒为 12',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88
    },

    // 星曜规范顺序：同一宫内的星曜按此顺序排列。
    // 不排序的话，星曜顺序会随安星函数的书写顺序变化，外部逐宫比对时会报出大量假差异。
    starOrder: {
      ruleId: 'ziwei.star.canonical-order',
      label: '星曜规范顺序：十四主星在前，十四辅星按六吉、六煞、禄马排列，其后为年系/月系/日系/时系杂曜；同宫内按此排序，保证输出顺序确定、可逐宫比对',
      evidence: 'convention',
      source: ['iztro'],
      confidence: 0.7,
      order: [
        '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
        '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
        '左辅', '右弼', '文昌', '文曲', '天魁', '天钺',
        '擎羊', '陀罗', '火星', '铃星', '地空', '地劫',
        '禄存', '天马',
        '红鸾', '天喜', '天姚', '咸池', '解神',
        '三台', '八座', '恩光', '天贵', '龙池', '凤阁',
        '天才', '天寿', '台辅', '封诰', '天巫', '华盖',
        '天官', '天福', '天厨', '天月', '天德', '月德',
        '天空', '旬空', '截路', '空亡', '孤辰', '寡宿',
        '蜚廉', '破碎', '天刑', '阴煞', '天哭', '天虚',
        '天伤', '天使', '年解'
      ]
    },
    majorStarRule: {
      ruleId: 'ziwei.star.major-placement',
      label: '紫微星系自紫微逆行安六星（紫微、天机、太阳、武曲、天同、廉贞），天府星系自天府顺行安八星（天府、太阴、贪狼、巨门、天相、天梁、七杀、破军）',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.9,
      ziweiSeries: ['紫微', '天机', null, '太阳', '武曲', '天同', null, null, '廉贞'],
      tianfuSeries: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', null, null, null, '破军'],
      ziweiDirection: -1,
      tianfuDirection: 1,
      mirrorSum: 12
    },

    lucunRule: {
      ruleId: 'ziwei.star.lucun',
      label: '禄存按年干定位：甲禄在寅、乙禄在卯、丙戊禄在巳、丁己禄在午、庚禄在申、辛禄在酉、壬禄在亥、癸禄在子；禄前一位擎羊，禄后一位陀罗',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88,
      table: { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' },
      yangOffset: 1,
      tuoOffset: -1
    },

    tianmaRule: {
      ruleId: 'ziwei.star.tianma',
      label: '天马按年支三合定位：寅午戌年天马在申，申子辰年在寅，巳酉丑年在亥，亥卯未年在巳',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88,
      table: {
        寅: '申', 午: '申', 戌: '申',
        申: '寅', 子: '寅', 辰: '寅',
        巳: '亥', 酉: '亥', 丑: '亥',
        亥: '巳', 卯: '巳', 未: '巳'
      }
    },

    kuiyueRule: {
      ruleId: 'ziwei.star.kuiyue',
      label: '天魁天钺按年干定位：甲戊庚年丑未，乙己年子申，辛年午寅，丙丁年亥酉，壬癸年卯巳',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.85,
      table: {
        甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
        乙: ['子', '申'], 己: ['子', '申'],
        辛: ['午', '寅'],
        丙: ['亥', '酉'], 丁: ['亥', '酉'],
        壬: ['卯', '巳'], 癸: ['卯', '巳']
      }
    },

    zuoyouRule: {
      ruleId: 'ziwei.star.zuoyou',
      label: '左辅自辰宫起正月顺数至生月，右弼自戌宫起正月逆数至生月',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88,
      zuoBase: '辰',
      youBase: '戌',
      zuoDirection: 1,
      youDirection: -1
    },

    wenchangWenquRule: {
      ruleId: 'ziwei.star.wenchang-wenqu',
      label: '文曲自辰宫起子时顺数至生时，文昌自戌宫起子时逆数至生时',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.88,
      quBase: '辰',
      changBase: '戌',
      quDirection: 1,
      changDirection: -1
    },

    dikongDijieRule: {
      ruleId: 'ziwei.star.dikong-dijie',
      label: '地劫自亥宫起子时顺数至生时，地空自亥宫起子时逆数至生时',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.85,
      base: '亥',
      jieDirection: 1,
      kongDirection: -1
    },

    huolingRule: {
      ruleId: 'ziwei.star.huoling',
      label: '火星铃星按年支三合定起子时宫位，再顺数至生时：寅午戌年丑卯，申子辰年寅戌，巳酉丑年卯戌，亥卯未年酉戌',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.82,
      table: {
        寅: ['丑', '卯'], 午: ['丑', '卯'], 戌: ['丑', '卯'],
        申: ['寅', '戌'], 子: ['寅', '戌'], 辰: ['寅', '戌'],
        巳: ['卯', '戌'], 酉: ['卯', '戌'], 丑: ['卯', '戌'],
        亥: ['酉', '戌'], 卯: ['酉', '戌'], 未: ['酉', '戌']
      }
    },

    mutagenRule: {
      ruleId: 'ziwei.mutagen.year-stem',
      label: '生年四化按年干定禄权科忌：甲廉破武阳，乙机梁紫阴，丙同机昌廉，丁阴同机巨，戊贪阴弼机，己武贪梁曲，庚阳武阴同，辛巨阳曲昌，壬梁紫左武，癸破巨阴贪',
      evidence: 'traditional',
      source: ['ziwei-quanshu'],
      confidence: 0.85,
      order: ['禄', '权', '科', '忌'],
      table: {
        甲: ['廉贞', '破军', '武曲', '太阳'],
        乙: ['天机', '天梁', '紫微', '太阴'],
        丙: ['天同', '天机', '文昌', '廉贞'],
        丁: ['太阴', '天同', '天机', '巨门'],
        戊: ['贪狼', '太阴', '右弼', '天机'],
        己: ['武曲', '贪狼', '天梁', '文曲'],
        庚: ['太阳', '武曲', '太阴', '天同'],
        辛: ['巨门', '太阳', '文曲', '文昌'],
        壬: ['天梁', '紫微', '左辅', '武曲'],
        癸: ['破军', '巨门', '太阴', '贪狼']
      }
    },

    yearMinorRule: {
      ruleId: 'ziwei.star.year-minor',
      label: '年系杂曜：华盖咸池按年支三合，孤辰寡宿按年支四季，天才天寿以命宫身宫加年支子基序号，龙池凤阁天哭天虚以辰戌午宫加减年支序号，天官天福天厨按年干，截路空亡按年干对五取模，破碎按年支对三取模，蜚廉年解按年支直取，天空为年支宫顺一位，旬空按年干与年支同奇偶修正，天伤天使自交友宫与疾厄宫起命宫',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.78,
      huagaiXianchi: {
        寅: ['戌', '卯'], 午: ['戌', '卯'], 戌: ['戌', '卯'],
        申: ['辰', '酉'], 子: ['辰', '酉'], 辰: ['辰', '酉'],
        巳: ['丑', '午'], 酉: ['丑', '午'], 丑: ['丑', '午'],
        亥: ['未', '子'], 卯: ['未', '子'], 未: ['未', '子']
      },
      guchenGuasu: {
        寅: ['巳', '丑'], 卯: ['巳', '丑'], 辰: ['巳', '丑'],
        巳: ['申', '辰'], 午: ['申', '辰'], 未: ['申', '辰'],
        申: ['亥', '未'], 酉: ['亥', '未'], 戌: ['亥', '未'],
        亥: ['寅', '戌'], 子: ['寅', '戌'], 丑: ['寅', '戌']
      },
      tianchuByStem: ['巳', '午', '子', '巳', '午', '申', '寅', '午', '酉', '亥'],
      posuiByBranchMod3: ['巳', '丑', '酉'],
      feilianByBranch: ['申', '酉', '戌', '巳', '午', '未', '寅', '卯', '辰', '亥', '子', '丑'],
      tianguanByStem: ['未', '辰', '巳', '寅', '卯', '酉', '亥', '酉', '戌', '午'],
      tianfuByStem: ['酉', '申', '子', '亥', '卯', '寅', '午', '巳', '午', '巳'],
      jieluByStemMod5: ['申', '午', '辰', '寅', '子'],
      kongwangByStemMod5: ['酉', '未', '巳', '卯', '丑'],
      nianjieByBranch: ['戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子', '亥'],
      bases: { longchi: '辰', fengge: '戌', tianku: '午', tianxu: '午', tiande: '酉', yuede: '巳' },
      tiankongOffset: 1,
      tianShangPalaceOffset: 5,
      tianShiPalaceOffset: 7,
      xunkongAnchorStem: '癸'
    },

    monthMinorRule: {
      ruleId: 'ziwei.star.month-minor',
      label: '月系杂曜：解神自申戌子寅辰午六宫按生月两月一组取一宫，天姚自丑宫顺数生月，天刑自酉宫顺数生月，阴煞自寅子戌申午辰六宫按生月对六取模，天月按生月直取十二月表，天巫自巳申寅亥四宫按生月对四取模',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.78,
      yuejieByMonthHalf: ['申', '戌', '子', '寅', '辰', '午'],
      tianyaoBase: '丑',
      tianxingBase: '酉',
      yinshaByMonthMod6: ['寅', '子', '戌', '申', '午', '辰'],
      tianyueByMonth: ['戌', '巳', '辰', '寅', '未', '卯', '亥', '未', '寅', '午', '戌', '寅'],
      tianwuByMonthMod4: ['巳', '申', '寅', '亥']
    },

    dayMinorRule: {
      ruleId: 'ziwei.star.day-minor',
      label: '日系杂曜：三台自左辅宫位顺数日序，八座自右弼宫位逆数日序，恩光自文昌宫位顺数日序再退一位，天贵自文曲宫位顺数日序再退一位；日序以农历日数计，晚子时用当日、其余时辰用前一日',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.75,
      santaiFrom: 'zuofu',
      bazuoFrom: 'youbi',
      enguangFrom: 'wenchang',
      tianguiFrom: 'wenqu',
      enguangOffset: -1,
      tianguiOffset: -1,
      dayIndexLateZiOffset: 0,
      dayIndexOtherOffset: -1
    },

    hourMinorRule: {
      ruleId: 'ziwei.star.hour-minor',
      label: '时系杂曜：台辅自午宫顺数生时，封诰自寅宫顺数生时',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.78,
      taifuBase: '午',
      fenggaoBase: '寅',
      direction: 1
    },

    hongluanTianxiRule: {
      ruleId: 'ziwei.star.hongluan-tianxi',
      label: '红鸾天喜按年支定位：自卯宫逆数年支子基序号得红鸾，红鸾对宫（顺六位）得天喜',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.8,
      hongluanBase: '卯',
      direction: -1,
      tianxiOffset: 6
    },

    changshengRule: {
      ruleId: 'ziwei.twelve-gods.changsheng',
      label: '长生十二神：起宫按五行局（水二局与土五局起申、木三局起亥、金四局起巳、火六局起寅），顺序为长生沐浴冠带临官帝旺衰病死墓绝胎养，阳男阴女顺行、阴男阳女逆行',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.82,
      startByClass: { 2: '申', 3: '亥', 4: '巳', 5: '申', 6: '寅' },
      order: ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'],
      genderPolarity: { male: '阳', female: '阴' },
      branchPolarity: { even: '阳', odd: '阴' },
      direction: { same: 1, opposite: -1 }
    },

    boshiRule: {
      ruleId: 'ziwei.twelve-gods.boshi',
      label: '博士十二神：自禄存宫位起博士，顺序为博士力士青龙小耗将军奏书飞廉喜神病符大耗伏兵官府，方向与长生十二神一致（阳男阴女顺行、阴男阳女逆行）',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.8,
      startFrom: '禄存',
      order: ['博士', '力士', '青龙', '小耗', '将军', '奏书', '飞廉', '喜神', '病符', '大耗', '伏兵', '官府'],
      genderPolarity: { male: '阳', female: '阴' },
      branchPolarity: { even: '阳', odd: '阴' },
      direction: { same: 1, opposite: -1 }
    },

    jiangqianRule: {
      ruleId: 'ziwei.twelve-gods.jiangqian',
      label: '将前十二神：起宫按年支三合（寅午戌年起午、申子辰年起子、巳酉丑年起酉、亥卯未年起卯），顺序为将星攀鞍岁驿息神华盖劫煞灾煞天煞指背咸池月煞亡神，一律顺行',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.8,
      startTable: {
        寅: '午', 午: '午', 戌: '午',
        申: '子', 子: '子', 辰: '子',
        巳: '酉', 酉: '酉', 丑: '酉',
        亥: '卯', 卯: '卯', 未: '卯'
      },
      order: ['将星', '攀鞍', '岁驿', '息神', '华盖', '劫煞', '灾煞', '天煞', '指背', '咸池', '月煞', '亡神'],
      direction: 1
    },

    suiqianRule: {
      ruleId: 'ziwei.twelve-gods.suiqian',
      label: '岁前十二神：自年支宫位起岁建，顺序为岁建晦气丧门贯索官符小耗大耗龙德白虎天德吊客病符，一律顺行（通行派第七位作大耗，中州派作岁破，本规则集只登记通行派）',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.78,
      startFromYearBranch: true,
      order: ['岁建', '晦气', '丧门', '贯索', '官符', '小耗', '大耗', '龙德', '白虎', '天德', '吊客', '病符'],
      direction: 1
    },

    soulBodyMasterRule: {
      ruleId: 'ziwei.star.soul-body-master',
      label: '命主身主：命主按命宫地支取 [0] 位（子贪狼、丑亥巨门、寅戌禄存、卯酉文曲、辰申廉贞、巳未武曲、午破军），身主按生年地支取 [1] 位（子午火星、丑未天相、寅申天梁、卯酉天同、辰戌文昌、巳亥天机）',
      evidence: 'traditional',
      source: ['ziwei-quanshu', 'iztro'],
      confidence: 0.8,
      table: {
        子: ['贪狼', '火星'],
        丑: ['巨门', '天相'],
        寅: ['禄存', '天梁'],
        卯: ['文曲', '天同'],
        辰: ['廉贞', '文昌'],
        巳: ['武曲', '天机'],
        午: ['破军', '火星'],
        未: ['武曲', '天相'],
        申: ['廉贞', '天梁'],
        酉: ['文曲', '天同'],
        戌: ['禄存', '文昌'],
        亥: ['巨门', '天机']
      }
    }

  },

  parameters: {
    yearBoundaryMode: 'lunar-new-year',
    leapMonthMode: 'split-fifteen',
    lateZiDayMode: 'next-day',
    timeIndexBasis: 'true-solar',
    palaceCount: 12,
    firstPalaceBranch: '寅',
    decadalYears: 10,
    xiaoxianCycleYears: 12,
    xiaoxianCycles: 10,
    leapSplitDay: 15,
    leapFixAppliesToLateZi: false,
    earlyZiHour: 0,
    lateZiHour: 23,
    lateZiTimeIndex: 12,
    timeIndexCount: 13
  },

  sources: {
    'ziwei-quanshu': {
      citation: '《紫微斗数全书》（明，托名陈抟）：安命身宫诀、定五行局法、起紫微星诀、安十四主星与十四辅星、年系/月系/日系/时系杂曜、长生与博士十二神、将前与岁前十二神、命主身主、起大限小限、生年四化',
      kind: 'traditional-text'
    },
    'na-yin-table': {
      citation: '六十甲子纳音表：五行局取命宫干支之纳音，水二局、木三局、金四局、土五局、火六局',
      kind: 'traditional-table'
    },
    'true-solar-time': {
      citation: '真太阳时 = 平太阳时 + (经度 − 120°)×4 分钟 + 均时差',
      kind: 'astronomical-reference'
    },
    iztro: {
      citation: 'SylarLong/iztro（MIT）：安星算法参照实现，用于交叉核对，不改变传统出处的证据类别',
      kind: 'reference-implementation'
    },
    'lunar-calendar-rule': {
      citation: '农历编排规则：朔日为月首、冬至所在月为十一月、无中气之月为闰月（ADR-0003）',
      kind: 'calendar-convention'
    }
  }
};
