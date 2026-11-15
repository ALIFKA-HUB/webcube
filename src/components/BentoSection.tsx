import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Gauge, Magnet, Sliders, Target, Zap } from "lucide-react";
import { STYLE_PROFILES, TENSION_LEVELS, TRAVEL_LEVELS } from "../data/content";
import { BallCoreAnatomy } from "./figures/BallCoreAnatomy";
import { MagLevAnatomy } from "./figures/MagLevAnatomy";
import { SectionHeader } from "./SectionHeader";

const CHAPTERS = [
  { id: "maglev", num: "01", title: "Dual-Repulsion MagLev", meta: "Tanpa Pegas" },
  { id: "ballcore", num: "02", title: "20-Magnet Ball-Core", meta: "45° Auto-Align" },
  { id: "cornercut", num: "03", title: "Corner Cutting 55°", meta: "Anti Lock-Up" },
  { id: "tuning", num: "04", title: "GES Pro+ Tuning Matrix", meta: "12 Setelan" },
] as const;

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
          className="font-mono text-xs font-bold tabular-nums text-ink"
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

function MagLevModule() {
  const [mode, setMode] = useState<"spring" | "maglev">("maglev");
  const isMag = mode === "maglev";

  return (
    <motion.article
      id="maglev"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <span className="font-mono font-bold text-accent">01</span>
          <Magnet className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>Dual-Repulsion MagLev</span>
        </span>
        <span className="text-ink-muted">Rekayasa Tanpa Pegas</span>
      </div>

      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Sistem Levitasi Magnetik MagLev
      </h3>

      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
        Dua cincin magnet dengan kutub sejenis (N-N) saling menolak untuk menggantikan pegas baja kuno. Suara gesekan nol dan sensasi putaran super licin seumur pakai.
      </p>

      {/* Toggle Mode */}
      <div className="mt-6 inline-flex rounded-full border border-border bg-well p-1">
        <button
          type="button"
          onClick={() => setMode("spring")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            !isMag
              ? "bg-accent text-accent-ink"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          Pegas Tradisional
        </button>
        <button
          type="button"
          onClick={() => setMode("maglev")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            isMag
              ? "bg-accent text-accent-ink"
              : "text-ink-secondary hover:text-ink"
          }`}
        >
          MagLev Repulsion
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 items-center gap-8 border-t border-border pt-8 lg:grid-cols-12">
        {/* Dynamic Meters */}
        <div className="space-y-5 lg:col-span-5">
          <Meter
            label="Gesekan Kinetik"
            value={isMag ? 32 : 100}
            display={isMag ? "32% (-68%)" : "100% (Baseline)"}
            barColor={isMag ? "bg-signal-green" : "bg-ink-muted"}
          />
          <Meter
            label="Potensi Kecepatan"
            value={isMag ? 92 : 60}
            display={isMag ? "11+ TPS" : "~7.5 TPS"}
            barColor={isMag ? "bg-accent" : "bg-ink-muted"}
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
    </motion.article>
  );
}

function BallCoreModule() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLocked((l) => !l), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.article
      id="ballcore"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <span className="font-mono font-bold text-accent">02</span>
          <Cpu className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          <span>20-Magnet Ball-Core</span>
        </span>
        <span className="text-ink-muted">45° Auto-Align</span>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            20-Magnet Core Auto-Align
          </h3>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            Tarikan magnetik dari sudut ke inti bola membuat layer langsung snap presisi ke posisi home saat putaran meleset hingga 45°.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-l border-border pl-4 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              locked ? "bg-signal-green" : "bg-blue"
            }`}
            aria-hidden="true"
          />
          <span className="font-mono font-semibold text-ink">
            {locked ? "45° Snap Locked" : "Auto-Cycle Active"}
          </span>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <BallCoreAnatomy locked={locked} onToggleLock={() => setLocked((l) => !l)} />
      </div>
    </motion.article>
  );
}

