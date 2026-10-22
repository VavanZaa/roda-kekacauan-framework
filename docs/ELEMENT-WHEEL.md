# Roda Element universal

Versi `element-wheel/0.2.0` memperluas roda bersama menjadi **12 elemen**, masing-masing
berbobot dasar 1: **1/12 atau sekitar 8,33%** sebelum modifier yang disetujui.
Satu spin memilih satu elemen dan memberi satu power terkait; tidak ada spin tier tambahan.

| Elemen | Power | Tier intrinsik |
| --- | --- | --- |
| Api | Kendali Api | 3 |
| Air | Kendali Air | 3 |
| Tanah | Kendali Tanah | 3 |
| Angin | Kendali Angin | 3 |
| Petir | Kendali Petir | 3 |
| Es | Kendali Es | 3 |
| Logam | Kendali Logam | 3 |
| Tumbuhan | Kendali Tumbuhan, memakai definisi Forest Control | 3 |
| Cahaya | Kendali Cahaya, memakai Concept Light sebagai power biasa | 3 |
| Kegelapan | Kendali Kegelapan | 3 |
| Bayangan | Manipulasi Bayangan | 3 |
| Void | Kendali Kekosongan, memakai definisi Primordial Void | 5 |

**Kegelapan** mengurangi atau menghalangi cahaya. **Bayangan** mengendalikan bentuk
bayangan. **Void** mengendalikan kekosongan sesuai scope definisinya. Void mempertahankan
Tier 5 yang sudah ada; tier bukan hasil mastery dan tidak menjamin angka mastery maksimum.

Element Pixie, Naga, Golem Elemen, Elemental, Dragon, dan Slime Elemental memakai roda yang
sama. Identitas caller dan return point tetap disimpan. Power memakai mastery bersama
karakter; bonus +1 Power Mastery tetap khusus Golem Elemen. Cahaya tidak memberi Authority
atau aturan God. Elemen tidak memberi bonus stat angka tambahan.

Power lama dipakai melalui referensi kanonis. Grant tetap yang sudah dimiliki digabung;
elemen yang sama tidak memanggil ulang event ras asal power. Pilihan elemen menjadi konteks
untuk peluang stat, Weapon, dan Power berikutnya melalui bobot kecil yang bisa dikalibrasi.
Main stat/mastery tetap memakai batas peluang 5%–25%; batas itu tidak diterapkan pada selector
Element yang sama rata.

Invokasi baru memakai 12 pilihan. Jurnal dan episode lama mempertahankan pool empat elemen,
bobot, hasil, serta reward yang sudah dibekukan. Snapshot pemulihan ada di
[sebelum perluasan](../reference/before-element-wheel-expansion-2026-10-11.json).

Data: [katalog Element](../content/universal-element-wheel-design.json).
Preview: pilih tema Element di [studio](../preview/video-wheel-studio.html).

## Integrasi engine dan ilustrasi

[Element Stage](../framework/element-stage.mjs) menyediakan `planElementStage`,
`selectElementOutcome`, dan `resolveElementResult`. Caller harus mempunyai hasil ras
aktual, source/spin ID, dan return point yang sudah committed. Planner membekukan
12 pilihan, referensi/scope power, konteks visual, dan fingerprint inventory sebelum
RNG eksternal memilih hasil. Resolver menghasilkan satu receipt atomik untuk affinity,
grant/merge power, serta konsumsi request; replay tidak memberi hadiah kedua.
Ini helper tahap Element, bukan dispatcher seluruh alur karakter.

Distribusi stat tujuh sumbu, profil peluang Weapon/Power, kelayakan Archetype,
Slayer/Warlord identity-only, dan coverage Size sudah memakai roster 12 elemen.
Elemen baru memakai profil Size bentuk normal pemilik, dengan likelihood stat dan
affinity Power kecil yang berbeda untuk tiap elemen. Bonus angka tetap di akhir.
Gelar juga membaca tag elemen dari identitas atau power kanonis yang benar-benar
dimiliki; power same-name dari file lain tidak menyamar sebagai grant Element.
Weakness tetap membutuhkan proof kapabilitas tubuh aktual, bukan asumsi dari warna gambar.

[Kontrak visual](../content/element-visual-design.json) menyatukan warna, tekstur,
silhouette cue, dan power reference. Golem, Elemental, dan Slime memakai elemen sebagai
material tubuh. Dragon, Naga, dan Pixie memakai motif pada tubuh aslinya. Jumlah anggota
tubuh, Size, gear, dan mastery berasal dari snapshot karakter.

Empat lembar concept art tambahan memuat 24 bentuk tubuh baru dan 12 motif bersama.
Motif mempunyai 36 binding eksplisit untuk tiga caller. Lihat
[katalog ilustrasi](../character-design/reference-library/index.html),
[rencana gambar](../character-design/reference-library/metadata/element-update-plans.json),
dan receipt prompt/asal gambar di `metadata/receipts/element-update-*.json`.
Seluruh prompt aktual dan path gambar tersimpan bersama di
[receipt generasi](../character-design/reference-library/metadata/element-update-generation.json).
Hasil pemeriksaan: 241 tes helper/UI dan 2 tes binding gambar lulus;
lihat [validation receipt](../reference/element-system-validation.json).

`scripts/reference-pack.mjs` menerima `elementResults` dengan ownerRaceNodeId,
wheelId, outcomeId, sourceId, spinId, dan committed. Ia mengikat motif yang cocok,
menolak elemen yang bertentangan dengan material tubuh, dan mempertahankan anatomi
Dragon Form. Contoh request ada di
[element-reference-request.example.json](../character-design/reference-library/metadata/element-reference-request.example.json).
