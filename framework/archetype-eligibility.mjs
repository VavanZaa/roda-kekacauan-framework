import defaultPolicy from '../content/archetype-eligibility-design.json' with { type: 'json' };
import { planMainWheelOdds } from './main-wheel-odds.mjs';

export class ArchetypeInputError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ArchetypeInputError';
    this.code = code;
  }
}

const fail = (code, message) => { throw new ArchetypeInputError(code, message); };
const candidate = (advantage = 'light', specializations = []) => ({ decision: 'candidate', advantage, specializations });
const skip = (reasonCode, kind = 'strong') => ({ decision: 'skip', reasonCodes: [reasonCode], skipKind: kind });
const missing = (...required) => ({ decision: 'needs_configuration', required, reasonCodes: ['MISSING_APPROVED_PROFILE'] });
const canonical = value => Array.isArray(value)
  ? '[' + value.map(canonical).join(',') + ']'
  : value && typeof value === 'object'
    ? '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}'
    : JSON.stringify(value);

function inputSnapshot(state) {
  const node = n => ({
    sourceId: n.sourceId, familyId: n.familyId, completed: n.completed,
    compositionProfileId: n.compositionProfileId ?? null,
    results: (n.results ?? []).map(r => ({ spinId: r.spinId, wheelId: r.wheelId, outcomeId: r.outcomeId })),
    children: (n.children ?? []).map(c => ({ relation: c.relation, node: node(c.node) })),
  });
  return canonical({ completed: state.raceTree?.completed, pendingInvocations: state.raceTree?.pendingInvocations,
    roots: state.raceTree?.roots?.map(node) });
}

function validateTree(state, policy) {
  const tree = state.raceTree;
  if (!tree || tree.completed !== true || !Array.isArray(tree.pendingInvocations) || tree.pendingInvocations.length)
    fail('RACE_NOT_COMPLETE', 'Finish the entire Race tree and all saved nested returns before evaluating Archetype.');
  if (!Array.isArray(tree.roots) || tree.roots.length !== 1)
    fail('INVALID_RACE_ROOT', 'One outer root is required; Hybrid contains its two roots as children.');
  const families = new Set(), sources = new Set(), spins = new Set();
  const known = new Set(policy.runtimeRules.familyIds);
  function visit(n) {
    if (!n || !known.has(n.familyId)) fail('UNKNOWN_RACE', 'Unknown canonical race family.');
    if (n.completed !== true) fail('RACE_NOT_COMPLETE', `Unfinished component ${n.sourceId}.`);
    if (typeof n.sourceId !== 'string' || !n.sourceId || sources.has(n.sourceId))
      fail('INVALID_SOURCE_ID', 'Each committed race component needs a unique source ID.');
    if (families.has(n.familyId)) fail('RACE_FAMILY_REPEATED', `Race family ${n.familyId} already appears in this identity tree.`);
    families.add(n.familyId); sources.add(n.sourceId);
    if (!Array.isArray(n.results) || !Array.isArray(n.children)) fail('INVALID_RACE_NODE', 'Explicit results and children arrays are required.');
    for (const r of n.results) {
      if (!r || typeof r.spinId !== 'string' || !r.spinId || spins.has(r.spinId)) fail('INVALID_SPIN_ID', 'Race result spin IDs must be unique.');
      spins.add(r.spinId);
      const valid = policy.runtimeRules.validOutcomes[n.familyId]?.[r.wheelId];
      if (!valid?.includes(r.outcomeId)) fail('UNKNOWN_RACE_RESULT', `Unknown ${n.familyId}/${r.wheelId}/${r.outcomeId}.`);
    }
    const expected = n.familyId === 'hybrid' ? ['hybrid-component', 2]
      : n.familyId === 'symbiote' ? ['host', 1]
        : n.familyId === 'raksasa' ? ['base', 1]
          : n.familyId === 'lelembut' && n.results.some(r => r.wheelId === 'lelembut-imported-type' && ['skeleton', 'zombie'].includes(r.outcomeId))
            ? ['origin', 1] : [null, 0];
    if (n.children.length !== expected[1] || n.children.some(c => c.relation !== expected[0]))
      fail('INVALID_ATTACHMENT', `Invalid child structure for ${n.familyId}; prey references are not identity children.`);
    for (const c of n.children) visit(c.node);
  }
  visit(tree.roots[0]);
  if (state.usedRaceFamilyIds !== undefined &&
      (!Array.isArray(state.usedRaceFamilyIds) || canonical([...new Set(state.usedRaceFamilyIds)].sort()) !== canonical([...families].sort())))
    fail('RACE_HISTORY_MISMATCH', 'Identity history must match all outer and nested family IDs.');
  return { root: tree.roots[0], sourceIds: [...sources].sort() };
}

