export class ConditionalSizeError extends Error {
  constructor(code, message) { super(message); this.name = 'ConditionalSizeError'; this.code = code; }
}
const fail = (code, message) => { throw new ConditionalSizeError(code, message); };
const id = x => typeof x === 'string' && x.length > 0;
const positive = x => Number.isFinite(x) && x > 0;
const probability = x => Number.isFinite(x) && x >= 0 && x <= 1;
const clone = x => structuredClone(x);

function normaliseLogs(logs) {
  const maximum = Math.max(...logs);
  if (!Number.isFinite(maximum)) return null;
  const weights = logs.map(x => Math.exp(x - maximum));
  const sum = weights.reduce((s, w) => s + w, 0);
  return weights.map(w => w / sum);
}

function validateRule(rule) {
  if (!id(rule.id) || !id(rule.group) || !id(rule.version)) fail('INVALID_SIZE_EVIDENCE_RULE', 'Rules need stable IDs, dependency groups and versions.');
  const when = rule.when;
  if (!when || !Array.isArray(when.all) || !when.all.length)
    fail('INVALID_SIZE_EVIDENCE_RULE', 'Every rule needs explicit positive evidence conditions.');
  for (const tokens of [when.all, when.any ?? [], when.none ?? []]) {
    if (!Array.isArray(tokens) || tokens.some(t => !id(t)) || new Set(tokens).size !== tokens.length)
      fail('INVALID_SIZE_EVIDENCE_RULE', 'Evidence tokens must be unique explicit IDs.');
  }
  if (!Array.isArray(rule.variants) || !rule.variants.length || rule.variants.some(v => !['normal', 'giant'].includes(v)))
    fail('INVALID_SIZE_EVIDENCE_RULE', 'Explicit normal/giant scope required.');
  if (rule.strength !== undefined && (!Number.isFinite(rule.strength) || rule.strength < 0))
    fail('INVALID_SIZE_EVIDENCE_RULE', 'Evidence strength must be finite and nonnegative.');
  if (rule.interaction !== undefined && typeof rule.interaction !== 'boolean')
    fail('INVALID_SIZE_EVIDENCE_RULE', 'Interaction must be an explicit boolean.');
  if (rule.interaction === true && when.all.length < 2)
    fail('INVALID_SIZE_EVIDENCE_RULE', 'An interaction must require at least two jointly observed tokens.');
  const l = rule.likelihood;
  if (l?.kind === 'relative-size') {
    if (!Number.isFinite(l.slope) || (l.pivotMeters !== undefined && !positive(l.pivotMeters)))
      fail('INVALID_SIZE_LIKELIHOOD', 'Relative-size needs a finite signed slope and optional positive pivot.');
  } else if (l?.kind === 'gaussian') {
    if (!positive(l.centerMeters) || !positive(l.sigma) || !['linear', 'log'].includes(l.coordinate))
      fail('INVALID_SIZE_LIKELIHOOD', 'Gaussian needs a positive center/sigma and explicit coordinate.');
  } else if (l?.kind === 'interval') {
    if (!positive(l.minMeters) || !positive(l.maxMeters) || l.minMeters > l.maxMeters ||
        !probability(l.inside) || !probability(l.outside))
      fail('INVALID_SIZE_LIKELIHOOD', 'Interval bounds and likelihoods in [0,1] required.');
  } else if (l?.kind === 'table') {
    if (!l.values || typeof l.values !== 'object' || Array.isArray(l.values) ||
        Object.values(l.values).some(v => !probability(v)) || !probability(l.default))
      fail('INVALID_SIZE_LIKELIHOOD', 'Table likelihoods/default must be in [0,1].');
  } else fail('INVALID_SIZE_LIKELIHOOD', 'Unknown likelihood shape.');
}

function logLikelihood(l, row, pivot) {
  if (l.kind === 'relative-size') {
    const x = l.slope * Math.log(row.sizeMeters / (l.pivotMeters ?? pivot));
    // Stable log(sigmoid(x)); every likelihood remains within [0,1].
    return x >= 0 ? -Math.log1p(Math.exp(-x)) : x - Math.log1p(Math.exp(x));
  }
  if (l.kind === 'gaussian') {
    const coordinate = l.coordinate === 'log' ? Math.log : x => x;
    const z = (coordinate(row.sizeMeters) - coordinate(l.centerMeters)) / l.sigma;
    return -.5 * z * z;
  }
  const value = l.kind === 'table' ? (l.values[row.id] ?? l.default)
    : row.sizeMeters >= l.minMeters && row.sizeMeters <= l.maxMeters ? l.inside : l.outside;
  return value === 0 ? -Infinity : Math.log(value);
}

