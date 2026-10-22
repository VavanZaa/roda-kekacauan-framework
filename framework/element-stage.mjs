import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import catalog from '../content/universal-element-wheel-design.json' with {type:'json'};
import dragon from '../content/dragon-events-design.json' with {type:'json'};
import {resolveFixedPowerGrant} from './power-wheel.mjs';
import {resolvePowerTier} from './power-tier.mjs';
import {getElementVisual} from './element-visual.mjs';

const copy=x=>structuredClone(x),text=x=>typeof x==='string'&&x.trim().length>0;
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function fail(code,message){throw Object.assign(new Error(message),{code});}
function callerKind(c){
 const has=(wheel,id)=>c.results?.some(r=>r.wheelId===wheel&&r.outcomeId===id&&text(r.spinId));
 if(c.familyId==='elemental')return 'elemental';
 if(c.familyId==='golem'&&has('golem-type','element-golem'))return 'golem';
 if(c.familyId==='slime'&&has('slime-type','elemental'))return 'slime';
 if(c.familyId==='fae'&&has('fairy-subrace','element-pixie'))return 'fairy-element';
 if(c.familyId==='mythical-beast'&&has('mythical-beast-origin','local')&&has('mythical-beast-local-type','naga'))return 'naga-element';
 if(c.familyId==='mythical-beast'&&has('mythical-beast-origin','imported')&&has('mythical-beast-imported-type','dragon')&&c.results?.some(r=>r.wheelId==='dragon-form'&&dragon.wheels.find(w=>w.id==='dragon-form').outcomes.some(o=>o.id===r.outcomeId)&&text(r.spinId)))return 'dragon-element';
 return null;
}
const requestKey=x=>['element',x.runId,x.characterId,x.caller.sourceId,x.invocationId].map(encodeURIComponent).join(':');
const checksum=p=>digest(Object.fromEntries(Object.entries(p).filter(([k])=>k!=='checksum')));
function findDefinition(value,id){if(value?.id===id)return value;if(!value||typeof value!=='object')return null;for(const[k,v]of Object.entries(value)){if(/history|retired|proposal|inactive/i.test(k))continue;const found=findDefinition(v,id);if(found)return found;}return null;}
function powerSnapshot(ref){
 const d=findDefinition(JSON.parse(readFileSync(new URL('../'+ref.definitionFile,import.meta.url),'utf8')),ref.definitionId);
 const scope=d?.scopeModes?.[ref.grantMode]??d?.scope??d?.description;
 if(!text(scope))fail('UNBOUND_ELEMENT_POWER','Exact canonical power scope required.');
 return {scope,...(d.limits?{limits:d.limits}:{}),label:d.label};
}

