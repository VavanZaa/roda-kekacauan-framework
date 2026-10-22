import design from '../content/size-wheel-design.json' with { type: 'json' };
import identityPolicy from '../content/archetype-eligibility-design.json' with { type: 'json' };
import strengthOrder from '../content/main-wheel-strength-design.json' with { type: 'json' };
import { conditionSizeOdds, compactSizePosterior } from './conditional-size-odds.mjs';

export const SIZE_RULE_VERSION = 'size/0.4.0';
export class SizeInputError extends Error {
  constructor(code, message) { super(message); this.name = 'SizeInputError'; this.code = code; }
}
const fail = (code, message) => { throw new SizeInputError(code, message); };
const units = { mm: 1, cm: 10, m: 1000, km: 1000000 };
const metrics = new Set(['height', 'length', 'diameter', 'wingspan', 'characteristic-dimension']);
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const unique = (xs, code) => {
  if (!Array.isArray(xs) || xs.some(x => !nonempty(x)) || new Set(xs).size !== xs.length)
    fail(code, 'Explicit, unique IDs are required.');
};

function validateProfile(p) {
  if (!p || !nonempty(p.id) || !nonempty(p.version) || !metrics.has(p.metric))
    fail('INVALID_SIZE_PROFILE', 'A versioned profile and explicit body metric are required.');
  const r = p.range;
  if (!r || !Object.hasOwn(units, r.unit) || !Number.isSafeInteger(r.min) ||
      !Number.isSafeInteger(r.max) || r.min <= 0 || r.max <= r.min ||
      !Number.isSafeInteger(r.max * units[r.unit]))
    fail('INVALID_SIZE_RANGE', 'Positive whole-number bounds, a supported unit and min < max are required.');
  const count = p.outcomeCount ?? 12, quantum = p.quantum ?? 1;
  if (!Number.isSafeInteger(count) || count < 2 || count > 128 ||
      !Number.isSafeInteger(quantum) || quantum < 1)
    fail('INVALID_SIZE_STEPS', 'Use 2–128 sample positions and a positive whole-number rounding quantum.');
  if (!['linear', 'exponential', 'auto'].includes(p.spacing ?? 'linear'))
    fail('INVALID_SIZE_SPACING', 'Spacing must be linear, exponential or auto.');
  const threshold = p.exponentialRatioThreshold ?? 10;
  if (!Number.isFinite(threshold) || threshold <= 1)
    fail('INVALID_SIZE_SPACING', 'Automatic exponential spacing requires a ratio threshold greater than one.');
  const spacing = p.spacing === 'auto' ? (r.max / r.min >= threshold ? 'exponential' : 'linear')
    : p.spacing ?? 'linear';
  const mode = p.weighting?.mode ?? 'broad-normal';
  if (!['broad-normal', 'equal'].includes(mode)) fail('INVALID_SIZE_WEIGHTING', 'Unknown Size weighting mode.');
  const center = p.weighting?.center ?? (spacing === 'linear' ? (r.min + r.max) / 2 : Math.sqrt(r.min * r.max));
  const coordinate = x => spacing === 'exponential' ? Math.log(x) : x;
  const sigma = p.weighting?.sigma ?? (coordinate(r.max) - coordinate(r.min)) / 2;
  if (!Number.isFinite(center) || center < r.min || center > r.max || !Number.isFinite(sigma) || sigma <= 0)
    fail('INVALID_SIZE_WEIGHTING', 'The center must be in range and sigma positive in the selected coordinate.');
  return { r, count, quantum, spacing, mode, center, sigma, coordinate };
}

