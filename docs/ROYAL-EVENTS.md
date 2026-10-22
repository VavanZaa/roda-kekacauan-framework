# Event Royal

Royal berbasis enam bidak catur. Semua pilihan memakai bobot dasar sama:
**1/6 atau sekitar 16,67%**. Setelah hasil Royal, spin satu Bidak Royal,
jalankan hanya paket bidak terpilih, lalu kembali ke Backstory.

| Bidak | Efek |
| --- | --- |
| King | Fixed power **Authority — Tier 5**, Perintah Mutlak / Dominasi Kehendak |
| Queen | **+1** pada Strength, Speed, Durability, Intelligence dan Fight |
| Bishop | **Satu spin Angelic Power universal**, 20 pilihan |
| Knight | **Speed +2** |
| Rook | **Durability +2** |
| Pawn | Aktifkan kondisi **Beast of Possibility**, belum mendapat bonus stat/power |

King tidak membuat spin tambahan; Authority langsung menjadi owned power.
Tier 5 ditentukan pengguna. Cakupannya perintah mutlak/dominasi kehendak,
berbeda dari Concept Authority milik God. Gunakan mastery biasa bersama,
bukan God maksimum; target/range/biaya/durasi/interaksi resistance masih
konfigurasi. Tidak menjalankan Concept, God, follower atau Divine event.

Bishop memakai **Angelic Power** yang sama dengan Priest dan Angel sesuai aturan terbaru. Spin satu kali saat event Royal, grant hanya power terpilih, reaksi, lalu Backstory. Dua puluh hasil sama rata: **5% per power**. Bishop punya dua child spin total (bidak + Angelic); bidak lain satu. Powers King/Bishop tetap dimiliki setelah main Power None dan membaca satu Power Mastery normal pada tahap berikutnya.

Bonus Queen/Knight/Rook adalah poin angka, bukan tier, bukan mastery, dan
bukan hasil spin stat. Semua fixed grants source-once dan tidak menciptakan
funny-result tag atau hit Lucky Number.

## Pawn: Beast of Possibility

Pengguna mengonfirmasi syarat memakai **hasil spin asli sebelum bonus**.
Jika setidaknya **tiga kategori** memiliki nilai raw **≥7**, Pawn langsung
berevolusi menjadi **Royal High Paladin** dan mendapat **+2 pada kelima main stat**.

Working interpretation yang dinyatakan: tiga dari tujuh kategori berikut.

1. Strength
2. Speed
3. Durability
4. Intelligence
5. Fight
6. Weapon Mastery
7. Power Mastery

Weapon Mastery memenuhi syarat jika ada weapon aktif dengan raw mastery ≥7.
Beberapa weapon yang lolos tetap menghitung satu kategori; weapon yang
sudah dibuang tidak ikut. Power Mastery bersama menghitung paling banyak
satu kategori, berapa pun banyaknya power/proyeksi. Satu kategori main stat
menggunakan actual raw primary result miliknya, bukan penjumlahan modifiers.

Gunakan mapping nomor mastery yang eksplisit dan dibekukan dengan pool,
sama dengan mapping angka 0–9 untuk Lucky Number. Jangan mengasumsikan
nomor dari nama rank, urutan sektor atau bonus mastery. Mapping yang belum
tersedia adalah configuration gap. Power Tier 1–5 tidak dihitung sebagai stat.

Stat/mastery yang belum di-spin masih pending. Kategori mastery yang memang
absen/tidak di-spin tidak memenuhi syarat, tanpa membuat hasil raw 0 palsu.
Tiga hasil raw yang sudah lolos cukup untuk trigger, walau kategori lain
masih belum di-spin. Misalnya Strength 7, Speed 8 dan raw Weapon Mastery 7
memenuhi syarat; raw 6 yang menjadi 8 karena bonus tidak memenuhi syarat.

Evaluasi pasif setelah raw stat/mastery dikomit, sebelum snapshot reaksi.
Perubahan status weapon aktif dan audit finalize juga mengecek konsistensi.
Saat trigger pertama, simpan bukti tiga kategori/source result/mapping,
commit form dan lima modifier +2 sekaligus sekali. Bonus menunggu raw stat
yang belum ada, atau diproyeksikan ke base yang sudah ada sesuai bounds.

Beast of Possibility adalah **kondisi**, bukan owned power baru. Evolusi tidak
spin ulang Archetype atau memanggil profil Paladin, Race, armor atau power lain.
Hasil Royal/Pawn asli tetap ada pada riwayat; Royal High Paladin menjadi form
hasil evolusi, tidak menggantikan spin Title nanti. Tidak ada demotion atau
bonus evolusi kedua. Bonusnya sendiri tidak bisa mengaktifkan syarat raw.

Observer boleh membaca satu raw Power Mastery yang memang sudah dijadwalkan.
Ini tidak membuat spin/evolusi wheel baru, Enchant power atau mastery tambahan.
Reaksi milestone hanya pada evolusi pertama; replay/render/reevaluation tidak
menggandakan bonus, form, grant ataupun jumlah raw kategori.

## Penyimpanan dan batas

Freeze versi/pool/odds/hasil bidak dan efek terpilih. Bishop memiliki child
Angelic source/result sendiri. Pawn menyimpan armed status, raw proof,
mastery mapping, form dan source-key evolution ledger. Pertahankan inventory,
Title/main flow dan reward sumber lain sesuai kontrak yang telah disetujui.

[Desain Royal](../content/royal-events-design.json) dan spec sudah sinkron.
Royal Authority ditambahkan ke katalog tier tanpa mengubah rating power lama.
Runtime event/condition observer belum dibuat; detail Authority, maps,
seven-category aggregation bila ingin direvisi, dan final body-role fit
masih konfigurasi. Berikutnya **Apostle**.

## Mapping dan bonus akhir

Versi **royal/0.3.0** memakai [skala raw 0–9](STAT-SCALES.md) yang eksplisit
untuk Pawn dan kedua mastery: Noob=0, label lain=1–9. Semua bonus main stat
Queen/Knight/Rook/evolusi Pawn dicatat saat didapat, tetapi angka bonus baru
dijumlahkan di finalize. Pawn tetap mengecek raw asli sebelum bonus.

Jika Resilient dan Pawn kelak diotorisasi bersama, raw yang dipakai adalah
hasil nyata tertinggi yang dipertahankan; dua percobaan tetap satu kategori.
Journal lama menyimpan mapping dan versi lamanya.
