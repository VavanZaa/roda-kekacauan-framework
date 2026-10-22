# Roda Kekacauan design decisions

## Title256 dan gelar sekali per seri — 11 Oktober 2026

User approves contextual Title wheel and requests200++ titles, disabling each
after it is selected for a character. Read content/title-wheel-design.json
title-wheel/1.0.0, framework/title-wheel.mjs title-odds/1.0.0 and docs/TITLE-WHEEL.md.
256 canonical unique names:192 contextual/64 receh,24 bounded+1 hidden recipes.
Normally curate12 matching contextual+4 receh, then uniform16 at6.25% each.
Actual committed race/subtype/role/Backstory/normal Size, immutable main results,
registered pre-Title provisional modifiers, active owned weapon/power/weakness
and completed Chaos result build tags. No future Title/Enchant evidence.
Unknown affinities remain neutral; hard literal conditions keep false titles out.
Equalizer suppresses soft shortlist scores, retains hard guards/count structure.
Titles are lore by default; names never grant unlisted powers/equipment/ranks.

state/title-usage.json is explicit persistent series roda-kekacauan-main, empty
initially. One canonical title per [runId,characterId]; claim disables it for
all later characters/runs in this series. Atomic lock+plan+draw+claim+receipt
helper in framework/title-store.mjs; stale external pools/corrupt state fail.
Resume returns saved result without RNG/extra consumed title/duplicate effects.
Never auto-reset, reenable used titles or fill shortages with ineligible names.
Smaller eligible shortlist is allowed; none means exhausted-for-context.
24 hidden effects:20 main-stat+1,2 one-weapon mastery+1,2 shared power mastery+1.
Uniform existing weapon target when required; numeric modifiers final-only,
ordinary final Master5/compatible-unused-slot Enchant gate, no power Enchant.
Actual funny Title draws retain existing source-once Shrek hook; preview/replay/
singleton fixed reveal does not create a funny raw spin. Source receipts persist
before hidden children; character-journal transaction/scheduler/media integration
remain future. Preserve original raw/Lucky/Pawn/guarantee evidence.

preview/title-roster.html contains256 searchable labels/seven examples and
browser-local DEMO disabled IDs only. It uses the same shortlist function,
anticlockwise animation and separate reset; never touches production usage.
Static JS/data/rotation and scoped persistent/concurrent tests verified; no
browser visual inspection claimed. Preserve reference/before-title-wheel-
2026-10-11.json and all earlier recovery files. This supersedes Title-not-started
notes; remaining Chaos/Chaotic Power/full executor are still separate.

## Mekanisme lanjutan12 Divine — 11 Oktober 2026

User asks follow-up mechanisms for every preceding Divine effect. Read
content/divine-followup-design.json divine-followups/1.0.0 and
docs/DIVINE-EVENTS.md; chaos-wheel/0.4.0 links all12 flows. These are complete
editable algorithm designs, not an implemented persistent/video/combat executor.
Keep root15/12/8 per side +30 None, original Chaos12 and inactive optional methods.
Uniform live target selection; singleton reveal without RNG; absent targets
filter the child event only; unknown proofs are configuration, not absence.
Small Blessing chooses one stat; Targeted picks derived pre-bonus lowest/ties;
Double Blessing draws5 then4 distinct stats. Expert picks one owned active
weapon and queues+1 for final ordinary Enchant gate. Resonance is one shared+1.
Purification picks one active canonical receh weakness; preserve audit/source
packages. Low conditional traits have one atomic qualifying-action charge,
no permanent power or always-on stat bonus. Restoration selects uncompensated
negative source/stat entries, refunds<=2 once, preserving original negatives.

Second Chance selects original actual nonguaranteed raw<9 minimum/ties; copy/
fixed outcomes excluded. New ordinary/High Roller attempts use current stat
odds, Resilient<=5 one retry. For Double/Nothing resolve one new50:50 decision
then refund min(2,max(0,newBase-oldBase)); this refines prior raw-only shorthand.
Original base/roll history never replaced. All In has only actual Strength
eligible and Strength-only additive reward; four copied bases remain. Actual
late attempts keep Lucky/Pawn source hooks; targets/fixed/replay never fabricate
raw hits. Gift draws universal Divine Tier1..3 unowned leaves (12 initially),
reuses shared mastery; first late power gets one ordinary gate, God fixed9 skip.

All numeric effects remain final-only, signed/unbounded; charge traits separate.
Finish actual children/reactions then saved Title return; do not advance wheel
design automatically. Stable step receipts compare live proof/ledger before
atomic commit, replay does not duplicate RNG/effects/charges. Preserve
reference/before-divine-followups-2026-10-11.json and all earlier snapshots.
This note supersedes older missing Divine follow-up/late-combination designs;
runtime adapters, Chaos roster/scopes and Title remain future.

## Divine12 dengan hadiah lebih kecil — 11 Oktober 2026

Latest user requests FOUR Divine effects per Low/Medium/High, toned down
because it has little risk, and suggestions for fun odds/methods. Read
content/chaos-wheel-design.json chaos-wheel/0.3.0 and docs/CHAOS-WHEEL.md.
Divine12 authored editable recipes; original Chaos12 unchanged,24 total/four
per six branches. Root15/12/8 per side +30 None stays exactly confirmed.
Default four child choices25% each before compatible-target filters/Equalizer;
child curation/owned guards never recompute root group masses.

Low: one main-stat point or one-point single-use conditional Durability/Speed/
Fight trait. Medium: one targeted stat, one Weapon Mastery on one owned weapon,
one shared Power Mastery, or disable one main40 receh weakness. High: +1 two
distinct stats, capped positive reroll bonus<=2, one Divine Power Tier1..3,
or refund<=2 existing negative main-stat points. Old +1 all-five, unlimited
reroll jump and unfiltered20 Divine Gift proposals are replaced for this
caller. Global Divine20/302 power tiers remain unchanged. Caps are only source
reward budgets, never total-stat caps; signed/unbounded final scores, original
raw evidence, actual Lucky/Resilient/Pawn hooks/shared mastery remain. Conditional
one-use stats are traits, not permanent powers or final-card flat stats. Weapon
+1 may open the existing final compatible Master5+ Enchant gate.

Optional suggestions are NOT active: pity after3 persisted main-root None in
one explicit series (next root excludes None, retained weights normalize over70;
Equalizer then1/6), and reveal fixed Chaos cost before unknown reward. No fake
cost spin/early stat settlement. Persistent counters/runtime and exact late
reroll/combat adapters remain future. No new Chaotic Power definitions or Title
advance. Preserve reference/before-divine-rebalance-2026-10-11.json and prior
snapshots/frozen plans. This note supersedes older Divine4 reward packages.

## Roda Kekacauan tujuh hasil dan peluang — 11 Oktober 2026

Latest user correction confirms BOTH Chaos and Divine have Low/Medium/High.
Read content/chaos-wheel-design.json chaos-wheel/0.2.0. One opening wheel:
Chaos Low15/Medium12/High8%, Divine Low15/Medium12/High8%, None30%.
Weights15:12:8:15:12:8:30 total100; side totals35/35/30. No separate side/
severity draw, equal-root default or child-count mass multiplication. Active
Equalizer uniformly overrides eligible root leaves after guards (seven1/7).
Numeric-stat/mastery5%..25% bounds do not apply. None commits one actual result/
reaction and returns Title, preserving all prior facts/grants/modifiers; no
effect child or generic boost. Preserve old frozen four-root draft/recovery.

Sixteen prior event candidates remain PROPOSED and unexecuted. Divine split
is authored proposal: Purification Low; Gift/Second Chance Medium; all-five
Blessing High. Do not treat grouping correction as approval of every reward.
No new effect candidates or powers invented. Inversion scope/order and shared
Chaotic Power roster/tiers still need review. Backstory0.6.2 metadata notes
prior None/non-None intents are meaningful again but numeric odds stay pending.
Signed final-only bonuses/raw evidence/shared mastery/final Enchant unchanged.
No runtime executor introduced. No automatic advance to Title.

Preserve reference/before-chaos-seven-outcomes-2026-10-11.json and prior
reference/before-chaos-proposal-2026-10-11.json. This note supersedes older
four-root/25%-each/None-removal recommendations below.

## Roda Kekacauan menggantikan Apex Force — 11 Oktober 2026

User renames Apex Force to Roda Kekacauan, matching project branding. Read
content/chaos-wheel-design.json chaos-wheel/0.1.0 and docs/CHAOS-WHEEL.md.
Display rename is confirmed; internal stage/odds target apex and historical
apexForce aliases remain for saved compatibility. New Chaos Low/Medium/High
and Divine structure plus sixteen event candidates are PROPOSALS, not approved
active recipes. User supplies Inversion7->2/9->0 and Pact-1 main stats plus
one Chaotic Power spin. Inversion target scope is awaiting user answer.

Propose four equal root leaves and four equal effect leaves per branch, with
hard target guards then Equalizer. Root topology/None removal and operation
order are still reviewable. Retire old generic No-Apex/always-extra-boost
template for new-design review; never execute two Apex/Chaos stages. No runtime
helper or automatic event activation. Signed/unbounded final-only bonuses,
immutable raw/Lucky/Pawn evidence, shared Power Mastery and final Enchant
gates remain. Proposed new power-chaotic is separate/universal with roster and
canonical Tier scopes pending; it is not a silent Demonic/Cursed alias.

Backstory0.6.1 changes display text only and notes two old Apex/None intentions
need semantic remap. No numeric odds/event recipes/grants changed. Preserve
historical frozen plans and reference/before-chaos-proposal-2026-10-11.json.
Next review Chaos effects with user; do not auto-advance to Title.

## Weakness40 dan Human50% — 11 Oktober 2026

Read content/weakness-wheel-design.json weakness-wheel/1.0.0 and
framework/weakness-wheel.mjs weakness-odds/1.0.0. Forty authored editable
recipes plus None. User confirms Human50% Weakness/50% None and then replaces
Buta/Silau Berat with Mata Silinder. Normal sole-Human physical ancestry,
including transparent host/size/origin wrappers, has50% None; forty ordinary
leaves1.25% each before four approved gentle Backstory factors. Non-Human None
is not invented as50%: use equal compatible eligible leaves until explicit
race priors are configured. Human capability profile is explicit; non-Human
body traits need committed owner-proof adapter. Unknown body means configuration.
Equalizer flattens all eligible leaves including None after guards; no stat
5%/25% bounds or weapon/power tier quotas on Weakness.

Only Stamina Cepat Habis registers final-only Speed-1. Others are conditional
combat restrictions or lore. No automatic severity/activation/countermeasure
wheel, always-on penalty, numeric mastery/power grant or Enchant. Power-related
limits stay dormant without an owned power. Health/vision contexts are neutral
game conditions; no diagnosis or degrading audience-focused punchline. None
preserves earlier Cursed/Rage/Overload/etc; independent repeated draws merge
canonical definition/provenance without multiplying its penalty. Actual tagged
funny draws supply existing Shrek source-once hook; replay/fixed grants do not.

Backstory0.6 binds four approved Weakness intents (quiet-life, betrayed,
appeared-one-day, unsealed), and Test Subject extra immediate weakness uses
this same wheel before Size with saved Backstory return. Main Weakness after
Power still happens. Early planner uses only completed owner race/role sources,
no future Size/stat/Power data. Extra retains None unless guaranteed explicitly.
Pure planner/external CDF/resolver freeze source/odds/recipes, compare ownership
and emit source-once atomic receipts. Persistent store/combat/body/media/video
adapters remain future. No automatic advance to Apex/Title.

Regenerate preview: node framework/scripts/weakness-preview.mjs.
Preview has all40 editable entries, Human/Equalizer/four Backstory examples,
anticlockwise motion and explicit conditions/effects. Grouping is display only,
not a hidden category spin or new rarity. Static JS/odds/rotation checked;
browser visual QA is not claimed. Preserve reference/before-weakness-wheel-
2026-10-11.json plus all older recovery files/frozen journals.

## Power utama 160 dan peluang karakter — 10 Oktober 2026

User explicitly asks to finish previously planned main Power. Read
content/main-power-wheel-design.json main-power-wheel/1.0.0 and
framework/power-wheel.mjs power-odds/1.0.0. Main160 curated ordinary powers,
32 per intrinsic Tier1..5, plus None:158 existing canonical references and2
new Water Breathing1/Time Stop5 definitions. Power registry now302 with all
original300 ratings/policy unchanged. Authentic baseline fixture:
reference/power-tier-before-main-160.json. Creation reuses Primordial canonical
definition but never dispatches Primordial/Royal/Anime/source reward packages.

Authored editable odds use344 body/subrace fallback/routes,6 wrapper profiles,
27 archetypes,6 actual role-result rules,32 actual element/concept affinities
and16 approved Backstory bindings. Intrinsic-tier center is separate from
mastery or the weapon audit. Gaussian likelihood plus20% lucky uniform tail,
gentle tag factors max2, explicit Backstory tier factors, bounded normal-form
physical Size response max0.25; no transformation/external body/caption/final
bonus evidence. Body composition uses actual host/base/origin once. Household
low center/70% None keeps it usually weak; Anime genre/role and Fey seasons
have actual-source priors. Human50% None is an authored adjustable default,
not a submitted answer to the earlier optional question. All powers remain
possible unless hard exclusions/ownership remove them. No main Power reserved
equal tier masses, stat/mastery5% floor or25% cap. Existing numeric-stat engine
calibration stays unchanged; three owner-context tables append currently
canonical thematic outcome IDs without removing old IDs or granting access.

Actual God/full VesselGod90..100 non-guaranteed normal acquisition80% None.
Mage ordinary2/Master3 total includes main, each guaranteed. Master Sihir
exact x3 Tier3..5 weights applies only to Mage-managed requests. Hard guarantees
remove None first; Equalizer subsequently flattens eligible leaves, suppressing
soft lore/God scarcity/Mage weights without changing counts/ownership/guards.
Incompatible Archetype pairs still fail the accepted composition contract.

Stage helper creates stable ordered main/Mage/Fairy King/Shaman/Lich/Anime
FantasyMC/Backstory requests. Dumpster remains one guaranteed deferred extra;
other source normal-pool extras can get None. Freeze only the NEXT actual pool
after grant/None/reaction and refreshed ownership; consume each source request
once. Canonical ref/file/ordinary mode dedup; current None preserves earlier
powers. Fixed identical mode AND bounded binding merges provenance, not donor
mastery/Authority overrides. Unknown refs require migration. Eight universal
themes remain separate/equal and now have a source-caller pure planner with
ownership exclusion, one ordinary selected grant and exact saved return.
Exhaustion is needs_configuration preserving state; no new fallback/reroll/
duplicate reward or skipped required ticket. Earlier optional Power question
does not remain a blocker; the latest finish instruction delegates completion.

After all acquisitions, exactly one shared mastery gate: empty skips, actual
God/qualified Vessel fixed9 skips RNG, ordinary settled raw base reused by late
powers; final signed/unbounded modifiers and Resilient preserved. No Power
Enchant. Pure planners/CDF/resolvers emit guarded source-once receipts; caller
must atomically persist grant/None/request ledger before another pool. Persistent
scheduler/atomic store, combat/body/output limits and image/video adapters are
still future; this completes wheel DESIGN and its scoped helpers.

Regenerate: node framework/scripts/power-coverage.mjs
and node framework/scripts/power-preview.mjs
Coverage records455 actor contexts. Offline preview power-roster.html has160
searchable powers,23 frozen conditional examples, owned-power toggles and
weighted anticlockwise example spins. Search/Tier filters change only display.
Static JS/data/weighted rotation math and ownership normalization verified;
browser visual QA is not claimed. Preserve reference/before-main-power-wheel-
2026-10-10.json plus all prior recovery files. No automatic Weakness advance.

## 60 Enchantment dan gate akhir — 10 Oktober 2026

Latest user corrects next-wheel order: design Enchantment before Power. Read
content/enchantment-wheel-design.json and framework/enchantment-wheel.mjs,
enchantment-wheel/1.0.0. Sixty editable recipes, twelve per authored intrinsic
strength Tier1..5: zonk/practical/combat/special/legendary. All eligible leaves
have equal base probability; no None or separate rarity/tier selector. Weapon
equal-tier masses and stat/mastery5% floor/25% cap do not apply to Enchant.
Includes Ukuran Raksasa, Bloodsteal, Api, Living Weapon, Tajam, Super Kecil,
Licin and thirteen explicitly tagged funny results. Names/effect limits and
tier ordering are authored game choices, not external canon facts.

Preserve accepted timing: only final bonus phase after Title/late events and
all required raw/mastery/retry draws. Active owned enchantable weapon plus
final effective Weapon Mastery>=Master5 and one unused compatible slot permit
one draw. Retained raw0..9 plus distinct matching signed modifiers, no final
clamp; raw4+1 qualifies and raw5-1 does not. Existing proposed one-slot default
is retained, not multiplied by mastery. Canonical compatibility bindings cover
all150 main weapon definitions and reused early definitions with the same exact
reference. Sharp needs an edge; Ricochet a projectile; Battery Leak powered
capability. Unknown early weapons, girlfriend companions and external platforms
need explicit adapter bindings; never infer artifact compatibility from labels.
This is enchant compatibility, not owner anatomical body-fit validation.

