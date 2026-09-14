import { castBazi, numberedLunarMonths } from '../src/index.js';

const chart = castBazi({
  year: 2005, month: 7, day: 13, hour: 8, minute: 58,
  longitude: 118.18, timezone: 'Asia/Shanghai', gender: 'male'
});

console.log(JSON.stringify({
  pillars: chart.pillars,
  luck: chart.luck,
  factIds: chart.facts.facts.map(f => f.fact_id),
  lunarMonths2024: numberedLunarMonths(2024).map(m => ({monthNumber:m.monthNumber, leap:m.leap}))
}, null, 2));
