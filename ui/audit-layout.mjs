// Shared video/studio presentation. Never changes wheel outcomes or probabilities.
import { esc, polar } from './wheel-geometry.mjs';
import { TEXT_ADVANCES } from './text-metrics.mjs';

export const BARA_DIALOGUE_LAYOUT={box:[380,1300,510,168],text:[404,1340,462,123],
  nameY:1329,bodyY:1368,fontSize:36,lineHeight:42,maxLines:3};
export const VIDEO_WHEEL_LAYOUT={version:'phone-layout/2',scale:.88,shiftY:-35,cx:490,cy:785,
  result:[90,1120,800,160],reaction:[404,1309,462,154],dialogueBox:BARA_DIALOGUE_LAYOUT.box,
  readout:[115,1174,750,76],captionStressTop:1470};
export function textAdvance(s,size){return [...s].reduce((sum,c)=>sum+(TEXT_ADVANCES[c]??1),0)*size;}
export function measuredLines(s,width,size=36){
  const lines=[];let line='';
  for(const word of String(s).split(/\s+/).filter(Boolean)){
    if(line&&textAdvance(line+' '+word,size)>width){lines.push(line);line=word;}else line+=(line?' ':'')+word;
  }
  if(line)lines.push(line);return lines;
}
export function fittedLines(s,width,size,maxLines){
  let lines=measuredLines(s,width,size);
  while(lines.length>maxLines&&size>28){size-=2;lines=measuredLines(s,width,size);}
  return {lines,size};
}
const EMOJI_GLYPHS={
 '🔥':'<path d="M18 0Q40 20 29 36Q44 31 41 47Q36 65 16 62Q-7 56 1 36Q5 25 11 22Q7 41 19 40Q29 30 18 0Z" fill="#ee7940"/><path d="M20 30Q36 46 25 56Q8 59 12 46Z" fill="#ffd57c"/>',
 '😭':'<circle cx="22" cy="30" r="29" fill="#efc55f"/><path d="M3 18L15 15M30 15L41 18M10 22V48M34 22V48" stroke="#74c8e0" stroke-width="7"/><ellipse cx="22" cy="39" rx="7" ry="10" fill="#473328"/>',
 '🗿':'<path d="M8 3L33 0L43 17L39 56L10 59L2 40Z" fill="#9eaba7"/><path d="M6 19H17M26 18H37M20 17L18 35H27M14 46H32" fill="none" stroke="#455b58" stroke-width="4"/>'
};
export function readableTextLines(lines,{x,y,size=36,lineHeight=43,color='#f4e5c7',anchor='start',attribute=''}={}){
 return lines.map((line,i)=>{
   const width=textAdvance(line,size),left=anchor==='middle'?x-width/2:anchor==='end'?x-width:x;
   let cursor=left,body='';
   for(const token of line.split(/([🔥😭🗿])/u)){
    if(!token)continue;
    if(EMOJI_GLYPHS[token])body+=`<g data-color-emoji="${token}" aria-label="${token}" transform="translate(${cursor+2} ${y+i*lineHeight-size*.85}) scale(${size/64})">${EMOJI_GLYPHS[token]}</g>`;
    else body+=`<text ${attribute} x="${cursor}" y="${y+i*lineHeight}" fill="${color}" font-size="${size}" font-weight="700">${esc(token)}</text>`;
    cursor+=textAdvance(token,size);
   }
   return body;
 }).join('');
}
export function baraDialogueLines(reaction){
 const {text,fontSize}=BARA_DIALOGUE_LAYOUT;
 const lines=measuredLines(reaction,text[2],fontSize);
 // Keep a closing emoji beside a word instead of on an otherwise empty row.
 if(lines.length>1&&/^[🔥😭🗿]$/u.test(lines.at(-1))){
  const words=lines.at(-2).split(' '),last=words.pop();
  if(words.length){lines[lines.length-2]=words.join(' ');lines[lines.length-1]=last+' '+lines.at(-1);}
 }
 return lines;
}
export function baraDialoguePages(reaction){
 const lines=baraDialogueLines(reaction),pages=[];
 for(let i=0;i<lines.length;i+=BARA_DIALOGUE_LAYOUT.maxLines){
  const rows=lines.slice(i,i+BARA_DIALOGUE_LAYOUT.maxLines);
  pages.push({index:pages.length,lines:rows,duration:Math.max(2.75,rows.join(' ').split(/\s+/).length/4+.5)});
 }
 return pages.length?pages:[{index:0,lines:[],duration:2.75}];
}
export function renderBaraDialogueBox(reaction,{page=0}={}){
 const l=BARA_DIALOGUE_LAYOUT,pages=baraDialoguePages(reaction),current=pages[Math.max(0,Math.min(pages.length-1,page))],lines=current.lines;
 return `<g data-bara-dialogue="true" data-dialogue-box="bara" data-dialogue-page="${current.index}" data-dialogue-pages="${pages.length}" aria-label="${esc(reaction)}">
 <rect x="380" y="1305" width="510" height="168" rx="18" fill="#030708" opacity=".32"/>
 <path d="M381 1365L364 1384L381 1380" fill="#17201f" stroke="#9e7849" stroke-width="2" stroke-linejoin="round"/>
 <rect x="380" y="1300" width="510" height="168" rx="18" fill="#17201f" stroke="#9e7849" stroke-width="2"/>
 <path d="M401 1301H525M380 1320V1341" fill="none" stroke="#e1bb79" stroke-width="3" stroke-linecap="round"/>
 <text data-bara-name="true" x="404" y="${l.nameY}" font-size="24" font-weight="700" letter-spacing="2.5" fill="#e1bb79">BARA</text>
 <path d="M492 1322H${pages.length>1?788:866}" stroke="#a38150" stroke-opacity=".22"/>
 ${pages.length>1?`<text x="866" y="${l.nameY}" text-anchor="end" font-size="22" fill="#d9be91">${current.index+1} / ${pages.length}</text>`:''}
 ${readableTextLines(lines,{x:l.text[0],y:l.bodyY,size:l.fontSize,lineHeight:l.lineHeight,color:'#fff0d5',attribute:'data-bara-comment="true"'})}</g>`;
}
export function resultEffectCard(lines,accent='#d9b77e',heading='EFEK HASIL'){
 return `<rect x="90" y="1120" width="800" height="160" rx="15" fill="#111719" stroke="${accent}" stroke-opacity=".65"/>
 <text x="114" y="1146" fill="${accent}" font-size="20" font-weight="700" letter-spacing="2">${esc(heading)}</text>`+
 readableTextLines(lines,{x:114,y:1183,size:36,lineHeight:42});
}
const TITLE_WORDS=new Set(['Sang','Si','Penjaga','Penguasa','Pemilik','Pembawa','Pewaris','Pengembara','Pelindung','Pemburu','Yang','dari','di','dan']);
const ENCHANT_ALIASES={tiny:'Mini',slippery:'Licin',blunt:'Tumpul','too-heavy':'Berat',fragile:'Rapuh',jengkol:'Jengkol',noisy:'Bising',sticky:'Rekat',rusty:'Karat',sulky:'Ngambek','fake-damage':'Gaya',sharp:'Tajam',rustproof:'Awet',lightweight:'Ringan','comfy-grip':'Nyaman','non-slip':'Kesat','impact-resistant':'Banting',glow:'Glow',returning:'Balik',silent:'Senyap',waterproof:'Kedap',rgb:'RGB','self-cleaning':'Bersih',fire:'Api',ice:'Es',lightning:'Petir',poison:'Racun',wind:'Angin',vibration:'Getar',shockwave:'Hentak',giant:'Gede',telescopic:'Panjang',ricochet:'Pantul','shield-breaker':'Belah',bloodsteal:'Sedot',living:'Hidup','armor-piercing':'Armor',spellbreaker:'Mantra','spirit-strike':'Roh','dragon-hunter':'Naga','energy-shield':'Perisai','shadow-copies':'Klon','target-mark':'Target','chain-explosion':'Boom','energy-absorb':'Serap','self-repair':'Pulih','space-cut':'Sayat','dimension-hit':'Dimensi','regen-stop':'Stop','power-seal':'Segel',gravity:'Grav','time-delay':'Delay','curse-break':'Kutuk',soulbound:'Jiwa',reflect:'Reflek',adaptive:'Adaptif',homing:'Kejar',counter:'Balas',binding:'Ikat'};
export function wheelAlias(o,plan){
 let s=/enchant/.test(plan.wheelId)?ENCHANT_ALIASES[o.id.replace(/^enchant-/,'')]||o.shortLabel||o.label:o.shortLabel||o.label;
 if(plan.wheelId==='title')s=s.split(/\s+/).filter(w=>!TITLE_WORDS.has(w)).join(' ')||s;
 s=s.replace(/\s*\([^)]*\)/g,'').replace(/Manipulation/g,'Control');
 const enchant=/enchant/.test(plan.wheelId),max=enchant?96:220,font=enchant?26:plan.outcomes.length>24?25:plan.outcomes.length>18?27:31;
 // Compact aliases retain whole words. The full canonical name is always available.
 while(textAdvance(s,font)>max&&s.includes(' '))s=s.slice(0,s.lastIndexOf(' '));
 if(textAdvance(s,font)>max){while(textAdvance(s+'…',font)>max)s=s.slice(0,-1);s+='…';}
 return {label:s,font};
}
export function decoratePhoneLayout(plan,options,frame){
 const {layers,theme}=frame,chosen=plan.outcomes.find(o=>o.id===options.resultId);
 const phase=options.phase||(chosen?'result':'idle'),settled=!!chosen&& !['idle','spinning','anticipation'].includes(phase);
 const title=options.title||plan.displayPrompt||theme.title.replace(/^Putar (.*)\.$/,'Saatnya $1');
 layers['10-heading']=layers['10-heading'].replace(/(<text x="90" y="270"[^>]*>)[\s\S]*?(<\/text>)/,(_,a,b)=>a+esc(title)+b);
 if(options.wheelTransform!==false)for(const key of ['02-rear-props','03-shadow','04-bezel','05-sectors','06-labels','07-hub','08-pointer','09-front-props']){
  layers[key]=`<g data-wheel-space="compact" transform="translate(490 750) scale(.88) translate(-490 -785)">${layers[key]}</g>`;
 }
 layers['12-readout']=settled?'':`<rect x="90" y="1120" width="800" height="160" rx="15" fill="#111719" stroke="#ac8750" stroke-opacity=".52"/>
  <text x="490" y="1155" text-anchor="middle" fill="${theme.accent}" font-size="20" letter-spacing="2">${phase==='idle'&&!options.videoPlayback?'RODA SIAP':'RODA SEDANG BERPUTAR'}</text>
  <text class="pointer-readout" x="490" y="1223" text-anchor="middle" fill="#f3e5c9" font-size="36" font-weight="700">${esc(options.readout||'Takdir lagi jalan…')}</text>`;
 if(!settled)layers['13-result']='';
 else if(options.systemOnly){
  layers['13-result']='';
 }else if(options.mechanism){
  const lines=options.mechanism.flatMap(s=>measuredLines(s,750,36));
  if(lines.length>3)throw Error('Mechanism needs shorter copy: '+plan.wheelId);
  layers['13-result']=resultEffectCard(lines,theme.accent);
 }else{
  const fit=fittedLines(chosen.label,750,44,2),heading=plan.fixed?'Hasil tetap · tanpa spin':frame.presentation.label;
  layers['13-result']=`<rect x="90" y="1120" width="800" height="160" rx="15" fill="url(#brand-card)" stroke="${theme.accent}" stroke-width="2"/>
   <text x="490" y="1152" text-anchor="middle" fill="${theme.accent}" font-size="20" font-weight="700" letter-spacing="2">${esc(heading)}</text>`+
   readableTextLines(fit.lines,{x:490,y:fit.lines.length>1?1200:1220,size:fit.size,lineHeight:49,anchor:'middle'});
 }
 const idle='Bara lagi mantau takdir.',reaction=options.reaction??(settled?theme.reaction:idle);
 if(options.systemOnly){
  layers['14-reaction']=layers['14-reaction'].replace(/<text data-bara-comment[\s\S]*$/,'');
  return frame;
 }
 // Retain the original illustrated rig/plinth, replace only its text layers.
 layers['14-reaction']=layers['14-reaction'].replace(/<text data-bara-comment[\s\S]*$/,'')+
  renderBaraDialogueBox(reaction,{page:options.baraDialoguePage??0});
 return frame;
}
