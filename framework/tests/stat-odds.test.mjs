import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/stat-odds-design.json' with { type: 'json' };
import spec from '../spec.json' with { type: 'json' };
import scales from '../../content/stat-scales-design.json' with { type: 'json' };
import gamblerDesign from '../../content/gambler-events-design.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { buildStatContext, planStatWheel, planStatSuite, capProbabilities, selectStatOutcome,
  resolveStatDraw, projectFinalScore } from '../stat-odds.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
const selectCase = id => structuredClone(audit.terminalCases.find(c => c.id === id)?.input);
function input(id = 'human', roles = [], roleResults = {}, sizeIndex = 5) {
  const owner = selectCase(id);
  assert.ok(owner, id);
  owner.archetypeIds = roles;
  owner.archetypeFacts = roles.map(r => ({ archetypeId: r,
    sourceId: `role:${r}`, committed: true, results: (roleResults[r] ?? []).map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `role:${r}:draw:${i}` })) }));
  const sizePlan = planSizeStage(owner);
  assert.equal(sizePlan.status, 'ready', id);
  return { ...owner, invocationId: 'stats', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'committed-size', outcomeId: sizePlan.outcomes[Math.min(sizeIndex, sizePlan.outcomes.length - 1)].id },
    weapons: [{ instanceId: 'weapon:1', definitionId: 'preview-weapon', sourceId: 'grant:weapon', committed: true }],
    powers: [{ ownedId: 'power:1', definitionId: 'preview-power', sourceId: 'grant:power', committed: true }] };
}
const plan = (x, target = 'strength', options = {}) => planStatWheel({ ...x, target, weaponInstanceId: x.weapons?.[0]?.instanceId }, options);
const probabilities = p => p.outcomes.map(o => o.probability);
const mean = p => p.outcomes.reduce((s, o) => s + o.value * o.probability, 0);
const draw = (p, value, spinId = 'attempt:1') => ({ invocationId: p.invocationId, spinId, outcomeId: p.outcomes.find(o => o.value === value).id });

test('Water filling respects cap, total mass and uncapped odds ratios under extreme concentration', () => {
  const p = capProbabilities([1e9, 100, 10, 1, .1], .3, 0);
  p.slice(0, 3).forEach(x => close(x, .3));
  close(p[3] / p[4], 10); close(p.reduce((a, b) => a + b), 1);
  const flat = capProbabilities([1, 1, 1, 1]); flat.forEach(x => close(x, .25));
  assert.throws(() => capProbabilities([1, 1, 1]), e => e.code === 'INFEASIBLE_CAP');
  assert.throws(() => capProbabilities([0, 1, 1, 1]), e => e.code === 'INVALID_WEIGHTS');
});

test('All 348 canonical terminal identities build seven finite normalized capped distributions', () => {
  assert.equal(audit.terminalCases.length, 348);
  for (const c of audit.terminalCases) {
    const x = input(c.id);
    const signatures = [];
    for (const key of design.statKeys) {
      const p = plan(x, key);
      if (p.status === 'fixed') { assert.equal(p.baseValue,9); assert.equal(p.actualSpin,false); continue; }
      assert.equal(p.status, 'ready', `${c.id}/${key}`);
      signatures.push(JSON.stringify(probabilities(p)));
      close(probabilities(p).reduce((a, b) => a + b), 1);
      assert.ok(p.outcomes.every(o => o.probability > 0), `${c.id}/${key}`);
      if (p.capException) assert.equal(c.id, 'lelembut/imported/lich');
      else assert.ok(p.outcomes.every(o => o.probability >= .05 - 1e-12 && o.probability <= .25 + 1e-12), `${c.id}/${key}`);
    }
    assert.equal(new Set(signatures).size, signatures.length, `${c.id}: distinct random axes`);
  }
});

test('God baseline rebalances the old prior to 5%..25% while favoring its strongest tiers', () => {
  const x = input('heavenly-principle/god'), suite = planStatSuite(x);
  const p = suite.mainStats[0];
  const prior = [.005,.008,.012,.025,.04,.06,.1,.2,.25,.3];
  p.outcomes.forEach((o,i) => close(o.probability, .05+.5*prior[i]));
  const all = [...suite.mainStats, ...suite.weaponMasteries];
  assert.equal(new Set(all.map(p => JSON.stringify(probabilities(p)))).size, 6);
  assert.equal(suite.powerMastery.status,'fixed'); assert.equal(suite.powerMastery.baseValue,9);
  assert.equal(suite.powerMastery.guarantee.scope,'all-owned-powers');
});

