# Skala Stat dan Mastery 0–9

## Backstory approved and event timing — 10 Oktober 2026

All38 proposed Backstory recipes and qualitative odds intents are user-approved.
Read content/backstory-wheel-design.json backstory/0.4.0 and framework/backstory-event.mjs.
General Power extras register source-owned tickets now and spin at the Power
stage; Dumpster gives one guaranteed acquisition excluding None with a future
Tier1–2 preference. Android/Divine wheels and Test Subject extra Weakness run
immediately; fixed Intangibility grants immediately. Finish those children and
reactions before Size. Normal later Weakness/main Power stages remain. Numeric
stat/mastery modifiers register immediately but calculate final-only. No early
mastery/Enchant. Early powers survive main None; God shared9 remains no-RNG.
Five separately authored editable0.35 lore shifts favor current stats/masteries
under stat-odds/0.4.0 (96 event rules); not measured data or numeric user choice.
Other qualitative odds are approved intents awaiting future pool/tag bindings;
no caption-derived multiplier. Pure helper freezes recipes and emits queues/
unique source keys; persistent scheduler/adapters still future. Design ready,
production wheel remains disabled until its required adapters exist. Source38
equal base/labels/IDs and old saved histories preserved. Latest approval
supersedes one-at-a-time/pending37 notes below. Preserve recovery snapshot
reference/before-backstory-approval-timing-2026-10-10.json.


Keputusan terbaru — 10 Oktober 2026: **Jaminan maksimum langsung menjadi
nilai dasar, tanpa spin. God memakai satu dasar Power Mastery9 untuk seluruh
power saat ini maupun yang didapat nanti. Vessel God pada Compatibility60–100
mewarisi jaminan tersebut. Lich langsung Durability9.** Bonus/debuff tetap di
akhir dan boleh menghasilkan angka negatif/melebihi9. Nilai otomatis bukan
hasil spin: tidak memberi Lucky hit, retry Resilient atau kategori raw Pawn.
Aturan ini menggantikan scope Authority-only dan spin singleton Lich di
catatan sebelumnya. Plan lama tetap dibaca sesuai riwayatnya.


**Darwizzy diganti menjadi Noob = 0. Sembilan label lainnya memakai angka 1–9.**
Ini mapping proyek yang ditetapkan setelah pemeriksaan video. Catatan sumber
tetap mempertahankan nama Darwizzy dan tidak mengklaim video memakai angka ini.

| Angka | Strength | Speed | Durability | Fight | Weapon Mastery | Power Mastery |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Noob | Noob | Noob | Noob | Noob | Noob |
| 1 | Weak | Old man | Fragile | Rookie | Novice | Dormant |
| 2 | Mid | Mid | Mid | Amateur | Apprentice | Awakening |
| 3 | Peak Human | Peak Human | Peak Human | Skilled | Adept | Controlled |
| 4 | Superhuman | Superhuman | Superhuman | Champion | Expert | Master |
| 5 | Mighty | Supersonic | Nuclear | Meta-Martial | Master | Archmage |
| 6 | Herculean | Light Speed | Planetary | Planetary Fighter | Grand Master | Planetary |
| 7 | Cosmic | Cosmic | Cosmic | Cosmic Brawler | Cosmic | Cosmic |
| 8 | Universal | Universal | Universal | Universal Gladiator | Universal | Universal |
| 9 | Boundless | Omnipresent | Regenerative | Unbeatable | Transcendent | Omnipotent |

Intelligence juga memakai angka **0–9**, dengan **Noob = 0**. Nama untuk angka
1–9 belum terbaca dari video, sehingga tetap menunggu konfigurasi konten.

Mapping tetap memuat sepuluh hasil dengan bobot dasar1. Peluang actual memakai
profil kontekstual di bawah; Equalizer pada pool penuh menghasilkan10% per hasil.
Guard/jaminan tetap berlaku. Ukuran sektor video tidak menjadi peluang proyek.

Angka adalah skor gameplay. Strength 7 tidak otomatis menjadi satuan fisik;
Durability 9 tidak memberikan power Regeneration tambahan. Noob adalah hasil
spin bernilai nol, bukan None atau skip. Nama Noob sendiri tidak memberi tag lucu.

Seluruh bonus/debuff main stat dan bonus kedua mastery dicatat saat didapat
dan **baru dihitung di akhir**, setelah semua spin dan event wajib selesai. Rentang 0–9 membatasi hasil
roda awal. **Kelima main stat dan kedua mastery boleh negatif atau melebihi 9**, tanpa floor/cap angka final.
Contoh: raw 0 − 1 = −1, raw 9 + 2 = 11. Kartu menampilkan angka final persis;
label raw 0–9 tetap disimpan terpisah.

Mapping yang sama dipakai Lucky Number, Pawn dan Resilient. Weapon Mastery
Master bernilai **5**, sedangkan Power Mastery Master bernilai **4**.
Kinnara membatasi roda Weapon Mastery miliknya ke Master atau lebih tinggi;
Lich langsung mendapat dasar Durability **9**; debuff −1 tetap menghasilkan final8. God
memakai shared Power Mastery **9** untuk semua power, lalu menerima bonus/debuff di akhir. Power Tier **1–5** tetap
menilai kemampuan intrinsik dan terpisah dari skor mastery.

