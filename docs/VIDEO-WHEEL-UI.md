# Desain roda untuk video Roda Kekacauan

Roda memakai tema **Mesin Takdir** berdasarkan gambar brand yang diberikan pengguna: obsidian gelap, perunggu tua, dan bara. Ornamen terkonsentrasi pada bingkai; bidang nama tetap terang dan tenang. Setiap tahap punya aksen dan motif sendiri dalam dunia visual yang sama.

## Revisi episode dan keterbacaan — 11 Oktober 2026

Versi saat ini ada di `renders/episode-001-r2/roda-kekacauan-episode-001-r2.mp4`,
terhubung lewat player episode dan studio. Narasi audio dihapus atas permintaan
pengguna. Komentar hype tetap sebagai teks; setelahnya kartu menjelaskan event,
bonus, atau batasan hasil. Audio hanya musik prosedural dan efek suara roda.
Enchant muncul sesudah mastery senjata terkait dan penjelasan bonus yang sudah
diketahui; judul roda menyebut target senjata. Adapter mengecek tidak ada bonus
mastery dari tahap berikutnya yang mengubah gate pada contoh ini. Planner Enchant
umum masih memakai receipt fase akhir; ini adalah urutan penyajian replay.

Aturan roster ringkas kini disetujui: minimum peluang **2% untuk setiap kandidat
bernama** di main Weapon dan Power, melalui `framework/readable-acquisition.mjs`.
Pool dipilih sebelum hasil ditentukan. Default maksimum30 Weapon /20 Power di
luar None. Affinity karakter dan variasi dari seed memilih kandidat. None dan massa
tiap tier Weapon tetap mengikuti sumber; massa tier Power dapat dialokasikan ulang
dalam roster terpilih. Equalizer membuat semua hasil terpilih termasuk None sama
rata. Katalog lengkap tetap menjadi sumber grant. Proposal1% lama adalah riwayat.
Backstory video menggunakan16 pilihan setara dengan alias pendek pada roda dan
nama lengkap pada hasil; nama karakter tetap ada pada strip konteks.

## Audit excitement dan revisi brand — 11 Oktober 2026

Penilaian desain ini berdasarkan frame sebelumnya dan gambar brand pengguna, bukan data retention penonton. UI sebelumnya mempunyai lima kekurangan: bingkai terasa ringan dan belum mengikuti brand; energi visual hampir sama pada idle dan hasil; penunjuk kurang membantu mengikuti sektor saat perlambatan; angka stat belum menjadi fokus; semua jenis hasil memperoleh reveal yang serupa. Meme dan narator masih belum terhubung sehingga payoff humor belum dapat dinilai.

Revisi menambah bingkai logam berukir dengan tekstur aus, panel obsidian, ikon atribut atau motif tahap pada hub, sorotan sektor yang benar-benar lewat penunjuk, readout yang lebih tegas, dan nama tingkat stat yang terpusat. Ras memakai aksen jade; Weapon memakai kuningan; Power memakai ungu; Kekacauan memakai bara. Motif event turunan tetap mengikuti identitas event. Bara tidak berkedip terus-menerus.

Gerak memakai fase idle → spinning → anticipation → result. Anticipation dimulai pada 72% waktu putaran dan menaikkan sorotan secara halus sambil tetap mengikuti perlambatan asli. Tidak ada perubahan peluang, gerak mundur, atau near miss buatan. Hasil Tier 4–5, angka dasar ≥7, atau band strong mendapatkan reveal skala kecil 360 ms; hasil biasa memakai fade 200 ms; label funny berasal dari metadata aktual. None memakai label netral dan tanpa reward besar. Fixed memakai reveal langsung tanpa animasi putaran atau jingle. Reduced motion melewati putaran dan animasi reward.

Suara opsional berupa tick dan nada hasil yang disintesis, mati pada awal. Slot meme tetap kosong sampai klip yang sesuai hasil dihubungkan. Narasi menggunakan fakta hasil yang sudah tersedia, bukan hasil tahap berikutnya. Jangan menyebut Tier tinggi sebagai rare jika peluang aktualnya tidak mendukung.

