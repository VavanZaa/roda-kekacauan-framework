// Audience-facing rules for the frozen Damar route. This adapter has no RNG,
// grants or persistence. Other routes must supply their own canonical rules.
import {paginateSystemNotice} from '../ui/system-notice.mjs';
const SHORT_SYSTEM_RULES={
 'RAS':['EVENT RAS','Kurcaci membuka roda Dwarf atau Gnome.'],
 'JENIS KURCACI':['ARMOR DWARF','Dwarf mendapat 1–5 bagian armor.'],
 'JUMLAH ARMOR':['ANTI KEMBAR','Sedikit armor lebih mungkin. Bagian terpilih dikeluarkan, tidak bisa kembar.'],
 'ARMOR 1':['BONUS','Helm: Durability +1. Bonus masuk di akhir.'],
 'ARMOR 2':['BONUS','Armor badan: Durability +1. Bagian terpilih dikeluarkan.'],
 'ARMOR 3':['TOTAL ARMOR','Armor kaki: Durability +1. Total tiga armor: Durability +3.'],
 'ARCHETYPE':['SYARAT TERPENUHI','Tiga armor cukup kuat. Archetype dilewati.'],
 'BACKSTORY':['POWER TERTUNDA','Bonus: satu Power dijamin. Diputar setelah Power utama.'],
 'SIZE':['PELUANG STAT','Ukuran mengikuti tubuh ras dan membentuk peluang stat.'],
 'STRENGTH':['LUCKY PULL','Ras, role, lore, ukuran membentuk peluang stat berbeda; hasil tetap 5–25%.'],
 'SPEED':['HASIL DASAR','Ini hasil dasar. Semua bonus masuk di akhir.'],
 'DURABILITY':['BONUS TERTUNDA','Durability +3 dari armor belum masuk.'],
 'INTELLIGENCE':['HASIL DASAR','Ini hasil dasar sebelum bonus akhir.'],
 'FIGHT':['HASIL DASAR','Ini hasil dasar sebelum bonus akhir.'],
 'WEAPON':['MASTERY SENDIRI','Setiap senjata punya Weapon Mastery sendiri.'],
 'WEAPON MASTERY':['SYARAT ENCHANT','Mastery setelah bonus harus Master atau lebih tinggi untuk membuka Enchantment.'],
 'ENCHANTMENT':['TARGET: REVOLVER','Enchant Es hanya untuk Revolver: serangannya membawa es.'],
 'POWER':['ANTI KEMBAR','Power terpakai dikeluarkan. Tanpa Power masih bisa muncul.'],
 'POWER TEMPAT SAMPAH':['POWER DIJAMIN','Bonus Backstory: Tanpa Power dimatikan. Power terpakai tetap dikeluarkan.'],
 'POWER MASTERY':['SEMUA POWER','Satu mastery untuk semua power. Tidak membuka Enchantment.'],
 'WEAKNESS':['SYARAT AKTIVASI','Power aktif setelah nama jurus disebut; tanpa debuff stat tetap.'],
 'RODA KEKACAUAN':['EVENT LANJUTAN','Chaos Low membuka satu event ringan.'],
 'EVENT KEKACAUAN':['GESER POIN','Intelligence −1 → Fight +1 (tertinggi → terendah sebelum Chaos).'],
 'GELAR':['LORE SAJA','Gelar tanpa bonus; gelar terpakai dikeluarkan dari pool seri.' ]
};
const CONCISE_SYSTEM_RULES={
 'RAS':['EVENT RAS','Kurcaci → Dwarf atau Gnome.'],
 'JENIS KURCACI':['ARMOR DWARF','Dwarf mendapat 1–5 armor.'],
 'JUMLAH ARMOR':['ANTI KEMBAR','Sedikit armor lebih mungkin. Bagian terpilih dimatikan.'],
 'ARMOR 1':['BONUS TERTUNDA','Helm: Durability +1 di akhir.'],
 'ARMOR 2':['BONUS TERTUNDA','Armor badan: Durability +1. Tidak bisa kembar.'],
 'ARMOR 3':['TOTAL ARMOR','Tiga armor: total Durability +3 di akhir.'],
 'ARCHETYPE':['DILEWATI','Tiga armor cukup kuat; Archetype dilewati.'],
 'BACKSTORY':['POWER TERTUNDA','Satu bonus Power dijamin, setelah Power utama.'],
 'SIZE':['PELUANG STAT','Ukuran mengikuti ras dan membentuk peluang stat.'],
 'STRENGTH':['LUCKY PULL','Ras, lore, ukuran membentuk peluang tiap stat: 5–25%.'],
 'SPEED':['HASIL DASAR','Bonus masuk di akhir.'],
 'DURABILITY':['BONUS TERTUNDA','Durability +3 dari armor masuk di akhir.'],
 'INTELLIGENCE':['HASIL DASAR','Bonus masuk di akhir.'],
 'FIGHT':['HASIL DASAR','Bonus masuk di akhir.'],
 'WEAPON':['MASTERY SENDIRI','Setiap senjata punya mastery sendiri.'],
 'WEAPON MASTERY':['SYARAT ENCHANT','Mastery setelah bonus ≥ Master membuka Enchantment.'],
 'ENCHANTMENT':['TARGET: REVOLVER','Revolver mendapat serangan es.'],
 'POWER':['ANTI KEMBAR','Power terpakai dimatikan. Tanpa Power masih aktif.'],
 'POWER TEMPAT SAMPAH':['POWER DIJAMIN','Tanpa Power dan power terpakai dimatikan.'],
 'POWER MASTERY':['SEMUA POWER','Satu mastery untuk semua power; tanpa Enchantment.'],
 'WEAKNESS':['SYARAT AKTIVASI','Sebut nama jurus untuk mengaktifkan power.'],
 'RODA KEKACAUAN':['EVENT LANJUTAN','Chaos Low membuka satu event ringan.'],
 'EVENT KEKACAUAN':['GESER POIN','Intelligence −1 → Fight +1 (tertinggi → terendah sebelum Chaos).'],
 'GELAR':['LORE SAJA','Tanpa bonus; gelar terpakai dimatikan.' ]
};
export function systemRulesForEvent(e,{compact=false,concise=false,presentation='concurrent'}={}){
 if(concise&&!compact)throw Error('Concise system rules need compact presentation.');
 if(e.systemRuleRows){
  if(!e.systemRuleRows.length)throw Error('Explicit fresh-route rules required.');
  const rows=structuredClone(e.systemRuleRows);
  const notice={voice:'system',title:e.step,rows,presentation,readingProfile:concise?'concise':compact?'short':'full'};
  return {...notice,fullRules:structuredClone(rows),pages:paginateSystemNotice(notice),source:'reviewed-canonical-episode-mechanisms',changesGameplay:false};
 }
 const id=e.plan?.wheelId;
 const title=e.step==='ARCHETYPE'?'Archetype dilewati':e.step==='WEAPON MASTERY'?'Syarat Enchantment':e.step==='POWER MASTERY'?'Satu mastery, semua power':e.step==='POWER TEMPAT SAMPAH'?'Bonus Backstory aktif':e.step==='EVENT KEKACAUAN'?'Geser Poin':e.step==='JUMLAH ARMOR'?'Aturan armor Dwarf':e.step;
 let rows;
 if(e.step==='RAS')rows=[['EVENT RAS','Kurcaci lanjut ke roda Dwarf atau Gnome. Event mengikuti jenis yang terpilih.']];
 else if(e.step==='JENIS KURCACI')rows=[['ATURAN','Dwarf mendapat 1–5 bagian armor. Jumlah dan bagian armor diputar berikutnya.']];
 else if(e.step==='JUMLAH ARMOR')rows=[['PELUANG','Sedikit armor lebih mungkin daripada banyak armor.'],['ANTI KEMBAR','Setiap bagian terpilih dikeluarkan dari roda. Tiga armor berarti tiga bagian berbeda.']];
 else if(e.step==='ARMOR 1')rows=[['BONUS','Helm memberi Durability +1.'],['ANTI KEMBAR','Helm dikeluarkan dari roda armor berikutnya.']];
 else if(e.step==='ARMOR 2')rows=[['BONUS','Armor badan memberi Durability +1. Bonus disimpan sampai akhir.']];
 else if(e.step==='ARMOR 3')rows=[['BONUS','Armor kaki memberi Durability +1.'],['TOTAL ARMOR','Tiga bagian memberi Durability +3. Masuk di akhir.']];
 else if(e.step==='ARCHETYPE')rows=[['SYARAT','Build dengan keunggulan ras yang kuat melewati Archetype.'],['HASIL','Tiga armor Dwarf memenuhi syarat. Lanjut ke Backstory.']];
 else if(e.step==='BACKSTORY')rows=[['HADIAH','Satu spin Power tambahan, dijamin mendapat power.'],['WAKTU','Jatah ini diputar setelah Power utama. Belum diputar sekarang.']];
 else if(e.step==='SIZE')rows=[['ATURAN UKURAN','Rentang ukuran mengikuti tubuh ras dan hasil sebelumnya.'],['EFEK','Ukuran ikut membentuk peluang tiap stat berikutnya.']];
 else if(e.step==='STRENGTH')rows=[['PELUANG STAT','Ras, Archetype, Backstory, dan ukuran membentuk peluang. Tiap stat punya distribusi sendiri.'],['LUCKY PULL','Setiap hasil tetap punya peluang 5–25%. Bonus dihitung di akhir.']];
 else if(e.step==='SPEED')rows=[['HASIL DASAR','Kecepatan dasar Damar: '+e.resultLabel+'. Bonus belum masuk.']];
 else if(e.step==='DURABILITY')rows=[['HASIL DASAR',e.resultLabel+' dari spin.'],['BONUS TERTUNDA','Tiga armor memberi Durability +3. Bonus ini masuk di akhir.']];
 else if(e.step==='INTELLIGENCE')rows=[['HASIL DASAR',e.resultLabel+' dari spin. Ini hasil sebelum bonus akhir.']];
 else if(e.step==='FIGHT')rows=[['HASIL DASAR',e.resultLabel+' dari spin. Ini hasil sebelum bonus akhir.']];
 else if(e.step==='WEAPON')rows=[['ATURAN SENJATA','Mendapat senjata membuka satu Weapon Mastery untuk senjata itu.'],['BERIKUTNYA','Revolver didapat. Mastery menentukan apakah Enchantment terbuka.']];
 else if(e.step==='WEAPON MASTERY')rows=[['SYARAT','Weapon Mastery akhir harus Master atau lebih tinggi. Bonus mastery ikut dihitung.'],['TERBUKA','Revolver: '+e.resultLabel+'. Memenuhi syarat, lanjut Enchantment.']];
 else if(e.step==='ENCHANTMENT')rows=[['TARGET','Enchant hanya berlaku pada Revolver.'],['EFEK ES','Serangan Revolver membawa es. Enchant tidak menjadi power tubuh.']];
 else if(e.step==='POWER')rows=[['ATURAN POWER','Power yang sudah dimiliki dikeluarkan dari roda. Hasil Tanpa Power tetap bisa muncul.'],['BERIKUTNYA','Alkimia didapat. Jatah tambahan Backstory diputar setelah ini.']];
 else if(e.step==='POWER TEMPAT SAMPAH')rows=[['JAMINAN','Tanpa Power dimatikan untuk bonus ini. Power yang sudah dimiliki juga dikeluarkan.'],['HADIAH','Hologram Projection ditambahkan. Kedua power memakai satu Power Mastery.']];
 else if(e.step==='POWER MASTERY')rows=[['ATURAN','Satu hasil Power Mastery berlaku untuk semua power yang dimiliki.'],['HASIL',e.resultLabel+' untuk Alkimia dan Hologram Projection. Power Mastery tidak membuka Enchantment.']];
 else if(e.step==='WEAKNESS')rows=[['SYARAT AKTIVASI','Nama jurus harus disebut agar power aktif.'],['EFEK','Kelemahan ini bersyarat, tanpa pengurangan stat tetap.']];
 else if(e.step==='RODA KEKACAUAN')rows=[['EVENT','Chaos Low membuka satu event Kekacauan ringan.'],['BERIKUTNYA','Efek ditentukan oleh roda event setelah ini.']];
 else if(e.step==='EVENT KEKACAUAN')rows=[['ATURAN','Pindahkan satu poin dari stat tertinggi ke stat terendah, memakai nilai sebelum Chaos.'],['DICATAT','Intelligence −1 → Fight +1. Bonus diselesaikan di akhir.']];
 else if(e.step==='GELAR')rows=[['ATURAN GELAR','Gelar untuk identitas dan lore, tanpa bonus stat.'],['ANTI KEMBAR','Gelar terpakai dikeluarkan dari pool seri berikutnya.']];
 else throw Error('No reviewed system rules for '+id+' / '+e.step);
 const fullRows=rows.map(([label,text])=>({label,text}));
 const short=(concise?CONCISE_SYSTEM_RULES:SHORT_SYSTEM_RULES)[e.step];
 const notice={version:'system-rules/1',voice:'system',source:'frozen-route-approved-mechanics',title,
  presentation,readingProfile:concise?'concise':compact?'short':'full',
  rows:compact?[{label:short[0],text:short[1]}]:fullRows,...(compact?{fullRules:fullRows}:{})};
 return {...notice,pages:paginateSystemNotice(notice)};
}
