import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import design from '../../content/stat-odds-design.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planStatSuite } from '../stat-odds.mjs';

const examples = [
  ['Human', 'human'],
  ['Human · Mage', 'human', 'mage', [['mage-master-sihir-chance', 'mage-biasa']]],
  ['Human · Master Sihir', 'human', 'mage', [['mage-master-sihir-chance', 'master-sihir']]],
  ['Human · Assassin', 'human', 'assassin'],
  ['Human · Goliath', 'human', 'goliath', [['goliath-berserker-chance', 'not-berserker']]],
  ['Human · Equalizer', 'human', 'equaliser'],
  ['Goblin', 'goblinoid/goblin'],
  ['Tuyul', 'lelembut/local/tuyul'],
  ['Dwarf', 'dwarf/dwarf'],
  ['Western Dragon', 'mythical-beast/imported/dragon/western'],
  ['God', 'heavenly-principle/god'],
  ['AI', 'machine/ai'],
  ['Mechagodzilla', 'machine/mecha/machine-mecha-mechagodzilla'],
  ['Rice Cooker', 'machine/household-appliance/rice-cooker'],
  ['Raksasa · Human', 'raksasa'],
  ['Lich', 'lelembut/imported/lich'],
  ['Kinnara', 'mythical-beast/local/kinnara'],
];
const preview = examples.map(([label, caseId, role, results = []], n) => {
  const c = audit.terminalCases.find(c => c.id === caseId);
  if (!c) throw new Error(`Unknown example ${caseId}`);
  const owner = structuredClone(c.input);
  owner.runId = `preview-${n}`; owner.archetypeIds = role ? [role] : [];
  owner.archetypeFacts = role ? [{ archetypeId: role, committed: true, sourceId: `preview-role:${role}`,
    results: results.map(([wheelId, outcomeId], i) => ({ wheelId, outcomeId, spinId: `preview-role:${role}:${i}` })) }] : [];
  const sizePlan = planSizeStage(owner);
  const sizes = sizePlan.outcomes.map(o => {
    const suite = planStatSuite({ ...owner, invocationId: 'preview-stats', sizePlan,
      sizeResult: { invocationId: sizePlan.invocationId, spinId: 'preview-size-draw', outcomeId: o.id },
      weapons: [{ instanceId: 'illustrative-weapon', definitionId: caseId.endsWith('kinnara') ? 'music-instrument' : 'illustrative-weapon',
        trainingProfileId: caseId.endsWith('kinnara') ? 'musical' : 'unclassified', committed: true,
        sourceId: caseId.endsWith('kinnara') ? owner.raceFacts[0].sourceId : 'illustrative-weapon-grant' }],
      powers: [{ ownedId: 'illustrative-power', definitionId: 'illustrative-power', sourceId: 'illustrative-power-grant', committed: true }] });
    return { label: o.label, value: o.sizeMeters,
      stats: [...suite.mainStats, ...suite.weaponMasteries, suite.powerMastery].map(p => {
        if (!['ready','fixed'].includes(p.status)) throw new Error(`${caseId}/${p.target}: ${p.status}`);
        return { target: p.target, fixed: p.status === 'fixed', baseValue: p.baseValue ?? null, exception: p.capException ?? null, center: p.distribution?.center ?? null,
          outcomes: p.outcomes.map(r => ({ id: r.id, label: r.label, value: r.value, probability: r.probability })) };
      }) };
  });
  return { label, caseId, sizes };
});
const data = JSON.stringify(preview).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Roda Kekacauan · Peluang Stat</title><style>
:root{color-scheme:dark;--bg:#10111b;--panel:#1b1d2d;--ink:#f4efdf;--muted:#b6b3c7;--gold:#ffd27b;--accent:#a79bff}*{box-sizing:border-box}body{margin:0;background:var(--bg);font:16px/1.5 system-ui,sans-serif;color:var(--ink)}main{max-width:1180px;margin:auto;padding:32px 24px}a{color:var(--gold)}h1{font-size:clamp(27px,4vw,40px);line-height:1.15;margin:10px 0}h2{font-size:22px;margin:0}p{color:var(--muted);max-width:780px}label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--muted)}select,button{font:inherit;border-radius:10px;padding:11px 14px}select{background:#272a3e;color:var(--ink);border:1px solid #41455f;min-width:200px}button{cursor:pointer;border:1px solid #41455f;background:#272a3e;color:var(--ink)}button:disabled{opacity:.5;cursor:wait}.controls{display:flex;gap:16px;flex-wrap:wrap;margin:22px 0}.pill{display:inline-block;background:#343044;color:var(--gold);padding:4px 11px;border-radius:30px;font-size:13px}.layout{display:grid;grid-template-columns:minmax(300px,440px) 1fr;gap:26px}.panel{background:var(--panel);border:1px solid #34374b;border-radius:18px;padding:22px}.wheel{width:100%;display:block;overflow:visible}.spin{width:100%;background:var(--gold);color:#16121a;font-weight:700;border:0;margin-top:12px}.result{min-height:80px;text-align:center;padding-top:14px}.result strong{display:block;font-size:24px}.result span{color:var(--muted)}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.card{display:block;text-align:left;padding:16px;background:var(--panel);width:100%}.card[aria-pressed=true]{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold)}.card strong{font-size:15px}.bars{height:72px;display:flex;align-items:flex-end;gap:3px;margin-top:12px}.bar{flex:1;min-width:0;background:var(--accent);border-radius:3px 3px 0 0;position:relative}.bar i{font:10px system-ui;position:absolute;left:0;right:0;text-align:center;bottom:-16px;color:var(--muted);font-style:normal}.summary{font-size:12px;color:var(--muted);margin:21px 0 0}.table{width:100%;border-collapse:collapse;margin-top:18px;font-variant-numeric:tabular-nums}.table td{padding:6px 4px;border-bottom:1px solid #34374b}.table td:last-child{text-align:right;color:var(--gold)}.note{font-size:13px}#sectors{transform-origin:210px 210px;transition:transform 3s cubic-bezier(.12,.72,.11,1)}@media(max-width:780px){.layout{grid-template-columns:1fr}.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(prefers-reduced-motion:reduce){#sectors{transition:none}}
</style></head><body><main>
<a href="main-wheels.html">← Roda Race & Archetype</a><br><span class="pill">Roda Kekacauan · Stat & Mastery</span>
<h1>Masih ada ruang buat lucky pull.</h1><p>Ras, archetype, dan ukuran membentuk peluang berbeda untuk setiap stat. Setiap hasil acak punya peluang ${(design.model.minimumProbability*100)}%–${(design.model.maximumProbability*100)}%. Bonus dihitung di akhir.</p>
<div class="controls"><label>Contoh karakter<select id="example"></select></label><label>Size bentuk utama<select id="size"></select></label></div>
<div class="layout"><section class="panel"><h2 id="stat-title">Strength</h2><svg id="wheel" class="wheel" viewBox="0 0 420 420" role="img" aria-label="Roda peluang stat, berputar anticlockwise"></svg><button class="spin" id="spin">Spin Strength</button><div class="result" aria-live="polite"><strong id="result">—</strong><span id="chance">Pilih stat atau coba spin.</span></div><table class="table" id="odds"></table></section>
<section><div class="cards" id="cards"></div><p class="note">Mastery di contoh ini menunjukkan peluang saat punya satu senjata dan power. Tidak ada hadiah tambahan dari preview. God langsung mendapat Power Mastery 9 untuk semua power; Lich langsung Durability 9 tanpa spin; Kinnara memakai Alat Musik miliknya.</p><p class="note">Angka akhir boleh negatif atau melewati 9. Power Tier 1–5 tetap terpisah dari Power Mastery. Intelligence 1–9 memakai label angka sementara.</p></section></div></main>
<script id="preview-data" type="application/json">${data}</script>
<script>
const data=JSON.parse(document.getElementById('preview-data').textContent), example=document.getElementById('example'), size=document.getElementById('size'), cards=document.getElementById('cards'), svg=document.getElementById('wheel'), spin=document.getElementById('spin');
const names={'strength':'Strength','speed':'Speed','durability':'Durability','intelligence':'Intelligence','fight':'Fight','weapon-mastery':'Weapon Mastery','power-mastery':'Power Mastery'}, colors=['#626679','#727690','#818cad','#7bacae','#6cbfa7','#70c8cf','#8bbafa','#a998ff','#cc9cec','#ffd27b'];
let currentStat=0, rotation=0, busy=false;
const pct=p=>(p*100).toLocaleString('id-ID',{maximumFractionDigits:1})+'%', mod=x=>((x%360)+360)%360;
const selected=()=>data[Number(example.value)].sizes[Number(size.value)].stats[currentStat];
function el(name,attrs={},text){const e=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;return e;}
function resetResult(){document.getElementById('result').textContent='—';document.getElementById('chance').textContent='Pilih stat atau coba spin.';}
function render(){
 const stats=data[Number(example.value)].sizes[Number(size.value)].stats;cards.replaceChildren();
 stats.forEach((s,i)=>{const b=document.createElement('button');b.className='card';b.type='button';b.setAttribute('aria-pressed',String(i===currentStat));b.disabled=busy;const h=document.createElement('strong');h.textContent=names[s.target];b.append(h);if(s.fixed){const p=document.createElement('p');p.className='summary';p.textContent='Dasar '+s.baseValue+' · tanpa spin';b.append(p);b.onclick=()=>{if(busy)return;currentStat=i;rotation=0;resetResult();render();};cards.append(b);return;}const bars=document.createElement('div');bars.className='bars';for(let v=0;v<=9;v++){const o=s.outcomes.find(o=>o.value===v), bar=document.createElement('span');bar.className='bar';bar.style.height=((o?.probability??0)*200)+'px';bar.style.background=colors[v];bar.title=v+': '+pct(o?.probability??0);const n=document.createElement('i');n.textContent=v;bar.append(n);bars.append(bar);}b.append(bars);const p=document.createElement('p');p.className='summary';p.textContent=s.exception?'Jaminan raw 9':'Peluang terbesar '+pct(Math.max(...s.outcomes.map(o=>o.probability)));b.append(p);b.onclick=()=>{if(busy)return;currentStat=i;rotation=0;resetResult();render();};cards.append(b);});
 const p=selected();document.getElementById('stat-title').textContent=names[p.target];spin.textContent='Spin '+names[p.target];svg.replaceChildren();spin.hidden=Boolean(p.fixed);spin.disabled=busy||Boolean(p.fixed);if(p.fixed){svg.append(el('circle',{cx:210,cy:210,r:155,fill:'#343044'}));svg.append(el('text',{x:210,y:210,'text-anchor':'middle','dominant-baseline':'middle',fill:'#ffd27b','font-size':32,'font-weight':700},p.baseValue+' · otomatis'));document.getElementById('result').textContent='Dasar '+p.baseValue;document.getElementById('chance').textContent='Jaminan maksimum · tanpa spin';const odds=document.getElementById('odds');odds.replaceChildren();const row=document.createElement('tr');['Jaminan maksimum','Tanpa spin'].forEach(t=>{const td=document.createElement('td');td.textContent=t;row.append(td);});odds.append(row);return;}const g=el('g',{id:'sectors'});g.style.transform='rotate('+rotation+'deg)';svg.append(g);let start=-90;
 for(const o of p.outcomes){const end=start+o.probability*360, mid=(start+end)/2, point=a=>[210+180*Math.cos(a*Math.PI/180),210+180*Math.sin(a*Math.PI/180)], a=point(start),b=point(end);if(o.probability===1)g.append(el('circle',{cx:210,cy:210,r:180,fill:colors[o.value]}));else g.append(el('path',{d:'M210 210 L'+a.join(' ')+' A180 180 0 '+(end-start>180?1:0)+' 1 '+b.join(' ')+' Z',fill:colors[o.value],stroke:'#151522','stroke-width':1}));if(o.probability>.04){const r=126,x=210+r*Math.cos(mid*Math.PI/180),y=210+r*Math.sin(mid*Math.PI/180);g.append(el('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle',fill:'#151522','font-size':12,'font-weight':700},o.value+' · '+pct(o.probability)));}start=end;}
 svg.append(el('circle',{cx:210,cy:210,r:21,fill:'#1b1d2d',stroke:'#ffd27b','stroke-width':2}));svg.append(el('path',{d:'M199 12 L221 12 L210 40 Z',fill:'#fff1d4'}));const odds=document.getElementById('odds');odds.replaceChildren();p.outcomes.forEach(o=>{const row=document.createElement('tr');[o.value+' · '+o.label,pct(o.probability)].forEach(t=>{const td=document.createElement('td');td.textContent=t;row.append(td);});odds.append(row);});
}
function setExample(){size.replaceChildren();data[Number(example.value)].sizes.forEach((s,i)=>size.add(new Option(s.label,String(i))));size.value=String(Math.min(5,size.options.length-1));rotation=0;resetResult();render();}
data.forEach((c,i)=>example.add(new Option(c.label,String(i))));example.onchange=setExample;size.onchange=()=>{if(busy)return;rotation=0;resetResult();render();};
spin.onclick=()=>{if(busy||selected().fixed)return;const p=selected(),sample=Math.random();let total=0,start=0,chosen=p.outcomes.at(-1),angle=0;for(const o of p.outcomes){total+=o.probability;if(sample<total){chosen=o;angle=start+o.probability*180;break;}start+=o.probability*360;}busy=true;example.disabled=size.disabled=spin.disabled=true;cards.querySelectorAll('button').forEach(b=>b.disabled=true);const target=mod(-angle);rotation-=1440+mod(mod(rotation)-target);document.getElementById('sectors').style.transform='rotate('+rotation+'deg)';setTimeout(()=>{document.getElementById('result').textContent=chosen.value+' · '+chosen.label;document.getElementById('chance').textContent=p.exception?'Jaminan raw 9':pct(chosen.probability)+' peluang';busy=false;example.disabled=size.disabled=spin.disabled=false;cards.querySelectorAll('button').forEach(b=>b.disabled=false);},matchMedia('(prefers-reduced-motion:reduce)').matches?0:3050);};setExample();
</script></body></html>`;
const output = fileURLToPath(new URL('../../preview/stat-odds.html', import.meta.url));
await writeFile(output, html, 'utf8');
console.log(`Stat preview generated: ${examples.length} examples, ${preview.reduce((s, p) => s + p.sizes.length, 0)} Size choices, seven distributions each.`);
