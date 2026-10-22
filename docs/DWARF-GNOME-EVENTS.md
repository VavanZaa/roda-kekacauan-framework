# Event Dwarf dan Gnome Roda Kekacauan

Keluarga Kurcaci membuka satu putaran **Dwarf atau Gnome**. Dwarf mendapat event armor; Gnome
mendapat satu senjata teknologi. Aturan cabang, bagian armor, bonus stat, dan teknologi sebagai
senjata berasal dari pengguna. Dua interpretasi dicatat: karakter terakhir `!` pada bobot jumlah
armor dibaca sebagai `1`, dan bonus +1 memakai poin angka mengikuti keputusan sebelumnya.
Dwarf/Gnome kini 50/50, Gnome Tech 1/20 per pilihan, dan bagian armor eligible sama rata
berdasarkan default pengguna. Rasio jumlah armor tetap 5:4:3:2:1.

## Alur cabang

```text
Kurcaci → spin Dwarf / Gnome
  ├─ Dwarf
  │   → spin jumlah armor 1–5 dengan bobot 5:4:3:2:1
  │   → spin bagian armor sebanyak hasil jumlah itu, tanpa duplikat
  │   → setiap hasil memberi satu bagian armor dan bonus stat-nya
  │   → arketipe
  └─ Gnome
      → spin satu Gnome Tech dari 20 pilihan
      → simpan sebagai senjata, Weapon Mastery belum diputar
      → arketipe
```

Setiap spin memiliki hasil, reaksi narator, meme, caption, dan lapisan konteks sendiri. Ras tidak
memberikan armor atau senjata sebelum hasil cabang yang bersangkutan dicatat.

## Jumlah armor Dwarf

| Jumlah terpilih | Bobot | Peluang | Konteks untuk AI |
| --- | --- | --- | --- |
| 1 armor | 5 | 33.33% | Dwarf mendapat 1 putaran bagian armor; bagian yang didapat belum diketahui. |
| 2 armor | 4 | 26.67% | Dwarf mendapat 2 putaran bagian armor; bagian yang didapat belum diketahui. |
| 3 armor | 3 | 20.00% | Dwarf mendapat 3 putaran bagian armor; bagian yang didapat belum diketahui. |
| 4 armor | 2 | 13.33% | Dwarf mendapat 4 putaran bagian armor; bagian yang didapat belum diketahui. |
| 5 armor | 1 | 6.67% | Dwarf mendapat 5 putaran bagian armor; bagian yang didapat belum diketahui. |

Distribusi ini berlaku pada roda **jumlah armor**, sehingga jumlah kecil lebih mungkin didapat.
Bobot jumlah dipertahankan sesuai rasio yang ditafsirkan; konteks lain tidak mengubahnya tanpa
perubahan aturan. Lima bagian yang tersedia adalah Helmet, Gloves, Body Armor, Leggings, Boots.

## Bagian armor dan bonus

| Bagian | Slot | Bonus angka | Konteks untuk AI |
| --- | --- | --- | --- |
| Helmet (Helm) | head | +1 durability | Helm menambah satu poin Durability; bagian kepala kini masuk koleksi armor. |
| Gloves (Sarung Tangan) | hands | +1 fight | Sarung tangan menambah satu poin Fight; bonus ini belum menentukan hasil dasar kemampuan bertarung. |
| Body Armor (Armor Badan) | torso | +1 durability | Armor badan menambah satu poin Durability; tidak ada penalti Speed tambahan yang diberikan oleh hasil ini. |
| Leggings (Armor Kaki) | legs | +1 durability | Armor kaki menambah satu poin Durability dan dicatat terpisah dari Boots. |
| Boots (Sepatu) | feet | +1 speed | Sepatu menambah satu poin Speed; bagian ini tidak memberi bonus Durability dalam aturan yang ditetapkan. |

