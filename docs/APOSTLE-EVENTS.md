# Event Apostle

Pengguna menyamakan Apostle dengan Utusan Tuhan, lalu menentukan patron
God atau Devil. Klarifikasi langsung mengonfirmasi **+1 Power Mastery untuk
semua power** berlaku pada kedua cabang.

## Alur dan peluang

| Patron | Peluang dasar | Child power wheel |
| --- | --- | --- |
| God | **50%** | Satu spin **Divine Power** universal, 20 pilihan |
| Devil | **50%** | Satu spin **Demonic Power** universal, 20 pilihan |

Apostle → spin **Utusan Siapa?** → register satu modifier mastery +1,
reaksi patron → spin roda tema terpilih, grant power dan reaksi → Backstory.
Dua child spin aktual total; hanya satu cabang tema dijalankan. Devil/Demon
adalah satu pilihan alias, bukan dua sektor. Semua spin ini terjadi saat
event Archetype, mengikuti aturan immediate events.

Pakai definisi, metadata tier dan base weight yang sama dengan roda kanonis.
Masing-masing Divine 1/20, Demonic 1/20 sebelum modifier yang memang diotorisasi.
Jumlah pilihan pada roda tema tidak mengubah peluang patron 50:50.

## Bonus mastery

+1 berarti satu langkah rank pada hasil Power Mastery bersama, bukan poin
main stat atau kenaikan intrinsic Power Tier. Bonus berlaku untuk power
terpilih, power sebelumnya, main/extra Power acquisition dan power berikutnya.
Daftarkan modifier source-owned **apostle-power-mastery** sekali dari hasil
patron. Saat normal shared mastery di-spin, simpan raw base, tambah sumber
bonus unik dan gunakan cap. Tidak mengalikan +1 dengan jumlah power atau
jumlah spin Apostle.

Utusan Tuhan memiliki modifier sumber sendiri. Jika kedua sumber memang
aktif, masing-masing +1 ditambahkan sekali sesuai kebijakan additive yang
sudah ada. God Authority yang punya override maksimum dari sumber aslinya
menjaga maksimum itu; tidak memindahkan override ke power Apostle.

Power terpilih menjadi ordinary owned power dan tetap dimiliki bila main
Power nanti mendapat None. Normal acquisition lainnya tetap berjalan dan
mastery tetap satu spin bersama. Jika base mastery sudah tersedia, bonus
baru dicatat dan diproyeksikan pada finalize dari base yang sama tanpa spin ulang.
Power Mastery tidak membuka Enchant atau child wheel tambahan.

## Batas identitas dan grant

Patron adalah referensi pihak yang diwakili, bukan ras karakter baru.
God memilih Divine, Devil memilih **Demonic** sesuai koreksi terbaru pengguna; jalur Cursed sebelumnya telah diganti.
Tidak dispatch Heavenly/Abyssal, God/Demon race, Concept, followers, atau
paket race Utusan Tuhan. Aturan ras Utusan Tuhan sendiri tetap utuh.
Tidak menambah stat, weapon, normal extra Power ticket atau definisi power baru.

Freeze patron pool/odds/version/modifier source, kemudian canonical thematic
pool/odds/result/definition/tier pada invocation-nya sendiri. Commit modifier
sekali dan grant power sekali dengan source ledger masing-masing. Resume,
retry video dan replay tidak menambah spin, cabang, power atau mastery bonus.
Konteks ditumpuk dari patron aktual dan power terpilih; mastery masa depan
belum diketahui. Caption tidak membuat funny-result tag.

[Desain Apostle](../content/apostle-events-design.json) dan spec sudah sinkron.
Runtime helper, intrinsic limits, raw0..9/conditional odds dan final body-role fit masih
konfigurasi. Berikutnya **Mutant**.

## Timing bonus terbaru

Bonus mastery dicatat saat didapat dan baru dihitung pada fase akhir.
Weapon Mastery setelah bonus menentukan Enchant pada fase itu; Power
Mastery tetap tidak memberi Enchant. Raw spin/scoped bonus dan sumbernya
tetap. Semua event Enchant selesai sebelum gambar/final card.
[Aturan kanonis](BONUS-TIMING.md) supersedes timing lebih awal di catatan lama.
