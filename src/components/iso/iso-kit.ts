export type Vec3 = [number, number, number];
export type Vec2 = [number, number];

export interface Projection {
  az: number;
  el: number;
  scale: number;
  tx: number;
  ty: number;
}

export interface Solid {
  fill: string;
  outline: string;
  crease: string;
  top: string;
  shades: string[];
  bevel?: string;
}

export const AZIMUTH = 45;
export const ELEVATION = 30;
export const UNIT = Math.sqrt(1.6);

const DEG = Math.PI / 180;
const EPS = 1e-6;

// Normalized 2D top-left directional light in the XY ground plane.
const LIGHT_RAW: Vec2 = [-0.62, 0.78];
const LIGHT_LEN = Math.hypot(LIGHT_RAW[0], LIGHT_RAW[1]);
const LIGHT_2D: Vec2 = [LIGHT_RAW[0] / LIGHT_LEN, LIGHT_RAW[1] / LIGHT_LEN];

// 3D light for curved solids (consistent XY direction with an overhead +Z term).
const LIGHT_3D_RAW: Vec3 = [-0.62, 0.78, 0.85];
const LIGHT_3D_LEN = Math.hypot(LIGHT_3D_RAW[0], LIGHT_3D_RAW[1], LIGHT_3D_RAW[2]);
const LIGHT_3D: Vec3 = [
  LIGHT_3D_RAW[0] / LIGHT_3D_LEN,
  LIGHT_3D_RAW[1] / LIGHT_3D_LEN,
  LIGHT_3D_RAW[2] / LIGHT_3D_LEN,
];

function fmt(n: number): string {
  const rounded = Math.abs(n) < 0.005 ? 0 : n;
  return rounded.toFixed(2);
}

/**
 * Orthographic 2.5D isometric projection of a 3D point into 2D SVG coordinates.
 * At az = 0°, +X points right, +Y points into the screen, and +Z points up.
 */
export function iso([x, y, z]: Vec3, P: Projection): Vec2 {
  const a = P.az * DEG;
  const e = P.el * DEG;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const ce = Math.cos(e);
  const se = Math.sin(e);

  const rx = x * ca - y * sa;
  const ry = x * sa + y * ca;

  const sx = P.tx + rx * P.scale;
  const sy = P.ty - (ry * se + z * ce) * P.scale;
  return [sx, sy];
}

/**
 * Unit 3D vector pointing from the origin toward the camera.
 */
export function cameraOf(P: Projection): Vec3 {
  const a = P.az * DEG;
  const e = P.el * DEG;
  const ce = Math.cos(e);
  return [-Math.sin(a) * ce, -Math.cos(a) * ce, Math.sin(e)];
}

/**
 * Painter depth along the camera vector: larger values are closer to the viewer.
 * Sort ascending to draw back-to-front.
 */
export function depthOf(pt: Vec3, P: Projection): number {
  const [cx, cy, cz] = cameraOf(P);
  return pt[0] * cx + pt[1] * cy + pt[2] * cz;
}

/**
 * Normalized 2D [vx, vy] vector in the XY horizontal plane pointing toward the camera.
 */
export function towardViewer(P: Projection): Vec2 {
  const a = P.az * DEG;
  return [-Math.sin(a), -Math.cos(a)];
}

/**
 * Format a sequence of 2D points into an SVG path string.
 */
