import test from 'node:test';
import assert from 'node:assert/strict';
import policy from '../../content/archetype-eligibility-design.json' with { type: 'json' };
import { evaluateArchetypeNeed, planArchetypeStage, commitArchetypePlan } from '../archetype-eligibility.mjs';

// These approved fixtures exercise the API; they do not approve project role events.
let serial = 0;
function node(familyId, results = [], children = []) {
  const sourceId = `race:${++serial}`;
  return { sourceId, familyId, completed: true, results: results.map(([wheelId, outcomeId], i) => ({ spinId: `${sourceId}:${i}`, wheelId, outcomeId })), children };
}
const link = (relation, n) => ({ relation, node: n });
const ids = n => [n.sourceId, ...n.children.flatMap(c => ids(c.node))];
const state = root => ({ raceTree: { completed: true, pendingInvocations: [], roots: [root] }, bodyProfileId: 'test-body' });
const role = (id, all = ['hands'], extra = {}) => ({ id, approved: true, eventProfile: { id: `test-only:${id}`, approved: true },
  requirements: { all, any: [], forbidden: [] }, compatibleSpecializations: ['orc-warrior', 'shaman', 'healer-fairy', 'siluman', 'technician', 'orang-saleh', 'pemuka-agama'], boostBand: 'light', ...extra });
function options(root, capabilities = ['hands', 'biological'], archetypes = [role('alchemist')]) {
  return { oddsPolicy: 'profile-weights', profiles: { bodies: { 'test-body': { approved: true, sourceIds: ids(root), capabilities, allowedBoostBands: ['none', 'light', 'strong'] } } }, archetypes };
}
const need = n => evaluateArchetypeNeed(state(n));
const elf = (type, wheel, result) => node('elf', [['elf-type', type], ...(wheel ? [[wheel, result]] : [])]);
const goblin = (count, position) => node('goblinoid', [['goblin-orc-troll-type', 'goblin'], ['goblinoid-army-count', `army-${count}`], ['goblin-position', position]]);
const machine = (type, wheel, result) => node('machine', [['machine-type', type], ...(wheel ? [[wheel, result]] : [])]);
const anime = (genre, result = 'mc', extras = []) => node('anime-lineage', [['anime-genre', genre], ['anime-role', result], ...extras]);

test('Centaur spins only after its lower body and compatible profile are configured', () => {
  assert.throws(() => need(node('centaur')), { code: 'RACE_RESULT_MISSING' });
  const n = node('centaur', [['centaur-lower-body', 'chicken']]);
  assert.equal(need(n).decision, 'candidate');
  const missingBody = planArchetypeStage(state(n));
  assert.equal(missingBody.decision, 'needs_configuration');
  assert.throws(() => commitArchetypePlan(state(n), missingBody), { code: 'PLAN_NOT_COMMITTABLE' });
  assert.equal(planArchetypeStage(state(n), options(n)).decision, 'spin');
});

test('Cosmic skips only after the selected group finishes its own reward wheel', () => {
  for (const [group, child] of [
    ['alien-x', []], ['saiyan', []], ['silver-surfer', []],
    ['ultraman', [['ultraman-color', 'red']]],
    ['saint', [['saint-cosmic-armor', 'bronze-pegasus']]],
    ['green-lantern', [['lantern-ring-color', 'white']]],
  ]) {
    const n = node('cosmic-warrior', [['cosmic-warrior-group', group], ...child]);
    const p = planArchetypeStage(state(n));
    assert.equal(p.decision, 'skip');
    assert.equal(p.spinCount, 0);
    if (child.length) {
      assert.throws(() => need(node('cosmic-warrior', [['cosmic-warrior-group', group]])), { code: 'RACE_RESULT_MISSING' });
      assert.throws(() => need(node('cosmic-warrior', [['cosmic-warrior-group', group], ...child, ...child])), { code: 'RACE_RESULT_MISSING' });
    }
  }
  assert.throws(() => need(node('cosmic-warrior', [['cosmic-warrior-group', 'saiyan'], ['lantern-ring-color', 'white']])), { code: 'COSMIC_EVENT_CONFLICT' });
  for (const retired of ['kryptonian', 'asgardian'])
    assert.throws(() => need(node('cosmic-warrior', [['cosmic-warrior-group', retired]])), { code: 'UNKNOWN_RACE_RESULT' });
});

