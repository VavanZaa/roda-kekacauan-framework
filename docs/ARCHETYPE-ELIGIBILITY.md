# Siapa yang perlu Archetype?

Kebijakan **archetype-eligibility/1.5.0** mengenali22 ras. Slime Biasa boleh spin dari pool sesuai tubuh; lima tipe spesialis skip. Centaur spin dari pool sesuai tubuh; Cosmic Warrior skip setelah child armor/cincin/warna yang diperlukan selesai. Aturan family lama tidak berubah. Kebijakan sebelumnya1.1.0 menambahkan Primordial skip pada aturan 1.0.0 yang disetujui pengguna pada 9 Oktober 2026 dan diwujudkan
sebagai fungsi [planArchetypeStage](../framework/archetype-eligibility.mjs).
Fungsi membaca seluruh Race tree sesudah semua event selesai, lalu menentukan
spin satu kali, skip langsung ke Backstory, atau konfigurasi yang harus dilengkapi.

Semua klasifikasi dan batas pada audit ini berlaku untuk run baru. **Raksasa skip
Archetype**, menggantikan dua slot lama; ras dasar, Size/Cosmic dan seluruh grant
ras tetap. Journal lama tidak ditulis ulang. Profil tubuh/komposisi, roster/event
role dan binding tubuh tetap memerlukan data eksplisit. Siluman memakai tepat satu dari12 hewan; bentuk humanoid berciri hewan sudah disetujui.

Spin memakai pool yang kompatibel; skip tidak membuat spin NPC/None palsu.
[Kontrak input, contoh penggunaan dan test](ARCHETYPE-GATE-FUNCTION.md).

## Audit semua keluarga

| Ras | Rekomendasi | Rincian |
| --- | --- | --- |
| Manusia | Spin | Manusia tidak mendapat race event atau bonus. |
| Elf | Bersyarat | Astral/Sea ringan boleh; High/Dark/Blood tergantung power; Forest/Fey/Shadow skip. |
| Kurcaci | Bersyarat | Dwarf 1–2 armor boleh, 3–5 skip; Gnome satu gadget boleh. |
| Goblin & Orc | Bersyarat | Kacung/Troll boleh; Bos/General tergantung pasukan; Warrior/Shaman terbatas; Oni/Shrek skip. |
| Raksasa | Skip | Ras dasar menjadi versi raksasa; dua slot Archetype lama diganti skip pada policy 1.0.0. |
| Peri | Bersyarat | Healer Fairy terbatas; Fairy Parents/Element Pixie/Fairy King skip. |
| Siluman | Bersyarat | Role terbatas mengikuti bentuk asal/kapabilitas; satu evaluasi untuk seluruh 12 komponen. |
| Lelembut | Bersyarat | Utility lemah boleh dengan filter tubuh; combat/strong skip; undead mengikuti origin. |
| Mythical Beast | Skip | Semua 10 Lokal, 8 Impor, 8 bentuk Dragon dan child Element. |
| Golem | Skip | Semua tujuh material, termasuk Trash dan child Element. |
| Elemental | Skip | Semua empat elemen. |
| Symbiote | Bersyarat | 0–40% mengikuti host+paket; aturan 50–100% skip. |
| Heavenly Principle | Bersyarat | Orang Saleh boleh; Pemuka menurut Divine; God/Demigod/Angel/Utusan skip. |
| Abyssal Axiom | Bersyarat | Imp/Succubus/Pendosa ringan boleh; tipe lain dan Sin tempur skip. |
| Hybrid | Gabungan | Satu keputusan untuk kedua root dan seluruh nested chain; bukan dua Archetype. |
| Anime | Bersyarat | NPC semua genre boleh; MC ringan boleh; Sci-fi mengikuti Tech aktual/Pilot skip; strong Cheat/harem banyak skip. |
| Reinkarnasi Pahlawan Legendaris | Skip | Seluruh 30 Lokal dan 80 Impor sudah memiliki signature package. |
| Machine | Bersyarat | Android/Cyborg ringan boleh; Mecha/Transformer/Nanobot/AI/Household skip. |
| Primordial | Skip | Sebelas identity dengan paket signature enam poin; tidak menambah Archetype. |

## Cabang yang perlu dibedakan

- **Elf:** High/Dark/Blood memakai aturan bagian 1–4 ringan, 5–12 skip pada urutan potency masing-masing. Ini bukan tingkat Power Mastery. Sea Elf: Putri Duyung dan Atlantean masih calon spin; Putri Duyung membutuhkan role yang cocok dengan tubuh akuatik. Astral masih boleh sebagai utility. Forest, Shadow dan keempat musim Fey skip.
- **Kurcaci:** Dwarf 1–2 armor boleh, 3–5 skip, apa pun kombinasi piece. Lima bonus piece tetap berlaku. Gnome: seluruh 20 gadget masih calon spin; scope Shrink Ray tetap pekerjaan balance power, tanpa mengubah keputusan gate yang sudah disetujui.
- **Goblin/Orc/Troll:** Kacung boleh pada semua hasil jumlah karena tidak memimpin army. Bos/General 0, 5, 20 boleh; 100, 1.000, 10.000 skip. Orc Warrior/Shaman masih boleh role yang mendukung spesialisasinya; extra spin tidak menjamin hasil. Oni dan Shrek skip. Semua 12 penyakit Troll tetap calon spin dan penalti tetap.
- **Peri:** Healer Fairy boleh role pendukung yang cocok. Fairy Parents, Element Pixie dan Fairy King skip. Tidak menambah flight atau stat karena nama Peri.
- **Siluman:** calon role terbatas mengikuti bentuk asal yang ditetapkan; evaluasi satu kali untuk tepat 12 komponen, bukan per hewan. Sepuluh jenis saat ini Harimau, Serigala, Babi, Ayam, Ular, Buaya, Kera, Kerbau, Rubah, Kucing. Sampling 12 dari 10 belum diputuskan; tidak menambah selector bentuk/fusion. Babi tetap Nyolong.
- **Lelembut Lokal:** Pocong, Tuyul, Kuntilanak, Wewe Gombel, Sundel Bolong, Palasik, Jenglot dan Suster Ngesot boleh role terbatas. Genderuwo, Kuyang, Banaspati skip. Leak mengikuti Cursed yang benar-benar didapat. Palasik tidak otomatis dapat memakai alat ketika hanya kepala; Pocong harus memenuhi kebutuhan gerak/tangan role.
- **Lelembut Impor:** Skeleton/Zombie mengikuti seluruh Ras Asal lalu filter tubuh undead. Vampire 0–10 korban boleh; 100/1.000 skip. Lich, Ghost, Mummy skip. Ras mangsa Vampire bukan ras tambahan.
- **Mythical Beast:** semua 10 Lokal dan 8 Impor skip, termasuk Warak yang utility serta Kinnara yang sudah mendapat instrumen minimum Master. Delapan Dragon: Western, Wyvern, Drake, Wyrm, Lindwyrm, Amphiptere, Eastern/Long, Sea Serpent; semuanya skip pada semua elemen. Tidak memindahkan beast lemah menjadi humanoid otomatis.
- **Golem/Elemental:** ketujuh Golem (Sand, Rock, Magma, Crystal, Diamond, Element, Trash) dan empat Elemental skip; material/element menjadi spesialisasinya. Trash tidak diberi profesi atau buff baru otomatis.
- **Symbiote:** 0–40% mengikuti kelayakan host dan paket gabungan. Aturan 50–100% skip. Inang kuat tetap skip meski takeover 0%. Semua threshold bonus dan jumlah power lama tetap; ini hanya aturan ambang Archetype baru.
- **Heavenly Principle:** Orang Saleh boleh. Pemuka boleh jika Divine aktual Holy Spark, Healing Touch, Purify atau Holy Shield; lainnya skip. Divine kini diurutkan Tier 1–5; klasifikasi tetap memakai ID power yang disetujui, bukan empat sektor pertama. God, Demigod, Angel dan Utusan Tuhan skip untuk semua Concept/power/follower hasil.
- **Abyssal Axiom:** Raja Iblis Agung, Iblis dan Fallen Angel skip. Imp/Succubus boleh; Ifrit/Asura skip. Pendosa dengan Pride/Lust boleh; Greed/Envy/Gluttony/Wrath/Sloth skip. Iblis tetap skip meski hasil Sin ringan karena dua Demonic tambahan.
- **Anime:** NPC ketujuh genre boleh tanpa menjalankan event MC. MC Action/Sport/Slice of Life/Fantasy masih calon spin. Romance Pacaran/Tertolak/NTR/Digantung boleh; Harem 1 boleh, 2–5 skip. Sci-fi Technician dengan Hologram Decoy Kit, Capture Net Launcher atau Banana Peel Launcher masih boleh; 17 Tech lainnya skip. Sci-fi Cyborg dinilai setelah dua Tech: satu hasil kuat membuatnya skip; dua utility/zonk perlu review gabungan. Pilot skip. Pilot merupakan orang dengan kendaraan, berbeda dari body Mecha; skip di sini karena paket signature. Isekai dibedakan per Cheat aktual, lengkap di katalog di bawah. Vending Machine Sultan memberi power, tidak mengubah tubuh Anime menjadi appliance otomatis.
- **Pahlawan Legendaris:** semua 30 Lokal dan 80 Impor skip karena signature package, termasuk tokoh tanpa fixed power. Tidak memberi semua feat Fate dari nama hero.
- **Machine:** Android empat zonk (Print Struk, Lampu Disko, Auto-Tune Voice, Hotspot Gratis) dan Hologram boleh role terbatas; tujuh combat/defense/control power skip. Cyborg empat zonk (Jempol USB, Tangan Tongsis, Lengan Stapler, Printer Struk Dada) dan Grappling Hook boleh; tujuh senjata tempur skip. Seluruh 12 model Mecha, 12 mode Transformer, Nanobot dan AI skip. Seluruh 20 Household skip agar tetap sangat lemah; bonus milik sumber lain tidak dihapus.

