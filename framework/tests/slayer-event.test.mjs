import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../../content/slayer-events-design.json' with { type: 'json' };
import { getSlayerTargetSelector, planSlayerTarget, resolveSlayerVictimCount } from '../slayer-event.mjs';

let serial = 0;
const node = (familyId, rows = [], children = []) => {
  const sourceId = `victim:${++serial}`;
  return { familyId, sourceId, results: rows.map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `${sourceId}:${i}` })), children };
};
const child = (relation, n) => ({ relation, node: n });
const state = root => ({ invocationId: 'test-run:slayer-role', root });
const plan = n => planSlayerTarget(state(n));
const countResult = (p, index) => ({ invocationId: p.invocationId, spinId: `${p.invocationId}:actual-spin`, outcomeId: p.wheel.outcomes[index].id });
const goblin = () => node('goblinoid', [['goblin-orc-troll-type', 'goblin']]);
const god = () => node('heavenly-principle', [['heavenly-principle-type', 'god']]);
const dragon = form => node('mythical-beast', [['mythical-beast-origin', 'imported'], ['mythical-beast-imported-type', 'dragon'], ...(form ? [['dragon-form', form]] : [])]);

test('Cosmic target Ultraman stops before color; Elemental Slime selects identity Element without a power grant', () => {
  const ultra = plan(node('cosmic-warrior', [['cosmic-warrior-group', 'ultraman']]));
  assert.equal(ultra.phase, 'victim-count');
  assert.equal(ultra.wheel.profileId, 'legendary');
  assert.throws(() => plan(node('cosmic-warrior', [['cosmic-warrior-group', 'ultraman'], ['ultraman-color', 'red']])), { code: 'FORBIDDEN_TARGET_SELECTOR' });
  const slime = plan(node('slime', [['slime-type', 'elemental']]));
  assert.equal(slime.wheel.canonicalWheelId, 'element-universal');
  assert.ok(slime.wheel.outcomes.every(o => !Object.hasOwn(o, 'effects')));
  assert.equal(plan(node('slime', [['slime-type', 'elemental'], ['element-universal', 'water']])).wheel.profileId, 'formidable');
});

test('Cosmic victim references stop before Saint armor and Lantern ring rewards', () => {
  for (const [group, wheel, outcome] of [
    ['saint', 'saint-cosmic-armor', 'gold-aries'],
    ['green-lantern', 'lantern-ring-color', 'white'],
  ]) {
    const p = plan(node('cosmic-warrior', [['cosmic-warrior-group', group]]));
    assert.equal(p.phase, 'victim-count');
    assert.throws(() => plan(node('cosmic-warrior', [['cosmic-warrior-group', group], [wheel, outcome]])), { code: 'FORBIDDEN_TARGET_SELECTOR' });
  }
});

for (const [family, wheel, outcome, profile] of [
  ['slime', 'slime-type', 'ordinary', 'swarm'],
  ['centaur', 'centaur-lower-body', 'chicken', 'common'],
  ['cosmic-warrior', 'cosmic-warrior-group', 'alien-x', 'divine'],
]) {
  test(`${family} target resolves identity and count without executing its race rewards`, () => {
    const selector = getSlayerTargetSelector('race-family');
    assert.ok(selector.outcomes.some(o => o.id === family));
    const p = plan(node(family));
    assert.equal(p.decision, 'spin');
    assert.equal(p.wheel.canonicalWheelId, wheel);
    assert.ok(p.wheel.outcomes.every(o => !Object.hasOwn(o, 'effects') && !Object.hasOwn(o, 'powerDefinitionRef')));
    const completed = plan(node(family, [[wheel, outcome]]));
    assert.equal(completed.phase, 'victim-count');
    assert.equal(completed.wheel.profileId, profile);
    assert.equal(p.effects, undefined);
    assert.ok(!getSlayerTargetSelector('race-family', { usedVictimFamilyIds: [family] }).outcomes.some(o => o.id === family));
  });
}

test('All thirty-five identity projections expose only labels/weights, never canonical rewards', () => {
  assert.equal(design.selectorCatalog.length, 35);
  for (const ref of design.selectorCatalog) {
    const wheel = getSlayerTargetSelector(ref.id);
    assert.equal(wheel.dispatchEvents, false);
    for (const o of wheel.outcomes) {
      assert.deepEqual(Object.keys(o).sort(), ['baseWeight', 'id', 'label', 'probability']);
      assert.equal(typeof o.id,'string'); assert.ok(o.id);
    }
    assert.ok(Math.abs(wheel.outcomes.reduce((s, o) => s + o.probability, 0) - 1) < 1e-12);
  }
});

