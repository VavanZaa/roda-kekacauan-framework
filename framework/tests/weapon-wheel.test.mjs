import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import design from '../../content/weapon-wheel-design.json' with { type: 'json' };
import backstory from '../../content/backstory-wheel-design.json' with { type: 'json' };
import spec from '../spec.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import weaponAudit from '../../reference/weapon-race-affinity-audit.json' with { type: 'json' };
import legacy from '../../reference/weapon-odds-legacy-0.1-fixture.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planWeaponWheel, selectWeaponOutcome, resolveWeaponResult } from '../weapon-wheel.mjs';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-12, `${a} != ${b}`);
function input(caseId = 'human', roles = [], backstoryId, results = {}) {
  const x = structuredClone([...audit.terminalCases, ...audit.ownerRewardContextCases].find(c => c.id === caseId).input);
  x.archetypeIds = roles;
  x.archetypeFacts = roles.map(id => ({ archetypeId: id, sourceId: `role:${id}`, committed: true,
    results: (results[id] ?? []).map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `role:${id}:draw:${i}` })) }));
  const sizePlan = planSizeStage(x); assert.equal(sizePlan.status, 'ready');
  if (backstoryId) x.backstoryFact = { outcomeId: backstoryId, sourceId: 'backstory:1', spinId: 'backstory:actual', committed: true };
  return { ...x, invocationId: 'weapon:main', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'size:actual', outcomeId: sizePlan.outcomes[5]?.id ?? sizePlan.outcomes[0].id },
    weapons: [], powers: [] };
}
const probability = (p, id) => p.outcomes.find(o => o.id === id)?.probability ?? 0;
const byLabel = label => design.weapons.find(w => w.label === label).id;
const tierMass = (p, t) => p.outcomes.filter(o => o.tier === t).reduce((s, o) => s + o.probability, 0);
const resolve = (p, outcomeId, spinId = 'weapon:actual') => resolveWeaponResult(p,
  { runId: p.runId, characterId: p.characterId, invocationId: p.invocationId, outcomeId, spinId });

test('150 unique weapon recipes,30 per Tier, plus exactly one un-tiered None sector', () => {
  assert.equal(design.weapons.length, 150);
  assert.equal(new Set(design.weapons.map(w => w.id)).size, 150);
  for (let t = 1; t <= 5; t++) assert.equal(design.weapons.filter(w => w.tier === t).length, 30);
  const p = planWeaponWheel(input());
  assert.equal(p.status, 'ready'); assert.equal(p.outcomes.length, 151);
  assert.equal(p.outcomes[0].id, 'weapon-none'); assert.equal(p.outcomes[0].tier, null);
  for (let i = 2; i < p.outcomes.length; i++) assert.ok(p.outcomes[i - 1].tier <= p.outcomes[i].tier);
  for (const label of ['Bola Tenis', 'Gigi Palsu', 'Jebakan Tikus', 'Batu Bata', 'Garpu', 'Dragon Slayer (Berserk)', 'Excalibur', 'Trident / Trisula']) assert.ok(byLabel(label));
  assert.equal(spec.probabilityContract.weaponAcquisitionDistribution.weaponCount, 150);
  close(spec.probabilityContract.weaponAcquisitionDistribution.tierProbabilityGivenWeapon, .2);
  const refs = backstory.wheel.outcomes.flatMap(o => o.probabilityModifiers.filter(p => p.target === 'weapon'));
  assert.equal(refs.length, 6);
  assert.deepEqual(refs.map(p => p.numericRuleRef).sort(), design.probabilityModel.backstoryProfiles.map(p => p.id).sort());
  assert.ok(refs.every(p => p.status === 'implemented-current-weapon-likelihood'));
});