function odds(rows, { equalizerActive = false, excludedOutcomeIds = [], weightFactors = {} } = {}) {
  if (typeof equalizerActive !== 'boolean') fail('INVALID_EQUALIZER', 'Equalizer must be a boolean.');
  unique(excludedOutcomeIds, 'INVALID_SIZE_EXCLUSIONS');
  if (!weightFactors || typeof weightFactors !== 'object' || Array.isArray(weightFactors))
    fail('INVALID_SIZE_WEIGHTS', 'Weight factors must be an outcome-ID map.');
  const known = new Set(rows.map(o => o.id));
  for (const id of [...excludedOutcomeIds, ...Object.keys(weightFactors)]) {
    if (!known.has(id)) fail('UNKNOWN_SIZE_OUTCOME', `Unknown Size outcome ${id}.`);
  }
  for (const factor of Object.values(weightFactors)) {
    if (!Number.isFinite(factor) || factor < 0) fail('INVALID_SIZE_WEIGHTS', 'Weight factors must be finite and nonnegative.');
  }
  const pool = rows.filter(o => !excludedOutcomeIds.includes(o.id)).map(o => ({ ...o,
    weight: equalizerActive ? 1 : o.baseWeight * (weightFactors[o.id] ?? 1) })).filter(o => o.weight > 0);
  const total = pool.reduce((sum, o) => sum + o.weight, 0);
  if (!pool.length || !Number.isFinite(total) || total <= 0)
    fail('EMPTY_SIZE_WHEEL', 'No eligible positive-weight Size outcome remains.');
  return pool.map(o => ({ ...o, probability: o.weight / total }));
}

/** Pure range builder. It never samples RNG, reads prose, or changes character stats. */
export function buildSizeWheel(profile, options = {}) {
  const { r, count, quantum, spacing, mode, center, sigma, coordinate } = validateProfile(profile);
  const merged = new Map();
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const raw = spacing === 'linear' ? r.min + (r.max - r.min) * t : r.min * (r.max / r.min) ** t;
    const value = i === 0 ? r.min : i === count - 1 ? r.max
      : Math.max(r.min, Math.min(r.max, Math.round(raw / quantum) * quantum));
    const sizeMillimeters = value * units[r.unit];
    const weight = mode === 'equal' ? 1 : Math.exp(-0.5 * ((coordinate(raw) - coordinate(center)) / sigma) ** 2);
    if (!Number.isFinite(weight) || weight <= 0) fail('INVALID_SIZE_WEIGHTING', 'Weights must remain finite and positive.');
    const previous = merged.get(sizeMillimeters);
    if (previous) {
      previous.baseWeight = mode === 'equal' ? 1 : previous.baseWeight + weight;
      previous.sampleIndices.push(i);
    } else merged.set(sizeMillimeters, { id: `size-mm-${sizeMillimeters}`, label: `${value.toLocaleString('id-ID')} ${r.unit}`,
      displayValue: value, displayUnit: r.unit, sizeMillimeters, sizeMeters: sizeMillimeters / 1000,
      metric: profile.metric, baseWeight: weight, sampleIndices: [i] });
  }
  return { status: 'ready', version: SIZE_RULE_VERSION, wheelId: 'size-normal', variant: 'normal',
    profile: structuredClone(profile), spacing, weighting: { mode, center, sigma,
      coordinate: spacing === 'exponential' ? 'natural-log' : 'linear' },
    requestedOutcomeCount: count, equalizerActive: options.equalizerActive ?? false,
    outcomes: odds([...merged.values()].sort((a, b) => a.sizeMillimeters - b.sizeMillimeters), options),
    freezeBeforeDraw: true, dispatchRaceEvents: false };
}

