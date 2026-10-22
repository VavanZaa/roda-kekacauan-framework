import { resolveBrandTheme, decorateBrandLayers } from './brand-art.mjs';
import { decorateElementLayers } from './element-art.mjs';
import { renderMascotGroup, mascotExpressionFor } from '../mascot/rig.mjs';
import { LAYERS, LAYOUT, resolveWheelTheme } from './wheel-themes.mjs';
import { esc, polar, sectorPath, wrapWords } from './wheel-geometry.mjs';
import { decoratePhoneLayout, wheelAlias } from './audit-layout.mjs';
import {renderSystemNotice} from './system-notice.mjs';

const ICONS={
  helmet:'M-31 17V-3Q-30-34 0-34Q30-34 31-3V17L13 28V1H-13V28Z M-21-12H21M0-34V-17',
  armor:'M-14-33L-35-19L-27-2L-20-8V28Q0 38 20 28V-8L27-2L35-19L14-33Q0-20-14-33Z M0-18V24M-15 5H15',
  boots:'M-19-34H7V5L30 15V30H-26V14L-19 5Z M-19-20H7M-26 21H28',
  'armor-count':'M-14-29L-29-19V8L-15 17L0 8V-19Z M10-14L25-4V22L10 32L-5 22M-34-34H-22M22-29H34',
  branch:'M0 32V-27 M0 12Q-30 10-32-12Q-8-12 0 12 M0-4Q29-8 32-31Q6-30 0-4',
  'crossed-blades':'M-28-30L25 25M28-30L-25 25 M-32-20L-20-32L-8-9 M32-20L20-32L8-9 M-30 17L-17 30M17 30L30 17',
  quill:'M-25 32L29-30Q-13-39-24 8L-25 32M-21 20L8 19M-11 5L17 3M0-10L25-14',
  ruler:'M-35-16H35V16H-35Z M-24-16V0M-12-16V-6M0-16V0M12-16V-6M24-16V0',
  hammer:'M-22-32H23V-9H-22Z M-8-9V32H8V-9',
  feather:'M-26 32L25-27Q-22-38-28 7L-26 32 M-20 22L6 21M-9 8L15 7M2-7L24-8',
  shield:'M0-34L30-21V3Q28 23 0 36Q-28 23-30 3V-21Z M0-20V20M-17 0H17',
  lens:'M18 18L36 36M25-4A29 29 0 1 1-33-4A29 29 0 1 1 25-4 M-14-4H6M-4-14V6',
  fist:'M-22 25V-4Q-26-17-15-17V-25Q-6-32-1-23Q5-31 12-22Q21-24 24-14V9L12 29Z M-15-17V3M-1-23V2M12-22V2M-22 25H12',
  sword:'M0-36L12-20L7 12H-7L-12-20Z M-23 12H23M-5 12V34H5V12',
  whetstone:'M-35 8L-16-7H34L19 15H-31Z M-16-7V1L19 15M-2-32L20-10M-8-26L-2-32L26-4',
  bottle:'M-11-32H11V-13L28 15Q31 29 16 32H-16Q-31 29-28 15L-11-13Z M-22 9H22M-14-32H14',
  orb:'M30 0A30 30 0 1 1-30 0A30 30 0 1 1 30 0 M-17 24H17M-21 33H21M-18-15Q-7-25 6-22',
  astrolabe:'M34 0A34 34 0 1 1-34 0A34 34 0 1 1 34 0 M24 0A24 24 0 1 1-24 0A24 24 0 1 1 24 0 M-40 0H40M0-40V40M-25 25L25-25',
  patch:'M-33-14L20-32L33 14L-20 32Z M-10-11L8-17L16 8L-2 14Z M-24-7L-18-9M-20 4L-14 2M17-7L23-9M21 4L27 2',
  balance:'M0-34V32M-35-13L35-20M-25-14L-35 12H-15Z M25-19L15 7H35Z M-16 33H16',
  seal:'M27-5A27 27 0 1 1-27-5A27 27 0 1 1 27-5 M-16 18L-24 39L-7 32L0 40L7 32L24 39L16 18 M0-19L4-9L15-8L7 0L9 12L0 6L-9 12L-7 0L-15-8L-4-9Z',
  candle:'M-13-4H13V34H-13Z M0-12Q-19-25 0-40Q19-25 0-12 M-22 34H22',
  eye:'M-37 0Q0-34 37 0Q0 34-37 0Z M11 0A11 11 0 1 1-11 0A11 11 0 1 1 11 0 M0-32V-42M-29-21L-37-29M29-21L37-29',
  sun:'M20 0A20 20 0 1 1-20 0A20 20 0 1 1 20 0 M0-29V-40M0 29V40M29 0H40M-29 0H-40M21-21L29-29M-21 21L-29 29M21 21L29 29M-21-21L-29-29',
  wing:'M0 32Q-39 9-34-31Q-24-5-5-1Q10-2 35-29Q36 6 0 32 M-28-16L-5 10M27-13L5 12',
  horn:'M-12 20Q-45-12-27-36Q-25-9-4-5M12 20Q45-12 27-36Q25-9 4-5 M-15 1L0 30L15 1M-13 9H13',
  drop:'M0-36Q-34 8-25 24Q0 45 25 24Q34 8 0-36Z M-14 12Q-19 23-8 27',
  planet:'M25 0A25 25 0 1 1-25 0A25 25 0 1 1 25 0 M-22-12Q-57-12-43 8Q-8 37 45 4Q58-13 21-12',
  tendril:'M-4 32Q-40 21-21-1Q0-15-20-35M3 35Q30 17 18 0Q0-20 30-36M-30 26Q-34 2-7-2Q18-6 5-31M-15 35Q2 6 29 8',
  element:'M-1-36L17-13L3 9L-14-13Z M-27 4Q-51 29-27 34Q-3 29-27 4Z M22 9L37 34H7Z M6-28L37-35L28-18',
  leaf:'M-29 29Q-40-24 32-32Q31 22-29 29Z M-29 29L24-24M-18 14L-22-7M-7 3L15 4',
  token:'M29 0A29 29 0 1 1-29 0A29 29 0 1 1 29 0 M18 0A18 18 0 1 1-18 0A18 18 0 1 1 18 0 M-5-12L9 0L-5 12',
  blade:'M0-36L12-20L7 12H-7L-12-20Z M-23 12H23M-5 12V34H5V12',
  badge:'M0-33L28-17V15L0 34L-28 15V-17Z M-10-3L-2 7L16-14',
  book:'M0-25Q-20-35-36-22V29Q-17 20 0 30Q17 20 36 29V-22Q20-35 0-25V30 M-28-12L-8-8M-28 0L-8 4M8-8L28-12M8 4L28 0',
  ink:'M-12-30H12V-15H23V31H-23V-15H-12Z M-23 1H23',
  compass:'M32 0A32 32 0 1 1-32 0A32 32 0 1 1 32 0 M-12 13L0-22L12-13L0 22Z',
  weight:'M-27-10H-12V10H-27Z M12-10H27V10H12Z M-12-3H12V3H-12Z',
  pulley:'M29 0A29 29 0 1 1-29 0A29 29 0 1 1 29 0 M0-39V-29M-11 0H11M0-11V11M-30 0V40M30 0V40',
  stone:'M-36 0L-21-28L13-35L36-9L25 29L-10 34Z M-21-28L-9 0L25 29M-9 0L36-9',
  wrap:'M-30-26H-4L30 26H4Z M-22-26L12 26M-12-26L22 26M-25-18L2-18M-19-9L9-9M-11 2H16M-4 12H23',
  staff:'M-8-36H8V36H-8Z M-8-24H8M-8 24H8',
  anvil:'M-38-17H-17V-28H29V-17H40L20 0H5V18H25V29H-25V18H-5V0L-26-2Z',
  rune:'M-22-30L26 26M22-30L-26 26M0-37V37M-18-18H18M-18 18H18',
  crystal:'M0-38L24-13L20 21L0 38L-20 21L-24-13Z M0-38V38M-24-13L0 0L24-13',
  note:'M-29-32H29V17L13 32H-29Z M13 32V17H29M-17-17H17M-17-4H17M-17 9H5',
  coin:'M30 0A30 30 0 1 1-30 0A30 30 0 1 1 30 0 M-6-16L12 0L-6 16M-13-16V16',
  hourglass:'M-25-33H25M-25 33H25M-19-33V-15L0 0L19-15V-33M-19 33V15L0 0L19 15V33 M-12 23H12',
  scroll:'M-30-24Q-30-36-18-36H24V22Q24 34 12 34H-30Q-18 34-18 22V-24Z M-18-24H27M-8-10H13M-8 3H13M-8 15H6',
  column:'M-27-35H27V-26H-27Z M-18-26V26M18-26V26M-26 26H26V35H-26Z M-6-23V23M6-23V23',
  chain:'M-13-25Q-31-41-37-25Q-42-16-29-4L-19 6Q-3 20 7 6M13 25Q31 41 37 25Q42 16 29 4L19-6Q3-20-7-6M-16-15L16 15'
};