High Roller pada pool main stat penuh 0–9 memakai **0, 1, 8, 9**, masing-masing
25% setelah batas peluang diterapkan; modifier lore tidak bisa membedakan empat pilihan pada cap25%. Konflik dengan guard/jaminan perlu
konfigurasi; jangan menambahkan pilihan atau mengabaikan jaminan.

Mapping disimpan secara eksplisit per scale/outcome dan dibekukan bersama
pool setiap spin. Journal lama mempertahankan label, mapping dan hasilnya.

## Peluang dari lore, dalam rentang 5%–25%

Lima main stat, Weapon Mastery per senjata, dan satu Power Mastery bersama memakai
[engine peluang](../framework/stat-odds.mjs) dan [parameter yang bisa diedit](../content/stat-odds-design.json).
Tidak ada Size tambahan untuk bentuk transformasi.

Setiap ras punya tujuh angka tersembunyi. Angka ini menunjukkan kecenderungan hasil mentah,
bukan bonus yang langsung ditambahkan. Contoh default:

| Parameter | Human | God | AI |
| --- | ---: | ---: | ---: |
| Potensi fisik → Strength | 2,6 | 9 | 0,7 |
| Mobilitas → Speed | 2,8 | 8,1 | 3,8 |
| Ketahanan → Durability | 2,4 | 8,7 | 4 |
| Kognisi → Intelligence | 3,2 | 8,9 | 7,8 |
| Latihan bertarung → Fight | 2,4 | 6,7 | 1,9 |
| Latihan senjata → Weapon Mastery | 2,4 | 6,4 | 1,3 |
| Kontrol power → Power Mastery | 1,5 | 8,1 | 5,1 |

Subtype terdalam memilih profilnya sendiri. Human biasanya dekat Mid/Peak Human;
God Strength memakai tabel prior lama, lalu menghasilkan **Boundless20%,
Universal17,5%, Cosmic15%, Herculean10%**, dengan setiap hasil lainnya
minimal5% setelah batas baru. Contoh lama30/25/20 sudah digantikan. AI condong ke Intelligence, sementara appliance tetap
sangat lemah. God tidak otomatis mendapat Weapon/Fight maksimum; shared Power Mastery memakai jaminan fixed9.
Saat konteks berubah, peluang dapat ikut berubah.

Ada170 prior ras,28 profil archetype, dan91 aturan hasil event yang ditulis secara
eksplisit; seluruh324 jalur identitas saat ini terjangkau. Sebagian subtype sengaja
berbagi profil dasar, seperti pahlawan dengan latihan umum. Nilainya merupakan
asumsi gameplay dari lore, bukan frekuensi populasi yang diukur.

Untuk Hybrid/Mutant, pusat tiap stat = **80% potensi tertinggi +20% rata-rata
komponen**. Symbiote serta Skeleton/Zombie memakai tubuh inang/asal yang benar,
lalu menerima likelihood bentuk/takeover yang dideklarasikan. Archetype
mempengaruhi latihan/potensi secara berbeda: Mage terutama kontrol power/kognisi,
Assassin terutama mobilitas/Fight/latihan senjata. Bonus final dari event tetap
ledger terpisah, tidak dipakai lagi sebagai angka probabilitas.

Size memakai log2(ukuran aktual/ukuran acuan tubuh), dibatasi10 langkah ke kedua
arah. Koefisien default Strength+0,48; Speed−0,12; Durability+0,32; Fight−0,06;
Intelligence dan kedua mastery0. Shift Size maksimum+5/−1,25 pada parameter
peluang, tanpa bonus stat tetap. Ini aturan fantasi yang bisa disetel, bukan konversi
ukuran menjadi massa. Avatar AI, manifestasi spirit, dan swarm Nanobot tidak
mendapat massa dari ukuran tampilan. Raksasa membandingkan Size abnormal dengan
tubuh ras dasarnya; tidak memakai midpoint milestone raksasa sebagai acuan.

Prior berbeda per stat → likelihood konteks yang eksplisit → guard → distribusi
peluang. Prior Gaussian normal menyisihkan total1,5% ke seluruh sepuluh angka
agar lucky pull masih mungkin. Jangkar khusus God menggunakan tabel sendiri.
Hasil yang lebih tinggi tetap jarang bagi Human, tetapi tidak dihapus.

