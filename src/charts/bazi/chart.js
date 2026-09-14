import { civilToUTC } from '../../time/timezone.js';
import { shichenOfCivil } from '../../time/shichen.js';
import { createManifest } from '../../manifest.js';
import { yearPillar, monthPillar, dayPillar, hourPillar } from './pillars.js';
import { currentMonthBoundary } from '../../astro/solar-terms.js';

export function castBazi(input) {
  const zone = input.timezone ?? 'Asia/Shanghai';
  const utc = civilToUTC(input, zone);
  const longitude = input.longitude ?? 120;
  const shi = shichenOfCivil(input, longitude, { timePrecision: input.timePrecision ?? 'exact' });
  const day = dayPillar(utc.jdUTC);
  const year = yearPillar(input.year, input.month, input.day, { yearBoundary: input.yearBoundary ?? 'lichun' });
  const boundary = currentMonthBoundary(utc.jdUTC);
  const month = monthPillar(input.year, boundary?.degree ?? 315);
  const hour = hourPillar(day[0], shi.index);
  return {
    schemaVersion: '1.0.0',
    input: { ...input, timezone: zone },
    pillars: { year, month, day, hour },
    time: { ...utc, shichen: shi },
    manifest: createManifest({ timezone: zone, longitude })
  };
}