function icon(kind,x,y,size,color,rotation=0){return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${size/80})" fill="none" stroke="${color}" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[kind]||ICONS.token}"/></g>`;}
function mix(a,b,t){const aa=a.match(/\w\w/g).map(v=>parseInt(v,16)),bb=b.match(/\w\w/g).map(v=>parseInt(v,16));return '#'+aa.map((v,i)=>Math.round(v*(1-t)+bb[i]*t).toString(16).padStart(2,'0')).join('');}
function labelLines(label,x,y,font=48,color='#f5ecdc',maxChars=27){
  const lines=wrapWords(label,maxChars,3), longest=Math.max(...lines.map(s=>s.length)),actual=Math.min(font,690/(longest*.57));
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${actual}" font-weight="700" text-anchor="middle">${lines.map((s,i)=>`<tspan x="${x}" dy="${i?actual*1.15:0}">${esc(s)}</tspan>`).join('')}</text>`;
}
function defs(t){return `<defs>
  <radialGradient id="room" cx="45%" cy="34%" r="75%"><stop stop-color="${mix(t.dark,'#6e6759',.3)}"/><stop offset="1" stop-color="#202323"/></radialGradient>
  <radialGradient id="rim"><stop stop-color="${t.light}"/><stop offset=".88" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.dark}"/></radialGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ddc58a"/><stop offset=".45" stop-color="#a99261"/><stop offset="1" stop-color="#6b5a3a"/></linearGradient>
  <pattern id="grain" width="150" height="132" patternUnits="userSpaceOnUse"><path d="M9 18H42M83 44H126M16 95H79M104 116H140" stroke="#e4d8ba" stroke-width="1" opacity=".08"/><path d="M23 35H67M104 78H143" stroke="#111" opacity=".1"/></pattern>
  <pattern id="weave" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0L14 14M-7 7L7 21M7-7L21 7" stroke="${t.light}" stroke-width="1" opacity=".045"/></pattern>
  <pattern id="paper" width="42" height="44" patternUnits="userSpaceOnUse"><path d="M9 10h2M33 27h3M8 38h1" stroke="${t.light}" opacity=".1"/></pattern>
  <clipPath id="face-clip"><circle cx="490" cy="785" r="380"/></clipPath>
  <clipPath id="annular-labels"><path fill-rule="evenodd" d="M490 412A373 373 0 1 1 490 1158A373 373 0 1 1 490 412Z M490 670A115 115 0 1 0 490 900A115 115 0 1 0 490 670Z"/></clipPath>
  </defs>`;}