Setelah hard guard, setiap pilihan yang masih boleh keluar mendapat peluang
**minimal5% dan maksimal25%**. Engine mencari satu faktor bersama lambda:
`P(i) = 0.05 + min(lambda × weight(i), 0.20)`, sampai total100%.
Artinya, sisihkan minimum5% per pilihan, lalu bagikan sisa massa mengikuti lore.
Sektor yang mencapai25% tetap di sana; rasio tambahan di atas5% pada sektor
bebas tetap mengikuti bobot lore. Ini menjaga perbedaan antarsumbu lebih baik
daripada meratakan seluruh ekor pada nilai minimum yang sama. Solusi dicari di log space agar prior ekstrem tetap stabil. Memotong
semua sektor lalu menormalisasi sekali tidak cukup untuk menjaga kedua batas.
Pada pool penuh, sepuluh minimum5% menyediakan50% massa peluang; sisa massa
masih dibentuk oleh lore. Human maupun God tetap punya peluang minimal5% di seluruh hasil yang
masih eligible. Ini pilihan keseimbangan game, bukan frekuensi lore yang terukur.
Prior/likelihood, posterior sebelum batas, dan dua batas peluang disimpan.
Pilihan yang dilarang tetap tidak ikut roda dan tidak mendapat minimum5%.

Parameter yang bisa diubah: centers tiap subtype/stat, sigma tujuh stat,
luckyTailMass, raceMaximumShare, kekuatan likelihood archetype/event/Size,
koefisien Size, batas shift, profil latihan tiap jenis senjata, dan tabel God.
Sigma efektif minimal0,05 poin raw; log-space normalization menjaga hasil
lucky tetap positif bahkan pada profil yang sangat sempit.
minimumProbability default0,05 dan maximumProbability default0,25. Keduanya
bisa diperketat dalam rentang5%–25% bila jumlah opsi masih memadai. Power Tier tidak otomatis menjadi skor mastery.
Hasil event yang belum memiliki likelihood eksplisit tetap dicatat sebagai
konteks netral. Backstory kanonis bisa ditambahkan sebagai evidence setelah
profilnya disusun; engine tidak menebak angka dari narasi.

Rentang5%–25% berlaku **per actual spin acak**. Pengecualian yang sudah ditetapkan:
Lich langsung mendapat fixed Durability9 tanpa spin. Kinnara tetap
memakai pool5–9; Equalizer membuatnya20% per hasil. Pool acak normal kurang
dari4 hasil tidak mungkin memenuhi cap25%, sehingga membutuhkan konfigurasi.
Syarat umum: jumlah pilihan × minimum ≤100% ≤ jumlah pilihan × maksimum.
Tidak ada hasil tambahan atau guard yang diam-diam dibatalkan.
Plan baru memakai stat-odds/0.3.0 dengan model peluang2. Plan lama tetap memakai peluang dan
batas yang sudah dibekukan; tidak diubah saat replay.

Resilient memakai odds yang sama pada satu retry; distribusi hasil tertinggi
yang disimpan boleh berbeda dari odds satu spin. All In hanya spin Strength,
lalu menyalin raw. High Roller memakai0/1/8/9 sebelum hard intersection;
konflik yang menyisakan kurang dari4 memerlukan konfigurasi. Double/Nothing
tetap roda keputusan terpisah50:50 dan mengubah raw saja. Lucky Number mengamati
setiap actual attempt, bukan salinan atau bonus akhir. God/qualified Vessel God memakai fixed shared Power Mastery9 untuk semua power, tanpa spin.

### Pemakaian engine

Caller memasukkan raceFacts identitas owner yang sudah lengkap, archetypeIds
beserta archetypeFacts dengan source/spin ID aktual, sizePlan yang dibekukan
dan sizeResult yang tercatat, serta inventory weapon/power yang benar-benar owned.
Mangsa, pasukan, mentor, companion, mount, atau mecha eksternal tidak menjadi ras
owner. BonusLedger/narratorText bukan input angka peluang.

API: buildStatContext, planStatWheel, planStatSuite, selectStatOutcome,
resolveStatDraw dan projectFinalScore. planStatWheel dibentuk pada tahap live
terkait sebelum RNG; planStatSuite untuk inspeksi. Snapshot memuat model,
semua sumber/profil terpilih, parameter tujuh sumbu, Size/acuan, inventory,
guard, mapping raw dan odds final. Retry/replay membaca snapshot yang sama.

resolveStatDraw mengembalikan retry_required atau decision_required bila
subflow wajib belum selesai, lalu retained raw/base dan ID actual Lucky hits.
projectFinalScore hanya proyeksi satu angka dari base + ledger sumber unik.
Executor masih harus menyelesaikan queue Enchant, settlement Lucky/Pawn,
penyimpanan atomik, narasi dan video. Tidak ada raw spin palsu atau bonus awal.

[Preview offline](../preview/stat-odds.html) berisi17 contoh/200 pilihan Size.
Roda berputar anticlockwise; urutan0–9 melewati pointer dari lemah ke kuat.
Regenerasi dari engine: node framework/scripts/stat-odds-preview.mjs.
Label Intelligence1–9 memakai angka sementara sampai source label dikonfirmasi.

[Katalog terstruktur](../content/stat-scales-design.json) ·
[Audit video](../reference/stat-tiers-video2.json) ·
[Resilient](RESILIENT-EVENTS.md)

Weapon Mastery setelah bonus menentukan gate Enchant pada fase akhir.
Expert4 + bonus1 menjadi Master5 dan lolos ambang, selama weapon/slot
kompatibel. Semua spin/event Enchant selesai sebelum gambar/final card.
Lihat [Bonus akhir](BONUS-TIMING.md).
