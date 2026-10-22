# Fungsi gate Archetype

Default planArchetypeStage memakai oddsPolicy canonical-strength: filter profil body/role dahulu, lalu ambil bobot dan urutan roda28 kanonis. Mode profile-weights mempertahankan konfigurasi custom/legacy eksplisit. Versi peluang main-wheel-strength/1.0.0 disimpan terpisah dari versi klasifikasi gate1.5.0; journal lama tidak diubah. Lihat [ranking/odds](MAIN-WHEELS.md).

Policy terbaru `archetype-eligibility/1.5.0` mencakup22 ras. Aturan awal diterima pada 9 Oktober2026; Centaur compatible spin dan Cosmic skip diterima pada 10 Oktober2026.
Implementasi: [archetype-eligibility.mjs](../framework/archetype-eligibility.mjs).
Aturan tiap ras/subras: [audit eligibility](ARCHETYPE-ELIGIBILITY.md) dan
[policy JSON](../content/archetype-eligibility-design.json).

Engine memanggil `planArchetypeStage` setelah seluruh event Race selesai, termasuk
kedua komponen Hybrid, host Symbiote, base Raksasa, dan origin Skeleton/Zombie.
Saint harus mencatat satu hasil saint-cosmic-armor; Lantern satu lantern-ring-color; Ultraman satu ultraman-color. Hasil child yang tidak sesuai kelompok ditolak. Centaur membutuhkan hasil tubuh bawah dan profil body/pool yang compatible.
Evaluasi berlaku satu kali untuk karakter gabungan. Fungsi ini tidak menjalankan
spin, narasi, atau effect ledger.

| Keputusan | Spin | Langkah engine |
| --- | --- | --- |
| `spin` | 1 | Simpan plan; putar pool `eligibleOutcomes`; selesaikan event hasil role; lanjut Backstory. |
| `skip` | 0 | Simpan keputusan skip; langsung lanjut Backstory. |
| `needs_configuration` | Belum ditentukan | Lengkapi profil yang tercantum di `required`; jangan jadwalkan spin/Backstory dulu. |

Raksasa selalu skip pada policy ini, termasuk saat menjadi komponen Hybrid,
host, atau origin undead. Aturan dua Archetype sebelumnya sudah dipensiunkan;
base-race events, giant Size, dan Cosmic tetap berlaku. Run lama yang sudah
commit mengikuti journal/policy lamanya.

## Pemanggilan

Modul ESM membutuhkan Node.js 22 atau runtime yang mendukung JSON import
attributes dan `structuredClone`. Tidak ada dependency tambahan.

```js
import {
  planArchetypeStage,
  commitArchetypePlan,
} from './framework/archetype-eligibility.mjs';

const plan = planArchetypeStage(characterState, {
  profiles: approvedProfiles,
  archetypes: approvedArchetypeRoster,
});

if (plan.decision === 'needs_configuration') {
  return { status: 'configuration_required', required: plan.required };
}

const nextState = commitArchetypePlan(characterState, plan);
// Engine menyimpan nextState dan penjadwalan tahap secara atomik.
// plan.invocationId menjadi kunci dedup penjadwalan.
// spin: gunakan eligibleOutcomes; skip: lanjut plan.nextStage (backstory).
```

`evaluateArchetypeNeed(state, options)` tersedia untuk mengecek keputusan ras
sebelum filter role. Hasil baru berupa `candidate`, `skip`, atau
`needs_configuration`. `candidate` belum memberi izin spin: engine memakai
`planArchetypeStage` untuk memvalidasi tubuh dan pool. Pada state yang sudah
commit, kedua fungsi mengembalikan plan tersimpan dengan `replayed: true`.

## Input Race yang dinormalisasi

```js
const characterState = {
  raceTree: {
    completed: true,
    pendingInvocations: [],
    roots: [{
      sourceId: 'run-42:race-1',
      familyId: 'human',
      completed: true,
      results: [],
      children: [],
    }],
  },
  bodyProfileId: 'body-42',
  usedRaceFamilyIds: ['human'], // opsional; jika ada, harus cocok seluruh tree
};
```

