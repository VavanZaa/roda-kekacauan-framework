import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { planEnchantmentWheel, selectEnchantmentOutcome, resolveEnchantmentResult } from '../enchantment-wheel.mjs';
import design from '../../content/enchantment-wheel-design.json' with { type: 'json' };
import weapons from '../../content/weapon-wheel-design.json' with { type: 'json' };

const byId = id => weapons.weapons.find(w => w.id === 'weapon-' + id);
function input(id = 'pedang-panjang', raw = 5, modifiers = []) {
  const w = byId(id);
  return { runId: 'run:1', characterId: 'owner:1', invocationId: 'enchant:1', stage: 'finalize',
    finalPhase: { priorEventsComplete: true, snapshotId: 'final-snapshot:1' }, consumedSlotKeys: [],
    weapon: { instanceId: 'weapon:1', runId: 'run:1', ownerCharacterId: 'owner:1', kind: 'weapon', activeStatus: 'active',
      definitionId: w.weaponDefinitionRef.definitionId, definitionFile: w.weaponDefinitionRef.definitionFile, enchantments: [] },
    mastery: { weaponInstanceId: 'weapon:1', resolutionId: 'mastery:1', retainedRawBase: raw, modifiers } };
}
const modifier = (amount, targetWeaponInstanceId = 'weapon:1', sourceKey = 'bonus:1') => ({ amount, targetWeaponInstanceId, sourceKey, committed: true });
const result = (p, id = p.outcomes[0].id) => ({ runId: p.runId, characterId: p.characterId, invocationId: p.invocationId, spinId: 'enchant-draw:1', outcomeId: id });
const ids = p => p.outcomes.map(e => e.id);

test('60 unique authored recipes include all seven requested examples and twelve per strength tier', () => {
  assert.equal(design.enchantments.length, 60);
  assert.equal(new Set(design.enchantments.map(e => e.id)).size, 60);
  for (let tier = 1; tier <= 5; tier++) assert.equal(design.enchantments.filter(e => e.tier === tier).length, 12);
  for (const id of ['giant','bloodsteal','fire','living','sharp','tiny','slippery']) assert.ok(design.enchantments.some(e => e.id === 'enchant-'+id));
  assert.ok(design.enchantments.every(e => e.baseWeight === 1 && e.statModifiers.length === 0 && e.grantsPowers.length === 0));
});

