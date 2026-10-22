# Jenis dan Event Heavenly Principle

Keputusan terbaru — 10 Oktober 2026: **Jaminan maksimum langsung menjadi
nilai dasar, tanpa spin. God memakai satu dasar Power Mastery9 untuk seluruh
power saat ini maupun yang didapat nanti. Vessel God pada Compatibility60–100
mewarisi jaminan tersebut. Lich langsung Durability9.** Bonus/debuff tetap di
akhir dan boleh menghasilkan angka negatif/melebihi9. Nilai otomatis bukan
hasil spin: tidak memberi Lucky hit, retry Resilient atau kategori raw Pawn.
Aturan ini menggantikan scope Authority-only dan spin singleton Lich di
catatan sebelumnya. Plan lama tetap dibaca sesuai riwayatnya.


Heavenly Principle memutar satu jenis dari **God, Demigod, Angel, Utusan Tuhan, Pemuka Agama,
dan Orang Saleh**, dengan bobot **1:1:2:2:3:3**. Setiap hasil menjalankan event pada tabel,
lalu kembali ke pemanggil; pada alur ras utama lanjut ke Archetype.

## Enam hasil jenis

| Jenis | Bobot | Event dan grant |
| --- | --- | --- |
| God | 1 | Satu God Concept → Authority hasil itu dengan mastery maksimum; dua Divine Power spin, lalu satu Jumlah Pengikut spin dengan bonus stat saja. Power normal nanti 80% None/20% mendapat power. |
| Demigod | 1 | Satu God Concept → power biasa; kelima main stat masing-masing +1. |
| Angel | 2 | Dua Angelic Power spin. |
| Utusan Tuhan | 2 | Satu God Concept → power biasa; +1 rank Power Mastery bersama. |
| Pemuka Agama | 3 | Satu Divine Power spin. |
| Orang Saleh | 3 | Fixed power Komunikasi dengan Tuhan. |

Total bobot 12. Bobot hanya untuk jenis Heavenly Principle; peluang roda ras utama, Concept,
dan Divine Power berdiri sendiri. Modifier Demigod adalah poin angka, dicatat sekali pada
hasil jenis dan ditambahkan setelah base masing-masing stat diputar.

Tidak ada selector Divine lineage, Awakening, Angel order, tugas, ras mortal, atau agama
selain event yang dinyatakan di atas. God/Demigod/Angel tetap menjadi jenis dalam family ini;
Utusan/Pemuka/Orang Saleh menjadi pilihan peran sesuai rancangan pengguna.

## Pengikut God

God menyelesaikan Concept Authority, Divine 1, Divine 2, lalu memutar satu
[Jumlah Pengikut](UNIVERSAL-FOLLOWER-WHEEL.md). Count dan bobot sama dengan Raja Iblis Agung:
0/10/100/1.000/10.000/100.000/1 juta/10 juta/100 juta, bobot 3:3:3:3:3:2:2:2:1 (total 22).
God **hanya mendapat bonus kelima stat**: 1 juta/10 juta +1 tiap stat; 100 juta total +2 tiap
stat. Count lebih rendah tanpa bonus. Tidak ada follower Power Mastery.
Interpretasi kerja memakai satu baris hadiah terpilih, tanpa stacking threshold.
Catat count/reward per source component dan ledger sekali, react, baru kembali ke pemanggil.
Authority maksimum khusus instance dan Power normal 80/20 tetap berlaku.

## God Concept bersama

God, Demigod, dan Utusan memakai **satu selector god-concept**. Hasil memberi satu kemampuan
yang terikat pada Concept terpilih. God mendapat role Authority; Demigod dan Utusan mendapat
role power biasa. Pemilihan Concept tidak memberi seluruh kemampuan roda lain atau memicu
event ras God/Hybrid lagi.

Draft starter berisi **12 Concept**, dengan jumlah/isi yang masih bisa diubah:

| Concept | Concept | Concept |
| --- | --- | --- |
| Kehidupan | Kematian | Waktu |
| Ruang | Takdir | Pengetahuan |
| Perang | Cinta | Alam |
| Laut | Badai | Cahaya |

Kedua belas Concept draft memakai bobot dasar 1, masing-masing 1/12 sebelum modifier. Scope tiap Concept memiliki mode power/Authority, domain,
cost dan limits yang perlu disempurnakan. Data kanonis ada pada
[roda Concept](../content/universal-concept-wheel-design.json).

## Authority God dan satu mastery spin

