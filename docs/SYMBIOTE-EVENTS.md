# Takeover dan Event Symbiote

Symbiote memutar **Takeover sekali**, dengan 11 hasil dari 0% sampai 100% pada langkah 10%.
Hasil menentukan bonus stat dan jumlah spin Symbiote Power. Pada 80–90%, Strength/Durability
masing-masing tetap +1; pada 100%, bonus total sumber ini +1 pada kelima stat dan dua spin power.
Takeover memakai sebelas pilihan sama rata (1/11 ≈ 9,09%); power-symbiote memakai dua belas
pilihan sama rata (1/12 ≈ 8,33%), sebelum modifier yang disetujui. Langkah nilai 10% bukan peluang 10%.

## Hasil takeover

| Takeover | Bonus stat dari sumber ini | Spin Symbiote Power |
| --- | --- | --- |
| 0%, 10% | Tidak ada | 0 |
| 20%, 30%, 40% | Strength +1 | 0 |
| 50%, 60%, 70% | Strength +1, Durability +1 | 0 |
| 80%, 90% | Strength +1, Durability +1 | 1 |
| 100% | Strength/Speed/Durability/Intelligence/Fight masing-masing +1 | 2 |

Gunakan hanya profil hasil aktual. Pada 100%, jangan menambahkan bonus threshold sebelumnya
lagi: Strength/Durability total +1 dari sumber Symbiote, dan jumlah spin power tepat dua.
Bonus independen dari race/event lain tetap mengikuti aturan sumbernya sendiri.

Catat modifier sekali dari takeover dan komponen aktual. Tambahkan poin angka setelah base
stat diputar, menggunakan ledger dan batas skala yang berlaku. Evaluasi atau render ulang
menggunakan hasil tersimpan.

## Alur event

**Hasil ras dan reaksi → satu spin ras inang beserta seluruh event/chain langsungnya →
kembali ke Symbiote → spin Takeover dan reaksi → seluruh spin Symbiote Power yang didapat,
masing-masing dengan reaksi → kembali ke pemanggil.** Pada alur utama lanjut ke Archetype.

80/90% memanggil power-symbiote satu kali. 100% memanggilnya dua kali secara berurutan, satu
hasil dan satu grant tiap invokasi. Simpan parent/source component serta ordinal child.
Power pertama masuk konteks sebelum reaksi power kedua. Profil di sini tidak menambah
spin jenis Symbiote atau host tambahan dari hasil Takeover. Satu host spin berasal dari
event family, sesuai klarifikasi pengguna; wrapper dan host tetap tercatat bahkan pada 0%.
Host yang mendapat Raksasa/undead/Hybrid menjalankan approved event chain, dengan satu history
no-repeat dan saved return. Lihat [Hybrid/attachments](HYBRID-EVENTS.md).

## Dua belas Symbiote Power

Satu roda kanonis dipakai seluruh caller yang memperoleh akses. Nama dan scope berikut
merupakan adaptasi game yang bisa disesuaikan; urutan tabel hanya urutan katalog.

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

Hasil terpilih memberi kemampuan itu saja. Range, cost, durasi, capacity, resistance, dan
limits mastery masih perlu ditetapkan. Power tidak otomatis menambah stat, Weapon inventory,
Army, atau kemampuan lain di luar grant yang dinyatakan.

Untuk dua invokasi, belum ada jaminan power unik dari pengguna. Interpretasi kerja memakai
pool kanonis tiap invokasi tanpa mematikan hasil pertama. Jika hasil sama, pertahankan kedua
hasil aktual/provenance; aturan merge power-instance mengikuti kebijakan duplikat global
yang masih perlu ditetapkan. Jangan reroll hasil yang sudah committed.

## Mastery dan ukuran

Power Symbiote tetap owned jika main Power mendapat None. Main Weapon/Power tetap diputar
pada urutan normal; setelah semua acquisition selesai, satu Power Mastery berlaku untuk
seluruh power. Takeover tidak memberi bonus mastery. Grant belakangan memakai hasil bersama
yang sudah tercatat. Lihat [Power Mastery bersama](POWER-MASTERY.md).

Karakter mengikuti Size global. Acuan badan/metric yang bersumber masih perlu ditetapkan;
0% tidak memutar ulang ras menjadi Manusia, dan 100% tidak memberi penalty stat atau
power tambahan selain hasil pada tabel.

## Konteks narator

| Hasil | Contoh celetukan |
| --- | --- |
| 0% | “Symbiote numpang alamat doang.” |
| 20–40% | “Strength +1. Otot dapet teman patungan.” |
| 50–70% | “Strength +1, Durability +1. Bodi ikut upgrade.” |
| 80–90% | “Satu spin power kebuka. Power-nya spin dulu, bos.” |
| 100% | “Semua stat +1, dua spin power. Symbiote pegang setir full.” |

Konteks menumpuk persentase aktual, bonus sumber, jumlah spin yang didapat, lalu nama power
yang benar-benar keluar. Base/final stat dan rank mastery menunggu hasilnya sendiri. Contoh
celetukan tidak memberi efek atau tag funny-result.

Caller Skeleton/Zombie atau Hybrid/host yang diotorisasi memakai profil yang sama dengan
provenance komponen, history keluarga tanpa pengulangan, dan return point sendiri.
Replay memulihkan profile/effects/child results yang sudah committed.

Data: [profil Symbiote](../content/symbiote-events-design.json),
[roda power universal](../content/universal-power-wheels-design.json),
[roda ras](../content/race-wheel-design.json), dan [framework](../framework/spec.json).
