import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,d)=>fs.writeFileSync(path.join(root,p),JSON.stringify(d,null,2)+'\n');
const element=read('content/universal-element-wheel-design.json');
// Presentation cues only: neither the image nor its palette grants a mechanic.
const cues={
 fire:['#ce6835','#f1dfce','Lidah api jingga, tepian menyala, arang hangat.','Orange flame tongues and charcoal edges.'],
 water:['#397fa6','#dbe8eb','Aliran biru jernih, gelombang dan tetes air.','Clear blue flowing water, ripples and droplets.'],
 earth:['#8b7050','#e9dfce','Tanah berlapis, batu kasar dan retakan cokelat.','Layered brown earth, rough stone and sediment.'],
 wind:['#7c9b8b','#e3e9df','Pusaran udara pucat dan garis arus ringan.','Pale airy spiral currents, wispy flowing ribbons.'],
 lightning:['#b89425','#f4e7bd','Kilatan bercabang kuning-putih yang tajam.','Sharp branching yellow-white electric arcs, crisp jagged outlines.'],
 ice:['#4996b0','#d7edf0','Kristal es biru muda, frost dan tepian bening.','Pale cyan ice crystals, angular frost and translucent frozen edges.'],
 metal:['#657787','#e1e5e7','Logam perak, facet baja dan pantulan terarah.','Silver steel facets with directional reflections, brushed metal texture.'],
 plant:['#56804a','#e1e8cf','Akar, sulur dan daun hijau yang tumbuh menyatu.','Intertwining green leaves, woody roots and living vines.'],
 light:['#b69b51','#f3ebcf','Sinar keemasan-putih dan bidang cahaya bening.','Warm white-gold luminous rays and translucent radiance; no wings, halo or religious iconography.'],
 darkness:['#554b65','#dad3e1','Gelap menyebar seperti kabut matte yang menyerap cahaya.','Matte charcoal darkness shrouds and soft light-absorbing haze; NOT shadow hands or cosmic stars.'],
 shadow:['#6d5b89','#e0d8ea','Siluet bayangan ungu gelap, pita pipih dan tepian tegas.','Flat ink-violet shadow silhouettes with crisp ribbon-like edges; NOT black smoke or cosmic void.'],
 void:['#604584','#e4dcef','Rongga hitam dengan tepian ungu tipis dan ruang negatif.','Clean hollow black negative-space gaps bounded by a thin violet rim; sparse suspended fragments, NOT smoke, stars or a universe explosion.'],
};
const profiles=element.wheels[0].outcomes.map(o=>({id:o.id,label:o.label,accent:cues[o.id][0],sectorColor:cues[o.id][1],cue:cues[o.id][2],artCue:cues[o.id][3],powerDefinitionRef:o.powerDefinitionRef,
 body:{elemental:`Manifestasi elemen ${o.label}; ${cues[o.id][2]} Anatomi contoh tidak menentukan anatomi semua karakter.`,golem:`Tubuh konstruksi Golem dengan struktur berat dan motif ${o.label}; ${cues[o.id][2]}`,slime:`Jelly Slime membulat dengan motif ${o.label}; ${cues[o.id][2]}`},
 overlay:`Aksen ${o.label} pada tubuh asli; ${cues[o.id][2]} Pertahankan jumlah kaki/sayap, bentuk dan Size yang sudah dipilih.`,
 avoids:['Tidak menambah senjata, armor, immunity atau bonus stat.','Tidak mengubah ras menjadi asal definisi power.','Tidak menyebut mastery/tier sebagai hasil ilustrasi.']}));