`roots` berisi tepat satu outer node; Hybrid menyimpan dua komponennya sebagai
children. Setiap node memakai canonical family ID, `sourceId` unik, array
`results`, array `children`, serta `completed: true`. Setiap hasil event berisi
`{ spinId, wheelId, outcomeId }` dengan `spinId` unik. Gunakan ID katalog, bukan
label tampilan. `results` hanya memuat spin aktual milik sumber node tersebut;
fixed grant bukan spin tambahan. Pool/outcome valid terdapat di
`runtimeRules.validOutcomes` pada policy JSON.

| Node induk | Children yang diwajibkan |
| --- | --- |
| Hybrid | Dua `{ relation: 'hybrid-component', node }` |
| Symbiote | Satu `{ relation: 'host', node }` |
| Raksasa | Satu `{ relation: 'base', node }` |
| Skeleton/Zombie dalam Lelembut Impor | Satu `{ relation: 'origin', node }` |
| Node lain | Tidak ada children identity |

Semua family dalam tree harus berbeda, sesuai history global Race. Vampire
prey adalah result referensi, bukan child identity dan tidak menjalankan event
ras mangsa. Siluman menyimpan tepat satu hasil animal dari 12 jenis pada satu node Race. Selektor yang menentukan keputusan wajib sudah memiliki hasil,
misalnya subtype Elf dan Holy/Cursed/Blood aktual, armor count beserta seluruh
piece unik, atau kedua Tech Sci-fi Cyborg. Label `completed` menandakan engine
sudah menyelesaikan seluruh event sumber; gate tidak menggantikan executor
Race atau memverifikasi effect ledger. Untuk family yang selalu skip, subtype
yang tidak memengaruhi verdict tidak wajib dibaca gate.

Stat base, Size/Cosmic, Weapon/Power normal, mastery yang belum diputar, dan
hasil tahap sesudah Race tidak menjadi input keputusan. Inventory tetap
dimiliki; gate membaca fakta race dari tree dan tidak mengubah grant, bonus,
penalti, atau ticket Weapon/Power yang sudah tercatat.

## Profil tubuh, gabungan, dan role

Profil ini harus ditetapkan dalam desain berikutnya. Tidak ada profil tubuh
Human atau event Archetype yang otomatis diaktifkan oleh implementasi gate.

```js
const approvedProfiles = {
  bodies: {
    'body-42': {
      approved: true,
      sourceIds: ['run-42:race-1'],
      capabilities: ['hands', 'biological'],
      allowedBoostBands: ['none', 'light'],
    },
  },
  compositions: {},
};
```

Contoh di atas menunjukkan schema, bukan profil gameplay yang sudah disetujui.
`sourceIds` tubuh harus cocok tepat dengan seluruh tree karakter, agar profil
orang lain tidak dipakai. Capabilities merupakan tag eksplisit yang disepakati.
`allowedBoostBands` memilih kategori boost role yang diizinkan; gate tidak
menetapkan skor universal power/stat atau menebak kategori dari nama role.

Gabungan beberapa paket ringan, atau komponen yang skip karena tubuh saja,
memerlukan `node.compositionProfileId` yang merujuk:

```js
{
  approved: true,
  sourceIds: ['source-parent', 'source-child-1', 'source-child-2'],
  upperHand: 'light', // atau 'strong'
}
```

Scope harus mencakup tepat subtree tersebut. Paket kuat membuat gabungan skip.
Keputusan ringan masih melewati filter tubuh/role. Tidak ada fusion humanoid
otomatis. Symbiote 0–40% mengikuti host dan paket gabungannya; host yang skip
tidak diaktifkan kembali. Takeover 50–100% skip.

Siluman memiliki satu hasil hewan dari 12 pilihan. Tidak membutuhkan profil sampling berulang. Bentuk normal humanoid berciri hewan disetujui pengguna; binding body/capability dan role tetap harus tersedia.

Setiap role yang aktif memerlukan schema berikut:

```js
{
  id: 'role-id',
  approved: true,
  enabled: true, // opsional; false mengeluarkannya dari pool
  eventProfile: { id: 'approved-event-id', approved: true },
  requirements: { all: ['hands'], any: [], forbidden: [] },
  compatibleSpecializations: [],
  boostBand: 'light', // none / light / strong, harus ditetapkan eksplisit
  baseWeight: 1, // default 1 jika tidak ditentukan
}
```

