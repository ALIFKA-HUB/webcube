import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dots, IsoPlate, Line, Solid, Wire } from "../iso/draw";
import {
  AZIMUTH,
  ELEVATION,
  type Projection,
  type Vec2,
  coilZ,
  cylinder,
  depthOf,
  fullArc,
  iso,
  knurl,
  radialTicks,
  ringHalf,
  segment,
  sideArc,
  slabOf,
  topTicks,
} from "../iso/iso-kit";

export interface MagLevAnatomyProps {
  mode: "spring" | "maglev";
}

const P: Projection = {
  az: AZIMUTH,
  el: ELEVATION,
  scale: 3.35,
  tx: 0,
  ty: 16,
};

const MAX_PLUNGE = 4.2;
const REBOUND_HOLD_MS = 550;
const FLOAT_AMPLITUDE = 0.6;
const TRAVEL_RING_Z = [-1, 2.25, 5.5, 8.75, 12] as const;
const PILLAR_GRADUATION_Z = [-5, 2, 9] as const;

function buildRepulsionWire(
  side: -1 | 1,
  zLow: number,
  zHigh: number,
  proj: Projection,
): { d: string; a: Vec2; b: Vec2 } {
  const xBase = side * 11.4;
  const xApex = side * 14.0;
  const a = iso([xBase, 0, zLow], proj);
  const b = iso([xBase, 0, zHigh], proj);
  const c1 = iso([xApex, 0, zLow], proj);
  const c2 = iso([xApex, 0, zHigh], proj);
  const d = `M${a[0].toFixed(2)},${a[1].toFixed(2)} C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${b[0].toFixed(2)},${b[1].toFixed(2)}`;
  return { d, a, b };
}

