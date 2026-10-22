# Roda Power Universal

Setiap tema memakai satu roda kanonis yang dibagi semua caller. Divine, Cursed, Demonic dan Angelic sekarang **20 pilihan per roda**, diurutkan **Tier 1–5** dengan empat pilihan per tier. Isi dan penempatan baru adalah kurasi game yang bisa kita ubah.

| Tema | ID | Pilihan | Caller aktif |
| --- | --- | --- | --- |
| Holy | power-holy | 12 | High Elf |
| Cursed | power-cursed | 20 | Dark Elf, Oni, Leak, Vampire 1.000 korban; Archetype Cursed 0–3 sesuai persentase |
| Blood | power-blood | 12 | Blood Elf |
| Cosmic | power-cosmic | 12 | Size di atas acuan Bumi |
| Symbiote | power-symbiote | 12 | Takeover 80/90% satu; 100% dua |
| Divine | power-divine | 20 | God dua; Pemuka Agama satu; Apostle God satu |
| Demonic | power-demonic | 20 | Raja empat; Iblis dua; Fallen Angel satu; Apostle Devil satu |
| Angelic | power-angelic | 20 | Angel dua; Priest/Bishop/Fallen Angel satu; Paladin Biasa satu; Nirvana High Paladin tiga |

Demonic sekarang punya roda sendiri. Fallen Angel menjalankan **1 Demonic lalu 1 Angelic**. Bonus stat, pengikut dan mastery caller tetap mengikuti event masing-masing. Orang Saleh tetap Komunikasi dengan Tuhan. Holy/Blood/Cosmic/Symbiote mempertahankan pool lamanya.

Setiap pilihan di roda 20 hasil berbobot dasar 1: **5% per power**, atau **20% per tier** sebelum modifier yang memang disetujui. Tidak ada spin tier terpisah. Power Tier mengukur kemampuan intrinsik; mastery mengukur penguasaan, di-spin satu kali untuk semua power. Hasil None di main Power tidak membuang grant sebelumnya.

Delapan tema memiliki 128 slot outcome, memakai 93 definisi lokal dan satu referensi Flight yang sudah kanonis. Power sama di beberapa tema memakai satu definisi. Devil Avatar dan Infernal Sovereignty berpindah dari membership Cursed baru ke Demonic tanpa mengubah definisi/tier lama. Demon Wings memakai Flight Tier 2 dengan label sumber berbeda.

Versi katalog baru berlaku untuk invokasi baru; jurnal lama menjaga hasil, bobot, routing dan reward asalnya. Alias Elf tetap lookup ID lama. Snapshot sebelumnya ada di [referensi versi lama](../reference/power-themes-before-2026-10-09.json). Keputusan Archetype lama terikat ID power, bukan nomor sektor baru. Kasus baru yang belum punya profil explicit menjadi needs_configuration.

## Element sebagai selector universal

[Element universal](../content/universal-element-wheel-design.json) mempunyai satu selector
`element-universal`, dengan **12 pilihan sama rata**, sekitar 8,33% sebelum modifier.
Element Pixie, Naga, Golem Elemen, Elemental, Dragon, dan Slime Elemental mendapat satu
elemen dan satu power terkait melalui mapping caller yang sama. Lihat
[roster dan scope Element](ELEMENT-WHEEL.md). Selector ini terpisah dari tema Power di atas.

Fire Manipulation berada pada authority Element bersama empat manipulation lain,
dan dipakai juga oleh grant Summer Fey Elf serta Banaspati dengan ID/scope yang sama. Banaspati
mendapat grant tetap Kendali Api tanpa spin Element tambahan. Tujuh power tetap
Elf masih berada di file Elf; referensi shared-nya kini 45. Sumber musim/caller tidak ikut
menjadi identitas Pixie. Tujuh pilihan Element memakai definisi dari katalog lain melalui
referensi kanonis; Kegelapan adalah satu definisi baru. Cahaya diberi sebagai power biasa,
Void mempertahankan Tier 5, keduanya tetap memakai mastery bersama yang normal.
Lihat [Event Peri](FAIRY-EVENTS.md) untuk mapping dan mastery.

