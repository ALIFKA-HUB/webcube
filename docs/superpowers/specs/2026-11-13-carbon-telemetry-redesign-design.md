# CuberLab ID · Carbon Telemetry Dark & Cinematic Full-Bleed Redesign Spec

**Date:** 2026-11-13
**Project:** WebCube (CuberLab ID Flagship Speedcube Store)
**Direction:** Carbon Telemetry Dark + Electric Volt (`#C8FF2E`) + Cinematic Full-Bleed Scroll Showcase

---

## 1. Design Problem & Objectives

### Current Issues Identified
1. **Cramped spatial pacing:** Content is trapped in narrow containers (`max-w-4xl` for CubeStage, `max-w-3xl` for Timer, `lg:grid-cols-4` skinny ~280px product cards) with heavy nested boxes (`rounded-3xl` card -> `rounded-2xl` well -> `rounded-xl` sub-box).
2. **Repetitive scroll rhythm:** Every section follows the identical `py-20` -> centered `SectionHeader` -> boxed grid template with minimal scroll choreography.
3. **Fragmented color palette:** Pure `#09090b` canvas feels flat, while UI chrome mixes three competing accents (`vermilion`, `sky blue`, `green`) alongside the 6 vibrant colors on the 3D Rubik's cube.

### Target Experience
- **Spacious, breathing layout:** Expand main grids to `max-w-[1400px]` with full-bleed `100vw` alternating tonal bands, `min-h-[100dvh]` full-viewport hero, and unboxed/borderless stage elements where elevation is needed only for functional controls.
- **Distinct scroll experience per section:** Each section introduces a distinct spatial rhythm and scroll-driven interaction (free-floating 3D hero + telemetry marquee, sticky scrollytelling index, 2-column wide editorial catalog cards, full-bleed telemetry timer cockpit, asymmetric 50/50 reviews-and-FAQ split, and full-bleed closing statement).
- **Unified palette:** Cool Carbon Telemetry Dark base with **Electric Volt (`#C8FF2E`)** as the single sharp accent (keeping semantic green/red strictly for timer holding/ready states and hardware telemetry readouts).

---

## 2. Color System & Surface Tokens (`src/index.css`)

Single cool-carbon neutral family with Electric Volt accent:

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--color-canvas` | `#07080A` | Primary page background (Deep Carbon) |
| `--color-band` | `#0C0E14` | Full-bleed alternating section bands (Timer Cockpit, Marquee) |
| `--color-surface` | `#12151E` | Interactive modules, wide catalog split cards |
| `--color-surface-hover` | `#171B26` | Interactive card hover state |
| `--color-well` | `#0E1118` | Recessed telemetry pads, scramble bar, stat wells |
| `--color-well-subtle` | `#1A1F2B` | Subtle hover fill inside recessed wells |
| `--color-border` | `#1E2330` | Primary 1px hairline dividers and frames |
| `--color-border-strong` | `#30384D` | Focused / hovered 1px borders |
| `--color-ink` | `#F4F6FA` | Primary headings, body emphasis, active controls |
| `--color-ink-secondary` | `#94A3B8` | Supporting descriptions |
| `--color-ink-muted` | `#5E6A82` | Technical metadata, mono labels, captions |
| `--color-accent` | `#C8FF2E` | Primary single accent: Electric Volt (CTAs, active telemetry, scroll progress) |
| `--color-accent-ink` | `#07080A` | Dark ink placed on `#C8FF2E` buttons/badges for AAA contrast |
| `--color-accent-soft` | `rgba(200, 255, 46, 0.10)` | Subtle Volt tint for active badges & glow halos |
| `--color-signal-red` | `#EF4444` | Timer `holding` state & high-friction spring indicator |
| `--color-signal-green` | `#22C55E` | Timer `ready` state & verified/stock badge |

### Surface Texture & Atmosphere
- Subtle fixed pointer-events-none radial ambient vignette + faint architectural dot-grid / micro-noise overlay on `canvas` and `band` layers so dark surfaces have physical depth without neon rainbow blobs.
- Update `<meta name="theme-color" content="#07080A" />` in `index.html`.

---

## 3. Typography & Motion Standards

- **Font Stack:** `Plus Jakarta Sans` (display & UI body, tight negative tracking `-0.03em` on headlines) + `JetBrains Mono` (`tabular-nums` for chronometer, prices, TPS counters, WCA scrambles, and chapter indices).
- **Motion Discipline:**
  - All scroll/hover animations use GPU-composited `transform` and `opacity` only (zero `transition: all`, zero layout thrashing).
  - Respect `prefers-reduced-motion`.
  - Scroll choreography powered by Framer Motion (`useScroll`, `useTransform`, `useSpring`, `whileInView` with `viewport={{ once: true, amount: 0.2 }}`).

