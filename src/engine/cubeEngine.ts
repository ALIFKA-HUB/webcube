import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Axis, CubeMove, EngineCallbacks, Finish } from "../types";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS & EASING HELPERS
   ════════════════════════════════════════════════════════════════════ */

export const STEP = 1.02;
export const HALF_PI = Math.PI / 2;

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeOutElastic = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export const FACE_COLORS: Record<string, number> = {
  "1,0,0": 0xe11d2e, // R — red
  "-1,0,0": 0xff7a00, // L — orange
  "0,1,0": 0xf8fafc, // U — white
  "0,-1,0": 0xffd60a, // D — yellow
  "0,0,1": 0x16a34a, // F — green
  "0,0,-1": 0x1d4ed8, // B — blue
};

/* ════════════════════════════════════════════════════════════════════
   CUBE ENGINE CREATION
   ════════════════════════════════════════════════════════════════════ */

export function createCubeEngine(container: HTMLDivElement, cb: EngineCallbacks) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.cursor = "grab";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  // Recalibrated studio lighting for warm light background
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xf5f3ee, 0.7);
  fillLight.position.set(-5, 4, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xe6e2d8, 0.45);
  rimLight.position.set(0, -6, -2);
  scene.add(rimLight);

  // Hierarchy: float (levitation) > root (user orientation) > cubeGroup (cubies)
  const floatGroup = new THREE.Group();
  const root = new THREE.Group();
  const cubeGroup = new THREE.Group();
  floatGroup.add(root);
  root.add(cubeGroup);
  scene.add(floatGroup);

  const HOME_QUAT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.52, -0.72, 0));
  root.quaternion.copy(HOME_QUAT);

  // Geometry & materials
  const bodyGeo = new RoundedBoxGeometry(0.97, 0.97, 0.97, 4, 0.11);
  const stickerGeo = new RoundedBoxGeometry(0.8, 0.8, 0.05, 3, 0.05);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x18181b,
    roughness: 0.35,
    metalness: 0.1,
  });

  const stickerMats = new Map<string, THREE.MeshPhysicalMaterial>();
  Object.entries(FACE_COLORS).forEach(([k, c]) => {
    stickerMats.set(k, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.12, metalness: 0.08 }));
  });

  const applyFinish = (f: Finish) => {
    const gloss = f === "gloss";
    stickerMats.forEach((m) => {
      m.roughness = gloss ? 0.12 : 0.75;
      m.metalness = gloss ? 0.08 : 0.0;
      m.clearcoat = gloss ? 1 : 0;
      m.clearcoatRoughness = gloss ? 0.04 : 0.5;
      m.envMapIntensity = gloss ? 1.1 : 0.5;
      m.needsUpdate = true;
    });
    bodyMat.roughness = gloss ? 0.35 : 0.85;
    bodyMat.metalness = gloss ? 0.1 : 0.02;
    bodyMat.clearcoat = gloss ? 0.5 : 0;
    bodyMat.clearcoatRoughness = gloss ? 0.08 : 0.5;
    bodyMat.envMapIntensity = gloss ? 1.0 : 0.5;
    bodyMat.needsUpdate = true;
  };
  applyFinish("gloss");

  // 27 cubies placed in [-1..1] grid
  const cubies: THREE.Group[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = new THREE.Group();
        cubie.position.set(x * STEP, y * STEP, z * STEP);
        cubie.add(new THREE.Mesh(bodyGeo, bodyMat));
        const dirs: [number, number, number][] = [
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
        ];
        dirs.forEach(([dx, dy, dz]) => {
          if (dx * x + dy * y + dz * z !== 1) return; // only outward faces
          const mat = stickerMats.get(`${dx},${dy},${dz}`)!;
          const s = new THREE.Mesh(stickerGeo, mat);
          const d = new THREE.Vector3(dx, dy, dz);
          s.position.copy(d).multiplyScalar(0.49);
          s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
          cubie.add(s);
        });
        cubeGroup.add(cubie);
        cubies.push(cubie);
      }
    }
  }

  // ── Layer-move animation engine ─────────────────────────────────────
  const queue: CubeMove[] = [];
  let history: CubeMove[] = [];
  let cur: { move: CubeMove; pivot: THREE.Group; members: THREE.Group[]; start: number } | null = null;
  let busy = false;

  const angleAt = (m: CubeMove, t: number) => {
    if (m.snap) {
      const peak = Math.PI / 4; // 45° under-turn
      const split = 0.32;
      if (t < split) return peak * easeOutCubic(t / split);
      return peak * (1 - easeOutElastic((t - split) / (1 - split)));
    }
    return m.dir * HALF_PI * easeInOutCubic(t);
  };

  const startMove = (m: CubeMove, now: number) => {
    const pivot = new THREE.Group();
    cubeGroup.add(pivot);
    const members = cubies.filter((c) => Math.round(c.position[m.axis] / STEP) === m.index);
    members.forEach((c) => pivot.attach(c));
    cur = { move: m, pivot, members, start: now };
  };

  const finishMove = () => {
    if (!cur) return;
    const { move, pivot, members } = cur;
    pivot.rotation[move.axis] = angleAt(move, 1);
    pivot.updateMatrixWorld(true);
    const e = new THREE.Euler();
    members.forEach((c) => {
      cubeGroup.attach(c);
      c.position.set(
        Math.round(c.position.x / STEP) * STEP,
        Math.round(c.position.y / STEP) * STEP,
        Math.round(c.position.z / STEP) * STEP
      );
      e.setFromQuaternion(c.quaternion);
      c.quaternion.setFromEuler(
        new THREE.Euler(
          Math.round(e.x / HALF_PI) * HALF_PI,
          Math.round(e.y / HALF_PI) * HALF_PI,
          Math.round(e.z / HALF_PI) * HALF_PI
        )
      );
    });
    cubeGroup.remove(pivot);
    if (move.record) history.push(move);
    cur = null;
    move.onDone?.();
  };

  const pushMoves = (ms: CubeMove[]) => {
    queue.push(...ms);
    if (!busy) {
      busy = true;
      cb.onBusy(true);
    }
  };

  // ── Pointer interaction with drag & inertia ─────────────────────────
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let homing: { from: THREE.Quaternion; start: number; dur: number } | null = null;
  const tmpQ = new THREE.Quaternion();
  const tmpE = new THREE.Euler();

  const rotateRoot = (vx: number, vy: number) => {
    tmpE.set(vy, vx, 0);
    tmpQ.setFromEuler(tmpE);
    root.quaternion.premultiply(tmpQ);
  };

  const dom = renderer.domElement;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    homing = null;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0;
    velY = 0;
    dom.setPointerCapture?.(e.pointerId);
    dom.style.cursor = "grabbing";
  };

  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = dx * 0.009;
    velY = dy * 0.009;
    rotateRoot(velX, velY);
  };

  const onUp = (e: PointerEvent) => {
    dragging = false;
    dom.releasePointerCapture?.(e.pointerId);
    dom.style.cursor = "grab";
  };

  dom.addEventListener("pointerdown", onDown);
  dom.addEventListener("pointermove", onMove);
  dom.addEventListener("pointerup", onUp);
  dom.addEventListener("pointercancel", onUp);

  // ── Responsive Resize ──────────────────────────────────────────────
  const resize = () => {
    const w = Math.max(container.clientWidth, 10);
    const h = Math.max(container.clientHeight, 10);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const dist = camera.aspect < 1 ? (11 / camera.aspect) * 0.86 : 11;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ── Render loop ────────────────────────────────────────────────────
  let raf = 0;
  const introStart = performance.now();

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const t = now / 1000;

    // Levitation bobbing & soft wobble
    floatGroup.position.y = 0.45 + Math.sin(t * 1.3) * 0.12;
    floatGroup.rotation.y = Math.sin(t * 0.5) * 0.1;
    floatGroup.rotation.x = Math.sin(t * 0.7) * 0.03;

    // Intro spring scale
    const intro = clamp01((now - introStart) / 1400);
    const sc = 0.55 + 0.45 * easeOutElastic(intro);
    root.scale.setScalar(sc);

    // Inertia dampening
    if (!dragging && !homing && (Math.abs(velX) > 1e-4 || Math.abs(velY) > 1e-4)) {
      rotateRoot(velX, velY);
      velX *= 0.94;
      velY *= 0.94;
    }

    // Magnetic homing (spring slerp)
    if (homing) {
      const p = clamp01((now - homing.start) / homing.dur);
      root.quaternion.slerpQuaternions(homing.from, HOME_QUAT, easeOutElastic(p));
      if (p >= 1) {
        root.quaternion.copy(HOME_QUAT);
        homing = null;
      }
    }

    // Layer moves
    if (!cur && queue.length) startMove(queue.shift()!, now);
    if (cur) {
      const p = clamp01((now - cur.start) / cur.move.dur);
      cur.pivot.rotation[cur.move.axis] = angleAt(cur.move, p);
      if (p >= 1) finishMove();
    }
    if (busy && !cur && queue.length === 0) {
      busy = false;
      cb.onBusy(false);
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  // ── Public API ─────────────────────────────────────────────────────
  const api = {
    twist() {
      cb.onStatus("Status: Slice Twist - U R F ...");
      const base = { index: 1, dir: -1, dur: 560, record: true };
      pushMoves([
        { ...base, axis: "y" },
        { ...base, axis: "x" },
        {
          ...base,
          axis: "z",
          onDone: () => cb.onStatus(`Status: Slice Twist - ${history.length} Moves`),
        },
      ]);
    },
    scramble() {
      cb.onStatus("Status: Scrambling... 0/20");
      const moves: CubeMove[] = [];
      let prev = "";
      for (let i = 0; i < 20; i++) {
        let axis: Axis;
        let index: number;
        let id: string;
        do {
          axis = (["x", "y", "z"] as Axis[])[Math.floor(Math.random() * 3)];
          index = Math.random() < 0.5 ? -1 : 1;
          id = axis + index;
        } while (id === prev);
        prev = id;
        const n = i + 1;
        moves.push({
          axis,
          index,
          dir: Math.random() < 0.5 ? -1 : 1,
          dur: 150,
          record: true,
          onDone: () =>
            cb.onStatus(n === 20 ? "Status: Scrambled - 20 Moves" : `Status: Scrambling... ${n}/20`),
        });
      }
      pushMoves(moves);
    },
    align() {
      cb.onStatus("Status: Magnetic Snap - Menyelaraskan...");
      homing = { from: root.quaternion.clone(), start: performance.now(), dur: 1500 };
      velX = 0;
      velY = 0;
      const n = history.length;
      const undo: CubeMove[] = history
        .slice()
        .reverse()
        .map((m) => ({
          axis: m.axis,
          index: m.index,
          dir: -m.dir,
          dur: Math.max(80, Math.min(240, 2400 / Math.max(n, 1))),
        }));
      history = [];
      const snaps: CubeMove[] = [
        { axis: "y", index: 1, dir: 1, dur: 1100, snap: true },
        {
          axis: "x",
          index: 1,
          dir: 1,
          dur: 1100,
          snap: true,
          onDone: () => cb.onStatus("Status: Aligned - 45° Auto-Snap Locked"),
        },
      ];
      pushMoves([...undo, ...snaps]);
    },
    setFinish(f: Finish) {
      applyFinish(f);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
      bodyGeo.dispose();
      stickerGeo.dispose();
      bodyMat.dispose();
      stickerMats.forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (dom.parentNode === container) container.removeChild(dom);
    },
  };

  return api;
}

export type CubeEngine = ReturnType<typeof createCubeEngine>;
export default createCubeEngine;