function single(n, wheel) {
  const rows = n.results.filter(r => r.wheelId === wheel);
  if (rows.length !== 1) fail('RACE_RESULT_MISSING', `Exactly one committed ${wheel} result is required on ${n.sourceId}.`);
  return rows[0].outcomeId;
}

function tableVerdict(n, wheel, policy, caller = 'default') {
  const id = single(n, wheel);
  const rule = policy.runtimeRules.tables[`${n.familyId}:${wheel}:${caller}`]?.[id];
  if (!rule) fail('POLICY_RULE_MISSING', `Missing adopted rule for ${n.familyId}/${wheel}/${caller}/${id}.`);
  if (rule.decision === 'spin') return candidate(rule.advantage ?? 'light');
  if (rule.decision === 'skip') return skip(rule.reasonCode, rule.skipKind ?? 'strong');
  fail('POLICY_RULE_UNRESOLVED', `Rule ${wheel}/${id} requires an explicit caller resolver.`);
}

const membersOf = n => [n.sourceId, ...n.children.flatMap(c => membersOf(c.node))].sort();

function composition(n, profiles, verdicts) {
  const strong = verdicts.find(v => v.decision === 'skip' && v.skipKind === 'strong');
  if (strong) return strong;
  const unresolved = verdicts.filter(v => v.decision === 'needs_configuration');
  if (unresolved.length) return missing(...unresolved.flatMap(v => v.required));
  const bodySkipped = verdicts.some(v => v.decision === 'skip');
  const lightCount = verdicts.filter(v => v.decision === 'candidate' && v.advantage === 'light').length;
  const specializations = [...new Set(verdicts.flatMap(v => v.specializations ?? []))];
  if (!bodySkipped && lightCount <= 1) return candidate(lightCount ? 'light' : 'none', specializations);
  const p = profiles.compositions?.[n.compositionProfileId];
  if (!p || p.approved !== true) return missing(`composition:${n.sourceId}`);
  if (canonical(p.sourceIds?.slice().sort()) !== canonical(membersOf(n)))
    fail('COMPOSITION_SCOPE_MISMATCH', 'Composite assessment must be bound to exactly this committed subtree.');
  if (!['light', 'strong'].includes(p.upperHand)) fail('INVALID_COMPOSITION_PROFILE', 'Explicit light/strong assessment required.');
  return p.upperHand === 'strong' ? skip('COMPOSITE_UPPER_HAND') : candidate('light', specializations);
}

