# Event Slayer

Slayer memilih identitas target yang diburu, lalu jumlah korban. Target boleh
masuk sampai subtype yang relevan, tetapi event ras dan reward target tidak
dijalankan. Jumlah korban memberi **0 atau +1 sampai +3 poin angka Strength**.

Ras korban → selector identitas → satu roda jumlah korban → bonus Strength →
Backstory. Setiap spin aktual punya result, caption dan reaksi sendiri. Hasil
Slayer sebelum count hanya mengenalkan target, belum mengklaim ada korban.

## Jalur identitas korban

| Ras target | Sampai mana spin berjalan |
| --- | --- |
| Manusia | Berhenti di Manusia. |
| Elf | Jenis Elf; Sea lanjut bentuk; Fey lanjut musim. Tanpa Holy/Cursed/Blood. |
| Kurcaci | Dwarf/Gnome, lalu berhenti. Tanpa armor/gadget. |
| Goblin & Orc | Goblin/Orc/Troll; Orc lanjut role. Tanpa army, Bos/Kacung, penyakit, Katana atau power. |
| Raksasa | Identitas ras dasar saja. Tanpa Archetype/Size/Cosmic korban. |
| Peri | Empat subrace, lalu berhenti. Tanpa Element/power/bonus. |
| Siluman | Satu hewan dari 12 pilihan; identitas saja, tanpa transformation/Nyolong. |
| Lelembut | Lokal/Impor dan jenis; Skeleton/Zombie lanjut identitas ras asal. Tanpa feeding/Cursed/fixed powers. |
| Mythical Beast | Lokal/Impor dan jenis; Dragon lanjut delapan bentuk. Tanpa Element/instrumen/power. |
| Golem | Material; Golem Elemen lanjut Element hanya sebagai identitas bahan. Tanpa grants. |
| Elemental | Element hanya sebagai identitas. Tanpa linked manipulation power. |
| Symbiote | Identitas inang saja. Tanpa Takeover/power. |
| Heavenly Principle | Enam subtype, lalu berhenti. Tanpa Concept/Divine/pengikut. |
| Abyssal Axiom | Lima subtype; Setan lanjut Succubus/Ifrit/Asura/Imp. Tanpa Sin/Demonic/pengikut. |
| Hybrid | Dua identitas korban beserta descendants; satu hitungan untuk satu individu gabungan. |
| Anime | Genre → MC/NPC; Sci-fi MC lanjut Technician/Pilot/Cyborg. Tanpa Cheat/ending/GF/Tech/mecha. |
| Reinkarnasi Pahlawan Legendaris | Lokal/Impor → karakter. Tanpa signature package/weapon/mastery/stat. |
| Machine | Jenis; Mecha lanjut model, Transformer mode kendaraan, Household item. Android/Cyborg/AI/Nanobot berhenti; tanpa power/weapon. |

Selector memakai ID dan peluang roda kanonis, termasuk Sea 60/40, Orc 1:2:3:3:1,
Peri 4:2:3:1, Heavenly 1:1:2:2:3:3, serta Pahlawan Lokal/Impor 65/35. Helper
mengeluarkan hanya ID, label dan bobot; tidak membawa efek, power link, atau
event handler korban. Dwarf/Gnome adalah selector identitas terakhir untuk
Kurcaci; Dragon Form menjadi selector terakhir untuk Dragon.

History korban terpisah dari ras karakter. Ras karakter sendiri tetap boleh
menjadi target. Chain korban memakai satu set family yang sudah dipilih agar
Hybrid/host/base/origin tidak berulang; filter sebelum spin dan normalisasi ulang.
Selesaikan komponen pertama sebelum memilih komponen kedua. Pool wajib yang
kosong adalah configuration error. Tidak mereset history atau reroll.

## Sepuluh pilihan jumlah korban

Setiap profil memiliki tepat sepuluh nilai berbeda, termasuk nol. Nilai besar
memakai angka alami dengan jarak membesar; target langka memakai hitungan kecil.
Peluang berikut adalah **estimasi game balance yang didelegasikan pengguna**,
bukan statistik populasi, kejadian nyata, atau fakta lore. Difficulty profile
hanya memilih distribusi korban; tidak memberikan stat/ability kepada korban
atau karakter. Mapping seluruh 285 hasil subtype ada di JSON desain.

