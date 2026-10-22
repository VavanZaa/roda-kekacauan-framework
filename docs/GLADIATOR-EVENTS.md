# Event Gladiator

Core disetujui pengguna: satu spin weapon bertema Gladiator, **buang semua
weapon sebelumnya**, lalu hanya punya weapon hasil ini. Bonus Weapon Mastery
adalah **+2**, menggantikan instruksi awal +1. Tidak boleh mendapat weapon tambahan.

## Alur

Gladiator → spin Weapon Gladiator → buang weapon lama, grant satu hasil,
daftarkan +2 mastery dan lock weapon → reaksi → Backstory.

Nanti pada tahap Weapon: **skip spin acquisition utama dan semua extra acquisition**
→ spin Weapon Mastery normal untuk weapon Gladiator → tambahkan dua tingkat
dari raw0..9 tanpa floor/cap final → Enchant jika efektif Master atau lebih dan kompatibel → Power.
Skip acquisition bukan hasil None dan bukan skip mastery. Tidak ada mastery
awal, jaminan Master, bonus main stat atau spin weapon kedua.

## Draft roda Weapon Gladiator

Delapan pilihan sama rata: **12,5% per pilihan**. Roster ini kurasi game editable,
bukan roster senjata yang dibaca dari video atau klaim daftar historis lengkap.

| Weapon | Bentuk |
| --- | --- |
| Gladius | Pedang pendek |
| Sica | Pedang melengkung |
| Pugio | Belati |
| Trisula | Tombak bercabang tiga |
| Tombak Arena | Tombak |
| Jaring Arena | Jaring |
| Scutum (Perisai) | Perisai |
| Rudis (Pedang Kayu) | Pedang kayu |

Satu hasil adalah satu weapon; tidak ada paket Trisula + Jaring atau selector
jumlah. Trisula memakai definisi kanonis Trishula dari Elf, tetapi instance
baru bersumber Gladiator, tanpa event Atlantean atau bonus Strength-nya.

## Ditch dan lock inventory

Saat hasil weapon dikomit, transaksi yang sama menonaktifkan seluruh weapon
lama beserta efek yang terikat pada instance-nya, memberi satu weapon baru,
modifier +2 dan lock. Hasil/grant/mastery/enchant lama tetap disimpan sebagai
riwayat; weapon yang dibuang tidak masuk loadout aktif, image atau mastery berikutnya.
Stat, power, armor dan companion dari sumber lain tetap berlaku.

Lock berlaku untuk seluruh sisa run, termasuk queued extra Weapon dari ras,
Backstory, Apex, Title dan grant weapon dari event lain. Spin khusus acquisition
weapon dilewati sebelum sampling dan dicatat alasannya. Untuk event berisi
bermacam efek, blokir bagian grant weapon saja, lalu jalankan efek lain yang
memang dinyatakan. Tidak ada reroll, pengganti power/stat atau kompensasi.

Enchant/upgrade pada weapon yang sama tetap boleh. Jika suatu Enchant/event
hendak memberi weapon tambahan, grant tambahan itu diblokir. Weapon lama tidak
aktif kembali karena replay. Bonus +2 hanya untuk instance hasil Gladiator,
bukan untuk definisi senjata secara global atau weapon yang dibuang.

## Kontrak penyimpanan

Freeze pool, odds, versi, hasil, resep, IDs weapon lama dan continuation.
Commit ditch/grant/modifier/lock sekali secara atomik dengan source ledger;
retry video atau replay tidak menggandakan weapon, bonus, ditch atau spin.
Mastery mentah tidak berubah; efektif dihitung di akhir dari base + modifier unik tanpa floor/cap.

Konteks narator ditumpuk dari hasil aktual: weapon terpilih, weapon lama dibuang,
bonus +2 yang masih menunggu mastery, dan larangan weapon tambahan. Jangan
menganggap hasil mastery/Backstory/stat masa depan sudah diketahui. Caption
sendiri tidak membuat funny-result tag.

Desain tersimpan pada [JSON Gladiator](../content/gladiator-events-design.json).
Runtime helper dan guard inventory belum diimplementasikan; roster, detail
capability/Enchant, conditional mastery odds dan final body-role fit masih konfigurasi.
Archetype berikutnya: **Mage**.

## Timing bonus terbaru

Bonus mastery dicatat saat didapat dan baru dihitung pada fase akhir.
Weapon Mastery setelah bonus menentukan Enchant pada fase itu; Power
Mastery tetap tidak memberi Enchant. Raw spin/scoped bonus dan sumbernya
tetap. Semua event Enchant selesai sebelum gambar/final card.
[Aturan kanonis](BONUS-TIMING.md) supersedes timing lebih awal di catatan lama.