Traits stay on the selected weapon instance. No direct main-stat/mastery bonus,
owner power, extra weapon/race/event or Power Enchant. Size enchants leave owner
Size unchanged. Bloodsteal needs a wounding hit on a blood-bearing target and
heals minor wounds, never invokes Vampire rewards. Living Weapon remains one
instance with bounded autonomous behavior. An actual tagged funny Enchant spin
supplies the existing source-once Shrek hook, settled by the ordinary final stat
ledger. Projection/replay/preview are not new funny results.

Pure planner/selector/resolver freeze canonical capability and final-mastery
proof, normalized eligible leaves and recipes before external RNG. Stable slot
key is [runId,characterId,weaponInstanceId,enchant,0]; caller must atomically
compare snapshot/active-inventory guard, attach trait and consume slot. Consumed
slots skip even after mastery changes; untyped legacy records need migration.
No persistent executor, atomic store or weapon-attack/render adapter is claimed.

Regenerate searchable offline preview with:
node framework/scripts/enchantment-preview.mjs
preview/enchantment-roster.html includes all60 recipes and150 compatible weapon
pools. Its example spin is presentation-only. Motion is anticlockwise; clockwise
ascending sector placement gives weak-to-strong passage under the pointer.
Search/Tier filters change the list, never the spin pool. Static data/JS and
rotation math checked; no browser visual inspection claimed. Preserve
reference/before-enchantment-wheel-2026-10-10.json and all earlier snapshots.
No automatic advance to Power/Weakness. The earlier optional Human Power None
question is pending for future Power design; no answer/default is committed.

## Weapon affinity dan audit seluruh subras — 10 Oktober 2026

Latest user asks gentle race/role-conditioned weapon affinity and a thorough
weapon-reliance audit, with Ultraman as an innate-power example. Read
content/weapon-wheel-design.json weapon-wheel/0.2.0 and
framework/weapon-wheel.mjs weapon-odds/0.2.0. All324 current terminal identity
routes across22 memberships are explicitly reviewed, including110 active hero
references, all Machine models/appliances and nested Elf/Beast/Lelembut/Cosmic
branches, plus131 armor/color/cheat/external-pilot event contexts.344 physical
profiles include19 family fallbacks; six behavioral
wrapper profiles inherit actual host/base/origin. Review record and generation:
reference/weapon-race-affinity-audit.json and
node framework/scripts/weapon-affinity-audit.mjs. Every numerical rate is an
editable authored game prior, not empirical canon ownership data. Existing
accepted recipes/research inform the audit; selected official Ultraman/Trigger
sources support body-beam combat plus a possible weapon exception.

Ordinary matching item factors are1..1.6 per profile, maximum matching tag once,
and combined ordinary weight is capped at2. Distinct sword/dagger/polearm/bow/
fist/flexible styles avoid treating every blade as a sword. Actual Royal
royal-chess-piece=knight favors swords1.5, shield1.3 and polearm1.2; Pawn and
unspecified Royal do not inherit Knight affinity. All150 recipes remain eligible
unless an explicit hard rule excludes them. Buku Jari Besi has Brass Knuckle
search aliases; Nunchaku remains Tier3 with flexible-weapon tagging.

None is separate: each Tier1..5 still receives20% of non-None mass. Example
baselines: Human20% None, Dragon80%, Ultraman90%, Phoenix95%, Slime80%,
Android75%, Cyborg45%, AI/appliance95%; Oni/Atlantean/Kinnara/Arthur10%.
Siluman is the approved humanoid normal form, so20%, not a full-animal prior;
Centaur retains humanoid upper-torso weapon use10%. Body/power-led beings are
more likely to skip ADDITIONAL acquisition; None removes no existing weapon,
power, ring/armor/board, or authorized extra spin and grants no stat buff.
Do not convert these soft priors into anatomical capability bans.

Physical host/body profiles compose once using the existing minimum/mean
mixture; actual wrappers add one most-specific behavioral overlay per source.
Giant/Skeleton inherit the base/origin propensity unchanged; Zombie adds3x
None odds, Symbiote80..100 adds1.8x None odds, never flat percentage points.
Hybrid combines actual body sources, not its label. External prey/armies/
companions/mentor/mecha, future results, narration, transformation sizes and
final bonus ledgers are not owner acquisition evidence. Six approved Backstory
bindings remain, with reduced ordinary affinity strength. The prior explicit
Paladin Sacred Sword reservation55% of Tier4 is retained as the named exception
(typical Human Paladin about10.1% overall); no Tier mass increase. Equalizer
still flattens every eligible leaf including None and suppresses all affinities.
Gladiator actual lock and guaranteed extras keep their established precedence.
Saint armor overrides: Libra20% None/sword-polearm-flexible preference,
Sagittarius20%/bow, Andromeda30%/flexible, Lyra25%/musical, Perseus35%/shield,
Auriga40%/ranged, Chameleon40%/flexible; other Saints80% unless another actual
source applies. These are authored affinities, not extra canon weapon grants.

New plans use0.2. Real frozen0.1 recipe/odds replay is supported and tested using
reference/weapon-odds-legacy-0.1-fixture.json; never replan saved draws. Weapon
Tier is independent of mastery; final-only bonuses and effective-Master5+
compatible Enchant remain. Pure planner/resolver and offline searchable
preview have27 actual conditional examples plus455-row race/event audit. Regenerate
with node framework/scripts/weapon-preview.mjs after regenerating the audit.
Persistent executor, capability/body fit and video adapters remain future.
Preserve reference/before-weapon-affinity-audit-2026-10-10.json and the earlier
before-weapon-wheel snapshot. This latest note supersedes the older broad
family/strong-affinity defaults below. No next-wheel auto-advance.

## Weapon roster and equal tiers — 10 Oktober 2026

Latest user delegates150 mixed funny/ordinary/legendary weapons and owner
Race/Archetype/Backstory-conditioned odds, then explicitly makes all five Tier
probabilities equal. Read content/weapon-wheel-design.json weapon-wheel/0.1.0
and framework/weapon-wheel.mjs weapon-odds/0.1.0. One flat151-sector main wheel:
150 weapons/30 per Tier, plus None. None is outside tiers. After species/subtype
None propensity, each Tier gets20% of remaining weapon mass. Lore changes item
weights only within each Tier; maximum matching tag factor per profile avoids
counting overlapping blade/holy/magic tags several times. Authored calibration,
not canon/statistical power scale. Human baseline None20%/eachTier16%; Western
Dragon None80%/eachTier4%. Human Paladin Sacred Sword about10.1% overall via55%
reservation within Tier4; a different None propensity changes this percentage.
Never boost Tier4 mass. Composite hosts/bodies choose actual physical priors;
wrappers are not independent anatomy. Six approved Backstory weapon intents are
now bound; Power/Weakness/Apex/Title bindings remain pending.

Hard exclusions and guaranteed extra None exclusion precede odds. Equalizer
flattens every eligible individual sector including None and suppresses lore/
anchors; after unequal item exclusions this named override can supersede equal
tier masses. An entirely excluded tier needs_configuration. Actual committed
Gladiator lock skips acquisition before RNG; normal None erases no early weapon.
Reused Katana/Trishula/Tech/Excalibur/Durandal definitions do not dispatch their
source race/hero events or inherit source-only mastery boosts. Separate sources
remain distinct weapon instances; no new weapon no-repeat rule. Intrinsic Tier
never sets Weapon Mastery0..9, adds a power/stat, or guarantees Enchant. Preserve
final-only bonuses, per-active-instance raw mastery, final effective5+ compatible
Enchant, source-once actual funny-result/Shrek hooks, and old frozen histories.
Pure helper emits source-keyed grant/None then returns weapon-subflow for all
queued bonus acquisitions/details/masteries before Power; not persistent
execution. Capability limits/body fit/Enchant adapters/video remain future.
The roster preview is generated from these actual frozen example plans.
Preserve reference/before-weapon-wheel-2026-10-10.json. Do not auto-advance Power.


## Backstory approved and event timing — 10 Oktober 2026

All38 proposed Backstory recipes and qualitative odds intents are user-approved.
Read content/backstory-wheel-design.json backstory/0.4.0 and framework/backstory-event.mjs.
General Power extras register source-owned tickets now and spin at the Power
stage; Dumpster gives one guaranteed acquisition excluding None with a future
Tier1–2 preference. Android/Divine wheels and Test Subject extra Weakness run
immediately; fixed Intangibility grants immediately. Finish those children and
reactions before Size. Normal later Weakness/main Power stages remain. Numeric
stat/mastery modifiers register immediately but calculate final-only. No early
mastery/Enchant. Early powers survive main None; God shared9 remains no-RNG.
Five separately authored editable0.35 lore shifts favor current stats/masteries
under stat-odds/0.4.0 (96 event rules); not measured data or numeric user choice.
Other qualitative odds are approved intents awaiting future pool/tag bindings;
no caption-derived multiplier. Pure helper freezes recipes and emits queues/
unique source keys; persistent scheduler/adapters still future. Design ready,
production wheel remains disabled until its required adapters exist. Source38
equal base/labels/IDs and old saved histories preserved. Latest approval
supersedes one-at-a-time/pending37 notes below. Preserve recovery snapshot
reference/before-backstory-approval-timing-2026-10-10.json.


## Jaminan maksimum dan awal review Backstory — 10 Oktober 2026

User explicitly confirms God skips ALL Power Mastery and all owned powers use
base9. New stat-odds/0.3.0 checks committed God/qualified VesselGod60..100
guarantee before RNG; fixed shared9 across present/future powers. General
maximum-skip rule also fixes Lich Durability9 without singleton spin. No actual
attempt/spin ID/Lucky hit/Resilient retry/Double decision/Pawn sampled category.
Hard exclusion of9 requires configuration; empty power inventory stays empty.
Bonuses/debuffs final-only signed/unbounded. Ordinary5%..25%, Kinnara minimum,
all acquisitions/follower/scarcity/counts/old saved histories remain. Latest
shared guarantee supersedes older source-instance-only Authority wording.
Backstory0.3: video2 roster38, Orang random approved lore-only/no effects or
followup. No implicit numeric odds;37 outcomes pending, next made-in-lab.
Latest user asks effect suggestions for all38 Backstories together; proposals saved separately, only Orang random approved. Full persistent/video executor remains future. Preserve
reference/before-guarantee-skip-backstory-2026-10-10.json.


## 10 Oktober 2026 — Peluang Stat/Mastery 5%–25%

Pengguna menetapkan minimum5% dan maksimum25% untuk setiap pilihan yang masih
eligible pada lima stat dan kedua mastery. Ini menggantikan cap30% dan contoh
God30/25/20. Lore tetap membentuk bobot, lalu floor-reserved water filling
menjaga total100% dan rasio sisa peluang di atas minimum untuk sektor bebas. Hard exclusions tetap berlaku.
High Roller empat pilihan otomatis25% masing-masing. Lich rawDurability9 tetap
jaminan100%; Equalizer tetap uniform. Berlaku per actual attempt, termasuk
Resilient, bukan distribusi retained/copy/nilai akhir/Double-or-Nothing50:50.
Versi baru stat-odds/0.2.0/model2; plan lama mempertahankan batas/odds beku.
Bonus final tetap signed/unbounded dan dihitung di akhir. Roda lain tetap.


## Peluang Stat dan Mastery — 10 Oktober 2026

User requests distinct lore/race/Archetype/Size-conditioned odds with every normal random tier result capped at30%, plus hidden adjustable parameters. Transformation Size is explicitly not needed. Read content/stat-odds-design.json (stat-odds/0.1.0), framework/stat-odds.mjs and docs/STAT-SCALES.md. Current170 most-specific physical race priors,28 role likelihood profiles and91 event rules cover all324 terminal identities. Seven hidden axes/canonical targets separate physical potential, mobility, resilience, cognition, fight training, weapon training and power control. Authored game calibration, not empirical/statistical population fit. God baseline Strength has raw9 Boundless30%,8 Universal25%,7 Cosmic20%, lower25% authored; other axes differ. Gaussian priors reserve1.5% distributed tail before context likelihood/cap. Composite centers80% per-axis maximum +20% mean; role/event shifts separately authored, direct final bonus ledger never an odds input.

Use validated completed owner raceFacts and actual committed archetypeFacts/source IDs, frozen normal Size plan/result with matching owner, actual owned weapon instances/powers. Targets/prey/troops/mentor/companion/external unit do not become owner identities. Deep subtype precedence; wrapper host/origin body supplies prior. Bounded log physical Size affects declared axes separately, never cognition/mastery, avatar mass or transformation Size. Optional canonical Backstory source is preserved but neutral until explicit likelihood authored; no automatic event/gift.

Hard guards first, High Roller four original extremes then hard intersection/conflict configuration, Equalizer uniform, proportional water filling redistributes capped mass without renormalizing clipped sectors. Ordinary pools below4/infeasible caps need configuration; named approved Lich raw9 singleton100% is an exception. Cap per actual attempt, not retained Resilient/copies/final scores or separate Double/Nothing1:1 decision. Kinnara floor5 only own instrument source; per-weapon plans/one shared Power Mastery, no Tier-to-mastery inference or Power Enchant. Source-bound God/Vessel Authority9 remains distinct from ordinary shared draw. Same-frozen-pool Resilient one retry/highest, actual Lucky hit IDs/Pawn retained raw, All In raw copies, Double/Nothing raw-only; all numeric bonuses final-only signed unbounded, effective Weapon Mastery>=5 readiness remains final Enchant caller gate.

Pure context/planner/external-CDF/draw/score helpers implemented; full persistent executor, inventory adapters, final Enchant/Lucky/Pawn aggregate queues and video production remain future. Preview/stat-odds.html is offline generated from engine:17 examples/200 Size choices/seven charts and anticlockwise weakest-to-strongest wheel. Regenerate with node framework/scripts/stat-odds-preview.mjs. Intelligence1..9 labels still source-pending numeric placeholders. Preserve committed old plans/journals and recovery snapshot reference/before-stat-odds-engine-2026-10-10.json. No next-wheel auto-advance. Earlier uniform/pending stat-odds and alternate-transformation Size todos below are superseded.

## Seluruh default profil Size — 10 Oktober 2026

User authorizes research or authored assumptions for remaining sizes. Size0.4/model3 contains195 profiles (185 additions, prior ten numeric priors retained), explicit normal forms/measurement semantics and provenance. Current22 families/324 terminal identity routes covered, with131 additional owner reward contexts audited in reference/size-profile-coverage.json. Shared legendary humanoid125–220cm plus ten overrides is deliberate reincarnated physique assumption, not measured historical/Fate height or Human fallback. Normal Siluman humanoid, Centaur combined floor-to-head height, Dragon/Naga/Mermaid length, Slime/fire diameter, Ghost/AI/avatar visual dimensions and Nanobot whole-swarm envelope declared. AI/avatar size grants no physical mass; household remains weak. Actual Machine model determines owner size; external AnimePilot/Rider/Colossal Warmech units never do. Cheat title/power/armor/color/stat/follower does not change body identity automatically. Three new source proxies/centers Pixie/RX78/Gipsy explicitly distinguish game bounds from lore and toys. Model3 allows mixed metrics only with every profile's matching source metric -> characteristic-dimension scale1 declaration; record projection and all original sources. This is authored principal-extent convention, not physical measurement equality; undeclared/mismatched still needs_configuration. Explicit all-source body wins, Raksasa8/default1/8/Cosmic preserved; same numeric priors/history/other wheel rewards unchanged. Full normal-form Size coverage does not finish body artwork, alternate transformations, equipment fit/controls, Backstory likelihoods or persistent/video engine. Snapshot reference/before-size-coverage-completion-2026-10-10.json. No next-wheel auto-advance.

## Kalibrasi Size dari sumber lore — 10 Oktober 2026

User requests wiki/known-lore calibration. Size0.3.1/model2 reviews all ten existing priors against selected published lore and user ranges. Read reference/size-calibration-research.json and docs/SIZE-RAKSASA-EVENTS.md. Dwarf122–152cm/Gnome91–122/Orc183–213 are nearest-cm source interval conversions; centers derive from explicit nominal midpoints, Pathfinder Goblin mean91.44cm and SRD Troll typical274.32cm. User Tuyul60–120cm/Ultraman50–70m remain; Ultra curve center52.5m is the equal curated Tiga/Dyna/Gaia/Z official sample, not a franchise population mean. Human/Elf finite envelopes remain authored. Human+Goliath213–244cm and joint Human+Elf+Goliath are explicitly editorial D&D physique analogies, not video-role species canon or source ability grants. Half-Elf joint reference center1.6764m; Gaussian widths, mixture influences and tempered0.5 strength remain authored, not empirical sigma/confidence. All five Symbiote takeover-height rules neutral strength0/slope0 until a defensible numeric/form mapping exists; actual source context and approved takeover rewards remain. Every profile/rule carries reference URLs, version and derivation/status frozen with plans. Only future plans use calibration; historical committed0.2/0.3 plans resolve unchanged. Giant8/default1/8/strict Cosmic and Equalizer/hard guards unchanged. Profile coverage beyond ten and Backstory/full engine still incomplete; do not auto-advance. Snapshot reference/before-size-source-calibration-2026-10-10.json.

## Size conditional Bayesian — 10 Oktober2026