/** Discrete conditional Bayesian model, with explicit tempered likelihoods and dependency groups. */
export function conditionSizeOdds(rows, evidence, model, { variant = 'normal', equalizerActive = false,
  excludedOutcomeIds = [], weightFactors = {}, encodedEvidence = [] } = {}) {
  if (!model || !id(model.id) || !id(model.version) || !Array.isArray(model.rules))
    fail('INVALID_SIZE_PROBABILITY_MODEL', 'A versioned, explicit conditional model is required.');
  const priorStrength = model.priorStrength ?? 1, evidenceStrength = model.evidenceStrength ?? 1;
  if (![priorStrength, evidenceStrength].every(v => Number.isFinite(v) && v >= 0) || typeof equalizerActive !== 'boolean')
    fail('INVALID_SIZE_PROBABILITY_MODEL', 'Prior/evidence strengths must be finite and nonnegative.');
  if (!Array.isArray(rows) || !rows.length || new Set(rows.map(r => r.id)).size !== rows.length ||
      rows.some(r => !id(r.id) || !positive(r.sizeMeters) || !Number.isFinite(r.probability) || r.probability < 0))
    fail('INVALID_SIZE_PRIOR', 'Unique positive Size candidates and nonnegative prior probabilities required.');
  const priorSum = rows.reduce((s, r) => s + r.probability, 0);
  if (!positive(priorSum)) fail('INVALID_SIZE_PRIOR', 'Prior needs positive total mass.');
  if (!Array.isArray(evidence) || evidence.some(t => !id(t)) || new Set(evidence).size !== evidence.length ||
      !Array.isArray(encodedEvidence) || encodedEvidence.some(t => !evidence.includes(t)))
    fail('INVALID_SIZE_EVIDENCE', 'Use unique observed tokens; encoded tokens must be observed.');
  const known = new Set(rows.map(r => r.id));
  if (!Array.isArray(excludedOutcomeIds) || new Set(excludedOutcomeIds).size !== excludedOutcomeIds.length ||
      excludedOutcomeIds.some(x => !known.has(x)) || !weightFactors || Array.isArray(weightFactors) || typeof weightFactors !== 'object' ||
      Object.entries(weightFactors).some(([k, v]) => !known.has(k) || !Number.isFinite(v) || v < 0))
    fail('INVALID_SIZE_BIAS', 'Explicit known exclusions and nonnegative factors required.');
  const ruleIds = new Set(), matched = [], skipped = [];
  for (const rule of model.rules) {
    validateRule(rule);
    if (ruleIds.has(rule.id)) fail('DUPLICATE_SIZE_RULE', 'Evidence rule IDs must be unique.');
    ruleIds.add(rule.id);
    const w = rule.when;
    if (!rule.variants.includes(variant) || !w.all.every(t => evidence.includes(t)) ||
        ((w.any ?? []).length && !w.any.some(t => evidence.includes(t))) || (w.none ?? []).some(t => evidence.includes(t))) continue;
    const positiveTokens = [...w.all, ...(w.any ?? []).filter(t => evidence.includes(t))];
    if (rule.interaction !== true && positiveTokens.every(t => encodedEvidence.includes(t))) {
      skipped.push({ ruleId: rule.id, reason: 'evidence-already-in-prior' }); continue;
    }
    matched.push({ rule, specificity: w.all.length + ((w.any ?? []).length ? 1 : 0) + (w.none ?? []).length });
  }
  const groups = new Map();
  for (const item of matched) {
    const members = groups.get(item.rule.group) ?? [];
    members.push(item);
    groups.set(item.rule.group, members);
  }
  const selected = [];
  for (const [group, members] of groups) {
    members.sort((a, b) => b.specificity - a.specificity || a.rule.id.localeCompare(b.rule.id));
    if (members[1] && members[0].specificity === members[1].specificity)
      fail('AMBIGUOUS_SIZE_EVIDENCE', `Equally specific rules conflict in group ${group}.`);
    selected.push(members[0].rule);
    members.slice(1).forEach(m => skipped.push({ ruleId: m.rule.id,
      reason: 'replaced-by-conditional-group-rule', by: members[0].rule.id }));
  }
  selected.sort((a, b) => a.id.localeCompare(b.id));
  const eligible = rows.filter(r => !excludedOutcomeIds.includes(r.id));
  if (!eligible.length) fail('EMPTY_SIZE_POSTERIOR', 'All Size candidates were hard-excluded.');
  const pivot = Math.exp(rows.reduce((s, r) => s + r.probability / priorSum * Math.log(r.sizeMeters), 0));
  const traces = eligible.map(row => {
    const prior = row.probability / priorSum;
    let logWeight = prior === 0 ? -Infinity : priorStrength * Math.log(prior);
    const contributions = selected.map(rule => {
      const strength = evidenceStrength * (rule.strength ?? 1);
      if (!Number.isFinite(strength)) fail('INVALID_SIZE_PROBABILITY_MODEL', 'Combined evidence strength must remain finite.');
      const logValue = logLikelihood(rule.likelihood, row, pivot);
      if (strength > 0) logWeight += strength * logValue;
      return { ruleId: rule.id, group: rule.group, strength, logLikelihood: logValue === -Infinity ? null : logValue,
        zeroLikelihood: logValue === -Infinity };
    });
    const factor = weightFactors[row.id] ?? 1;
    logWeight += factor === 0 ? -Infinity : Math.log(factor);
    return { row, prior, contributions, logWeight };
  });
  const posterior = normaliseLogs(traces.map(t => t.logWeight));
  if (!posterior && !equalizerActive) fail('EMPTY_SIZE_POSTERIOR', 'Observed evidence has zero likelihood across the available Size support.');
  const outcomes = traces.map((t, i) => ({ ...clone(t.row), priorProbability: t.prior,
    posteriorProbability: posterior?.[i] ?? null, weight: equalizerActive ? 1 / traces.length : posterior[i],
    probability: equalizerActive ? 1 / traces.length : posterior[i] })).filter(r => r.probability > 0);
  return { outcomes, inference: { mode: 'tempered-conditional-bayesian', modelId: model.id, modelVersion: model.version,
    priorStrength, evidenceStrength, evidence: [...evidence].sort(), encodedEvidence: [...encodedEvidence].sort(),
    appliedRules: selected.map(r => clone(r)), skippedRules: skipped, referencePivotMeters: pivot,
    equalizerActive, unconstrainedPosteriorPossible: posterior !== null,
    candidateTrace: traces.map((t, i) => ({ outcomeId: t.row.id, priorProbability: t.prior,
      posteriorProbability: posterior?.[i] ?? null, contributions: t.contributions })),
    calibration: model.calibration ?? 'Authored game model; not empirically calibrated.' } };
}