Armor dicatat dalam `armorInstances[]`, terpisah dari senjata. Tidak ada spin Armor Mastery yang
diminta. Setiap bagian memberi satu modifier dengan sumber bagian dan ID hasilnya. Nilai dasar
stat tetap diputar nanti; tambahkan bonus sekali setelah nilai dasar stat terkait tersedia.
Durability, Fight, dan Speed memerlukan skala angka atau pemetaan eksplisit dari tier ke angka.
Tidak ada efek material, kualitas, berat, atau penalti stat tambahan yang diasumsikan.

Jika semua lima bagian didapat, total bonusnya adalah **+3 Durability, +1 Fight, +1 Speed**.
Contoh: Durability dasar 6, Fight 4, Speed 5 menjadi 9, 5, 6 sebelum modifier lain.

## Tanpa duplikat dan tampilan roda

1. Baca jumlah armor yang sudah dicatat, lalu jadwalkan tepat sebanyak itu putaran.
2. Sebelum tiap spin bagian, keluarkan seluruh bagian yang sudah dipilih dari pilihan aktif.
3. Normalisasi bobot bagian yang tersisa dan simpan peluang putaran tersebut.
4. Spin sekali, catat hasil, armor, bonus, dan konteks secara bersamaan.
5. Matikan bagian terpilih untuk putaran berikutnya, lalu beri reaksi narator.
6. Ulangi sampai jumlah spin yang diminta selesai, kemudian lanjut ke arketipe.

Bobot dasar yang disetujui adalah 1 untuk setiap bagian. Bagian tersisa memiliki
peluang masing-masing 20%, 25%, 33,33%, 50%, lalu 100% saat tersisa satu. Peluang dihitung ulang
setiap spin; modifier tidak boleh mengaktifkan kembali bagian yang sudah dipilih.

Pada tampilan putaran berikutnya, sektor bagian yang sudah dipilih dinonaktifkan dengan sudut
nol. Lingkaran aktif dibagi ulang sesuai peluang bagian yang tersisa. Koleksi armor boleh tetap
ditampilkan terpisah agar penonton melihat bagian yang sudah diperoleh.

**Jika jumlah terpilih lima, tetap lakukan lima spin.** Spin kelima memiliki satu bagian tersisa
dan peluang 100%, lalu mendapat reveal dan reaksi sendiri. Permintaan jumlah spin ini menjadi
pengecualian terhadap aturan umum yang dapat mengungkap pilihan tunggal tanpa spin.

Contoh tiga armor: Helmet → Boots → Gloves. Setelah Helmet terpilih, Helmet tidak lagi menjadi
sektor aktif. Setelah Boots, Helmet dan Boots tidak aktif; spin ketiga hanya memilih dari Gloves,
Body Armor, dan Leggings. Bonus contoh ini adalah +1 Durability, +1 Speed, +1 Fight.

State pemilihan menyimpan ID event, jumlah target, urutan spin, ID bagian terpilih, dan bagian
tersisa. Setiap spin ulang roda memakai ID pemanggilan sendiri. Retry hasil yang sama tidak
menambah armor atau bonus dua kali. Jika konfigurasi tidak menyediakan cukup bagian unik,
laporkan error; jangan mengurangi jumlah yang diperoleh atau memutar ulang hasil.

## Gnome Tech

Gnome melakukan **satu spin**, memberikan **satu gadget sebagai senjata**. Pengguna meminta
daftar sebelumnya diganti agar lebih sesuai dengan identitas penemu Gnome. Daftar aktif kini
berfokus pada clockwork, roda gigi, pegas, uap, lensa, alat alkimia, jerat, dan umpan. Urutan ini
adalah urutan katalog; peluang dasar tiap teknologi 5%, sementara tingkat kekuatan belum ditetapkan.

