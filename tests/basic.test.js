import test from 'node:test'; import assert from 'node:assert/strict';
import { civilToUTC, shichenOfCivil } from '../src/index.js';
import { ganzhi, hiddenStems, tenGod } from '../src/charts/bazi/index.js';
test('timezone resolves China DST',()=>assert.equal(civilToUTC({year:1988,month:7,day:1,hour:12}).offsetMinutes,540));
test('shichen boundary is deterministic',()=>assert.equal(shichenOfCivil({hour:0,minute:30}).name,'子'));
test('sexagenary primitives',()=>{assert.equal(ganzhi(0),'甲子');assert.deepEqual(hiddenStems.寅,['甲','丙','戊']);assert.equal(tenGod('甲','甲'),'比肩');});
