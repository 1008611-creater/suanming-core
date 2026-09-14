import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { createManifest } from '../../manifest.js';
import { yearPillar, monthPillar, dayPillar, hourPillar } from './pillars.js';
import { buildLuck } from './luck.js';
import { factGraph, fact } from '../../derive/facts.js';
import { currentMonthBoundary, nextMonthBoundary, solarTermInstant } from '../../astro/solar-terms.js';

export function castBazi(input) {
  const zone = input.timezone ?? 'Asia/Shanghai';
  const utc = civilToUTC(input, zone);
  const longitude = input.longitude ?? 120;
  const shi = shichenOfCivil(input, longitude, { timePrecision: input.timePrecision ?? 'exact' });
  const day = dayPillar(utc.jdUTC);
  const lichun = solarTermInstant(input.year, 315).utc;
  const year = yearPillar(input.year, input.month, input.day, { yearBoundary: 'calendar', forcePrevious: utc.jdUTC < lichun });
  const boundary = currentMonthBoundary(utc.jdUTC);
  const month = monthPillar(input.year, boundary?.degree ?? 315);
  const hour = hourPillar(day[0], shi.index);
  const forward = ((input.gender === 'male') === ('甲乙丙丁戊己庚辛壬癸'.indexOf(year[0]) % 2 === 0));
  const adjacent = forward ? nextMonthBoundary(utc.jdUTC) : boundary;
  const daysToBoundary = adjacent ? (adjacent.utc - utc.jdUTC) : 0;
  const luck = input.gender ? buildLuck({ monthPillar: month, yearStem: year[0], gender: input.gender, daysToBoundary, options:{ direction:forward ? 1 : -1 } }) : null;
  const manifest = createManifest({ timezone: zone, longitude });
  const facts = factGraph([
    fact({ id:'pillar.year', value:year, ruleId:'bazi.year.solar-term-boundary', source:['solar-term:315'] }),
    fact({ id:'pillar.month', value:month, ruleId:'bazi.month.current-jie', source:['solar-terms'] }),
    fact({ id:'pillar.day', value:day, ruleId:'bazi.day.julian-day', source:['julian-day'] }),
    fact({ id:'pillar.hour', value:hour, ruleId:'bazi.hour.true-solar-time', source:['true-solar-time'] })
  ], manifest);
  return {
    schemaVersion: '1.0.0',
    input: { ...input, timezone: zone },
    pillars: { year, month, day, hour },
    time: { ...utc, shichen: shi },
    luck,
    facts,
    manifest
  };
}
