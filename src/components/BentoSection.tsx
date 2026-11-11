import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Gauge, Magnet, Sliders } from "lucide-react";
import { STYLE_PROFILES, TENSION_LEVELS, TRAVEL_LEVELS } from "../data/content";
import { SectionHeader } from "./SectionHeader";

function Meter({
  label,
  value,
  display,
}: {
  label: string;
  value: number;
  display: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
        <span className="text-[#575653]">{label}</span>
        <motion.span
          key={display}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-[#111111]"
        >
          {display}
        </motion.span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-[#E4E2DD] bg-[#EFECE6]">
        <motion.div
          className="h-full rounded-full bg-[#111111]"
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
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] p-6 sm:p-8 md:col-span-7">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          <Magnet className="h-3 w-3" /> Dual-Repulsion System
        </span>

        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#111111]">
          Dual-Repulsion MagLev System
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-[#575653]">
          Magnet cincin yang saling tolak menggantikan pegas logam konvensional. Hasilnya spring noise zero, tensi konsisten sepanjang umur pakai, dan gesekan kinetik turun hingga 68%.
        </p>

        {/* Toggle Mode */}
        <div className="mt-4 inline-flex rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-1">
          <button
            onClick={() => setMode("spring")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              !isMag ? "bg-[#FFFFFF] text-[#111111] shadow-xs" : "text-[#575653] hover:text-[#111111]"
            }`}
          >
            Traditional Spring
          </button>
          <button
            onClick={() => setMode("maglev")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              isMag ? "bg-[#FFFFFF] text-[#111111] shadow-xs" : "text-[#575653] hover:text-[#111111]"
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
            display={isMag ? "32% (-68%)" : "100%"}
          />
          <Meter
            label="Potensi Kecepatan (TPS)"
            value={isMag ? 94 : 58}
            display={isMag ? "11+ TPS" : "6-7 TPS"}
          />
          <Meter
            label="Suara Pegas"
            value={isMag ? 0 : 78}
            display={isMag ? "0 dB · Hening" : "Berderit"}
          />
        </div>

        {/* Animated Schematic */}
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-3">
          <AnimatePresence mode="wait">
            <motion.svg
              key={mode}
              viewBox="0 0 200 170"
              className="relative h-full max-h-[200px] w-full max-w-[220px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {/* Bottom Plate */}
              <rect x="40" y="128" width="120" height="14" rx="3" fill="#111111" stroke="#E4E2DD" />
              {!isMag ? (
                <>
                  <motion.g
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <rect x="40" y="26" width="120" height="14" rx="3" fill="#111111" stroke="#E4E2DD" />
                  </motion.g>
                  <motion.polyline
                    points={zig}
                    fill="none"
                    stroke="#D9381E"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    animate={{ scaleY: [1, 0.86, 1] }}
                    style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <text
                    x="100"
                    y="160"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#9F2F2D"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    FRICTION + SPRING NOISE
                  </text>
                </>
              ) : (
                <>
                  <motion.g
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <rect x="40" y="22" width="120" height="14" rx="3" fill="#111111" stroke="#E4E2DD" />
                    <ellipse cx="100" cy="58" rx="42" ry="9" fill="#FDEBEC" stroke="#D9381E" strokeWidth="2" />
                    <text
                      x="100"
                      y="61"
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="700"
                      fill="#9F2F2D"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      N
                    </text>
                  </motion.g>
                  <ellipse cx="100" cy="110" rx="42" ry="9" fill="#FDEBEC" stroke="#D9381E" strokeWidth="2" />
                  <text
                    x="100"
                    y="113"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="700"
                    fill="#9F2F2D"
                    fontFamily="JetBrains Mono, monospace"
                  >
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
                      stroke="#111111"
                      strokeWidth="1.5"
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      animate={{ scaleX: [0.45, 1.15], scaleY: [0.5, 1.2], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.66, ease: "easeOut" }}
                    />
                  ))}
                  {[70, 100, 130].map((x, i) => (
                    <motion.g
                      key={x}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <path
                        d={`M${x} 77 l0 -9 m-3 3 l3 -3 l3 3`}
                        stroke="#346538"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M${x} 91 l0 9 m-3 -3 l3 3 l3 -3`}
                        stroke="#346538"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.g>
                  ))}
                  <text
                    x="100"
                    y="160"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#111111"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    N-N REPULSION · 0 CONTACT
                  </text>
                </>
              )}
            </motion.svg>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BallCoreCard() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLocked((l) => !l), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] p-6 sm:p-8 md:col-span-5">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          <Cpu className="h-3 w-3" /> Ball-Core
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-[#111111]">
          20-Magnet Ball-Core & 45° Auto-Align
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#575653]">
          Tarikan magnet dari sudut ke inti membuat layer langsung snap ke posisi presisi saat under-turn hingga 45°.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setLocked((l) => !l)}
          className="relative flex w-full items-center justify-center rounded-lg border border-[#E4E2DD] bg-[#EFECE6] py-5 transition-colors hover:bg-[#EAE6DF]"
          aria-label="Demo magnetic snap 45 derajat"
        >
          <svg viewBox="0 0 220 180" className="h-40 w-full max-w-[240px]">
            {[34, 52, 70].map((r, i) => (
              <motion.circle
                key={r}
                cx="110"
                cy="86"
                r={r}
                fill="none"
                stroke="#111111"
                strokeWidth="1"
                strokeDasharray="3 5"
                animate={{ opacity: locked ? [0.2, 0.7, 0.3] : 0.15, scale: locked ? [1, 1.04, 1] : 1 }}
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
                    stroke={locked ? "#346538" : "#9F2F2D"}
                    strokeWidth="2"
                  />
                  <line
                    x1="110"
                    y1="56"
                    x2="110"
                    y2="70"
                    stroke={locked ? "#346538" : "#9F2F2D"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="110" cy="38" r="4.5" fill={locked ? "#346538" : "#9F2F2D"} />
                </g>
              ))}
            </motion.g>
            <circle cx="110" cy="86" r="22" fill="#111111" />
            <text
              x="110"
              y="90"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
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
              fontWeight="700"
              fill={locked ? "#346538" : "#9F2F2D"}
              fontFamily="JetBrains Mono, monospace"
            >
              {locked ? "0° · LOCKED" : "45° UNDER-TURN"}
            </text>
          </svg>
        </button>
        <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          Klik diagram untuk simulasi snap
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
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setTps(v),
    });
    return () => controls.stop();
  }, [target]);

  const p = STYLE_PROFILES[idx];

  return (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] p-6 sm:p-8 md:col-span-5">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          <Gauge className="h-3 w-3" /> Zero Lock-Up
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-[#111111]">
          90° Full Corner Cutting & Torpedo
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#575653]">
          Sudut corner cutting 90° dengan desain Torpedo anti-pop: zero lock-up di kecepatan TPS tinggi.
        </p>

        {/* Method Tabs */}
        <div className="mt-4 flex gap-1.5">
          {STYLE_PROFILES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIdx(i)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-bold transition-colors ${
                i === idx
                  ? "bg-[#111111] text-white"
                  : "border border-[#E4E2DD] bg-[#FFFFFF] text-[#575653] hover:bg-[#EFECE6]"
              }`}
            >
              {s.key}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-4xl font-extrabold text-[#111111]">{tps.toFixed(1)}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#575653]">
              Peak TPS · {p.key}
            </div>
          </div>
          <svg viewBox="0 0 80 60" className="h-14 w-18">
            <path
              d="M8 52 A44 44 0 0 1 52 8"
              fill="none"
              stroke="#DCD9D2"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <motion.path
              d="M8 52 A44 44 0 0 1 52 8"
              fill="none"
              stroke="#111111"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
            />
            <text
              x="56"
              y="54"
              fontSize="12"
              fontWeight="800"
              fill="#111111"
              fontFamily="JetBrains Mono, monospace"
            >
              90°
            </text>
          </svg>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3"
          >
            <code className="block rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-2 font-mono text-[11px] leading-relaxed text-[#111111]">
              {p.alg}
            </code>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#575653]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#346538]" /> {p.note}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TuningCard() {
  const [tension, setTension] = useState(2);
  const [travel, setTravel] = useState(3);
  const avg = (tension + travel) / 2;
  const speed = Math.round(((7 - avg) / 6) * 100);
  const control = Math.round((avg / 6) * 100);

  const profile =
    avg <= 2.5
      ? { name: "Speed Demon Setup" }
      : avg <= 4
      ? { name: "Balanced All-Rounder" }
      : { name: "Precision Control Setup" };

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
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#575653]">
        <span>{label}</span>
        <span className="font-bold text-[#111111]">Level {value}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            aria-label={`${label} level ${n}`}
            className={`rounded-md border py-2 font-mono text-xs font-bold transition-colors ${
              n === value
                ? "border-[#111111] bg-[#111111] text-white"
                : "border-[#E4E2DD] bg-[#FFFFFF] text-[#575653] hover:bg-[#EFECE6]"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] p-6 sm:p-8 md:col-span-7">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          <Sliders className="h-3 w-3" /> 12 Custom Settings
        </span>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-[#111111]">
          Dual-Adjustment GES Pro+ & Custom Tuning
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-[#575653]">
          Atur Tension (6 level) dan Center Travel (6 level) secara mandiri untuk total 12 setelan presisi.
        </p>

        <div className="mt-5 space-y-4">
          {renderRow({ label: "Tension", value: tension, setValue: setTension })}
          {renderRow({ label: "Center Travel", value: travel, setValue: setTravel })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setTension(2);
              setTravel(3);
            }}
            className="rounded-full border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#111111] transition-colors hover:bg-[#EFECE6]"
          >
            Preset Speed (2 / 3)
          </button>
          <button
            onClick={() => {
              setTension(5);
              setTravel(4);
            }}
            className="rounded-full border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-1 text-xs font-semibold text-[#111111] transition-colors hover:bg-[#EFECE6]"
          >
            Preset Akurasi (5 / 4)
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#575653]">
          <Activity className="h-3.5 w-3.5" /> Profil Setelan Aktif
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
            <div className="text-base font-extrabold text-[#111111]">{profile.name}</div>
            <div className="mt-2.5 space-y-2">
              <div className="rounded-md border border-[#E4E2DD] bg-[#FFFFFF] p-3 text-xs">
                <span className="font-bold text-[#111111]">
                  Tension {tension}: {TENSION_LEVELS[tension - 1].title}
                </span>
                <p className="mt-0.5 text-[#575653]">{TENSION_LEVELS[tension - 1].desc}</p>
              </div>
              <div className="rounded-md border border-[#E4E2DD] bg-[#FFFFFF] p-3 text-xs">
                <span className="font-bold text-[#111111]">
                  Travel {travel}: {TRAVEL_LEVELS[travel - 1].title}
                </span>
                <p className="mt-0.5 text-[#575653]">{TRAVEL_LEVELS[travel - 1].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 space-y-3">
          <Meter label="Speed Feel" value={speed} display={`${speed}%`} />
          <Meter label="Control Feel" value={control} display={`${control}%`} />
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
          eyebrow="Rekayasa Mekanik"
          title="Teknologi Rekayasa Presisi di Balik Setiap Putaran"
          subtitle="Speedcuber profesional beralih ke MagLev dan Ball-Core karena konsistensi: tanpa pegas yang aus, tanpa layer miring, dan tensi yang sepenuhnya dapat disesuaikan."
        />

        {/* Exposed 1px hairline grid: 12-column layout */}
        <div className="grid overflow-hidden rounded-xl border border-[#E4E2DD] bg-[#E4E2DD] p-px gap-px md:grid-cols-12">
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
