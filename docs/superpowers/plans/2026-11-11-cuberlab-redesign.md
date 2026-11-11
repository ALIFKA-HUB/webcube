# CuberLab ID Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the CuberLab ID landing page into a clean, Warm Utilitarian Minimalist architectural interface with exposed 1px grids, while 100% preserving the interactive Three.js 3D Rubik's cube and Framer Motion simulations, eliminating AI-slop tropes (neon glow, emojis, em-dashes).

**Architecture:** Deconstruct the 2,725-line monolithic `App.tsx` into modular files: `src/types/index.ts`, `src/data/`, `src/engine/cubeEngine.ts`, and focused UI components in `src/components/`. Apply Warm Utilitarian Light tokens (`#F7F6F3`, `#FFFFFF`, `#111111`, `#E4E2DD`, `#D9381E`) and Plus Jakarta Sans + JetBrains Mono typography.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS v4, Three.js, Framer Motion, Lucide React.

## Global Constraints

- **Theme Lock:** Strictly Warm Utilitarian Light across all sections (`bg-[#F7F6F3]`, surfaces `#FFFFFF`, recessed `#EFECE6`, borders `#E4E2DD`, text `#111111` & `#575653`).
- **Zero Emojis:** Remove all emojis (`👑`, `🔥`, `⚡`, `🎯`) from badges, buttons, and strings.
- **Zero Em-Dashes:** Replace all `—` characters across headlines, copy, badges, and metadata with standard punctuation.
- **Zero Neon Glow:** Remove `Atmosphere` blurred blobs, `SpotlightCard` cyan glow, and rainbow gradient text.
- **Preserved Physics:** Preserve all Three.js engine mechanics (drag, inertia, slice twist, scramble 20 moves, 45° snap, finish mode) and all Framer Motion simulations in Bento (MagLev repulsion, Ball-Core snap, Corner Cutting TPS, GES Pro+ clickers).
- **Typography:** `Plus Jakarta Sans` for sans display/body and `JetBrains Mono` for monospace numbers/specs.
- **Single CTA Intent:** Uniform primary CTA label `"Pesan via WhatsApp"`.

---

### Task 1: Typography & Theme Token System

**Files:**
- Modify: `index.html:12-18`
- Modify: `src/index.css:1-41`

**Interfaces:**
- Produces: CSS variables on `:root` and `@theme` font definitions (`--font-sans: 'Plus Jakarta Sans'`, `--font-mono: 'JetBrains Mono'`).

- [ ] **Step 1: Update `index.html` Google Font links**
Replace `Inter` with `Plus Jakarta Sans`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Update `src/index.css` with Warm Utilitarian tokens**
Configure Tailwind v4 `@theme` and `:root` variables:
```css
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

:root {
  --bg-canvas: #f7f6f3;
  --bg-surface: #ffffff;
  --bg-recessed: #efece6;
  --border-hairline: #e4e2dd;
  --text-primary: #111111;
  --text-secondary: #575653;
  --text-muted: #8a8884;
  --accent-signal: #d9381e;
}

html {
  scroll-behavior: smooth;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  overflow-x: clip;
}

body {
  margin: 0;
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

::selection {
  background-color: #111111;
  color: #ffffff;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f7f6f3;
}
::-webkit-scrollbar-thumb {
  background: #dcd9d2;
  border-radius: 4px;
}
```

- [ ] **Step 3: Verify TypeScript & Build**
Run `npx tsc --noEmit` to verify syntax.

---

