import test from 'node:test';
import assert from 'node:assert/strict';
import backstory from '../../content/backstory-wheel-design.json' with { type: 'json' };
import spec from '../spec.json' with { type: 'json' };
import odds from '../../content/stat-odds-design.json' with { type: 'json' };
import machine from '../../content/machine-events-design.json' with { type: 'json' };
import universal from '../../content/universal-power-wheels-design.json' with { type: 'json' };
import lelembut from '../../content/lelembut-events-design.json' with { type: 'json' };
import { planBackstoryWheel, selectBackstoryOutcome, resolveBackstoryResult } from '../backstory-event.mjs';

const input = { runId: 'run:1', characterId: 'owner:1', invocationId: 'backstory:1', raceAndArchetypeComplete: true };
const plan = () => planBackstoryWheel(input);
const result = outcomeId => ({ ...input, spinId: 'backstory:actual-draw', outcomeId });
const resolve = (outcomeId, p = plan()) => resolveBackstoryResult(p, result(outcomeId));

test('Backstory retains equal1/38 base odds; explicit hard exclusions renormalize without stat5% floor', () => {
  const p = plan();
  for (const o of p.wheel.outcomes) { assert.equal(o.baseWeight, 1); assert.equal(o.probability, 1 / 38); }
  assert.equal(selectBackstoryOutcome(p, 0), p.wheel.outcomes[0].id);
  assert.equal(selectBackstoryOutcome(p, 1 - Number.EPSILON), p.wheel.outcomes.at(-1).id);
  const excludedOutcomeIds = ['random-guy', 'made-in-lab'];
  const filtered = planBackstoryWheel(input, { excludedOutcomeIds });
  assert.equal(filtered.wheel.outcomes.length, 36);
  assert.ok(filtered.wheel.outcomes.every(o => o.probability === 1 / 36 && !excludedOutcomeIds.includes(o.id)));
  const empty = planBackstoryWheel(input, { excludedOutcomeIds: p.wheel.outcomes.map(o => o.id) });
  assert.equal(empty.status, 'needs_configuration');
  assert.throws(() => planBackstoryWheel(input, { excludedOutcomeIds: ['invented'] }), e => e.code === 'INVALID_BACKSTORY_EXCLUSIONS');
  assert.throws(() => planBackstoryWheel(input, { excludedOutcomeIds: ['random-guy', 'random-guy'] }), e => e.code === 'INVALID_BACKSTORY_EXCLUSIONS');
  assert.equal(planBackstoryWheel({ ...input, raceAndArchetypeComplete: false }).status, 'needs_configuration');
});

test('General Power reward freezes only a deferred ticket; actual pool/result/reaction wait until the Power stage', () => {
  const r = resolve('dumpster-power');
  assert.deepEqual(r.effects, []); assert.deepEqual(r.immediateEvents, []);
  assert.equal(r.nextStage, 'size'); assert.equal(r.deferredPowerTickets.length, 1);
  const ticket = r.deferredPowerTickets[0];
  assert.equal(ticket.wheelId, 'power'); assert.equal(ticket.count, 1);
  assert.equal(ticket.timing, 'deferred'); assert.equal(ticket.stage, 'power');
  assert.equal(ticket.sequence, 'after-main-power-acquisition'); assert.equal(ticket.poolFreezeStage, 'power');
  assert.equal(ticket.requirePower, true); assert.equal(ticket.excludeNone, true);
  assert.equal(ticket.excludeOwnedPowersAtDraw, true);
  assert.equal(ticket.actualResult, null); assert.equal(ticket.reactionAfterActualResult, true);
  assert.equal(ticket.lowTierBiasIntent, 'tier1-2-preferred-not-exclusive'); assert.equal(ticket.outcomes, undefined);
});

test('Android and Divine extra wheels resolve immediately and must finish before Size, without source-race dispatch', () => {
  for (const [id, wheelId, catalog] of [['living-weapon', 'power-android', machine], ['forgotten-prophecy', 'power-divine', universal]]) {
    const r = resolve(id);
    assert.equal(r.deferredPowerTickets.length, 0); assert.equal(r.immediateEvents.length, 1); assert.equal(r.nextStage, null);
    const event = r.immediateEvents[0];
    assert.equal(event.wheelId, wheelId); assert.ok(catalog.wheels.some(w => w.id === wheelId));
    assert.equal(event.timing, 'immediate'); assert.equal(event.requiredBeforeSize, true); assert.equal(event.dispatchRaceEvents, false);
    assert.equal(event.actualResult, null); assert.equal(event.surviveMainNone, true); assert.equal(event.masteryPolicy, 'owner-shared-resolution');
    assert.deepEqual(r.continuation.waitForEventIds, [event.id]); assert.equal(r.continuation.nextStage, 'size');
  }
});

