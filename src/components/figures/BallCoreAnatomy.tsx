import { useEffect, useMemo, useRef, useState } from "react";
import { Dots, IsoPlate, Line, Solid, Wire } from "../iso/draw";
import {
  AZIMUTH,
  ELEVATION,
  type Projection,
  type Solid as SolidGeometry,
  type Vec2,
  type Vec3,
  cylinder,
  depthOf,
  fullArc,
  iso,
  knurl,
  radialTicks,
  segment,
  sideArc,
  slabOf,
  sphereBands,
  wireCurve,
} from "../iso/iso-kit";

export interface BallCoreAnatomyProps {
  locked: boolean;
  onToggleLock: () => void;
}

const P: Projection = {
  az: AZIMUTH,
  el: ELEVATION,
  scale: 3.35,
  tx: 0,
  ty: 14,
};

const DEG = Math.PI / 180;
const BASE_STALK_ANGLES = [45, 135, 225, 315] as const;
const CORE_SOCKET_ANGLES = [0, 90, 180, 270] as const;

const R_CORE = 9.6;
const R_MAG = 13.8;
const R_NECK = 15.6;
const R_FOOT = 19.5;
const R_DIAL = 19.8;

interface StalkSubPart {
  id: string;
  depth: number;
  geometry: SolidGeometry;
  accent?: "green" | "vermilion";
  pin?: Vec2;
}

interface StalkAssembly {
  baseAngle: number;
  theta: number;
  depth: number;
  parts: StalkSubPart[];
}

function buildStalkAssembly(
  baseAngle: number,
  angleDeg: number,
  locked: boolean,
): StalkAssembly {
  const theta = baseAngle + angleDeg;
  const rad = theta * DEG;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const footX = R_FOOT * cos;
  const footY = R_FOOT * sin;
  const neckX = R_NECK * cos;
  const neckY = R_NECK * sin;
  const magX = R_MAG * cos;
  const magY = R_MAG * sin;

  const foot = slabOf(5.8, 5.8, 5.2, -2.5, P, {
    r: 1.0,
    cx: footX,
    cy: footY,
    bevel: 0.25,
    rotDeg: theta,
  });

  const neck = cylinder(neckX, neckY, -0.2, 1.65, 3.6, P, 16);

  const magnet = cylinder(magX, magY, 0.2, 2.4, 2.8, P, 18, {
    bevel: 0.18,
  });

  const rawParts: StalkSubPart[] = [
    {
      id: "foot",
      depth: depthOf([footX, footY, 0.1], P),
      geometry: foot,
      pin: iso([footX, footY, 2.7], P),
    },
    {
      id: "neck",
      depth: depthOf([neckX, neckY, 1.6], P),
      geometry: neck,
    },
    {
      id: "magnet",
      depth: depthOf([magX, magY, 1.6], P),
      geometry: magnet,
      accent: locked ? "green" : "vermilion",
      pin: iso([magX, magY, 3.0], P),
    },
  ];
  const parts = rawParts.sort((a, b) => a.depth - b.depth);

  return {
    baseAngle,
    theta,
    depth: depthOf([magX, magY, 1], P),
    parts,
  };
}

/**
 * Interactive 20-Magnet Ball-Core isometric cutaway with depth-sorted rotating corner
 * magnet stalks and 45-degree magnetic auto-snap flux simulation.
 */