function evaluateNode(n, policy, profiles) {
  // Approved roster membership does not approve a new race's spin/skip recipe.
  if (policy.runtimeRules.pendingFamilyIds?.includes(n.familyId))
    return missing(`race-event:${n.familyId}`, `archetype-classification:${n.familyId}`);
  // Evaluate all descendants; no child advances the outer stage by itself.
  const children = n.children.map(c => evaluateNode(c.node, policy, profiles));
  switch (n.familyId) {
    case 'human': return candidate('none');
    case 'slime': {
      const type = single(n, 'slime-type');
      if (type === 'elemental') single(n, 'element-universal');
      else if (n.results.some(r => r.wheelId === 'element-universal'))
        fail('SLIME_ELEMENT_CONFLICT', 'Only Elemental Slime has a selected Element.');
      return tableVerdict(n, 'slime-type', policy);
    }
    case 'centaur': return tableVerdict(n, 'centaur-lower-body', policy);
    case 'cosmic-warrior': {
      const group = single(n, 'cosmic-warrior-group');
      const childWheel = {
        ultraman: 'ultraman-color',
        saint: 'saint-cosmic-armor',
        'green-lantern': 'lantern-ring-color',
      }[group];
      if (childWheel) single(n, childWheel);
      const rewardWheels = ['ultraman-color', 'saint-cosmic-armor', 'lantern-ring-color'];
      if (n.results.some(r => rewardWheels.includes(r.wheelId) && r.wheelId !== childWheel))
        fail('COSMIC_EVENT_CONFLICT', 'Only the selected Cosmic group may contain its required reward wheel.');
      return tableVerdict(n, 'cosmic-warrior-group', policy);
    }
    case 'raksasa': return skip('RAKSASA_GIANT_BODY');
    case 'mythical-beast': return skip('MYTHICAL_BEAST_SIGNATURE');
    case 'golem': return skip('GOLEM_MATERIAL_SPECIALIZATION');
    case 'elemental': return skip('ELEMENTAL_SPECIALIZATION');
    case 'legendary-warrior': return skip('LEGENDARY_HERO_SIGNATURE');
    case 'primordial': return tableVerdict(n, 'primordial-identity', policy);
    case 'hybrid': return composition(n, profiles, children);
    case 'elf': {
      const type = single(n, 'elf-type');
      const child = { 'high-elf': 'power-holy', 'dark-elf': 'power-cursed', 'blood-elf': 'power-blood', 'sea-elf': 'sea-elf-form', 'fey-elf': 'fey-elf-season' }[type];
      return tableVerdict(n, child ?? 'elf-type', policy);
    }
    case 'dwarf': {
      const type = single(n, 'dwarf-gnome-type');
      if (type === 'gnome') return tableVerdict(n, 'gnome-tech', policy);
      const id = single(n, 'dwarf-armor-count');
      const count = policy.runtimeRules.numericValues['dwarf-armor-count'][id];
      const pieces = n.results.filter(r => r.wheelId === 'dwarf-armor-piece');
      if (pieces.length !== count || new Set(pieces.map(r => r.outcomeId)).size !== count)
        fail('ARMOR_INCOMPLETE', 'Complete the exact unique armor award before evaluating Archetype.');
      return tableVerdict(n, 'dwarf-armor-count', policy);
    }
    case 'goblinoid': {
      const type = single(n, 'goblin-orc-troll-type');
      if (type === 'troll') return { ...tableVerdict(n, 'troll-disease', policy), advantage: 'none' };
      if (type === 'goblin') {
        single(n, 'goblinoid-army-count');
        return single(n, 'goblin-position') === 'kacung' ? candidate('none') : tableVerdict(n, 'goblinoid-army-count', policy);
      }
      const role = single(n, 'orc-role');
      if (role === 'orc-general') return tableVerdict(n, 'goblinoid-army-count', policy);
      const result = tableVerdict(n, 'orc-role', policy);
      return result.decision === 'candidate' ? { ...result, specializations: [role] } : result;
    }
    case 'fae': {
      const result = tableVerdict(n, 'fairy-subrace', policy);
      return result.decision === 'candidate' ? { ...result, specializations: ['healer-fairy'] } : result;
    }
    case 'beastfolk': {
      const animals = n.results.filter(r => r.wheelId === 'siluman-animal-type');
      if (animals.length !== 1) fail('SILUMAN_INCOMPLETE', 'Exactly one committed animal result from the twelve-choice wheel is required.');
      return candidate('light', ['siluman']);
    }
    case 'lelembut': {
      const origin = single(n, 'lelembut-origin');
      if (origin === 'local') {
        const type = single(n, 'lelembut-local-type');
        return tableVerdict(n, type === 'leak' ? 'power-cursed' : 'lelembut-local-type', policy);
      }
      const type = single(n, 'lelembut-imported-type');
      if (['skeleton', 'zombie'].includes(type)) return children[0];
      return tableVerdict(n, type === 'vampire' ? 'vampire-victim-count' : 'lelembut-imported-type', policy);
    }
    case 'symbiote': {
      const takeover = single(n, 'symbiote-takeover');
      const percent = policy.runtimeRules.numericValues['symbiote-takeover'][takeover];
      if (percent >= policy.runtimeRules.cutoffs.symbioteSkipFrom) return skip('SYMBIOTE_TAKEOVER_UPPER_HAND');
      if (children[0].decision === 'skip') return children[0];
      return composition(n, profiles, percent >= 20 ? [...children, candidate('light')] : children);
    }
    case 'heavenly-principle': {
      const type = single(n, 'heavenly-principle-type');
      const result = tableVerdict(n, type === 'pemuka-agama' ? 'power-divine' : 'heavenly-principle-type', policy);
      return result.decision === 'candidate' ? { ...result, specializations: [type] } : result;
    }
    case 'demon': {
      const type = single(n, 'abyssal-axiom-type');
      return tableVerdict(n, type === 'setan' ? 'setan-type' : type === 'sinner' ? 'seven-deadly-sin' : 'abyssal-axiom-type', policy);
    }
    case 'anime-lineage': {
      single(n, 'anime-genre');
      if (single(n, 'anime-role') === 'npc') {
        if (n.results.some(r => !['anime-genre', 'anime-role'].includes(r.wheelId)))
          fail('NPC_EVENT_CONFLICT', 'Anime NPC must not contain MC genre events.');
        return candidate('none');
      }
      const genre = single(n, 'anime-genre');
      if (genre === 'isekai') return tableVerdict(n, 'isekai-cheat-skill', policy);
      if (genre === 'romance') {
        const ending = single(n, 'anime-romance-ending');
        return tableVerdict(n, ending === 'harem' ? 'anime-harem-count' : 'anime-romance-ending', policy);
      }
      if (genre === 'sci-fi') {
        const role = single(n, 'anime-scifi-role');
        if (role === 'pilot') return skip('ANIME_PILOT_SIGNATURE');
        if (role === 'technician') {
          const result = tableVerdict(n, 'tech-weapon', policy, 'technician');
          return result.decision === 'candidate' ? { ...result, specializations: ['technician'] } : result;
        }
        const tech = n.results.filter(r => r.wheelId === 'tech-weapon');
        if (tech.length !== 2) fail('TECH_INCOMPLETE', 'Sci-fi Cyborg requires both actual Tech results.');
        const rules = tech.map(r => policy.runtimeRules.tables['anime-lineage:tech-weapon:cyborg'][r.outcomeId]);
        if (rules.some(r => r.decision === 'skip')) return skip('ANIME_CYBORG_COMBAT_TECH');
        return composition(n, profiles, [candidate('light'), candidate('light')]);
      }
      return tableVerdict(n, 'anime-genre', policy);
    }
    case 'machine': {
      const type = single(n, 'machine-type');
      return tableVerdict(n, type === 'android' ? 'power-android' : type === 'cyborg' ? 'cyborg-weapon' : 'machine-type', policy);
    }
    default: fail('POLICY_RULE_MISSING', `No resolver for ${n.familyId}.`);
  }
}