`all` harus terpenuhi seluruhnya; `any` kosong berarti tanpa syarat alternatif;
`forbidden` tidak boleh ada pada tubuh. `compatibleSpecializations` harus
mendukung semua spesialisasi yang dibawa verdict, misalnya `shaman`,
`orc-warrior`, `healer-fairy`, `siluman`, `technician`, `orang-saleh`, atau
`pemuka-agama`. Tag ini perlu diterjemahkan menjadi aturan event yang konkret
saat mendesain role. Referensi 39 label dari dua video belum menjadi roster
final. NPC memiliki `npc-no-event`, Slayer `slayer-victim-hunt`, Disciple
`disciple-inheritance`, Survivalist `survivalist-environment`, dan Archaeologist
`archaeologist-bone-discovery`, serta Tamer `tamer-companion` dengan core event disetujui. [Slayer](SLAYER-EVENTS.md),
[Disciple](DISCIPLE-EVENTS.md), [Survivalist](SURVIVALIST-EVENTS.md), dan
[Archaeologist](ARCHAEOLOGIST-EVENTS.md), dan [Tamer](TAMER-EVENTS.md) memiliki planner/resolver tersendiri.
Keenamnya tidak mengaktifkan seluruh roster atau melengkapi profil tubuh/
kompatibilitas serta boost band role yang belum ditentukan.

Filter dilakukan sebelum spin. Hanya hasil kompatibel yang mendapat peluang
`weight / totalWeight`. Profil yang belum lengkap memberi
`needs_configuration`; pool lengkap tanpa role yang cocok memberi `skip`.
ID role duplikat serta bobot nol/negatif/non-finite merupakan error.

## Commit, resume, dan error

Plan memuat `policyVersion`, `sourceIds`, `inputFingerprint`, `invocationId`,
`reasonCodes`, `spinCount`, `nextStage`, dan snapshot pool/peluang. Commit hanya
menerima `spin` atau `skip` untuk input Race yang sama. Plan disalin ke
`state.archetypeDecision`, tanpa mengubah state yang diberikan.

Resume menggunakan snapshot tersebut, walaupun konfigurasi sudah berubah atau
karakter memperoleh hasil tahap berikutnya. Perubahan input Race setelah
commit memberi `RACE_SNAPSHOT_CHANGED`; tidak ada spin ulang otomatis. Engine
tetap bertanggung jawab menyimpan state secara atomik, memakai seeded RNG,
menyimpan hasil spin, menjalankan event/narasi sekali, dan memulihkan saved
caller. `invocationId` bersifat unik dalam run; gabungkan dengan run ID jika
queue engine memakai namespace global.

Skip tidak menciptakan hasil NPC/None, role reward, meme spin, atau trigger
Shrek. Narator boleh memakai fakta skip dari journal. Konfigurasi belum lengkap
tidak boleh disimpan sebagai skip palsu. Input tidak valid melempar
`ArchetypeInputError` dengan `code` yang bisa ditangani engine, misalnya
`RACE_NOT_COMPLETE`, `RACE_FAMILY_REPEATED`, `RACE_RESULT_MISSING`,
`ARMOR_INCOMPLETE`, `BODY_SCOPE_MISMATCH`, atau `COMPOSITION_SCOPE_MISMATCH`.

## Verifikasi

Dari root proyek:

```text
node --test framework/tests/archetype-eligibility.test.mjs
```

Fixture profil/event dalam test hanya untuk verifikasi API. Tidak menambahkan
mekanik role ke katalog produksi.

## Mutasi setelah keputusan Archetype

[Mutant](MUTANT-EVENTS.md) dapat menambah ras setelah role terpilih. Gate tetap memakai snapshot tree/history sebelum mutasi, termasuk profil tubuh yang dipakai saat pemilihan. Simpan root mutasi/komposisi saat ini terpisah; jangan menambahkan child mutasi ke node Human/Elf pada input gate lama atau memanggil gate lagi dengan history yang sudah bertambah. Body/Size berikutnya memakai komposisi lengkap yang sudah disetujui. Keputusan dan hasil Mutant tidak dibatalkan oleh ras baru yang biasanya skip Archetype. Ini kontrak executor mendatang; fungsi gate saat ini tetap utuh.