test('Human Mid/Peak Human dominate with rare high pulls; each of seven axes is distinct', () => {
  const suite = planStatSuite(input()), all = [...suite.mainStats, ...suite.weaponMasteries, suite.powerMastery];
  assert.equal(new Set(all.map(p => JSON.stringify(probabilities(p)))).size, 7);
  const p = all[0]; assert.ok(p.outcomes[2].probability > p.outcomes[8].probability); assert.ok(p.outcomes[9].probability > 0);
  assert.ok(mean(p) < 4.5, 'Human favors the lower half despite reserved lucky-pull mass.');
  assert.ok(mean(plan(input('heavenly-principle/god'))) > mean(p) + 2);
});

test('AI cognition and physical strength are distinct; appliances and cool/zonk mecha stay distinct', () => {
  const ai = input('machine/ai'); assert.ok(mean(plan(ai, 'intelligence')) > mean(plan(ai, 'strength')) + 2.5);
  const weak = input('machine/household-appliance/blender'), cool = input('machine/mecha/machine-mecha-mechagodzilla'), zonk = input('machine/mecha/machine-mecha-cardboard');
  assert.ok(mean(plan(cool)) > mean(plan(weak)) + 2); assert.ok(mean(plan(cool)) > mean(plan(zonk)) + 2);
});

test('Physical Size changes strength/durability and mobility differently; cognition/mastery do not scale with extent', () => {
  const small = input('human', [], {}, 0), large = input('human', [], {}, 11);
  assert.ok(mean(plan(large)) > mean(plan(small))); assert.ok(mean(plan(large, 'durability')) > mean(plan(small, 'durability')));
  assert.ok(mean(plan(large, 'speed')) < mean(plan(small, 'speed')));
  for (const key of ['intelligence', 'weapon-mastery', 'power-mastery']) assert.deepEqual(probabilities(plan(large, key)), probabilities(plan(small, key)));
});

test('Raksasa uses base-body reference and bounded logarithmic Size; no transformation Size', () => {
  const small = input('raksasa', [], {}, 0), sun = input('raksasa', [], {}, 7);
  assert.ok(mean(plan(sun)) > mean(plan(small)) + .5);
  const c = buildStatContext(sun); assert.ok(c.size.logRatio <= design.model.sizeLogLimit);
  assert.equal(c.size.transformationSizeUsed, false); assert.ok(c.latent.sizeShift[0] <= 5);
});

test('Avatar manifestation and Nanobot envelope do not produce mass/strength from Size', () => {
  for (const id of ['machine/ai', 'machine/nanobot', 'heavenly-principle/god', 'lelembut/imported/ghost']) {
    assert.deepEqual(probabilities(plan(input(id, [], {}, 0))), probabilities(plan(input(id, [], {}, 11))), id);
  }
});

test('Mage and Assassin adjust different axes; event results add separate explicit likelihoods', () => {
  const mage = input('human', ['mage']), assassin = input('human', ['assassin']);
  assert.ok(mean(plan(mage, 'power-mastery')) > mean(plan(assassin, 'power-mastery')));
  assert.ok(mean(plan(assassin, 'fight')) > mean(plan(mage, 'fight')));
  const master = input('human', ['mage'], { mage: [['mage-master-sihir-chance', 'master-sihir']] });
  assert.ok(mean(plan(master, 'power-mastery')) > mean(plan(mage, 'power-mastery')));
});

test('Hybrid/Mutant actual race capacities combine; prey/army/mentor words do not become owner powers', () => {
  const x = input('human', ['mutant']); const elf = selectCase('elf/high-elf').raceFacts[0];
  x.raceFacts.push(elf); x.sizePlan = planSizeStage({ ...x, invocationId: 'size' }); x.sizeResult = { invocationId: 'size', spinId: 'committed-size', outcomeId: x.sizePlan.outcomes[5].id };
  const c = buildStatContext(x); assert.equal(c.raceComponents.length, 2);
  assert.ok(mean(plan(x, 'power-mastery')) > mean(plan(input(), 'power-mastery')));
  const plain = input(), narrated = { ...plain, narratorText: 'army of Gods with Boundless Strength', bonusLedger: [{ stat: 'strength', amount: 999 }] };
  assert.deepEqual(plan(plain).outcomes, plan(narrated).outcomes);
});