test('Every count profile has ten natural ordered values, valid weighted odds and +0/+1/+2/+3 bands', () => {
  assert.equal(design.quantityProfiles.length, 8);
  for (const p of design.quantityProfiles) {
    assert.equal(p.outcomes.length, 10);
    assert.equal(p.outcomes[0].value, 0);
    assert.deepEqual(p.outcomes.map(o => o.strengthBonus), [0,1,1,1,2,2,2,3,3,3]);
    assert.equal(p.outcomes.reduce((s, o) => s + o.baseWeight, 0), 10000);
    p.outcomes.forEach((o, i) => {
      assert.ok(Number.isInteger(o.value)); assert.ok(o.baseWeight >= 500);
      assert.ok(o.probability >= .05);
      assert.ok(Math.abs(o.probability - o.baseWeight / 10000) < 1e-12);
      if (i) assert.ok(o.value > p.outcomes[i - 1].value);
    });
  }
});

test('All current subtype assignments point to real canonical identities and existing profiles', () => {
  let count = 0;
  for (const [key, map] of Object.entries(design.quantityAssignments)) {
    const [family, wheelId] = key.split(':');
    assert.ok(design.identityRoutes[family].selectors.some(s => s.wheelId === wheelId));
    const ids = getSlayerTargetSelector(wheelId).outcomes.map(o => o.id).sort();
    assert.deepEqual(Object.keys(map).sort(), ids);
    for (const profileId of Object.values(map)) assert.ok(design.quantityProfiles.some(p => p.id === profileId));
    count += ids.length;
  }
  assert.equal(count, 338);
});

test('Victim history starts independently of the character race history', () => {
  const s = state(null); s.usedRaceFamilyIds = Object.keys(design.identityRoutes);
  const p = planSlayerTarget(s);
  assert.equal(p.phase, 'target'); assert.equal(p.wheel.outcomes.length, 22);
  const excluded = getSlayerTargetSelector('race-family', { usedVictimFamilyIds: ['hybrid', 'symbiote'] });
  assert.equal(excluded.outcomes.length, 20);
  assert.ok(!excluded.outcomes.some(o => ['hybrid', 'symbiote'].includes(o.id)));
  assert.throws(() => getSlayerTargetSelector('race-family', { usedVictimFamilyIds: Object.keys(design.identityRoutes) }), { code: 'EMPTY_TARGET_POOL' });
});

test('Fixed selector ratios are preserved; count estimates do not overwrite canonical wheels', () => {
  assert.deepEqual(getSlayerTargetSelector('sea-elf-form').outcomes.map(o => o.probability), [.6, .4]);
  assert.deepEqual(getSlayerTargetSelector('orc-role').outcomes.map(o => o.baseWeight), [1,2,3,3,1]);
  assert.deepEqual(getSlayerTargetSelector('fairy-subrace').outcomes.map(o => o.baseWeight), [4,2,3,1]);
  assert.deepEqual(getSlayerTargetSelector('heavenly-principle-type').outcomes.map(o => o.baseWeight), [1,1,2,2,3,3]);
  assert.deepEqual(getSlayerTargetSelector('legend-origin').outcomes.map(o => o.probability), [.65, .35]);
});

test('Dwarf/Gnome stops at identity, before equipment', () => {
  assert.equal(plan(node('dwarf')).wheel.canonicalWheelId, 'dwarf-gnome-type');
  for (const subtype of ['dwarf', 'gnome']) assert.equal(plan(node('dwarf', [['dwarf-gnome-type', subtype]])).phase, 'victim-count');
  assert.throws(() => plan(node('dwarf', [['dwarf-gnome-type', 'dwarf'], ['dwarf-armor-count', 'armor-count-5']])), { code: 'FORBIDDEN_TARGET_SELECTOR' });
});

test('Dragon resolves its actual body form and never spins its Element power', () => {
  assert.equal(plan(dragon()).wheel.canonicalWheelId, 'dragon-form');
  assert.equal(plan(dragon('wyvern')).wheel.profileId, 'formidable');
  assert.equal(plan(dragon('western')).wheel.profileId, 'apex');
  assert.equal(plan(dragon('eastern')).wheel.profileId, 'legendary');
  assert.throws(() => plan(node('mythical-beast', [['mythical-beast-origin', 'imported'], ['mythical-beast-imported-type', 'dragon'], ['dragon-form', 'western'], ['element-universal', 'fire']])), { code: 'FORBIDDEN_TARGET_SELECTOR' });
});

test('Goblin uses 0..10000 while God uses 0..9 with much higher zero odds', () => {
  const g = plan(goblin()), d = plan(god());
  assert.deepEqual(g.wheel.outcomes.map(o => o.value), [0,1,5,10,50,100,500,1000,5000,10000]);
  assert.deepEqual(d.wheel.outcomes.map(o => o.value), [0,1,2,3,4,5,6,7,8,9]);
  assert.equal(g.wheel.outcomes[0].probability, .08);
  assert.equal(d.wheel.outcomes[0].probability, .48);
  assert.equal(g.wheel.outcomes.at(-1).probability, .05);
  assert.equal(d.wheel.outcomes.at(-1).probability, .05);
});

