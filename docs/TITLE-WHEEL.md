# Roda Gelar — katalog 256 dan pemakaian sekali per seri

Kita memakai katalog 256 gelar yang bisa diedit. Setiap karakter mendapat roda baru dari hasil yang sudah selesai: target 12 gelar kontekstual dan 4 receh, peluang sama rata pada roda tersebut. Gelar terpilih dinonaktifkan untuk karakter lain dalam seri Roda Kekacauan yang sama.

192 kontekstual · 64 receh · 24 hidden event kecil. Daftar lengkap: [TITLE-CATALOG.md](TITLE-CATALOG.md). Editor dan contoh roda: [title-roster.html](../preview/title-roster.html).

## Membentuk roda

1. Tunggu Roda Kekacauan beserta anak eventnya selesai. Baca ras/subras, archetype, Backstory, normal Size, hasil stat asli, bonus yang sudah terdaftar, inventory aktif, weakness aktif dan hasil Roda Kekacauan.
2. Proyeksikan bonus yang sudah diketahui untuk mencocokkan gelar. Ini nilai sementara sebelum Title, bukan kartu final. Hasil spin asli tetap tersimpan; hasil Title/Enchant yang belum terjadi tidak digunakan.
3. Keluarkan gelar yang terpakai dan yang syarat faktanya tidak cocok. Contoh Sayap Pembelah Langit perlu Flight; Penggoreng Tanpa Minyak hanya untuk Air Fryer; Gunung Lagi AFK perlu tubuh raksasa dan Speed sementara 0.
4. Pilih hingga 12 kandidat kontekstual berdasarkan kecocokan tag fakta yang benar-benar dimiliki. Seed karakter hanya memecahkan nilai seri, bukan spin tambahan. Pilih hingga 4 receh. Equalizer menghapus skor affinity lunak, tetapi mempertahankan syarat fakta, judul terpakai dan struktur 12/4.
5. Bekukan roda dan versi/proof sebelum actual RNG.16 pilihan normal masing-masing 6,25%. Tidak ada spin kategori/Tier atau None. Batas stat5%–25% tidak diterapkan pada gelar.

Jika kandidat dalam suatu kelompok kurang dari target, pakai jumlah yang benar-benar tersisa. Jangan memasukkan gelar yang tidak cocok atau sudah dipakai. Jika seluruh kandidat eligible habis, kembalikan exhausted-for-context; perlu tambahan katalog yang cocok atau permintaan seri baru. Tidak ada reset otomatis. Roda berputar anticlockwise; gelar lore diletakkan sebelum gelar hadiah kecil, menggunakan urutan katalog pada kelompok setara.

## Menonaktifkan gelar

Scope default: **roda-kekacauan-main**, satu seri lintas karakter/run proyek ini. Identitas gelar ialah canonical titleId. Mengubah narasi/ejaan tampilan tidak membuat ID lama tersedia lagi.

`state/title-usage.json` menyimpan claim, pemilik dan receipt hasil. Satu karakter berarti pasangan `[runId,characterId]`, dengan satu gelar. Jalankan plan→RNG→claim di bawah lock file yang sama; simpan claim dan receipt melalui atomic replacement. Dua writer tidak boleh memakai gelar yang sama. Pool dari revision lama ditolak jika dipakai di luar transaksi ini.

Gelar dikunci setelah hasil Title tercatat, sebelum hidden event dijalankan. Jika pembuatan video/event berhenti, resume menggunakan receipt yang sudah tersimpan. Gelar tetap terpakai dan tidak ada spin baru, bonus ganda atau hit Shrek tambahan. Character journal nanti mengeksekusi pending hidden receipt memakai source key tetap.

Katalog baru dimulai dengan 0 claim karena belum ada karakter produksi yang diberi gelar dalam tahap desain ini. Tidak ada judul contoh yang sengaja dikonsumsi. File rusak atau lock dari writer lain tidak direset/diambil alih diam-diam. Perubahan katalog tidak menghapus claim lama; ID asing memerlukan migrasi.

## Hidden event

232 gelar hanya lore. 24 gelar mempunyai aturan kecil: 20 main-stat +1, 2 mastery untuk satu weapon aktif, dan 2 shared Power Mastery+1. Nama gelar sendiri tidak memberi power, weapon, transformasi, rank ataupun bonus tambahan.

Title diungkapkan lebih dulu, narator bereaksi, lalu hidden event dibuka. Bonus angka dicatat sekali dan dihitung di akhir. Hadiah Weapon Mastery memilih satu weapon aktif yang sudah dimiliki; target tunggal langsung dipilih. Bonus+1 boleh membantu mencapai Master 5 pada gate Enchant akhir biasa, tanpa slot ekstra atau Enchant langsung. Power memakai mastery bersama yang sudah ada, termasuk dasar God 9; tidak ada Power Enchant.

Gelar receh mempunyai tag funny yang eksplisit. Actual Title spin lucu dapat memicu aturan Shrek yang sudah disetujui, sekali per spinId. Preview, replay dan reveal deterministic bukan actual funny spin. Kata seperti Pedang/Final Boss pada gelar receh hanyalah gelar, bukan grant equipment/archetype.

## AI dan narasi

AI dapat merangkai reaksi dan deskripsi gelar terpilih dari konteks bertumpuk. Hasil mechanical tetap memakai canonical ID dan recipe katalog. Penambahan nama/alias/hidden effect harus masuk katalog lebih dulu; jangan memakai teks bebas AI untuk memberi stat atau melewati daftar gelar terpakai. Narator hanya mengetahui hasil yang sudah selesai, dan tidak menebak hidden event/roda berikutnya sebelum reveal.

## Helper dan preview

`framework/title-wheel.mjs` menyediakan context adapter, planner, external selector, result/claim resolver dan hidden-event modifier receipts. `framework/title-store.mjs` menyimpan claim seri secara atomic. Ini menyelesaikan mekanisme gelar dan persistensinya; character journal, scheduler penuh, combat dan produksi video masih perlu integrasi.

Lihat jumlah gelar produksi yang terpakai:

```text
node framework/scripts/title-claim.mjs --status
```

Commit hanya karakter yang sudah memiliki bukti hasil tahap sebelumnya:

```text
node framework/scripts/title-claim.mjs --input path-to-character.json
```

Input mengikuti input stat context yang sudah ada, ditambah seriesId, completedThrough=apex, committed apexReceipt dengan canonical root/effect IDs, statResults lima resolusi asli, weaponMasteryResults per senjata, sharedPowerMastery bila punya power, weakness inventory eksplisit dan preTitleModifiers yang sudah committed serta ber-stage sebelum Title. Jangan memakai contoh sebagai karakter produksi.

Regenerasi editor:

```text
node framework/scripts/title-preview.mjs
```

Preview offline memiliki 256 gelar searchable, tujuh contoh karakter, spin anticlockwise dan daftar demo yang tersimpan di browser. Reset demo hanya menghapus demo; tidak menulis registry produksi. Data/JS dan aturan target/rotasi diuji; inspeksi visual browser belum diklaim.