test('Skeleton/Zombie origin body and Symbiote takeover are explicit independent context', () => {
  const skeleton = input('lelembut/imported/skeleton'), zombie = input('lelembut/imported/zombie');
  assert.notDeepEqual(probabilities(plan(skeleton, 'speed')), probabilities(plan(zombie, 'speed')));
  const low = input('symbiote'), high = structuredClone(low);
  high.raceFacts.find(f => f.familyId === 'symbiote').results[0].outcomeId = 'takeover-100';
  high.sizePlan = planSizeStage({ ...high, invocationId: 'size' }); high.sizeResult = { invocationId: 'size', spinId: 'committed-size', outcomeId: high.sizePlan.outcomes[5].id };
  assert.ok(mean(plan(high, 'fight')) > mean(plan(low, 'fight')));
});

test('Equalizer overrides all ordinary likelihoods after eligibility; Lich guarantee survives', () => {
  const x = input('human', ['equaliser']); plan(x).outcomes.forEach(o => close(o.probability, .1));
  const bounded = plan(x, 'strength', { excludedValues: [0, 1, 2, 3, 4, 5] }); bounded.outcomes.forEach(o => close(o.probability, .25));
  const lich = plan(input('lelembut/imported/lich', ['equaliser']), 'durability'); assert.equal(lich.status,'fixed');
  assert.equal(lich.baseValue,9); assert.equal(lich.actualSpin,false);
});

test('Lich maximum9 skips the draw; final debuff may reduce it', () => {
  const p = plan(input('lelembut/imported/lich'), 'durability');
  assert.equal(p.status,'fixed'); assert.equal(p.attempts.length,0);
  assert.equal(projectFinalScore(p, [{ sourceKey: 'debuff:1', amount: -1 }]).finalValue, 8);
  assert.equal(plan(input('lelembut/imported/lich'), 'durability', { excludedValues: [9] }).status, 'needs_configuration');
});

test('Kinnara mastery floor applies to its own instrument only, preserves cap and all weapon instance scopes', () => {
  const x = input('mythical-beast/local/kinnara');
  x.weapons = [{ instanceId: 'music:1', definitionId: 'music-instrument', sourceId: x.raceFacts[0].sourceId, committed: true, trainingProfileId: 'musical' }];
  const p = plan(x, 'weapon-mastery'); assert.deepEqual(p.outcomes.map(o => o.value), [5, 6, 7, 8, 9]); assert.ok(p.outcomes.every(o => o.probability <= .25));
  x.weapons[0].sourceId = 'unrelated:instrument'; assert.equal(plan(x, 'weapon-mastery').outcomes.length, 10);
});

test('No power inventory skips one shared mastery; multiple powers still use one shared plan', () => {
  const x = input(); x.powers = []; assert.equal(plan(x, 'power-mastery').reason, 'no-owned-power');
  x.powers = Array.from({ length: 10 }, (_, i) => ({ ownedId: `p${i}`, definitionId: `power${i}`, sourceId: `grant${i}`, committed: true }));
  const suite = planStatSuite(x); assert.equal(suite.powerMastery.status, 'ready'); assert.equal(suite.powerMastery.target, 'power-mastery');
  assert.equal(suite.powerMastery.context.inventory.powers.length, 10);
  assert.deepEqual(probabilities(suite.powerMastery), probabilities(plan(input(), 'power-mastery')));
});

test('Resilient reuses frozen capped pool once and retains highest raw including both masteries', () => {
  for (const key of design.statKeys) {
    const p = plan(input('human', ['resilient']), key), first = draw(p, 3), retry = draw(p, 8, 'attempt:2');
    assert.equal(resolveStatDraw(p, first).status, 'retry_required');
    const r = resolveStatDraw(p, first, retry); assert.equal(r.baseValue, 8); assert.equal(r.attempts.length, 2);
    assert.equal(resolveStatDraw(p, draw(p, 5), draw(p, 2, 'attempt:2')).baseValue, 5);
    assert.throws(() => resolveStatDraw(p, draw(p, 6), retry), e => e.code === 'UNAUTHORIZED_RETRY');
    assert.throws(() => resolveStatDraw(p, first, { ...retry, spinId: first.spinId }), e => e.code === 'DUPLICATE_DRAW');
  }
});

