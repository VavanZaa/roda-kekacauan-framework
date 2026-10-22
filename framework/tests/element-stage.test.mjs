import test from 'node:test';
import assert from 'node:assert/strict';
import {planElementStage,selectElementOutcome,resolveElementResult} from '../element-stage.mjs';
const input=()=>({runId:'run',characterId:'hero',invocationId:'element:one',powers:[],caller:{familyId:'elemental',committed:true,sourceId:'race:one',sourceSpinId:'race:spin',sourceStage:'race',returnTo:'race:complete',results:[]}});
const result=(p,outcomeId)=>({runId:p.runId,characterId:p.characterId,invocationId:p.invocationId,spinId:'element:spin',outcomeId});
test('Every new Element freezes exact power scope and emits affinity, one power and art binding atomically',()=>{
 for(const id of ['fire','water','earth','wind','lightning','ice','metal','plant','light','darkness','shadow','void']){
  const x=input(),before=structuredClone(x),p=planElementStage(x),o=p.outcomes.find(o=>o.id===id);
  assert.equal(p.status,'ready');assert.equal(p.outcomes.length,12);assert.ok(o.power.scope);assert.notEqual(o.power.scope,o.visual.cue);
  assert.equal(selectElementOutcome(p,(p.outcomes.indexOf(o)+.5)/12),id);
  const r=resolveElementResult(p,result(p,id),x);
  assert.deepEqual(r.atomicEffects.map(e=>e.type),['record-element-affinity','grant-fixed-power','consume-element-request']);
  assert.equal(r.illustration.elementId,id);assert.equal(r.illustration.visual.bodyKind,'elemental');
  assert.equal(r.atomicEffects[1].grantMode,'power');assert.equal(r.triggersMasterySpinNow,false);assert.equal(r.triggersEnchantNow,false);assert.equal(r.continuation,'race:complete');
  assert.equal(r.powerTier,id==='void'?5:3);assert.deepEqual(x,before);
 }
});
test('Pixie/Naga/Dragon receive a caller-specific overlay; body material callers keep body references',()=>{
 const pairs=[['fae',[['fairy-subrace','element-pixie']],'fairy-element'],['mythical-beast',[['mythical-beast-origin','local'],['mythical-beast-local-type','naga']],'naga-element'],['mythical-beast',[['mythical-beast-origin','imported'],['mythical-beast-imported-type','dragon'],['dragon-form','western']],'dragon-element'],['golem',[['golem-type','element-golem']],'golem'],['slime',[['slime-type','elemental']],'slime']];
 for(const[familyId,rows,kind]of pairs){const x=input();x.caller.familyId=familyId;x.caller.results=rows.map(([wheelId,outcomeId],i)=>({wheelId,outcomeId,spinId:'source:'+i}));const p=planElementStage(x),r=resolveElementResult(p,result(p,'shadow'),x);assert.equal(p.callerKind,kind);assert.equal(r.illustration.variantId,kind.endsWith('-element')?`visual:${kind}/shadow`:null);}
});
test('Existing fixed power merges; replay, foreign callers, corruption and stale inventory cannot create grants',()=>{
 const x=input(),p=planElementStage(x),ref=p.outcomes.find(o=>o.id==='shadow').powerDefinitionRef;
 x.powers=[{...ref,kind:'owned',committed:true,ownedId:'earlier:shadow',sourceId:'elf:source'}];
 const merged=planElementStage(x),r=resolveElementResult(merged,result(merged,'shadow'),x);
 assert.equal(r.atomicEffects[1].type,'merge-fixed-power-provenance');assert.equal(r.atomicEffects[1].ownedId,'earlier:shadow');
 assert.equal(resolveElementResult(merged,result(merged,'shadow'),{...x,consumedElementRequestIds:[merged.requestId]}).status,'already_resolved');
 assert.throws(()=>resolveElementResult(p,result(p,'shadow'),x),{code:'STALE_ELEMENT_OWNERSHIP'});
 assert.throws(()=>resolveElementResult(p,{...result(p,'shadow'),characterId:'other'},input()),{code:'ELEMENT_SOURCE_MISMATCH'});
 const corrupt=structuredClone(p);corrupt.outcomes[0].probability=.9;assert.throws(()=>selectElementOutcome(corrupt,.1),{code:'INVALID_FROZEN_ELEMENT_PLAN'});
 const human=input();human.caller.familyId='human';assert.equal(planElementStage(human).status,'needs_configuration');
});
