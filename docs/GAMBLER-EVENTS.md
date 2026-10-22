# Gambler dan Mekanik Roll Stat

**Gambler -> spin Tipe Gambler -> jika Lucky Number, spin Angka Hoki -> Backstory -> Size -> stat -> Weapon/Mastery -> Power/Mastery -> Weakness -> Apex -> Title/event akhir -> bonus Lucky Number -> kartu final.**
Empat tipe sama rata **25% masing-masing**. Satu hasil mengaktifkan satu aturan.

| Tipe | Aturan main stat |
| --- | --- |
| All In | Satu raw roll; salin angka dasarnya ke kelima stat. |
| Double or Nothing | Sesudah setiap roll stat, spin Double/Nothing 1:1. Double = 2 × angka roll; Nothing = 0 pada angka dasar. |
| High Roller | Tiap roda stat berisi dua angka terendah dan dua tertinggi, sama rata sebelum modifier yang disetujui. |
| Lucky Number | Spin angka hoki 0–9. Setiap hasil stat atau mastery yang cocok memberi +1 untuk seluruh stat, dikumpulkan dan diterapkan di akhir. |

## All In

Working interpretation memakai **Strength**, stat pertama dalam alur normal.
Tidak ada roda tambahan untuk memilih stat. Satu raw roll Strength menyediakan
angka dasar untuk Strength/Speed/Durability/Intelligence/Fight. Empat slot
lain dicatat sebagai copied-base skip, dengan referensi spin Strength.

Contoh: raw Strength 6 menghasilkan kelima base 6. Bonus ras/peralatan tetap
mengikuti stat masing-masing, sehingga final stat bisa berbeda. Memakai first
Strength dan raw-only copy adalah interpretasi yang dapat pengguna ubah.
Copied reveal bukan spin tambahan dan tidak memicu committed-spin hook.

## Double or Nothing

Tepat setelah tiap raw roll stat dan reaksinya, spin keputusan **50:50**.
Simpan raw asli, lalu derived base 2 × raw atau 0. Bonus/debuff stat dicatat secara terpisah dan baru dijumlahkan
di finalize. Klarifikasi pengguna: raw 4 dengan bonus
+1 menghasilkan **9 jika Double**, atau **1 jika Nothing**.

Urutan: Strength -> keputusan -> Speed -> keputusan -> Durability -> keputusan
-> Intelligence -> keputusan -> Fight -> keputusan -> Weapon. Lima raw roll
dan lima keputusan, masing-masing dicatat/diberi reaksi. Tidak ada reroll.

## High Roller

Ambil dua nilai poin numerik terendah dan dua tertinggi dari pool stat yang
dikonfigurasi dan eligible. Empat nilai unik, bobot dasar 1 per nilai. Pada
pool aktif lengkap 0–9, pilihannya **0, 1, 8, 9**, masing-masing 25%.
Pakai nilai angka, bukan urutan label, rarity atau mastery.

Hard guard/guarantee dan modifier peluang yang disetujui tetap berlaku. Kurang
dari empat nilai eligible, alias nilai ambigu atau guarantee yang konflik
memerlukan konfigurasi. Tidak menambahkan angka atau melewati guard diam-diam.

## Lucky Number

Setelah mendapat tipe ini, spin **satu Angka Hoki: 0–9**, masing-masing **10%**.
Simpan angka itu sebelum Backstory dan semua roll stat/mastery. Roda angka hoki
sendiri tidak menghasilkan hit. Main stat tetap memakai lima roll normal.

Setiap hasil roll asli yang sama dengan angka hoki menghasilkan **satu hit**:

- Strength, Speed, Durability, Intelligence dan Fight.
- Setiap Weapon Mastery yang benar-benar diputar, termasuk weapon tambahan.
- Satu Power Mastery bersama, dihitung sekali berapa pun jumlah power.
- Spin stat tambahan/belakangan yang secara eksplisit ditandai sebagai spin
  stat numerik; grant bonus tetap atau spin jenis Apex bukan hasil roll stat.

