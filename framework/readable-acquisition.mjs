// User-approved 2% minimum named-sector policy, 11 October 2026.
// Shortlist BEFORE selection; canonical catalogs remain the source of grants.
import { normalizeDisplayPlan } from '../ui/wheel-geometry.mjs';
const sum=xs=>xs.reduce((a,b)=>a+b,0);
const hash=s=>{let n=2166136261;for(const c of s){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;};
export function planReadableAcquisition(source,{seed='roster-0',minimumName=.02,maximumNames=null}={}){
  if(source.committedOutcomeId)throw Error('Shortlist must be frozen before the result is selected.');
  if(source.status&&source.status!=='ready')throw Error('Source acquisition must be ready.');
  const isWeapon=['weapon','weapon-main'].includes(source.wheelId);
  if(!isWeapon&&!['power','power-main'].includes(source.wheelId))throw Error('Only main Weapon/Power acquisitions use this policy.');
  if(minimumName!==.02)throw Error('Approved named-sector floor is 2%.');
  const full=normalizeDisplayPlan(source),none=full.outcomes.filter(o=>o.id.endsWith('-none')),
    items=full.outcomes.filter(o=>!o.id.endsWith('-none'));
  const equalizer=source.trace?.equalizerActive===true;
  const noneMass=sum(none.map(o=>o.probability)),mass=1-noneMass;
  const limit=Math.min(maximumNames??(isWeapon?30:20),Math.floor(mass/minimumName+1e-8));
  if(limit<5||![1,2,3,4,5].every(t=>items.some(o=>o.tier===t)))throw Error('Five tiers do not fit the named-sector floor.');
  const chosen=[];
  for(const tier of[1,2,3,4,5]){
    const pool=items.filter(o=>o.tier===tier),tierMass=sum(pool.map(o=>o.probability));
    const count=Math.min(pool.length,Math.floor(limit/5),isWeapon&&!equalizer?Math.floor(tierMass/minimumName+1e-8):Infinity);
    if(count<1)throw Error('One Weapon tier cannot fit a 2% sector.');
    const ranked=pool.toSorted((a,b)=>b.probability-a.probability||a.id.localeCompare(b.id));
    const picked=ranked.slice(0,Math.min(2,count));
    const variety=pool.filter(o=>!picked.some(p=>p.id===o.id)).toSorted((a,b)=>{
      const key=o=>-Math.log((hash(seed+':'+o.id)+1)/4294967297)/o.probability;
      return key(a)-key(b);
    });
    const funny=variety.find(o=>o.funnyResult===true);
    if(funny&&picked.length<count)picked.push(funny);
    for(const o of variety)if(picked.length<count&&!picked.some(p=>p.id===o.id))picked.push(o);
    if(isWeapon&&!equalizer){
      const remaining=tierMass-picked.length*minimumName,total=sum(picked.map(o=>o.probability));
      chosen.push(...picked.map(o=>({...o,probability:minimumName+remaining*o.probability/total})));
    }else chosen.push(...picked);
  }
  if(equalizer){
    for(const o of chosen)o.probability=1/(chosen.length+none.length);
    for(const o of none)o.probability=1/(chosen.length+none.length);
  }else if(!isWeapon){
    const remaining=mass-chosen.length*minimumName,total=sum(chosen.map(o=>o.probability));
    for(const o of chosen)o.probability=minimumName+remaining*o.probability/total;
  }
  const order=new Map(full.outcomes.map((o,i)=>[o.id,i]));
  return normalizeDisplayPlan({...source,version:'readable-acquisition/1.0.0',canonicalSourceVersion:source.version,
    sourceMode:'approved-readable-acquisition',freezeBeforeDraw:true,
    readability:{status:'user-approved',minimumName,seed,canonicalPositiveCount:items.length,selectedPositiveCount:chosen.length,
      nonePolicy:equalizer?'uniform-all-live-leaves':'preserve-canonical-none',
      tierPolicy:isWeapon?'preserve-each-weapon-tier-mass':'reallocate-power-tier-mass-within-preselected-pool',
      selectionPolicy:'two strongest context affinities per tier, seeded weighted variety, one funny option where available'},
    outcomes:[...none,...chosen].toSorted((a,b)=>order.get(a.id)-order.get(b.id))});
}

export function validateReadableResult(plan,result){
  if(plan.version!=='readable-acquisition/1.0.0'||plan.freezeBeforeDraw!==true||!plan.outcomes.some(o=>o.id===result.outcomeId))throw Error('Result must belong to the frozen readable pool.');
  return result;
}