test('Lucky Number observes both actual attempts; derived bonuses/copies do not produce extra hits', () => {
  const x = input('human', ['gambler', 'resilient'], { gambler: [['gambler-type', 'lucky-number'], ['gambler-lucky-number', 'lucky-number-3']] });
  const p = plan(x, 'power-mastery'), r = resolveStatDraw(p, draw(p, 3), draw(p, 3, 'attempt:2'));
  assert.equal(r.luckyHitCount, 2); assert.equal(r.pawnCategoryValue, 3);
  const final = projectFinalScore(r, [{ sourceKey: 'bonus:1', amount: 4 }]); assert.equal(final.finalValue, 7); assert.equal(r.baseValue, 3);
});

test('All In copies committed Strength only; independent bonuses stay independent', () => {
  const x = input('human', ['gambler'], { gambler: [['gambler-type', 'all-in']] });
  const strength = plan(x), source = resolveStatDraw(strength, draw(strength, 4));
  assert.equal(plan(x, 'speed').status, 'needs_configuration');
  const copy = planStatWheel({ ...x, target: 'speed', allInResolution: source });
  assert.equal(copy.status, 'copy'); assert.equal(copy.baseValue, 4); assert.equal(copy.actualSpin, false); assert.equal(copy.luckyHitCount, 0);
  const unrelatedPlan = plan(input()), unrelated = resolveStatDraw(unrelatedPlan, draw(unrelatedPlan, 4));
  assert.equal(planStatWheel({ ...x, target: 'speed', allInResolution: unrelated }).status, 'needs_configuration');
  assert.equal(projectFinalScore(copy, [{ sourceKey: 'race:speed', amount: 2 }]).finalValue, 6);
});

test('Double or Nothing transforms raw only; decision50:50 is separate from capped tier draws', () => {
  const x = input('human', ['gambler'], { gambler: [['gambler-type', 'double-or-nothing']] }), p = plan(x), first = draw(p, 4);
  assert.equal(resolveStatDraw(p, first).status, 'decision_required');
  for (const [outcomeId, expected] of [['double', 9], ['nothing', 1]]) {
    const r = resolveStatDraw(p, first, null, { invocationId: p.decisionPlan.invocationId, spinId: 'decision:1', outcomeId });
    assert.equal(projectFinalScore(r, [{ sourceKey: 'race:1', amount: 1 }]).finalValue, expected); assert.equal(r.attempts[0].value, 4);
  }
});

test('High Roller uses four extreme eligible points; approved lore modifiers remain capped', () => {
  const x = input('human', ['gambler'], { gambler: [['gambler-type', 'high-roller']] }), p = plan(x);
  assert.deepEqual(p.outcomes.map(o => o.value), [0, 1, 8, 9]); assert.ok(p.outcomes.every(o => o.probability <= .25));
  assert.equal(plan(x, 'strength', { excludedValues: [0] }).status, 'needs_configuration');
  assert.equal(plan(input('lelembut/imported/lich', ['gambler'], { gambler: [['gambler-type', 'high-roller']] }), 'durability').status,'fixed');
});

test('God guaranteed mastery skips RNG/retry/Lucky/Pawn and covers present or later ordinary powers', () => {
  const x = input('heavenly-principle/god',['gambler','resilient'], {gambler:[['gambler-type','lucky-number'],['gambler-lucky-number','lucky-number-9']]});
  x.powers.push({ownedId:'divine:2',definitionId:'ordinary-divine-power',sourceId:'divine-grant',committed:true});
  const p=plan(x,'power-mastery'); assert.equal(p.status,'fixed'); assert.equal(p.actualSpin,false);
  assert.deepEqual(p.outcomes,[]); assert.deepEqual(p.attempts,[]); assert.equal(p.retainedRawValue,null);
  assert.equal(p.pawnCategoryValue,null); assert.equal(p.luckyHitCount,0); assert.equal(p.retryConsumed,false);
  assert.equal(projectFinalScore(p,[{sourceKey:'bonus:2',amount:2}]).finalValue,11);
  assert.throws(()=>selectStatOutcome(p,0),e=>e.code==='INVALID_FROZEN_PLAN');
  assert.throws(()=>resolveStatDraw(p,{invocationId:p.invocationId,spinId:'fake',outcomeId:'power-mastery-9'}),e=>e.code==='INVALID_FROZEN_PLAN');
  x.powers=[]; assert.equal(plan(x,'power-mastery').reason,'no-owned-power');
  x.powers=[{ownedId:'late',definitionId:'late-power',sourceId:'late-source',committed:true}];
  assert.equal(plan(x,'power-mastery').baseValue,9);
  const tampered=structuredClone(p); tampered.baseValue=8;
  assert.throws(()=>projectFinalScore(tampered),e=>e.code==='INVALID_FINAL_INPUT');
});

