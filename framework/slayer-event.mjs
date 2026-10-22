import design from '../content/slayer-events-design.json' with { type: 'json' };
import race from '../content/race-wheel-design.json' with { type: 'json' };
import dragon from '../content/dragon-events-design.json' with { type: 'json' };
import abyss from '../content/abyssal-axiom-design.json' with { type: 'json' };
import anime from '../content/anime-events-design.json' with { type: 'json' };
import hero from '../content/legendary-hero-events-design.json' with { type: 'json' };
import machine from '../content/machine-events-design.json' with { type: 'json' };
import element from '../content/universal-element-wheel-design.json' with { type: 'json' };
import primordial from '../content/primordial-events-design.json' with { type: 'json' };
import video2Imports from '../content/video2-race-imports-design.json' with { type: 'json' };

export class SlayerInputError extends Error {
  constructor(code, message) { super(message); this.name = 'SlayerInputError'; this.code = code; }
}
const fail = (code, message) => { throw new SlayerInputError(code, message); };
const documents = Object.fromEntries([
  ['race-wheel', race], ['dragon-events', dragon], ['abyssal-axiom', abyss], ['anime-events', anime],
  ['legendary-hero-events', hero], ['machine-events', machine], ['universal-element-wheel', element],
  ['primordial-events', primordial],
  ['video2-race-imports', video2Imports],
].map(([name, data]) => [`content/${name}-design.json`, data]));
const families = new Set(Object.keys(design.identityRoutes));
const profiles = Object.fromEntries(design.quantityProfiles.map(p => [p.id, p]));
const rankProfile = rank => design.quantityProfiles.find(p => p.difficultyRank === rank);

function findWheel(value, id) {
  if (!value || typeof value !== 'object') return null;
  const rows = value.outcomes ?? value.options;
  if (value.id === id && Array.isArray(rows) && rows.length) return { ...value, outcomes: rows };
  for (const [key, child] of Object.entries(value)) {
    if (/retired|history|inactive|proposal|resolvePlan/i.test(key)) continue;
    const found = findWheel(child, id);
    if (found) return found;
  }
  return null;
}
const selectors = Object.fromEntries(design.selectorCatalog.map(ref => {
  const wheel = findWheel(documents[ref.definitionFile], ref.canonicalWheelId);
  if (!wheel) fail('SELECTOR_NOT_FOUND', ref.canonicalWheelId);
  return [ref.id, { id: `slayer-reference:${ref.id}`, canonicalWheelId: ref.canonicalWheelId,
    definitionFile: ref.definitionFile, label: wheel.label, purpose: 'victim-reference', dispatchEvents: false,
    outcomes: wheel.outcomes.map(o => ({ id: o.id ?? o.familyId, label: o.label, baseWeight: o.baseWeight ?? 1 })) }];
}));

/** Read-only projection: outcome grants, power links and event dispatch never leave this API. */
export function getSlayerTargetSelector(wheelId, { usedVictimFamilyIds = [] } = {}) {
  const original = selectors[wheelId];
  if (!original) fail('FORBIDDEN_TARGET_SELECTOR', `Not an identity selector: ${wheelId}.`);
  if (!Array.isArray(usedVictimFamilyIds) || usedVictimFamilyIds.some(id => !families.has(id)))
    fail('INVALID_TARGET_HISTORY', 'Victim family history must use canonical IDs.');
  const used = new Set(usedVictimFamilyIds);
  const outcomes = original.outcomes.filter(o => wheelId !== 'race-family' || !used.has(o.id));
  if (!outcomes.length) fail('EMPTY_TARGET_POOL', 'No unused victim family remains for this required draw.');
  const total = outcomes.reduce((sum, o) => sum + o.baseWeight, 0);
  if (!Number.isFinite(total) || total <= 0 || outcomes.some(o => !Number.isFinite(o.baseWeight) || o.baseWeight <= 0))
    fail('INVALID_SELECTOR_WEIGHTS', 'Reference selectors require positive finite canonical weights.');
  return { ...structuredClone(original), outcomes: outcomes.map(o => ({ ...o, probability: o.baseWeight / total })) };
}

const rowsFor = (node, wheelId) => node.results.filter(r => r.wheelId === wheelId);
const applies = (when, node) => !when || Object.entries(when).every(([wheel, ids]) =>
  rowsFor(node, wheel).length === 1 && ids.includes(rowsFor(node, wheel)[0].outcomeId));

