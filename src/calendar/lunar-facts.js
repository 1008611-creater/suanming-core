import { factFromRule } from '../derive/facts.js';
import { numberedLunarMonths, lunarDateOf } from './lunar.js';
import { getRuleSet } from '../../rules/index.js';

/**
 * 把农历结论接入事实图。
 * 历法结论和排盘结论一样必须可溯源：月份编号、闰月标记、换日边界都带 rule_id。
 */
export function lunarMonthFacts(year, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const months = numberedLunarMonths(year);
  const facts = [];

  for (const m of months) {
    const label = (m.leap ? 'leap-' : '') + m.monthNumber;
    facts.push(factFromRule(ruleSet.conventions.lunarMonthNumbering.ruleId, {
      id: 'lunar.month.' + label, value: m, ruleSet
    }));
    if (m.leap) {
      facts.push(factFromRule(ruleSet.conventions.lunarLeapMonth.ruleId, {
        id: 'lunar.leap.' + label, value: { monthNumber: m.monthNumber, jd: m.jd, endJd: m.endJd }, ruleSet
      }));
    }
  }
  return facts;
}

/** 单个公历日期对应的农历结论，同样带溯源。 */
export function lunarDateFacts(year, month, day, options = {}) {
  const ruleSet = options.ruleSet ?? getRuleSet();
  const value = lunarDateOf(year, month, day);
  if (!value) return [];
  return [factFromRule(ruleSet.conventions.lunarDayBoundary.ruleId, {
    id: 'lunar.date.' + year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0'),
    value, ruleSet
  })];
}
