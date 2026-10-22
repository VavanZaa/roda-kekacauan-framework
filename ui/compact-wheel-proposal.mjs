import { normalizeDisplayPlan } from './wheel-geometry.mjs';

// UI comparison proposal only. Never import this from the gameplay planners.
export function buildCompactProposal(input,{maximumNames=null,averageTarget=.02,minimumName=.01}={}){
  if(input.committedOutcomeId)throw new Error('Never curate an already committed production wheel.');
  const source=normalizeDisplayPlan(input),none=source.outcomes.filter(o=>/(?:^|-)none$/.test(o.id)),items=source.outcomes.filter(o=>!/(?:^|-)none$/.test(o.id));
  if(!['weapon-main','power-main'].includes(source.wheelId)||!items.length)return source;
  const noneMass=none.reduce((s,o)=>s+o.probability,0),mass=1-noneMass,isWeapon=source.wheelId==='weapon-main';
  const tiers=[...new Set(items.map(o=>o.tier))].sort((a,b)=>a-b);
  if(tiers.length!==5||tiers.some(t=>!Number.isInteger(t)))throw new Error('Proposal needs five canonical tiers.');
  const hash=text=>{let n=2166136261;for(const c of text){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;};
  const ordered=items.toSorted((a,b)=>b.probability-a.probability || hash(source.contextLabel+':'+a.id)-hash(source.contextLabel+':'+b.id));
  const desired=Math.max(5,Math.min(maximumNames??(isWeapon?30:20),Math.floor(mass/averageTarget+1e-8))),chosen=[];
  if(isWeapon){
    const perTier=Math.max(1,Math.floor(desired/5));
    for(const tier of tiers){const pool=ordered.filter(o=>o.tier===tier),tierMass=pool.reduce((s,o)=>s+o.probability,0),count=Math.min(pool.length,perTier,Math.floor(tierMass/minimumName+1e-8));
      if(count<1)throw new Error('Tier mass is too small for the proposed minimum.');
      const picks=pool.slice(0,count),total=picks.reduce((s,o)=>s+o.probability,0),remaining=tierMass-count*minimumName;
      chosen.push(...picks.map(o=>({...o,probability:minimumName+remaining*o.probability/total})));
    }
  }else{
    for(const tier of tiers)chosen.push(ordered.find(o=>o.tier===tier));
    for(const o of ordered){if(chosen.length>=desired)break;if(!chosen.some(p=>p.id===o.id))chosen.push(o);}
    if(chosen.length*minimumName>mass+1e-8)throw new Error('None leaves too little mass for five tiers and this minimum.');
    const total=chosen.reduce((s,o)=>s+o.probability,0),remaining=mass-chosen.length*minimumName;
    for(const o of chosen)o.probability=minimumName+remaining*o.probability/total;
  }
  const order=new Map(source.outcomes.map((o,i)=>[o.id,i]));
  return normalizeDisplayPlan({...source,sourceMode:'compact-ui-proposal-only',contextLabel:source.contextLabel+' · draf ringkas',
    proposal:{status:'not-approved-for-gameplay',catalogPositiveCount:items.length,selectedPositiveCount:chosen.length,noneMass,minimumName,averageTarget,
      tierPolicy:isWeapon?'Preserve each original tier mass exactly.':'Power tier mass is reallocated in this proposal; no live planner changes.'},
    outcomes:[...none,...chosen.toSorted((a,b)=>order.get(a.id)-order.get(b.id))]});
}
