import design from '../content/stat-odds-design.json' with { type: 'json' };
import scales from '../content/stat-scales-design.json' with { type: 'json' };
import identities from '../content/slayer-events-design.json' with { type: 'json' };
import identityPolicy from '../content/archetype-eligibility-design.json' with { type: 'json' };
import hybridRoles from '../content/archetype-hybrid-events-design.json' with { type: 'json' };
import backstory from '../content/backstory-wheel-design.json' with { type: 'json' };
import { resolveSizeResult, planSizeStage } from './size-wheel.mjs';

export const STAT_ODDS_VERSION = 'stat-odds/0.4.0';
export class StatOddsError extends Error {
  constructor(code, message) { super(message); this.name = 'StatOddsError'; this.code = code; }
}
const fail = (code, message) => { throw new StatOddsError(code, message); };
const id = x => typeof x === 'string' && x.trim().length > 0;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const sum = xs => xs.reduce((a, b) => a + b, 0);
const normalize = xs => { const t = sum(xs); if (!(t > 0) || !Number.isFinite(t)) fail('INVALID_WEIGHTS', 'Positive finite total weight required.'); return xs.map(x => x / t); };
const fromLogs = logs => {
  if (logs.some(x => !Number.isFinite(x))) fail('INVALID_WEIGHTS', 'Finite log likelihoods required.');
  const largest = Math.max(...logs);
  return logs.map(x => Math.exp(Math.max(-550, x - largest)));
};
const vector = (x, name) => {
  if (!Array.isArray(x) || x.length !== 7 || x.some(v => !Number.isFinite(v)))
    fail('INVALID_PARAMETER', `${name} requires seven finite parameters.`);
};
const unique = (xs, name) => {
  if (!Array.isArray(xs) || xs.some(x => !id(x)) || new Set(xs).size !== xs.length)
    fail('INVALID_SOURCE', `${name} must contain unique nonempty IDs.`);
};
const needs = (input, required) => ({ status: 'needs_configuration', version: STAT_ODDS_VERSION,
  runId: input.runId, characterId: input.characterId, invocationId: input.invocationId, required });
const matched = (fact, wheel, outcome) => fact?.results.some(r => r.wheelId === wheel && r.outcomeId === outcome);
const signature = facts => JSON.stringify(facts.map(f => [f.familyId, f.sourceId,
  f.results.map(r => [r.wheelId, r.outcomeId, r.spinId]).sort()]).sort());

function validateModel(m) {
  if (!m || !id(m.id) || !id(m.version)) fail('INVALID_MODEL', 'A versioned model is required.');
  vector(m.sigma, 'sigma');
  if (m.sigma.some(x => x < .05) || !Number.isFinite(m.minimumProbability) || m.minimumProbability < .05 ||
      !Number.isFinite(m.maximumProbability) || m.maximumProbability > .25 || m.minimumProbability > m.maximumProbability ||
      !(m.luckyTailMass > 0 && m.luckyTailMass < 1) || !(m.raceMaximumShare >= 0 && m.raceMaximumShare <= 1))
    fail('INVALID_MODEL', 'Use positive spreads/tail mass, a 0..1 mixture share and outcome bounds within 5%..25%.');
  for (const key of ['archetypeStrength', 'evidenceStrength', 'sizeStrength', 'maximumShift', 'sizeLogLimit',
    'sizePositiveShiftLimit', 'sizeNegativeShiftLimit'])
    if (!Number.isFinite(m[key]) || m[key] < 0) fail('INVALID_MODEL', `Invalid ${key}.`);
  if (!(m.defaultReferenceMeters > 0) || !Number.isFinite(m.defaultReferenceMeters) ||
    m.minimumCenter !== 0 || m.maximumCenter !== 9) fail('INVALID_MODEL', 'Raw centers use 0..9 and a positive Size reference.');
}

/** Reserve a floor, then distribute remaining mass by lore: p(i)=minimum+min(lambda*weight(i),maximum-minimum).
 * Explicit legacy 30%/zero-floor calls remain supported; new plans use 5%..25%.
 */
export function capProbabilities(weights, maximum = .25, minimum = .05) {
  if (!Array.isArray(weights) || !weights.length || weights.some(w => !Number.isFinite(w) || w <= 0) ||
      !Number.isFinite(maximum) || maximum <= 0 || maximum > .3 || !Number.isFinite(minimum) ||
      minimum < 0 || minimum > maximum) fail('INVALID_WEIGHTS', 'Positive finite weights and valid probability bounds required.');
  if (weights.length * maximum < 1 - 1e-12) fail('INFEASIBLE_CAP', 'The eligible pool cannot total 100% under the requested cap.');
  if (weights.length * minimum > 1 + 1e-12) fail('INFEASIBLE_FLOOR', 'The eligible pool cannot total 100% under the requested floor.');
  if (Math.abs(weights.length * maximum - 1) < 1e-12 || Math.abs(weights.length * minimum - 1) < 1e-12)
    return weights.map(() => 1 / weights.length);
  // Log-space bisection handles concentrated priors without overflow or prematurely
  // collapsing distinct priors by clamping several low sectors to identical floors.
  const logs = weights.map(Math.log), peak = Math.max(...logs), relative = logs.map(x => x - peak);
  const project = scale => relative.map(x => minimum + Math.min(Math.exp(scale + x), maximum - minimum));
  let lower = Math.log(1 / weights.length) - 1;
  let upper = Math.log(maximum) - Math.min(...relative) + 1;
  while (sum(project(lower)) > 1) lower -= 32;
  while (sum(project(upper)) < 1) upper += 32;
  for (let step = 0; step < 180; step++) {
    const middle = (lower + upper) / 2;
    if (sum(project(middle)) < 1) lower = middle;
    else upper = middle;
  }
  const p = project((lower + upper) / 2);
  if (Math.abs(sum(p) - 1) > 1e-12 || p.some(x => x <= 0 || x < minimum - 1e-12 || x > maximum + 1e-12))
    fail('INVALID_CAP_RESULT', 'Bounded probabilities must normalize within both probability bounds.');
  return p;
}

