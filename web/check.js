/* ============================================================
 *  check.js —— 盘面自检页
 *  数据来源：engine-adapter.js（唯一算法源 src/ + rules/ 的打包产物）
 *  本文件不做任何历法或干支计算，只把已有结构摊开给用户核对。
 *  红线：不下吉凶断语、不预测未来、不调用任何模型、不引入随机数。
 * ============================================================ */
import { API } from './engine-adapter.js';

(function () {
  'use strict';
  var B = API, GAN = B.GAN, ZHI = B.ZHI, CANG = B.CANG;
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html !== undefined) d.innerHTML = html;
    return d;
  }
  function kv(k, v) {
    return '<div class="kv"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]; }); }

  function readForm() {
    var dstr = $('date').value, tstr = $('time').value;
    if (!dstr || !tstr) return { error: '请填写完整的出生日期与时间。' };
    var dp = dstr.split('-'), tp = tstr.split(':');
    var raw = String($('lng').value).trim(), lng = Number(raw);
    if (raw === '') return { error: '请填写出生地经度（东经度数）。' };
    if (!isFinite(lng)) return { error: '经度需为数字，当前填的是「' + raw + '」。' };
    if (lng < 0 || lng > 180) return { error: '经度需在 0–180 之间（中国境内约 73–135），当前填的是 ' + lng + '。' };
    var result = {
      name: '自检', gender: $('gender').value,
      year: +dp[0], month: +dp[1], day: +dp[2],
      hour: +tp[0], minute: +tp[1], lng: lng,
      useTrueSolar: $('ts').value === '1'
    };
    var yearRaw = $('asof') ? String($('asof').value).trim() : '';
    if (yearRaw !== '') {
      var asOfYear = Number(yearRaw);
      if (!Number.isInteger(asOfYear)) return { error: '核对年份需为整数，例如 2020。留空则不做重复年份这一问。' };
      result.asOfYear = asOfYear;
    }
    return result;
  }

  /* ---------- 自检条目：只用确定性结构，不含任何吉凶判断 ---------- */
  function buildItems(opt) {
    var p = B.paipan(opt);
    var z = B.ziwei(opt);
    var items = [];

    /* 1. 起运与交运时间 */
    var dy = p.daYun;
    var startYear = p.input.year + Math.floor(dy.startAge);
    items.push({
      q: '你大约在几岁开始明显脱离原生家庭的节奏（升学、离家、独立谋生）？',
      a: '本盘起运 <b>' + dy.startAge.toFixed(2) + ' 岁</b>，约在 <b>' + startYear + '</b> 年前后交入第一步大运 ' +
         '<b>' + dy.list[0].gz + '</b>（' + dy.list[0].shiShen + '）。' +
         '传统上「交运」前后一两年常有环境变动。若你的实际转折点与之相距很远，值得回头核一下出生时辰。'
    });

    /* 2. 当前所处大运 */
    var nowYear = new Date().getFullYear();
    var cur = dy.list.filter(function (d) { return nowYear >= d.startYear; }).pop();
    if (cur) {
      var nxt = dy.list[dy.list.indexOf(cur) + 1];
      items.push({
        q: '最近十年，你的主要精力更偏向哪一类事？',
        a: '你现在处于 <b>' + cur.gz + '</b> 大运（' + cur.shiShen + '，' + cur.startYear + '–' +
           (nxt ? (nxt.startYear - 1) : '—') + '）。' + shiShenMeaning(cur.shiShen) +
           '对照这几年的实际重心，看方向是否吻合。'
      });
    }

    /* 3. 过去若干年的流年，交由用户自己打标 */
    var years = [];
    for (var y = nowYear - 6; y <= nowYear - 1; y++) years.push(B.flowYear(y, p));
    items.push({ flowYears: years });

    /* 4. 命宫与身宫 */
    items.push({
      q: '命宫描述的是「先天的底色」，身宫偏向「后天着力处」。',
      a: '命宫在 <b>' + z.soul.branch + '宫</b>（' + z.soul.stem + z.soul.branch + '），' +
         '身宫在 <b>' + z.body.branch + '宫</b>' + (z.body.palaceIndex === z.soul.palaceIndex ? '（命身同宫）' : '') + '。' +
         '五行局 <b>' + z.fiveElements.name + '</b>，命主 <b>' + z.masters.soulMaster + '</b>、身主 <b>' + z.masters.bodyMaster + '</b>。'
    });

    /* 5. 五行偏枯 */
    var ws = window.MingLi.wangShuai(p);
    var miss = ws.missing.length ? '缺 ' + ws.missing.join('、') : '五行俱全';
    items.push({
      q: '你的性格与体质，更像哪一边？',
      a: '日主 <b>' + p.gan[2] + '</b>（' + p.dayGanWx + '），五行' + miss + '，最旺 <b>' + ws.most +
         '</b>、最弱 <b>' + ws.least + '</b>，判为 <b>' + ws.strong + '</b>。' +
         '偏旺者通常主见强、行动先于顾虑；偏弱者更依赖外部条件与配合。以你自己的实际感受为准。'
    });

    return { p: p, z: z, items: items };
  }

  function shiShenMeaning(s) {
    var m = {
      '正财': '主稳定收入、务实经营与家庭责任。',
      '偏财': '主机会性收入、外部资源与人际往来。',
      '正官': '主职位、名分、规则与被认可。',
      '七杀': '主压力、竞争与突破，也主强约束。',
      '正印': '主学习、文书、庇护与长辈助力。',
      '偏印': '主专业钻研、独立思路与内省。',
      '比肩': '主同伴、同辈与自立。',
      '劫财': '主竞争、分利与果断。',
      '食神': '主才华舒展、生活品质与创作。',
      '伤官': '主表达欲、技术锋芒与不服管束。'
    };
    return m[s] || '';
  }

  /* ---------- 时辰对照：让用户用已发生的事反推时辰 ---------- */
  function buildHourCandidates(opt) {
    var hour = opt.hour, minute = opt.minute;
    var out = [];
    [-2, -1, 0, 1, 2].forEach(function (delta) {
      var total = hour * 60 + minute + delta * 120;
      var dayShift = Math.floor(total / 1440);
      var wrapped = ((total % 1440) + 1440) % 1440;
      var base = new Date(Date.UTC(opt.year, opt.month - 1, opt.day));
      base.setUTCDate(base.getUTCDate() + dayShift);
      var o = {
        name: '自检', gender: opt.gender,
        year: base.getUTCFullYear(), month: base.getUTCMonth() + 1, day: base.getUTCDate(),
        hour: Math.floor(wrapped / 60), minute: Math.floor(wrapped % 60),
        lng: opt.lng, useTrueSolar: opt.useTrueSolar, asOfYear: opt.asOfYear
      };
      var p = B.paipan(o);
      var z = B.ziwei(o);
      out.push({
        delta: delta,
        clock: pad(o.hour) + ':' + pad(o.minute),
        shiChen: ZHI[p.pillars[3].zhi] + '时',
        hourPillar: p.gz[3],
        soulBranch: z.soul.branch,
        fiveElements: z.fiveElements.name,
        soulMaster: z.masters.soulMaster,
        soulMajors: (z.palaces.find(function (q) { return q.isSoulPalace; }) || {}).majorStars || [],
        p: p, z: z
      });
    });
    return out;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- 渲染 ---------- */
  function render(opt) {
    var built = buildItems(opt);
    var p = built.p, z = built.z;
    var box = $('result');
    box.innerHTML = '';
    box.style.display = 'block';

    /* A. 盘面摘要 */
    var c1 = el('div', 'card');
    c1.appendChild(el('h2', null, '盘面摘要'));
    var g1 = el('div', 'grid2');
    g1.innerHTML =
      '<div>' + kv('公历', p.input.year + '-' + pad(p.input.month) + '-' + pad(p.input.day) + ' ' + pad(p.input.hour) + ':' + pad(p.input.minute)) +
      kv('真太阳时', p.trueSolar ? pad(p.trueSolar.h) + ':' + pad(p.trueSolar.mi) : '未启用') + '</div>' +
      '<div>' + kv('四柱', p.gz.join(' ')) +
      kv('紫微命宫 / 五行局', z.soul.branch + '宫 / ' + z.fiveElements.name) + '</div>';
    c1.appendChild(g1);
    box.appendChild(c1);

    /* B. 自检问答 */
    var c2 = el('div', 'card');
    c2.appendChild(el('h2', null, '逐条自检'));
    var list = el('div', 'cklist');
    built.items.forEach(function (it) {
      if (it.flowYears) return; // 流年单独渲染
      var row = el('div', 'ckrow');
      row.innerHTML = '<div class="q">' + it.q + '</div><div class="a">' + it.a + '</div>';
      list.appendChild(row);
    });
    c2.appendChild(list);
    box.appendChild(c2);

    /* B2. 前事验证清单：条目与程度分档全部由解释层给出，页面只负责渲染与打标。
     *     汇总只报条数 —— 用户标了几条像、几条不像、几条不确定，不折算成任何比例。 */
    var c2b = el('div', 'card');
    c2b.appendChild(el('h2', null, '前事验证（先对已经发生的事）'));
    c2b.appendChild(el('div', 'hint',
      '下面是固定问题。每条先看问题，再看什么算像、什么不算。程度仍是轻 / 中 / 重，不换算成分数。' +
      '请按你的真实经历点：像、不像、或不确定。页面只统计条数。' +
      '依据默认收起。对不上时，先回头核对出生时辰和出生地。'));
    var pe = p.pastEvents || [];
    var omitted = pe.omitted || [];
    if (!pe.length) {
      c2b.appendChild(el('div', 'note', '当前规则集未登记前事解释层条目，本区块不出清单。'));
    } else {
      if (omitted.length) {
        c2b.appendChild(el('div', 'note', esc(omitted.map(function (item) { return item.notice; }).join(' '))));
      }
      var pelist = el('div', 'cklist');
      var peMarks = {};
      pe.forEach(function (item) {
        var row = el('div', 'ckrow');
        row.setAttribute('data-pe', item.id);
        var basis = [];
        if (item.basis.palace) basis.push('宫位 ' + item.basis.palace);
        if (item.basis.tenGod) basis.push('十神 ' + item.basis.tenGod);
        if (item.basis.relation) basis.push('关系 ' + item.basis.relation);
        basis.push('依据 ' + item.basis.ruleId);
        row.innerHTML =
          '<div class=q>' + esc(item.question || item.statement) + '</div>' +
          '<div class=a>像：' + esc(String(item.counts || '').replace(/^像：/, '')) + '</div>' +
          '<div class=a>不像：' + esc(String(item.doesNotCount || '').replace(/^不像：/, '')) + '</div>' +
          '<div class=a>程度 <b>' + esc(item.tier) + '</b></div>' +
          '<details><summary>依据</summary><div class=a>' + esc(basis.join('　·　')) +
            '。' + esc(item.uncertainty) + '</div></details>' +
          '<div class=pick>' +
            '<button data-pe-mark=像>像</button>' +
            '<button data-pe-mark=不像>不像</button>' +
            '<button data-pe-mark=不确定>不确定</button>' +
          '</div>';
        pelist.appendChild(row);
      });
      c2b.appendChild(pelist);
      var peSummary = el('div', 'hint');
      peSummary.id = 'peSummary';
      peSummary.style.marginTop = '16px';
      peSummary.innerHTML = '还没有标记。按你的实际经历点一下上面的按钮。';
      c2b.appendChild(peSummary);
      c2b.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-pe-mark]');
        if (!b) return;
        var row = b.closest('[data-pe]');
        var id = row.getAttribute('data-pe');
        peMarks[id] = b.getAttribute('data-pe-mark');
        row.querySelectorAll('button[data-pe-mark]').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var like = 0, unlike = 0, unsure = 0;
        Object.keys(peMarks).forEach(function (k) {
          if (peMarks[k] === '像') like += 1;
          else if (peMarks[k] === '不像') unlike += 1;
          else unsure += 1;
        });
        peSummary.innerHTML = '你标了 ' + like + ' 条像、' + unlike + ' 条不像、' + unsure + ' 条不确定' +
          '（共 ' + pe.length + ' 条，已标 ' + Object.keys(peMarks).length + ' 条）。' +
          '标完「不像」的条目不要删掉，它们和「像」的条目一样有价值：' +
          '哪几条最不像你，通常指向出生时辰或经度需要复核。';
      });
    }
    box.appendChild(c2b);

    /* C. 流年回看：用户自己打标 */
    var c3 = el('div', 'card');
    c3.appendChild(el('h2', null, '流年回看（自己打标）'));
    c3.appendChild(el('div', 'hint', '下面几年是已经发生的。按你的实际感受点一下，页面会把该年的结构与你的标记并排显示——判断权在你手里，页面不替你下结论。'));
    var picks = {};
    var flowWrap = el('div');
    flowWrap.style.marginTop = '16px';
    var flowTable = el('table');
    var head = '<tr><th>年份</th><th>干支</th><th>十神</th><th>所处大运</th><th>虚岁</th><th>你的感受</th></tr>';
    var rowsHtml = built.items.filter(function (x) { return x.flowYears; })[0].flowYears.map(function (f) {
      return '<tr data-year="' + f.year + '"><td>' + f.year + '</td><td style="font-size:15px">' + f.gz + '</td>' +
        '<td>' + f.shiShen + '</td>' +
        '<td>' + (f.daYun ? f.daYun.gz + '（' + f.daYun.shiShen + '）' : '未交运') + '</td>' +
        '<td>' + f.xuSui + '</td>' +
        '<td class="pick"><button data-mark="顺">顺</button><button data-mark="平">平</button><button data-mark="不顺">不顺</button><button data-mark="重大变化">重大变化</button></td></tr>';
    }).join('');
    flowTable.innerHTML = head + rowsHtml;
    flowWrap.appendChild(flowTable);
    var summary = el('div', 'hint');
    summary.style.marginTop = '16px';
    flowWrap.appendChild(summary);
    c3.appendChild(flowWrap);
    c3.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-mark]');
      if (!b) return;
      var tr = b.closest('tr');
      var y = tr.getAttribute('data-year');
      picks[y] = b.getAttribute('data-mark');
      tr.querySelectorAll('button[data-mark]').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      renderSummary();
    });
    function renderSummary() {
      var keys = Object.keys(picks);
      if (!keys.length) { summary.innerHTML = ''; return; }
      var byShiShen = {};
      keys.forEach(function (y) {
        var f = built.items.filter(function (x) { return x.flowYears; })[0].flowYears.filter(function (x) { return x.year === +y; })[0];
        if (!f) return;
        var k = f.shiShen + '（' + picks[y] + '）';
        byShiShen[k] = (byShiShen[k] || 0) + 1;
      });
      var lines = Object.keys(byShiShen).sort().map(function (k) { return k + ' × ' + byShiShen[k] + ' 年'; });
      summary.innerHTML = '你已标记 ' + keys.length + ' 年：' + lines.join('；') +
        '。<br>同一十神反复与同一种感受同时出现，说明这套取值与你的经历比较贴合；' +
        '若同类年份的感受完全相反，通常要先怀疑出生时辰，再看下面的时辰对照。';
    }
    box.appendChild(c3);

    /* D. 时辰对照 */
    var c4 = el('div', 'card');
    c4.appendChild(el('h2', null, '时辰对照（怀疑记错时间就看这里）'));
    c4.appendChild(el('div', 'hint', '下面是按你填的时间前后各推一个时辰的结果。它只列出每个时辰对应的盘面差异，用来配合上面的自检条目反推：哪一个时辰描述的你更像你。'));
    var cands = buildHourCandidates(opt);
    var cbox = el('div', 'cand');
    cands.forEach(function (c) {
      var d = el('div', 'candc' + (c.delta === 0 ? ' mid' : ''));
      var majors = c.soulMajors.length ? c.soulMajors.join('、') : '无主星';
      d.innerHTML =
        '<div class="ct">' + (c.delta === 0 ? '你填的时间' : (c.delta < 0 ? '提前 ' + (-c.delta) + ' 个时辰' : '推后 ' + c.delta + ' 个时辰')) + '</div>' +
        '<div class="cg">' + c.shiChen + '</div>' +
        '<div class="cl">钟表 <b>' + c.clock + '</b><br>时柱 <b>' + c.hourPillar + '</b><br>' +
        '紫微命宫 <b>' + c.soulBranch + '宫</b> · <b>' + c.fiveElements + '</b><br>' +
        '命宫主星 <b>' + majors + '</b><br>命主 <b>' + c.soulMaster + '</b></div>';
      cbox.appendChild(d);
    });
    c4.appendChild(cbox);
    c4.appendChild(el('div', 'note', '时柱变、命宫变、五行局变，牵动的整盘结构都会跟着变。如果相邻时辰的盘差异很大，说明这个出生时间值得你认真回忆或向家人确认。'));
    box.appendChild(c4);

    /* E. 紫微命宫三方四正 */
    var c5 = el('div', 'card');
    c5.appendChild(el('h2', null, '紫微命宫三方四正'));
    var triad = B.palaceTriad(z.soul.palaceIndex);
    var byIndex = {};
    z.palaces.forEach(function (q) { byIndex[q.palaceIndex] = q; });
    var order = [triad.self].concat(triad.trine, [triad.opposite]);
    var roles = ['命宫（本宫）', '三合', '三合', '对宫（迁移）'];
    var t5 = el('table');
    var h5 = '<tr><th>宫位</th><th>关系</th><th>主星</th><th>辅星与杂曜</th><th>生年四化</th></tr>';
    h5 += order.map(function (idx, i) {
      var q = byIndex[idx];
      var mut = z.mutagens.filter(function (m) { return m.palaceIndex === idx; }).map(function (m) { return m.name + m.mutagen; });
      var others = (q.auxiliaryStars || []).concat(q.minorStars || []);
      return '<tr' + (i === 0 ? ' class="now"' : '') + '><td>' + q.name + '</td><td>' + roles[i] + '</td>' +
        '<td style="font-size:14px">' + ((q.majorStars || []).join('、') || '无主星') + '</td>' +
        '<td style="text-align:left;font-size:11.5px;color:var(--dim)">' + (others.join('、') || '—') + '</td>' +
        '<td>' + (mut.join('、') || '—') + '</td></tr>';
    }).join('');
    t5.innerHTML = h5;
    c5.appendChild(t5);
    c5.appendChild(el('div', 'note', '三方四正指本宫、对宫与两个三合宫，是紫微判断一个宫位强弱时的基本结构。这里只列出结构，星曜组合同样需要你结合实际经历体会。'));
    box.appendChild(c5);

    /* F. 口径 */
    var c6 = el('div', 'card');
    c6.appendChild(el('h2', null, '口径与来源'));
    var eng = p.engine || {};
    c6.innerHTML = '<div class="grid2"><div>' + kv('引擎版本', eng.version || '—') + kv('四柱规则集', eng.ruleSetId || '—') + '</div>' +
      '<div>' + kv('星历模型', eng.ephemeris || '—') + kv('紫微规则集', eng.ziweiRuleSetId || '—') + '</div></div>' +
      '<div class="note">内容指纹 <b style="color:var(--gold2)">' + (eng.sourceHash || '—') + '</b>。本页与排盘页使用同一份引擎产物，同输入必得同一结果。</div>';
    box.appendChild(c6);

    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- 事件 ---------- */
  function run() {
    var opt = readForm();
    if (opt.error) { alert(opt.error); return; }
    render(opt);
  }
  $('go').addEventListener('click', run);
  $('back').addEventListener('click', function () { location.href = 'paipan.html'; });
  $('lng').value = '118.18';
})();
