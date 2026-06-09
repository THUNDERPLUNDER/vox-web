# Viddel needs-to-source coverage matrix v0.1

Status: Planning/source-mapping layer / #243
Date: 2026-06-09
Related: [#243](https://github.com/THUNDERPLUNDER/vox-web/issues/243), [#250](https://github.com/THUNDERPLUNDER/vox-web/issues/250), [#254](https://github.com/THUNDERPLUNDER/vox-web/issues/254)
Scope: Coverage matrix before canonical guidance. No datastore import, no Drive changes, no production ingestion.

---

## 1. Short conclusion

Best covered now:

- `P0-01 Ingen lyd / svak lyd` has the strongest metadata coverage for a first canonical guidance asset. It has direct pointers to `INSIGHT_HEARING_AID`, the `HEARING_AID_MANUALS` systemmanual, 15 files under `02_SONIC_KNOWLEDGE`, 18 raw producer files under `01_ORIGINALS`, and broader user-guidance candidates such as `Masterplan - Optimal Lyttekvalitet`.
- `P0-04 App / Bluetooth / mobil` and `P0-05 TV / streaming / tilbehør` are also strong source-pointer candidates because `02_SONIC_KNOWLEDGE` contains app, pairing, Roger, TVConnector, MultiMic and TVAdapter files across Oticon, Phonak and ReSound.
- `P0-03 Lader / batteri / LED` has plausible manual and Sonic Knowledge pointers, but needs content review to confirm whether the files actually cover LED/status troubleshooting in a Viddel-friendly way.

Weak or unclear now:

- `P0-02 Filter / voks / dome` is surprisingly weak by filename/path metadata. It likely exists inside raw user guides, but metadata alone does not prove coverage.
- `P0-07 Før audiograf / problemnotat`, `P1-10 Første uke / tilvenning`, `P1-11 Pårørende / hjelper` and `P2-15 Aktører / stakeholder mapping` need source review or new sources. Some pointers exist, but the strongest stakeholder folders are empty.
- `P1-12 Rettigheter / støtteordninger` has source pointers, but should be treated as source-check/legal-policy work, not quick canonical guidance.

Recommended first canonical guidance asset:

1. `viddel-guidance-ingen-lyd-svak-lyd-v01` should be first. It is the best MVP repair loop and can test the full chain: user need -> Sonic Knowledge/manual pointers -> content review -> canonical rewrite -> manifest candidate.
2. Do not import `01_ORIGINALS`, `02_SONIC_KNOWLEDGE`, market validation, raw audio or policy docs directly. Everything remains `machine_classified` / needs review; `knowledge-status.full.v0.1.json` reports `datastoreReady: 0` and `directProductionImport: 0`.

---

## 2. Method

Baseline used:

- `data/source-inventory/drive-inventory.full.v0.1.json`
- `data/source-inventory/source-registry.generated.full.v0.1.json`
- `data/source-inventory/knowledge-status.full.v0.1.json`

Verified #250 baseline:

- 490 inventory rows
- 414 files
- 76 folders
- 17 empty folders
- 490 machine-classified rows
- 0 datastore-ready rows
- 0 direct production-import rows

This v0.1 matrix is based on metadata only:

- folder/path
- filename
- `sourcePool`
- `suggestedUse`
- `reviewNeed`
- Thomas screening context
- @navigator clarification for `HEARING_AID_MANUALS`
- existing repo docs and issue comments

This is not full content review. It does not read or analyze all 414 files. When the file content must be opened before a conclusion, the matrix marks it as:

- `needs_content_review`
- `needs_source_check`
- `needs_canonical_rewrite`
- `source_pointer_available_but_not_reviewed`

Situation Twin lens:

- #254 is included as a mapping layer, not as a replacement for evidence/source coverage.
- The matrix includes `situation_id`, `problem_type`, `listening_goal`, `experience_level`, `habit_prompt`, and mechanism/barrier.
- Enrichment and hidden resignation needs are included alongside repair needs.

Coverage statuses:

- `strong_metadata_coverage`
- `partial_metadata_coverage`
- `source_pointer_available_needs_review`
- `weak_or_missing`
- `not_for_mvp`

Review needs:

- `ready_for_canonical_outline`
- `needs_content_review`
- `needs_source_check`
- `needs_canonical_rewrite`
- `needs_transcript`
- `needs_new_source`
- `park_for_later`

---

## 3. Prioritized coverage matrix

| needId | situation_id | needArea | priority | likelyUserQuestion | Situation Twin lens | relevantSourcePools | keySourcePathsOrExamples | coverageStatus | reviewNeed | recommendedNextAction | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P0-01 | st-troubleshoot-no-sound | Ingen lyd / svak lyd | P0 | "Høreapparatet mitt gir nesten ingen lyd. Hva gjør jeg først?" | problem_type: repair; listening_goal: hear basic speech again; experience_level: any; habit_prompt: check power, fit, obstruction, app state, program; mechanism/barrier: acoustic blockage, battery/charge, wrong program, Bluetooth/app state, device fault | `manufacturer_manual`, `user_guidance_candidate`, `unknown` P0 insight docs | `INSIGHT_HEARING_AID/Masterplan - Optimal Lyttekvalitet`; `HEARING_AID_MANUALS/Høreomsorg Systemmanual...`; `02_SONIC_KNOWLEDGE/*/*UserGuide*`; `01_ORIGINALS/*/*UserGuide*` | strong_metadata_coverage | ready_for_canonical_outline | Start canonical outline; then read 3 Sonic Knowledge files first: Oticon Intent UserGuide, Phonak Infinio UserGuide, ReSound Nexia UserGuide. Cross-check against `01_ORIGINALS` only for technical accuracy. | Best first asset. Metadata points to enough material, but actual troubleshooting sequence must be content-reviewed before writing final guidance. |
| P0-02 | st-troubleshoot-wax-filter-dome | Filter / voks / dome | P0 | "Kan dårlig lyd skyldes filter, voks eller dome?" | problem_type: repair; listening_goal: restore clarity; experience_level: daily user/new user; habit_prompt: inspect dome/filter before app tweaking; mechanism/barrier: blockage, wrong/loose dome, maintenance uncertainty | `manufacturer_manual`, possible `user_guidance_candidate` | Likely inside `Oticon_Intent_UserGuide_2026.pdf`, `Phonak_Infinio_UserGuide_2026.pdf`, `ReSound_Nexia_UserGuide_2024.pdf`; no clear filter/wax/dome filename hit in full inventory | partial_metadata_coverage | needs_content_review | Open the three Sonic Knowledge user guides and raw originals only for filter/dome sections. Create extracted notes before canonical rewrite. | Metadata is weak despite high user importance. Do not assume content until guide sections are checked. |
| P0-03 | st-troubleshoot-charger-battery-led | Lader / batteri / LED | P0 | "Laderen lyser rart, eller apparatet lader ikke. Hva betyr det?" | problem_type: repair; listening_goal: make device usable today; experience_level: any; habit_prompt: check charge state before support call; mechanism/barrier: battery, charging contact, LED interpretation, case confusion | `manufacturer_manual`, `unknown` product imagery | `02_SONIC_KNOWLEDGE/Oticon/Oticon_Intent_UserGuide_2026.pdf`; `02_SONIC_KNOWLEDGE/Phonak/Phonak_Infinio_UserGuide_2026.pdf`; `02_SONIC_KNOWLEDGE/Resound/ReSound_Nexia_UserGuide_2024.pdf`; product imagery around SmartCharger | source_pointer_available_needs_review | needs_content_review | Review charging/LED sections in Sonic Knowledge first; use `01_ORIGINALS` as technical fallback. | Good pointer coverage, but no confirmed cross-brand LED table yet. |
| P0-04 | st-troubleshoot-app-bluetooth-mobile | App / Bluetooth / mobil | P0 | "Appen finner ikke høreapparatet, eller Bluetooth virker ikke." | problem_type: repair; listening_goal: reconnect phone/app; experience_level: daily user; habit_prompt: separate phone Bluetooth, hearing-aid app and accessory pairing; mechanism/barrier: pairing state, app permission, OS/app mismatch | `manufacturer_manual`, `user_guidance_candidate` | `02_SONIC_KNOWLEDGE/Oticon/Oticon_CompanionApp_UserGuide_2025.pdf`; `Oticon_Intent_CompanionApp_Guide.pdf`; `Phonak_Roger_App_UserGuide_2026.pdf`; `ReSound_Nexia_Smart3D_PairingGuide.pdf`; `01_ORIGINALS/Resound/402782...PairingGuide...pdf` | strong_metadata_coverage | ready_for_canonical_outline | Make second canonical asset after "Ingen lyd"; review app/pairing guides and create brand-agnostic decision tree. | Strong filenames, but app guidance can become model-specific fast. Keep first version generic with brand-specific pointers only after review. |
| P0-05 | st-tv-streaming-accessory | TV / streaming / tilbehør | P0 | "Hvordan får jeg TV-lyden eller streaming til høreapparatet?" | problem_type: repair/enrichment; listening_goal: hear TV/media clearly; experience_level: daily/advanced; habit_prompt: identify whether user uses phone, TV adapter, Roger or MultiMic; mechanism/barrier: accessory pairing and source routing | `manufacturer_manual`, `unknown` imagery | `Oticon_Intent_TVAdapter_UserGuide.pdf`; `Phonak_Infinio_TVConnector_UserGuide.pdf`; `Phonak_Infinio_RogerOn_DemoGuide.pdf`; `ReSound_MultiMic_UserGuide_2022.pdf`; `ReSound_Nexia_MultiMicPlus_2026.pdf`; image folder `Bilder/.../TV` | strong_metadata_coverage | needs_content_review | Review accessory guides and split TV/streaming into simple branch: phone streaming vs TV box/accessory. | Good source-pointer coverage, but likely too accessory-specific for first MVP asset. |
| P0-06 | st-identify-unknown-model | Ukjent merke/modell | P0 | "Jeg vet ikke hvilket høreapparat jeg har. Hvordan finner jeg ut av det?" | problem_type: orientation; listening_goal: find right help path; experience_level: new/uncertain user; habit_prompt: check app, charger/case, receipt, physical markings, audiograf documents; mechanism/barrier: user cannot map advice to own device | `manufacturer_manual`, `user_guidance_candidate`, `unknown` | `02_SONIC_KNOWLEDGE/*/*UserGuide*`; product imagery under `Bilder/.../Product Imagery`; `INSIGHT_HEARING_AID/Masterplan - Optimal Lyttekvalitet` | partial_metadata_coverage | needs_content_review | Build a short "identify your device" outline from metadata, then content-review actual model-identification cues. | Important helper asset for routing, but source coverage is mostly indirect. |
| P0-07 | st-before-audiologist-problem-note | Før audiograf / problemnotat | P0 | "Hva bør jeg skrive ned før jeg kontakter audiografen?" | problem_type: preparation; listening_goal: get better help; experience_level: any; habit_prompt: note situation, device, app/accessory, when it happens, what was tried; mechanism/barrier: poor problem description causes bad support loop | `user_guidance_candidate`, `stakeholder_expert`, `unknown` | `INSIGHT_HEARING_AID/Hørselshjelperen i norsk hørselsomsorg.pdf`; `Norway’s Emerging Hearing-Helper Ecosystem.pdf`; `Hørselstap: Forskning, Mestringsstrategier, Pårøre...`; empty `AKTØRER/*` folders | source_pointer_available_needs_review | needs_source_check | Review hørselshjelper/stakeholder files and write a checklist candidate later. | Strong product need, weaker verified source basis. Empty actor folders show intended but missing stakeholder source pool. |
| P1-08 | st-social-restaurant-noise | Restaurant / støy / sosial situasjon | P1 | "Jeg hører dårlig i restaurant eller selskap. Hva kan jeg prøve?" | problem_type: enrichment/repair; listening_goal: follow conversation with less fatigue; experience_level: daily user; habit_prompt: pick seat, app/program, expectations, breaks; mechanism/barrier: noise, directionality, fatigue, hidden resignation | `user_guidance_candidate`, `unknown` imagery, possible manual app/program sections | `Bilder/viddel-kontaktark/inbox/Social`; `Bilder/.../City Life Cafe`; `Masterplan - Optimal Lyttekvalitet`; app/program guides in `02_SONIC_KNOWLEDGE` | partial_metadata_coverage | needs_content_review | Treat as Situation Twin enrichment candidate; review user-guidance docs before technical manuals. | Good situational assets and product-model fit, but less direct evidence than P0 repair needs. |
| P1-09 | st-car-traffic-sound | Bil / trafikklyd / automatikk | P1 | "I bil eller trafikk blir lyden feil. Hva kan jeg gjøre?" | problem_type: situational repair; listening_goal: safer, calmer travel sound; experience_level: daily/advanced; habit_prompt: note car, phone, handsfree and program behavior; mechanism/barrier: wind/traffic noise, handsfree routing, automatic program shifts | `unknown` imagery, possible app/manual sources | `Bilder/.../Car`; `02_SONIC_KNOWLEDGE/*CompanionApp*`; `*Smart3D*PairingGuide*`; `Phonak_Roger_App_UserGuide_2026.pdf` | source_pointer_available_needs_review | needs_content_review | Park behind P0 app/Bluetooth and TV/accessory work; extract only if user testing shows recurring need. | Many metadata hits are images, not source guidance. |
| P1-10 | st-first-week-adaptation | Første uke / tilvenning | P1 | "Er det normalt at alt blir mye i starten?" | problem_type: adaptation/enrichment; listening_goal: keep using device without giving up; experience_level: new user; habit_prompt: tiny daily listening experiments; mechanism/barrier: overload, expectation gap, hidden resignation | `user_guidance_candidate`, `unknown` | `Hørselstap: Forskning, Mestringsstrategier, Pårøre...`; `Masterplan - Optimal Lyttekvalitet`; empty image input folder `06_forste_uker` | weak_or_missing | needs_content_review | Needs user-guidance review or new authored source. Do not base this on manuals alone. | Important for Viddel tone, but not strongly represented by technical source metadata. |
| P1-11 | st-helper-family | Pårørende / hjelper | P1 | "Hvordan kan jeg hjelpe noen som hører dårlig?" | problem_type: helper/support; listening_goal: reduce friction between user and helper; experience_level: helper; habit_prompt: ask what helps, reduce shame, make practical routines; mechanism/barrier: communication mismatch, fatigue, social pressure | `user_guidance_candidate`, `stakeholder_expert`, `unknown` | `Hørselstap: Forskning, Mestringsstrategier, Pårøre...`; `Hørselshjelperen i norsk hørselsomsorg.pdf`; `Norway’s Emerging Hearing-Helper Ecosystem.pdf`; `Undersøkelse: Står du nær noen med hørselsutfordringer?` | source_pointer_available_needs_review | needs_source_check | Review helper docs and survey/source file before canonical guidance. | Good candidate later, but content/source validation required. |
| P1-12 | st-rights-support | Rettigheter / støtteordninger | P1 | "Hva kan jeg få støtte til, og hvor starter jeg?" | problem_type: rights/navigation; listening_goal: know where to ask; experience_level: any; habit_prompt: check official source, separate insurance/NAV/HLF; mechanism/barrier: policy complexity and freshness risk | `public_policy` | `INSIGHT_HEARING_AID/Støtteordninger for hørselshemmede i Norge`; `CRPD: Menneskerettigheter i Praksis`; Hørselsforbundet insurance files; `Høreapparater: Miljø, Teknologi, Navigasjon` | partial_metadata_coverage | needs_source_check | Keep separate from first repair assets; require freshness/source check and likely official-source update before user guidance. | Not a quick MVP troubleshooting asset. High risk if stale or over-specific. |
| P2-13 | st-market-ecosystem-businesscase | Marked / økosystem / businesscase | P2 | "Hvorfor finnes Viddel, og hvor er markedsgapet?" | problem_type: strategy; listening_goal: internal prioritization, not user answer; experience_level: internal; habit_prompt: use for prioritization, not chat copy; mechanism/barrier: confusing strategy with guidance | `market_validation`, `strategic_research`, `unknown` | `Markedsvalidering 2026/*`; `Konkurrentanalyse Høreapparatmarkedet Norge`; `Kartlegging av hørselsomsorgens verdikjede.pdf`; `Strategisk analyse for teknisk integrator v01-v04` | not_for_mvp | park_for_later | Use for prioritization/positioning only. Do not import as user-facing answer material. | Valuable, but not direct AI-answer corpus. |
| P2-14 | st-healthcare-inspiration | Inspirasjon helsevesen | P2 | "Hvilke helsevesen-/omsorgsprinsipper kan inspirere Viddel?" | problem_type: inspiration; listening_goal: product direction; experience_level: internal; habit_prompt: mine principles only after review; mechanism/barrier: inspiration content mistaken for evidence | `inspiration_context`, `unknown` | `Inspirasjon helsevesen`; `VOX DEV/Brand and style/Opplevelsesprinsipper - UX`; documentary/healthcare context files | not_for_mvp | park_for_later | Keep as context-only until source-reviewed and rewritten. | Not first canonical guidance material. |
| P2-15 | st-actor-stakeholder-map | Aktører / stakeholder mapping | P2 | "Hvem eier hva i norsk hørselsomsorg?" | problem_type: ecosystem/stakeholder; listening_goal: know support landscape; experience_level: internal/user later; habit_prompt: distinguish HELFO, HLF, kommune, audiograf; mechanism/barrier: actor confusion | `stakeholder_expert`, `public_policy` | `INSIGHT_HEARING_AID/AKTØRER/NORGE/HELFO`; `.../HLF`; `.../KOMMUNE`; `.../VERDEN`; plus public policy files | weak_or_missing | needs_new_source | Treat empty actor folders as source gap. Create stakeholder source pool before user-facing guidance. | Folders are empty, so they indicate ambition rather than evidence. |
| P2-16 | st-agent-vision-image-input | Fremtidig agent/vision/image-input | P2 | "Kan jeg vise bilde av apparatet, filteret eller laderen?" | problem_type: future capability; listening_goal: identify device/part visually; experience_level: any; habit_prompt: attach image only when feature exists and privacy is clear; mechanism/barrier: visual identification uncertainty | `unknown` imagery, product imagery, future QA docs | `Bilder/viddel-kontaktark/inbox/Product Imagery`; `Hearing Aid Box`; `App Adjustments`; `VOX DEV/AGENT/specs/*` empty/spec folders | not_for_mvp | park_for_later | Keep as future product/source mapping. Do not imply current production image reasoning. | Useful for roadmap, not source-ready canonical guidance. |

---

## 4. First canonical asset candidates

### 1. `viddel-guidance-ingen-lyd-svak-lyd-v01`

Why first:

- Direct MVP repair loop.
- Clear user urgency.
- Best metadata coverage across `INSIGHT_HEARING_AID`, `02_SONIC_KNOWLEDGE`, raw manuals and user-guidance candidates.
- Tests the core source chain without touching datastore import.

Source pointers:

- `INSIGHT_HEARING_AID/Masterplan - Optimal Lyttekvalitet`
- `HEARING_AID_MANUALS/Høreomsorg Systemmanual: Phonak, Oticon, ReSound v01`
- `02_SONIC_KNOWLEDGE/Oticon/Oticon_Intent_UserGuide_2026.pdf`
- `02_SONIC_KNOWLEDGE/Phonak/Phonak_Infinio_UserGuide_2026.pdf`
- `02_SONIC_KNOWLEDGE/Resound/ReSound_Nexia_UserGuide_2024.pdf`

Must read before writing:

- Troubleshooting / no sound / weak sound sections in the three Sonic Knowledge user guides.
- Cross-check against one raw original per brand only when Sonic Knowledge is unclear.

Known gaps:

- Metadata does not prove filter/dome/battery sequence.
- Need a Viddel-owned decision tree before any manifest candidate.

### 2. `viddel-guidance-app-bluetooth-mobil-v01`

Why second:

- Frequent support-like need.
- Strong filenames: CompanionApp, Smart3D PairingGuide, Roger App.

Source pointers:

- `Oticon_CompanionApp_UserGuide_2025.pdf`
- `Oticon_Intent_CompanionApp_Guide.pdf`
- `ReSound_Nexia_Smart3D_PairingGuide.pdf`
- `Phonak_Roger_App_UserGuide_2026.pdf`

Must read before writing:

- Pairing reset / app connection sections per brand.
- Any OS-specific assumptions.

Known gaps:

- Risk of becoming model/app-version specific.

### 3. `viddel-guidance-filter-voks-dome-v01`

Why third:

- Likely core cause behind weak sound.
- Simple, practical and safety-relevant.

Source pointers:

- User-guide sections inside Oticon/Phonak/ReSound Sonic Knowledge and `01_ORIGINALS`.

Must read before writing:

- Actual maintenance, wax guard/filter/dome wording in brand guides.

Known gaps:

- Very weak metadata coverage by filename. Needs content review before even an outline is trusted.

### 4. `viddel-guidance-lader-batteri-led-v01`

Why fourth:

- High everyday friction and support deflection potential.
- Likely covered in user guides, but not yet extracted.

Source pointers:

- `Oticon_Intent_UserGuide_2026.pdf`
- `Phonak_Infinio_UserGuide_2026.pdf`
- `ReSound_Nexia_UserGuide_2024.pdf`
- Product imagery around chargers.

Must read before writing:

- Charging case and LED/status sections.

Known gaps:

- No confirmed cross-brand LED/status table.

### 5. `viddel-guidance-for-audiograf-problemnotat-v01`

Why fifth:

- Viddel-specific value: helps the user ask for better help.
- Can bridge repair and human support without pretending to replace audiograf.

Source pointers:

- `Hørselshjelperen i norsk hørselsomsorg.pdf`
- `Norway’s Emerging Hearing-Helper Ecosystem.pdf`
- `Hørselstap: Forskning, Mestringsstrategier, Pårøre...`

Must read before writing:

- Helper/stakeholder docs and any relevant interview/stakeholder notes once source-linked.

Known gaps:

- Stakeholder/actor folders are empty; source basis may need new input.

---

## 5. HEARING_AID_MANUALS treatment

Operational rule:

- `01_ORIGINALS` = raw manufacturer manuals and technical PDFs.
- `02_SONIC_KNOWLEDGE` = intended agent-ready / distilled / platform-specific knowledge layer.
- Neither folder is automatically `datastore_ready`.
- No direct import without canonical rewrite and manifest approval.

Current inventory caveat:

- The #250 generated registry currently classifies both `01_ORIGINALS` and `02_SONIC_KNOWLEDGE` as `manufacturer_manual` / `technical_grounding_only` / `needs_canonical_rewrite`.
- For #243 planning, apply @navigator's interpretation: `02_SONIC_KNOWLEDGE` should be treated as intended agent-ready input, equivalent to `user_guidance_candidate` with note `intended_agent_ready_knowledge`, but still requiring content verification.
- A later source-registry classification cleanup can add `agent_ready_knowledge` or reclassify `02_SONIC_KNOWLEDGE`; this issue does not change pipeline logic.

First files to check for "Ingen lyd / svak lyd":

1. `HEARING_AID_MANUALS/02_SONIC_KNOWLEDGE/Oticon/Oticon_Intent_UserGuide_2026.pdf`
2. `HEARING_AID_MANUALS/02_SONIC_KNOWLEDGE/Phonak/Phonak_Infinio_UserGuide_2026.pdf`
3. `HEARING_AID_MANUALS/02_SONIC_KNOWLEDGE/Resound/ReSound_Nexia_UserGuide_2024.pdf`
4. `HEARING_AID_MANUALS/Høreomsorg Systemmanual: Phonak, Oticon, ReSound v01`
5. Raw originals for cross-check only if the Sonic Knowledge layer is missing or ambiguous:
   - `01_ORIGINALS/Oticon/Oticon-Intent-Instructions-For-Use.pdf`
   - `01_ORIGINALS/Phonak/ph-user-guide-audeo-i-r-92x125-029-1357-02-en.pdf`
   - `01_ORIGINALS/Resound/401819000GB-24.06-Rev.A.pdf`

Answer to #243 open questions:

1. Does `02_SONIC_KNOWLEDGE` have enough coverage for MVP "Ingen lyd / svak lyd"?
   Metadata says probably enough to start an outline, but not enough to finalize. It must be content-reviewed first.
2. Which MVP needs still depend on `01_ORIGINALS`?
   Filter/wax/dome, charger/LED details, model-specific app reset/pairing, and precise accessory behavior still depend on raw manuals until Sonic Knowledge coverage is verified.
3. Who/what flow owns rewrite?
   Recommended flow: source reviewer extracts sections -> @navigator or content owner checks source fidelity -> Codex/Thomas drafts canonical Viddel guidance -> manifest gate approves only the final asset.

---

## 6. Source gaps

- `AKTØRER` is a gap, not evidence. `AKTØRER/NORGE/HELFO`, `HLF`, `KOMMUNE` and `VERDEN` are empty folders in the #250 snapshot.
- `02_SONIC_KNOWLEDGE` intent is clearer than its current registry classification. It needs content review and possibly a later sourcePool cleanup.
- `Filter / voks / dome` has weak metadata coverage. It likely exists inside user guides, but source pointers are not obvious by filename.
- `Før audiograf / problemnotat` has weak verified stakeholder evidence. Helper/ecosystem files exist, but actor folders are empty.
- `Pårørende / hjelper` needs content review and source linking. Survey/helper files exist, but are not yet reviewed insight.
- `Rettigheter / støtteordninger` needs source freshness and official-source review before guidance. Hørselsforbundet/insurance/policy files are not enough by themselves.
- `Restaurant / støy / sosial situasjon`, `musikk`, `små lyder`, morning/home awareness and hidden resignation are strong Situation Twin opportunities, but source basis is mostly user-guidance candidates plus imagery/context, not reviewed evidence.
- `Vision/image-input` has product imagery and future-oriented folders, but no current source-ready product behavior.
- Raw audio files require transcript before use.

---

## 7. Recommended next issues

Do not create these automatically from #243; they are proposed follow-ups.

1. `Canonical guidance asset v0.1 — Ingen lyd / svak lyd`
   - Read first Sonic Knowledge/user-guide pointers.
   - Produce Viddel-authored canonical outline.
   - Keep status below `datastore_ready` until review/manifest.

2. `Review 02_SONIC_KNOWLEDGE for MVP coverage`
   - Verify whether the intended agent-ready layer actually covers no sound, weak sound, app/Bluetooth, TV/accessory and charging.
   - Decide whether to update sourcePool taxonomy with `agent_ready_knowledge`.

3. `Canonical rewrite from manufacturer manuals — filter/dome/battery`
   - Extract narrow technical facts from `01_ORIGINALS` and Sonic Knowledge.
   - Create source-linked notes before writing guidance.

4. `Update VIS knowledge status with coverage matrix summary`
   - Add a compact coverage summary or link to this matrix from VIS.
   - Keep current #243 as docs/planning only.

5. `Source gap: AKTØRER / stakeholder source pool`
   - Populate or explicitly park HELFO, HLF, kommune and world actor folders.
   - Decide which actor knowledge is user-facing vs internal strategy.

6. `Situation Twin source mapping v0.1`
   - Continue #254 by mapping repair and enrichment needs to source readiness.
   - Include hidden resignation, music, small sounds and home/outdoor awareness.

---

## 8. Impact assessment

VIS/current-state impact: yes. This document changes source-readiness understanding and adds #243 as a planning milestone. `src/data/mvp-current-state.ts` should record it as a recent change. A visible VIS summary is deferred to a follow-up issue.

Backstage impact: none. No backend, env, guard, monitoring or production API behavior changes.

Navigation/page-contract impact: none. No route, IA, page contract or VIS navigation change in this issue.

Follow-up issue if deferred: `Update VIS knowledge status with coverage matrix summary` is recommended, but not created here.

---

## 9. Source-use rule

Raw source material supports guidance; it does not define the product answer directly.

- `01_ORIGINALS`: technical grounding only, never direct AI-answer material.
- `02_SONIC_KNOWLEDGE`: intended canonical guidance input, but not automatically verified or datastore-ready.
- Market validation and strategy docs: prioritization and positioning only, not user-facing answer material unless rewritten as Viddel guidance and manifest-approved.
- Public policy/support files: source-check and freshness-check required before guidance.
- Raw audio: transcript required before use.
- Any future datastore import must pass the manifest gate in `docs/project/VIDDEL_DATASTORE_READY_MANIFEST_v0_1.md`.

---

*End of document — v0.1*