## Satu invokasi satu power

Setiap invokasi menarik satu hasil dan memberikan tepat power terpilih. Urutan potensi tidak
menentukan mastery, rarity, stat, atau Apex. Bobot dasar setiap hasil kini 1 sesuai default pengguna: 1/12 untuk Holy/Blood/Cosmic/Symbiote, dan 1/20 untuk Cursed/Divine/Demonic/Angelic. Distribusi normal Size tidak otomatis menjadi bobot
semua power.

Simpan asal keluarga/subtype/event, sumber spin, tahap, component slot, dan return point yang
sebenarnya. Oni tetap Oni setelah memanggil Cursed; Cosmic tidak otomatis mengubah ras.
Grant awal menunggu Power Mastery pada tahap normal dan tetap dimiliki bila main Power None.
Grant terlambat mewarisi hasil mastery bersama yang sudah tersedia. Jika belum pernah ada
hasil mastery dan tahap awal kosong, power pertama belakangan memanggil draw pertama/satu-satunya.
Tidak ada enchant power.

## Cosmic Power dengan 12 pilihan

Daftar berikut berurutan dari potensi ringan ke paling luas menurut desain game. Nama, scope,
serta urutan merupakan konten yang didelegasikan, bukan daftar kemampuan ilmiah atau paket
canon sebuah franchise. Range, cost, resistance, durasi, kapasitas, dan limits mastery akan
ditetapkan dalam balance. Satu hasil tidak otomatis memberi seluruh pilihan di bawahnya.

| Urutan | Power | Scope draft |
| --- | --- | --- |
| 1 | Cosmic Sense | Merasakan energi kosmik dan arah benda langit dalam jangkauan yang ditentukan. |
| 2 | Cosmic Ray | Menyalurkan sinar energi kosmik untuk serangan terarah. |
| 3 | Stardust Manipulation | Mengendalikan debu serta partikel bertema kosmik untuk bentuk dan gangguan. |
| 4 | Cosmic Barrier | Membentuk penghalang energi kosmik untuk perlindungan. |
| 5 | Meteor Summon | Memanggil fragmen meteor untuk serangan area dengan jumlah dan ukuran terbatas oleh profil. |
| 6 | Solar Flame | Menghasilkan dan mengendalikan api atau plasma bertema Matahari. |
| 7 | Gravity Manipulation | Mengubah tarikan gravitasi pada area dan target yang memenuhi batas power. |
| 8 | Orbital Dominion | Mengatur lintasan orbit benda yang berada dalam domain kendali. |
| 9 | Space Fold | Melipat ruang untuk perpindahan atau portal pada jarak yang ditentukan. |
| 10 | Cosmic Time Dilation | Mempercepat atau memperlambat laju waktu dalam domain terbatas. |
| 11 | Black Hole Manifestation | Menciptakan pusat tarikan bertema black hole dengan durasi dan kapasitas yang dibatasi. |
| 12 | Celestial Forge | Membentuk konstruksi kosmik dan inti energi menyerupai bintang melalui proses yang ditentukan. |

## Konteks hasil Cosmic

Konteks dipakai hanya setelah hasil yang bersangkutan committed. Kandidat yang tidak
terpilih tidak menjadi kemampuan karakter.

| Hasil | Konteks untuk narator |
| --- | --- |
| Cosmic Sense | Mulai dari membaca tanda kosmik; belum bisa mengubah ruang atau gravitasi. |
| Cosmic Ray | Karakter mendapat sinar kosmik; kekuatan dan ketepatannya masih mengikuti balance dan mastery. |
| Stardust Manipulation | Debu kosmik dapat diarahkan; ini tidak otomatis berarti bisa membentuk seluruh planet. |
| Cosmic Barrier | Power kosmik kali ini memberi pertahanan; ukuran tubuh tidak menentukan kemampuan mastery. |
| Meteor Summon | Fragmen meteor menjadi power miliknya; skala tabrakan belum dipastikan oleh nama. |
| Solar Flame | Karakter memperoleh Solar Flame, tanpa otomatis menjadi bintang atau kebal panas. |
| Gravity Manipulation | Gravitasi masuk daftar power; radius dan kendalinya ditentukan kemudian. |
| Orbital Dominion | Karakter dapat memengaruhi orbit benda yang memenuhi syarat; semua planet tidak otomatis tunduk. |
| Space Fold | Space Fold membuka kemampuan ruang; power ini tidak menggantikan hasil Speed yang sudah diputar. |
| Cosmic Time Dilation | Karakter mendapat dilatasi waktu kosmik; ini tidak otomatis menulis ulang seluruh sejarah. |
| Black Hole Manifestation | Manifestasi black hole menjadi potensi power; tidak menjamin menelan apa pun tanpa batas. |
| Celestial Forge | Hasil tertinggi draft ini membentuk konstruksi kosmik; biaya, skala, dan mastery tetap berlaku. |

