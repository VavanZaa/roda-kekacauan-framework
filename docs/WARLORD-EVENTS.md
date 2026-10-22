# Event Warlord

**Jenis Pasukan → identitas ras → Jumlah Pasukan untuk setiap ras.**

Jenis Pasukan memakai 18 family ras yang sudah ada dan satu sektor **Multi Race**,
sama rata. Pemakaian family kanonis ini adalah susunan awal yang dapat diedit:
Goblin, Orc dan Troll masih berada di family Goblin & Orc sebelum spin subtype.

Single Race langsung memakai family yang terpilih. Multi Race memutar **1 / 2 / 3**
sama rata, lalu memilih sebanyak itu kelompok ras. Untuk setiap kelompok,
selesaikan identitasnya dan spin jumlahnya sendiri sebelum kelompok berikutnya.
Hasil Multi Race **1** tetap sah.

Lelembut → Lokal → **Pocong** berhenti di Pocong. Mythical Beast → Impor →
**Dragon** berhenti di Dragon, tanpa spin bentuk tubuh atau elemen. Identitas lain
menggunakan jalur selector Slayer yang sudah ada: Kurcaci/Gnome berhenti sebelum
armor/tech; wrapper dapat memilih host/base/origin atau dua komponen Hybrid.
Elemental/Element Golem boleh memilih elemen sebagai identitas material saja.

## Roda jumlah sesuai ras

Gunakan angka **dan peluang** dari profil Slayer yang cocok dengan identitas
pasukan. Vampire langsung memakai enam angka dari roda Vampire. Ini merupakan
view jumlah pasukan dari sumber kanonis, sehingga perubahan katalog nantinya
dikelola di sumber yang sama; setiap run menyimpan snapshot peluang/versinya.

| Profil sumber | Contoh pasukan | Pilihan jumlah, berurutan | Peluang %, urutan yang sama |
| --- | --- | --- | --- |
| swarm | Goblin, Household Appliance | 0 / 1 / 5 / 10 / 50 / 100 / 500 / 1.000 / 5.000 / 10.000 | 8 : 8 : 11 : 16 : 16 : 13 : 10 : 8 : 5 : 5 |
| common | Manusia, Pocong, Gnome, Anime NPC | 0 / 1 / 2 / 5 / 10 / 20 / 50 / 100 / 500 / 1.000 | 10 : 14 : 16 : 16 : 13 : 10 : 6 : 5 : 5 : 5 |
| trained | Kurcaci, High/Dark Elf, Orc Warrior | 0 / 1 / 2 / 3 / 5 / 10 / 20 / 50 / 100 / 500 | 15 : 20 : 16 : 12 : 10 : 7 : 5 : 5 : 5 : 5 |
| elite | Forest Elf, Genderuwo, Mummy | 0 / 1 / 2 / 3 / 5 / 10 / 20 / 30 / 50 / 100 | 24 : 20 : 14 : 10 : 7 : 5 : 5 : 5 : 5 : 5 |
| formidable | Troll, Ghost, Griffin, Rock Golem | 0 / 1 / 2 / 3 / 5 / 7 / 10 / 15 / 20 / 50 | 29 : 22 : 12 : 7 : 5 : 5 : 5 : 5 : 5 : 5 |
| apex | Dragon, Oni, Angel, Barong | 0 / 1 / 2 / 3 / 4 / 5 / 7 / 10 / 15 / 20 | 33 : 22 : 10 : 5 : 5 : 5 : 5 : 5 : 5 : 5 |
| legendary | Pahlawan Legendaris, Demigod, Lich, Phoenix | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 10 | 41 : 19 : 5 : 5 : 5 : 5 : 5 : 5 : 5 : 5 |
| divine | God, Raja Iblis Agung | 0 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 | 48 : 12 : 5 : 5 : 5 : 5 : 5 : 5 : 5 : 5 |
| Vampire | Vampire langsung | 0 / 1 / 5 / 10 / 100 / 1.000 | Bobot 5 : 4 : 3 : 3 : 2 : 1 |

Pemetaan semua subtype mengikuti `quantityAssignments` Slayer. Dragon memakai
profil **apex** yang sudah tercatat pada hasil Dragon; tidak perlu spin bentuk
Dragon untuk menentukan jumlah. Contoh: pasukan Goblin bisa mencapai 10.000,
Manusia 1.000, Dragon 20, God 9. Ini angka permainan dari desain sebelumnya.