function validateFacts(input) {
  const { raceFacts, archetypeIds = [] } = input;
  if (!Array.isArray(raceFacts) || !raceFacts.length) fail('MISSING_SIZE_IDENTITY', 'Committed owner identity facts are required.');
  unique(raceFacts.map(f => f?.sourceId), 'INVALID_SIZE_SOURCE');
  unique(raceFacts.map(f => f?.familyId), 'RACE_FAMILY_REPEATED');
  unique(archetypeIds, 'INVALID_SIZE_ARCHETYPES');
  const roles = new Set(strengthOrder.wheels.archetype.outcomes.map(o => o.id));
  if (archetypeIds.some(id => !roles.has(id))) fail('UNKNOWN_ARCHETYPE', 'Use committed canonical Archetype IDs.');
  const spinIds = [];
  for (const f of raceFacts) {
    if (f.committed !== true || !identityPolicy.runtimeRules.familyIds.includes(f.familyId) || !Array.isArray(f.results))
      fail('INVALID_SIZE_IDENTITY', 'Use a completed owner-only identity projection with explicit result arrays.');
    for (const result of f.results) {
      if (!nonempty(result?.spinId) || !identityPolicy.runtimeRules.validOutcomes[f.familyId]?.[result.wheelId]?.includes(result.outcomeId))
        fail('INVALID_SIZE_RACE_RESULT', 'Unknown or uncommitted canonical race result.');
      spinIds.push(result.spinId);
    }
  }
  unique(spinIds, 'INVALID_SIZE_SPIN_SOURCE');
  for (const key of ['runId', 'characterId', 'invocationId']) {
    if (!nonempty(input[key])) fail('INVALID_SIZE_INVOCATION', `A stable ${key} is required.`);
  }
  if (input.cosmicSizeRewardConsumed !== undefined && typeof input.cosmicSizeRewardConsumed !== 'boolean')
    fail('INVALID_COSMIC_STATE', 'The saved Cosmic-size consumption flag must be a boolean.');
  if (input.bodyMetric !== undefined && !metrics.has(input.bodyMetric)) fail('INVALID_SIZE_METRIC', 'Unknown body metric.');
  return { raceFacts: structuredClone(raceFacts), archetypeIds: [...archetypeIds] };
}

function profileMatch(p, facts, archetypes) {
  validateProfile(p);
  const m = p.matches;
  if (!m || !identityPolicy.runtimeRules.familyIds.includes(m.familyId))
    fail('INVALID_SIZE_MATCH', 'Catalog profiles require an explicit canonical family match.');
  const results = m.results ?? [], roles = m.archetypeIds ?? [];
  unique(roles, 'INVALID_SIZE_MATCH');
  if (roles.some(id => !strengthOrder.wheels.archetype.outcomes.some(o => o.id === id)))
    fail('INVALID_SIZE_MATCH', 'Unknown Archetype selector.');
  if (!Array.isArray(results)) fail('INVALID_SIZE_MATCH', 'Result selectors must be explicit arrays.');
  unique(results.map(r => r.wheelId), 'INVALID_SIZE_MATCH');
  for (const r of results) {
    unique(r.outcomeIds, 'INVALID_SIZE_MATCH');
    if (!r.outcomeIds.length || r.outcomeIds.some(id => !identityPolicy.runtimeRules.validOutcomes[m.familyId]?.[r.wheelId]?.includes(id)))
      fail('INVALID_SIZE_MATCH', 'Unknown race result selector.');
  }
  const fact = facts.find(f => f.familyId === m.familyId);
  const matches = fact && roles.every(id => archetypes.includes(id)) &&
    results.every(r => fact.results.some(x => x.wheelId === r.wheelId && r.outcomeIds.includes(x.outcomeId)));
  // Joint race+role rules precede subtype rules, which precede family defaults.
  return matches ? { profile: p, score: [roles.length ? 1 : 0, results.length, roles.length] } : null;
}