Ambang **armor 3, army 100, potency 5, takeover 50%, harem 2** sudah
disetujui pengguna. Belum ada scoring universal yang memperlakukan setiap
power sama kuat. Aturan pembanding power≈2 poin milik paket Mythical/Hero tidak
diubah menjadi hukum semua ras. Pilihan berlabel keren belum tentu lebih kuat
secara runtime; scope/cap final dapat mengubah rekomendasi ringan.

## Gate setelah seluruh race tree

Race dan semua child selesai → evaluasi kebutuhan boost + kecocokan tubuh →
**Spin Archetype yang eligible** atau **Skip** → Backstory.

Evaluasi memakai hasil yang sudah committed, inventory, pasukan yang benar-benar
dikomando, bonus/guarantee/hook dan ticket yang sudah tercatat. Size, stat, normal
Power dan mastery yang belum diputar tidak boleh bocor ke keputusan. Ticket Power
tambahan tetap sebuah peluang; None atau power kuat nanti tidak diketahui. Gate
tidak dibuka ulang oleh hasil tahap selanjutnya.

Untuk karakter yang mendapat spin, nonaktifkan role tidak cocok **sebelum** sampling,
lalu normalisasi bobot 1 atas pool eligible kecuali ada rasio khusus pengguna.
Semua nama dari dua video masih perlu roster final, event serta requirements yang
eksplisit. Nama Alchemist/Priest/Vessel sendiri tidak memberikan efek atau tubuh
baru. Eligible bukan jaminan memilih Primordial Champion/False Deity/Doombringer;
band reward role masih perlu didesain agar boost tidak mengalahkan paket ras kuat.

Hybrid dinilai satu kali sesudah kedua root dan seluruh host/base/origin selesai.
Satu paket ras yang kuat membuat gabungan skip. Jika sebuah komponen standalone
skip hanya karena tubuhnya tidak cocok, evaluasi ulang tubuh gabungan yang sudah
ditetapkan; label komponennya saja tidak cukup. Dua komponen ringan masih harus
dinilai bersama; dua izin individual bukan izin otomatis. Human +
Goblin Kacung calon spin; Human + Dragon skip. Jangan menerapkan intersection
label ras mentah: cek kemampuan tubuh gabungan yang benar-benar ditetapkan tanpa
mengarang humanoid fusion. Semua race no-repeat dan saved continuation tetap.

Skeleton/Zombie memakai evaluasi origin lengkap, termasuk nested attachment.
Symbiote tidak mendapat role terpisah dari inang. Siluman tidak mendapat 12 role.
Skip dicatat sebagai stage-skip dengan alasan, bukan actual spin NPC/None; tidak
menjalankan reaction spin atau hook Shrek. Semua hasil/grant lama tetap ada.

## Revisi Raksasa yang disetujui

Sejak policy 1.0.0, **Raksasa skip seluruh tahap Archetype**: nol spin utama, nol
spin kedua, dan tidak mendaftarkan ticket Archetype. Binding giant, spin ras dasar
beserta eventnya, satu Size global dan Cosmic bersyarat tetap berlaku. Ukuran
masa depan tidak dibaca oleh gate. Kontrak dua slot sebelumnya disimpan sebagai
histori dan tidak diaktifkan untuk run baru.

## Katalog turunan lengkap

Tabel berikut meninjau setiap outcome pada katalog yang saat ini dirujuk oleh
event. Wheel bersama dapat muncul beberapa kali karena caller menentukan paket
dan keputusan. Jumlah baris bukan jumlah ras unik atau seluruh kombinasi nested
yang mungkin. Selector histori tidak dimasukkan sebagai subrace aktif.

<details>
<summary>Elf → jenis — 8 hasil</summary>

