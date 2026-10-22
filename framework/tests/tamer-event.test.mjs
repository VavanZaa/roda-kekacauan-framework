import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import design from '../../content/tamer-events-design.json' with { type: 'json' };
import ancient from '../../content/archaeologist-events-design.json' with { type: 'json' };
import race from '../../content/race-wheel-design.json' with { type: 'json' };
import retired from '../../reference/tamer-retired-roster-v1.json' with { type: 'json' };
import research from '../../reference/tamer-fauna-research.json' with { type: 'json' };
import { planTamerCompanion, resolveTamerCompanion } from '../tamer-event.mjs';

const plan = (invocationId='character:archetype:tamer') => planTamerCompanion({ invocationId, characterId:'character', catalogVersion:'test/v1' });
const result = (p,id) => ({ invocationId:p.invocationId, spinId:`${p.invocationId}:spin`, outcomeId:id });

test('One flat 64-animal wheel is equally likely, with more modern choices and no group selector', () => {
  const p=plan(); assert.equal(p.wheel.outcomes.length,64); assert.equal(p.wheel.outcomeCount,64);
  assert.equal(new Set(p.wheel.outcomes.map(o=>o.id)).size,64);
  assert.ok(p.wheel.outcomes.every(o=>o.baseWeight===1 && o.probability===1/64));
  assert.ok(p.wheel.outcomes.every(o=>Object.keys(o).sort().join()==='baseWeight,id,label,probability'));
  const counts=Object.fromEntries(design.groups.map(g=>[g.id,p.animals.filter(o=>o.groupId===g.id).length]));
  assert.deepEqual(counts,{modern:32,prehistoric:16,mythical:8,'pop-culture':8});
  assert.deepEqual(design.groups.map(g=>g.probability),[0.5,0.25,0.125,0.125]);
  assert.equal(p.wheel.allowModifiers,false);
});

test('Every animal, from Ant to Megalodon/Phoenix, directly registers exactly one owned companion', () => {
  for(const o of design.wheel.outcomes){const p=plan(),r=resolveTamerCompanion(p,result(p,o.id));
    assert.equal(r.companionCount,1);assert.equal(r.effects.length,2);assert.equal(r.effects[0].type,'register-companion');
    assert.equal(r.effects[0].companion.ownerCharacterId,'character');assert.equal(r.effects[0].companion.animalDefinitionId,o.id);
    assert.equal(r.nextStage,'backstory');assert.equal(r.effects[0].companion.surviveMainNone,true);
    assert.equal(r.effects[0].companion.intrinsicProfileStatus,'needs_configuration');
  }
});

test('Identity refs reuse real catalogs but do not copy Race/finding rewards or dispatch their subwheels', () => {
  const myth=race.families.find(f=>f.id==='mythical-beast');
  for(const o of design.wheel.outcomes)for(const ref of o.identityRefs){
    assert.ok(fs.existsSync(new URL('../../'+ref.definitionFile,import.meta.url)));
    if(ref.collection)assert.ok(ancient.wheel.outcomes.some(a=>a.id===ref.definitionId));
    else assert.ok(myth.branch.outcomes.find(b=>b.id===ref.originId).subtypeWheel.outcomes.some(a=>a.id===ref.definitionId));
  }
  assert.equal(design.wheel.outcomes.find(o=>o.id==='blue-whale').groupId,'modern');
  assert.equal(design.wheel.outcomes.find(o=>o.id==='megalodon').groupId,'prehistoric');
  for(const id of ['garuda','dragon','phoenix','tyrannosaurus-rex']){
    const p=plan(),r=resolveTamerCompanion(p,result(p,id));
    assert.deepEqual(r.effects.map(e=>e.type),['register-companion','grant-power']);
    assert.equal(r.effects[1].definitionId,'taming');
    for(const key of ['extraSpins','raceTree','usedRaceFamilyIds','size','army','weaponInstances','powerInstances','funnyResult'])assert.ok(!(key in r));
    for(const key of ['statBuffs','powerRefs','masteryRank','enchantment'])assert.ok(!(key in r.effects[0].companion));
  }
});

test('Frozen identity and stable source ledger make replay independent of newer catalog edits', () => {
  const p=plan(),before=structuredClone(p),o=design.wheel.outcomes.find(o=>o.id==='blue-whale'),label=o.label;
  try{o.label='later edited catalog';
    const a=resolveTamerCompanion(p,result(p,'blue-whale')),b=resolveTamerCompanion(p,result(p,'blue-whale'));
    assert.deepEqual(a,b);assert.equal(a.effects[0].companion.label,label);assert.deepEqual(p,before);
    a.effects[0].companion.identitySnapshot.label='external mutation';
    assert.equal(resolveTamerCompanion(p,result(p,'blue-whale')).effects[0].companion.identitySnapshot.label,label);
  }finally{o.label=label;}
});

test('Separate invocations preserve separate companion source instances, even for the same animal', () => {
  const a=plan('role:a'),b=plan('role:b');
  const x=resolveTamerCompanion(a,result(a,'ant')),y=resolveTamerCompanion(b,result(b,'ant'));
  assert.notEqual(x.ledgerKey,y.ledgerKey);assert.notEqual(x.effects[0].companion.instanceId,y.effects[0].companion.instanceId);
});