/** Caller supplies its validated, completed owner identity projection, after Backstory. */
export function planLegacySizeStage(input, { profiles = design.rangeProfiles ?? [], ...wheelOptions } = {}) {
  const identity = validateFacts(input);
  const common = { runId: input.runId, characterId: input.characterId, invocationId: input.invocationId,
    identity, cosmicSizeRewardConsumed: input.cosmicSizeRewardConsumed ?? false,
    cosmicTrigger: { ...structuredClone(design.cosmicTrigger), thresholdMeters: design.celestialReferences.planet.meters }, next: 'strength' };
  if (identity.raceFacts.some(f => f.familyId === 'raksasa')) {
    if (Object.keys(wheelOptions.weightFactors ?? {}).length)
      fail('GIANT_WEIGHTS_LOCKED', 'Raksasa keeps the eight equal milestone weights.');
    const metric = input.bodyMetric ?? input.bodySizeProfile?.metric ?? 'characteristic-dimension';
    if (!metrics.has(metric)) fail('INVALID_SIZE_METRIC', 'Unknown giant body metric.');
    const rows = design.wheels.find(w => w.id === 'size-raksasa').outcomes.map(o => ({ id: o.id, label: o.label,
      sizeMeters: o.sizeMeters, sizeMillimeters: o.sizeMeters * 1000, metric, baseWeight: o.baseWeight }));
    return { ...common, status: 'ready', version: SIZE_RULE_VERSION, wheelId: 'size-raksasa', variant: 'giant',
      profile: { id: 'raksasa-milestones', version: SIZE_RULE_VERSION, metric },
      outcomes: odds(rows, wheelOptions), equalizerActive: wheelOptions.equalizerActive ?? false,
      freezeBeforeDraw: true, dispatchRaceEvents: false };
  }
  if (input.bodySizeProfile) {
    const p = input.bodySizeProfile;
    unique(p.sourceIds, 'INVALID_BODY_SIZE_SCOPE');
    const sources = identity.raceFacts.map(f => f.sourceId).sort();
    if (JSON.stringify([...p.sourceIds].sort()) !== JSON.stringify(sources))
      fail('INVALID_BODY_SIZE_SCOPE', 'A frozen body/composition profile must bind all committed identity sources.');
    return { ...common, ...buildSizeWheel(p, wheelOptions), profileResolution: 'explicit-body' };
  }
  const physical = identity.raceFacts.filter(f => !['hybrid', 'symbiote'].includes(f.familyId) &&
    !(f.familyId === 'lelembut' && f.results.some(r => r.wheelId === 'lelembut-imported-type' && ['skeleton', 'zombie'].includes(r.outcomeId))));
  if (!physical.length || physical.length > 1) return { ...common, status: 'needs_configuration',
    required: ['frozen-body-size-profile'], reason: 'Composite or non-physical identity needs an explicit body range.' };
  if (!Array.isArray(profiles)) fail('INVALID_SIZE_CATALOG', 'Size profiles must be an array.');
  unique(profiles.map(p => p.id), 'INVALID_SIZE_CATALOG');
  const candidates = profiles.map(p => profileMatch(p, physical, identity.archetypeIds)).filter(Boolean);
  candidates.sort((a, b) => b.score[0] - a.score[0] || b.score[1] - a.score[1] || b.score[2] - a.score[2]);
  if (!candidates.length) return { ...common, status: 'needs_configuration',
    required: [`size-profile:${physical[0].familyId}`], reason: 'No declared range for this selected body; there is no Human fallback.' };
  if (candidates[1] && JSON.stringify(candidates[0].score) === JSON.stringify(candidates[1].score))
    return { ...common, status: 'needs_configuration', required: ['unambiguous-size-profile'],
      candidateIds: candidates.filter(c => JSON.stringify(c.score) === JSON.stringify(candidates[0].score)).map(c => c.profile.id) };
  return { ...common, ...buildSizeWheel(candidates[0].profile, wheelOptions), profileResolution: 'race-archetype-match' };
}

function observedSizeEvidence(identity) {
  const tokens = [], sources = [];
  for (const fact of identity.raceFacts) {
    tokens.push(`race:${fact.familyId}`);
    sources.push({ token: `race:${fact.familyId}`, sourceId: fact.sourceId });
    for (const r of fact.results) {
      const token = `result:${fact.familyId}:${r.wheelId}:${r.outcomeId}`;
      if (!tokens.includes(token)) { tokens.push(token); sources.push({ token, sourceId: r.spinId }); }
    }
  }
  for (const role of identity.archetypeIds) {
    tokens.push(`archetype:${role}`);
    sources.push({ token: `archetype:${role}`, sourceId: null, source: 'committed caller Archetype IDs' });
  }
  return { tokens, sources };
}