**Authority hasil Concept God memakai base Power Mastery 9**, lalu menerima bonus/debuff
Power Mastery bersama di akhir. Base 9 + bonus 2 menjadi 11. Catat override pada grant sumber
God itu saja. Dua Divine, normal Power dan grant biasa tetap memakai raw bersama.

Satu Power Mastery spin tetap dilakukan untuk power biasa; Authority tidak membuka spin
tambahan. Jangan memindahkan base 9 ke grant biasa yang kebetulan memiliki definition/Concept sama.
Utusan Tuhan menambah +1 bersama sekali dari sumbernya. Demigod memakai mastery biasa.
Nilai final boleh negatif atau lebih dari 9. Lihat [Power Mastery](POWER-MASTERY.md).

## Peluang Power normal God

Sesudah mendapat God, roda Power normal memiliki **80% None dan 20% mendapat power**.
Di dalam kelompok 20%, gunakan perbandingan bobot power eligible setelah modifier lain
berlaku. Ini satu actual spin; tidak ada roda gagal/sukses tambahan.

None tidak menghapus Authority atau Divine Power yang sudah dimiliki. Penalti berlaku pada
main normal Power dan bonus acquisition yang memakai pool normal serta mengizinkan None.
Concept, Divine/themed spin, fixed grants, direct title reward, serta acquisition yang
secara eksplisit menjamin power tidak terkena penalti ini. Catat sumber dan final odds
sebelum spin; source yang dievaluasi ulang tidak melipatgandakan peluang gagal.

## Divine dan Angelic Power

God tetap mendapat **dua Divine Power**, Pemuka Agama **satu Divine Power**. Angel sekarang mendapat **dua Angelic Power**. Setiap roda berisi **20 pilihan**, disusun Tier 1–5 dengan empat power per tier. Bobot dasar 1 per hasil: **5% per power** sebelum modifier yang diotorisasi. [Daftar seluruh power](UNIVERSAL-POWER-WHEELS.md).

Satu invokasi memberi satu power, dengan hasil/reaksi/provenance sendiri. Sebelum invokasi kedua,
keluarkan power yang sudah dimiliki dan normalisasi sisa roda kanonis. Grant tetap identik digabung
dengan semua sumbernya. Grant biasa memakai shared mastery; base 9 God khusus Concept Authority.
Holy sendiri tetap dua belas pilihan.

## Komunikasi dan konteks narator

Orang Saleh mendapat **Komunikasi dengan Tuhan** sebagai satu power tetap: jalur komunikasi
atau petunjuk dalam limits game, dengan ekspresi menurut mastery bersama. Grant ini tidak
memerlukan acquisition spin tambahan.

| Jenis | Contoh celetukan |
| --- | --- |
| God | “Authority dapet, dua Divine ikut. Cek pengikut; bonusnya stat, cari power tambahan cuma 20%.” |
| Demigod | “Demigod: semua stat +1. Concept dapet, mastery-nya tetap spin biasa.” |
| Angel | “Angel dapet dua Angelic spin. Power-nya tunggu hasil, bos.” |
| Utusan Tuhan | “Utusan Tuhan dapet Concept dan mastery +1. Power-nya ikut satu rank bersama.” |
| Pemuka Agama | “Pemuka Agama dapet satu Divine spin. Isi build-nya tunggu roda.” |
| Orang Saleh | “Orang Saleh dapet Komunikasi dengan Tuhan. Jalur komunikasi kebuka.” |

Konteks menumpuk jenis aktual, Concept/role, owned powers, modifier sumber, dan hasil yang
sudah tersedia. Nama Concept/Divine/Angelic belum diketahui sebelum child spin; base/final stat
serta rank bersama tidak muncul sebelum tahapnya. Contoh celetukan hanya narasi, tanpa efek
atau tag funny-result tambahan.

Seluruh grant tetap owned jika main Power None. Caller inherited Skeleton/Zombie atau
Hybrid/host yang diotorisasi memakai profil dan provenance komponen yang sama, history ras
tanpa pengulangan, serta saved return. Semua jenis mengikuti Size global; acuan badan
bersumber dan balance limits masih perlu ditetapkan. Replay tidak memberi grant/bonus/spin kedua.

Data: [profil Heavenly](../content/heavenly-principle-events-design.json),
[roda power](../content/universal-power-wheels-design.json),
[roda ras](../content/race-wheel-design.json), dan [framework](../framework/spec.json).