test('Ordinary Slime needs a compatible body pool, specialized Slime skips after its actual event', () => {
  const ordinary = node('slime', [['slime-type', 'ordinary']]);
  assert.equal(need(ordinary).decision, 'candidate');
  assert.equal(planArchetypeStage(state(ordinary)).decision, 'needs_configuration');
  assert.equal(planArchetypeStage(state(ordinary), options(ordinary)).decision, 'spin');
  for (const type of ['acid', 'poison', 'healing', 'metal', 'elemental']) {
    const rows = [['slime-type', type], ...(type === 'elemental' ? [['element-universal', 'fire']] : [])];
    assert.equal(planArchetypeStage(state(node('slime', rows))).decision, 'skip');
  }
  assert.throws(() => need(node('slime', [['slime-type', 'elemental']])), { code: 'RACE_RESULT_MISSING' });
  assert.throws(() => need(node('slime', [['slime-type', 'ordinary'], ['element-universal', 'fire']])), { code: 'SLIME_ELEMENT_CONFLICT' });
});

test('Human gets one spin only after a body/profile-compatible pool is configured', () => {
  const n = node('human'), s = state(n);
  assert.equal(need(n).decision, 'candidate');
  assert.equal(planArchetypeStage(s).decision, 'needs_configuration');
  const p = planArchetypeStage(s, options(n));
  assert.equal(p.decision, 'spin'); assert.equal(p.spinCount, 1); assert.equal(p.nextStage, 'archetype');
});

test('Complete outer tree and no pending invocation are mandatory', () => {
  const s = state(node('human')); s.raceTree.pendingInvocations.push('root-two');
  assert.throws(() => planArchetypeStage(s), { code: 'RACE_NOT_COMPLETE' });
  s.raceTree.pendingInvocations = []; s.raceTree.roots[0].completed = false;
  assert.throws(() => planArchetypeStage(s), { code: 'RACE_NOT_COMPLETE' });
});

for (const family of ['mythical-beast', 'golem', 'elemental', 'legendary-warrior']) {
  test(`${family} skips without needing a body or Archetype pool`, () => {
    const p = planArchetypeStage(state(node(family)));
    assert.equal(p.decision, 'skip'); assert.equal(p.spinCount, 0); assert.equal(p.nextStage, 'backstory');
    assert.deepEqual(p.eligibleOutcomes, []);
  });
}

test('Raksasa and nested Raksasa suppress both former slots without looking at future Size', () => {
  const giant = node('raksasa', [], [link('base', node('human'))]);
  const host = node('symbiote', [['symbiote-takeover', 'takeover-0']], [link('host', giant)]);
  for (const root of [giant, host]) {
    const s = state(root); s.size = { meters: 10 }; s.pendingArchetypeTickets = ['old-raksasa-ticket'];
    const before = structuredClone(s), p = planArchetypeStage(s);
    assert.equal(p.decision, 'skip'); assert.equal(p.spinCount, 0); assert.deepEqual(s, before);
    s.size.meters = 1400000000;
    assert.deepEqual(planArchetypeStage(s), p);
  }
});

test('Elf potency is based on selected power IDs, not later mastery or name alone', () => {
  assert.equal(need(elf('high-elf', 'power-holy', 'holy-shield')).decision, 'candidate');
  assert.equal(need(elf('high-elf', 'power-holy', 'holy-arrow')).decision, 'skip');
  assert.equal(need(elf('dark-elf', 'power-cursed', 'hellfire')).decision, 'candidate');
  assert.equal(need(elf('dark-elf', 'power-cursed', 'life-drain')).decision, 'skip');
  assert.equal(need(elf('blood-elf', 'power-blood', 'blood-whip')).decision, 'candidate');
  assert.equal(need(elf('blood-elf', 'power-blood', 'blood-shield')).decision, 'skip');
  assert.equal(need(elf('fey-elf', 'fey-elf-season', 'spring')).decision, 'skip');
  assert.equal(need(elf('forest-elf')).decision, 'skip');
  assert.equal(need(elf('astral-elf')).decision, 'candidate');
});

