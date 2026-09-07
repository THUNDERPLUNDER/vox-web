# VIDDEL INVENTORY — CONCEPT v0.1

Status: **CONCEPT / LATER — NOT BUILD SCOPE**  
Date: 2026-09-07  
Canonical issue: #385  
Working name: **Inventory**

## 1. Concept in one sentence

**Inventory is a visual, user-owned overview of the things, situations and connections that matter for a person's hearing and sound, so Viddel can give help that fits.**

The inspiration is the familiar inventory pattern from gaming: a place where the player can see what they have, what is equipped, what condition it is in and how things relate.

For Viddel, the metaphor must stay calm, adult and useful. This is not gamification and not a game-themed interface.

---

## 2. Why this matters

Viddel's long-term differentiation is not that the model knows more facts than everyone else. It is that Viddel can understand which knowledge and help fit this person, in this situation.

Inventory could make that context visible to the user rather than hiding it inside an opaque profile or model memory.

It supports several Viddel principles at once:

- **Nærhet** — close to the user's real everyday setup.
- **Skreddersøm** — help based on explicit context, not generic assumptions.
- **Aktiv lytting** — corrections visibly change what Viddel knows.
- **Ydmykhet** — unknown stays unknown until established.
- **Relevansen læres** — relevance improves through real situations, user corrections and experience over time.

Core rule:

> **The model may suggest. The user establishes what is true about their own equipment and situation.**

---

## 3. Recommended center of gravity

### Person at the center

The recommended default is **the person at the center**, not the hearing aid.

Why:

- hearing is broader than one device
- some users may have no hearing aid, several devices or changing equipment
- situations, goals and support relationships belong to the person
- this aligns with Viddel's North Star

### Hearing aids as a primary equipped item

Hearing aids may still be the visually strongest equipment object when they are central to the user's everyday setup.

Gaming analogy:

- **person** = player / owner of context
- **hearing aids** = important equipped item
- **other equipment** = inventory
- **situations** = contexts in which the equipment and the user meet real life

Do not carry the analogy farther than it is useful.

---

## 4. What Inventory may contain

### Things / equipment

Examples:

- hearing aids
- phone
- charger
- TV / streamer
- remote control
- microphone / accessory
- headset / earbuds
- car / hands-free where relevant
- other hearing-support equipment

Ownership must always be explicit.

> **mentioned ≠ owned**

### Situations / contexts

Examples:

- restaurant / several people speaking
- family dinner
- meetings
- TV at home
- phone calls
- car
- music
- outdoors

Situations are not literal possessions. They may therefore be shown as connected context cards or a second layer rather than mixed indiscriminately with equipment.

### Connections

Examples:

- hearing aids ↔ phone
- hearing aids ↔ TV streamer
- hearing aids ↔ charger
- hearing aids ↔ difficult restaurant situation
- person ↔ audiologist
- person ↔ relevant support pathway

A connection should only be shown when it has a useful product meaning.

---

## 5. Simple status model

Candidate status vocabulary to test later:

- fungerer
- fungerer delvis
- trenger hjelp
- usikkert / ikke avklart
- ikke i bruk
- nylig endret

Status should describe the user's practical relationship to the object or situation, not pretend that Viddel performs technical diagnostics.

---

## 6. Interaction hypothesis

Inventory opens as a **drawer, shelf or compact visual surface** rather than a heavy dashboard.

The initial view should be scannable in seconds.

Selecting one object or situation should quickly answer:

1. **Dette vet Viddel**
2. **Dette henger sammen med**
3. **Hjelp som passer nå**

The user must be able to correct, remove or mark information as uncertain with low friction.

### Illustrative item state

```text
Høreapparater
Oticon Intent 1
Status: fungerer delvis

Koblet til:
• iPhone
• TV
• Restaurant / flere som snakker

Viddel vet:
• Dette er dine høreapparater
• Du har problemer særlig i samtaler med flere

Handlinger:
• Få hjelp med denne situasjonen
• Endre det Viddel vet
• Ta med spørsmål til audiograf
```

This example is illustrative only. It does not approve a model, product claim, runtime state or final copy.

---

## 7. Thin testable v0.1

If Inventory is promoted later, the first prototype should stay deliberately small:

- one drawer / surface
- 3–5 manually added or confirmed objects
- 2–3 situations
- a few explicit connections
- one simple status per object or situation
- visible “what Viddel knows”
- easy correction controls
- links into existing help/chat rather than a new help engine

The first test question is:

> **Does this overview help people understand, correct and use their own hearing context?**

Not:

> Can Viddel automatically discover an entire device ecosystem?

---

## 8. Relationship to conversation state and retrieval

Inventory is **not** the implementation of #384.

#384 concerns the minimum session-local state/policy needed before limited beta.

Inventory is a later product expression of richer, persistent, user-owned state.

Potential long-term relationship:

```text
VISIBLE USER-OWNED INVENTORY
        ↓
confirmed equipment + situations + corrections
        ↓
VIDDEL STATE / POLICY
        ↓
deterministic allowed knowledge space
        ↓
retrieval + generation
        ↓
help that fits
```

The visual surface is not the authority by itself; the underlying explicit user-confirmed state is.

---

## 9. North Star relationship

Inventory could become one concrete expression of:

> **nær mennesket → nær situasjonen → nær støtteapparatet → hjelp som passer**

The long-term North Star is a Norwegian support and navigation layer around the person with hearing challenges and the people who help around them.

Inventory may later include relationships to:

- relative
- peer supporter / likeperson
- hearing helper / hørselshjelper
- audiologist
- organization
- public support pathway

These are **not** part of the thin v0.1 concept.

---

## 10. Strategic ownership

The drawer UI is not a moat.

The potential Viddel-owned asset is the model and learning loop:

```text
person
+ confirmed equipment
+ situations
+ connections
+ status
+ corrections
+ outcomes
→ more relevant help
```

### BUY / MATCH / OWN

- drawer / card / graph UI patterns: **MATCH**
- generic device APIs and integrations: **BUY / MATCH**
- user-confirmed hearing-context model: **OWN candidate**
- hearing-specific connection between state and allowed knowledge/help: **OWN candidate**
- learning from situation → help → outcome: **OWN candidate**

---

## 11. Main hypotheses

1. The gaming-inventory metaphor is intuitive without feeling childish.
2. Person-centered is clearer and more durable than hearing-aid-centered.
3. Users can distinguish owned things from contexts if the visual grammar is clear.
4. Seeing and correcting state increases trust.
5. Inventory makes it easier to formulate questions and understand why something matters.
6. A visual overview reduces cognitive load compared with hidden profile fields.
7. The concept can remain simple enough for varied digital experience.

---

## 12. Questions for the first prototype

When the concept is eventually promoted, compare at least:

### A. Person-centered

```text
               TV
                │
Mobil ─── [ DEG ] ─── Høreapparater
                │
             Restaurant
```

### B. Hearing-aid-centered

```text
               TV
                │
Mobil ─ [ HØREAPPARATER ] ─ Tilbehør
                │
              DEG
```

Evaluate comprehension, ownership feeling and ability to answer:

- Hva er mitt?
- Hva er problemet?
- Hva henger sammen?
- Hva vet Viddel?
- Hvordan endrer jeg det?

Do not choose the final center based only on visual appeal.

---

## 13. Non-goals / not now

Do not currently build:

- production Inventory UI
- automatic Bluetooth/device discovery
- Apple / Google Health import
- manufacturer-account integrations
- graph database
- a digital twin of the person
- heavy persistent profile/history architecture
- automatic ownership inference
- multi-role sharing
- audiologist portal
- smart-home control
- gamification, points or achievements
- game-like visual styling

The gaming analogy is an **interaction metaphor**, not a brand or visual theme.

---

## 14. Roadmap classification

**Horizon:** LATER / concept candidate  
**Strategic layer:** OWN candidate  
**Current beta impact:** none  
**Project Brain impact:** none now; the North Star already contains the strategic direction  
**#317 impact:** none

Promotion trigger:

- beta evidence shows users need a clearer way to establish/correct equipment and situation state, or
- persistent user-owned context becomes planned product capability, or
- a thin prototype is justified to test whether visible state improves comprehension/trust.

Until then: preserve, learn, do not build.

---

## 15. Related

- #385 — canonical Inventory concept issue
- #384 — minimum conversation state + policy before beta
- #99 — privacy-first state/effect/data model
- #293 — Min status til audiograf
- #254 — Situation Twin product-model thinking
- #373 — roadmap governance / promotion loop

