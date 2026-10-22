# Tier Power 1–5

Seluruh **300 definisi power kanonis** mendapat tier. Pengguna meminta skala
1–5 agar Water Breathing dan Creation tidak diperlakukan setara. Kategori
dan penempatan tiap power adalah draft desain yang bisa disesuaikan.

| Tier | Label | Cakupan | Contoh |
| --- | --- | --- | --- |
| 1 | Utility | Fungsi kecil/harian, adaptasi sempit | Water Breathing, Ngejus, Ngesot |
| 2 | Basic | Kemampuan personal/tempur terbatas | Flight, Invisibility, Healing Touch |
| 3 | Advanced | Kendali supernatural serbaguna | Water Control, Forest Control, Taming |
| 4 | Legendary | Efek besar atau hax kuat | Gold Touch, Intangibility, Power Negation |
| 5 | Broken | Perubahan aturan mendasar | Creation, Molecular Manipulation, Resurrection, Reality Rewrite |

Water Breathing/Creation adalah benchmark, tidak membuat grant/opsi baru.
Aquatic Adaptation lebih luas daripada bernapas di air sehingga tier 2.
Nama Cosmic/Divine tidak otomatis tier 5.

## Tier dan mastery

Tier mengukur sifat/cakupan kemampuan, mastery mengukur penguasaan. Power
tier 1 mastery maksimum tetap tier 1. Tier 5 mastery rendah tetap berjenis
kemampuan fundamental, tetapi kendali, biaya dan efektivitas mengikuti
mastery dan batas profil. Tier tidak menjamin kemenangan/efek tak terbatas.
Tetap satu spin Power Mastery bersama. God Authority mempertahankan
override maksimum pada grant-nya.

Concept Power dan Authority memiliki scope berbeda; rating per mode
ditulis di tabel. Perbedaannya bukan kenaikan tier karena mastery.
Semua dua puluh Household functions tetap tier 1 dengan kapasitas biasa.

Tier sendiri tidak otomatis mengubah peluang, bonus main stat atau budget lama power=2 poin.
Mage Master Sihir memiliki modifier yang disetujui terpisah: bobot Tier 3–5 ×3
hanya pada tiga acquisition miliknya.
Pemetaan tier ke budget/harga/peluang memerlukan aturan tersendiri.

## Penggunaan engine

[Katalog tier](../content/power-tier-design.json) memuat rating eksplisit
per definitionId + definitionFile. Metadata definisi disinkronkan dengan
katalog; alias dan source grant merujuk rating sama.
[resolvePowerTier](../framework/power-tier.mjs) membaca reference/mode yang
tepat, menghasilkan metadata saja. Power/mode belum terdaftar menghasilkan
needs_configuration. Freeze tierPolicyVersion, mode dan tier pada grant
baru. Snapshot lama mempertahankan efek dan hasil aslinya.

## Daftar lengkap

### abyssal-axiom-design.json

| Power | Tier |
| --- | --- |
| Invisibility (Mode Ngilang) | 2 |

### alchemist-events-design.json

| Power | Tier |
| --- | --- |
| Gold Touch (Sentuhan Emas) | 4 |
| Molecular Manipulation (Manipulasi Molekul) | 5 |

### archaeologist-events-design.json

| Power | Tier |
| --- | --- |
| Fossil Fangs (Taring Purba) | 2 |
| Bone Armor (Armor Tulang) | 2 |
| Ancestral Charge (Seruduk Purba) | 2 |
| Ancestral Constriction (Lilitan Purba) | 2 |
| Aquatic Adaptation | 2 |
| Ancestral Stomp (Geprek Purba) | 3 |

### assassin-events-design.json

| Power | Tier |
| --- | --- |
| Kage Bunshin | 3 |
| Death Mark (Tanda Maut) | 4 |
| Presence Concealment | 3 |

Tiga hadiah fantasi yang terkait tipe Assassin. Presence Concealment
menyamarkan kehadiran dan aura; definisi Invisibility Tier2 sebelumnya
tetap sama. Weapon Assassin memakai Weapon Mastery, tanpa rating power.