Setiap pilihan jumlah korban **minimal 5%** sesuai revisi pengguna. Sepuluh
peluang tetap berjumlah 100%; hasil ekstrem boleh sama-sama 5%. Aturan ini
berlaku pada roda jumlah, sedangkan selector identitas memakai peluang kanonis.

| Profil | Jumlah korban dari kiri ke kanan | Peluang persen, urutan yang sama |
| --- | --- | --- |
| swarm | 0 / 1 / 5 / 10 / 50 / 100 / 500 / 1.000 / 5.000 / 10.000 | 8 / 8 / 11 / 16 / 16 / 13 / 10 / 8 / 5 / 5 |
| common | 0 / 1 / 2 / 5 / 10 / 20 / 50 / 100 / 500 / 1.000 | 10 / 14 / 16 / 16 / 13 / 10 / 6 / 5 / 5 / 5 |
| trained | 0 / 1 / 2 / 3 / 5 / 10 / 20 / 50 / 100 / 500 | 15 / 20 / 16 / 12 / 10 / 7 / 5 / 5 / 5 / 5 |
| elite | 0 / 1 / 2 / 3 / 5 / 10 / 20 / 30 / 50 / 100 | 24 / 20 / 14 / 10 / 7 / 5 / 5 / 5 / 5 / 5 |
| formidable | 0 / 1 / 2 / 3 / 5 / 7 / 10 / 15 / 20 / 50 | 29 / 22 / 12 / 7 / 5 / 5 / 5 / 5 / 5 / 5 |
| apex | 0 / 1 / 2 / 3 / 4 / 5 / 7 / 10 / 15 / 20 | 33 / 22 / 10 / 5 / 5 / 5 / 5 / 5 / 5 / 5 |
| legendary | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 10 | 41 / 19 / 5 / 5 / 5 / 5 / 5 / 5 / 5 / 5 |
| divine | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 | 48 / 12 / 5 / 5 / 5 / 5 / 5 / 5 / 5 / 5 |

Goblin memakai swarm; God dan Raja Iblis Agung memakai divine. Dragon Western,
Wyrm, Lindwyrm dan Sea Serpent memakai apex; Wyvern/Drake/Amphiptere formidable;
Eastern Dragon legendary. Seluruh 110 pahlawan memakai legendary sebagai
perlakuan balance untuk paket signature setara, tanpa menyalin feat sejarah
atau Noble Phantasm. Mecha zonk memakai common, Household memakai swarm.

Skeleton/Zombie mengikuti origin dengan minimum common. Symbiote mengikuti
host dengan minimum elite, tanpa menebak Takeover. Raksasa memakai ras dasar
naik satu profil dengan minimum apex; tidak memutar atau menebak ukuran tepat.
Hybrid memakai komponen terberat naik satu profil. Kenaikan dibatasi divine.
Hitungan berlaku untuk individu korban gabungan, bukan setiap komponen.
Anime NPC selalu common; MC memakai genre, lalu role Sci-fi bila relevan.
Siluman memakai profil satu hewan terpilih. Kelelawar dan Elang memakai profil trained yang sudah ada.

## Bonus Strength

Nol korban tidak memberi bonus. Untuk sembilan hasil positif, tiga posisi
terbawah memberi +1, tiga berikutnya +2, tiga tertinggi +3. Pembagian posisi
ini adalah interpretasi balance yang diungkapkan; rentang korban menyesuaikan
kesulitan target. Bonus maksimal Slayer adalah +3 Strength, tanpa loot, mastery,
power atau bonus stat lain. Roda dan reward Vampire tidak berubah.

| Profil | Strength +1 | Strength +2 | Strength +3 |
| --- | --- | --- | --- |
| swarm | 1, 5, 10 | 50, 100, 500 | 1.000, 5.000, 10.000 |
| common | 1, 2, 5 | 10, 20, 50 | 100, 500, 1.000 |
| trained | 1, 2, 3 | 5, 10, 20 | 50, 100, 500 |
| elite | 1, 2, 3 | 5, 10, 20 | 30, 50, 100 |
| formidable | 1, 2, 3 | 5, 7, 10 | 15, 20, 50 |
| apex | 1, 2, 3 | 4, 5, 7 | 10, 15, 20 |
| legendary | 1, 2, 3 | 4, 5, 6 | 7, 8, 10 |
| divine | 1, 2, 3 | 4, 5, 6 | 7, 8, 9 |