function encodedProfileEvidence(profile, facts) {
  const m = profile.matches;
  if (!m) return [];
  const fact = facts.find(f => f.familyId === m.familyId);
  if (!fact) return [];
  return [`race:${m.familyId}`, ...(m.archetypeIds ?? []).map(r => `archetype:${r}`),
    ...(m.results ?? []).flatMap(r => fact.results.filter(x => x.wheelId === r.wheelId && r.outcomeIds.includes(x.outcomeId))
      .map(x => `result:${m.familyId}:${x.wheelId}:${x.outcomeId}`))];
}

function mixRaceSizePriors(input, identity, profiles, model) {
  if (!Array.isArray(profiles)) fail('INVALID_SIZE_CATALOG', 'Size profiles must be an array.');
  unique(profiles.map(p => p.id), 'INVALID_SIZE_CATALOG');
  const physical = identity.raceFacts.filter(f => !['hybrid', 'symbiote', 'raksasa'].includes(f.familyId) &&
    !(f.familyId === 'lelembut' && f.results.some(r => r.wheelId === 'lelembut-imported-type' && ['skeleton', 'zombie'].includes(r.outcomeId))));
  if (!physical.length) return { status: 'needs_configuration', required: ['physical-body-size-profile'] };
  const components = [], encoded = [];
  for (const fact of physical) {
    const choices = profiles.map(p => profileMatch(p, [fact], identity.archetypeIds)).filter(Boolean)
      .sort((a, b) => b.score[0] - a.score[0] || b.score[1] - a.score[1] || b.score[2] - a.score[2]);
    if (!choices.length) return { status: 'needs_configuration', required: [`size-profile:${fact.familyId}`] };
    if (choices[1] && JSON.stringify(choices[0].score) === JSON.stringify(choices[1].score))
      return { status: 'needs_configuration', required: ['unambiguous-size-profile'], candidateIds: choices.map(c => c.profile.id) };
    const p = choices[0].profile;
    components.push({ familyId: fact.familyId, sourceId: fact.sourceId, profile: structuredClone(p), wheel: buildSizeWheel(p) });
    encoded.push(...encodedProfileEvidence(p, [fact]));
  }
  let metric = components[0].profile.metric;
  const mixedMetrics = components.some(c => c.profile.metric !== metric);
  let metricProjection = null;
  if (mixedMetrics) {
    const policy = model.compositionMetricPolicy;
    const declared = policy?.mode === 'declared-principal-extent' &&
      policy.targetMetric === 'characteristic-dimension' && components.every(c =>
        c.profile.compositionAxis?.fromMetric === c.profile.metric &&
        c.profile.compositionAxis?.targetMetric === policy.targetMetric &&
        c.profile.compositionAxis?.scale === 1);
    if (!declared) return { status: 'needs_configuration', required: ['mixed-body-metric-profile'],
      reason: 'Different metrics require a declared principal-extent projection or an explicit body range.' };
    metric = policy.targetMetric;
    metricProjection = { ...structuredClone(policy), components: components.map(c => ({
      familyId: c.familyId, sourceId: c.sourceId, profileId: c.profile.id,
      ...structuredClone(c.profile.compositionAxis) })) };
  }
  const influences = model.mixtureWeights ?? {};
  const known = new Set([...identityPolicy.runtimeRules.familyIds, ...profiles.map(p => p.id)]);
  if (!influences || typeof influences !== 'object' || Array.isArray(influences) ||
      Object.entries(influences).some(([key, weight]) => !known.has(key) || !Number.isFinite(weight) || weight < 0))
    fail('INVALID_SIZE_MIXTURE', 'Race/profile mixture weights must use known IDs and nonnegative finite numbers.');
  components.forEach(c => { c.influence = influences[c.profile.id] ?? influences[c.familyId] ?? 1; });
  const total = components.reduce((sum, c) => sum + c.influence, 0);
  if (!Number.isFinite(total) || total <= 0) fail('INVALID_SIZE_MIXTURE', 'At least one race component must have positive influence.');
  if (components.length === 1) return { ...components[0].wheel,
    encodedEvidence: [...new Set(encoded)], mixture: { mode: 'single-profile', components: components.map(({ wheel, ...c }) => ({ ...c, mixtureProbability: 1 })) } };
  const unit = components.every(c => c.profile.range.unit === components[0].profile.range.unit)
    ? components[0].profile.range.unit
    : ['km', 'm', 'cm', 'mm'].find(u => components.every(c => c.wheel.outcomes.every(o => Number.isSafeInteger(o.sizeMillimeters / units[u]))));
  const rows = new Map();
  for (const c of components) {
    for (const o of c.wheel.outcomes) {
      const mass = c.influence / total * o.probability;
      const prev = rows.get(o.id);
      const origin = { familyId: c.familyId, sourceId: c.sourceId, profileId: c.profile.id, priorMass: mass };
      if (prev) { prev.probability += mass; prev.baseWeight += mass; prev.origins.push(origin); }
      else {
        const displayValue = o.sizeMillimeters / units[unit];
        if (!Number.isSafeInteger(displayValue))
          fail('INVALID_SIZE_MIXTURE', 'Choose an explicit display unit/body profile when mixed units cannot produce whole labels.');
        rows.set(o.id, { ...o, metric, displayUnit: unit, displayValue, label: `${displayValue.toLocaleString('id-ID')} ${unit}`,
          baseWeight: mass, probability: mass, origins: [origin] });
      }
    }
  }
  const outcomes = [...rows.values()].sort((a, b) => a.sizeMeters - b.sizeMeters);
  return { status: 'ready', version: SIZE_RULE_VERSION, wheelId: 'size-normal', variant: 'normal',
    profileResolution: 'probabilistic-race-mixture', profile: { id: 'composite-size-prior', version: model.version, metric,
      range: { min: outcomes[0].displayValue, max: outcomes.at(-1).displayValue, unit },
      dimensionSemantics: mixedMetrics ? 'declared-composite-principal-extent' : 'shared-component-metric',
      sourceIds: identity.raceFacts.map(f => f.sourceId) },
    outcomes, encodedEvidence: [...new Set(encoded)], freezeBeforeDraw: true, dispatchRaceEvents: false,
    mixture: { mode: 'weighted-race-mixture', metricProjection,
      interpretation: 'Editable uncertainty about which body component dominates Size; not simultaneous independent measurements.',
      components: components.map(({ wheel, ...c }) => ({ ...c, mixtureProbability: c.influence / total })) } };
}

