// Rendering receives frozen probabilities. It never edits or samples gameplay.
export function mod(value){return ((value%360)+360)%360;}
export function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
export function normalizeDisplayPlan(plan){
  if(!plan||!Array.isArray(plan.outcomes)||!plan.outcomes.length)throw new Error('Frozen wheel needs outcomes.');
  const ids=new Set();let sum=0;
  const outcomes=plan.outcomes.map((o,i)=>{
    if(typeof o.id!=='string'||!o.id||ids.has(o.id))throw new Error('Every outcome needs a unique ID.');ids.add(o.id);
    if(typeof o.label!=='string'||!o.label||!Number.isFinite(o.probability)||o.probability<=0)throw new Error('Invalid outcome label/probability.');
    const result={...o,index:i,start:sum*360,end:(sum+o.probability)*360,mid:(sum+o.probability/2)*360};sum+=o.probability;return result;
  });
  if(Math.abs(sum-1)>1e-8)throw new Error('Frozen probabilities must sum to 1; the UI does not rebalance them.');
  if(plan.fixed && outcomes.length!==1)throw new Error('A fixed reveal must have one result.');
  if(plan.committedOutcomeId && !ids.has(plan.committedOutcomeId))throw new Error('Committed result must exist in the frozen wheel.');
  return {...plan,outcomes};
}
export function outcomeAtRotation(plan,rotation){
  const angle=mod(-rotation);
  return plan.outcomes.find(o=>angle>=o.start && angle<o.end)||plan.outcomes.at(-1);
}
export function selectDemoOutcome(plan,sample){
  if(plan.fixed||plan.outcomes.length===1)return plan.outcomes[0];
  if(!Number.isFinite(sample)||sample<0||sample>=1)throw new Error('Sample must be in [0,1).');
  return plan.outcomes.find(o=>sample*360<o.end)||plan.outcomes.at(-1);
}
export function stopRotation(plan,outcomeId,current=0,turns=4){
  const o=plan.outcomes.find(o=>o.id===outcomeId);if(!o)throw new Error('Committed outcome is not in the frozen plan.');
  if(!Number.isFinite(current)||!Number.isSafeInteger(turns)||turns<1)throw new Error('Invalid motion input.');
  const target=mod(-o.mid);
  return current-360*turns-mod(mod(current)-target);
}
export const WHEEL_SPIN_MOTION=Object.freeze({version:'momentum/1',accelerationFraction:.12,cruiseUntilFraction:.38});
export function motionProgress(t,profile=WHEEL_SPIN_MOTION){
  t=Math.max(0,Math.min(1,t));
  if(profile.version==='legacy-cubic/1'){
    const a=.055,area=a/2+(1-a)/3;
    return (t<a?t*t/(2*a):a/2+(1-a)/3*(1-Math.pow((1-t)/(1-a),3)))/area;
  }
  if(profile.version!=='momentum/1')throw Error('Unknown wheel motion profile.');
  const a=profile.accelerationFraction,c=profile.cruiseUntilFraction;
  if(!(a>0&&a<c&&c<1))throw Error('Invalid wheel motion phases.');
  // Integrate a smooth velocity curve: wind up, carry momentum, coast to rest.
  // The fixed endpoint/turn count is unchanged; no bounce, reverse or overshoot.
  const area=a/2+(c-a)+(1-c)/2;
  if(t<a)return (t/2-a*Math.sin(Math.PI*t/a)/(2*Math.PI))/area;
  if(t<c)return (a/2+t-a)/area;
  const u=(t-c)/(1-c);
  return (a/2+c-a+(1-c)*(u/2+Math.sin(Math.PI*u)/(2*Math.PI)))/area;
}
export function polar(cx,cy,r,deg){const a=deg*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];}
export function sectorPath(cx,cy,r,start,end){
  const span=end-start,[x,y]=polar(cx,cy,r,start-90),[u,v]=polar(cx,cy,r,end-90);
  if(span>=359.999999)return `M${cx} ${cy-r} A${r} ${r} 0 1 1 ${cx} ${cy+r} A${r} ${r} 0 1 1 ${cx} ${cy-r} Z`;
  return `M${cx} ${cy} L${x} ${y} A${r} ${r} 0 ${span>180?1:0} 1 ${u} ${v} Z`;
}
export function wrapWords(label,maxChars=27,maxLines=3){
  const words=String(label).split(/\s+/),lines=[];let line='';
  for(const word of words){if(line && (line+' '+word).length>maxChars){lines.push(line);line=word;}else line+=(line?' ':'')+word;}
  if(line)lines.push(line);
  // Complete labels are always preserved, even if a caller needs a smaller font.
  return lines.length<=maxLines?lines:[...lines.slice(0,maxLines-1),lines.slice(maxLines-1).join(' ')];
}
