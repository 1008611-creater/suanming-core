import assert from 'node:assert/strict';
import { getRuleSet, luckDirection, tenGod, pillarDetail, elementOfStem, elementOfBranch, hiddenStemsOf } from '../src/index.js';

const ruleSet = getRuleSet();

// 表格必须来自规则集，而不是代码内嵌。
assert.deepEqual(hiddenStemsOf(ruleSet).寅, ['甲','丙','戊']);
assert.equal(elementOfStem('甲', ruleSet), '木');
assert.equal(elementOfBranch('子', ruleSet), '水');

// 十神与日干、他干的映射。
assert.equal(tenGod('甲','甲', ruleSet), '比肩');
assert.equal(tenGod('甲','乙', ruleSet), '劫财');
assert.equal(tenGod('甲','庚', ruleSet), '七杀');

// 大运顺逆：阳年干男命顺行，阴年干男命逆行。
assert.equal(luckDirection('甲','male', ruleSet), 1);
assert.equal(luckDirection('乙','male', ruleSet), -1);
assert.equal(luckDirection('乙','female', ruleSet), 1);

// 四柱明细必须带上藏干与五行，供派生层使用。
const detail = pillarDetail({year:'乙酉',month:'癸未',day:'己亥',hour:'戊辰'}, ruleSet);
assert.equal(detail.year.stemElement, '木');
assert.equal(detail.year.branchElement, '金');
assert.deepEqual(detail.hour.hiddenStems, ['戊','乙','癸']);

console.log('rule parameterization smoke passed');