test('All150 canonical weapon definitions have a nonempty compatible normalized final-phase pool', () => {
  assert.equal(design.compatibilityBindings.length, 150);
  for (const w of weapons.weapons) {
    const p = planEnchantmentWheel(input(w.id.slice(7)));
    assert.equal(p.status, 'ready', w.id);
    assert.ok(p.outcomes.length >= 40, w.id);
    assert.ok(Math.abs(p.outcomes.reduce((s, e) => s + e.probability, 0) - 1) < 1e-12);
    assert.ok(p.outcomes.every(e => e.requiresAll.every(c => p.binding.capabilities.includes(c))));
    const data = JSON.parse(readFileSync(new URL('../../'+p.binding.definitionFile, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
    assert.ok([...(data.weapons ?? []), ...(data.weaponDefinitions ?? []), ...(data.techWeapons ?? [])].some(d => d.id === p.binding.definitionId));
  }
});

test('Final effective mastery: raw4+1 qualifies, raw5-1 does not, unrelated weapon bonus does not apply', () => {
  assert.equal(planEnchantmentWheel(input('katana', 4, [modifier(1)])).status, 'ready');
  assert.equal(planEnchantmentWheel(input('katana', 5, [modifier(-1)])).reason, 'effective-mastery-below-master');
  assert.equal(planEnchantmentWheel(input('katana', 4, [modifier(9, 'other-weapon')])).reason, 'effective-mastery-below-master');
  assert.equal(planEnchantmentWheel(input('katana', 3, [modifier(2, null)])).mastery.effective, 5);
});

test('Signed unbounded mastery remains exact; bonus does not replace immutable base or duplicate ledger sources', () => {
  const high = planEnchantmentWheel(input('katana', 9, [modifier(4)]));
  assert.equal(high.mastery.rawBase, 9); assert.equal(high.mastery.effective, 13);
  const low = planEnchantmentWheel(input('katana', 0, [modifier(-2)]));
  assert.equal(low.mastery.effective, -2); assert.equal(low.status, 'skip');
  assert.throws(() => planEnchantmentWheel(input('katana', 5, [modifier(1), modifier(1)])), { code: 'DUPLICATE_MASTERY_SOURCE' });
  assert.throws(() => planEnchantmentWheel(input('katana', 5, [{ ...modifier(1), committed: false }])), { code: 'INVALID_MASTERY_SOURCE' });
});

test('No early Enchant before final bonus snapshot and completed prior events', () => {
  const x = input('katana', 9); x.stage = 'weapon';
  assert.equal(planEnchantmentWheel(x).status, 'needs_configuration');
  x.stage = 'finalize'; x.finalPhase.priorEventsComplete = false;
  assert.equal(planEnchantmentWheel(x).actualSpin, false);
});

test('Power, discarded and explicitly non-enchantable weapons create no Enchant draw', () => {
  const power = input(); power.weapon.kind = 'power'; assert.equal(planEnchantmentWheel(power).reason, 'not-a-weapon');
  const discarded = input(); discarded.weapon.activeStatus = 'discarded'; assert.equal(planEnchantmentWheel(discarded).reason, 'discarded-weapon');
  const external = input(); external.weapon.definitionId = 'unarmed'; external.weapon.definitionFile = 'test/external.json';
  const p = planEnchantmentWheel(external, { extraBindings: [{ id: 'unarmed', definitionId: 'unarmed', definitionFile: 'test/external.json', enchantable: false, capabilities: [] }] });
  assert.equal(p.reason, 'non-enchantable-weapon'); assert.equal(p.actualSpin, false);
});

test('Canonical compatibility: brass knuckle cannot get Sharp; Nunchaku can Bind; batteries need powered weapon', () => {
  const fist = planEnchantmentWheel(input('buku-jari-besi')), blade = planEnchantmentWheel(input('katana'));
  assert.ok(!ids(fist).includes('enchant-sharp')); assert.ok(ids(blade).includes('enchant-sharp'));
  assert.ok(ids(planEnchantmentWheel(input('nunchaku'))).includes('enchant-binding'));
  assert.ok(!ids(blade).includes('enchant-leaky-battery'));
  assert.ok(ids(planEnchantmentWheel(input('railgun'))).includes('enchant-leaky-battery'));
  assert.ok(ids(planEnchantmentWheel(input('railgun'))).includes('enchant-ricochet'));
  assert.ok(!ids(blade).includes('enchant-ricochet'));
});

test('Unsupported companions/platforms/early definitions need explicit adapters instead of guessed artifact traits', () => {
  for (const name of ['girlfriend', 'rider-mecha', 'gnome-unmapped']) {
    const x = input(); x.weapon.definitionId = name;
    assert.deepEqual(planEnchantmentWheel(x).required, ['explicit-canonical-weapon-enchantment-binding']);
  }
  const mismatch = input(); mismatch.weapon.definitionFile = 'wrong/file.json';
  assert.equal(planEnchantmentWheel(mismatch).status, 'needs_configuration');
});

test('Uniform eligible leaves only; equal weapon tier policy and stat/mastery5..25% bounds never enter Enchant', () => {
  const x = input(); x.equalizerActive = true;
  const p = planEnchantmentWheel(x);
  assert.deepEqual(p.outcomes, planEnchantmentWheel(input()).outcomes);
  assert.ok(p.outcomes.every(e => e.probability === 1/p.outcomes.length));
  assert.ok(p.outcomes.every(e => e.probability < .05));
  assert.equal(p.trace.reservedTierMass, false);
  assert.equal(p.trace.statMasteryProbabilityBoundsApplied, false);
});

test('Hard exclusions are applied before uniform weights, empty eligible pool is configuration failure without None', () => {
  const p = planEnchantmentWheel(input(), { excludedEnchantmentIds: ['enchant-fire'] });
  assert.ok(!ids(p).includes('enchant-fire')); assert.ok(p.outcomes.every(e => e.probability === 1/p.outcomes.length));
  const empty = planEnchantmentWheel(input(), { excludedEnchantmentIds: design.enchantments.map(e => e.id) });
  assert.equal(empty.status, 'needs_configuration'); assert.equal(empty.actualSpin, false);
  assert.throws(() => planEnchantmentWheel(input(), { excludedEnchantmentIds: ['unknown'] }), { code: 'INVALID_ENCHANT_EXCLUSIONS' });
});

test('Consumed instance slot, not higher mastery or fresh invocation, prevents a second Enchant', () => {
  const x = input(), p = planEnchantmentWheel(x);
  x.consumedSlotKeys = [p.slotKey]; x.invocationId = 'another-invocation'; x.mastery.retainedRawBase = 9;
  assert.equal(planEnchantmentWheel(x).reason, 'slot-already-consumed');
  assert.equal(resolveEnchantmentResult(p, result(p), { consumedSlotKeys: [p.slotKey] }).status, 'already_resolved');
  x.consumedSlotKeys = []; x.weapon.enchantments = [{ slotKey: p.slotKey }];
  assert.equal(planEnchantmentWheel(x).reason, 'slot-already-consumed');
});

test('Unknown old slot records require migration rather than overwrite', () => {
  const x = input(); x.weapon.enchantments = [{ id: 'old-enchant' }];
  assert.equal(planEnchantmentWheel(x).status, 'needs_configuration');
});

test('External CDF edges and source identities use the frozen compatible wheel only', () => {
  const p = planEnchantmentWheel(input());
  assert.equal(selectEnchantmentOutcome(p, 0), p.outcomes[0].id);
  assert.equal(selectEnchantmentOutcome(p, .999999), p.outcomes.at(-1).id);
  assert.throws(() => selectEnchantmentOutcome(p, 1), { code: 'INVALID_RANDOM_SAMPLE' });
  assert.throws(() => resolveEnchantmentResult(p, { ...result(p), characterId: 'other' }), { code: 'ENCHANT_SOURCE_MISMATCH' });
  assert.throws(() => resolveEnchantmentResult(p, result(p, 'enchant-leaky-battery')), { code: 'UNKNOWN_ENCHANT_OUTCOME' });
  assert.throws(() => resolveEnchantmentResult(p, result(p), { currentSnapshotId: 'changed' }), { code: 'STALE_ENCHANT_SNAPSHOT' });
});

test('One source-once atomic trait/slot receipt; size/blood/living effects create no owner power/Size or weapon grant', () => {
  for (const id of ['enchant-giant','enchant-tiny','enchant-bloodsteal','enchant-living']) {
    const p = planEnchantmentWheel(input()), r = resolveEnchantmentResult(p, result(p, id));
    assert.equal(r.atomicEffects.length, 2); assert.equal(r.sourceKey, p.slotKey);
    assert.equal(r.atomicEffects[0].weaponInstanceId, 'weapon:1'); assert.equal(r.atomicEffects[1].slotKey, p.slotKey);
    assert.equal(r.grantsOwnerPower, false); assert.equal(r.changesOwnerSize, false); assert.equal(r.triggersMasterySpin, false);
  }
});

test('Actual funny result supplies Shrek hook key only once by spin; projection and preview do not settle a bonus', () => {
  const p = planEnchantmentWheel(input()), r = resolveEnchantmentResult(p, result(p, 'enchant-tiny'));
  assert.equal(r.funnyResult, true); assert.equal(r.funnyActualSpinKey, JSON.stringify(['run:1','owner:1','enchant-draw:1']));
  assert.deepEqual(resolveEnchantmentResult(p, result(p, 'enchant-tiny')), r);
  assert.equal(resolveEnchantmentResult(p, result(p, 'enchant-fire')).funnyActualSpinKey, null);
  assert.equal(r.atomicEffects.some(e => e.type === 'add-stat'), false);
});

test('Frozen recipe survives later live catalog edits; tampered gate/pool is rejected and planning never mutates input', () => {
  const x = input(), before = structuredClone(x), custom = structuredClone(design);
  const p = planEnchantmentWheel(x, { catalog: custom }), frozen = structuredClone(p);
  custom.enchantments.find(e => e.id === 'enchant-fire').context = 'Edited later';
  assert.deepEqual(p, frozen); assert.deepEqual(x, before);
  assert.ok(resolveEnchantmentResult(p, result(p, 'enchant-fire')).contextFacts.includes('Serangan senjata membawa api.'));
  const bad = structuredClone(p); bad.mastery.effective = 99;
  assert.throws(() => selectEnchantmentOutcome(bad, .5), { code: 'INVALID_FROZEN_ENCHANT_PLAN' });
  const badPool = structuredClone(p); badPool.outcomes[0].probability = .25;
  assert.throws(() => selectEnchantmentOutcome(badPool, .5), { code: 'INVALID_FROZEN_ENCHANT_PLAN' });
});
