import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Gauge, Magnet, Sliders, Target, Zap } from "lucide-react";
import { STYLE_PROFILES, TENSION_LEVELS, TRAVEL_LEVELS } from "../data/content";
import { BallCoreAnatomy } from "./figures/BallCoreAnatomy";
import { MagLevAnatomy } from "./figures/MagLevAnatomy";
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
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-ink-secondary">{label}</span>
        <motion.span
          key={display}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono font-bold text-ink text-xs"
        >
          {display}
        </motion.span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full border border-border bg-well">
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

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-8 hover:border-border-strong transition-colors md:col-span-7">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-vermilion font-medium">
            <Magnet className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Dual-Repulsion MagLev</span>
          </span>
          <span className="text-ink-muted">Rekayasa Tanpa Pegas</span>
        </div>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
          Sistem Levitasi Magnetik MagLev
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Dua cincin magnet dengan kutub sejenis (N-N) saling menolak untuk menggantikan pegas baja kuno. Suara gesekan nol dan sensasi putaran super licin seumur pakai.
        </p>

        {/* Toggle Mode */}
        <div className="mt-5 inline-flex rounded-full border border-border bg-well p-1">
          <button
            onClick={() => setMode("spring")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              !isMag
                ? "bg-ink text-canvas shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Pegas Tradisional
          </button>
          <button
            onClick={() => setMode("maglev")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              isMag
                ? "bg-vermilion text-white shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            MagLev Repulsion
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Dynamic Meters */}
        <div className="space-y-4 lg:col-span-5">
          <Meter
            label="Gesekan Kinetik"
            value={isMag ? 32 : 100}
            display={isMag ? "32% (-68%)" : "100% (Baseline)"}
            barColor={isMag ? "bg-green" : "bg-ink-muted"}
          />
          <Meter
            label="Potensi Kecepatan"
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

        {/* 2.5D Isometric Mechanical Anatomy Plate */}
        <div className="lg:col-span-7">
          <MagLevAnatomy mode={mode} />
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
    <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-8 hover:border-border-strong transition-colors md:col-span-5">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-blue font-medium">
            <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ball-Core Positioning</span>
          </span>
          <span className="text-ink-muted">45° Auto-Align</span>
        </div>

        <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          20-Magnet Core Auto-Align
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Tarikan magnetik dari sudut ke inti bola membuat layer langsung snap presisi ke posisi home saat putaran meleset hingga 45°.
        </p>
      </div>

      <div className="mt-6">
        <BallCoreAnatomy locked={locked} onToggleLock={() => setLocked((l) => !l)} />
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
    <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-8 hover:border-border-strong transition-colors md:col-span-5">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-green font-medium">
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Corner Cutting</span>
          </span>
          <span className="text-ink-muted">55° Normal / 35° Reverse</span>
        </div>

        <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">
          Corner Cutting 55° Anti Lock-Up
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Toleransi sudut ekstrem mencegah macet saat jari Anda mengeksekusi algoritma cepat di atas 10 TPS.
        </p>

        {/* Style switcher */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STYLE_PROFILES.map((p, i) => (
            <button
              key={p.key}
              onClick={() => setIdx(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
                idx === i
                  ? "bg-ink text-canvas shadow-xs"
                  : "border border-border bg-well text-ink-secondary hover:text-ink"
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="rounded-2xl border border-border bg-well p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-4xl font-black tracking-tight text-ink">
                {tps.toFixed(1)}
              </div>
              <div className="text-[11px] text-ink-muted">
                turns per second (TPS)
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-semibold text-ink">Sudut 55° Aman</div>
              <div className="text-ink-secondary">Nol Corner Twist</div>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full border border-border bg-surface">
            <motion.div
              className="h-full rounded-full bg-green"
              animate={{ width: `${(tps / 14) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <span className="text-[11px] text-ink-muted">Algoritma Tes:</span>
            <code className="mt-1 block rounded-xl border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink">
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
        <span className="font-semibold text-ink">Level {value}</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            aria-label={`${label} level ${n}`}
            className={`rounded-xl py-1.5 font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              n === value
                ? "bg-ink text-canvas shadow-xs"
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
    <div className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-8 hover:border-border-strong transition-colors md:col-span-7">
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-ink font-medium">
            <Sliders className="h-3.5 w-3.5 text-vermilion" aria-hidden="true" />
            <span>GES Pro+ Tuning Matrix</span>
          </span>
          <span className="text-ink-muted">12 Setelan Presisi</span>
        </div>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">
          Dual-Adjustment Tensi & Center Travel
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          Atur elastisitas magnet dan jarak tempuh center pieces secara mandiri untuk mendapatkan rasa putaran yang pas dengan gaya tangan Anda.
        </p>

        <div className="mt-5 space-y-3.5">
          {renderRow({ label: "Tension", value: tension, setValue: setTension })}
          {renderRow({ label: "Center Travel", value: travel, setValue: setTravel })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setTension(2);
              setTravel(3);
            }}
            className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <Zap className="h-3 w-3 text-vermilion" aria-hidden="true" />
            <span>Preset Speed (2 / 3)</span>
          </button>
          <button
            onClick={() => {
              setTension(5);
              setTravel(4);
            }}
            className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <Target className="h-3 w-3 text-blue" aria-hidden="true" />
            <span>Preset Akurasi (5 / 4)</span>
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-well p-4">
        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <Activity className="h-3.5 w-3.5 text-vermilion" aria-hidden="true" />
          <span>Profil Setelan Aktif</span>
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
            <div className="text-base font-bold text-ink">{profile.name}</div>
            <div className="mt-2.5 space-y-1.5">
              <div className="rounded-xl border border-border bg-surface p-2.5 text-xs">
                <span className="font-semibold text-ink">
                  Tension {tension}: {TENSION_LEVELS[tension - 1].title}
                </span>
                <p className="mt-0.5 text-ink-secondary">{TENSION_LEVELS[tension - 1].desc}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-2.5 text-xs">
                <span className="font-semibold text-ink">
                  Travel {travel}: {TRAVEL_LEVELS[travel - 1].title}
                </span>
                <p className="mt-0.5 text-ink-secondary">{TRAVEL_LEVELS[travel - 1].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 space-y-2.5">
          <Meter label="Speed Feel" value={speed} display={`${speed}%`} barColor="bg-vermilion" />
          <Meter label="Control Feel" value={control} display={`${control}%`} barColor="bg-blue" />
        </div>
      </div>
    </div>
  );
}

export function BentoSection() {
  return (
    <section id="fitur" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Rekayasa Presisi"
          title="Fisika Tanpa Gesekan"
          subtitle="Speedcuber profesional beralih ke MagLev dan Ball-Core karena konsistensi: tanpa pegas aus, tanpa layer miring, dan kontrol tensi presisi."
          align="center"
        />

        {/* 12-column responsive bento grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
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