User requests adjustable probabilistic combination of race/event context, new Size wheel each character and Bayesian inference. Read content/size-wheel-design.json size/0.3.0/probabilisticModel and framework/conditional-size-odds.mjs. Default planner combines one selected prior per compatible physical identity via weighted mixture, then explicit tempered likelihoods and joint interactions in log space. Explicit all-source body support wins; different metrics/missing component still configuration. Tokens actual owner family/result/Archetype only. Prior-encoded single evidence skipped, one most-specific rule per dependency group, explicit interaction allows joint correction; equal-specificity conflict fails. Seven initial rules (Symbiote takeover and Human+Elf/Goliath) are authored adjustable lore parameters, not empirical inference/training or proof of accuracy. Knobs mixtureWeights/priorStrength/evidenceStrength/per-rule strength/likelihood shape/conditions/display count. Full posterior conditions before at-most12 integer-sector mass-preserving approximation; save full trace/model/priors/projection before RNG. Final Equalizer uniform/hard guards preserved. Raksasa retains eight abnormal milestones/default1/8; only explicit giant-scoped likelihood/factors can alter odds. Cosmic threshold/one source reward unchanged. Existing0.2 committed plans resolve as saved; probabilityModel:null deliberate legacy planner. Core race/Archetype/power/stat rewards unchanged; remaining Size profile coverage, Backstory events and full persistent/video engine still future. Snapshot reference/before-size-bayesian-2026-10-10.json.

## Size dari rentang ras dan Archetype — 10 Oktober 2026

User requests explicit body ranges from Race/subrace and Archetype results, whole-number audience labels, optional exponential spacing and abnormal Raksasa. Read content/size-wheel-design.json size/0.2.0 and framework/size-wheel.mjs. User examples Tuyul60–120cm and Ultraman50–70m are fixed; eight other starting profiles including Human+Goliath are authored editable game defaults, not canonical measured bounds. Twelve initial positions round/merge duplicate labels; linear/geometric spacing is separate from broad-normal odds. Equalizer uniform after hard guards. Raksasa anywhere wins with unchanged eight equal milestones/strict beyond-Earth Cosmic. Actual owner identity only; transparent host/origin wrappers, explicit all-source composite body profile, joint role profile before subtype/family, ties/missing configuration. Freeze full plan before external draw; pure resolver emits ledger/followup keys, persistent executor still future. One Size after Backstory, no implicit stat bonus or reroll. Legacy 0.5–2x multiplier template retired/snapshotted. Remaining body profile coverage and38 individual Backstory events still incomplete; no automatic advance to another wheel. Snapshot reference/before-size-ranges-2026-10-10.json.

## Backstory lore and future odds — 10 Oktober 2026

User clarifies some Backstories have no bonus, serving lore and changing later probability distributions. Separate loreContext/probabilityModifiers/directEffects/eventRules; no mandatory buff or child wheel. Default empty effects/events only after classification; null remains pending. Exact numeric weight profiles come at later-wheel design; lore/AI prose does not infer them. Apply only future draws before freeze, no retroactive changes; keep hard eligibility and active Equalizer precedence. Read content/backstory-wheel-design.json0.2/spec eventContract.backstoryLoreOdds. Individual38 outcomes remain under review; no specific outcome/event was explicitly approved by this general clarification.

## Backstory baseline — 10 Oktober 2026

User authorizes continuing after Race/Archetype core detail review and chooses video2 as Backstory basis. Read content/backstory-wheel-design.json and reference/backstory-video2-reference.json:38 observed outcomes,35 full labels/3 explicitly truncated source prefixes. Indonesian display labels authored/editable, every event pending, equal1/38 default from user policy, wheel runtime disabled until required designs/executors exist. Source sector size is not gameplay odds; living-weapon -> Techno Ability/AI Precognition is observed evidence only. Review one event at a time starting random-guy, then Size. No race/role roster/weights/rewards changed; production body/Size/executors remain configuration. Snapshot reference/before-backstory-baseline-2026-10-10.json. Earlier focus on closing Race/Archetype before asking to proceed is superseded by this direct user authorization.

## Detail terkini dan arah roda — 10 Oktober 2026

Roda Race/Archetype berputar anticlockwise. Sektor meningkat searah jarum jam, sehingga melewati pointer atas dari lemah ke kuat; RNG,22 ras,28 role dan bobot kanonis tetap.

Keputusan pengguna: Siluman tepat satu dari12 hewan (Kelelawar/Elang ditambah), tubuh humanoid berciri hewan dan transformasi full hewan terpilih. Lich menjamin raw Durability9 saja. Kelima main stat dan kedua mastery final boleh negatif/melebihi9 tanpa floor/cap; raw0..9 tetap. Authority God/Vessel base9 lalu shared Power Mastery modifier final. Acquisition power mengecualikan yang sudah dimiliki; fixed grant identik digabung dengan semua sumber/binding. Roda Power utama nanti minimal128 pilihan; exhaustion themed pool ditunda ke tahap Power. Hybrid/Mutant tubuh bebas dicampur AI dari committed identities, satu blueprint tervalidasi/frozen, tanpa bonus visual atau re-gate Mutant.

Hybrid Archetype memfilter pasangan yang saling membatasi sebelum child2, simetris; matrix authored berada di content/archetype-hybrid-events-design.json. Planner murni framework/archetype-hybrid.mjs memakai bobot kanonis setelah filter. Disciple valid empty archive langsung satu Divine spin dengan fixed mentor label God, mastery biasa; bukan paket ras God. Provider arsip yang belum ada tetap memerlukan konfigurasi. Helper Disciple/Hybrid dan gate/Slayer sudah diverifikasi; executor video/event/journal/body masih belum dibuat.

Read content/detail-closure-design.json, docs/MAIN-WHEELS.md, docs/STAT-SCALES.md, docs/POWER-MASTERY.md, docs/DISCIPLE-EVENTS.md, docs/ARCHETYPE-HYBRID-EVENTS.md. Latest policy supersedes earlier cap/fixed-maximum/multi-animal/bootstrap/pair-pending notes below; preserve historical journals/snapshots. Complete Race/Archetype detail review before opening the next wheel with the user.

## Siluman clarification — 10 Oktober 2026

User clarifies 12 means species choices, not twelve animals per character. Add Kelelawar/Elang to ten approved species; exactly one equal type spin, no count/fusion/dominance. Normal form humanoid with animal traits; Animal Transformation binds the selected full animal and original return body, Babi also Nyolong. Update canonical mirrors and identity-only Slayer/Warlord one draw. Gate1.5 validates one result/all12 IDs, no repeated-sampling profile; explicit body/role bindings still required. Slayer1.5 adds new types to trained count assignments without changing eight count profiles or5% floor; Warlord0.5 projects same. Old journals unchanged; snapshot reference/before-siluman-roster-correction-2026-10-10.json. Main22/Archetype28/300powers and weights unchanged.


## Main wheel strength order — 10 Oktober2026

User requests weakest-to-strongest Race/Archetype with weak:moderate:strong3:2.5:2. Read docs/MAIN-WHEELS.md/content/main-wheel-strength-design.json and preview/main-wheels.html. Ratio interpreted as full band mass40/33.33/26.67, equal per band sector; Race7/8/7 and Archetype9/10/9 authored relative classification from current approved packages/risks. Order/band metadata grants nothing and is distinct from Power Tier, gate boostBand/raw stats. Canonical Race weights groupWeight/fullBandCount and28 Archetype active outcomes replace equal roots; observed video records untouched. Filter guards first, preserve per-sector base then renormalize; no band rebalance/extra category spin. Equalizer final override retained. Gate1.4 classification unchanged; planArchetypeStage default canonical-strength odds with profile-weights explicit legacy/custom mode. Main-wheel odds helper/inverse CDF pure, full generator still pending. No event recipe/child ratio/stat/mastery/count5% changes. Warlord Army Type23 remains separate equal wheel; race-family projections inherit current root weights. Snapshot reference/before-main-wheel-strength-2026-10-10.json freezes prior catalogs.22Race/28role/300powers unchanged.


## Cosmic armor dan cincin Lantern — 10 Oktober2026

User removes Asgardian/Kryptonian; remaining six groups equal1/6. Saint retains Fight+2, then one35-armor flat wheel grants only selected Cosmic Armor Bronze2/Silver3/Gold4. Lantern retains Intelligence+2, then one9-color wheel grants selected bounded power3/4. All child entries equal1, roster/Lantern individual tier scope authored. Previous fixed Cosmo/Constructs replaced, legacy exact definitions lookup-only. Other packages unchanged. Remaining-proposal acceptance adopts Centaur compatible spin/Cosmic skip; explicit bodies still required. Gate1.4 requires actual child completion; Slayer1.4/Warlord0.4 stop before reward equipment. Prior snapshots/journals frozen; snapshot reference/before-cosmic-armor-lantern-2026-10-10.json. New total300 power definitions; earlier288 ratings unchanged. Main22/Archetypes28 preserved.


The user's stated sequence and dependencies define the foundation. The defaults below fill gaps
in that sequence and remain open to refinement as the user explains the format further.

## Event Slime Centaur dan Cosmic Warrior terbaru

Slime6 diterima pengguna. Centaur kini memilih tubuh bawah hewan, lalu total1/2 poin stat sesuai hewan; roster12 dan alokasi authored. Cosmic Warrior kini memilih8 kelompok media, Ultraman memilih Merah/Biru/Mixed dengan bonus Strength+2/Speed+2/Strength+1+Speed+1 dan satu power Ultraman Tier4. Generic Cosmic/bonus fixed sebelumnya retired. Definisi baru9 memperluas279 power menjadi288; refs Acid/Poison/Healing/Reality Rewrite tetap shared. Centaur/Cosmic gate diklarifikasi terpisah, body/Size/executor pending. [Event lengkap](VIDEO2-RACE-IMPORTS.md).

## Impor awal Slime Centaur dan Cosmic Warrior

Pengguna mengimpor ketiganya sebagai pilihan utama. Roda sekarang22 ras dengan bobot1 masing-masing. Event yang disimpan di [draft tiga ras](VIDEO2-RACE-IMPORTS.md) belum disetujui: Slime spin enam tipe, Centaur Speed+2, Cosmic Warrior satu Cosmic Power dan Strength+1/Durability+1. Gate spin/skip, profil tubuh/Size dan jumlah korban/pasukan masih perlu ditentukan; daftar279 power dan semua resep19 family sebelumnya tetap sama. Review dimulai dari Slime.

## Confirmed requirements

- Latest Archetype direction supersedes the withdrawn twelve authored roles: use observed labels from the supplied Wheel of Fait videos, without online research. The first seventeen-label audit is scoped to video one; the second source adds a larger roster as recorded below. Each event and user roster adjustment remains pending; source captions/odds are not instructions. Apply accepted eligibility policy 1.0.0, including Raksasa skip; preserve other stage/mastery/source contracts.

- User clarifies Siluman amount as exactly twelve animals, not 1-or-2 or a 1–12 count wheel. Retire the proposed 1/2/3 selector/cap. Ten approved species remain; sampling/pool feasibility and form/fusion rules are pending. Transformer power is confirmed Vehicle Shifting, fixed once for the selected vehicle mode without extra Power draw or comedy trigger.

- Latest simplification: Nanobot directly grants Shapeshifting; remove its model wheel and four model funny-result tags from active registries, retain inactive history. Appliance display uses short power names without joke explanations: Blender Ngejus, Air Fryer Goreng Tanpa Minyak. Existing twenty weak linked powers, odds, common mastery, conditional Shrek and source mechanics remain.

- Latest Household correction: extremely weak laughing-stock branch with short deadpan roasting narration. Each selected appliance directly gains one related mundane-function power; no second power selector. Twenty authored functions are confined to ordinary household use. Power still counts for common mastery, but high Size/stat/mastery does not automatically upgrade it into combat/elemental control. No numerical stat cap/penalty or removal of another source reward was specified. This supersedes the earlier no-power Household proposal.

- Earlier Machine event draft, superseded for Nanobot/Transformer by the newer rules above: retain all seven branches. AI directly Digital Being +2 numeric Intelligence; Cyborg +1 numeric Intelligence then one Cyborg Weapon; user clarifies zero extra AI/Cyborg type selectors. Android one Android Power, with Power Negation/Laser Eye examples. Mecha models include Mechagodzilla/Mecha Probe; Household remains appliances. Cool/zonk catalog contents are authored suggestions; Transformer/Nanobot routes/themes are proposals without power/stat grants. Five new twelve-entry catalogs use equal weights with four zonks; zonk is not None/penalty and tagged actual results reuse existing Shrek hook once when already active.

- Latest Machine refinement: AI is included as a Machine subtype. User asks for distinct suggestions: the revised authored roster is Android/Cyborg/Mecha/Transformer/Nanobot plus confirmed AI/Household Appliance. Generic Robot/Automaton proposals are inactive history. Suggested digital AI representation and other body themes do not grant powers, fixed Size, pilots or numerical bonuses. Existing Household twenty-item event and comedy hook are preserved; other profiles await definition.

- Machine addition: Household Appliance / Alat Rumah Tangga → exactly one item spin. Rice Cooker/Microwave are explicit examples; the twenty-item funny household catalog is authored within delegated scope. Item is body identity, not automatically weapon/power. Item funny-result tags reuse the existing already-active Shrek hook once per actual spin; family/subtype parent captions are not tagged. Other five Machine type candidates remain proposed.

- Latest addition: Machine is canonical main family `machine`, the eighteenth option, with base weight 1. User confirmed its first event is one Machine type spin. This updates the earlier seventeen-family count; it preserves the original seventeen identities/mechanics. Robot/Android/Cyborg/Mecha/Automaton are assistant-proposed types; roster membership and per-type events/grants remain pending. See [Machine events](MACHINE-EVENTS.md).

- Rename Anime MC display to Anime, preserving anime-lineage family and seventeen main races; Anime remains outside Reinkarnasi Pahlawan Legendaris. Retire the prior seven named-MC selector.
- Anime spins Genre Isekai/Fantasy/Romance/Sci-fi/Action/Sport/Slice of Life first, equal base odds, then MC/NPC at fixed 50:50. Every NPC keeps context and continues without an MC genre event.
- MC Isekai draws one Cheat Skill from a large researched anime-inspired wheel. MC Fantasy queues one additional normal Power acquisition. Action grants +1 numeric Strength; Sport +1 numeric Speed; Slice of Life continues.
- MC Romance endings Pacaran/Tertolak/NTR/Harem/Digantung use fixed 1:2:1:1:2 odds. Pacaran grants one Girlfriend weapon. Harem spins equal counts 1..5 and grants that many separate Girlfriend weapons. Other endings give sad context only.
- MC Sci-fi chooses Technician/Pilot/Cyborg with equal base weights. Technician draws one of twenty Tech Weapons and adds +1 Weapon Mastery only to that actual Technician Tech Weapon, explicitly clarified. Cyborg draws the same wheel twice. Pilot selects one of twenty rideable mecha references.