/** Coarsen a large posterior into a readable wheel, preserving total probability mass. */
export function compactSizePosterior(rows, count = 12, { equalizerActive = false } = {}) {
  if (!Number.isSafeInteger(count) || count < 2 || count > 128) fail('INVALID_SIZE_DISPLAY_COUNT', 'Display count must be 2–128.');
  if (!Array.isArray(rows) || !rows.length || new Set(rows.map(r => r.id)).size !== rows.length ||
      rows.some(r => !id(r.id) || !positive(r.sizeMeters) || !positive(r.probability)) ||
      Math.abs(rows.reduce((sum, r) => sum + r.probability, 0) - 1) > 1e-12 || typeof equalizerActive !== 'boolean')
    fail('INVALID_SIZE_POSTERIOR', 'Readable projection requires a valid normalized finite posterior.');
  const sorted = clone(rows).sort((a, b) => a.sizeMeters - b.sizeMeters);
  if (sorted.length <= count) return { outcomes: sorted, projection: { mode: 'identity', inputCount: sorted.length, outputCount: sorted.length } };
  const selected = new Set([sorted[0].id, sorted.at(-1).id]);
  for (let j = 1; j < count - 1; j++) {
    const target = j / (count - 1);
    let cumulative = 0;
    for (const r of sorted) { cumulative += r.probability; if (cumulative >= target) { selected.add(r.id); break; } }
  }
  for (const r of [...sorted].sort((a, b) => b.probability - a.probability || a.sizeMeters - b.sizeMeters)) {
    if (selected.size >= count) break;
    selected.add(r.id);
  }
  const representatives = sorted.filter(r => selected.has(r.id)).map(r => ({ ...r, probability: 0,
    baseWeight: 0, weight: 0, priorProbability: 0,
    posteriorProbability: sorted.some(x => x.posteriorProbability === null) ? null : 0, sourceOutcomeIds: [] }));
  const useLog = sorted.at(-1).sizeMeters / sorted[0].sizeMeters >= 10;
  const coord = useLog ? Math.log : x => x;
  for (const row of sorted) {
    const winner = representatives.reduce((best, r) => Math.abs(coord(r.sizeMeters) - coord(row.sizeMeters)) <
      Math.abs(coord(best.sizeMeters) - coord(row.sizeMeters)) ? r : best);
    winner.probability += row.probability;
    winner.baseWeight += row.priorProbability ?? row.probability;
    winner.priorProbability += row.priorProbability ?? row.probability;
    if (winner.posteriorProbability !== null) winner.posteriorProbability += row.posteriorProbability ?? row.probability;
    winner.sourceOutcomeIds.push(row.id);
  }
  if (equalizerActive) representatives.forEach(r => { r.probability = 1 / representatives.length; });
  representatives.forEach(r => { r.weight = r.probability; });
  return { outcomes: representatives, projection: { mode: 'posterior-quantile-nearest-bin', inputCount: sorted.length,
    outputCount: representatives.length, coordinate: useLog ? 'log' : 'linear', probabilityMassPreserved: true,
    interpretation: 'Displayed values represent probability bins, an explicit approximation of the full discrete posterior.' } };
}