---

## 4. Section-by-Section Layout Architecture

### 4.0 Navbar (`src/components/Navbar.tsx`)
- Full-width sleek top telemetry bar (`fixed top-0 inset-x-0 z-50 h-16 bg-canvas/80 backdrop-blur-xl border-b border-border`) instead of a cramped floating pill.
- Inner container `max-w-[1400px]` aligning brand mark (`CuberLab.`), navigation links with active/hover states, and primary Electric Volt CTA (`Pesan WA`).
- **Scroll Progress Line:** A `1.5px` Electric Volt bar pinned to the bottom edge of the navbar driven by `useScroll()` + `useSpring()`.

### 4.1 Section 1 · Full-Bleed Split Hero & Free-Floating 3D Cube (`Hero.tsx`, `CubeStage.tsx`)
- **Viewport:** `min-h-[100dvh]` flex/grid layout inside `max-w-[1400px]` with generous breathing room (`pt-24 pb-12`).
- **Left Column (`lg:col-span-5`):**
  - Minimal telemetry pill (`FLAGSHIP STORE 2026 // FREE SETUP LUBE`).
  - Monumental left-aligned headline (`clamp(2.75rem, 5vw, 4.75rem)`): `"Kecepatan Murni. Nol Gesekan."` with `"Nol Gesekan."` accented in `#C8FF2E`.
  - Concise subtext (`max-w-lg`) + dual actions: primary Electric Volt button (`Pesan via WhatsApp`) + hairline ghost button (`Lihat Katalog Flagship`).
  - Inline monospace metric strip (`76 Neodymium Core` · `0% Pegas Logam` · `45° Auto-Align`).
- **Right Column (`lg:col-span-7`):**
  - **Unboxed 3D Stage (`CubeStage`):** Remove the enclosing `rounded-3xl` border card! The Three.js WebGL canvas renders at `520px–660px` height directly over a subtle radial Volt/carbon spotlight + delicate SVG crosshair reticle.
  - Top-right minimal live status indicator (`Siap Dimainkan · Drag 3D`) and bottom-centered sleek floating glass control dock (`Slice Twist`, `Scramble`, `Auto-Align 45°`, `UV Gloss / Matte`).
  - Preserves 100% of `createCubeEngine` physics and WebGL materials.
- **Full-Bleed Telemetry Marquee:** Immediately below the Hero (`border-y border-border bg-band py-3.5 overflow-hidden`), an infinitely scrolling monospace spec strip separating Section 1 from Section 2.

### 4.2 Section 2 · Sticky Scrollytelling Rekayasa (`BentoSection.tsx`)
- **Layout (`max-w-[1400px]`, `py-24 lg:py-32`):**
  - **Left Column (`lg:col-span-4`, `lg:sticky lg:top-28 self-start`):**
    - Eyebrow + Display Title (`"Fisika Tanpa Gesekan"`) + concise intro.
    - **Interactive Chapter Index (`01` to `04`):** Tracks which engineering module is currently in view (`IntersectionObserver` / `whileInView`) and lets users click to jump smoothly to any module:
      - `01 · Dual-Repulsion MagLev`
      - `02 · 20-Magnet Ball-Core`
      - `03 · 55° Corner Cutting & TPS`
      - `04 · GES Pro+ Dual Tuning`
  - **Right Column (`lg:col-span-8`, `space-y-10`):**
    - Each of the 4 engineering modules renders as a **full-width spacious showcase panel** (instead of 4 squeezed bento boxes) with `whileInView` reveal (`opacity: 0, y: 28` -> `opacity: 1, y: 0`), subtle index badge, internal split where needed (e.g., meters left + `MagLevAnatomy` plate right, or controls left + live readout right), and zero redundant box-in-box nesting.
    - `MagLevAnatomy` and `BallCoreAnatomy` retain full interactive SVG cutaway animations, updated so highlight strokes/accents align seamlessly with the Carbon Telemetry + Electric Volt palette.

