import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import design from '../../content/survivalist-events-design.json' with { type: 'json' };
import { planSurvivalistEnvironment, planSurvivalistChance, resolveSurvivalistChance } from '../survivalist-event.mjs';

const plan = () => planSurvivalistEnvironment({ invocationId: 'character:role:survivalist', catalogVersion: 'test-catalog/v1' });
const result = (p, id) => ({ invocationId: p.invocationId, spinId: `${p.invocationId}:actual-spin`, outcomeId: id });
const chance = (id = 'freezing-tundra') => { const p = plan(); return planSurvivalistChance(p, result(p, id)); };
const reward = (p, index) => resolveSurvivalistChance(p, result(p, p.wheel.outcomes[index].id));

test('Environment has twelve equal outcomes and a visible projection without uncommitted rewards', () => {
  const p = plan();
  assert.equal(p.wheel.outcomes.length, 12); assert.equal(p.wheel.allowModifiers, false);
  assert.ok(p.wheel.outcomes.every(row => row.probability === 1 / 12));
  assert.ok(p.wheel.outcomes.every(row => Object.keys(row).sort().join() === 'baseWeight,id,label,probability'));
  for (const id of ['freezing-tundra','volcano-core','acid-pool','nuclear-wasteland','outer-space']) assert.ok(p.wheel.outcomes.some(row => row.id === id));
});

test('Chance has nine equally likely values; displayed 0..100 values are not outcome probabilities', () => {
  const p = chance();
  assert.deepEqual(p.wheel.outcomes.map(row => row.value), [0,12.5,25,37.5,50,62.5,75,87.5,100]);
  assert.ok(p.wheel.outcomes.every(row => row.baseWeight === 1 && row.probability === 1 / 9));
  assert.deepEqual(p.wheel.outcomes.map(row => row.rewardKind), ['stat-only','stat-only','stat-only','stat-only','power-only','power-only','power-only','both','both']);
});

test('Every environment uses the correct inclusive bands, +1 one stat, and its own exact linked power', () => {
  for (const environment of design.wheels[0].outcomes) {
    const p = chance(environment.id);
    for (let index = 0; index < 9; index++) {
      const r = reward(p,index), stat = r.effects.filter(e => e.type === 'stat-flat-modifier'), power = r.effects.filter(e => e.type === 'grant-power');
      assert.equal(r.effects.length, index > 6 ? 2 : 1);
      assert.equal(stat.length, index <= 3 || index > 6 ? 1 : 0);
      assert.equal(power.length, index >= 4 ? 1 : 0);
      if (stat.length) { assert.equal(stat[0].stat,environment.statBuff.stat); assert.equal(stat[0].amount,1); assert.equal(stat[0].applyAfterImmutableBase,true); }
      if (power.length) { assert.equal(power[0].definitionId,environment.powerRef.definitionId); assert.equal(power[0].definitionFile,environment.powerRef.definitionFile); }
      assert.equal(r.nextStage,'backstory');
    }
  }
});

test('Zero still gives +1; no death, failure penalty, reroll or additional survival check is emitted', () => {
  const r = reward(chance('outer-space'),0);
  assert.equal(r.survivalChancePercent,0); assert.equal(r.rewardKind,'stat-only');
  assert.equal(r.effects[0].amount,1); assert.equal(r.effects[0].stat,'durability');
  for (const key of ['alive','dead','reroll','survivalCheck','penalty','extraSpins']) assert.ok(!(key in r));
});

test('Environment severity/body/owned power does not silently bias chance, rewards or draw count', () => {
  assert.deepEqual(chance('waterless-desert').wheel,chance('volcano-core').wheel);
  assert.deepEqual(chance('freezing-tundra').wheel,chance('outer-space').wheel);
  const p = plan(); p.actorStats={durability:999}; p.actorPowers=['space-adaptation'];
  assert.deepEqual(planSurvivalistChance(p,result(p,'outer-space')).wheel,chance('outer-space').wheel);
  assert.equal(reward(chance('volcano-core'),8).effects.find(e=>e.type==='stat-flat-modifier').amount,1);
});