- Rename the existing Demon display option to Abyssal Axiom, preserving its family identity and the seventeen-option main race pool. Five types/events are now approved: Raja Iblis Agung, Iblis, Fallen Angel, Setan, Pendosa; equal base weights. The former eight candidates are archived.
- All earlier and future wheels use equal base probability unless the user specifies a ratio, distribution shape or guarantee. Resolve unspecified base weights to 1, filter eligibility, apply approved conditional modifiers, then normalize/freeze. Preserve committed historical odds/results. See [probability defaults](PROBABILITY-DEFAULTS.md).
- Select a commenter or use a direct request for a spin.
- Resolve Race and its events, evaluate the accepted Archetype gate (one compatible spin/events or skip), then Backstory and its events.
- Spin strength, speed, durability, intelligence, and fight.
- Spin weapon and mastery; master or higher unlocks enchantment.
- Spin power using the similar pattern without enchantment.
- Spin weakness, apex force, a boost if an apex is obtained, and title with possible hidden events.
- Generate the character image from the results, then show final stats.
- Results before the main stats affect the probability distribution of later spins.
- Every spin receives narrator commentary using meme video and text.
- Build for an Indonesian audience, with Indonesian folklore, anime, Western fantasy, and familiar mixtures.
- Settle the system before adding detailed names and content.
- Keep the work in the new Roda Kekacauan project.
- Group Pocong, Tuyul, Kuntilanak, Skeleton, Vampire, and related ghost/undead candidates under Lelembut in this game's race tree.
- After Lelembut, spin Lokal or Impor, then the corresponding creature type.
- Retain 12 local Lelembut types and only Skeleton/Vampire/Zombie/Lich/Ghost/Mummy among imported types. Remove Ghoul and the other imported candidates; origin/type base odds now equal by the user default.
- Local events: Pocong Jump; Tuyul Nyolong; Kuntilanak Flight; Genderuwo Size Manipulation; Wewe Gombel Child Protection; Sundel Bolong Mukbang; Kuyang Flight + Organ Control; Leak Cursed Power spin; Palasik Head Detachment; Banaspati Fire Manipulation; Jenglot Pesugihan; Suster Ngesot Ngesot and -1 Speed.
- Skeleton and Zombie spin the main race wheel for their source race, run its approved subtype/events, and retain their undead identity. The user confirmed event inheritance.
- All character race respins exclude previously selected races before drawing. Use all committed family history across nested origin/parent/host branches; remaining weights are normalized.
- Use funny Gen Z Indonesian narration and familiar mixed labels. Ngesot stays Ngesot, Mukbang stays Mukbang, Nyolong stays Nyolong; avoid formal translations on display labels.
- Vampire spins a race-based feeding preference then victim count 0/1/5/10/100/1000. Counts 0–10 give no boost, 100 gives +1 every main stat, 1000 gives +1 every main stat plus one Cursed spin. Ratio 5:4:3:3:2:! is interpreted as 5:4:3:3:2:1 and disclosed.
- Lich gains one extra Power spin and maximum Durability guarantee.
- Ghost grants Intangibility (passing through objects), explicitly clarified by the user; Mummy grants Sand Manipulation.
- Babi Ngepet gains Nyolong; routing it through the existing Siluman Babi selection is an explicit design interpretation.
- Place Garuda and Barong under Mythical Beast. Barong refers to Barong Bali; Reog Jawa (Singa Barong), with a wide face, is a separate primary local type.
- Use familiar mixed Indonesian/English names suited to young Indonesian viewers.
- Allow Siluman to roll multiple animal types.
- Use animals linked to keramat and folklore, especially Indonesia. All ten choices are accepted: Harimau, Serigala, Babi, Ayam, Ular, Buaya, Kera, Kerbau, Rubah, Kucing.
- Siluman receives Animal Transformation; it counts as an owned power for the normal later mastery stage.
- Research and expand mythical-beast candidates. All ten local types now have user-defined events; Barong Bali and Reog Jawa remain separate. Origin/type base odds are equal; detailed balance and imported events remain open.
- Kuda Sembrani/Garuda: Flight and +2 numeric Speed. Warak Ngendog: Unity Inducement. Makara: Water Manipulation and +2 numeric Intelligence. Barong Bali: Spirit Control and +2 numeric Strength. Reog Jawa: +2 numeric Strength and +2 numeric Durability.
- Kinnara grants one musical instrument weapon; its own Weapon Mastery roll is guaranteed at least Master. The ordinary Master-or-higher enchantment rule applies.
- Singa Ambara Raja grants +1 numeric Speed and +1 Power Mastery. User clarified power +1 means mastery, not an extra Power spin.
- Naga calls the universal Element wheel once and receives its selected manipulation power.
- Lembuswana grants Purity Power and +2 Power Mastery. User clarified the bonus applies to all owned powers.
- Anime remains a standalone family outside Reinkarnasi Pahlawan Legendaris with ID anime-lineage. Its current selector is Genre → MC/NPC; the earlier named-MC proposal is archived inactive.
- Keep Hybrid on the main race wheel with its own event.
- Heavenly Principle selects God/Demigod/Angel/Utusan Tuhan/Pemuka Agama/Orang Saleh with exact subtype weights 1:1:2:2:3:3.
- God spins one canonical Concept and gains only its selected Authority at maximum mastery, then exactly two Divine Power spins. Its later normal Power odds are 80% None/20% an eligible power, without erasing owned grants. The Authority maximum is a source-instance exception; ordinary Divine/normal powers use the one shared mastery.
- Demigod gains one ordinary Concept power and +1 numeric each on all five stats. Angel gets two Divine Power spins. Utusan gets one ordinary Concept plus +1 shared mastery. Pemuka gets one Divine spin. Orang Saleh fixed Komunikasi dengan Tuhan.
- Divine Power has fifteen outcomes strongest to weakest. Holy remains twelve; twelve equivalent definitions are shared and three Divine powers added. Concept is shared by God/Demigod/Utusan with a proposed twelve-entry starter, count/roster adjustable; base weights equal.
- Include a Reinkarnasi Pahlawan Legendaris type with its own local/imported branches.
- Include wayang, local legendary heroes, and Gajah Mada locally. Latest Imported direction is historical/traditional figures appearing in Fate; earlier Jedi/Superhero/Ranger/Rider examples and one-per-franchise rule are superseded history.
- Human has no race event or extra selector. Its narration context is "nothing special, mere human"; after the complete outer Race chain, evaluate the Archetype gate.
- Elf opens a Type of Elf wheel with eight confirmed types: High, Dark, Forest, Sea, Blood, Fey, Shadow, and Astral Elf.
- High Elf draws one Holy Power, Dark Elf one Cursed Power, and Blood Elf one vampire-themed Blood Power; each pool has 12 options drafted by the assistant in ascending relative potential as requested.
- Forest Elf gains Forest Control, Shadow Elf gains Shadow Manipulation, and Astral Elf gains Astral Projection, without another subtype wheel.
- Sea Elf draws Putri Duyung at 60% with Mermaid Song or Atlantean Warrior at 40% with Trishula and +1 Strength. The user clarified +1 means one numeric point, not one tier.
- Fey Elf draws one season: Summer/Fire, Autumn/Decay, Winter/Ice, Spring/Life; add that season's mapped power.
- Race-granted powers are owned powers and count at the later Power Mastery gate, even when main Power is None. The user confirmed exactly one shared Power Mastery spin for all owned powers; mastery opens no follow-up event. Later grants inherit the same result.
- Golem spins Sand/Rock/Magma/Crystal/Diamond/Element/Trash. Every type receives manipulation for its material; Element Golem invokes the one universal Element selector and receives the chosen manipulation power.
- Element Golem grants +1 rank step on the one shared character Power Mastery, once per committed type source. It affects all owned powers, uses the configured cap and creates no extra mastery or acquisition spin.
- Elemental spins the same universal Element selector once and gains the selected canonical manipulation power. Elemental grants no Power Mastery boost.
- Symbiote spins Takeover 0–100% by 10% steps. 0/10 no bonus; 20–40 Strength +1; 50–70 Strength +1/Durability +1; 80/90 retain both and spin one Symbiote Power. 100 gives total +1 each on all five stats and exactly two Symbiote Power spins, as clarified by the user.
- Symbiote Power has one canonical twelve-power pool in the universal power file, with one grant/reaction per invocation. Names/scopes are delegated game content; base weights now equal. No takeover mastery boost or unrequested type selector. The later user clarification adds one mandatory family-level host race spin with its events.
- Rock/Magma Golem grant +1 numeric Durability, Crystal +2 and Diamond +3. Record once at type result, apply through the ledger after the immutable base Durability roll. Type base weights are equal; detailed limits remain open.
- Add factual narration context to each Elf type and follow-up result.
- Kurcaci spins Dwarf or Gnome. Dwarf spins how many armor pieces (1–5), then exactly that many unique piece results. Disable each selected piece for subsequent draws.
- Helmet, Body Armor, and Leggings each add +1 Durability; Gloves add +1 Fight; Boots add +1 Speed. The numeric-point convention from the prior clarification is applied to these bonuses.
- Armor count has descending weights written as `5:4:3:2:!`; the final character is interpreted as `1` and this assumption was disclosed.
- Gnome spins one tech; the assistant is authorized to draft approximately 20 choices. The selected tech is an owned weapon for the later Weapon Mastery stage.
- Replace the generic Gnome technology list with a pool that fits Gnome tinkering: clockwork, gears, springs, steam, traps, lenses, alchemy, and decoys. Combat gadgets still count as weapons, including control and deception tools.
- Goblin rolls army count 0/5/20/100/1000/10000 with weights 5:10:15:10:5:1, then Bos/Kacung with 1:1; the boss miss is an intended joke.
- Orc roles are General/Oni/Warrior/Shaman/Shrek at 1:2:3:3:1. General spins army count; Oni spins Cursed Power and receives Katana; Warrior gets one extra Weapon spin for an extra weapon; Shaman gets one extra Power spin later.
- Shrek is the intended strongest Orc profile and receives a Shrek Power. The user clarified that +1 on all five main stats occurs **for every funny spin result**, rather than once on acquisition.
- Troll spins one of twelve disease/condition outcomes, each decreasing a main stat. User examples: Asma -1 Speed and Penyakit Kulit -1 Durability; the remaining ten mappings are delegated.
- Raksasa now skips Archetype under accepted policy 1.0.0 (9 October 2026), superseding the former additive-second rule. Base race, giant Size/Cosmic and previous committed journals remain.
- All characters spin Size before main stats. Raksasa uses 10/50/100 meters, 1/10/100 kilometers, Planet Size, and Sun Size over logarithmic magnitudes.
- A size beyond Planet Size grants one spin from a twelve-choice Cosmic Power pool; the assistant defines the choices.
- Ordinary Size depends on sourced typical dimensions and has twelve sections from 0.5 to 2 times its reference, with a broad normal-shaped distribution.
- Holy, Cursed, Blood, Cosmic, and future thematic power wheels each use one universal pool for all eligible callers.
- Peri subraces are Fairy Parents, Element Pixie, Healer Fairy, Fairy King at fixed weights 4:2:3:1.
- Parents grants Wish Granting; Pixie spins the universal Element wheel and gains the selected element manipulation; Healer grants Healing Power.
- Fairy King grants one extra Power spin and +2 Power Mastery. User clarified the bonus applies to all owned powers.
- Accumulate stacked context so autonomous AI can generate reactions using the character's earlier committed results and approved traits.

## Probability default confirmed on 2026-10-08

The equal default applies per wheel, including all earlier race and event designs. It confirms
eligible armor-piece weight 1, Dwarf/Gnome 50/50, and equal odds for current Element candidates.
Raksasa keeps eight named size milestones, each now 12.5%; the earlier log-Gaussian odds were
an assistant proposal and are retired. Ordinary Size retains its user-requested normal shape.
All explicit ratios and God normal Power 80/20 remain. Proposed option rosters/events remain
proposed, and frozen historical spins are unchanged.

- Abyssal: Raja four Demonic then followers; Iblis one Sin plus two Demonic; Fallen Angel one Demonic/one Divine; Setan four equal types and delegated fixed powers; Pendosa one Sin using the same mapping as Iblis.
- Follower nine values 0/10/100/1000/10k/100k/1M/10M/100M have confirmed weights 3:3:3:3:3:2:2:2:1, total 22. Raja 100/1000 +1 mastery, 10k/100k +2; 1M/10M +1 each stat, 100M +2 each. God also spins followers after two Divine and, as explicitly clarified, gets only the same high-count stat bonuses, no follower mastery.
- Seven shared sins and four Setan powers are authored within user-delegated scope. Powers use ordinary shared mastery and survive main None; no added acquisition wheel from a fixed grant.

- Hybrid has two sequential normal race roots; finish every immediate child/host/origin chain of root 1 before drawing root 2. Every actual family uses the same global no-repeat history, including Hybrid itself. The earlier stability/dominance and Legendary-exclusion recipe was an assistant proposal and is retired.
- User clarified Symbiote attaches to a drawn host race and Raksasa gives a drawn base race giant size; both require one additional race spin and normal event dispatch. Existing Symbiote Takeover thresholds and Raksasa Size remain; Archetype now skips under policy 1.0.0. Working order resolves host/base immediate events before return; Symbiote Takeover follows its host chain.
- Example Hybrid → Symbiote → Raksasa → Abyssal Axiom disables all four before root 2; 13 families remain if no additional exclusions/modifiers. Nested descendants do not create additional Hybrid root slots.

## Proposed defaults

| Decision | Current proposal | Reason |
| --- | --- | --- |
| Demonic pool | Reuse canonical Cursed twelve powers under Demonic display label | Working interpretation of universal devil-themed powers; pool can be refined together |
| Follower rewards | Only the selected count row applies, no earlier-threshold accumulation | Working interpretation; high-count rows grant listed stat bonus without lower-count mastery |
| Fight stat | Combat skill and technique | Keeps skill separate from strength and supernatural abilities |
| Shared Power Mastery late handling | Empty scheduled inventory skips mastery; the first late power invokes the first/only draw, later powers inherit it | Working timing realization of the user-confirmed single result |
| Immediate event order | Finish an event and its children before the next main stage | Makes the story and its return point clear |
| Later modifiers | Any result may influence a later relevant wheel | Supports combinations and late hidden events |
| Enchantment slots | One per weapon initially | Gives a simple starting rule for mastery unlocks |
| Late mastery upgrade | Open a previously unused eligible slot once | Supports title rewards without duplicate enchantments |
| Apex boost | One wheel with a stat target and boost amount in each outcome | Matches the requested additional spin |
| Stat scale | Explicit tier or numeric scale per stat; numeric bonuses and penalties across all five stats require values or defined mappings | Keeps numeric bonuses separate from ordinal tier changes |
| Conditional weakness | Show its activation condition separately from baseline stats | Avoids applying a situational penalty permanently |
| Bias limits | Combined factor between 0.25 and 4 | Illustrative safeguard pending balance review |
| Event limits | Four nesting levels and twenty-four extra spins | Illustrative starting limits for finite runs |
| Long episode | Shorten presentation while preserving required results and reactions | Keeps runtime management separate from mechanics |
| Main race grouping | Seventeen selection families, including Heavenly Principle, Hybrid, Anime, and Reinkarnasi Pahlawan Legendaris | Applies the grouping rule; exact membership and overlaps remain subject to refinement |
| Elf power balance | Define ranges, costs, resistance, duration, and mastery limits after the delegated power list | User-defined grants and themes are settled; detailed balance remains open |
| Stacked context structure | Versioned factual layers, component scope, and an active view as of each spin | Preserves earlier context while avoiding future-result leaks and conflicting active traits |
| Race no-repeat key | Every previously committed canonical selection family, shared by the character | The user forbids prior races; family is the actual main-wheel selection level and the all-history interpretation prevents cycles |
| Undead source component | Retain undead identity and attach selected origin with its scoped events | Applies confirmed inheritance without overwriting the original Lelembut identity |
| Vampire prey race | Canonical main wheel in reference role; no prey-family dispatch | Interprets feeding preference separately from personal race and effects |
| Vampire outcome bonuses | Only the selected count outcome applies; 1000 total +1 each, not +2 | Avoids unintended stacking of the 100 reward |
| Vampire count typo | Final ! means 1, total weight 18 | Matches the previously disclosed armor-count typo interpretation |
| Lich maximum Durability | Constrain the normal scheduled base-stat draw to the declared maximum, still spin/react at 100% | Fulfils the maximum reward while preserving immutable actual base results; final penalties and late acquisition remain open |
| Lich Power bonus | One normal Power-stage extra spin before all owned mastery, None follows approved pool | Reuses the existing stage-ticket contract |
| Local power scope | Self-size and own-organ control; Mukbang as consumption capacity | Proposed descriptions while targets/limits await balance |
| Babi Ngepet route | Siluman Babi gains one shared Nyolong grant per source component | Keeps accepted animal structure and shares definition with Tuyul |
| Mythical Beast selector | Lokal/Impor, then creature type and its approved events | Ten local type profiles are user-defined; origin/type base odds are equal; Imported Dragon now has its own form/Element event, while seven other Imported events and additional optional selectors remain open |
| Mythical Beast balance | Numeric/mastery scales, power limits, instrument/Size profiles and future odds | Local membership/grants are settled; detailed balance remains open |
| Grouped local references | Baru Klinting under optional Naga legacy; only Balinese forms under optional Bentuk Barong Bali | No active caller in current approved local events; Naga calls Element, Barong uses fixed grants |
| Kinnara guarantee realization | Constrain the instrument scheduled mastery pool to Master or higher, preserve eligible weights and spin once | Implements the user guarantee without rolling low and rerolling; Master index remains pending; base rank weights default to 1 |
| Singa mastery scope | +1 rank step on all owned powers | Working interpretation for an unspecific mastery bonus; amount/meaning is user-confirmed |
| Symbiote repeated power results | Separate invocations use the same canonical pool; do not infer unique-power sampling or reroll duplicates | Working sampling interpretation; final repeated-definition merging remains pending |
| Independent mastery bonuses | Add distinct scoped source modifiers to immutable base mastery, then cap | Working stacking interpretation; source keys prevent repeated bonuses on replay |
| Siluman transformation binding | One shared power bound to the actually rolled animals, granted on animal-selection completion | Implements the accepted roster and requested power; exact form limits, costs, and mastery remain balance work |
| Siluman animal count | Exactly twelve, user confirmed | Former one/two/three proposal retired; sampling from ten approved types remains unresolved |
| Siluman sampling | Pending; former without-replacement proposal retired | Exactly twelve components cannot be twelve unique types from the ten-type approved pool |
| Siluman composition | One body-form selector, then fusion stability when multiple animals were rolled | Creates a coherent body and bounded synergy/limitation profiles |
| Old named-MC selector | Goku, Rimuru, Kaneki, Inuyasha, Ichigo, Naruto, Luffy | Archived inactive after user replaced it with Anime Genre → Role events |
| Hybrid body profile | Two confirmed race roots plus their actual nested host/origin trees, rendered as one coherent body | Exact anatomy/source reference remains pending; earlier stability/dominance draws and Legendary exclusion are archived |
| God Concept starter | Twelve proposed familiar concepts in one canonical selector | User confirmed the selector/caller roles; exact roster/count remain proposed; base weights equal |
| Legendary identity | Resolve reference origin, character and signature package; accepted policy 1.0.0 skips Archetype | Keeps the complete source-owned package and normal later sequence |
| Legendary character catalogs | Current curated 30 Local/80 Imported, exactly 10 Japanese; origin 65:35 | All Imported have four-point boost packages; chosen ten, eight replacements and exact packages are editable curation |
| Transformation artifacts | Record morpher/driver separately with activation conditions | Preserves identity requirements while keeping weapon mastery and enchantment rules coherent |
| Reference powers | Use references to propose compatible odds and unlocks; all stat and mastery outcomes still resolve | Prevents a familiar reference from silently fixing every later result |
| Fixed identity | Reveal a sole eligible known identity directly, except explicitly scheduled spins such as the final Dwarf armor draw and proposed Lich maximum Durability draw | Dwarf must perform exactly the awarded count of spins even when the last piece is guaranteed |
| Size phase placement | After Backstory/events and before Strength | Makes the newly requested pre-stat stage explicit |
| Ordinary Size spacing | Twelve equal points across 0.5–2×; increment 1.5/11 | A literal 0.5 increment would provide only four points |
| Ordinary Size tuning | Gaussian-derived point weights, center 1×, sigma 0.5× | Implements requested broad normal shape; numerical width remains adjustable |
| Celestial size references | Earth equatorial diameter for Planet; approximate Sun diameter for Sun Size | Versioned NASA dimensions provide consistent linear units |
| Cosmic threshold | Strictly above Earth diameter; one size reward per character | Follows beyond planet and prevents repeated checks from duplicating grants |
| Source-derived size centers | Use stated means or labeled midpoint/rounded anchors when only ranges are available | Avoids treating a chosen game reference as an exact published average |
| Former repeated Archetype | Retired by accepted policy 1.0.0; preserve both draws only in previously committed old-policy journals | New runs have zero or one Archetype draw |
| Element starter | Api/Air/Tanah/Angin with equal base weights | Familiar proposed roster; exact complete roster remains open, while equal odds follow the user default |
| King mastery +2 | Add two ordered rank steps after base mastery, capped at maximum | User confirmed amount/all-owned scope; rank scale and numerical interpretation remain design details |
| Shared Fire power | One definition for Summer Fey Elf, Pixie/Api, and Banaspati, with caller-specific context | Prevents duplicate power content or inferred Summer identity |
| General army weights | Reuse Goblin's count pool and ratio | User requested an army-count spin without a separate General ratio |
| Army control | Bos and General command the rolled count; Kacung controls 0 | Keeps unit size distinct from command and personal stats |
| Bonus stage scheduling | Main acquisition/details, then extra acquisitions/details, then owned mastery/enchantment | Preserves the main sequence and records all extra grants before their mastery gate |
| Warrior bonus None | Exclude no-weapon outcomes before drawing | The user explicitly requests an extra weapon |
| Shaman bonus None | Follow the approved main Power pool rules | User requested an extra spin, without guaranteeing a power regardless of outcome |
| Funny-result classification | Explicit mechanics catalog tag, never narrator judgment | Makes the confirmed recurring Shrek reward reproducible |
| Shrek weapon placement | Draft 12-item funny variant for its main Weapon spin | Provides known examples without adding an unrequested race spin; pool and placement remain adjustable |
| Troll extra mappings | Ten original condition-to-stat mappings with -1 points | User delegated the remaining choices; these are game rules |

