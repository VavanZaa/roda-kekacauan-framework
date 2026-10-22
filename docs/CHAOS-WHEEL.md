# Roda Kekacauan — pembuka dan24 calon event

Distribusi pembuka tetap dikonfirmasi. Divine sekarang punya empat hadiah per tingkat, ditulis sesuai permintaan dan bisa kita sesuaikan; mekanisme lanjutan12 Divine sudah ditulis; implementasi runtime menyusul.

| Hasil pembuka | Peluang |
| --- | ---: |
| Chaos Low | 15% |
| Chaos Medium | 12% |
| Chaos High | 8% |
| Divine Low | 15% |
| Divine Medium | 12% |
| Divine High | 8% |
| None | 30% |

Total: **Chaos35% · Divine35% · None30%**. None langsung Title, menyimpan semua hasil sebelumnya.

Ada empat event per cabang: default25% masing-masing sebelum filter target. Peluang dasar satu event Low=3,75%, Medium=3%, High=2%. Filter hanya menormalisasi anak roda. Equalizer berlaku per roda setelah hard guard.

| Cabang | Event | Efek |
| --- | --- | --- |
| Chaos Low | Tukar Nasib | Dua main stat berbeda ditukar nilai dasarnya. |
| Chaos Low | Geser Poin | Stat tertinggi -1, stat terendah +1. |
| Chaos Low | Senjata Mager | Serangan pertama dengan satu senjata terpilih gagal keluar. |
| Chaos Low | Kesialan Receh | Satu spin Weakness tambahan, dijamin mendapat weakness. |
| Chaos Medium | Partial Inversion | Satu main stat dipilih acak, lalu dasarnya menjadi9 - nilai. |
| Chaos Medium | Devil’s Pact | Kelima main stat -1 dan satu spin Chaotic Power. |
| Chaos Medium | Glass Cannon | Strength +2, Durability -2. |
| Chaos Medium | Chaos Surge | Satu spin Chaotic Power, tetapi Power Mastery -1. |
| Chaos High | Inversion | Nilai dasar target menjadi9 - nilai:7 menjadi2,9 menjadi0. |
| Chaos High | Equivalent Exchange | Satu stat terendah menjadi9; satu stat tertinggi menjadi0. |
| Chaos High | Stat Carousel | Semua nilai dasar main stat bergeser ke posisi stat lain. |
| Chaos High | Reality Glitch | Dua spin Chaotic Power dan dua spin Weakness tambahan. |
| Divine Low | Sentuhan Berkah | +1 pada satu main stat acak. |
| Divine Low | Perisai Tipis | Durability +1 hanya untuk satu serangan yang diterima. |
| Divine Low | Napas Cadangan | Speed +1 hanya untuk satu aksi menghindar. |
| Divine Low | Fokus Sesaat | Fight +1 hanya untuk satu serangan yang dilakukan. |
| Divine Medium | Berkah Terarah | +1 pada satu main stat terendah. |
| Divine Medium | Sentuhan Ahli | Weapon Mastery +1 untuk satu senjata yang dimiliki. |
| Divine Medium | Resonansi | Shared Power Mastery +1 untuk semua power yang dimiliki. |
| Divine Medium | Purification | Nonaktifkan satu weakness receh dari pool40. |
| Divine High | Berkah Ganda | +1 pada dua main stat berbeda, total +2. |
| Divine High | Second Chance | Roll satu stat terendah lagi; hasil lebih baik memberi bonus, maksimal +2. |
| Divine High | Divine Gift | Satu spin Divine Power, dibatasi Tier1–3. |
| Divine High | Restoration | Pulihkan maksimal2 poin dari debuff main stat yang ada. |

**Batas hadiah Divine:** Low satu poin atau sekali pakai; Medium satu poin/mastery terarah atau satu weakness receh; High maksimal dua poin dari hadiah statnya atau satu power Tier1–3. Ini batas hadiah sumber ini, bukan batas total karakter atau efek passive yang sudah disetujui.