function validateFinalPlan(plan) {
  if (!plan || plan.stageId !== 'archetype' || typeof plan.policyVersion !== 'string' || !plan.policyVersion ||
      typeof plan.invocationId !== 'string' || !plan.invocationId || !Array.isArray(plan.eligibleOutcomes) ||
      !['spin', 'skip'].includes(plan.decision))
    fail('PLAN_NOT_COMMITTABLE', 'A final versioned Archetype plan is required.');
  if (plan.decision === 'skip') {
    if (plan.spinCount !== 0 || plan.nextStage !== 'backstory' || plan.eligibleOutcomes.length)
      fail('PLAN_NOT_COMMITTABLE', 'Skip must advance to Backstory with zero spins and no outcomes.');
    return;
  }
  const pool = plan.eligibleOutcomes;
  if (plan.spinCount !== 1 || plan.nextStage !== 'archetype' || !pool.length ||
      new Set(pool.map(o => o.id)).size !== pool.length ||
      pool.some(o => typeof o.id !== 'string' || !o.id || typeof o.eventProfileId !== 'string' || !o.eventProfileId ||
        !Number.isFinite(o.weight) || o.weight <= 0 || !Number.isFinite(o.probability) || o.probability <= 0))
    fail('PLAN_NOT_COMMITTABLE', 'Spin must have one invocation and a valid compatible pool.');
  const total = pool.reduce((sum, o) => sum + o.weight, 0);
  if (!Number.isFinite(total) || pool.some(o => Math.abs(o.probability - o.weight / total) > 1e-12))
    fail('PLAN_NOT_COMMITTABLE', 'Frozen odds must match the compatible pool weights.');
}