function validateInput(input, catalog) {
  for (const key of ['runId', 'characterId', 'invocationId']) if (!id(input?.[key])) fail('INVALID_INVOCATION', `Stable ${key} required.`);
  if (!Array.isArray(input.raceFacts) || !input.raceFacts.length) fail('MISSING_IDENTITY', 'Completed committed owner race facts required.');
  unique(input.raceFacts.map(f => f?.familyId), 'Owned race families');
  unique(input.raceFacts.map(f => f?.sourceId), 'Race sources');
  const spins = [];
  const tokens = [], sources = [];
  for (const f of input.raceFacts) {
    if (f.committed !== true || !identityPolicy.runtimeRules.familyIds.includes(f.familyId) || !Array.isArray(f.results))
      fail('INVALID_IDENTITY', 'Only committed canonical owner identities are allowed.');
    tokens.push(`race:${f.familyId}`); sources.push({ token: `race:${f.familyId}`, sourceId: f.sourceId });
    for (const r of f.results) {
      if (!id(r?.spinId) || !catalog.raceResultWheels[f.familyId]?.[r.wheelId]?.includes(r.outcomeId))
        fail('INVALID_RACE_RESULT', 'Unknown canonical owner-context result.');
      spins.push(r.spinId); tokens.push(`result:${r.wheelId}:${r.outcomeId}`);
      sources.push({ token: tokens.at(-1), sourceId: f.sourceId, spinId: r.spinId });
    }
    // Identity selectors are single draws; equipment wheels may legitimately repeat.
    const selected = Object.fromEntries(f.results.map(r => [r.wheelId, r.outcomeId]));
    for (const s of identities.identityRoutes[f.familyId].selectors) {
      if (s.when && !Object.entries(s.when).every(([w, ids]) => ids.includes(selected[w]))) continue;
      if (f.results.filter(r => r.wheelId === s.wheelId).length !== 1)
        return { required: [`completed-identity:${f.familyId}:${s.wheelId}`] };
    }
  }
  const roles = input.archetypeIds ?? [];
  unique(roles, 'Archetypes');
  const knownRoles = new Set(catalog.archetypeProfiles.map(p => p.id));
  if (roles.some(r => !knownRoles.has(r))) fail('UNKNOWN_ARCHETYPE', 'Use active canonical Archetype IDs.');
  if (hybridRoles.pairCompatibility.incompatiblePairs.some(p => p.ids.every(r => roles.includes(r))))
    return { required: ['compatible-committed-archetype-pair'] };
  const facts = input.archetypeFacts ?? [];
  if (!Array.isArray(facts)) fail('INVALID_ARCHETYPE_FACTS', 'Archetype event facts must be an array.');
  unique(facts.map(f => f?.archetypeId), 'Archetype fact IDs');
  unique(facts.map(f => f?.sourceId), 'Archetype fact sources');
  if (roles.some(r => !facts.some(f => f.archetypeId === r)))
    return { required: ['committed-archetype-source-facts'] };
  for (const f of facts) {
    if (f.committed !== true || !roles.includes(f.archetypeId) || !Array.isArray(f.results)) fail('INVALID_ARCHETYPE_FACTS', 'Facts must belong to an already committed owner role.');
    for (const r of f.results) {
      if (!id(r?.spinId) || !catalog.archetypeResultWheels[f.archetypeId]?.[r.wheelId]?.includes(r.outcomeId))
        fail('INVALID_ARCHETYPE_RESULT', 'Unknown role event result.');
      spins.push(r.spinId); tokens.push(`result:${r.wheelId}:${r.outcomeId}`);
      sources.push({ token: tokens.at(-1), sourceId: f.sourceId, spinId: r.spinId });
    }
  }
  unique([...input.raceFacts.map(f => f.sourceId), ...facts.map(f => f.sourceId)], 'Race/Archetype invocations');
  if (input.backstoryFact !== undefined) {
    const b = input.backstoryFact;
    if (b?.committed !== true || !id(b.sourceId) || !id(b.spinId) || !backstory.wheel.outcomes.some(o => o.id === b.outcomeId))
      fail('INVALID_BACKSTORY', 'Only an actual canonical committed Backstory source may become likelihood evidence.');
    tokens.push(`backstory:${b.outcomeId}`); sources.push({ token: tokens.at(-1), sourceId: b.sourceId, spinId: b.spinId }); spins.push(b.spinId);
  }
  unique(spins, 'Actual context spins');
  roles.forEach(r => { tokens.push(`archetype:${r}`); sources.push({ token: tokens.at(-1),
    sourceId: facts.find(f => f.archetypeId === r).sourceId }); });
  const weapons = input.weapons ?? [], powers = input.powers ?? [];
  for (const [inventory, name, key] of [[weapons, 'Weapons', 'instanceId'], [powers, 'Powers', 'ownedId']]) {
    if (!Array.isArray(inventory)) fail('INVALID_INVENTORY', `${name} must be an explicit array.`);
    unique(inventory.map(x => x?.[key]), name);
    for (const x of inventory) if (!id(x.definitionId) || !id(x.sourceId) || x.committed !== true ||
        (x.kind !== undefined && x.kind !== 'owned')) fail('INVALID_INVENTORY', 'Only actual committed owned inventory, never targets/companions, belongs here.');
  }
  for (const w of weapons) if (!Object.hasOwn(catalog.weaponTrainingProfiles, w.trainingProfileId ?? 'unclassified')) fail('UNKNOWN_WEAPON_TRAINING', 'Declare a known training profile; never infer it from prose.');
  return { roles, facts, tokens: [...new Set(tokens)], sources, weapons, powers };
}

