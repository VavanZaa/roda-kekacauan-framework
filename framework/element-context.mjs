import element from '../content/universal-element-wheel-design.json' with {type:'json'};
const tags={fire:['fire'],water:['water'],earth:['earth'],wind:['wind'],lightning:['lightning','storm'],ice:['ice'],metal:['metal'],plant:['plants','forest','nature'],light:['light'],darkness:['darkness','night'],shadow:['shadow'],void:['void','space']};
const file=x=>(x??'').replace(/^content\//,'');
const same=(a,b)=>file(a.definitionFile)===file(b.definitionFile)&&a.definitionId===b.definitionId&&(a.grantMode??'power')===(b.grantMode??'power');
/** Context only; this never grants a source race, ability, bonus or title. */
export function collectElementContextTags(identity,powers){
 const selected=new Set();
 for(const f of identity)for(const r of f.results??[])if(r.wheelId==='element-universal'&&tags[r.outcomeId])selected.add(r.outcomeId);
 for(const p of powers)if(p.active!==false)for(const o of element.wheels[0].outcomes)if(same(p,o.powerDefinitionRef))selected.add(o.id);
 return [...new Set([...selected].flatMap(id=>tags[id]))].sort();
}