Second Chance mempertahankan roll asli. Bonus normal = min(2, max(0, raw baru − raw awal)), dihitung di akhir. Double/Nothing membandingkan base sesudah keputusan; aturan lengkap ada di docs/DIVINE-EVENTS.md. Roll tambahan yang benar-benar terjadi mengikuti aturan Lucky/Resilient/Pawn dan adapter Gambler yang sesuai; kombinasi algoritma sudah ditulis pada desain follow-up; adapter runtime belum dibuat.

Divine Gift memakai wheel Divine universal dengan hard filter Tier1–3 hanya untuk panggilan ini. Roda Divine20 dari God/Pemuka dan semua tier canonical lainnya tetap sama. Power baru memakai satu mastery penerima, bukan mastery terpisah.

Bonus conditional sekali pakai ditampilkan sebagai trait terpisah; tidak menaikkan angka final stat selalu aktif. Sentuhan Ahli hanya menyasar satu senjata dan memakai gate Enchant final biasa. Purification hanya weakness kategori receh dari pool40. Restoration hanya mengimbangi debuff angka main stat yang benar-benar ada, total maksimal dua poin.

**Saran metode, belum aktif:**

- Pity: setelah3 hasil None berturut-turut dalam satu seri, karakter berikutnya dijamin mendapat Chaos atau Divine. Bobot non-None tetap15:12:8 per sisi, dinormalisasi atas70; sisi tetap50:50 pada draw khusus itu. None biasa tetap30%. Counter perlu storage; replay/preview/None anak roda tidak dihitung.

- Harga dulu, hadiah belakangan: saat event Chaos punya biaya dan hadiah, narator menampilkan biaya yang sudah diketahui sebelum spin hadiah. Contoh Devil’s Pact: biaya pending−1 semua main stat, baru spin Chaotic Power. Tidak menambah fake spin atau mengurangi stat final terlalu awal.

Saya menyarankan mempertahankan distribusi pembuka; kedua metode ini bisa menambah suspense tanpa memperbesar hadiah Divine. Pity mengubah peluang hanya pada draw khusus yang memicu jaminan, bila dipilih nanti.

Target yang tidak ada dikeluarkan sebelum spin event. Inversion scope/order, Chaotic Power roster/tier scopes, eksekutor dan adapter effect/roll belum selesai. Backstory None/non-None numeric binding tetap pending. Title belum dimulai.

## Mekanisme lanjutan Divine

| Tingkat | Event | Alur setelah hasil |
| --- | --- | --- |
| Low | Sentuhan Berkah | Spin pemilih stat (5 pilihan), sama rata → target mendapat +1 di akhir. |
| Low | Perisai Tipis | Langsung simpan trait Durability +1 untuk satu hit masuk; tanpa roda tambahan. |
| Low | Napas Cadangan | Langsung simpan trait Speed +1 untuk satu dodge; tanpa roda tambahan. |
| Low | Fokus Sesaat | Langsung simpan trait Fight +1 untuk satu serangan; tanpa roda tambahan. |
| Medium | Berkah Terarah | Cari main stat terendah sebelum bonus → bila seri, spin di antara yang seri → +1 target. |
| Medium | Sentuhan Ahli | Spin senjata aktif milik karakter → +1 mastery senjata itu → cek Enchant pada fase akhir. |
| Medium | Resonansi | Langsung catat +1 mastery bersama untuk semua power; tanpa spin ulang mastery. |
| Medium | Purification | Spin weakness receh aktif yang dimiliki → nonaktifkan satu hasil terpilih. |
| High | Berkah Ganda | Spin pemilih stat (5 pilihan) → matikan hasil pertama → spin 4 sisanya → masing-masing +1. |
| High | Second Chance | Pilih stat raw terendah yang eligible → spin ulang stat → bonus peningkatan0–2, hasil awal disimpan. |
| High | Divine Gift | Spin Divine Power Tier1–3 yang belum dimiliki → grant → gunakan mastery bersama atau roll satu mastery jika ini power pertama. |
| High | Restoration | Spin entri penalti main stat yang belum dipulihkan → refund maksimal2 poin; bila masih ada sisa anggaran, pilih entri lain. |

Detail target kosong/seri, charge sekali pakai, Gambler, late mastery, refund dan source-once ada di [DIVINE-EVENTS.md](DIVINE-EVENTS.md) dan `content/divine-followup-design.json`. Semua12 flow kembali ke Title sesudah anak eventnya selesai.