Ambang serta urutan grant dari ukuran dijelaskan dalam [Size dan Event Raksasa](SIZE-RAKSASA-EVENTS.md).
Data wheel dan definisi power mempunyai satu authority yang dapat dipanggil semua jalur;
reaksi membaca fakta yang sudah tersimpan dan tidak mengubah power atau peluangnya.

## Symbiote Power dengan 12 pilihan

Takeover 80/90% membuka satu invokasi; 100% dua invokasi berurutan. Tiap invokasi tetap satu
spin dan satu power dari roda yang sama, dengan reaksi/provenance sendiri. Bonus stat dan
total threshold mengikuti [Event Symbiote](SYMBIOTE-EVENTS.md). Urutan berikut hanya urutan
katalog, tanpa menetapkan strength, rarity atau mastery.

| Power | Scope draft |
| --- | --- |
| Tendril Control (Tentakel Ngaret) | Sulur untuk meraih, menarik, atau mengikat. |
| Wall Crawl (Nempel Tembok) | Menempel dan bergerak di permukaan. |
| Body Stretch (Badan Ngaret) | Memanjangkan bagian tubuh/symbiote. |
| Blade Morph (Badan Jadi Sajam) | Membentuk bagian symbiote menjadi mata pisau. |
| Shield Morph (Tameng Organik) | Membentuk tameng organik aktif. |
| Organic Web (Jaring Organik) | Serat/jaring organik untuk mengikat. |
| Camouflage (Mode Nyamar) | Menyamarkan warna/pola dengan lingkungan. |
| Symbiote Sense (Radar Bahaya) | Indera untuk mendeteksi gerakan/ancaman. |
| Venom Spit (Ludah Toxic) | Serangan zat bertema venom. |
| Regeneration (Auto Tambal) | Memperbaiki kerusakan dengan syarat/cost. |
| Symbiote Clone (Pecah Badan) | Duplikat terbatas dari biomassa. |
| Hive Link (Grup Chat Symbiote) | Komunikasi/koordinasi melalui link yang memenuhi syarat. |

Bobot dasar sama rata (1/12); limits masih perlu ditetapkan. Power Symbiote mengikuti satu mastery bersama karakter,
termasuk jika main Power mendapat None.

## Divine Power dengan 20 pilihan

