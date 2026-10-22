# Event Hybrid Archetype

Hybrid mendapat **dua Archetype berbeda**, lalu menjalankan event keduanya. Ini event roda Archetype, terpisah dari Hybrid pada roda ras. Tidak ada bonus bawaan selain hadiah dan aturan dari kedua role terpilih.

1. Hasil Hybrid aktual dan reaksinya.
2. Spin Archetype pertama dari pool aktif yang kompatibel, tanpa Hybrid.
3. Simpan hasil, lalu selesaikan seluruh event langsungnya.
4. Spin kedua; keluarkan Hybrid, role pertama, role yang bertentangan dengan role pertama,
   dan semua Archetype yang dihapus.
5. Selesaikan event role kedua, lalu lanjut Backstory satu kali.

Peluang memakai bobot roda Archetype kanonis 3:2,5:2 per kelompok, setelah filter dan normalisasi.
Tidak menyeimbangkan ulang massa kelompok setelah exclusion. Equalizer dari role pertama membuat
sisa pilihan sama rata. Hasil pertama tidak diulang untuk memperbaiki hasil kedua. NPC tetap
menjadi pilihan dan menghabiskan satu slot meskipun tidak punya event tambahan.

Setiap role memakai definisi aslinya dan sumber hadiah sendiri. Semua bonus angka dihitung di akhir, satu Power Mastery bersama dan mastery tiap weapon tetap. Hybrid tidak menggandakan stage stat/mastery atau memberi ras tambahan. Mutant boleh menjalankan mutasi normalnya, lalu kembali ke caller Hybrid tanpa membuka gate utama lagi.

Return child diarahkan ke slot Hybrid yang tersimpan; tidak langsung melompat ke Backstory. Riwayat dua role hanya lokal pada event ini dan tidak memakai history ras. Commit hasil dan exclusion sebelum event turunannya; resume tidak spin ulang atau memberi hadiah dua kali.

**Pasangan yang saling membatasi dikeluarkan sebelum spin kedua.** Matrix awal dari konsekuensi
paket saat ini bersifat simetris: Gladiator tidak dipasangkan dengan Disciple, Rider, Assassin,
Colossal Warmech, Primordial Champion atau Mutant karena mereka bisa memberi weapon;
Equalizer tidak dipasangkan dengan Mage karena menghilangkan boost peluang Master Sihir.
Matrix ini dapat disesuaikan saat paket berubah. Child pertama yang tidak mempunyai satu pun
partner kompatibel dalam pool tubuh juga dikeluarkan sebelum draw pertama.

Gambler + Resilient tetap kompatibel: retry/ambil raw tertinggi dahulu, kemudian Double/Nothing
sekali pada retained raw. Equalizer mempertahankan aturan struktural Gambler sambil meratakan
bobot sisa pilihan. Lucky Number hanya menghitung actual spin, bukan salinan All In atau proyeksi.
Pawn membaca base sebelum bonus sesuai kontraknya.

[Planner pasangan](../framework/archetype-hybrid.mjs) menyediakan `planHybridArchetypeChoices`.
Fungsi ini memfilter pool dan menormalisasi odds; tidak mengambil RNG atau menjalankan event.
Kecocokan tubuh masih diberikan caller. Jika pool tidak menyisakan dua pilihan kompatibel,
lengkapi konfigurasi sambil mempertahankan child pertama yang sudah committed. Executor penuh
masih belum dibuat.

Archetype yang dilewati dari roster dikeluarkan dari roda utama maupun dua spin Hybrid. Catatan video dipertahankan sebagai bukti, bukan pilihan aktif. Skipping event NPC berbeda dari menghapus role NPC.

[Data kanonis](../content/archetype-hybrid-events-design.json) · [Roda Archetype](ARCHETYPE-WHEEL.md).
