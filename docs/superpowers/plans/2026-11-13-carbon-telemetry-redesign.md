# Carbon Telemetry Dark Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign CuberLab ID's WebCube landing page into a spacious Carbon Telemetry Dark (`#07080A` / `#0C0E14`) experience with Electric Volt (`#C8FF2E`) single accent and distinct scroll choreography across all 6 sections.

**Architecture:** Expand page containers to `max-w-[1400px]` with full-bleed alternating tonal bands (`bg-canvas` vs `bg-band`), remove cramped card-in-card nesting, and differentiate every section's scroll layout (free-floating 3D hero + marquee, sticky scrollytelling engineering index, 2-column wide editorial catalog cards, full-bleed 12-column timer cockpit, asymmetric 6/6 reviews-and-FAQ split, and full-bleed closing statement). Preserve 100% of Three.js WebGL cube physics, isometric SVG anatomy plates, and WCA timer logic.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (`@theme`), Framer Motion 14, Three.js, Lucide React, Vite 7.

## Global Constraints

- **Palette Lock:** Cool Carbon Telemetry Dark (`--color-canvas: #07080A`, `--color-band: #0C0E14`, `--color-surface: #12151E`, `--color-surface-hover: #171B26`, `--color-well: #0E1118`, `--color-well-subtle: #1A1F2B`, `--color-border: #1E2330`, `--color-border-strong: #30384D`, `--color-ink: #F4F6FA`, `--color-ink-secondary: #94A3B8`, `--color-ink-muted: #5E6A82`).
- **Single Primary Accent:** Electric Volt (`--color-accent: #C8FF2E`, `--color-accent-ink: #07080A`, `--color-accent-soft: rgba(200, 255, 46, 0.10)`). Semantic signals (`#EF4444` red, `#22C55E` green) reserved strictly for hardware telemetry states and WCA timer holding/ready feedback.
- **Anti-Slop Rules:** Zero emojis, zero em-dashes (`—`), zero rainbow gradients or neon blurs, zero `transition: all`, GPU-composited animations (`transform`/`opacity`) only, and full `prefers-reduced-motion` support.
- **Preserved Functionality:** Keep all Three.js `createCubeEngine` controls, `MagLevAnatomy` & `BallCoreAnatomy` interactive SVG cutaways, `CatalogSection` filtering & expandable specs, and `TimerSection` spacebar/touch chronometer + PB/Ao5 + voucher claim intact.
- **Verification:** `npx tsc --noEmit` and `npm run build` must pass cleanly after changes.

---

### Task 1: Design Tokens, Surface Atmosphere, Navbar Scroll Telemetry & SectionHeader

**Files:**
- Modify: `index.html:10`
- Modify: `src/index.css:1-488`
- Modify: `src/components/Navbar.tsx:1-93`
- Modify: `src/components/SectionHeader.tsx:1-49`

**Interfaces:**
- Produces CSS custom properties and utility classes in `src/index.css`: `bg-canvas`, `bg-band`, `bg-surface`, `bg-surface-hover`, `bg-well`, `bg-well-subtle`, `border-border`, `border-border-strong`, `text-ink`, `text-ink-secondary`, `text-ink-muted`, `text-accent`, `bg-accent`, `text-accent-ink`, `bg-accent-soft`, `.telemetry-grid`, `.btn-accent`, `.btn-primary`, `.btn-ghost`, `.animate-marquee`.
- Preserves `--color-vermilion`, `--color-blue`, `--color-green` tokens mapped harmoniously so `MagLevAnatomy.tsx` and `BallCoreAnatomy.tsx` render cleanly without breakage.
- Preserves `Navbar` and `SectionHeader` named exports.

- [ ] **Step 1: Update `index.html` theme color**

In `index.html`, update line 10:
```html
<meta name="theme-color" content="#07080A" />
```

- [ ] **Step 2: Update `src/index.css` with Carbon Telemetry Dark tokens, dot-grid atmosphere, Electric Volt button classes, and marquee keyframes**

