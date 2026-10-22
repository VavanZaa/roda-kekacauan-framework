import { mkdir, writeFile } from 'node:fs/promises';
import design from '../../content/weapon-wheel-design.json' with { type: 'json' };
import audit from '../../reference/size-profile-coverage.json' with { type: 'json' };
import weaponAudit from '../../reference/weapon-race-affinity-audit.json' with { type: 'json' };
import { planSizeStage } from '../size-wheel.mjs';
import { planWeaponWheel } from '../weapon-wheel.mjs';

const cases = [
  ['Human', 'human'], ['Human · Paladin', 'human', 'paladin'], ['Human · Assassin', 'human', 'assassin'],
  ['Human · Anak Peternakan', 'human', null, 'farm-raised'], ['Human · Mantan Knight', 'human', null, 'fallen-knight'],
  ['Human · Lahir Pas Perang', 'human', null, 'war-born'], ['Dwarf', 'dwarf/dwarf'], ['Gnome', 'dwarf/gnome'],
  ['Tuyul', 'lelembut/local/tuyul'], ['Western Dragon', 'mythical-beast/imported/dragon/western'],
  ['AI', 'machine/ai'], ['Ultraman', 'cosmic-warrior/ultraman'], ['Human · Equalizer', 'human', 'equaliser'],
  ['Human · Royal Knight', 'human', 'royal', null, 'knight'], ['Human · Royal Pawn', 'human', 'royal', null, 'pawn'],
  ['Phoenix', 'mythical-beast/imported/phoenix'], ['Slime', 'slime/ordinary'], ['Android', 'machine/android'],
  ['Cyborg', 'machine/cyborg'], ['Saiyan', 'cosmic-warrior/saiyan'], ['Kinnara', 'mythical-beast/local/kinnara'],
  ['Arthur Pendragon', 'legendary-warrior/imported/arthur-pendragon'], ['Merlin', 'legendary-warrior/imported/merlin'],
  ['Saint · Pegasus', 'cosmic-warrior/saint'], ['Saint · Libra', 'saint-armor/gold-libra'],
  ['Saint · Andromeda', 'saint-armor/bronze-andromeda'], ['Saint · Sagittarius', 'saint-armor/gold-sagittarius']
];
const examples = cases.map(([label, caseId, role, backstoryId, royalPiece], index) => {
  const example = [...audit.terminalCases, ...audit.ownerRewardContextCases].find(c => c.id === caseId);
  if (!example) throw new Error(`Unknown example ${caseId}`);
  const input = structuredClone(example.input);
  input.runId = `weapon-preview:${index}`;
  input.archetypeIds = role ? [role] : [];
  input.archetypeFacts = role ? [{ archetypeId: role, sourceId: `preview-role:${role}`, committed: true,
    results: royalPiece ? [{ wheelId: 'royal-chess-piece', outcomeId: royalPiece, spinId: `preview-role-draw:${royalPiece}` }] : [] }] : [];
  const sizePlan = planSizeStage(input);
  const plan = planWeaponWheel({ ...input, invocationId: 'preview-weapon', sizePlan,
    sizeResult: { invocationId: sizePlan.invocationId, spinId: 'preview-size', outcomeId: sizePlan.outcomes[5]?.id ?? sizePlan.outcomes[0].id },
    ...(backstoryId ? { backstoryFact: { outcomeId: backstoryId, sourceId: 'preview-backstory', spinId: 'preview-backstory-draw', committed: true } } : {}),
    weapons: [], powers: [] });
  if (plan.status !== 'ready') throw new Error(`${label}: ${plan.status}`);
  return { label, none: plan.trace.noneProbability, probabilities: Object.fromEntries(plan.outcomes.map(o => [o.id, o.probability])) };
});
const data = JSON.stringify({ weapons: design.weapons.map(w => ({ id: w.id, label: w.label, aliases: w.aliases ?? [], tier: w.tier })),
  tierNames: design.tierNames, examples, raceAudit: [...weaponAudit.rows, ...weaponAudit.rewardContextRows] }).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Roda Kekacauan · 150 Weapon</title><style>