export function renderWheelLayers(plan,options={}){
  if(options.systemPage){
    const exclusive=options.systemPage.presentation==='exclusive';
    options={...options,systemOnly:exclusive,mechanism:undefined,...(exclusive?{mascotExpression:'idle'}:{})};
  }
  const t=resolveBrandTheme(resolveWheelTheme(plan,options));
  const {cx,cy,radius:r}=LAYOUT,rotation=options.rotation||0,chosen=plan.outcomes.find(o=>o.id===options.resultId),read=options.readout||'Takdir belum diputar.';
  const layers={};
  layers['00-background']=`<rect width="1080" height="1920" fill="url(#room)"/><path d="M44 60V1840H1026V60Z" fill="none" stroke="${t.light}" opacity=".035"/>`;
  let surface=`<rect x="26" y="82" width="986" height="1740" rx="26" fill="${t.dark}" opacity=".16"/>`;
  if(t.material==='wood')surface+=`<path d="M240 100V1790M573 100V1790M884 100V1790" stroke="#111" opacity=".15" stroke-width="4"/><rect width="1080" height="1920" fill="url(#grain)"/>`;
  if(t.material==='cloth')surface+=`<path d="M76 170L948 208L879 1670L45 1618Z" fill="${t.accent}" opacity=".075"/><rect width="1080" height="1920" fill="url(#weave)"/>`;
  if(t.material==='paper')surface+=`<path d="M128 155L927 183L870 1702L65 1644Z" fill="${t.light}" opacity=".055"/><rect width="1080" height="1920" fill="url(#paper)"/>`;
  if(t.material==='stone')surface+=`<path d="M38 342L172 516L46 940M979 491L923 916L1002 1130M95 1780L351 1707L410 1814" fill="none" stroke="${t.light}" opacity=".075" stroke-width="3"/>`;
  if(t.material==='orbit')surface+=`<g fill="none" stroke="${t.light}" opacity=".075"><ellipse cx="490" cy="785" rx="485" ry="594" transform="rotate(-18 490 785)"/><path d="M61 1565L930 279M67 465L931 1502" stroke-dasharray="4 18"/></g>`;
  if(t.material==='organic')surface+=`<path d="M8 238Q161 334 42 649T145 1219T7 1740M1016 174Q857 369 1004 716T919 1230T1044 1750" fill="none" stroke="${t.accent}" stroke-width="7" opacity=".12"/>`;
  surface+=`<text x="490" y="1758" text-anchor="middle" font-size="22" letter-spacing="5" fill="${t.light}" opacity=".36">RODA KEKACAUAN</text>`;
  layers['01-surface']=surface;
  layers['02-rear-props']=`<g opacity=".72">${icon(t.props[0],116,454,134,t.accent,-24)}${icon(t.props[1],858,1118,128,t.accent,19)}</g><path d="M111 355Q74 372 98 390M890 1201L910 1183" fill="none" stroke="${t.accent}" opacity=".28" stroke-width="3"/>`;
  layers['03-shadow']=`<ellipse cx="498" cy="815" rx="412" ry="412" fill="#0c1310" opacity=".2"/><ellipse cx="499" cy="806" rx="403" ry="403" fill="#0c1310" opacity=".32"/>`;
  let bezel=`<circle cx="${cx}" cy="${cy}" r="404" fill="${t.dark}"/><circle cx="${cx}" cy="${cy}" r="399" fill="url(#rim)"/><circle cx="${cx}" cy="${cy}" r="390" fill="${t.dark}"/><circle cx="${cx}" cy="${cy}" r="384" fill="${t.light}"/>`;
  for(let i=0;i<72;i++){const[a,b]=polar(cx,cy,393,i*5-90),[c,d]=polar(cx,cy,i%6===0?399:396,i*5-90);bezel+=`<path d="M${a} ${b}L${c} ${d}" stroke="${t.light}" stroke-width="${i%6===0?2:1}" opacity=".52"/>`;}
  for(const a of [45,135,225,315]){const[x,y]=polar(cx,cy,396,a);bezel+=`<circle cx="${x}" cy="${y}" r="3" fill="#2b2d26"/>`;}
  layers['04-bezel']=bezel;
  let sectors='',labels='';const dense=plan.outcomes.length>32,ink='#252a25';
  for(const o of plan.outcomes){
    const none=/(?:^|-)none$/.test(o.id),tier=o.tier??(o.value!==undefined?1+o.value/2.25:o.distributionBand==='strong'?5:o.distributionBand==='moderate'?3:1),tone=none?'#ded5be':mix(t.light,t.accent,Math.max(.10,Math.min(.62,.16+(tier-1)*.085+(o.index%2)*.035)));
    sectors+=`<path data-outcome-id="${esc(o.id)}" d="${sectorPath(cx,cy,r,o.start,o.end)}" fill="${tone}" stroke="${t.dark}" stroke-width="${dense?.8:1.8}"><title>${esc(o.label)} · ${(o.probability*100).toFixed(2)}%</title></path>`;
    const span=o.end-o.start,a=o.mid-90;
    if(none&&plan.wheelId.startsWith('power')){
      const[x,y]=polar(cx,cy,275,a),flip=Math.cos(a*Math.PI/180)<0;
      labels+=`<g transform="translate(${x} ${y}) rotate(${a+(flip?180:0)})"><rect x="-118" y="-40" width="236" height="80" rx="16" fill="none" stroke="${ink}" stroke-opacity=".3" stroke-width="2"/><text x="0" y="-9" text-anchor="middle" fill="${ink}" font-size="25" font-weight="700">Tanpa Power</text><text x="0" y="23" text-anchor="middle" fill="${ink}" font-size="25" font-weight="700">Tambahan</text></g>`;
    }
    else if(dense){
      // Compatible Enchant pools can have 51–60 names. Keep their aliases visible;
      // main Weapon/Power pools independently enforce a 2% probability floor.
      const minSpan=['enchant','enchantment'].includes(plan.wheelId)?6:7.2;
      if(span>=minSpan-1e-8){
        const[x,y]=polar(cx,cy,350,a),flip=Math.cos(a*Math.PI/180)<0;
        const alias=wheelAlias(o,plan),text=alias.label,font=/enchant/.test(plan.wheelId)?26:span>=18?30:alias.font;
        labels+=`<text x="${x}" y="${y}" text-anchor="${flip?'start':'end'}" dominant-baseline="middle" fill="${ink}" font-size="${font}" font-weight="650" transform="rotate(${a+(flip?180:0)} ${x} ${y})">${esc(text)}</text>`;
      }
    }
    else if(span>=5){
      const[x,y]=polar(cx,cy,350,a),flip=Math.cos(a*Math.PI/180)<0;
      const alias=wheelAlias(o,plan),text=alias.label,font=plan.wheelId==='backstory'?27:alias.font;
      const estimated=text.length*font*.54,fit=estimated>223?' textLength="223" lengthAdjust="spacingAndGlyphs"':'';
      labels+=`<text x="${x}" y="${y}" text-anchor="${flip?'start':'end'}" dominant-baseline="middle" fill="${ink}" font-size="${font}" font-weight="650"${fit} transform="rotate(${a+(flip?180:0)} ${x} ${y})">${esc(text)}</text>`;
    }
  }
  layers['05-sectors']=`<g class="rotating-face" transform="rotate(${rotation} ${cx} ${cy})">${sectors}<circle cx="${cx}" cy="${cy}" r="371" fill="none" stroke="${t.dark}" opacity=".2"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#paper)"/></g>`;
  layers['06-labels']=`<g class="rotating-labels" transform="rotate(${rotation} ${cx} ${cy})"><g clip-path="url(#annular-labels)">${labels}</g></g>`;
  layers['07-hub']=`<circle cx="${cx+2}" cy="${cy+4}" r="101" fill="#18201b" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="98" fill="${t.dark}" stroke="url(#brass)" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="88" fill="none" stroke="${t.accent}" stroke-width="1.5"/>${icon(t.motif,cx,cy-14,66,t.light)}<text x="${cx}" y="${cy+48}" text-anchor="middle" fill="${t.light}" font-size="22" font-weight="700" letter-spacing="2">${esc(t.mark)}</text>`;
  layers['08-pointer']=`<g class="pointer-flap"><path d="M463 354L517 354L490 412Z" fill="#111913" opacity=".36" transform="translate(3 5)"/><path d="M464 351H516L490 408Z" fill="url(#brass)" stroke="#493e2b" stroke-width="2"/><path d="M473 360H507L490 394Z" fill="${t.light}" opacity=".55"/><circle cx="490" cy="350" r="8" fill="${t.dark}" stroke="#c4ac79" stroke-width="2"/></g>`;
  layers['09-front-props']=`<g opacity=".88">${icon(t.props[1],117,1166,75,t.light,-13)}${icon(t.props[0],852,400,60,t.light,13)}</g>`;
  layers['10-heading']=`<text x="90" y="207" fill="${t.light}" font-size="22" letter-spacing="4">RODA KEKACAUAN <tspan letter-spacing="1" opacity=".65">/ ${esc(options.step||t.name.toUpperCase())}</tspan></text><text x="90" y="270" fill="#f6eddc" font-family="Georgia,serif" font-weight="700" font-size="${t.title.length>25?42:49}">${esc(t.title)}</text><path d="M92 287H168" stroke="${t.accent}" stroke-width="3"/>`;
  const context=options.context||plan.contextLabel||'Karakter baru';
  layers['11-context']=`<rect x="92" y="306" width="790" height="39" rx="19" fill="#111b16" opacity=".28"/><text x="112" y="333" fill="${t.light}" font-size="24">${esc(context.slice(0,63))}</text><text x="871" y="1200" text-anchor="end" fill="${t.light}" font-size="21" opacity=".6">${plan.outcomes.length} pilihan</text>`;
  layers['12-readout']=`<path d="M157 1231H823" stroke="${t.accent}" opacity=".4"/><text class="pointer-readout" x="490" y="1268" text-anchor="middle" fill="${t.light}" font-size="${read.length>36?25:30}" font-weight="650">${esc(read.length>49?read.slice(0,48)+'…':read)}</text>`;
  let result=chosen?chosen.label:'Belum terungkap',sub=chosen?(plan.fixed?'Hasil tetap · tanpa spin':`${(chosen.probability*100).toLocaleString('id-ID',{maximumFractionDigits:2})}% peluang`):t.name;
  const resultLines=wrapWords(result,27,3).length;
  layers['13-result']=`<rect x="92" y="1300" width="790" height="162" rx="14" fill="#152019" opacity=".55"/><path d="M116 1319H171M803 1443H856" stroke="${t.accent}" stroke-width="2"/><text x="490" y="1328" text-anchor="middle" fill="${t.light}" font-size="19" letter-spacing="3">${chosen?'HASIL':'RODA '+esc(t.name.toUpperCase())}</text>${labelLines(result,490,resultLines>1?1359:1390,resultLines>2?28:resultLines>1?32:43)}<text x="490" y="1443" text-anchor="middle" fill="${t.light}" font-size="21" opacity=".8">${esc(sub)}</text>`;
  const isNone=chosen&&/(?:^|-)none$/.test(chosen.id),defaultReaction=isNone?(t.id==='chaos'?'Nasib aman.':t.id==='weakness'?'Aman dulu.':'Pakai bekal yang ada.'):(chosen?t.reaction:'Putar dulu. Baru kita lihat.');
  const reaction=options.reaction??defaultReaction,caption=options.caption??(plan.fixed?'Hasil tetap. Bonus dihitung di akhir.':'Satu spin. Satu cerita.'),lines=wrapWords(reaction,32,4),captionLines=lines.length<=2?wrapWords(caption,40,2):[];
  const mascotExpression=options.mascotExpression||mascotExpressionFor(chosen,options.phase,plan);
  const reactionSize=Math.min(lines.length>2?26:32,480/(Math.max(...lines.map(l=>l.length))*.57)),captionSize=captionLines.length?Math.min(21,480/(Math.max(...captionLines.map(l=>l.length))*.57)):21;
  layers['14-reaction']=`<rect data-mascot-plinth="true" x="93" y="1370" width="250" height="213" rx="16" fill="${t.accent}" opacity=".12"/>${options.includeMascot===false?'':renderMascotGroup({id:'wheel-bara',...LAYOUT.mascot,expression:mascotExpression,pose:options.mascotPose})}<text data-bara-comment="true" x="390" y="${lines.length>2?1498:1508}" fill="#f6eddc" font-size="${reactionSize}" font-weight="650">${lines.map((line,i)=>`<tspan x="390" dy="${i?(lines.length>2?28:36):0}">${esc(line)}</tspan>`).join('')}</text><text data-bara-caption="true" x="390" y="1580" fill="${t.light}" font-size="${captionSize}" opacity=".7">${captionLines.map((line,i)=>`<tspan x="390" dy="${i?26:0}">${esc(line)}</tspan>`).join('')}</text>`;
  const s=options.safe||LAYOUT.safe;
  layers['15-guides']=`<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" fill="none" stroke="#dfb56c" stroke-width="2" stroke-dasharray="10 10"/><path d="M912 0H1080V1920H912Z M0 1620H912V1920H0Z M0 0H912V180H0Z" fill="#e99883" opacity=".12"/><text x="95" y="1665" fill="#dfb56c" font-size="22">Panduan editor — tidak masuk ekspor</text>`;
  return decoratePhoneLayout(plan,options,decorateElementLayers(plan,options,decorateBrandLayers(plan,options,t,layers,defs(t),icon)));
}

export function renderWheelSVG(plan,options={}){
  const {theme,defs:definitions,layers}=renderWheelLayers(plan,options),hidden=new Set(options.hiddenLayers||[]),only=options.onlyLayer;
  const groups=LAYERS.filter(l=>(!only||l.id===only)&&!hidden.has(l.id)&&(!l.editorOnly||options.guides)).map(l=>`<g id="layer-${l.id}" data-layer="${l.id}" aria-label="${esc(l.name)}">${layers[l.id]}</g>`).join('');
  const system=options.systemPage&&!only?`<g data-layer="system-notice">${renderSystemNotice(options.systemPage)}</g>`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" data-brand="attribute-ember" data-phase="${esc(options.phase||(options.resultId?'result':'idle'))}" role="img" aria-label="${esc(theme.name)} · Roda Kekacauan" style="font-family:Segoe UI,Arial,sans-serif">${definitions}${groups}${system}</svg>`;
}
