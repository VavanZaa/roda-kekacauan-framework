# Divine — mekanisme event lanjutan

Seluruh 12 Divine memakai hadiah yang sudah dirancang. Roda lanjutan memilih target atau hadiah yang benar-benar diperlukan. Ini desain algoritma untuk engine nanti; eksekutor video, combat dan penyimpanan belum dibuat.

Alur umum: **hasil Divine → roda event eligible → reaksi → target/hadiah bila perlu → reaksi → simpan efek → kembali ke Title.** Tidak ada roda boost umum lagi. Distribusi pembuka tetap 15%/12%/8% per sisi dan 30% None.

| Tingkat | Event | Alur setelah hasil |
| --- | --- | --- |
| Low | Sentuhan Berkah | Spin pemilih stat (5 pilihan), sama rata → target mendapat +1 di akhir. |
| Low | Perisai Tipis | Langsung simpan trait Durability +1 untuk satu hit masuk; tanpa roda tambahan. |
| Low | Napas Cadangan | Langsung simpan trait Speed +1 untuk satu dodge; tanpa roda tambahan. |
| Low | Fokus Sesaat | Langsung simpan trait Fight +1 untuk satu serangan; tanpa roda tambahan. |
| Medium | Berkah Terarah | Cari main stat terendah sebelum bonus → bila seri, spin di antara yang seri → +1 target. |
| Medium | Sentuhan Ahli | Spin senjata aktif milik karakter → +1 mastery senjata itu → cek Enchant pada fase akhir. |
| Medium | Resonansi | Langsung catat +1 mastery bersama untuk semua power; tanpa spin ulang mastery. |
| Medium | Purification | Spin weakness receh aktif yang dimiliki → nonaktifkan satu hasil terpilih. |
| High | Berkah Ganda | Spin pemilih stat (5 pilihan) → matikan hasil pertama → spin 4 sisanya → masing-masing +1. |
| High | Second Chance | Pilih stat raw terendah yang eligible → spin ulang stat → bonus peningkatan0–2, hasil awal disimpan. |
| High | Divine Gift | Spin Divine Power Tier1–3 yang belum dimiliki → grant → gunakan mastery bersama atau roll satu mastery jika ini power pertama. |
| High | Restoration | Spin entri penalti main stat yang belum dipulihkan → refund maksimal2 poin; bila masih ada sisa anggaran, pilih entri lain. |

## Pemilihan target

Semua target eligible sama rata. Satu target langsung ditampilkan tanpa RNG; beberapa target memakai roda. Bila target tidak ada, keluarkan event itu sebelum roda event diputar. Jangan mengubah peluang pembuka: Divine Medium tetap12% walaupun pilihan event menyusut. Jika karakter tanpa weapon, power dan weakness receh, Medium langsung menghasilkan Berkah Terarah. Data yang belum diketahui harus diselesaikan sebagai konfigurasi, bukan dianggap tidak punya target.

Berkah Terarah membandingkan nilai dasar yang sudah diproses Gambler, sebelum bonus/debuff angka. Second Chance memilih berdasarkan retained raw dari spin asli. Weapon memakai instance aktif; senjata yang dibuang, armor dan kendaraan kosmetik tidak ikut. Purification hanya sepuluh weakness kategori receh dari pool40 yang aktif dan dimiliki; weakness yang sama dari beberapa sumber tetap satu target. Cursed/Rage/Overload dan paket bonus sumbernya tetap tersimpan.

Setiap pemilihan baru dibekukan setelah langkah sebelumnya dicatat. Berkah Ganda mempunyai5 pilihan pertama dan4 pilihan kedua, tanpa kembar. Target selection tidak menghasilkan angka stat/mastery atau otomatis mewarisi tag lucu dari nama item.

## Buff sekali pakai

Perisai Tipis dipakai pada hit pertama yang benar-benar masuk ke perhitungan Durability; serangan batal/meleset tidak memakainya. Napas Cadangan dipakai pada dodge pertama yang dihitung, berhasil atau gagal. Fokus Sesaat dipakai pada serangan pertama yang dihitung dengan Fight, kena atau meleset. Sesudah dipakai, charge1 menjadi0. Pembuatan gambar/video dan replay tidak memakai charge. Kartu karakter menampilkan trait ini terpisah dari stat permanen dan power.

## Second Chance

Hanya hasil main stat yang benar-benar pernah diputar, tidak dijamin maksimum, dan retained raw<9 yang eligible. Jika beberapa paling rendah seri, spin target di antara mereka. Hasil lama tidak ditimpa. Putar satu attempt baru dengan distribusi stat kondisional normal, lalu simpan bonus positif maksimal2.