/** New character context => new conditional wheel; frozen old draws remain unchanged. */
export function planSizeStage(input, options = {}) {
  const { probabilityModel = design.probabilisticModel, profiles = design.rangeProfiles ?? [], ...wheelOptions } = options;
  if (probabilityModel === null) return planLegacySizeStage(input, { profiles, ...wheelOptions });
  const identity = validateFacts(input);
  if (!probabilityModel) fail('MISSING_SIZE_PROBABILITY_MODEL', 'Explicit conditional model required; use null only for deliberate legacy planning.');
  const common = { runId: input.runId, characterId: input.characterId, invocationId: input.invocationId, identity,
    cosmicSizeRewardConsumed: input.cosmicSizeRewardConsumed ?? false,
    cosmicTrigger: { ...structuredClone(design.cosmicTrigger), thresholdMeters: design.celestialReferences.planet.meters }, next: 'strength' };
  const base = identity.raceFacts.some(f => f.familyId === 'raksasa') || input.bodySizeProfile
    ? planLegacySizeStage(input, { profiles }) : mixRaceSizePriors(input, identity, profiles, probabilityModel);
  if (base.status !== 'ready') return { ...common, ...base };
  const observed = observedSizeEvidence(identity);
  const encodedEvidence = base.encodedEvidence ?? encodedProfileEvidence(base.profile, identity.raceFacts);
  const conditioned = conditionSizeOdds(base.outcomes, observed.tokens, probabilityModel,
    { ...wheelOptions, variant: base.variant, encodedEvidence });
  const compact = compactSizePosterior(conditioned.outcomes, probabilityModel.displayOutcomeCount ?? 12, wheelOptions);
  return { ...common, ...base, version: SIZE_RULE_VERSION, outcomes: compact.outcomes,
    equalizerActive: wheelOptions.equalizerActive ?? false,
    probabilityModel: structuredClone(probabilityModel), inference: { ...conditioned.inference,
      evidenceSources: observed.sources, mixture: base.mixture ?? { mode: 'explicit-body-or-giant' },
      fullPosterior: conditioned.outcomes, projection: compact.projection },
    freezeBeforeDraw: true };
}