function chooseProfile(fact, profiles) {
  if (['hybrid', 'raksasa', 'symbiote'].includes(fact.familyId) ||
    (fact.familyId === 'lelembut' && fact.results.some(r => r.wheelId === 'lelembut-imported-type' && ['skeleton', 'zombie'].includes(r.outcomeId)))) return null;
  const route = identities.identityRoutes[fact.familyId].selectors.map(s => s.wheelId);
  const matches = profiles.filter(p => p.familyId === fact.familyId && p.when.every(s => fact.results.some(r => r.wheelId === s.wheelId && s.outcomeIds.includes(r.outcomeId))))
    .map(p => ({ p, specificity: p.when.length * 100 + sum(p.when.map(s => route.indexOf(s.wheelId) + 1)) })).sort((a, b) => b.specificity - a.specificity);
  if (!matches.length) return undefined;
  if (matches[1]?.specificity === matches[0].specificity) fail('AMBIGUOUS_PRIOR', 'Two equally specific race priors match.');
  const p = structuredClone(matches[0].p), base = profiles.find(x => x.familyId === fact.familyId && !x.when.length);
  vector(p.centers, p.id); if (p.centers.some(x => x < 0 || x > 9)) fail('INVALID_PARAMETER', 'Race centers must use raw0..9.');
  p.sizeResponse ??= structuredClone(base?.sizeResponse ?? [0, 0, 0, 0, 0, 0, 0]);
  vector(p.sizeResponse, 'Size response');
  for (const table of Object.values(p.templates ?? {}))
    if (!Array.isArray(table) || table.length !== 10 || table.some(x => !Number.isFinite(x) || x <= 0) || Math.abs(sum(table) - 1) > 1e-12)
      fail('INVALID_TEMPLATE', 'Rank templates require ten positive normalized weights.');
  const depth = Math.max(-1, ...p.when.map(s => route.indexOf(s.wheelId)));
  return { ...p, sourceId: fact.sourceId, encodedResults: [`race:${fact.familyId}`, ...fact.results
    .filter(r => route.indexOf(r.wheelId) >= 0 && route.indexOf(r.wheelId) <= depth)
    .map(r => `result:${r.wheelId}:${r.outcomeId}`)] };
}

function sizeEvidence(input, data, components, model) {
  const p = input.sizePlan, r = input.sizeResult;
  if (!p || !r) return { required: ['committed-normal-form-size'] };
  if (p.runId !== input.runId || p.characterId !== input.characterId ||
      signature(p.identity?.raceFacts ?? []) !== signature(input.raceFacts) ||
      JSON.stringify([...(p.identity?.archetypeIds ?? [])].sort()) !== JSON.stringify([...data.roles].sort()))
    fail('SIZE_OWNER_MISMATCH', 'Use this owner identity and role composition, not an external unit or another character Size.');
  const resolved = resolveSizeResult(p, r);
  // Giant Size is relative to the actual base body, not to its giant milestone midpoint.
  const normalFacts = input.raceFacts.filter(f => f.familyId !== 'raksasa');
  let referencePlan = p;
  if (p.variant === 'giant') referencePlan = planSizeStage({ runId: input.runId, characterId: input.characterId,
    invocationId: `${p.invocationId}:base-reference`, raceFacts: normalFacts, archetypeIds: data.roles });
  let referenceMeters = model.defaultReferenceMeters;
  const mixture = referencePlan.inference?.mixture?.components;
  if (referencePlan.status !== 'ready') return { required: ['giant-base-size-reference'] };
  if (Array.isArray(mixture) && mixture.length) {
    const units = { mm: .001, cm: .01, m: 1, km: 1000 };
    referenceMeters = sum(mixture.map(c => (c.mixtureProbability ?? 1 / mixture.length) *
      c.profile.weighting.center * units[c.profile.range.unit]));
  } else if (referencePlan.profile?.range) {
    const units = { mm: .001, cm: .01, m: 1, km: 1000 };
    referenceMeters = referencePlan.profile.weighting.center * units[referencePlan.profile.range.unit];
  }
  if (!(referenceMeters > 0) || !Number.isFinite(referenceMeters)) fail('INVALID_SIZE_REFERENCE', 'A declared physical reference extent is required.');
  const logRatio = clamp(Math.log2(resolved.size.sizeMeters / referenceMeters), -model.sizeLogLimit, model.sizeLogLimit);
  // A digital avatar, spirit manifestation or nanobot envelope never acquires physical mass.
  const nonPhysical = components.every(c => c.sizeResponse.every(x => x === 0));
  const coefficients = design.statKeys.map((_, i) => nonPhysical ? 0 : sum(components.map(c => c.sizeResponse[i])) / components.length);
  const shift = coefficients.map(c => clamp(c * logRatio * model.sizeStrength, -model.sizeNegativeShiftLimit, model.sizePositiveShiftLimit));
  return { sourceId: r.spinId, invocationId: p.invocationId, outcome: resolved.size,
    sizeVersion: p.version, referenceMeters, logRatio, coefficients, shift, nonPhysical,
    transformationSizeUsed: false, referenceProfile: structuredClone(referencePlan.profile),
    note: 'Authored bounded log extent response; never a literal mass/speed conversion or direct bonus.' };
}