/** One next reference draw, an explicit configuration gap, or the final count-wheel snapshot. */
export function planSlayerTarget(state, { silumanSampling } = {}) {
  if (!state || typeof state.invocationId !== 'string' || !state.invocationId)
    fail('INVALID_SLAYER_INVOCATION', 'A stable source-scoped Slayer invocation ID is required.');
  const used = new Set(), sources = new Set(), spins = new Set();
  function validate(node) {
    if (!node || !families.has(node.familyId) || typeof node.sourceId !== 'string' || !node.sourceId || sources.has(node.sourceId))
      fail('INVALID_TARGET_NODE', 'Canonical family and unique source ID required.');
    if (used.has(node.familyId)) fail('VICTIM_FAMILY_REPEATED', 'Victim identity chains cannot repeat a family.');
    used.add(node.familyId); sources.add(node.sourceId);
    if (!Array.isArray(node.results) || !Array.isArray(node.children)) fail('INVALID_TARGET_NODE', 'Explicit results/children arrays required.');
    const allowed = new Set(design.identityRoutes[node.familyId].selectors.map(s => s.wheelId));
    for (const r of node.results) {
      if (!r || !allowed.has(r.wheelId)) fail('FORBIDDEN_TARGET_SELECTOR', 'Target equipment/powers/boosts and unrelated selectors are forbidden.');
      if (typeof r.spinId !== 'string' || !r.spinId || spins.has(r.spinId)) fail('INVALID_TARGET_SPIN', 'Result spin IDs must be unique.');
      spins.add(r.spinId);
      if (!selectors[r.wheelId].outcomes.some(o => o.id === r.outcomeId)) fail('UNKNOWN_TARGET_OUTCOME', `${r.wheelId}/${r.outcomeId}`);
    }
    for (const child of node.children) validate(child.node);
  }
  if (state.root) validate(state.root);
  const next = (wheelId, slot, ordinal = 0, extra = {}) => ({ phase: 'target', decision: 'spin',
    invocationId: `${state.invocationId}:${slot}:${wheelId}:${ordinal}`,
    wheel: getSlayerTargetSelector(wheelId, { usedVictimFamilyIds: [...used] }), ...extra });
  if (!state.root) return next('race-family', 'target-root');
  function inspect(node, slot) {
    const route = design.identityRoutes[node.familyId];
    if (route.configurationRequired?.length)
      return { phase: 'target', decision: 'needs_configuration', required: [...route.configurationRequired] };
    const active = route.selectors.filter(s => applies(s.when, node));
    if (node.results.some(r => !active.some(s => s.wheelId === r.wheelId)))
      fail('INAPPLICABLE_TARGET_SELECTOR', 'Selector does not belong to the selected subtype path.');
    let profileId = route.defaultProfileId;
    const lineage = [race.families.find(f => f.id === node.familyId).label];
    for (let index = 0; index < active.length; index++) {
      const step = active[index], count = step.drawCount ?? 1, rows = rowsFor(node, step.wheelId);
      if (rows.length > count) fail('TOO_MANY_TARGET_RESULTS', step.wheelId);
      if (step.samplingProfileRequired) {
        if (!silumanSampling || silumanSampling.approved !== true)
          return { phase: 'target', decision: 'needs_configuration', required: ['siluman-sampling'] };
        if (!['with-replacement', 'without-replacement'].includes(silumanSampling.mode)) fail('INVALID_TARGET_SAMPLING', 'Explicit sampling mode required.');
        if (silumanSampling.mode === 'without-replacement' && selectors[step.wheelId].outcomes.length < count)
          return { phase: 'target', decision: 'needs_configuration', required: ['siluman-pool-cannot-supply-twelve-unique-types'] };
        if (silumanSampling.mode === 'without-replacement' && new Set(rows.map(r => r.outcomeId)).size !== rows.length)
          fail('INVALID_TARGET_SAMPLING', 'Repeated animal violates the approved sampling mode.');
      }
      if (rows.length < count) {
        if (node.children.length || active.slice(index + 1).some(s => rowsFor(node, s.wheelId).length))
          fail('TARGET_ORDER_CONFLICT', 'Finish earlier target selectors before descendants or later selectors.');
        return next(step.wheelId, slot, rows.length, { targetSourceId: node.sourceId, requiredDrawCount: count });
      }
      const mapping = design.quantityAssignments[`${node.familyId}:${step.wheelId}`];
      if (mapping && !(node.familyId === 'anime-lineage' && step.wheelId === 'anime-role' && rows[0].outcomeId === 'mc')) {
        const chosen = rows.map(r => mapping[r.outcomeId]);
        if (chosen.some(id => !profiles[id])) fail('QUANTITY_PROFILE_MISSING', step.wheelId);
        profileId = count === 1 ? chosen[0] : rankProfile(Math.max(...chosen.map(id => profiles[id].difficultyRank))).id;
      }
      lineage.push(...rows.map(r => selectors[step.wheelId].outcomes.find(o => o.id === r.outcomeId).label));
    }
    const childRule = route.children && applies(route.children.when, node) ? route.children : null;
    const childCount = childRule?.count ?? 0;
    if (node.children.length > childCount || node.children.some(c => c.relation !== childRule?.relation))
      fail('INVALID_TARGET_CHILDREN', 'Only identity wrapper/origin children are allowed.');
    const childProfiles = [], childTargets = [];
    for (let i = 0; i < childCount; i++) {
      if (!node.children[i]) return next('race-family', `${slot}/${childRule.relation}-${i}`, 0,
        { parentTargetSourceId: node.sourceId, relation: childRule.relation, childOrdinal: i });
      const child = inspect(node.children[i].node, `${slot}/${childRule.relation}-${i}`);
      if (child.decision !== 'resolved') {
        if (node.children.length > i + 1) fail('TARGET_ORDER_CONFLICT', 'Resolve first victim component before selecting the next.');
        return child;
      }
      childProfiles.push(profiles[child.profileId].difficultyRank); childTargets.push(child);
    }
    if (childProfiles.length) {
      const min = route.minimumProfileId ? profiles[route.minimumProfileId].difficultyRank : 0;
      profileId = rankProfile(Math.min(7, Math.max(min, Math.max(...childProfiles) + route.promotion))).id;
    }
    return { decision: 'resolved', sourceId: node.sourceId, familyId: node.familyId, profileId, lineage, children: childTargets };
  }
  const target = inspect(state.root, 'target-root');
  if (target.decision !== 'resolved') return target;
  const profile = profiles[target.profileId];
  validateCountRows(profile.outcomes, design.minimumCountOutcomeProbability);
  return { phase: 'victim-count', decision: 'spin', invocationId: `${state.invocationId}:victim-count`,
    ruleVersion: design.version, target, usedVictimFamilyIds: [...used],
    wheel: { id: 'slayer-victim-count', profileId: profile.id, outcomeCount: 10, allowModifiers: false,
      minimumOutcomeProbability: design.minimumCountOutcomeProbability,
      outcomes: structuredClone(profile.outcomes) }, nextStageAfterResult: 'backstory' };
}

