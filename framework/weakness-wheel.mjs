import design from '../content/weakness-wheel-design.json' with { type: 'json' };
import identities from '../content/slayer-events-design.json' with { type: 'json' };
import stat from '../content/stat-odds-design.json' with { type: 'json' };
import pairs from '../content/archetype-hybrid-events-design.json' with { type: 'json' };
import backstory from '../content/backstory-wheel-design.json' with { type: 'json' };

export const WEAKNESS_ODDS_VERSION = 'weakness-odds/1.0.0';
export class WeaknessWheelError extends Error {
  constructor(code, message) { super(message); this.name='WeaknessWheelError'; this.code=code; }
}
const fail=(code,message)=>{throw new WeaknessWheelError(code,message);};
const id=x=>typeof x==='string'&&x.trim().length>0;
const key=(...parts)=>JSON.stringify(parts);
const copy=x=>structuredClone(x);
const unique=(xs,label)=>{if(!Array.isArray(xs)||xs.some(x=>!id(x))||new Set(xs).size!==xs.length)fail('INVALID_SOURCE',label+' must be unique nonempty IDs.');};
const needs=(input,required)=>({status:'needs_configuration',version:WEAKNESS_ODDS_VERSION,runId:input.runId,characterId:input.characterId,invocationId:input.invocationId,actualSpin:false,required});
const wrapper=f=>['hybrid','symbiote','raksasa'].includes(f.familyId)||(f.familyId==='lelembut'&&f.results.some(r=>r.wheelId==='lelembut-imported-type'&&['skeleton','zombie'].includes(r.outcomeId)));
export const weaknessIdentityFingerprint=facts=>key(facts.map(f=>[f.familyId,f.sourceId,f.results.map(r=>[r.wheelId,r.outcomeId,r.spinId]).sort()]).sort());

function validateCatalog(c){
  if(c.version!=='weakness-wheel/1.0.0'||c.wheel?.id!=='weakness'||c.wheel.noneOutcome?.id!=='weakness-none'||c.recipes?.length!==40||
      c.probabilityModel?.version!==WEAKNESS_ODDS_VERSION||c.probabilityModel.humanNoneProbability!==.5)
    fail('INVALID_CATALOG','Forty versioned recipes and user Human50% None needed.');
  unique(c.recipes.map(r=>r.id),'Recipe IDs');
  unique(c.probabilityModel.humanCapabilities,'Human capabilities');
  for(const r of c.recipes){
    if(!id(r.label)||!id(r.effect)||!id(r.condition?.id)||!id(r.condition.label)||!['always','conditional'].includes(r.condition.mode)||
       !Number.isInteger(r.catalogOrder)||r.catalogOrder<1||r.baseWeight!==1||!c.categoryLabels[r.category]||
       !Array.isArray(r.directEffects)||!Array.isArray(r.restrictions)||r.eventRules?.length!==0||
       typeof r.funnyResult!=='boolean'||r.funnyResult!==r.tags?.includes('funny-result'))fail('INVALID_RECIPE','Explicit bounded game condition/effect and no automatic child wheel required.');
    unique(r.requiredCapabilities,'Recipe capabilities');
    if(r.requiredCapabilities.some(t=>!c.probabilityModel.humanCapabilities.includes(t)))fail('INVALID_RECIPE','Unknown body capability.');
    if(r.condition.mode==='conditional'&&r.directEffects.length)fail('CONDITIONAL_FLAT_PENALTY','Conditional restrictions never become unconditional stat debuffs.');
    for(const e of r.directEffects)if(e.type!=='stat-flat-modifier'||!['strength','speed','durability','intelligence','fight'].includes(e.stat)||
      !Number.isSafeInteger(e.amount)||e.amount>=0||e.registration!=='immediate'||e.calculation!=='final-only')fail('INVALID_RECIPE','Explicit signed final-only penalties required.');
  }
  unique(c.probabilityModel.backstoryProfiles.map(p=>p.id),'Backstory profile IDs');
  for(const p of c.probabilityModel.backstoryProfiles)if(!backstory.wheel.outcomes.some(o=>o.id===p.backstoryId)||
    Object.entries(p.outcomeFactors).some(([r,v])=>!c.recipes.some(x=>x.id===r)||!Number.isFinite(v)||v<1||v>1.5))fail('INVALID_LIKELIHOOD','Only canonical future Backstory profiles and gentle authored factors1..1.5.');
}

