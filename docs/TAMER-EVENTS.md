# Tamer dan Animal To Tame

Tamer → satu spin **Animal To Tame** → langsung mendapat **satu companion**
dan **Taming Power** → reaksi narator → Backstory. Companion diperoleh langsung,
tanpa roda peluang keberhasilan menjinakkan.

## Peluang dan komposisi

| Kelompok | Jumlah | Peluang gabungan |
| --- | --- | --- |
| Hewan masa kini | 32 | 50% |
| Hewan masa lalu | 16 | 25% |
| Mythical Beast | 8 | 12,5% |
| Pop Culture | 8 | 12,5% |
| Total | 64 | 100% |

Jumlah **32/16/8/8** ditentukan pengguna. Semua companion berada pada satu
roda, masing-masing bobot 1 dan peluang **1/64 = 1,5625%**. Kelompok hanya
merapikan tampilan; tidak ada spin kategori. Nama spesifik di bawah adalah
draft editable.

## Draft 64 companion

### Hewan Masa Kini

| # | Companion |
| --- | --- |
| 1 | Semut |
| 2 | Nyamuk |
| 3 | Lalat |
| 4 | Kecoa |
| 5 | Cacing Tanah |
| 6 | Siput |
| 7 | Laba-laba |
| 8 | Kalajengking |
| 9 | Ayam |
| 10 | Bebek |
| 11 | Merpati |
| 12 | Burung Hantu |
| 13 | Elang |
| 14 | Kucing |
| 15 | Anjing |
| 16 | Kelinci |
| 17 | Tikus |
| 18 | Musang |
| 19 | Kambing |
| 20 | Babi |
| 21 | Sapi |
| 22 | Kuda |
| 23 | Lele |
| 24 | Ikan Cupang |
| 25 | Ular Kobra |
| 26 | Komodo |
| 27 | Buaya |
| 28 | Serigala |
| 29 | Harimau |
| 30 | Gajah |
| 31 | Orca |
| 32 | Paus Biru |

### Hewan Masa Lalu

| # | Companion |
| --- | --- |
| 33 | Dire Wolf |
| 34 | Glyptodon |
| 35 | Smilodon / Sabertooth Tiger |
| 36 | Woolly Mammoth |
| 37 | Woolly Rhino |
| 38 | Megatherium / Giant Sloth |
| 39 | Paraceratherium |
| 40 | Titanoboa |
| 41 | Velociraptor |
| 42 | Iguanodon |
| 43 | Triceratops |
| 44 | Ankylosaurus |
| 45 | Spinosaurus |
| 46 | T-rex |
| 47 | Mosasaurus |
| 48 | Megalodon |

### Mythical Beast

| # | Companion |
| --- | --- |
| 49 | Kuda Sembrani |
| 50 | Garuda |
| 51 | Makara |
| 52 | Naga |
| 53 | Dragon |
| 54 | Phoenix |
| 55 | Griffin |
| 56 | Cerberus |

### Pop Culture

| # | Companion | Franchise |
| --- | --- | --- |
| 57 | [Kyūbi (Kurama)](https://naruto-official.com/en/news/01_1896) | Naruto |
| 58 | [Pikachu](https://www.pokemon.com/us/pokemon-video-games/pokemon-lets-go-pikachu-and-pokemon-lets-go-eevee) | Pokémon |
| 59 | [Agumon](https://digimon.net/reference_en/detail.php?directory_name=agumon) | Digimon |
| 60 | [Toothless](https://www.dreamworks.com/movies/how-to-train-your-dragon) | How to Train Your Dragon |
| 61 | [Appa](https://www.avatarstudiosofficial.com/characters/) | Avatar: The Last Airbender |
| 62 | [Chopper](https://one-piece.com/character/chopper/index.html) | One Piece |
| 63 | [Totoro](https://gkids.com/films/my-neighbor-totoro/) | My Neighbor Totoro |
| 64 | [Scooby-Doo](https://www.warnerbros.com/movies/scoob) | Scooby-Doo |

Paus Biru dan Orca berada di hewan masa kini, sesuai [NOAA Blue Whale](https://www.fisheries.noaa.gov/species/blue-whale)
dan [NOAA Killer Whale](https://www.fisheries.noaa.gov/species/killer-whale).
Megalodon ditempatkan pada hewan purba, mengikuti [NHM](https://www.nhm.ac.uk/discover/is-megalodon-still-alive.html).
Taming hewan masa lalu, mythical atau pop culture adalah aturan dunia fantasi game.
Kyubi/Kurama merupakan satu pilihan Naruto; alias tidak memberi bobot ganda.
Karakter named seperti Chopper dan Totoro masuk kelompok companion fiksi.
Kemampuan dan bentuk franchise perlu profil companion tersendiri, tanpa
spin evolusi, Digivolution, Jinchuriki atau tambahan bonus pemilik otomatis.

## Companion dalam karakter

Setiap hasil menghasilkan satu entitas companion milik karakter, termasuk
Semut, Nyamuk dan Kecoa. Companion dicatat dengan identitas, owner, sumber
spin, versi katalog dan batas kemampuan. Main Weapon/Power None tetap
mempertahankan companion yang sudah diperoleh.

Kemampuan, ukuran, habitat, aksi serta combat profile companion perlu
dilengkapi per hewan. Paus/ikan memerlukan konteks penempatan akuatik;
roda ini tidak otomatis memberi kemampuan hidup di darat atau terbang.
Tamer juga mendapatkan **Taming Power**, untuk menjinakkan, melatih dan
membangun kerja sama dengan makhluk. Target/resistance/kapasitas masih
perlu dikonfigurasi. Power masuk inventory pemilik, bertahan setelah main
Power None dan memakai satu Power Mastery bersama. Tidak ada spin power
acquisition tambahan; companion dan grant power dicatat sebagai satu paket.
Pengguna belum menentukan companion mastery/leveling/bonding atau tambahan
bonus pemilik selain Taming Power. Identitas Garuda/Dragon/Phoenix tidak memanggil event ras
atau menyalin paket karakter; temuan purba tidak menyalin bonus Archaeologist.

Narator menerima hewan aktual setelah commit. Caption seperti “Dapet Kecoa.”
cukup; acquisition tetap tidak membuat spin tambahan atau tag funny baru.

## Fungsi dan pencatatan

[Modul Tamer](../framework/tamer-event.mjs) menyediakan dua fungsi murni:

1. `planTamerCompanion({ invocationId, characterId, catalogVersion })`
   membekukan pool dan identitas companion sebelum draw.
2. `resolveTamerCompanion(plan, result)` mengeluarkan tepat satu efek
   registrasi companion serta fixed Taming Power dengan instance ID dan ledger key stabil.

Result memakai `{ invocationId, spinId, outcomeId }`. Engine mendatang
melakukan seeded draw dan commit result, companion serta ledger atomik sekali.
Revisi roster 1.1.0 dan tambahan power **tamer/1.2.0** berlaku untuk plan baru. Replay memakai snapshot
tersimpan tanpa mengulang spin atau acquisition, termasuk hasil versi 1.0.0
yang tidak ada di roster terbaru. [Roster lama](../reference/tamer-retired-roster-v1.json)
disimpan sebagai riwayat inactive. Journal 1.0.0/1.1.0 mempertahankan paket
companion-only; replay tidak menambahkan power secara retroaktif.
Helper tidak menjalankan RNG, mengubah owner, atau menyusun combat stats sendiri.

```powershell
node --test framework/tests/tamer-event.test.mjs
```

Core acquisition sudah ditentukan. Roster dan profil companion tetap
editable/configuration. Archetype berikutnya: **Alchemist**.
