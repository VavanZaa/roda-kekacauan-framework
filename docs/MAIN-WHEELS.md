# Roda Race dan Archetype

Kedua roda diurutkan dari paket paling lemah ke paling kuat. Roda berputar berlawanan arah jarum jam; sektor disusun searah jarum jam agar yang melewati penunjuk bergerak dari lemah ke kuat. Race mempunyai22 pilihan; Archetype mempunyai28 pilihan aktif dari video kedua. Ranking adalah penilaian desain atas paket event, peluang zonk, risiko dan upside bersyarat, bukan jaminan hasil stat atau kemenangan. Subrace dapat jauh lebih kuat atau lemah daripada posisi keluarga rasnya.

## Peluang kelompok

Rasio3:2,5:2 diterapkan pada peluang total kelompok di seluruh roda: Lemah40%, Sedang33,33%, Kuat26,67%. Satu roda berisi semua pilihan; tidak ada spin kelompok terlebih dahulu. Di dalam tiap kelompok, sektor sama rata.

| Roda | Lemah | Sedang | Kuat |
| --- | --- | --- | --- |
| Race | 7 pilihan ·5,71% tiap pilihan | 8 pilihan ·4,17% tiap pilihan | 7 pilihan ·3,81% tiap pilihan |
| Archetype | 9 pilihan ·4,44% tiap pilihan | 10 pilihan ·3,33% tiap pilihan | 9 pilihan ·2,96% tiap pilihan |

## Race dari lemah ke kuat

| Urutan | Pilihan | Kelompok | Peluang |
| --- | --- | --- | --- |
| 1 | Manusia | Lemah | 5,71% |
| 2 | Goblin & Orc | Lemah | 5,71% |
| 3 | Kurcaci | Lemah | 5,71% |
| 4 | Centaur | Lemah | 5,71% |
| 5 | Slime | Lemah | 5,71% |
| 6 | Anime | Lemah | 5,71% |
| 7 | Elf | Lemah | 5,71% |
| 8 | Siluman | Sedang | 4,17% |
| 9 | Lelembut | Sedang | 4,17% |
| 10 | Elemental | Sedang | 4,17% |
| 11 | Golem | Sedang | 4,17% |
| 12 | Machine | Sedang | 4,17% |
| 13 | Peri | Sedang | 4,17% |
| 14 | Reinkarnasi Pahlawan Legendaris | Sedang | 4,17% |
| 15 | Mythical Beast | Sedang | 4,17% |
| 16 | Symbiote | Kuat | 3,81% |
| 17 | Abyssal Axiom | Kuat | 3,81% |
| 18 | Heavenly Principle | Kuat | 3,81% |
| 19 | Cosmic Warrior | Kuat | 3,81% |
| 20 | Raksasa | Kuat | 3,81% |
| 21 | Hybrid | Kuat | 3,81% |
| 22 | Primordial | Kuat | 3,81% |

## Archetype dari lemah ke kuat

| Urutan | Pilihan | Kelompok | Peluang |
| --- | --- | --- | --- |
| 1 | NPC | Lemah | 4,44% |
| 2 | Pirate | Lemah | 4,44% |
| 3 | Alchemist | Lemah | 4,44% |
| 4 | Disciple | Lemah | 4,44% |
| 5 | Archaeologist | Lemah | 4,44% |
| 6 | Slayer | Lemah | 4,44% |
| 7 | Druid | Lemah | 4,44% |
| 8 | Rider | Lemah | 4,44% |
| 9 | Goliath | Lemah | 4,44% |
| 10 | Gladiator | Sedang | 3,33% |
| 11 | Survivalist | Sedang | 3,33% |
| 12 | Priest | Sedang | 3,33% |
| 13 | Assassin | Sedang | 3,33% |
| 14 | Cursed | Sedang | 3,33% |
| 15 | Equalizer | Sedang | 3,33% |
| 16 | Paladin | Sedang | 3,33% |
| 17 | Apostle | Sedang | 3,33% |
| 18 | Primordial Champion | Sedang | 3,33% |
| 19 | Colossal Warmech | Sedang | 3,33% |
| 20 | Tamer | Kuat | 2,96% |
| 21 | Mage | Kuat | 2,96% |
| 22 | Gambler | Kuat | 2,96% |
| 23 | Resilient | Kuat | 2,96% |
| 24 | Warlord | Kuat | 2,96% |
| 25 | Vessel | Kuat | 2,96% |
| 26 | Royal | Kuat | 2,96% |
| 27 | Mutant | Kuat | 2,96% |
| 28 | Hybrid | Kuat | 2,96% |

## Interpretasi ranking

Manusia dan NPC tidak memberi bonus langsung. Goblin & Orc/Anime/Machine menggabungkan hasil zonk dan hasil unggulan; rata-rata paket serta risiko menentukan posisi keluarga. Goliath mempunyai buff sederhana dan peluang Berserker, sementara Primordial mempunyai paket enam poin. Resilient/Gambler/Equalizer mengubah mechanics; ranking mempertimbangkan dampak potensial dengan risiko, tanpa menciptakan nilai stat yang belum diputar.

Hybrid Race menggabungkan dua ras; Hybrid Archetype menggabungkan dua role. Mutant mendapat satu ras tambahan. Ketiganya tetap memakai aturan exclusion dan event masing-masing; ranking tidak membuat bonus baru.

## Filter dan engine

Peluang tabel berlaku sebelum exclusion/kompatibilitas/modifier. Jika pilihan dikeluarkan, bobot sektor yang tersisa dipertahankan lalu dinormalisasi; total kelompok boleh bergeser. Engine tidak menambah pilihan pengganti atau memaksa kembali40/33,33/26,67 setelah filter.

Base weight pilihan adalah bobot kelompok dibagi jumlah pilihan kelompok pada katalog lengkap. Pilihan asli tetap mempunyai bobot itu pada setiap invokasi. Modifier yang telah disetujui bekerja sesudah hard guards. Equalizer aktif mengganti bobot akhir menjadi1 untuk setiap pilihan yang eligible, termasuk weight-only zero; tidak menghidupkan pilihan forbidden.

Race Hybrid/host/base/origin/Mutant dan referensi ras memakai katalog Race yang sama di bawah guard masing-masing. Warlord Jenis Pasukan tetap roda tersendiri23 sektor; child race-family mengikuti katalog baru. Jumlah korban/pasukan dan floor5% Slayer tidak berubah. Semua child wheel, hadiah, tier power, urutan bonus akhir, gate tubuh dan raw stat odds tetap mengikuti kontrak sebelumnya.

[planMainWheelOdds](../framework/main-wheel-odds.mjs) mengembalikan urutan dan odds, tanpa spin/event. [selectMainWheelOutcome](../framework/main-wheel-odds.mjs) memilih satu sektor dari satu RNG sample0≤u<1; caller menyimpan hasil sekali sebelum event. planArchetypeStage memakai bobot kanonis setelah filter body/role. Profil tubuh/capability/event tetap diperlukan; catalogReady tidak menggantikan profil tersebut. Mode profile-weights disediakan hanya bagi konfigurasi custom/legacy eksplisit.

Snapshot invokasi menyimpan versi peluang, pool, bobot dan hasil. Run lama tetap menggunakan journal lama. Ranking/distributionBand terpisah dari Power Tier1–5, gate boostBand dan angka stat.

[Preview roda yang bisa diputar](../preview/main-wheels.html) · [Data ranking](../content/main-wheel-strength-design.json) · [Event Race](RACE-WHEEL.md) · [Event Archetype](ARCHETYPE-WHEEL.md).