test('Vessel God maximum is inherited only in approved60..100 bands; other gods/concepts do not qualify', () => {
  for (const n of [0,10,20,30,40,50,60,70,80,90,100]) {
    const x=input('human',['vessel'],{vessel:[['vessel-patron','god'],['vessel-compatibility',`compatibility-${n}`]]});
    const p=plan(x,'power-mastery'); assert.equal(p.status,n>=60?'fixed':'ready');
    if(n>=60) { assert.equal(p.baseValue,9); assert.equal(p.guarantee.sourceId,'role:vessel'); }
  }
  assert.equal(plan(input('human',['vessel'],{vessel:[['vessel-patron','demon-lord'],['vessel-compatibility','compatibility-100']]}),'power-mastery').status,'ready');
  for(const id of ['human','heavenly-principle/demigod','heavenly-principle/angel']) assert.equal(plan(input(id),'power-mastery').status,'ready');
  const x=input(); x.powers[0].definitionId='god-authority'; x.powers[0].masteryOverrideRef='god-all-power-mastery-max';
  assert.equal(plan(x,'power-mastery').status,'ready','Names/unchecked inventory fields cannot activate guarantees.');
});

test('Old committed God mastery and Lich guaranteed spins still resolve their frozen histories', () => {
  const oldGod=plan(input(),'power-mastery'); oldGod.version='stat-odds/0.2.0';
  oldGod.context=plan(input('heavenly-principle/god'),'power-mastery').context;
  assert.equal(resolveStatDraw(oldGod,draw(oldGod,4)).baseValue,4);
  const fixedLich=plan(input('lelembut/imported/lich'),'durability');
  const oldLich=plan(input(),'durability'); oldLich.version='stat-odds/0.2.0'; oldLich.context=fixedLich.context;
  oldLich.capException='approved-forced-lich-durability'; oldLich.guards=[{id:'lich-raw-durability9',value:9}];
  oldLich.outcomes=[{...oldLich.outcomes.find(o=>o.value===9),probability:1}];
  assert.equal(resolveStatDraw(oldLich,draw(oldLich,9)).attempts.length,1);
});

test('Small ordinary pools report infeasible cap; no silently dropped rarity or hard guard', () => {
  const p = plan(input(), 'strength', { excludedValues: [0, 1, 2, 3, 4, 5, 6] }); assert.equal(p.status, 'needs_configuration');
  assert.equal(plan(input(), 'strength', { excludedValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }).status, 'needs_configuration');
});

test('Saved plans detach input/model/catalog; replay never recomputes new context probabilities', () => {
  const x = input(), catalog = structuredClone(design), p = plan(x, 'strength', { catalog }), saved = structuredClone(p);
  x.raceFacts[0].familyId = 'primordial'; catalog.model.sigma[0] = 9;
  assert.deepEqual(p, saved); assert.equal(resolveStatDraw(p, draw(p, 2)).baseValue, 2);
});

test('External inverse CDF includes exact boundaries, last sector and malformed input rejection', () => {
  const p = plan(input()); assert.equal(selectStatOutcome(p, 0).value, 0);
  assert.equal(selectStatOutcome(p, p.outcomes[0].probability).value, 1);
  assert.equal(selectStatOutcome(p, 1 - Number.EPSILON).value, 9);
  for (const sample of [-1, 1, NaN]) assert.throws(() => selectStatOutcome(p, sample), e => e.code === 'INVALID_RANDOM_SAMPLE');
  const corrupt = structuredClone(p); corrupt.outcomes[0].probability = 1; assert.throws(() => selectStatOutcome(corrupt, 0), e => e.code === 'INVALID_FROZEN_PLAN');
});

test('Invalid owner/Size/source facts fail explicitly; incomplete future identities require configuration', () => {
  let x = input(); x.raceFacts[0].committed = false; assert.throws(() => plan(x), e => e.code === 'INVALID_IDENTITY');
  x = input(); x.sizePlan.characterId = 'other-character'; assert.throws(() => plan(x), e => e.code === 'SIZE_OWNER_MISMATCH');
  x = input('elf/high-elf'); x.raceFacts[0].results = []; assert.equal(plan(x).status, 'needs_configuration');
  x = input(); delete x.sizePlan; assert.equal(plan(x).status, 'needs_configuration');
  x = input(); x.weapons[0].kind = 'companion'; assert.throws(() => plan(x), e => e.code === 'INVALID_INVENTORY');
});