Daftarkan modifier saat count commit, kemudian proyeksikan sesudah base
Strength yang immutable dengan batas stat yang dikonfigurasi. Key berasal
dari spin count aktual; engine mengonsumsinya sekali. Nol tetap mendapat hasil
spin dan reaksi. Caption atau fixed bonus bukan spin tambahan/funny-result tag.

## Fungsi untuk engine

[Modul Slayer](../framework/slayer-event.mjs) menggunakan Node.js 22 dan JSON
import attributes, tanpa dependency tambahan. Fungsi tidak memakai RNG dan
tidak memutasi character state.

- getSlayerTargetSelector(wheelId, { usedVictimFamilyIds }): projection roda identitas saja.
- planSlayerTarget({ invocationId, root }, options): satu spin target berikutnya, configuration gap, atau snapshot roda count.
- resolveSlayerVictimCount(frozenCountPlan, committedResult): count aktual dan satu effect Strength atau array kosong untuk nol.

Node target berbentuk { sourceId, familyId, results: [{ spinId, wheelId, outcomeId }],
children: [{ relation, node }] }. Gunakan source ID dari spin family referensi
yang sebenarnya, serta spin ID unik. Root awal null. Child relations adalah
base untuk Raksasa, host untuk Symbiote, origin untuk Skeleton/Zombie, dan dua
hybrid-component untuk Hybrid. Field ras/power/stat karakter tidak menjadi
node korban. Helper menolak power/equipment/boost selectors dan jalur subtype
yang tidak cocok.

Siluman memerlukan tepat satu hasil animal-type dari 12 pilihan, tanpa profil sampling atau spin jumlah. Dua belas hasil lama tidak valid untuk plan baru; journal lama tetap disimpan.

Pada phase target, engine memutar wheel dan commit hasil ke slot/ordinal yang
dikembalikan sebelum meminta plan berikutnya. Pada phase victim-count, simpan
plan/pool/peluangnya sebelum seeded spin. committedResult berisi invocationId
yang sama, spinId dan outcomeId. Resolver memakai snapshot tersimpan, sehingga
perubahan konfigurasi tidak mengubah reward run yang sudah commit. Engine
menyimpan effect ledger dan consumed key secara atomik, memulihkan journal
saat resume, serta melanjutkan Backstory tanpa spin ulang.

Policy count baru `slayer/1.1.0` menolak peluang di bawah 5% sebelum spin dan
saat resolve. Snapshot yang sudah commit pada `slayer/1.0.0` tetap memakai
peluang dan hasil tersimpannya; revisi tidak menulis ulang journal lama.

Roster/body fit Archetype masih diselesaikan terpisah. Event ini tidak
mengaktifkan seluruh label referensi atau mengulang gate Archetype yang sudah
selesai. Bonus Slayer dapat diterapkan tanpa mengetahui hasil Strength nanti.

Verifikasi dari root proyek:

```text
node --test framework/tests/slayer-event.test.mjs framework/tests/archetype-eligibility.test.mjs
```

[Desain JSON](../content/slayer-events-design.json) · [Roda Archetype](ARCHETYPE-WHEEL.md)


## Tiga ras baru dari video kedua

Slayer1.4 mengenali22 root ras, termasuk Slime/Centaur/Cosmic. Target memilih tipe/hewan/kelompok tanpa menjalankan hadiah ras. Ultraman berhenti sebelum warna; Elemental Slime memilih Element untuk identitas saja. Assignment memakai profil jumlah lama, authored sesuai delegasi estimasi pengguna. Semua delapan profil jumlah, minimum5% per outcome dan hadiah Strength lama tetap sama.

Revisi Cosmic: enam kelompok; Kryptonian/Asgardian dihapus untuk target baru. Saint/Lantern berhenti pada kelompok sebelum armor/cincin, seperti Dwarf sebelum equipment. Tetap35 selector identitas dan320 assignment subtype; tidak menjalankan reward ras.