function validateFrozenOutcomes(plan) {
  if (plan?.status !== 'ready' || !Array.isArray(plan.outcomes) || !plan.outcomes.length ||
      new Set(plan.outcomes.map(o => o.id)).size !== plan.outcomes.length ||
      plan.outcomes.some(o => !nonempty(o.id) || !Number.isFinite(o.probability) || o.probability <= 0 ||
        !Number.isSafeInteger(o.sizeMillimeters) || o.sizeMillimeters <= 0 ||
        o.sizeMeters !== o.sizeMillimeters / 1000 || !metrics.has(o.metric)) ||
      Math.abs(plan.outcomes.reduce((s, o) => s + o.probability, 0) - 1) > 1e-12)
    fail('INVALID_SIZE_PLAN', 'A completed frozen odds plan is required.');
}

export function selectSizeOutcome(plan, sample) {
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('INVALID_RANDOM_SAMPLE', 'One RNG sample in [0,1) is required.');
  validateFrozenOutcomes(plan);
  let total = 0;
  for (const row of plan.outcomes) { total += row.probability; if (sample < total) return structuredClone(row); }
  return structuredClone(plan.outcomes.at(-1));
}

/** Resolve a recorded draw; the caller atomically consumes effect/event keys in its ledger. */
export function resolveSizeResult(plan, result) {
  validateFrozenOutcomes(plan);
  if (!nonempty(plan.runId) || !nonempty(plan.characterId) || !nonempty(plan.invocationId) ||
      result?.invocationId !== plan.invocationId || !nonempty(result.spinId) ||
      !nonempty(plan.cosmicTrigger?.id) || !nonempty(plan.cosmicTrigger?.wheelId) ||
      !Number.isFinite(plan.cosmicTrigger?.thresholdMeters) || plan.cosmicTrigger.thresholdMeters <= 0 ||
      typeof plan.cosmicSizeRewardConsumed !== 'boolean')
    fail('INVALID_SIZE_RESULT', 'Resolve only a result from this frozen Size invocation.');
  const outcome = plan.outcomes.find(o => o.id === result.outcomeId);
  if (!outcome) fail('INVALID_SIZE_RESULT', 'The recorded outcome must belong to the frozen eligible pool.');
  const activationKey = JSON.stringify([plan.runId, plan.characterId, plan.cosmicTrigger.id]);
  const cosmic = outcome.sizeMeters > plan.cosmicTrigger.thresholdMeters && !plan.cosmicSizeRewardConsumed;
  return { status: 'resolved', version: plan.version, invocationId: plan.invocationId, spinId: result.spinId,
    size: { ...structuredClone(outcome), profile: structuredClone(plan.profile) },
    effects: [{ type: 'record-size', sourceKey: JSON.stringify([plan.runId, plan.characterId, plan.invocationId, 'record-size']),
      sizeMeters: outcome.sizeMeters, sizeMillimeters: outcome.sizeMillimeters, metric: outcome.metric }],
    followups: cosmic ? [{ wheelId: plan.cosmicTrigger.wheelId, drawCount: 1, activationKey,
      timing: 'after-size-reaction-before-strength', returnTo: 'strength' }] : [], next: plan.next };
}