test('Tunable model can broaden spreads/change likelihood strength but cannot raise user cap', () => {
  const x = input(), wider = structuredClone(design.model); wider.sigma[0] = 2.5;
  assert.notDeepEqual(probabilities(plan(x)), probabilities(plan(x, 'strength', { model: wider })));
  wider.maximumProbability = .4; assert.throws(() => plan(x, 'strength', { model: wider }), e => e.code === 'INVALID_MODEL');
});

test('Narrow editable spreads retain positive lucky outcomes through log-space normalization', () => {
  const narrow = structuredClone(design.model); narrow.sigma = narrow.sigma.map(() => .05);
  const p = plan(input('human', ['goliath']), 'strength', { model: narrow });
  assert.equal(p.status, 'ready'); assert.ok(p.outcomes.every(o => o.probability > 0 && o.probability <= .25 + 1e-12));
  close(probabilities(p).reduce((a, b) => a + b), 1);
  narrow.sigma[0] = .001; assert.throws(() => plan(input(), 'strength', { model: narrow }), e => e.code === 'INVALID_MODEL');
});

test('Final scores remain signed/unbounded and source deduplicated; mastery bonus opens final enchant threshold', () => {
  const p = plan(input(), 'weapon-mastery'), r = resolveStatDraw(p, draw(p, 4));
  const mods = [{ sourceKey: 'technician:weapon1', amount: 1 }];
  const f = projectFinalScore(r, mods); assert.equal(f.finalValue, 5); assert.equal(f.weaponEnchantThresholdMet, true); assert.equal(r.triggersEnchantNow, false);
  assert.equal(projectFinalScore(r, [{ sourceKey: 'bonus', amount: 10 }]).finalValue, 14);
  assert.equal(projectFinalScore(r, [{ sourceKey: 'debuff', amount: -9 }]).finalValue, -5);
  assert.throws(() => projectFinalScore(r, [...mods, ...mods]), e => e.code === 'INVALID_SOURCE');
  assert.deepEqual(projectFinalScore(r, mods), f);
});

test('Backstory is neutral until explicitly modeled; configured lore likelihood never grants bonus', () => {
  const x = input(), base = plan(x); x.backstoryFact = { outcomeId: 'random-guy', sourceId: 'backstory:1', spinId: 'backstory:draw', committed: true };
  assert.deepEqual(plan(x).outcomes, base.outcomes);
  const catalog = structuredClone(design); catalog.evidenceRules.push({ id: 'authored-random-guy', version: '1', group: 'backstory', when: ['backstory:random-guy'], shift: [.3, 0, 0, 0, 0, 0, 0] });
  assert.ok(mean(plan(x, 'strength', { catalog })) > mean(base)); assert.equal(plan(x, 'strength', { catalog }).context.finalBonusInputsUsed, false);
  x.backstoryFact.outcomeId = 'invented-super-god'; assert.throws(() => plan(x), e => e.code === 'INVALID_BACKSTORY');
});

test('Approved Backstories shift only declared stat/mastery axes, keeping bonuses separate and ordinary odds5%..25%', () => {
  const rows = [['legend-trained', ['fight', 'weapon-mastery', 'power-mastery']], ['self-made', ['weapon-mastery']],
    ['disgraced-warrior', ['fight']], ['runaway', ['speed']], ['hard-way', ['fight']]];
  for (const [outcomeId, targets] of rows) {
    const x = input(), plain = input();
    x.backstoryFact = { outcomeId, sourceId: `backstory:${outcomeId}`, spinId: 'backstory:draw', committed: true };
    const context = buildStatContext(x);
    assert.ok(context.appliedRules.some(r => r.id === `backstory-lore-${outcomeId}`));
    for (const target of design.statKeys) {
      const p = plan(x, target), base = plan(plain, target);
      if (targets.includes(target)) assert.ok(mean(p) > mean(base), `${outcomeId}/${target}`);
      else assert.deepEqual(p.outcomes, base.outcomes, `${outcomeId}/${target}: no unapproved bias`);
      assert.ok(p.outcomes.every(o => o.probability >= .05 - 1e-12 && o.probability <= .25 + 1e-12));
      assert.equal(p.context.finalBonusInputsUsed, false);
    }
  }
  const x = input(); x.backstoryFact = { outcomeId: 'made-in-lab', sourceId: 'backstory:lab', spinId: 'backstory:draw', committed: true };
  assert.deepEqual(plan(x, 'intelligence').outcomes, plan(input(), 'intelligence').outcomes, 'Intelligence+1 is a final bonus, not an extra odds shift.');
});