:root{color-scheme:dark;--bg:#11121c;--panel:#1d2030;--line:#383c50;--text:#f4efe0;--soft:#b7b5ca;--gold:#ffd283}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:32px 24px}a{color:var(--gold)}h1{font-size:clamp(28px,4vw,44px);line-height:1.1;max-width:700px;margin:18px 0}p{color:var(--soft);max-width:800px}.pill{display:inline-block;margin-top:18px;background:#393345;border-radius:24px;color:var(--gold);padding:5px 12px;font-size:13px}.controls{display:flex;flex-wrap:wrap;gap:16px;margin:26px 0}label{display:flex;flex-direction:column;gap:7px;color:var(--soft);font-size:13px}input,select,button{font:inherit;color:var(--text);background:#272b3e;border:1px solid var(--line);border-radius:10px;padding:10px 12px}input{min-width:250px}select{min-width:240px}button{cursor:pointer}.summary{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:24px 0}.card{border:1px solid var(--line);border-radius:14px;padding:14px;background:var(--panel);font-size:13px}.card strong{display:block;font-size:24px;color:var(--gold)}.card span{display:block;color:var(--soft);font-size:12px}.card.none{border-color:#806f51}table{width:100%;border-collapse:collapse;background:var(--panel);border-radius:14px;overflow:hidden;font-variant-numeric:tabular-nums}th,td{text-align:left;padding:11px 16px;border-bottom:1px solid var(--line)}th{color:var(--soft);font-size:12px}td:last-child,th:last-child{text-align:right;white-space:nowrap}.tier{font-size:12px;padding:4px 9px;border-radius:20px;color:#161824;background:#a1a7b9}.t2{background:#8ec9a9}.t3{background:#8fb7ec}.t4{background:#c6a6ed}.t5{background:#ffd283}.note{font-size:13px}.count{margin:16px 0;color:var(--soft);font-size:13px}@media(max-width:760px){main{padding:22px 16px}.summary{grid-template-columns:repeat(3,1fr)}.controls label,.controls input,.controls select{width:100%}th,td{padding:10px}.tier{white-space:nowrap}}@media(max-width:420px){.summary{grid-template-columns:repeat(2,1fr)}}
</style></head><body><main><a href="main-wheels.html">← Race & Archetype</a><br>
<span class="pill">150 weapon · 5 Tier · 30 per Tier</span><h1>Dari gigi palsu sampai Excalibur.</h1>
<p>Tier 1–5 punya peluang sama: masing-masing 20% dari hasil yang mendapat weapon. Ras, Archetype, dan Backstory mengubah peluang item di dalam tier. “Tanpa weapon” punya bagian tersendiri.</p>
<p class="note">Kecocokan biasa memberi bobot ringan, maksimal 2×. Royal Knight lebih condong ke pedang. Paladin tetap punya peluang Pedang Suci sekitar 10% sesuai aturan sebelumnya.</p>
<div class="controls"><label>Contoh karakter<select id="example"></select></label><label>Cari weapon<input id="search" type="search" placeholder="Gigi palsu, katana, Excalibur…"></label><label>Tier<select id="tier"><option value="0">Semua Tier</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option><option value="4">Tier 4</option><option value="5">Tier 5</option></select></label></div>
<div class="summary" id="summary"></div><p id="count" class="count"></p>
<table><thead><tr><th>WEAPON</th><th>TIER</th><th>PELUANG</th></tr></thead><tbody id="rows"></tbody></table>
<p class="note">Tier menunjukkan kelas weapon. Weapon Mastery tetap di-spin sendiri; bonus dihitung di akhir. Angka ini adalah rancangan game yang bisa kita ubah.</p>
<details><summary>Audit ${weaponAudit.reviewedTerminalCaseCount} ras & subras + ${weaponAudit.reviewedRewardContextCaseCount} variasi event</summary><p>Ini peluang dasar sebelum Archetype dan Backstory. “Tanpa weapon” berarti tidak mendapat weapon tambahan; equipment yang sudah didapat tetap disimpan.</p>
<label>Cari ras / subras<input id="race-search" type="search" placeholder="Ultraman, elf, phoenix, Merlin…"></label><p id="race-count" class="count"></p><table><thead><tr><th>RAS / SUBRAS</th><th>TANPA WEAPON</th></tr></thead><tbody id="race-rows"></tbody></table></details></main>
<script id="weapon-data" type="application/json">${data}</script><script>
const data=JSON.parse(document.getElementById('weapon-data').textContent),example=document.getElementById('example'),search=document.getElementById('search'),tier=document.getElementById('tier');
const pct=n=>(n*100).toLocaleString('id-ID',{maximumFractionDigits:2})+'%';
data.examples.forEach((e,i)=>{const o=document.createElement('option');o.value=i;o.textContent=e.label;example.append(o);});
function card(label,value,caption,none=false){const e=document.createElement('div');e.className='card'+(none?' none':'');e.append(document.createTextNode(label));const n=document.createElement('strong');n.textContent=pct(value);e.append(n);const c=document.createElement('span');c.textContent=caption;e.append(c);return e;}
function render(){const current=data.examples[Number(example.value)],summary=document.getElementById('summary');summary.replaceChildren(card('Tanpa weapon',current.none,'Tidak menghapus weapon sebelumnya.',true));for(let t=1;t<=5;t++){const mass=data.weapons.filter(w=>w.tier===t).reduce((s,w)=>s+current.probabilities[w.id],0);summary.append(card('Tier '+t,mass,data.tierNames[t]));}const query=search.value.trim().toLocaleLowerCase('id-ID'),filtered=data.weapons.filter(w=>(!Number(tier.value)||w.tier===Number(tier.value))&&[w.label,...w.aliases].join(' ').toLocaleLowerCase('id-ID').includes(query)),rows=document.getElementById('rows');rows.replaceChildren();filtered.forEach(w=>{const tr=document.createElement('tr'),name=document.createElement('td'),level=document.createElement('td'),prob=document.createElement('td'),badge=document.createElement('span');name.textContent=w.label+(w.aliases.length?' · '+w.aliases[0]:'');badge.className='tier t'+w.tier;badge.textContent='Tier '+w.tier;level.append(badge);prob.textContent=pct(current.probabilities[w.id]);tr.append(name,level,prob);rows.append(tr);});document.getElementById('count').textContent=filtered.length+' dari 150 weapon · '+current.label;}
example.addEventListener('change',render);tier.addEventListener('change',render);search.addEventListener('input',render);render();
function renderRaces(){const q=document.getElementById('race-search').value.toLowerCase().replaceAll('-',' '),rows=document.getElementById('race-rows'),filtered=data.raceAudit.filter(r=>r.caseId.replaceAll('-',' ').includes(q));rows.replaceChildren();for(const r of filtered){const tr=document.createElement('tr'),name=document.createElement('td'),prob=document.createElement('td');name.textContent=r.caseId.replaceAll('machine-mecha-','').replaceAll('machine-transformer-','').replaceAll('-',' ').replaceAll('/',' · ');prob.textContent=pct(r.baselineNoneProbability);tr.append(name,prob);rows.append(tr);}document.getElementById('race-count').textContent=filtered.length+' dari '+data.raceAudit.length+' ras & variasi';}document.getElementById('race-search').addEventListener('input',renderRaces);renderRaces();
</script></body></html>`;
const folder = new URL('../../preview/', import.meta.url);
await mkdir(folder, { recursive: true });
await writeFile(new URL('weapon-roster.html', folder), html, 'utf8');
console.log(`Generated150 weapon roster with ${examples.length} frozen conditional examples; equal tier masses.`);