Hit memakai angka hasil asli, **sebelum bonus stat/mastery**. Untuk mastery,
setiap label hasil harus punya mapping nomor 0–9 yang eksplisit dan dibekukan
bersama pool. Mapping sudah ditentukan pada [Skala 0–9](STAT-SCALES.md): Noob=0,
sembilan label lain=1–9. Jangan menebak nomor dari posisi sektor atau teks label. Hasil Power Mastery yang diproyeksikan ke lima power
tetap satu spin/satu kemungkinan hit. Power Tier 1–5 tidak menjadi hasil mastery.

Bonus diterapkan **sekali di finalize**, setelah Title dan semua event wajib
belakangan selesai, sebelum final stat dibekukan dan gambar dibuat:
**jumlah hit × +1 pada masing-masing dari kelima stat**. Tidak ada cap lima hit.

Contoh angka hoki **6**: Strength raw 6, Weapon Mastery bernomor raw 6,
dan Power Mastery bernomor raw 6 = **tiga hit, +3 pada semua stat**.
Tidak ada roda settlement. Bonus final, copy/skip, fixed override, reaksi,
render ulang dan replay tidak menambah hit.

## Cek video terakhir

Roda **Power Mastery memiliki 10 pilihan**, termasuk Darwizzy:
Dormant, Awakening, Controlled, Master, Archmage, Planetary, Cosmic,
Universal, Omnipotent, Darwizzy. Weapon Mastery juga memiliki sepuluh pilihan:
Novice, Apprentice, Adept, Expert, Master, Grand Master, Cosmic, Universal,
Transcendent, Darwizzy. Lihat [audit frame](../reference/stat-mastery-video2-reference.json).

Video mendukung jumlah/nama pilihan. Pengguna kemudian mengganti Darwizzy
dengan Noob=0 dan menetapkan label lain 1–9 pada proyek; catatan video tetap
mempertahankan nama aslinya. Pool lengkap proyek memakai default 10% tiap hasil.

## State, bounds dan replay

Raw stat result immutable; resolvedBaseValue mencatat salinan atau hasil
Double/Nothing. Formula final memakai resolved base, modifier stat independen,
lalu policy multiplier yang sudah dideklarasikan, semuanya dihitung di finalize. Nothing dapat menghasilkan
base 0 dan Double dapat melebihi nilai terbesar roda asal. Semua angka final, termasuk kedua
mastery, boleh negatif atau lebih dari 9 tanpa floor/cap.

Freeze tipe, versi, tiap pool/odds, raw outcome, keputusan dan source ledger.
Replaying hasil menambah nol spin/hit/modifier. Settlement Lucky Number sekali
setelah semua event dan spin eligible lengkap, di finalize. Jangan memakai aturan sumber video The Lucky
Fool secara otomatis; roster aktif adalah empat tipe langsung dari pengguna.

Mapping raw 0–9 sudah eksplisit. Label Intelligence 1–9,
body-role fit, komposisi constraint dan helper runtime masih konfigurasi. [Structured design](../content/gambler-events-design.json).

Versi aktif **gambler/0.3.0**. [Profil Lucky 7 lama](../reference/gambler-retired-profile-0.1.0.json)
disimpan inactive; journal lama tidak dihitung ulang memakai aturan baru.

## Waktu bonus

Semua bonus/debuff main stat baru dihitung di finalize, setelah semua spin
dan event wajib selesai. Selama alur, catat modifier sumber dan selesaikan
raw/copy/Double-Nothing base tanpa menambahkan bonus ke angka spin. Lucky
Number tetap menyetor modifier sekali pada akhir. [Snapshot aturan sebelumnya](../reference/before-stat-scales-resilient-2026-10-09.json) tidak dimigrasikan.

Jika kombinasi dengan Resilient kelak diotorisasi, setiap actual retry yang
cocok juga satu hit; best-selection/proyeksi bukan spin baru. Jadwal gabungan
Gambler/Resilient tetap perlu konfigurasi, bukan otomatis diberikan.
