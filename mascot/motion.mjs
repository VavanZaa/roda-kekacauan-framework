// Deterministic 2D performance. No game RNG, neural model, or facial deformation.
export const MASCOT_ACTIONS=Object.freeze({
  idle:{label:'Santuy',duration:0},
  headShake:{label:'Geleng kepala',duration:1.6},
  bodyShake:{label:'Goyang badan',duration:1.8},
  nod:{label:'Angguk',duration:1.5},
  curious:{label:'Kepo',duration:2.2},
  hop:{label:'Loncat kecil',duration:1.8},
  roll:{label:'Guling!',duration:2.8},
  cuddle:{label:'Manja',duration:2.4}
});
const motionZero=()=>({x:0,y:0,tilt:0,head:{x:0,y:0,tilt:0},body:{x:0,y:0,tilt:0},tail:{tilt:0},pawLeft:{tilt:0},pawRight:{tilt:0}});
const motionEase=t=>{const q=Math.min(1,Math.max(0,t));return q*q*q*(q*(q*6-15)+10);};
const motionMix=(a,b,w)=>Object.fromEntries(Object.keys(b).map(k=>{
  if(typeof b[k]==='object')return [k,motionMix(a?.[k]||{},b[k],w)];
  const av=a?.[k]||0,delta=k==='tilt'?((b[k]-av+540)%360)-180:b[k]-av;
  return [k,av+delta*w];
}));
export function mascotActionFor(expression,assessment=null){if(assessment?.tone==='wild')return 'bodyShake';return ({laugh:'bodyShake',hype:'hop',shock:'headShake',zonk:'headShake',annoyed:'headShake',sad:'cuddle',thinking:'curious',smug:'nod'})[expression]||'idle';}
export function sampleMascotMotion({action='idle',actionElapsed=0,fromMotion=null,time=0,lookX=0,lookY=0,talking=false,reducedMotion=false}={}){
  if(!MASCOT_ACTIONS[action])throw new Error('Unknown mascot action');
  for(const v of [actionElapsed,time,lookX,lookY])if(!Number.isFinite(v))throw new Error('Invalid mascot motion time');
  const pose=motionZero();if(reducedMotion)return pose;
  const lx=Math.min(1,Math.max(-1,lookX)),ly=Math.min(1,Math.max(-1,lookY));
  // Breath in body, slower sway in head, tiny secondary motion in tail/paws.
  pose.y=Math.sin(time*2.4)*1.15;pose.body.tilt=Math.sin(time*1.55)*.45;
  pose.head.tilt=Math.sin(time*1.7)*.8+lx*2.4;pose.head.x=lx*1.4;pose.head.y=ly*.7;
  pose.tail.tilt=Math.sin(time*2.1-.65)*2;
  if(talking){pose.head.y+=Math.sin(time*11)*.6;pose.head.tilt+=Math.sin(time*7)*.4;}
  const d=MASCOT_ACTIONS[action].duration,t=Math.max(0,actionElapsed),p=d?t/d:1;
  if(d&&p<1){
    // C2 envelope: action displacement and speed vanish at both ends.
    const e=Math.sin(Math.PI*Math.min(1,p))**4;
    if(action==='headShake'){pose.head.tilt+=Math.sin(p*Math.PI*8)*9*e;pose.head.x+=Math.sin(p*Math.PI*8)*2.5*e;pose.tail.tilt+=Math.sin(p*Math.PI*8-.7)*2*e;}
    if(action==='bodyShake'){pose.body.tilt+=Math.sin(p*Math.PI*8)*4.2*e;pose.head.tilt-=Math.sin(p*Math.PI*8-.45)*5.5*e;pose.tail.tilt+=Math.sin(p*Math.PI*8-.9)*8*e;}
    if(action==='nod'){pose.head.y+=Math.sin(p*Math.PI*6)*4*e;pose.head.tilt+=Math.sin(p*Math.PI*6)*1.7*e;}
    if(action==='curious'){pose.head.tilt+=11*e;pose.head.y-=2*e;pose.tail.tilt-=4*e;}
    if(action==='hop'){pose.y-=Math.abs(Math.sin(p*Math.PI*3))*24*e;pose.head.y-=2*e;pose.body.tilt+=Math.sin(p*Math.PI*3)*2*e;pose.pawLeft.tilt-=9*e;pose.pawRight.tilt+=9*e;}
    if(action==='roll'){
      // A flat illustrated tumble, not a generated rear/side view. One complete
      // revolution returns to the identical orientation, with zero end velocity.
      pose.tilt=360*motionEase(p);pose.x+=Math.sin(p*Math.PI*2)**3*24;
      pose.y-=Math.sin(p*Math.PI)**2*25;pose.head.tilt-=4*e;
      pose.tail.tilt+=14*e;pose.pawLeft.tilt-=12*e;pose.pawRight.tilt+=12*e;
    }
    if(action==='cuddle'){pose.head.tilt-=8*e;pose.head.y+=3*e;pose.body.tilt+=2*e;pose.pawLeft.tilt+=13*e;pose.pawRight.tilt-=13*e;pose.tail.tilt+=8*e;}
  }
  if(fromMotion&&t<.18)return motionMix(fromMotion,pose,motionEase(t/.18));
  return pose;
}