test('Test Subject immediate extra Weakness binds current catalog and must resolve before Size, preserving normal Weakness', () => {
  const r = resolve('test-subject'), event = r.immediateEvents[0];
  assert.equal(event.type, 'extra-weakness-spin'); assert.equal(event.wheelId, 'weakness');
  assert.equal(event.timing, 'immediate'); assert.equal(event.requiredBeforeSize, true); assert.equal(event.preserveNormalWeaknessStage, true);
  assert.equal(event.requiredCatalogBinding, 'weakness-wheel/1.0.0'); assert.equal(event.status, 'pending-wheel-adapter');
  assert.equal(event.catalogDesign, 'content/weakness-wheel-design.json'); assert.equal(event.module, 'framework/weakness-wheel.mjs');
  assert.equal(r.nextStage, null); assert.equal(r.deferredPowerTickets.length, 0);
  assert.equal(r.effects[0].stat, 'strength'); assert.equal(r.effects[0].amount, 1); assert.equal(r.effects[0].calculation, 'final-only');
  assert.ok(spec.mainFlow.some(step => step.id === 'weakness'));
});

test('Intangibility is a fixed immediate grant with merged provenance, retained through main None and shared mastery', () => {
  const r = resolve('should-not-exist'), grant = r.effects[0];
  assert.equal(grant.type, 'grant-power'); assert.equal(grant.definitionId, 'intangibility');
  assert.ok(lelembut.powers.some(p => p.id === grant.definitionId));
  assert.equal(grant.registration, 'immediate'); assert.equal(grant.mergePolicy, 'merge-fixed-definition-with-all-source-provenance');
  assert.equal(grant.surviveMainNone, true); assert.equal(grant.masteryPolicy, 'owner-shared-resolution');
  assert.equal(grant.triggersMasterySpinNow, false); assert.equal(grant.triggersEnchantNow, false);
  assert.equal(r.immediateEvents.length, 0); assert.equal(r.deferredPowerTickets.length, 0); assert.equal(r.nextStage, 'size');
});

test('Approved stat/mastery modifiers register immediately but calculate at finalization; negative mastery is preserved', () => {
  const statRecipes = { 'made-in-lab': 'intelligence', 'exiled-return': 'strength', 'self-made': 'fight',
    'farm-raised': 'strength', 'former-merchant': 'intelligence', 'endless-wanderer': 'speed', 'hard-way': 'durability',
    'test-subject': 'strength', 'war-born': 'fight', 'last-of-kind': 'durability', 'enemy-raised': 'fight', 'impossible-survivor': 'durability' };
  for (const [id, stat] of Object.entries(statRecipes)) {
    const effect = resolve(id).effects[0];
    assert.equal(effect.stat, stat); assert.equal(effect.amount, 1); assert.equal(effect.registration, 'immediate');
    assert.equal(effect.calculation, 'final-only'); assert.equal(effect.applyAfterImmutableBase, true); assert.equal(effect.finalValue, undefined);
  }
  for (const [id, target, amount, scope] of [
    ['legend-trained', 'weapon-mastery', 1, 'all-owned-weapons'], ['fallen-knight', 'weapon-mastery', 1, 'all-owned-weapons'],
    ['ancient-lineage', 'power-mastery', 1, 'all-owned-powers'], ['failed-magician', 'power-mastery', -1, 'all-owned-powers'],
    ['unsealed', 'power-mastery', 1, 'all-owned-powers']
  ]) {
    const effect = resolve(id).effects[0];
    assert.equal(effect.target, target); assert.equal(effect.amount, amount); assert.equal(effect.scope, scope);
    assert.equal(effect.registration, 'immediate'); assert.equal(effect.calculation, 'final-only');
    assert.equal(effect.triggersMasterySpinNow, false); assert.equal(effect.triggersEnchantNow, false);
  }
});

test('Lore-only results produce no inferred gifts/events, retaining explicit future-odds intents', () => {
  const loreOnlyIds = backstory.wheel.outcomes.filter(o => !o.directEffects.length && !o.eventRules.length).map(o => o.id);
  assert.deepEqual(spec.eventContract.backstoryLoreOdds.approvedLoreOnlyIds, loreOnlyIds);
  for (const id of loreOnlyIds) {
    const r = resolve(id);
    assert.deepEqual(r.effects, []); assert.deepEqual(r.immediateEvents, []); assert.deepEqual(r.deferredPowerTickets, []);
    assert.equal(r.nextStage, 'size'); assert.equal(r.backstoryFact.outcomeId, id); assert.equal(r.backstoryFact.committed, true);
  }
  for (const id of ['random-guy', 'embarrassing-origin', 'small-town-nobody']) assert.deepEqual(resolve(id).probabilityIntents, []);
  const oddsIntent = resolve('betrayed').probabilityIntents[0];
  assert.equal(oddsIntent.target, 'weakness'); assert.equal(oddsIntent.numericRuleRef, 'weakness-backstory-betrayed');
  assert.equal(oddsIntent.status, 'implemented-current-weakness-likelihood'); assert.equal(oddsIntent.retroactive, false);
});

