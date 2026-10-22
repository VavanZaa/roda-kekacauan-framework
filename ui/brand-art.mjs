// Brand art is display-only. No sampling, modifiers, ownership or persistence.
import { esc, polar, sectorPath, wrapWords, outcomeAtRotation } from './wheel-geometry.mjs';
import { METAL_TEXTURE } from './brand-assets.mjs';
import { LAYOUT } from './wheel-themes.mjs';

const BRAND_ACCENTS = {
  race:'#a2be8e',archetype:'#d2b079',backstory:'#bb956e',size:'#a2bdc0',
  strength:'#df9a63',speed:'#93c5c1',durability:'#abb5bd',intelligence:'#9eaddb',fight:'#d4aa77',
  weapon:'#d5a86b','weapon-mastery':'#e2bc7b',enchantment:'#bc9fd7',power:'#bda0da','power-mastery':'#a9b7e0',
  weakness:'#b8b39c',chaos:'#e4a279',title:'#d9c484',holy:'#d8c899',cursed:'#c29dad',
  divine:'#e5cb91',angelic:'#bdcecf',demonic:'#d69988',blood:'#cd9a9c',cosmic:'#a6b6de',symbiote:'#afbaa5',element:'#a5c2ad'
};
export function resolveBrandTheme(theme) {
  return {...theme,accent:BRAND_ACCENTS[theme.id]||'#d5b27b',light:'#eee0c4',dark:'#34291f',
    concept:theme.concept+' · perunggu & obsidian',brand:'attribute-ember/2.1'};
}

export function resultPresentation(outcome,plan) {
  if (!outcome) return {kind:'pending',label:'MENUNGGU TAKDIR',intensity:0};
  if (plan.fixed) return {kind:'fixed',label:'HASIL TETAP',intensity:0};
  if (/(?:^|-)none$/.test(outcome.id)) return {kind:'none',label:'TANPA TAMBAHAN',intensity:0};
  if (outcome.funnyResult === true) return {kind:'funny',label:'HASIL RECEH',intensity:1};
  // Numerical strength stays internal; the display uses descriptive labels.
  if ((outcome.tier??0)>=4 || (outcome.value??0)>=7 || outcome.distributionBand==='strong')
    return {kind:'strong',label:'HASIL TINGGI',intensity:2};
  return {kind:'ordinary',label:'HASIL SPIN',intensity:1};
}

function brandDefinitions(t) {
  return `<radialGradient id="brand-room" cx="45%" cy="41%" r="66%"><stop stop-color="#34271e"/><stop offset=".58" stop-color="#171716"/><stop offset="1" stop-color="#090c0e"/></radialGradient>
    <linearGradient id="brand-bronze" x1=".12" y1="0" x2=".84" y2="1"><stop stop-color="#f0d6a0"/><stop offset=".20" stop-color="#b98b50"/><stop offset=".46" stop-color="#49311e"/><stop offset=".65" stop-color="#c59a5e"/><stop offset="1" stop-color="#654627"/></linearGradient>
    <linearGradient id="brand-card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#29231c"/><stop offset="1" stop-color="#111619"/></linearGradient>
    <radialGradient id="brand-ember"><stop stop-color="${t.accent}" stop-opacity=".36"/><stop offset=".48" stop-color="#d56b32" stop-opacity=".07"/><stop offset="1" stop-color="#d56b32" stop-opacity="0"/></radialGradient>
    <mask id="brand-ring-mask"><circle cx="490" cy="785" r="414" fill="white"/><circle cx="490" cy="785" r="381" fill="black"/></mask>
    <mask id="brand-highlight-mask"><circle cx="490" cy="785" r="378" fill="white"/><circle cx="490" cy="785" r="106" fill="black"/></mask>
    <pattern id="brand-grit" width="89" height="83" patternUnits="userSpaceOnUse"><path d="M7 19h2M48 57h2M70 22h1M25 73h3" stroke="#dabf93" opacity=".10"/><path d="M10 65l17-8M54 11l22-4" stroke="#000" opacity=".14"/></pattern>`;
}

function cutCard(x,y,w,h,cut=18) {return `M${x+cut} ${y}H${x+w-cut}L${x+w} ${y+cut}V${y+h-cut}L${x+w-cut} ${y+h}H${x+cut}L${x} ${y+h-cut}V${y+cut}Z`;}
function textLines(label,x,y,max=27,font=42,color='#f5e6c7',width=690) {
  const lines=wrapWords(label,max,3),size=Math.min(font,width/(Math.max(...lines.map(s=>s.length))*.57));
  return `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-size="${size}" font-weight="750">${lines.map((s,i)=>`<tspan x="${x}" dy="${i?size*1.12:0}">${esc(s)}</tspan>`).join('')}</text>`;
}

