# Roda Jumlah Pengikut

**God dan Raja Iblis Agung memutar satu roda follower-count yang sama.** Sembilan pilihan
memakai bobot **3:3:3:3:3:2:2:2:1**, total **22**. Rasio lengkap diklarifikasi pengguna;
bobot khusus ini tidak diganti default sama rata atau modifier peluang yang belum disetujui.

| Pengikut | Bobot | Peluang | Raja Iblis Agung | God |
| --- | --- | --- | --- | --- |
| 0 | 3 | 13,64% | Tanpa bonus | Tanpa bonus |
| 10 | 3 | 13,64% | Tanpa bonus | Tanpa bonus |
| 100 | 3 | 13,64% | +1 Power Mastery | Tanpa bonus |
| 1.000 | 3 | 13,64% | +1 Power Mastery | Tanpa bonus |
| 10.000 | 3 | 13,64% | +2 Power Mastery | Tanpa bonus |
| 100.000 | 2 | 9,09% | +2 Power Mastery | Tanpa bonus |
| 1 juta | 2 | 9,09% | +1 tiap main stat | +1 tiap main stat |
| 10 juta | 2 | 9,09% | +1 tiap main stat | +1 tiap main stat |
| 100 juta | 1 | 4,55% | +2 tiap main stat | +2 tiap main stat |

Bonus kelima stat berarti tambahan poin angka pada **Strength, Speed, Durability, Intelligence,
Fight**, bukan naik tier. Raja mendapat mastery hanya pada 100/1.000/10.000/100.000. God mendapat
**hanya bonus kelima stat**, tanpa bonus follower Power Mastery, sesuai jawaban pengguna.

Interpretasi kerja: gunakan **satu baris hadiah hasil terpilih**, tanpa menjumlahkan ambang
pengikut lebih rendah. 1 juta Raja memberi +1 tiap stat tanpa bonus follower Power Mastery; 100 juta memberi
total +2 tiap stat dari event ini. Modifier sumber lain tetap mengikuti ledger masing-masing.

## Urutan dan return

- Raja Iblis Agung: Demonic 1 → Demonic 2 → Demonic 3 → Demonic 4 → Pengikut → saved caller.
- God: Concept Authority → Divine 1 → Divine 2 → Pengikut → saved caller.

Setiap actual spin mempunyai result/reaction, snapshot odds dan invocation ID sendiri.
Count 0 tetap diputar dan direaksikan: “Nol pengikut. Grup chat-nya cuma admin.”
Jumlah pengikut tidak otomatis berarti pasukan, command position, korban atau bonus lain.
God tetap memiliki Authority maksimum khusus instance-nya serta 80/20 pada Power normal.

## Ledger dan konteks

Simpan followers[] per source component dengan family/subtype, count, source invocation dan
rewardProfileId. God memakai policy god; Raja policy demon-lord. Mismatch atau policy tidak
terdaftar menjadi configuration error. Dua komponen independen tidak menimpa count satu sama lain.

Commit count dan hadiah terpilih sebelum reaction. Bonus stat menunggu immutable base masing-masing,
atau menghitung ulang base+ledger jika sudah tersedia, dengan bounds/mapping yang dideklarasikan.
Bonus mastery Raja mengubah common rank sekali per sumber, dari immutable base dan distinct
modifiers/cap. Tidak dikalikan jumlah power, tidak membuat spin baru, dan tidak menurunkan
Authority God yang sudah maximum. Pengikut tidak memberi Enchant.

Source key mencegah replay/media retry mengulang count, hadiah atau spin. Narator menyebut count
dan bonus aktual yang sudah committed, tanpa menebak base/final stat atau rank yang belum diputar.
Roda stat utama tetap dijalankan; followers bukan pengganti lima spin itu.

Data kanonis: [universal-follower-wheel-design.json](../content/universal-follower-wheel-design.json).
Caller: [Abyssal Axiom](ABYSSAL-AXIOM-TYPES.md), [Heavenly Principle](HEAVENLY-PRINCIPLE-EVENTS.md).


## Vessel dengan compatibility90–100

Caller tambahan yang diotorisasi: Vessel God90/100 memakai row god; Vessel Raja90/100 memakai row demon-lord. Count/bobot/hadiah sama; sumber nyata adalah patron/compatibility/follower Vessel, bukan komponen ras buatan. Band lain tidak memanggil follower. Bonus Raja mastery berlaku sekali pada rank bersama di akhir; God follower tetap hanya bonus stat pada count tinggi. Seluruh count dan sumber tersimpan terpisah, tidak menjadi pasukan.