test('Source keys and recipes replay identically without reopening a changed live catalog', () => {
  const catalog = structuredClone(backstory), p = planBackstoryWheel(input, { catalog }), saved = JSON.stringify(p);
  const recipe = catalog.wheel.outcomes.find(o => o.id === 'made-in-lab'); recipe.directEffects[0].amount = 99; recipe.label = 'changed';
  const first = resolve('made-in-lab', p), again = resolve('made-in-lab', JSON.parse(saved));
  assert.deepEqual(first, again); assert.equal(first.effects[0].amount, 1); assert.equal(JSON.stringify(p), saved);
  assert.notEqual(first.ledgerKey, first.effects[0].ledgerKey);
  const otherPlan = planBackstoryWheel({ ...input, characterId: 'owner:2' });
  const other = resolveBackstoryResult(otherPlan, { ...result('made-in-lab'), characterId: 'owner:2' });
  assert.notEqual(first.effects[0].ledgerKey, other.effects[0].ledgerKey);
  assert.throws(() => resolveBackstoryResult(p, { ...result('made-in-lab'), characterId: 'owner:2' }), e => e.code === 'BACKSTORY_SOURCE_MISMATCH');
  assert.throws(() => resolveBackstoryResult(p, result('invented')), e => e.code === 'UNKNOWN_BACKSTORY_OUTCOME');
});

test('Corrupt frozen odds, unapproved recipes and reversed execution timing are rejected before sampling', () => {
  for (const sample of [-1, 1, NaN]) assert.throws(() => selectBackstoryOutcome(plan(), sample), e => e.code === 'INVALID_RANDOM_SAMPLE');
  const wrongOdds = plan(); wrongOdds.wheel.outcomes[0].probability = .9;
  assert.throws(() => selectBackstoryOutcome(wrongOdds, 0), e => e.code === 'INVALID_BACKSTORY_POOL');
  const pending = plan(); pending.recipes[0].eventStatus = 'pending-user';
  assert.throws(() => selectBackstoryOutcome(pending, 0), e => e.code === 'INVALID_BACKSTORY_RECIPE');
  const earlyGeneral = plan(); earlyGeneral.recipes.find(o => o.id === 'dumpster-power').eventRules[0].timing = 'immediate';
  assert.throws(() => resolve('dumpster-power', earlyGeneral), e => e.code === 'INVALID_BACKSTORY_TIMING');
  const lateWeakness = plan(); lateWeakness.recipes.find(o => o.id === 'test-subject').eventRules[0].timing = 'deferred';
  assert.throws(() => resolve('test-subject', lateWeakness), e => e.code === 'INVALID_BACKSTORY_TIMING');
});

test('Recipe mirrors and five authored stat-likelihood references distinguish current calibration from unbound future-pool intents', () => {
  for (const o of backstory.wheel.outcomes) {
    const profile = backstory.eventProfiles.find(p => p.id === o.id);
    assert.deepEqual(profile.effects, o.directEffects); assert.deepEqual(profile.followups, o.eventRules);
    assert.deepEqual(profile.probabilityModifiers, o.probabilityModifiers);
  }
  const rules = odds.evidenceRules.filter(r => r.group === 'backstory-lore');
  assert.equal(rules.length, 5); assert.equal(odds.evidenceRules.length, 96); assert.equal(backstory.numericCalibration.rawCenterShift, .35);
  const actualRefs = new Set(backstory.wheel.outcomes.flatMap(o => o.probabilityModifiers.filter(p => p.status === 'implemented-current-stat-likelihood').map(p => p.numericRuleRef)));
  assert.deepEqual([...actualRefs].sort(), rules.map(r => r.id).sort());
  for (const contract of [spec.probabilityContract.statMasteryDistribution, spec.statsContract.conditionalOdds, spec.designProgress.statMasteryOdds]) {
    assert.equal(contract.version, odds.version); assert.equal(contract.eventLikelihoodCount, 96);
  }
  assert.equal(spec.eventContract.backstoryLoreOdds.numericStatRuleCount, 5);
});