Update `@theme` and `:root` tokens in `src/index.css`:
- `--color-canvas: #07080A`
- `--color-band: #0C0E14`
- `--color-surface: #12151E`
- `--color-surface-hover: #171B26`
- `--color-well: #0E1118`
- `--color-well-subtle: #1A1F2B`
- `--color-border: #1E2330`
- `--color-border-strong: #30384D`
- `--color-ink: #F4F6FA`
- `--color-ink-secondary: #94A3B8`
- `--color-ink-muted: #5E6A82`
- `--color-accent: #C8FF2E`
- `--color-accent-ink: #07080A`
- `--color-accent-soft: rgba(200, 255, 46, 0.10)`
- `--color-vermilion: #EF4444` (mapped to crisp telemetry signal red for holding/friction states and existing anatomy plates)
- `--color-vermilion-soft: #261215`
- `--color-vermilion-deep: #DC2626`
- `--color-blue: #38BDF8`
- `--color-blue-soft: #0C2333`
- `--color-green: #C8FF2E` (or keep `#22C55E` for verified/ready signal green and use `accent` for Electric Volt!) -> Keep `--color-green: #22C55E` and `--color-green-soft: #0D2618` for semantic green telemetry, and use `--color-accent: #C8FF2E` for primary Volt CTA/highlights.
- Update `--anatomy-*` palette to match Carbon Telemetry Slate (`--anatomy-card: #0E1118`, `--anatomy-paper: #0E1118`, `--anatomy-face: #151923`, `--anatomy-top: #1D2230`, `--anatomy-shade-0: #090B10`, `--anatomy-shade-1: #0E1118`, `--anatomy-shade-2: #141822`, `--anatomy-shade-3: #1A1F2C`, `--anatomy-lit-top: #262E40`, `--anatomy-lit-shade: #1F2636`, `--anatomy-hi: #E2E8F0`, `--anatomy-mid: #64748B`, `--anatomy-lo: #334155`, `--anatomy-faint: #1E293B`, `--anatomy-lit: #F8FAFC`, `--anatomy-halo: #050608`).
- Add `.btn-accent` class:
```css
.btn-accent {
  background-color: var(--color-accent);
  color: var(--color-accent-ink);
  border: 1px solid var(--color-accent);
  white-space: nowrap;
  transition: transform 120ms ease, filter 150ms ease;
}
.btn-accent:hover {
  filter: brightness(1.06);
}
.btn-accent:active {
  transform: scale(0.98);
}
```
- Add `.telemetry-grid` subtle background pattern and `@keyframes telemetry-marquee` animation:
```css
.telemetry-grid {
  background-image: radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px);
  background-size: 28px 28px;
}

@keyframes telemetry-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

.animate-marquee {
  animation: telemetry-marquee 32s linear infinite;
}
```
- Ensure focus rings use `var(--color-accent)`.

- [ ] **Step 3: Redesign `src/components/Navbar.tsx`**

Replace the cramped floating pill (`max-w-4xl rounded-full`) with a full-width ultra-slim telemetry header (`fixed top-0 inset-x-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-xl`):
- Inner container: `mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-10`.
- Brand button: `CuberLab` + Electric Volt dot `<span className="text-accent">.</span>`.
- Desktop nav links (`NAV_LINKS`) with crisp hover state (`hover:text-ink hover:bg-surface`).
- Right CTA: `btn-accent` (`Pesan WA`) + mobile menu toggle.
- Bottom edge scroll-progress bar using Framer Motion `useScroll()` and `useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 })` rendered as `<motion.div style={{ scaleX }} className="origin-left h-[1.5px] w-full bg-accent" />`.

- [ ] **Step 4: Update `src/components/SectionHeader.tsx`**

Support spacious left-aligned & center-aligned headers with Electric Volt status indicator dot (`bg-accent`), tighter display tracking (`tracking-[-0.03em]`), and wider max-width (`max-w-2xl`) without boxed pill clutter.

