# CuberLab ID Landing Page Redesign Specification

**Date:** 2026-11-11
**Project:** WebCube (CuberLab ID Flagship Speedcube Store)
**Approach:** Architectural Hardware Grid + Warm Utilitarian Minimalist UI (Preserving 3D WebGL Cube & Framer Motion Interactive Simulations)

---

## 1. Design Read & Core Configuration

- **Design Read:** Flagship speedcube commerce & interactive hardware showcase for Indonesian competitive cubers, with a Warm Utilitarian Minimalist & Architectural Grid language, leaning toward Tailwind v4 + Plus Jakarta Sans + JetBrains Mono + preserved Three.js & Framer Motion physics.
- **Dials:**
  - `DESIGN_VARIANCE: 7` (Asymmetric split hero, exposed hairline bento grid, horizontal spec ledger)
  - `MOTION_INTENSITY: 6` (Preserved interactive 3D Rubik's cube + interactive Framer Motion physics in all sections)
  - `VISUAL_DENSITY: 4` (Generous whitespace, crisp 1px structural borders, clear typographic hierarchy)

---

## 2. Color System & Tokens (`:root` in `src/index.css`)

Single-theme lock: **Warm Utilitarian Light** across the entire page. No section flips to dark mode mid-page, and all neon/rainbow gradients are removed.

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F7F6F3` | Main page background (Warm Bone) |
| `--bg-surface` | `#FFFFFF` | Primary cards, ledger rows, navbar, workbench |
| `--bg-recessed` | `#EFECE6` | Recessed simulation wells, 3D stage backdrop, code/scramble bars |
| `--border-hairline` | `#E4E2DD` | All structural 1px borders and exposed grid dividers |
| `--text-primary` | `#111111` | Headings, primary body copy, active controls |
| `--text-secondary` | `#575653` | Supporting descriptions and secondary labels |
| `--text-muted` | `#8A8884` | Technical metadata, captions, inactive states |
| `--accent-signal` | `#D9381E` | Mechanical Vermilion for active telemetry indicators & highlights |
| `--cta-primary` | `#111111` | Primary button background (`#FFFFFF` text, hover `#2B2B29`) |
| `--pastel-red-bg` / `--pastel-red-fg` | `#FDEBEC` / `#9F2F2D` | Tag / alert / timer holding state |
| `--pastel-blue-bg` / `--pastel-blue-fg` | `#E1F3FE` / `#1F6C9F` | Technical tag / Ball-Core indicator |
| `--pastel-green-bg` / `--pastel-green-fg` | `#EDF3EC` / `#346538` | Stock / WhatsApp online / timer ready state |
| `--pastel-yellow-bg` / `--pastel-yellow-fg` | `#FBF3DB` / `#956400` | Limited edition / tension badge |

---

## 3. Typography & Anti-Slop Constraints

1. **Font Stack:**
   - `--font-sans`: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (Loaded via Google Fonts in `index.html`, replacing `Inter`).
   - `--font-mono`: `'JetBrains Mono', monospace` (Used for prices, WCA scrambles, stopwatch digits, TPS counters, and technical specs).
2. **Strict Negative Constraints:**
   - **Zero Emojis:** Remove all emojis (`👑`, `🔥`, `⚡`, `🎯`) from badges, buttons, and copy.
   - **Zero Em-Dashes (`—`):** Replace all `—` across headlines, copy, and metadata with standard punctuation (hyphens, colons, or periods).
   - **Zero Rainbow Gradients / Blurred Blobs:** Remove `Atmosphere` component and `GRADIENT_TEXT`.
   - **Eyebrow Restraint:** Maximum 2 section eyebrows across the entire 6-section page.
   - **Shape Consistency Lock:** Container cards use `rounded-xl` (`12px`), inner panels use `rounded-lg` (`8px`), buttons and keycaps use `rounded-md` (`6px`), status tags use `rounded-full`.
   - **Single Primary CTA Intent:** Consistent primary CTA label `"Pesan via WhatsApp"` across Navbar, Hero, and Final CTA.

---

## 4. Section-by-Section Layout & Preserved Animations

### 4.1 Navbar (Edge-Aligned Architectural Bar)
- Sticky top bar (`h-16`, `bg-[#F7F6F3]/90 backdrop-blur-md border-b border-[#E4E2DD]`).
- Left: Geometric cube mark + `CuberLab ID` wordmark.
- Center: Clean section links (`Rekayasa MagLev`, `Katalog Flagship`, `WCA Timer`, `Ulasan & FAQ`).
- Right: Solid `#111111` button (`Pesan via WhatsApp`) + mobile drawer toggle with `AnimatePresence`.

### 4.2 Section 1: Hero & Interactive 3D Rubik's Stage
- **Layout:** 12-column asymmetric split (`lg:col-span-5` left content, `lg:col-span-7` right 3D stage) within `max-w-7xl`, capped top padding (`pt-10 lg:pt-16`).
- **Left Column (Max 4 elements):**
  1. Single muted pastel status tag (`WCA Grade Flagship Store Indonesia`).
  2. Left-aligned display headline (`text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#111111] leading-[1.08]`).
  3. Concise subtext ($\le$ 20 words): *"Speedcube magnetik flagship GAN dan MoYu dengan layanan setup pelumas gratis serta garansi presisi."*
  4. Two action buttons: Primary solid `#111111` (`Pesan via WhatsApp`) + Secondary `#FFFFFF` border `#E4E2DD` (`Lihat Katalog`).
- **Right Column (3D Rubik's Cube Stage - Animation Preserved):**
  - `createCubeEngine` Three.js WebGL logic (27 cubies, `RoundedBoxGeometry`, drag-to-orbit with inertia, intro elastic scale, levitation bobbing, *Slice Twist*, *20-Move Scramble*, *45° Auto-Align*, and *UV High-Gloss / Frosted Matte* toggle) is **100% preserved**.
  - **Studio Lighting Recalibration:** Replace dark-mode neon PointLights with crisp studio lighting (`AmbientLight` + key/fill `DirectionalLight` + subtle warm/cool rim lights) and set plastic body color to `#18181B` so the cube looks like a physical flagship speedcube inside a light recessed studio box (`bg-[#EFECE6] border border-[#E4E2DD] rounded-xl`).
  - **Integrated Control Dock:** Remove floating HUD badges that obscure the cube. Place telemetry bar at top of frame and the 4 interactive `motion.button` controls in a structured bottom hardware dock.
- **Below Hero Index Strip:** A clean 4-column structural bar (`border-y border-[#E4E2DD] bg-[#FFFFFF]`) displaying key store metrics with `CountUp` animation.

### 4.3 Section 2: Precision Engineering Bento Grid (Exposed 1px Hairline Grid)
- **Layout:** Left-aligned section heading (stacked vertically, no split-header). 12-column exposed hairline grid (`bg-[#E4E2DD] p-px gap-px rounded-xl overflow-hidden border border-[#E4E2DD]`).
- **4 Interactive Modules (All Framer Motion Animations Preserved):**
  1. **Dual-Repulsion MagLev System (7 cols):** Spring vs MagLev toggle (`layoutId="maglev-pill"`), animated SVG repulsion rings vs zigzag spring, and spring-animated `Meter` bars.
  2. **20-Magnet Ball-Core 45° Auto-Align (5 cols):** Auto-toggling & clickable SVG core diagram with `motion.g` spring rotation (`45°` to `0°`) and pulsing magnetic field rings.
  3. **90° Corner Cutting & Peak TPS (5 cols):** CFOP / Roux / ZZ profile switcher with `animate()` smooth TPS counter and animated SVG corner-cutting geometry.
  4. **Dual-Adjustment GES Pro+ Tuning (7 cols):** Interactive 6-level Tension and 6-level Center Travel clickers (`whileHover`, `whileTap`), quick presets, and `AnimatePresence` profile readout.

### 4.4 Section 3: Flagship Catalog (Architectural Spec Ledger)
- **Layout:** Replaces uniform 2x2 cards with a filterable **Horizontal Hardware Index**.
- Category filter tabs (`Semua Seri`, `Flagship Tier`, `Pro Mid-Range`, `Entry Magnetic`) with `motion` active indicator.
- Each product renders as a multi-column architectural row (`grid-cols-1 lg:grid-cols-12`) separated by `1px solid #E4E2DD`:
  - **Col 1–3:** Isometric SVG cube preview (`IsoCube`) on a `#EFECE6` studio pad + pastel category badge.
  - **Col 4–6:** Product title, tagline, and expandable technical datasheet (`AnimatePresence` accordion).
  - **Col 7–9:** 3 key hardware specs (Core, Weight, Surface Finish) in monospace cells.
  - **Col 10–12:** Price in `JetBrains Mono`, strike-through original price, and direct WhatsApp order CTA.

### 4.5 Section 4: WCA Timer & Scramble Sandbox (Laboratory Workbench)
- **Layout:** Structured 2-column workbench (`lg:grid-cols-12`) inside a crisp `#FFFFFF` frame (`border border-[#E4E2DD] rounded-xl`).
- **Left 8 Columns:**
  - Scramble bar (`bg-[#EFECE6]`) with `AnimatePresence` scramble sequence transition and `Generate Scramble Baru` button.
  - Interactive touch/spacebar timer pad with `motion.div` scale response, semantic status colors (`#111111` idle/running, `#9F2F2D` holding, `#346538` ready), and `requestAnimationFrame` high-precision loop.
- **Right 4 Columns:**
  - Live session telemetry (Last Solve, Personal Best, Average of 5) and solve history chips.
  - Dynamic speed-tier product recommendation & `SUB10CUBER` voucher claim (`AnimatePresence`).

### 4.6 Section 5: Editorial Reviews & Minimalist FAQ
- **Layout:** Asymmetric 2-part section (`lg:grid-cols-12` with `gap-12`).
- **Left 5 Columns (Verified Cuber Reviews):** 3 concise editorial quotes ($\le$ 3 lines each) stacked with `1px solid #E4E2DD` dividers, full attribution (Name, Role, WCA/Sub-X achievement).
- **Right 7 Columns (FAQ):** Borderless minimalist accordion (`border-b border-[#E4E2DD]`), sharp `+` / `-` toggle icon, and `AnimatePresence` height transition.

### 4.7 Section 6: Final Dispatch CTA & Architectural Footer
- **Final CTA:** High-contrast architectural block (`bg-[#111111] text-[#F7F6F3] rounded-xl`) with custom lube consultation offer and primary WhatsApp action.
- **Footer:** Clean 12-column index with store operational hours, navigation links, and official marketplace channels (Tokopedia, Shopee, Instagram, TikTok, YouTube, WhatsApp).

---

## 5. Verification Plan

1. **TypeScript & Build Check:** Run `npx tsc --noEmit` and `npm run build` to ensure zero compile or type errors.
2. **Pre-Flight Visual & Functional Audit:** Verify on `http://localhost:5173/` that the 3D Rubik's cube interacts smoothly, all 4 Bento simulations animate, the Catalog filters/expands, the WCA Timer runs via Spacebar/click, and zero AI-slop artifacts (neon gradients, emojis, em-dashes) remain.