Vampire memiliki peluang **27,78% / 22,22% / 16,67% / 16,67% / 11,11% / 5,56%**.
Semua hasil jumlah Slayer tetap minimal 5% sesuai sumbernya. Selector ras tetap
memakai peluang kanonis; Equalizer aktif mengikuti prioritas odds yang sudah ada.

## Kelompok, composite dan history

Satu identitas pasukan = **satu kelompok dan satu spin jumlah**. Pasukan Hybrid
atau Symbiote tidak menambah spin jumlah untuk setiap komponennya. Klasifikasi
composite mengikuti Slayer: gunakan komponen terkuat, minimum dan promotion
wrapper yang sudah ditentukan. Vampire yang hanya menjadi host/origin/komponen
menggunakan rank Slayer untuk klasifikasi composite, bukan override Vampire langsung.
Anime NPC memakai common; MC memakai genre, lalu Sci-fi role bila relevan.

Sebagai aturan implementasi, kelompok Multi Race memakai family berbeda dengan
`usedArmyFamilyIds` tersendiri, termasuk family dari nested chain. History ras
karakter tidak menjadi filter pasukan: karakter Human tetap boleh memimpin Human.
Simpan identity tree tiap kelompok agar hasil dapat dilanjutkan dan diputar ulang.

Hasil **0** tetap dicatat, tanpa spin ulang. Total pasukan Warlord adalah jumlah
seluruh kelompok dari event ini. Army lama Goblin/Orc dan posisi Bos/Kacung-nya
tetap punya record sumber masing-masing; Warlord memimpin kelompok barunya.

Contoh hasil: **Multi Race → 3 → Goblin 500 → Pocong 20 → Dragon 2**.
Total pasukan dari event Warlord: **522**. Angka contoh bukan hasil spin aktual.

## Kontrak engine dan narasi

View selector mengambil hanya ID, label dan bobot. View jumlah mengambil hanya
source outcome ID, angka dan peluang; label korban diganti menjadi pasukan.
Hadiah Strength Slayer, bonus feeding Vampire, Cursed Power dan event ras pasukan
tidak ikut dipanggil. Warlord memperoleh army; belum ada bonus personal stat,
mastery atau power yang ditentukan. Kemampuan pasukan/kontribusi pertempuran
memerlukan profil tersendiri.

Simpan mode, jumlah kelompok, identity tree, pilihan profil jumlah, odds/versi,
hasil dan source ID tiap spin, history army serta ordinal berikutnya. Commit satu
group record per hasil jumlah; resume/retry media tidak menggandakan pasukan.
Backstory dimulai setelah semua kelompok selesai dan semua reaksi tercatat.

Konteks narator ditumpuk setelah setiap spin aktual. Contoh caption:

- “Dua dragon. Udah cukup buat bikin grup sebelah bubar.”
- “Pasukan nol. Warlord solo queue.”

Caption tidak otomatis mengaktifkan funny-result hook. Siluman memakai tepat satu hewan dari 12 pilihan sebagai identitas pasukan; tidak menjalankan grant transformation atau Nyolong.

Desain Warlord tersimpan; executor dan profil kemampuan/body fit belum dibuat.
Progres **26 core event**, berikutnya **Champion's Legacy**.
[Desain terstruktur](../content/warlord-events-design.json).


## Tiga ras baru dari video kedua

Warlord0.4 memakai23 pilihan Jenis Pasukan:22 keluarga ras dan Multi Race, setiap bobot1 atau sekitar4,35% sebelum exclusion/modifier. Slime/Centaur/Cosmic memakai assignment jumlah Slayer1.4 tanpa hadiah korban atau hadiah Race. Warlord berhenti pada tipe Slime/hewan tubuh bawah/kelompok media, sebelum Element/warna Ultraman. Profil jumlah lama dan aturan satu spin tiap kelompok tetap sama.

Cosmic memakai enam kelompok aktif. Saint/Lantern berhenti sebelum armor/cincin; Ultraman tetap sebelum warna. Tidak menambahkan power atau equipment kepada pasukan.