### elf-events-design.json

| Power | Tier |
| --- | --- |
| Forest Control (Kendali Hutan) | 3 |
| Mermaid Song (Nyanyian Putri Duyung) | 2 |
| Decay Manipulation (Kendali Pelapukan) | 4 |
| Ice Manipulation (Kendali Es) | 3 |
| Life Manipulation (Kendali Kehidupan) | 4 |
| Shadow Manipulation (Manipulasi Bayangan) | 3 |
| Astral Projection (Proyeksi Astral) | 3 |

### fairy-events-design.json

| Power | Tier |
| --- | --- |
| Wish Granting (Pengabul Harapan) | 5 |
| Healing Power (Pemulihan) | 3 |

### goblin-orc-troll-events-design.json

| Power | Tier |
| --- | --- |
| Shrek Power — Comedy Ascension (Tenaga Kekacauan) | 4 |

### golem-events-design.json

| Power | Tier |
| --- | --- |
| Rock Manipulation (Kendali Batu) | 3 |
| Magma Manipulation (Kendali Magma) | 3 |
| Crystal Manipulation (Kendali Kristal) | 3 |
| Diamond Manipulation (Kendali Berlian) | 3 |
| Trash Manipulation (Kendali Sampah) | 3 |

### heavenly-principle-events-design.json

| Power | Tier |
| --- | --- |
| Komunikasi dengan Tuhan | 2 |

### isekai-cheat-wheel-design.json

| Power | Tier |
| --- | --- |
| Vending Machine Sultan | 1 |
| Pedang Hidup | 2 |
| Predator Adaptif | 4 |
| Jaring Evolusi | 3 |
| Telepati Babi | 1 |
| Loot Level 1 Sultan | 2 |
| Level 2 Kebuka Cheat | 4 |
| Hidden Boss Level 99 | 4 |
| Potion Sesuka Hati | 4 |
| Bolak-balik Dunia | 5 |
| Grind Santai 300 Tahun | 3 |
| Average Salah Hitung | 4 |
| Racik Obat Cheat | 3 |
| Farmasi Sihir | 3 |
| Belanja Online Antar-Dunia | 2 |
| Knowledge Craft | 2 |
| Recovery Training | 3 |
| Slime Utility | 2 |
| Disayang Makhluk | 2 |
| Magic Pastry | 2 |
| Smartphone Cheat | 2 |
| EXP Kebanjiran | 4 |
| Mana Kebanyakan | 4 |
| Kontrak Summon | 3 |
| Onmyoji Lintas Server | 3 |
| Assassin Craft | 3 |
| Berkah Kebanyakan | 4 |
| Barrier Cheat | 3 |
| Mana Pewaris Bungsu | 4 |
| Sihir Pakai Logika | 3 |
| Resonansi Roh | 3 |
| Ruang Saku | 5 |
| Knight Spectral | 3 |
| Multitasking Kerajaan | 2 |
| Blueprint Genius | 2 |
| Radar Bad Ending | 3 |
| Saint Healing | 4 |
| Strategi Masa Depan | 2 |
| Buah Auto-Evolve | 4 |
| Kontrak Dungeon | 3 |
| Skill Bekal Hidup Lama | 1 |
| RTS Civilization | 4 |
| Build Anti-Standar | 4 |
| Command Imperial | 4 |
| Memori Raja | 3 |
| Water Precision | 3 |
| Alkimia Cheat | 4 |
| Guardian Adventure | 3 |
| Overlord Spellcraft | 4 |
| Return by Death | 5 |
| Steal Cheat | 2 |
| Sihir Tanpa Chant | 3 |
| Aerial Spell Combat | 3 |
| Gambar Jadi Nyata | 5 |
| Gift Breaker | 4 |
| Survival Sense | 2 |
| Quest Class Adaptation | 3 |
| Atomic Burst | 4 |
| Slime Magic Network | 3 |
| Skill Sisa OP | 4 |
| Game Theory Cheat | 2 |
| Shield Evolution | 3 |
| Instant Death | 5 |
| Overprepared Prediction | 3 |

