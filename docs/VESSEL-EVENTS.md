# Vessel Event

Keputusan terbaru — 10 Oktober 2026: **Jaminan maksimum langsung menjadi
nilai dasar, tanpa spin. God memakai satu dasar Power Mastery9 untuk seluruh
power saat ini maupun yang didapat nanti. Vessel God pada Compatibility60–100
mewarisi jaminan tersebut. Lich langsung Durability9.** Bonus/debuff tetap di
akhir dan boleh menghasilkan angka negatif/melebihi9. Nilai otomatis bukan
hasil spin: tidak memberi Lucky hit, retry Resilient atau kategori raw Pawn.
Aturan ini menggantikan scope Authority-only dan spin singleton Lich di
catatan sebelumnya. Plan lama tetap dibaca sesuai riwayatnya.


Vessel memilih **God / Raja Iblis Agung** sama rata, lalu spin
**Compatibility**. Sebelas hasil 0%,10%,…100% memakai langkah10 sesuai
roda persentase sebelumnya; peluang dasar tiap hasil **1/11 ≈9,09%**.

| Compatibility | Vessel God | Vessel Raja Iblis | Peluang band |
| --- | --- | --- | --- |
| 0–20% | Weakness **Tubuh Jebol** | Weakness **Tubuh Jebol** | 3/11 ≈27,27% |
| 30–50% | 1 Divine Power | 1 Demonic Power | 3/11 ≈27,27% |
| 60–80% | 1 Concept Authority base9 + modifier final | 2 Demonic Power | 3/11 ≈27,27% |
| 90–100% | Concept Authority base9 + modifier final +2 Divine +Pengikut +aturan80% None | 4 Demonic +Pengikut | 2/11 ≈18,18% |

Paket positif God saat ini berisi Concept/Authority dengan mastery
maksimum, dua Divine dan spin Pengikut. Raja Iblis Agung mendapat empat
Demonic lalu Pengikut. Keduanya memakai katalog universal yang sama dan
profil hadiah Pengikut masing-masing. Vessel God
90–100% juga mendapat80% None /20% power pada acquisition Power normal
yang mengizinkan None; Concept/Divine dan spin guaranteed tetap mengikuti
pengecualian God yang sudah ada.

**Satu Authority dinilai setara dua Divine** untuk paket Vessel. God60–80
memutar Concept sekali dan mendapat Authority dengan mastery maksimum
berdasarkan paket God yang sudah ada. Raja60–80 mendapat dua Demonic.
Band30–50 tetap satu thematic power; Pengikut dan aktivasi80% None khusus
90–100. Kapasitas/tier power tetap normal.
Setiap band adalah total paket terpilih, tidak menjumlahkan hadiah band
sebelumnya.

Patron tercatat sebagai sumber paket Vessel. Spin ini tidak memberi
identitas ras baru atau menjalankan pemilihan jenis Heavenly/Abyssal.
Bonus angka/mastery dihitung di akhir dan ordinary powers memakai satu
resolusi Power Mastery bersama. Hadiah power awal bertahan setelah None.

Tubuh Jebol merupakan weakness tambahan dengan kapasitas/kerusakan yang
perlu profil kemampuan. Tidak ada penalti angka, kematian atau spin detail
tambahan yang ditentukan. Weakness utama nanti tetap diputar.

## Alur dan sumber hadiah

Vessel → patron → Compatibility → pilih satu recipe → grant tetap atau
child Concept/Power/Pengikut aktual berurutan dengan reaksi masing-masing
→ Backstory. Low hanya mendapat weakness, tanpa spin Weakness tambahan.
Total spin lanjutan termasuk patron dan Compatibility adalah:

| Patron | 0–20 | 30–50 | 60–80 | 90–100 |
| --- | --- | --- | --- | --- |
| God | 2 | 3 | 3 | 6 |
| Raja Iblis | 2 | 3 | 4 | 7 |

God full: Concept → Divine1 → Divine2 → Pengikut. Raja full: Demonic1
→ Demonic2 → Demonic3 → Demonic4 → Pengikut. Roda universal sama untuk
setiap panggilan; keluarkan power yang sudah dimiliki sebelum draw berikutnya, lalu normalisasi sisa pool. Simpan sumber dan
ordinal setiap hasil, tanpa menyalin bonus ras lain.

Pengikut memakai sembilan count dengan bobot3:3:3:3:3:2:2:2:1. God mendapat
hanya bonus stat pada count tinggi; Raja dapat bonus mastery atau stat
dari row hasil aktual. Bonus tidak kumulatif antar-threshold. Record
Pengikut milik sumber patron Vessel, terpisah dari army dan sumber lain.

Base Authority9 hanya melekat pada **Concept God Vessel60–100**, lalu menerima modifier Power Mastery bersama di akhir.
Divine/ordinary concept dan semua power lainnya tetap memakai mastery
bersama; tidak memindahkan base override melalui definition duplikat. Aturan
God80% None hanya mengatur acquisition normal yang mengizinkan None;
power tematik/fixed/guaranteed dikecualikan, dan None mempertahankan power
yang telah dimiliki.

Freeze patron, Compatibility, odds/versi, recipe dan jadwal child.
Commit grant/modifier sekali per sumber. Resume melanjutkan step yang
belum selesai tanpa redraw atau hadiah ganda. Journal vessel/0.1.0 tetap
memakai hadiah satu Divine untuk God60–80 yang sudah committed; run baru
memakai vessel/0.2.0. Bonus stat/mastery tetap
dihitung di akhir; Authority memakai override base9 source-instance plus modifier bersama
yang sudah dideklarasikan. Equalizer memakai prioritas yang sama dengan
kontrak odds sebelumnya jika diotorisasi dan aktif.

Core event disepakati; detail overload/capability/body fit, roster starter
Concept dan executor masih konfigurasi. Progres25 core event, berikutnya
Warlord. [Desain terstruktur](../content/vessel-events-design.json).