## Detail to define later

1. Stat tier labels, their meaning, and any numerical mappings.
2. Mastery ranks and the exact rank that represents master.
3. Refine multiple-weapon mastery rules. Power Mastery is settled as one shared draw with ordinary common rank, plus the explicit God Concept Authority maximum exception.
4. Which races, archetypes, and backstories exist, and their exact event wheels.
5. Conditional modifier strengths, forbidden combinations and rare unlocks; unspecified base weights are already settled as equal.
6. Apex types, boost packages, title conditions, and transformations.
7. Episode length, narrator voice performance, and meme library. Funny casual Gen Z Indonesian tone is now confirmed.
8. Animal-count roster, anatomy compatibility, fusion limits, and legacy crossover eligibility.
9. Exact mythology/tradition and franchise versions, form pools, and transformation-device requirements.
10. Hybrid composite body references, component compatibility, and divine event pools; no Hybrid dominance wheel.
11. Balance Elf power limits, future odds effects, numeric Strength scale, Trishula enchantability, and repeated power definitions. Sea form odds are already fixed at 60/40.
12. Numeric armor-bonus stat scales, equipment compatibility, later odds effects, and technology weapon profiles/enchantability.

13. Army combat profiles, Katana/funny weapon enchantability, Shrek variant placement and other funny-result tags, all five numeric scales/bounds, and future odds effects.

14. Confirm proposed ordinary Size Gaussian parameters and source-based profile defaults; finish all remaining form/creature references, composite anatomy, archetype overlap, size influence/compatibility, and Cosmic mastery limits.

15. Universal Element roster; Wish and Healing limits; Fairy body-form and Size references; mastery rank scale/cap and detailed power-control effects. King +2 scope on all owned powers is already confirmed.

16. Complete inherited origin component/body compatibility and all family profiles. Skeleton/Zombie inheritance and prior-race exclusion are confirmed. Lelembut Size references, later odds, detailed power targets/limits, duplicate definition handling, wealth/consumption/protection rules remain open. Lich maximum base vs final guarantee under penalties and late acquisition require refinement.

The revised twenty-item Gnome pool is active. Retired candidates are retained only as design history;
official references support broad Gnome themes, while names and combat functions are game adaptations.

## Source authority

The supplied video is a visual reference. Its captions, names, extra categories, or implied rules
do not replace the user's requested mechanics. The reference has been inspected through sampled
frames; audio and every spin have not been reconstructed.


## Anime working interpretations and remaining balance

Tech/Cyborg repeated calls use replacement, with duplicate definitions retained as distinct weapon instances; uniqueness was not specified. Mecha is stored as one rideable vehicle with no invented Pilot Mastery; controls/crew/mounted weapon profiles remain pending. Each Isekai outcome owns one authored Cheat power inspired by an actual anime reference; physical forms and title levels are not implicit numerical stats. Fantasy extra spin follows the normal Power pool including None. Technician +1 is one ordered rank step only on its actual child-granted Tech Weapon, explicitly clarified by the user. Girlfriend weapon behavior and Enchant compatibility remain pending. Catalogs are delegated editable content, not fixed canon feats. [Event Anime](ANIME-EVENTS.md) is the current readable authority.

## Pilot mecha roster revision

The user requested a broader mix of franchises. The current editable roster uses twenty units from twenty franchise groups, replacing eight variants from groups that were already represented. One representative per group is a curation choice for this revision. Each unit keeps equal base weight 1 (5%). Pilot still makes one direct Mecha spin; franchise and display type are context metadata. Old variant IDs and source evidence remain inactive history. The revised list and source links are in [Tech Weapon dan Mecha](SCIFI-TECH-MECHA.md).

## Legendary Hero selection confirmed

At this earlier step, the user confirmed fixed 50:50 Lokal/Impor followed directly by selecting the character; roster, packages and budget were still proposals. The later catalog revision below records their updated acceptance and authored expansion. Prior category/training/source/theme/color/series selectors are inactive proposals. The normal main stages, shared race history and saved nested returns remain.

## Legendary Hero catalog revision: accepted packages and expanded Local pool (history)

This historical revision is superseded by the 65:35 and Fate revisions below. Its thirty Local profiles remain active.

The then-current user instruction accepts the preceding bonus-package proposal, requests one representative
per imported franchise and a much larger Local pool. This supersedes the preceding catalog/package
pending status. Origin remains fixed 50:50, followed directly by one named character.

Current authored curation: thirty Local (ten retained plus twenty new) and five Imported. Broad imported
groups disclosed to the user are Star Wars/DC/Marvel/Power Rangers/Kamen Rider. Luke, Superman,
Spider-Man, Tommy Oliver and Black RX retain their preceding accepted packages; five same-franchise
alternatives are inactive history. Counts and representatives are editable. Each new Local profile is
authored within the requested expansion using the accepted package framework, not individually dictated
or separately confirmed by the user.

Each package costs four comparison points: numeric stat +1 costs one, and one signature power/weapon or
mastery +1 costs two. This method compares starting packages; combat balance still needs effect limits
and scales. Arjuna mastery +1 is bound to its single granted Pasopati kit. Si Pahit Lidah mastery +1
affects one shared current/future Power Mastery. Existing God Authority, Kinnara and Technician rules
remain. Retain normal main acquisition, inventory after None, immutable base/source dedup and saved
nested returns. Shared definition imports create no wheel spin or new source-family dispatch.

That earlier thirty-five-profile revision is preserved in history. See [Legendary Hero events](LEGENDARY-HERO-EVENTS.md) for the current profiles, source-linked motifs,
base odds, reference variants and remaining balance work. No generator was implemented in this revision.

## Legendary Hero origin 65 35 and Imported expansion (history)

This historical modern-Imported roster and franchise policy are superseded by the Fate direction below. The 65:35 origin remains active.

The user explicitly changes Local/Imported origin to **65:35**, replacing 50:50, and requests more
Imported heroes. Origin is fixed at weights 13:7. Direct character selection and one representative
per Imported franchise remain. This supersedes the earlier ratio/counts recorded above.

Current authored curation retains thirty Local and the previous five Imported, then adds fifteen
Imported profiles across fifteen new franchises: fifty characters total, twenty Imported franchise
groups. Every character still has base weight 1 within its branch. Conditional on Legendary Hero,
each Local base probability is 13/600 and each Imported is 7/400. Exact representatives/counts and
fixed-form starting choices are authored within the requested expansion, rather than individually
dictated by the user. All packages use the accepted four-point comparison method.

Ben Power Trip receives a source-bound Four Arms transformation and Optimus G1 a Truck transformation,
using one canonical definition with separate grant bindings. Aang receives fixed Wind Manipulation;
Ultraman receives the beam package without extra host/giant race invocation. New grants retain the
existing inventory, single shared Power Mastery, per-weapon mastery/Enchant, source dedup, contextual
reaction and saved-return contracts. Detailed power/form/weapon limits and body/Size remain pending.
See [Legendary Hero events](LEGENDARY-HERO-EVENTS.md) for the complete current catalog.

## Legendary Hero Imported historical and traditional Fate references history

The user requests more real/historical and traditional figures appearing in Fate, explicitly naming
Arthur Pendragon, Sasaki Kojiro and Rasputin. This supersedes the modern fictional Imported roster and
its one-representative-per-franchise constraint for the current catalog. Fixed Local 65% / Imported
35% (13:7), direct-character flow and accepted four-point package method remain.

Current authored curation keeps all thirty Local profiles unchanged and replaces the active Imported
pool with eighty unique reference identities. Count eighty, individual additional names/versions and
bonus packages are authored editable design, not individually user-dictated. Alias/age/class/Alter/Summer
variants do not add duplicate outcomes. Locally established Arjuna/Karna/Rama are not repeated in Imported.
Each candidate has a unique FGO collectionNo/ID verified in the Atlas Academy JP English basic-data
export, with official franchise references where read. Atlas is a community game-data mirror, not a
historical biography authority. Reference categories distinguish history, uncertain tradition, legend
and myth from fictional Fate adaptation/vessel and our game abilities. Arthur is legendary; Kojiro
tradition is uncertain. Rasputin/Kirei and alternate-world Musashi/Altera interpretations remain explicit.

Each Imported candidate has equal within-branch probability 1/80 = 1.25%, or 7/1600 = 0.4375% conditional
on Legendary Hero being selected. Local remains 1/30 within branch and 13/600 conditional. Never flatten
all 110 characters. Thirty Local scopes, source dedup, mastery/inventory/Enchant, global history/main
stages and saved return remain. Fame, FGO rarity, class and supernatural motifs add no automatic event
or full canon kit. Limits and body/Size remain pending. Twenty modern Imported profiles, unused
definitions and prior franchise policy are recoverable inactive history. No generator implemented.
See [Legendary Hero events](LEGENDARY-HERO-EVENTS.md) for the current source-linked catalog and contexts.

## Reinkarnasi Pahlawan Legendaris Imported boosts and ten Japanese current

The user requests boosts for Imported heroes like Local, reduces Japanese candidates to ten and asks
for additions from other stories. Keep Local 65% / Imported 35% and direct hero draw. Current curation
retains thirty Local unchanged and eighty Imported: ten Japanese and seventy others. Exact chosen ten
and per-hero packages are authored within the request, not individually dictated.

Keep Kojiro, Musashi, Nobunaga, Okita, Ushiwakamaru, Raikou, Tomoe, Shingen, Kenshin and Kotaro. Retire
Saito, Hijikata, Ryoma, Izo, Yagyu, Amakusa, Rikyu and Inshun. Replace them with Cu Chulainn, Scathach,
Siegfried, Beowulf, Ozymandias, Arash, Xuanzang Sanzang and Geronimo across Celtic, Nibelungenlied,
Beowulf, Egyptian, Persian, Journey to the West and Apache references. No story/region wheel added.

Every Imported has one four-point package. Kojiro/Musashi/Lancelot/William Tell/Cu/Arash get signature
weapon plus +1 mastery only on that exact grant instance/kit. Merlin/Paracelsus/Sanzang get their
declared power plus +1 one shared current/future mastery. Other packages mix powers/weapons and numeric
stats. Six preceding package versions are archived, not stacked with current packages. Existing
committed spin journals keep their original rewards. Source dedup, immutable bases/caps, compatible
effective Master+ Enchant, single Power Mastery/no Power Enchant and God Authority source override remain.
Forty-seven weapon definitions, nine Legendary power definitions and twelve shared imports are active;
seven weapon modifiers and four power modifiers are source-scoped. Detailed action/body/Size limits
remain pending. See [Reinkarnasi Pahlawan Legendaris events](LEGENDARY-HERO-EVENTS.md) for all eighty Imported boosts.

## Reinkarnasi Pahlawan Legendaris name and next race work

The user renames the display label from Legendary Hero to **Reinkarnasi Pahlawan Legendaris**.
Canonical family ID legendary-warrior and content paths stay stable. This is a display/narrative
theme change; Local 65%/Imported 35%, thirty Local/eighty Imported with ten Japanese, packages,
source-scoped mastery, inventory and normal main stages remain. No past-life event or automatic
Backstory/canon loadout is introduced. Historical labels and journals remain recoverable.

The current main roster has seventeen families and this is its final entry. The user chooses to
complete pending **Mythical Beast Imported** events next, beginning with Dragon. The eight proposed
types are Dragon/Phoenix/Griffin/Unicorn/Pegasus/Hydra/Cerberus/Chimera. Their event rules remain
pending user input; this choice does not approve old speculative subtype events or add a main race.

## Dragon body forms and Element event

The user requests about eight to ten Dragon types focused on body shape, allows fewer, and
sets exactly +2 total numeric stat points distributed according to lore, followed by one
Element wheel and its selected control power. Current delegated curation has eight: Western,
Wyvern, Drake, Wyrm, Lindwyrm, Amphiptere, Eastern Dragon / Long and Sea Serpent. Each weighs
one, 12.5% before approved modifiers. The chosen silhouettes and stat allocations are
authored game adaptations, not a universal mythology taxonomy.

| Western Dragon | 4 kaki, 2 sayap; tubuh reptil kekar. | Strength +1, Durability +1 |
| Wyvern | 2 kaki, 2 sayap; sayap menjadi anggota depan. | Speed +1, Fight +1 |
| Drake | 4 kaki, tanpa sayap; versi darat untuk roda ini. | Strength +1, Fight +1 |
| Wyrm | Tubuh ular, tanpa kaki dan sayap. | Durability +2 |
| Lindwyrm | Tubuh ular, 2 lengan depan, tanpa sayap; varian pilihan. | Strength +1, Speed +1 |
| Amphiptere | Tubuh ular, 2 sayap, tanpa kaki. | Speed +2 |
| Eastern Dragon / Long | Tubuh panjang berkelok, 4 kaki, tanpa sayap; varian Long pilihan. | Intelligence +2 |
| Sea Serpent | Tubuh ular laut, tanpa kaki dan sayap; sirip sebagai ciri visual pilihan. | Speed +1, Durability +1 |

Commit/react to Dragon, then form and its two-point modifier ledger, then the one canonical
Element result/grant/reaction, restoring exact saved caller. Body form fixes no element or
Element odds; Dragon grants no other power, weapon, mastery modifier or extra Size. Existing
early inventory after None, single shared mastery, source dedup, main flow, history and
nested caller contracts remain. Old Western/Eastern affinity draft is inactive history.
Ten Local Mythical Beast profiles remain unchanged; the other seven Imported events are pending.
See [Dragon events](DRAGON-EVENTS.md).

## Phoenix fixed powers

The user assigns Phoenix **Resurrection** and **Flame Control**. Apply both as fixed early
powers at the actual Imported Phoenix type result. Reuse canonical resurrection and
fire-manipulation; Flame Control is a display alias, not a duplicate definition. These
imports invoke no Holy/Divine/Element selector. Retain both after main None and use the
single shared Power Mastery. No stat/mastery bonus or additional wheel is specified.

Record actual Phoenix provenance and both grants before its reaction, then restore its
saved caller. Replay and asset retries add no duplicate grant. Resurrection trigger, targets
including possible self revival, charges/cooldown/cost and body Size reference remain balance
work. Ownership is not an actual death/revival event. Dragon/ten Local events remain; six
other Imported events are pending. See [Mythical Beast events](MYTHICAL-BEAST-EVENTS.md).

## Mythical Beast remaining packages and point budget

User sets Griffin to Flight and Strength +1, values one power as two stat points, treats
four-point packages as stronger, and delegates remaining Mythical Beast entries around
three points allocated only to powers or stats. Current curation uses exactly three points:

| Beast | Power | Numeric bonuses | Design points |
| --- | --- | --- | --- |
| Griffin | Flight | Strength +1 | 3 |
| Unicorn | Healing Power (Pemulihan) | Intelligence +1 | 3 |
| Pegasus | Flight | Speed +1 | 3 |
| Hydra | Regeneration (Tumbuh Lagi) | Durability +1 | 3 |
| Cerberus | — | Strength +1, Durability +1, Fight +1 | 3 |
| Chimera | Flame Control (Kendali Api) | Fight +1 | 3 |

Griffin is explicit; five latter packages and bounded Hydra own-body/head regrowth wording
are authored within delegated scope. Existing Local/Dragon/Phoenix packages and equal type
weights stay unchanged. Budget executes no effect and assigns no rarity or character cap.
A power priced at two is not a two-stat-point grant. Existing weapon/mastery/guarantee
costs are unspecified and not auto-rebalanced. No new wheel, weapon or mastery modifier is
added by these packages. Existing source/replay/None/mastery/history/Size/nested-return rules
apply. All eight Imported event routes are now filled; detailed balance remains pending.
See [Mythical Beast events](MYTHICAL-BEAST-EVENTS.md).

## Pemeriksaan ulang referensi Archetype

Pengguna meminta cek ulang karena memperkirakan sekitar tiga puluh pilihan. Audit
visual lokal menemukan tiga putaran Archetype dengan roster 17 label yang sama.
Putaran ketiga sekitar 43–46 detik berakhir Slayer. Tidak ada label tambahan yang
terlihat; count tetap 17 untuk MP4 ini. Ini catatan bukti, bukan persetujuan event,
perubahan probabilitas atau klaim katalog seluruh episode. Detail ada di
[manifest Archetype](../reference/archetype-video-reference.json).

## Referensi Archetype video kedua

Video kedua memiliki 34 nama Archetype teridentifikasi: 33 terbaca pada audit
visual dan satu sektor putih di antara Trickster/NPC dikonfirmasi sebagai Hybrid
oleh pengguna pada 9 Oktober 2026. Ini memperluas evidence di luar
17 label video pertama; audit video pertama tetap berlaku untuk file asalnya.
Kedua source roster dan seluruh kandidat lama disimpan. Inventori gabungan 39
label menunggu konsolidasi, termasuk Primordial Champ/Primordial Champion yang
kemungkinan alias. Hybrid memakai record yang sudah ada dari video pertama,
sehingga inventori tetap 39 dan tidak mendapat bobot duplikat. Konfirmasi nama
tidak menetapkan event Hybrid Archetype atau event Race Hybrid; jumlah ini belum
menentukan wheel final. Gambler → Gambler Archetype → The Lucky Fool adalah pengamatan
video, bukan aturan bonus/event yang otomatis diadopsi. Tidak mengubah ras, stat,
mastery, main flow atau peluang. Lihat [manifest kedua](../reference/archetype-video2-reference.json)
dan [roster Archetype](ARCHETYPE-WHEEL.md).


## Audit kelayakan Archetype — 9 Oktober 2026

Pengguna meminta Archetype menjadi boost untuk ras/subrace yang belum punya
upper hand serta menghindari role yang tidak cocok dengan tubuh.
[Audit seluruh 18 keluarga dan katalog turunan](ARCHETYPE-ELIGIBILITY.md)
menyimpan klasifikasi dan ambang yang disetujui pengguna pada policy 1.0.0.
Fungsi gate diimplementasikan; Raksasa skip tanpa ticket kedua. Kebijakan tidak
mengubah roster, peluang, reward ras, mastery atau event dari dua video.


## Fungsi skip Archetype disetujui

Pada 9 Oktober 2026 pengguna menyetujui pembagian skip dan meminta fungsi untuk
engine mendatang. Policy 1.0.0 mencakup ambang audit sebelumnya dan mengubah
Raksasa dari dua slot menjadi nol spin Archetype. Evaluasi membaca seluruh Race
tree yang sudah selesai; kandidat difilter berdasarkan profil tubuh dan role.
Profil atau facts wajib yang belum tersedia menghentikan eksekusi, bukan ditebak.
Keputusan/pool disimpan untuk resume. Tidak ada RNG, grant/stat mutation atau
hook Shrek pada skip. [API dan contoh](ARCHETYPE-GATE-FUNCTION.md).

## Event NPC disetujui

Pengguna menetapkan “npc skip”. NPC menjadi Archetype tanpa event lanjutan atau
bonus. Hasil spin NPC dan reaksi normal tetap dicatat; nol child spin, lalu
Backstory. Inventory dan modifier yang sudah dimiliki tetap berlaku. Profil
`npc-no-event` disimpan dalam desain Archetype. Pembahasan berikutnya: Slayer.

## Event Slayer

Pengguna menetapkan ras korban sampai subtype, tanpa weapon/power/boost korban,
lalu sepuluh pilihan jumlah dengan rentang dan peluang yang diestimasi per
identitas. Goblin dapat memakai 0–10.000, God hitungan satuan. Pengguna juga
menetapkan bonus +1 sampai +3 poin Strength berdasarkan jumlah korban.

Interpretasi yang diungkapkan: nol tanpa bonus; sembilan hasil positif dibagi
tiga posisi per bonus +1/+2/+3. Profil dan assignment subtype adalah estimasi
game balance dalam delegasi pengguna. History korban terpisah; seluruh selector
hanya identitas dan tidak dispatch reward/event ras. [Aturan serta peluang](SLAYER-EVENTS.md).
NPC dan Slayer selesai untuk event; pertanyaan berikutnya adalah Disciple.

## Revisi peluang Slayer

Pengguna meminta peluang Slayer tidak kurang dari 5%. Setiap pilihan pada
delapan profil roda jumlah korban kini minimal 5%, dengan total 100% per
profil. Rentang, assignment identitas dan bonus Strength tidak berubah.
Distribusi baru adalah curation balance dalam delegasi yang sama, dengan floor
eksplisit pengguna. Selector identitas tetap memakai roda kanonis. Policy baru
`slayer/1.1.0`; hasil/snapshot lama tidak ditulis ulang.

## Event Disciple disetujui

Pengguna menetapkan mentor dari database karakter sebelumnya, kemudian kategori
Weapon / Power / Best Stat. Peluang yang tidak disebut memakai default sama
rata. Jika kategori punya beberapa weapon/power atau stat terbaik seri, pilih
satu acak. Best Stat memberi +1 poin angka pada stat karakter baru itu.

Klarifikasi pengguna: kategori kosong **zonk, tanpa bonus**; weapon/power memakai
**mastery karakter baru**. Tidak reroll kategori atau menyalin mastery/enchant
mentor. Grant baru mempertahankan batas bawaan item/power dan inventory mentor
tetap. Pengambilan kandidat internal dicatat, tanpa wheel tambahan.

Database diproyeksikan ke snapshot karakter sebelumnya yang sudah selesai.
Metadata Best Stat memerlukan profil pembanding yang sebanding; stat mentah
yang berbeda unit tidak dibandingkan langsung. Adapter database, profil
pembanding dan bootstrap jika database kosong masih konfigurasi terbuka.
[Aturan dan API](DISCIPLE-EVENTS.md). NPC, Slayer dan Disciple selesai untuk
event; berikutnya **Survivalist**.

## Event Survivalist disetujui

Pengguna menetapkan Environment berbahaya, lalu Survival Chance 0–100% dalam
langkah 12,5 poin persentase: sembilan pilihan. Hasil ≤37,5% memberi buff
terkait environment senilai +1 stat; >37,5% hingga 75% power saja; lebih dari
75% mendapat power dan buff stat yang sama. Bahaya environment boleh berbeda
jauh. Kedua roda memakai default sama rata karena distribusi khusus tidak
disebutkan.

0% termasuk band pertama dan tetap buff +1. Tidak ada spin hidup/mati
tambahan atau kematian otomatis. Buff adalah +1 poin angka pada satu dari
lima main stat, berdasarkan resep environment; bukan +1 semua stat.

Lima tema environment berasal dari contoh pengguna. Dua belas pilihan,
pairing stat/power dan wording adalah draft editable yang dibuat untuk
melengkapi event, bukan roster final yang dikonfirmasi pengguna. Tujuh power
memakai definisi kanonis yang ada; lima baru disimpan satu kali di desain
Survivalist. Grant langsung memakai satu shared Power Mastery dan bertahan
setelah main Power None, tanpa menjalankan event sumber power lain.
[Aturan, roster draft dan API](SURVIVALIST-EVENTS.md). Core event Survivalist
selesai; berikutnya **Archaeologist**.

## Archaeologist — 9 Oktober 2026

Pengguna menentukan Bone Discovered dari sekitar 32 hewan lintas zaman,
diurutkan berdasarkan jarak dari masa kini dan commonness. Temuan masa kini
nol bonus; hewan lebih tua/kuat mendapat paket senilai 1–3 poin berupa stat,
power atau kombinasi. Patokan terdahulu power=2/stat point=1 dipakai untuk
menghitung paket, tanpa menambahkan budget sebagai bonus kedua.

32 opsi dan paket spesifik adalah kurasi editable, bukan persetujuan final
pengguna atas tiap entri. Semua peluang sama rata 3,125%; urutan bukan rarity.
Paramecium sementara ditafsirkan Paraceratherium berdasarkan konteks,
sambil menunggu jawaban; tidak disebut sudah dikonfirmasi. Sumber museum
mendukung konteks fauna/zaman, bukan bonus game. Temuan adalah reference,
power biasa memakai mastery bersama dan bertahan setelah None; tidak
menjadi Race/pet/body/Size/weapon atau membuka event tematik lain. Snapshot
dan source ledger menjaga replay paket sekali. [Aturan dan roster](ARCHAEOLOGIST-EVENTS.md).
Core event tercatat; role berikutnya **Tamer**.

## Paraceratherium dikonfirmasi dan Tamer — 9 Oktober 2026

Pengguna mengonfirmasi Paraceratherium sebagai hewan Archaeologist yang
dimaksud. Nama bukan lagi asumsi; paket tiga poin draft tetap sama.

Tamer berisi sekitar 64 hewan dari biasa, hewan keren seperti Megalodon dan
Paus Biru, hingga mythical. Jumlah hewan biasa jauh lebih banyak. Klarifikasi
pengguna: hasil langsung memberi satu companion, tanpa chance menjinakkan.
Draft 48 masa kini/8 purba/8 mythical pada satu roda rata menghasilkan
75/12,5/12,5% dari jumlah opsi saja. Komposisi/nama spesifik editable.
Companion memiliki ownership/provenance terpisah; profil aksi/combat/size/
habitat perlu konfigurasi. Tidak menyalin owner Race/finding rewards atau
membuat bonus pemilik/mastery/event baru dari label hewan. [Tamer](TAMER-EVENTS.md).
Berikutnya **Alchemist**.

## Komposisi Tamer 32 16 8 8 — 9 Oktober 2026

Pengguna mengganti jumlah menjadi 32 hewan masa kini, 16 masa lalu, delapan
mythical dan delapan Pop Culture, termasuk Kyubi. Total tetap 64; sama rata
1,5625% tiap hasil menghasilkan 50/25/12,5/12,5% per kelompok tanpa selector
kategori. Nama spesifik tetap editable; Kyubi dinormalisasi menjadi satu
Kurama Naruto, bukan pilihan alias ganda. Satu companion langsung tetap.

Revisi tamer/1.1.0 berlaku untuk draw baru. Roster 1.0.0 inactive disimpan
untuk riwayat; committed snapshot/result lama tetap memakai identitas semula.
Kapabilitas named companion tidak membuka event evolusi/franchise atau
mengubah owner Race/stat/mastery. [Roster terbaru](TAMER-EVENTS.md).

## Taming Power dan Alchemist Jamu — 9 Oktober 2026

Pengguna menambahkan Taming Power untuk Tamer. Grant biasa milik owner
memakai shared Power Mastery dan bertahan setelah None. Baru di rule 1.2.0,
power serta companion merupakan paket atomik satu sumber; snapshot
1.0.0/1.1.0 tetap companion-only saat replay. Roster/odds tetap 32/16/8/8.

Alchemist: beberapa ramuan, debuff −1/netral/buff +1/buff +2 pada rasio
4:4:4:4. Pengguna meminta nama jamu/lucu dan mendelegasikan pembagian stat.
Draft empat resep per kelompok (16 total, 6,25% tiap hasil) disimpan, termasuk
Air Putih/Kopi Tubruk/Teh Tawar/Es Sirup netral. Kuantitas belum dikonfirmasi;
pertanyaan async meminta count wheel, fixed count atau satu hasil. Full
event tidak aktif sebelum quantity dijawab. [Draft Alchemist](ALCHEMIST-EVENTS.md).

## Nama Jamu Alchemist — 9 Oktober 2026

Pengguna mengganti nama buff rekaan dengan nama jamu asli, seperti Temulawak.
Debuff memakai empat label jamu palsu rekaan sebagai satire klaim berlebihan,
bukan merek nyata. Draft alchemist/0.1.1 mempertahankan seluruh paket stat,
16 hasil, rasio 4:4:4:4 dan peluang 6,25% tiap resep. Sumber mendukung nama
saja; bonus/debuff adalah aturan game. Jumlah konsumsi masih pending, tanpa
perubahan approval/full-event activation. [Roster revisi](ALCHEMIST-EVENTS.md).

## Satire Alchemist dari Kasus Nyata — 9 Oktober 2026

Pengguna meminta nama produk jamu nyata dari berita/temuan bermasalah,
serta satu opsi alkohol lokal misuse. Ini menggantikan empat nama satire
rekaan sebelumnya. Draft 0.1.2 memakai Urat Madu Black, Pemersatu Bangsa
dan Tawon Liar dari temuan BPOM Banjarmasin 27 Februari 2024; dasar yang
terverifikasi adalah temuan BKO/produk ilegal pada kasus tersebut. Ciu
Oplosan menjadi opsi keempat, bersumber laporan Polsek Danurejan 31 Juli
2025. Nama/paket stat tetap editable. Semua modifier -1, 16 hasil dan
4:4:4:4 dipertahankan. Sumber tidak memberi angka efek medis atau status
semua produk masa kini yang bernama serupa. Quantity tetap pending.
[Draft revisi](ALCHEMIST-EVENTS.md).


## Alchemist 20 Slot dan Tier Power — 9 Oktober 2026

Pengguna menambah dua debuff dan dua superpower elixir. Arah legenda klasik:
El Dorado Gold Touch; Philosopher Stone Creation atau Molecular Manipulation.
Draft memilih satu Molecular Manipulation, tanpa Frieren/Sabatiel mechanics.
Montalin/Kuda Mesir bersumber pada temuan BPOM yang sama. Dua puluh opsi
working equal 5%, kelompok 6:4:4:4:2; rasio baru tidak disebut eksplisit.
Jumlah konsumsi masih pending. Roster 16 tersimpan inactive untuk riwayat.

Pengguna meminta power tier 1–5, membedakan Water Breathing dan Creation.
Seluruh 242 definisi diberi rating authored/editable berdasarkan scope.
Tier bukan mastery/stat/rarity/budget, tidak mengubah reward lama.
[Tier lengkap](POWER-TIERS.md).

## Alchemist Satu Ramuan — 9 Oktober 2026

Pengguna mengonfirmasi "only 1 potion. go to next archtype". Ini menggantikan
ketidakpastian jumlah pada catatan sebelumnya: tepat satu spin Minum Apa?,
satu ramuan diminum, efek/reaksi, lalu Backstory. Tidak ada count/category
wheel atau ramuan kedua; hasil netral tidak diulang. Dua puluh resep,
working equal odds dan tier power tetap sama. Core event Alchemist selesai
dibahas; berikutnya Rider dari urutan video kedua. Helper runtime belum
dibuat.

## Rider Kategori dan Tunggangan — 9 Oktober 2026

Pengguna menetapkan spin kategori lalu apa yang dinaiki: hewan, transportasi,
mecha/raksasa, atau tunggangan tak biasa. Setiap kategori tepat 12 pilihan,
empat lemah/empat sedang/empat kuat. Empat kategori dan 48 nama kini draft
authored yang dapat diedit. Equal default memberi 25% lalu 1/12; band bukan
spin tambahan. Hasil satu tunggangan terpisah, tanpa bonus stat/mastery atau
power/weapon karakter yang belum diminta. Kendali, loadout, crew, ukuran
dan kecocokan tubuh memerlukan profil; tidak mengimpor event/bonus dari
referensi Machine/Anime/Tamer/Mythical Beast. Core Rider selesai dibahas;
berikutnya Priest pada urutan video kedua. Helper runtime belum dibuat.

## Rider Buff dan Strong Mount Weapon — 9 Oktober 2026

Pengguna menetapkan lemah +1 buff, sedang +2 buff, kuat menjadi weapon dan
+1 buff; jawaban klarifikasi mengonfirmasi poin main stat sesuai tunggangan.
Ini supersedes mount-only reward sebelumnya untuk hasil baru. Total paket
+1/+2/+1; exact stat keys atau pembagian +1/+1 authored editable. Hasil kuat
memiliki satu weapon instance yang terhubung pada mount yang sama, dimiliki
sejak event dan tetap ada setelah main Weapon None. Gunakan satu mastery
normal per weapon dan Enchant kompatibel saat effective Master atau lebih,
tanpa bonus rank atau selector acquisition tambahan. Commit mount/buff/weapon
sekali per sumber; preserve base stats immutable dan jurnal 0.1.0. Roster
48, band 4/4/4, peluang dan dua spin event tetap. Helper runtime belum dibuat.