export function BallCoreAnatomy({ locked, onToggleLock }: BallCoreAnatomyProps) {
  const targetAngle = locked ? 0 : 45;
  const [angleDeg, setAngleDeg] = useState<number>(targetAngle);
  const angleRef = useRef<number>(targetAngle);
  const velocityRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      angleRef.current = targetAngle;
      velocityRef.current = 0;
      setAngleDeg(targetAngle);
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();
    const stiffness = 190;
    const damping = 22;

    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const x = angleRef.current;
      const v = velocityRef.current;
      const force = (targetAngle - x) * stiffness - v * damping;
      const nextV = v + force * dt;
      const nextX = x + nextV * dt;

      if (Math.abs(targetAngle - nextX) < 0.03 && Math.abs(nextV) < 0.05) {
        angleRef.current = targetAngle;
        velocityRef.current = 0;
        setAngleDeg(targetAngle);
        return;
      }

      angleRef.current = nextX;
      velocityRef.current = nextV;
      setAngleDeg(nextX);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [targetAngle]);

  const staticParts = useMemo(() => {
    const baseSlab = slabOf(54, 44, 3.5, -16, P, { r: 4, bevel: 0.45 });
    const cornerScrews: Vec2[] = (
      [
        [21, 16, -12.5],
        [21, -16, -12.5],
        [-21, 16, -12.5],
        [-21, -16, -12.5],
      ] as Vec3[]
    ).map((pt) => iso(pt, P));

    const turntable = cylinder(0, 0, -12.5, 20.5, 1.5, P, 48, { bevel: 0.2 });
    const innerTrackRing = fullArc(0, 0, -11, 16.5, P, 48);
    const datumRing = fullArc(0, 0, -11, 13.8, P, 40);
    const ticks = radialTicks(0, 0, -11, 17.2, 19.8, 48, P, 6);

    const crosshairX = segment([-16.8, 0, -11], [16.8, 0, -11], P);
    const crosshairY = segment([0, -16.8, -11], [0, 16.8, -11], P);
    const diagA = segment([-14.4, -14.4, -11], [14.4, 14.4, -11], P);
    const diagB = segment([-14.4, 14.4, -11], [14.4, -14.4, -11], P);

    const collar = cylinder(0, 0, -11, 6.2, 2.0, P, 28, { bevel: 0.2 });
    const collarRing = fullArc(0, 0, -9, 4.8, P, 24);
    const stem = cylinder(0, 0, -9, 3.4, 5.0, P, 24);
    const stemKnurl = knurl(0, 0, -8.8, -4.4, 3.4, 14, P);

    const sphereDepth = depthOf([0, 0, 2], P);
    const coreSphere = sphereBands(0, 0, 2, R_CORE, P, 8, 28);
    const equatorSeam = sideArc(0, 0, 2, 9.7, P, 36);
    const polarCap = cylinder(0, 0, 10.6, 3.2, 1.4, P, 24, { bevel: 0.2 });
    const polarCapRing = fullArc(0, 0, 12.0, 1.7, P, 18);
    const polarScrew = iso([0, 0, 12.0], P);

    const frontCoreSockets = CORE_SOCKET_ANGLES.filter((deg) => {
      const r = deg * DEG;
      return depthOf([R_CORE * Math.cos(r), R_CORE * Math.sin(r), 2], P) >= sphereDepth;
    }).map((deg) => {
      const r = deg * DEG;
      const sx = R_CORE * Math.cos(r);
      const sy = R_CORE * Math.sin(r);
      return {
        deg,
        housing: cylinder(sx, sy, 1.1, 1.45, 1.8, P, 14, { bevel: 0.15 }),
        pole: iso([sx, sy, 2.9], P),
      };
    });

    return {
      baseSlab,
      cornerScrews,
      turntable,
      innerTrackRing,
      datumRing,
      ticks,
      crosshairX,
      crosshairY,
      diagA,
      diagB,
      collar,
      collarRing,
      stem,
      stemKnurl,
      sphereDepth,
      coreSphere,
      equatorSeam,
      polarCap,
      polarCapRing,
      polarScrew,
      frontCoreSockets,
    };
  }, []);

  const stalks = useMemo(
    () =>
      BASE_STALK_ANGLES.map((base) => buildStalkAssembly(base, angleDeg, locked)).sort(
        (a, b) => a.depth - b.depth,
      ),
    [angleDeg, locked],
  );

  const rearStalks = stalks.filter((s) => s.depth < staticParts.sphereDepth);
  const frontStalks = stalks.filter((s) => s.depth >= staticParts.sphereDepth);

  const isAligned = angleDeg < 8;
  const fluxTone = isAligned ? "green" : "vermilion";
  const needleTone = locked ? "green" : "vermilion";

  const needleRad = (45 + angleDeg) * DEG;
  const frontNeedleRad = (225 + angleDeg) * DEG;
  const needleLine = segment(
    [0, 0, -11],
    [R_DIAL * Math.cos(needleRad), R_DIAL * Math.sin(needleRad), -11],
    P,
  );
  const frontNeedleLine = segment(
    [6.4 * Math.cos(frontNeedleRad), 6.4 * Math.sin(frontNeedleRad), -11],
    [R_DIAL * Math.cos(frontNeedleRad), R_DIAL * Math.sin(frontNeedleRad), -11],
    P,
  );
  const needleTips: Vec2[] = [
    iso([R_DIAL * Math.cos(needleRad), R_DIAL * Math.sin(needleRad), -11], P),
    iso([R_DIAL * Math.cos(frontNeedleRad), R_DIAL * Math.sin(frontNeedleRad), -11], P),
  ];

  const fluxWires = BASE_STALK_ANGLES.map((base) => {
    const baseRad = base * DEG;
    const thetaRad = (base + angleDeg) * DEG;
    const start: Vec3 = [R_CORE * Math.cos(baseRad), R_CORE * Math.sin(baseRad), 2];
    const end: Vec3 = [R_MAG * Math.cos(thetaRad), R_MAG * Math.sin(thetaRad), 2.2];
    const liftZ = isAligned ? 3.2 : 5.2;
    return {
      base,
      ...wireCurve(start, end, liftZ, P),
    };
  });

  const renderStalk = (stalk: StalkAssembly, isFront: boolean) => (
    <g key={`stalk-${stalk.baseAngle}`}>
      {stalk.parts.map((part) => (
        <g key={part.id}>
          <Solid geometry={part.geometry} lit={isFront} accent={part.accent} />
          {part.pin && (
            <Dots
              points={[part.pin]}
              r={part.id === "magnet" ? 1.25 : 1.1}
              tone={part.id === "magnet" ? (locked ? "green" : "vermilion") : "mid"}
            />
          )}
        </g>
      ))}
    </g>
  );

  return (
    <IsoPlate
      fig="Fig 02"
      title="20-Magnet Ball-Core"
      hint="Klik simulasi snap 45°"
      readout={locked ? "0.0° · LOCKED" : `${angleDeg.toFixed(1)}° · AUTO-SNAP`}
      viewBox="-165 -114 330 232"
      interactive
      onClick={onToggleLock}
      ariaLabel={
        locked
          ? "20-Magnet Ball-Core terkunci 0 derajat, klik untuk simulasi rotasi 45 derajat"
          : "20-Magnet Ball-Core sudut 45 derajat, klik untuk snap kembali ke 0 derajat"
      }
    >
      {/* 1. Base Protractor Platform (z = -16 to -11) */}
      <Solid geometry={staticParts.baseSlab} />
      <Dots points={staticParts.cornerScrews} r={1.65} tone="hi" />
      <Solid geometry={staticParts.turntable} />
      <Line d={staticParts.innerTrackRing} tone="faint" w="hair" />
      <Line d={staticParts.datumRing} tone="faint" w="hair" dash />
      <Line d={staticParts.ticks.minor} tone="lo" w="hair" />
      <Line d={staticParts.ticks.major} tone="mid" w="thin" />
      <Line d={staticParts.crosshairX} tone="faint" w="hair" />
      <Line d={staticParts.crosshairY} tone="faint" w="hair" />
      <Line d={staticParts.diagA} tone="faint" w="hair" dash />
      <Line d={staticParts.diagB} tone="faint" w="hair" dash />
      <Line d={needleLine} tone={needleTone} w="mid" />
      <Line d={frontNeedleLine} tone={needleTone} w="mid" />
      <Dots points={needleTips} r={1.45} tone={needleTone} />

      {/* 2. Central Pedestal Column (z = -11 to -5) */}
      <Solid geometry={staticParts.collar} />
      <Line d={staticParts.collarRing} tone="lo" w="hair" />
      <Solid geometry={staticParts.stem} />
      <Line d={staticParts.stemKnurl} tone="lo" w="hair" />

      {/* 3. Rear Corner Magnet Stalks (depth < sphereDepth) */}
      {rearStalks.map((stalk) => renderStalk(stalk, false))}

      {/* 4. Central 20-Magnet Ball-Core Sphere */}
      <Solid geometry={staticParts.coreSphere} lit accent="blue" />
      <Line d={staticParts.equatorSeam} tone="blue" w="thin" />
      <Solid geometry={staticParts.polarCap} lit />
      <Line d={staticParts.polarCapRing} tone="mid" w="hair" />
      <Dots points={[staticParts.polarScrew]} r={1.35} tone="lit" />
      {staticParts.frontCoreSockets.map((sock) => (
        <g key={`core-sock-${sock.deg}`}>
          <Solid geometry={sock.housing} lit accent="blue" />
          <Dots points={[sock.pole]} r={1.15} tone="blue" />
        </g>
      ))}

      {/* 5. Magnetic Flux Attraction Vectors */}
      {fluxWires.map((wire) => (
        <Wire
          key={`flux-${wire.base}`}
          d={wire.d}
          a={wire.a2}
          b={wire.b2}
          tone={fluxTone}
          flow={isAligned}
          dash={!isAligned}
        />
      ))}

      {/* 6. Front Corner Magnet Stalks (depth >= sphereDepth) */}
      {frontStalks.map((stalk) => renderStalk(stalk, true))}
    </IsoPlate>
  );
}