### legendary-hero-events-design.json

| Power | Tier |
| --- | --- |
| Earth Dive (Menembus Tanah) | 2 |
| Kutukan Membatu | 4 |
| Segel Aksara | 3 |
| Kendali Hewan | 3 |
| Lightning Manipulation (Kendali Petir) | 3 |
| Alchemy (Alkimia) | 4 |
| Illusion (Ilusi) | 3 |
| Inspiration (Inspirasi) | 2 |
| Sound Manipulation (Kendali Suara) | 3 |

### lelembut-events-design.json

| Power | Tier |
| --- | --- |
| Jump | 1 |
| Nyolong | 2 |
| Flight | 2 |
| Size Manipulation | 3 |
| Child Protection | 2 |
| Mukbang | 1 |
| Organ Control | 4 |
| Head Detachment | 2 |
| Pesugihan | 3 |
| Ngesot | 1 |
| Intangibility | 4 |
| Sand Manipulation | 3 |

### machine-events-design.json

| Power | Tier |
| --- | --- |
| Power Negation | 4 |
| Laser Eye | 3 |
| Energy Absorption | 3 |
| Force Field | 3 |
| Magnetism Control | 3 |
| Hologram Projection | 2 |
| Sonic Blast | 3 |
| Electric Discharge | 3 |
| Print Struk | 1 |
| Lampu Disko | 1 |
| Auto-Tune Voice | 1 |
| Hotspot Gratis | 1 |
| Digital Being | 3 |
| Masak Nasi | 1 |
| Angetin Sisa Makan | 1 |
| Dingin-Dingin Kulkas | 1 |
| Cuci Baju | 1 |
| Angin Sepoi | 1 |
| Ademin Kamar | 1 |
| Sedot Debu | 1 |
| Rapiin Baju | 1 |
| Ngejus | 1 |
| Goreng Tanpa Minyak | 1 |
| Panggang Roti | 1 |
| Rebus Air | 1 |
| Tuang Air | 1 |
| Tiup Rambut | 1 |
| Ngaduk Adonan | 1 |
| Panggang Kue | 1 |
| Panasin Panci | 1 |
| Seduh Kopi | 1 |
| Nonton Siaran | 1 |
| Bersihin Lantai | 1 |
| Shapeshifting | 3 |
| Vehicle Shifting | 2 |

### mythical-beast-events-design.json

| Power | Tier |
| --- | --- |
| Unity Inducement | 2 |
| Spirit Control | 4 |
| Purity Power | 3 |
| Regeneration (Tumbuh Lagi) | 4 |

### siluman-events-design.json

| Power | Tier |
| --- | --- |
| Animal Transformation (Transformasi Hewan) | 3 |

### survivalist-events-design.json

| Power | Tier |
| --- | --- |
| Acid Control | 3 |
| Radiation Control | 4 |
| Space Adaptation | 2 |
| Poison Control | 3 |
| Battle Instinct | 2 |

### tamer-events-design.json

| Power | Tier |
| --- | --- |
| Taming Power | 3 |

### universal-concept-wheel-design.json

| Power | Tier |
| --- | --- |
| Kehidupan Concept | Power 4 / Authority 5 |
| Kematian Concept | Power 4 / Authority 5 |
| Waktu Concept | Power 5 / Authority 5 |
| Ruang Concept | Power 5 / Authority 5 |
| Takdir Concept | Power 5 / Authority 5 |
| Pengetahuan Concept | Power 3 / Authority 4 |
| Perang Concept | Power 3 / Authority 4 |
| Cinta Concept | Power 3 / Authority 4 |
| Alam Concept | Power 3 / Authority 4 |
| Laut Concept | Power 3 / Authority 4 |
| Badai Concept | Power 3 / Authority 4 |
| Cahaya Concept | Power 3 / Authority 4 |

### universal-element-wheel-design.json

