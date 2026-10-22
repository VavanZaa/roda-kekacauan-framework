import { writeFile } from 'node:fs/promises';
import audit from '../../reference/size-profile-coverage.json' with { type:'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planPowerWheel } from '../power-wheel.mjs';
const rows=[...audit.terminalCases,...audit.ownerRewardContextCases].map(c=>{
  const input=structuredClone(c.input),sizePlan=planSizeStage(input);
  const plan=planPowerWheel({...input,invocationId:'coverage-power',stage:'power',weaponStageComplete:true,powers:[],weapons:[],sizePlan,
    sizeResult:{invocationId:sizePlan.invocationId,spinId:'coverage-size',outcomeId:sizePlan.outcomes[5]?.id??sizePlan.outcomes[0].id}});
  if(plan.status!=='ready')throw Error(c.id+':'+plan.status);
  const tierMasses=[1,2,3,4,5].map(t=>plan.outcomes.filter(p=>p.tier===t).reduce((s,p)=>s+p.probability,0));
  return {id:c.id,familyId:c.familyId,noneProbability:plan.trace.noneProbability,tierMasses,
    expectedTierGivenPower:tierMasses.reduce((s,p,i)=>s+p*(i+1),0)/(1-plan.trace.noneProbability),
    profileIds:plan.trace.raceProfiles.map(p=>p.id),wrapperIds:plan.trace.wrapperProfiles.map(p=>p.id)};
});
const report={version:'power-odds/1.0.0',terminalIdentities:audit.terminalCases.length,ownerEventVariations:audit.ownerRewardContextCases.length,
  interpretation:'Authored adjustable game priors; main Power acquisition only. External units/prey/armies and future results do not become owner race evidence.',rows};
await writeFile(new URL('../../reference/main-power-coverage.json',import.meta.url),JSON.stringify(report,null,2)+'\n','utf8');
console.log('Audited'+rows.length+' owner contexts: positive normalized Power pools; authored per-race None/Tier masses recorded.');
