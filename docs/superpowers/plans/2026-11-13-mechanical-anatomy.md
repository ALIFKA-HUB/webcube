# Implementation Plan: Interactive 2.5D Isometric Mechanical Anatomy (`wheresryan22/anatomy` Architecture)

> **Spec:** `docs/superpowers/specs/2026-11-12-mechanical-anatomy-design.md`
> **Goal:** Replace the flat 2D schematic diagrams inside `MagLevCard` and `BallCoreCard` (`src/components/BentoSection.tsx`) with interactive 2.5D Isometric Mechanical Anatomy plates built with the `wheresryan22/anatomy` isometric projection & 4-tone shading engine.

## Tasks
1. **Task 1 (`src/index.css`):** Add `--anatomy-*` tokens inside `:root` and `.iso-*` styling rules with strict Hallmark `sloplint.mjs` compliance (`color: var(--color-ink)` on dark `.iso-plate`, zero raw hex literals outside `:root`, zero tracked uppercase, zero `transition-all`).
2. **Task 2 (`src/components/iso/iso-kit.ts` & `src/components/iso/draw.tsx`):** Build the `wheresryan22/anatomy` isometric projection engine (`iso`, `depthOf`, `towardViewer`, `extrude`, `slabOf`, `cylinder`, `knurl`, `sideArc`, `topTicks`, plus split-bore `ringHalf`, `coilZ`, `sphereBands`, and `radialTicks`) and React SVG components (`<Solid>`, `<Line>`, `<Wire>`, `<Dots>`).
3. **Task 3 (`src/components/figures/MagLevAnatomy.tsx`):** Build `Fig 01` interactive MagLev Dual-Ring / Steel Coil test rig with 40+ precision parts in strict painter's order (base rig, millimeter scale, guide pillars, cutaway cup, split back ring magnets / coil, central titanium spindle shaft, flux repulsion rings, split front ring magnets / coil, knurled GES Pro+ nut, axial plunge animation).
4. **Task 4 (`src/components/figures/BallCoreAnatomy.tsx`):** Build `Fig 02` interactive 20-Magnet Ball-Core alignment turntable with radial degree ticks, 4 rotating corner magnet stalks depth-sorted around the central lathe-shaded spherical ball-core, and magnetic flux vector wires between `0°` locked and `45°` under-turn states.
5. **Task 5 (`src/components/BentoSection.tsx` & Verification):** Integrate `<MagLevAnatomy />` and `<BallCoreAnatomy />` into `BentoSection.tsx`, verify with `npx tsc --noEmit`, `npm run build`, `sloplint.mjs`, live browser QA, commit, and deploy preview.
