# Event Survivalist

Survivalist spin **Environment → Survival Chance**, lalu mendapat reward
terkait environment dan lanjut Backstory. Setiap roda mempunyai satu hasil dan
reaksi narator. Environment boleh berbeda jauh tingkat bahayanya.

## Survival Chance dan reward

Ada tepat **9 pilihan**: 0%, 12,5%, 25%, 37,5%, 50%, 62,5%, 75%, 87,5%, dan
100%. Setiap pilihan berpeluang 1/9 ≈ 11,11%. Angka pada label adalah nilai
chance yang didapat; bukan peluang sektor itu untuk terpilih.

| Hasil | Reward |
| --- | --- |
| 0–37,5% | +1 poin angka pada satu stat terkait environment. |
| Lebih dari 37,5% sampai 75% | Power terkait environment. Tanpa bonus stat. |
| Lebih dari 75% | Power dan bonus +1 stat yang sama. |

0% tetap masuk kelompok pertama dan memberi buff +1. Tidak ada spin tambahan
untuk menentukan hidup/mati, kematian otomatis, penalty atau reroll.

Karena peluang roda tidak ditentukan khusus, kedua roda memakai default sama
rata. Tingkat bahaya environment tidak otomatis mengubah peluang chance atau
besarnya bonus. Stat yang tinggi/power yang sudah dimiliki tidak memfilter atau
mengubah roda tanpa aturan baru.

## Draft dua belas environment

Lima tema pertama berasal dari contoh pengguna. Tujuh tambahan, label, stat
dan pasangan power berikut adalah draft editable untuk melengkapi alur;
roster final dan pairing bukan konfirmasi pengguna. Semua bobot dasar 1,
masing-masing 1/12 ≈ 8,33% jika dua belas ini dipakai.

| Environment | Buff stat +1 | Power |
| --- | --- | --- |
| Tundra Beku | Durability | Ice Control |
| Inti Gunung Berapi | Durability | Magma Control |
| Kolam Asam | Durability | Acid Control |
| Nuclear Wasteland | Durability | Radiation Control |
| Luar Angkasa | Durability | Space Adaptation |
| Palung Laut | Durability | Water Control |
| Gurun Tanpa Air | Durability | Sand Control |
| Hutan Beracun | Intelligence | Poison Control |
| Badai Petir | Speed | Lightning Control |
| Planet Gravitasi Ekstrem | Strength | Gravity Control |
| Dimensi Bayangan | Intelligence | Shadow Manipulation |
| Medan Perang Abadi | Fight | Battle Instinct |

Kolom buff dan power adalah resep reward, bukan hadiah otomatis saat memilih
environment. Tundra dengan 37,5% memberi Durability +1; 75% memberi Ice Control
saja; 87,5% memberi Ice Control dan Durability +1.

Hazard menjadi konteks fiksi, tanpa klaim peluang kematian nyata atau skala
difficulty numerik. Environment keras tidak memberi bonus tier, beberapa
power, +1 semua stat atau mastery tambahan.

## Power, stat dan sumber

Tujuh power memakai definisi kanonis yang sudah ada: Ice/Shadow di Elf,
Magma di Golem, Water pada Element, Sand pada Lelembut, Gravity pada Cosmic,
serta Lightning pada Pahlawan Legendaris. Lima definisi baru disimpan satu
kali di [desain Survivalist](../content/survivalist-events-design.json): Acid,
Radiation, Space Adaptation, Poison dan Battle Instinct.

Grant langsung memakai sumber Survivalist. Tidak menjalankan event Elf,
Golem, Element, Lelembut, Cosmic, hero atau ras lain, dan tidak menyalin konteks
musim/hero dari pemanggil sebelumnya. Manipulation tidak otomatis berarti
immunity. Space Adaptation berlaku pada tubuh sendiri sesuai batas power;
bukan kendali ruang-waktu atau immortality. Battle Instinct tidak menambah
stat numerik lain secara otomatis. Detail kapasitas/durasi/biaya masih terbuka.

Power menjadi owned power biasa, bertahan bila roda Power utama nanti None,
dan memakai satu Power Mastery bersama karakter. Tidak mendapat enchant atau
maximum override. Buff stat memakai modifier numerik setelah base stat yang
immutable, mengikuti batas skala yang nanti dikonfigurasi.

## Fungsi dan pencatatan

[Modul Survivalist](../framework/survivalist-event.mjs) berisi fungsi murni:

1. `planSurvivalistEnvironment({ invocationId, catalogVersion })` membekukan
   pool environment, resep reward dan pool chance.
2. `planSurvivalistChance(environmentPlan, environmentResult)` memakai
   environment aktual tersimpan dan menyiapkan sembilan hasil chance.
3. `resolveSurvivalistChance(chancePlan, chanceResult)` menghasilkan satu
   modifier, satu grant power, atau keduanya dengan satu `ledgerKey`.

Result memakai `{ invocationId, spinId, outcomeId }`. Engine mendatang melakukan
seeded spin dan menyimpan setiap plan sebelum draw. Commit reward atomik,
sehingga buff dan power pada hasil tertinggi diterapkan sekali. Resume dan
rerender memakai snapshot yang sama, tidak membaca ulang resep terbaru atau
memberi bonus dua kali. Helper tidak mengubah karakter, memutar RNG atau
menentukan hasil hidup/mati.

Narator setelah Environment hanya tahu tempat. “Spawn di dalam magma.” cukup
sebagai caption; chance dan reward belum diketahui. Sesudah Chance, tambahkan
nilai aktual serta grant yang benar-benar didapat. Fixed grant/buff tidak
membuat spin atau funny-result tag baru; hook Shrek mengikuti aturan katalog
aktual yang sudah ada.

Run dari root proyek:

```powershell
node --test framework/tests/survivalist-event.test.mjs
```

Aturan event disetujui. Roster/pairing editable, profil tubuh/role-fit, boost
band dan katalog runtime final tetap konfigurasi terpisah. Archetype
berikutnya: **Archaeologist**.
