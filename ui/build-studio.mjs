import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { THEMES, LAYERS, LAYOUT } from './wheel-themes.mjs';
import { normalizeDisplayPlan } from './wheel-geometry.mjs';
import { renderWheelSVG } from './wheel-renderer.mjs';
import { planReadableAcquisition } from '../framework/readable-acquisition.mjs';
import { VIDEO_BACKSTORY_ROSTER } from '../video/backstory-roster.mjs';
import { planSizeStage } from '../framework/size-wheel.mjs';
import { buildTitleShortlist } from '../framework/title-shortlist.mjs';

const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8'),json=async p=>JSON.parse(await read(p));
async function previewData(name){return json(`examples/studio-fixtures/${name}.json`);}
const [main,stats,weapon,power,enchant,weakness,title,backstory,universal,element,chaos,audit,scales]=await Promise.all([
  previewData('main-wheels'),previewData('stat-odds'),previewData('weapon-roster'),previewData('power-roster'),previewData('enchantment-roster'),previewData('weakness-roster'),previewData('title-roster'),
  json('content/backstory-wheel-design.json'),json('content/universal-power-wheels-design.json'),json('content/universal-element-wheel-design.json'),json('content/chaos-wheel-design.json'),json('reference/size-profile-coverage.json'),json('content/stat-scales-design.json')]);