export function pathOf(pts: Vec2[], close = true): string {
  if (pts.length === 0) return "";
  const cmds = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${fmt(x)},${fmt(y)}`);
  if (close) cmds.push("Z");
  return cmds.join(" ");
}

/**
 * Generate a counter-clockwise 2D rounded rectangle ring centered at (cx, cy).
 */
export function roundedPlan(
  w: number,
  d: number,
  r = 0,
  segs = 4,
  cx = 0,
  cy = 0,
): Vec2[] {
  const hw = w / 2;
  const hd = d / 2;
  const cr = Math.max(0, Math.min(r, hw, hd));

  if (cr <= EPS || segs < 1) {
    return [
      [cx - hw, cy - hd],
      [cx + hw, cy - hd],
      [cx + hw, cy + hd],
      [cx - hw, cy + hd],
    ];
  }

  const corners: Array<{ ox: number; oy: number; start: number; end: number }> = [
    { ox: cx + hw - cr, oy: cy - hd + cr, start: -Math.PI / 2, end: 0 },
    { ox: cx + hw - cr, oy: cy + hd - cr, start: 0, end: Math.PI / 2 },
    { ox: cx - hw + cr, oy: cy + hd - cr, start: Math.PI / 2, end: Math.PI },
    { ox: cx - hw + cr, oy: cy - hd + cr, start: Math.PI, end: (3 * Math.PI) / 2 },
  ];

  const raw: Vec2[] = [];
  for (const c of corners) {
    for (let i = 0; i <= segs; i++) {
      const theta = c.start + (c.end - c.start) * (i / segs);
      raw.push([c.ox + cr * Math.cos(theta), c.oy + cr * Math.sin(theta)]);
    }
  }

  return dedupeRing(raw);
}

/**
 * Rotate a 2D polygon ring around (cx, cy) by angleDeg degrees.
 */
export function rotateRing(ring: Vec2[], angleDeg: number, cx = 0, cy = 0): Vec2[] {
  const rad = angleDeg * DEG;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return ring.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * c - dy * s, cy + dx * s + dy * c];
  });
}

/**
 * Rotate a 3D point in the XY plane around (cx, cy) by angleDeg degrees, preserving Z.
 */
export function rotXY([x, y, z]: Vec3, angleDeg: number, cx = 0, cy = 0): Vec3 {
  const rad = angleDeg * DEG;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c, z];
}

function dedupeRing(ring: Vec2[]): Vec2[] {
  const out: Vec2[] = [];
  for (const p of ring) {
    if (out.length === 0) {
      out.push(p);
      continue;
    }
    const prev = out[out.length - 1];
    if (Math.hypot(p[0] - prev[0], p[1] - prev[1]) > EPS) {
      out.push(p);
    }
  }
  if (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.hypot(first[0] - last[0], first[1] - last[1]) <= EPS) {
      out.pop();
    }
  }
  return out;
}

function signedArea(ring: Vec2[]): number {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % ring.length];
    area += x0 * y1 - x1 * y0;
  }
  return area * 0.5;
}

function edgeNormalsCCW(ring: Vec2[]): Vec2[] {
  const n = ring.length;
  const normals: Vec2[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % n];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    // Right-hand perpendicular is outward for a CCW ring.
    normals[i] = [dy / len, -dx / len];
  }
  return normals;
}

function insetRingCCW(ring: Vec2[], normals: Vec2[], inset: number): Vec2[] {
  const n = ring.length;
  const out: Vec2[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const prevN = normals[(i - 1 + n) % n];
    const currN = normals[i];
    // Inward normals are -outward.
    const ix = -(prevN[0] + currN[0]);
    const iy = -(prevN[1] + currN[1]);
    const dot = prevN[0] * currN[0] + prevN[1] * currN[1];
    const denom = Math.max(0.35, 1 + dot);
    out[i] = [
      ring[i][0] + (ix * inset) / denom,
      ring[i][1] + (iy * inset) / denom,
    ];
  }
  return out;
}

function shadeBin(ndotl: number): 0 | 1 | 2 | 3 {
  const idx = Math.floor(((1 - ndotl) * 0.5) * 4);
  if (idx <= 0) return 0;
  if (idx >= 3) return 3;
  return idx as 1 | 2;
}

function convexHull2D(points: Vec2[]): Vec2[] {
  if (points.length <= 3) return points;
  const pts = [...points].sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));
  const cross = (o: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: Vec2[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= EPS) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Vec2[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= EPS) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

interface DirectedEdge {
  fromKey: string;
  toKey: string;
  from: Vec2;
  to: Vec2;
}

function pointKey(p: Vec2): string {
  return `${Math.round(p[0] * 1000)},${Math.round(p[1] * 1000)}`;
}

function chainSilhouetteEdges(edges: DirectedEdge[]): string {
  if (edges.length === 0) return "";
  const byStart = new Map<string, DirectedEdge[]>();
  for (const e of edges) {
    const list = byStart.get(e.fromKey);
    if (list) list.push(e);
    else byStart.set(e.fromKey, [e]);
  }

  const used = new Set<DirectedEdge>();
  const loops: string[] = [];

  for (const seed of edges) {
    if (used.has(seed)) continue;
    const pts: Vec2[] = [seed.from];
    let curr: DirectedEdge | undefined = seed;
    let guard = 0;

    while (curr && !used.has(curr) && guard <= edges.length + 2) {
      guard++;
      used.add(curr);
      pts.push(curr.to);
      if (curr.toKey === seed.fromKey) {
        pts.pop();
        break;
      }
      const candidates = byStart.get(curr.toKey);
      curr = candidates?.find((e) => !used.has(e));
    }

    if (pts.length >= 3) {
      loops.push(pathOf(pts, true));
    }
  }

  return loops.join(" ");
}

/**
 * Extrude a 2D closed ring along +Z from `z` to `z + h` with 4-tone cel shading,
 * outer silhouette outline, top crease, optional chamfered bevel, and solid fill backing.
 */
export function extrude(
  ringInput: Vec2[],
  z: number,
  h: number,
  P: Projection,
  opts?: { convex?: boolean; bevel?: number },
): Solid {
  const cleaned = dedupeRing(ringInput);
  if (cleaned.length < 3) {
    return { fill: "", outline: "", crease: "", top: "", shades: ["", "", "", ""] };
  }

  const ring = signedArea(cleaned) < 0 ? [...cleaned].reverse() : cleaned;
  const n = ring.length;
  const normals = edgeNormalsCCW(ring);
  const [vx, vy] = towardViewer(P);
  const isConvex = opts?.convex ?? true;

  const rawBevel = opts?.bevel ?? 0;
  const hasBevel = rawBevel > EPS && h > EPS;
  const bevelSize = hasBevel ? Math.min(rawBevel, h * 0.45) : 0;
  const shoulderZ = z + h - bevelSize;
  const topZ = z + h;

  const topRing2D = bevelSize > 0 ? insetRingCCW(ring, normals, bevelSize) : ring;

  const botPts = ring.map(([x, y]) => iso([x, y, z], P));
  const shoulderPts = bevelSize > 0 ? ring.map(([x, y]) => iso([x, y, shoulderZ], P)) : botPts;
  const topPts = topRing2D.map(([x, y]) => iso([x, y, topZ], P));
  const wallTopPts = bevelSize > 0 ? shoulderPts : topPts;

  const visible = normals.map(([nx, ny]) => nx * vx + ny * vy > EPS);

  const shadeBuckets: string[][] = [[], [], [], []];
  const creaseSegments: string[] = [];
  const bevelSegments: string[] = [];
  const fillCompoundParts: string[] = [];

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (!visible[i]) continue;

    const [nx, ny] = normals[i];
    const ndotl = nx * LIGHT_2D[0] + ny * LIGHT_2D[1];
    const bin = shadeBin(ndotl);

    const wallQuad: Vec2[] = [botPts[i], botPts[j], wallTopPts[j], wallTopPts[i]];
    const wallPath = pathOf(wallQuad, true);
    shadeBuckets[bin].push(wallPath);
    fillCompoundParts.push(wallPath);

    if (bevelSize > 0) {
      // Chamfered bevel facet tilts 45° upward, catching extra overhead light.
      const bevelNdotL = Math.max(-1, Math.min(1, ndotl * 0.707 + 0.38));
      const bevelBin = shadeBin(bevelNdotL);
      const bevelQuad: Vec2[] = [shoulderPts[i], shoulderPts[j], topPts[j], topPts[i]];
      const bevelPath = pathOf(bevelQuad, true);
      shadeBuckets[bevelBin].push(bevelPath);
      fillCompoundParts.push(bevelPath);

      bevelSegments.push(pathOf([shoulderPts[i], shoulderPts[j]], false));
      creaseSegments.push(pathOf([topPts[i], topPts[j]], false));
    } else {
      creaseSegments.push(pathOf([topPts[i], topPts[j]], false));
    }
  }

  const top = pathOf(topPts, true);
  fillCompoundParts.push(top);

  let outline = "";
  let fill = "";

  if (isConvex) {
    const allPts = bevelSize > 0 ? [...botPts, ...shoulderPts, ...topPts] : [...botPts, ...topPts];
    outline = pathOf(convexHull2D(allPts), true);
    fill = outline;
  } else {
    // Trace 3D silhouette edges into closed loop(s) so concavities (e.g. ringHalf bore) stay hollow.
    const silhouetteEdges: DirectedEdge[] = [];
    const pushEdge = (a: Vec2, b: Vec2) => {
      const fromKey = pointKey(a);
      const toKey = pointKey(b);
      if (fromKey !== toKey) {
        silhouetteEdges.push({ fromKey, toKey, from: a, to: b });
      }
    };

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const prev = (i - 1 + n) % n;

      if (visible[i]) {
        pushEdge(botPts[i], botPts[j]);
      } else {
        pushEdge(topPts[j], topPts[i]);
      }

      if (visible[prev] && !visible[i]) {
        pushEdge(botPts[i], wallTopPts[i]);
        if (bevelSize > 0) pushEdge(wallTopPts[i], topPts[i]);
      } else if (!visible[prev] && visible[i]) {
        if (bevelSize > 0) pushEdge(topPts[i], wallTopPts[i]);
        pushEdge(wallTopPts[i], botPts[i]);
      }
    }

    outline = chainSilhouetteEdges(silhouetteEdges);
    fill = outline || fillCompoundParts.join(" ");
  }

  const solid: Solid = {
    fill,
    outline,
    crease: creaseSegments.join(" "),
    top,
    shades: shadeBuckets.map((b) => b.join(" ")),
  };

  if (bevelSize > 0) {
    solid.bevel = bevelSegments.join(" ");
  }

  return solid;
}

/**
 * Extrude a rounded rectangular slab centered at (cx, cy) from `z` to `z + h`.
 */
export function slabOf(
  w: number,
  d: number,
  h: number,
  z: number,
  P: Projection,
  opts?: { r?: number; cx?: number; cy?: number; bevel?: number; rotDeg?: number },
): Solid {
  const cx = opts?.cx ?? 0;
  const cy = opts?.cy ?? 0;
  let ring = roundedPlan(w, d, opts?.r ?? 0, 4, cx, cy);
  if (opts?.rotDeg) {
    ring = rotateRing(ring, opts.rotDeg, cx, cy);
  }
  return extrude(ring, z, h, P, { convex: true, bevel: opts?.bevel });
}

/**
 * Extrude a regular cylindrical prism centered at (cx, cy) from `z` to `z + h`.
 */
export function cylinder(
  cx: number,
  cy: number,
  z: number,
  r: number,
  h: number,
  P: Projection,
  segs = 32,
  opts?: { bevel?: number },
): Solid {
  const ring: Vec2[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * 2 * Math.PI;
    ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return extrude(ring, z, h, P, { convex: true, bevel: opts?.bevel });
}

/**
 * Half-annulus split along the plane perpendicular to `towardViewer(P)` for
 * clean back-to-front painter layering around a central shaft.
 */
export function ringHalf(
  cx: number,
  cy: number,
  z: number,
  rOuter: number,
  rInner: number,
  h: number,
  P: Projection,
  half: "back" | "front",
  segs = 28,
  bevel = 0.2,
): Solid {
  const [vx, vy] = towardViewer(P);
  const thetaFront = Math.atan2(vy, vx);
  const a0 = half === "front" ? thetaFront - Math.PI / 2 : thetaFront + Math.PI / 2;
  const a1 = half === "front" ? thetaFront + Math.PI / 2 : thetaFront + (3 * Math.PI) / 2;

  const ring: Vec2[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = a0 + (a1 - a0) * (i / segs);
    ring.push([cx + rOuter * Math.cos(a), cy + rOuter * Math.sin(a)]);
  }
  for (let i = segs; i >= 0; i--) {
    const a = a0 + (a1 - a0) * (i / segs);
    ring.push([cx + rInner * Math.cos(a), cy + rInner * Math.sin(a)]);
  }

  const safeBevel = bevel > 0 ? Math.min(bevel, Math.max(0, (rOuter - rInner) * 0.35)) : 0;
  return extrude(ring, z, h, P, { convex: false, bevel: safeBevel });
}

/**
 * Vertical helical coil along Z split into `back` and `front` SVG paths based on
 * `dot([cos(a), sin(a)], towardViewer(P))`.
 */
export function coilZ(
  cx: number,
  cy: number,
  z0: number,
  z1: number,
  r: number,
  turns: number,
  P: Projection,
  samples = 140,
): { back: string; front: string } {
  const [vx, vy] = towardViewer(P);
  const backPaths: string[] = [];
  const frontPaths: string[] = [];

  let currentPts: Vec2[] = [];
  let currentFront: boolean | null = null;
  let prevDot = 0;
  let prevPt3: Vec3 = [0, 0, 0];

  const flush = (pts: Vec2[], isFront: boolean) => {
    if (pts.length >= 2) {
      const d = pathOf(pts, false);
      if (isFront) frontPaths.push(d);
      else backPaths.push(d);
    }
  };

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const a = t * turns * 2 * Math.PI;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const pt3: Vec3 = [cx + r * ca, cy + r * sa, z0 + (z1 - z0) * t];
    const pt2 = iso(pt3, P);
    const dot = ca * vx + sa * vy;
    const isFront = dot >= 0;

    if (currentFront === null) {
      currentFront = isFront;
      currentPts = [pt2];
    } else if (isFront === currentFront) {
      currentPts.push(pt2);
    } else {
      const denom = dot - prevDot;
      const u = Math.abs(denom) > EPS ? -prevDot / denom : 0.5;
      const cross3: Vec3 = [
        prevPt3[0] + (pt3[0] - prevPt3[0]) * u,
        prevPt3[1] + (pt3[1] - prevPt3[1]) * u,
        prevPt3[2] + (pt3[2] - prevPt3[2]) * u,
      ];
      const cross2 = iso(cross3, P);
      currentPts.push(cross2);
      flush(currentPts, currentFront);
      currentFront = isFront;
      currentPts = [cross2, pt2];
    }

    prevDot = dot;
    prevPt3 = pt3;
  }

  if (currentFront !== null) {
    flush(currentPts, currentFront);
  }

  return {
    back: backPaths.join(" "),
    front: frontPaths.join(" "),
  };
}

/**
 * Multi-band lathe sphere projected around [cx, cy, cz] with 4-tone shaded quads,
 * circular silhouette outline, equatorial crease, and clean fill disc.
 */
export function sphereBands(
  cx: number,
  cy: number,
  cz: number,
  r: number,
  P: Projection,
  latSteps = 8,
  lonSteps = 28,
): Solid {
  const cam = cameraOf(P);
  const [sx, sy] = iso([cx, cy, cz], P);
  const R = r * P.scale;

  const discPath =
    R > EPS
      ? `M${fmt(sx + R)},${fmt(sy)} A${fmt(R)},${fmt(R)} 0 1 0 ${fmt(sx - R)},${fmt(sy)} A${fmt(R)},${fmt(R)} 0 1 0 ${fmt(sx + R)},${fmt(sy)} Z`
      : "";

  const shadeBuckets: string[][] = [[], [], [], []];

  for (let i = 0; i < latSteps; i++) {
    const phi0 = -Math.PI / 2 + (i / latSteps) * Math.PI;
    const phi1 = -Math.PI / 2 + ((i + 1) / latSteps) * Math.PI;
    const phiMid = (phi0 + phi1) * 0.5;

    for (let j = 0; j < lonSteps; j++) {
      const th0 = (j / lonSteps) * 2 * Math.PI;
      const th1 = ((j + 1) / lonSteps) * 2 * Math.PI;
      const thMid = (th0 + th1) * 0.5;

      const nx = Math.cos(phiMid) * Math.cos(thMid);
      const ny = Math.cos(phiMid) * Math.sin(thMid);
      const nz = Math.sin(phiMid);

      const nDotCam = nx * cam[0] + ny * cam[1] + nz * cam[2];
      if (nDotCam <= -0.05) continue;

      const ndotl = nx * LIGHT_3D[0] + ny * LIGHT_3D[1] + nz * LIGHT_3D[2];
      const bin = shadeBin(ndotl);

      const p00 = iso(
        [
          cx + r * Math.cos(phi0) * Math.cos(th0),
          cy + r * Math.cos(phi0) * Math.sin(th0),
          cz + r * Math.sin(phi0),
        ],
        P,
      );
      const p10 = iso(
        [
          cx + r * Math.cos(phi0) * Math.cos(th1),
          cy + r * Math.cos(phi0) * Math.sin(th1),
          cz + r * Math.sin(phi0),
        ],
        P,
      );
      const p11 = iso(
        [
          cx + r * Math.cos(phi1) * Math.cos(th1),
          cy + r * Math.cos(phi1) * Math.sin(th1),
          cz + r * Math.sin(phi1),
        ],
        P,
      );
      const p01 = iso(
        [
          cx + r * Math.cos(phi1) * Math.cos(th0),
          cy + r * Math.cos(phi1) * Math.sin(th0),
          cz + r * Math.sin(phi1),
        ],
        P,
      );

      const quad = dedupeRing([p00, p10, p11, p01]);
      if (quad.length >= 3) {
        shadeBuckets[bin].push(pathOf(quad, true));
      }
    }
  }

  return {
    fill: discPath,
    outline: discPath,
    crease: sideArc(cx, cy, cz, r, P, lonSteps),
    top: "",
    shades: shadeBuckets.map((b) => b.join(" ")),
  };
}

/**
 * Vertical knurling lines along the front-facing half of a cylinder from z0 to z1.
 */
export function knurl(
  cx: number,
  cy: number,
  z0: number,
  z1: number,
  r: number,
  n: number,
  P: Projection,
): string {
  const [vx, vy] = towardViewer(P);
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    if (ca * vx + sa * vy > 0.05) {
      parts.push(segment([cx + r * ca, cy + r * sa, z0], [cx + r * ca, cy + r * sa, z1], P));
    }
  }
  return parts.join(" ");
}

/**
 * Front-facing 180° arc at height `z` on a circle of radius `r` centered at (cx, cy).
 */
export function sideArc(
  cx: number,
  cy: number,
  z: number,
  r: number,
  P: Projection,
  segs = 28,
): string {
  const [vx, vy] = towardViewer(P);
  const thetaFront = Math.atan2(vy, vx);
  const a0 = thetaFront - Math.PI / 2;
  const a1 = thetaFront + Math.PI / 2;
  const pts: Vec2[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = a0 + (a1 - a0) * (i / segs);
    pts.push(iso([cx + r * Math.cos(a), cy + r * Math.sin(a), z], P));
  }
  return pathOf(pts, false);
}

/**
 * Full 360° closed circle projected at height `z`.
 */
export function fullArc(
  cx: number,
  cy: number,
  z: number,
  r: number,
  P: Projection,
  segs = 36,
): string {
  const pts: Vec2[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * 2 * Math.PI;
    pts.push(iso([cx + r * Math.cos(a), cy + r * Math.sin(a), z], P));
  }
  return pathOf(pts, true);
}

/**
 * Linear ruler ticks along X from x0 to x1 at (y, z), extending by `len` in Y.
 */
export function topTicks(
  x0: number,
  x1: number,
  y: number,
  z: number,
  n: number,
  len: number,
  P: Projection,
  majorEvery = 5,
): { minor: string; major: string } {
  const minor: string[] = [];
  const major: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = n > 0 ? i / n : 0;
    const x = x0 + (x1 - x0) * t;
    const isMajor = majorEvery > 0 && i % majorEvery === 0;
    const tickLen = isMajor ? len * 1.5 : len;
    const seg = segment([x, y, z], [x, y + tickLen, z], P);
    if (isMajor) major.push(seg);
    else minor.push(seg);
  }
  return {
    minor: minor.join(" "),
    major: major.join(" "),
  };
}

/**
 * Radial dial ticks around (cx, cy, z) between rInner and rOuter.
 */
export function radialTicks(
  cx: number,
  cy: number,
  z: number,
  rInner: number,
  rOuter: number,
  n: number,
  P: Projection,
  majorEvery = 6,
): { minor: string; major: string } {
  const minor: string[] = [];
  const major: string[] = [];
  const minorInner = rInner + (rOuter - rInner) * 0.35;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const isMajor = majorEvery > 0 && i % majorEvery === 0;
    const r0 = isMajor ? rInner : minorInner;
    const seg = segment(
      [cx + r0 * ca, cy + r0 * sa, z],
      [cx + rOuter * ca, cy + rOuter * sa, z],
      P,
    );
    if (isMajor) major.push(seg);
    else minor.push(seg);
  }
  return {
    minor: minor.join(" "),
    major: major.join(" "),
  };
}

/**
 * Project a 3D line segment between `a` and `b` into an SVG path string.
 */
export function segment(a: Vec3, b: Vec3, P: Projection): string {
  return pathOf([iso(a, P), iso(b, P)], false);
}

/**
 * Project a smooth cubic Bezier wire arching between `a` and `b` with vertical lift `liftZ`.
 */
export function wireCurve(
  a: Vec3,
  b: Vec3,
  liftZ: number,
  P: Projection,
): { d: string; a2: Vec2; b2: Vec2 } {
  const a2 = iso(a, P);
  const b2 = iso(b, P);
  const c1 = iso([a[0], a[1], a[2] + liftZ], P);
  const c2 = iso([b[0], b[1], b[2] + liftZ], P);
  const d = `M${fmt(a2[0])},${fmt(a2[1])} C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(b2[0])},${fmt(b2[1])}`;
  return { d, a2, b2 };
}