write('content/element-visual-design.json',{version:'element-visual/1.0.0',elementCatalogVersion:element.version,status:'Authored visual integration under user request; reference art only.',profiles,callers:['element-pixie','naga','element-golem','elemental','dragon','elemental-slime'],distinctions:{darkness:'Absence/obstruction of light, diffuse matte haze.',shadow:'Manipulable shadow shapes, crisp silhouettes and flat ribbons.',void:'Bounded empty gaps and negative space with thin violet rims.'}});
fs.writeFileSync(path.join(root,'ui/element-visuals.mjs'),'// Generated from content/element-visual-design.json by prepare-element-illustrations/build-studio.\nexport const ELEMENT_VISUALS='+JSON.stringify(profiles)+';\n');
const base='character-design/reference-library/',plans=read(base+'metadata/art-plans.json');
const framing='Use case: stylized-concept. Original polished painterly fantasy concept reference art matching Roda Kekacauan. Pale weathered parchment in every cell, tactile materials, restrained bronze ornament, readable complete forms. Strict landscape contact sheet: FOUR equal columns, TWO equal rows filling the entire canvas. Thin bronze grid lines at quarters and middle. Exactly EIGHT subjects, each centered with 12% empty margin, wholly inside its cell. Text ONLY small cell codes A1 A2 A3 A4 / B1 B2 B3 B4 in upper-left corners. No headings, extra characters, equipment, weapons, held props, scenery, attacks or logos. One subject per cell. This is a reference, not a finalized spun character.\n';
const newIds=element.expansion.addedOutcomeIds;
for(const kind of ['elemental','golem','slime']){
 const id='element-update-'+kind+'-01';if(plans.some(p=>p.id===id))continue;
 const cells=newIds.map((eid,i)=>({index:i,code:'AB'[Math.floor(i/4)]+(i%4+1),assetId:kind==='golem'?`race:golem/element-golem/${eid}`:kind==='slime'?`race:slime/elemental/${eid}`:`race:elemental/${eid}`,label:cues[eid]?profiles.find(p=>p.id===eid).label:eid,elementId:eid,visualBrief:profiles.find(p=>p.id===eid).body[kind],kind:'body-base',visualGrouping:'race/'+kind}));
 const body=kind==='golem'?'Heavy broad constructed GOLEM: big blocky articulated hands, broad shoulders, chunky legs, material formed body, no worn armor.':kind==='slime'?'ONE low rounded gelatinous SLIME blob, translucent jelly, gentle simple eyes optional, absolutely no humanoid limbs, weapon or armor.':'ONE coherent ELEMENTAL manifestation, upright flowing spirit form, the selected substance is its body, lower body may taper into its element. No clothing, armor, genitals, biological skin or equipment; non-biological material body.';
 plans.push({id,kind:'race',columns:4,rows:2,elementCatalogVersion:element.version,cells,prompt:framing+'Every cell uses this base silhouette: '+body+'\nSubjects in EXACT row-major order:\n'+cells.map(c=>c.code+': '+c.label+' — '+profiles.find(p=>p.id===c.elementId).artCue).join('\n')+'\nThe last THREE cells must be distinctly different: diffuse DARKNESS shroud, crisp flat SHADOW ribbons, hollow VOID negative-space gaps. Keep every body within its cell.'});
}
const motifId='element-update-motifs-01';
if(!plans.some(p=>p.id===motifId)){
 const cells=profiles.map((p,i)=>({index:i,code:'ABC'[Math.floor(i/4)]+(i%4+1),assetId:`visual:dragon-element/${p.id}`,assetIds:[`visual:dragon-element/${p.id}`,`visual:naga-element/${p.id}`,`visual:fairy-element/${p.id}`],label:p.label,elementId:p.id,kind:'element-overlay',visualGrouping:'visual/shared-element',visualBrief:p.overlay}));
 plans.push({id:motifId,kind:'attachment',columns:4,rows:3,elementCatalogVersion:element.version,cells,prompt:framing.replace('TWO equal rows','THREE equal rows').replace('and middle','and thirds').replace('EIGHT subjects','TWELVE motifs').replace('A1 A2 A3 A4 / B1 B2 B3 B4','A1 A2 A3 A4 / B1 B2 B3 B4 / C1 C2 C3 C4')+'Each cell shows ONE isolated painted elemental MATERIAL / EFFECT study, no body or person, weapon, orb container, pedestal or prop. Compact sculptural effect on parchment, not a logo or diagram.\nEXACT row-major order:\n'+cells.map(c=>c.code+': '+c.label+' — '+profiles.find(p=>p.id===c.elementId).artCue).join('\n')});
}
const ids=plans.flatMap(p=>p.cells.flatMap(c=>c.assetIds??[c.assetId]));if(new Set(ids).size!==ids.length)throw new Error('Duplicate exact art bindings');
write(base+'metadata/art-plans.json',plans);
write(base+'metadata/element-update-plans.json',plans.filter(p=>p.id.startsWith('element-update-')));
console.log(JSON.stringify({visualProfiles:profiles.length,newBodyReferences:24,sharedOverlayBindings:36,plates:plans.filter(p=>p.id.startsWith('element-update-')).map(p=>p.id)}));