const fixtures=Object.fromEntries(THEMES.map(t=>[t.id,[]]));
function add(theme,label,wheelId,outcomes,extra={}){
  const plan=normalizeDisplayPlan({wheelId,contextLabel:label,sourceMode:'preview-fixture-only',outcomes:outcomes.map(o=>({id:o.id,label:o.label,probability:o.probability,...(o.value!==undefined?{value:o.value}:{}),...(o.tier?{tier:o.tier}:{}),...(o.shortLabel?{shortLabel:o.shortLabel}:{}),...(o.distributionBand?{distributionBand:o.distributionBand}:{}),...(o.funnyResult===true?{funnyResult:true}:{})})),...extra});
  fixtures[theme].push({label,plan});
}
add('race','Karakter baru','race-family',main['race-family'],{fixtureSource:'preview/main-wheels.html#race-family'});
add('archetype','Katalog sebelum filter tubuh','archetype',main.archetype,{fixtureSource:'preview/main-wheels.html#archetype',note:'Catalog-only display; a production planner must apply owner-body and pair guards.'});
const backstoryLabels=new Map(VIDEO_BACKSTORY_ROSTER);
add('backstory','Cerita belum dimulai','backstory',backstory.wheel.outcomes.filter(o=>backstoryLabels.has(o.id)).map(o=>({...o,shortLabel:backstoryLabels.get(o.id),probability:1/backstoryLabels.size})),{fixtureSource:'video/backstory-roster.mjs',note:'Approved 16-option video roster; full canonical names retained on results.'});
for(const [label,caseId] of [['Manusia','human'],['Tuyul','lelembut/local/tuyul'],['Raksasa · Manusia','raksasa']]){
  const input=structuredClone(audit.terminalCases.find(c=>c.id===caseId).input);input.runId='ui-size-fixture-'+caseId;input.archetypeIds=[];
  const plan=planSizeStage(input);if(plan.status!=='ready')throw new Error('Size fixture not ready: '+caseId);
  add('size',label,plan.wheelId||'size-normal',plan.outcomes,{fixtureSource:'framework/size-wheel.mjs#planSizeStage'});
}
for(const target of ['strength','speed','durability','intelligence','fight','weapon-mastery','power-mastery']){
  for(const example of stats){const size=example.sizes.find(s=>s.label==='173 cm')||example.sizes[Math.floor(example.sizes.length/2)],s=size.stats.find(s=>s.target===target);if(!s)continue;
    let outcomes=s.outcomes;if(s.fixed){const scale=scales.scales.find(v=>v.stage===target),o=scale?.outcomes.find(o=>o.value===s.baseValue);outcomes=[{id:o?.id||`fixed-${s.baseValue}`,label:o?.label||String(s.baseValue),value:s.baseValue,probability:1}];}
    add(target,example.label+' · '+size.label,target,outcomes,{fixed:s.fixed,distribution:{minimumProbability:.05,maximumProbability:.25,center:s.center,method:outcomes.every(o=>Math.abs(o.probability-outcomes[0].probability)<1e-10)?'uniform-frozen-wheel':'floor-reserved-water-filling'},fixtureSource:'preview/stat-odds.html',note:'Existing preview inventories are illustrative; this is not a committed character.'});
  }
}
for(const e of weapon.examples){const outcomes=[{id:'weapon-none',label:'Tanpa senjata tambahan',probability:e.probabilities['weapon-none']},...weapon.weapons.map(w=>({...w,probability:e.probabilities[w.id]}))].filter(o=>o.probability>0);add('weapon',e.label,'weapon-main',outcomes,{fixtureSource:'preview/weapon-roster.html',trace:{equalizerActive:e.label==='Human · Equalizer'}});}
for(const e of power.examples){const total=Object.values(e.weights).reduce((s,v)=>s+v,0),outcomes=[{id:'power-none',label:'Tanpa power tambahan',probability:e.none},...power.recipes.filter(o=>e.weights[o.id]>0).map(o=>({...o,probability:(1-e.none)*e.weights[o.id]/total}))].filter(o=>o.probability>0);add('power',e.label,'power-main',outcomes,{fixtureSource:'preview/power-roster.html',trace:{equalizerActive:e.equalizer===true}});}
for(const id of ['weapon-excalibur','weapon-bola-tenis','weapon-nunchaku']){const e=enchant.examples.find(e=>e.id===id);if(!e)continue;add('enchantment',e.label+' · slot memenuhi syarat','enchantment',enchant.enchantments.filter(o=>e.outcomeIds.includes(o.id)).map(o=>({...o,probability:1/e.outcomeIds.length})),{fixtureSource:'preview/enchantment-roster.html',note:'Only a final Master5+ compatible unused slot permits a production draw.'});}
for(const e of weakness.examples)add('weakness',e.label,'weakness',e.outcomes,{fixtureSource:'preview/weakness-roster.html'});
add('chaos','Takdir belum diputuskan','roda-kekacauan-side',chaos.openingWheel.outcomes,{fixtureSource:'content/chaos-wheel-design.json#openingWheel',note:'Root confirmed. Chaos effect scopes/Chaotic Power and full execution are separate unfinished work.'});
for(const e of title.examples){const pool=buildTitleShortlist(title.catalog,e.tags,[],'ui-theme-demo:'+e.label,e.equalizerActive);add('title',e.label,'title',pool.outcomes,{fixtureSource:'framework/title-shortlist.mjs',note:'Read-only shortlist. This UI never consumes production or existing preview titles.'});}
for(const wheel of universal.wheels){const theme=wheel.id.replace('power-',''),total=wheel.outcomes.reduce((s,o)=>s+o.baseWeight,0);add(theme,wheel.label,wheel.id,wheel.outcomes.map(o=>({...o,probability:o.baseWeight/total})),{fixtureSource:'content/universal-power-wheels-design.json'});}
for(const wheel of element.wheels){const total=wheel.outcomes.reduce((s,o)=>s+o.baseWeight,0);add('element','Roda elemen universal',wheel.id,wheel.outcomes.map(o=>({...o,probability:o.baseWeight/total})),{fixtureSource:'content/universal-element-wheel-design.json'});}
const race=await json('content/race-wheel-design.json');
for(const wheel of race.extraWheels.filter(w=>['sea-elf-form','fey-elf-season'].includes(w.id))){const total=wheel.outcomes.reduce((s,o)=>s+o.baseWeight,0);add('race',wheel.label,wheel.id,wheel.outcomes.map(o=>({...o,probability:o.baseWeight/total})),{wheelLabel:wheel.label,fixtureSource:'content/race-wheel-design.json#extraWheels'});}
const machine=await json('content/machine-events-design.json');
for(const wheel of machine.wheels){const total=wheel.outcomes.reduce((s,o)=>s+o.baseWeight,0);add('race',wheel.label,wheel.id,wheel.outcomes.map(o=>({...o,probability:o.baseWeight/total})),{wheelLabel:wheel.label,fixtureSource:'content/machine-events-design.json#wheels'});}
for(const [file,key] of [['gambler-events-design','typeWheel'],['goliath-events-design','chanceWheel']]){const wheel=(await json('content/'+file+'.json'))[key];add('archetype',wheel.label,wheel.id,wheel.outcomes,{wheelLabel:wheel.label,fixtureSource:'content/'+file+'.json#'+key});}
for(const t of THEMES)if(!fixtures[t.id].length)throw new Error('No fixture for '+t.id);