export function MagLevAnatomy({ mode }: MagLevAnatomyProps) {
  const [isPlunging, setIsPlunging] = useState(false);
  const [plunge, setPlunge] = useState(0);
  const [floatOffset, setFloatOffset] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const pressedRef = useRef(false);
  const plungeRef = useRef(0);
  const velocityRef = useRef(0);
  const reboundTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (reboundTimerRef.current !== null) {
        window.clearTimeout(reboundTimerRef.current);
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const stepAnimation = useCallback(
    (now: number, lastTime: number, startTime: number) => {
      const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
      const target = pressedRef.current ? MAX_PLUNGE : 0;

      // Snappy compression downward; crisp elastic repulsion rebound upward.
      const stiffness = pressedRef.current
        ? 340
        : mode === "maglev"
          ? 240
          : 180;
      const damping = pressedRef.current ? 30 : mode === "maglev" ? 18 : 16;

      const displacement = plungeRef.current - target;
      const accel = -stiffness * displacement - damping * velocityRef.current;
      velocityRef.current += accel * dt;
      plungeRef.current = Math.max(
        0,
        Math.min(MAX_PLUNGE + 0.15, plungeRef.current + velocityRef.current * dt),
      );

      const settled =
        !pressedRef.current &&
        Math.abs(plungeRef.current) < 0.004 &&
        Math.abs(velocityRef.current) < 0.01;

      if (settled) {
        plungeRef.current = 0;
        velocityRef.current = 0;
      }

      setPlunge(plungeRef.current);

      if (mode === "maglev") {
        const elapsed = (now - startTime) / 1000;
        setFloatOffset(Math.sin(elapsed * 2.1) * FLOAT_AMPLITUDE);
        rafRef.current = window.requestAnimationFrame((next) =>
          stepAnimation(next, now, startTime),
        );
      } else {
        setFloatOffset(0);
        if (!settled || pressedRef.current) {
          rafRef.current = window.requestAnimationFrame((next) =>
            stepAnimation(next, now, startTime),
          );
        } else {
          rafRef.current = null;
        }
      }
    },
    [mode],
  );

  useEffect(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (reducedMotion) {
      setFloatOffset(0);
      setPlunge(pressedRef.current ? MAX_PLUNGE : 0);
      return;
    }

    if (mode === "maglev" || pressedRef.current || plungeRef.current > 0.004) {
      const t0 = performance.now();
      rafRef.current = window.requestAnimationFrame((now) =>
        stepAnimation(now, t0, t0),
      );
    } else {
      setFloatOffset(0);
    }

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [mode, reducedMotion, stepAnimation]);

  const triggerPlunge = useCallback(() => {
    if (reboundTimerRef.current !== null) {
      window.clearTimeout(reboundTimerRef.current);
    }

    pressedRef.current = true;
    setIsPlunging(true);

    if (reducedMotion) {
      plungeRef.current = MAX_PLUNGE;
      velocityRef.current = 0;
      setPlunge(MAX_PLUNGE);
    } else {
      velocityRef.current = Math.max(velocityRef.current, 14);
      if (rafRef.current === null) {
        const t0 = performance.now();
        rafRef.current = window.requestAnimationFrame((now) =>
          stepAnimation(now, t0, t0),
        );
      }
    }

    reboundTimerRef.current = window.setTimeout(() => {
      pressedRef.current = false;
      setIsPlunging(false);
      if (reducedMotion) {
        plungeRef.current = 0;
        velocityRef.current = 0;
        setPlunge(0);
      }
      reboundTimerRef.current = null;
    }, REBOUND_HOLD_MS);
  }, [reducedMotion, stepAnimation]);

  // Precompute static precision geometry sorted back-to-front.
  const staticParts = useMemo(() => {
    // 1. Base Rig Platform (z = -18 to -14)
    const baseSlab = slabOf(54, 40, 4, -18, P, { r: 4, bevel: 0.45 });
    const wellRim = fullArc(0, 0, -14, 17, P, 40);
    const wellInner = fullArc(0, 0, -14, 15.6, P, 40);
    const axisX = segment([-17, 0, -14], [17, 0, -14], P);
    const axisY = segment([0, -17, -14], [0, 17, -14], P);
    const rulerBase = segment([-18, 15.5, -14], [18, 15.5, -14], P);
    const ruler = topTicks(-18, 18, 15.5, -14, 18, 2.1, P, 6);
    const screwPts = (
      [
        [-22, -15],
        [22, -15],
        [-22, 15],
        [22, 15],
      ] as const
    ).map(([x, y]) => iso([x, y, -14], P));

    // 2. Twin Rear Guide Pillars sorted ascending by depthOf
    const pillarCoords: Array<[number, number]> = [
      [-16.5, -11],
      [16.5, -11],
    ];
    const pillars = pillarCoords
      .map(([px, py]) => ({
        px,
        py,
        depth: depthOf([px, py, 0], P),
        collar: cylinder(px, py, -14, 3.6, 2.2, P, 20, { bevel: 0.2 }),
        rod: cylinder(px, py, -11.8, 2.0, 26, P, 18, { bevel: 0.15 }),
        graduations: PILLAR_GRADUATION_Z.map((gz) =>
          sideArc(px, py, gz, 2.0, P, 16),
        ),
        capDot: [iso([px, py, 14.2], P)],
      }))
      .sort((a, b) => a.depth - b.depth);

    // 3. Lower Cutaway Center-Piece Cup (z = -14 to -7.5)
    const outerCup = cylinder(0, 0, -14, 14.2, 4.5, P, 36, { bevel: 0.25 });
    const cupTicks = radialTicks(0, 0, -9.5, 12.1, 13.9, 12, P, 3);
    const cradleCollar = cylinder(0, 0, -9.5, 11.8, 2.0, P, 36, {
      bevel: 0.2,
    });

    // 4a. Lower MagLev ring magnet halves (stationary at z = -7.2)
    const lowerMagnetBack = ringHalf(
      0,
      0,
      -7.2,
      10.2,
      4.6,
      4.0,
      P,
      "back",
      24,
      0.2,
    );
    const lowerMagnetFront = ringHalf(
      0,
      0,
      -7.2,
      10.2,
      4.6,
      4.0,
      P,
      "front",
      24,
      0.2,
    );
    const springBottomRing = sideArc(0, 0, -7.0, 7.6, P, 28);

    // 5. Central Titanium Spindle Shaft (between back and front halves)
    const spindleShaft = cylinder(0, 0, -13.5, 3.1, 30.5, P, 24, {
      bevel: 0.2,
    });
    const travelRings = TRAVEL_RING_Z.map((tz) => sideArc(0, 0, tz, 3.1, P, 20));

    // 7c. Top spindle cap nut (fixed at top of spindle)
    const topCapNut = cylinder(0, 0, 17, 4.1, 2.0, P, 24, { bevel: 0.2 });
    const topCapDot = [iso([0, 0, 19.0], P)];

    return {
      baseSlab,
      wellRim,
      wellInner,
      axisX,
      axisY,
      rulerBase,
      ruler,
      screwPts,
      pillars,
      outerCup,
      cupTicks,
      cradleCollar,
      lowerMagnetBack,
      lowerMagnetFront,
      springBottomRing,
      spindleShaft,
      travelRings,
      topCapNut,
      topCapDot,
    };
  }, []);

  // Dynamic moving carriage & magnetic/spring geometry
  const effectiveFloat = mode === "maglev" && !reducedMotion ? floatOffset : 0;
  const upperMagnetZ = 3.2 - plunge + effectiveFloat;
  const upperCoilZ = 7.2 - plunge;
  const nutBaseZ = mode === "maglev" ? upperMagnetZ + 4.0 : upperCoilZ;

  const upperMagnetBack =
    mode === "maglev"
      ? ringHalf(0, 0, upperMagnetZ, 10.2, 4.6, 4.0, P, "back", 24, 0.2)
      : null;
  const upperMagnetFront =
    mode === "maglev"
      ? ringHalf(0, 0, upperMagnetZ, 10.2, 4.6, 4.0, P, "front", 24, 0.2)
      : null;

  const fluxRings =
    mode === "maglev"
      ? [0.25, 0.5, 0.75].map((t, idx) => {
          const zGap = -3.2 + (upperMagnetZ - -3.2) * t;
          const rGap = idx === 1 ? 10.7 : 9.8;
          return sideArc(0, 0, zGap, rGap, P, 28);
        })
      : [];

  const leftRepulsion =
    mode === "maglev"
      ? buildRepulsionWire(-1, -3.2, upperMagnetZ, P)
      : null;
  const rightRepulsion =
    mode === "maglev"
      ? buildRepulsionWire(1, -3.2, upperMagnetZ, P)
      : null;

  const springCoil =
    mode === "spring" ? coilZ(0, 0, -7.0, upperCoilZ, 7.6, 5.5, P, 150) : null;
  const springTopRing =
    mode === "spring" ? sideArc(0, 0, upperCoilZ, 7.6, P, 28) : "";

  const washerFlange = cylinder(0, 0, nutBaseZ, 9.2, 1.8, P, 32, {
    bevel: 0.2,
  });
  const flangeTicks = radialTicks(0, 0, nutBaseZ + 1.8, 7.1, 8.9, 12, P, 3);
  const knurledDrum = cylinder(0, 0, nutBaseZ + 1.8, 6.8, 4.2, P, 28, {
    bevel: 0.3,
  });
  const knurlLines = knurl(0, 0, nutBaseZ + 2.0, nutBaseZ + 5.7, 6.8, 20, P);

  const readoutText =
    mode === "maglev"
      ? isPlunging
        ? "GAP 0.8mm · 6.4 N · REBOUND"
        : "GAP 1.8mm · 3.4 N · 0 dB"
      : isPlunging
        ? "COMPRESS · 46 dB"
        : "CONTACT · 42 dB";

  return (
    <IsoPlate
      fig="Fig 01"
      title={mode === "maglev" ? "MagLev Dual-Ring" : "Helical Steel Spring"}
      hint="Klik uji tekan"
      readout={readoutText}
      viewBox="-165 -116 330 232"
      interactive
      onClick={triggerPlunge}
      ariaLabel={
        mode === "maglev"
          ? "Anatomi suspensi MagLev Dual-Ring, klik untuk uji tekan aksial"
          : "Anatomi pegas heliks baja, klik untuk uji tekan aksial"
      }
    >
      {/* 1. Base Rig Platform */}
      <Solid geometry={staticParts.baseSlab} />
      <Line d={staticParts.wellRim} tone="lo" w="thin" />
      <Line d={staticParts.wellInner} tone="faint" w="hair" />
      <Line d={staticParts.axisX} tone="faint" w="hair" />
      <Line d={staticParts.axisY} tone="faint" w="hair" />
      <Line d={staticParts.rulerBase} tone="faint" w="hair" />
      <Line d={staticParts.ruler.minor} tone="lo" w="hair" />
      <Line d={staticParts.ruler.major} tone="mid" w="thin" />
      <Dots points={staticParts.screwPts} r={2.2} tone="lo" />
      <Dots points={staticParts.screwPts} r={1.1} tone="hi" />

      {/* 2. Twin Rear Guide Pillars */}
      {staticParts.pillars.map((pillar, idx) => (
        <g key={idx}>
          <Solid geometry={pillar.collar} />
          <Solid geometry={pillar.rod} />
          {pillar.graduations.map((d, gIdx) => (
            <Line key={gIdx} d={d} tone="mid" w="hair" />
          ))}
          <Dots points={pillar.capDot} r={1.4} tone="hi" />
        </g>
      ))}

      {/* 3. Lower Cutaway Center-Piece Cup */}
      <Solid geometry={staticParts.outerCup} />
      <Line d={staticParts.cupTicks.minor} tone="lo" w="hair" />
      <Line d={staticParts.cupTicks.major} tone="mid" w="hair" />
      <Solid geometry={staticParts.cradleCollar} />

      {/* 4. Back Half of Ring Magnets / Steel Spring */}
      {mode === "maglev" ? (
        <>
          <Solid geometry={staticParts.lowerMagnetBack} accent="vermilion" />
          {upperMagnetBack && (
            <Solid geometry={upperMagnetBack} lit accent="vermilion" />
          )}
        </>
      ) : (
        springCoil && (
          <>
            <Line d={springCoil.back} tone="halo" w="halo" />
            <Line d={springCoil.back} tone="hi" w="thick" />
          </>
        )
      )}

      {/* 5. Central Titanium Spindle Shaft */}
      <Solid geometry={staticParts.spindleShaft} />
      {staticParts.travelRings.map((d, idx) => (
        <Line key={idx} d={d} tone="mid" w="hair" />
      ))}

      {/* 6. Repulsion Flux Field + Front Half of Ring Magnets / Steel Spring */}
      {mode === "maglev" ? (
        <>
          {fluxRings.map((d, idx) => (
            <Line key={idx} d={d} tone="vermilion" w="thin" flow />
          ))}
          {leftRepulsion && (
            <Wire
              d={leftRepulsion.d}
              a={leftRepulsion.a}
              b={leftRepulsion.b}
              tone="vermilion"
              flow
              halo={false}
            />
          )}
          {rightRepulsion && (
            <Wire
              d={rightRepulsion.d}
              a={rightRepulsion.a}
              b={rightRepulsion.b}
              tone="vermilion"
              flow
              halo={false}
            />
          )}
          <Solid geometry={staticParts.lowerMagnetFront} accent="vermilion" />
          {upperMagnetFront && (
            <Solid geometry={upperMagnetFront} lit accent="vermilion" />
          )}
        </>
      ) : (
        springCoil && (
          <>
            <Line d={springCoil.front} tone="halo" w="halo" />
            <Line d={springCoil.front} tone="lit" w="thick" />
            <Line d={staticParts.springBottomRing} tone="vermilion" w="mid" />
            <Line d={springTopRing} tone="vermilion" w="mid" />
          </>
        )
      )}

      {/* 7. Upper Carriage Collar, Knurled GES Pro+ Tension Nut & Top Cap */}
      <Solid geometry={washerFlange} lit />
      <Line d={flangeTicks.minor} tone="lo" w="hair" />
      <Line d={flangeTicks.major} tone="mid" w="hair" />
      <Solid geometry={knurledDrum} lit />
      <Line d={knurlLines} tone="hi" w="hair" />
      <Solid geometry={staticParts.topCapNut} lit />
      <Dots points={staticParts.topCapDot} r={1.3} tone="hi" />
    </IsoPlate>
  );
}