// Identity-only proof is available before Size. No future stat/power input is required.
function evidence(input){
  for(const field of ['runId','characterId','invocationId'])if(!id(input[field]))fail('INVALID_INVOCATION','Stable '+field+' required.');
  if(!input.raceFacts?.length)fail('MISSING_IDENTITY','Actual committed owner identities required.');
  unique(input.raceFacts.map(f=>f.familyId),'Race families');unique(input.raceFacts.map(f=>f.sourceId),'Race sources');
  const spins=[];
  for(const f of input.raceFacts){
    if(f.committed!==true||!identities.identityRoutes[f.familyId]||!Array.isArray(f.results))fail('INVALID_IDENTITY','Canonical committed owner race required.');
    for(const r of f.results){if(!id(r.spinId)||!stat.raceResultWheels[f.familyId]?.[r.wheelId]?.includes(r.outcomeId))fail('INVALID_IDENTITY','Unknown owner race result.');spins.push(r.spinId);}
    const selected=Object.fromEntries(f.results.map(r=>[r.wheelId,r.outcomeId]));
    for(const s of identities.identityRoutes[f.familyId].selectors){
      if(s.when&&!Object.entries(s.when).every(([w,ids])=>ids.includes(selected[w])))continue;
      if(f.results.filter(r=>r.wheelId===s.wheelId).length!==1)return {required:['completed-identity:'+f.familyId+':'+s.wheelId]};
    }
  }
  const roles=input.archetypeIds??[],facts=input.archetypeFacts??[];unique(roles,'Archetype IDs');
  if(roles.some(r=>!stat.archetypeProfiles.some(p=>p.id===r)))fail('UNKNOWN_ARCHETYPE','Active canonical Archetype required.');
  if(pairs.pairCompatibility.incompatiblePairs.some(p=>p.ids.every(r=>roles.includes(r))))return{required:['compatible-committed-archetype-pair']};
  unique(facts.map(f=>f.archetypeId),'Archetype facts');unique([...input.raceFacts.map(f=>f.sourceId),...facts.map(f=>f.sourceId)],'Owner sources');
  if(roles.some(r=>!facts.some(f=>f.archetypeId===r)))return{required:['committed-archetype-source-facts']};
  for(const f of facts){
    if(f.committed!==true||!roles.includes(f.archetypeId)||!Array.isArray(f.results))fail('INVALID_ARCHETYPE','Actual owned role source required.');
    for(const r of f.results){if(!id(r.spinId)||!stat.archetypeResultWheels[f.archetypeId]?.[r.wheelId]?.includes(r.outcomeId))fail('INVALID_ARCHETYPE','Unknown actual role result.');spins.push(r.spinId);}
  }
  if(input.backstoryFact){const b=input.backstoryFact;if(b.committed!==true||!id(b.sourceId)||!id(b.spinId)||!backstory.wheel.outcomes.some(o=>o.id===b.outcomeId))fail('INVALID_BACKSTORY','Canonical actual Backstory needed.');spins.push(b.spinId);}
  unique(spins,'Actual source spins');
  const physical=input.raceFacts.filter(f=>!wrapper(f));
  if(!physical.length)return{required:['actual-host-base-origin-identity']};
  return {roles,facts,physical,human:physical.length===1&&physical[0].familyId==='human',identityFingerprint:weaknessIdentityFingerprint(input.raceFacts)};
}
function ownership(input){
  if(!Array.isArray(input.weaknesses))return{required:['explicit-owned-weakness-inventory']};
  unique(input.weaknesses.map(w=>w.ownedId),'Owned weakness IDs');
  for(const w of input.weaknesses)if(w.committed!==true||!id(w.sourceId)||!id(w.definitionId)||!id(w.definitionFile)||(w.kind!==undefined&&w.kind!=='owned'))
    fail('INVALID_INVENTORY','Committed actual owner weaknesses, never companions or prey, required.');
  return {snapshot:copy(input.weaknesses),fingerprint:key(input.weaknesses.map(w=>[w.ownedId,w.definitionFile,w.definitionId,w.sourceId,w.provenance??[]]).sort())};
}
function invocation(input){
  if(input.stage==='weakness'){
    if(input.powerStageComplete!==true)return{required:['completed-Power-stage']};
    return{requestId:key(input.runId,input.characterId,'main-weakness'),returnTo:'apex',kind:'main',sourceId:'main-weakness-stage'};
  }
  if(input.stage==='backstory'){
    const b=input.backstoryFact,c=input.caller;
    if(input.raceAndArchetypeComplete!==true||b?.outcomeId!=='test-subject'||c?.type!=='test-subject-extra'||
      c.sourceId!==b.sourceId||c.returnTo!=='backstory-events'||c.committed!==true)return{required:['actual-Test-Subject-extra-caller-and-completed-upstream']};
    return{requestId:key(input.runId,input.characterId,b.sourceId,'test-subject-extra-weakness',0),returnTo:c.returnTo,kind:'backstory-extra',sourceId:b.sourceId};
  }
  return{required:['Weakness-main-or-approved-immediate-Backstory-cursor']};
}