test('Dwarf evaluates a completed unique armor award at the 2/3 boundary', () => {
  const armorIds = ['helmet', 'gloves', 'body-armor', 'leggings', 'boots'];
  const dwarf = count => node('dwarf', [['dwarf-gnome-type', 'dwarf'], ['dwarf-armor-count', `armor-count-${count}`], ...armorIds.slice(0, count).map(id => ['dwarf-armor-piece', id])]);
  assert.equal(need(dwarf(2)).decision, 'candidate'); assert.equal(need(dwarf(3)).decision, 'skip');
  const bad = dwarf(2); bad.results[3].outcomeId = bad.results[2].outcomeId;
  assert.throws(() => need(bad), { code: 'ARMOR_INCOMPLETE' });
});

test('Kacung never inherits the rolled army upper hand', () => {
  assert.equal(need(goblin(10000, 'kacung')).decision, 'candidate');
  assert.equal(need(goblin(20, 'bos')).decision, 'candidate');
  assert.equal(need(goblin(100, 'bos')).decision, 'skip');
});

test('Orc roles distinguish Shrek growth and an unrolled Shaman ticket', () => {
  const orc = r => node('goblinoid', [['goblin-orc-troll-type', 'orc'], ['orc-role', r]]);
  assert.equal(need(orc('shrek')).decision, 'skip'); assert.equal(need(orc('oni')).decision, 'skip');
  assert.equal(need(orc('shaman')).decision, 'candidate');
  assert.deepEqual(need(orc('orc-warrior')).specializations, ['orc-warrior']);
});

test('Vampire references no prey events and changes eligibility at 100 victims', () => {
  const vampire = count => node('lelembut', [['lelembut-origin', 'imported'], ['lelembut-imported-type', 'vampire'], ['vampire-victim-count', `victims-${count}`], ['vampire-prey-race', 'mythical-beast']]);
  assert.equal(need(vampire(10)).decision, 'candidate'); assert.equal(need(vampire(100)).decision, 'skip');
  const bad = vampire(0); bad.children.push(link('prey', node('mythical-beast')));
  assert.throws(() => need(bad), { code: 'INVALID_ATTACHMENT' });
});

test('Skeleton/Zombie use the actual origin chain', () => {
  const undead = (type, origin) => node('lelembut', [['lelembut-origin', 'imported'], ['lelembut-imported-type', type]], [link('origin', origin)]);
  assert.equal(need(undead('skeleton', node('human'))).decision, 'candidate');
  assert.equal(need(undead('zombie', node('mythical-beast'))).decision, 'skip');
});

test('Symbiote uses takeover 40/50 and cannot requalify a strong host', () => {
  const sym = (percent, host) => node('symbiote', [['symbiote-takeover', `takeover-${percent}`]], [link('host', host)]);
  assert.equal(need(sym(40, node('human'))).decision, 'candidate');
  assert.equal(need(sym(50, node('human'))).decision, 'skip');
  assert.equal(need(sym(0, node('mythical-beast'))).decision, 'skip');
  assert.equal(need(sym(40, elf('astral-elf'))).decision, 'needs_configuration');
});

test('Hybrid evaluates both descendants once; repeated family is invalid', () => {
  const hybrid = (a, b) => node('hybrid', [], [link('hybrid-component', a), link('hybrid-component', b)]);
  assert.equal(need(hybrid(node('human'), goblin(10000, 'kacung'))).decision, 'candidate');
  assert.equal(need(hybrid(node('human'), node('mythical-beast'))).decision, 'skip');
  assert.equal(need(hybrid(elf('astral-elf'), goblin(5, 'bos'))).decision, 'needs_configuration');
  assert.throws(() => need(hybrid(node('human'), node('human'))), { code: 'RACE_FAMILY_REPEATED' });
});

test('A body-only skip can use an approved actual composite profile; scope cannot be borrowed', () => {
  const root = node('hybrid', [], [link('hybrid-component', node('human')), link('hybrid-component', machine('household-appliance'))]);
  root.compositionProfileId = 'composite-fixture';
  const opts = options(root);
  assert.equal(planArchetypeStage(state(root), opts).decision, 'needs_configuration');
  opts.profiles.compositions = { 'composite-fixture': { approved: true, sourceIds: ids(root), upperHand: 'light' } };
  assert.equal(planArchetypeStage(state(root), opts).decision, 'spin');
  opts.profiles.compositions['composite-fixture'].sourceIds = ['unrelated'];
  assert.throws(() => planArchetypeStage(state(root), opts), { code: 'COMPOSITION_SCOPE_MISMATCH' });
});