- Normal: bonus = min(2, max(0, raw baru − raw lama)). Contoh3→8 memberi+2,3→4 memberi+1,3→1 memberi0.
- Resilient: jika attempt baru pertama≤5, boleh satu retry dengan pool sama; ambil raw lebih tinggi. Tidak ada retry berulang.
- Double or Nothing: setelah raw baru diselesaikan, spin Double/Nothing50:50 sekali. Bandingkan **base baru setelah keputusan** dengan **base lama setelah keputusan**, lalu ambil selisih positif maksimal2. Raw lama4 yang Double menjadi8; raw baru6+Double menjadi12 memberi+2, sedangkan6+Nothing memberi0 bonus. Stat asli8 tetap disimpan pada kedua kasus. Ini memperjelas rumus raw-only sebelumnya untuk mode ini.
- High Roller: tetap gunakan empat angka ekstrem0/1/8/9.
- All In: hanya Strength yang benar-benar diputar eligible; empat hasil salinan tidak menjadi target baru. Bonus event ini hanya menambah Strength, sementara base salinan tetap sama seperti semula.
- Lucky Number: setiap attempt raw baru yang benar-benar diputar dapat dihitung sekali, termasuk retry Resilient. Spin pemilih target, keputusan Double/Nothing, bonus dan replay tidak dihitung sebagai raw hit.
- Pawn: catat retained raw baru sebagai observasi tambahan pada kategori stat yang sama. Jangan menimpa bukti asli atau menghitung dua attempt sebagai dua kategori. Evolusi tetap sekali sesuai syarat yang sudah disetujui.

Batas+2 hanya berlaku untuk hadiah langsung Second Chance; passive Lucky/Pawn yang sah tetap sumber bonus terpisah. Pool stat angka memakai batas5%–25% biasa; batas itu tidak berlaku pada roda target/event.

## Divine Gift dan mastery

Gunakan roda Divine universal dengan filter Tier1–3 khusus panggilan ini:12 pilihan canonical sebelum power yang sudah dimiliki dikeluarkan, semuanya sama rata. Tidak ada spin Tier terpisah atau None. Roda universal20 untuk panggilan lain tetap sama. Pilihan tunggal langsung grant; power yang sama tidak diberi ulang.

Power baru memakai mastery bersama yang sudah diselesaikan. Jika belum ada power sebelumnya dan gate awal terlewati, jalankan satu gate Power Mastery normal segera sesudah grant ini. Jaminan God tetap dasar9 tanpa spin. Tidak ada Enchant untuk power. Jika ownership/proof berubah setelah pool dibekukan, jangan diam-diam mengganti hadiah; validasi ulang receipt sebelum commit.

## Restoration

Target ialah entri negatif main stat yang aktif dan masih punya poin belum dipulihkan. Satu target per pasangan sumber/stat, bukan per poin. Raw0, base yang dibalik, penalti mastery dan weakness conditional tidak termasuk. Wheel memilih entri sama rata.

Pulihkan min(2, sisa poin negatif entri terpilih). Jika baru memulihkan1 dan masih ada entri lain, pilih satu entri lain untuk poin kedua. Jika tak ada, selesai dengan+1. Entri−3 bisa langsung dipulihkan2 tanpa roda kedua. Pertahankan entri negatif asli, lalu catat refund positif tertaut yang dihitung di akhir; satu poin negatif tidak boleh direfund dua kali.

## Pencatatan dan narasi

Gunakan source key tetap untuk setiap event/langkah. Simpan selection dan efek satu kali dengan proof ownership/ledger yang sesuai. Resume memakai receipt yang sama; jangan memutar lagi, menambah bonus atau memicu Lucky/Shrek lagi. Setiap actual result memberi fakta baru untuk narator; narator belum mengetahui hasil roda berikutnya. Template reaksi pendek tersedia di JSON dan dapat diganti dengan meme dari library nanti.

Bonus main stat/mastery tetap dihitung pada fase akhir. Setelah Title dan seluruh event wajib selesai, mastery efektif membuka gate Enchant biasa bila mencapai Master5 dengan slot compatible kosong. Sentuhan Ahli tidak langsung menjamin Enchant. Kartu final memuat seluruh bonus/hook yang sah; skor tetap boleh negatif atau di atas9.

Pity setelah tiga None dan metode harga sebelum hadiah tetap opsi terpisah, belum aktif. Desain Chaos, Chaotic Power dan Title tidak ditambahkan dalam perubahan ini.
