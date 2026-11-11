import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  Award,
  Box,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Cpu,
  Crown,
  Droplets,
  ExternalLink,
  Flame,
  Gauge,
  Layers,
  Magnet,
  Menu,
  MessageCircle,
  Music2,
  Palette,
  Play,
  RotateCcw,
  Shuffle,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Square,
  Star,
  Store,
  Target,
  Timer,
  Truck,
  Users,
  Video,
  VolumeX,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ════════════════════════════════════════════════════════════════════ */

const WA_NUMBER = "6281234567890";
const WA_HERO =
  "https://wa.me/6281234567890?text=Halo%20CuberLab%20ID,%20saya%20tertarik%20pesan%20Speedcube%20Flagship";
const WA_CONSULT =
  "https://wa.me/6281234567890?text=Halo%20Admin%20CuberLab%20ID,%20saya%20mau%20konsultasi%20dan%20klaim%20promo%20pembelian%20rubik";
const WA_GENERAL = `https://wa.me/${WA_NUMBER}`;
const IG_URL = "https://instagram.com/cuberlab.id";

const formatRupiah = (n: number) =>
  "Rp " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const NAV_LINKS = [
  { label: "Fitur MagLev", id: "fitur" },
  { label: "Katalog Flagship", id: "katalog" },
  { label: "Simulasi Timer", id: "timer" },
  { label: "Testimoni", id: "testimoni" },
];

const GRADIENT_TEXT =
  "bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent";