const payload={version:'wheel-ui/2.1.0',themes:THEMES,layout:LAYOUT,layers:LAYERS,fixtures};
await mkdir(new URL('ui/assets/',root),{recursive:true});
await writeFile(new URL('ui/fixtures.json',root),JSON.stringify(payload,null,2)+'\n');
const css=await read('ui/studio.css');
const baraSpinClip=await readFile(new URL('renders/bara-wheel-spin-001/bara-wheel-spin-001.mp4',root)).catch(()=>null);
const baraSpinPreview=baraSpinClip?`<details class="panel bara-spin-preview"><summary>Spin baru dengan Bara · wang wang</summary><video controls playsinline preload="none" style="width:100%;max-height:70vh;margin-top:12px" src="data:video/mp4;base64,${baraSpinClip.toString('base64')}"></video></details>`:'';
const visualData=await json('content/element-visual-design.json');
await writeFile(new URL('ui/element-visuals.mjs',root),'// Generated from content/element-visual-design.json.\nexport const ELEMENT_VISUALS='+JSON.stringify(visualData.profiles)+';\n');
const modules=await Promise.all(['ui/wheel-themes.mjs','ui/wheel-geometry.mjs','ui/element-visuals.mjs','ui/element-art.mjs','ui/brand-assets.mjs','ui/brand-art.mjs','mascot/layer-assets.mjs','mascot/motion.mjs','mascot/expectation.mjs','mascot/rig.mjs','mascot/recorded-sound-assets.mjs','mascot/sounds.mjs','ui/landing-sound-assets.mjs','ui/landing-sound.mjs','ui/text-metrics.mjs','ui/audit-layout.mjs','ui/system-notice.mjs','ui/wheel-renderer.mjs','framework/readable-acquisition.mjs','ui/studio.mjs'].map(read));
const personalityModules=await Promise.all(['mascot/personality.mjs','mascot/commentary-session.mjs'].map(read));
modules.splice(modules.length-1,0,...personalityModules);
const script=modules.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n');
const dataText=JSON.stringify(payload).replaceAll('<','\\u003c'),safeScript=script.replaceAll('</script','<\\/script');
const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Roda Kekacauan · Video Wheel Studio</title><style>${css}</style></head><body>
<header><div><div class="eyebrow">Roda Kekacauan / Art direction 02</div><h1>Mesin takdir.</h1><p class="small"><a href="episode-002.html">Putar karakter terbaru · Damar Karsa →</a> · <a href="episode-001.html">Episode sebelumnya</a></p></div><span class="tag">26 tema · 16 lapisan · 1080 × 1920</span></header>
<main><aside class="editor"><section class="panel"><div class="fields"><label class="field"><span>Roda / tema</span><select id="theme"></select></label><label class="field"><span>Contoh peluang</span><select id="example"></select></label></div><label class="field"><span>Roster Weapon / Power</span><select id="roster-mode"><option value="compact">Ringkas — usulan 1–2%</option><option value="full">Katalog penuh — aturan tersimpan</option></select></label><label class="field"><span>Durasi putaran <b id="duration-value">4,4 detik</b></span><input id="duration" type="range" min="2400" max="6200" step="100" value="4400"></label><div class="checks"><label><input id="guides" type="checkbox">Panduan area aman</label><label><input id="sound" type="checkbox">Suara roda & hasil</label></div><div class="buttons"><button class="primary" id="spin">Coba putar ↺</button><button id="export">SVG komposit</button><button id="film">Lihat frame saja</button></div><div id="status" role="status" aria-live="polite"></div><p class="small">Anticlockwise. Luas sektor mengikuti peluang pool yang ditampilkan. Mode ringkas adalah usulan; engine belum berubah.</p></section>
<section class="panel"><details><summary>Lapisan dan aksesori</summary><div class="layer-list" id="layers"></div></details><label class="field" style="margin-top:15px"><span>Ekspor satu lapisan transparan</span><select id="export-layer"></select></label><button id="export-single">Ekspor lapisan SVG</button></section><section class="panel"><details><summary>Roda dari engine</summary><p class="small">Masukkan JSON roda dengan ID, label, dan peluang yang sudah ditetapkan.</p><input type="file" id="import-plan" accept="application/json,.json" style="width:100%;font-size:10px"><p class="small">Jika ada committedOutcomeId, demo memutar hasil itu tanpa mengundi lagi.</p></details></section><p class="small"><a href="video-wheel-gallery.html">Lihat seluruh tema →</a><br><a href="wheel-density-comparison.html">Bandingkan penuh / ringkas →</a></p></aside>
<section class="viewer"><div id="frame"></div><div class="stage-label"><span>Frame video 9:16 · tanpa kontrol editor</span><span>Ketuk untuk kembali ke editor</span></div></section>
<aside class="inspector"><section class="panel"><div class="eyebrow">Tema aktif</div><div class="theme-title" id="concept"></div><p id="material"></p><div class="palette" id="palette"></div><div class="facts"><span id="option-count"></span><span id="density"></span></div><p class="small">Aksesori diam, bidang roda bergerak, penunjuk menyentuh sektor. Reaksi muncul setelah hasil berhenti.</p><p class="small">Reveal mengikuti hasil aktual. Slot reaksi memakai placeholder vektor. Klip meme dan narator disambungkan pada tahap media.</p></section><section class="panel"><h2>Pilihan & peluang asli</h2><input class="search" type="search" id="search" placeholder="Cari nama pilihan…"><div class="roster" id="roster"></div><p class="small">Pencarian hanya menyaring daftar ini.</p></section></aside></main>
<script id="studio-data" type="application/json">${dataText}</script><script>(()=>{${safeScript}\n})();</script></body></html>`;
await mkdir(new URL('preview/',root),{recursive:true});
await writeFile(new URL('preview/video-wheel-studio.html',root),html
  .replace('Ringkas — usulan 1–2%','Ringkas — minimum 2%')
  .replace('Mode ringkas adalah usulan; engine belum berubah.','Pool ringkas ditetapkan sebelum hasil dipilih; nama minimal 2%.')
  .replace('Klip meme dan narator disambungkan pada tahap media.','Episode menggunakan komentar dan penjelasan mekanik sebagai teks, serta suara roda.')
  .replace('Pilihan & peluang asli','Pilihan & peluang roda ini')
  .replace('<aside class="inspector">',`<aside class="inspector">${baraSpinPreview}`)
  .replace('<input id="sound" type="checkbox">Suara roda & hasil','<input id="sound" type="checkbox" checked>Suara roda & Bara')
  .replace('Slot reaksi memakai placeholder vektor.','Bara bergerak dengan kepala, badan, dan ekor berlapis; suara wang wang menyambut hasil.')
  .replace('Putar episode karakter lengkap →','Putar episode karakter lengkap →')
  .replace('<a href="video-wheel-gallery.html">','<a href="mascot-studio.html">Kenalan dengan Bara →</a><br><a href="video-wheel-gallery.html">'));

const packs=[],gallery=[];
for(const t of THEMES){
  const fixture=fixtures[t.id][0],plan=['weapon','power'].includes(t.id)?planReadableAcquisition(fixture.plan,{seed:'studio-roster-1'}):fixture.plan,outcome=plan.outcomes.find(o=>o.value===3)||plan.outcomes[0],rotation=-outcome.mid;
  const opts={themeId:t.id,rotation,resultId:outcome.id,readout:outcome.label,context:plan.contextLabel,caption:'Contoh tampilan · bukan karakter tersimpan'};
  const folder=`ui/assets/${t.id}/`;await mkdir(new URL(folder,root),{recursive:true});
  const composite=renderWheelSVG(plan,opts);await writeFile(new URL(folder+'composite.svg',root),composite);
  for(const l of LAYERS.filter(l=>!l.editorOnly))await writeFile(new URL(folder+l.id+'.svg',root),renderWheelSVG(plan,{...opts,onlyLayer:l.id}));
  const pack={themeId:t.id,width:1080,height:1920,composite:folder+'composite.svg',fixtureSource:plan.fixtureSource,mode:'display-only',demoOutcomeId:outcome.id,
    layers:LAYERS.filter(l=>!l.editorOnly).map(l=>({...l,file:folder+l.id+'.svg'}))};packs.push(pack);
  const uniqueSVG=composite.replace(/\sid="([^"]+)"/g,(_,id)=>` id="gallery-${t.id}-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#gallery-${t.id}-${id})`);
  gallery.push(`<article>${uniqueSVG}<figcaption><strong>${t.name}</strong><span>${t.concept}</span></figcaption></article>`);
}
await writeFile(new URL('ui/assets/manifest.json',root),JSON.stringify({schemaVersion:'wheel-layer-pack/1.0.0',layout:LAYOUT,fonts:['Segoe UI','Arial','Georgia'],transparentLayers:true,productionStateTouched:false,packs},null,2)+'\n');
await writeFile(new URL('preview/video-wheel-gallery.html',root),`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Roda Kekacauan · Tema roda</title><style>${css}</style></head><body><header><div><div class="eyebrow">26 tema / satu dunia visual</div><h1>Mesin takdir.</h1><p><a href="video-wheel-studio.html">← Coba putaran dan lapisan</a></p></div><span class="tag">SVG · tanpa image generation</span></header><section class="gallery">${gallery.join('')}</section></body></html>`);
const comparisons=[];
for(const id of ['weapon','power']){
  const original=fixtures[id][0].plan,compact=planReadableAcquisition(original,{seed:'studio-roster-1'}),chosen=compact.outcomes.find(o=>o.tier===3)||compact.outcomes.find(o=>o.tier);
  const folder=`ui/assets/readable/${id}/`;await mkdir(new URL(folder,root),{recursive:true});
  await writeFile(new URL(folder+'plan.json',root),JSON.stringify(compact,null,2)+'\n');
  for(const [kind,p] of [['full',original],['compact',compact]]){
    const o=p.outcomes.find(o=>o.id===chosen.id),svg=renderWheelSVG(p,{themeId:id,rotation:-o.mid,resultId:o.id,readout:o.label,caption:kind==='compact'?'Nama minimal 2%':'Katalog penuh'});
    await writeFile(new URL(folder+kind+'.svg',root),svg);
    const unique=svg.replace(/\sid="([^"]+)"/g,(_,key)=>` id="comparison-${id}-${kind}-${key}"`).replace(/url\(#([^)]+)\)/g,(_,key)=>`url(#comparison-${id}-${kind}-${key})`);
    comparisons.push(`<article>${unique}<figcaption><strong>${id==='weapon'?'Weapon':'Power'} · ${kind==='full'?'penuh':'ringkas'}</strong><span>${p.outcomes.length} pilihan. ${kind==='compact'?'Pool sebelum draw, setiap nama minimal 2%.':'Katalog lengkap untuk referensi.'}</span></figcaption></article>`);
  }
}
await writeFile(new URL('preview/wheel-density-comparison.html',root),`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Roda Kekacauan · Roda penuh vs ringkas</title><style>${css}</style></head><body><header><div><div class="eyebrow">Perbandingan untuk layar HP</div><h1>Katalog besar. Roda lebih terbaca.</h1><p><a href="video-wheel-studio.html">← Coba putaran</a> · Pool ringkas dipilih berdasarkan karakter sebelum draw. Setiap nama minimal 2%.</p></div></header><section class="gallery">${comparisons.join('')}</section></body></html>`);
console.log(JSON.stringify({themes:THEMES.length,layers:LAYERS.length,exportedLayersPerTheme:15,fixtures:Object.values(fixtures).reduce((s,v)=>s+v.length,0),layerAssets:packs.length*16,productionStateTouched:false}));