Inspirasi umum: [tradisi perangkat clockwork Rock Gnome dan tema ilusi Forest Gnome](https://www.dndbeyond.com/species/1751438-gnome),
serta [Gnome mekanik dan robot tempur Mechagon](https://worldofwarcraft.blizzard.com/en-gb/news/23021204).
Dua sumber ini mendukung arah tema. Nama serta fungsi tempur di bawah adalah adaptasi permainan
yang disusun untuk Roda Kekacauan, bukan daftar perlengkapan ras resmi dari satu franchise.

| No. | Gadget / senjata | Fungsi yang dirancang | Konteks untuk AI |
| --- | --- | --- | --- |
| 1 | Steam Hammer | Palu kecil dengan piston uap untuk pukulan mekanik. | Palu uap masuk inventori: alat kecil dengan mekanisme pukul yang perlu dikuasai. |
| 2 | Drill Lance | Tombak bor dengan roda gigi dan pegangan pemutar. | Gnome mendapat tombak bor; gaya bertarung alat ini mengandalkan ujung berputar. |
| 3 | Gearblade | Bilah mekanik bergerigi yang digerakkan oleh engkol. | Gearblade membawa potensi serangan bilah bergerigi; pengoperasiannya mengikuti Weapon Mastery. |
| 4 | Spring Puncher | Alat genggam yang melontarkan sarung pukul memakai pegas. | Senjata baru berupa tinju pegas: bentuknya lucu, fungsinya tetap alat tempur. |
| 5 | Net Launcher | Pelontar jaring untuk menjerat gerakan sasaran. | Net Launcher membuka cara bertarung dengan jerat; jaring harus digunakan dengan tepat. |
| 6 | Clockwork Spider | Perangkat laba-laba mekanik yang memasang benang penjerat. | Gnome mendapat laba-laba mekanik penjerat, dicatat sebagai satu perangkat senjata. |
| 7 | Firefly Bomb | Gadget kunang-kunang mekanik yang menghasilkan kilatan cahaya untuk mengganggu pandangan. | Kunang-kunang mekanik menjadi alat pengacau pandangan; reaksi lawan tidak dijamin oleh hasil ini. |
| 8 | Glue Sprayer | Penyemprot cairan lengket untuk menghambat gerak sasaran. | Gnome mendapat penyemprot lem: gadget ini mengandalkan gangguan gerak, bukan sekadar damage. |
| 9 | Alchemy Sprayer | Penyemprot ramuan fantasi pengganggu dengan fungsi yang perlu ditetapkan dalam profil senjata. | Alat alkimia masuk inventori; efek ramuannya mengikuti profil senjata dan hasil mastery. |
| 10 | Stun Whistle | Peluit mekanik dengan resonansi pengganggu fokus dan keseimbangan. | Peluit kecil menjadi senjata pengacau; namanya tidak menjamin sasaran selalu terkena stun. |
| 11 | Shrink Ray | Alat lensa magis-mekanik yang berpotensi mengecilkan sasaran sementara. | Gadget kecil dengan rencana besar: Shrink Ray membuka potensi mengecilkan sasaran. |
| 12 | Clockwork Scorpion | Kalajengking mekanik dengan ekor penjepit untuk mengganggu sasaran dari dekat. | Kalajengking mekanik masuk sebagai satu senjata; pengendalian perangkatnya tetap membutuhkan mastery. |
| 13 | Gear Disc Launcher | Pelontar cakram roda gigi berputar untuk serangan jarak jauh. | Pelontar roda gigi memberi serangan proyektil mekanik; akurasi mengikuti penguasaan alat. |
| 14 | Magnet Glove | Sarung tangan mekanik yang menarik atau mengalihkan benda logam dalam jangkauan. | Magnet Glove mengandalkan benda logam sebagai sasaran kendali. Ini satu gadget senjata. |
| 15 | Spring Trap | Jebakan penjepit bertenaga pegas yang ditempatkan di medan tempur. | Gnome mendapat jebakan pegas; penempatan dan waktu pemasangan menjadi bagian penguasaan senjatanya. |
| 16 | Smoke Bomb Launcher | Pelontar kapsul asap untuk menyamarkan posisi atau mengganggu pandangan. | Kapsul asap memberi alat penyamaran di medan tempur; karakter tetap mengoperasikan gadget. |
| 17 | Clockwork Decoy | Boneka mekanik bergerak dan berbunyi untuk mengalihkan perhatian sasaran. | Umpan mekanik menjadi senjata taktis; gerak dan bunyinya digunakan untuk mengecoh. |
| 18 | Clockwork Turret | Turret mini dengan mekanisme roda gigi untuk serangan dari posisi yang dipilih. | Turret mini menjadi satu perangkat senjata; penempatan dan pengoperasiannya mengikuti mastery. |
| 19 | Grapple Launcher | Pelontar kait bertali untuk menarik benda, menjangkau posisi, atau menahan sasaran yang terkait. | Grapple Launcher membawa kait dan tali untuk gerak taktis serta kendali; ini dihitung sebagai senjata gadget. |
| 20 | Illusion Projector | Proyektor lensa magis-mekanik yang membentuk umpan visual untuk mengecoh sasaran. | Gnome mendapat alat proyeksi ilusi; umpan visual berasal dari gadget yang dipakai. |

Gadget serangan, jebakan, alat kendali, dan umpan taktis semuanya dihitung sebagai senjata
sesuai aturan pengguna. Perangkat clockwork beserta pengendali atau kunci putarnya adalah satu
paket senjata. Mastery mengukur ketepatan, waktu penggunaan, penempatan, dan pengoperasian alat.

Senjata gadget tetap ada saat roda Weapon utama diputar. Jika hasil utama adalah None, gadget
Gnome tetap mendapat Weapon Mastery. Jika ada senjata tambahan, setiap senjata dengan mastery
belum ditentukan mengikuti alur yang sama. Enchantment mengikuti kelayakan senjata kompatibel
dan mastery master atau lebih. Efek alat tidak otomatis menjadi power tubuh atau bonus stat.

Spring Puncher dan Magnet Glove merupakan gadget senjata, sehingga tidak otomatis menjadi Gloves
armor Dwarf. Clockwork Spider, Scorpion, dan Decoy dihitung sebagai perangkat senjata, tanpa
grant ras, power, atau senjata tambahan. Desain visual menggunakan alat kecil berengkol, roda
gigi terbuka, tabung, lensa, dan komponen kuningan yang sesuai dengan fungsi masing-masing.

Konteks dan visual menjadi bahan AI setelah gadget terpilih. Gaya penemu eksentrik tidak
menambahkan peluang rusak, ledakan sendiri, atau penalti mekanik yang belum ditetapkan. Enam
belas item yang diganti disimpan pada `retiredTechWeapons` untuk menjaga jejak desain; item
tersebut tidak termasuk pilihan aktif.

## Stacked context

Konteks Kurcaci sebelum spin jenis hanya mengetahui keluarga ras. Setelah Dwarf terpilih, baru
catat event armor; setelah jumlah terpilih, baru catat jumlah spin. Setiap bagian menambahkan
identitas armor, bonus yang benar-benar diberikan, koleksi saat itu, dan pilihan tersisa. AI
tidak menerima bagian yang belum diputar sebagai fakta karakter.

Untuk Gnome, hasil jenis membuka event teknologi. Hasil teknologi baru menambahkan senjata
terpilih dan status Weapon Mastery yang belum ditentukan. Reaksi dapat menghubungkan alat
dengan konteks karakter sebelumnya sambil mempertahankan grant, stat, dan hasil roda. Kolom
konteks di atas merupakan bahan narasi; dialog dan meme dapat berubah tanpa mengganti mekanik.

## Detail berikutnya

- Penyesuaian peluang khusus jika diminta; default Dwarf/Gnome dan teknologi sudah sama rata.
- Kecocokan slot tubuh dan senjata; bobot bagian armor eligible sudah sama rata.
- Skala angka Durability/Fight/Speed dan pengaruh hasil pada kandidat/peluang berikutnya.
- Profil kemampuan, pengoperasian, enchantability, dan batas mastery senjata teknologi.

Data: [definisi armor dan teknologi](../content/dwarf-gnome-events-design.json),
[cabang roda ras](../content/race-wheel-design.json),
dan [kontrak framework](../framework/spec.json).