/** Hidden prior + explicitly authored context likelihoods. No random draw or bonus ledger is modified. */
export function buildStatContext(input, options = {}) {
  const catalog = options.catalog ?? design, model = structuredClone(options.model ?? catalog.model);
  if (!id(catalog.version) || JSON.stringify(catalog.statKeys) !== JSON.stringify(design.statKeys) ||
      !Array.isArray(catalog.raceProfiles) || !Array.isArray(catalog.archetypeProfiles) || !Array.isArray(catalog.evidenceRules))
    fail('INVALID_CATALOG', 'Use a versioned seven-axis catalog with explicit priors and likelihood rules.');
  unique(catalog.raceProfiles.map(p => p.id), 'Race profile IDs');
  unique(catalog.evidenceRules.map(p => p.id), 'Likelihood rule IDs');
  validateModel(model);
  const data = validateInput(input, catalog);
  if (data.required) return needs(input, data.required);
  const components = input.raceFacts.map(f => chooseProfile(f, catalog.raceProfiles));
  if (components.some(c => c === undefined)) return needs(input, ['explicit-race-stat-prior']);
  const physical = components.filter(Boolean);
  if (!physical.length) return needs(input, ['actual-host-base-origin-stat-prior']);
  const centers = catalog.statKeys.map((_, i) => model.raceMaximumShare * Math.max(...physical.map(c => c.centers[i])) +
    (1 - model.raceMaximumShare) * sum(physical.map(c => c.centers[i])) / physical.length);
  const roleComponents = data.roles.map(r => structuredClone(catalog.archetypeProfiles.find(p => p.id === r)));
  roleComponents.forEach(p => vector(p.shift, p.id));
  const roleShift = catalog.statKeys.map((_, i) => clamp(sum(roleComponents.map(c => c.shift[i])) * model.archetypeStrength, -model.maximumShift, model.maximumShift));
  const groups = new Map(), applied = [], skipped = [];
  const encoded = new Set(physical.flatMap(c => c.encodedResults));
  for (const rule of catalog.evidenceRules) {
    if (!rule.when.every(t => data.tokens.includes(t))) continue;
    vector(rule.shift, rule.id);
    if (rule.when.every(t => encoded.has(t)) && rule.interaction !== true) { skipped.push({ id: rule.id, reason: 'already-encoded-in-prior' }); continue; }
    const previous = groups.get(rule.group);
    if (!previous || rule.when.length > previous.when.length) groups.set(rule.group, rule);
    else if (rule.when.length === previous.when.length) fail('AMBIGUOUS_LIKELIHOOD', 'Equal-specificity rules in one dependency group require an explicit choice.');
  }
  for (const rule of groups.values()) applied.push(structuredClone(rule));
  const eventShift = catalog.statKeys.map((_, i) => clamp(sum(applied.map(r => r.shift[i])) * model.evidenceStrength, -model.maximumShift, model.maximumShift));
  const size = sizeEvidence(input, data, physical, model);
  if (size.required) return needs(input, size.required);
  const finalCenters = centers.map((c, i) => clamp(c + roleShift[i] + eventShift[i] + size.shift[i], 0, 9));
  const usedTokens = new Set([...encoded, ...applied.flatMap(r => r.when), ...data.roles.map(r => `archetype:${r}`), ...input.raceFacts.map(f => `race:${f.familyId}`)]);
  return { status: 'ready', version: catalog.version, runId: input.runId, characterId: input.characterId,
    invocationId: input.invocationId, model, statKeys: [...catalog.statKeys], hiddenAxes: [...catalog.hiddenAxes],
    ownerContextKey: JSON.stringify([signature(input.raceFacts), data.facts.map(f => [f.archetypeId, f.sourceId,
      f.results.map(r => [r.wheelId, r.outcomeId, r.spinId]).sort()]).sort(), size.sourceId, size.outcome.id,
      ...(input.backstoryFact ? [[input.backstoryFact.outcomeId, input.backstoryFact.sourceId, input.backstoryFact.spinId]] : [])]),
    identity: structuredClone(input.raceFacts), archetypeIds: [...data.roles], archetypeFacts: structuredClone(data.facts),
    contextTokens: [...data.tokens], sourceRecords: structuredClone(data.sources), raceComponents: physical,
    neutralContextSources: structuredClone(data.sources.filter(s => !usedTokens.has(s.token))),
    neutralContextPolicy: 'Preserve unmodeled context; no numeric likelihood or direct effect is invented from its wording.',
    roleComponents, appliedRules: applied, skippedRules: skipped, latent: { raceCenters: centers,
      roleShift, eventShift, sizeShift: [...size.shift], centers: finalCenters, sigma: [...model.sigma] },
    size, inventory: { weapons: structuredClone(data.weapons), powers: structuredClone(data.powers) },
    equalizerActive: data.roles.includes('equaliser'), resilientActive: data.roles.includes('resilient'),
    freezeBeforeDraw: true, finalBonusInputsUsed: false, empiricallyFitted: false };
}