test('No power, army, followers, Takeover, Size or loot selector can execute in the victim reference', () => {
  for (const id of ['power-holy','power-cursed','power-android','cyborg-weapon','god-concept','follower-count','goblinoid-army-count','symbiote-takeover','size-raksasa','isekai-cheat-skill','vampire-victim-count'])
    assert.throws(() => getSlayerTargetSelector(id), { code: 'FORBIDDEN_TARGET_SELECTOR' });
  assert.equal(plan(god()).phase, 'victim-count');
  assert.equal(plan(node('lelembut', [['lelembut-origin', 'imported'], ['lelembut-imported-type', 'vampire']])).phase, 'victim-count');
});

test('Material Element is an identity projection with no linked power grant', () => {
  const p = plan(node('golem', [['golem-type', 'element-golem']]));
  assert.equal(p.wheel.canonicalWheelId, 'element-universal');
  assert.equal(p.wheel.dispatchEvents, false);
  const complete = plan(node('golem', [['golem-type', 'element-golem'], ['element-universal', 'water']]));
  assert.equal(complete.phase, 'victim-count');
  assert.equal(plan(node('elemental', [['element-universal', 'fire']])).phase, 'victim-count');
});

test('Anime NPC ignores genre strength; MC does not acquire Cheat, GF, Tech or mecha', () => {
  const npc = node('anime-lineage', [['anime-genre', 'isekai'], ['anime-role', 'npc']]);
  assert.equal(plan(npc).wheel.profileId, 'common');
  const mc = node('anime-lineage', [['anime-genre', 'isekai'], ['anime-role', 'mc']]);
  assert.equal(plan(mc).wheel.profileId, 'apex');
  const pilot = node('anime-lineage', [['anime-genre', 'sci-fi'], ['anime-role', 'mc'], ['anime-scifi-role', 'pilot']]);
  assert.equal(plan(pilot).phase, 'victim-count');
  assert.equal(plan(pilot).wheel.profileId, 'trained');
});

test('Machine follows body model/item but skips Android power and Cyborg weapon', () => {
  assert.equal(plan(node('machine', [['machine-type', 'android']])).phase, 'victim-count');
  assert.equal(plan(node('machine', [['machine-type', 'cyborg']])).phase, 'victim-count');
  assert.equal(plan(node('machine', [['machine-type', 'mecha']])).wheel.canonicalWheelId, 'machine-mecha-model');
  const appliance = node('machine', [['machine-type', 'household-appliance'], ['machine-appliance-item', 'blender']]);
  assert.equal(plan(appliance).wheel.profileId, 'swarm');
});

test('Origin and nested wrappers describe one victim, with separate no-repeat history', () => {
  const skeleton = node('lelembut', [['lelembut-origin', 'imported'], ['lelembut-imported-type', 'skeleton']], [child('origin', dragon('western'))]);
  assert.equal(plan(skeleton).wheel.profileId, 'apex');
  const nested = node('hybrid', [], [child('hybrid-component', node('symbiote', [], [child('host', node('raksasa', [], [child('base', god())]))]))]);
  const p = plan(nested);
  assert.equal(p.phase, 'target'); assert.equal(p.relation, 'hybrid-component'); assert.equal(p.childOrdinal, 1);
  assert.equal(p.wheel.outcomes.length, 18);
  for (const used of ['hybrid','symbiote','raksasa','heavenly-principle']) assert.ok(!p.wheel.outcomes.some(o => o.id === used));
  nested.children.push(child('hybrid-component', node('human')));
  const complete = plan(nested);
  assert.equal(complete.wheel.profileId, 'divine'); assert.equal(complete.usedVictimFamilyIds.length, 5);
  assert.equal(resolveSlayerVictimCount(complete, countResult(complete, 9)).victimCount, 9);
});

test('Invalid repeats, unrelated selectors and out-of-order components fail explicitly', () => {
  const repeat = node('hybrid', [], [child('hybrid-component', node('human')), child('hybrid-component', node('human'))]);
  assert.throws(() => plan(repeat), { code: 'VICTIM_FAMILY_REPEATED' });
  assert.throws(() => plan(node('elf', [['elf-type', 'forest-elf'], ['sea-elf-form', 'putri-duyung']])), { code: 'INAPPLICABLE_TARGET_SELECTOR' });
  assert.throws(() => plan(node('human', [], [child('host', node('dwarf'))])), { code: 'INVALID_TARGET_CHILDREN' });
  const early = node('hybrid', [], [child('hybrid-component', dragon()), child('hybrid-component', node('human'))]);
  assert.throws(() => plan(early), { code: 'TARGET_ORDER_CONFLICT' });
});

