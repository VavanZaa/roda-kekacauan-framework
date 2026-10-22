# Satu Power Mastery Bersama

Keputusan terbaru — 10 Oktober 2026: **Jaminan maksimum langsung menjadi
nilai dasar, tanpa spin. God memakai satu dasar Power Mastery9 untuk seluruh
power saat ini maupun yang didapat nanti. Vessel God pada Compatibility60–100
mewarisi jaminan tersebut. Lich langsung Durability9.** Bonus/debuff tetap di
akhir dan boleh menghasilkan angka negatif/melebihi9. Nilai otomatis bukan
hasil spin: tidak memberi Lucky hit, retry Resilient atau kategori raw Pawn.
Aturan ini menggantikan scope Authority-only dan spin singleton Lich di
catatan sebelumnya. Plan lama tetap dibaca sesuai riwayatnya.


**Karakter memakai satu dasar Power Mastery bersama untuk seluruh power: spin sekali, atau langsung9 jika punya jaminan maksimum.** Raw memakai angka 0–9. Bonus/debuff dihitung di akhir; nilai final boleh negatif atau melebihi 9. Power Tier intrinsik 1–5 tetap terpisah dari mastery.

Jika karakter tidak memiliki power, skip mastery. Power pertama yang datang belakangan membuka resolution pertama jika belum ada; power berikutnya memakai hasil bersama yang sudah tersimpan. Main Power None tidak menghapus grant dari ras, Archetype, atau event sebelumnya. Power Mastery tidak membuka Enchant.

## Peluang mastery

Peluang raw bersama memakai parameter kontrol power yang berbeda dari Strength,
Fight dan latihan senjata. Ras/subtype, archetype serta event yang dideklarasikan
mengubah likelihood sebelum spin; setiap hasil acak yang masih boleh keluar memiliki peluang5%–25%. Power Tier1–5
tidak otomatis meningkatkan mastery. Equalizer memakai10% pada pool0–9, dan
Resilient memakai satu retry dengan odds yang sama.

Inventory power yang benar-benar dimiliki dibekukan saat resolution pertama.
Power baru berikutnya memakai base bersama yang sudah tercatat, tanpa draw atau
perubahan odds sebelumnya. Jaminan God menetapkan dasar bersama9, tanpa spin. Lihat [parameter dan kontrak engine](STAT-SCALES.md).

## Raw dan bonus akhir

Simpan raw asli dan sumber bonus secara terpisah. Pada finalize:

Power Mastery biasa = retained shared raw + jumlah modifier sumber yang berlaku.

Tidak ada batas minimum atau maksimum pada angka final. Contoh raw 9 + bonus 2 = **11**; raw 0 − penalti 1 = **−1**. Perhitungan ulang memakai base asli dan ledger, sehingga bonus tidak bertambah lagi saat resume atau render ulang. Tampilkan angka final persis; label raw tetap label dari roda 0–9.

Fairy King +2, Lembuswana +2, Singa Ambara Raja +1, Elemental Golem +1, Utusan Tuhan +1 dan Apostle +1 berlaku sesuai kontrak sumbernya. Bonus follower Raja Iblis tetap mengikuti jumlah pengikut. Bonus global diterapkan sekali pada proyeksi setiap power sekarang maupun yang diperoleh kemudian, bukan bonus baru untuk setiap power.

## Jaminan God

God memberi fixed shared base9 kepada seluruh power, termasuk Authority,
Divine, dan power biasa. Tidak ada roda mastery atau RNG. Power baru memakai
dasar yang sama. Vessel God60/70/80/90/100 mewarisi jaminan maksimum dari paket
God; band rendah dan Vessel Raja tidak. Royal King, Demigod dan nama power
Authority saja tidak mengaktifkan jaminan ini.

Final Power Mastery =9 + modifier sumber yang berlaku. Contoh +2 menghasilkan11.
Jaminan mastery tidak menambah power atau menaikkan intrinsic Power Tier.

## Resilient dan pengamat raw

Jika Resilient aktif dan raw pertama ≤5, lakukan satu retry dari pool/odds yang dibekukan, lalu ambil raw tertinggi. Setiap actual attempt mempunyai reaksi dan catatan sendiri. Retry wajib selesai sebelum resolution bersama dianggap selesai. Grant atau bonus belakangan tidak membuka retry ulang.

Lucky Number mengamati setiap actual raw attempt yang sesuai aturan. Proyeksi ke banyak power, bonus final dan base Authority otomatis tidak menambah hit. Pawn memakai kategori raw sebelum bonus; satu shared Power Mastery adalah satu kategori.

## Power yang sama

Sebelum acquisition draw, keluarkan canonical power yang sudah dimiliki, lalu normalisasi sisa pool. Pada beberapa spin berurutan, commit power pertama sebelum membentuk pool berikutnya. Grant tetap yang identik digabung menjadi satu owned power dengan semua sumber dan binding dipertahankan; tidak memberi bonus mastery atau spin pengganti.

Identitas canonical mempertahankan mode/binding kemampuan. Authority sumber God tidak disamakan otomatis dengan ordinary Concept yang memakai mastery biasa. Referensi mangsa/army/Slayer bukan acquisition power karakter. Roda utama Power nanti mempunyai **setidaknya 128 pilihan**; fallback untuk thematic pool yang benar-benar habis akan ditentukan saat tahap Power.

[Skala angka](STAT-SCALES.md) · [Bonus akhir](BONUS-TIMING.md) · [God](HEAVENLY-PRINCIPLE-EVENTS.md) · [Resilient](RESILIENT-EVENTS.md) · [Kontrak kepemilikan](../framework/spec.json)
