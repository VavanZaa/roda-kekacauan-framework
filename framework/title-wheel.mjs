import { createHash } from 'node:crypto';
import catalog from '../content/title-wheel-design.json' with { type: 'json' };
import weapons from '../content/weapon-wheel-design.json' with { type: 'json' };
import powers from '../content/main-power-wheel-design.json' with { type: 'json' };
import themes from '../content/universal-power-wheels-design.json' with { type: 'json' };
import chaos from '../content/chaos-wheel-design.json' with { type: 'json' };
import weaknessCatalog from '../content/weakness-wheel-design.json' with { type: 'json' };
import { buildStatContext, projectFinalScore } from './stat-odds.mjs';
import { buildTitleShortlist } from './title-shortlist.mjs';
import { collectElementContextTags } from './element-context.mjs';

export const TITLE_WHEEL_VERSION = 'title-odds/1.0.0';
export class TitleWheelError extends Error {
  constructor(code, message) { super(message); this.name = 'TitleWheelError'; this.code = code; }
}
const fail = (code, text) => { throw new TitleWheelError(code, text); };
const id = x => typeof x === 'string' && x.trim().length > 0;
const key = (...xs) => JSON.stringify(xs);
const copy = x => structuredClone(x);
const digest = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const mainStats = ['strength', 'speed', 'durability', 'intelligence', 'fight'];
const canonicalFile = x => String(x ?? '').replaceAll('\\', '/').replace(/^content\//, '');
const definitionKey = x => key(canonicalFile(x.definitionFile), x.definitionId);
function validateHiddenDefinition(e) {
  if (e && (!['stat-flat-modifier', 'one-weapon-mastery-modifier', 'shared-power-mastery-modifier'].includes(e.type) ||
      e.amount !== 1 || e.calculation !== 'final-only' || (e.type === 'stat-flat-modifier' && !mainStats.includes(e.stat))))
    fail('INVALID_TITLE_EFFECT', 'Only authored bounded+1 recipes are allowed.');
}

function validateCatalog(c) {
  if (c.version !== 'title-wheel/1.0.0' || !Array.isArray(c.titles) || c.titles.length < 200 ||
      c.wheel.contextualSlots !== 12 || c.wheel.recehSlots !== 4) fail('INVALID_TITLE_CATALOG', 'Versioned200++ catalogue and12/4 layout required.');
  if (new Set(c.titles.map(t => t.id)).size !== c.titles.length ||
      new Set(c.titles.map(t => t.label.toLocaleLowerCase('id-ID'))).size !== c.titles.length)
    fail('DUPLICATE_TITLE', 'Canonical IDs and displayed titles must be unique.');
  for (const t of c.titles) {
    if (!id(t.id) || !id(t.label) || !['contextual', 'receh'].includes(t.kind) ||
        t.baseWeight !== 1 || typeof t.funnyResult !== 'boolean' ||
        !Array.isArray(t.eligibility?.allTags) || !Array.isArray(t.eligibility?.anyTags) ||
        !Array.isArray(t.affinityTags)) fail('INVALID_TITLE_RECIPE', 'Explicit predicates and recipe flags needed.');
    const e = t.hiddenEvent;
    validateHiddenDefinition(e);
  }
}

export function createTitleUsage(seriesId = 'roda-kekacauan-main') {
  if (!id(seriesId)) fail('INVALID_TITLE_SERIES', 'Explicit stable series ID needed.');
  return { schemaVersion: 'title-usage/1.0', seriesId, revision: 0, claims: {}, characters: {} };
}

export function validateTitleUsage(state, c = catalog) {
  validateCatalog(c);
  if (state?.schemaVersion !== 'title-usage/1.0' || !id(state.seriesId) || !Number.isSafeInteger(state.revision) || state.revision < 0 ||
      !state.claims || typeof state.claims !== 'object' || Array.isArray(state.claims) ||
      !state.characters || typeof state.characters !== 'object' || Array.isArray(state.characters))
    fail('INVALID_TITLE_USAGE', 'Do not reset unknown/corrupt saved usage.');
  if (Object.keys(state.claims).length !== state.revision || Object.keys(state.characters).length !== state.revision)
    fail('INVALID_TITLE_USAGE', 'Usage revision and unique claims must agree.');
  for (const [titleId, claim] of Object.entries(state.claims)) {
    validateHiddenDefinition(claim.receipt?.hiddenEvent);
    if (!c.titles.some(t => t.id === titleId) || claim.titleId !== titleId || !id(claim.characterKey) ||
        state.characters[claim.characterKey] !== titleId || claim.receipt?.titleId !== titleId ||
        claim.receipt.seriesId !== state.seriesId || !id(claim.receipt.resultId) ||
        key(claim.receipt.runId, claim.receipt.characterId) !== claim.characterKey)
      fail('INVALID_TITLE_USAGE', 'Each used title requires one matching saved character receipt.');
  }
  return state;
}

export function titleUsageFingerprint(state) {
  validateTitleUsage(state);
  return digest([state.seriesId, state.revision, Object.entries(state.claims).map(([k, v]) => [k, v.characterKey, v.receipt.resultId]).sort()]);
}

/** Uses completed owner facts; projected known bonuses are provisional, never settled final scores. */
export function buildTitleContext(input) {
  if (![input?.runId, input?.characterId, input?.invocationId, input?.seriesId].every(id))
    fail('INVALID_TITLE_INVOCATION', 'Stable owner/invocation/series IDs required.');
  if (input.completedThrough !== 'apex' || input.apexReceipt?.committed !== true || !id(input.apexReceipt.sourceKey))
    return { status: 'needs_configuration', required: ['completed-Roda-Kekacauan-and-children'] };
  const core = buildStatContext(input);
  if (core.status !== 'ready') return core;
  const tags = new Set(core.contextTokens);
  if (!chaos.openingWheel.outcomes.some(o => o.id === input.apexReceipt.outcomeId))
    fail('INVALID_TITLE_APEX_PROOF', 'Completed Roda Kekacauan result must use its canonical ID.');
  tags.add('apex:' + input.apexReceipt.outcomeId);
  const effectIds = input.apexReceipt.effectResultIds ?? [];
  if (!Array.isArray(effectIds) || effectIds.length !== (input.apexReceipt.outcomeId === 'chaos-none' ? 0 : 1))
    return { status: 'needs_configuration', required: ['selected-Chaos/Divine-event-proof'] };
  for (const resultId of effectIds) {
    if (!chaos.recipes.some(r => r.id === resultId && r.branchId === input.apexReceipt.outcomeId))
      fail('INVALID_TITLE_APEX_PROOF', 'Completed event must belong to the selected Chaos/Divine branch.');
    tags.add('apex-effect:' + resultId);
  }
  if (!Array.isArray(input.weaknesses)) return { status: 'needs_configuration', required: ['explicit-active-weakness-inventory'] };
  for (const w of input.weaknesses) {
    if (w.committed !== true || !id(w.sourceId) || !id(w.ownedId) || !id(w.definitionId))
      fail('INVALID_TITLE_WEAKNESS_PROOF', 'Actual owned weakness sources required.');
    if (w.active !== false && canonicalFile(w.definitionFile) === 'weakness-wheel-design.json' &&
        weaknessCatalog.recipes.some(r => r.id === w.definitionId)) tags.add('weakness:' + w.definitionId);
  }
  core.identity.forEach(f => tags.add('race:' + f.familyId));
  if (core.archetypeIds.length) tags.add('has-archetype');
  const provisional = {}, proof = [];
  for (const stat of mainStats) {
    const r = input.statResults?.[stat];
    if (!r) return { status: 'needs_configuration', required: ['completed-main-stat:' + stat] };
    const proofKey = r.sourceKey ?? (r.status === 'copy' && id(r.sourceInvocationId) ? key('all-in-copy', stat, r.sourceInvocationId) : null);
    if (r.runId !== input.runId || r.characterId !== input.characterId || r.target !== stat ||
        !['resolved', 'fixed', 'copy'].includes(r.status) || (r.ownerContextKey ?? r.context?.ownerContextKey) !== core.ownerContextKey || !id(proofKey))
      fail('TITLE_STAT_OWNER_MISMATCH', 'Use this owner completed immutable stat results.');
    if (r.status === 'copy' && (r.sourceInvocationId !== input.statResults.strength?.invocationId ||
        r.retainedSpinId !== input.statResults.strength?.retainedSpinId ||
        r.baseValue !== input.statResults.strength?.baseValue)) fail('INVALID_TITLE_COPY_PROOF', 'All In copies retain their actual Strength source.');
    if (r.status === 'resolved' && (!Number.isInteger(r.retainedRawValue) || r.retainedRawValue < 0 || r.retainedRawValue > 9 ||
        !id(r.retainedSpinId) || !r.attempts?.some(a => a.spinId === r.retainedSpinId)))
      fail('INVALID_TITLE_RAW_PROOF', 'Completed retained raw and actual spin evidence required.');
    const modifiers = input.preTitleModifiers?.[stat] ?? [];
    if (!Array.isArray(modifiers) || modifiers.some(m => m.committed !== true || !id(m.sourceKey) ||
        !['race','archetype','backstory','size','stats','weapon','power','weakness','apex'].includes(m.stage)))
      fail('FUTURE_TITLE_EVIDENCE', 'Only registered explicitly staged pre-Title modifiers belong in this projection.');
    provisional[stat] = projectFinalScore(r, modifiers).finalValue;
    proof.push([stat, proofKey, r.baseValue, r.retainedRawValue ?? null, modifiers]);
    if (provisional[stat] >= 6) tags.add(stat + '-high');
    if (provisional[stat] === 0) tags.add(stat + '-zero');
  }
  if (core.size.outcome.sizeMeters >= 10 || core.identity.some(f => f.familyId === 'raksasa')) tags.add('giant');
  if (core.size.outcome.sizeMeters <= .5) tags.add('small');
  const activeWeapons = core.inventory.weapons.filter(w => w.active !== false);
  const activePowers = core.inventory.powers.filter(p => p.active !== false);
  for (const [target, instanceId, r] of [
    ...activeWeapons.map(w => ['weapon-mastery', w.instanceId, input.weaponMasteryResults?.[w.instanceId]]),
    ...(activePowers.length ? [['power-mastery', null, input.sharedPowerMastery]] : [])]) {
    if (!r) return { status: 'needs_configuration', required: ['completed-' + target + (instanceId ? ':' + instanceId : '')] };
    if (r.runId !== input.runId || r.characterId !== input.characterId || r.target !== target ||
        (r.ownerContextKey ?? r.context?.ownerContextKey) !== core.ownerContextKey ||
        (instanceId && r.weaponInstanceId !== instanceId)) fail('TITLE_MASTERY_OWNER_MISMATCH', 'Use this owner existing completed mastery.');
    projectFinalScore(r, []);
    proof.push([target, instanceId, r.sourceKey, r.baseValue]);
  }
  if (activeWeapons.length) tags.add('has-weapon');
  if (activePowers.length) tags.add('has-power');
  for (const w of activeWeapons) {
    const d = weapons.weapons.find(x => definitionKey(x.weaponDefinitionRef) === definitionKey(w));
    if (d) d.tags.filter(t => t !== 'funny-result').forEach(t => tags.add('weapon:' + t));
  }
  for (const p of activePowers) {
    const d = powers.recipes.find(x => definitionKey(x.powerDefinitionRef) === definitionKey(p));
    if (d) d.tags.filter(t => t !== 'funny-result').forEach(t => tags.add(t));
    for (const theme of themes.wheels) {
      if (theme.outcomes.some(o => o.effects.some(e => e.type === 'grant-power' && definitionKey(e) === definitionKey(p)))) {
        const tag = { 'power-divine': 'divine', 'power-angelic': 'holy', 'power-holy': 'holy',
          'power-cursed': 'cursed', 'power-demonic': 'abyssal', 'power-cosmic': 'cosmic' }[theme.id];
        if (tag) tags.add(tag);
      }
    }
  }
  const results = core.identity.flatMap(f => f.results);
  collectElementContextTags(core.identity,activePowers).forEach(tag=>tags.add(tag));
  for (const r of results) {
    if (r.wheelId === 'machine-type' && r.outcomeId === 'ai') tags.add('machine-ai');
    if (r.wheelId === 'machine-appliance-item') tags.add('appliance:' + r.outcomeId);
    if (r.wheelId === 'dwarf-gnome-type') tags.add('dwarf-type:' + r.outcomeId);
    if (r.wheelId === 'goblin-orc-troll-type') tags.add('goblinoid-type:' + r.outcomeId);
    if (r.wheelId === 'orc-role' && r.outcomeId === 'shrek') tags.add('shrek');
  }
  for (const f of core.archetypeFacts) for (const r of f.results) {
    if (f.archetypeId === 'royal' && r.wheelId === 'royal-chess-piece' && r.outcomeId === 'pawn') tags.add('royal-pawn');
  }
  // Specialty reputation needs an explicit committed Slayer result, not the character's own Goblin race.
  const slay = input.slayerEvidence;
  if (slay && slay.committed === true && core.archetypeIds.includes('slayer') &&
      slay.targetFamilyId === 'goblinoid' && slay.targetSubtypeId === 'goblin' &&
      Number.isSafeInteger(slay.victims) && slay.victims > 0 && id(slay.sourceKey)) tags.add('slayer-goblin-victims');
  const inventory = { weapons: copy(activeWeapons), powers: copy(activePowers) };
  const inventoryFingerprint = digest(inventory);
  return { status: 'ready', tags: [...tags].sort(), provisional, equalizerActive: core.equalizerActive,
    inventory, inventoryFingerprint, sourceRecords: copy(core.sourceRecords),
    fingerprint: digest([core.ownerContextKey, proof, inventoryFingerprint, input.apexReceipt, input.weaknesses, slay ?? null]),
    summary: { provisionalMainStats: provisional, ownerSizeMeters: core.size.outcome.sizeMeters,
      raceIds: core.identity.map(f => f.familyId), archetypeIds: core.archetypeIds, futureTitleResultsUsed: false },
    projectionIsFinal: false };
}

export function planTitleWheel(input, usage, options = {}) {
  const c = options.catalog ?? catalog;
  validateTitleUsage(usage, c);
  if (input?.seriesId !== usage.seriesId) fail('TITLE_SERIES_MISMATCH', 'Use the requested explicit saved series.');
  const previous = usage.characters[key(input.runId, input.characterId)];
  if (previous) return { status: 'already_titled', actualSpin: false, receipt: copy(usage.claims[previous].receipt) };
  const context = buildTitleContext(input);
  if (context.status !== 'ready') return context;
  const seed = key(input.seriesId, input.runId, input.characterId, input.invocationId);
  const pool = buildTitleShortlist(c, context.tags, Object.keys(usage.claims), seed, context.equalizerActive);
  const mode = input.mode ?? 'production';
  if (!['production', 'preview'].includes(mode)) fail('INVALID_TITLE_MODE', 'Use explicit production or preview mode.');
  if (!pool.outcomes.length) return { status: 'exhausted', actualSpin: false, seriesId: usage.seriesId,
    remainingCatalogCount: c.titles.length - usage.revision, reason: 'no-eligible-unused-title', automaticReset: false };
  return { version: TITLE_WHEEL_VERSION, catalogVersion: c.version, status: 'ready', wheelId: 'title',
    runId: input.runId, characterId: input.characterId, invocationId: input.invocationId, seriesId: usage.seriesId,
    mode, actualSpin: pool.outcomes.length > 1 && mode === 'production',
    freezeBeforeDraw: true, usageRevision: usage.revision, usageFingerprint: titleUsageFingerprint(usage),
    contextFingerprint: context.fingerprint, contextSummary: context.summary,
    inventorySnapshot: context.inventory, inventoryFingerprint: context.inventoryFingerprint,
    sourceRecords: context.sourceRecords, outcomes: pool.outcomes,
    trace: { contextualCount: pool.contextualCount, recehCount: pool.recehCount, eligibleCount: pool.eligibleCount,
      usedCount: pool.usedCount, equalizerActive: context.equalizerActive, softAffinitiesApplied: pool.softAffinitiesApplied,
      shortPool: pool.actualCount < pool.requestedCount, statProbabilityBoundsApplied: false },
    returnTo: 'finalize', bonusesCalculateAt: 'final-only' };
}

function validatePlan(plan) {
  if (plan?.status !== 'ready' || plan.version !== TITLE_WHEEL_VERSION || !plan.freezeBeforeDraw ||
      !id(plan.contextFingerprint) || !id(plan.usageFingerprint) || !Array.isArray(plan.outcomes) || !plan.outcomes.length ||
      new Set(plan.outcomes.map(o => o.id)).size !== plan.outcomes.length ||
      plan.outcomes.some(o => Math.abs(o.probability - 1 / plan.outcomes.length) > 1e-12))
    fail('INVALID_FROZEN_TITLE_PLAN', 'Frozen uniform title shortlist required.');
  for (const o of plan.outcomes) {
    const canonical = catalog.titles.find(t => t.id === o.id);
    if (!canonical || canonical.label !== o.label || canonical.funnyResult !== o.funnyResult ||
        JSON.stringify(canonical.hiddenEvent) !== JSON.stringify(o.hiddenEvent))
      fail('INVALID_FROZEN_TITLE_RECIPE', 'Title wording/flags/effects must be its saved canonical recipe.');
  }
}
export function selectTitleOutcome(plan, sample) {
  validatePlan(plan);
  if (plan.outcomes.length === 1) fail('FIXED_TITLE_HAS_NO_RNG', 'Directly reveal the sole unused eligible title.');
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) fail('INVALID_RANDOM_SAMPLE', 'External sample in[0,1) required.');
  return plan.outcomes[Math.min(plan.outcomes.length - 1, Math.floor(sample * plan.outcomes.length))].id;
}
export function resolveTitleResult(plan, result, usage, { currentContextFingerprint = plan.contextFingerprint } = {}) {
  validatePlan(plan); validateTitleUsage(usage);
  const already = usage.characters[key(plan.runId, plan.characterId)];
  if (already) return { status: 'already_titled', actualSpin: false, receipt: copy(usage.claims[already].receipt) };
  if (usage.seriesId !== plan.seriesId || titleUsageFingerprint(usage) !== plan.usageFingerprint)
    fail('STALE_TITLE_POOL', 'Saved series changed; never consume a result from a stale shown pool.');
  if (currentContextFingerprint !== plan.contextFingerprint) fail('STALE_TITLE_CONTEXT', 'Owner facts changed after this pool was frozen.');
  if (result?.runId !== plan.runId || result.characterId !== plan.characterId || result.invocationId !== plan.invocationId ||
      !id(result.resultId) || (plan.actualSpin && !id(result.spinId))) fail('TITLE_SOURCE_MISMATCH', 'Selected result must belong to this actual frozen invocation.');
  if (plan.actualSpin && plan.sourceRecords.some(r => r.spinId === result.spinId)) fail('DUPLICATE_TITLE_SPIN', 'Title needs its own actual spin ID.');
  const title = plan.outcomes.find(o => o.id === result.outcomeId);
  if (!title || usage.claims[title.id]) fail('UNAVAILABLE_TITLE', 'Only an unused frozen candidate may be assigned.');
  const sourceKey = key(plan.runId, plan.characterId, plan.invocationId, 'title');
  return { status: 'resolved', version: TITLE_WHEEL_VERSION, catalogVersion: plan.catalogVersion,
    runId: plan.runId, characterId: plan.characterId, invocationId: plan.invocationId, seriesId: plan.seriesId,
    titleId: title.id, label: title.label, resultId: result.resultId, sourceKey, mode: plan.mode,
    actualSpin: plan.actualSpin, sourceSpinId: plan.actualSpin ? result.spinId : null,
    funnyResult: title.funnyResult, funnyActualSpinKey: plan.actualSpin && title.funnyResult ? key(plan.runId, plan.characterId, result.spinId) : null,
    titleDefinition: copy(title), hiddenEvent: copy(title.hiddenEvent),
    inventorySnapshot: copy(plan.inventorySnapshot), inventoryFingerprint: plan.inventoryFingerprint,
    contextFingerprint: plan.contextFingerprint, usageFingerprint: plan.usageFingerprint,
    contextFacts: ['Title: ' + title.label], narration: { futureResultsUnknown: true, revealHiddenEventAfterTitle: !!title.hiddenEvent },
    pendingHook: title.funnyResult && plan.actualSpin ? 'existing-Shrek-actual-funny-result-if-owned' : null,
    continuation: 'finalize', bonusTiming: 'final-only', triggersEnchantNow: false };
}
export function applyTitleClaim(usage, receipt) {
  validateTitleUsage(usage);
  const characterKey = key(receipt.runId, receipt.characterId);
  const existing = usage.characters[characterKey];
  if (existing) {
    if (existing !== receipt.titleId || usage.claims[existing].receipt.resultId !== receipt.resultId)
      fail('CHARACTER_ALREADY_TITLED', 'This character already has a different saved result.');
    return copy(usage);
  }
  if (receipt.status !== 'resolved' || receipt.seriesId !== usage.seriesId || usage.claims[receipt.titleId] ||
      receipt.usageFingerprint !== titleUsageFingerprint(usage)) fail('INVALID_TITLE_CLAIM', 'Atomic current unused-title receipt required.');
  const next = copy(usage); next.revision++;
  next.characters[characterKey] = receipt.titleId;
  next.claims[receipt.titleId] = { titleId: receipt.titleId, characterKey, receipt: copy(receipt) };
  validateTitleUsage(next); return next;
}

