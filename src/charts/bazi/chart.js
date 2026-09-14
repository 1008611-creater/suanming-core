import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { createManifest } from '../../manifest.js';
import { yearPillar, monthPillar, dayPillar, hourPillar } from './pillars.js';
import { buildLuck } from './luck.js';
import { currentMonthBoundary, solarTermInstant } from '../../astro/solar-terms.js';

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
  const luck = input.gender ? buildLuck({ monthPillar: month, yearStem: year[0], gender: input.gender, daysToBoundary: 0 }) : null;
  return {
    schemaVersion: '1.0.0',
    input: { ...input, timezone: zone },
    pillars: { year, month, day, hour },
    time: { ...utc, shichen: shi },
    luck,
    manifest: createManifest({ timezone: zone, longitude })
  };
}
