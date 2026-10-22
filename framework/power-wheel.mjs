import design from '../content/main-power-wheel-design.json' with { type: 'json' };
import themes from '../content/universal-power-wheels-design.json' with { type: 'json' };
import backstory from '../content/backstory-wheel-design.json' with { type: 'json' };
import statDesign from '../content/stat-odds-design.json' with { type: 'json' };
import { buildStatContext, planStatWheel } from './stat-odds.mjs';
import { resolvePowerTier } from './power-tier.mjs';

export const POWER_ODDS_VERSION = 'power-odds/1.0.0';
export class PowerWheelError extends Error {
  constructor(code, message) { super(message); this.name = 'PowerWheelError'; this.code = code; }
}
const fail = (code, message) => { throw new PowerWheelError(code, message); };
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
const key = (...parts) => JSON.stringify(parts);
const sum = xs => xs.reduce((s, v) => s + v, 0);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const copy = x => structuredClone(x);
const matches = (p, f) => p.familyId === f.familyId && p.when.every(c => f.results.some(r => r.wheelId === c.wheelId && c.outcomeIds.includes(r.outcomeId)));
const roleMatches = (p, f) => p.archetypeId === f.archetypeId && p.when.every(c => f.results.some(r => r.wheelId === c.wheelId && c.outcomeIds.includes(r.outcomeId)));
const needs = (input, required) => ({ status: 'needs_configuration', version: POWER_ODDS_VERSION, runId: input.runId,
  characterId: input.characterId, invocationId: input.invocationId, actualSpin: false, required });