| Tier | Power | Scope |
| --- | --- | --- |
| 1 | Holy Spark | Percikan cahaya suci untuk menerangi atau mengganggu pandangan dalam skala kecil. |
| 1 | Sacred Sense (Peka Energi Suci) | Merasakan keberadaan energi suci di sekitar. |
| 1 | Blessed Water (Air Berkat) | Membersihkan air minum biasa dalam jumlah kecil; bukan pemurnian racun tubuh atau kutukan. |
| 1 | Comforting Prayer (Doa Penenang) | Menenangkan kegelisahan ringan satu orang; bukan dominasi kehendak. |
| 2 | Healing Touch | Sentuhan suci untuk memulihkan luka ringan. |
| 2 | Purify | Membersihkan racun atau pengaruh kutukan ringan. |
| 2 | Holy Shield | Membentuk perisai cahaya suci untuk melindungi diri atau satu sasaran. |
| 2 | Holy Arrow | Menembakkan proyektil energi suci tanpa membutuhkan busur fisik. |
| 3 | Sacred Flame | Menghasilkan api suci untuk serangan dan pemurnian area terbatas. |
| 3 | Sanctuary | Membentuk zona perlindungan suci untuk beberapa sekutu. |
| 3 | Sacred Binding (Segel Suci) | Mengikat atau menyegel sasaran yang memenuhi syarat dengan energi suci. |
| 3 | Holy Constructs (Bentuk Cahaya Suci) | Membentuk konstruksi cahaya suci sementara untuk beberapa fungsi; bukan grant equipment permanen. |
| 4 | Judgment Bolt | Memanggil hantaman energi suci dengan daya serang besar. |
| 4 | Divine Restoration | Pemulihan suci tingkat tinggi untuk luka berat dan kerusakan tubuh. |
| 4 | Seraph Form | Manifestasi wujud bersayap dan aura suci yang memperbesar ekspresi power ini. |
| 4 | Soul Dominion (Kendali Jiwa) | Berinteraksi, mengikat atau melepaskan jiwa yang memenuhi syarat sesuai limits; tidak otomatis mendapat semua power target. |
| 5 | Resurrection | Menghidupkan kembali satu makhluk yang baru gugur apabila syarat pemulihannya terpenuhi. |
| 5 | Divine Miracle | Mukjizat suci berskala medan pertempuran untuk pemulihan dan perlindungan luar biasa. |
| 5 | Divine Decree (Titah Ilahi) | Menetapkan perintah atau hukum bertema ilahi pada sasaran/domain yang memenuhi syarat dengan durasi dan resistance yang ditentukan. |
| 5 | Reality Rewrite (Edit Realitas) | Mengubah aturan/keadaan lokal dalam domain dan batas Divine Power yang dikonfigurasi; bukan semua konsep sekaligus. |

## Angelic Power dengan 20 pilihan

| Tier | Power | Scope |
| --- | --- | --- |
| 1 | Holy Spark | Percikan cahaya suci untuk menerangi atau mengganggu pandangan dalam skala kecil. |
| 1 | Sacred Sense (Peka Energi Suci) | Merasakan keberadaan energi suci di sekitar. |
| 1 | Blessed Water (Air Berkat) | Membersihkan air minum biasa dalam jumlah kecil; bukan pemurnian racun tubuh atau kutukan. |
| 1 | Comforting Prayer (Doa Penenang) | Menenangkan kegelisahan ringan satu orang; bukan dominasi kehendak. |
| 2 | Healing Touch | Sentuhan suci untuk memulihkan luka ringan. |
| 2 | Purify | Membersihkan racun atau pengaruh kutukan ringan. |
| 2 | Holy Shield | Membentuk perisai cahaya suci untuk melindungi diri atau satu sasaran. |
| 2 | Holy Arrow | Menembakkan proyektil energi suci tanpa membutuhkan busur fisik. |
| 3 | Sacred Flame | Menghasilkan api suci untuk serangan dan pemurnian area terbatas. |
| 3 | Sanctuary | Membentuk zona perlindungan suci untuk beberapa sekutu. |
| 3 | Sacred Binding (Segel Suci) | Mengikat atau menyegel sasaran yang memenuhi syarat dengan energi suci. |
| 3 | Holy Constructs (Bentuk Cahaya Suci) | Membentuk konstruksi cahaya suci sementara untuk beberapa fungsi; bukan grant equipment permanen. |
| 4 | Judgment Bolt | Memanggil hantaman energi suci dengan daya serang besar. |
| 4 | Divine Restoration | Pemulihan suci tingkat tinggi untuk luka berat dan kerusakan tubuh. |
| 4 | Seraph Form | Manifestasi wujud bersayap dan aura suci yang memperbesar ekspresi power ini. |
| 4 | Soul Dominion (Kendali Jiwa) | Berinteraksi, mengikat atau melepaskan jiwa yang memenuhi syarat sesuai limits; tidak otomatis mendapat semua power target. |
| 5 | Resurrection | Menghidupkan kembali satu makhluk yang baru gugur apabila syarat pemulihannya terpenuhi. |
| 5 | Divine Miracle | Mukjizat suci berskala medan pertempuran untuk pemulihan dan perlindungan luar biasa. |
| 5 | Absolute Protection (Perlindungan Mutlak) | Memberlakukan aturan perlindungan tingkat konseptual pada domain bersyarat; bukan imun permanen tanpa batas. |
| 5 | Rebirth Grace (Anugerah Kelahiran Ulang) | Memungkinkan kelahiran ulang jiwa/tubuh dengan syarat; tidak otomatis spin ulang Race atau event ras. |

