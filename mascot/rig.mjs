// Illustrated replacement frames. Eyeballs and mouths are never deformed by code.
import { MASCOT_LAYER_ART } from './layer-assets.mjs';
import { sampleMascotMotion } from './motion.mjs';
import { assessMascotOutcome } from './expectation.mjs';
export const MASCOT_EXPRESSIONS=Object.fromEntries(['idle','smug','hype','laugh','shock','zonk','annoyed','sad','thinking'].map(name=>[name,{frame:name}]));
export const MASCOT_LAYER_IDS=['motion','body','tail','paw-left','paw-right','head','illustration'];
export const MASCOT_BLEND_SECONDS=.12;
const mascotFrames=[...Object.keys(MASCOT_EXPRESSIONS),'blink'];
const mascotClamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mascotN=v=>Number.isFinite(v)?+v.toFixed(4):0;
const mascotXML=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function mascotExpressionFor(result,phase='result',plan=null){
  if(phase==='spinning'||phase==='anticipation')return 'thinking';
  if(!result)return 'idle';
  if(plan){const a=assessMascotOutcome(plan,result.id);if(a.status==='assessed')return a.expression;}
  // A numeric label alone cannot establish how good a roll is for this build.
  if(Number.isInteger(result.value))return 'smug';
  if(result.funnyResult)return 'laugh';
  if(/(?:^|-)none$/.test(result.id||''))return 'zonk';
  if((result.tier||0)>=4)return 'hype';
  return 'smug';
}
export function sampleMascotPose({expression='idle',from='idle',fromPose=null,elapsed=1,time=0,talking=false,lookX=0,lookY=0,reducedMotion=false,expressionOnly=false,action='idle',actionElapsed=0,fromMotion=null}={}){
  if(!MASCOT_EXPRESSIONS[expression]||!MASCOT_EXPRESSIONS[from])throw new Error('Unknown mascot expression');
  for(const v of [elapsed,time,lookX,lookY])if(!Number.isFinite(v))throw new Error('Invalid mascot time/pose');
  const source=fromPose?.weights||{[from]:1};
  if(Object.entries(source).some(([k,v])=>!mascotFrames.includes(k)||!Number.isFinite(v)||v<0)||Math.abs(Object.values(source).reduce((a,b)=>a+b,0)-1)>1e-6)throw new Error('Invalid mascot blend source');
  const q=mascotClamp(elapsed/MASCOT_BLEND_SECONDS,0,1),blend=reducedMotion?1:q*q*(3-2*q);
  const weights=Object.fromEntries(mascotFrames.map(k=>[k,(source[k]||0)*(1-blend)+(k===expression?blend:0)]));
  let blink=false;
  // The closed-eye drawing replaces idle only; other moods keep their drawn mouth.
  if(!reducedMotion&&!expressionOnly&&expression==='idle'&&blend===1){
    const cycle=((time%4.3)+4.3)%4.3;
    if(cycle>=3.94&&cycle<4.06){weights.idle=0;weights.blink=1;blink=true;}
  }
  return {weights,blink,...sampleMascotMotion({action,actionElapsed,fromMotion,time,lookX,lookY,talking,reducedMotion:reducedMotion||expressionOnly})};
}
function mascotMotion(p){return `translate(${mascotN(p.x)} ${mascotN(p.y)}) rotate(${mascotN(p.tilt)} 180 235)`;}
const mascotJoint=(p={},x,y)=>`translate(${mascotN(p.x||0)} ${mascotN(p.y||0)}) rotate(${mascotN(p.tilt||0)} ${x} ${y})`;
const mascotPiece=(name)=>`<image data-frame="${name}" width="360" height="440" preserveAspectRatio="xMidYMid meet" href="${MASCOT_LAYER_ART.pieces[name]}"/>`;
function mascotFrameOpacities(weights){
  let sum=0;
  // Overlay normalized weights over a fully opaque bottom frame. Avoid dimming
  // the unchanged body when two transparent replacement images crossfade.
  return Object.fromEntries(mascotFrames.map(k=>{const w=weights[k]||0;sum+=w;return [k,w>0?w/sum:0];}));
}
export function renderMascotGroup({x=0,y=0,width=360,height=440,id='bara',expression='idle',pose=null,label='Bara, maskot Barong Roda Kekacauan'}={}){
  for(const v of [x,y,width,height])if(!Number.isFinite(v))throw new Error('Invalid mascot dimensions');
  if(width<=0||height<=0)throw new Error('Invalid mascot dimensions');
  if(!MASCOT_EXPRESSIONS[expression])throw new Error('Unknown mascot expression');
  const p=pose||sampleMascotPose({expression,reducedMotion:true}),opacities=mascotFrameOpacities(p.weights);
  const frames=mascotFrames.map(k=>`<image data-frame="${k}" x="0" y="0" width="360" height="440" preserveAspectRatio="xMidYMid meet" opacity="${mascotN(opacities[k])}"${opacities[k]>0?` href="${MASCOT_LAYER_ART.heads[k]}"`:''}/>`).join('');
  return `<g id="${mascotXML(id)}" class="mascot-rig" data-mascot="bara" data-art-method="layered-drawn-expression-frames" data-expression="${mascotXML(expression)}" role="img" aria-label="${mascotXML(label)}" transform="translate(${mascotN(x)} ${mascotN(y)}) scale(${mascotN(width/360)} ${mascotN(height/440)})"><g data-part="motion" transform="${mascotMotion(p)}"><g data-part="body" transform="${mascotJoint(p.body,180,417)}"><g data-part="tail" transform="${mascotJoint(p.tail,273,361)}">${mascotPiece('tail')}</g>${mascotPiece('body')}<g data-part="paw-left" transform="${mascotJoint(p.pawLeft,148,370)}">${mascotPiece('pawLeft')}</g><g data-part="paw-right" transform="${mascotJoint(p.pawRight,229,370)}">${mascotPiece('pawRight')}</g><g data-part="head" transform="${mascotJoint(p.head,180,287)}"><g data-part="illustration">${frames}</g></g></g></g></g>`;
}
export function applyMascotPose(root,p){
  if(!root)return;
  root.querySelector('[data-part="motion"]')?.setAttribute('transform',mascotMotion(p));
  for(const [part,key,x,y] of [['body','body',180,417],['head','head',180,287],['tail','tail',273,361],['paw-left','pawLeft',148,370],['paw-right','pawRight',229,370]])root.querySelector(`[data-part="${part}"]`)?.setAttribute('transform',mascotJoint(p[key],x,y));
  const opacities=mascotFrameOpacities(p.weights);
  for(const k of mascotFrames){
    const frame=root.querySelector(`[data-frame="${k}"]`);if(!frame)continue;
    if(opacities[k]>0&&frame.getAttribute?.('href')!==MASCOT_LAYER_ART.heads[k])frame.setAttribute('href',MASCOT_LAYER_ART.heads[k]);
    frame.setAttribute('opacity',mascotN(opacities[k]));
  }
}
export function renderMascotSVG(options={}){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440" width="360" height="440">${renderMascotGroup(options)}</svg>`;}