### 4.3 Section 3 · Katalog Flagship Wide Runway (`CatalogSection.tsx`)
- **Layout (`max-w-[1400px]`, `py-24 lg:py-32`, `border-t border-border`):**
  - **Asymmetric Split Header:** Title & subtitle on the left, category filter tabs (`Semua Seri`, `Flagship Tier`, `Pro Mid-Range`, `Entry Speed`) aligned cleanly on the right.
  - **Wide 2-Column Editorial Product Cards (`grid-cols-1 lg:grid-cols-2 gap-8`):**
    - Replaces the cramped 4-column narrow grid (~280px/card) with expansive ~660px-wide split cards.
    - Inside each card: horizontal split (`sm:grid-cols-12`):
      - **Left (`sm:col-span-5`):** Full-height `IsoCube` studio chamber on a subtle tinted radial stage + top category/tier badge.
      - **Right (`sm:col-span-7`):** Title, tagline, 3 crisp monospace spec rows, price + strike-through + savings badge, full-width WhatsApp order button, and expandable technical datasheet drawer (`AnimatePresence`).
    - Staggered `whileInView` entrance animation per card.

### 4.4 Section 4 · Full-Bleed WCA Timer Cockpit (`TimerSection.tsx`)
- **Full-Bleed Contrast Band (`bg-band border-y border-border py-24 lg:py-32`):**
  - Breaks out of the old `max-w-3xl` centered card into a `max-w-[1400px]` **12-column Telemetry Cockpit**:
  - **Left Arena (`lg:col-span-8`):**
    - Top WCA Scramble bar (`bg-well border border-border`) with Copy & Re-scramble controls.
    - Open Chronometer Arena with a subtle radial state-reactive glow behind the giant `clamp(4.5rem, 10vw, 8.75rem)` monospace timer readout (`holding` = signal red, `ready` = Electric Volt `#C8FF2E`, `running` = crisp white/cyan pulse).
    - Touch/mouse press pad + Spacebar support + Manual Start/Stop button.
  - **Right Telemetry Sidebar (`lg:col-span-4`):**
    - 2x2 large tabular-nums stat tiles (`Terbaik (PB)`, `Ao5`, `Solve Terakhir`, `Total Solves`).
    - Compact recent solves strip (up to last 5 solves).
    - Dynamic speed-tier recommendation card & `SUB10CUBER` WhatsApp voucher claim (`AnimatePresence`).

### 4.5 Section 5 · Editorial Reviews & FAQ Split (`ReviewsFaqSection.tsx`)
- **Asymmetric 12-Column Split (`max-w-[1400px] py-24 lg:py-32`):**
  - **Left (`lg:col-span-6`):**
    - Section heading (`"Dipercaya Komunitas Speedcube"`) + editorial review stack separated by crisp 1px hairlines (no heavy boxed card borders), larger pull-quote typography, star rating, PB badge, and verified cuber attribution.
  - **Right (`lg:col-span-6`):**
    - Sticky-aligned FAQ column (`lg:sticky lg:top-28`) with clean header + hairline accordion items (`border-y border-border divide-y divide-border`) and smooth `AnimatePresence` height transitions.

### 4.6 Section 6 · Full-Bleed Closing Statement & Architectural Footer (`Footer.tsx`)
- **Full-Bleed Closing Band (`border-t border-border bg-band`):**
  - Centered/split high-impact typographic statement (`"Siap cetak personal best baru minggu ini?"`) with subtle radial Electric Volt spotlight, primary WhatsApp CTA, secondary Catalog jump, and 4-item trust strip.
- **Architectural Footer:**
  - `max-w-[1400px]` 12-column index with brand credentials, online hours indicator, navigation links, and 6 official marketplace/social channels.

---

## 5. Verification Plan

1. **TypeScript & Production Build:** Run `npx tsc --noEmit` and `npm run build` with zero errors.
2. **Functional & Visual Verification:** Start/verify on `http://localhost:5173/` that:
   - Navbar scroll-progress bar tracks scroll smoothly.
   - Hero 3D cube rotates, twists, scrambles, auto-aligns, and toggles Gloss/Matte cleanly without box clipping.
   - Sticky Rekayasa index highlights active modules `01–04` on scroll, and all 4 interactive demos (MagLev toggle, Ball-Core 45° snap, CFOP/Roux/ZZ TPS meter, GES Pro+ Tension/Travel clickers) function properly.
   - Catalog 2-column split cards filter cleanly and expand specs smoothly.
   - WCA Timer cockpit responds to Spacebar, mouse, and touch, calculates PB/Ao5, and reveals recommendations + voucher claim.
   - Reviews & FAQ accordion expand/collapse smoothly across desktop and mobile viewports.