test('Missing owner/version/source, unknown results and mismatched invocation cannot acquire companions', () => {
  for(const args of [{},{invocationId:'x',catalogVersion:'v'},{invocationId:'x',characterId:'c'}])assert.throws(()=>planTamerCompanion(args),{code:'INVALID_TAMER_INVOCATION'});
  const p=plan();assert.throws(()=>resolveTamerCompanion(p,{...result(p,'ant'),invocationId:'other'}),{code:'TAMER_SOURCE_MISMATCH'});
  assert.throws(()=>resolveTamerCompanion(p,result(p,'not-in-pool')),{code:'UNKNOWN_TAMER_OUTCOME'});
});

test('Corrupt frozen odds, duplicate animals or invalid companion identity refs cannot grant an entity', () => {
  const p=plan();p.wheel.outcomes[0].probability=0.5;
  assert.throws(()=>resolveTamerCompanion(p,result(p,'ant')),{code:'INVALID_TAMER_POOL'});
  const q=plan();q.animals[1]=structuredClone(q.animals[0]);
  assert.throws(()=>resolveTamerCompanion(q,result(q,'ant')),{code:'INVALID_TAMER_POOL'});
  const t=plan();t.animals[0].companionProfile.definitionId='different';
  assert.throws(()=>resolveTamerCompanion(t,result(t,'ant')),{code:'INVALID_COMPANION_IDENTITY'});
});

test('Eight Pop Culture identities have sources, distinct candidates, and one Kurama alias outcome', () => {
  const pop=design.wheel.outcomes.filter(o=>o.groupId==='pop-culture');
  assert.equal(pop.length,8);assert.equal(new Set(pop.map(o=>o.canonicalIdentityId)).size,8);
  const sources=new Set(research.popCultureSources.map(o=>o.id));
  for(const o of pop){assert.ok(sources.has(o.franchiseRef.sourceId));const p=plan(),r=resolveTamerCompanion(p,result(p,o.id));assert.deepEqual(r.effects.map(e=>e.type),['register-companion','grant-power']);}
  assert.equal(pop.filter(o=>o.aliases?.includes('Kyubi')).length,1);
  assert.equal(design.wheel.outcomes.filter(o=>o.id==='kurama').length,1);
});

test('Retired 1.0.0 snapshot still resolves its removed Hamster without migration or redraw', () => {
  assert.ok(!design.wheel.outcomes.some(o=>o.id==='hamster'));
  const p=plan();p.ruleVersion=retired.ruleVersion;p.catalogVersion='archive/v1';delete p.powerGrantRef;
  p.animals=structuredClone(retired.animals);
  p.wheel.outcomes=p.animals.map(({id,label,baseWeight,probability})=>({id,label,baseWeight,probability}));
  const before=structuredClone(p),r=resolveTamerCompanion(p,result(p,'hamster'));
  assert.equal(r.effects[0].companion.animalDefinitionId,'hamster');
  assert.equal(r.effects[0].companion.ruleVersion,'tamer/1.0.0');
  assert.equal(r.effects[0].companion.catalogVersion,'archive/v1');
  assert.equal(r.companionCount,1);assert.deepEqual(p,before);
});

test('Tamer fixed power is ordinary owner-owned, retained after None and source-ledger scoped', () => {
  const p=plan(),r=resolveTamerCompanion(p,result(p,'ant')),power=r.effects[1];
  assert.deepEqual(p.powerGrantRef,{definitionId:'taming',definitionFile:'content/tamer-events-design.json'});
  assert.equal(design.powers.filter(o=>o.id==='taming').length,1);
  assert.equal(power.ownerCharacterId,'character');assert.equal(power.masteryPolicy,'recipient-shared-power-normal');
  assert.equal(power.surviveMainNone,true);assert.equal(power.sourceSpinId,result(p,'ant').spinId);
  assert.ok(power.instanceId.startsWith(r.ledgerKey));
  for(const k of ['masteryRank','masteryOverrideId','enchantment','extraSpins','statModifiers'])assert.ok(!(k in power));
  assert.deepEqual(resolveTamerCompanion(p,result(p,'ant')),r);
});

test('Old 1.1.0 keeps companion-only while missing/tampered current power reference is rejected', () => {
  const old=plan();old.ruleVersion='tamer/1.1.0';delete old.powerGrantRef;
  assert.deepEqual(resolveTamerCompanion(old,result(old,'kurama')).effects.map(o=>o.type),['register-companion']);
  const missing=plan();delete missing.powerGrantRef;
  assert.throws(()=>resolveTamerCompanion(missing,result(missing,'ant')),{code:'INVALID_TAMER_POWER'});
  const tampered=plan();tampered.powerGrantRef.definitionId='unapproved';
  assert.throws(()=>resolveTamerCompanion(tampered,result(tampered,'ant')),{code:'INVALID_TAMER_POWER'});
  old.powerGrantRef=structuredClone(design.rolePowerRef);
  assert.throws(()=>resolveTamerCompanion(old,result(old,'kurama')),{code:'INVALID_TAMER_POWER'});
});