test('Divine ordering does not mistake its first four sectors for weakest', () => {
  const priest = power => node('heavenly-principle', [['heavenly-principle-type', 'pemuka-agama'], ['power-divine', power]]);
  assert.equal(need(priest('holy-spark')).decision, 'candidate');
  assert.equal(need(priest('divine-reality-rewrite')).decision, 'skip');
  assert.equal(need(node('heavenly-principle', [['heavenly-principle-type', 'god']])).decision, 'skip');
  assert.equal(need(node('heavenly-principle', [['heavenly-principle-type', 'orang-saleh']])).decision, 'candidate');
});

test('Abyssal light Setan/Sin never requalifies multi-power Iblis', () => {
  const demon = (type, extra = []) => node('demon', [['abyssal-axiom-type', type], ...extra]);
  assert.equal(need(demon('setan', [['setan-type', 'imp']])).decision, 'candidate');
  assert.equal(need(demon('setan', [['setan-type', 'asura']])).decision, 'skip');
  assert.equal(need(demon('sinner', [['seven-deadly-sin', 'lust']])).decision, 'candidate');
  assert.equal(need(demon('sinner', [['seven-deadly-sin', 'envy']])).decision, 'skip');
  assert.equal(need(demon('ordinary-demon', [['seven-deadly-sin', 'lust']])).decision, 'skip');
});

for (const genre of ['isekai', 'fantasy', 'romance', 'sci-fi', 'action', 'sport', 'slice-of-life']) {
  test(`Anime ${genre} NPC remains eligible without an MC event`, () => assert.equal(need(anime(genre, 'npc')).decision, 'candidate'));
}
test('NPC cannot include a silently executed Cheat event', () => {
  assert.throws(() => need(anime('isekai', 'npc', [['isekai-cheat-skill', 'isekai-cheat-instant-death']])), { code: 'NPC_EVENT_CONFLICT' });
});
test('MC uses the actual Cheat/ending/Tech rather than genre names', () => {
  assert.equal(need(anime('isekai', 'mc', [['isekai-cheat-skill', 'isekai-cheat-vending']])).decision, 'candidate');
  assert.equal(need(anime('isekai', 'mc', [['isekai-cheat-skill', 'isekai-cheat-instant-death']])).decision, 'skip');
  assert.equal(need(anime('romance', 'mc', [['anime-romance-ending', 'harem'], ['anime-harem-count', 'girlfriend-count-1']])).decision, 'candidate');
  assert.equal(need(anime('romance', 'mc', [['anime-romance-ending', 'harem'], ['anime-harem-count', 'girlfriend-count-2']])).decision, 'skip');
  assert.equal(need(anime('sci-fi', 'mc', [['anime-scifi-role', 'technician'], ['tech-weapon', 'scifi-tech-banana-launcher']])).decision, 'candidate');
  assert.equal(need(anime('sci-fi', 'mc', [['anime-scifi-role', 'technician'], ['tech-weapon', 'scifi-tech-railgun']])).decision, 'skip');
  assert.equal(need(anime('sci-fi', 'mc', [['anime-scifi-role', 'pilot']])).decision, 'skip');
});
test('Anime Cyborg must evaluate both sequential Tech results', () => {
  const cyborg = (a, b) => anime('sci-fi', 'mc', [['anime-scifi-role', 'cyborg'], ['tech-weapon', a], ['tech-weapon', b]]);
  assert.equal(need(cyborg('scifi-tech-banana-launcher', 'scifi-tech-railgun')).decision, 'skip');
  assert.equal(need(cyborg('scifi-tech-banana-launcher', 'scifi-tech-banana-launcher')).decision, 'needs_configuration');
});
test('Machine distinguishes zonk from combat while Household is still skipped', () => {
  assert.equal(need(machine('android', 'power-android', 'android-receipt-printing')).decision, 'candidate');
  assert.equal(need(machine('android', 'power-android', 'android-power-negation')).decision, 'skip');
  assert.equal(need(machine('cyborg', 'cyborg-weapon', 'cyborg-thumb-usb')).decision, 'candidate');
  assert.equal(need(machine('cyborg', 'cyborg-weapon', 'cyborg-arm-cannon')).decision, 'skip');
  for (const type of ['mecha', 'transformer', 'nanobot', 'ai', 'household-appliance']) assert.equal(need(machine(type)).decision, 'skip');
});