function validateCountRows(rows, minimumProbability) {
  if (!Array.isArray(rows) || rows.length !== 10 || new Set(rows.map(o => o.id)).size !== 10 ||
      new Set(rows.map(o => o.value)).size !== 10 || rows[0].value !== 0 ||
      rows.some((o, i) => typeof o.id !== 'string' || !o.id || !Number.isInteger(o.value) || o.value < 0 || (i && o.value <= rows[i - 1].value) ||
        !Number.isFinite(o.baseWeight) || o.baseWeight <= 0 || !Number.isFinite(o.probability) || o.probability <= 0 || o.probability < minimumProbability ||
        o.strengthBonus !== (i === 0 ? 0 : Math.ceil(i / 3))))
    fail('INVALID_COUNT_PLAN', 'Frozen count values, weights and Strength slots must be valid.');
  const total = rows.reduce((sum, o) => sum + o.baseWeight, 0);
  if (!Number.isFinite(total) || rows.some(o => Math.abs(o.probability - o.baseWeight / total) > 1e-12))
    fail('INVALID_COUNT_PLAN', 'Frozen odds must match count weights.');
}

/** Consume the frozen count plan; emit a ledger entry, never mutate/roll the Strength base. */
export function resolveSlayerVictimCount(plan, result) {
  if (!plan || plan.phase !== 'victim-count' || plan.decision !== 'spin' || !plan.ruleVersion ||
      typeof plan.invocationId !== 'string' || !plan.target?.sourceId || plan.nextStageAfterResult !== 'backstory')
    fail('INVALID_COUNT_PLAN', 'A resolved target and frozen ten-section plan are required.');
  const rows = plan.wheel?.outcomes;
  // Already committed legacy journals remain reproducible; only new plans use the 5% floor.
  validateCountRows(rows, plan.ruleVersion === 'slayer/1.0.0' ? 0 : .05);
  if (!result || result.invocationId !== plan.invocationId || typeof result.spinId !== 'string' || !result.spinId ||
      typeof result.outcomeId !== 'string' || !result.outcomeId)
    fail('COUNT_SOURCE_MISMATCH', 'Committed count spin must belong to this plan invocation.');
  const outcome = rows.find(o => o.id === result.outcomeId);
  if (!outcome) fail('UNKNOWN_COUNT_OUTCOME', 'Count outcome is not in the frozen target-specific pool.');
  return { victimCount: outcome.value, strengthBonus: outcome.strengthBonus, target: structuredClone(plan.target),
    nextStage: 'backstory', ledgerKey: `${result.spinId}:slayer-strength`,
    effects: outcome.strengthBonus ? [{ id: `${result.spinId}:slayer-strength`, type: 'stat-flat-modifier',
      stat: 'strength', amount: outcome.strengthBonus, sourceArchetypeId: 'slayer', sourceSpinId: result.spinId,
      sourceInvocationId: plan.invocationId, targetReferenceId: plan.target.sourceId,
      applyAfterImmutableBase: true }] : [] };
}