Sumber: [elf-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| High Elf | Ikuti cabang | Nilai hasil Holy Power. |
| Dark Elf | Ikuti cabang | Nilai hasil Cursed Power. |
| Forest Elf | Skip | Forest Control sudah menjadi spesialisasi kuat. |
| Sea Elf | Ikuti cabang | Nilai bentuk Sea Elf. |
| Blood Elf | Ikuti cabang | Nilai hasil Blood Power. |
| Fey Elf | Ikuti cabang | Keempat musim direkomendasikan skip. |
| Shadow Elf | Skip | Shadow Manipulation sudah menjadi spesialisasi kuat. |
| Astral Elf | Spin | Satu power proyeksi/utility; tubuh asal tetap perlu profil kemampuan. |

</details>

<details>
<summary>Elf → Sea Elf — 2 hasil</summary>

Sumber: [sea-elf-form](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Putri Duyung | Spin | Mermaid Song atau satu Trishula/+1 Strength: masih bisa mendapat role yang cocok dengan bentuknya. |
| Atlantean Warrior | Spin | Mermaid Song atau satu Trishula/+1 Strength: masih bisa mendapat role yang cocok dengan bentuknya. |

</details>

<details>
<summary>Elf → Fey Elf — 4 hasil</summary>

Sumber: [fey-elf-season](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Summer (Musim Panas) | Skip | Power kontrol Fire/Decay/Ice/Life sudah memberi spesialisasi ras. |
| Autumn (Musim Gugur) | Skip | Power kontrol Fire/Decay/Ice/Life sudah memberi spesialisasi ras. |
| Winter (Musim Dingin) | Skip | Power kontrol Fire/Decay/Ice/Life sudah memberi spesialisasi ras. |
| Spring (Musim Semi) | Skip | Power kontrol Fire/Decay/Ice/Life sudah memberi spesialisasi ras. |

</details>

<details>
<summary>Elf → power yang benar-benar diperoleh — 12 hasil</summary>

Sumber: [power-holy](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Holy Spark | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Healing Touch | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Purify | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Holy Shield | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Holy Arrow | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini disetujui pada 9 Oktober 2026. |
| Sacred Flame | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Sanctuary | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Judgment Bolt | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Divine Restoration | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Seraph Form | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Resurrection | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Divine Miracle | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |

</details>

<details>
<summary>Elf → power yang benar-benar diperoleh — 12 hasil</summary>

Sumber: [power-cursed](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Devil’s Whisper | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Hex Mark | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Infernal Claw | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Hellfire | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Life Drain | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Torment Chains | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Nightmare Prison | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Demonic Possession | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Soul Shackles | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Abyss Domain | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Devil Avatar | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Infernal Sovereignty | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |

</details>

<details>
<summary>Elf → power yang benar-benar diperoleh — 12 hasil</summary>

Sumber: [power-blood](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Blood Sense | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Blood Claw | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Blood Needle | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Blood Whip | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Blood Shield | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Crimson Regeneration | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Blood Drain | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Crimson Mist | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Blood Puppetry | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Blood Plague | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Crimson Legion | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Blood Dominion | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |

</details>

<details>
<summary>Kurcaci → jenis — 2 hasil</summary>

Sumber: [dwarf-gnome-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Dwarf | Ikuti cabang | Nilai jumlah armor aktual. |
| Gnome | Ikuti cabang | Satu gadget; aturan spin untuk semua 20 hasil, kecuali batas gadget nanti membuktikan upper hand besar. |

</details>

<details>
<summary>Dwarf → jumlah armor — 5 hasil</summary>

Sumber: [dwarf-armor-count](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 1 Armor | Spin | 1–2 armor berarti 1–2 bonus numeric; aturan paket ringan. |
| 2 Armor | Spin | 1–2 armor berarti 1–2 bonus numeric; aturan paket ringan. |
| 3 Armor | Skip | 3–5 armor memberi 3–5 bonus numeric; ambang tiga sudah disetujui. |
| 4 Armor | Skip | 3–5 armor memberi 3–5 bonus numeric; ambang tiga ini aturan baru. |
| 5 Armor | Skip | 3–5 armor memberi 3–5 bonus numeric; ambang tiga ini aturan baru. |

</details>

<details>
<summary>Dwarf → piece tanpa pengulangan — 5 hasil</summary>

Sumber: [dwarf-armor-piece](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Helmet (Helm) | Ikuti cabang | Keputusan memakai jumlah/paket akhir, bukan jenis piece; semua bonus lama tetap. |
| Gloves (Sarung Tangan) | Ikuti cabang | Keputusan memakai jumlah/paket akhir, bukan jenis piece; semua bonus lama tetap. |
| Body Armor (Armor Badan) | Ikuti cabang | Keputusan memakai jumlah/paket akhir, bukan jenis piece; semua bonus lama tetap. |
| Leggings (Armor Kaki) | Ikuti cabang | Keputusan memakai jumlah/paket akhir, bukan jenis piece; semua bonus lama tetap. |
| Boots (Sepatu) | Ikuti cabang | Keputusan memakai jumlah/paket akhir, bukan jenis piece; semua bonus lama tetap. |

</details>

<details>
<summary>Gnome → satu gadget — 20 hasil</summary>

Sumber: [gnome-tech](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Steam Hammer | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Drill Lance | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Gearblade | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Spring Puncher | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Net Launcher | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Clockwork Spider | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Firefly Bomb | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Glue Sprayer | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Alchemy Sprayer | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Stun Whistle | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Shrink Ray | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Clockwork Scorpion | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Gear Disc Launcher | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Magnet Glove | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Spring Trap | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Smoke Bomb Launcher | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Clockwork Decoy | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Clockwork Turret | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Grapple Launcher | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |
| Illusion Projector | Spin | Satu gadget, mastery belum diketahui; bukan semua feat teknologi dari namanya. Batas Shrink Ray masih perlu balance. |

</details>

<details>
<summary>Goblin & Orc → jenis — 3 hasil</summary>

Sumber: [goblin-orc-troll-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Goblin | Ikuti cabang | Nilai event Goblin atau role Orc sampai selesai. |
| Orc | Ikuti cabang | Nilai event Goblin atau role Orc sampai selesai. |
| Troll | Spin | Troll memiliki penalti, belum ada keuntungan ras yang ditetapkan. |

</details>

<details>
<summary>Goblin Bos / Orc General → pasukan yang benar-benar dikomando — 6 hasil</summary>

Sumber: [goblinoid-army-count](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 0 Pasukan | Spin | Aturan 0/5/20 pasukan masih boleh boost; batas 100 sudah disetujui. |
| 5 Pasukan | Spin | Aturan 0/5/20 pasukan masih boleh boost; batas 100 belum menjadi aturan. |
| 20 Pasukan | Spin | Aturan 0/5/20 pasukan masih boleh boost; batas 100 belum menjadi aturan. |
| 100 Pasukan | Skip | Aturan 100+ pasukan komando sudah merupakan upper hand. Kacung mengabaikan ambang ini. |
| 1000 Pasukan | Skip | Aturan 100+ pasukan komando sudah merupakan upper hand. Kacung mengabaikan ambang ini. |
| 10.000 Pasukan | Skip | Aturan 100+ pasukan komando sudah merupakan upper hand. Kacung mengabaikan ambang ini. |

</details>

<details>
<summary>Goblin → posisi setelah jumlah — 2 hasil</summary>

Sumber: [goblin-position](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Bos | Ikuti cabang | Gunakan jumlah pasukan komando; bukan sekadar jumlah yang tergambar. |
| Kacung | Spin | Tidak mengomando pasukan, termasuk ketika roda jumlah besar. |

</details>

<details>
<summary>Orc → role — 5 hasil</summary>

Sumber: [orc-role](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Orc General | Ikuti cabang | Nilai actual commanded army; role tambahan harus cocok dengan komandan. |
| Oni | Skip | Katana + Cursed Power membentuk paket ras tersendiri. |
| Orc Warrior | Spin | Extra Weapon ticket saja masih ringan; role harus menyambung Warrior, bukan menghapusnya. |
| Shaman | Spin | Extra Power ticket belum berarti hasil kuat; role harus menyambung Shaman. |
| Shrek | Skip | Shrek sudah mempunyai hook pertumbuhan +1 semua stat per hasil lucu. |

</details>

<details>
<summary>Troll → 12 kondisi — 12 hasil</summary>

Sumber: [troll-disease](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Asma | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Penyakit Kulit | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Anemia | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Maag | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Flu | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Radang Sendi | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Migrain | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Insomnia | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Rabun | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Asam Urat | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Demam | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |
| Infeksi Rawa | Spin | Semua penyakit tetap memberikan penalti; Archetype tidak menghapusnya. |

</details>

<details>
<summary>Peri → jenis — 4 hasil</summary>

Sumber: [fairy-subrace](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Fairy Parents | Skip | Wish Granting sudah menjadi keunggulan/spesialisasi. |
| Element Pixie | Skip | Kontrol elemen sudah spesialisasi; sama dengan hasil Elemental/Fey. |
| Healer Fairy | Spin | Healing sebagai dukungan; hanya role yang dapat dilakukan tubuh Peri. |
| Fairy King | Skip | Extra Power ticket dan +2 shared mastery sudah paket kuat. |

</details>

<details>
<summary>Element Pixie → elemen — 4 hasil</summary>

Sumber: [element-universal](../content/universal-element-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Api | Skip | Keputusan sudah skip dari paket kontrol elemen, bukan hasil Fire/Water/Earth/Wind tertentu. |
| Air | Skip | Keputusan sudah skip dari paket kontrol elemen, bukan hasil Fire/Water/Earth/Wind tertentu. |
| Tanah | Skip | Keputusan sudah skip dari paket kontrol elemen, bukan hasil Fire/Water/Earth/Wind tertentu. |
| Angin | Skip | Keputusan sudah skip dari paket kontrol elemen, bukan hasil Fire/Water/Earth/Wind tertentu. |

</details>

<details>
<summary>Siluman → jenis di antara tepat 12 komponen — 10 hasil</summary>

Sumber: [siluman-animal-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Harimau | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Serigala | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Babi | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Ayam | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Ular | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Buaya | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Kera | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Kerbau | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Rubah | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Kucing | Bersyarat | Aturan boleh role terbatas jika bentuk asal dapat melakukannya. Tidak memberikan role per hewan; satu dari12 hewan, humanoid berciri hewan; binding capability/role perlu eksplisit. |
| Kelelawar | Bersyarat | Satu hewan terpilih, humanoid berciri hewan; pool role mengikuti capability tubuh. |
| Elang | Bersyarat | Satu hewan terpilih, humanoid berciri hewan; pool role mengikuti capability tubuh. |

</details>

<details>
<summary>Lelembut → asal — 2 hasil</summary>

Sumber: [lelembut-origin](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Lokal | Ikuti cabang | Nilai jenis, event, dan seluruh asal undead jika ada. |
| Impor | Ikuti cabang | Nilai jenis, event, dan seluruh asal undead jika ada. |

</details>

<details>
<summary>Lelembut → Lokal — 12 hasil</summary>

Sumber: [lelembut-local-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Pocong | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Tuyul | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Kuntilanak | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Genderuwo | Skip | Size Manipulation, Flight+Organ Control, atau Fire Control sudah keunggulan/spesialisasi. |
| Wewe Gombel | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Sundel Bolong | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Kuyang | Skip | Size Manipulation, Flight+Organ Control, atau Fire Control sudah keunggulan/spesialisasi. |
| Leak | Ikuti cabang | Nilai satu Cursed Power dengan aturan ambang ringan/kuat. |
| Palasik | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Banaspati | Skip | Size Manipulation, Flight+Organ Control, atau Fire Control sudah keunggulan/spesialisasi. |
| Jenglot | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |
| Suster Ngesot | Spin | Power utility/gerak atau fungsi terbatas; role wajib sesuai tubuh. Palasik tidak mendapat tangan baru; penalti Ngesot tetap. |

</details>

<details>
<summary>Lelembut → Impor — 6 hasil</summary>

Sumber: [lelembut-imported-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Skeleton | Ikuti cabang | Warisi evaluasi seluruh ras asal dan cek tubuh undead aktual. |
| Vampire | Ikuti cabang | Nilai jumlah korban aktual; roda mangsa bukan bonus ras. |
| Zombie | Ikuti cabang | Warisi evaluasi seluruh ras asal dan cek tubuh undead aktual. |
| Lich | Skip | Max Durability guarantee + extra Power ticket. |
| Ghost | Skip | Intangibility dan tubuh tanpa material biasa. |
| Mummy | Skip | Sand Manipulation sudah spesialisasi. |

</details>

<details>
<summary>Leak → Cursed Power — 12 profil historis sebelum pool 20 hasil</summary>

Sumber: [power-cursed](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Devil’s Whisper | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Hex Mark | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Infernal Claw | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Hellfire | Spin | Bagian 1–4 pada urutan potency: paket relatif ringan; tetap filter kecocokan role. |
| Life Drain | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Torment Chains | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Nightmare Prison | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Demonic Possession | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Soul Shackles | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Abyss Domain | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Devil Avatar | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |
| Infernal Sovereignty | Skip | Bagian 5–12 pada urutan potency: aturan upper hand ras; ambang ini belum disetujui. |

</details>

<details>
<summary>Vampire → korban — 6 hasil</summary>

Sumber: [vampire-victim-count](../content/lelembut-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 0 Korban | Spin | 0–10 korban belum memberi bonus stat/power; calon role humanoid. |
| 1 Korban | Spin | 0–10 korban belum memberi bonus stat/power; calon role humanoid. |
| 5 Korban | Spin | 0–10 korban belum memberi bonus stat/power; calon role humanoid. |
| 10 Korban | Spin | 0–10 korban belum memberi bonus stat/power; calon role humanoid. |
| 100 Korban | Skip | 100/1000 korban memberi +1 seluruh lima stat; 1000 juga Cursed. |
| 1.000 Korban | Skip | 100/1000 korban memberi +1 seluruh lima stat; 1000 juga Cursed. |

</details>

<details>
<summary>Mythical Beast → asal — 2 hasil</summary>

Sumber: [mythical-beast-origin](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Lokal | Skip | Paket/identitas beast digunakan sebagai spesialisasi karakter, termasuk hasil utility. |
| Impor | Skip | Paket/identitas beast digunakan sebagai spesialisasi karakter, termasuk hasil utility. |

</details>

<details>
<summary>Mythical Beast → jenis — 10 hasil</summary>

Sumber: [mythical-beast-local-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Garuda | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Barong (Bali) | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Reog (Jawa) | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Naga | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Lembuswana | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Kuda Sembrani | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Warak Ngendog | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Makara | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Kinnara | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Singa Ambara Raja | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |

</details>

<details>
<summary>Mythical Beast → jenis — 8 hasil</summary>

Sumber: [mythical-beast-imported-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Dragon | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Phoenix | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Griffin | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Unicorn | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Pegasus | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Hydra | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Cerberus | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |
| Chimera | Skip | Semua tipe skip aturan Archetype generic; Kinnara sudah punya instrumen dengan minimum Master. |

</details>

<details>
<summary>Dragon → delapan bentuk — 8 hasil</summary>

Sumber: [dragon-form](../content/dragon-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Western Dragon | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Wyvern | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Drake | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Wyrm | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Lindwyrm | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Amphiptere | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Eastern Dragon / Long | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |
| Sea Serpent | Skip | Semua bentuk Dragon skip; +2 numeric dan satu kontrol elemen dipertahankan. |

</details>

<details>
<summary>Dragon/Naga → elemen — 4 hasil</summary>

Sumber: [element-universal](../content/universal-element-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Api | Skip | Hasil elemen tidak membuka kembali Archetype yang sudah dilewati. |
| Air | Skip | Hasil elemen tidak membuka kembali Archetype yang sudah dilewati. |
| Tanah | Skip | Hasil elemen tidak membuka kembali Archetype yang sudah dilewati. |
| Angin | Skip | Hasil elemen tidak membuka kembali Archetype yang sudah dilewati. |

</details>

<details>
<summary>Golem → tujuh material — 7 hasil</summary>

Sumber: [golem-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Golem Pasir | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Batu | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Magma | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Kristal | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Berlian | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Elemen | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |
| Golem Sampah | Skip | Material/body power menjadi spesialisasi sendiri; Trash tetap Trash, tanpa profesi organic otomatis. |

</details>

<details>
<summary>Element Golem → elemen — 4 hasil</summary>

Sumber: [element-universal](../content/universal-element-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Api | Skip | Tetap skip; kontrol elemen/+1 shared mastery dipertahankan. |
| Air | Skip | Tetap skip; kontrol elemen/+1 shared mastery dipertahankan. |
| Tanah | Skip | Tetap skip; kontrol elemen/+1 shared mastery dipertahankan. |
| Angin | Skip | Tetap skip; kontrol elemen/+1 shared mastery dipertahankan. |

</details>

<details>
<summary>Elemental → elemen — 4 hasil</summary>

Sumber: [element-universal](../content/universal-element-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Api | Skip | Keempat hasil: tubuh/kemampuan elemen menjadi spesialisasi sendiri. |
| Air | Skip | Keempat hasil: tubuh/kemampuan elemen menjadi spesialisasi sendiri. |
| Tanah | Skip | Keempat hasil: tubuh/kemampuan elemen menjadi spesialisasi sendiri. |
| Angin | Skip | Keempat hasil: tubuh/kemampuan elemen menjadi spesialisasi sendiri. |

</details>

<details>
<summary>Symbiote → setelah seluruh host chain — 11 hasil</summary>

Sumber: [symbiote-takeover](../content/symbiote-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 0% Takeover | Bersyarat | 0–40% mengikuti kelayakan inang, dengan penilaian gabungan bonus. Tidak memberi satu Archetype ekstra untuk Symbiote. |
| 10% Takeover | Bersyarat | 0–40% mengikuti kelayakan inang, dengan penilaian gabungan bonus. Tidak memberi satu Archetype ekstra untuk Symbiote. |
| 20% Takeover | Bersyarat | 0–40% mengikuti kelayakan inang, dengan penilaian gabungan bonus. Tidak memberi satu Archetype ekstra untuk Symbiote. |
| 30% Takeover | Bersyarat | 0–40% mengikuti kelayakan inang, dengan penilaian gabungan bonus. Tidak memberi satu Archetype ekstra untuk Symbiote. |
| 40% Takeover | Bersyarat | 0–40% mengikuti kelayakan inang, dengan penilaian gabungan bonus. Tidak memberi satu Archetype ekstra untuk Symbiote. |
| 50% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 sudah disetujui. |
| 60% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 belum disetujui. |
| 70% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 belum disetujui. |
| 80% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 belum disetujui. |
| 90% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 belum disetujui. |
| 100% Takeover | Skip | Aturan 50–100% skip setelah paket tempur takeover bertambah; batas 50 belum disetujui. |

</details>

<details>
<summary>Takeover 80–100% → 12 powers — 12 hasil</summary>

Sumber: [power-symbiote](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Tendril Control (Tentakel Ngaret) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Wall Crawl (Nempel Tembok) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Body Stretch (Badan Ngaret) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Blade Morph (Badan Jadi Sajam) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Shield Morph (Tameng Organik) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Organic Web (Jaring Organik) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Camouflage (Mode Nyamar) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Symbiote Sense (Radar Bahaya) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Venom Spit (Ludah Toxic) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Regeneration (Auto Tambal) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Symbiote Clone (Pecah Badan) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |
| Hive Link (Grup Chat Symbiote) | Skip | Semua hasil tetap skip karena paket takeover, tanpa mengubah dua spin pada 100%. |

</details>

<details>
<summary>Heavenly Principle → jenis — 6 hasil</summary>

Sumber: [heavenly-principle-type](../content/race-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| God | Skip | Authority/Concept+mastery, +1 semua stat, atau dua Divine sudah keunggulan besar. |
| Demigod | Skip | Authority/Concept+mastery, +1 semua stat, atau dua Divine sudah keunggulan besar. |
| Angel | Skip | Authority/Concept+mastery, +1 semua stat, atau dua Divine sudah keunggulan besar. |
| Utusan Tuhan | Skip | Authority/Concept+mastery, +1 semua stat, atau dua Divine sudah keunggulan besar. |
| Pemuka Agama | Ikuti cabang | Satu Divine ringan bisa mendapat role pendukung; lihat hasil actual. |
| Orang Saleh | Spin | Komunikasi dengan Tuhan belum merupakan combat kit. |

</details>

<details>
<summary>Pemuka Agama → Divine — 15 profil historis sebelum pool 20 hasil; Angel kini Angelic</summary>

Sumber: [power-divine](../content/universal-power-wheels-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Reality Rewrite (Edit Realitas) | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Divine Decree (Titah Ilahi) | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Soul Dominion (Kendali Jiwa) | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Divine Miracle | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Resurrection | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Seraph Form | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Divine Restoration | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Judgment Bolt | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Sanctuary | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Sacred Flame | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Holy Arrow | Skip | Divine lain direkomendasikan cukup kuat; God/Angel selalu skip terlepas hasil individual. |
| Holy Shield | Spin | Untuk Pemuka saja: empat definisi Holy rendah; klasifikasi ID lama tetap; jangan pakai indeks sektor baru. |
| Purify | Spin | Untuk Pemuka saja: empat definisi Holy rendah; klasifikasi ID lama tetap; jangan pakai indeks sektor baru. |
| Healing Touch | Spin | Untuk Pemuka saja: empat definisi Holy rendah; klasifikasi ID lama tetap; jangan pakai indeks sektor baru. |
| Holy Spark | Spin | Untuk Pemuka saja: empat definisi Holy rendah; klasifikasi ID lama tetap; jangan pakai indeks sektor baru. |

</details>

<details>
<summary>God/Demigod/Utusan → Concept — 12 hasil</summary>

Sumber: [god-concept](../content/universal-concept-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Kehidupan | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Kematian | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Waktu | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Ruang | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Takdir | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Pengetahuan | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Perang | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Cinta | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Alam | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Laut | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Badai | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |
| Cahaya | Skip | Paket pemanggil sudah skip; bukan dispatch race baru berdasarkan nama concept. |

</details>

<details>
<summary>God → pengikut — 9 hasil</summary>

Sumber: [follower-count](../content/universal-follower-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 0 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 10 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 100 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 1.000 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 10.000 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 100.000 | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 1 juta | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 10 juta | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |
| 100 juta | Skip | God tetap skip di semua count; hanya paket stat pengikut yang sudah disetujui. |

</details>

<details>
<summary>Abyssal Axiom → jenis — 5 hasil</summary>

Sumber: [abyssal-axiom-type](../content/abyssal-axiom-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Raja Iblis Agung | Skip | Raja/Iblis/Fallen Angel sudah mendapat beberapa thematic powers. |
| Iblis | Skip | Raja/Iblis/Fallen Angel sudah mendapat beberapa thematic powers. |
| Fallen Angel | Skip | Raja/Iblis/Fallen Angel sudah mendapat beberapa thematic powers. |
| Setan | Ikuti cabang | Nilai tipe Setan atau Sin aktual. |
| Pendosa | Ikuti cabang | Nilai tipe Setan atau Sin aktual. |

</details>

<details>
<summary>Setan → empat jenis — 4 hasil</summary>

Sumber: [setan-type](../content/abyssal-axiom-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Succubus | Spin | Satu Invisibility/Charm terbatas; role yang cocok masih berguna. |
| Ifrit | Skip | Ifrit kontrol api / Asura power Amuk sudah spesialisasi tempur. |
| Asura | Skip | Ifrit kontrol api / Asura power Amuk sudah spesialisasi tempur. |
| Imp | Spin | Satu Invisibility/Charm terbatas; role yang cocok masih berguna. |

</details>

<details>
<summary>Pendosa → Sin; Iblis selalu skip — 7 hasil</summary>

Sumber: [seven-deadly-sin](../content/universal-sin-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Pride (Kesombongan) | Spin | Untuk Pendosa saja: aturan Aura Superioritas/Pesona Hasrat masih paket ringan. |
| Greed (Keserakahan) | Skip | Pendosa dengan Rampasan Energi/Tiru Skill/Devour/Amuk/Zona Mager sudah mendapat keunggulan tempur. |
| Lust (Hasrat) | Spin | Untuk Pendosa saja: aturan Aura Superioritas/Pesona Hasrat masih paket ringan. |
| Envy (Iri) | Skip | Pendosa dengan Rampasan Energi/Tiru Skill/Devour/Amuk/Zona Mager sudah mendapat keunggulan tempur. |
| Gluttony (Kerakusan) | Skip | Pendosa dengan Rampasan Energi/Tiru Skill/Devour/Amuk/Zona Mager sudah mendapat keunggulan tempur. |
| Wrath (Amarah) | Skip | Pendosa dengan Rampasan Energi/Tiru Skill/Devour/Amuk/Zona Mager sudah mendapat keunggulan tempur. |
| Sloth (Kemalasan) | Skip | Pendosa dengan Rampasan Energi/Tiru Skill/Devour/Amuk/Zona Mager sudah mendapat keunggulan tempur. |

</details>

<details>
<summary>Raja Iblis Agung → pengikut — 9 hasil</summary>

Sumber: [follower-count](../content/universal-follower-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 0 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 10 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 100 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 1.000 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 10.000 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 100.000 | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 1 juta | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 10 juta | Skip | Empat Demonic sudah skip, termasuk follower count nol. |
| 100 juta | Skip | Empat Demonic sudah skip, termasuk follower count nol. |

</details>

<details>
<summary>Anime → genre sebelum MC/NPC — 7 hasil</summary>

Sumber: [anime-genre](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Isekai | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Fantasy | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Romance | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Sci-fi | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Action | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Sport | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |
| Slice of Life | Ikuti cabang | Genre saja belum menentukan kelayakan; NPC tidak menjalankan genre event. |

</details>

<details>
<summary>Anime → role — 2 hasil</summary>

Sumber: [anime-role](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| MC | Ikuti cabang | Nilai event genre MC sampai cabang terakhir. |
| NPC | Spin | Semua tujuh genre NPC context-only, tanpa event genre. |

</details>

<details>
<summary>Anime MC → genre committed — 7 hasil</summary>

Sumber: [anime-genre](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Isekai | Ikuti cabang | Nilai ending Romance, Cheat Isekai, atau Sci-fi role. |
| Fantasy | Spin | Satu extra Power ticket belum memberi hasil; aturan role masih boleh, tanpa bocoran power nanti. |
| Romance | Ikuti cabang | Nilai ending Romance, Cheat Isekai, atau Sci-fi role. |
| Sci-fi | Ikuti cabang | Nilai ending Romance, Cheat Isekai, atau Sci-fi role. |
| Action | Spin | Action/Sport hanya +1 numeric; Slice of Life tanpa bonus. |
| Sport | Spin | Action/Sport hanya +1 numeric; Slice of Life tanpa bonus. |
| Slice of Life | Spin | Action/Sport hanya +1 numeric; Slice of Life tanpa bonus. |

</details>

<details>
<summary>MC Romance → ending — 5 hasil</summary>

Sumber: [anime-romance-ending](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Pacaran | Spin | Pacaran satu weapon; Tertolak/NTR/Digantung tanpa bonus. Kapabilitas GF belum boleh diada-adakan. |
| Tertolak | Spin | Pacaran satu weapon; Tertolak/NTR/Digantung tanpa bonus. Kapabilitas GF belum boleh diada-adakan. |
| NTR | Spin | Pacaran satu weapon; Tertolak/NTR/Digantung tanpa bonus. Kapabilitas GF belum boleh diada-adakan. |
| Harem | Ikuti cabang | Nilai jumlah GF aktual. |
| Digantung | Spin | Pacaran satu weapon; Tertolak/NTR/Digantung tanpa bonus. Kapabilitas GF belum boleh diada-adakan. |

</details>

<details>
<summary>MC Romance → Harem — 5 hasil</summary>

Sumber: [anime-harem-count](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| 1 | Spin | Satu GF sama jumlahnya dengan Pacaran. |
| 2 | Skip | Aturan 2–5 GF weapon sudah beberapa weapon; bukan klaim bahwa semua GF memiliki combat power. |
| 3 | Skip | Aturan 2–5 GF weapon sudah beberapa weapon; bukan klaim bahwa semua GF memiliki combat power. |
| 4 | Skip | Aturan 2–5 GF weapon sudah beberapa weapon; bukan klaim bahwa semua GF memiliki combat power. |
| 5 | Skip | Aturan 2–5 GF weapon sudah beberapa weapon; bukan klaim bahwa semua GF memiliki combat power. |

</details>

<details>
<summary>MC Sci-fi → role — 3 hasil</summary>

Sumber: [anime-scifi-role](../content/anime-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Technician | Ikuti cabang | Nilai Tech Weapon aktual; +1 mastery hanya pada senjata Technician itu. Zonk/utility tetap calon boost. |
| Pilot | Skip | Rideable mecha signature package; vehicle is not Machine body and grants no unlisted canon equipment. |
| Cyborg | Bersyarat | Nilai kedua Tech aktual. Satu senjata kuat → skip; keduanya utility/zonk → tinjau gabungan, lalu role yang cocok. |

</details>

<details>
<summary>MC Isekai → 64 Cheat hasil actual — 64 hasil</summary>

Sumber: [isekai-cheat-skill](../content/isekai-cheat-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Vending Machine Sultan | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Pedang Hidup | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Predator Adaptif | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Jaring Evolusi | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Telepati Babi | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Loot Level 1 Sultan | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Level 2 Kebuka Cheat | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Hidden Boss Level 99 | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Potion Sesuka Hati | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Bolak-balik Dunia | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Grind Santai 300 Tahun | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Average Salah Hitung | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Racik Obat Cheat | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Farmasi Sihir | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Belanja Online Antar-Dunia | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Knowledge Craft | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Recovery Training | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Slime Utility | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Disayang Makhluk | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Magic Pastry | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Smartphone Cheat | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| EXP Kebanjiran | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Mana Kebanyakan | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Kontrak Summon | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Onmyoji Lintas Server | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Assassin Craft | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Berkah Kebanyakan | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Barrier Cheat | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Mana Pewaris Bungsu | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Sihir Pakai Logika | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Resonansi Roh | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Ruang Saku | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Knight Spectral | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Multitasking Kerajaan | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Blueprint Genius | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Radar Bad Ending | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Saint Healing | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Strategi Masa Depan | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Buah Auto-Evolve | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Kontrak Dungeon | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Skill Bekal Hidup Lama | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| RTS Civilization | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Build Anti-Standar | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Command Imperial | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Memori Raja | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Water Precision | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Alkimia Cheat | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Guardian Adventure | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Overlord Spellcraft | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Return by Death | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Steal Cheat | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Sihir Tanpa Chant | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Aerial Spell Combat | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Gambar Jadi Nyata | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Gift Breaker | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Survival Sense | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Quest Class Adaptation | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Atomic Burst | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Slime Magic Network | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Skill Sisa OP | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Game Theory Cheat | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |
| Shield Evolution | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Instant Death | Skip | Aturan combat/control/adaptation/strong Cheat sudah spesialisasi; bukan seluruh feats anime sumber. |
| Overprepared Prediction | Spin | Aturan utility/knowledge/practical Cheat; limits belum final dan dapat mengubah audit. Cheat tidak mengganti tubuh otomatis. |

</details>

<details>
<summary>Anime Technician → 20 Tech hasil actual — 20 hasil</summary>

Sumber: [tech-weapon](../content/universal-tech-weapon-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Railgun | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Plasma Rifle | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Laser Sword | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Gravity Gun | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| EMP Launcher | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Drone Swarm | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Nanobot Launcher | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Sonic Cannon | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Cryo Gun | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Ion Blaster | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Tesla Gauntlet | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Monowire | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Smart Missile Launcher | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Hard-Light Projector | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Hologram Decoy Kit | Spin | Aturan Tech utility/zonk masih calon Archetype meski mastery scoped +1. Batas alat tetap perlu balance. |
| Teleport Anchor Gun | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Magnetic Disc Launcher | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Energy Whip | Skip | Aturan Tech tempur/control sudah memberi signature upper hand; mastery bonus tetap scoped. |
| Capture Net Launcher | Spin | Aturan Tech utility/zonk masih calon Archetype meski mastery scoped +1. Batas alat tetap perlu balance. |
| Banana Peel Launcher | Spin | Aturan Tech utility/zonk masih calon Archetype meski mastery scoped +1. Batas alat tetap perlu balance. |

</details>

<details>
<summary>Anime Sci-fi Cyborg → dua Tech sequential — 20 hasil</summary>

Sumber: [tech-weapon](../content/universal-tech-weapon-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Railgun | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Plasma Rifle | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Laser Sword | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Gravity Gun | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| EMP Launcher | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Drone Swarm | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Nanobot Launcher | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Sonic Cannon | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Cryo Gun | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Ion Blaster | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Tesla Gauntlet | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Monowire | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Smart Missile Launcher | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Hard-Light Projector | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Hologram Decoy Kit | Bersyarat | Hasil ini ringan, tetapi wajib menunggu Tech kedua dan paket gabungan; tidak otomatis eligible per senjata. |
| Teleport Anchor Gun | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Magnetic Disc Launcher | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Energy Whip | Skip | Satu hasil Tech kuat membuat paket Cyborg skip; kedua weapon tetap dimiliki. |
| Capture Net Launcher | Bersyarat | Hasil ini ringan, tetapi wajib menunggu Tech kedua dan paket gabungan; tidak otomatis eligible per senjata. |
| Banana Peel Launcher | Bersyarat | Hasil ini ringan, tetapi wajib menunggu Tech kedua dan paket gabungan; tidak otomatis eligible per senjata. |

</details>

<details>
<summary>Anime Pilot → 20 kendaraan — 20 hasil</summary>

Sumber: [anime-mecha](../content/anime-mecha-wheel-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| RX-78-2 Gundam | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Evangelion Unit-01 | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Gipsy Danger | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Dino Megazord / Daizyujin | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| GoLion / Lion Force Voltron | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Liger Zero | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| VF-1S Valkyrie | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Gurren Lagann | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Mazinger Z | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Getter 1 | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| GaoGaiGar | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Gunbuster | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Lancelot Albion | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| ARX-7 Arbalest | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Ingram Unit 1 | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Nirvash type ZERO | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Strelitzia | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Solar Aquarion | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Escaflowne | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |
| Zanda Cross | Skip | Skip karena paket kendaraan signature; Pilot tetap orang yang menaiki mecha, bukan body Machine. Tidak memberi senjata/canon feats baru. |

</details>

<details>
<summary>Reinkarnasi Pahlawan Legendaris → semua identitas — 2 hasil</summary>

Sumber: [legend-origin](../content/legendary-hero-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Lokal | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Impor | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |

</details>

<details>
<summary>Reinkarnasi Pahlawan Legendaris → semua identitas — 30 hasil</summary>

Sumber: [legend-local-character](../content/legendary-hero-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Gatotkaca | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Bima | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Arjuna | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Srikandi | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Hanoman | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Antareja | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Gajah Mada | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Si Pitung | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Si Pahit Lidah | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Prabu Siliwangi | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Rama | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Abimanyu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Karna | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Baladewa | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Kresna | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Antasena | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Wisanggeni | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Semar | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Aji Saka | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Jaka Tingkir | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Ciung Wanara | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Ken Arok | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Raden Wijaya | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Sultan Hasanuddin | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Cut Nyak Dien | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Gundala | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Sri Asih | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Si Buta dari Gua Hantu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Wiro Sableng | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Virgo | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |

</details>

<details>
<summary>Reinkarnasi Pahlawan Legendaris → semua identitas — 80 hasil</summary>

Sumber: [legend-imported-character](../content/legendary-hero-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Arthur Pendragon | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Sasaki Kojiro | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Grigori Rasputin | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Miyamoto Musashi | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Oda Nobunaga | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Okita Souji | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Ushiwakamaru / Minamoto Yoshitsune | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Minamoto Raikou | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Tomoe Gozen | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Takeda Shingen | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Uesugi Kenshin | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Iskandar / Alexander Agung | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Leonidas I | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Julius Caesar | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Cleopatra | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Nero Claudius | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Boudica | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Spartacus | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Vlad III | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Napoleon Bonaparte | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Jeanne d’Arc | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Richard I | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Charlemagne | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Francis Drake | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Edward Teach / Blackbeard | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Bartholomew Roberts | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Christopher Columbus | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Leonardo da Vinci | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Nikola Tesla | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Thomas Edison | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Charles Babbage | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Florence Nightingale | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Paracelsus von Hohenheim | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Helena Blavatsky | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| William Shakespeare | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Hans Christian Andersen | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Wolfgang Amadeus Mozart | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Antonio Salieri | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Marie Antoinette | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Chevalier d’Eon | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Qin Shi Huang | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Zhuge Liang | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Sima Yi | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Lu Bu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Chen Gong | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Li Shuwen | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Qin Liangyu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Yang Guifei | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Wu Zetian | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Gilgamesh | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Heracles / Hercules | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Achilles | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Merlin | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Lancelot | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Gawain | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Mordred | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Tristan | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Enkidu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Hector | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Odysseus | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Medusa | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| William Tell | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Robin Hood | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Xu Fu | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Jing Ke | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Gao Changgong / Prince of Lan Ling | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Ashoka | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Zenobia | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Attila / Altera | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Roland | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Fuma Kotaro | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Mata Hari | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Cú Chulainn | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Scáthach | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Siegfried | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Beowulf | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Ozymandias / Ramesses II | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Arash | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Xuanzang Sanzang | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |
| Geronimo | Skip | Signature/package hero sudah menentukan spesialisasi; semua 30 Lokal/80 Impor ditinjau, tanpa tambahan role random. |

</details>

<details>
<summary>Machine → tujuh jenis — 7 hasil</summary>

Sumber: [machine-type](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Android | Ikuti cabang | Nilai actual power/weapon terakhir. |
| Cyborg | Ikuti cabang | Nilai actual power/weapon terakhir. |
| Mecha | Skip | Body/spesialisasi mesin sendiri; tidak diberi profesi organic generic. |
| Transformer | Skip | Body/spesialisasi mesin sendiri; tidak diberi profesi organic generic. |
| Nanobot | Skip | Body/spesialisasi mesin sendiri; tidak diberi profesi organic generic. |
| AI | Skip | Body/spesialisasi mesin sendiri; tidak diberi profesi organic generic. |
| Household Appliance | Skip | Sengaja tetap sangat lemah; Archetype bukan jalan keluar otomatis dari zonk. |

</details>

<details>
<summary>Android → 12 powers — 12 hasil</summary>

Sumber: [power-android](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Power Negation | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Laser Eye | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Energy Absorption | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Force Field | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Magnetism Control | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Hologram Projection | Spin | Empat zonk/Hologram utility: aturan role terbatas yang cocok dengan Android. |
| Sonic Blast | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Electric Discharge | Skip | Tujuh power combat/control/defense sudah menjadi keunggulan. |
| Print Struk | Spin | Empat zonk/Hologram utility: aturan role terbatas yang cocok dengan Android. |
| Lampu Disko | Spin | Empat zonk/Hologram utility: aturan role terbatas yang cocok dengan Android. |
| Auto-Tune Voice | Spin | Empat zonk/Hologram utility: aturan role terbatas yang cocok dengan Android. |
| Hotspot Gratis | Spin | Empat zonk/Hologram utility: aturan role terbatas yang cocok dengan Android. |

</details>

<details>
<summary>Cyborg → 12 weapons — 12 hasil</summary>

Sumber: [cyborg-weapon](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Arm Cannon | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Laser Blade | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Retractable Claws | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Flamethrower Arm | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Electric Fist | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Railgun Arm | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Grappling Hook Arm | Spin | Empat zonk/Grappling mobility ditambah +1 Int: aturan paket masih ringan. |
| Shoulder Missile Launcher | Skip | Tujuh built-in weapons tempur ditambah +1 Int sudah signature kit. |
| Jempol USB | Spin | Empat zonk/Grappling mobility ditambah +1 Int: aturan paket masih ringan. |
| Tangan Tongsis | Spin | Empat zonk/Grappling mobility ditambah +1 Int: aturan paket masih ringan. |
| Lengan Stapler | Spin | Empat zonk/Grappling mobility ditambah +1 Int: aturan paket masih ringan. |
| Printer Struk Dada | Spin | Empat zonk/Grappling mobility ditambah +1 Int: aturan paket masih ringan. |

</details>

<details>
<summary>Machine → body/model/item, termasuk zonk — 12 hasil</summary>

Sumber: [machine-mecha-model](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Mechagodzilla | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mecha Probe | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| RX-78-2 Gundam | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Gipsy Danger | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Dino Megazord | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Voltron | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mazinger Z | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Gurren Lagann | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mecha Odong-Odong | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mecha Gerobak Bakso | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mecha Galon | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mecha Kardus | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |

</details>

<details>
<summary>Machine → body/model/item, termasuk zonk — 12 hasil</summary>

Sumber: [machine-transformer-form](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Jet Tempur | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Tank | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mobil Sport | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Truk Trailer | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Motor Balap | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Helikopter | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Kereta Cepat | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Kapal Selam | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Angkot | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Bajaj | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Odong-Odong | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Gerobak Bakso | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |

</details>

<details>
<summary>Machine → body/model/item, termasuk zonk — 20 hasil</summary>

Sumber: [machine-appliance-item](../content/machine-events-design.json).

| Hasil | Aturan | Dasar |
| --- | --- | --- |
| Rice Cooker | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Microwave | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Kulkas | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mesin Cuci | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Kipas Angin | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| AC | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Vacuum Cleaner | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Setrika | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Blender | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Air Fryer | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Toaster | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Ketel Listrik | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Dispenser | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Hair Dryer | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mixer | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Oven Listrik | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Kompor Induksi | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Mesin Kopi | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| TV | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |
| Robot Vacuum | Skip | Semua hasil skip; tidak menyulap zonk menjadi humanoid/job. Grants dari sumber lain tetap dimiliki. |

</details>

Kasus langsung tanpa subtype wheel: Manusia, AI, Nanobot. Hybrid/host/base/origin
merujuk kembali wheel ras kanonis dengan history global; tidak membuat katalog
ras duplikat. Size biasa/Raksasa dan Cosmic berada sesudah gate. Barong form,
Naga lineage, Siluman form/fusion/count lama, named Anime MC, modern Imported
hero/categories, Robot/Automaton serta Nanobot model lama tetap proposal/histori
inaktif. Tidak dibangkitkan oleh audit ini.

[Data audit](../content/archetype-eligibility-design.json) ·
[Roda Archetype](ARCHETYPE-WHEEL.md) · [Roda Ras](RACE-WHEEL.md)

## Revisi katalog power 9 Oktober 2026

Cursed/Divine/Demonic/Angelic masing-masing 20 outcome. Keputusan skip/spin lama melekat pada ID definisi, bukan indeks baru atau tier semata. Tabel lama adalah audit profil yang telah diterima, termasuk dua ID yang pindah ke Demonic. Sepuluh Cursed dan lima Divine baru belum mendapat keputusan profil single-power Elf/Leak/Pemuka: fungsi mengembalikan needs_configuration sampai profil tersebut disetujui. God/Angel/Raja/Iblis/Fallen Angel tetap mengikuti skip dari paket sumber, bukan hasil individual. [Katalog baru](UNIVERSAL-POWER-WHEELS.md).

## Ekstensi Primordial — 10 Oktober 2026

Policy archetype-eligibility/1.1.0 menambah skip untuk family Primordial menurut paket enam poin yang diminta pengguna, mempertahankan seluruh aturan family lama. Champion merupakan patron Archetype untuk karakter lain yang eligible; body-role fit-nya tetap memerlukan profil. Snapshot policy1.0 tersedia dalam reference/before-primordial-packages-2026-10-10.json.