| Power | Tier |
| --- | --- |
| Fire Manipulation (Kendali Api) | 3 |
| Water Manipulation (Kendali Air) | 3 |
| Earth Manipulation (Kendali Tanah) | 3 |
| Wind Manipulation (Kendali Angin) | 3 |

### universal-power-wheels-design.json

| Power | Tier |
| --- | --- |
| Holy Spark | 1 |
| Healing Touch | 2 |
| Purify | 2 |
| Holy Shield | 2 |
| Holy Arrow | 2 |
| Sacred Flame | 3 |
| Sanctuary | 3 |
| Judgment Bolt | 4 |
| Divine Restoration | 4 |
| Seraph Form | 4 |
| Resurrection | 5 |
| Divine Miracle | 5 |
| Devil’s Whisper | 2 |
| Hex Mark | 2 |
| Infernal Claw | 2 |
| Hellfire | 3 |
| Life Drain | 3 |
| Torment Chains | 3 |
| Nightmare Prison | 4 |
| Demonic Possession | 4 |
| Soul Shackles | 4 |
| Abyss Domain | 4 |
| Devil Avatar | 4 |
| Infernal Sovereignty | 4 |
| Blood Sense | 1 |
| Blood Claw | 2 |
| Blood Needle | 2 |
| Blood Whip | 2 |
| Blood Shield | 2 |
| Crimson Regeneration | 3 |
| Blood Drain | 3 |
| Crimson Mist | 3 |
| Blood Puppetry | 4 |
| Blood Plague | 4 |
| Crimson Legion | 4 |
| Blood Dominion | 4 |
| Cosmic Sense | 2 |
| Cosmic Ray | 3 |
| Stardust Manipulation | 3 |
| Cosmic Barrier | 3 |
| Meteor Summon | 4 |
| Solar Flame | 4 |
| Gravity Manipulation | 4 |
| Orbital Dominion | 4 |
| Space Fold | 5 |
| Cosmic Time Dilation | 5 |
| Black Hole Manifestation | 5 |
| Celestial Forge | 5 |
| Tendril Control (Tentakel Ngaret) | 2 |
| Wall Crawl (Nempel Tembok) | 1 |
| Body Stretch (Badan Ngaret) | 2 |
| Blade Morph (Badan Jadi Sajam) | 2 |
| Shield Morph (Tameng Organik) | 2 |
| Organic Web (Jaring Organik) | 2 |
| Camouflage (Mode Nyamar) | 2 |
| Symbiote Sense (Radar Bahaya) | 2 |
| Venom Spit (Ludah Toxic) | 2 |
| Regeneration (Auto Tambal) | 3 |
| Symbiote Clone (Pecah Badan) | 3 |
| Hive Link (Grup Chat Symbiote) | 2 |
| Reality Rewrite (Edit Realitas) | 5 |
| Divine Decree (Titah Ilahi) | 5 |
| Soul Dominion (Kendali Jiwa) | 4 |

### universal-sin-wheel-design.json

| Power | Tier |
| --- | --- |
| Aura Superioritas | 2 |
| Rampasan Energi | 3 |
| Pesona Hasrat | 2 |
| Tiru Skill | 3 |
| Devour | 3 |
| Berserk (Amuk) | 2 |
| Zona Mager | 3 |


### royal-events-design.json

| Power | Tier |
| --- | --- |
| Authority — Perintah Mutlak / Dominasi Kehendak | **5, ditentukan pengguna** |

Royal King mendapat ordinary owned power ini, tanpa God Concept maximum.
Append rating baru pada policy yang sama; 242 rating sebelumnya tetap persis
dan journal lama tidak berubah. Beast of Possibility adalah kondisi evolusi,
bukan definisi power atau tier/mastery baru.

## Penambahan empat roda tema

Divine/Cursed/Demonic/Angelic memakai masing-masing 20 outcome dengan empat per Tier 1–5. Revisi menambah 30 definisi; seluruh 243 rating sebelumnya tetap. Flight sudah kanonis dan dipakai Demonic sebagai Demon Wings tanpa rating duplikat.