/* ════════════════════════════════════════════════════════════════════
   GENERIC UI PIECES
   ════════════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-3xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300 backdrop-blur-xl">
        {icon}
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{subtitle}</p>
    </Reveal>
  );
}

/** Card with hover lift + cursor-tracking spotlight */
function SpotlightCard({
  children,
  className = "",
  glow = "rgba(6,182,212,0.16)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F111A]/80 backdrop-blur-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 60%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

function CountUp({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      {suffix}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BACKGROUND ATMOSPHERE
   ════════════════════════════════════════════════════════════════════ */

function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-cyan-500/25 blur-[140px]"
        animate={{ x: [0, 220, 80, 0], y: [0, 160, 340, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-[30%] h-[520px] w-[520px] rounded-full bg-indigo-500/25 blur-[140px]"
        animate={{ x: [0, -240, -80, 0], y: [0, 120, -120, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[30%] h-[380px] w-[380px] rounded-full bg-emerald-500/15 blur-[140px]"
        animate={{ x: [0, 160, -120, 0], y: [0, -80, 60, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════════════ */

function WhatsAppButton({
  href,
  children,
  className = "",
  pulse = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className={`group/btn relative inline-flex items-center justify-center gap-2 font-semibold ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {children}
    </motion.a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 50);
  };
  return (
    <header className="sticky top-4 z-50 px-3 sm:px-6">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-slate-900/70 px-3 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:rounded-full sm:pl-5 sm:pr-2.5"
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
            aria-label="CuberLab ID — kembali ke atas"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_0_24px_rgba(6,182,212,0.7)]">
              <Box className="h-5 w-5 text-white" />
            </span>
            <span className="text-left leading-none">
              <span className="block text-[15px] font-extrabold tracking-tight text-white">
                CuberLab<span className="text-cyan-400"> ID</span>
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Speedcube Flagship
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              href={WA_HERO}
              pulse
              className="rounded-full bg-emerald-500/15 px-3.5 py-2 text-xs text-emerald-300 ring-1 ring-emerald-400/40 transition hover:bg-emerald-500/25 sm:px-4 sm:text-sm"
            >
              <span className="hidden sm:inline">Chat WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </WhatsAppButton>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Buka menu navigasi"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-3 grid gap-1 border-t border-white/10 pt-3">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => go(l.id)}
                    className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-white/10"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THREE.JS — 3x3x3 RUBIK'S CUBE ENGINE
   ════════════════════════════════════════════════════════════════════ */

type Axis = "x" | "y" | "z";
type Finish = "gloss" | "matte";

interface CubeMove {
  axis: Axis;
  index: number;
  dir: number;
  dur: number;
  snap?: boolean;
  record?: boolean;
  onDone?: () => void;
}

interface EngineCallbacks {
  onStatus: (s: string) => void;
  onBusy: (b: boolean) => void;
}

const STEP = 1.02;
const HALF_PI = Math.PI / 2;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutElastic = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const FACE_COLORS: Record<string, number> = {
  "1,0,0": 0xe11d2e, // R — red
  "-1,0,0": 0xff7a00, // L — orange
  "0,1,0": 0xf8fafc, // U — white
  "0,-1,0": 0xffd60a, // D — yellow
  "0,0,1": 0x16a34a, // F — green
  "0,0,-1": 0x1d4ed8, // B — blue
};

function createCubeEngine(container: HTMLDivElement, cb: EngineCallbacks) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.cursor = "grab";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  // Neon rim lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(4, 7, 6);
  scene.add(key);
  const cyanLight = new THREE.PointLight(0x06b6d4, 90, 30);
  cyanLight.position.set(-6, 2, 4);
  scene.add(cyanLight);
  const indigoLight = new THREE.PointLight(0x6366f1, 90, 30);
  indigoLight.position.set(6, 3, -3);
  scene.add(indigoLight);
  const emeraldLight = new THREE.PointLight(0x10b981, 60, 30);
  emeraldLight.position.set(0, -6, 3);
  scene.add(emeraldLight);

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
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x111318, roughness: 0.45, metalness: 0.35 });
  const stickerMats = new Map<string, THREE.MeshPhysicalMaterial>();
  Object.entries(FACE_COLORS).forEach(([k, c]) => {
    stickerMats.set(k, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.15, metalness: 0.05 }));
  });

  const applyFinish = (f: Finish) => {
    const gloss = f === "gloss";
    stickerMats.forEach((m) => {
      m.roughness = gloss ? 0.12 : 0.8;
      m.metalness = gloss ? 0.08 : 0.0;
      m.clearcoat = gloss ? 1 : 0;
      m.clearcoatRoughness = gloss ? 0.04 : 0.6;
      m.envMapIntensity = gloss ? 1.2 : 0.55;
      m.needsUpdate = true;
    });
    bodyMat.roughness = gloss ? 0.4 : 0.9;
    bodyMat.metalness = gloss ? 0.4 : 0.05;
    bodyMat.clearcoat = gloss ? 0.6 : 0;
    bodyMat.envMapIntensity = gloss ? 1 : 0.5;
    bodyMat.needsUpdate = true;
  };
  applyFinish("gloss");

  // 27 cubies
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

  // ── Layer-move engine ──────────────────────────────────────────────
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

  // ── Interaction: drag to rotate with inertia ───────────────────────
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

  // ── Resize ─────────────────────────────────────────────────────────
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

    // levitation + soft wobble
    floatGroup.position.y = 0.55 + Math.sin(t * 1.4) * 0.16;
    floatGroup.rotation.y = Math.sin(t * 0.5) * 0.1;
    floatGroup.rotation.x = Math.sin(t * 0.7) * 0.03;

    // intro spring
    const intro = clamp01((now - introStart) / 1400);
    const sc = 0.55 + 0.45 * easeOutElastic(intro);
    root.scale.setScalar(sc);

    // inertia
    if (!dragging && !homing && (Math.abs(velX) > 1e-4 || Math.abs(velY) > 1e-4)) {
      rotateRoot(velX, velY);
      velX *= 0.94;
      velY *= 0.94;
    }

    // magnetic homing (spring slerp)
    if (homing) {
      const p = clamp01((now - homing.start) / homing.dur);
      root.quaternion.slerpQuaternions(homing.from, HOME_QUAT, easeOutElastic(p));
      if (p >= 1) {
        root.quaternion.copy(HOME_QUAT);
        homing = null;
      }
    }

    // layer moves
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

type CubeEngine = ReturnType<typeof createCubeEngine>;

/* ════════════════════════════════════════════════════════════════════
   HERO — 3D STAGE
   ════════════════════════════════════════════════════════════════════ */

function CubeStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CubeEngine | null>(null);
  const [status, setStatus] = useState("Status: Aligned - Home");
  const [busy, setBusy] = useState(false);
  const [finish, setFinish] = useState<Finish>("gloss");
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let engine: CubeEngine | null = null;
    try {
      engine = createCubeEngine(el, { onStatus: setStatus, onBusy: setBusy });
      engineRef.current = engine;
    } catch (err) {
      console.warn("WebGL tidak tersedia", err);
      setWebglOk(false);
    }
    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggleFinish = useCallback(() => {
    setFinish((f) => {
      const next: Finish = f === "gloss" ? "matte" : "gloss";
      engineRef.current?.setFinish(next);
      return next;
    });
  }, []);

  const dock = [
    {
      key: "twist",
      icon: <Layers className="h-4 w-4" />,
      label: "Putar Layer",
      sub: "(Slice Twist)",
      action: () => engineRef.current?.twist(),
      lock: true,
    },
    {
      key: "scramble",
      icon: <Shuffle className="h-4 w-4" />,
      label: "Scramble Mode",
      sub: "20 Moves",
      action: () => engineRef.current?.scramble(),
      lock: true,
    },
    {
      key: "align",
      icon: <Magnet className="h-4 w-4" />,
      label: "Auto-Align",
      sub: "45° Snap",
      action: () => engineRef.current?.align(),
      lock: true,
    },
    {
      key: "finish",
      icon: <Palette className="h-4 w-4" />,
      label: "Ganti Mode Finishing",
      sub: finish === "gloss" ? "UV High-Gloss" : "Frosted Matte",
      action: toggleFinish,
      lock: false,
    },
  ];

  return (
    <div className="relative">
      {/* ambient glow behind the card */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.35),rgba(6,182,212,0.18)_40%,transparent_70%)] blur-2xl" />

      <div className="relative h-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F111A]/70 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:h-[500px] lg:h-[460px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(6,182,212,0.16), transparent 55%), radial-gradient(circle at 80% 85%, rgba(16,185,129,0.12), transparent 50%)",
          }}
        />
        <div ref={mountRef} className="absolute inset-0" aria-label="Rubik's Cube 3D interaktif" />

        {!webglOk && (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-slate-400">
            Browser kamu belum mendukung WebGL. Perbarui browser untuk melihat showroom 3D.
          </div>
        )}

        {/* telemetry status */}
        <div className="pointer-events-none absolute left-3 top-3 right-3 flex items-start justify-between gap-2">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-[78%] items-center gap-2 rounded-full border border-emerald-400/30 bg-black/50 px-3 py-1.5 font-mono text-[10px] text-emerald-300 backdrop-blur-xl sm:text-[11px]"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${busy ? "animate-ping" : "opacity-60"}`} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="truncate">{status}</span>
          </motion.div>
          <span className="hidden rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] text-slate-400 backdrop-blur-xl sm:block">
            Drag untuk putar
          </span>
        </div>

        {/* floating HUD badges */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-3 top-16 flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-200 backdrop-blur-xl"
        >
          <Magnet className="h-3.5 w-3.5" /> 76 Neodymium Magnets
        </motion.div>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="pointer-events-none absolute left-3 top-[45%] flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-200 backdrop-blur-xl"
        >
          <Target className="h-3.5 w-3.5" /> 55.5mm Ergonomic Size
        </motion.div>
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          className="pointer-events-none absolute right-3 top-[52%] flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-200 backdrop-blur-xl"
        >
          <Zap className="h-3.5 w-3.5" /> 62g Ultra-Light
        </motion.div>

        {/* control dock */}
        <div className="absolute inset-x-2.5 bottom-2.5">
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-white/10 bg-black/55 p-1.5 backdrop-blur-xl sm:grid-cols-4">
            {dock.map((d) => {
              const disabled = d.lock && busy;
              return (
                <motion.button
                  key={d.key}
                  onClick={d.action}
                  disabled={disabled}
                  whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
                  whileTap={disabled ? undefined : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-2 text-left transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 text-cyan-200">
                    {d.icon}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[11px] font-semibold text-white">{d.label}</span>
                    <span className="block truncate font-mono text-[9px] text-slate-400">{d.sub}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ════════════════════════════════════════════════════════════════════ */

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Hero() {
  return (
    <section className="relative px-4 pb-20 pt-12 sm:px-6 lg:pt-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.div variants={heroItem}>
            <span className="relative inline-flex overflow-hidden rounded-full p-px">
              <motion.span
                className="absolute inset-[-200%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0 60%, #06B6D4 75%, #6366F1 88%, #10B981 100%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-[#0B0D14] px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-cyan-200 sm:text-xs sm:tracking-[0.16em]">
                ⚡ Official WCA Grade Speedcube Store Indonesia
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="mt-6 text-[2.5rem] font-black leading-[1.04] tracking-tight text-white sm:text-6xl xl:text-[4.25rem]"
          >
            Pecahkan Rekor <span className={GRADIENT_TEXT}>Sub-10 Detik</span> dengan Presisi{" "}
            <span className={GRADIENT_TEXT}>Magnetik MagLev.</span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Tinggalkan rubik macet dan berat. Rasakan sensasi putaran 0% gesekan pegas dengan teknologi{" "}
            <strong className="font-semibold text-slate-200">20-Magnet Ball-Core</strong>, auto-alignment 45°, dan
            lapisan <strong className="font-semibold text-slate-200">UV-Coated High Glossy</strong> yang dirancang
            khusus untuk tangan speedcuber kompetitif.
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              href={WA_HERO}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 px-6 py-4 text-[15px] font-bold text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]"
            >
              <MessageCircle className="h-5 w-5" />
              Pesan Sekarang via WhatsApp
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </WhatsAppButton>
            <motion.button
              onClick={() => scrollToId("katalog")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-[15px] font-semibold text-white backdrop-blur-xl transition-colors hover:border-cyan-400/50 hover:bg-white/10"
            >
              <ShoppingBag className="h-5 w-5 text-cyan-300" />
              Eksplorasi Katalog
            </motion.button>
          </motion.div>

          <motion.div variants={heroItem} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: <Users className="h-4 w-4" />,
                big: <CountUp to={2400} suffix="+" />,
                small: "Cuber Terdaftar",
                tone: "text-cyan-300",
              },
              {
                icon: <ShieldCheck className="h-4 w-4" />,
                big: <>100%</>,
                small: "Original GAN & MoYu",
                tone: "text-indigo-300",
              },
              {
                icon: <Wrench className="h-4 w-4" />,
                big: <>Gratis</>,
                small: "Garansi Tuning & Lube",
                tone: "text-emerald-300",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:block"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 sm:mb-2 ${s.tone}`}>
                  {s.icon}
                </span>
                <div>
                  <div className="font-mono text-xl font-bold text-white">{s.big}</div>
                  <div className="text-xs text-slate-400">{s.small}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <CubeStage />
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 2 — BENTO GRID
   ════════════════════════════════════════════════════════════════════ */

function Meter({
  label,
  value,
  display,
  color,
}: {
  label: string;
  value: number;
  display: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
        <span className="text-slate-400">{label}</span>
        <motion.span key={display} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-bold text-white">
          {display}
        </motion.span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        />
      </div>
    </div>
  );
}

function MagLevCard() {
  const [mode, setMode] = useState<"spring" | "maglev">("maglev");
  const isMag = mode === "maglev";
  const zig = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 8; i++) pts.push(`${i % 2 === 0 ? 76 : 124},${50 + i * 6.5}`);
    return pts.join(" ");
  }, []);

  return (
    <SpotlightCard className="md:col-span-2" glow="rgba(6,182,212,0.18)">
      <div className="grid h-full gap-6 p-6 sm:p-8 md:grid-cols-2">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
            <Magnet className="h-3 w-3" /> Dual-Repulsion System
          </span>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            Dual-Repulsion <span className={GRADIENT_TEXT}>MagLev</span> System
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Magnet cincin yang saling tolak menggantikan pegas logam konvensional. Hasilnya{" "}
            <strong className="text-slate-200">spring noise zero</strong>, tensi konsisten sepanjang umur pakai, dan
            gesekan kinetik turun hingga <strong className="text-cyan-300">68%</strong>, sehingga putaran terasa
            melayang dan nyaris tanpa suara.
          </p>

          <div className="relative mt-5 inline-flex w-fit rounded-full border border-white/10 bg-black/40 p-1">
            {(
              [
                ["spring", "Traditional Spring"],
                ["maglev", "MagLev Repulsion"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className={`relative z-10 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:text-[13px] ${
                  mode === k ? "text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                {mode === k && (
                  <motion.span
                    layoutId="maglev-pill"
                    className={`absolute inset-0 -z-10 rounded-full ${
                      k === "maglev" ? "bg-gradient-to-r from-cyan-400 to-emerald-400" : "bg-slate-300"
                    }`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <Meter
              label="Gesekan Kinetik"
              value={isMag ? 32 : 100}
              display={isMag ? "32% (-68%)" : "100%"}
              color={isMag ? "linear-gradient(90deg,#06B6D4,#10B981)" : "linear-gradient(90deg,#f59e0b,#ef4444)"}
            />
            <Meter
              label="Potensi Kecepatan (TPS)"
              value={isMag ? 94 : 58}
              display={isMag ? "11+ TPS" : "6–7 TPS"}
              color={isMag ? "linear-gradient(90deg,#6366F1,#06B6D4)" : "linear-gradient(90deg,#64748b,#94a3b8)"}
            />
            <Meter
              label="Suara Pegas"
              value={isMag ? 0 : 78}
              display={isMag ? "0 dB — Hening" : "Berderit"}
              color={isMag ? "linear-gradient(90deg,#10B981,#10B981)" : "linear-gradient(90deg,#f97316,#ef4444)"}
            />
          </div>
        </div>

        {/* animated schematic */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: isMag
                ? "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.22), transparent 65%)"
                : "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.14), transparent 65%)",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.svg
              key={mode}
              viewBox="0 0 200 170"
              className="relative h-full max-h-[260px] w-full max-w-[260px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* bottom plate */}
              <rect x="40" y="128" width="120" height="14" rx="5" fill="#1b1f2e" stroke="rgba(255,255,255,0.15)" />
              {!isMag ? (
                <>
                  <motion.g animate={{ y: [0, 7, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}>
                    <rect x="40" y="26" width="120" height="14" rx="5" fill="#2a2f42" stroke="rgba(255,255,255,0.2)" />
                  </motion.g>
                  <motion.polyline
                    points={zig}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    animate={{ scaleY: [1, 0.86, 1] }}
                    style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <text x="100" y="160" textAnchor="middle" fontSize="9" fill="#f59e0b" fontFamily="JetBrains Mono, monospace">
                    FRICTION + SPRING NOISE
                  </text>
                </>
              ) : (
                <>
                  <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
                    <rect x="40" y="22" width="120" height="14" rx="5" fill="#2a2f42" stroke="rgba(6,182,212,0.6)" />
                    <ellipse cx="100" cy="58" rx="42" ry="9" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="2" />
                    <text x="100" y="61" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fca5a5" fontFamily="JetBrains Mono, monospace">
                      N
                    </text>
                  </motion.g>
                  <ellipse cx="100" cy="110" rx="42" ry="9" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="2" />
                  <text x="100" y="113" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fca5a5" fontFamily="JetBrains Mono, monospace">
                    N
                  </text>
                  {[0, 1, 2].map((i) => (
                    <motion.ellipse
                      key={i}
                      cx="100"
                      cy="84"
                      rx="44"
                      ry="9"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.6"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      animate={{ scaleX: [0.45, 1.15], scaleY: [0.5, 1.2], opacity: [0.95, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.66, ease: "easeOut" }}
                    />
                  ))}
                  {[70, 100, 130].map((x, i) => (
                    <motion.g
                      key={x}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <path d={`M${x} 77 l0 -9 m-3 3 l3 -3 l3 3`} stroke="#34d399" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                      <path d={`M${x} 91 l0 9 m-3 -3 l3 3 l3 -3`} stroke="#34d399" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </motion.g>
                  ))}
                  <text x="100" y="160" textAnchor="middle" fontSize="9" fill="#22d3ee" fontFamily="JetBrains Mono, monospace">
                    N–N REPULSION • 0 CONTACT
                  </text>
                </>
              )}
            </motion.svg>
          </AnimatePresence>
        </div>
      </div>
    </SpotlightCard>
  );
}

function BallCoreCard() {
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLocked((l) => !l), 1900);
    return () => clearInterval(id);
  }, []);
  return (
    <SpotlightCard glow="rgba(99,102,241,0.2)">
      <div className="flex h-full flex-col p-6 sm:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo-300">
          <Cpu className="h-3 w-3" /> Ball-Core
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-white">20-Magnet Ball-Core & 45° Auto-Align</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Tarikan magnet dari sudut ke inti membuat layer langsung <em className="not-italic text-slate-200">snap</em>{" "}
          ke posisi presisi, bahkan saat kamu under-turn hingga 45°. Tidak ada lagi layer miring di tengah solve.
        </p>
        <button
          onClick={() => setLocked((l) => !l)}
          className="relative mt-5 flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-black/40 py-4"
          aria-label="Demo magnetic snap 45 derajat"
        >
          <svg viewBox="0 0 220 180" className="h-44 w-full max-w-[250px]">
            <defs>
              <radialGradient id="core-g">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="100%" stopColor="#4338ca" />
              </radialGradient>
            </defs>
            {[34, 52, 70].map((r, i) => (
              <motion.circle
                key={r}
                cx="110"
                cy="86"
                r={r}
                fill="none"
                stroke="#6366F1"
                strokeWidth="1"
                strokeDasharray="3 5"
                animate={{ opacity: locked ? [0.2, 0.9, 0.35] : 0.15, scale: locked ? [1, 1.04, 1] : 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
              />
            ))}
            <motion.g
              style={{ transformOrigin: "110px 86px" }}
              animate={{ rotate: locked ? 0 : 45 }}
              transition={{ type: "spring", stiffness: 190, damping: 9 }}
            >
              {[0, 90, 180, 270].map((a) => (
                <g key={a} transform={`rotate(${a} 110 86)`}>
                  <rect x="94" y="22" width="32" height="32" rx="7" fill="#161a28" stroke={locked ? "#10B981" : "#f59e0b"} strokeWidth="2" />
                  <line x1="110" y1="56" x2="110" y2="70" stroke={locked ? "#10B981" : "#f59e0b"} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="110" cy="38" r="5" fill={locked ? "#34d399" : "#fbbf24"} />
                </g>
              ))}
            </motion.g>
            <circle cx="110" cy="86" r="22" fill="url(#core-g)" />
            <circle cx="110" cy="86" r="22" fill="none" stroke="rgba(255,255,255,0.3)" />
            <text x="110" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="JetBrains Mono, monospace">
              CORE
            </text>
            <text
              x="110"
              y="172"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={locked ? "#34d399" : "#fbbf24"}
              fontFamily="JetBrains Mono, monospace"
            >
              {locked ? "0° — LOCKED ✓" : "45° UNDER-TURN"}
            </text>
          </svg>
        </button>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500">Klik diagram untuk simulasi</p>
      </div>
    </SpotlightCard>
  );
}

const STYLE_PROFILES = [
  { key: "CFOP", alg: "R U R' U' R' F R2 U' R' U' R U R' F'", tps: 11.8, note: "Cross → F2L → OLL/PLL tanpa lock-up." },
  { key: "Roux", alg: "M' U M' U M' U2 M U M U", tps: 12.6, note: "Putaran M-slice mulus, anti-pop saat flick cepat." },
  { key: "ZZ", alg: "R U2 R' U' R U' R' L' U' L U", tps: 10.9, note: "EOLine dan F2L tanpa rotasi tetap stabil." },
];

function CornerCuttingCard() {
  const [idx, setIdx] = useState(0);
  const [tps, setTps] = useState(STYLE_PROFILES[0].tps);
  const target = STYLE_PROFILES[idx].tps;
  useEffect(() => {
    const controls = animate(tps, target, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setTps(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  const p = STYLE_PROFILES[idx];
  return (
    <SpotlightCard glow="rgba(16,185,129,0.18)">
      <div className="flex h-full flex-col p-6 sm:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
          <Gauge className="h-3 w-3" /> Zero Lock-Up
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-white">90° Full Corner Cutting & Anti-Pop Torpedo</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Sudut corner cutting penuh 90° dengan desain Torpedo anti-pop: nol lock-up saat algoritma CFOP atau Roux
          dijalankan di TPS (Turns Per Second) tinggi.
        </p>

        <div className="mt-5 flex gap-2">
          {STYLE_PROFILES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIdx(i)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold transition ${
                i === idx
                  ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {s.key}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-4xl font-black text-white">{tps.toFixed(1)}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Peak TPS · {p.key}</div>
            </div>
            <svg viewBox="0 0 80 60" className="h-16 w-20">
              <path d="M8 52 A44 44 0 0 1 52 8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
              <motion.path
                d="M8 52 A44 44 0 0 1 52 8"
                fill="none"
                stroke="#10B981"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
              />
              <text x="56" y="54" fontSize="12" fontWeight="800" fill="#34d399" fontFamily="JetBrains Mono, monospace">
                90°
              </text>
            </svg>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3"
            >
              <code className="block rounded-lg bg-white/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-cyan-200">{p.alg}</code>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> {p.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SpotlightCard>
  );
}

const TENSION_LEVELS = [
  { title: "Feather-Light", style: "Pemanasan & tangan ringan", desc: "Layer sangat lepas, nyaris tanpa hambatan. Cocok untuk warm-up dan cuber dengan flick halus." },
  { title: "Ultra-Fast & Loose", style: "High TPS", desc: "Level 2: Ultra-Fast & Loose for High TPS. Respons secepat kilat untuk algoritma beruntun." },
  { title: "Fast & Responsive", style: "Speed solving harian", desc: "Ringan namun tetap terkendali. Pilihan favorit untuk sesi latihan Ao12 sehari-hari." },
  { title: "Balanced Competitive", style: "All-round kompetisi", desc: "Keseimbangan ideal antara kecepatan dan kontrol. Setelan standar banyak finalis WCA." },
  { title: "Stable & Controllable", style: "Accuracy", desc: "Level 5: Stable & Controllable for Accuracy. Minim overshoot, ideal untuk lookahead panjang." },
  { title: "Rock-Solid Precision", style: "Kontrol maksimal", desc: "Tensi paling kokoh untuk tangan bertenaga dan solve tanpa kompromi akurasi." },
];

const TRAVEL_LEVELS = [
  { title: "Minimal Travel", desc: "Center nyaris tanpa celah: super stabil, minim wobble." },
  { title: "Short Travel", desc: "Gerakan center pendek, responsif untuk gaya presisi." },
  { title: "Moderate Travel", desc: "Ruang gerak cukup untuk corner cutting tanpa mengorbankan kontrol." },
  { title: "Flexible Travel", desc: "Toleransi lebih besar saat layer sedikit miring di tengah algoritma." },
  { title: "Wide Travel", desc: "Corner cutting agresif dengan center yang lega dan forgiving." },
  { title: "Maximum Travel", desc: "Kelonggaran penuh untuk gaya speed-demon dan reaksi instan." },
];

function TuningCard() {
  const [tension, setTension] = useState(2);
  const [travel, setTravel] = useState(3);
  const avg = (tension + travel) / 2;
  const speed = Math.round(((7 - avg) / 6) * 100);
  const control = Math.round((avg / 6) * 100);
  const profile =
    avg <= 2.5
      ? { name: "Speed Demon Setup", color: "text-cyan-300" }
      : avg <= 4
        ? { name: "Balanced All-Rounder", color: "text-indigo-300" }
        : { name: "Precision Control Setup", color: "text-emerald-300" };

  const renderRow = ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: number;
    setValue: (n: number) => void;
  }) => (
    <div>
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-white">Level {value}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <motion.button
            key={n}
            onClick={() => setValue(n)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`${label} level ${n}`}
            className={`relative rounded-lg border py-2.5 font-mono text-sm font-bold transition-colors ${
              n === value
                ? "border-cyan-400/70 bg-cyan-400/20 text-cyan-100 shadow-[0_0_18px_rgba(6,182,212,0.35)]"
                : n < value
                  ? "border-white/10 bg-white/10 text-slate-300"
                  : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
            }`}
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <SpotlightCard className="md:col-span-2" glow="rgba(99,102,241,0.2)">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-indigo-300">
            <Sliders className="h-3 w-3" /> 12 Custom Settings
          </span>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            Dual-Adjustment <span className={GRADIENT_TEXT}>GES Pro+</span> & Custom Tuning
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Atur Tension (6 level) dan Center Travel (6 level) secara independen, total 12 setelan untuk menyesuaikan
            karakter cube dengan gaya tangan, TPS, dan ritme solve kamu. Setiap pembelian disertai tuning tool dan
            panduan setel dari tim CuberLab.
          </p>
          <div className="mt-6 space-y-5">
            {renderRow({ label: "Tension", value: tension, setValue: setTension })}
            {renderRow({ label: "Center Travel", value: travel, setValue: setTravel })}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setTension(2);
                setTravel(3);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
            >
              ⚡ Preset Speed (2 / 3)
            </button>
            <button
              onClick={() => {
                setTension(5);
                setTravel(4);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/50 hover:text-white"
            >
              🎯 Preset Akurasi (5 / 4)
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            <Activity className="h-3.5 w-3.5" /> Simulasi Tension & Elasticity Clicker
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tension}-${travel}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className={`text-lg font-extrabold ${profile.color}`}>{profile.name}</div>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white">
                    Tension {tension}: {TENSION_LEVELS[tension - 1].title}
                  </span>
                  <span className="shrink-0 rounded-full bg-cyan-400/15 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                    {TENSION_LEVELS[tension - 1].style}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{TENSION_LEVELS[tension - 1].desc}</p>
              </div>
              <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                <span className="text-sm font-bold text-white">
                  Travel {travel}: {TRAVEL_LEVELS[travel - 1].title}
                </span>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{TRAVEL_LEVELS[travel - 1].desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 space-y-3">
            <Meter label="Speed Feel" value={speed} display={`${speed}%`} color="linear-gradient(90deg,#06B6D4,#6366F1)" />
            <Meter label="Control Feel" value={control} display={`${control}%`} color="linear-gradient(90deg,#6366F1,#10B981)" />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

function BentoSection() {
  return (
    <section id="fitur" className="relative scroll-mt-28 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Rekayasa Presisi"
          icon={<Cpu className="h-3.5 w-3.5" />}
          title={
            <>
              Teknologi Rekayasa Presisi di Balik <span className={GRADIENT_TEXT}>Setiap Putaran</span>
            </>
          }
          subtitle="Speedcuber profesional beralih ke MagLev dan Ball-Core karena satu alasan: konsistensi. Tanpa pegas yang aus, tanpa layer yang nyangkut, dan tensi yang bisa kamu setel sesuai gaya tangan."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <MagLevCard />
          </Reveal>
          <Reveal delay={0.1}>
            <BallCoreCard />
          </Reveal>
          <Reveal delay={0.1}>
            <CornerCuttingCard />
          </Reveal>
          <Reveal delay={0.2} className="md:col-span-2">
            <TuningCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 3 — CATALOG
   ════════════════════════════════════════════════════════════════════ */

type Category = "all" | "flagship" | "mid" | "entry";

interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  badge: string;
  price: number;
  strike: number;
  aura: string;
  accent: string;
  palette: string[];
  weight: string;
  core: string;
  finish: string;
  tagline: string;
  specs: string[];
  details: [string, string][];
}

const PRODUCTS: Product[] = [
  {
    id: "gan16",
    name: "GAN 16 MagLev UV 3x3 Flagship",
    category: "flagship",
    badge: "👑 TOP FLAGSHIP 2026",
    price: 980000,
    strike: 1150000,
    aura: "rgba(6,182,212,0.40)",
    accent: "#06B6D4",
    palette: ["#f8fafc", "#ffd60a", "#e11d2e", "#ff7a00", "#1d4ed8", "#16a34a"],
    weight: "62g",
    core: "76 Magnets 3D Core",
    finish: "UV Stickerless",
    tagline: "Flagship terbaru untuk pemburu rekor dunia.",
    specs: [
      "76 Magnets 3D Core",
      "UV Coated Stickerless",
      "62g ultra-ringan",
      "45° Auto-Align",
      "6-Level MagLev Tension",
    ],
    details: [
      ["Sistem Inti", "3D Magnetic Core (76 magnet)"],
      ["Kompresi", "MagLev Repulsion, 6 level tensi"],
      ["Finishing", "UV Coated Stickerless, glossy"],
      ["Berat", "62g"],
      ["Auto-Align", "Snap presisi saat under-turn 45°"],
      ["Layanan", "Free setup lube + garansi tuning"],
    ],
  },
  {
    id: "weilong-v2",
    name: "MoYu Super WeiLong 3x3 V2 (20-Magnet Ball-Core)",
    category: "flagship",
    badge: "🔥 LIMITED ANNIVERSARY",
    price: 1450000,
    strike: 1690000,
    aura: "rgba(99,102,241,0.42)",
    accent: "#6366F1",
    palette: ["#f8fafc", "#ffd60a", "#e11d2e", "#ff7a00", "#1d4ed8", "#16a34a"],
    weight: "Ringan & Kompak",
    core: "20-Magnet Ball-Core",
    finish: "UV High-Gloss",
    tagline: "Edisi anniversary dengan Ball-Core paling presisi.",
    specs: [
      "20-Magnet Ball-Core",
      "MagLev System",
      "55.5mm Compact",
      "UV High-Gloss",
      "Custom Adjustment Tool",
    ],
    details: [
      ["Sistem Inti", "Ball-Core, 20 magnet"],
      ["Kompresi", "MagLev System"],
      ["Ukuran", "55.5mm Compact"],
      ["Finishing", "UV High-Gloss"],
      ["Aksesori", "Custom Adjustment Tool"],
      ["Layanan", "Free setup lube + garansi tuning"],
    ],
  },
  {
    id: "wrm-v9",
    name: "MoYu WeiLong WRM V9 (Ball-Core UV MagLev)",
    category: "mid",
    badge: "⚡ BEST VALUE PRO",
    price: 549000,
    strike: 650000,
    aura: "rgba(16,185,129,0.40)",
    accent: "#10B981",
    palette: ["#f8fafc", "#ffd60a", "#e11d2e", "#ff7a00", "#1d4ed8", "#16a34a"],
    weight: "Ringan",
    core: "Ball-Core + MagLev",
    finish: "UV Coated",
    tagline: "Performa pro dengan harga paling masuk akal.",
    specs: [
      "55mm Size",
      "MagLev + Ball-Core",
      "Anti-Sticky Groove",
      "Ultra-Fast Out of the Box",
    ],
    details: [
      ["Sistem Inti", "Ball-Core UV"],
      ["Kompresi", "MagLev"],
      ["Ukuran", "55mm"],
      ["Desain", "Anti-Sticky Groove"],
      ["Kondisi", "Ultra-fast langsung dari kotak"],
      ["Layanan", "Free setup lube + garansi tuning"],
    ],
  },
  {
    id: "gan356",
    name: "GAN 356 M E V2 (48 Turbo Magnets)",
    category: "entry",
    badge: "🎯 PILIHAN PEMULA - INTERMEDIATE",
    price: 389000,
    strike: 479000,
    aura: "rgba(244,114,182,0.34)",
    accent: "#f472b6",
    palette: ["#f8fafc", "#ffd60a", "#e11d2e", "#ff7a00", "#1d4ed8", "#16a34a"],
    weight: "Standar",
    core: "48 Turbo Magnet Capsules",
    finish: "Frosted",
    tagline: "Gerbang terbaik menuju sub-20 dan sub-15 detik.",
    specs: [
      "48 Turbo Magnet Capsules",
      "Honeycomb Grip Surface",
      "12 GES Pro+ Settings",
      "Frosted Finish",
    ],
    details: [
      ["Magnet", "48 Turbo Magnet Capsules"],
      ["Permukaan", "Honeycomb Grip Surface"],
      ["Tuning", "12 setelan GES Pro+"],
      ["Finishing", "Frosted (anti-slip)"],
      ["Cocok untuk", "Pemula hingga intermediate"],
      ["Layanan", "Free setup lube + garansi tuning"],
    ],
  },
];

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "all", label: "Semua Koleksi" },
  { key: "flagship", label: "Flagship Pro (MagLev)" },
  { key: "mid", label: "Mid-Range Best Seller" },
  { key: "entry", label: "Entry Competitive" },
];

function IsoCube({ palette, accent, seed }: { palette: string[]; accent: string; seed: number }) {
  const a: [number, number] = [60, 35];
  const b: [number, number] = [-60, 35];
  const c: [number, number] = [0, 70];
  const O: [number, number] = [100, 14];
  const pt = (o: [number, number], u: [number, number], v: [number, number], i: number, j: number) =>
    `${o[0] + (u[0] * i) / 3 + (v[0] * j) / 3},${o[1] + (u[1] * i) / 3 + (v[1] * j) / 3}`;
  const faces: { o: [number, number]; u: [number, number]; v: [number, number]; shade: number }[] = [
    { o: O, u: a, v: b, shade: 0 },
    { o: [O[0] + b[0], O[1] + b[1]], u: a, v: c, shade: 0.22 },
    { o: [O[0] + a[0], O[1] + a[1]], u: b, v: c, shade: 0.42 },
  ];
  return (
    <svg viewBox="0 0 200 170" className="h-full w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]">
      <defs>
        <linearGradient id={`gloss-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {faces.map((f, fi) => (
        <g key={fi}>
          {[0, 1, 2].flatMap((i) =>
            [0, 1, 2].map((j) => {
              const col = palette[(i * 2 + j * 3 + fi * 2 + seed) % palette.length];
              const points = [pt(f.o, f.u, f.v, i, j), pt(f.o, f.u, f.v, i + 1, j), pt(f.o, f.u, f.v, i + 1, j + 1), pt(f.o, f.u, f.v, i, j + 1)].join(" ");
              return (
                <g key={`${i}-${j}`}>
                  <polygon points={points} fill={col} stroke="#07080C" strokeWidth="3" strokeLinejoin="round" />
                  {f.shade > 0 && <polygon points={points} fill="#000" opacity={f.shade} />}
                </g>
              );
            })
          )}
        </g>
      ))}
      <polygon
        points={`${O[0]},${O[1]} ${O[0] + a[0]},${O[1] + a[1]} ${O[0] + a[0] + b[0]},${O[1] + a[1] + b[1]} ${O[0] + b[0]},${O[1] + b[1]}`}
        fill={`url(#gloss-${seed})`}
      />
      <polygon
        points={`${O[0]},${O[1]} ${O[0] + a[0]},${O[1] + a[1]} ${O[0] + a[0]},${O[1] + a[1] + c[1]} ${O[0]},${O[1] + a[1] + b[1] + c[1]} ${O[0] + b[0]},${O[1] + b[1] + c[1]} ${O[0] + b[0]},${O[1] + b[1]}`}
        fill="none"
        stroke={accent}
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [open, setOpen] = useState(false);
  const discount = Math.round((1 - product.price / product.strike) * 100);
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo CuberLab ID, saya mau order ${product.name} seharga ${formatRupiah(product.price)}`
  )}`;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F111A]/85 backdrop-blur-xl"
    >
      {/* visual header */}
      <div className="relative h-56 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${product.aura}, transparent 68%)` }} />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <span className="absolute left-3 top-3 z-10 max-w-[85%] rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-xl sm:text-[11px]">
          {product.badge}
        </span>
        <span
          className="absolute right-3 top-12 z-10 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950"
          style={{ background: product.accent }}
        >
          -{discount}%
        </span>
        <motion.div
          className="absolute inset-x-0 bottom-3 top-10 mx-auto w-44"
          animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1, rotate: 6 }}
        >
          <IsoCube palette={product.palette} accent={product.accent} seed={index} />
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-1.5">
          {[
            ["Berat", product.weight],
            ["Sistem Inti", product.core],
            ["Finishing", product.finish],
          ].map(([k, v]) => (
            <span key={k} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-slate-300">
              <span className="font-mono uppercase tracking-wider text-slate-500">{k}:</span> <span className="font-semibold text-slate-100">{v}</span>
            </span>
          ))}
        </div>

        <h3 className="mt-4 text-lg font-extrabold leading-snug tracking-tight text-white">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{product.tagline}</p>

        <div className="mt-4 flex items-end gap-3">
          <span className="text-2xl font-black text-white">{formatRupiah(product.price)}</span>
          <span className="pb-0.5 text-sm text-slate-500 line-through">{formatRupiah(product.strike)}</span>
        </div>

        <ul className="mt-4 grid gap-2">
          {product.specs.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: product.accent }} />
              {s}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:bg-white/[0.08]"
        >
          Lihat Detail Spesifikasi
          <motion.span animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <dl className="mt-3 divide-y divide-white/5 rounded-xl border border-white/10 bg-black/40 text-sm">
                {product.details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-medium text-slate-200">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-5">
          <WhatsAppButton
            href={waHref}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(16,185,129,0.3)]"
          >
            <ShoppingBag className="h-4 w-4" />
            Pesan Sekarang
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </WhatsAppButton>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogSection() {
  const [cat, setCat] = useState<Category>("all");
  const list = useMemo(() => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)), [cat]);
  return (
    <section id="katalog" className="relative scroll-mt-28 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Katalog Flagship"
          icon={<Crown className="h-3.5 w-3.5" />}
          title={
            <>
              Pilih Senjata <span className={GRADIENT_TEXT}>Rekor</span> Berikutnya
            </>
          }
          subtitle="Setiap unit 100% original, sudah di-lube dan di-tuning oleh tim CuberLab sebelum dikirim. Filter berdasarkan level permainanmu dan langsung pesan via WhatsApp."
        />

        <Reveal className="mb-10 flex justify-center">
          <div className="flex max-w-full flex-wrap justify-center gap-1.5 rounded-3xl border border-white/10 bg-slate-900/60 p-1.5 backdrop-blur-xl sm:rounded-full">
            {CATEGORY_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setCat(t.key)}
                className={`relative rounded-full px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                  cat === t.key ? "text-slate-950" : "text-slate-300 hover:text-white"
                }`}
              >
                {cat === t.key && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Bingung memilih?{" "}
          <a
            href={WA_CONSULT}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-cyan-300 underline-offset-4 hover:underline"
          >
            Konsultasi gratis dengan admin kami
          </a>
          .
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 4 — WCA TIMER SANDBOX
   ════════════════════════════════════════════════════════════════════ */

const FACES = ["U", "D", "L", "R", "F", "B"];
const AXIS_OF: Record<string, number> = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };

function generateScramble(len = 20): string[] {
  const out: string[] = [];
  const axes: number[] = [];
  while (out.length < len) {
    const f = FACES[Math.floor(Math.random() * FACES.length)];
    const prev = out[out.length - 1]?.[0];
    if (f === prev) continue;
    const ax = AXIS_OF[f];
    // avoid three consecutive moves on the same axis (e.g. R L R)
    if (axes.length >= 2 && axes[axes.length - 1] === ax && axes[axes.length - 2] === ax) continue;
    const mod = ["", "'", "2"][Math.floor(Math.random() * 3)];
    out.push(f + mod);
    axes.push(ax);
  }
  return out;
}

const formatTime = (ms: number) => {
  const total = ms / 1000;
  if (total >= 60) {
    const m = Math.floor(total / 60);
    const s = total - m * 60;
    return `${m}:${s.toFixed(3).padStart(6, "0")}s`;
  }
  return `${total.toFixed(3).padStart(6, "0")}s`;
};

type Phase = "idle" | "holding" | "ready" | "running" | "stopped";

function recommend(sec: number): { product: Product; headline: string } {
  if (sec < 10)
    return { product: PRODUCTS[0], headline: "Level elit! Waktumu sudah di zona sub-10 — saatnya flagship tanpa kompromi." };
  if (sec < 18)
    return { product: PRODUCTS[1], headline: "Kamu sudah kompetitif. Ball-Core 20 magnet akan memangkas lock-up dan menambah TPS." };
  if (sec < 30)
    return { product: PRODUCTS[2], headline: "Potensi besar! WRM V9 memberi performa pro dengan harga yang bersahabat." };
  return { product: PRODUCTS[3], headline: "Awal yang bagus! GAN 356 M E V2 membantumu menembus sub-20 dengan nyaman." };
}

function TimerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const inViewRef = useRef(false);
  inViewRef.current = inView;

  const [scramble, setScramble] = useState<string[]>(() => generateScramble());
  const [phase, setPhaseState] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [solves, setSolves] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const newScramble = useCallback(() => setScramble(generateScramble()), []);

  const loop = useCallback(() => {
    setElapsed(performance.now() - startRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const startTimer = useCallback(() => {
    startRef.current = performance.now();
    setCopied(false);
    setPhase("running");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, setPhase]);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const final = performance.now() - startRef.current;
    setElapsed(final);
    setSolves((s) => [final, ...s].slice(0, 12));
    setPhase("stopped");
    setScramble(generateScramble());
  }, [setPhase]);

  const pressDown = useCallback(() => {
    if (phaseRef.current === "running") {
      stopTimer();
      return;
    }
    if (phaseRef.current === "idle" || phaseRef.current === "stopped") {
      setPhase("holding");
      setElapsed(0);
      if (holdRef.current) clearTimeout(holdRef.current);
      holdRef.current = setTimeout(() => {
        if (phaseRef.current === "holding") setPhase("ready");
      }, 300);
    }
  }, [setPhase, stopTimer]);

  const pressUp = useCallback(() => {
    if (holdRef.current) clearTimeout(holdRef.current);
    if (phaseRef.current === "ready") startTimer();
    else if (phaseRef.current === "holding") setPhase("idle");
  }, [setPhase, startTimer]);

  // Spacebar support (only while the section is on screen)
  useEffect(() => {
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !inViewRef.current || isTyping(e.target)) return;
      e.preventDefault();
      if (e.repeat) return;
      pressDown();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !inViewRef.current || isTyping(e.target)) return;
      e.preventDefault();
      pressUp();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [pressDown, pressUp]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      if (holdRef.current) clearTimeout(holdRef.current);
    },
    []
  );

  const toggleButton = () => {
    if (phaseRef.current === "running") stopTimer();
    else {
      setElapsed(0);
      startTimer();
    }
  };

  const last = solves[0];
  const best = solves.length ? Math.min(...solves) : null;
  const ao5 = useMemo(() => {
    if (solves.length < 5) return null;
    const five = solves.slice(0, 5).slice().sort((a, b) => a - b);
    return (five[1] + five[2] + five[3]) / 3;
  }, [solves]);

  const rec = phase === "stopped" && last !== undefined ? recommend(last / 1000) : null;

  const claim = () => {
    const code = "SUB10CUBER";
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    const msg = `Halo CuberLab ID, saya mau klaim voucher ${code} (diskon ekstra Rp 50.000 seri MagLev). Waktu solve saya ${
      last !== undefined ? formatTime(last) : "-"
    }. Mohon rekomendasi rubiknya ya!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const color =
    phase === "holding"
      ? "text-red-400"
      : phase === "ready"
        ? "text-emerald-400"
        : phase === "running"
          ? "text-white"
          : phase === "stopped"
            ? "text-cyan-300"
            : "text-slate-200";

  const hint =
    phase === "holding"
      ? "Tahan... tunggu sampai hijau"
      : phase === "ready"
        ? "Lepas spasi untuk MULAI!"
        : phase === "running"
          ? "Tekan spasi / ketuk untuk BERHENTI"
          : "Tahan Spasi lalu lepas untuk mulai (di mobile: tahan area timer)";

  return (
    <section id="timer" ref={sectionRef} className="relative scroll-mt-28 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Sandbox Interaktif"
          icon={<Timer className="h-3.5 w-3.5" />}
          title={
            <>
              WCA Speedcubing <span className={GRADIENT_TEXT}>Timer & Scramble</span> Sandbox
            </>
          }
          subtitle="Uji refleksmu sekarang. Acak scramble resmi 20 langkah, jalankan timer, lalu dapatkan rekomendasi rubik dan voucher eksklusif sesuai waktumu."
        />

        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F111A]/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />

            {/* scramble */}
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                  WCA 3x3 Scramble · 20 langkah
                </span>
                <motion.button
                  onClick={newScramble}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, rotate: -4 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-cyan-300" /> Generate Scramble Baru
                </motion.button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scramble.join("")}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 flex flex-wrap gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 font-mono text-base font-semibold tracking-wide text-cyan-100 sm:text-xl"
                >
                  {scramble.map((m, i) => (
                    <span key={i}>{m}</span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* timer display */}
            <div
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                if (e.pointerType === "mouse") return; // mouse uses spacebar or button
                pressDown();
              }}
              onPointerUp={(e) => {
                if (e.pointerType === "mouse") return;
                pressUp();
              }}
              className="relative mt-6 select-none rounded-3xl border border-white/10 bg-black/50 px-4 py-10 text-center sm:py-14"
              style={{ touchAction: "manipulation" }}
            >
              <motion.div
                className={`font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-8xl ${color}`}
                animate={{ scale: phase === "ready" ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{
                  textShadow:
                    phase === "ready"
                      ? "0 0 40px rgba(16,185,129,0.7)"
                      : phase === "running"
                        ? "0 0 30px rgba(6,182,212,0.5)"
                        : "none",
                }}
              >
                {formatTime(phase === "holding" || phase === "ready" ? 0 : elapsed)}
              </motion.div>
              <p className="mt-4 text-sm text-slate-400">{hint}</p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.button
                  onClick={toggleButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex min-w-[220px] items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold ${
                    phase === "running"
                      ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                      : "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  }`}
                >
                  {phase === "running" ? (
                    <>
                      <Square className="h-4 w-4" /> Berhenti Timer
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Mulai Timer
                    </>
                  )}
                </motion.button>
                {solves.length > 0 && (
                  <button
                    onClick={() => {
                      setSolves([]);
                      setElapsed(0);
                      setPhase("idle");
                    }}
                    className="rounded-2xl border border-white/10 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                  >
                    Reset Sesi
                  </button>
                )}
              </div>
            </div>

            {/* stats */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["Terakhir", last !== undefined ? formatTime(last) : "—"],
                ["Terbaik (PB)", best !== null ? formatTime(best) : "—"],
                ["Ao5", ao5 !== null ? formatTime(ao5) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{k}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-white sm:text-lg">{v}</div>
                </div>
              ))}
            </div>

            {/* recommendation */}
            <AnimatePresence>
              {rec && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-indigo-500/15 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                        <Sparkles className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-white">
                          Waktu tercatat: <span className="font-mono text-emerald-300">{formatTime(last!)}</span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{rec.headline}</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Rekomendasi untukmu: <strong className="text-white">{rec.product.name}</strong> — {formatRupiah(rec.product.price)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm leading-relaxed text-slate-200">
                      Klaim kode voucher{" "}
                      <code className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-mono font-bold text-emerald-300">SUB10CUBER</code>{" "}
                      untuk diskon ekstra <strong>Rp 50.000</strong> pembelian seri MagLev via WhatsApp.
                    </p>
                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                      <motion.button
                        onClick={claim}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Kode Tersalin! Buka WhatsApp..." : "Klaim Voucher Sekarang"}
                      </motion.button>
                      <button
                        onClick={() => scrollToId("katalog")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Lihat Katalog <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {solves.length > 1 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {solves.slice(0, 8).map((s, i) => (
                  <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">
                    #{solves.length - i} · {formatTime(s)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 5 — TESTIMONIALS & FAQ
   ════════════════════════════════════════════════════════════════════ */

const TESTIMONIALS = [
  {
    name: "Rizky Pratama",
    role: "Mahasiswa Teknik · Bandung",
    pb: "PB Single: 7.42s | Ao5: 9.15s",
    text: "Pesan GAN 16 MagLev hari Senin, Rabu sudah sampai. Yang bikin kaget, cube-nya sudah di-lube dan di-tuning rapi, jadi langsung dipakai latihan tanpa bongkar. Auto-align 45°-nya benar-benar menyelamatkan solve saat tanganku buru-buru.",
    accent: "from-cyan-400 to-indigo-500",
  },
  {
    name: "Aulia Safitri",
    role: "Pelajar SMA · Surabaya",
    pb: "PB Single: 9.88s | Ao5: 11.64s",
    text: "Awalnya takut beli online karena banyak yang KW. Admin CuberLab kasih video unboxing dan bantu pilih setelan tension sesuai gayaku. WRM V9 ini juga ngebut banget dari kotak, Ao5-ku turun hampir 3 detik dalam sebulan!",
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    name: "Bagas Wicaksono",
    role: "Kompetitor Regional · Yogyakarta",
    pb: "PB Single: 6.87s | Ao5: 8.52s",
    text: "Sudah langganan di CuberLab sejak 2023. Layanan free setup lube-nya konsisten, dan packing-nya aman banget sampai ke luar Jawa. Super WeiLong V2 jadi cube utamaku di kompetisi. Nol lock-up, nol pop.",
    accent: "from-indigo-400 to-fuchsia-500",
  },
];

const FAQS = [
  {
    q: "Apakah produk CuberLab ID 100% original dan bergaransi resmi?",
    a: "Ya. Semua GAN dan MoYu kami ambil langsung dari distributor resmi dan dikirim dengan segel pabrik. Kamu mendapat garansi tuning gratis serta garansi penggantian untuk cacat produksi. Jika ada masalah, cukup hubungi admin via WhatsApp dengan video unboxing.",
  },
  {
    q: "Apa bedanya sistem MagLev dengan pegas biasa?",
    a: "Pegas logam menekan layer lewat kontak fisik sehingga menimbulkan gesekan, suara, dan makin lemah seiring waktu. MagLev memakai dua magnet cincin yang saling tolak (tanpa kontak), sehingga putaran lebih halus, hening, dan tensinya konsisten, dengan gesekan kinetik turun hingga 68%.",
  },
  {
    q: "Apa itu layanan Free Setup Lube sebelum dikirim?",
    a: "Setiap cube dibongkar, dibersihkan, diberi lubrikan (lube) pada core dan layer, lalu di-tuning sesuai preferensimu: speed, balanced, atau control. Cube sampai di tanganmu sudah siap latihan atau kompetisi. Sebutkan preferensi gayamu saat chat admin ya.",
  },
  {
    q: "Apakah bisa dikirim ke seluruh Indonesia? Berapa lama sampai?",
    a: "Bisa. Kami mengirim ke seluruh Indonesia via JNE, J&T, SiCepat, dan kurir instan untuk Jabodetabek. Pesanan sebelum pukul 15.00 WIB diproses di hari yang sama, estimasi 1–3 hari untuk Jawa dan 3–6 hari untuk luar Jawa. Semua paket diberi bubble wrap ekstra dan asuransi.",
  },
];

function Testimonials() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="testimoni" className="relative scroll-mt-28 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Social Proof"
          icon={<Award className="h-3.5 w-3.5" />}
          title={
            <>
              Dipercaya Para <span className={GRADIENT_TEXT}>Speedcuber</span> Kompetitif
            </>
          }
          subtitle="Dari pelajar yang baru menembus sub-12 hingga kompetitor regional, ribuan cuber mempercayakan setup rubiknya pada CuberLab ID."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <SpotlightCard className="h-full" glow="rgba(99,102,241,0.16)">
                <div className="flex h-full flex-col p-6">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[11px] font-semibold text-cyan-200">
                    <Timer className="h-3 w-3" /> {t.pb}
                  </span>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">“{t.text}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-sm font-extrabold text-white`}
                    >
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" aria-label="Pembeli terverifikasi" />
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div id="faq" className="mx-auto mt-20 max-w-3xl scroll-mt-28">
          <Reveal className="mb-8 text-center">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Pertanyaan yang Sering Ditanyakan</h3>
            <p className="mt-2 text-slate-400">Semua yang perlu kamu tahu sebelum checkout.</p>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <Reveal key={f.q} delay={i * 0.06}>
                  <div
                    className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-colors ${
                      open ? "border-cyan-400/40 bg-[#0F111A]" : "border-white/10 bg-[#0F111A]/70"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[15px] font-semibold text-white">{f.q}</span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-cyan-300"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 6 — FINAL CTA & FOOTER
   ════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section className="relative px-4 py-20 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/15 p-px">
          <motion.div
            className="absolute inset-[-100%]"
            style={{
              background:
                "conic-gradient(from 0deg, #06B6D4, #6366F1, #10B981, #06B6D4)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative overflow-hidden rounded-[2.4rem] bg-[#080A12] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/30 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/30 blur-[120px]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />

            <div className="relative">
              <motion.span
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-200 sm:text-sm"
              >
                <Flame className="h-4 w-4 shrink-0" />
                Gratis Botol Silicone Lube 5ml & Pouch Beludru untuk 10 Pemesan Hari Ini
              </motion.span>
              <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Siap Cetak <span className={GRADIENT_TEXT}>Personal Best (PB)</span> Baru Minggu Ini?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400 sm:text-lg">
                Konsultasi gratis dengan admin kami, pilih rubik sesuai gaya tanganmu, dan terima cube yang sudah siap
                pecah rekor.
              </p>
              <div className="mx-auto mt-9 flex max-w-xl flex-col gap-3">
                <WhatsAppButton
                  href={WA_CONSULT}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_0_50px_rgba(16,185,129,0.45)] sm:text-[15px]"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span className="text-balance">Chat Admin & Konsultasi Pemilihan Rubik (WhatsApp)</span>
                </WhatsAppButton>
                <WhatsAppButton
                  href={IG_URL}
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm text-white backdrop-blur-xl hover:bg-white/10 sm:text-[15px]"
                >
                  <Users className="h-5 w-5 shrink-0 text-indigo-300" />
                  <span className="text-balance">Gabung Komunitas Discord / Instagram @cuberlab.id</span>
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-60" />
                </WhatsAppButton>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                {[
                  [<ShieldCheck key="a" className="h-3.5 w-3.5 text-emerald-400" />, "100% Original"],
                  [<Droplets key="b" className="h-3.5 w-3.5 text-cyan-400" />, "Free Setup Lube"],
                  [<Truck key="c" className="h-3.5 w-3.5 text-indigo-400" />, "Kirim ke Seluruh Indonesia"],
                  [<VolumeX key="d" className="h-3.5 w-3.5 text-emerald-400" />, "Spring Noise Zero"],
                ].map(([icon, label], i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    {icon}
                    {label as string}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const channels = [
    { label: "WhatsApp", href: WA_GENERAL, icon: <MessageCircle className="h-4 w-4" /> },
    { label: "Instagram", href: IG_URL, icon: <Camera className="h-4 w-4" /> },
    { label: "TikTok", href: "https://www.tiktok.com/@cuberlab.id", icon: <Music2 className="h-4 w-4" /> },
    { label: "Tokopedia", href: "https://www.tokopedia.com/cuberlab-id", icon: <Store className="h-4 w-4" /> },
    { label: "Shopee", href: "https://shopee.co.id/cuberlab.id", icon: <ShoppingBag className="h-4 w-4" /> },
    { label: "YouTube", href: "https://www.youtube.com/@cuberlab.id", icon: <Video className="h-4 w-4" /> },
  ];
  return (
    <footer className="relative border-t border-white/10 bg-black/30 px-4 pb-10 pt-14 backdrop-blur-xl sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_0_24px_rgba(6,182,212,0.6)]">
              <Box className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-extrabold text-white">
              CuberLab<span className="text-cyan-400"> ID</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Flagship store speedcube dan magnetic puzzle Indonesia. Kami menghadirkan GAN dan MoYu original dengan
            layanan setup lube gratis, tuning profesional, serta pengiriman ke seluruh nusantara.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Admin online · Senin–Sabtu, 09.00–21.00 WIB
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">Navigasi</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...NAV_LINKS, { label: "FAQ", id: "faq" }].map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollToId(l.id)} className="text-slate-300 transition hover:text-cyan-300">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">Kanal Resmi</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {channels.map((c) => (
              <li key={c.label}>
                <motion.a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
                >
                  <span className="text-cyan-300">{c.icon}</span>
                  {c.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} CuberLab ID. Seluruh hak cipta dilindungi.</span>
        <span>GAN dan MoYu adalah merek dagang milik pemegang hak masing-masing.</span>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════════ */

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#07080C] font-sans text-slate-200">
      <Atmosphere />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <BentoSection />
          <CatalogSection />
          <TimerSection />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