## Priest Divine Power — 9 Oktober 2026

Pengguna menyebut satu Angelic Power seperti Orang Saleh, lalu mengklarifikasi
"Satu spin Divine Power (15 pilihan)". Priest memakai power-divine universal
tepat satu kali dan mendapat hanya power hasilnya. Ini tidak mengubah Orang
Saleh yang tetap Komunikasi dengan Tuhan. Peluang dasar 1/15 per hasil;
kepemilikan bertahan setelah main None, mastery bersama normal, tanpa
stat/mastery bonus atau God Authority maksimum. Freeze referensi/tier dan
source ledger; replay tidak menggandakan grant. Core Priest selesai;
berikutnya Gambler dari video kedua. Helper runtime belum dibuat.

## Gambler Pengubah Roll Stat — 9 Oktober 2026

Empat tipe langsung dari pengguna: All In, Double or Nothing, High Roller,
Lucky 7; equal default 25% tiap tipe. All In satu raw roll untuk kelima stat,
working first Strength/raw-copy dengan bonus per-stat tetap independen.
Double/Nothing 1:1 setelah tiap raw stat; klarifikasi pengguna raw 4 dan bonus
+1 menghasilkan 9 pada Double atau 1 pada Nothing. High Roller dua angka
eligible terendah/tertinggi; nilai/skala numerik belum ditentukan. Lucky 7
setiap actual raw 7 menyumbang +1 tiap stat, settlement sekali setelah semua
stat selesai. Lima hit berarti +5 masing-masing stat; copied/final/child/late
results dan replay tidak menambah hit. Simpan raw immutable dan derived base
terpisah; final modifier/bounds tetap deklaratif. Roster video Lucky Fool
tidak otomatis diadopsi. Core Gambler selesai; berikutnya Goliath. Runtime
helper dan final numeric scale/constraint profiles belum dibuat.

## 2026-10-09 — Lucky Number menggantikan Lucky 7

Pengguna mengganti tipe Lucky 7 menjadi Lucky Number, memilih angka 0–9,
dan memperluas kecocokan ke semua spin stat termasuk Weapon Mastery dan
Power Mastery. Default sepuluh angka sama rata (10% masing-masing). Setiap
hit memberi +1 pada kelima stat, dikumpulkan sampai akhir karakter.

Cek visual video terakhir: Power Mastery sepuluh pilihan termasuk Darwizzy;
Weapon Mastery juga sepuluh. Audit nama/frame tersimpan di
`reference/stat-mastery-video2-reference.json`. Video tidak menetapkan
nomor tier proyek atau peluang; mapping label mastery ke 0–9 masih konfigurasi.

Interpretasi kerja memakai raw result sebelum bonus/mastery override; setiap
actual source spin dihitung sekali. Satu shared Power Mastery paling banyak
satu hit, walau banyak power. Spin stat numerik tambahan/late termasuk bila
ditandai eksplisit; target selector, fixed bonus, copy/skip, proyeksi dan replay
tidak dihitung. Final settlement setelah Title/seluruh event wajib, sebelum
freeze/image, menggantikan settlement setelah Fight. Tidak ada cap lima hit.
All In, Double/Nothing dan High Roller tetap seperti sebelumnya.

Versi aktif `gambler/0.2.0`; profil `0.1.0` diarsipkan inactive tanpa migrasi
journal lama. Perubahan tersinkron pada desain, framework spec, routing dan
dokumen. Runtime stat-policy helper masih belum diimplementasikan.

## 2026-10-09 — Goliath dan chance Berserker

Pengguna menetapkan satu chance spin Berserker : bukan Berserker = **1:9**.
Berserker (10%) mendapat **Strength +4** dan weakness **Uncontrollable Rage**.
Bukan Berserker (90%) mendapat **Strength +2**. Bonus berupa poin angka,
mutually exclusive: +4 adalah total paket Berserker, bukan +6.

Interpretasi kerja mempertahankan weakness sebagai tambahan source-owned
yang tidak diganti oleh spin Weakness normal berikutnya. Rincian aktivasi
amarah/control masih konfigurasi; tidak menciptakan penalti angka, power,
Size, Archetype kedua atau roda tambahan. Modifier fixed tidak dihitung
sebagai spin untuk Lucky Number. Paket dicatat atomik sekali dengan source
hasil chance; replay tidak menggandakan bonus/weakness.

Desain, spec dan dokumen tersinkron. Core event disetujui, helper runtime
belum diimplementasikan. Archetype selanjutnya mengikuti video: **Pirate**.

## 2026-10-09 — Pirate rank dan kapal historis

Pengguna meminta spin rank dari King Pirate sampai Crew, bonus stat 0–2
poin berdasarkan rank, lalu spin kapal bajak laut legendaris yang nyata.
Default pengguna sama rata; tidak ada rasio khusus baru.

Usulan editable: enam rank. King Pirate Fight +2; Captain Fight +1 dan
Intelligence +1; Quartermaster Intelligence +1; First Mate Fight +1;
Boatswain Strength +1; Crew nol. Total paket maksimal dua poin, tidak
diberikan pada seluruh stat. Nama/order merupakan hierarki game.

Delapan belas kapal historis dikurasi dan diberi sumber per identitas/alias
di `reference/pirate-ship-research.json`. Real history termasuk konteks
buccaneer/privateer; tidak mengadopsi kapal franchise/fiksi, ukuran meriam
atau crew count tanpa aturan pengguna. Tidak mengklaim daftar seluruh dunia.

Pertanyaan pengguna sudah diminta: kapal menjadi weapon untuk mastery/
Enchant atau kendaraan saja. Classification/command/loadout menunggu jawaban;
tidak mengaktifkan weapon draw/buff kapal/crew/army otomatis. Core alur
disimpan dan ditautkan ke spec; runtime helper belum diimplementasikan.
Urutan archetype berikutnya: Tarot Believer.

## 2026-10-09 — Kapal Pirate hanya desain

Pengguna menjawab kapal tidak menambah apa pun, hanya untuk desain, lalu
meminta lanjut ke archetype berikutnya. Ini menyelesaikan pertanyaan weapon/
kendaraan: ship spin tetap ada, hasilnya **cosmetic-only** untuk visual dan
narasi. Bonus stat rank tidak berubah.

Simpan pada presentation.pirateShip, tanpa entity kapal gameplay, weapon,
power, buff, mastery/Enchant, crew/army, Size, command, event baru atau
modifier peluang berikutnya. Tidak memerlukan profil operasi/command untuk
menjalankan hasil kosmetik. Roster/rank recipes tetap editable.

Versi aktif pirate/0.2.0; profil classification-pending 0.1.0 disimpan
inactive tanpa migrasi journal. Desain/spec/routing/dokumen tersinkron.
Berikutnya sesuai urutan video: **Tarot Believer**.

## 2026-10-09 — Tarot Believer dikeluarkan

Pengguna memilih melewati Tarot Believer karena kurang menarik. Pilihan ini
dikeluarkan dari roster seleksi Archetype mendatang dan pembahasan event;
namanya tetap tersimpan sebagai bukti video, tanpa event/no-event profile baru.
Filter sebelum normalisasi peluang pool baru, tanpa mengubah journal lama.
Roster final belum diaktifkan. Archetype berikutnya: **Gladiator**.

## 2026-10-09 — Gladiator satu weapon eksklusif

Pengguna menetapkan spin senjata bertema Gladiator, skip spin Weapon utama
dan tidak boleh mendapat weapon tambahan. Klarifikasi langsung: **weapon
sebelumnya dibuang** dan bonus Weapon Mastery diubah dari +1 menjadi **+2**.

Satu hasil mengganti seluruh loadout weapon aktif; riwayat lama dipertahankan
inactive. +2 hanya instance hasil Gladiator, normal mastery lalu cap/Enchant
kompatibel. Blokir semua weapon tambahan serta queued extra acquisition,
tanpa reroll/kompensasi; unrelated Race stats/powers/armor tetap berlaku.
Draft delapan pilihan sama rata bersifat editable, tanpa klaim roster historis
lengkap atau impor dari video. Runtime helper/guard dan detail capability
belum dibuat. Berikutnya: **Mage**.

## 2026-10-09 — Mage chance sekarang, Power nanti

Pengguna menetapkan Master Sihir 10% seperti chance Goliath. Master Sihir
mendapat total tiga spin Power, Mage Biasa dua; semuanya dilakukan nanti
pada tahap Power normal. Artinya satu spin utama + dua/ satu extra spin,
bukan tambahan tiga/dua spin. Semua spin yang dikelola Mage dijamin power.

Klarifikasi langsung: bobot Tier 3–5 **dikali 3**, Tier 1–2 tetap, pada
ketiga spin Master Sihir. Ini factor sebelum normalisasi, bukan jaminan
Tier ≥3 atau persentase akhir tiga kali. Tidak mengubah spin dari sumber lain.

No-power outcomes dikeluarkan sebelum sampling. Simpan plan/main binding/
ticket/modifier source-once, freeze pool/tier/odds pada setiap acquisition
nanti. Satu shared Power Mastery dan semua early power/ticket lain tetap.
Master Sihir bukan rank mastery otomatis. Desain/spec/dokumen tersinkron;
runtime belum dibuat. Berikutnya **Royal**.

## 2026-10-09 — Royal bidak catur dan evolusi Pawn

Enam bidak sama rata: King memberi Authority Tier 5; Queen +1 kelima main
stat; Bishop satu angelic spin; Knight Speed +2; Rook Durability +2; Pawn
aktifkan Beast of Possibility. Klarifikasi pengguna: Bishop memakai satu
roda Divine universal 15 pilihan, Authority berarti Perintah Mutlak /
Dominasi Kehendak, dan syarat Pawn memakai hasil spin asli sebelum bonus.

Jika minimal tiga kategori bernilai raw ≥7, Pawn evolve menjadi Royal High
Paladin dan +2 pada kelima main stat sekali. Working interpretation yang
dinyatakan adalah tiga dari tujuh kategori, termasuk satu Weapon Mastery
dan satu Power Mastery; beberapa weapon tidak menjadi kategori terpisah.
Mapping numeric mastery harus eksplisit/frozen. Kondisi bukan owned power;
evolusi bukan dispatch Paladin/Archetype atau spin baru. Bonus sendiri,
Power Tier dan discarded weapon tidak menjadi qualifying raw result.

Authority ditambahkan sebagai definisi ordinary power/Tier 5 terpisah dari
God Concept maximum; 243 definisi terdaftar, semua rating lama tetap sama.
Desain/spec/dokumen sudah sinkron. Runtime observer/limits/maps/body fit
belum dibuat. Berikutnya **Apostle**.

## 2026-10-09 — Apostle patron dan mastery

Pengguna menetapkan Apostle seperti Utusan Tuhan, tetapi spin patron God
atau Devil terlebih dahulu. God lalu spin Divine Power; Devil spin Cursed
Power. Default sama rata menghasilkan 50:50. Klarifikasi langsung pengguna
mengonfirmasi +1 Power Mastery untuk semua power pada kedua cabang.

Pakai roda universal 15 Divine / 12 Cursed tanpa copy/extra Concept/race
dispatch. Satu modifier sumber Apostle berbeda dari Utusan Tuhan, sehingga
sumber yang diotorisasi menambah masing-masing sekali sesuai cap. Normal
acquisition/shared mastery/None retention/God instance max tetap berlaku.
Tidak ada definisi power baru, stat/weapon/normal extra acquisition ticket.
Desain/spec/guide mastery tersinkron; runtime helper belum dibuat.
Berikutnya **Mutant**.

## Revisi Divine Cursed Demonic dan Angelic 9 Oktober 2026

Pengguna memperluas Divine, Cursed dan Demonic menjadi 20, meminta Demonic untuk Apostle Devil serta roda Angelic untuk Angel/Priest/Bishop. Fallen Angel dikonfirmasi **1 Demonic + 1 Angelic**. Angelic juga dibuat 20, kurasi empat power per Tier 1–5. Semua base weight 1, 5% per outcome tanpa selector tier. Ini mengganti deskripsi pool/routing terdahulu di riwayat keputusan ini.

God tetap dua Divine; Pemuka satu Divine; Angel dua Angelic; Priest/Bishop satu Angelic; Raja empat Demonic; Iblis dua Demonic; Apostle satu roda sesuai patron dan tetap +1 mastery semua power. Cursed tetap untuk Dark Elf/Oni/Leak/Vampire. Semua stat, follower, None retention, one shared mastery dan max khusus God Concept tetap.

Roda Demonic sekarang kanonis terpisah. Kurasi memindahkan membership Devil Avatar/Infernal Sovereignty ke Demonic; definisi/tier keduanya tetap. Thirty new definitions append to the prior 243 (273 global). Historical committed journals use their frozen old version; no migration of rewards. New single-power Archetype classifications need explicit profiles; existing decisions are ID-based. [Katalog lengkap](UNIVERSAL-POWER-WHEELS.md).

## Mutant Race Mutation 9 Oktober 2026

Pengguna menetapkan Mutant spin roda Ras sebagai tambahan ras dan tetap melarang ras sama. Gunakan seluruh usedRaceFamilyIds, termasuk chain sebelumnya, filter sebelum sampling. Ras lama dipertahankan; satu mutation root menjalankan event normal ras baru dengan source/return sendiri. Wrapper atau Hybrid dapat membuka chain lanjut.

Alur kerja mempertahankan snapshot keputusan Archetype sebelum mutasi, lalu kembali ke Mutant/Backstory; tidak menjalankan gate/Archetype kedua. Raksasa dalam mutation tetap memakai binding giant Size nanti tanpa menghapus role yang telah terpilih. Tidak ada paket stat/power/mastery Mutant tersendiri. Body/Size/fusion/runtime executor masih konfigurasi; no-repeat, grants source-once dan satu mastery tetap berlaku. Core Mutant disimpan, berikutnya Resilient. [Desain Mutant](MUTANT-EVENTS.md).

## 2026-10-09 — Noob, explicit 0–9 and Resilient

User replaces Darwizzy with Noob and assigns 0–9. Project mapping puts Noob
at zero and nine inspected regular labels at 1–9; source video remains unchanged.
Intelligence numeric range is adopted, display labels 1–9 unconfirmed. Raw
weights remain equal unless an explicit user odds/guard profile applies.

Resilient: first raw <=5 grants one second attempt, including both masteries;
user chooses the higher result. No third spin, same eligible pool, actual source
records immutable. Common Power Mastery keeps one selected character base, with
the explicit Resilient exception permitting two actual attempts total.

Latest timing correction: all main-stat bonuses are calculated at the end.
Register sources earlier, resolve bases/thresholds without bonuses, then calculate
all numeric effects only at finalize. Final bounds are not silently capped9.
Core approved event count is eighteen through Resilient; Equaliser next.

The [pre-change snapshot](../reference/before-stat-scales-resilient-2026-10-09.json)
freezes previous JSON rules; old committed runs keep original rules/results.

Pertanyaan timing mastery dikirim: apakah Weapon/Power Mastery bonus ikut
end-only, sehingga gate Enchant efektif perlu dipindah. Belum ada jawaban;
alur mastery sebelumnya dipertahankan sementara. Lima main-stat bonus
sudah finalize-only.

## 2026-10-09 — Timing mastery dan Enchant dikonfirmasi

Pertanyaan sebelumnya terjawab: bonus kedua mastery dihitung di akhir dan
bonus Weapon Mastery memengaruhi kelolosan Enchant. Fase akhir dimulai
setelah Title/event: hitung mastery -> periksa effective Weapon Mastery
Master5+/compatibility/unused slot -> selesaikan spin/event Enchant -> tutup
Lucky Number/hitung main-stat bonuses -> freeze/image/card. Tidak ada
Enchant lebih awal atau permanent skip berdasarkan raw rank saja.

Resilient/Lucky/Pawn tetap raw-only, efek dan scoped bonus tetap sama.
[Policy bonus-timing/0.1.0](../content/bonus-timing-design.json) menjadi
kanonis; snapshot sebelum perubahan disimpan pada
[reference](../reference/before-final-mastery-bonuses-2026-10-09.json).
Journal lama tidak mendapat event/reward tambahan secara retroaktif.

## 2026-10-09 — Equalizer: semua roda berikutnya uniform

Pengguna menetapkan stat-number probabilities sama rata tanpa bias ras/lore
archetype, mengonfirmasi kedua mastery, kemudian memperluas ke seluruh
roda berikutnya termasuk Weakness. Equalizer=1/N per eligible canonical
outcome pada setiap invocation setelah sumber aktif. Termasuk fixed ratios,
normal Size shape dan group masses, sebagai explicit override; hard
eligibility/guarantees/no-repeat/compatibility dan fixed/numeric grants tetap
mengikuti kontrak asal. No direct stat/mastery/power/weapon bonus atau
child spin. Full 0..9 = 10% per angka.

Distribusi lore normal akan didefinisikan nanti: arah Human Mid/Peak,
God dekat Universal. Belum ada bobot numerik baru. God example bukan
perubahan accepted Archetype eligibility. Nama display Equalizer; label
video Equaliser tetap satu canonical ID equaliser.