| Power baru | Tier |
| --- | --- |
| Sacred Sense (Peka Energi Suci) | 1 |
| Blessed Water (Air Berkat) | 1 |
| Comforting Prayer (Doa Penenang) | 1 |
| Sacred Binding (Segel Suci) | 3 |
| Holy Constructs (Bentuk Cahaya Suci) | 3 |
| Bad Luck (Apes Kecil) | 1 |
| Itch Curse (Gatal) | 1 |
| Hiccup Hex (Cegukan) | 1 |
| Stench Curse (Bau) | 1 |
| Fear Glare (Tatapan Takut) | 2 |
| Curse Transfer (Pindah Kutukan) | 3 |
| Causality Curse (Kutukan Sebab Akibat) | 5 |
| Fate Blight (Kutukan Takdir) | 5 |
| Death Hex (Kutukan Kematian) | 5 |
| Eternal Damnation (Kutukan Abadi) | 5 |
| Demon Scent (Aroma Iblis) | 1 |
| Imp Light (Lampu Neraka) | 1 |
| Sin Taste (Rasa Dosa) | 1 |
| Hell Voice (Suara Iblis) | 1 |
| Demon Skin (Kulit Iblis) | 2 |
| Infernal Body (Tubuh Infernal) | 3 |
| Demonic Regeneration (Regenerasi Iblis) | 3 |
| Shadow Army (Pasukan Bayangan) | 4 |
| Demonic Domination (Dominasi Iblis) | 4 |
| Soul Contract (Kontrak Jiwa) | 5 |
| Infernal Reality (Realitas Neraka) | 5 |
| Sin Authority (Authority Dosa) | 5 |
| Abyss Genesis (Penciptaan Neraka) | 5 |
| Absolute Protection (Perlindungan Mutlak) | 5 |
| Rebirth Grace (Anugerah Kelahiran Ulang) | 5 |

[Scope dan seluruh roster](UNIVERSAL-POWER-WHEELS.md).

### primordial-events-design.json

| Power | Tier |
| --- | --- |
| Creation (Penciptaan) | 5 |
| Void Manipulation (Kendali Kekosongan) | 5 |
| Monster Genesis (Penciptaan Monster) | 4 |

Definisi dipakai bersama oleh Primordial dan Champion. Seluruh276 rating lama tetap. Budget6/3 tetap power=2/weapon=2/stat point=1; tidak ada konversi tier ke poin atau max mastery otomatis.


### video2-race-imports-design.json

| Power | Tier |
| --- | --- |
| Tubuh Jelly | 1 |
| Manipulasi Logam | 3 |
| Ultraman | 4 |
| Ki Control | 3 |
| Solar Empowerment | 4 |
| Asgardian Force | 4 |
| Energy Constructs | 4 |
| Power Cosmic | 4 |
| Cosmo | 4 |

Ultraman Tier4 ditetapkan pengguna; nilai lain authored sesuai scope. Acid/Poison/Healing/Reality Rewrite memakai definisi bersama sebelumnya, tidak diduplikasi.

### Cosmic Armor dan cincin Lantern — 10 Oktober2026

Dua belas definisi ditambahkan;288 rating sebelumnya tidak diubah. Cosmic Armor mempunyai tiga exact-reference kelas agar Bronze tidak naik ke Gold karena mastery. Empat power resep Cosmic lama tetap lookup-only untuk journal lama dan nonaktif bagi akuisisi baru.

| Power | Tier |
| --- | --- |
| Cosmic Armor (Bronze) | 2 |
| Cosmic Armor (Silver) | 3 |
| Cosmic Armor (Gold) | 4 |
| Energy Constructs | 3 |
| Fear Manipulation | 3 |
| Rage Plasma | 3 |
| Hope Energy | 3 |
| Avarice Constructs | 4 |
| Emotional Mimicry | 4 |
| Love Binding | 3 |
| Death Energy | 4 |
| Life Energy | 4 |
