# Size dan Event Raksasa

Keputusan terbaru: **Size bentuk transformasi tidak diperlukan**. Tetap satu
Size bentuk utama setelah Backstory. Stat/mastery kini memakai profil peluang
tersendiri dengan cap30%; Size mempengaruhi parameter fisik lewat likelihood
logaritmik terbatas. Avatar/manifestasi tidak memperoleh massa dari ukuran
tampilan. Lihat [engine peluang stat](STAT-SCALES.md).

Semua karakter mempunyai satu tahap **Size sesudah Backstory dan eventnya, sebelum Strength**.
Raksasa melewati Archetype dan memakai roda ukuran khusus yang jauh lebih besar.
Ukuran di atas acuan planet membuka satu Cosmic Power dari roda universal. Size biasa
memakai rentang tubuh yang dideklarasikan; parameter peluang normal lebar dapat disetel.

## Ras dasar Raksasa

Pengguna mengklarifikasi Raksasa sebagai versi raksasa dari ras lain. Event family membuka
satu spin ras dasar dari pool utama yang belum dipakai dan menjalankan semua event langsung
ras hasil itu. Wrapper Raksasa dan ras dasar tetap tercatat; keduanya masuk history sebelum
child dispatch. Simpan link giant/base dan kembali ke pemanggil yang benar.

Binding Size giant tetap dicatat sekali dari sumber Raksasa dan menunggu tahap global.
Archetype skip sesuai policy 1.0.0; tidak ada ticket kedua. Jika muncul
dalam cabang pertama Hybrid, selesai chain kembali untuk spin cabang kedua dahulu.
Symbiote mengikuti ras inang/composite yang benar-benar dipilih; bila ada Raksasa di tree,
Size global memakai variant giant. Sourced references untuk anatomy lain tetap diperlukan.
Lihat [Hybrid/attachments](HYBRID-EVENTS.md).

## Urutan karakter dan Raksasa

Race/base dan semua nested event selesai → **skip Archetype** → Backstory/event
→ satu Size Raksasa → Cosmic jika lebih besar dari Bumi → lima main stat.

Policy 1.0.0 yang disetujui pada 9 Oktober 2026 menggantikan aturan dua Archetype
sebelumnya. Run baru tidak mendaftarkan atau mengonsumsi ticket Archetype kedua.
Journal yang sudah committed memakai policy lamanya. Tidak menambah selector
Buto/Buto Ijo. Lihat [fungsi gate](ARCHETYPE-GATE-FUNCTION.md).

## Arti ukuran dan sumber acuan

Ukuran disimpan dalam meter dan mempunyai metric yang jelas: tinggi humanoid, panjang tubuh
memanjang, atau diameter bentuk bola. Bentang sayap tidak otomatis menjadi tinggi. Sebutan
planet/Matahari mengacu pada **diameter** sebagai pembanding dimensi linear tubuh.

Profil dipilih dari bentuk/referensi yang sudah terpilih, lalu fallback spesies yang
dideklarasikan. Jangan menganggap semua Elf, Oni, Shrek, naga, atau hero mempunyai satu
ukuran kanon lintas franchise. Untuk Hybrid/Siluman tentukan acuan dari bentuk anatomi hasil
komposisinya; Symbiote mengikuti host/composite yang dipilih dengan policy sumber yang eksplisit. Missing profile menjadi
celah konfigurasi, bukan rata-rata Manusia yang dipasang diam-diam.

Acuan awal yang telah dicatat:

| Profil | Acuan | Fakta ukuran sumber | Cara memilih nilai acuan |
| --- | --- | --- | --- |
| Manusia | 1,676 m | From barely 5 feet to well over 6 feet. | Midpoint of the nominal 5/6-foot anchors; source range is approximate, not hard bounds. [Sumber](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/races) |
| Elf | 1,676 m | From under 5 feet to over 6 feet. | Midpoint of nominal 5/6-foot anchors; generic Elf fallback is an editorial choice, not the canonical mean of every subtype. [Sumber](https://www.dndbeyond.com/species/3-elf) |
| Dwarf | 1,372 m | Between 4 and 5 feet. | Midpoint 4.5 feet; numeric center authored from the stated range. [Sumber](https://www.dndbeyond.com/species/13-dwarf) |
| Gnome | 1,067 m | Approximately three to four feet, using the 2024 reference. | Midpoint 3.5 feet; estimated center, not a published mean. [Sumber](https://www.dndbeyond.com/species/1751438-gnome) |
| Goblin | 0,914 m | Average 3 feet tall. | Direct conversion of the published lore mean; selected Pathfinder reference is the game default, not universal cross-franchise canon. [Sumber](https://2e.aonprd.com/Ancestries.aspx?ID=62) |
| Orc | 1,981 m | About 6 to 7 feet tall. | Midpoint 6.5 feet; applies to General/Warrior/Shaman as their Orc base identity, not automatically Oni/Shrek. [Sumber](https://www.dndbeyond.com/species/1751442-orc) |
| Troll | 2,743 m | Typical adult stands 9 feet tall. | Direct conversion of the stated typical height; a chosen versioned reference for this game. [Sumber](https://www.d20srd.org/srd/monsters/troll.htm) |

Angka acuan dari midpoint atau pembulatan merupakan estimasi desain. Sumber yang memberi
rentang tidak otomatis memberi rata-rata statistik. Versi sumber dan cara konversi ikut
disimpan; 1 foot = 0,3048 meter. Profil Elf generik adalah default editorial yang dapat
diganti oleh profil subtype/bentuk yang lebih spesifik. Oni dan Shrek belum otomatis memakai
acuan Orc. Ras/bentuk yang belum selesai dibahas akan mendapat profil sumbernya kemudian.

## Roda Size dari rentang tubuh

Size memakai **rentang ras/subras dan Archetype hasil karakter**, dengan angka bulat dalam
satu unit yang sama pada setiap roda. Contoh pengguna: **Tuyul 60–120 cm**, **Ultraman 50–70 m**.
Roda lama 0,5–2× acuan dan label desimal disimpan sebagai riwayat, tidak dipakai rencana baru.

Urutan: **Raksasa → profil tubuh eksplisit → prior paling sesuai tiap ras fisik
(kombinasi ras + Archetype/subtype/family) → mixture → petunjuk bersyarat → roda**. Symbiote mengikuti inang;
Skeleton/Zombie mengikuti asal tubuhnya. Hybrid/Mutant memakai mixture probabilistik dari
profil komponen yang kompatibel, atau profil tubuh campuran eksplisit yang terikat semua sumber. Profil sama kuat yang bertabrakan atau profil
yang belum tersedia perlu diisi; tidak memilih Manusia secara otomatis.

| Profil | Rentang roda | Pusat kurva | Dasar kalibrasi |
| --- | --- | --- | --- |
| Tuyul | 60–120 cm | 90 cm | Rentang pengguna; belum ada angka tinggi kanon yang diverifikasi |
| Ultraman | 50–70 m | 52,5 m | Rentang pengguna + sampel empat profil resmi |
| Manusia | 150–200 cm | 167,64 cm | Envelope game; midpoint acuan nominal D&D |
| Manusia + Goliath | 213–244 cm | 228,6 cm | Analogi tubuh Goliath D&D 7–8 kaki, dinyatakan sebagai pilihan desain |
| Elf humanoid | 140–200 cm | 167,64 cm | Envelope game; midpoint acuan nominal Elf D&D |
| Dwarf | 122–152 cm | 137,16 cm | Interval lore D&D 4–5 kaki |
| Gnome | 91–122 cm | 106,68 cm | Interval lore D&D 2024 3–4 kaki |
| Goblin | 75–120 cm | 91,44 cm | Rata-rata lore Pathfinder 3 kaki; envelope game |
| Orc General/Warrior/Shaman | 183–213 cm | 198,12 cm | Interval lore D&D 2024 6–7 kaki |
| Troll | 220–330 cm | 274,32 cm | Tinggi khas D&D 3.5 9 kaki; envelope game |

**Pusat kurva bukan rata-rata hasil roda yang dibatasi rentang.** Angka desimal di kolom
pusat hanya parameter internal; seluruh label sektor tetap angka bulat. Interval feet
menggunakan konversi 1 kaki = 30,48 cm dan pembulatan endpoint ke cm terdekat. Interval lore
yang perkiraan tidak diperlakukan sebagai batas biologis semua anggota ras.

Kalibrasi sumber awal diperluas menjadi **size/0.4.0, model3** setelah pengguna mengizinkan
asumsi ukuran untuk sisanya. [Manifest](../reference/size-calibration-research.json) mencatat
sumber dan asumsi semua195 profil. Default bentuk normal mencakup seluruh324 jalur identitas
akhir dari22 family;131 konteks power/armor/warna/mecha pilot juga diaudit. Oni/Shrek memiliki
profil sendiri, dan spirit tidak otomatis memakai ukuran Manusia. Profil bentuk transformasi,
anatomi gambar, serta fit/control equipment tetap tugas terpisah.

Ultraman memakai acuan resmi [Tiga 53 m](https://tsuburaya-prod.com/heroes/ultraman-tiga),
[Dyna 55 m](https://tsuburaya-prod.com/heroes/ultraman-dyna),
[Gaia 50 m](https://tsuburaya-prod.com/heroes/ultraman-gaia), dan
[Z 52 m](https://tsuburaya-prod.com/heroes/ultraman-z). Pusat 52,5 m adalah mean dari sampel
kurasi itu, bukan mean seluruh franchise. Warna Red/Blue/Mixed tidak memberi pengali tinggi.
Rentang 50–70 m tetap keputusan pengguna; tokoh atau bentuk lain bisa berada di luarnya.

Acuan [Goliath D&D 7–8 kaki](https://www.dndbeyond.com/species/1751439-goliath) dipakai
sebagai **analogi fisik yang eksplisit** untuk kombinasi Human + Archetype Goliath.
Archetype dari video tidak otomatis menjadi spesies D&D. Tidak menyalin trait, kekuatan,
pertumbuhan sementara, atau bonus dari sumber. Bonus Strength sendiri tidak menentukan tinggi.

Fungsi membuat **12 posisi awal**, mengurutkan kecil → besar, membulatkan lalu menggabungkan
angka kembar. Rentang sempit bisa menghasilkan kurang dari 12 sektor unik. Untuk Tuyul:
60, 65, 71, 76, 82, 87, 93, 98, 104, 109, 115, 120 cm.
Untuk Ultraman: 50, 52, 54, 55, 57, 59, 61, 63, 65, 66, 68, 70 m.

- Linear: `min + (max-min)*i/(n-1)` untuk rentang biasa.
- Eksponensial: `min*(max/min)^(i/(n-1))` untuk rentang luas, lalu dibulatkan.
- Auto: default desain memakai eksponensial jika max/min ≥10; ambangnya bisa diubah.
- Quantum opsional: pembulatan ke kelipatan 1, 5, 10, dan seterusnya; batas tetap dipertahankan.

**Jarak angka berbeda dari peluang.** Kurva normal lebar memakai pusat sumber yang
tersedia; profil tanpa parameter khusus memakai midpoint (linear) atau pusat geometrik
(eksponensial). Lebar memakai setengah span lore numerik, atau setengah span game jika sumber
hanya memberi tinggi khas/rata-rata. **Bentuk Gaussian dan lebar ini keputusan desain,
bukan simpangan baku populasi yang diberikan wiki.** Versi eksponensial memakai koordinat
log. Bobot sampel yang membulat ke ukuran sama digabung. Parameter tetap dapat disetel;
mode equal/Equalizer meratakan sektor unik yang eligible, dengan hard guard tetap berlaku.

## Peluang kontekstual yang bisa disetel

Versi0.4 membangun **roda baru dari konteks karakter saat itu**. Tiap ras fisik memberi
peluang awal ukuran. Untuk Hybrid/Mutant yang profil komponennya sudah tersedia dan memakai
metric yang sama, fungsi menggabungkan distribusinya sebagai **mixture**. Pengaruh tiap ras
bisa disetel, misalnya Human:Elf3:1. Ini menyatakan ketidakpastian bentuk mana yang lebih
mendominasi ukuran; bukan menganggap dua ukuran tubuh yang berbeda sebagai dua pengukuran
independen. Profil tubuh campuran eksplisit tetap menetapkan rentang bentuk yang sebenarnya.
Metric berbeda memakai proyeksi principal extent yang dinyatakan per profil; jika deklarasi tidak ada/tidak cocok, diperlukan konfigurasi tubuh/rentang.

Kemudian hasil event dan Archetype yang relevan memperbarui peluang melalui model:

`posterior(size) ∝ prior(size)^priorStrength × Π likelihood(contextGroup | size)^strength`

Strength1 memakai update Bayesian biasa dalam model yang dideklarasikan. Strength di bawah1
melemahkan petunjuk; di atas1 memperkuatnya;0 menonaktifkannya. Likelihood bersumber dari
profil lore dan aturan desain yang bisa disetel. Kalibrasi sumber memberi pusat/rentang,
**belum merupakan pelatihan atau validasi empiris distribusi probabilitas**. Akurasi lore
bergantung pada versi/bentuk sumber; hasil spin buatan sendiri tidak menjadi bukti tambahan.

| Pengaturan | Yang berubah |
| --- | --- |
| `mixtureWeights` | Pengaruh ras/profil pada peluang awal tubuh campuran |
| `priorStrength` | Seberapa kuat distribusi awal dipertahankan |
| `evidenceStrength` | Kekuatan global semua petunjuk bersyarat |
| `rules[].strength` | Kekuatan satu aturan |
| `likelihood` | Arah kecenderungan besar/kecil, pusat/lebar kurva, interval atau tabel peluang |
| `when` dan `group` | Kondisi hasil spin dan hubungan ketergantungan antaraturan |
| `interaction` | Koreksi gabungan dua atau lebih hasil, bukan petunjuk independen tambahan |
| `displayOutcomeCount` | Maksimal sektor yang ditampilkan, default12 |

Model3 mempertahankan tujuh ID aturan hasil kalibrasi model2 untuk audit. Lima aturan Symbiote sekarang
**netral (strength0, slope0)**: deskripsi resmi [Marvel HQ](https://www.youtube.com/watch?v=qmG6VB89ZJ8)
mendukung shapeshifting, tetapi belum menetapkan hubungan numerik takeover% dengan tinggi.
Persentase takeover tetap konteks aktual dan menjalankan bonus event yang sudah ditentukan;
Size mengikuti prior host sampai ada profil bentuk/relasi ukuran yang eksplisit.

Human+Elf memakai acuan humanoid [Half-Elf D&D](https://www.dndbeyond.com/species/20-half-elf):
pusat estimasi 1,6764 m, soft width 0,1524 m. Human+Elf+Goliath menggantikan aturan pasangan
umum dengan analogi fisik Goliath: pusat 2,286 m, soft width 0,1524 m. Keduanya tetap
memakai strength0,5 sebagai keputusan desain yang dapat diubah. Sumber tidak mengukur
probabilitas crossover ini; default pengaruh campuran ras tetap setara. Tidak ada hadiah
stat atau event ras baru dari kalibrasi Size.

**Ketergantungan harus jelas.** Ras/subras yang sudah membentuk prior tidak dihitung lagi
sebagai bukti independen yang sama. Dalam satu `group`, hanya aturan kondisi paling spesifik
yang berlaku; contoh Takeover100 menggantikan aturan Symbiote umum. `interaction:true`
mengizinkan koreksi gabungan yang sengaja dideklarasikan meskipun fakta komponennya ada dalam
prior. Aturan sama spesifik yang bertabrakan menjadi kesalahan konfigurasi.

Fungsi menghitung posterior pada seluruh kandidat angka bulat dari komponen ras. Jika
kandidat melebihi12, pilihan perwakilan dipilih lewat quantile posterior, lalu peluang
kandidat digabung ke sektor terdekat. **Ini pendekatan tampilan**, dengan jumlah peluang tetap
100%; distribusi lengkap dan mapping bin tetap disimpan. Setiap label merupakan ukuran yang
benar-benar dapat dipilih dari sektor tersebut. Single-profile12 sektor tetap sama.
Equalizer meratakan peluang pada sektor akhir setelah batas/guard diterapkan.

Raksasa selalu memakai delapan milestone abnormal. Peluang awalnya tetap1/8;
aturan awal hanya berlaku untuk Size normal. Penyetelan peluang Raksasa membutuhkan faktor
atau aturan yang secara eksplisit memakai scope `giant`. Size dan ambang Cosmic tetap sama.

## Coverage ukuran bentuk normal yang lengkap

Pengguna mengizinkan pencarian atau asumsi untuk profil yang tersisa. Katalog sekarang
mempunyai **195 profil**: sepuluh profil sebelumnya ditambah185 default yang spesifik
atau dibagi secara sengaja. Semua angka tanpa sumber dimensi diberi label **asumsi desain**;
bukan ukuran kanon lintas cerita. Daftar dapat disetel tanpa mengubah algoritme.
[Audit jalur](../reference/size-profile-coverage.json) mencatat324 kasus identitas akhir
serta131 konteks owner yang tidak mengubah bentuk, termasuk35 armor Saint,9 cincin Lantern,
3 warna Ultraman,64 Cheat Skill dan20 mecha pilot.

- Skeleton/Zombie memakai bentuk asal yang benar-benar di-spin; Symbiote memakai host.
  Hybrid memakai dua komponen, Mutant mempertahankan semua komponen committed, Raksasa
  memakai delapan milestone lama. Wrapper tidak mendapat tubuh Manusia tersembunyi.
- Siluman memakai tinggi humanoid dengan ciri satu hewan. Centaur memakai tinggi gabungan
  dari lantai ke kepala, termasuk torso; tinggi hewan bawah saja tidak dipakai.
- Naga/Dragon dan Putri Duyung memakai panjang tubuh. Slime/Banaspati memakai diameter.
  Tinggi beast berkaki empat mengacu ke badan/bahu; sayap tidak menjadi tinggi.
- AI memakai tinggi avatar visual; Nanobot memakai envelope seluruh swarm. Ghost dan
  beberapa entitas abstrak memakai manifestasi. Nilai itu tidak membuat massa fisik,
  damage atau ukuran alam semesta. Chaos/Tiamat/Ymir mengacu ke avatar game yang dipilih,
  bukan seluruh konsep/semesta atau versi franchise lain.
- Transformer memakai robot mode normal berdasarkan siluet kendaraan terpilih. Household
  tetap seukuran peralatan sehari-hari dan sangat lemah; tanpa kaki baru atau power upgrade.
- Anime tetap tubuh humanoid normal. Judul Cheat Skill memberi power adaptasi, bukan
  perubahan ras otomatis. Pilot/Rider/Colossal Warmech memakai ukuran pemilik; unit
  tunggangan/senjata mempunyai ukuran terpisah. Kelas armor, warna cincin, jumlah korban,
  jumlah pengikut, tier power dan bonus stat tidak otomatis mengubah tinggi tubuh.
- Pahlawan Legendaris memakai profil humanoid bersama125–220cm kecuali sepuluh override
  fisik yang tercantum. Ini asumsi tubuh reinkarnasi, bukan tinggi sejarah/Fate yang diukur.

Jika Hybrid/Mutant mencampur tinggi, panjang atau diameter, masing-masing profil sekarang
mendeklarasikan `compositionAxis`: metric sumber → `characteristic-dimension`, skala1.
**Ini konvensi ukuran utama untuk tubuh fantasi**, bukan persamaan fisik tinggi dengan
panjang atau volume. Model3 hanya mengizinkan proyeksi jika setiap deklarasi cocok dengan
metric profil. Trace menyimpan metric asal dan sumbernya; parameter body profile eksplisit
terikat semua source tetap menang. Deklarasi hilang/tidak cocok tetap menghasilkan
`needs_configuration`. Profil/artwork tubuh baru tidak boleh mengubah plan yang sudah frozen.

Tiga acuan tambahan yang dipakai secara terbatas: deskripsi [Pixie berlisensi](https://roll20.net/compendium/dnd5e/Monsters:Pixie?expansion=34653&from_listings=true)
memberi skala sekitar satu kaki; Element Pixie12–30cm tetap adaptasi desain.
[Bandai](https://www.bandai.co.jp/releases/images/3/55964.pdf) menyebut RX-78-2 sebagai unit18m,
berbeda dari tinggi model375mm; roda15–22m adalah variasi game. Deskripsi karakter berlisensi
[Gipsy Danger](https://www.sideshow.com/collectibles/pacific-rim-gipsy-danger-prime-1-studio-911710)
memberi260ft (~79,25m); roda60–100m adalah variasi game, bukan ukuran collectible68cm.
Profil mecha lain dan semua interval alat rumah tangga di bawah adalah asumsi yang dinyatakan.

Tabel berikut menunjukkan seluruh prior, termasuk fallback yang sengaja lebih umum.
Prior kombinasi Human+Goliath dan subtype/form yang lebih spesifik menang sebelum fallback.
Semua label roda berupa angka bulat; parameter center/sigma internal dapat memakai desimal.

| Family | Profil/bentuk | Rentang | Metric | Dasar |
| --- | --- | --- | --- | --- |
| Lelembut | Tuyul | 60–120 cm | height | Pengguna |
| Cosmic Warrior | Ultraman | 50–70 m | height | Pengguna + acuan resmi |
| Manusia | Manusia | 150–200 cm | height | Acuan + desain |
| Manusia | Manusia + Goliath | 213–244 cm | height | Acuan + desain |
| Elf | Elf humanoid | 140–200 cm | height | Acuan + desain |
| Kurcaci | Dwarf | 122–152 cm | height | Acuan + desain |
| Kurcaci | Gnome | 91–122 cm | height | Acuan + desain |
| Goblin & Orc | Goblin | 75–120 cm | height | Acuan + desain |
| Goblin & Orc | Orc General/Warrior/Shaman | 183–213 cm | height | Acuan + desain |
| Goblin & Orc | Troll | 220–330 cm | height | Acuan + desain |
| Elf | High Elf | 150–210 cm | height | Asumsi desain |
| Elf | Dark Elf | 140–190 cm | height | Asumsi desain |
| Elf | Forest Elf | 140–195 cm | height | Asumsi desain |
| Elf | Sea Elf | 150–220 cm | height | Asumsi desain |
| Elf | Blood Elf | 150–210 cm | height | Asumsi desain |
| Elf | Fey Elf | 120–185 cm | height | Asumsi desain |
| Elf | Shadow Elf | 140–200 cm | height | Asumsi desain |
| Elf | Astral Elf | 150–210 cm | height | Asumsi desain |
| Elf | Putri Duyung | 180–300 cm | length | Asumsi desain |
| Elf | Atlantean Warrior | 170–230 cm | height | Asumsi desain |
| Goblin & Orc | Oni | 200–350 cm | height | Asumsi desain |
| Goblin & Orc | Shrek | 180–240 cm | height | Asumsi desain |
| Peri | Fairy Parents | 60–120 cm | height | Asumsi desain |
| Peri | Element Pixie | 12–30 cm | height | Acuan + desain |
| Peri | Healer Fairy | 20–60 cm | height | Asumsi desain |
| Peri | Fairy King | 120–200 cm | height | Asumsi desain |
| Siluman | Harimau | 160–220 cm | height | Asumsi desain |
| Siluman | Serigala | 150–210 cm | height | Asumsi desain |
| Siluman | Babi | 140–200 cm | height | Asumsi desain |
| Siluman | Ayam | 120–180 cm | height | Asumsi desain |
| Siluman | Ular | 140–200 cm | height | Asumsi desain |
| Siluman | Buaya | 160–220 cm | height | Asumsi desain |
| Siluman | Kera | 130–190 cm | height | Asumsi desain |
| Siluman | Kerbau | 170–230 cm | height | Asumsi desain |
| Siluman | Rubah | 140–190 cm | height | Asumsi desain |
| Siluman | Kucing | 130–185 cm | height | Asumsi desain |
| Siluman | Kelelawar | 120–180 cm | height | Asumsi desain |
| Siluman | Elang | 150–210 cm | height | Asumsi desain |
| Lelembut | Pocong | 140–210 cm | height | Asumsi desain |
| Lelembut | Kuntilanak | 140–200 cm | height | Asumsi desain |
| Lelembut | Genderuwo | 180–350 cm | height | Asumsi desain |
| Lelembut | Wewe Gombel | 160–260 cm | height | Asumsi desain |
| Lelembut | Sundel Bolong | 140–200 cm | height | Asumsi desain |
| Lelembut | Kuyang | 60–120 cm | length | Asumsi desain |
| Lelembut | Leak | 120–250 cm | height | Asumsi desain |
| Lelembut | Palasik | 30–80 cm | length | Asumsi desain |
| Lelembut | Banaspati | 30–150 cm | diameter | Asumsi desain |
| Lelembut | Jenglot | 10–25 cm | height | Asumsi desain |
| Lelembut | Suster Ngesot | 140–190 cm | length | Asumsi desain |
| Lelembut | Vampire | 140–210 cm | height | Asumsi desain |
| Lelembut | Lich | 140–220 cm | height | Asumsi desain |
| Lelembut | Ghost | 100–230 cm | height | Asumsi desain |
| Lelembut | Mummy | 140–210 cm | height | Asumsi desain |
| Mythical Beast | Garuda | 200–600 cm | height | Asumsi desain |
| Mythical Beast | Barong (Bali) | 150–300 cm | height | Asumsi desain |
| Mythical Beast | Reog (Jawa) | 200–400 cm | height | Asumsi desain |
| Mythical Beast | Naga | 10–100 m | length | Asumsi desain |
| Mythical Beast | Lembuswana | 200–500 cm | height | Asumsi desain |
| Mythical Beast | Kuda Sembrani | 140–210 cm | height | Asumsi desain |
| Mythical Beast | Warak Ngendog | 120–220 cm | height | Asumsi desain |
| Mythical Beast | Makara | 300–1000 cm | length | Asumsi desain |
| Mythical Beast | Kinnara | 140–210 cm | height | Asumsi desain |
| Mythical Beast | Singa Ambara Raja | 150–300 cm | height | Asumsi desain |
| Mythical Beast | Phoenix | 80–250 cm | height | Asumsi desain |
| Mythical Beast | Griffin | 150–300 cm | height | Asumsi desain |
| Mythical Beast | Unicorn | 130–200 cm | height | Asumsi desain |
| Mythical Beast | Pegasus | 130–210 cm | height | Asumsi desain |
| Mythical Beast | Hydra | 5–25 m | length | Asumsi desain |
| Mythical Beast | Cerberus | 150–400 cm | height | Asumsi desain |
| Mythical Beast | Chimera | 150–350 cm | height | Asumsi desain |
| Mythical Beast | Western Dragon | 10–35 m | length | Asumsi desain |
| Mythical Beast | Wyvern | 6–20 m | length | Asumsi desain |
| Mythical Beast | Drake | 3–12 m | length | Asumsi desain |
| Mythical Beast | Wyrm | 15–120 m | length | Asumsi desain |
| Mythical Beast | Lindwyrm | 8–30 m | length | Asumsi desain |
| Mythical Beast | Amphiptere | 4–16 m | length | Asumsi desain |
| Mythical Beast | Eastern Dragon | 10–80 m | length | Asumsi desain |
| Mythical Beast | Sea Serpent | 20–200 m | length | Asumsi desain |
| Golem | Golem Pasir | 150–350 cm | height | Asumsi desain |
| Golem | Golem Batu | 200–450 cm | height | Asumsi desain |
| Golem | Golem Magma | 200–400 cm | height | Asumsi desain |
| Golem | Golem Kristal | 180–350 cm | height | Asumsi desain |
| Golem | Golem Berlian | 180–300 cm | height | Asumsi desain |
| Golem | Golem Elemen | 150–350 cm | height | Asumsi desain |
| Golem | Golem Sampah | 80–250 cm | height | Asumsi desain |
| Elemental | Elemental | 50–400 cm | height | Asumsi desain |
| Heavenly Principle | God | 150–400 cm | height | Asumsi desain |
| Heavenly Principle | Demigod | 150–250 cm | height | Asumsi desain |
| Heavenly Principle | Angel | 160–280 cm | height | Asumsi desain |
| Heavenly Principle | Utusan Tuhan | 140–210 cm | height | Asumsi desain |
| Heavenly Principle | Pemuka Agama | 140–210 cm | height | Asumsi desain |
| Heavenly Principle | Orang Saleh | 140–210 cm | height | Asumsi desain |
| Abyssal Axiom | Raja Iblis Agung | 200–600 cm | height | Asumsi desain |
| Abyssal Axiom | Iblis | 160–350 cm | height | Asumsi desain |
| Abyssal Axiom | Fallen Angel | 160–280 cm | height | Asumsi desain |
| Abyssal Axiom | Setan | 80–300 cm | height | Asumsi desain |
| Abyssal Axiom | Pendosa | 140–210 cm | height | Asumsi desain |
| Abyssal Axiom | Succubus | 140–200 cm | height | Asumsi desain |
| Abyssal Axiom | Ifrit | 200–500 cm | height | Asumsi desain |
| Abyssal Axiom | Asura | 200–450 cm | height | Asumsi desain |
| Abyssal Axiom | Imp | 40–100 cm | height | Asumsi desain |
| Anime | Anime (tubuh normal) | 140–210 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Pahlawan Legendaris (humanoid) | 125–220 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Bima | 220–400 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Gatotkaca | 180–300 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Hanoman | 140–220 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Antareja | 180–280 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Antasena | 180–280 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Wisanggeni | 160–240 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Semar | 120–180 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Heracles / Hercules | 200–320 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Beowulf | 180–250 cm | height | Asumsi desain |
| Reinkarnasi Pahlawan Legendaris | Enkidu | 140–220 cm | height | Asumsi desain |
| Machine | Android | 140–220 cm | height | Asumsi desain |
| Machine | Cyborg | 140–220 cm | height | Asumsi desain |
| Machine | Nanobot | 10–200 cm | height | Asumsi desain |
| Machine | AI | 120–240 cm | height | Asumsi desain |
| Machine | Mechagodzilla | 90–150 m | height | Asumsi desain |
| Machine | Mecha Probe | 5–15 m | height | Asumsi desain |
| Machine | RX-78-2 Gundam | 15–22 m | height | Acuan + desain |
| Machine | Gipsy Danger | 60–100 m | height | Acuan + desain |
| Machine | Dino Megazord | 35–60 m | height | Asumsi desain |
| Machine | Voltron | 40–80 m | height | Asumsi desain |
| Machine | Mazinger Z | 15–25 m | height | Asumsi desain |
| Machine | Gurren Lagann | 10–20 m | height | Asumsi desain |
| Machine | Mecha Odong-Odong | 180–350 cm | height | Asumsi desain |
| Machine | Mecha Gerobak Bakso | 150–280 cm | height | Asumsi desain |
| Machine | Mecha Galon | 50–120 cm | height | Asumsi desain |
| Machine | Mecha Kardus | 120–220 cm | height | Asumsi desain |
| Machine | Jet Tempur | 500–1800 cm | height | Asumsi desain |
| Machine | Tank | 350–800 cm | height | Asumsi desain |
| Machine | Mobil Sport | 250–550 cm | height | Asumsi desain |
| Machine | Truk Trailer | 450–1000 cm | height | Asumsi desain |
| Machine | Motor Balap | 180–350 cm | height | Asumsi desain |
| Machine | Helikopter | 400–1000 cm | height | Asumsi desain |
| Machine | Kereta Cepat | 600–1800 cm | height | Asumsi desain |
| Machine | Kapal Selam | 700–2500 cm | height | Asumsi desain |
| Machine | Angkot | 250–500 cm | height | Asumsi desain |
| Machine | Bajaj | 180–350 cm | height | Asumsi desain |
| Machine | Odong-Odong | 180–350 cm | height | Asumsi desain |
| Machine | Gerobak Bakso | 150–280 cm | height | Asumsi desain |
| Machine | Rice Cooker | 20–40 cm | height | Asumsi desain |
| Machine | Microwave | 20–45 cm | height | Asumsi desain |
| Machine | Kulkas | 80–200 cm | height | Asumsi desain |
| Machine | Mesin Cuci | 60–110 cm | height | Asumsi desain |
| Machine | Kipas Angin | 30–150 cm | height | Asumsi desain |
| Machine | AC | 20–60 cm | height | Asumsi desain |
| Machine | Vacuum Cleaner | 25–110 cm | height | Asumsi desain |
| Machine | Setrika | 10–20 cm | height | Asumsi desain |
| Machine | Blender | 25–55 cm | height | Asumsi desain |
| Machine | Air Fryer | 25–50 cm | height | Asumsi desain |
| Machine | Toaster | 15–30 cm | height | Asumsi desain |
| Machine | Ketel Listrik | 15–35 cm | height | Asumsi desain |
| Machine | Dispenser | 40–130 cm | height | Asumsi desain |
| Machine | Hair Dryer | 15–35 cm | height | Asumsi desain |
| Machine | Mixer | 15–50 cm | height | Asumsi desain |
| Machine | Oven Listrik | 25–80 cm | height | Asumsi desain |
| Machine | Kompor Induksi | 5–15 cm | height | Asumsi desain |
| Machine | Mesin Kopi | 20–60 cm | height | Asumsi desain |
| Machine | TV | 20–120 cm | height | Asumsi desain |
| Machine | Robot Vacuum | 5–15 cm | height | Asumsi desain |
| Primordial | Atum | 180–450 cm | height | Asumsi desain |
| Primordial | Khepri | 30–200 cm | length | Asumsi desain |
| Primordial | Amun | 180–450 cm | height | Asumsi desain |
| Primordial | Neith | 160–350 cm | height | Asumsi desain |
| Primordial | Ptah | 160–350 cm | height | Asumsi desain |
| Primordial | Chaos / Khaos | 1–1000 m | characteristic-dimension | Asumsi desain |
| Primordial | Gaia | 2–30 m | height | Asumsi desain |
| Primordial | Namma / Nammu | 3–50 m | characteristic-dimension | Asumsi desain |
| Primordial | Apsu / Abzu | 5–100 m | characteristic-dimension | Asumsi desain |
| Primordial | Tiamat | 10–150 m | length | Asumsi desain |
| Primordial | Ymir | 20–2000 m | height | Asumsi desain |
| Slime | Slime Biasa | 20–100 cm | diameter | Asumsi desain |
| Slime | Acid Slime | 30–120 cm | diameter | Asumsi desain |
| Slime | Poison Slime | 30–120 cm | diameter | Asumsi desain |
| Slime | Healing Slime | 20–100 cm | diameter | Asumsi desain |
| Slime | Metal Slime | 30–180 cm | diameter | Asumsi desain |
| Slime | Elemental Slime | 30–200 cm | diameter | Asumsi desain |
| Centaur | Kuda | 180–270 cm | height | Asumsi desain |
| Centaur | Jaguar | 150–230 cm | height | Asumsi desain |
| Centaur | Ayam | 110–180 cm | height | Asumsi desain |
| Centaur | Capybara | 120–190 cm | height | Asumsi desain |
| Centaur | Serigala | 140–220 cm | height | Asumsi desain |
| Centaur | Harimau | 160–250 cm | height | Asumsi desain |
| Centaur | Beruang | 170–280 cm | height | Asumsi desain |
| Centaur | Banteng | 180–300 cm | height | Asumsi desain |
| Centaur | Rusa | 160–250 cm | height | Asumsi desain |
| Centaur | Kelinci | 100–170 cm | height | Asumsi desain |
| Centaur | Gajah | 250–450 cm | height | Asumsi desain |
| Centaur | Kambing | 130–210 cm | height | Asumsi desain |
| Cosmic Warrior | Alien X | 180–250 cm | height | Asumsi desain |
| Cosmic Warrior | Saiyan | 140–210 cm | height | Asumsi desain |
| Cosmic Warrior | Lantern Corps | 140–230 cm | height | Asumsi desain |
| Cosmic Warrior | Herald of Galactus / Silver Surfer | 170–230 cm | height | Asumsi desain |
| Cosmic Warrior | Saint Seiya | 140–210 cm | height | Asumsi desain |

## Fungsi untuk engine

Implementasi: [size-wheel.mjs](../framework/size-wheel.mjs) dan
[conditional-size-odds.mjs](../framework/conditional-size-odds.mjs).
`buildSizeWheel` membuat prior satu profil; `planSizeStage` menggabungkan profil/konteks dan
membangun posterior; `selectSizeOutcome` memakai sampel RNG eksternal;
`resolveSizeResult` memproses hasil yang tercatat. Model tersimpan di
[Size design](../content/size-wheel-design.json), bagian `probabilisticModel`.

Contoh penyesuaian tanpa mengubah algoritme:

```js
const customModel = structuredClone(sizeDesign.probabilisticModel);
customModel.mixtureWeights = { human: 3, elf: 1 };
customModel.evidenceStrength = 0.7;
const plan = planSizeStage(committedCharacter, { probabilityModel: customModel });
```

Planner memakai `raceFacts` pemilik yang committed dan tervalidasi, `archetypeIds`, serta
ID run/karakter/invocation. Token event mencantumkan family/wheel/outcome dan spin sumber;
itu bukan target Slayer, troop, mentor, companion atau mech eksternal. Hanya aturan yang
mencocokkan hasil aktual dapat bekerja. Adapter Backstory/final stat dan generator tubuh
masih pekerjaan berikutnya; tidak menginfer parameter dari prosa narator.

Sebelum satu draw, simpan model/versi/parameter, seluruh prior komponen, sumber bukti,
aturan yang dipakai/dilewati, posterior lengkap, mapping sektor dan peluang akhir.
Mengubah model kemudian hanya mempengaruhi plan baru. Replay/render tetap memakai plan lama;
`probabilityModel:null` tersedia untuk perencanaan legacy eksplisit.

Resolver menghasilkan satu efek Size dan permintaan Cosmic yang memenuhi syarat.
Engine harus mengonsumsi kunci ledger secara atomik; database, generator tubuh dan renderer
video belum disediakan oleh helper murni ini. Tak ada RNG tersembunyi atau reward ras yang
dijalankan kembali saat peluang dihitung.

## Roda Size Raksasa pada skala logaritmik

Raksasa mengganti varian Size biasa pada tahap yang sama, sehingga tetap satu main Size spin.
Delapan milestone mengikuti daftar pengguna; jarak logaritmiknya tidak dipaksa sama.
Peluang awal mengikuti default pengguna: **setiap milestone berbobot1 dan prior1/8 =12,5%**.
Peluang bisa disetel sebelum draw melalui faktor/aturan yang eksplisit untuk giant; model awal tidak membiasakannya.
Skala besar ukurannya tidak menentukan kelangkaan. Usulan log-Gaussian sebelumnya sudah
diganti; Size biasa tetap memakai distribusi normal yang diminta.

| Hasil | Dimensi linear | Peluang | Cosmic dari hasil ini? |
| --- | --- | --- | --- |
| 10 m | 10 m | 12,5% | Tidak |
| 50 m | 50 m | 12,5% | Tidak |
| 100 m | 100 m | 12,5% | Tidak |
| 1 km | 1.000 m | 12,5% | Tidak |
| 10 km | 10.000 m | 12,5% | Tidak |
| 100 km | 100.000 m | 12,5% | Tidak |
| Planet Size (Bumi) | 12.756.000 m | 12,5% | Tidak |
| Sun Size (Matahari) | 1.400.000.000 m | 12,5% | Ya |

Planet memakai diameter ekuator Bumi **12.756 km** menurut [NASA Earth Facts](https://science.nasa.gov/earth/facts/).
Matahari memakai diameter kira-kira **1,4 juta km** menurut [NASA Sun Facts](https://science.nasa.gov/sun/facts/).
Ini pemilihan acuan game dari dimensi astronomi, bukan aturan bahwa ras Raksasa dalam folklore
pasti mempunyai ukuran tersebut.

Bobot tepat: `w_i = 1`, lalu `p_i = 1/8`. Roda animasi memakai delapan sektor sama besar.
Penyetelan model terbaru berlaku sebelum
draw; hasil dan peluang spin yang sudah committed tetap disimpan.

## Ambang ukuran untuk Cosmic Power

Syarat universal: **sizeMeters > 12.756.000**, bukan ≥. Tepat Planet Size belum membuka Cosmic;
Sun Size membukanya. Pada daftar delapan hasil saat ini, hanya Sun Size yang memenuhi syarat.
Aturan juga dapat dipakai karakter lain jika ada efek ukuran yang disepakati kemudian.

Commit Size dan konteksnya → reaksi Size → cek ambang → jika lolos, spin satu roda
**Cosmic Power** → grant power dan reaksi → lanjut Strength. Cosmic reward ukuran dikonsumsi
sekali per karakter; retry dan crossing ambang berulang tidak menggandakan reward. Pemanggilan
Cosmic dari event lain yang memang diotorisasi mempunyai kunci eventnya sendiri.

Cosmic Power langsung masuk daftar owned power. Mastery menunggu tahap Power bila didapat
sebelum tahap itu; bila grant terlambat, resolve subflow mastery lalu kembali ke pemanggil.
None pada main Power tidak menghapus grant Cosmic. Power Mastery tidak memberi enchant.

Ukuran, stat, dan kemampuan tetap fakta terpisah. Ukuran Matahari tidak otomatis memberi
vacuum survival, immortal, kemenangan pasti, mastery tinggi, atau Apex Force. Size dapat
mempengaruhi peluang stat dan kompatibilitas senjata/weakness melalui profil yang dideklarasikan.
Pengaruh stat sudah dideklarasikan di stat-odds/0.1.0; equipment/weakness masih perlu profilnya sendiri.

## Konteks tiap tahap

| Tahap yang baru selesai | Fakta yang boleh dipakai narator |
| --- | --- |
| Ras Raksasa | Ras Raksasa, Archetype akan dilewati, varian Size nanti; ras dasar dan ukuran tepat masih menunggu spin |
| Gate Archetype | Skip sudah dicatat; tidak ada hasil role atau grant Archetype; ukuran belum diketahui |
| Size biasa | Profil rentang, angka/unit terpilih, metric, versi dan ukuran meter aktual |
| Planet Size | Ukuran setara Bumi; ambang Cosmic belum terpenuhi |
| Sun Size | Ukuran setara Matahari; Cosmic spin terbuka, hasil power masih belum diketahui |
| Cosmic Power | Satu power terpilih, scope katalog dan mastery pending |

Setiap spin punya narasi, meme, dan caption sendiri. Narator tidak menciptakan ukuran,
bonus, atau power tambahan. Re-render tidak mengulang mekanik.

Data: [Size](../content/size-wheel-design.json), [event Raksasa](../content/raksasa-events-design.json),
dan [roda power universal](UNIVERSAL-POWER-WHEELS.md). Coverage rentang tubuh, tuning peluang, aturan kombinasi ras + Archetype,
odds effects dan compatibility masih pekerjaan balance.
