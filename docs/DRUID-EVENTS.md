# Druid — Jalur Alam

Pengguna menyetujui **empat jalur sama rata**, masing-masing memberi satu
power **Tier 3**. Satu power memenuhi budget **dua poin desain**; tidak ada
bonus stat atau mastery tambahan.

| Jalur | Peluang | Event dan hadiah |
| --- | --- | --- |
| Wild Shape | 25% | Spin satu hewan biasa → Animal Transformation, terikat hanya pada hewan itu |
| Penjaga Hutan | 25% | Forest Control |
| Pawang Alam | 25% | Taming Power |
| Penyembuh Alam | 25% | Healing Power |

## Alur

Druid → reaksi → Jalur Druid → reaksi hasil jalur → jika Wild Shape,
spin satu Bentuk Hewan → grant satu power dan reaksi → Backstory.
Total spin lanjutan dua untuk Wild Shape, satu untuk tiga jalur lainnya;
tidak termasuk spin Archetype utama.

Tiga jalur langsung memakai definisi power yang sudah ada. Wild Shape
memakai Animal Transformation kanonis dengan satu binding hewan aktual.
Definisi dan rating Tier 3 diimpor dari Siluman/Elf/Tamer/Fairy; event,
bonus ras, identitas, narasi ras dan companion sumber tidak ikut diimpor.

## Bentuk Hewan — roster editable

Usulan awal memakai **view identitas saja** dari 32 hewan masa kini pada
roda Tamer, bukan salinan event Tamer. Ambil ID, nama dan bobot dari grup
`modern`; normalisasi ulang menjadi **1/32 = 3,125%** tiap hewan. Jumlah 32
ini pilihan implementasi yang masih bisa diubah, bukan jumlah Druid yang
ditentukan pengguna.

Pool sumber mencakup Semut sampai Paus Biru. Hanya **satu hasil aktual**
menjadi bentuk yang tersedia untuk sumber Wild Shape ini. Simpan binding,
versi katalog dan identitas hasil; seluruh pool tidak otomatis tersedia.
Karakter dapat kembali ke bentuk asalnya. Kapasitas tubuh/bentuk,
visual dan kecocokan equipment masih perlu profil eksplisit; tidak
menyalin angka stat hewan atau memicu spin Size baru.

Wild Shape tidak menjalankan jumlah hewan/fusion Siluman atau menambahkan
ras pada history. Pawang Alam mendapat kemampuan Taming, tanpa companion
otomatis. Companion yang sudah dimiliki dari sumber lain tetap terpisah.

## Mastery, konteks dan penyimpanan

Power awal tetap dimiliki setelah hasil None pada Power utama. Satu
resolusi Power Mastery bersama berlaku normal; bonus yang berasal dari
sumber lain tetap dihitung di akhir. Weapon/Power/Weakness utama tetap
berjalan sesuai urutan.

Setiap spin aktual mendapat reaksi dengan konteks hasil yang telah
tercatat. Saat jalur diketahui, nama hewan dan nilai stat/mastery nanti
masih belum diketahui. Fixed grant tidak menciptakan spin tambahan atau
tag lucu otomatis.

Freeze jalur, view hewan, bobot aktual, versi, hasil, binding dan grant
kanonis. Commit hadiah sekali per sumber; resume melanjutkan child atau
grant yang belum selesai tanpa redraw atau hadiah duplikat.

Core event disetujui. Roster hewan, batas kemampuan/form/body fit dan
executor masih konfigurasi. [Desain terstruktur](../content/druid-events-design.json).