const canonicalFile = f => nonempty(f) && !f.includes('..') && !f.includes('\\') ? (f.startsWith('content/') ? f : 'content/'+f) : null;
function refIdentity(ref) {
  const file = canonicalFile(ref?.definitionFile), mode = ref?.grantMode ?? 'power';
  if (!file || !nonempty(ref?.definitionId) || !['power','authority'].includes(mode) ||
      resolvePowerTier({ definitionFile: file, definitionId: ref.definitionId, grantMode: mode }).status !== 'ok')
    fail('UNKNOWN_CANONICAL_POWER', 'Exact registered canonical definition/file/mode required; never infer from caption.');
  return key(file, ref.definitionId, mode);
}
function ownership(input) {
  if (!Array.isArray(input.powers)) return { required: ['explicit-owned-power-inventory'] };
  if (new Set(input.powers.map(p => p.ownedId)).size !== input.powers.length) fail('DUPLICATE_OWNED_POWER_INSTANCE', 'Owned IDs must be unique.');
  const identities = [];
  for (const p of input.powers) {
    if (!nonempty(p.ownedId) || !nonempty(p.sourceId) || p.committed !== true || (p.kind !== undefined && p.kind !== 'owned'))
      fail('INVALID_POWER_INVENTORY', 'Use committed owned powers, never prey, army or companion capabilities.');
    if (!nonempty(p.definitionFile)) return { required: ['canonical-reference-for-all-owned-powers'] };
    identities.push(refIdentity(p));
  }
  return { identities: [...new Set(identities)], snapshot: copy(input.powers), fingerprint: key(input.powers.map(p =>
    [p.ownedId, refIdentity(p), p.bindingKey ?? null]).sort()) };
}
function validateRecipe(p) {
  if (!nonempty(p?.id) || !nonempty(p.label) || !nonempty(p.scope) || !Number.isInteger(p.tier) || p.tier < 1 || p.tier > 5 ||
      !Number.isInteger(p.catalogOrder) || p.catalogOrder < 1 || p.baseWeight !== 1 || !Array.isArray(p.tags) ||
      new Set(p.tags).size !== p.tags.length || p.tags.some(t => !nonempty(t)) || typeof p.funnyResult !== 'boolean' ||
      p.funnyResult !== p.tags.includes('funny-result') || p.powerDefinitionRef?.grantMode !== 'power' || !nonempty(p.tierPolicyVersion))
    fail('INVALID_POWER_RECIPE', 'Ordinary canonical power with explicit intrinsic tier/scope/tags/source needed.');
  const r = resolvePowerTier({ ...p.powerDefinitionRef, tierPolicyVersion: p.tierPolicyVersion });
  if (r.status !== 'ok' || r.powerTier !== p.tier) fail('POWER_TIER_MISMATCH', 'Recipe must match its canonical intrinsic tier; mastery is separate.');
}
function factors(p) {
  if (!p.tagFactors || Object.entries(p.tagFactors).some(([t, v]) => !nonempty(t) || !Number.isFinite(v) || v < 1 || v > 1.6))
    fail('INVALID_POWER_PRIOR', 'Authored tag factors must be finite1..1.6.');
}
function validateCatalog(c) {
  if (c.version !== 'main-power-wheel/1.0.0' || c.wheel?.id !== 'power' || c.wheel.noneOutcome?.id !== 'power-none' ||
      !Array.isArray(c.recipes) || c.recipes.length !== 160 || new Set(c.recipes.map(p => p.id)).size !== 160 ||
      new Set(c.recipes.map(p => refIdentity(p.powerDefinitionRef))).size !== 160 || [1,2,3,4,5].some(t => c.recipes.filter(p => p.tier === t).length !== 32))
    fail('INVALID_POWER_CATALOG', 'Use160 unique ordinary canonical powers,32 per Tier and one separate None.');
  c.recipes.forEach(validateRecipe);
  const m = c.probabilityModel;
  if (m?.version !== POWER_ODDS_VERSION || !(m.tierSigma > 0) || !Number.isFinite(m.tierSigma) ||
      !(m.luckyTailMass > 0 && m.luckyTailMass < 1) || !(m.maxCombinedTagFactor >= 1 && m.maxCombinedTagFactor <= 2) ||
      !Number.isFinite(m.sizeTierResponse) || m.sizeTierResponse < 0 || !Number.isFinite(m.maxAbsoluteSizeTierShift) || m.maxAbsoluteSizeTierShift < 0 ||
      !Number.isFinite(m.maxRoleTierShift) || m.maxRoleTierShift < 0 ||
      ![m.compositeStrongestShare,m.compositeNoneMinimumShare].every(v => Number.isFinite(v) && v >= 0 && v <= 1) ||
      !Array.isArray(m.noneBounds) || m.noneBounds.length !== 2 || !(m.noneBounds[0] > 0 && m.noneBounds[0] < m.noneBounds[1] && m.noneBounds[1] < 1) ||
      m.godNormalNoneProbability !== .8 || JSON.stringify(m.masterSihirTierFactors) !== JSON.stringify({'1':1,'2':1,'3':3,'4':3,'5':3}))
    fail('INVALID_POWER_MODEL', 'Declared bounded priors, lucky tail, God80% and exact Master Sihir3x required.');
  for (const list of ['raceProfiles','wrapperProfiles','archetypeProfiles','archetypeResultProfiles','backstoryProfiles','raceResultAffinities'])
    if (!Array.isArray(m[list]) || new Set(m[list].map(p => p.id)).size !== m[list].length) fail('INVALID_POWER_MODEL', 'Unique versioned likelihood profiles required.');
  for (const p of m.raceProfiles) {
    factors(p);
    if (!(p.tierCenter >= 1 && p.tierCenter <= 5) || !(p.noneProbability > 0 && p.noneProbability < 1) || !Array.isArray(p.when) ||
        p.when.some(c => !c.outcomeIds?.length || c.outcomeIds.some(id => !statDesign.raceResultWheels[p.familyId]?.[c.wheelId]?.includes(id))))
      fail('INVALID_POWER_PRIOR', 'Race priors need actual canonical owner selectors and valid centers/None.');
  }
  for (const p of m.raceResultAffinities) {
    factors(p);
    if (!p.when?.length || p.when.some(c=>!c.outcomeIds?.length || c.outcomeIds.some(id=>!statDesign.raceResultWheels[p.familyId]?.[c.wheelId]?.includes(id))))
      fail('INVALID_POWER_PRIOR','Element/concept affinities must use actual canonical owner facts.');
  }
  for (const p of [...m.wrapperProfiles,...m.archetypeProfiles,...m.archetypeResultProfiles]) {
    factors(p);
    if (!Number.isFinite(p.tierShift)) fail('INVALID_POWER_PRIOR', 'Finite independent intrinsic-tier shift required.');
    if ('noneOddsMultiplier' in p && (!Number.isFinite(p.noneOddsMultiplier) || p.noneOddsMultiplier <= 0)) fail('INVALID_POWER_PRIOR','Positive None odds multiplier required.');
  }
  m.backstoryProfiles.forEach(p => { factors(p); if (!p.tierFactors || Object.values(p.tierFactors).some(v => !Number.isFinite(v) || v < 1 || v > 1.6)) fail('INVALID_POWER_PRIOR','Gentle Backstory tier factors required.'); });
}
function choose(fact, profiles) {
  const rows = profiles.filter(p => matches(p, fact)).sort((a,b) => b.when.length-a.when.length);
  if (rows[1] && rows[1].when.length === rows[0].when.length) fail('AMBIGUOUS_POWER_PRIOR','Equally specific Power priors require an explicit choice.');
  return rows[0] ? copy(rows[0]) : null;
}
function oneResult(context, archetypeId, wheelId) {
  const rows = context.archetypeFacts.find(f => f.archetypeId === archetypeId)?.results.filter(r => r.wheelId === wheelId) ?? [];
  if (rows.length > 1) fail('AMBIGUOUS_POWER_EVENT','Single selector has multiple actual results.');
  return rows[0];
}
function policies(context) {
  const mage = context.archetypeIds.includes('mage'), chance = oneResult(context,'mage','mage-master-sihir-chance');
  if (mage && !chance) return { required: ['committed-mage-master-sihir-result'] };
  const vessel = context.archetypeIds.includes('vessel'), patron = oneResult(context,'vessel','vessel-patron'), compatibility = oneResult(context,'vessel','vessel-compatibility');
  if (vessel && (!patron || !compatibility)) return { required: ['completed-vessel-patron-and-compatibility'] };
  const actualGod = context.identity.some(f => f.familyId === 'heavenly-principle' && f.results.some(r => r.wheelId === 'heavenly-principle-type' && r.outcomeId === 'god'));
  const fullVesselGod = patron?.outcomeId === 'god' && ['compatibility-90','compatibility-100'].includes(compatibility?.outcomeId);
  return { mage, masterSihir: mage && chance.outcomeId === 'master-sihir', godScarcity: actualGod || fullVesselGod };
}
function requests(context, catalog, policy) {
  const common = { runId: context.runId, characterId: context.characterId, wheelId: 'power', stage: 'power' };
  const rows = [{ ...common, id: key(context.runId,context.characterId,'main-power'), kind: 'main', sourceId: 'main-power-stage',
    requirePower: policy.mage, mageManaged: policy.mage }];
  const add = (sourceId, ruleId, count, requirePower, mageManaged = false) => {
    for (let i=0;i<count;i++) rows.push({ ...common, id: key(context.runId,context.characterId,sourceId,ruleId,i),
      kind: 'extra', sourceId, ruleId, ordinal: i, requirePower, mageManaged });
  };
  if (policy.mage) add(context.archetypeFacts.find(f=>f.archetypeId==='mage').sourceId,'mage-extra',policy.masterSihir?2:1,true,true);
  for (const rule of catalog.generalExtraRules) for (const f of context.identity) if (matches(rule,f)) add(f.sourceId,rule.id,rule.count,rule.requirePower);
  const token = context.contextTokens.find(t=>t.startsWith('backstory:')), backstoryId = token?.slice(10);
  const outcome = backstory.wheel.outcomes.find(o=>o.id===backstoryId);
  const source = context.sourceRecords.find(s=>s.token===token)?.sourceId;
  for (const event of outcome?.eventRules ?? []) if (event.type==='general-power-spin') add(source,event.id,event.count,event.requirePower===true || event.excludeNone===true);
  return rows;
}
/** Inventory is refreshed after each actual acquisition. Requests describe slots, not frozen future pools. */
export function planPowerStage(input, { catalog=design }={}) {
  validateCatalog(catalog);
  const context = buildStatContext(input); if (context.status!=='ready') return context;
  if (input.stage !== 'power' || input.weaponStageComplete !== true) return needs(input,['completed-Weapon-stage-and-Power-cursor']);
  const owned = ownership(input); if (owned.required) return needs(input,owned.required);
  const policy = policies(context); if (policy.required) return needs(input,policy.required);
  const consumed = input.consumedPowerRequestIds ?? [];
  if (!Array.isArray(consumed) || consumed.some(x=>!nonempty(x)) || new Set(consumed).size!==consumed.length) fail('INVALID_POWER_LEDGER','Unique consumed acquisition request IDs required.');
  const acquisitions = requests(context,catalog,policy);
  return { status:'ready',version:POWER_ODDS_VERSION,catalogVersion:catalog.version,runId:input.runId,characterId:input.characterId,
    invocationId:input.invocationId,context,ownership:owned,policy,acquisitions:acquisitions.map(r=>({...r,status:consumed.includes(r.id)?'consumed':'pending'})),
    nextRequestId:acquisitions.find(r=>!consumed.includes(r.id))?.id ?? null,
    continuation:'After every acquisition/owned grant/reaction, refresh inventory and freeze only the next pool; after all slots, one shared Power Mastery.' };
}
function logTags(profile, recipe, heritageTags=[]) {
  const weights = recipe.tags.map(t=>profile.tagFactors[t] ?? 1);
  if (profile.tagFactors['$racial-heritage'] && recipe.tags.some(t=>heritageTags.includes(t))) weights.push(profile.tagFactors['$racial-heritage']);
  return Math.log(Math.max(1,...weights));
}
function commonPlan(input, wheelId, owned) {
  return { version:POWER_ODDS_VERSION, runId:input.runId, characterId:input.characterId, invocationId:input.invocationId, wheelId,
    ownership:owned, freezeBeforeDraw:true, bonusTiming:'final-only', powerEnchant:false };
}
/** One general acquisition; enforce actual source-owned request order and fresh no-repeat inventory. */
export function planPowerWheel(input, { catalog=design, requestId, excludedPowerIds=[] }={}) {
  const stage = planPowerStage(input,{catalog}); if (stage.status!=='ready') return stage;
  const request = stage.acquisitions.find(r=>r.id===(requestId ?? stage.nextRequestId));
  if (!request) return { ...commonPlan(input,'power',stage.ownership),status:'skip',actualSpin:false,reason:'all-power-acquisitions-complete' };
  if (request.status==='consumed') return { ...commonPlan(input,'power',stage.ownership),status:'skip',actualSpin:false,reason:'request-already-consumed',request:copy(request) };
  if (request.id!==stage.nextRequestId) fail('POWER_REQUEST_OUT_OF_ORDER','Finish preceding grant/None/reaction before planning the next pool.');
  if (!Array.isArray(excludedPowerIds) || new Set(excludedPowerIds).size!==excludedPowerIds.length ||
      excludedPowerIds.some(id=>id!=='power-none' && !catalog.recipes.some(p=>p.id===id))) fail('INVALID_POWER_EXCLUSIONS','Unique known hard exclusions required.');
  const owned = new Set(stage.ownership.identities);
  const eligible = catalog.recipes.filter(p=>!excludedPowerIds.includes(p.id) && !owned.has(refIdentity(p.powerDefinitionRef))).map(copy)
    .sort((a,b)=>a.tier-b.tier||a.catalogOrder-b.catalogOrder);
  if (!eligible.length) return needs(input,['nonempty-unowned-power-pool']);
  const c=stage.context,m=catalog.probabilityModel,physicalIds=new Set(c.raceComponents.map(p=>p.familyId));
  const raceProfiles=c.identity.filter(f=>physicalIds.has(f.familyId)).map(f=>choose(f,m.raceProfiles));
  const wrapperProfiles=c.identity.filter(f=>!physicalIds.has(f.familyId)).map(f=>choose(f,m.wrapperProfiles));
  if (!raceProfiles.length || [...raceProfiles,...wrapperProfiles].some(p=>!p)) return needs(input,['explicit-owner-Power-race-wrapper-profile']);
  const roleProfiles=c.archetypeIds.map(r=>m.archetypeProfiles.find(p=>p.archetypeId===r));
  if (roleProfiles.some(p=>!p)) return needs(input,['explicit-owner-Power-role-profile']);
  const roleResultProfiles=c.archetypeFacts.flatMap(f=>m.archetypeResultProfiles.filter(p=>roleMatches(p,f)));
  const raceResultAffinities=c.identity.flatMap(f=>m.raceResultAffinities.filter(p=>matches(p,f)));
  const bId=c.contextTokens.find(t=>t.startsWith('backstory:'))?.slice(10),backstoryProfile=m.backstoryProfiles.find(p=>p.backstoryId===bId);
  const raceCenter=m.compositeStrongestShare*Math.max(...raceProfiles.map(p=>p.tierCenter))+(1-m.compositeStrongestShare)*sum(raceProfiles.map(p=>p.tierCenter))/raceProfiles.length;
  const roleShift=clamp(sum([...roleProfiles,...roleResultProfiles,...wrapperProfiles].map(p=>p.tierShift)),-m.maxRoleTierShift,m.maxRoleTierShift);
  const sizeShift=c.size.nonPhysical?0:clamp(c.size.logRatio*m.sizeTierResponse,-m.maxAbsoluteSizeTierShift,m.maxAbsoluteSizeTierShift);
  const center=clamp(raceCenter+roleShift+sizeShift,1,5);
  const g=[1,2,3,4,5].map(t=>Math.exp(-.5*((t-center)/m.tierSigma)**2));
  const tierLikelihoods=g.map(v=>(1-m.luckyTailMass)*v/sum(g)+m.luckyTailMass/5);
  const priors=raceProfiles.map(p=>p.noneProbability),baseNone=m.compositeNoneMinimumShare*Math.min(...priors)+(1-m.compositeNoneMinimumShare)*sum(priors)/priors.length;
  const logOdds=Math.log(baseNone/(1-baseNone))+sum([...roleProfiles,...wrapperProfiles].map(p=>Math.log(p.noneOddsMultiplier)));
  const beforeGod=clamp(1/(1+Math.exp(-logOdds)),...m.noneBounds);
  const noneAllowed=!request.requirePower&&!excludedPowerIds.includes('power-none');
  let noneProbability=noneAllowed?(stage.policy.godScarcity?m.godNormalNoneProbability:beforeGod):0;
  const heritageTags=[...new Set(raceProfiles.flatMap(p=>Object.keys(p.tagFactors)))];
  const weightRows=eligible.map(p=>{
    const tagFactor=Math.exp(clamp(sum(raceProfiles.map(r=>logTags(r,p)))/raceProfiles.length+
      sum([...roleProfiles,...roleResultProfiles,...wrapperProfiles,...raceResultAffinities].map(r=>logTags(r,p)))+
      (backstoryProfile?logTags(backstoryProfile,p,heritageTags):0),0,Math.log(m.maxCombinedTagFactor)));
    const backstoryTierFactor=backstoryProfile?.tierFactors[p.tier] ?? 1;
    const beforeMage=tierLikelihoods[p.tier-1]*tagFactor*backstoryTierFactor;
    const mageFactor=request.mageManaged&&stage.policy.masterSihir?m.masterSihirTierFactors[p.tier]:1;
    return { beforeMage,mageFactor,weight:beforeMage*mageFactor,tagFactor,backstoryTierFactor };
  });
  const total=sum(weightRows.map(w=>w.weight));
  const outcomes=eligible.map((p,i)=>({...p,probability:(1-noneProbability)*weightRows[i].weight/total,loreWeight:weightRows[i].weight}));
  if (noneAllowed) outcomes.unshift({...copy(catalog.wheel.noneOutcome),probability:noneProbability});
  if (c.equalizerActive) { outcomes.forEach(p=>{p.probability=1/outcomes.length;});noneProbability=noneAllowed?1/outcomes.length:0; }
  const plan={...commonPlan(input,'power',stage.ownership),status:'ready',actualSpin:true,catalogVersion:catalog.version,
    context:c,request:copy(request),outcomes,trace:{policy:stage.policy,raceProfiles,wrapperProfiles,roleProfiles:copy(roleProfiles),
      roleResultProfiles:copy(roleResultProfiles),raceResultAffinities:copy(raceResultAffinities),backstoryProfile:copy(backstoryProfile ?? null),raceCenter,roleShift,sizeShift,center,tierLikelihoods,
      baseNone,noneBeforeGod:beforeGod,noneProbability,noneAllowed,equalizerActive:c.equalizerActive,
      weights:eligible.map((p,i)=>({id:p.id,...weightRows[i]})),excludedOwnedIdentities:stage.ownership.identities,
      statMasteryBoundsApplied:false,weaponTierMassesApplied:false,empiricallyFitted:false},
    continuation:'power-acquisitions-then-one-shared-mastery'};
  validatePlan(plan);return plan;
}

