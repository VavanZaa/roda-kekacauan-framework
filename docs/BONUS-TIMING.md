# Bonus Akhir dan Enchant

**Semua bonus main stat, Weapon Mastery, dan Power Mastery dihitung di akhir.**
Bonus Weapon Mastery ikut menentukan apakah weapon mendapat Enchant.

Selama video berjalan, setiap bonus dicatat bersama sumbernya. Angka yang
diperlihatkan saat spin adalah hasil asli atau hasil terbaik Resilient;
bonus belum ditambahkan. Resilient, Lucky Number dan Pawn tetap membaca
hasil spin asli sebelum bonus.

Setelah Title dan event wajibnya selesai, jalankan fase akhir:

1. Selesaikan semua spin/event wajib yang masih tertunda, termasuk retry.
2. Hitung bonus Weapon Mastery per weapon aktif dan Power Mastery bersama.
3. Periksa Enchant memakai **Weapon Mastery setelah bonus**. Jika **Master
   atau lebih tinggi (≥5)**, weapon enchantable dan slot kompatibel tersedia,
   spin Enchant lalu selesaikan eventnya.
4. Selesaikan seluruh grant/spin/event yang muncul dari Enchant. Bila sumber
   bonus atau inventory berubah, perbarui mastery dari hasil asli dan ledger,
   lalu periksa hanya slot Enchant yang belum digunakan.
5. Setelah semua event selesai, tutup hit Lucky Number dan hitung seluruh
   bonus/debuff lima main stat. Bonus yang didapat dari spin Enchant ikut masuk.
6. Bekukan karakter, buat gambar, lalu tampilkan kartu stat final.

| Weapon Mastery asli | Bonus Weapon Mastery | Hasil setelah bonus | Lolos ambang Enchant |
| --- | --- | --- | --- |
| Expert 4 | +1 | Master 5 | Ya |
| Adept 3 | +2 | Master 5 | Ya |
| Expert 4 | 0 | Expert 4 | Tidak |

Bonus Strength atau Power Mastery tidak menaikkan Weapon Mastery.
Kelolosan ambang tetap membutuhkan weapon aktif, enchantable dan slot yang
kompatibel. Tidak ada Enchant dari Power Mastery.

Contoh Resilient: spin pertama **4**, kedua **2**, pilih **4**. Jika punya
bonus Weapon Mastery **+1**, pada fase akhir menjadi **5** dan lolos ambang
Enchant. Bonus tidak membatalkan retry atau mengubah hasil spin asli.

Enchant diputar pada fase akhir, sebelum gambar. Tahap Weapon sebelumnya
hanya menyimpan hasil raw mastery dan pemeriksaan Enchant yang masih pending;
hasil raw di bawah Master tidak langsung membuat Enchant dilewati permanen.
Weapon yang dibuang Gladiator tidak masuk pemeriksaan ini.

Setiap modifier sumber dan slot Enchant dihitung/dipakai sekali. Perhitungan
ulang mengambil base asli ditambah ledger, bukan angka efektif sebelumnya
ditambah bonus lagi. Resume/render ulang menggunakan catatan yang sudah ada.
Event lanjutan mengikuti batas aktivasi/kedalaman yang sudah dideklarasikan;
gambar tidak dibuat selama event wajib masih tertunda.

Power Mastery tetap satu hasil bersama. Authority God memakai base 9 pada grant sumbernya,
lalu menerima modifier Power Mastery bersama. Seluruh angka final, termasuk kedua mastery,
boleh negatif atau lebih dari 9. Lich hanya menjamin raw Durability 9; final 9 − 1 tetap 8.

Aturan ini adalah desain algoritma. Executor fase akhir dan katalog Enchant
masih perlu diimplementasikan/dilengkapi. Journal lama
mempertahankan timing dan hasil yang sudah dibekukan.

[Desain terstruktur](../content/bonus-timing-design.json) ·
[Skala 0–9](STAT-SCALES.md) · [Resilient](RESILIENT-EVENTS.md) ·
[Power Mastery](POWER-MASTERY.md)

## Bonus Paladin Biasa

Paladin Biasa mendaftarkan Weapon Mastery+1 sekali untuk semua weapon
yang dimiliki. Weapon aktif yang diperoleh kemudian juga memakai sumber
bonus ini; weapon yang dibuang tidak ikut. Hitung per weapon dari raw
retained mastery pada fase akhir, lalu periksa effective Master5+/slot
Enchant. Nirvana High Paladin tidak memiliki bonus cabang biasa ini.
