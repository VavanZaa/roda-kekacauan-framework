# Alchemist dan Roda Jamu

Pengguna menambah dua debuff dan dua ramuan pemberi superpower. Draft kini
**20 pilihan**: enam debuff, empat netral, empat buff +1, empat buff +2 dan
dua superpower. Nama, paket stat dan penempatan tier masih editable.

## Roda Minum Apa?

Working draft satu roda sama rata **5% tiap hasil**. Jumlah opsi menghasilkan
**6:4:4:4:2 = 30%/20%/20%/20%/10%** per kelompok. Ini interpretasi penambahan
slot dan equal default; pengguna belum menyebut rasio baru. Roster 16 opsi
dengan 4:4:4:4 tersimpan sebagai [riwayat inactive](../reference/alchemist-retired-roster-v1.json).
Snapshot lama mempertahankan peluang, resep dan hasilnya.

| Ramuan | Kelompok | Efek game |
| --- | --- | --- |
| Urat Madu Black | Debuff −1 | strength -1 |
| Pemersatu Bangsa | Debuff −1 | speed -1 |
| Tawon Liar | Debuff −1 | durability -1 |
| Ciu Oplosan | Debuff −1 | intelligence -1 |
| Montalin | Debuff −1 | durability -1 |
| Kuda Mesir | Debuff −1 | fight -1 |
| Air Putih | Minuman Netral | Tidak ada bonus/debuff |
| Kopi Tubruk | Minuman Netral | Tidak ada bonus/debuff |
| Teh Tawar | Minuman Netral | Tidak ada bonus/debuff |
| Es Sirup | Minuman Netral | Tidak ada bonus/debuff |
| Beras Kencur | Buff +1 | strength +1 |
| Kunyit Asam | Buff +1 | speed +1 |
| Sinom | Buff +1 | intelligence +1 |
| Cabe Puyang | Buff +1 | fight +1 |
| Temulawak | Buff +2 | strength +2 |
| Galian Singset | Buff +2 | speed +2 |
| Pahitan | Buff +2 | durability +2 |
| Kudu Laos | Buff +2 | intelligence +1, fight +1 |
| El Dorado Potion | Superpower | Gold Touch (Sentuhan Emas) — Tier 4 |
| Philosopher’s Stone Elixir | Superpower | Molecular Manipulation (Manipulasi Molekul) — Tier 5 |

Buff +2 bernilai dua poin angka total. Dua superpower elixir memberi masing-
masing satu power tetap, tanpa bonus stat/spin acquisition tambahan.
El Dorado memberi Gold Touch mengikuti arah legenda klasik pengguna.
Philosopher’s Stone memberi Molecular Manipulation, salah satu alternatif
yang pengguna izinkan; tidak memberi Creation luas sebagai power kedua.
Tidak mengimpor kutukan Macht atau mekanik kartu Sabatiel.

Power tetap milik karakter setelah main Power None, memakai satu Power
Mastery bersama. [Tier power](POWER-TIERS.md) terpisah dari mastery; mastery
tidak membuka Enchant. Tidak ada curse food/Midas atau race change otomatis.

## Nama dan sumber

Nama buff mengacu pada [Kemenkes](https://keslan.kemkes.go.id/view_artikel/2062/7-jamu-herbal-yang-wajib-kamu-tahu)
dan [Sinom Desa Indrodelik](https://desaindrodelik.gresikkab.go.id/artikel/2023/2/18/produk-umkm-krupuk-ikan-dan-jamu-sinom-tradisional).
Lima jamu debuff, termasuk Montalin/Kuda Mesir, tercantum dalam
[temuan BPOM Februari 2024](https://banjarbaru.pom.go.id/berita/bbpom-di-banjarmasin-sita-79-jamu-bko-senilai-rp-332-juta).
Konteks mengacu pada produk kasus tersebut. Ciu Oplosan mengikuti
[laporan Polsek Danurejan Juli 2025](https://jogja.polri.go.id/yogyakarta/tribrata-news/online/detail/polsek-danurejan-sita-miras-oplosan-dalam-operasi-cipta-kondisi.html).
Efek stat dan power merupakan aturan game. [Catatan sumber](../reference/alchemist-jamu-research.json).

## Konsumsi dan pencatatan

**Jumlah ramuan dikonfirmasi: tepat satu.**

Alchemist -> satu spin Minum Apa? -> minum hasilnya -> terapkan efek dan
reaksi -> Backstory. Tidak ada roda jumlah atau roda kelompok ramuan.
Hasil netral tetap dikonsumsi dan langsung lanjut tanpa reroll.

Freeze count=1, katalog, resep, ordinal 1 dan tier; efek dicatat sekali
lewat ledger. Replay tidak menghasilkan ramuan atau bonus kedua. Stat
final memakai base immutable plus semua modifier bertanda. Power dari
elixir memakai satu mastery bersama dan tetap dimiliki setelah None.

Caption cukup nama/hasil, tanpa menjelaskan joke atau menambah tag funny
baru. Batas efek serta body/role-fit tetap konfigurasi. Core event sudah
disetujui; helper runtime belum dibuat.