### Task 2: Type Definitions & Clean Data Modules

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/products.ts`
- Create: `src/data/content.ts`

**Interfaces:**
- Produces: `Product`, `Category`, `CubeMove`, `Finish`, `EngineCallbacks`, `PRODUCTS`, `STYLE_PROFILES`, `TENSION_LEVELS`, `TRAVEL_LEVELS`, `TESTIMONIALS`, `FAQS`, `NAV_LINKS`, `STORE_CHANNELS`.

- [ ] **Step 1: Create `src/types/index.ts`**
Define types for products, cube moves, engine callbacks, and timer phases.

- [ ] **Step 2: Create `src/data/products.ts`**
Export `PRODUCTS` with cleaned metadata:
- Badges cleaned of emojis (e.g. `TOP FLAGSHIP 2026`, `LIMITED ANNIVERSARY`, `BEST VALUE PRO`, `ENTRY SPEED`).
- Taglines and specs cleaned of em-dashes.
- Product palettes and detail tuples intact.

- [ ] **Step 3: Create `src/data/content.ts`**
Export `STYLE_PROFILES` (CFOP, Roux, ZZ), `TENSION_LEVELS`, `TRAVEL_LEVELS`, `TESTIMONIALS` (concise $\le$ 3 lines, no em-dashes), `FAQS`, `NAV_LINKS`, and `STORE_CHANNELS`.

- [ ] **Step 4: Verify type checking**
Run `npx tsc --noEmit`.

---

### Task 3: Studio Lighting & Three.js Cube Engine Extraction

**Files:**
- Create: `src/engine/cubeEngine.ts`

**Interfaces:**
- Consumes: `Finish`, `EngineCallbacks`, `CubeMove`, `Axis` from `src/types/index.ts`.
- Produces: `createCubeEngine(container: HTMLDivElement, cb: EngineCallbacks)` returning `{ twist(), scramble(), align(), setFinish(f: Finish), dispose() }`.

- [ ] **Step 1: Extract and adapt Three.js Cube Engine**
- Use clean studio lighting suitable for a warm light background:
  - `AmbientLight(0xffffff, 0.85)`
  - Key `DirectionalLight(0xffffff, 1.25)` positioned at `(5, 8, 6)`
  - Fill `DirectionalLight(0xf4f1eb, 0.65)` positioned at `(-5, 4, 3)`
  - Subtle ground bounce `DirectionalLight(0xe2ded4, 0.4)` positioned at `(0, -6, -2)`
- Set plastic core/cubie body material to matte charcoal `#18181b` (`roughness: 0.35, metalness: 0.1`).
- Keep sticker face colors vivid: White `#f8fafc`, Yellow `#ffd60a`, Red `#e11d2e`, Orange `#ff7a00`, Blue `#1d4ed8`, Green `#16a34a`.
- Retain all move mechanics: in-flight pivot attachment, `angleAt`, `startMove`, `finishMove`, pointer dragging with inertia, `ResizeObserver`, and cleanup/dispose of geometries, materials, PMREM environment, and renderer.

- [ ] **Step 2: Verify type checking**
Run `npx tsc --noEmit`.

---

### Task 4: Modular UI Components Implementation

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/CubeStage.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/BentoSection.tsx`
- Create: `src/components/CatalogSection.tsx`
- Create: `src/components/TimerSection.tsx`
- Create: `src/components/ReviewsFaqSection.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Each component exports its standalone React component with clean props and responsive layouts.

- [ ] **Step 1: Implement `Navbar.tsx`**
- Edge-aligned `h-16 border-b border-[#E4E2DD] bg-[#F7F6F3]/90 backdrop-blur-md sticky top-0 z-50`.
- Left: CuberLab ID wordmark + location index `"ID · Speedcube Flagship"`.
- Center: clean navigation links with hover underline.
- Right: solid `#111111` button `"Pesan via WhatsApp"` + mobile menu toggle with `AnimatePresence`.

- [ ] **Step 2: Implement `CubeStage.tsx`**
- Frame: Recessed studio well (`bg-[#EFECE6] border border-[#E4E2DD] rounded-xl h-[480px] relative overflow-hidden`).
- Top bar: Monospace telemetry status pill (`bg-[#FFFFFF] border border-[#E4E2DD] text-[#111111]`) with active pulse dot + "Drag untuk rotasi 360°" label.
- Bottom hardware dock: 4 tactile buttons (`border border-[#E4E2DD] bg-[#FFFFFF] hover:bg-[#F7F6F3]`) for Slice Twist, 20-Move Scramble, 45° Auto-Align, and UV Gloss / Frosted Matte toggle.

- [ ] **Step 3: Implement `Hero.tsx`**
- Asymmetric 12-column grid (`lg:col-span-5` text, `lg:col-span-7` CubeStage).
- Top tag: Pale red/vermilion status tag (`border border-[#D9381E]/20 bg-[#FDEBEC] text-[#9F2F2D] text-xs font-semibold`).
- Headline: Solid `#111111` typography (`text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.08]`), no gradients.
- Subtext: Clear 18-word value proposition.
- Actions: Primary `#111111` (`"Pesan via WhatsApp"`) + secondary `#FFFFFF` border (`"Lihat Katalog"`).
- Trust Index Strip: 4-column horizontal ledger below hero with `CountUp` numbers.