test('Seven shared powers resolve existing canonical definitions; five new powers are defined once locally', () => {
  const own = 'content/survivalist-events-design.json';
  assert.equal(design.sharedPowerReferences.length,7); assert.equal(design.powers.length,5);
  assert.equal(new Set(design.powers.map(p=>p.id)).size,design.powers.length);
  for (const e of design.wheels[0].outcomes) {
    const file = new URL(`../../${e.powerRef.definitionFile}`,import.meta.url);
    const data = JSON.parse(fs.readFileSync(file,'utf8'));
    assert.equal(data.powers.filter(p=>p.id===e.powerRef.definitionId).length,1);
    if (e.powerRef.definitionFile !== own) assert.ok(!design.powers.some(p=>p.id===e.powerRef.definitionId));
  }
});

test('Direct powers use ordinary shared mastery and persist after main None without source-family events', () => {
  for (const id of ['freezing-tundra','high-gravity-planet','lightning-storm']) {
    const r=reward(chance(id),6), power=r.effects[0];
    assert.equal(power.type,'grant-power'); assert.equal(power.masteryPolicy,'recipient-shared-power-normal');
    assert.equal(power.surviveMainNone,true); assert.equal(power.sourceArchetypeId,'survivalist');
    for (const key of ['masteryOverrideId','masteryRank','enchantment','familyId','extraSpins','funnyResult']) assert.ok(!(key in power));
    assert.ok(!('stat' in power));
  }
});

test('Saved plans survive later recipe/catalog changes, and repeated resolution is pure with one stable ledger key', () => {
  const p=plan(), before=structuredClone(p), e=design.wheels[0].outcomes[0];
  const old=structuredClone(e);
  try {
    e.statBuff.stat='speed'; e.powerRef.definitionId='changed-power';
    const c=planSurvivalistChance(p,result(p,'freezing-tundra')), saved=structuredClone(c);
    const a=reward(c,8), b=reward(c,8); assert.deepEqual(a,b);
    assert.deepEqual(c,saved); assert.deepEqual(p,before);
    assert.equal(a.effects[0].stat,'durability'); assert.equal(a.effects[1].definitionId,'ice-manipulation');
    assert.equal(a.ledgerKey,'character:role:survivalist:survivalist-reward');
    assert.equal(new Set(a.effects.map(e=>e.id)).size,2);
    assert.ok(a.effects.every(e=>e.sourceEnvironmentSpinId===`${p.invocationId}:actual-spin`));
  } finally { Object.assign(e,old); }
});

test('Wrong spin sources and unknown environment/chance results cannot issue grants', () => {
  const p=plan();
  assert.throws(()=>planSurvivalistChance(p,{...result(p,'freezing-tundra'),invocationId:'wrong'}),{code:'SURVIVALIST_SOURCE_MISMATCH'});
  assert.throws(()=>planSurvivalistChance(p,result(p,'unknown')),{code:'UNKNOWN_SURVIVALIST_OUTCOME'});
  const c=chance();
  assert.throws(()=>resolveSurvivalistChance(c,result(c,'not-a-chance')),{code:'UNKNOWN_SURVIVALIST_OUTCOME'});
  assert.throws(()=>resolveSurvivalistChance(c,{...result(c,c.wheel.outcomes[0].id),spinId:''}),{code:'SURVIVALIST_SOURCE_MISMATCH'});
});

test('Corrupt chance sections, probabilities, threshold rewards or +1 stat recipes fail explicitly', () => {
  for (const change of [p=>p.wheel.outcomes[3].value=38,p=>p.wheel.outcomes.pop(),p=>p.wheel.outcomes[3].rewardKind='both',p=>p.wheel.outcomes[4].probability=.5,p=>p.environment.statBuff.amount=2,p=>p.environment.statBuff.stat='power',p=>p.wheel.allowModifiers=true]) {
    const p=chance();change(p);assert.throws(()=>reward(p,0));
  }
  assert.throws(()=>planSurvivalistEnvironment({invocationId:'only-id'}),{code:'INVALID_SURVIVALIST_INVOCATION'});
});