export function planWeaknessWheel(input,{catalog=design,excludedOutcomeIds=[],requireWeakness=false}={}){
  validateCatalog(catalog);const e=evidence(input);if(e.required)return needs(input,e.required);
  const call=invocation(input);if(call.required)return needs(input,call.required);
  const owned=ownership(input);if(owned.required)return needs(input,owned.required);
  const consumed=input.consumedWeaknessRequestIds??[];unique(consumed,'Consumed Weakness requests');
  const common={version:WEAKNESS_ODDS_VERSION,catalogVersion:catalog.version,runId:input.runId,characterId:input.characterId,
    invocationId:input.invocationId,wheelId:'weakness',request:call,ownership:owned,freezeBeforeDraw:true,bonusTiming:'final-only'};
  if(consumed.includes(call.requestId))return {...common,status:'skip',actualSpin:false,reason:'request-already-consumed'};
  const declared=input.weaknessBodyCapabilities;
  let capabilities;
  if(declared){
    if(declared.committed!==true||declared.characterId!==input.characterId||declared.identityFingerprint!==e.identityFingerprint)
      fail('BODY_OWNER_MISMATCH','Body capability proof must match actual owner identities.');
    unique(declared.capabilities,'Body capabilities');
    if(declared.capabilities.some(t=>!catalog.probabilityModel.humanCapabilities.includes(t)))fail('UNKNOWN_BODY_CAPABILITY','Explicit known body traits required.');
    capabilities=declared.capabilities;
  }else if(e.human)capabilities=catalog.probabilityModel.humanCapabilities;
  else return needs(input,['committed-owner-weakness-body-capability-adapter']);
  unique(excludedOutcomeIds,'Hard exclusions');
  if(excludedOutcomeIds.some(id=>id!=='weakness-none'&&!catalog.recipes.some(r=>r.id===id)))fail('UNKNOWN_EXCLUSION','Only canonical hard exclusion IDs permitted.');
  if(typeof requireWeakness!=='boolean')fail('INVALID_GUARANTEE','Explicit boolean weakness guarantee required.');
  const recipes=copy(catalog.recipes.filter(r=>!excludedOutcomeIds.includes(r.id)&&r.requiredCapabilities.every(t=>capabilities.includes(t))));
  const noneAllowed=!requireWeakness&&!excludedOutcomeIds.includes('weakness-none');
  if(!recipes.length&&!noneAllowed)return needs(input,['nonempty-compatible-weakness-pool']);
  const equalizer=e.roles.includes('equaliser');
  const likelihood=catalog.probabilityModel.backstoryProfiles.find(p=>p.backstoryId===input.backstoryFact?.outcomeId);
  const weights=recipes.map(r=>equalizer?1:(likelihood?.outcomeFactors[r.id]??1));
  const total=weights.reduce((s,v)=>s+v,0),n=recipes.length+(noneAllowed?1:0);
  const none=noneAllowed?(recipes.length===0?1:equalizer?1/n:e.human ? .5 : 1/n):0;
  const outcomes=recipes.map((r,i)=>({id:r.id,label:r.label,catalogOrder:r.catalogOrder,category:r.category,
    probability:equalizer?1/n:(1-none)*weights[i]/total,weight:weights[i]}));
  if(noneAllowed)outcomes.unshift({...copy(catalog.wheel.noneOutcome),probability:none});
  const plan={...common,status:'ready',actualSpin:true,identityFingerprint:e.identityFingerprint,recipes,outcomes,
    requireWeakness,excludedOutcomeIds:copy(excludedOutcomeIds),capabilities:copy(capabilities),
    trace:{humanProfile:e.human,noneProbability:none,equalizerActive:equalizer,
      backstoryProfile:equalizer?null:likelihood?.id??null,statMasteryBoundsApplied:false,sourceFacts:copy(input.raceFacts),
      archetypeFacts:copy(input.archetypeFacts??[]),backstoryFact:copy(input.backstoryFact??null),noFutureSizeOrStats:true}};
  validatePlan(plan);return plan;
}
function validatePlan(p){
  if(p?.status!=='ready'||p.version!==WEAKNESS_ODDS_VERSION||p.catalogVersion!=='weakness-wheel/1.0.0'||p.wheelId!=='weakness'||
    !id(p.runId)||!id(p.characterId)||!id(p.invocationId)||!id(p.request?.requestId)||!id(p.request.returnTo)||p.freezeBeforeDraw!==true||
    !Array.isArray(p.outcomes)||!p.outcomes.length||!Array.isArray(p.recipes)||!Array.isArray(p.ownership?.snapshot)||!id(p.ownership.fingerprint))
    fail('INVALID_PLAN','Saved source/recipes/inventory and normalized frozen pool required.');
  unique(p.outcomes.map(o=>o.id),'Frozen outcomes');
  if(p.outcomes.some(o=>!id(o.label)||!Number.isFinite(o.probability)||o.probability<=0)||
    Math.abs(p.outcomes.reduce((s,o)=>s+o.probability,0)-1)>1e-12)fail('INVALID_PLAN','Positive normalized frozen odds required.');
  if(p.outcomes.some(o=>o.id!=='weakness-none'&&!p.recipes.some(r=>r.id===o.id))||p.recipes.some(r=>!p.outcomes.some(o=>o.id===r.id)))
    fail('INVALID_PLAN','Frozen recipe/outcome IDs must agree.');
}
export function selectWeaknessOutcome(plan,sample){
  validatePlan(plan);if(!Number.isFinite(sample)||sample<0||sample>=1)fail('INVALID_SAMPLE','One external sample in [0,1) required.');
  let cumulative=0;for(const o of plan.outcomes){cumulative+=o.probability;if(sample<cumulative)return o.id;}return plan.outcomes.at(-1).id;
}