test('Filter before sampling, renormalize eligible odds, and require explicit role events', () => {
  const n = node('human'), opts = options(n, ['hands'], [role('alchemist'), role('vessel', ['hands', 'biological']), role('survivalist', [], { baseWeight: 3 })]);
  const p = planArchetypeStage(state(n), opts);
  assert.deepEqual(p.eligibleOutcomes.map(o => [o.id, o.probability]), [['alchemist', .25], ['survivalist', .75]]);
  opts.archetypes[0].eventProfile = null;
  assert.equal(planArchetypeStage(state(n), opts).decision, 'needs_configuration');
});
test('Valid configured body with no compatible role skips; invalid/missing metadata does not', () => {
  const n = node('human'), opts = options(n, [], [role('alchemist')]);
  assert.equal(planArchetypeStage(state(n), opts).decision, 'skip');
  delete opts.profiles.bodies['test-body'];
  assert.equal(planArchetypeStage(state(n), opts).decision, 'needs_configuration');
});
test('Duplicate IDs and non-positive approved weights cannot silently change odds', () => {
  const n = node('human');
  assert.throws(() => planArchetypeStage(state(n), options(n, ['hands'], [role('npc'), role('npc')])), { code: 'DUPLICATE_ARCHETYPE' });
  assert.throws(() => planArchetypeStage(state(n), options(n, ['hands'], [role('npc', [], { baseWeight: 0 })])), { code: 'INVALID_ARCHETYPE_WEIGHT' });
});
test('Frozen journal preserves the exact plan across resume, new configuration and future outcomes', () => {
  const n = node('human'), s = state(n); s.powers = ['race-owned']; s.stats = { strength: 4 };
  const before = structuredClone(s), p = planArchetypeStage(s, options(n));
  assert.deepEqual(s, before);
  const committed = commitArchetypePlan(s, p);
  committed.futurePower = 'None'; committed.size = 100000; committed.stats.strength = 900;
  const resumed = planArchetypeStage(committed, { archetypes: [role('different')] });
  assert.deepEqual({ ...resumed, replayed: false }, p);
  assert.deepEqual(committed.powers, ['race-owned']);
  assert.strictEqual(commitArchetypePlan(committed, resumed), committed);
  committed.raceTree.roots[0].results.push({ spinId: 'invalid-change', wheelId: 'power-holy', outcomeId: 'holy-spark' });
  assert.throws(() => planArchetypeStage(committed), { code: 'RACE_SNAPSHOT_CHANGED' });
});
test('Unresolved plans cannot be committed as fake skip outcomes', () => {
  const s = state(node('human'));
  assert.throws(() => commitArchetypePlan(s, planArchetypeStage(s)), { code: 'PLAN_NOT_COMMITTABLE' });
});

test('Compiled policy agrees with every accepted contextual audit row', () => {
  assert.equal(policy.runtimeRules.familyIds.length, 22);
  assert.equal(Object.keys(policy.runtimeRules.tables).length, 64);
  let count = 0;
  for (const catalog of policy.catalogAudits) {
    const table = policy.runtimeRules.tables[catalog.runtimeTableKey];
    assert.equal(Object.keys(table).length, catalog.outcomes.length);
    for (const outcome of catalog.outcomes) {
      assert.equal(table[outcome.id].decision, outcome.decision);
      assert.ok(policy.runtimeRules.validOutcomes[catalog.familyId][catalog.wheelId].includes(outcome.id));
      count++;
    }
  }
  assert.equal(count, 712);
});

test('All twenty Gnome gadgets and twelve Troll penalties remain eligible', () => {
  for (const id of policy.runtimeRules.validOutcomes.dwarf['gnome-tech'])
    assert.equal(need(node('dwarf', [['dwarf-gnome-type', 'gnome'], ['gnome-tech', id]])).decision, 'candidate');
  for (const id of policy.runtimeRules.validOutcomes.goblinoid['troll-disease']) {
    const verdict = need(node('goblinoid', [['goblin-orc-troll-type', 'troll'], ['troll-disease', id]]));
    assert.equal(verdict.decision, 'candidate');
    assert.equal(verdict.advantage, 'none');
  }
});