test('Siluman target selects one of twelve animals without grants or sampling configuration', () => {
  const pending = plan(node('beastfolk'));
  assert.equal(pending.decision, 'spin');
  assert.equal(pending.requiredDrawCount, 1);
  assert.equal(pending.wheel.outcomes.length, 12);
  for (const [animal, expected] of [['ayam', 'common'], ['kelelawar', 'trained'], ['elang', 'trained']]) {
    const p = plan(node('beastfolk', [['siluman-animal-type', animal]]));
    assert.equal(p.phase, 'victim-count');
    assert.equal(p.wheel.profileId, expected);
  }
  const oldTwelveResults = Array.from({ length: 12 }, () => ['siluman-animal-type', 'ayam']);
  assert.throws(() => plan(node('beastfolk', oldTwelveResults)), { code: 'TOO_MANY_TARGET_RESULTS' });
});

test('Zero grants nothing; all positive slot boundaries grant only capped numeric Strength', () => {
  for (const target of [goblin(), god()]) {
    const p = plan(target);
    for (const [index, bonus] of [[0,0],[1,1],[3,1],[4,2],[6,2],[7,3],[9,3]]) {
      const reward = resolveSlayerVictimCount(p, countResult(p, index));
      assert.equal(reward.strengthBonus, bonus); assert.equal(reward.nextStage, 'backstory');
      assert.equal(reward.effects.length, bonus ? 1 : 0);
      if (bonus) assert.deepEqual([reward.effects[0].stat, reward.effects[0].amount, reward.effects[0].type], ['strength',bonus,'stat-flat-modifier']);
    }
  }
});

test('Planning/reward is pure and stable on replay, with a source key for engine deduplication', () => {
  const s = state(goblin()); s.actorPowers = ['owned']; s.actorStats = { strength: null };
  const before = structuredClone(s), p = planSlayerTarget(s), r = countResult(p, 7);
  assert.deepEqual(planSlayerTarget(s), p);
  const bonus = resolveSlayerVictimCount(p,r);
  assert.deepEqual(resolveSlayerVictimCount(p,r), bonus); assert.deepEqual(s,before);
  assert.equal(bonus.ledgerKey, `${r.spinId}:slayer-strength`);
  const oldBonus = design.quantityProfiles[0].outcomes[7].strengthBonus;
  try {
    design.quantityProfiles[0].outcomes[7].strengthBonus = 1;
    assert.equal(resolveSlayerVictimCount(p,r).strengthBonus,3);
  } finally { design.quantityProfiles[0].outcomes[7].strengthBonus = oldBonus; }
});

test('Unknown count outcomes, wrong source and corrupt frozen odds cannot grant Strength', () => {
  const p = plan(goblin());
  assert.throws(() => resolveSlayerVictimCount(p,{ ...countResult(p,1),outcomeId:'god-victims-999' }), { code: 'UNKNOWN_COUNT_OUTCOME' });
  assert.throws(() => resolveSlayerVictimCount(p,{ ...countResult(p,1),invocationId:'other-source' }), { code: 'COUNT_SOURCE_MISMATCH' });
  const bad = structuredClone(p); bad.wheel.outcomes[1].probability = .9;
  assert.throws(() => resolveSlayerVictimCount(bad,countResult(bad,1)), { code: 'INVALID_COUNT_PLAN' });
  const noId = structuredClone(p); noId.wheel.outcomes[1].id = undefined;
  assert.throws(() => resolveSlayerVictimCount(noId,countResult(noId,1)), { code: 'INVALID_COUNT_PLAN' });
});

test('New snapshots reject normalized odds below 5%; old committed snapshots preserve their results', () => {
  const p = plan(god());
  const old = structuredClone(p);
  old.ruleVersion = 'slayer/1.0.0';
  delete old.wheel.minimumOutcomeProbability;
  old.wheel.outcomes = structuredClone(design.retiredProbabilityProfiles.profiles.find(p => p.id === 'divine').outcomes);
  assert.equal(resolveSlayerVictimCount(old,countResult(old,9)).strengthBonus, 3);
  assert.equal(old.wheel.outcomes[9].probability, .0005);
  const bad = structuredClone(old); bad.ruleVersion = 'slayer/1.1.0';
  assert.throws(() => resolveSlayerVictimCount(bad,countResult(bad,9)), { code:'INVALID_COUNT_PLAN' });
  const profile = design.quantityProfiles.find(p => p.id === 'divine');
  const saved = structuredClone(profile.outcomes);
  try {
    profile.outcomes = structuredClone(old.wheel.outcomes);
    assert.throws(() => plan(god()), { code:'INVALID_COUNT_PLAN' });
  } finally { profile.outcomes = saved; }
});
