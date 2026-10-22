# Event Mage

Core disetujui pengguna: Mage spin **Jadi Master Sihir?** dengan peluang
Master Sihir **10%**, Mage Biasa **90%**. Event ini hanya menyiapkan aturan
untuk tahap Power nanti; tidak spin atau grant power sekarang.

## Chance sekarang, Power nanti

| Hasil chance | Peluang | Spin utama nanti | Extra spin Mage nanti | Total spin Power dari Mage |
| --- | --- | --- | --- | --- |
| Master Sihir | 10% | 1 | 2 | **3** |
| Mage Biasa | 90% | 1 | 1 | **2** |

Semua spin Power yang dikelola Mage **dijamin mendapat power**. Total sudah
termasuk spin utama, bukan tiga atau dua tambahan. Power awal serta extra
spin dari ras/sumber lain tetap disimpan dan mengikuti aturan sumbernya;
angka ini tidak membatasi total seluruh power karakter.

Alur sekarang: Mage → satu chance 1:9 → simpan hasil, binding spin utama,
ticket extra dan modifier yang relevan → reaksi → Backstory.

Nanti: spin Power utama → extra acquisition yang telah diotorisasi, termasuk
satu/dua ticket Mage → **satu Power Mastery bersama** → Weakness.
Setiap acquisition punya hasil, detail event, grant dan reaksi sendiri.

## Master Sihir: bobot Tier 3–5 ×3

Pengguna memilih multiplier **3** untuk ketiga spin yang dikelola Master Sihir.

| Tier intrinsik power | Multiplier bobot |
| --- | --- |
| 1 | ×1 |
| 2 | ×1 |
| 3 | **×3** |
| 4 | **×3** |
| 5 | **×3** |

Gunakan tier dari definisi power yang tepat pada [Tier Power](POWER-TIERS.md).
Setelah eligibility dan pengecualian no-power, kalikan bobot dengan modifier
lain yang memang diotorisasi dan factor Mage ini, lalu normalisasi. ×3 berarti
bobot relatif meningkat, bukan persentase akhir otomatis dikali tiga.
Tier 1–2 masih mungkin terpilih. Jangan mengubah tier berdasarkan mastery.

Modifier hanya untuk spin utama yang terikat ke plan Master Sihir dan kedua
extra ticket-nya. Tidak mengubah power ras yang sudah diperoleh, spin tema
Divine/Cursed/Element, ticket dari sumber lain atau mastery. Mage Biasa tidak
mendapat bonus bobot tier. Factor yang sama tidak menjadi ×9/×27 akibat replay,
jumlah ticket atau jumlah power. Tuning harus mempertahankan factor ×3 yang
disetujui; konflik batas konfigurasi tidak boleh menguranginya diam-diam.

## Jaminan power dan mastery

Sebelum masing-masing spin yang dikelola Mage, nonaktifkan None dan setiap
hasil yang tidak benar-benar memberi power. Freeze pool serta odds aktual,
lalu spin sekali. Tidak roll None lalu reroll. Jika catalog/metadata tidak
valid atau semua kandidat power terblokir, hasilnya configuration error;
jangan menciptakan power atau melewati ticket wajib.

God normal Power 80% None sudah mengecualikan grant yang dijamin. Karena itu
jaminan Mage tidak boleh berubah menjadi 80% None; ticket lain tetap punya
aturan None sendiri. Repetition/grant memakai kebijakan Power global; dua/tiga
spin tidak otomatis berarti dua/tiga definisi unik atau aturan reroll duplikat.

Nama Master Sihir adalah flag hasil chance, bukan jaminan rank Power Mastery
Master/maksimum. Tidak ada bonus mastery, main stat, weapon, Enchant power
atau spin mastery tambahan. Semua power tetap membaca satu mastery normal.

## Penyimpanan dan replay

Freeze versi chance/pool/odds/hasil/plan. Commit main binding, ticket ordinal
1 atau 1/2 dan conditional modifier sekali secara atomik dengan source ledger.
Setiap spin acquisition nanti membekukan pool/tier/odds/result sendiri, lalu
grant dan consume ticket secara atomik. Resume dan retry video tidak menambah
spin, power, ticket atau aplikasi modifier.

Konteks sekarang berisi hasil chance, total spin Power yang dijanjikan, jaminan
dan bias tier jika aktif. Power dan mastery masa depan tetap belum diketahui.
Caption tidak membuat funny-result tag baru.

[Desain Mage](../content/mage-events-design.json) sudah ditautkan ke spec.
Runtime helper/ticket/odds resolver belum diimplementasikan. Catalog Power
normal, duplicate policy global, final body/role fit, serta batas odds
lainnya masih konfigurasi. Berikutnya **Royal**.
