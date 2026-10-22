# Jenis dan Event Golem

Golem memutar satu roda dengan **tujuh jenis: Pasir, Batu, Magma, Kristal, Berlian, Elemen,
dan Sampah**. Setiap jenis mendapat power manipulasi sesuai bahannya. Batu dan Magma memberi
Durability +1, Kristal +2, dan Berlian +3. Golem Elemen memilih elemennya melalui roda
Element universal yang sama dengan Element Pixie, Naga, dan Elemental. Golem Elemen juga
mendapat **+1 Power Mastery bersama**. Ketujuh jenis memakai bobot dasar 1: masing-masing 1/7 sebelum modifier.

## Jenis dan grant

| Jenis | Power yang didapat | Bonus Durability | Bonus Power Mastery |
| --- | --- | --- | --- |
| Golem Pasir | Kendali Pasir | — | — |
| Golem Batu | Kendali Batu | +1 | — |
| Golem Magma | Kendali Magma | +1 | — |
| Golem Kristal | Kendali Kristal | +2 | — |
| Golem Berlian | Kendali Berlian | +3 | — |
| Golem Elemen | Kendali elemen hasil spin Element universal | — | +1 |
| Golem Sampah | Kendali Sampah | — | — |

Pada hasil Pasir/Batu/Magma/Kristal/Berlian/Sampah, tambahkan satu fixed power ke daftar milik
karakter dan tampilkan bersama reaksi hasil jenis. Tidak ada acquisition spin tambahan untuk
grant tetap tersebut. Golem Elemen menyelesaikan satu spin Element terlebih dahulu, lalu
memperoleh satu power kendali elemen aktual sesuai mapping kanonis.

## Definisi power bersama

Golem Pasir memakai **Sand Manipulation** yang sudah digunakan Mummy, dengan ID dan scope
yang sama. Caller tetap Golem. Rock/Magma/Crystal/Diamond/Trash Manipulation memiliki satu
definisi masing-masing pada file event Golem; caller lain yang kelak diotorisasi dapat
mereferensikan definisi yang sama.

Power mengikuti material hasil spin. Sasaran tubuh sendiri atau material di luar tubuh,
jarak, jumlah, cost, durasi, dan batas kendali menurut rank masih perlu ditetapkan. Nama
material sendiri tidak menjadi immunity atau paket semua kemampuan lain.

## Golem Elemen

Saat jenis Golem Elemen terpilih, catat bonus **+1 Power Mastery** sekali dari hasil jenis
dan komponen tersebut. Bonus menaikkan satu rank mastery bersama untuk seluruh power milik
karakter, termasuk grant belakangan, sampai maksimum skala. Bonus aktif pada tahap mastery
yang normal; jika hasil bersama sudah ada, hitung ulang dari base tersimpan tanpa respin.

Setelah hasil Golem Elemen dan reaksinya selesai, panggil element-universal tepat satu kali
dengan sumber hasil serta lingkup komponen Golem yang sebenarnya. Catat elemen aktual pada
identitas Golem dan gunakan satu manipulation power dari hasil selector itu. Tidak ada
power elemen generik kedua yang ditambahkan di luar grant tersebut.

Element mempunyai [12 pilihan](ELEMENT-WHEEL.md), masing-masing sekitar 8,33% sebelum modifier;
tujuh jenis Golem tidak menetapkan peluang Element. Karakter tetap Golem dan hasil selector
tidak membuka event keluarga Elemental. Bonus +1 berasal dari jenis Golem Elemen, sehingga
caller lain pada roda Element tidak menerima bonus tersebut.
[Elemental](ELEMENTAL-EVENTS.md) sendiri mendapat power elemen tanpa boost mastery.

## Bonus Durability dan mastery

Saat jenis terpilih, catat modifier Durability sesuai tabel dengan source key hasil dan
komponen. Sesudah base Durability diputar pada tahap main stat, tambahkan poin angka melalui
ledger dan gunakan batas skala yang berlaku. Base spin tetap disimpan; bonus +1/+2/+3 bukan
kenaikan ordinal tier. Evaluasi atau render ulang tidak menambahkan bonus kedua.

Semua power Golem tetap dimiliki jika main Power mendapat None. Satu Power Mastery bersama
berlaku untuk power ras ini dan seluruh power lain. Grant belakangan memakai hasil bersama
yang sudah ada; bonus Durability tetap memakai jumlah yang ditetapkan pengguna dan tidak
otomatis meningkat karena mastery. Lihat [Power Mastery bersama](POWER-MASTERY.md).

## Konteks narator

| Hasil | Contoh celetukan |
| --- | --- |
| Golem Pasir | “Golem Pasir dapet Kendali Pasir. Build pantai mulai aktif.” |
| Golem Batu | “Golem Batu: Kendali Batu, Durability +1. Batu kali naik kelas.” |
| Golem Magma | “Golem Magma: Kendali Magma, Durability +1. Build panas, bodi ikut tebel.” |
| Golem Kristal | “Golem Kristal: Kendali Kristal, Durability +2. Bening tapi ada bonus bodi.” |
| Golem Berlian | “Golem Berlian: Kendali Berlian, Durability +3. Skin mahal, bodi ikut premium.” |
| Golem Elemen | “Golem Elemen dapet mastery +1. Elemen masih loading, tunggu spin dulu.” |
| Golem Sampah | “Golem Sampah dapet Kendali Sampah. Build TPS siap turun arena.” |

Sesudah hasil jenis, konteks memuat material aktual, power yang benar-benar dimiliki, serta
modifier Durability yang sudah tercatat. Angka base/final Durability belum tersedia sebelum
spin stat. Golem Elemen belum mengetahui elemen/power spesifiknya sebelum wheel Element
selesai. Mastery memakai state bersama yang benar-benar tersedia saat itu. Setiap actual
spin mempunyai reaksi sendiri; contoh celetukan tidak menambah efek atau tag funny-result.

## Return dan balance

Sesudah event selesai, kembali ke pemanggil; pada alur utama lanjut ke Archetype. Caller
Skeleton/Zombie atau Hybrid/host yang memang diotorisasi menjalankan profil yang sama dengan
provenance, history keluarga tanpa pengulangan, dan return point sendiri. Replay memulihkan
hasil dan grant yang sudah tercatat.

Semua jenis Golem mengikuti Size global. Metric dan acuan badan bersumber,
batas manipulasi material, skala Durability, serta faktor peluang berikutnya masih perlu
ditetapkan. Ukuran dan kemampuan tambahan mengikuti profil yang dinyatakan secara eksplisit.

Data: [profil Golem](../content/golem-events-design.json),
[roda ras](../content/race-wheel-design.json),
[Sand Manipulation bersama](../content/lelembut-events-design.json),
[Element universal](../content/universal-element-wheel-design.json), dan
[framework](../framework/spec.json).