test('Equalizer and God guarantees retain priority over approved Backstory lore likelihoods', () => {
  const x = input('human', ['equaliser']);
  x.backstoryFact = { outcomeId: 'legend-trained', sourceId: 'backstory:legend', spinId: 'backstory:draw', committed: true };
  for (const target of design.statKeys) plan(x, target).outcomes.forEach(o => close(o.probability, .1));
  const god = input('heavenly-principle/god'); god.backstoryFact = structuredClone(x.backstoryFact);
  const p = plan(god, 'power-mastery');
  assert.equal(p.status, 'fixed'); assert.equal(p.baseValue, 9); assert.deepEqual(p.attempts, []);
  assert.equal(projectFinalScore(p, [{ sourceKey: 'backstory:bonus', amount: 1 }]).finalValue, 10);
});

test('All In cannot reuse a Strength source frozen for a different Backstory', () => {
  const x = input('human', ['gambler'], { gambler: [['gambler-type', 'all-in']] });
  x.backstoryFact = { outcomeId: 'random-guy', sourceId: 'backstory:1', spinId: 'backstory:draw', committed: true };
  const p = plan(x), r = resolveStatDraw(p, draw(p, 4));
  const current = { ...x, allInResolution: r };
  assert.equal(plan(current, 'speed').status, 'copy');
  current.backstoryFact = { ...x.backstoryFact, outcomeId: 'runaway' };
  assert.equal(plan(current, 'speed').status, 'needs_configuration');
});

test('Saved stat-odds0.3 plans replay frozen odds and retain their required5%..25% bounds', () => {
  const p = plan(input()); p.version = 'stat-odds/0.3.0'; p.context.version = p.version;
  const saved = JSON.stringify(p);
  assert.equal(resolveStatDraw(p, draw(p, 4)).baseValue, 4); assert.equal(JSON.stringify(p), saved);
  const missing = structuredClone(p); delete missing.distribution.minimumProbability;
  assert.throws(() => selectStatOutcome(missing, 0), e => e.code === 'INVALID_FROZEN_PLAN');
});

test('Committed role sources, pair compatibility, model/cap integrity and earlier spin IDs are enforced', () => {
  const x = input('human', ['mage']); x.archetypeFacts = []; assert.equal(plan(x).status, 'needs_configuration');
  assert.equal(plan(input('human', ['mage', 'equaliser'])).status, 'needs_configuration');
  const p = plan(input()); assert.throws(() => resolveStatDraw(p, draw(p, 3, 'committed-size')), e => e.code === 'DUPLICATE_DRAW');
  const bad = structuredClone(p); bad.capException = 'custom-force'; assert.throws(() => selectStatOutcome(bad, 0), e => e.code === 'INVALID_FROZEN_PLAN');
});

test('Floor reservation preserves total mass, both bounds and free-sector excess ratios', () => {
  const weights = [1e9, 100, 10, 1, .1, .01, .001, .0001, .00001, .000001];
  const p = capProbabilities(weights);
  close(p.reduce((a,b) => a+b), 1);
  assert.ok(p.every(v => v >= .05 && v <= .25));
  close(p[0], .25); close(p[1], .25);
  close((p[2]-.05)/(p[3]-.05), 10);
  close((p[3]-.05)/(p[4]-.05), 10);
  assert.ok(p[3] > p[4], 'Small lore weights retain distinct excess above their floor.');
  const extreme = capProbabilities([Number.MAX_VALUE, 1e100, 1, 1e-100, Number.MIN_VALUE]);
  close(extreme.reduce((a,b) => a+b), 1); assert.ok(extreme.every(v => v >= .05 && v <= .25));
});

test('Feasible boundary pools become uniform; impossible floors/caps never restore excluded outcomes', () => {
  capProbabilities([100, 10, 1, .1]).forEach(v => close(v, .25));
  capProbabilities(Array.from({length:20},(_,i) => i+1)).forEach(v => close(v, .05));
  assert.throws(() => capProbabilities(Array.from({length:21},() => 1)), e => e.code === 'INFEASIBLE_FLOOR');
  assert.throws(() => capProbabilities([1,1,1]), e => e.code === 'INFEASIBLE_CAP');
  for (const bad of [-.01, .26, NaN]) assert.throws(() => capProbabilities([1,1,1,1], .25, bad), e => e.code === 'INVALID_WEIGHTS');
  const guarded = plan(input(), 'strength', {excludedValues:[0,1,2,3,4]});
  assert.deepEqual(guarded.outcomes.map(o => o.value), [5,6,7,8,9]);
  assert.ok(guarded.outcomes.every(o => o.probability >= .05 && o.probability <= .25));
});

