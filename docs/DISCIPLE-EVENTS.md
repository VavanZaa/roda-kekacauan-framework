# Event Disciple

Disciple memilih satu karakter sebelumnya sebagai guru, lalu spin **Weapon /
Power / Best Stat**. Ambil tepat satu pilihan dalam kategori terpilih secara
acak, kemudian lanjut Backstory.

Mentor → kategori warisan → satu kandidat → grant atau +1 stat → Backstory.
Mentor dan kategori masing-masing punya spin dan reaksi. Pemilihan kandidat
cukup acak internal yang dicatat; tidak menambah roda terlihat.

## Peluang dan hasil

Setiap mentor yang sudah selesai mempunyai peluang sama rata. Karakter saat
ini dan karakter yang masih dibuat tidak masuk pool. Simpan satu snapshot
final per karakter; versi atau alias tidak menambah bobot.

| Kategori | Peluang | Hasil |
| --- | --- | --- |
| Weapon | 1/3 | Satu weapon milik mentor, dipilih acak. |
| Power | 1/3 | Satu power milik mentor, dipilih acak. |
| Best Stat | 1/3 | +1 poin angka pada satu stat terbaik mentor. |

Jika kategori terpilih kosong, **zonk tanpa bonus**. Tidak reroll, mengganti
kategori atau mengubah rasio karena mentor tidak punya weapon/power.

Jika mentor punya beberapa weapon/power, setiap instance berpeluang sama.
Untuk power, keluarkan definisi yang sudah dimiliki karakter baru sebelum pemilihan
kandidat, lalu normalisasi sisa pilihan. Jika semuanya sudah dimiliki, kategori itu zonk.
Dua instance weapon dengan definisi sama tetap dua pilihan; hasilnya hanya
satu. Satu kandidat langsung terpilih. Jika beberapa stat sama-sama terbaik,
pilih satu di antara stat yang seri dengan peluang sama.

Contoh: mentor punya Strength dan Fight sebagai stat terbaik. Hasil kategori
Best Stat berarti 50% Strength +1 atau 50% Fight +1. Bonus menambah stat
karakter baru, tanpa menyalin nilai stat mentornya.

## Mastery dan kepemilikan

Weapon/power diwariskan sebagai grant baru yang dimiliki karakter baru.
Mastery memakai spin normal karakter baru, sesuai klarifikasi pengguna.
Weapon memakai mastery per instance dan aturan Enchant biasa ketika effective
Master atau lebih serta kompatibel. Power memakai satu Power Mastery bersama.

Simpan definisi dan batas bawaan item/power, termasuk binding bentuk/target
yang memang diperlukan. Mastery, enchantment, modifier sumber dan maximum
override God Authority mentor tidak disalin. Race/Archetype/event mentor tidak
dijalankan. Kepemilikan mentor tetap, dan grant milik Disciple bertahan bila
roda Weapon/Power utama nanti menghasilkan None.

## Database dan Best Stat

Adapter database menyediakan snapshot sebelum karakter saat ini disimpan:

```js
{
  id: 'immutable-archive-id',
  catalogVersion: 'catalog-version',
  capturedBeforeCharacterId: 'current-character-id',
  records: [
    {
      characterId, snapshotId, name, status: 'complete',
      weaponInstances: [{ id, definitionId, label, bindings, limitations }],
      powerInstances: [{ id, definitionId, label, bindings, limitations }],
      bestStatIds: ['strength', 'fight'],
      bestStatComparisonProfileId: 'approved-comparison-profile'
    }
  ]
}
```

Contoh di atas adalah kontrak input, bukan karakter contoh yang dimasukkan ke
database. Storage dan adapter produksi belum dibangun. Jika snapshot valid tidak memiliki
karakter sebelumnya yang eligible, **Disciple langsung belajar dari God: satu spin Divine Power**.
Tidak ada mentor/category spin pada cabang ini. Hadiahnya satu power biasa dengan mastery
karakter baru; nama mentor God tidak memberi ras God, Authority base 9, follower atau 80% None.
Jika provider database belum tersedia, fungsi tetap membutuhkan konfigurasi; data hilang berbeda
dari arsip yang diketahui kosong.

Best Stat dibaca dari metadata final mentor. Profil pembanding yang disetujui
harus mengubah masing-masing skala menjadi ranking yang sebanding sebelum
menyimpan `bestStatIds`. Skala lima stat belum final: jangan membandingkan angka
mentah Speed dengan Strength yang mempunyai unit berbeda. Metadata Best Stat
yang belum tersedia memerlukan konfigurasi jika kategori itu terpilih.

## Fungsi untuk engine

[Modul Disciple](../framework/disciple-event.mjs) berisi fungsi murni tanpa RNG,
database I/O atau mutasi karakter:

1. `planDiscipleMentor({ invocationId, currentCharacterId, archiveSnapshot, ownedPowerDefinitionIds })`
   membuat snapshot mentor dan pool sama rata, atau plan `god-lesson` untuk arsip kosong.
2. `planDiscipleInheritance(mentorPlan, mentorResult)` membuat tiga kategori
   setelah result mentor aktual dicatat.
3. `planDiscipleReward(categoryPlan, categoryResult, { ownedPowerDefinitionIds })` memberi pool kandidat
   internal atau hasil zonk. Kekurangan profil Best Stat ditandai eksplisit.
4. `resolveDiscipleInheritance(pickPlan, pickResult)` menghasilkan satu grant
   atau modifier stat dengan `ledgerKey` stabil.
5. `resolveDiscipleGodLesson(lessonPlan, lessonResult)` menyelesaikan satu Divine lesson
   dari hasil aktual cabang arsip kosong.

Result spin memakai `{ invocationId, spinId, outcomeId }`. Pick internal memakai
`{ invocationId, pickId, outcomeId }`. Engine mendatang menyimpan plan sebelum
sampling seeded, mencatat setiap result/pick sekali, lalu menerapkan reward
secara atomik melalui ledger. Pengulangan tidak membaca ulang database atau
memberikan warisan lagi. Helper hanya menghasilkan reward, bukan pelaksana
database, normal mastery atau renderer.

Konteks ditumpuk berdasarkan result aktual. “Disciple. Gurunya siapa?”,
“Dapat weapon: {label}.” atau “Warisan kosong. Zonk.” cukup sebagai caption.
Pemilihan internal/fixed grant tidak menjadi spin tambahan atau pemicu Shrek;
tidak menambah funny-result tag tanpa aturan katalog.

Run dari root proyek:

```powershell
node --test framework/tests/disciple-event.test.mjs
```

Event sudah ditentukan. Profil tubuh/role-fit, pool Archetype final, katalog
runtime dan adapter arsip tetap konfigurasi terpisah. Race/Archetype sedang ditutup sebelum Backstory.
