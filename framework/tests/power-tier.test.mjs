import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePowerTier, POWER_TIER_POLICY_VERSION } from '../power-tier.mjs';

test('maximum mastery cannot promote a household function', () => {
  const ref = { definitionId: 'appliance-blender', definitionFile: 'content/machine-events-design.json' };
  const low = resolvePowerTier({ ...ref, masteryRank: 'novice' });
  const high = resolvePowerTier({ ...ref, masteryRank: 'maximum', sizeMeters: 10000 });
  assert.equal(high.powerTier, 1);
  assert.deepEqual(high, low);
  assert.equal(Object.hasOwn(high, 'effects'), false);
});

test('Cosmic Armor keeps its selected class tier regardless of mastery or constellation', () => {
  const definitionFile = 'content/video2-race-imports-design.json';
  for (const [clothClass, tier] of [['bronze', 2], ['silver', 3], ['gold', 4]]) {
    const ref = { definitionFile, definitionId: `cosmic-armor-${clothClass}` };
    assert.equal(resolvePowerTier(ref).powerTier, tier);
    assert.equal(resolvePowerTier({ ...ref, masteryRank: 'maximum', constellation: 'Pegasus' }).powerTier, tier);
  }
});

test('touch-bound gold transmutation differs from general molecular manipulation', () => {
  const definitionFile = 'content/alchemist-events-design.json';
  assert.equal(resolvePowerTier({ definitionFile, definitionId: 'gold-touch' }).powerTier, 4);
  assert.equal(resolvePowerTier({ definitionFile, definitionId: 'molecular-manipulation' }).powerTier, 5);
});

test('only the explicitly declared Concept scope selects an Authority rating', () => {
  const ref = { definitionFile: 'content/universal-concept-wheel-design.json', definitionId: 'concept-sea' };
  assert.equal(resolvePowerTier({ ...ref, masteryRank: 'maximum' }).powerTier, 3);
  assert.equal(resolvePowerTier({ ...ref, grantMode: 'authority' }).powerTier, 4);
  assert.equal(resolvePowerTier({ definitionFile: 'content/lelembut-events-design.json', definitionId: 'flight', grantMode: 'authority' }).status, 'needs_configuration');
});

test('wrong owner or a caption alias cannot silently reuse another definition', () => {
  assert.equal(resolvePowerTier({ definitionFile: 'content/elf-events-design.json', definitionId: 'flight' }).status, 'needs_configuration');
  assert.equal(resolvePowerTier({ definitionFile: 'content/lelembut-events-design.json', definitionId: 'Fly' }).status, 'needs_configuration');
});

test('missing or unknown power does not fall back to a guessed tier', () => {
  assert.equal(resolvePowerTier(null).status, 'needs_configuration');
  assert.equal(resolvePowerTier({ label: 'Creation' }).status, 'needs_configuration');
  assert.equal(resolvePowerTier({ definitionId: 'unregistered', definitionFile: 'content/alchemist-events-design.json' }).status, 'needs_configuration');
});

test('an older saved policy is not silently upgraded through the current registry', () => {
  const ref = { definitionFile: 'content/lelembut-events-design.json', definitionId: 'flight' };
  assert.equal(resolvePowerTier({ ...ref, tierPolicyVersion: 'power-tier/0.0.0' }).status, 'needs_configuration');
  assert.equal(resolvePowerTier({ ...ref, tierPolicyVersion: POWER_TIER_POLICY_VERSION }).status, 'ok');
});