test('Every main weapon grants a real canonical definition; reused signature references do not create a second authority', () => {
  for (const w of design.weapons) {
    const { definitionFile, definitionId } = w.weaponDefinitionRef;
    const data = JSON.parse(readFileSync(new URL(`../../${definitionFile}`, import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
    const definitions = [...(data.weapons ?? []), ...(data.weaponDefinitions ?? []), ...(data.techWeapons ?? [])];
    assert.ok(definitions.some(d => d.id === definitionId), `${w.id}: ${definitionId}`);
  }
});

test('All324 terminal owner contexts retain equal tier probability and positive normalized individual weights', () => {
  for (const c of audit.terminalCases) {
    const p = planWeaponWheel(input(c.id)); assert.equal(p.status, 'ready', c.id);
    close(p.outcomes.reduce((s, o) => s + o.probability, 0), 1);
    assert.ok(p.outcomes.every(o => o.probability > 0 && Number.isFinite(o.probability)), c.id);
    const mass = (1 - probability(p, 'weapon-none')) / 5;
    for (let t = 1; t <= 5; t++) close(tierMass(p, t), mass);
  }
});

test('Human None20% and Dragon None80% have16% vs4% unconditional chance in each Tier', () => {
  const human = planWeaponWheel(input()), dragon = planWeaponWheel(input('mythical-beast/imported/dragon/western'));
  close(probability(human, 'weapon-none'), .2); close(probability(dragon, 'weapon-none'), .8);
  for (let t = 1; t <= 5; t++) { close(tierMass(human, t), .16); close(tierMass(dragon, t), .04); }
});

test('Paladin Sacred Sword approximately10% reserves only within Tier4; no tier rarity bias', () => {
  const p = planWeaponWheel(input('human', ['paladin'])), none = probability(p, 'weapon-none');
  const sacred = probability(p, 'weapon-sacred-sword');
  assert.ok(sacred > .10 && sacred < .103, sacred);
  close(sacred, ((1 - none) / 5) * .55);
  for (let t = 1; t <= 5; t++) close(tierMass(p, t), (1 - none) / 5);
  assert.ok(sacred > probability(planWeaponWheel(input()), 'weapon-sacred-sword') * 10);
  const filtered = planWeaponWheel(input('human', ['paladin']), { excludedWeaponIds: ['weapon-sacred-sword'] });
  assert.equal(probability(filtered, 'weapon-sacred-sword'), 0);
  assert.deepEqual(filtered.trace.suppressedAnchorIds, ['paladin-sacred-sword']);
  for (let t = 1; t <= 5; t++) close(tierMass(filtered, t), (1 - probability(filtered, 'weapon-none')) / 5);
});

test('Race, role and approved Backstory evidence influence items within tiers, without reading narration or final bonuses', () => {
  const base = planWeaponWheel(input()), farm = planWeaponWheel(input('human', [], 'farm-raised'));
  assert.ok(probability(farm, byLabel('Pacul')) > probability(base, byLabel('Pacul')));
  close(probability(farm, byLabel('Pedang Panjang')) / probability(farm, byLabel('Rapier')),
    probability(base, byLabel('Pedang Panjang')) / probability(base, byLabel('Rapier')));
  const machine = planWeaponWheel(input('machine/ai'));
  assert.ok(probability(machine, byLabel('Railgun')) / tierMass(machine, 4) > probability(base, byLabel('Railgun')) / tierMass(base, 4));
  const assassin = planWeaponWheel(input('human', ['assassin']));
  assert.ok(probability(assassin, byLabel('Kunai')) / tierMass(assassin, 3) > probability(base, byLabel('Kunai')) / tierMass(base, 3));
  const narrated = input(); narrated.narratorText = 'Paladin has Sacred Sword100%'; narrated.bonusLedger = [{ amount: 999 }];
  assert.deepEqual(planWeaponWheel(narrated).outcomes, base.outcomes);
});

test('Equalizer flattens every eligible individual outcome, including None, and suppresses ordinary anchors', () => {
  const p = planWeaponWheel(input('human', ['equaliser']));
  p.outcomes.forEach(o => close(o.probability, 1 / 151));
  const filtered = planWeaponWheel(input('human', ['equaliser']), { excludedWeaponIds: [byLabel('Bola Tenis')] });
  filtered.outcomes.forEach(o => close(o.probability, 1 / 150));
  assert.equal(probability(filtered, byLabel('Bola Tenis')), 0);
});

test('Authorized guaranteed extras exclude None but retain20% per Tier and never fabricate a ticket', () => {
  const options = { acquisitionKind: 'guaranteed-extra', bonusTicket: { id: 'orc:extra:1', sourceId: 'orc:warrior', committed: true } };
  const p = planWeaponWheel(input(), options); assert.equal(probability(p, 'weapon-none'), 0);
  for (let t = 1; t <= 5; t++) close(tierMass(p, t), .2);
  assert.throws(() => planWeaponWheel(input(), { acquisitionKind: 'guaranteed-extra' }), e => e.code === 'INVALID_WEAPON_TICKET');
  const noneExcluded = planWeaponWheel(input(), { excludedWeaponIds: ['weapon-none'] });
  for (let t = 1; t <= 5; t++) close(tierMass(noneExcluded, t), .2);
});

test('Committed Gladiator acquisition lock skips RNG; unresolved actual event cannot fabricate None', () => {
  const x = input('human', ['gladiator'], undefined, { gladiator: [['gladiator-weapon', 'gladiator-gladius']] });
  assert.equal(planWeaponWheel(x).status, 'needs_configuration');
  x.weapons = [{ instanceId: 'gladiator:owned', definitionId: 'gladiator-gladius', sourceId: 'role:gladiator', committed: true }];
  x.weaponAcquisitionLock = { sourceId: 'role:gladiator', committed: true, allowedWeaponInstanceId: 'gladiator:owned' };
  const p = planWeaponWheel(x); assert.equal(p.status, 'skip'); assert.equal(p.actualSpin, false); assert.deepEqual(p.outcomes, []);
  assert.throws(() => selectWeaponOutcome(p, 0), e => e.code === 'INVALID_FROZEN_WEAPON_PLAN');
});

test('None retains earlier weapons; grants use normal mastery, no automatic powers, tiers or enchant boost', () => {
  const x = input(); x.weapons = [{ instanceId: 'early:katana', definitionId: 'katana', sourceId: 'early:oni', committed: true }];
  const p = planWeaponWheel(x), saved = JSON.stringify(p), empty = resolve(p, 'weapon-none');
  assert.deepEqual(empty.effects, []); assert.equal(empty.retainPreviousWeapons, true);
  for (const label of ['Katana', 'Excalibur', 'Gigi Palsu']) {
    const r = resolve(p, byLabel(label)), grant = r.effects[0];
    assert.equal(grant.type, 'grant-weapon'); assert.equal(grant.masteryPolicy, 'recipient-normal-per-instance');
    assert.equal(grant.masteryStatus, 'unresolved'); assert.equal(grant.triggersEnchantNow, false);
    assert.equal(grant.triggersMasterySpinNow, false); assert.equal(r.effects.length, 1);
    assert.equal(r.nextStage, 'weapon-subflow');
    assert.deepEqual(r, resolve(p, byLabel(label))); assert.equal(JSON.stringify(p), saved);
  }
  assert.equal(resolve(p, byLabel('Katana')).effects[0].definitionId, 'katana');
  assert.equal(resolve(p, byLabel('Excalibur')).effects[0].definitionId, 'legend-fate-excalibur');
  assert.equal(resolve(p, byLabel('Gigi Palsu')).funnyResult, true);
  assert.equal(empty.funnyResult, false);
});

test('Frozen source/recipe replay survives catalog edits; unknown IDs, reused draws and corrupt tier masses fail', () => {
  const c = structuredClone(design), p = planWeaponWheel(input(), { catalog: c }), saved = JSON.stringify(p);
  c.weapons[0].label = 'changed'; c.probabilityModel.raceProfiles[0].noneProbability = .9;
  assert.equal(resolve(p, p.outcomes[1].id).label, 'Bola Tenis'); assert.equal(JSON.stringify(p), saved);
  assert.throws(() => resolve(p, 'fake'), e => e.code === 'UNKNOWN_WEAPON_OUTCOME');
  assert.throws(() => resolve(p, p.outcomes[1].id, 'size:actual'), e => e.code === 'DUPLICATE_WEAPON_DRAW');
  const wrong = { runId: p.runId, characterId: 'other', invocationId: p.invocationId, spinId: 'new', outcomeId: p.outcomes[1].id };
  assert.throws(() => resolveWeaponResult(p, wrong), e => e.code === 'WEAPON_SOURCE_MISMATCH');
  const corrupt = structuredClone(p); corrupt.outcomes[1].probability += .001; corrupt.outcomes.find(o => o.tier === 2).probability -= .001;
  assert.throws(() => selectWeaponOutcome(corrupt, 0), e => e.code === 'INVALID_FROZEN_WEAPON_PLAN');
  const removedTier = design.weapons.filter(w => w.tier === 5).map(w => w.id);
  assert.equal(planWeaponWheel(input(), { excludedWeaponIds: removedTier }).status, 'needs_configuration');
  const bad = structuredClone(design); bad.probabilityModel.tierMassGivenWeapon[1] = .3;
  assert.throws(() => planWeaponWheel(input(), { catalog: bad }), e => e.code === 'INVALID_WEAPON_MODEL');
  for (const u of [-1, 1, NaN]) assert.throws(() => selectWeaponOutcome(p, u), e => e.code === 'INVALID_RANDOM_SAMPLE');
  assert.equal(selectWeaponOutcome(p, 0), 'weapon-none');
  assert.equal(selectWeaponOutcome(p, 1 - Number.EPSILON), p.outcomes.at(-1).id);
});

test('Only actual Royal Knight favors swords gently; Pawn, missing event, daggers and nunchaku remain distinct', () => {
  const knight = planWeaponWheel(input('human', ['royal'], undefined, { royal: [['royal-chess-piece', 'knight']] }));
  const pawn = planWeaponWheel(input('human', ['royal'], undefined, { royal: [['royal-chess-piece', 'pawn']] }));
  const unspecified = planWeaponWheel(input('human', ['royal']));
  const sword = byLabel('Pedang Panjang'), gun = byLabel('Revolver');
  close(probability(knight, sword) / probability(knight, gun), 1.5);
  close(probability(pawn, sword) / probability(pawn, gun), 1);
  assert.equal(knight.trace.roleResultProfiles[0].id, 'weapon-role-royal-knight');
  assert.deepEqual(unspecified.trace.roleResultProfiles, []);
  assert.ok(knight.outcomes.find(w => w.id === sword).tags.includes('sword'));
  for (const label of ['Kunai', 'Nunchaku', 'Kapak Perang', 'Buku Jari Besi'])
    assert.ok(!knight.outcomes.find(w => w.id === byLabel(label)).tags.includes('sword'));
  assert.equal(design.weapons.find(w => w.label === 'Buku Jari Besi').tier, 3);
  assert.ok(design.weapons.find(w => w.label === 'Buku Jari Besi').aliases.includes('Brass Knuckle'));
  assert.equal(design.weapons.find(w => w.label === 'Nunchaku').tier, 3);
  assert.ok(probability(knight, byLabel('Gigi Palsu')) > 0);
});

test('Matching race plus role plus Backstory cannot amplify ordinary within-Tier item ratios beyond2', () => {
  const p = planWeaponWheel(input('elf/high-elf', ['royal'], 'fallen-knight', { royal: [['royal-chess-piece', 'knight']] }));
  const sword = p.outcomes.find(w => w.id === byLabel('Pedang Panjang'));
  close(sword.loreWeight, 2);
  for (let t = 1; t <= 5; t++) {
    const rows = p.outcomes.filter(w => w.tier === t);
    assert.ok(Math.max(...rows.map(w => w.probability)) / Math.min(...rows.map(w => w.probability)) <= 2 + 1e-12);
    close(tierMass(p, t), (1 - probability(p, 'weapon-none')) / 5);
  }
  const bad = structuredClone(design); bad.probabilityModel.archetypeResultProfiles[0].tagFactors.sword = 3;
  assert.throws(() => planWeaponWheel(input(), { catalog: bad }), e => e.code === 'INVALID_WEAPON_MODEL');
});

test('Every reviewed terminal identity has an explicit current acquisition audit, with deep profile precedence', () => {
  assert.equal(weaponAudit.reviewedTerminalCaseCount, 348);
  assert.equal(weaponAudit.familyCount, 22);
  assert.equal(weaponAudit.weaponTagCoverage.length, 150);
  assert.equal(new Set(weaponAudit.rows.map(r => r.caseId)).size, 348);
  for (const c of audit.terminalCases) {
    const row = weaponAudit.rows.find(r => r.caseId === c.id); assert.ok(row, c.id);
    const p = planWeaponWheel(input(c.id));
    close(row.baselineNoneProbability, p.trace.noneProbability);
    assert.deepEqual(row.physicalProfileIds, p.trace.raceProfiles.map(r => r.id));
    assert.deepEqual(row.wrapperProfileIds, p.trace.wrapperProfiles.map(r => r.id));
    assert.ok(p.outcomes.every(w => w.id === 'weapon-none' || (w.loreWeight >= 1 && w.loreWeight <= 2)));
    if (!['human', 'raksasa', 'symbiote', 'hybrid', 'lelembut/imported/skeleton', 'lelembut/imported/zombie'].includes(c.id))
      assert.equal(p.trace.raceProfiles[0].reviewedCaseId, c.id);
  }
  for (const path of weaponAudit.evidence.retainedResearch)
    assert.ok(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8').length > 0);
});

test('Body/power-led races prefer None while equipment exceptions retain their own priors', () => {
  for (const [id, expected] of [['cosmic-warrior/ultraman', .9], ['cosmic-warrior/saiyan', .9],
    ['cosmic-warrior/alien-x', .95], ['mythical-beast/imported/phoenix', .95], ['slime/ordinary', .8],
    ['machine/android', .75], ['machine/cyborg', .45], ['machine/ai', .95],
    ['machine/household-appliance/blender', .95], ['mythical-beast/local/kinnara', .1],
    ['elf/sea-elf/atlantean-warrior', .1], ['goblinoid/orc/oni', .1],
    ['legendary-warrior/imported/arthur-pendragon', .1], ['legendary-warrior/imported/merlin', .65]]) {
    const p = planWeaponWheel(input(id)); close(probability(p, 'weapon-none'), expected);
    assert.equal(p.outcomes.length, 151, id); // Soft preference never invents an anatomical ban.
  }
  for (const id of ['harimau', 'ular', 'kelelawar']) close(probability(planWeaponWheel(input('beastfolk/' + id)), 'weapon-none'), .2);
  for (const id of ['horse', 'chicken', 'elephant']) close(probability(planWeaponWheel(input('centaur/' + id)), 'weapon-none'), .1);
});

test('All131 armor/color/cheat/pilot variations are audited; equipment motifs differ without extra canon grants', () => {
  assert.equal(weaponAudit.reviewedRewardContextCaseCount, 131);
  for (const c of audit.ownerRewardContextCases) {
    const row = weaponAudit.rewardContextRows.find(r => r.caseId === c.id); assert.ok(row, c.id);
    const p = planWeaponWheel(input(c.id)); assert.equal(p.status, 'ready', c.id);
    close(row.baselineNoneProbability, probability(p, 'weapon-none'));
    for (let t = 1; t <= 5; t++) close(tierMass(p, t), (1 - row.baselineNoneProbability) / 5);
    if (c.id.startsWith('ultraman-color/') || c.id.startsWith('lantern-color/')) close(row.baselineNoneProbability, .9);
    if (c.id.startsWith('external-pilot-mecha/')) close(row.baselineNoneProbability, .2);
  }
  const plain = planWeaponWheel(input('cosmic-warrior/saint'));
  const libra = planWeaponWheel(input('saint-armor/gold-libra'));
  close(probability(plain, 'weapon-none'), .8); close(probability(libra, 'weapon-none'), .2);
  close(probability(planWeaponWheel(input('saint-armor/gold-sagittarius')), 'weapon-none'), .2);
  close(probability(planWeaponWheel(input('saint-armor/bronze-andromeda')), 'weapon-none'), .3);
  assert.equal(libra.trace.raceProfiles[0].id, 'weapon-armor-gold-libra');
  const one = resolve(libra, byLabel('Nunchaku'));
  assert.equal(one.effects.length, 1); assert.equal(one.effects[0].type, 'grant-weapon');
});

test('Skeleton/Zombie/Giant/Symbiote retain actual host/origin and apply one behavioral overlay at most', () => {
  close(probability(planWeaponWheel(input('lelembut/imported/skeleton')), 'weapon-none'), .2);
  close(probability(planWeaponWheel(input('lelembut/imported/zombie')), 'weapon-none'), 3 / 7);
  close(probability(planWeaponWheel(input('raksasa')), 'weapon-none'), .2);
  const skeleton = input('lelembut/imported/skeleton'), dragon = input('mythical-beast/imported/dragon/western');
  const composed = { ...skeleton, raceFacts: [skeleton.raceFacts[0], dragon.raceFacts[0]], invocationId: 'size' };
  const sizePlan = planSizeStage(composed);
  const p = planWeaponWheel({ ...composed, invocationId: 'weapon:composed', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'size:composed', outcomeId: sizePlan.outcomes[5].id } });
  close(probability(p, 'weapon-none'), .8);
  assert.equal(p.trace.raceProfiles[0].reviewedCaseId, 'mythical-beast/imported/dragon/western');
  assert.deepEqual(p.trace.wrapperProfiles.map(w => w.id), ['weapon-wrapper-skeleton']);
  const x = input('symbiote'); x.raceFacts[0].results[0].outcomeId = 'takeover-90';
  x.invocationId = 'size'; x.sizePlan = planSizeStage(x);
  x.sizeResult = { invocationId: x.sizePlan.invocationId, spinId: 'size:symbiote', outcomeId: x.sizePlan.outcomes[5].id };
  x.invocationId = 'weapon:symbiote'; const high = planWeaponWheel(x);
  close(probability(high, 'weapon-none'), .45 / 1.45);
  assert.deepEqual(high.trace.wrapperProfiles.map(w => w.id), ['weapon-wrapper-symbiote-high']);
});

test('Mixed Hybrid bodies compose once independent of order; external characters are no acquisition evidence', () => {
  const x = input('hybrid'), human = x.raceFacts.find(f => f.familyId === 'human');
  const ultra = input('cosmic-warrior/ultraman').raceFacts[0];
  x.raceFacts = [x.raceFacts[0], human, ultra]; x.invocationId = 'size';
  const sizePlan = planSizeStage(x); const y = { ...x, invocationId: 'weapon:hybrid', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'size:hybrid', outcomeId: sizePlan.outcomes[5].id } };
  const p = planWeaponWheel(y); close(probability(p, 'weapon-none'), .305);
  assert.equal(p.trace.raceProfiles.length, 2); assert.equal(p.trace.wrapperProfiles.length, 1);
  const reverse = { ...x, raceFacts: [...x.raceFacts].reverse() }, reverseSize = planSizeStage(reverse);
  const q = planWeaponWheel({ ...reverse, invocationId: 'weapon:hybrid-reverse', sizePlan: reverseSize,
    sizeResult: { invocationId: reverseSize.invocationId, spinId: 'size:hybrid-reverse', outcomeId: reverseSize.outcomes[5].id } });
  p.outcomes.forEach(o => close(o.probability, probability(q, o.id)));
  const outside = input(); outside.army = ultra; outside.prey = ultra; outside.companions = [ultra];
  assert.deepEqual(planWeaponWheel(outside).outcomes, planWeaponWheel(input()).outcomes);
});

test('Real0.1 frozen plans replay original weights/recipe despite the new moderate-affinity model', () => {
  const p = structuredClone(legacy.plan), saved = JSON.stringify(p);
  assert.equal(p.version, 'weapon-odds/0.1.0');
  assert.equal(p.trace.model.maxCombinedItemFactor, 100);
  assert.equal(selectWeaponOutcome(p, 0), 'weapon-none');
  let mass = 0; const sacred = p.outcomes.find(o => o.id === 'weapon-sacred-sword');
  for (const o of p.outcomes) { if (o.id === sacred.id) break; mass += o.probability; }
  assert.equal(selectWeaponOutcome(p, mass + sacred.probability / 2), sacred.id);
  assert.equal(resolve(p, sacred.id).label, sacred.label);
  assert.equal(JSON.stringify(p), saved);
  const invalid = structuredClone(p); invalid.version = 'weapon-odds/0.9.9';
  assert.throws(() => selectWeaponOutcome(invalid, 0), e => e.code === 'INVALID_FROZEN_WEAPON_PLAN');
});