test('Healer Fairy needs supporting roles; other Fairy packages skip', () => {
  for (const subtype of ['fairy-parents', 'element-pixie', 'fairy-king'])
    assert.equal(need(node('fae', [['fairy-subrace', subtype]])).decision, 'skip');
  const healer = node('fae', [['fairy-subrace', 'healer-fairy']]);
  const opts = options(healer, ['hands'], [role('compatible'), role('unsupported', [], { compatibleSpecializations: [] })]);
  assert.deepEqual(planArchetypeStage(state(healer), opts).eligibleOutcomes.map(o => o.id), ['compatible']);
});

test('Siluman has twelve choices but one animal result, including the new Bat and Eagle', () => {
  const animalIds = policy.runtimeRules.validOutcomes.beastfolk['siluman-animal-type'];
  assert.equal(animalIds.length, 12);
  for (const id of animalIds) {
    const n = node('beastfolk', [['siluman-animal-type', id]]);
    assert.equal(need(n).decision, 'candidate');
    assert.equal(planArchetypeStage(state(n)).decision, 'needs_configuration');
    assert.equal(planArchetypeStage(state(n), options(n)).decision, 'spin');
  }
  assert.throws(() => need(node('beastfolk')), { code: 'SILUMAN_INCOMPLETE' });
  const oldTwelveResults = animalIds.map(id => ['siluman-animal-type', id]);
  assert.throws(() => need(node('beastfolk', oldTwelveResults)), { code: 'SILUMAN_INCOMPLETE' });
});

test('Body boost bands and all/any/forbidden requirements are explicit filters', () => {
  const n = node('human');
  const opts = options(n, ['hands', 'aquatic'], [
    role('match', ['hands'], { requirements: { all: ['hands'], any: ['aquatic', 'flight'], forbidden: ['digital'] } }),
    role('wrong-any', [], { requirements: { all: [], any: ['flight'], forbidden: [] } }),
    role('forbidden', [], { requirements: { all: [], any: [], forbidden: ['aquatic'] } }),
    role('too-strong', [], { boostBand: 'strong' }),
  ]);
  opts.profiles.bodies['test-body'].allowedBoostBands = ['light'];
  assert.deepEqual(planArchetypeStage(state(n), opts).eligibleOutcomes.map(o => [o.id, o.probability]), [['match', 1]]);
  opts.profiles.bodies['test-body'].sourceIds = ['borrowed'];
  assert.throws(() => planArchetypeStage(state(n), opts), { code: 'BODY_SCOPE_MISMATCH' });
});

test('Global history must cover the exact committed nested identity families', () => {
  const root = node('symbiote', [['symbiote-takeover', 'takeover-0']], [link('host', node('human'))]);
  const s = state(root); s.usedRaceFamilyIds = ['symbiote'];
  assert.throws(() => planArchetypeStage(s), { code: 'RACE_HISTORY_MISMATCH' });
  s.usedRaceFamilyIds = ['human', 'symbiote'];
  assert.equal(evaluateArchetypeNeed(s).decision, 'candidate');
});

test('Commit and replay reject inconsistent counts, routes, pools and odds', () => {
  const n = node('human'), s = state(n), p = planArchetypeStage(s, options(n));
  for (const mutation of [
    { spinCount: 0 }, { nextStage: 'backstory' }, { eligibleOutcomes: [] },
    { eligibleOutcomes: [{ ...p.eligibleOutcomes[0], probability: .5 }] },
  ]) assert.throws(() => commitArchetypePlan(s, { ...p, ...mutation }), { code: 'PLAN_NOT_COMMITTABLE' });
  const saved = commitArchetypePlan(s, p);
  saved.archetypeDecision.plan.eligibleOutcomes[0].probability = .5;
  assert.throws(() => planArchetypeStage(saved), { code: 'PLAN_NOT_COMMITTABLE' });
  const dragon = state(node('mythical-beast')), skipped = planArchetypeStage(dragon);
  assert.throws(() => commitArchetypePlan(dragon, { ...skipped, nextStage: 'archetype' }), { code: 'PLAN_NOT_COMMITTABLE' });
});