function CornerCuttingModule() {
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
    <motion.article
      id="cornercut"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <span className="font-mono font-bold text-accent">03</span>
          <Gauge className="h-3.5 w-3.5 text-signal-green" aria-hidden="true" />
          <span>Corner Cutting 55°</span>
        </span>
        <span className="text-ink-muted">55° Normal / 35° Reverse</span>
      </div>

      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Corner Cutting 55° Anti Lock-Up
      </h3>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
        Toleransi sudut ekstrem mencegah macet saat jari Anda mengeksekusi algoritma cepat di atas 10 TPS.
      </p>

      {/* Style switcher */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STYLE_PROFILES.map((p, i) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setIdx(i)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              idx === i
                ? "bg-accent text-accent-ink"
                : "border border-border bg-well text-ink-secondary hover:border-border-strong hover:text-ink"
            }`}
          >
            {p.key}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-4xl font-black tracking-tight tabular-nums text-ink sm:text-5xl">
              {tps.toFixed(1)}
            </div>
            <div className="mt-1 text-xs text-ink-muted">
              turns per second (TPS)
            </div>
          </div>
          <div className="border-l border-border pl-4 text-left text-xs sm:text-right sm:border-l-0 sm:pl-0">
            <div className="font-semibold text-ink">Sudut 55° Aman</div>
            <div className="text-ink-secondary">Nol Corner Twist</div>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full border border-border bg-well">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${(tps / 14) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        {/* Algorithm Test Strip */}
        <div className="mt-6 border-t border-border pt-5">
          <span className="text-xs text-ink-muted">Algoritma Tes</span>
          <code className="mt-2 block border-l-2 border-accent pl-3.5 font-mono text-sm text-ink">
            {STYLE_PROFILES[idx].alg}
          </code>
          <p className="mt-3 flex items-center gap-2 text-xs text-ink-secondary">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-signal-green" aria-hidden="true" />
            <span>{STYLE_PROFILES[idx].note}</span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function TuningModule() {
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
      <div className="mb-2.5 flex items-center justify-between text-xs text-ink-secondary">
        <span>{label}</span>
        <span className="font-semibold text-ink">
          Level <span className="font-mono tabular-nums">{value}</span>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(n)}
            aria-label={`${label} level ${n}`}
            className={`rounded-lg py-2 font-mono text-xs font-bold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              n === value
                ? "bg-accent text-accent-ink"
                : "border border-border bg-well text-ink-secondary hover:bg-well-subtle hover:text-ink"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.article
      id="tuning"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <span className="font-mono font-bold text-accent">04</span>
          <Sliders className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>GES Pro+ Tuning Matrix</span>
        </span>
        <span className="text-ink-muted">12 Setelan Presisi</span>
      </div>

      <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Dual-Adjustment Tensi &amp; Center Travel
      </h3>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
        Atur elastisitas magnet dan jarak tempuh center pieces secara mandiri untuk mendapatkan rasa putaran yang pas dengan gaya tangan Anda.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {renderRow({ label: "Tension", value: tension, setValue: setTension })}
        {renderRow({ label: "Center Travel", value: travel, setValue: setTravel })}
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => {
            setTension(2);
            setTravel(3);
          }}
          className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Zap className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>Preset Speed (2 / 3)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTension(5);
            setTravel(4);
          }}
          className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Target className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
          <span>Preset Akurasi (5 / 4)</span>
        </button>
      </div>

      <div className="mt-8 border-t border-border pt-7">
        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <Activity className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>Profil Setelan Aktif</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${tension}-${travel}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-2.5"
          >
            <div className="text-lg font-bold text-ink">{profile.name}</div>
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <div className="border-l-2 border-accent pl-3.5 text-xs">
                <span className="font-semibold text-ink">
                  Tension {tension}: {TENSION_LEVELS[tension - 1].title}
                </span>
                <p className="mt-1 leading-relaxed text-ink-secondary">
                  {TENSION_LEVELS[tension - 1].desc}
                </p>
              </div>
              <div className="border-l-2 border-blue pl-3.5 text-xs">
                <span className="font-semibold text-ink">
                  Travel {travel}: {TRAVEL_LEVELS[travel - 1].title}
                </span>
                <p className="mt-1 leading-relaxed text-ink-secondary">
                  {TRAVEL_LEVELS[travel - 1].desc}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <Meter label="Speed Feel" value={speed} display={`${speed}%`} barColor="bg-accent" />
          <Meter label="Control Feel" value={control} display={`${control}%`} barColor="bg-blue" />
        </div>
      </div>
    </motion.article>
  );
}

export function BentoSection() {
  const [activeChapter, setActiveChapter] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const elements = CHAPTERS.map((ch) => document.getElementById(ch.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveChapter(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSelectChapter = (id: string) => {
    setActiveChapter(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="fitur" className="relative scroll-mt-24 px-4 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Sticky Column: Header + Chapter Telemetry Index */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionHeader
              badge="01 // Rekayasa Presisi"
              title="Fisika Tanpa Gesekan"
              subtitle="Speedcuber profesional beralih ke MagLev dan Ball-Core karena konsistensi: tanpa pegas aus, tanpa layer miring, dan kontrol tensi presisi."
              align="left"
              className="mb-8 sm:mb-10"
            />

            <nav aria-label="Indeks modul rekayasa" className="border-t border-border pt-6">
              <ul className="space-y-1">
                {CHAPTERS.map((ch) => {
                  const isActive = activeChapter === ch.id;
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectChapter(ch.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative flex w-full items-center justify-between gap-3 rounded-lg py-3 pl-4 pr-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          isActive
                            ? "bg-surface text-ink"
                            : "text-ink-secondary hover:bg-surface/60 hover:text-ink"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="engineering-chapter"
                            className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-accent"
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                          />
                        )}
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={`font-mono text-xs font-bold tabular-nums transition-colors ${
                              isActive
                                ? "text-accent"
                                : "text-ink-muted group-hover:text-ink-secondary"
                            }`}
                          >
                            {ch.num}
                          </span>
                          <span className="truncate text-sm font-semibold">{ch.title}</span>
                        </span>
                        <span className="hidden shrink-0 text-xs text-ink-muted sm:inline">
                          {ch.meta}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Right Scrollytelling Column: 4 Engineering Modules */}
          <div className="space-y-10 lg:col-span-8">
            <MagLevModule />
            <BallCoreModule />
            <CornerCuttingModule />
            <TuningModule />
          </div>
        </div>
      </div>
    </section>
  );
}