function findRoleResult(context, role, wheel) {
  const rows = context.archetypeFacts.find(f => f.archetypeId === role)?.results.filter(r => r.wheelId === wheel) ?? [];
  if (rows.length > 1) fail('AMBIGUOUS_ROLE_RESULT', 'Single role selectors cannot have multiple results.');
  return rows[0];
}

function maximumGuarantee(context, target) {
  if (!Array.isArray(context?.identity) || !Array.isArray(context?.archetypeFacts)) return null;
  if (target === 'durability') {
    const source = context.identity.find(f => f.familyId === 'lelembut' && matched(f, 'lelembut-imported-type', 'lich'));
    if (source) return { id: 'lich-durability-max', sourceId: source.sourceId, value: 9, scope: 'durability' };
  }
  if (target === 'power-mastery') {
    const god = context.identity.find(f => f.familyId === 'heavenly-principle' && matched(f, 'heavenly-principle-type', 'god'));
    if (god) return { id: 'god-all-power-mastery-max', sourceId: god.sourceId, value: 9, scope: 'all-owned-powers' };
    const vessel = context.archetypeFacts.find(f => f.archetypeId === 'vessel' && matched(f, 'vessel-patron', 'god') &&
      f.results.some(r => r.wheelId === 'vessel-compatibility' && ['compatibility-60', 'compatibility-70', 'compatibility-80', 'compatibility-90', 'compatibility-100'].includes(r.outcomeId)));
    if (vessel) return { id: 'vessel-god-all-power-mastery-max', sourceId: vessel.sourceId, value: 9, scope: 'all-owned-powers' };
  }
  return null;
}

function fixedPlan(common, guarantee) {
  return { ...common, status: 'fixed', actualSpin: false, reason: 'guaranteed-maximum', guarantee,
    baseValue: guarantee.value, outcomes: [], attempts: [], retainedRawValue: null, retainedSpinId: null,
    pawnCategoryValue: null, luckyHitSpinIds: [], luckyHitCount: 0, retryConsumed: false,
    sourceKey: JSON.stringify([common.runId, common.characterId, common.invocationId, 'stat-base']),
    bonusTiming: 'final-only', triggersEnchantNow: false, powerEnchant: false };
}