- [ ] **Step 5: Verify build & TypeScript**

Run: `npx tsc --noEmit`
Expected: PASS (0 errors).

- [ ] **Step 6: Commit Task 1**

```bash
git add index.html src/index.css src/components/Navbar.tsx src/components/SectionHeader.tsx
git commit -m "feat: apply Carbon Telemetry Dark tokens and full-width Navbar"
```

---

### Task 2: Full-Bleed Asymmetric Hero, Unboxed 3D Rubik Stage & Telemetry Marquee

**Files:**
- Modify: `src/components/CubeStage.tsx:1-127`
- Modify: `src/components/Hero.tsx:1-88`
- Create: `src/components/TelemetryMarquee.tsx`
- Modify: `src/components/index.ts:1-9`
- Modify: `src/App.tsx:1-23`

**Interfaces:**
- Consumes CSS tokens and `.btn-accent`, `.btn-ghost`, `.telemetry-grid`, `.animate-marquee` from `src/index.css`.
- Consumes `createCubeEngine` from `../engine/cubeEngine`.
- Produces `TelemetryMarquee` exported from `src/components/index.ts`.

- [ ] **Step 1: Redesign `src/components/CubeStage.tsx` as an unboxed 3D showcase**

Remove the enclosing `rounded-3xl border border-border bg-surface shadow-lg` card wrapper so the 3D Rubik's cube floats freely in space:
- Container: `relative h-[440px] sm:h-[540px] lg:h-[620px] w-full flex items-center justify-center`.
- Behind canvas: subtle radial Volt + slate spotlight (`radial-gradient(circle at 50% 48%, rgba(200, 255, 46, 0.09) 0%, rgba(56, 189, 248, 0.04) 32%, transparent 68%)`) and a faint geometric crosshair reticle SVG (`pointer-events-none opacity-25`).
- Top-right minimal live telemetry pill (`border border-border bg-surface/80 backdrop-blur-md`) showing green ping + `status` + `"Drag 3D"`.
- Keep Three.js `mountRef` full-bleed `absolute inset-0 z-10 cursor-grab active:cursor-grabbing`.
- Bottom floating glass control dock (`border border-border bg-surface/85 backdrop-blur-md rounded-full p-1.5 shadow-xl`) with the 4 buttons (`Slice Twist`, `Scramble`, `Auto-Align 45°`, `UV Gloss / Matte`), highlighting active/hover states cleanly with `hover:text-accent`.

- [ ] **Step 2: Redesign `src/components/Hero.tsx` as a `min-h-[100dvh]` full-bleed 12-column split**

- Section wrapper: `relative min-h-[100dvh] flex flex-col justify-center pt-20 pb-10 overflow-hidden telemetry-grid`.
- Inner container: `mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-10`.
- 12-column asymmetric split (`grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6`):
  - **Left (`lg:col-span-5`):**
    - Top minimal badge: Volt pulse dot + `"FLAGSHIP STORE 2026"` + `"Free Setup & Garansi Tuning"`.
    - Display H1 (`text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-extrabold tracking-[-0.035em] leading-[1.03] text-ink`): `"Kecepatan Murni."` + `<span className="text-accent">Nol Gesekan.</span>`.
    - Lede paragraph (`max-w-lg text-base sm:text-lg text-ink-secondary`).
    - Action buttons: primary `btn-accent` (`Pesan via WhatsApp`) + secondary `btn-ghost` (`Lihat Katalog Flagship`).
    - Compact monospace telemetry spec strip (`76 Neodymium Core` / `0% Pegas Logam` / `45° Auto-Align`) separated by crisp hairline dividers.
  - **Right (`lg:col-span-7`):** `<CubeStage />` unconstrained without outer borders.
- Bottom trust bar (`mt-8 pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-secondary`) with the 3 store guarantees + subtle scroll cue (`"Scroll untuk eksplorasi"`).

