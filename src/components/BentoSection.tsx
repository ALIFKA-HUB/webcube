import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Gauge, Magnet, Sliders, Target, Zap } from "lucide-react";
import { STYLE_PROFILES, TENSION_LEVELS, TRAVEL_LEVELS } from "../data/content";
import { SectionHeader } from "./SectionHeader";

function Meter({
  label,
  value,
  display,
  barColor = "bg-ink",
}: {
  label: string;
  value: number;
  display: string;
  barColor?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
        <span className="text-ink-secondary">{label}</span>
        <motion.span
          key={display}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-ink"
        >
          {display}
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-border bg-well">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
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
    <div className="flex h-full flex-col justify-between bg-surface p-6 sm:p-8 md:col-span-7">
      <div>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 text-vermilion font-semibold">
            <Magnet className="h-3.5 w-3.5" aria-hidden="true" />
            <span>01. dual-repulsion maglev</span>
          </span>
          <span>rekayasa tanpa pegas</span>
        </div>

        <h3 className="mt-3 text-2xl font-black tracking-tight text-ink">
          Dual-Repulsion MagLev System
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Magnet cincin berkutub sama (N-N) saling tolak menggantikan pegas logam konvensional. Spring noise nol, tensi stabil seumur pakai, dan gesekan kinetik berkurang 68%.
        </p>

        {/* Toggle Mode */}
        <div className="mt-5 inline-flex rounded-lg border border-border bg-well p-1">
          <button
            onClick={() => setMode("spring")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              !isMag
                ? "bg-ink text-surface shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Traditional Spring
          </button>
          <button
            onClick={() => setMode("maglev")}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              isMag
                ? "bg-vermilion text-canvas shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            MagLev Repulsion
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
        {/* Dynamic Meters */}
        <div className="space-y-4">
          <Meter
            label="Gesekan Kinetik"
            value={isMag ? 32 : 100}
            display={isMag ? "32% (-68%)" : "100% (Baseline)"}
            barColor={isMag ? "bg-green" : "bg-ink-muted"}
          />
          <Meter
            label="Potensi Kecepatan (TPS)"
            value={isMag ? 92 : 60}
            display={isMag ? "11+ TPS" : "~7.5 TPS"}
            barColor={isMag ? "bg-vermilion" : "bg-ink-muted"}
          />
          <Meter
            label="Suara Pegas (Noise)"
            value={isMag ? 0 : 75}
            display={isMag ? "0 dB · Hening" : "42 dB · Berdecit"}
            barColor={isMag ? "bg-blue" : "bg-ink-muted"}
          />
        </div>

        {/* Visual Schematic */}
        <div className="hardware-well relative flex h-48 items-center justify-center rounded-lg p-4">
          <AnimatePresence mode="wait">
            {isMag ? (
              <motion.div
                key="maglev"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-4 w-28 rounded-xs bg-ink" />
                <motion.div
                  className="mt-2.5 h-6 w-20 rounded-full border-2 border-vermilion bg-vermilion-soft flex items-center justify-center font-mono text-[10px] font-bold text-vermilion"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  N (POLE)
                </motion.div>
                <div className="my-2 flex flex-col items-center text-[10px] text-ink-muted">
                  <span className="text-vermilion font-bold">▲ MEDAN TOLAK ▼</span>
                  <span>celah repulsi magnetik</span>
                </div>
                <motion.div
                  className="mb-2.5 h-6 w-20 rounded-full border-2 border-vermilion bg-vermilion-soft flex items-center justify-center text-[10px] font-bold text-vermilion"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  N (POLE)
                </motion.div>
                <div className="h-4 w-28 rounded-xs bg-ink" />
                <span className="mt-2 text-[10px] text-ink-muted">
                  n-n repulsion · 0% kontak logam
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="spring"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="h-4 w-28 rounded-xs bg-ink" />
                <svg viewBox="0 0 200 120" className="my-1 h-20 w-24" aria-hidden="true">
                  <polyline
                    fill="none"
                    stroke="#575653"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={zig}
                  />
                </svg>
                <div className="h-4 w-28 rounded-xs bg-ink" />
                <span className="mt-2 text-[10px] text-ink-muted">
                  pegas aus seiring waktu · gesekan logam
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BallCoreCard() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLocked((l) => !l), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between bg-surface p-6 sm:p-8 md:col-span-5">
      <div>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 text-blue font-semibold">
            <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
            <span>02. ball-core positioning</span>
          </span>
          <span>45° auto-align</span>
        </div>

        <h3 className="mt-3 text-xl font-black tracking-tight text-ink">
          20-Magnet Ball-Core & 45° Auto-Align
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Tarikan magnet dari sudut ke inti bola membuat layer langsung snap ke posisi presisi saat under-turn hingga 45°.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setLocked((l) => !l)}
          className="hardware-well relative flex w-full items-center justify-center rounded-lg py-5 transition-colors hover:bg-well-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          aria-label="Simulasi snap magnetik ball-core 45 derajat"
        >
          <svg viewBox="0 0 220 180" className="h-40 w-full max-w-[240px]" aria-hidden="true">
            {[34, 52, 70].map((r, i) => (
              <motion.circle
                key={r}
                cx="110"
                cy="86"
                r={r}
                fill="none"
                stroke="#1F6C9F"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                animate={{ opacity: locked ? [0.2, 0.8, 0.3] : 0.15, scale: locked ? [1, 1.04, 1] : 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
              />
            ))}
            <motion.g
              style={{ transformOrigin: "110px 86px" }}
              animate={{ rotate: locked ? 0 : 45 }}
              transition={{ type: "spring", stiffness: 190, damping: 11 }}
            >
              {[0, 90, 180, 270].map((a) => (
                <g key={a} transform={`rotate(${a} 110 86)`}>
                  <rect
                    x="94"
                    y="22"
                    width="32"
                    height="32"
                    rx="4"
                    fill="#FFFFFF"
                    stroke={locked ? "#2A6B35" : "#D9381E"}
                    strokeWidth="2.2"
                  />
                  <line
                    x1="110"
                    y1="56"
                    x2="110"
                    y2="70"
                    stroke={locked ? "#2A6B35" : "#D9381E"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="110" cy="38" r="5" fill={locked ? "#2A6B35" : "#D9381E"} />
                </g>
              ))}
            </motion.g>
            <circle cx="110" cy="86" r="22" fill="#111111" />
            <text
              x="110"
              y="90"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#FFFFFF"
              fontFamily="JetBrains Mono, monospace"
            >
              CORE
            </text>
            <text
              x="110"
              y="172"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill={locked ? "#2A6B35" : "#D9381E"}
              fontFamily="JetBrains Mono, monospace"
            >
              {locked ? "0° · LOCKED ✓" : "45° UNDER-TURN"}
            </text>
          </svg>
        </button>
        <p className="mt-2 text-center text-xs text-ink-muted">
          klik diagram untuk simulasi snap sudut
        </p>
      </div>
    </div>
  );
}

function CornerCuttingCard() {
  const [idx, setIdx] = useState(0);
  const [tps, setTps] = useState(STYLE_PROFILES[0].tps);
  const target = STYLE_PROFILES[idx].tps;

  useEffect(() => {
    const controls = animate(tps, target, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setTps(Math.round(v * 10) / 10),
    });
    return () => controls.stop();
  }, [idx, target]);

  return (
    <div className="flex h-full flex-col justify-between bg-surface p-6 sm:p-8 md:col-span-5">
      <div>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 text-green font-semibold">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            <span>03. corner cutting dan tps</span>
          </span>
          <span>90° total cut</span>
        </div>

        <h3 className="mt-3 text-xl font-black tracking-tight text-ink">
          Corner Cutting 55° & Reverse 35°
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Layer berputar mulus tanpa lock-up bahkan ketika eksekusi algoritma cepat di sudut ekstrem hingga 55 derajat.
        </p>

        {/* Style switcher */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STYLE_PROFILES.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setIdx(i)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
                idx === i
                  ? "bg-ink text-surface shadow-xs"
                  : "border border-border bg-well text-ink-secondary hover:text-ink"
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="hardware-well rounded-lg p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-4xl font-black tracking-tight text-ink">
                {tps.toFixed(1)}
              </div>
              <div className="text-[11px] text-ink-muted">
                turns per second (tps)
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-ink">Normal 55° / Rev 35°</div>
              <div className="text-ink-secondary">Zero Corner Twist</div>
            </div>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full border border-border bg-surface">
            <motion.div
              className="h-full rounded-full bg-green"
              animate={{ width: `${(tps / 14) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <span className="text-[11px] text-ink-muted">algoritma tes wca:</span>
            <code className="mt-1 block rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-ink font-semibold">
              {STYLE_PROFILES[idx].alg}
            </code>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-secondary">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green" aria-hidden="true" />
              <span>{STYLE_PROFILES[idx].note}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TuningCard() {
  const [tension, setTension] = useState(3);
  const [travel, setTravel] = useState(3);

  const profile = useMemo(() => {
    if (tension <= 2 && travel <= 2) return { name: "Ultra-Fast / Loose (TPS Rush)" };
    if (tension >= 5 && travel >= 5) return { name: "Controllable / Tight (Anti-Pop)" };
    if (tension >= 4 && travel <= 3) return { name: "Magnetic Snappy (High Accuracy)" };
    if (tension <= 3 && travel >= 4) return { name: "Fluid / Gliding (One-Handed / OH)" };
    return { name: "Factory Balanced (All-Round Competitor)" };
  }, [tension, travel]);

  const speed = useMemo(() => Math.round(100 - (tension - 1) * 10 - (travel - 1) * 6), [tension, travel]);
  const control = useMemo(() => Math.round(25 + (tension - 1) * 11 + (travel - 1) * 4), [tension, travel]);

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
      <div className="mb-2 flex items-center justify-between text-xs text-ink-secondary">
        <span>{label}</span>
        <span className="font-bold text-ink">Level {value}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            aria-label={`${label} level ${n}`}
            className={`rounded-md py-2 font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              n === value
                ? "bg-ink text-surface shadow-xs"
                : "border border-border bg-well text-ink-secondary hover:text-ink hover:bg-well-subtle"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col justify-between bg-surface p-6 sm:p-8 md:col-span-7">
      <div>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5 text-ink font-semibold">
            <Sliders className="h-3.5 w-3.5 text-vermilion" aria-hidden="true" />
            <span>04. ges pro+ hardware matrix</span>
          </span>
          <span>12 setelan presisi</span>
        </div>

        <h3 className="mt-3 text-2xl font-black tracking-tight text-ink">
          Dual-Adjustment GES Pro+ & Custom Tuning
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Atur elastisitas magnet dan center travel distance secara mandiri untuk total 12 kombinasi setelan putaran.
        </p>

        <div className="mt-5 space-y-4">
          {renderRow({ label: "Tension", value: tension, setValue: setTension })}
          {renderRow({ label: "Center Travel", value: travel, setValue: setTravel })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setTension(2);
              setTravel(3);
            }}
            className="tactile-btn-light inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <Zap className="h-3 w-3 text-vermilion" aria-hidden="true" />
            <span>preset speed (2 / 3)</span>
          </button>
          <button
            onClick={() => {
              setTension(5);
              setTravel(4);
            }}
            className="tactile-btn-light inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <Target className="h-3 w-3 text-blue" aria-hidden="true" />
            <span>preset akurasi (5 / 4)</span>
          </button>
        </div>
      </div>

      <div className="hardware-well mt-6 rounded-lg p-4">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Activity className="h-3.5 w-3.5 text-vermilion" aria-hidden="true" />
          <span>profil setelan aktif</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tension}-${travel}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-2"
          >
            <div className="text-base font-black text-ink">{profile.name}</div>
            <div className="mt-2.5 space-y-2">
              <div className="rounded-md border border-border bg-surface p-3 text-xs shadow-xs">
                <span className="font-bold text-ink">
                  Tension {tension}: {TENSION_LEVELS[tension - 1].title}
                </span>
                <p className="mt-0.5 text-ink-secondary">{TENSION_LEVELS[tension - 1].desc}</p>
              </div>
              <div className="rounded-md border border-border bg-surface p-3 text-xs shadow-xs">
                <span className="font-bold text-ink">
                  Travel {travel}: {TRAVEL_LEVELS[travel - 1].title}
                </span>
                <p className="mt-0.5 text-ink-secondary">{TRAVEL_LEVELS[travel - 1].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 space-y-3">
          <Meter label="Speed Feel" value={speed} display={`${speed}%`} barColor="bg-vermilion" />
          <Meter label="Control Feel" value={control} display={`${control}%`} barColor="bg-blue" />
        </div>
      </div>
    </div>
  );
}

export function BentoSection() {
  return (
    <section id="fitur" className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="01 // rekayasa presisi"
          title="Teknologi Rekayasa Presisi di Balik Setiap Putaran"
          subtitle="Speedcuber profesional beralih ke MagLev dan Ball-Core karena konsistensi: tanpa pegas yang aus, tanpa layer miring, dan tensi yang sepenuhnya dapat disesuaikan."
        />

        {/* Exposed 1px hairline grid: 12-column layout */}
        <div className="grid overflow-hidden rounded-xl border border-border bg-border p-px gap-px md:grid-cols-12 shadow-sm">
          {/* Row 1: MagLevCard (7 cols) + BallCoreCard (5 cols) */}
          <MagLevCard />
          <BallCoreCard />

          {/* Row 2: CornerCuttingCard (5 cols) + TuningCard (7 cols) */}
          <CornerCuttingCard />
          <TuningCard />
        </div>
      </div>
    </section>
  );
}