/** Freeze a wheel for one stat, one owned weapon or the single shared power resolution. */
export function planStatWheel(input, options = {}) {
  const catalog = options.catalog ?? design;
  if (!catalog.statKeys.includes(input?.target)) fail('UNKNOWN_STAT', 'Use one of the seven canonical stat/mastery keys.');
  const context = buildStatContext(input, options);
  if (context.status !== 'ready') return context;
  const target = input.target, index = context.statKeys.indexOf(target), main = index < 5;
  const common = { runId: input.runId, characterId: input.characterId, invocationId: input.invocationId,
    target, kind: main ? 'main-stat' : target, version: context.version, context, freezeBeforeDraw: true };
  const weapon = target === 'weapon-mastery' ? context.inventory.weapons.find(w => w.instanceId === input.weaponInstanceId) : null;
  if (target === 'weapon-mastery' && !weapon) return context.inventory.weapons.length
    ? needs(input, ['owned-weapon-instance']) : { ...common, status: 'skip', reason: 'no-owned-weapon', actualSpin: false };
  if (target === 'power-mastery' && !context.inventory.powers.length)
    return { ...common, status: 'skip', reason: 'no-owned-power', actualSpin: false };
  const exclusions = options.excludedValues ?? [];
  if (!Array.isArray(exclusions) || exclusions.some(v => !Number.isSafeInteger(v) || v < 0 || v > 9) || new Set(exclusions).size !== exclusions.length)
    fail('INVALID_EXCLUSIONS', 'Unique hard-excluded raw values0..9 required.');
  const guarantee = maximumGuarantee(context, target);
  if (guarantee) return exclusions.includes(guarantee.value)
    ? needs(input, ['maximum-guarantee-compatible-with-hard-exclusions']) : fixedPlan(common, guarantee);
  let gambler = null, luckyNumber = null;
  if (context.archetypeIds.includes('gambler')) {
    gambler = findRoleResult(context, 'gambler', 'gambler-type')?.outcomeId;
    if (!gambler) return needs(input, ['committed-gambler-type']);
    if (gambler === 'lucky-number') {
      const r = findRoleResult(context, 'gambler', 'gambler-lucky-number');
      if (!r) return needs(input, ['committed-lucky-number']);
      luckyNumber = Number(r.outcomeId.replace('lucky-number-', ''));
      if (!Number.isSafeInteger(luckyNumber) || luckyNumber < 0 || luckyNumber > 9) fail('INVALID_LUCKY_NUMBER', 'Use the frozen numeric Lucky Number0..9 mapping.');
    }
  }
  if (main && gambler === 'all-in' && target !== 'strength') {
    const source = input.allInResolution;
    if (!source || source.status !== 'resolved' || source.target !== 'strength' || source.runId !== input.runId || source.characterId !== input.characterId || !id(source.retainedSpinId) ||
        source.gambler !== 'all-in' || source.ownerContextKey !== context.ownerContextKey ||
        !Number.isSafeInteger(source.retainedRawValue) || source.retainedRawValue < 0 || source.retainedRawValue > 9 || source.baseValue !== source.retainedRawValue)
      return needs(input, ['committed-all-in-strength-resolution']);
    return { ...common, status: 'copy', actualSpin: false, sourceInvocationId: source.invocationId,
      retainedSpinId: source.retainedSpinId, baseValue: source.baseValue, pawnCategoryValue: source.retainedRawValue, luckyHitCount: 0 };
  }
  const scale = scales.scales.find(s => s.id === `${target}-0-9`);
  let rows = structuredClone(scale.outcomes), guards = [], capException = null;
  if (main && gambler === 'high-roller') {
    rows = [...rows.slice(0, 2), ...rows.slice(-2)]; guards.push({ id: 'high-roller-four-extremes' });
  }
  const kinnara = catalog.constraints.kinnaraInstrument;
  if (weapon?.definitionId === kinnara.definitionId && context.identity.some(f => f.familyId === kinnara.familyId &&
      f.sourceId === weapon.sourceId && matched(f, kinnara.wheelId, kinnara.outcomeId))) {
    rows = rows.filter(o => o.value >= kinnara.minimumValue); guards.push({ id: 'kinnara-instrument-min-master', minimumValue: 5 });
  }
  rows = rows.filter(o => !exclusions.includes(o.value));
  if (!rows.length) return needs(input, ['nonempty-compatible-stat-pool']);
  if (main && gambler === 'high-roller') {
    if (rows.length < 4) return needs(input, ['four-distinct-high-roller-points-compatible-with-guarantees']);
  }
  if (!capException && rows.length * context.model.maximumProbability < 1 - 1e-12)
    return needs(input, ['eligible-pool-large-enough-for-frozen-probability-cap']);
  if (!capException && rows.length * context.model.minimumProbability > 1 + 1e-12)
    return needs(input, ['eligible-pool-small-enough-for-frozen-probability-floor']);
  const training = weapon ? catalog.weaponTrainingProfiles[weapon.trainingProfileId ?? 'unclassified'] : { shift: 0, sigmaMultiplier: 1 };
  if (!Number.isFinite(training.shift) || !Number.isFinite(training.sigmaMultiplier) || training.sigmaMultiplier <= 0) fail('INVALID_WEAPON_TRAINING', 'Finite training shift and positive spread required.');
  const center = clamp(context.latent.centers[index] + training.shift, 0, 9), sigma = context.latent.sigma[index] * training.sigmaMultiplier;
  if (!Number.isFinite(sigma) || sigma < .05) fail('INVALID_WEAPON_TRAINING', 'Effective spread must be finite and at least0.05 raw points.');
  const templateOwner = context.raceComponents.filter(c => c.templates?.[target]).sort((a, b) => b.centers[index] - a.centers[index])[0];
  // Start from a race prior; likelihood is an exponential tilt toward contextual aptitude.
  // Ordinary Gaussian priors reserve positive mass across the whole raw support for lucky pulls.
  const prior = templateOwner ? [...templateOwner.templates[target]] : (() => {
    const q = normalize(fromLogs(Array.from({ length: 10 }, (_, v) => -.5 * ((v - context.latent.raceCenters[index]) / sigma) ** 2)));
    return q.map(p => (1 - context.model.luckyTailMass) * p + context.model.luckyTailMass / 10);
  })();
  const anchor = templateOwner?.centers[index] ?? context.latent.raceCenters[index];
  const logWeights = rows.map(o => Math.log(prior[o.value]) + (center - anchor) * (o.value - anchor) / sigma ** 2);
  const weights = fromLogs(logWeights);
  const uncapped = normalize(weights);
  const final = capException ? [1] : context.equalizerActive ? rows.map(() => 1 / rows.length) : capProbabilities(weights, context.model.maximumProbability, context.model.minimumProbability);
  const decisionPlan = main && gambler === 'double-or-nothing' ? {
    invocationId: `${input.invocationId}:double-or-nothing`, wheelId: 'gambler-double-or-nothing',
    outcomes: [{ id: 'double', probability: .5, multiplier: 2 }, { id: 'nothing', probability: .5, multiplier: 0 }],
    exemptFromStatOutcomeCap: 'Existing separate 1:1 decision wheel; it does not draw raw stat/mastery tiers.' } : null;
  return { ...common, status: 'ready', wheelId: scale.id, scaleVersion: scales.version,
    weaponInstanceId: weapon?.instanceId ?? null, weapon: structuredClone(weapon), gambler, luckyNumber,
    actualSpin: true, guards, capException, excludedValues: [...exclusions],
    distribution: { minimumProbability: context.model.minimumProbability, maximumProbability: context.model.maximumProbability, method: context.equalizerActive ? 'equalizer' : capException ? 'forced-guarantee' : 'floor-reserved-water-filling',
      center, sigma, numericalLogWeightFloor: -550, templateSourceId: templateOwner?.sourceId ?? null, prior, uncappedPosterior: rows.map((o, i) => ({ value: o.value, probability: uncapped[i] })),
      capScope: 'Each actual random attempt; retained/copy/final scores are not draws.' },
    outcomes: rows.map((o, i) => ({ ...o, label: o.label ?? `Intelligence ${o.value}`, probability: final[i],
      displayLabelStatus: o.label === null ? 'numeric-placeholder-source-label-pending' : 'approved' })),
    retryPolicy: { active: context.resilientActive, firstRawMaximum: 5, maximumAttempts: 2, sameFrozenPool: true, retain: 'highest-tie-first' },
    decisionPlan, bonusTiming: 'final-only', powerEnchant: false };
}

