# Hewan Siluman Roda Kekacauan

Siluman memilih tepat satu jenis hewan dari dua belas pilihan. Pilihan hewannya mengikuti tema keramat, cerita siluman, dan folklor yang dekat dengan penonton Indonesia, dengan rujukan impor yang familiar. Dua belas pilihan hewan di bawah sudah disetujui. Siluman memperoleh Animal Transformation untuk berubah menjadi hewan hasil spin dan kembali ke bentuk asal.

## Pilihan hewan

| Hewan | Rujukan | Motif cerita | Status |
| --- | --- | --- | --- |
| Harimau | Lokal | [Inyiak dan harimau yang dihormati dalam tradisi Minangkabau](https://ppi.unas.ac.id/dialog-kemerdekaan-konservasi-harimau-melalui-pendekatan-budaya-dan-spiritualitas-di-uin-imam-bonjol/) | Disetujui |
| Serigala | Impor | [Werewolf](https://ehillerman.unm.edu/3076) | Disetujui |
| Babi | Lokal | [Babi Ngepet](https://www.liputan6.com/regional/read/6036110/asal-usul-teror-babi-ngepet-kisah-mistis-yang-sering-dikaitkan-pesugihan) | Disetujui |
| Ayam | Lokal | [Ayam Cemani](https://www.kedirikota.go.id/p/dalamberita/9955/pemkot-kediri-bagikan-hasil-bumi-selesai-upacara-manusuk-sima-peringati-hari-jadi-ke-1142) | Disetujui |
| Ular | Lokal | [Cerita rakyat Siluman Ular](https://badanbahasa.kemendikdasmen.go.id/resource/doc/files/SMP-Siluman_Ular.pdf) | Disetujui |
| Buaya | Lokal | [Siluman Buaya Putih dalam dongeng Aji Saka](https://repositori.kemendikdasmen.go.id/7308/1/Kisah%20Anak%20Seberang%20Sungai.pdf) | Disetujui |
| Kera | Lokal | [Kera putih dalam wayang dan Ramayana](https://www.indonesia.travel/id/id/destination/bali-nusa-tenggara/bali/ubud---kecak-dance) | Disetujui |
| Kerbau | Lokal | [Kerbau bule Kyai Slamet dan kirab Suro Surakarta](https://diskominfosp.surakarta.go.id/detail-berita/ribuan-warga-saksikan-kirab-pusaka-malam-satu-suro-di-surakarta-7537) | Disetujui |
| Rubah | Impor | [Kitsune](https://www.japan.travel/en/de/gaming-in-japan/pokemon-und-japanische-mythen/) | Disetujui |
| Kucing | Impor | [Nekomata dan Bakeneko](https://www.japan.travel/en/japan-magazine/a-trail-of-cats-journey-through-culture-folklore-and-hidden-dest/) | Disetujui |
| Kelelawar | Adaptasi game | Hewan pilihan pengguna; belum memakai identitas folklor khusus | Disetujui |
| Elang | Adaptasi game | Hewan pilihan pengguna; belum memakai identitas folklor khusus | Disetujui |

Label roda memakai nama hewan. Lokal dan Impor menjadi keterangan sumber cerita, sehingga pemilihan hewan tidak memerlukan roda asal tambahan. Ayam Cemani adalah motif untuk Ayam; Nekomata dan Bakeneko adalah dua rujukan untuk satu pilihan Kucing. Warna, jumlah ekor, dan identitas tokoh tidak menjadi hasil selector baru.

Cemani memiliki hubungan dengan upacara yang dicatat Pemerintah Kota Kediri. Kerbau bule dihormati dalam tradisi kirab Surakarta. Kedua rujukan ini memberi tema untuk adaptasi Siluman di game; tradisi tersebut sendiri tidak menetapkan keduanya sebagai ras siluman. Hanoman memberi rujukan kera putih dari wayang dan Ramayana, sedangkan identitas Hanoman sebagai Reinkarnasi Pahlawan Legendaris tetap memakai jalurnya sendiri.

## Animal Transformation

Bentuk normal Siluman adalah **humanoid dengan ciri hewan terpilih**. Setelah satu spin hewan, karakter memperoleh **Animal Transformation (Transformasi Hewan)** untuk berubah menjadi hewan itu sepenuhnya dan kembali ke tubuh normal. Hasil Harimau membuka bentuk Harimau; hasil Elang membuka bentuk Elang. Tidak ada spin jumlah, dominasi, fusion, atau hewan kedua.

Power langsung masuk inventory, memakai satu Power Mastery bersama pada tahap normal dan tetap dimiliki jika main Power mendapat None. Tidak ada bonus stat atau power tambahan dari nama hewan. Detail pemakaian, perlengkapan, dan acuan ukuran tubuh humanoid masih perlu profil.

## Babi Ngepet: Nyolong

Komponen **Babi** memperoleh **Nyolong** sebagai interpretasi rute permintaan
power Babi Ngepet. Definisinya bersama dengan Tuyul di [data event Lelembut](../content/lelembut-events-design.json).
Grant diberikan sekali per komponen sumber Siluman yang memperoleh Babi, ditempel pada reaksi
hasil Babi, tanpa selector atau spin tambahan. Animal Transformation tetap diberikan terpisah
saat pemilihan hewan selesai. Kedua power mengikuti mastery nanti, termasuk bila main Power None.
Hasil hewan lain tidak memberi Nyolong. Target, biaya, kapasitas, dan limits-nya masih menunggu balance.

Contoh narasi: “Babi dapet Nyolong. Barang lu aman? Coba cek lagi.”
Nyolong tetap dimiliki setelah hasil Babi; Animal Transformation
mengikat satu hewan yang benar-benar didapat. Memutar ulang media atau memproses kembali
komponen Babi yang sama tidak menambah grant atau mastery baru.

## Konteks setelah hasil hewan

Setiap putaran mencatat hewan terpilih, urutan komponen, dan sumber hasilnya. Narator membaca komponen yang sudah didapat serta motif cerita sebagai rujukan opsional. Motif tidak membuktikan power tambahan, kutukan, bonus stat, bentuk tubuh, atau tokoh tertentu. Animal Transformation dan Nyolong khusus Babi berasal dari aturan pengguna. Detail itu baru masuk konteks ketika aturan event dan hasilnya sudah ditetapkan.

Contoh konteks setelah Harimau: “Karakter memperoleh satu komponen Harimau. Tema yang dipakai mengingatkan pada harimau yang dihormati dalam cerita dan tradisi lokal; kemampuan serta stat tetap mengikuti hasil dan aturan permainan.”

Contoh hasil Ayam: “Siluman Ayam. Bentuk normal humanoid berciri ayam; bisa berubah jadi ayam penuh lewat Animal Transformation.” Konteks mencatat hasil dan grant sebelum reaksinya dibekukan.

## Event dan peluang

**12 adalah jumlah pilihan di roda, bukan jumlah hewan per karakter.** Setiap karakter melakukan tepat **satu spin hewan**, bobot 1 tiap jenis atau **1/12 ≈ 8,33%** sebelum modifier. Kelelawar dan Elang melengkapi sepuluh jenis sebelumnya. Seluruh jumlah/fusion dan interpretasi dua belas komponen dipensiunkan; journal lama tetap dibekukan.

Arah pengaruh stat, power, dan senjata pada data masih rancangan balance. Animal Transformation merupakan grant bersama dari aturan pengguna; Babi memperoleh grant khusus Nyolong. Tidak ada spin power universal atau bonus angka baru untuk Siluman. Power ini mengikuti gate mastery biasa. Ukuran badan Siluman membutuhkan profil bentuk dan sumber ukuran tersendiri pada tahap Size.

Kelelawar dan Elang kini aktif atas pilihan pengguna. Hiu dan Kuda tetap berupa riwayat usulan. Daftar 39 ras dari video tetap utuh.

Lihat [roda ras](RACE-WHEEL.md), [keputusan](DECISIONS.md), [data roda](../content/race-wheel-design.json), [power Siluman](../content/siluman-events-design.json), [spesifikasi](../framework/spec.json), dan [catatan sumber](../reference/race-content-research.json).