/** Early themed calls need their actual caller and owned inventory, never future Size/stat evidence. */
export function planThemedPowerWheel(input,{wheelId,excludedPowerIds=[]}={}) {
  if (![input?.runId,input?.characterId,input?.invocationId].every(nonempty)) fail('INVALID_POWER_INVOCATION','Stable run/owner/invocation IDs required.');
  const wheel=themes.wheels.find(w=>w.id===wheelId);if (!wheel) fail('UNKNOWN_POWER_THEME','Canonical thematic wheel required.');
  const caller=input.caller;
  if (caller?.committed!==true || !nonempty(caller.sourceId) || !nonempty(caller.sourceStage) || !nonempty(caller.returnTo))
    return needs(input,['actual-source-owned-thematic-caller']);
  const owned=ownership(input);if (owned.required) return needs(input,owned.required);
  const rows=wheel.outcomes.map((o,i)=>{
    const grants=o.effects.filter(e=>e.type==='grant-power');if (grants.length!==1) fail('INVALID_THEME_RECIPE','One canonical grant per thematic result required.');
    const ref={definitionFile:canonicalFile(grants[0].definitionFile),definitionId:grants[0].definitionId,grantMode:'power'};
    const ordinary=design.recipes.find(p=>refIdentity(p.powerDefinitionRef)===refIdentity(ref));
    const d=themes.powers.find(p=>p.id===ref.definitionId),r=resolvePowerTier(ref);
    if (!ordinary && (!d || r.status!=='ok')) fail('UNBOUND_THEME_RECIPE','Canonical source scope and tier required.');
    return {id:o.id,label:o.label,tier:r.powerTier,catalogOrder:i+1,baseWeight:1,powerDefinitionRef:ref,
      scope:d?.scope ?? ordinary.scope,tags:copy(d?.affinityTags ?? ordinary.tags.filter(t=>t!=='funny-result')),
      funnyResult:false,tierPolicyVersion:r.tierPolicyVersion,masteryPolicy:'owner-single-shared-resolution'};
  });
  if (!Array.isArray(excludedPowerIds)||excludedPowerIds.some(id=>!rows.some(p=>p.id===id))) fail('INVALID_POWER_EXCLUSIONS','Known themed exclusions required.');
  const eligible=rows.filter(p=>!excludedPowerIds.includes(p.id)&&!owned.identities.includes(refIdentity(p.powerDefinitionRef)))
    .sort((a,b)=>a.tier-b.tier||a.catalogOrder-b.catalogOrder);
  if (!eligible.length) return needs(input,['nonempty-unowned-'+wheelId+'-pool']);
  const request={id:key(input.runId,input.characterId,caller.sourceId,input.invocationId,wheelId),kind:'themed',sourceId:caller.sourceId,requirePower:true,mageManaged:false};
  const plan={...commonPlan(input,wheelId,owned),status:'ready',actualSpin:true,catalogVersion:themes.version,
    request,caller:copy(caller),outcomes:eligible.map(p=>({...copy(p),probability:1/eligible.length})),
    trace:{noneAllowed:false,noneProbability:0,equalizerActive:false,thematicBaseEqual:true,statMasteryBoundsApplied:false},continuation:caller.returnTo};
  validatePlan(plan);return plan;
}
function validatePlan(p) {
  if (p?.status!=='ready'||p.version!==POWER_ODDS_VERSION||![p.runId,p.characterId,p.invocationId,p.catalogVersion].every(nonempty)||
      p.freezeBeforeDraw!==true||p.powerEnchant!==false||!nonempty(p.request?.id)||!Array.isArray(p.outcomes)||!p.outcomes.length||
      new Set(p.outcomes.map(o=>o.id)).size!==p.outcomes.length||p.outcomes.some(o=>!Number.isFinite(o.probability)||o.probability<=0)||
      Math.abs(sum(p.outcomes.map(o=>o.probability))-1)>1e-12||!Array.isArray(p.ownership?.identities)||!nonempty(p.ownership.fingerprint))
    fail('INVALID_FROZEN_POWER_PLAN','Source-scoped normalized frozen acquisition pool required.');
  const real=p.outcomes.filter(o=>o.id!=='power-none');if (!real.length) fail('INVALID_FROZEN_POWER_PLAN','At least one real power is required.');
  const refs=real.map(o=>refIdentity(o.powerDefinitionRef));
  if (new Set(refs).size!==refs.length||refs.some(id=>p.ownership.identities.includes(id))) fail('INVALID_FROZEN_POWER_PLAN','Frozen pool must exclude all already-owned ordinary canonical powers.');
  real.forEach(validateRecipe);
  for (let i=1;i<real.length;i++) if (real[i-1].tier>real[i].tier ||
      (real[i-1].tier===real[i].tier && real[i-1].catalogOrder>=real[i].catalogOrder))
    fail('INVALID_FROZEN_POWER_PLAN','Real power sectors must stay ordered weakest to strongest.');
  const none=p.outcomes.find(o=>o.id==='power-none');
  if (none&&(none.tier!==null||none.funnyResult!==false||p.request.requirePower)) fail('INVALID_FROZEN_POWER_PLAN','Guaranteed acquisitions cannot contain None.');
  if (p.wheelId!=='power' && (!themes.wheels.some(w=>w.id===p.wheelId)||none||p.request.kind!=='themed')) fail('INVALID_FROZEN_POWER_PLAN','Thematic calls stay on their real separate pool, without None.');
  if (p.trace.equalizerActive||p.trace.thematicBaseEqual) {
    if (p.outcomes.some(o=>Math.abs(o.probability-1/p.outcomes.length)>1e-12)) fail('INVALID_FROZEN_POWER_PLAN','Uniform leaf override must remain uniform after eligibility.');
  } else if (p.trace.policy?.godScarcity&&none&&Math.abs(none.probability-.8)>1e-12) fail('INVALID_FROZEN_POWER_PLAN','Applicable non-guaranteed God normal acquisition keeps80% None.');
}
export function selectPowerOutcome(plan,sample) {
  validatePlan(plan);if (!Number.isFinite(sample)||sample<0||sample>=1) fail('INVALID_RANDOM_SAMPLE','External RNG sample in[0,1) required.');
  let mass=0;for (const p of plan.outcomes) {mass+=p.probability;if(sample<mass)return p.id;}return plan.outcomes.at(-1).id;
}
/** Source-once grant/None receipt; caller commits inventory+request ledger before next planning. */
export function resolvePowerResult(plan,result,{consumedRequestIds=[],currentOwnershipFingerprint=plan.ownership.fingerprint}={}) {
  validatePlan(plan);
  if (!Array.isArray(consumedRequestIds)||consumedRequestIds.some(id=>!nonempty(id))) fail('INVALID_POWER_LEDGER','Consumed request IDs required.');
  if (consumedRequestIds.includes(plan.request.id)) return {status:'already_resolved',requestId:plan.request.id,actualSpin:false};
  if (currentOwnershipFingerprint!==plan.ownership.fingerprint) fail('STALE_POWER_OWNERSHIP','Inventory changed; commit must compare the frozen ownership snapshot.');
  if (result?.runId!==plan.runId||result.characterId!==plan.characterId||result.invocationId!==plan.invocationId||!nonempty(result.spinId)) fail('POWER_SOURCE_MISMATCH','Result must match its actual frozen owner invocation.');
  if (plan.context?.sourceRecords.some(s=>s.spinId===result.spinId)||plan.context?.size.sourceId===result.spinId) fail('DUPLICATE_POWER_DRAW','Power acquisition must have its own actual spin ID.');
  const selected=plan.outcomes.find(p=>p.id===result.outcomeId);if (!selected) fail('UNKNOWN_POWER_OUTCOME','Result absent from frozen eligible pool.');
  const sourceKey=plan.request.id,grant=selected.id==='power-none'?[]:[{type:'grant-power',ledgerKey:sourceKey,ownedId:sourceKey,
    ...copy(selected.powerDefinitionRef),powerTier:selected.tier,tierPolicyVersion:selected.tierPolicyVersion,
    sourceId:plan.invocationId,sourceSpinId:result.spinId,committed:true,kind:'owned',scopeSnapshot:selected.scope,
    masteryPolicy:'owner-single-shared-resolution',triggersMasterySpinNow:false,triggersEnchantNow:false,dispatchSourceEvents:false}];
  return {status:'resolved',runId:plan.runId,characterId:plan.characterId,invocationId:plan.invocationId,sourceSpinId:result.spinId,
    sourceKey,requestId:plan.request.id,outcomeId:selected.id,label:selected.label,powerTier:selected.tier,
    atomicEffects:[...grant,{type:'consume-power-request',requestId:plan.request.id,sourceSpinId:result.spinId}],
    commitGuard:{ownerContextKey:plan.context?.ownerContextKey??null,ownershipFingerprint:plan.ownership.fingerprint,unconsumedRequestId:plan.request.id},
    retainPreviousPowers:true,powerEnchant:false,funnyResult:selected.funnyResult,
    funnyActualSpinKey:selected.funnyResult?key(plan.runId,plan.characterId,result.spinId):null,
    continuation:plan.continuation,contextFacts:[`Power: ${selected.label}`,...(selected.id==='power-none'?[]:[selected.scope,`Power Tier: ${selected.tier}`])]};
}
/** Merge only an identical fixed grant mode and bounded binding; all original provenance survives. */
export function resolveFixedPowerGrant(input,grant) {
  if (![input?.runId,input?.characterId,grant?.sourceId,grant?.sourceKey].every(nonempty)) fail('INVALID_FIXED_POWER_SOURCE','Owner and committed fixed-source IDs required.');
  const owned=ownership(input);if (owned.required) return needs(input,owned.required);
  const identity=refIdentity(grant),binding=grant.bindingKey??null;
  const current=input.powers.find(p=>refIdentity(p)===identity&&(p.bindingKey??null)===binding);
  const consumed=input.consumedFixedPowerSourceKeys??[];
  if (!Array.isArray(consumed)) fail('INVALID_POWER_LEDGER','Fixed-grant source ledger required.');
  if (consumed.includes(grant.sourceKey)) return {status:'already_resolved',sourceKey:grant.sourceKey,actualSpin:false};
  return {status:'resolved',sourceKey:grant.sourceKey,actualSpin:false,merge:!!current,
    effects:[{type:current?'merge-fixed-power-provenance':'grant-fixed-power',ownedId:current?.ownedId??grant.sourceKey,
      ...copy(grant),definitionFile:canonicalFile(grant.definitionFile),grantMode:grant.grantMode??'power',bindingKey:binding,
      ledgerKey:grant.sourceKey,powerTier:resolvePowerTier({...grant,definitionFile:canonicalFile(grant.definitionFile)}).powerTier,
      triggersMasterySpinNow:false,triggersEnchantNow:false}],retainsExistingPowerAndBindings:true,powerEnchant:false};
}

