/* ============================================================
 *  report.js —— 本地出报告工具（详批模板 18 节）
 *  数据来源：engine-adapter.js（唯一算法源 src/ + rules/ 的打包产物）
 *  解释来源：analysis.js 的 MingLi
 *  本文件不做任何历法或干支计算，只把已有结构按模板摊开填坑。
 *  红线：不下吉凶断语、不引入随机数、不读隐式当前时间、不调用任何模型、
 *        不发起任何网络请求、不写入本地存储；客户资料只在本机内存里。
 * ============================================================ */
import { API } from './engine-adapter.js';

(function () {
  'use strict';
  var B = API, A = window.MingLi, E = API.engine;
  var GAN = B.GAN, ZHI = B.ZHI, CANG = B.CANG;
  var POS_NAME = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };
  var GOOD_STARS = ['伏位', '生气', '天医', '延年'];
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 渲染小工具 ---------- */
  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html !== undefined) d.innerHTML = html;
    return d;
  }
  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function num(x) { return (Math.round(Number(x) * 100) / 100).toFixed(2); }
  function p(cls, html) { return el('div', cls || 'p', html); }
  function cell(c) {
    if (c === undefined || c === null) return '';
    if (typeof c === 'object' && c.raw !== undefined) return c.raw;
    return esc(c);
  }
  function tbl(head, rows) {
    var t = el('table');
    t.innerHTML = '<tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) {
        return '<tr>' + r.map(function (c) { return '<td>' + cell(c) + '</td>'; }).join('') + '</tr>';
      }).join('');
    return t;
  }
  function sec(no, title, required) {
    var s = el('div', 'sec');
    s.appendChild(el('h3', null, '<span class="no">' + esc(no) + '</span>' + esc(title) +
      (required ? '<span class="pill req">必填</span>' : '')));
    return s;
  }
  function area(id, hint) {
    var t = document.createElement('textarea');
    t.id = id;
    t.setAttribute('rows', '5');
    if (hint) t.setAttribute('placeholder', hint);
    return t;
  }
  /* 打印时填写框会跟着上纸面，高度必须按内容撑开，否则手写内容会被截断。 */
  function autoGrow(t) {
    if (!t || t.tagName !== 'TEXTAREA') return;
    t.style.height = 'auto';
    t.style.height = (t.scrollHeight + 4) + 'px';
  }
  function autoGrowAll() {
    var box = $('report');
    if (!box) return;
    Array.prototype.forEach.call(box.querySelectorAll('textarea'), autoGrow);
  }
  function fmtCivil(input) {
    return input.year + '-' + pad(input.month) + '-' + pad(input.day) + ' ' + pad(input.hour) + ':' + pad(input.minute);
  }

  /* ---------- 结构 → 文字 ---------- */
  function basisText(basis) {
    var parts = [];
    if (basis.palace) parts.push('宫位 ' + basis.palace);
    if (basis.tenGod) parts.push('十神 ' + basis.tenGod);
    if (basis.relation) parts.push('关系 ' + basis.relation);
    parts.push('ruleId ' + basis.ruleId);
    return parts.join('　·　');
  }
  function peItem(p0, id) {
    var list = p0.pastEvents || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function peBlock(p0, ids) {
    var wrap = el('div');
    var found = 0;
    ids.forEach(function (id) {
      var it = peItem(p0, id);
      if (!it) return;
      found += 1;
      wrap.appendChild(p('p', '<b>' + esc(it.tier) + '档</b>　' + esc(it.statement)));
      wrap.appendChild(p('mut', '依据：' + esc(basisText(it.basis)) + '<br>不确定性：' + esc(it.uncertainty)));
    });
    if (!found) wrap.appendChild(p('mut', '本规则集未登记这一组条目，本节留空由人工补写。'));
    return wrap;
  }
  function hitsOf(p0, position) {
    return ((p0.relations && p0.relations.hits) || []).filter(function (h) {
      return (h.positions || []).indexOf(position) >= 0;
    });
  }
  function hitsText(hits) {
    if (!hits.length) return '无刑、冲、破、害、空亡';
    return hits.map(function (h) {
      return h.name + '（' + (h.positions || []).map(function (x) { return POS_NAME[x] || x; }).join('—') + '）';
    }).join('、');
  }
  function daYunOf(p0, year) {
    if (!p0.daYun) return null;
    var hit = null;
    p0.daYun.list.forEach(function (d) { if (year >= d.startYear) hit = d; });
    return hit;
  }

  /* ---------- 后续月份段：只调用引擎的节气与月柱规则，不在这里重写历法 ---------- */
  function monthSegments(reportDate, ruleSet, count) {
    var dp = String(reportDate).split('-');
    var start = E.civilToUTC({ year: +dp[0], month: +dp[1], day: +dp[2], hour: 12, minute: 0 }, 'Asia/Shanghai');
    var out = [];
    var cursor = start.jdUTC;
    for (var i = 0; i < count; i++) {
      var b = E.nextMonthBoundary(cursor);
      if (!b) break;
      var civil = E.utcToCivil(b.utc);
      var nxt = E.nextMonthBoundary(b.utc + 0.5);
      var end = nxt ? E.utcToCivil(nxt.utc) : null;
      var ys = E.yearPillar(civil.year, civil.month, civil.day, { ruleSet: ruleSet })[0];
      out.push({
        name: b.name,
        from: civil.year + '-' + pad(civil.month) + '-' + pad(civil.day),
        to: end ? end.year + '-' + pad(end.month) + '-' + pad(end.day) : '—',
        pillar: E.monthPillar(ys, b.degree, { ruleSet: ruleSet })
      });
      cursor = b.utc + 0.5;
    }
    return out;
  }
  function dayAnchor(ruleSet, y, m, d) {
    var jd = E.civilToUTC({ year: y, month: m, day: d, hour: 12, minute: 0 }, 'Asia/Shanghai').jdUTC;
    return E.dayPillar(jd, ruleSet);
  }

  /* ---------- 表单 ---------- */
  function readForm() {
    var errors = [];
    var dstr = String($('date').value).trim(), tstr = String($('time').value).trim();
    if (!dstr || !tstr) errors.push('出生日期与出生时间都要填：真太阳时校正要用到具体时刻。');
    var lngRaw = String($('lng').value).trim(), lng = Number(lngRaw);
    if (lngRaw === '') errors.push('出生地经度要填（东经度数，中国境内约 73–135）。');
    else if (!isFinite(lng)) errors.push('经度需为数字，当前填的是「' + lngRaw + '」。');
    else if (lng < 0 || lng > 180) errors.push('经度需在 0–180 之间，当前填的是 ' + lng + '。');
    var byRaw = String($('baseYear').value).trim(), by = Number(byRaw);
    if (!/^[0-9]{4}$/.test(byRaw) || by < 1900 || by > 2200) {
      errors.push('流年基准年要填四位年份（如 2026），当前填的是「' + byRaw + '」。工具不替你假定现在是哪一年。');
    }
    var rd = String($('reportDate').value).trim();
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(rd)) errors.push('报告日期要填完整，用于推导之后的月份段。');
    if (errors.length) return { errors: errors };
    var dp = dstr.split('-'), tp = tstr.split(':');
    var name = String($('name').value || '').trim();
    return {
      name: name || '（未填姓名）',
      gender: $('gender').value,
      year: +dp[0], month: +dp[1], day: +dp[2],
      hour: +tp[0], minute: +tp[1],
      lng: lng,
      useTrueSolar: $('ts').value === '1',
      asOfYear: by,
      reportDate: rd
    };
  }

  /* ---------- 主渲染 ---------- */
  function render(opt) {
    var p0 = B.paipan(opt);
    var ws = A.wangShuai(p0);
    var gua = A.mingGua(p0.guaYear, opt.gender);
    var bz = A.baZhai(gua.gua);
    var n5 = A.wuGe(opt.name === '（未填姓名）' ? '' : opt.name);
    var ruleSet = E.getRuleSet(p0.chart.manifest.ruleSetId);
    var months = monthSegments(opt.reportDate, ruleSet, 6);
    var clock = opt.useTrueSolar ? B.paipan(Object.assign({}, opt, { useTrueSolar: false })) : null;

    var box = $('report');
    box.className = 'rep';
    box.innerHTML = '';

    /* 抬头：口径与指纹必须跟着报告走，换一台机器也要能核对 */
    var head = el('div', 'sec');
    head.appendChild(el('h3', null, '详批底稿'));
    head.appendChild(p('p', '<b>' + esc(opt.name) + '</b>　' + esc(p0.gender) + '　公历 ' + esc(fmtCivil(p0.input)) +
      '　出生地经度 ' + esc(p0.input.lng)));
    head.appendChild(p('mut', esc(opt.useTrueSolar ? '时制：真太阳时' : '时制：钟表时间') +
      '　流年基准年 ' + esc(opt.asOfYear) + '　报告日期 ' + esc(opt.reportDate) +
      '　生肖 ' + esc(p0.zodiac) + '　月令 ' + esc(p0.monthTerm || '—')));
    head.appendChild(p('mut', '引擎版本 ' + esc(p0.engine.version) + '　四柱规则集 ' + esc(p0.engine.ruleSetId) +
      '　星历模型 ' + esc(p0.engine.ephemeris) + '　内容指纹 ' + esc(p0.engine.sourceHash)));
    head.appendChild(p('mut', '本底稿由同一份引擎产物自动填坑：结构、依据与口径都可复核；判词、结论与责任由出具人承担。'));
    box.appendChild(head);

    /* 〇 验证结果与认账（必填） */
    var s0 = sec('〇', '验证结果与认账', true);
    s0.appendChild(p('mut', '先写这一段：前测结论按条数写（清单共 __ 条，其中「像」__ 条、「不像」__ 条、「不确定」__ 条），' +
      '再列判对与判错。判错项不得淡化措辞；若本次触发 R-01（凶象往轻里读），必须在此点名。'));
    s0.appendChild(area('sec0', '判对（3–5 条，注明是哪条判断）：\n判错（全部，一条不藏）：\n错因（错在哪 → 为什么错 → 应改成什么读法）：'));
    box.appendChild(s0);

    /* 一 真太阳时校正 */
    var s1 = sec('一', '真太阳时校正');
    if (p0.trueSolar) {
      s1.appendChild(p('p', '真太阳时 ≈ <b>' + pad(p0.trueSolar.h) + ':' + pad(p0.trueSolar.mi) + '</b>　经度项 ' +
        num(p0.trueSolar.lonFix) + ' 分钟　均时差 ' + num(p0.trueSolar.eqt) + ' 分钟'));
      s1.appendChild(tbl(['项目', '取值'], [
        ['钟表时间', fmtCivil(p0.input)],
        ['出生地经度', String(p0.input.lng)],
        ['经度项（经度 − 120）× 4', num(p0.trueSolar.lonFix) + ' 分钟'],
        ['均时差', num(p0.trueSolar.eqt) + ' 分钟'],
        ['真太阳时', pad(p0.trueSolar.h) + ':' + pad(p0.trueSolar.mi)],
        ['跨日偏移', String(p0.trueSolar.dayShift) + ' 天'],
        ['是否跨时辰', clock && clock.gz[3] !== p0.gz[3]
          ? '是（钟表时柱 ' + clock.gz[3] + ' → 真太阳时时柱 ' + p0.gz[3] + '），必须做双盘比对'
          : '否，时柱未变']
      ]));
    } else {
      s1.appendChild(p('mut', '本次按钟表时间排盘，未做经度与均时差校正。若出生地经度偏离东经 120 度较多，' +
        '建议改用真太阳时重排一遍再交付。'));
    }
    box.appendChild(s1);

    /* 二 四柱排盘 */
    var s2 = sec('二', '四柱排盘');
    s2.appendChild(tbl(['柱', '年柱', '月柱', '日柱', '时柱'], [
      ['天干'].concat(p0.gan),
      ['地支'].concat(p0.zhi),
      ['十神'].concat([p0.shiShen.year, p0.shiShen.month, p0.shiShen.day, p0.shiShen.hour]),
      ['藏干'].concat(p0.zhi.map(function (z) { return (CANG[z] || []).join(''); })),
      ['本气十神'].concat(p0.zhiShiShen)
    ]));
    s2.appendChild(p('mut', '旬空（按日柱所在旬定）：' + esc(p0.xunKong.length ? p0.xunKong.join('、') : '未判定') +
      '。旬空来自引擎的关系派生，页面不再自带第二张表。'));
    s2.appendChild(p('mut', '校验锚点（由同一份引擎现算）：1949-10-01 12:00 → ' + esc(dayAnchor(ruleSet, 1949, 10, 1)) +
      '；2000-01-01 12:00 → ' + esc(dayAnchor(ruleSet, 2000, 1, 1)) +
      '。两处不符说明引擎产物与预期不一致，先不要交付。'));
    box.appendChild(s2);

    /* 三 十神结构 */
    var s3 = sec('三', '十神结构');
    s3.appendChild(p('p', '透干：年 ' + esc(p0.shiShen.year) + '　月 ' + esc(p0.shiShen.month) +
      '　日 日主　时 ' + esc(p0.shiShen.hour)));
    s3.appendChild(p('p', '藏干本气：' + esc(p0.zhiShiShen.join('、'))));
    var struct = peItem(p0, 'ten-god-structure');
    s3.appendChild(p(struct ? 'p' : 'mut', struct ? esc(struct.statement) : '本规则集未登记十神结构条目，本节留空由人工补写。'));
    box.appendChild(s3);

    /* 四 旺衰与用神 */
    var s4 = sec('四', '旺衰与用神');
    s4.appendChild(tbl(['项目', '取值'], [
      ['日主', p0.gan[2] + '（' + p0.dayGanWx + '）'],
      ['结论', ws.strong],
      ['用神', ws.yong.join('、')],
      ['喜神', ws.xi],
      ['忌神', ws.ji.join('、')],
      ['同党合计 / 异党合计', String(ws.tong) + ' / ' + String(ws.yi)],
      ['五行力量（绝对条数）', '木 ' + ws.score.木 + '　火 ' + ws.score.火 + '　土 ' + ws.score.土 +
        '　金 ' + ws.score.金 + '　水 ' + ws.score.水],
      ['计权口径', String(p0.wx.method) + '　权重 ' + (p0.wx.weights || []).join(' / ')],
      ['规则集', String(p0.wx.ruleSet)],
      ['分档阈值', '强 ' + ws.thresholds.strong + '　偏强 ' + ws.thresholds.slightlyStrong +
        '　偏弱 ' + ws.thresholds.slightlyWeak]
    ]));
    s4.appendChild(p('mut', '五行力量只给绝对条数与计权口径，不折算成比例。阈值随口径选择，标定过程见 ADR-0007。'));
    box.appendChild(s4);

    /* 五 大运 */
    var s5 = sec('五', '大运');
    if (p0.daYun) {
      s5.appendChild(p('p', '大运' + (p0.daYun.forward ? '顺排' : '逆排') + '，起运 <b>' +
        p0.daYun.startAge.toFixed(2) + ' 岁</b>　换算口径 ' + esc(p0.daYun.method) +
        '　ruleId ' + esc(p0.daYun.ruleId)));
      s5.appendChild(tbl(['起止年', '大运', '与日主关系', '判词方向'], p0.daYun.list.map(function (d, i) {
        var next = p0.daYun.list[i + 1];
        return [String(d.startYear) + '–' + (next ? String(next.startYear - 1) : '—'), d.gz, d.shiShen,
          A.SS_MEAN[d.shiShen] || '—'];
      })));
      s5.appendChild(p('mut', '判词方向来自十神的通用含义，只说明这一步大运的着力方向，不等于这十年的实际好坏。'));
    } else {
      s5.appendChild(p('mut', '本次未产出大运结构。'));
    }
    box.appendChild(s5);

    /* 六 已发生之事验证（前事区） */
    var s6 = sec('六', '已发生之事验证（前事区）');
    s6.appendChild(p('mut', '本节必须在拿到客户答案之前写完，写成后不改；客户打分后回到〇章回填。'));
    var pe = p0.pastEvents || [];
    if (pe.length) {
      s6.appendChild(tbl(['#', '判断', '推导依据', '客户打分'], pe.map(function (it, i) {
        return [String(i + 1), it.statement, basisText(it.basis) + '　程度档 ' + it.tier, ''];
      })));
      s6.appendChild(p('mut', '共 ' + pe.length + ' 条，落在 5–8 条的公开区间内。逐条打标在自检页完成，这里留白由客户手写。'));
    } else {
      s6.appendChild(p('mut', '本次未产出前事清单：规则集缺条目时整组跳过，不补默认值。'));
    }
    box.appendChild(s6);

    /* 七 家庭结构 */
    var s7 = sec('七', '家庭结构');
    s7.appendChild(peBlock(p0, ['month-palace', 'month-ten-god', 'month-qi']));
    s7.appendChild(p('mut', '父母宫（月支 ' + esc(p0.gz[1][1]) + '）命中的关系：' + esc(hitsText(hitsOf(p0, 'month'))) + '。'));
    s7.appendChild(p('mut', '程度分级与理由已在上面逐条给出，兄弟姐妹的落点由人工判断。'));
    box.appendChild(s7);

    /* 八 感情 / 婚姻 */
    var s8 = sec('八', '感情 / 婚姻');
    s8.appendChild(peBlock(p0, ['spouse-palace']));
    s8.appendChild(p('mut', '夫妻宫（日支 ' + esc(p0.gz[2][1]) + '）命中的关系：' + esc(hitsText(hitsOf(p0, 'day'))) + '。'));
    s8.appendChild(p('mut', '配偶星、大运对婚姻的十年作用与婚期窗口需人工判断，本底稿只给结构。'));
    box.appendChild(s8);

    /* 九 事业 / 财运 */
    var s9 = sec('九', '事业 / 财运');
    s9.appendChild(peBlock(p0, ['ten-god-structure']));
    s9.appendChild(p('mut', '财星与官星的具体落点、适合方向与忌的方向由人工填写；用神与忌神见「四、旺衰与用神」。'));
    box.appendChild(s9);

    /* 十 学业 / 考试 */
    var s10 = sec('十', '学业 / 考试');
    s10.appendChild(p('mut', '印星与食伤的结构见「三、十神结构」与「九、事业 / 财运」，此处不重复列举。'));
    s10.appendChild(p('mut', '注意：偏印不吃应试套路不等于考不好。临场爆发力要看食伤与大运的配合，不能直接等价成成绩差。'));
    box.appendChild(s10);

    /* 十一 八宅命卦 */
    var s11 = sec('十一', '八宅命卦');
    s11.appendChild(p('p', '命卦 <b>' + esc(gua.gua) + '</b>（数 ' + esc(gua.number) + '）　' + esc(gua.eastWest) +
      '　命卦用年 ' + esc(p0.guaYear) + '（与年柱同口径，立春换年）'));
    s11.appendChild(tbl(['方位', '星名', '含义', '用法'], bz.list.map(function (x) {
      return [x.dir, x.star, x.mean, GOOD_STARS.indexOf(x.star) >= 0 ? '宜作卧室 / 书房 / 办公位' : '不宜作大门 / 主卧 / 炉灶'];
    })));
    s11.appendChild(p('mut', '床位、办公位与入户门的最终建议由人工结合户型朝向判断填写。'));
    box.appendChild(s11);

    /* 十二 玄空流年飞星：引擎没有这套表，必须显式留空，不许编造 */
    var s12 = sec('十二', '玄空流年飞星');
    s12.appendChild(p('p', '本工具不计算飞星，需人工填写。'));
    s12.appendChild(p('mut', '飞星涉及年星入中与九宫飞泊，本工具的引擎未登记这套表；按项目纪律，缺表即整组跳过，' +
      '不回退默认值，也不编造一个数字填上去。'));
    s12.appendChild(area('sec12', '入中星：\n五黄、二黑落宫：\n布局建议：'));
    box.appendChild(s12);

    /* 十三 姓名分析 */
    var s13 = sec('十三', '姓名分析');
    if (n5.ok) {
      s13.appendChild(tbl(['五格', '数', '数理'], Object.keys(n5.ge).map(function (k) {
        return [k, String(n5.ge[k]), (n5.detail[k] || {}).text || '—'];
      })));
      s13.appendChild(p('mut', '三才：' + esc(n5.sanCai.join('')) + '　康熙笔画：' + esc(n5.bi.join(' / '))));
      if (n5.notes && n5.notes.length) s13.appendChild(p('mut', '笔画异说：' + esc(n5.notes.join('；'))));
      s13.appendChild(p('mut', '用字五行与喜用是否冲突、改名方案（3 套，要求五格全吉 + 补用神）由人工填写。'));
    } else {
      var reason = {
        'no-name': '未填姓名，本节跳过；填上姓名后重新生成即可自动补上。',
        'unknown-char': '未收录字形：' + esc((n5.unknown || []).join('、')) + '。不编造笔画，本节跳过。',
        'unsupported-length': '姓名 ' + esc(n5.length) + ' 字，本工具只覆盖 2–4 字，本节跳过。'
      }[n5.reason] || '姓名分析不可用，本节跳过。';
      s13.appendChild(p('mut', reason));
    }
    box.appendChild(s13);

    /* 十四 流年逐年建议 */
    var s14 = sec('十四', '流年逐年建议');
    var years = (p0.liuNian || []).filter(function (x) { return x.year >= p0.displayYear; }).slice(0, 10);
    s14.appendChild(p('mut', '从流年基准年 ' + esc(p0.displayYear) + ' 起十年。干支、十神与所处大运由引擎给出，' +
      '利 / 忌与具体动作由人工填写。'));
    s14.appendChild(tbl(['年份', '干支', '十神', '所处大运', '盘面五行', '利 / 忌 / 具体动作'], years.map(function (x) {
      var dy = daYunOf(p0, x.year);
      return [String(x.year), x.gz, x.shiShen, dy ? dy.gz + '（' + dy.shiShen + '）' : '未交运',
        '干 ' + E.elementOfStem(x.gz[0], ruleSet) + '、支 ' + E.elementOfBranch(x.gz[1], ruleSet), ''];
    })));
    box.appendChild(s14);

    /* 十五 总纲 */
    var s15 = sec('十五', '总纲');
    s15.appendChild(p('mut', '一句话结论由人工填写：写顺水还是逆水，不写必然到岸。'));
    s15.appendChild(area('sec15', '一句话：'));
    box.appendChild(s15);

    /* 十六 可核验前瞻（必填） */
    var s16 = sec('十六', '可核验前瞻', true);
    s16.appendChild(p('mut', '只写尚未发生的事；必须带月份区间与干支；必须可对账。禁止恐吓式表述，' +
      '涉及健康一律注明以专业机构意见为准。'));
    if (months.length) {
      s16.appendChild(tbl(['时段', '月柱', '盘面', '判词'], months.map(function (m0) {
        return [m0.from + ' ~ ' + m0.to + '（' + m0.name + '起）', m0.pillar, '', ''];
      })));
      s16.appendChild(p('mut', '上表的时段与月柱由引擎按节气边界推得，是给你填判词的骨架；判词必须具体到可对账。'));
    }
    s16.appendChild(area('sec16', '可核验判词（请客户在 __ 之后回来对账）：\n回访安排：'));
    box.appendChild(s16);

    /* 十七 不确定项与免责 */
    var s17 = sec('十七', '不确定项与免责');
    var ul = el('ul');
    ['本报告为传统文化咨询与娱乐参考，不构成医疗、投资、法律建议。',
      '不确定性较高的结论，由出具人在〇章与十六章逐条写明，不藏在正文里。',
      '命理判顺水还是逆水，不判必然到岸。',
      '重大决定请以现实依据为主。'].forEach(function (t) { ul.appendChild(el('li', null, esc(t))); });
    s17.appendChild(ul);
    s17.appendChild(p('mut', '内容指纹 ' + esc(p0.engine.sourceHash) + '　引擎版本 ' + esc(p0.engine.version) +
      '　四柱规则集 ' + esc(p0.engine.ruleSetId) + '　紫微规则集 ' + esc(p0.engine.ziweiRuleSetId)));
    box.appendChild(s17);
    Array.prototype.forEach.call(box.querySelectorAll('textarea'), function (t) {
      t.addEventListener('input', function () { autoGrow(t); });
    });
    autoGrowAll();
  }

  /* ---------- 必填校验与打印 ---------- */
  function missingSections() {
    var miss = [];
    var a = $('sec0'), b = $('sec16');
    if (!a || !String(a.value).trim()) miss.push('〇 验证结果与认账');
    if (!b || !String(b.value).trim()) miss.push('十六 可核验前瞻');
    return miss;
  }
  function showErrors(list) {
    var status = $('fillStatus');
    status.innerHTML = '';
    var d = el('div', 'miss');
    d.innerHTML = '还差这些才能生成底稿：<ul>' +
      list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    status.appendChild(d);
    status.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderStatus() {
    var status = $('fillStatus');
    if (!status) return;
    status.innerHTML = '';
    var miss = missingSections();
    if (miss.length) {
      var d = el('div', 'miss');
      d.innerHTML = '打印前还缺：<ul>' +
        miss.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
        '这两章是本产品与普通算命的分界线：〇章写清判对与判错，十六章写清尚未发生、到期可对账的判断。报告不隐藏，补齐即可。';
      status.appendChild(d);
    } else {
      // 缺项警告要能印上纸面（操作者可能直接用浏览器快捷键打印）；
      // 「已填齐」只是操作反馈，不必占纸面。
      status.appendChild(el('div', 'okline no-print', '〇 与 十六 两章已填，可以直接打印或另存为 PDF。'));
    }
  }
  function run() {
    var opt = readForm();
    if (opt.errors) { showErrors(opt.errors); return; }
    try {
      render(opt);
    } catch (error) {
      showErrors(['生成底稿时出错：' + String(error && error.message ? error.message : error)]);
      return;
    }
    renderStatus();
  }

  /* ---------- 初始化 ---------- */
  (function init() {
    var fill = $('fill');
    var bar = el('div', 'no-print');
    bar.innerHTML = '<div class="actions"><button class="btn-main" id="print">检查并打印</button>' +
      '<button class="btn-ghost" id="top">回到顶部改输入</button></div>' +
      '<div class="hint" style="margin-bottom:14px">〇 与 十六 两章填完再打印；打印时在浏览器里选「另存为 PDF」，' +
      '打印样式自动切成白底，输入区与提示不进入纸面。</div>';
    fill.appendChild(bar);
    var status = el('div');
    status.id = 'fillStatus';
    fill.appendChild(status);

    $('go').addEventListener('click', run);
    $('back').addEventListener('click', function () { location.href = 'paipan.html'; });
    // 用事件委托盯住两处必填章：改完内容提示立刻更新，
    // 避免操作者用浏览器快捷键打印时把过期的缺项提示印上纸面。
    $('report').addEventListener('input', function (event) {
      var id = event.target && event.target.id;
      if (id === 'sec0' || id === 'sec16') renderStatus();
    });
    $('print').addEventListener('click', function () {
      var miss = missingSections();
      renderStatus();
      if (!miss.length) {
        autoGrowAll();
        window.print();
      }
    });
    $('top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  })();
})();
