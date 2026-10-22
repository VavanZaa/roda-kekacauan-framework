# Resilient

**Jika hasil spin pertama 0–5, spin sekali lagi dan ambil angka tertinggi.**
Berlaku untuk Strength, Speed, Durability, Intelligence, Fight, Weapon Mastery
setiap weapon aktif, dan satu Power Mastery bersama.

Mendapat Resilient hanya mengaktifkan aturan untuk tahap stat/mastery nanti;
tidak ada spin tambahan langsung pada tahap Archetype. Setelah reaksinya,
lanjut ke Backstory seperti biasa.

1. Spin roda stat/mastery yang sedang dijalankan dan simpan hasil aslinya.
2. Bila hasil pertama **≤5**, berikan satu spin kedua dari pool yang sama.
3. Pilih angka terbesar. Jika sama, referensikan hasil pertama.
4. Lanjutkan alur dari slot itu. Tidak ada spin ketiga.

| Hasil pertama | Hasil kedua | Angka dipakai |
| --- | --- | --- |
| 4 | 2 | 4 |
| 5 | 8 | 8 |
| 6 | Tidak spin lagi | 6 |
| 0 | 0 | 0 |

Pengecekan dan pemilihan memakai **angka hasil spin asli sebelum bonus**.
Bonus/debuff main stat dan kedua mastery dicatat dan baru dihitung di akhir;
Resilient sendiri tidak memberikan bonus angka. Hasil kedua boleh sama dengan
hasil pertama. Aturan larangan ras berulang tidak berlaku untuk roda stat.

Kedua spin memakai mapping, pool, peluang dan jaminan yang sama. Kinnara dapat
spin kedua bila raw Weapon Mastery pertama Master=5, tetapi tidak bila 6–9.
Lich dengan raw Durability maksimum=9 tidak memicu kesempatan kedua.

Power Mastery tetap **satu hasil bersama untuk seluruh power**. Resilient
memberi satu retry pada proses penentuan hasil bersama itu ketika perlu;
jumlah power tidak memperbanyak retry. Power baru belakangan mewarisi hasil
yang sudah selesai. Tidak punya power berarti tidak ada spin mastery.

Simpan kedua hasil asli dan hasil pilihan sebagai catatan terpisah. Setiap
spin nyata mendapat konteks/reaksinya sendiri. Retry tidak memicu retry lain,
dan render ulang/resume tidak mengulang spin pertama atau memberikan bonus lagi.
Slot tidak boleh dianggap selesai saat retry wajib masih tertunda.

Jika kombinasi archetype kelak diotorisasi, Lucky Number tetap menghitung
setiap spin nyata yang cocok sekali; memilih hasil terbaik bukan spin baru.
Pawn tetap menghitung kategori, bukan jumlah percobaan, berdasarkan hasil
raw yang dipertahankan. Kombinasi policy belum otomatis diaktifkan.

Aturan ini tersimpan sebagai desain algoritma; executor stat/mastery dan
profil body-role Resilient belum diimplementasikan.

[Structured design](../content/resilient-events-design.json) ·
[Skala 0–9](STAT-SCALES.md) · [Power Mastery](POWER-MASTERY.md)

Klarifikasi sudah disetujui: bonus Weapon/Power Mastery juga dihitung di
akhir. Setelah bonus Weapon Mastery, rank efektif ≥5 dapat membuka Enchant
pada fase akhir jika weapon/slot kompatibel. Semua event Enchant selesai
sebelum gambar dibuat. [Bonus akhir dan Enchant](BONUS-TIMING.md).

Versi aktif **resilient/0.2.0**; hasil spin asli dan aturan retry tetap sama.
