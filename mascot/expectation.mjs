// Deterministic interpretation of the actual frozen wheel, never another draw.
// The stat floor reserves lucky tails; the remaining mass describes the build's
// usual expectation. Both that baseline and the full draw mean are recorded.
export const BARA_EXPECTATION_VERSION='bara-expectation/1';
export function assessMascotOutcome(plan,resultId,{knownModifiers=[]}={}){
 const rows=plan?.outcomes??plan?.wheel?.outcomes??[];
 const selected=rows.find(o=>o.id===resultId);
 const base={version:BARA_EXPECTATION_VERSION,changesGameplay:false,sourceWheelId:plan?.wheelId??plan?.wheel?.id??null,target:plan?.target??plan?.wheelId??null};
 const guaranteed=plan?.fixed===true||plan?.actualSpin===false||plan?.status==='fixed'||(rows.length===1&&rows[0].probability===1);
 if(guaranteed)return {...base,status:'assessed',tone:'expected',expression:'smug',soundEnabled:false,guaranteed:true,expected:plan.baseValue??selected?.value??null,mechanics:{guaranteed:true,actualSpin:plan.actualSpin!==false&&plan.fixed!==true,powerEnchant:false}};
 if(!selected)return {...base,status:'context_missing',tone:'unknown',expression:'smug',soundEnabled:false,reason:'No selected outcome in a frozen wheel.'};
 const axis=Number.isInteger(selected.value)?'value':Number.isFinite(selected.tier)?'tier':null;
 if(!axis)return {...base,status:'not_numeric',tone:'categorical',expression:null,soundEnabled:false};
 const numeric=rows.filter(o=>Number.isFinite(o[axis]));
 if(!numeric.length||numeric.some(o=>!Number.isFinite(o.probability)||o.probability<=0))throw Error('Invalid Bara wheel probabilities');
 const mass=numeric.reduce((s,o)=>s+o.probability,0);
 if(mass>1+1e-8)throw Error('Bara frozen probability mass exceeds one');
 const floor=axis==='value'?(plan.distribution?.minimumProbability??0):0;
 if(!Number.isFinite(floor)||floor<0||numeric.some(o=>o.probability<floor-1e-8))throw Error('Invalid Bara reserved probability floor');
 const residual=numeric.map(o=>Math.max(0,o.probability-floor)),residualMass=residual.reduce((a,b)=>a+b,0);
 const mean=numeric.reduce((s,o)=>s+o[axis]*o.probability,0)/mass;
 const expected=residualMass>1e-10?numeric.reduce((s,o,i)=>s+o[axis]*residual[i],0)/residualMass:mean;
 const value=selected[axis],delta=value-expected,upper=numeric.filter(o=>o[axis]>=value).reduce((s,o)=>s+o.probability,0)/mass;
 const lower=numeric.filter(o=>o[axis]<=value).reduce((s,o)=>s+o.probability,0)/mass;
 const peak=Math.max(...numeric.map(o=>o.probability)),likely=numeric.filter(o=>o.probability>=peak*.8).map(o=>({value:o[axis],label:o.label}));
 let tone='expected';
 if(delta>=(axis==='value'?3:2)&&upper<=.25+1e-10)tone='wild';
 else if(delta>=.85&&upper<=.65)tone='impressed';
 else if(delta<=-2&&lower<=.4)tone='disappointed';
 else if(delta<=-1)tone='unimpressed';
 const expression=({wild:'hype',impressed:'hype',expected:'smug',disappointed:'sad',unimpressed:'annoyed'})[tone];
 const mods=knownModifiers.filter(m=>m.committed===true&&Number.isSafeInteger(m.amount)&&typeof m.sourceKey==='string');
 const knownBonus=mods.reduce((s,m)=>s+m.amount,0),target=base.target;
 return {...base,status:'assessed',axis,tone,expression,soundEnabled:['wild','impressed'].includes(tone),guaranteed:false,
  selectedValue:value,selectedLabel:selected.label,expected,fullDrawMean:mean,delta,upperTailProbability:upper,lowerTailProbability:lower,
  outcomeProbability:selected.probability,likelyBand:likely,reservedFloor:floor,baselinePolicy:floor?'frozen-mass-above-reserved-lucky-floor':'full-frozen-numeric-mean',
  mechanics:{equalizer:plan.context?.equalizerActive===true||['equalizer','uniform-frozen-wheel'].includes(plan.distribution?.method),
   resilient:plan.retryPolicy?.active===true,gambler:plan.gambler??null,knownBonus,knownProjectedValue:value+knownBonus,
   knownModifierSources:mods.map(m=>m.sourceKey),weaponEnchantEligible:target==='weapon-mastery'&&value+knownBonus>=5,
   powerEnchant:false,bonusTiming:'final-only',futureBonusesIncluded:false,priorSources:plan.context?.sourceRecords?.map(s=>s.sourceId)??[]}};
}
export function mascotExpectationComment(a,label){
 if(a?.guaranteed)return label+'. Ini sudah jaminan rodanya.';
 return ({wild:label+'?! LAH, jauh di atas perkiraan!',impressed:'Nah, '+label+'! Di atas perkiraan build ini.',
  expected:label+'. Masih sesuai perkiraan build ini.',unimpressed:label+'? Aku ngarep lebih dari build ini.',
  disappointed:'Yah, '+label+'. Jauh di bawah perkiraan.'})[a?.tone]??null;
}