- [ ] **Step 4: Implement `BentoSection.tsx`**
- Exposed 1px hairline grid (`bg-[#E4E2DD] p-px gap-px rounded-xl border border-[#E4E2DD] grid md:grid-cols-12`).
- Sel 1 (MagLev Repulsion, 7 cols): Spring vs MagLev toggle with animated SVG repulsion rings and spring meters.
- Sel 2 (Ball-Core 45° Snap, 5 cols): Interactive spring-rotating 20-magnet core diagram.
- Sel 3 (Corner Cutting & TPS, 5 cols): CFOP/Roux/ZZ tabs, `animate()` smooth TPS numbers, corner cutting SVG.
- Sel 4 (Dual GES Pro+ Tuning, 7 cols): 6 tension levels & 6 travel levels clickers, profile summary, speed/control meters.

- [ ] **Step 5: Implement `CatalogSection.tsx`**
- Replaces cards with Horizontal Hardware Spec Ledger (`bg-[#FFFFFF] border border-[#E4E2DD] rounded-xl divide-y divide-[#E4E2DD]`).
- Category tabs: Semua Seri, Flagship Tier, Pro Mid-Range, Entry Speed.
- Each row contains:
  - Isometric SVG cube preview (`IsoCube`) on `#EFECE6` pad + pastel tag.
  - Title, badge, and expandable specification drawer (`AnimatePresence`).
  - Key technical metrics (Core, Weight, Finish).
  - Price in `JetBrains Mono` and direct WhatsApp checkout button.

- [ ] **Step 6: Implement `TimerSection.tsx`**
- Laboratory workbench layout (`bg-[#FFFFFF] border border-[#E4E2DD] rounded-xl p-6 sm:p-8`).
- WCA Scramble bar (`bg-[#EFECE6] border border-[#E4E2DD] font-mono text-lg font-semibold text-[#111111]`).
- Large digital timer display with state colors (`#111111` idle/running, `#9F2F2D` holding, `#346538` ready) with spacebar & mobile touch support.
- Telemetry panel: Last Solve, Personal Best, Average of 5 (Ao5), and dynamic product recommendation with `SUB10CUBER` voucher claim.

- [ ] **Step 7: Implement `ReviewsFaqSection.tsx`**
- Asymmetric 2-part grid:
  - Left (5 cols): 3 verified cuber editorial testimonials with ratings and achievements.
  - Right (7 cols): Minimalist FAQ accordion with `border-b border-[#E4E2DD]`, clean `+`/`-` toggle, and smooth `AnimatePresence`.

- [ ] **Step 8: Implement `Footer.tsx`**
- Final Dispatch CTA: High-contrast architectural block (`bg-[#111111] text-[#FFFFFF] rounded-xl p-8 sm:p-12`) with WhatsApp consultation button.
- Footer index: Store credentials, working hours, official channel links (Tokopedia, Shopee, Instagram, YouTube, WhatsApp).

---

### Task 5: App Integration & Build Verification

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Rewrite `src/App.tsx` as clean root coordinator**
Assemble all components into `src/App.tsx`:
```tsx
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { BentoSection } from "./components/BentoSection";
import { CatalogSection } from "./components/CatalogSection";
import { TimerSection } from "./components/TimerSection";
import { ReviewsFaqSection } from "./components/ReviewsFaqSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoSection />
        <CatalogSection />
        <TimerSection />
        <ReviewsFaqSection />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript Type Check**
Run `npx tsc --noEmit` and confirm 0 errors.

- [ ] **Step 3: Run Production Vite Build**
Run `npm run build` and verify that `dist/index.html` builds cleanly.

---

### Task 6: Visual & Interactive Browser Verification

**Files:**
- Test URL: `http://localhost:5173/`

- [ ] **Step 1: Start dev server**
Run `npm run dev` in background.

- [ ] **Step 2: Dispatch Browser Subagent**
Verify on `http://localhost:5173/`:
1. Warm Utilitarian Light aesthetic is consistent across all sections.
2. 3D Rubik's Cube is rotatable, lights look crisp and tactile, all 4 control dock buttons work.
3. Bento simulations (MagLev, Ball-Core, Corner Cutting TPS, GES Pro+ clickers) animate accurately.
4. Catalog filter tabs and specification expanders work.
5. WCA Timer starts on Spacebar/click, runs smoothly, records time, and calculates Ao5/PB.
6. Zero console errors and zero AI-slop elements (no neon glows, no emojis, no em-dashes).
