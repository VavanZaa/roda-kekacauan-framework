import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// Explicit catalog migration; saved spins and earlier source recovery files stay intact.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const write = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value, null, 2)+'\n');
const files = [
  'content/universal-element-wheel-design.json','content/elf-events-design.json',
  'content/archetype-eligibility-design.json','content/slayer-events-design.json',
  'content/stat-odds-design.json','content/main-power-wheel-design.json',
  'content/weapon-wheel-design.json','content/power-tier-design.json',
  'content/race-wheel-design.json','content/size-wheel-design.json','framework/spec.json',
  'reference/size-profile-coverage.json',
  'content/dragon-events-design.json',
];
const data = Object.fromEntries(files.map(f => [f, read(f)]));
const element = data[files[0]];
if (element.version === 'element-wheel/0.2.0') {
  assert.equal(element.wheels[0].outcomes.length, 12);
  console.log('Element catalog already expanded. Migration not reapplied.');
  process.exit(0);
}
assert.equal(element.wheels[0].outcomes.length, 4);
const recoveryFile = 'reference/before-element-wheel-expansion-2026-10-11.json';
assert.ok(!fs.existsSync(path.join(root,recoveryFile)), 'Recovery exists; inspect any partial migration before running again.');
write(recoveryFile, {version:'before-element-expansion/1',date:'2026-10-11',reason:'User expands universal Element beyond four with Petir/Cahaya/Kegelapan/Void/Bayangan;12-entry curation.',files:data});
const file = 'content/universal-element-wheel-design.json';
const additions = [
  {id:'lightning',label:'Petir',definitionFile:'content/legendary-hero-events-design.json',definitionId:'lightning-manipulation',powerLabel:'Kendali Petir',tags:['lightning'],shift:[.1,.35,0,.05,.1,0,.2],brief:'Kilatan petir dan garis listrik; bukan auto Speed bonus atau immunity.'},
  {id:'ice',label:'Es',definitionFile:'content/elf-events-design.json',definitionId:'ice-manipulation',powerLabel:'Kendali Es',tags:['ice'],shift:[.05,-.1,.2,.1,.1,0,.2],brief:'Kristal es dan embun dingin; tidak otomatis memilih musim Winter.'},
  {id:'metal',label:'Logam',definitionFile:'content/video2-race-imports-design.json',definitionId:'metal-manipulation',powerLabel:'Manipulasi Logam',tags:['metal','material'],shift:[.2,-.1,.25,.05,.1,.1,.1],brief:'Permukaan metal dan serpihan logam; bukan otomatis Machine atau armor tambahan.'},
  {id:'plant',label:'Tumbuhan',definitionFile:'content/elf-events-design.json',definitionId:'forest-control',powerLabel:'Kendali Tumbuhan',tags:['plants','nature'],shift:[0,.1,.1,.1,0,0,.2],brief:'Daun, akar, dan sulur; bukan transformasi menjadi Forest Elf.'},
  {id:'light',label:'Cahaya',definitionFile:'content/universal-concept-wheel-design.json',definitionId:'concept-light',powerLabel:'Kendali Cahaya',tags:['light'],shift:[0,.15,0,.15,.05,0,.25],brief:'Sinar, kilau, dan bias cahaya; mode Power biasa, bukan God Authority.'},
  {id:'darkness',label:'Kegelapan',definitionFile:file,definitionId:'darkness-manipulation',powerLabel:'Kendali Kegelapan',tags:['darkness'],shift:[.05,.1,.1,.1,.1,0,.25],brief:'Area redup/gelap karena cahaya dikurangi; tidak otomatis menjadi Demon.'},
  {id:'shadow',label:'Bayangan',definitionFile:'content/elf-events-design.json',definitionId:'shadow-manipulation',powerLabel:'Manipulasi Bayangan',tags:['shadow'],shift:[0,.25,0,.1,.2,0,.2],brief:'Bayangan berbentuk siluet atau sulur; berbeda dari sekadar memadamkan cahaya.'},
  {id:'void',label:'Void',definitionFile:'content/primordial-events-design.json',definitionId:'primordial-void-manipulation',powerLabel:'Kendali Kekosongan',tags:['void','space'],shift:[.15,.05,.15,.2,.05,0,.4],brief:'Rongga kosong dan distorsi batas materi; bukan penghapusan semesta atau mastery maksimum.'},
];
const ids = [...element.wheels[0].outcomes.map(o=>o.id), ...additions.map(o=>o.id)];
element.version = 'element-wheel/0.2.0'; element.updatedDate='2026-10-11';
element.schemaVersion='roda-kekacauan-universal-element-wheel/0.2';
element.status='User-requested expanded universal Element;12 equal outcomes curated within request, canonical power references reused, no extra race/stat/mastery grants.';
Object.assign(element.contract, {
  starterPool:'Twelve current elements: Api, Air, Tanah, Angin, Petir, Es, Logam, Tumbuhan, Cahaya, Kegelapan, Bayangan, Void. Original four IDs retained.',
  weights:'Each of12 live Element outcomes has baseWeight1:1/12=8.333333% before explicit factors. Stat/mastery5%..25% bounds do not apply to this selector. Equalizer remains uniform after hard guards.',
  registry:'One canonical Element wheel. Five local power definitions and seven imports; each power keeps its original definitionFile/definitionId/tier. No caller-specific duplicate powers.',
  callerAccess:'Element Pixie, Naga, Element Golem, Elemental, Dragon and Elemental Slime call the same wheel once, record one element and grant its exact linked power.',
  powerIdentity:'Existing Ice/Shadow/Lightning/Metal/Forest Control/Light Concept/Primordial Void are reused by exact canonical reference. Light always uses ordinary power mode, never Authority. Repeated grants merge ownership by the existing power ownership contract.',
  distinctions:'Kegelapan controls reduction/absence of light; Bayangan controls shadow forms; Void uses the existing bounded fundamental void definition. No automatic Shadow Army, Demon identity, immunity, extra body form or maximum mastery.',
  tier:'Element odds are independent of intrinsic power tier. Eleven linked powers are Tier3; Void reuses existing Tier5. Mastery is shared and rolled normally; no max guarantee is introduced.',
  replay:'New invocations use element-wheel/0.2.0. Saved four-outcome pools/results/effects replay exactly as committed; never redraw or renormalize old spins.',
});
element.powers.push({
  id:'darkness-manipulation',label:'Darkness Manipulation (Kendali Kegelapan)',group:'element-manipulation',elementId:'darkness',
  contentStatus:'Authored within user-requested Element expansion; distinct scope from Shadow Manipulation.',
  scope:'Mengurangi atau menghalangi cahaya sehingga area menjadi gelap, dalam batas jangkauan, durasi dan resistansi profil.',
  affinityTags:['darkness'],powerTier:3,powerTierPolicyVersion:'power-tier/1.0.0',
  powerTierReason:'Kendali fenomena cahaya/gelap secara serbaguna tetapi terbatas; bukan manipulasi keberadaan atau Authority.',
  powerTierRef:'content/power-tier-design.json#darkness-manipulation',masteryRank:null,masteryTiming:'main-power-stage; one shared character result',
  enchantment:'never from power mastery',mechanicalBalance:'Range, duration, targets, costs, resistance and rank-dependent limits remain configurable.',
  resultContext:{facts:['Power diperoleh: Kendali Kegelapan'],narrativeContext:'Karakter memiliki Kendali Kegelapan dari sumber grant yang benar-benar tercatat; tidak otomatis mempunyai Manipulasi Bayangan atau Void.'},
});
element.powerImports=additions.filter(a=>a.definitionFile!==file).map(a=>({elementId:a.id,powerDefinitionRef:{definitionFile:a.definitionFile,definitionId:a.definitionId,grantMode:'power'},displayLabel:a.powerLabel}));
for(const p of element.powers)if(p.contentStatus?.includes('proposed four-element starter'))p.contentStatus='Authored ability wording; active twelve-element universal selector.';
const wheel=element.wheels[0]; wheel.version=element.version; wheel.outcomeCount=12;
wheel.status='Twelve equal canonical outcomes; user-requested expansion with authored complementary Es/Logam/Tumbuhan.';
for(const o of wheel.outcomes){o.inclusionStatus='Retained active original element';o.probability=1/12;o.powerDefinitionRef={definitionFile:file,definitionId:o.powerDefinitionId,grantMode:'power'};}
for(const a of additions)wheel.outcomes.push({
  id:a.id,label:a.label,inclusionStatus:'User-requested expansion or authored complementary familiar element',baseWeight:1,probability:1/12,
  powerDefinitionId:a.definitionId,powerDefinitionRef:{definitionFile:a.definitionFile,definitionId:a.definitionId,grantMode:'power'},powerDisplayLabel:a.powerLabel,
  visualBrief:a.brief,
  effects:[{type:'record-element-affinity',elementId:a.id},{type:'grant-power',definitionFile:a.definitionFile,definitionId:a.definitionId,grantMode:'power',masteryTiming:'main-power-stage',source:'actual committed caller result'}],
  narrationContext:{facts:[`Elemen terpilih: ${a.label}`,`Power diperoleh: ${a.powerLabel}`],displayContext:`Dapet ${a.label}. ${a.powerLabel} masuk build; mastery mengikuti hasil bersama karakter.`},
  influenceDraft:{status:'Authored element stat likelihoods and main-power affinities implemented; detailed combat limits remain separate.',targets:['stat','power'],basis:['elementId','exact canonical power reference']},
});
element.sharedConsumers['fire-manipulation'].push('Elemental Slime / Api result');
for(const [id,label]of [['water-manipulation','Air'],['earth-manipulation','Tanah'],['wind-manipulation','Angin']])element.sharedConsumers[id].push(`Elemental Slime / ${label} result`);
for(const a of additions)element.sharedConsumers[a.definitionId]=['Element Pixie','Naga','Element Golem','Elemental','Dragon','Elemental Slime'].map(c=>`${c} / ${a.label} result`);
const dragon=data['content/dragon-events-design.json'];
dragon.sharedPowerReferences=wheel.outcomes.map(o=>({definitionFile:o.powerDefinitionRef.definitionFile.replace(/^content\//,''),definitionId:o.powerDefinitionRef.definitionId,grantMode:'power',access:'Only through the actual selected Element child outcome, never every Element power as a bundle.'}));
element.openBalance=element.openBalance.filter(s=>!/^Element roster/.test(s));
element.expansion={version:element.version,authority:'User requests lightning/light/dark/void/shadow/etc; twelve-choice complementary curation.',recovery:recoveryFile,originalOutcomeIds:ids.slice(0,4),addedOutcomeIds:ids.slice(4),algorithm:'same equal universal selector; existing grants, stage timing and mastery policies retained'};

// Shared ownership must not import the Elf source identity/season into other callers.
const elf=data['content/elf-events-design.json'];
for(const [id,text]of [['ice-manipulation','Karakter memiliki Kendali Es. Sumber grant mengikuti hasil aktual; memiliki power ini tidak otomatis berarti musim Winter.'],['shadow-manipulation','Karakter memiliki Manipulasi Bayangan. Sumber grant mengikuti hasil aktual; memiliki power ini tidak otomatis berarti Shadow Elf.'],['forest-control','Karakter memiliki Kendali Hutan/Tumbuhan dari sumber grant aktual; tidak otomatis menjadi Forest Elf.']]) {
  const p=elf.powers.find(p=>p.id===id);p.resultContext.narrativeContext=text;
  if(id==='ice-manipulation')p.affinityTags=p.affinityTags.filter(t=>t!=='winter');
}

const policy=data['content/archetype-eligibility-design.json'];
for(const [family,tables]of Object.entries(policy.runtimeRules.validOutcomes))if(tables['element-universal'])tables['element-universal']=[...ids];
for(const audit of policy.catalogAudits.filter(a=>a.wheelId==='element-universal')){
  const prototype=audit.outcomes[0];
  for(const a of additions)audit.outcomes.push({...prototype,id:a.id,label:a.label,reason:'Selected elemental specialization retains the existing skip decision; no new Archetype spin.'});
  const table=policy.runtimeRules.tables[audit.runtimeTableKey];
  for(const a of additions)table[a.id]={...structuredClone(table.fire),reasonCode:`RACE_RULE:${audit.familyId}:element-universal:${a.id}`};
}
policy.coverage.contextualOutcomeRows=policy.catalogAudits.reduce((s,a)=>s+a.outcomes.length,0);
policy.elementExpansion={version:element.version,source:file,policy:'Membership extension only; existing skip and caller boost rules retained.'};
const slayer=data['content/slayer-events-design.json'];
for(const [key,assignment]of Object.entries(slayer.quantityAssignments))if(key.endsWith(':element-universal'))for(const a of additions)assignment[a.id]=assignment.fire;
slayer.elementExpansion={version:element.version,policy:'Identity-only elemental selectors use12 outcomes; all quantity profiles/rewards unchanged. Dragon still stops before Element.'};

const stat=data['content/stat-odds-design.json'];
for(const selectors of Object.values(stat.raceResultWheels))if(selectors['element-universal'])selectors['element-universal']=[...ids].sort();
for(const a of additions)stat.evidenceRules.push({id:`element-${a.id}`,version:'1',group:`element-${a.id}`,when:[`result:element-universal:${a.id}`],shift:a.shift,
  reason:'Authored small element-specific likelihood in seven distinct stat/mastery axes; not a flat bonus or empirical observation.'});
stat.elementExpansion={version:element.version,ruleCount:additions.length,axisOrder:stat.statKeys,probabilityBoundsUnchanged:true};
const power=data['content/main-power-wheel-design.json'],weapon=data['content/weapon-wheel-design.json'];
for(const design of [power,weapon]){
  const sourceProfiles=design.probabilityModel.raceProfiles.filter(p=>p.when.some(c=>c.wheelId==='element-universal'&&c.outcomeIds.includes('fire')));
  for(const profile of sourceProfiles)for(const a of additions){const next=structuredClone(profile);next.id=next.id.replace(/fire$/,a.id);next.reviewedCaseId=next.reviewedCaseId.replace(/fire$/,a.id);next.when.find(c=>c.wheelId==='element-universal').outcomeIds=[a.id];design.probabilityModel.raceProfiles.push(next);}
  design.elementExpansion={version:element.version,policy:'New elemental body routes inherit the same source-bound base propensity; actual element adds only declared soft affinity/likelihood. No new Weapon/Power main-wheel outcomes.'};
}
const existingAffinityFamilies=[...new Set(power.probabilityModel.raceResultAffinities.filter(p=>p.when.some(c=>c.wheelId==='element-universal')).map(p=>p.familyId))];
for(const family of existingAffinityFamilies)for(const a of additions)power.probabilityModel.raceResultAffinities.push({id:`power-element-${family}-${a.id}`,familyId:family,when:[{wheelId:'element-universal',outcomeIds:[a.id]}],tagFactors:Object.fromEntries(a.tags.map(t=>[t,1.5]))});
const tiers=data['content/power-tier-design.json'];
const darkness=element.powers.at(-1);
tiers.ratings.push({definitionId:darkness.id,definitionFile:file,label:darkness.label,powerTier:3,reason:darkness.powerTierReason});
tiers.definitionCount=tiers.ratings.length;tiers.countsByBaseTier['3']++;tiers.updatedDate='2026-10-11';
tiers.catalogAdditions.push({version:element.version,definitionFile:file,count:1,definitionIds:[darkness.id],policy:'Compatible append; all302 earlier ratings unchanged. Seven additional Element choices reuse existing exact definitions/tier metadata.'});

const race=data['content/race-wheel-design.json'];
race.mechanicsContract.universalElement.starterStatus='Twelve current familiar/fantasy elements; equal weights; see universal Element authority.';
for(const w of race.extraWheels.filter(w=>w.id==='element-universal')){w.outcomeCount=12;w.status=wheel.status;w.catalogVersion=element.version;}
race.confirmedRules.push('2026-10-11: Element universal expanded to12 equal choices; exact canonical linked powers reused, one grant per selected result and normal shared mastery. Kegelapan/Bayangan/Void have distinct scopes.');
const spec=data['framework/spec.json'];
spec.universalElementContract={design:file,...element.contract,version:element.version,outcomeCount:12};
spec.powerTierContract.definitionCount=tiers.definitionCount;
spec.powerTierContract.latestAddition={version:element.version,definitionFile:file,definitionIds:[darkness.id],count:1};
if(spec.wheelContract.universalElementRegistry)spec.wheelContract.universalElementRegistry.outcomeCount=12;
spec.acceptedRequirements.push('Expand canonical Element selector to12 equal choices including Petir/Cahaya/Kegelapan/Bayangan/Void; preserve original outcomes and saved spins. Linked power mastery stays normal/shared; no new Authority/max guarantee.');
for(const f of files.filter(f=>f!=='reference/size-profile-coverage.json'))write(f,data[f]);

// Rebuild identity census from current authoritative conditional routes. Existing fixtures are preserved byte-for-value.
const coverage=data['reference/size-profile-coverage.json'];
function paths(family,selectors,index=0,pairs=[]){
  if(index===selectors.length)return[pairs];const s=selectors[index],selected=Object.fromEntries(pairs);
  if(s.when&&!Object.entries(s.when).every(([w,allowed])=>allowed.includes(selected[w])))return paths(family,selectors,index+1,pairs);
  return policy.runtimeRules.validOutcomes[family][s.wheelId].flatMap(id=>paths(family,selectors,index+1,[...pairs,[s.wheelId,id]]));
}
const oldCases=new Map(coverage.terminalCases.map(c=>[c.id,c]));
coverage.terminalCases=policy.runtimeRules.familyIds.flatMap(family=>paths(family,slayer.identityRoutes[family].selectors).map(pairs=>{
  const id=[family,...pairs.map(p=>p[1])].join('/');
  if(oldCases.has(id))return oldCases.get(id);
  return{id,familyId:family,input:{runId:'coverage-run',characterId:'coverage-hero',invocationId:'size',raceFacts:[{familyId:family,sourceId:`identity:${family}`,committed:true,
    results:pairs.map(([wheelId,outcomeId])=>({wheelId,outcomeId,spinId:`source:${family}:${wheelId}:${outcomeId}`}))}],archetypeIds:[]}};
}));
coverage.terminalCaseCount=coverage.terminalCases.length;
coverage.census=Object.fromEntries(policy.runtimeRules.familyIds.map(f=>[f,coverage.terminalCases.filter(c=>c.familyId===f).length]));
coverage.date='2026-10-11';coverage.elementExpansion={version:element.version,additionalTerminalCases:24,existingCasesPreserved:true};
const {planSizeStage}=await import('../size-wheel.mjs');
coverage.assignments=[...coverage.terminalCases,...coverage.ownerRewardContextCases].map(c=>{const p=planSizeStage(c.input);assert.equal(p.status,'ready',c.id);return{caseId:c.id,profileId:p.profile.id,metric:p.profile.metric,outcomeCount:p.outcomes.length};});
write('reference/size-profile-coverage.json',coverage);
const sz=data['content/size-wheel-design.json'];sz.profileCoverage.terminalIdentityCases=coverage.terminalCaseCount;
write('content/size-wheel-design.json',sz);spec.sizeContract.profileCoverage.terminalIdentityCases=coverage.terminalCaseCount;
write('framework/spec.json',spec);
console.log(JSON.stringify({version:element.version,outcomeCount:12,baseProbability:1/12,powerDefinitionCount:tiers.definitionCount,terminalRaceRoutes:coverage.terminalCaseCount,newElementIds:additions.map(a=>a.id),recoveryFile}));