/** Five owner stat plans, one per active weapon, and exactly one shared power plan. No RNG. */
export function planStatSuite(input, options = {}) {
  const invocation = (target, suffix = '') => `${input.invocationId}:${target}${suffix}`;
  const mainStats = design.statKeys.slice(0, 5).map(target => planStatWheel({ ...input, target, invocationId: invocation(target) }, options));
  const weaponMasteries = (input.weapons ?? []).map(w => planStatWheel({ ...input, target: 'weapon-mastery', weaponInstanceId: w.instanceId,
    invocationId: invocation('weapon-mastery', `:${w.instanceId}`) }, options));
  const powerMastery = planStatWheel({ ...input, target: 'power-mastery', invocationId: invocation('power-mastery') }, options);
  return { version: STAT_ODDS_VERSION, mainStats, weaponMasteries, powerMastery,
    note: 'Plan each live stage from committed context; suite is an inspection/preview helper, not an eager precommit of later inventory stages.' };
}

function validatePlan(plan) {
  if (plan?.status !== 'ready' || !id(plan.runId) || !id(plan.characterId) || !id(plan.invocationId) ||
    !Array.isArray(plan.outcomes) || !plan.outcomes.length || new Set(plan.outcomes.map(o => o.id)).size !== plan.outcomes.length ||
    new Set(plan.outcomes.map(o => o.value)).size !== plan.outcomes.length || plan.outcomes.some(o => !id(o.id) ||
      !Number.isSafeInteger(o.value) || o.value < 0 || o.value > 9 || o.luckyMatchNumber !== o.value ||
      !Number.isFinite(o.probability) || o.probability <= 0) || Math.abs(sum(plan.outcomes.map(o => o.probability)) - 1) > 1e-12)
    fail('INVALID_FROZEN_PLAN', 'A normalized frozen raw0..9 wheel is required.');
  if (plan.capException && (plan.capException !== 'approved-forced-lich-durability' || plan.target !== 'durability' ||
      plan.outcomes.length !== 1 || plan.outcomes[0].value !== 9 || !plan.guards.some(g => g.id === 'lich-raw-durability9')))
    fail('INVALID_FROZEN_PLAN', 'Only the explicit approved Lich raw9 guarantee bypasses the random-tier cap.');
  // Replay validates the saved bounds; legacy plans without a floor retain zero.
  const floor = plan.distribution?.minimumProbability ?? 0;
  if (!Number.isFinite(floor) || floor < 0 || floor > plan.distribution?.maximumProbability ||
      !(plan.distribution?.maximumProbability > 0 && plan.distribution.maximumProbability <= .3) ||
      (['stat-odds/0.2.0', 'stat-odds/0.3.0', STAT_ODDS_VERSION].includes(plan.version) && (floor < .05 || plan.distribution.maximumProbability > .25)) ||
      (!plan.capException && plan.outcomes.some(o => o.probability < floor - 1e-12 || o.probability > plan.distribution.maximumProbability + 1e-12)))
    fail('INVALID_FROZEN_PLAN', 'A random tier violates its frozen probability bounds.');
}

export function selectStatOutcome(plan, sample) {
  validatePlan(plan);
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('INVALID_RANDOM_SAMPLE', 'One external sample in [0,1) required.');
  let mass = 0;
  for (const row of plan.outcomes) { mass += row.probability; if (sample < mass) return structuredClone(row); }
  return structuredClone(plan.outcomes.at(-1));
}

