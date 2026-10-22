# Event Elemental

Elemental memutar **roda Element universal sekali**, lalu mendapat satu power kendali elemen
terpilih. Ras ini **tidak memberi bonus Power Mastery**. Power elemen tetap memakai satu
hasil mastery bersama karakter, seperti power lain.

## Alur event

**Hasil ras Elemental dan reaksi → spin Element dan reaksi → power elemen dimiliki → kembali
ke pemanggil.** Pada alur ras utama, tahap berikutnya adalah Archetype.

Elemental memakai roda yang sama dengan Element Pixie, Naga, Golem Elemen, Dragon, dan
Slime Elemental: **12 pilihan sama rata**, sekitar 8,33% sebelum modifier. Power berasal
dari mapping hasil aktual pada [Element universal](../content/universal-element-wheel-design.json).

| Hasil Element | Power yang didapat |
| --- | --- |
| Api | Kendali Api |
| Air | Kendali Air |
| Tanah | Kendali Tanah |
| Angin | Kendali Angin |
| Petir | Kendali Petir |
| Es | Kendali Es |
| Logam | Kendali Logam |
| Tumbuhan | Kendali Tumbuhan (Forest Control) |
| Cahaya | Kendali Cahaya |
| Kegelapan | Kendali Kegelapan |
| Bayangan | Manipulasi Bayangan |
| Void | Kendali Kekosongan |

Scope, tier, dan perbedaan Kegelapan/Bayangan/Void ada di [panduan Element](ELEMENT-WHEEL.md).

Satu hasil hanya memberi power elemennya. Simpan elemen dan sumber komponen aktual dalam
konteks karakter. Grant ini tidak memerlukan spin Power tambahan; main Weapon dan main Power
tetap berjalan pada urutan normal.

## Power dan mastery

Main Power None tidak menghapus power elemen yang sudah dimiliki. Saat seluruh acquisition
selesai, satu Power Mastery berlaku untuk semua power. Grant belakangan mewarisi hasil bersama
yang sudah tersedia. Bonus dari sumber lain tetap mengikuti aturan mastery bersama.

**Golem Elemen mendapat +1 Power Mastery dari hasil jenis Golem.** Elemental tidak menerima
bonus itu. Roda Element sendiri hanya memilih elemen dan memberi power terkait, sehingga
Naga maupun Element Pixie juga tidak memperoleh +1 karena menggunakan roda yang sama.
Lihat [Golem](GOLEM-EVENTS.md) dan [Power Mastery bersama](POWER-MASTERY.md).

## Konteks narator

Pada hasil ras, elemen masih belum diketahui: “Elemental masuk lobby. Elemennya masih loading,
spin dulu bos.” Setelah spin Element, tambahkan hanya elemen aktual dan power yang sudah
tercatat. Misalnya Api: “Dapet Api. Kendali Api masuk build, siap jadi kompor berjalan.”

Contoh celetukan tidak memberi stat, mastery, immunity, atau tag funny-result. Tiap spin
aktual memiliki reaksinya sendiri; rank mastery hanya disebut jika sudah tersedia.

## Provenance dan balance

Caller Skeleton/Zombie atau Hybrid/host yang diotorisasi memakai profil yang sama dengan
sumber komponen, history keluarga tanpa pengulangan, dan return point sendiri. Replay tidak
menambah spin atau power kedua. Hasil Element menjaga identitas keluarga pemanggil.

Elemental tetap mengikuti Size global dan profil badan yang terpilih. Elemen menjadi
konteks peluang stat berikutnya; limits/cost power tetap mengikuti definisi power.

Data: [profil Elemental](../content/elemental-events-design.json),
[roda ras](../content/race-wheel-design.json), dan [framework](../framework/spec.json).