- [ ] **Step 3: Create `src/components/TelemetryMarquee.tsx` and export in `src/components/index.ts` + render in `src/App.tsx`**

Create `src/components/TelemetryMarquee.tsx`:
- Full-bleed band (`w-full overflow-hidden border-y border-border bg-band py-4 select-none`) rendering two duplicated horizontal rows of monospace telemetry specs (`76 NEODYMIUM CORE`, `MAGLEV REPULSION -68% FRICTION`, `20-MAGNET BALL-CORE 45° SNAP`, `FREE SILICONE LUBE SETUP`, `55° CORNER CUTTING`, `GARANSI TUNING RESMI`) separated by Electric Volt diamond/dot markers inside an `.animate-marquee` flex track (`w-max flex items-center`).
- Export `TelemetryMarquee` from `src/components/index.ts`.
- Render `<TelemetryMarquee />` immediately after `<Hero />` in `src/App.tsx`.

- [ ] **Step 4: Verify TypeScript & build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/components/CubeStage.tsx src/components/Hero.tsx src/components/TelemetryMarquee.tsx src/components/index.ts src/App.tsx
git commit -m "feat: redesign full-bleed split Hero, unboxed 3D CubeStage, and TelemetryMarquee"
```

---

### Task 3: Sticky Scrollytelling Rekayasa Section (`BentoSection.tsx`)

**Files:**
- Modify: `src/components/BentoSection.tsx:1-409`

**Interfaces:**
- Preserves `export function BentoSection()` and `#fitur` anchor id.
- Preserves `MagLevAnatomy` and `BallCoreAnatomy` props & interactions (`mode`, `locked`, `onToggleLock`).
- Preserves `STYLE_PROFILES`, `TENSION_LEVELS`, `TRAVEL_LEVELS` imports from `../data/content`.

- [ ] **Step 1: Replace the 4 boxed bento grid cards with a `max-w-[1400px]` Sticky Scrollytelling 12-column split**

- Section container: `id="fitur"` with `mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 py-24 lg:py-32`.
- 12-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start`):
  - **Left Column (`lg:col-span-4 lg:sticky lg:top-28`):**
    - Uses `SectionHeader` (`badge="01 // Rekayasa Presisi"`, `title="Fisika Tanpa Gesekan"`, `align="left"`).
    - Renders an interactive **Chapter Telemetry Index** (`01 Dual-Repulsion MagLev`, `02 20-Magnet Ball-Core`, `03 Corner Cutting 55°`, `04 GES Pro+ Tuning Matrix`) tracked via `IntersectionObserver` (`activeChapter` state). Active chapter shows Electric Volt index number, subtle left bar (`layoutId="engineering-chapter"`), and clicking scrolls smoothly to that module's `id`.
  - **Right Column (`lg:col-span-8 space-y-10`):**
    - Renders each of the 4 modules (`MagLevModule`, `BallCoreModule`, `CornerCuttingModule`, `TuningModule`) as spacious full-width architectural showcase panels (`rounded-2xl border border-border bg-surface p-6 sm:p-10`) with `motion.article` scroll-reveal (`initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}`).
    - Remove unnecessary nested card borders inside modules; use clean 1px horizontal/vertical hairline dividers and generous spacing.
    - Keep `MagLev` active toggle styled with `bg-accent text-accent-ink`, `Meter` bars using `bg-accent` / `bg-signal-green` / `bg-blue` cleanly, `BallCoreAnatomy` interactive snap, `CornerCutting` CFOP/Roux/ZZ profile tabs (`bg-accent text-accent-ink`) + live animated TPS readout, and `Tuning` 6-level Tension & Travel selectors (`bg-accent text-accent-ink`) + quick presets + speed/control meters.

- [ ] **Step 2: Verify TypeScript & build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit Task 3**

```bash
git add src/components/BentoSection.tsx
git commit -m "feat: redesign Rekayasa section with sticky scrollytelling chapter index"
```

---

### Task 4: Wide 2-Column Editorial Catalog Runway (`CatalogSection.tsx`)

**Files:**
- Modify: `src/components/CatalogSection.tsx:1-239`

**Interfaces:**
- Preserves `export function CatalogSection()` and `#katalog` anchor id.
- Consumes `CATEGORY_TABS`, `PRODUCTS` from `../data/products` and `WA_NUMBER`, `formatRupiah` from `../data/content`.