export function planTitleHiddenEvent(receipt) {
  if (receipt.status !== 'resolved' || !id(receipt.sourceKey)) fail('INVALID_TITLE_RECEIPT', 'Committed title receipt required.');
  const event = receipt.hiddenEvent;
  validateHiddenDefinition(event);
  const sourceKey = key(receipt.sourceKey, 'hidden');
  const common = { sourceKey, runId: receipt.runId, characterId: receipt.characterId,
    titleId: receipt.titleId, inventoryFingerprint: receipt.inventoryFingerprint,
    calculation: 'final-only', continuation: 'finalize', triggersEnchantNow: false };
  if (!event) return { ...common, status: 'skip', effects: [], actualSpin: false };
  if (event.type === 'one-weapon-mastery-modifier') {
    const targets = receipt.inventorySnapshot.weapons;
    if (!targets.length) fail('TITLE_TARGET_MISSING', 'Hidden target must be valid before the title draw.');
    return { ...common, status: targets.length === 1 ? 'fixed' : 'ready',
      actualSpin: targets.length > 1 && receipt.mode !== 'preview',
      outcomes: targets.map(w => ({ id: w.instanceId, probability: 1 / targets.length })),
      event: copy(event), selectionResultIsNumericStat: false, inheritsWeaponFunnyTag: false };
  }
  return { ...common, status: 'fixed', actualSpin: false, effects: [{ type: event.type,
    ...(event.stat ? { stat: event.stat } : {}), amount: event.amount, sourceKey,
    registration: 'immediate', calculation: 'final-only' }] };
}
export function resolveTitleHiddenEvent(plan, selectedWeaponId = null, options = {}) {
  if (options.consumedSourceKeys?.includes(plan.sourceKey)) return { status: 'already_resolved', sourceKey: plan.sourceKey, actualSpin: false };
  if (options.currentInventoryFingerprint && options.currentInventoryFingerprint !== plan.inventoryFingerprint)
    fail('STALE_TITLE_INVENTORY', 'Keep the actual selected owned inventory guard.');
  if (plan.status === 'skip') return { ...copy(plan), status: 'resolved' };
  let effects = copy(plan.effects ?? []);
  if (plan.outcomes) {
    const target = selectedWeaponId ?? (plan.outcomes.length === 1 ? plan.outcomes[0].id : null);
    if (!plan.outcomes.some(o => o.id === target)) fail('TITLE_TARGET_MISSING', 'Resolve the actual uniform owned-weapon selection.');
    effects = [{ type: 'weapon-mastery-modifier', weaponInstanceId: target, amount: 1,
      sourceKey: plan.sourceKey, registration: 'immediate', calculation: 'final-only' }];
  }
  return { ...copy(plan), status: 'resolved', effects, sourceOnce: true,
    atomicCommitRequired: 'modifier-ledger plus consumed-source-key', triggersEnchantNow: false };
}