Core events19, next Assassin. Snapshot sebelum perubahan:
[before Equalizer](../reference/before-equalizer-2026-10-09.json).
[Structured event](../content/equalizer-events-design.json); raw results
dan peluang lama tidak diubah retroaktif.

## 2026-10-10 — Assassin memilih jenis

Pengguna menetapkan Assassin spin jenis dan menyebut Ninja serta Hasan-i
Sabbah. Riset online diizinkan khusus untuk kelompok historis subtype ini;
larangan riset roster Archetype utama dari luar video tetap berlaku.

Kandidat draft: Ninja, Assassins Alamut, Sicarii, Black Hand Serbia,
Narodnaya Volya dan Murder Inc. Krypteia merupakan cadangan karena
klasifikasi assassin masih diperdebatkan. Hasan adalah tokoh; proposed
slot Alamut mengacu pada agen fidai historis, bukan seluruh komunitas Nizari.

Satu selector dikonfirmasi; roster final dan seluruh reward pending.
Core event approved tetap19 dan event berikut yang sedang dibahas tetap
Assassin. [Panduan](ASSASSIN-EVENTS.md),
[desain](../content/assassin-events-design.json) dan
[sumber](../reference/assassin-group-research.json).

## 2026-10-10 — Assassin roster dan paket hadiah diterima

Pengguna menerima seluruh enam tipe, masing-masing Speed+1 dan satu
power atau weapon terkait kelompoknya. Power Tier3/4, kekuatan tidak
harus setara. Interpretasi desain memakai hadiah langsung per tipe.

Paket authored: Ninja Kage Bunshin3; Alamut Death Mark4; Sicarii Presence
Concealment3; Black Hand Pistol Black Hand; Narodnaya Volya Bom Dinamit;
Murder Inc Tommy Gun. Nama/fungsi/tier tiap power editable di dalam brief;
sejarah kelompok hanya konteks, bukan klaim kemampuan supernatural.

Speed dicatat source-once dan dihitung pada bonus akhir; mastery normal
serta gate/None/Enchant sebelumnya tetap berlaku. Tiga definisi power baru
ditambahkan ke registry276 tanpa mengubah 273 rating lama. Core events20,
next Paladin. [Paket Assassin](ASSASSIN-EVENTS.md),
[desain](../content/assassin-events-design.json),
[snapshot sebelum reward](../reference/before-assassin-rewards-2026-10-10.json).

## 2026-10-10 — Paladin Ascension dan scope mastery

Pengguna menetapkan Ascension10%: menjadi Nirvana High Paladin dan tiga
spin Angelic total. Biasa90%: satu Angelic dan Weapon Mastery+1. Scope
bonus dikonfirmasi untuk seluruh weapon yang dimiliki; berlaku pada
weapon aktif awal/nanti, dihitung di akhir dan ikut menentukan Enchant.

Nirvana tidak mewarisi hadiah biasa dan bukan Royal High Paladin milik
Pawn. Reuse power-angelic20, one actual spin/grant/reaction per child,
mastery Power bersama, normal main acquisition/None tetap. Core events21,
next Druid. [Panduan](PALADIN-EVENTS.md),
[desain](../content/paladin-events-design.json),
[snapshot](../reference/before-paladin-2026-10-10.json).


## 2026-10-10 — Druid disetujui

Pengguna menyetujui empat jalur 25%: Wild Shape memilih satu hewan biasa lalu Animal Transformation satu bentuk; Penjaga Hutan Forest Control; Pawang Alam Taming Power tanpa companion otomatis; Penyembuh Alam Healing. Satu power Tier 3 memenuhi budget dua poin, tanpa bonus angka tambahan. Usulan implementasi view 32 hewan modern Tamer adalah kurasi editable, bukan jumlah Druid yang diminta pengguna. Definisi/ratings power lama digunakan kembali; event ras dan Tamer tidak dijalankan.

## 2026-10-10 — Cursed dan batas persentase

Pengguna meminta 0–100 dalam langkah10, lalu mengoreksi batas menjadi “0-20 no,30-50 1,60-80 2,90-100 3”. Empat paket mengikuti permintaan sebelumnya:0 power/0 weakness;1/0;2/1;3/2. Sebelas persentase sama rata (1/11); paket tidak kumulatif. Power memakai power-cursed20 kanonis; setiap grant bersumber child aktual. Cursed Weakness tambahan bertahan bersama Weakness utama, tidak memberi debuff angka permanen tanpa aturan eksplisit. Dua belas identitas/guard weakness adalah draft kurasi, bukan roster yang telah dikonfirmasi. Core events23; berikutnya Colossal Warmech.

## 2026-10-10 — Koreksi Artillery Colossal Warmech

Pada usulan empat Kelas Warmech, pengguna mengganti Artillery dari Fight +2
menjadi **Intelligence +2**. Loadout usulannya tetap Railgun dan rudal
pelacak. Koreksi ini dicatat dalam draft; paket kelas/mech-weapon lengkap
masih pembahasan dan belum menambah core event yang disetujui.
[Draft Colossal Warmech](COLOSSAL-WARMECH-EVENTS.md).


## 2026-10-10 — Colossal Warmech diterima dan lanjut False Deity

Setelah mengoreksi Artillery menjadi Intelligence +2, pengguna mengatakan “next” dalam pembahasan satu Archetype per giliran. Paket terakhir diterima: empat kelas25%, satu external mech-as-weapon dan +2 numeric stat sesuai kelas. Brawler Strength, Fortress Durability, Blitz Speed, Artillery Intelligence; loadout tetap melekat pada satu unit. Bonus dihitung di akhir; weapon memakai mastery normal/Enchant compatible. Tidak ada bonus mastery atau extra selector. Profile ukuran/kontrol/kapabilitas/fit masih konfigurasi. Core events24; berikutnya False Deity. Snapshot reference/before-colossal-warmech-2026-10-10.json menyimpan draft sebelumnya.


## 2026-10-10 — False Deity dikeluarkan

Pengguna meminta “lets skip false deity. it is too sensitive for indonesian”. False Deity dikeluarkan dari selection dan event review berikutnya sesuai preferensi audiens pengguna. Tetap simpan label/bukti sumber dan journal lama. Filter dua exclusion Tarot Believer/False Deity sebelum normalisasi pool baru; tidak mendaftarkan profil no-event atau bonus. Core events tetap24, berikutnya Vessel.


## 2026-10-10 — Vessel dan kedua klarifikasi

Pengguna memilih God/Raja Iblis lalu Compatibility0–100;0–20 weakness tubuh rusak karena daya berlebih,30–50 satu power,60–80 setengah power,90–100 boost ras asal. Pengguna mengklarifikasi half sebagai jumlah spin (God1 Divine/Raja2 Demonic), dan full God paket lengkap termasuk80% None. FullGod Concept Authority maksimum+2 Divine+God followers; fullRaja4 Demonic+Raja followers. Gunakan11hasil langkah10 sebagai interpretasi konsisten wheel sebelumnya, semuanya equal default; patrons50:50. Tubuh Jebol nama authored kelemahan tanpa penalti angka/death/severity spin yang tidak ditentukan. Sumber tetap Vessel; tidak memperoleh owned race baru. Tambahkan akses kanonis dengan guard full patron/compatibility/source, bukan clone power/reward tables. Core events25, next Warlord. Snapshot reference/before-vessel-2026-10-10.json.


## 2026-10-10 — Vessel God60–80 mengganti Divine dengan Authority

Pengguna mengoreksi God60–80 menjadi tepat satu Authority tanpa Divine dan menyatakan Authority senilai dua Divine. Ubah hanya recipe God-half ke satu god-concept modeauthority; Raja-half tetap dua Demonic. Interpretasi paket memakai God Concept Authority yang sudah ada, termasuk maksimum terikat grant sumbernya; tidak memberi maksimum ke seluruh power. Pengikut dan80% None tetap90–100. Valuasi ini mengatur paket Vessel, tidak mengubah tier/odds/main-stat atau wheel power lain. Versi vessel/0.2.0; snapshot reference/before-vessel-authority-2026-10-10.json menjaga hasil committed1.0 tetap satu Divine. Count tetap25 core, next Warlord.

## 2026-10-10 — Warlord dan roda jumlah per ras

Pengguna meminta jenis pasukan, termasuk Multi Race → jumlah ras1–3 → pilihan ras. Lelembut diteruskan sampai tipe seperti Pocong; Dragon berhenti di Dragon tanpa form atau elemen. Pengguna mengonfirmasi satu spin jumlah untuk tiap ras, lalu meminta jumlah berbeda per ras menggunakan roda angka Slayer atau Vampire. Reuse angka dan peluang saja, bukan hadiah kill/feeding. Direct Vampire memakai count0/1/5/10/100/1000 bobot5:4:3:3:2:1; lainnya mengikuti assignments/ranks/profiles Slayer, dengan Dragon apex. Susunan 18 canonical family + Multi Race, separate army history/no-repeat antar-group dan klasifikasi composite adalah interpretasi implementasi, bukan pilihan detail baru yang diklaim langsung dari pengguna. Satu composite identity satu count; Zero valid. Benefit army tanpa bonus personal tambahan yang tidak diminta; army lama dan owned-race history tetap. Siluman sampling/capability/body fit/executor pending. Progres26 core event, next Aura Farmer. Snapshot reference/before-warlord-2026-10-10.json menyimpan central pre-registration contracts; source Slayer/Vampire/race catalogs tetap.

## 2026-10-10 — Aura Farmer dikeluarkan

Pengguna meminta "lets remove aura farmer. we already have anime race". Aura Farmer dikeluarkan dari roda Archetype dan urutan event review karena pengguna menganggapnya tumpang tindih dengan ras Anime. Pertahankan record label/occurrence video dan journal committed lama; jangan membuat profil no-event yang dapat diputar. Filter bersama Tarot Believer/False Deity sebelum normalisasi pool baru. Anime dan26 core event yang telah disetujui tetap. Berikutnya Primordial Champion sesuai urutan video kedua; alias Primordial Champ/Champion belum digabung.

## 2026-10-10 — Primordial Champion sementara dilewati dan usulan ras

Pengguna menyatakan tidak ada ras Primordial aktif, jadi Primordial Champion dilewati kecuali ada ide menambah Primordial. Primordial memang ada dalam arsip sumber ras tetapi tidak termasuk18 family aktif. Keluarkan kedua label recorded Champion/Champ dari selection/review baru tanpa alias merge, preserve source evidence dan committed journals. Berikutnya Champion's Legacy,26 core event tetap. Assistant mengusulkan Makhluk Pertama dengan tiga asal equal: Kosmos satu Cosmic universal, Alam satu Element/matching power, Kehidupan fixed Life Manipulation; bonus bersama Durability+1/Intelligence+1 final-only. Ini usulan belum approved/enabled: tidak menambah family, event caller, gate, history, tier/Size/army mapping atau mengaktifkan role. Persetujuan ide ras dan peninjauan role merupakan keputusan berikutnya pengguna.

## 2026-10-10 — Primordial berdasarkan legenda kuno

Pengguna mengganti arah usulan: tokoh dari berbagai legenda penciptaan lama, terutama dewa yang menciptakan dirinya sendiri; hindari tokoh agama yang masih dianut di Indonesia. Ganti tiga asal generik dengan candidate list Tokoh Primordial. Atum/Khepri/Amun memenuhi bukti self-creation versi yang dirujuk; Neith bersyarat karena pembacaan terjemahan. Ptah/Chaos/Gaia/Phanes/Namma/Apsu/Tiamat/Ymir adalah delapan pilihan lebih luas, bukan semua self-created atau semua dewa. Vishnu/Wisnu tidak dimasukkan sesuai batas terakhir pengguna. Sumber, versi dan batas klaim disimpan dalam reference/primordial-mythology-research.json; adaptasi game tidak sama dengan klaim sejarah. Dua belas kandidat, roster final dan hadiah masih usulan. Bonus umum lama tidak dibawa sebagai aturan terkonfirmasi; snapshot optional lama disimpan. Tidak menambah family aktif atau event/gate/caller; tetap18 family,26 core event dan next Champion's Legacy. Primordial Champion tetap dilewati.

## 2026-10-10 — Klarifikasi definisi Primordial

Pengguna mengklarifikasi: selama entitas itu pertama dan tidak diciptakan dewa lain, ia termasuk Primordial. Tidak harus sengaja menciptakan dirinya sendiri. First/co-first/generasi awal mandiri sebelum silsilah turunan dipakai sebagai interpretasi desain yang dinyatakan. Versi legenda harus jelas; dewa pembuat telur asal juga dihitung sebagai pencipta. Definisi terkonfirmasi, bukan persetujuan semua kandidat atau aktivasi ras. Sebelas kandidat tetap usulan; Phanes dikeluarkan pada versi Orphic yang ditelaah karena Chronos membuat telurnya dan ada entitas lebih awal. Neith tidak lagi bersyarat self-origin; Esna204 mendukung pencipta awal sendiri. Batas agama Indonesia tetap berlaku pada usulan. Arsip research proposal0.2 disimpan sebelum optional-race0.3; reward/gate/roster final pending. Tetap18 family aktif,26 core event, next Champion's Legacy, kedua label Primordial Archetype masih dilewati.

## Primordial dan Champion — 10 Oktober 2026

Pengguna meminta paket Primordial6 dan Champion3, hadiah power/weapon/stat sesuai legenda. Sebelas identity kerja sama rata, hadiah khusus tiap tokoh, satu shared Power Mastery, bonus angka final-only; Champion satu patron selector tanpa owned-race grant. Primordial sekarang family19 dan skip initial Archetype; Champion source ID primordial-champion dibuka kembali, recorded primordial-champ alias tetap excluded. Core27, next Champion’s Legacy. [Paket dan kontrak](PRIMORDIAL-EVENTS.md).

## Persetujuan Primordial dan Champion’s Legacy ditunda — 10 Oktober 2026

Pengguna menyetujui seluruh sebelas identitas/paket Primordial6 dan Champion3 serta alur sama-rata/skip ras/patron Champion/mastery normal/bonus angka akhir yang ditampilkan. Roster dan resep sebelumnya disusun assistant berdasarkan legenda; kini diterima pengguna. Tidak mengubah reward atau memberi kesiapan executor/body/Size otomatis. Pengguna kemudian meminta melewati Champion’s Legacy sampai banyak karakter tersimpan. Exclude sementara dari selection dan event review, pertahankan source evidence dan journal lama, tanpa no-event profile atau bonus yang tidak ditentukan. Tidak menetapkan jumlah minimal atau reaktivasi otomatis; tidak mengubah Disciple. Tetap19 family/27 core/279 power. Berikutnya Doombringer.

## Role yang dilewati dihapus; Hybrid mendapat dua Archetype — 10 Oktober 2026

Pengguna menghapus Doombringer dan Trickster serta menegaskan semua Archetype yang dilewati dari roster harus keluar dari roda. Champion’s Legacy yang tadi ditunda juga bukan pilihan aktif. Bukti/journal tetap, tanpa no-event replacement atau reaktivasi otomatis. NPC tetap approved/no-follow-up; Primordial Champion mengikuti persetujuan terbaru. Filter tujuh ID excluded termasuk alias unresolved sebelum normalisasi primary maupun child wheel. Pengguna menerima Hybrid dengan dua Archetype dan secara eksplisit meminta hasil berbeda. Self-exclusion, urutan child1/event1 sebelum child2/event2, local history, caller return dan minimum compatible pool merupakan interpretasi implementasi yang dinyatakan. Tidak memberi bonus/race/mastery intrinsik atau mengaktifkan Race Hybrid. Penerapan exact child recipes/source once/final bonus dan hard weapon locks tetap; komposisi body/policy yang belum disetujui memerlukan konfigurasi, tanpa hasil atau bonus yang dikarang. Gate utama tetap satu primary; Hybrid sendiri yang mengembangkan dua children. Core28,19 family,279 power; berikutnya Martial Artist. Snapshot reference/before-archetype-hybrid-2026-10-10.json menyimpan keadaan sebelumnya.

## Acuan Archetype hanya video kedua dan audit ras — 10 Oktober 2026

Pengguna membatalkan Martial Artist/Fight+2 sebelum recipe terdaftar, menghapus semua kandidat Archetype yang hanya ada di video pertama dan memilih video kedua sebagai satu-satunya acuan aktif. Lima source-only ID excluded, termasuk alias lama; total11 ID excluded dari kedua katalog arsip. Active video-two34 minus enam skipped roles menghasilkan28 retained IDs, seluruh event design telah ditentukan. Progress next null, event definitions complete; final body/pair/capability/executor tetap konfigurasi. Bukti sumber/journal lama dipertahankan. Pengguna lalu meminta audit roda ras video kedua. Inspeksi lokal membaca49 label:44 candidate labels selama animasi dan lima sektor kecil; satu hasil settled Neutralizer/Which Neutralizer→Prometheus. Dua attachment video kedua mempunyai SHA256 sama. Audit membandingkan canonical19 family dan subtype:24 terwakili, lima sebagian,14 tanpa jalur khusus, enam nama unresolved. Sumber kedua menambah12 label dibanding ekstraksi pertama, dan tidak menampilkan Troll/Mythical Beast sebagai root. Semua accepted custom race designs tetap; belum ada tambahan/removal race/reward/weight/body/gate/Slayer/Warlord. Label sumber tidak memberi lore/events/odds. Snapshot reference/before-video2-only-review-2026-10-10.json.