test('Bounds can tighten but cannot loosen the user5%..25% policy; infeasible adjusted models need configuration', () => {
  const tight = structuredClone(design.model); tight.minimumProbability = .06; tight.maximumProbability = .24;
  const base = plan(input()), p = plan(input(), 'strength', {model:tight});
  assert.notDeepEqual(probabilities(p), probabilities(base));
  assert.ok(p.outcomes.every(o => o.probability >= .06 && o.probability <= .24));
  for (const [key,value] of [['minimumProbability',.04],['maximumProbability',.26],['minimumProbability',NaN]]) {
    const bad = {...design.model,[key]:value};
    assert.throws(() => plan(input(), 'strength', {model:bad}), e => e.code === 'INVALID_MODEL');
  }
  tight.minimumProbability = .11;
  assert.equal(plan(input(), 'strength', {model:tight}).status, 'needs_configuration');
  tight.minimumProbability = .05; tight.maximumProbability = .2;
  const five = plan(input(), 'strength', {model:tight,excludedValues:[0,1,2,3,4]});
  five.outcomes.forEach(o => close(o.probability,.2));
});

test('High Roller necessarily uses four25% sectors while mastery keeps its own lore distribution', () => {
  const x = input('human',['gambler'],{gambler:[['gambler-type','high-roller']]});
  for (const key of design.statKeys.slice(0,5)) plan(x,key).outcomes.forEach(o => close(o.probability,.25));
  for (const key of design.statKeys.slice(5)) {
    const p = plan(x,key); assert.equal(p.outcomes.length,10);
    assert.ok(p.outcomes.every(o => o.probability >= .05 && o.probability <= .25));
  }
});

test('Frozen new bounds reject violations; legacy saved odds below5% and above25% replay unchanged', () => {
  const current = plan(input('heavenly-principle/god'));
  close(current.distribution.minimumProbability,.05); close(current.distribution.maximumProbability,.25);
  const corrupt = structuredClone(current);
  const difference = corrupt.outcomes[0].probability - .04;
  corrupt.outcomes[0].probability = .04; corrupt.outcomes[1].probability += difference;
  assert.throws(() => selectStatOutcome(corrupt,0), e => e.code === 'INVALID_FROZEN_PLAN');
  const missing = structuredClone(current); delete missing.distribution.minimumProbability;
  assert.throws(() => selectStatOutcome(missing,0), e => e.code === 'INVALID_FROZEN_PLAN');
  const legacy = structuredClone(current); legacy.version='stat-odds/0.1.0';
  legacy.distribution.maximumProbability=.3; delete legacy.distribution.minimumProbability;
  [.005,.008,.012,.025,.04,.06,.1,.2,.25,.3].forEach((p,i) => legacy.outcomes[i].probability=p);
  const saved = JSON.stringify(legacy);
  assert.equal(selectStatOutcome(legacy,0).value,0);
  assert.equal(selectStatOutcome(legacy,1-Number.EPSILON).value,9);
  assert.equal(resolveStatDraw(legacy,draw(legacy,9)).baseValue,9);
  assert.equal(JSON.stringify(legacy),saved);
});

test('Canonical mirrored contracts, runtime refs and God example match actual new bounds', () => {
  const refs = [spec.probabilityContract.statMasteryDistribution, spec.statsContract.conditionalOdds, spec.designProgress.statMasteryOdds];
  refs.forEach(r => { assert.equal(r.version,design.version); close(r.minimumOutcomeProbability,.05); close(r.maximumOutcomeProbability,.25); });
  assert.deepEqual(refs[0],refs[1]); assert.deepEqual(refs[0],refs[2]);
  close(scales.conditionalOddsRef.cap,.25); close(scales.conditionalOddsRef.minimumOutcomeProbability,.05);
  close(gamblerDesign.statOddsRuntimeRef.minimumRandomTierProbability,.05);
  close(gamblerDesign.statOddsRuntimeRef.maximumRandomTierProbability,.25);
  const god = plan(input('heavenly-principle/god'));
  spec.probabilityContract.illustrativeExample.probabilities.forEach((p,i) => close(p,god.outcomes[i].probability));
});
