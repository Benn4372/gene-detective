# Gene Detective — Design Document

> ⚠️ **Archived — this is design v1.** The full UI rewrite is planned in
> `~/.claude/plans/majestic-gathering-sloth.md` (Blob Research Station).
> Everything below reflects the pre-rewrite vision (Village + Orders + Lab).
> The genetics engine, content data types, glossary, and Blob renderer
> described here are preserved; the UI architecture is superseded.

**Status:** v1 (archived 2026-07-22 — see Blob Research Station rewrite plan)
**Last updated:** 2026-07-21
**Owner:** Benjamin Pritchard

---

## Table of contents

1. [One-paragraph pitch](#1-one-paragraph-pitch)
2. [Audience & tone](#2-audience--tone)
3. [Core game loop](#3-core-game-loop)
4. [Design pillars](#4-design-pillars)
5. [Difficulty tiers](#5-difficulty-tiers)
6. [World & organisms](#6-world--organisms)
7. [Breeding mechanics](#7-breeding-mechanics)
8. [The notebook (evidence-gated hypotheses)](#8-the-notebook-evidence-gated-hypotheses)
9. [Glossary & Concept Codex](#9-glossary--concept-codex)
10. [Lessons](#10-lessons)
11. [Orders & the character cast](#11-orders--the-character-cast)
12. [Economy, shop, and stable](#12-economy-shop-and-stable)
13. [Hint system](#13-hint-system)
14. [Full curriculum (54 concepts)](#14-full-curriculum-54-concepts)
15. [Data model](#15-data-model)
16. [Screens & UI shell](#16-screens--ui-shell)
17. [Tech stack](#17-tech-stack)
18. [Repository layout](#18-repository-layout)
19. [Build roadmap](#19-build-roadmap)
20. [Extensibility guardrails](#20-extensibility-guardrails)
21. [Open questions & deferred decisions](#21-open-questions--deferred-decisions)

---

## 1. One-paragraph pitch

A single-species genetics detective game for the browser. The player breeds cartoon "blobs" — one shared species that grows visible features as concepts are unlocked — observes phenotypes across litters, and deduces genotypes to fill a **notebook** that only validates entries when supported by real breeding evidence. Progress alternates between **Lessons** (isolated puzzles that introduce one concept, each backed by a two-tier glossary) and **Orders** (jobs from a cast of client characters). A **hint system** intervenes when the player has bred repeatedly without notebook progress. The full 54-concept curriculum — from simple dominance through population genetics, epigenetics, and CRISPR — is in scope; **difficulty tiers** decide how much of it any given playthrough exposes.

## 2. Audience & tone

- **Primary audience:** a curious adult who took high-school biology and doesn't remember Punnett squares. Explanations assume adult intelligence but no retained genetics knowledge.
- **Tone:** plain-language first, technical term second. Warm and clear, not childish. Concepts are respected; readers are respected.
- **Not for:** children requiring gamified rewards to stay engaged, nor experts wanting a pure sandbox.

## 3. Core game loop

```
Stable (named blobs) ─┬─► Breeding Room ─► Litter of 4-8 ─► Notebook (evidence)
                      │                                        │
                      ├─► Lessons  ◄── unlocks concept + trait ─┤
                      │       │
                      │       └── pinned glossary (overview + full article)
                      │
                      └─► Orders from Characters ─► Coins ─► Shop
                                                              │
                                                              └─► Buy blob w/ new trait
                                                                     │
                                                                     └─► Trait integrates via breeding
```

**Session shape:** a player opens the game, checks the character board for new orders, breeds toward one, consults the notebook, occasionally opens a lesson to unlock a new trait, and spends earned coins in the shop to bring new genetic material into their pool. Sessions end naturally when the player finishes an order or hits a resource cap.

## 4. Design pillars

1. **Uniform trait/gene data model.** One schema expresses every inheritance mode. No lesson forces an engine rewrite.
2. **Notebook = evidence, not answers.** Hypotheses only "solve" when observed offspring actually distinguish them from alternatives. There is no "check my answer" button.
3. **Two-tier glossary.** Every concept has an overview card (~2 paragraphs, plain-language first) and a full article (expands with diagrams and examples). Terms unlock as lessons introduce them.
4. **Hints without spoilers.** After N breeds without notebook progress, escalating hints suggest the *approach*, never the answer.
5. **Content is data.** Species, genes, traits, lessons, glossary, characters, orders — all JSON or MDX in `/content/`. Adding content is never a code change.

## 5. Difficulty tiers

| Tier | Curriculum | Notebook validation | Litter size | Hint sensitivity |
|---|---|---|---|---|
| **Curious** (default) | Lessons 1–13 | Loose → Medium | 6–8 | Fast (~4 wasted crosses) |
| **Student** | 1–35 | Medium | 4–6 | Standard (~8 wasted crosses) |
| **Researcher** | 1–54 | Strict (chi-square) | 4 | Sparse (~15 wasted crosses) |

Chosen at profile creation, changeable in settings. Lessons beyond a tier's cap are hidden but not deleted, so switching tiers reveals content without breaking saves.

## 6. World & organisms

**One species, one blob.** The blob's base form is a simple round creature. Each unlocked trait adds a visual layer (antennae, spots, horns, tail, coloration, patterns, size). The very first trait must be one that never gets more complex later; candidates: **presence/absence of a single dorsal fin, or antennae yes/no** (final choice deferred to prototype).

- Blobs have two sexes (M/F). Required for pairing.
- Players **name** their own collected blobs. Order-target blobs are unnamed.
- Blobs have age (used later for aging/lethality lessons) but don't die in the Curious tier.

## 7. Breeding mechanics

- Cross two compatible (M + F) blobs → **litter of 4–8** offspring drawn from the true probability distribution (including recombination, sex determination, mutation, imprinting, and any active environmental modifiers).
- Litter size scales with tier and can be tuned per lesson if a concept needs bigger samples to become clear.
- Every cross is logged in the notebook's **cross history** (parents' hypothesized genotypes, offspring phenotypes, timestamp).
- Offspring appear in a **litter reveal** view; player can name/claim any or all before they land in the stable.

## 8. The notebook (evidence-gated hypotheses)

**Per-creature card**
- One row per known trait, showing observed phenotype and a genotype-hypothesis input.
- A "solved" indicator lights up only when the entry is supported by real breeding evidence.
- Freeform notes per trait.

**Per-species Codex**
- Once a gene is solved anywhere, a reference card enters the Codex (allele symbols, inheritance model, canonical Punnett template).

**Tools inside the notebook**
- Punnett-square generator (drag two hypothesized genotypes).
- Cross history (all breedings with parents' hypotheses and offspring counts).
- Ratio panel (observed vs. expected under the current hypothesis).

**Validation strategies (per concept, per tier)**
- **Loose** — hypothesis is accepted if *consistent* with all observed offspring.
- **Medium** — must also include at least one "distinguishing" offspring (e.g., a recessive phenotype must have actually been bred before a parent can be called `Hh`).
- **Strict** — chi-square test on observed vs. expected ratios; accept when p > 0.05 with adequate sample size.

Validation is a strategy object registered per concept, not hard-coded in the notebook UI.

## 9. Glossary & Concept Codex

**Two tiers per term**
- **Overview card** — 2 short paragraphs, plain-language framing before the technical term, plus a one-line real-world example. Always visible when expanded in the accordion.
- **Full article** — opens in a sidebar, includes diagrams (SVG), examples, cross-references to related terms.

**In-lesson glossary panel**
- Pinned to the current lesson: terms this lesson introduces.
- Newly introduced terms pulse and carry a "NEW" tag.
- Every other unlocked term is available below, collapsed.

**Concept Codex screen**
- Browsable outside lessons.
- All unlocked terms indexed and searchable.
- Toggle between overview and full article.

Content is stored as MDX in `/content/glossary/`.

## 10. Lessons

**Structure of each lesson**
- `id`, `title`, `unlocks: { trait, glossaryTerms, orderTypes }`
- `intro` (MDX): brief framing + optional narrative hook
- `puzzle`: the mechanical challenge — usually a mystery creature or a target phenotype
- `pinnedGlossaryTerms: string[]`
- `validationStrategy: string` (which notebook validator gates completion)
- `hintScript: Hint[]` (escalating hints; see §13)
- `nextLessonId`

**Flow**
1. Player opens the lesson from the Lessons list.
2. Intro plays; glossary terms pin themselves to the sidebar.
3. Puzzle canvas presents starter blobs.
4. Player breeds, observes, fills notebook.
5. Once notebook validator accepts the required entries, "Next" button unlocks.
6. On completion: trait joins the shared pool (i.e., appears in shop offers going forward), glossary terms are permanently unlocked in the Codex, and new order types become available.

## 11. Orders & the character cast

**Orders** are the practice/economy layer. Each order is a job with:
- A `Character` (portrait + name + voice)
- A `target` (phenotype spec, optionally with declared genotype requirement, optionally with breeding-pair requirement)
- A `reward` (coins, occasionally a rare blob or a lesson unlock)
- A `deadline`? (deferred — probably no time pressure in Curious tier)
- A `difficulty` tag (1★ / 2★ / 3★) matching the three tiers of order:
  - **1★**: deliver one creature matching an exact phenotype
  - **2★**: deliver a creature matching phenotype AND declare its genotype
  - **3★**: deliver a breeding pair guaranteed to produce that phenotype

**Characters** are data (`content/characters/*.json`) with:
- Name, portrait key, one-line bio
- Voice (dialogue templates for order text and completion lines)
- Specialty (which concepts their orders tend to feature)
- Progression: unlocked as lessons are completed

Starting roster (design TBD, ~5 characters). Additional characters unlock over time.

## 12. Economy, shop, and stable

**Coins** — earned from completed orders, spent in shop.

**Shop**
- Rotating selection of blobs for sale.
- Each blob's advertised traits reflect only the phenotype (never the genotype).
- New listings become available only for traits the player has unlocked.
- Refreshes on a timer or for a coin cost.

**Stable**
- Storage cap starts at **25 blobs**, grows as new traits are unlocked (proposed formula: `25 + 2 × unlockedTraitCount`).
- Player can filter/sort by trait, sex, age, phenotype, notebook status ("solved" indicator).
- Selling a blob returns coins based on rarity of its traits (approximation, not perfect market).
- Releasing (not selling) is free and instant.

## 13. Hint system

- Tracks "breeds since last notebook progress on the active lesson."
- After the tier's threshold (Curious ≈ 4, Student ≈ 8, Researcher ≈ 15), the "Stuck?" button lights up.
- Hints are per-lesson data with three escalation stages:
  1. **Reframe** — restate the question in different words, ask what the player expects.
  2. **Point** — identify which trait row or which cross would be most informative.
  3. **Suggest** — recommend the specific cross to try, without revealing outcomes.
- Never reveals genotype answers directly.

## 14. Full curriculum (54 concepts)

### Tier "Curious" — lessons 1–13
Core Mendelian → intro molecular.

1. Simple dominance
2. Punnett squares & test crosses
3. Independent assortment
4. Incomplete dominance
5. Codominance
6. Multiple alleles
7. Sex-linked inheritance
8. Linked genes & recombination
9. Epistasis
10. Polygenic / quantitative traits
11. Environmental influence & penetrance
12. Population genetics (Hardy-Weinberg)
13. Mutations & pedigrees

### Tier "Student" — adds lessons 14–35

**14–23 Additional inheritance patterns**
14. Lethal alleles
15. Pleiotropy
16. Sex-influenced traits
17. Sex-limited traits
18. Mitochondrial / maternal inheritance
19. Genomic imprinting
20. X-inactivation / mosaicism
21. Modifier genes
22. Anticipation (repeat expansion)
23. Alternative sex-determination systems (ZW, haplodiploid, temperature-dependent)

**24–26 Chromosomal aberrations**
24. Nondisjunction
25. Deletions and duplications
26. Translocations and inversions

**27–35 Evolutionary genetics**
27. Genetic drift
28. Founder effect / bottleneck
29. Gene flow / migration
30. Natural selection
31. Balancing selection (heterozygote advantage)
32. Sexual / assortative mating
33. Inbreeding depression
34. Hybrid vigor (heterosis)
35. Speciation

### Tier "Researcher" — adds lessons 36–54

**36–40 Quantitative & statistical**
36. Heritability (h²) & breeder's equation
37. QTL mapping
38. Norm of reaction
39. Three-point cross / linkage mapping
40. Threshold traits

**41–47 Molecular & epigenetic**
41. Mutation types (point / silent / missense / nonsense / frameshift)
42. Epigenetics (DNA methylation)
43. Transgenerational epigenetic inheritance
44. Gene regulation / operons
45. Transposable elements
46. Copy number variation
47. Chimeras & mosaics

**48–54 Capstone & applied**
48. CRISPR / gene editing (player tool)
49. Cancer genetics (accumulated somatic mutations)
50. Conservation genetics
51. GWAS / personal genomics
52. Phylogenetics / molecular clock
53. Horizontal gene transfer
54. Prions

## 15. Data model

The load-bearing decision: one schema expresses every mode.

```ts
Species {
  id: string
  name: string
  chromosomes: Chromosome[]      // positions enable linkage/recombination
  sexSystem: 'XY' | 'ZW' | 'XO' | 'haplodiploid' | 'temperatureDependent'
  genes: Gene[]
  traits: Trait[]
  environment?: EnvironmentModifiers
}

Gene {
  id: string
  name: string
  chromosome: string             // 'autosome-1' | 'X' | 'mt' | ...
  locus: number                  // cM position
  alleles: Allele[]
  inheritanceModel:
    | 'simpleDominant'
    | 'incompleteDominant'
    | 'codominant'
    | 'multipleAllele'
    | 'sexLinked'
    | 'polygenic'
    | 'epistaticModifier'
    | 'imprinted'
    | 'mitochondrial'
    | 'lethal'
    | 'modifier'
    | 'pleiotropic'
  expressesTraits: string[]      // >1 for pleiotropy
  epistasisRules?: EpistasisRule[]
  imprintOrigin?: 'maternal' | 'paternal'
  lethalGenotypes?: string[]
  mutationRate?: number
}

Allele {
  symbol: string                 // 'A', 'a', 'IA', 'IB', 'i', ...
  expressionRank: number         // used for dominance ordering
  effect: TraitEffect            // additive/dominant/color-mix specification
}

Trait {
  id: string
  name: string
  category: 'visible' | 'chemical' | 'behavioral'
  phenotypeFromGenotype(genotype, environment?, sex?): PhenotypeValue
  renderHints: RenderSpec         // which SVG layer, parameters
}

Creature {
  id: string
  speciesId: string
  ownerName?: string             // player-given; absent on order-targets
  sex: 'M' | 'F'                 // interpreted per species sexSystem
  genotype: Genotype             // 2 alleles per gene per chromosome pair
  methylation?: MethylationState // epigenetics layer
  age: number
  birthCross?: CrossId
}
```

Creature phenotype is **always computed**, never stored.

## 16. Screens & UI shell

- **Stable** — grid of player's named blobs; filter/sort/sell/release.
- **Breeding Room** — pick M + F, litter reveal, offspring claiming.
- **Creature Detail / Notebook** — trait rows, hypotheses, Punnett tool, cross history, ratio panel, freeform notes.
- **Character Board (Orders)** — cards from client characters with active orders.
- **Character Profile** — flavor and progression history.
- **Lessons** — campaign list; each lesson opens to puzzle canvas + pinned glossary + hint button.
- **Concept Codex** — all unlocked glossary terms; overview / full article toggle.
- **Shop** — refreshing selection of purchasable blobs.
- **Settings** — difficulty tier, save/export, audio, etc.

## 17. Tech stack

- **React 18 + TypeScript**, built with **Vite**, deployed to GitHub Pages via `gh-pages` branch.
- **Zustand** for state, with `persist` middleware → `localStorage`.
- **Tailwind CSS** for styling (fast iteration, good defaults, easy theming).
- **Framer Motion** for litter-reveal and hint animations.
- **MDX** for glossary articles and lesson intros.
- **Vitest** for the genetics engine (pure functions, no DOM).
- **Playwright** (optional, later) for UI smoke tests.
- No backend. No accounts. Everything client-side.

## 18. Repository layout

```
/
├── docs/
│   └── DESIGN.md                 ← this file
├── public/                       ← static assets (favicon, images)
├── src/
│   ├── engine/                   ← pure genetics library (no React imports)
│   │   ├── types.ts
│   │   ├── cross.ts              ← meiosis, recombination, sex determination
│   │   ├── phenotype.ts          ← genotype → phenotype
│   │   ├── validators/           ← notebook validation strategies
│   │   └── __tests__/
│   ├── content/                  ← game data (species, genes, lessons, glossary, characters)
│   │   ├── species/blob.json
│   │   ├── genes/*.json
│   │   ├── traits/*.json
│   │   ├── lessons/*.json (+ .mdx for intros)
│   │   ├── glossary/*.mdx
│   │   └── characters/*.json
│   ├── state/                    ← Zustand stores
│   ├── ui/                       ← React components
│   │   ├── stable/
│   │   ├── breeding/
│   │   ├── notebook/
│   │   ├── lessons/
│   │   ├── orders/
│   │   ├── shop/
│   │   └── shared/
│   ├── renderer/                 ← layered SVG creature renderer + layer registry
│   ├── app/                      ← routing, layout, providers
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .github/workflows/deploy.yml  ← GitHub Actions → gh-pages
```

## 19. Build roadmap

| Phase | Delivers | Curriculum |
|---|---|---|
| **0** | Genetics engine + Vitest tests (Punnett, meiosis with recombination, epistasis stub, imprinting stub, lethality, mitochondrial) | none (invisible) |
| **1 (MVP)** | Stable, Breeding Room, Notebook (loose/medium validation), one character with orders, save/load, glossary shell | Lessons 1–3 |
| **2** | Lessons 4–7, shop with unlockable traits, order tier 2 (declare genotype), 3 characters | Lessons 4–7 |
| **3** | Lessons 8–13, order tier 3, hint system, difficulty tier toggle | 8–13 (finishes Curious) |
| **4** | Lessons 14–35 in batches (patterns → aberrations → popgen), full character roster | Student tier complete |
| **5** | Molecular + epigenetic subsystems (methylation state, mutation events, cell-level renderer for mosaics) | Lessons 36–47 |
| **6** | Capstone content (CRISPR, cancer minigame, phylogenetic viewer, GWAS analyzer) | Lessons 48–54 |

**Phase 1 exit criteria:** a new player can open the game, complete Lesson 1 (simple dominance) from scratch without external help, use the notebook correctly, earn coins from one order, and see their progress persist across browser refresh.

## 20. Extensibility guardrails

- **Content is data.** Species, genes, traits, lessons, glossary, characters — all `/content/` files.
- **Engine is pure.** Zero React or DOM imports. Fully unit-tested.
- **Validators are strategies.** One per concept; swappable per tier.
- **Hint scripts are data.** Per-lesson JSON, not code.
- **Renderer is a layer registry.** New traits register a rendering function; existing creatures are untouched.
- **Top-level state machine** orchestrates screens; economy can be replaced without touching lessons or engine.

## 21. Open questions & deferred decisions

- **First trait choice** — antennae vs. dorsal fin vs. something else. Decide during Phase 1 SVG design.
- **Order deadlines** — do orders expire? Probably not in Curious tier. Revisit for Student/Researcher.
- **Starter character** — who is the first person the player meets? Needs writing/voice pass.
- **Storage-cap growth formula** — `25 + 2 × unlockedTraitCount` is a placeholder; validate during Phase 3.
- **Achievements / cosmetics** — deferred to Phase 4+.
- **Localization** — English only for v1; content files structured so translation is possible later.
- **Accessibility** — colorblind-safe palettes for color-based traits (introduce at Lesson 4).