/** One shared raw mastery after all acquisitions; ordinary late powers reuse it. Hard max precedes RNG. */
export function planPowerMasteryAfterAcquisitions(input) {
  const stage=planPowerStage(input);if(stage.status!=='ready')return stage;
  if (stage.nextRequestId!==null || input.allAcquisitionsComplete!==true) return needs(input,['completed-all-main-and-extra-power-acquisitions']);
  const plan=planStatWheel({...input,target:'power-mastery'});
  if (plan.status!=='ready' || plan.actualSpin===false) return plan;
  const shared=input.sharedPowerMastery;
  if (!shared) return plan;
  if (shared.status!=='resolved'||shared.runId!==input.runId||shared.characterId!==input.characterId||!nonempty(shared.resolutionId)||
      !Number.isInteger(shared.retainedRawBase)||shared.retainedRawBase<0||shared.retainedRawBase>9)
    fail('INVALID_SHARED_POWER_MASTERY','Settled raw shared mastery must belong to this owner.');
  return {status:'reuse',version:POWER_ODDS_VERSION,runId:input.runId,characterId:input.characterId,actualSpin:false,
    sharedResolutionId:shared.resolutionId,base:shared.retainedRawBase,powerIds:input.powers.map(p=>p.ownedId),bonusTiming:'final-only',powerEnchant:false};
}