/** Freeze one caller-owned Element selector; selection remains external RNG. */
export function planElementStage(input){
 if(![input?.runId,input?.characterId,input?.invocationId].every(text))fail('INVALID_ELEMENT_INVOCATION','Stable run, character and invocation IDs required.');
 const c=input.caller,kind=c&&callerKind(c);
 if(c?.committed!==true||!kind||![c.sourceId,c.sourceSpinId,c.sourceStage,c.returnTo].every(text))return {status:'needs_configuration',actualSpin:false,required:['actual-committed-element-caller-with-source-and-return']};
 if(!Array.isArray(input.powers))return {status:'needs_configuration',actualSpin:false,required:['explicit-owned-power-inventory']};
 // Public fixed-grant resolver performs ownership validation without committing effects.
 const validation=resolveFixedPowerGrant(input,{...catalog.wheels[0].outcomes[0].powerDefinitionRef,sourceId:c.sourceId,sourceKey:requestKey(input)+':validation'});
 if(validation.status==='needs_configuration')return validation;
 const plan={version:'element-stage/1.0.0',status:'ready',runId:input.runId,characterId:input.characterId,invocationId:input.invocationId,
  requestId:requestKey(input),wheelId:'element-universal',catalogVersion:catalog.version,actualSpin:true,freezeBeforeDraw:true,
  caller:copy(c),callerKind:kind,continuation:c.returnTo,ownershipFingerprint:digest(input.powers),
  outcomes:catalog.wheels[0].outcomes.map(o=>({...copy(o),power:powerSnapshot(o.powerDefinitionRef),tier:resolvePowerTier(o.powerDefinitionRef).powerTier,probability:1/catalog.wheels[0].outcomes.length,
   visual:getElementVisual(o.id,['elemental','golem','slime'].includes(kind)?kind:'overlay')})),
  trace:{oneSelectedLinkedPower:true,existingPowerGrantMerges:true,statMasteryBoundsApplied:false,dispatchSourceRace:false,masterySpinNow:false,enchantNow:false}};
 plan.checksum=checksum(plan);return plan;
}
function validate(plan){
 if(plan?.version!=='element-stage/1.0.0'||plan.status!=='ready'||plan.checksum!==checksum(plan)||!plan.outcomes?.length||Math.abs(plan.outcomes.reduce((s,o)=>s+o.probability,0)-1)>1e-12)fail('INVALID_FROZEN_ELEMENT_PLAN','Intact normalized frozen Element plan required.');
}
export function selectElementOutcome(plan,sample){
 validate(plan);if(!Number.isFinite(sample)||sample<0||sample>=1)fail('INVALID_RANDOM_SAMPLE','External RNG sample in [0,1) required.');
 let total=0;for(const o of plan.outcomes){total+=o.probability;if(sample<total)return o.id;}return plan.outcomes.at(-1).id;
}
/** Receipt only; the caller commits affinity, power provenance and consumed request atomically. */
export function resolveElementResult(plan,result,input){
 validate(plan);
 if(result?.runId!==plan.runId||result.characterId!==plan.characterId||result.invocationId!==plan.invocationId||!text(result.spinId))fail('ELEMENT_SOURCE_MISMATCH','Result must match the actual frozen owner invocation.');
 if(result.spinId===plan.caller.sourceSpinId||plan.caller.results?.some(r=>r.spinId===result.spinId))fail('DUPLICATE_ELEMENT_DRAW','Element has its own actual spin ID.');
 if(input?.runId!==plan.runId||input.characterId!==plan.characterId||!Array.isArray(input.consumedElementRequestIds??[]))fail('INVALID_ELEMENT_LEDGER','Matching owner and request ledger required.');
 if((input.consumedElementRequestIds??[]).includes(plan.requestId))return {status:'already_resolved',actualSpin:false,requestId:plan.requestId};
 if(digest(input.powers)!==plan.ownershipFingerprint)fail('STALE_ELEMENT_OWNERSHIP','Power inventory changed; refresh before selecting a new Element result.');
 const o=plan.outcomes.find(o=>o.id===result.outcomeId);if(!o)fail('UNKNOWN_ELEMENT_OUTCOME','Result absent from the frozen Element pool.');
 const grant=resolveFixedPowerGrant(input,{...o.powerDefinitionRef,sourceId:plan.caller.sourceId,sourceKey:plan.requestId,sourceSpinId:result.spinId,committed:true,kind:'owned',scopeSnapshot:o.power.scope,limitsSnapshot:o.power.limits??null,masteryPolicy:'owner-single-shared-resolution',dispatchSourceEvents:false});
 if(grant.status!=='resolved')return grant;
 return {status:'resolved',runId:plan.runId,characterId:plan.characterId,invocationId:plan.invocationId,requestId:plan.requestId,sourceSpinId:result.spinId,
  outcomeId:o.id,label:o.label,powerTier:o.tier,continuation:plan.continuation,
  atomicEffects:[{type:'record-element-affinity',sourceId:plan.caller.sourceId,sourceSpinId:result.spinId,elementId:o.id,ledgerKey:plan.requestId},...grant.effects,{type:'consume-element-request',requestId:plan.requestId}],
  illustration:{elementId:o.id,visual:copy(o.visual),variantId:['elemental','golem','slime'].includes(plan.callerKind)?null:`visual:${plan.callerKind}/${o.id}`,sourceId:plan.caller.sourceId,spinId:result.spinId},
  commitGuard:{ownershipFingerprint:plan.ownershipFingerprint,unconsumedRequestId:plan.requestId},retainPreviousPowers:true,bonusTiming:'final-only',triggersMasterySpinNow:false,triggersEnchantNow:false};
}