/** Pure actual-draw resolver. Caller persists each draw/reaction and consumes resolution keys once. */
export function resolveStatDraw(plan, first, retry = null, decision = null) {
  validatePlan(plan);
  const read = r => {
    if (!r || r.invocationId !== plan.invocationId || !id(r.spinId)) fail('INVALID_DRAW', 'Actual spin must belong to this saved invocation.');
    if (plan.context.sourceRecords.some(s => s.spinId === r.spinId) || plan.context.size.sourceId === r.spinId)
      fail('DUPLICATE_DRAW', 'A new stat attempt cannot reuse an earlier context spin ID.');
    const o = plan.outcomes.find(o => o.id === r.outcomeId);
    if (!o) fail('INVALID_DRAW', 'Outcome is outside the frozen eligible wheel.');
    return { ...structuredClone(r), value: o.value, luckyMatchNumber: o.luckyMatchNumber, label: o.label, actualSpin: true };
  };
  const a = read(first), mustRetry = plan.retryPolicy.active && a.value <= plan.retryPolicy.firstRawMaximum;
  if (mustRetry && !retry) return { status: 'retry_required', invocationId: plan.invocationId, first: a,
    retryInvocationId: plan.invocationId, reuseFrozenPlan: true, actualAttemptsCommitted: 1 };
  if (!mustRetry && retry) fail('UNAUTHORIZED_RETRY', 'Only the first raw<=5 with active Resilient grants a retry.');
  const b = retry ? read(retry) : null;
  if (b?.spinId === a.spinId) fail('DUPLICATE_DRAW', 'Actual attempts require distinct spin IDs.');
  const retained = b && b.value > a.value ? b : a, attempts = b ? [a, b] : [a];
  let multiplier = 1;
  if (plan.decisionPlan) {
    if (!decision) return { status: 'decision_required', invocationId: plan.invocationId, attempts, retainedSpinId: retained.spinId, decisionPlan: structuredClone(plan.decisionPlan) };
    if (decision.invocationId !== plan.decisionPlan.invocationId || !id(decision.spinId) || attempts.some(a => a.spinId === decision.spinId)) fail('INVALID_DECISION', 'Commit the actual separate Double/Nothing decision.');
    const row = plan.decisionPlan.outcomes.find(o => o.id === decision.outcomeId);
    if (!row) fail('INVALID_DECISION', 'Unknown frozen Double/Nothing outcome.');
    multiplier = row.multiplier;
  } else if (decision) fail('UNAUTHORIZED_DECISION', 'No Double/Nothing wheel is scheduled.');
  const hits = plan.luckyNumber === null ? [] : attempts.filter(a => a.luckyMatchNumber === plan.luckyNumber).map(a => a.spinId);
  return { status: 'resolved', version: plan.version, runId: plan.runId, characterId: plan.characterId,
    ownerContextKey: plan.context.ownerContextKey, gambler: plan.gambler,
    invocationId: plan.invocationId, target: plan.target, weaponInstanceId: plan.weaponInstanceId,
    attempts, retainedSpinId: retained.spinId, retainedRawValue: retained.value, baseValue: retained.value * multiplier,
    decision: decision ? structuredClone(decision) : null, luckyHitSpinIds: hits, luckyHitCount: hits.length,
    sourceKey: JSON.stringify([plan.runId, plan.characterId, plan.invocationId, 'stat-base']),
    rawOnly: true, bonusTiming: 'final-only', triggersEnchantNow: false, retryConsumed: mustRetry,
    pawnCategoryValue: retained.value };
}

/** Single score projection only; caller completes all mandatory events before global final settlement. */
export function projectFinalScore(resolution, modifiers = []) {
  if (!['resolved', 'copy', 'fixed'].includes(resolution?.status) || !Number.isSafeInteger(resolution.baseValue) || !Array.isArray(modifiers))
    fail('INVALID_FINAL_INPUT', 'Resolved immutable base and distinct applicable final modifiers required.');
  if (resolution.status === 'fixed') {
    const expected = maximumGuarantee(resolution.context, resolution.target);
    if (!expected || expected.id !== resolution.guarantee?.id || expected.sourceId !== resolution.guarantee.sourceId ||
        resolution.baseValue !== expected.value || resolution.actualSpin !== false || resolution.attempts?.length !== 0 ||
        resolution.retainedRawValue !== null || resolution.pawnCategoryValue !== null || resolution.luckyHitCount !== 0)
      fail('INVALID_FINAL_INPUT', 'A fixed maximum requires its committed canonical owner source and no sampled raw result.');
  }
  unique(modifiers.map(m => m?.sourceKey), 'Final modifier sources');
  for (const m of modifiers) if (!Number.isSafeInteger(m.amount)) fail('INVALID_FINAL_MODIFIER', 'Signed integer numeric modifiers required.');
  const bonus = sum(modifiers.map(m => m.amount)), value = resolution.baseValue + bonus;
  if (!Number.isSafeInteger(value)) fail('NUMERIC_OVERFLOW', 'Exact final integer must fit the supported numeric representation.');
  return { baseValue: resolution.baseValue, bonus, finalValue: value, minimum: null, maximum: null,
    modifierSources: structuredClone(modifiers), weaponEnchantThresholdMet: resolution.target === 'weapon-mastery' && value >= 5,
    powerEnchant: false, note: 'Threshold is readiness metadata; actual Enchant eligibility/slot/queue remains the final-phase caller contract.' };
}