- [ ] **Step 1: Replace the cramped 4-column card grid with `max-w-[1400px]` asymmetric header + 2-column wide split cards**

- Section container: `id="katalog"` with `border-t border-border py-24 lg:py-32 px-4 sm:px-8 lg:px-10`, inner `mx-auto max-w-[1400px]`.
- **Top Asymmetric Header:** Flex/grid row putting `SectionHeader` (`badge="02 // Katalog Flagship"`, `title="Rubik Pilihan Juara"`, `align="left"`, `className="mb-0"`) on the left, and the category filter tabs (`CATEGORY_TABS`) on the right with Framer Motion `layoutId="catalog-tab"` Electric Volt active indicator (`bg-accent text-accent-ink`).
- **Wide 2-Column Product Grid (`grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12`):**
  - Each `ProductCard` renders as a spacious horizontal split (`rounded-2xl border border-border bg-surface overflow-hidden hover:border-border-strong transition-colors`) wrapped in `motion.article` with staggered `whileInView` reveal:
    - **Left Studio Chamber (`sm:col-span-5` inside `grid sm:grid-cols-12`):** Recessed `bg-well` chamber with subtle product-colored radial glow (`product.aura` at low opacity), top badges (`product.badge` + `product.category`), and centered large `IsoCube` (`h-36 w-36 sm:h-40 sm:w-40`) with hover scale.
    - **Right Spec & Action Panel (`sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between`):**
      - Product name, tagline, and 3 crisp hairline spec rows (`Core`, `Bobot`, `Finishing` in `font-mono text-xs`).
      - Bottom pricing & actions: Price (`font-mono text-2xl font-extrabold text-ink`), strike-through price, `"Hemat X%"` badge in `bg-accent-soft text-accent`, primary `btn-accent` WhatsApp CTA (`Pesan via WhatsApp`), and expandable `"Lihat Spesifikasi Lengkap"` drawer (`AnimatePresence`).

- [ ] **Step 2: Verify TypeScript & build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit Task 4**

```bash
git add src/components/CatalogSection.tsx
git commit -m "feat: redesign CatalogSection into wide 2-column editorial split cards"
```

---

### Task 5: Full-Bleed WCA Timer Cockpit, Reviews & FAQ Split, and Closing Footer

**Files:**
- Modify: `src/components/TimerSection.tsx:1-360`
- Modify: `src/components/ReviewsFaqSection.tsx:1-119`
- Modify: `src/components/Footer.tsx:1-152`

**Interfaces:**
- Preserves `TimerSection`, `ReviewsFaqSection`, `Footer` exports and `#timer` / `#testimoni` anchor ids.
- Preserves full WCA scramble generation, `requestAnimationFrame` timer loop, Spacebar listener (`inViewRef`), PB/Ao5 calculation, and `SUB10CUBER` WhatsApp voucher claim.

- [ ] **Step 1: Redesign `src/components/TimerSection.tsx` as a Full-Bleed Telemetry Cockpit**