## Demonic Power dengan 20 pilihan

| Tier | Power | Scope |
| --- | --- | --- |
| 1 | Demon Scent (Aroma Iblis) | Mengenali jejak energi iblis dekat karakter. |
| 1 | Imp Light (Lampu Neraka) | Membuat cahaya kecil bertema neraka untuk penerangan. |
| 1 | Sin Taste (Rasa Dosa) | Merasakan dorongan buruk sederhana yang dekat; bukan pembaca pikiran atau kebenaran mutlak. |
| 1 | Hell Voice (Suara Iblis) | Mengubah suara menjadi suara iblis; tanpa dominasi atau fear effect tambahan. |
| 2 | Devil’s Whisper | Bisikan infernal yang mengganggu fokus dan menanamkan kegelisahan. |
| 2 | Infernal Claw | Memanifestasikan cakar energi infernal untuk serangan dekat. |
| 2 | Demon Skin (Kulit Iblis) | Mengeraskan kulit untuk pertahanan fisik terbatas; tanpa bonus angka stat otomatis. |
| 2 | Demon Wings (Sayap Iblis) | Kemampuan bergerak melalui udara. |
| 3 | Hellfire | Menghasilkan api neraka sebagai serangan kutukan. |
| 3 | Life Drain | Menyerap sebagian energi hidup sasaran untuk memulihkan tenaga pengguna. |
| 3 | Infernal Body (Tubuh Infernal) | Memanifestasikan peningkatan tubuh infernal sesuai kapasitas profil; tanpa bonus angka stat otomatis. |
| 3 | Demonic Regeneration (Regenerasi Iblis) | Memulihkan luka tubuh sendiri dengan sumber daya; bukan Resurrection. |
| 4 | Devil Avatar | Memanifestasikan avatar infernal besar sebagai ekspresi tempur power ini. |
| 4 | Infernal Sovereignty | Menguasai pengaruh kutukan dan manifestasi infernal pada medan pertempuran luas. |
| 4 | Shadow Army (Pasukan Bayangan) | Memanifestasikan pasukan bayangan sementara; bukan grant jumlah pengikut atau pasukan permanen. |
| 4 | Demonic Domination (Dominasi Iblis) | Mendominasi pikiran sasaran terbatas dengan syarat dan resistansi; bukan Perintah Mutlak Royal. |
| 5 | Soul Contract (Kontrak Jiwa) | Mengikat jiwa melalui aturan kontrak supernatural yang ditentukan. |
| 5 | Infernal Reality (Realitas Neraka) | Menulis ulang aturan realitas dalam domain infernal yang ditentukan. |
| 5 | Sin Authority (Authority Dosa) | Mengatur dorongan dosa secara konseptual dalam domain; tidak memanggil roda Dosa atau tujuh power tambahan. |
| 5 | Abyss Genesis (Penciptaan Neraka) | Menciptakan materi atau manifestasi infernal sesuai domain; tanpa grant gear/army otomatis. |

## Cursed Power dengan 20 pilihan