export function decorateBrandLayers(plan,options,t,layers,definitions,drawIcon) {
  const chosen=plan.outcomes.find(o=>o.id===options.resultId),presentation=resultPresentation(chosen,plan),active=chosen||outcomeAtRotation(plan,options.rotation||0);
  const phase=options.phase||(chosen?'result':'idle'),settled=phase==='result',accent=presentation.kind==='none'?'#b1a593':t.accent;
  layers['00-background']=`<rect width="1080" height="1920" fill="url(#brand-room)"/><ellipse cx="490" cy="800" rx="570" ry="670" fill="url(#brand-ember)"/>
    <g fill="none" stroke="#aa9069" stroke-width="3" opacity=".07"><path d="M-60 109Q94 29 166 125T385 136M-40 148Q100 88 152 174T315 180M895 126Q1060 58 1100 169M892 165Q1000 109 1125 224"/>
    <path d="M-19 1640Q140 1490 239 1699T505 1788M770 1760Q970 1600 1100 1760"/></g>
    <rect width="1080" height="1920" fill="url(#brand-grit)"/>`;
  layers['01-surface']=`<path d="${cutCard(58,113,880,1581,29)}" fill="none" stroke="#ad8650" stroke-width="1.5" opacity=".27"/>
    <path d="M74 238V165M74 165H147M921 238V165H848M74 1571V1653H147M921 1571V1653H848" fill="none" stroke="url(#brand-bronze)" stroke-width="3"/>
    <text x="490" y="1758" text-anchor="middle" font-size="20" letter-spacing="7" fill="#b6a285" opacity=".46">SATU SPIN. SATU CERITA.</text>`;
  // Retain the stage-specific accessory motifs, set in bronze around the machine.
  layers['02-rear-props']=layers['02-rear-props'].replace(/opacity="\.72"/,'opacity=".34"')+
    `<g fill="none" stroke="url(#brand-bronze)" opacity=".40" stroke-width="2"><path d="M82 534Q36 785 83 1035M897 534Q943 785 896 1035"/><path d="M70 630L42 654L70 677M910 890L935 915L910 936"/></g>`;
  layers['03-shadow']=`<circle cx="495" cy="803" r="419" fill="#000" opacity=".40"/><circle cx="490" cy="792" r="414" fill="#000" opacity=".40"/>`;
  let rim=`<circle cx="490" cy="785" r="414" fill="#171919" stroke="#63482d" stroke-width="2"/><circle cx="490" cy="785" r="409" fill="url(#brand-bronze)"/>
    <circle cx="490" cy="785" r="399" fill="#31241c" stroke="#edc383" stroke-width="1.4"/><circle cx="490" cy="785" r="384" fill="#211b17" stroke="#a0753f" stroke-width="3"/>
    <image href="${METAL_TEXTURE}" x="76" y="371" width="828" height="828" mask="url(#brand-ring-mask)" opacity=".26"/>`;
  for(let i=0;i<12;i++) rim+=`<g transform="translate(490 785) rotate(${i*30}) translate(0 -396)" fill="none" stroke="url(#brand-bronze)" stroke-width="1.7"><path d="M-18 0Q-20-11-8-8Q0-5 0 8Q0-5 8-8Q20-11 18 0M-22 7Q-4 6 0-10Q4 6 22 7"/><path d="M0-12L4-8L0-4L-4-8Z" fill="#e0bb81"/></g>`;
  for(let i=0;i<72;i++){const[x,y]=polar(490,785,386,i*5-90),[a,b]=polar(490,785,i%6?389:393,i*5-90);rim+=`<path d="M${x} ${y}L${a} ${b}" stroke="#e0bb81" opacity=".68" stroke-width="${i%6?1:2}"/>`;}
  for(const a of [0,60,120,180,240,300]){const[x,y]=polar(490,785,406,a);rim+=`<circle cx="${x}" cy="${y}" r="4" fill="#191613" stroke="#c1975c" stroke-width="1.5"/>`;}
  rim+=`<circle class="rim-energy" cx="490" cy="785" r="415" fill="none" stroke="${t.accent}" stroke-width="2" opacity="${settled&&presentation.intensity>0?'.55':'.20'}"/>`;
  layers['04-bezel']=rim;
  layers['07-hub']=`<circle cx="492" cy="790" r="106" fill="#0c0e0e" opacity=".68"/><circle cx="490" cy="785" r="101" fill="url(#brand-bronze)"/><circle cx="490" cy="785" r="95" fill="#191b1b" stroke="#6b4b29" stroke-width="2"/>
    <circle class="hub-energy" cx="490" cy="785" r="83" fill="none" stroke="${t.accent}" stroke-width="1.6" opacity="${settled&&presentation.intensity>0?'.65':'.30'}"/>
    <g class="attribute-icon" data-motif="${esc(t.motif)}">${drawIcon(t.motif,490,776,112,t.light)}</g>
    <text x="490" y="865" text-anchor="middle" fill="${t.accent}" font-size="18" font-weight="750" letter-spacing="2">${esc(t.mark)} · RK</text>`;
  layers['08-pointer']=`<g class="pointer-flap"><path d="M466 351L520 351L493 414Z" fill="#000" opacity=".6"/>
    <path d="M464 350H516L490 408Z" fill="url(#brand-bronze)" stroke="#f4d99e" stroke-width="1.6"/>
    <path d="M478 360H502L490 389Z" fill="${t.accent}"/><path d="M477 362L490 390" stroke="#fff0ca" stroke-width="1.6"/>
    <circle cx="490" cy="350" r="9" fill="#2a2219" stroke="#d4ab6a" stroke-width="2"/></g>`;
  layers['09-front-props']=`<g class="active-sector" opacity="${settled?'.55':'.18'}" mask="url(#brand-highlight-mask)">
    <path class="active-sector-path" d="${sectorPath(490,785,377,active.start,active.end)}" transform="rotate(${options.rotation||0} 490 785)" fill="#fff1cc" fill-opacity=".16" stroke="#ffedbd" stroke-width="4"/>
    </g><path d="M467 1196L490 1206L513 1196" fill="none" stroke="${t.accent}" stroke-width="2" opacity=".7"/>`;
  layers['10-heading']=`<text x="90" y="207" fill="#d9b77e" font-size="22" font-weight="650" letter-spacing="4">RODA KEKACAUAN</text>
    <text x="876" y="207" text-anchor="end" fill="${t.accent}" font-size="20" font-weight="700" letter-spacing="2">${esc(options.step||t.name.toUpperCase())}</text>
    <text x="90" y="270" fill="#f4e5ca" font-family="Georgia,serif" font-weight="700" font-size="${t.title.length>25?41:49}">${esc(t.title)}</text>
    <path d="M90 291H876" stroke="#a47b43" opacity=".45"/><path d="M90 291H194" stroke="${t.accent}" stroke-width="3"/>`;
  const context=options.context||plan.contextLabel||'Karakter baru';
  layers['11-context']=`<path d="${cutCard(92,306,790,39,7)}" fill="#111819" stroke="#9b7643" stroke-opacity=".42"/>
    <path d="M110 325L115 320L120 325L115 330Z" fill="${t.accent}"/><text x="134" y="333" fill="#d8ccb7" font-size="23">${esc(context.slice(0,60))}</text>`;
  const read=options.readout||'Takdir belum diputar.';
  layers['12-readout']=`<path d="${cutCard(115,1214,750,69,13)}" fill="#111719" stroke="#ac8750" stroke-opacity=".52"/>
    <path d="M115 1238V1258M865 1238V1258" stroke="${t.accent}" stroke-width="3"/>
    <text class="pointer-readout" x="490" y="1258" text-anchor="middle" fill="#f3e5c9" font-size="${read.length>36?26:32}" font-weight="700">${esc(read.length>49?read.slice(0,48)+'…':read)}</text>`;
  const [resultX,resultY,resultW,resultH]=LAYOUT.regions.result,center=resultX+resultW/2;
  const result=chosen?.label||'Belum terungkap',lines=wrapWords(result,21,3).length;
  let sub=chosen?(plan.fixed?'Hasil tetap · tanpa spin':`${(chosen.probability*100).toLocaleString('id-ID',{maximumFractionDigits:2})}% peluang`):'PUTAR RODA UNTUK MULAI';
  const name=textLines(result,center,lines>2?1358:lines>1?1368:1398,21,lines>2?27:lines>1?33:42,'#f5e6c7',resultW-48);
  layers['13-result']=`<path d="${cutCard(resultX,resultY,resultW,resultH,18)}" fill="url(#brand-card)" stroke="${chosen?accent:'#7c613d'}" stroke-width="${presentation.intensity===2?2.5:1.3}"/>
    <path d="M408 1335V1318H457M864 1427V1444H815" fill="none" stroke="${accent}" stroke-width="3"/>
    <text x="${center}" y="1330" text-anchor="middle" fill="${accent}" font-size="19" font-weight="650" letter-spacing="3">${presentation.label}</text>${name}
    <text x="${center}" y="1443" text-anchor="middle" fill="#d4c6af" font-size="20">${esc(sub)}</text>`;
  // The portrait plinth is deliberately smaller than the un-clipped rig.
  layers['14-reaction']=layers['14-reaction'].replace(/<rect data-mascot-plinth[^>]*\/>/,`<path d="${cutCard(93,1370,250,213,12)}" fill="#151b1c" stroke="#8e734e" stroke-width="1.2"/>`);
  const svgDefs=definitions.replace('</defs>',brandDefinitions(t)+'</defs>');
  return {theme:t,defs:svgDefs,layers,presentation,phase};
}