function frozenDecision(state) {
  const frozen = state.archetypeDecision;
  if (!frozen) return null;
  if (frozen.status !== 'committed' || !['spin', 'skip'].includes(frozen.plan?.decision))
    fail('INVALID_DECISION_JOURNAL', 'Only completed decision snapshots can be replayed.');
  validateFinalPlan(frozen.plan);
  if (frozen.plan.inputFingerprint !== inputSnapshot(state))
    fail('RACE_SNAPSHOT_CHANGED', 'Committed Race input changed; do not resample a frozen decision.');
  return { ...structuredClone(frozen.plan), replayed: true };
}

/** Pure decision; never spins, mutates inventory, or reads future stages. */
export function evaluateArchetypeNeed(state, { policy = defaultPolicy, profiles = {} } = {}) {
  const replay = frozenDecision(state);
  if (replay) return replay;
  if (!policy.runtimeReady || !policy.policyVersion || !policy.runtimeRules)
    fail('POLICY_NOT_READY', 'An accepted, compiled eligibility policy is required.');
  const { root, sourceIds } = validateTree(state, policy);
  const verdict = evaluateNode(root, policy, profiles);
  return { ...verdict, stageId: 'archetype', policyVersion: policy.policyVersion, sourceIds,
    inputFingerprint: inputSnapshot(state), replayed: false };
}