Pendekatan efek yang jelas, selaras tema, dan dibatasi untuk menjaga keterbacaan mengikuti [Riot Games Visual Effects](https://www.riotgames.com/en/artedu/visual-effects). Pilihan warna, fase gerak, dan ambang reveal merupakan keputusan desain proyek ini; belum diuji pada penonton.

## Aset gambar dan lisensi

Gambar brand pengguna menjadi referensi warna dan material. Wajah penjaga tidak dipakai pada roda. Hub memakai ikon SVG sesuai tahap, misalnya palu untuk Strength, bulu untuk Speed, dan perisai untuk Durability.

Tekstur bingkai memakai diffuse **Rusty Painted Metal**, Amal Kumar / Poly Haven, dengan [lisensi CC0](https://polyhaven.com/license). [Sumber aset](https://polyhaven.com/a/rusty_painted_metal). Hanya peta diffuse yang diimpor, bukan render contoh situs. Derivative 512×512 dibuat grayscale lalu ditint perunggu; opacity pada bingkai 26%. Receipt ada di `ui/assets/brand/sources.json`. Hanya tekstur logam diembed pada `ui/brand-assets.mjs`; studio dan SVG dapat digunakan tanpa request jaringan.

Demo review senyap ada di `ui/assets/brand/spin-demo.mp4`: 540×960, 24 fps, 6,08 detik. Hasil Strength 7 dipilih untuk memperlihatkan alur; ini bukan undian atau karakter produksi. Render demo berasal dari SVG yang sama, tetapi belum merupakan renderer produksi untuk meme, narator, dan subtitle. Reveal scale/audio pada studio masih perlu QA interaksi di browser; frame statis, controller dengan DOM doubles, XML, dan stop putaran sudah diperiksa.


Prototipe interaktif ada di `preview/video-wheel-studio.html`, galeri di `preview/video-wheel-gallery.html`, dan perbandingan roster di `preview/wheel-density-comparison.html`. Semua dapat dibuka sebagai file lokal. Ornamen dibuat dari SVG dan kode, dengan ikon atribut serta satu tekstur CC0; tidak memakai image generation.

## Prinsip tampilan

UI game perlu memberikan informasi yang dibutuhkan pada saat yang tepat dan menjaga pengalaman tetap konsisten. Roda menjadi fokus saat berputar; hasil dan reaksi mengambil perhatian setelah berhenti. [Riot Games User Interface Design](https://www.riotgames.com/en/artedu/user-interface-design)

Font yang mudah dibaca, kontras teks, bahasa sederhana, dan penghindaran kedipan membantu keterbacaan. Warna selalu disertai nama hasil atau tingkat, sehingga warna bukan satu-satunya petunjuk. Angka stat/mastery dan Tier 1–5 tetap internal; sektor, kartu dan caption default tidak menampilkannya. Ukuran tubuh, jumlah atau persentase yang merupakan hasil event tetap dapat ditampilkan. [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/)

Frame memakai 1080 × 1920 dan rasio 9:16. Judul dan hasil ditempatkan jauh dari sisi kanan serta bagian bawah. Panduan TikTok untuk iklan mendukung video vertikal dan penempatan teks dalam area aman; penerapannya pada video organik di sini merupakan pertimbangan desain. Panduan editor ini dapat disesuaikan dengan tombol, perangkat, dan panjang caption yang digunakan. [TikTok Video Advertising Guide](https://ads.tiktok.com/business/en/guides/video-advertising-guide?redirected=1)

Teks nama pada sektor memakai tinta gelap dengan rasio kontras minimal 4,5 terhadap warna bidang yang diuji. Target ini mengikuti pedoman kontras teks; keterbacaan saat roda bergerak tetap membutuhkan nama pendek dan readout yang lebih besar. [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

## Tema tiap tahap

| Roda | Tema | Aksesori utama |
| --- | --- | --- |
| Ras | Papan silsilah | Daun, token, ukiran cabang |
| Archetype | Papan kontrak petualang | Bilah, lencana |
| Backstory | Buku perjalanan | Buku, tinta, pena |
| Size | Meja ukur | Penggaris, kompas |
| Strength | Bengkel besi | Palu, beban |
| Speed | Lintasan angin | Bulu, katrol |
| Durability | Benteng batu | Perisai, pecahan batu |
| Intelligence | Ruang strategi | Lensa, buku |
| Fight | Arena latihan | Balutan tangan, tongkat |
| Weapon | Rak persenjataan | Pedang, landasan besi |
| Weapon Mastery | Batu asah | Bilah, batu asah |
| Enchantment | Meja alkimia | Botol, rune |
| Power | Kabinet artefak | Orb, kristal |
| Power Mastery | Astrolabe | Orb, kompas dan cincin ukur |
| Weakness | Catatan tambalan | Kertas catatan, tambalan |
| Roda Kekacauan | Neraca dua sisi | Koin, jam pasir |
| Gelar | Piagam dan stempel | Gulungan, segel |

Sembilan tema tambahan memakai motif: Holy memakai lilin; Cursed memakai buku dan rantai; Divine memakai marmer dan piringan surya; Angelic memakai sayap dan pita; Demonic memakai besi gelap dan kontrak; Blood memakai kaca dan tinta merah; Cosmic memakai peta bintang; Symbiote memakai jaringan organik; Element memakai pecahan alam.

Roda event turunan memperoleh variasi stabil dari ID roda, label, dan tema induknya. Machine memakai motif alat dan lensa; Elf dan musim memakai daun atau elemen; chance memakai koin; jumlah memakai penggaris dan token. Variasi warna tidak memengaruhi peluang atau kekuatan. `resolveWheelTheme` dapat ditambah override khusus bila sebuah event membutuhkan motif baru.

Urutan pilihan dan ukuran sektor berasal dari pool yang sudah ditetapkan. Ras dan Archetype mempertahankan urutan lemah ke kuat yang lewat penunjuk saat putaran anticlockwise. Backstory mempertahankan urutan sumbernya. Daftar tema di editor bukan urutan eksekusi. Episode menampilkan Enchantment setelah Weapon Mastery target; receipt generation masih memenuhi guard fase akhir dan bonus mastery.

## Roster yang bisa diikuti penonton

Katalog 150 weapon dan 160 power memberi variasi antarvideo, tetapi seluruh nama sekaligus terlalu padat. Roster ringkas dipilih sesuai karakter sebelum hasil diundi. Kandidat receh dan pilihan kuat tetap muncul agar penonton bisa membayangkan hasil berikutnya.

Default membatasi weapon sekitar30 nama dan power sekitar20 nama, di luar None. Peluang setiap kandidat bernama minimal2%. Angka ini adalah parameter desain proyek, bukan batas keterbacaan yang berlaku universal. Sektor2% mempunyai sudut7,2°. Nama panjang tetap membutuhkan alias pendek dan readout lengkap.

| None | Massa peluang untuk kandidat | Maksimum nama jika setiap kandidat minimal 2% |
| --- | --- | --- |
| 0% | 100% | 50 |
| 20% | 80% | 40 |
| 50% | 50% | 25 |
| 80% | 20% | 10 |
| 90% | 10% | 5 |

Jumlah kandidat harus menyesuaikan None. Roda dengan None besar masih memiliki sektor bernama yang kecil walaupun rosternya pendek. Nama di bawah penunjuk membantu membaca kandidat tersebut. Nama hasil selalu ditampilkan lengkap; alias pada sektor tidak mengubah definisinya.

Mode **Ringkas — minimum 2%** memakai adapter yang sama dengan episode. Weapon mempertahankan massa peluang asli setiap tier, memilih paling banyak enam kandidat per tier, dan mempertahankan None. Power mempertahankan None, memilih kandidat dari kelima tier dengan prioritas bobot konteks dan variasi seed, lalu mendistribusikan ulang peluang di antara kandidat terpilih. Massa tiap tier Power dapat berubah.

Mode **Katalog penuh — aturan tersimpan** menggunakan fixture lama untuk melihat katalog. Roster ringkas tidak boleh dibuat setelah hasil produksi diundi. Plan yang sudah memiliki committedOutcomeId diputar apa adanya. Studio hanya memainkan hasil dan tidak mengonsumsi gelar produksi.

## Lapisan yang dapat dianimasikan

Seluruh SVG memakai kanvas yang sama. Pivot putaran adalah `(490, 785)`; ukuran kanvas 1080 × 1920. Bidang dan label berputar bersama, sementara pusat roda dan bingkai tetap diam.

| Lapisan | Isi | Gerak |
| --- | --- | --- |
| 00 | Latar | Diam |
| 01 | Panel obsidian | Diam |
| 02 | Aksesori belakang | Diam |
| 03 | Bayangan roda | Diam |
| 04 | Bingkai dan tanda ukur | Diam |
| 05 | Bidang sektor | Berputar |
| 06 | Label sektor | Berputar bersama bidang |
| 07 | Hub, ikon atribut dan tanda tahap | Diam; aksen mengikuti fase |
| 08 | Penunjuk | Sentuhan kecil saat melewati sektor |
| 09 | Mask sorotan sektor aktif | Geometry diperbarui mengikuti sektor aktual |
| 10 | Judul tahap | Diam |
| 11 | Konteks karakter | Diperbarui sebelum spin |
| 12 | Nama di penunjuk | Diperbarui saat perlambatan |
| 13 | Kartu hasil | Muncul setelah berhenti |
| 14 | Reaksi dan caption | Setelah hasil |
| 15 | Area aman | Khusus editor, tidak diekspor |

`ui/assets/manifest.json` berisi 26 paket tema. Setiap paket memiliki satu komposit dan 15 SVG lapisan. Lapisan di atas latar mempunyai transparansi dan koordinat yang sama. Studio juga dapat mengekspor komposit atau satu lapisan dari pool yang sedang ditampilkan. Font menggunakan Segoe UI atau Arial untuk label dan Georgia untuk judul; renderer pada komputer lain perlu menyediakan font yang cocok atau membuat outline saat produksi.

Studio memakai reaksi vektor. Episode menambahkan reaksi animasi original, komentar teks, penjelasan mekanik dan SRT/VTT. Narasi audio dimatikan. Klip meme komersial belum dihubungkan. Slot thumbnail berada pada `(93, 1480, 183, 119)`; caption diringkas sesuai ruang.

## Gerak dan sambungan engine

Putaran berakselerasi singkat, kemudian melambat hingga berhenti. Durasi demo 3,7 detik, dapat diatur 2,4–5,2 detik. Penunjuk memberi sentuhan kecil; hanya kartu hasil kuat mendapat perubahan skala tipis. Tidak memakai kilatan atau hujan partikel. Tick dan nada hasil opsional, mati pada awal. Mode reduced motion menampilkan hasil langsung.

`window.RodaWheelUI.mount(plan, options)` menerima pool yang sudah ditetapkan. `play({ outcomeId, duration, reaction, caption })` menerima hasil tersimpan dan hanya memutarnya. Keduanya tidak memberi hadiah, menjalankan event, atau menulis jurnal karakter. File JSON dengan `committedOutcomeId` dimainkan tanpa undian baru. Peluang yang tidak berjumlah satu ditolak, bukan dinormalisasi diam-diam.

Hasil fixed seperti Power Mastery God dan Durability Lich memakai reveal tanpa putaran. Kartu menampilkan nama tingkat; nilai numerik dasar tetap disimpan engine. Semua bonus dan debuff tetap diselesaikan pada fase akhir. Mastery tidak menciptakan Enchant dari preview. Shrek, Lucky Number, Pawn, dan konsumsi gelar hanya boleh diproses oleh executor gameplay atas sumber yang sah.

Bangun ulang studio dan SVG dengan `node ui/build-studio.mjs`. Jalankan pemeriksaan UI dengan `node --test --experimental-test-isolation=none ui/tests/wheel-ui.test.mjs ui/tests/brand-ui.test.mjs`. Render contact sheet opsional memakai package Sharp yang sudah tersedia, dengan lokasi paket pada variabel `RODA_NODE_PACKAGES`.

Untuk regenerasi demo review, set `RODA_NODE_PACKAGES`, jalankan `node ui/render-brand-demo.mjs`, lalu encode `ui/assets/brand/demo-frames/frame-%04d.png` pada 24 fps memakai FFmpeg H.264 yuv420p. File hasil demo sudah disertakan. Jangan menghubungkan preview ke persistence karakter.