- Section wrapper: `id="timer"` on a **full-bleed contrast band** (`border-y border-border bg-band py-24 lg:py-32 px-4 sm:px-8 lg:px-10`).
- Inner container: `mx-auto max-w-[1400px]`.
- Header: Left-aligned `SectionHeader` (`badge="03 // WCA Tournament Timer"`, `title="Uji Kecepatan Putaranmu"`, `align="left"`).
- **12-Column Cockpit Grid (`grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch`):**
  - **Left Chronometer Arena (`lg:col-span-8 rounded-2xl border border-border bg-canvas p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden`):**
    - Reactive radial ambient glow behind digits (`opacity` / `background` shifting smoothly by `phase`: holding = red tint, ready = Electric Volt `rgba(200,255,46,0.14)`, running = subtle cyan tint).
    - Top WCA Scramble Bar (`rounded-xl border border-border bg-well px-4 py-3 flex items-center justify-between gap-3`) with scramble string, Copy button, and Re-scramble button.
    - Interactive Timer Pad (`onMouseDown`, `onMouseUp`, `onTouchStart`, `onTouchEnd`) with oversized tabular-nums digits (`font-mono text-6xl sm:text-8xl lg:text-[116px] font-black tracking-tight leading-none`, `holding` -> `text-vermilion`, `ready` -> `text-accent`, `running`/`idle` -> `text-ink`), status dot & hint pill, and manual Start/Stop button (`btn-accent` when idle, `bg-vermilion text-white` when running).
  - **Right Telemetry Sidebar (`lg:col-span-4 flex flex-col justify-between gap-5`):**
    - 2x2 grid of stat tiles (`Terbaik (PB)`, `Average of 5`, `Solve Terakhir`, `Total Solves`) in `rounded-2xl border border-border bg-surface p-5`.
    - Recent solves strip (`Riwayat Terakhir`, up to 5 solves shown as `font-mono` chips when `solves.length > 0`).
    - Dynamic Recommendation & `SUB10CUBER` Voucher Claim (`AnimatePresence`) styled cleanly with `border-accent/40 bg-accent-soft` and `btn-accent` CTA button.

- [ ] **Step 2: Redesign `src/components/ReviewsFaqSection.tsx` as an Asymmetric 6/6 Split**

- Section wrapper: `id="testimoni"` with `mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 py-24 lg:py-32`.
- 12-column asymmetric split (`grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start`):
  - **Left (`lg:col-span-6`):**
    - `SectionHeader` (`badge="04 // Ulasan & FAQ"`, `title="Dipercaya Komunitas Speedcube"`, `align="left"`).
    - Editorial review list (`divide-y divide-border border-y border-border`) — replaces 3 narrow cards with generous pull-quotes (`text-base sm:text-lg leading-relaxed text-ink`), Electric Volt 5-star icons, monospace PB badge, and verified cuber attribution, each wrapped in `motion.article` with `whileInView` reveal.
  - **Right (`lg:col-span-6 lg:sticky lg:top-28`):**
    - FAQ header (`Pertanyaan yang Sering Diajukan`) + hairline accordion (`divide-y divide-border border-y border-border`) with smooth `AnimatePresence` height transition and `bg-accent text-accent-ink` open indicator icon.

- [ ] **Step 3: Redesign `src/components/Footer.tsx` with Full-Bleed Closing Statement Band**

- **Closing Statement Band (`border-t border-border bg-band py-24 lg:py-32 px-4 sm:px-8 lg:px-10 relative overflow-hidden`):**
  - Subtle radial Electric Volt spotlight at top center (`pointer-events-none`).
  - `max-w-[1400px]` centered editorial closing statement: badge, massive headline (`Siap cetak personal best baru minggu ini?`), concise subtext, `btn-accent` (`Pesan via WhatsApp`) + `btn-ghost` (`Lihat Katalog Flagship`), and hairline 4-item trust strip.
- **Architectural Footer (`border-t border-border bg-canvas py-16 px-4 sm:px-8 lg:px-10`):**
  - `max-w-[1400px]` 12-column grid with brand credentials + online status indicator, navigation links, and 6 official marketplace/social channels.

- [ ] **Step 4: Run full TypeScript & Vite production build verification**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS with zero warnings/errors.

- [ ] **Step 5: Commit Task 5**

```bash
git add src/components/TimerSection.tsx src/components/ReviewsFaqSection.tsx src/components/Footer.tsx
git commit -m "feat: redesign Timer cockpit, Reviews/FAQ split, and full-bleed Footer"
```