/** Engine entry point. Approved body/role profiles are required only for candidates. */
export function planArchetypeStage(state, {
  policy = defaultPolicy, profiles = {}, archetypes = [], oddsPolicy = 'canonical-strength',
} = {}) {
  const need = evaluateArchetypeNeed(state, { policy, profiles });
  if (need.replayed) return need;
  const plan = { ...need, invocationId: `archetype:${policy.policyVersion}:${need.sourceIds.join('|')}` };
  if (need.decision === 'skip') return { ...plan, spinCount: 0, nextStage: 'backstory', eligibleOutcomes: [] };
  if (need.decision === 'needs_configuration') return { ...plan, spinCount: null, nextStage: null, eligibleOutcomes: [] };
  const body = profiles.bodies?.[state.bodyProfileId];
  if (!body || body.approved !== true)
    return { ...plan, ...missing('body-capabilities'), spinCount: null, nextStage: null, eligibleOutcomes: [] };
  if (canonical(body.sourceIds?.slice().sort()) !== canonical(need.sourceIds))
    fail('BODY_SCOPE_MISMATCH', 'Body capabilities must cover exactly the final committed identity tree.');
  if (!Array.isArray(body.capabilities) || body.capabilities.some(c => typeof c !== 'string') ||
      !Array.isArray(body.allowedBoostBands) || body.allowedBoostBands.some(b => !policy.runtimeRules.allowedBoostBands.includes(b)))
    fail('INVALID_BODY_PROFILE', 'Explicit capabilities and permitted boost bands are required; no Human fallback.');
  const roles = archetypes.filter(a => a.approved === true && a.enabled !== false);
  if (!roles.length) return { ...plan, ...missing('approved-archetype-roster-and-events'), spinCount: null, nextStage: null, eligibleOutcomes: [] };
  if (new Set(roles.map(a => a.id)).size !== roles.length) fail('DUPLICATE_ARCHETYPE', 'Duplicate approved IDs would multiply wheel weight.');
  const caps = new Set(body.capabilities), outcomes = [];
  for (const role of roles) {
    const req = role.requirements;
    if (typeof role.id !== 'string' || !role.id || !role.eventProfile || role.eventProfile.approved !== true ||
        typeof role.eventProfile.id !== 'string' || !role.eventProfile.id ||
        !req || !['all', 'any', 'forbidden'].every(k => Array.isArray(req[k]) && req[k].every(x => typeof x === 'string')) ||
        !Array.isArray(role.compatibleSpecializations) || role.compatibleSpecializations.some(s => typeof s !== 'string') ||
        !['none', 'light', 'strong'].includes(role.boostBand))
      return { ...plan, ...missing(`archetype-profile:${role.id ?? 'unknown'}`), spinCount: null, nextStage: null, eligibleOutcomes: [] };
    const weight = role.baseWeight ?? 1;
    if (!Number.isFinite(weight) || weight <= 0) fail('INVALID_ARCHETYPE_WEIGHT', 'Enabled approved roles need a positive finite weight.');
    if (!body.allowedBoostBands.includes(role.boostBand)) continue;
    if (!req.all.every(c => caps.has(c)) || (req.any.length && !req.any.some(c => caps.has(c))) || req.forbidden.some(c => caps.has(c))) continue;
    if (!need.specializations.every(s => role.compatibleSpecializations.includes(s))) continue;
    outcomes.push({ id: role.id, eventProfileId: role.eventProfile.id, weight });
  }
  if (!outcomes.length) return { ...plan, decision: 'skip', reasonCodes: ['NO_COMPATIBLE_ARCHETYPE'], skipKind: 'body', spinCount: 0, nextStage: 'backstory', eligibleOutcomes: [] };
  if (oddsPolicy === 'canonical-strength') {
    const odds = planMainWheelOdds('archetype', { eligibleIds: outcomes.map(o => o.id) });
    const eventById = new Map(outcomes.map(o => [o.id, o.eventProfileId]));
    return { ...plan, decision: 'spin', reasonCodes: ['NEEDS_ARCHETYPE_BOOST'],
      oddsPolicyVersion: odds.oddsPolicyVersion, spinCount: 1, nextStage: 'archetype',
      eligibleOutcomes: odds.outcomes.map(o => ({ id: o.id, eventProfileId: eventById.get(o.id),
        weight: o.weight, probability: o.probability })) };
  }
  if (oddsPolicy !== 'profile-weights')
    fail('UNKNOWN_ARCHETYPE_ODDS_POLICY', 'Use the canonical strength policy or an explicit versioned profile-weights configuration.');
  const total = outcomes.reduce((sum, o) => sum + o.weight, 0);
  if (!Number.isFinite(total)) fail('INVALID_ARCHETYPE_WEIGHT', 'Total wheel weight must be finite.');
  return { ...plan, decision: 'spin', reasonCodes: ['NEEDS_ARCHETYPE_BOOST'], spinCount: 1, nextStage: 'archetype',
    eligibleOutcomes: outcomes.map(o => ({ ...o, probability: o.weight / total })) };
}

/** Persist this snapshot atomically with stage scheduling in the future engine. */
export function commitArchetypePlan(state, plan) {
  if (state.archetypeDecision) { frozenDecision(state); return state; }
  validateFinalPlan(plan);
  if (plan.inputFingerprint !== inputSnapshot(state))
    fail('PLAN_NOT_COMMITTABLE', 'Commit only a final plan for these exact Race inputs.');
  return { ...state, archetypeDecision: { status: 'committed', plan: structuredClone(plan) } };
}