export function resolveWeaknessResult(plan,result,{consumedRequestIds,currentOwnershipFingerprint}={}){
  validatePlan(plan);unique(consumedRequestIds,'Current consumed request IDs');
  if(result?.runId!==plan.runId||result.characterId!==plan.characterId||result.invocationId!==plan.invocationId||!id(result.spinId))
    fail('RESULT_OWNER_MISMATCH','Actual result must match this saved owner invocation.');
  if(!plan.outcomes.some(o=>o.id===result.outcomeId))fail('UNKNOWN_OUTCOME','Selected outcome must belong to the frozen eligible pool.');
  if(consumedRequestIds.includes(plan.request.requestId))return {status:'already-consumed',requestId:plan.request.requestId,actualSpin:false,effects:[],funnyHook:null};
  if(currentOwnershipFingerprint!==plan.ownership.fingerprint)fail('STALE_INVENTORY','Refresh and freeze against current owned weakness state before RNG; commit atomically.');
  const recipes=plan.recipes,selected=recipes.find(r=>r.id===result.outcomeId),owned=copy(plan.ownership.snapshot);
  const provenance={runId:plan.runId,characterId:plan.characterId,sourceId:plan.request.sourceId,sourceInvocationId:plan.invocationId,sourceSpinId:result.spinId,
    sourceRequestId:plan.request.requestId,catalogVersion:plan.catalogVersion};
  const effects=[];let grant=null;
  if(selected){
    const same=owned.find(w=>w.definitionFile==='content/weakness-wheel-design.json'&&w.definitionId===selected.id);
    if(same){same.provenance=[...(same.provenance??[]),provenance];grant={kind:'merge-provenance',ownedId:same.ownedId,definitionId:selected.id};}
    else {
      const ownedId=key(plan.runId,plan.characterId,'weakness','content/weakness-wheel-design.json',selected.id);
      const weakness={ownedId,sourceId:plan.request.requestId,committed:true,kind:'owned',definitionFile:'content/weakness-wheel-design.json',definitionId:selected.id,
        label:selected.label,condition:copy(selected.condition),restrictions:copy(selected.restrictions),provenance:[provenance]};
      owned.push(weakness);grant={kind:'new-weakness',...copy(weakness)};
      selected.directEffects.forEach((e,i)=>effects.push({...copy(e),id:key(ownedId,'modifier',i),ledgerKey:key(ownedId,'modifier',i),...provenance,applyAfterImmutableBase:true}));
    }
  }
  return {status:'resolved',requestId:plan.request.requestId,consumeRequestId:plan.request.requestId,requiresAtomicPersistence:true,
    compareOwnershipFingerprint:plan.ownership.fingerprint,actualSpin:true,selectedOutcomeId:result.outcomeId,
    ownedWeaknesses:owned,grant,effects,conditionalRestrictions:selected?copy(selected.restrictions):[],newChildWheels:[],
    funnyHook:selected?.funnyResult?{kind:'actual-funny-spin',sourceOnceKey:key(plan.runId,plan.characterId,result.spinId,'funny-result'),sourceSpinId:result.spinId,
      target:'existing-Shrek-rule-only',isStatBonus:false}:null,
    resultContext:selected?copy(selected.resultContext):{facts:['Tanpa Weakness Tambahan'],caption:'Tanpa Weakness Tambahan',futureResultsUnknown:true},
    returnTo:plan.request.returnTo,masterySpinNow:false,enchantNow:false};
}