| Tier | Power | Scope |
| --- | --- | --- |
| 1 | Bad Luck (Apes Kecil) | Menimbulkan kesialan kecil pada aktivitas sederhana; bukan kendali takdir menyeluruh. |
| 1 | Itch Curse (Gatal) | Menimbulkan rasa gatal ringan pada satu sasaran. |
| 1 | Hiccup Hex (Cegukan) | Membuat satu sasaran cegukan sebentar. |
| 1 | Stench Curse (Bau) | Menimbulkan bau mengganggu pada satu sasaran. |
| 2 | Devil’s Whisper | Bisikan infernal yang mengganggu fokus dan menanamkan kegelisahan. |
| 2 | Hex Mark | Menempelkan tanda kutukan yang mengganggu koordinasi atau fokus sasaran. |
| 2 | Infernal Claw | Memanifestasikan cakar energi infernal untuk serangan dekat. |
| 2 | Fear Glare (Tatapan Takut) | Menimbulkan ketakutan sementara lewat tatapan pada sasaran terbatas. |
| 3 | Hellfire | Menghasilkan api neraka sebagai serangan kutukan. |
| 3 | Life Drain | Menyerap sebagian energi hidup sasaran untuk memulihkan tenaga pengguna. |
| 3 | Torment Chains | Memanggil rantai kutukan untuk mengikat dan menekan sasaran. |
| 3 | Curse Transfer (Pindah Kutukan) | Memindahkan kutukan yang kompatibel antar sasaran sesuai batas profil. |
| 4 | Nightmare Prison | Menjerat persepsi sasaran dalam pengalaman mimpi buruk. |
| 4 | Demonic Possession | Mencoba mengambil alih kendali tubuh sasaran untuk sementara. |
| 4 | Soul Shackles | Mengikat jiwa sasaran untuk menekan kemampuan spiritualnya. |
| 4 | Abyss Domain | Membentuk wilayah kutukan yang memperkuat pengaruh infernal pengguna di dalamnya. |
| 5 | Causality Curse (Kutukan Sebab Akibat) | Mengubah hubungan sebab-akibat tindakan sasaran melalui aturan kutukan bersyarat. |
| 5 | Fate Blight (Kutukan Takdir) | Mengikat alur nasib sasaran pada kondisi buruk melalui kutukan konseptual. |
| 5 | Death Hex (Kutukan Kematian) | Memberlakukan kutukan kematian bersyarat; bukan kemenangan otomatis pada semua target. |
| 5 | Eternal Damnation (Kutukan Abadi) | Menambatkan kutukan pada keberadaan jiwa melampaui pemulihan biasa. |

## Concept sebagai selector bersama

God/Demigod/Utusan Tuhan memakai satu god-concept pada
[authority Concept](../content/universal-concept-wheel-design.json). Draft dua belas Concept
masih adjustable. God grant ber-role Authority dengan maksimum khusus instance tersebut;
Demigod/Utusan grant ber-role power biasa. Lihat
[event Heavenly Principle](HEAVENLY-PRINCIPLE-EVENTS.md) untuk odds, alur dan bonus sumber.


## Demonic dan roda Dosa

Demonic adalah pool power, sedangkan [Tujuh Dosa Besar](SEVEN-DEADLY-SINS.md) adalah selector tujuh dosa dengan grant terpisah. Iblis dan Pendosa tetap berbagi roda Dosa. Memperoleh satu Demonic Power tidak otomatis memanggil roda Dosa atau event Abyssal. Invokasi berulang tetap hasil/reaksi/sumber terpisah; tidak menjamin power berbeda.

## Android Power tambahan

`power-android` adalah satu module tema tambahan dengan 12 hasil sama rata, canonical
di [desain Machine](../content/machine-events-design.json). Caller lain yang nanti
disetujui memakai pool/definisi yang sama, provenance aslinya dan saved return. Satu
hasil memberi satu power; semua memakai satu Power Mastery bersama tanpa Enchant.
Delapan pool inti memakai 93 definisi lokal plus referensi Flight; Android tetap pool tambahan terpisah. AI Digital Being
adalah grant tetap, tidak membuka Android Power atau spin acquisition tambahan.


## Caller Vessel

Vessel memakai roda yang sama. God band30–50/60–80/90–100 memanggil Divine1/0/2 kali; God60–80 memanggil satu Concept Authority maksimum (senilai dua Divine); Raja memanggil Demonic1/2/4 kali. Setiap panggilan satu power kanonis dengan sumber Vessel dan reaksi sendiri; low0–20 tidak memanggil power. Half Raja memotong jumlah; God memakai valuasi Authority=dua Divine. Kapasitas/tier tetap. FullGod juga memakai Concept/Authority dan follower serta80% None normal Power; fullRaja follower. Tidak ada clone katalog/race dispatch.
