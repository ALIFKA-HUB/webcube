import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Copy, Hand, Play, RotateCcw, Square } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { WA_NUMBER, formatRupiah, formatTime } from "../data/content";
import type { Phase, Product } from "../types";
import { SectionHeader } from "./SectionHeader";

const FACES = ["U", "D", "L", "R", "F", "B"];
const AXIS_OF: Record<string, number> = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };
const SUFFIXES = ["", "'", "2"];

function generateScramble(len = 20): string[] {
  const scramble: string[] = [];
  let lastAxis = -1;
  let secondLastAxis = -1;

  while (scramble.length < len) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    const axis = AXIS_OF[face];
    if (axis === lastAxis) continue;
    if (axis === secondLastAxis && lastAxis !== -1) continue;

    secondLastAxis = lastAxis;
    lastAxis = axis;
    const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    scramble.push(`${face}${suf}`);
  }
  return scramble;
}

function recommend(sec: number): { product: Product; headline: string } {
  if (sec < 10)
    return {
      product: PRODUCTS[0],
      headline: "Level elit! Waktumu sudah di zona sub-10 detik. Saatnya flagship tanpa kompromi.",
    };
  if (sec < 18)
    return {
      product: PRODUCTS[1],
      headline: "Kamu sudah kompetitif. Ball-Core 20 magnet akan memangkas lock-up dan menambah TPS.",
    };
  if (sec < 30)
    return {
      product: PRODUCTS[2],
      headline: "Potensi besar! WRM V9 memberi performa pro dengan harga yang bersahabat.",
    };
  return {
    product: PRODUCTS[3],
    headline: "Awal yang bagus! GAN 356 M E V2 membantumu menembus sub-20 detik dengan nyaman.",
  };
}

export function TimerSection() {
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

  // Spacebar Support when Timer is on screen
  useEffect(() => {
    const isTyping = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

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

  const timerColor =
    phase === "holding"
      ? "text-vermilion"
      : phase === "ready"
      ? "text-green"
      : "text-ink";

  const hint =
    phase === "holding"
      ? "tahan sensor... tunggu lampu indikator hijau"
      : phase === "ready"
      ? "lepas spasi atau sentuhan untuk mulai waktu"
      : phase === "running"
      ? "tekan spasi atau sentuh sensor untuk berhenti"
      : "tahan spasi atau tekan kedua sensor untuk bersiap";

  return (
    <section id="timer" ref={sectionRef} className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          index="03 // wca tournament bench"
          title="Laboratorium Simulasi Timer & Scramble"
          subtitle="Uji kecepatan dengan 20 langkah acakan resmi WCA. Jalankan stopwatch, catat rata-rata Ao5, dan dapatkan rekomendasi hardware presisi."
        />

        {/* Tournament Workbench Layout */}
        <div className="tactile-card overflow-hidden rounded-xl p-6 sm:p-8">
          {/* WCA Scramble Bar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-ink-muted">
                wca 3x3 scramble · 20 langkah kompetisi
              </span>
              <button
                onClick={newScramble}
                className="tactile-btn-light inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Acak Ulang</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={scramble.join("")}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="hardware-well mt-3 flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg p-4 font-mono text-base font-bold text-ink sm:text-lg"
              >
                {scramble.map((m, i) => (
                  <span key={i} className="rounded bg-surface px-2 py-0.5 border border-border shadow-2xs">
                    {m}
                  </span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Authentic StackMat Style Bench Display */}
          <div
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              if (e.pointerType === "mouse") return;
              pressDown();
            }}
            onPointerUp={(e) => {
              if (e.pointerType === "mouse") return;
              pressUp();
            }}
            className="hardware-well relative mt-6 select-none rounded-xl p-6 text-center sm:p-10 border border-border"
            style={{ touchAction: "manipulation" }}
          >
            {/* Top Chronometer Status Lamps */}
            <div className="flex items-center justify-center gap-6 text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    phase === "holding"
                      ? "bg-vermilion"
                      : "bg-border-strong"
                  }`}
                  aria-hidden="true"
                />
                <span>hold</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    phase === "ready"
                      ? "bg-green"
                      : "bg-border-strong"
                  }`}
                  aria-hidden="true"
                />
                <span>ready</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    phase === "running"
                      ? "bg-ink"
                      : "bg-border-strong"
                  }`}
                  aria-hidden="true"
                />
                <span>timing</span>
              </div>
            </div>

            {/* Main Digital Time Numbers */}
            <motion.div
              className={`mt-4 font-mono text-6xl font-black tabular-nums tracking-tight sm:text-8xl ${timerColor}`}
              animate={{ scale: phase === "ready" ? 1.03 : 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
            >
              {formatTime(phase === "holding" || phase === "ready" ? 0 : elapsed)}
            </motion.div>

            {/* Instruction Banner */}
            <p className="mt-3 text-xs text-ink-secondary sm:text-sm">
              {hint}
            </p>

            {/* Dual Sensor Palm Pads */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onPointerDown={pressDown}
                onPointerUp={pressUp}
                className={`flex h-20 items-center justify-center gap-3 rounded-lg border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
                  phase === "holding" || phase === "ready"
                    ? "border-vermilion bg-vermilion-soft text-vermilion"
                    : "border-border bg-surface text-ink-secondary hover:bg-well"
                }`}
              >
                <Hand className="h-5 w-5" aria-hidden="true" />
                <span>sensor pad kiri</span>
              </button>

              <button
                type="button"
                onPointerDown={pressDown}
                onPointerUp={pressUp}
                className={`flex h-20 items-center justify-center gap-3 rounded-lg border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
                  phase === "holding" || phase === "ready"
                    ? "border-vermilion bg-vermilion-soft text-vermilion"
                    : "border-border bg-surface text-ink-secondary hover:bg-well"
                }`}
              >
                <Hand className="h-5 w-5" aria-hidden="true" />
                <span>sensor pad kanan</span>
              </button>
            </div>

            {/* Tactile Control Buttons */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={toggleButton}
                className="tactile-btn-dark inline-flex min-w-[200px] items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                {phase === "running" ? (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <Square className="h-4 w-4" aria-hidden="true" />
                    <span className="whitespace-nowrap">Hentikan Timer</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <Play className="h-4 w-4" aria-hidden="true" />
                    <span className="whitespace-nowrap">Mulai Timer</span>
                  </span>
                )}
              </button>

              {solves.length > 0 && (
                <button
                  onClick={() => {
                    setSolves([]);
                    setElapsed(0);
                    setPhase("idle");
                  }}
                  className="tactile-btn-light rounded-md px-4 py-3 text-xs font-bold text-ink-secondary whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                >
                  <span className="whitespace-nowrap">Reset Sesi</span>
                </button>
              )}
            </div>
          </div>

          {/* Session Telemetry Grid */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface p-4 text-center">
            <div>
              <div className="text-[10px] text-ink-muted">waktu terakhir</div>
              <div className="mt-1 font-mono text-base font-black text-ink sm:text-lg">
                {last !== undefined ? formatTime(last) : "-"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-ink-muted">personal best (pb)</div>
              <div className="mt-1 font-mono text-base font-black text-vermilion sm:text-lg">
                {best !== null ? formatTime(best) : "-"}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-ink-muted">average of 5 (ao5)</div>
              <div className="mt-1 font-mono text-base font-black text-green sm:text-lg">
                {ao5 !== null ? formatTime(ao5) : "-"}
              </div>
            </div>
          </div>

          {/* Recent Solves Chips */}
          {solves.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-ink-muted">sesi ({solves.length}):</span>
              {solves.slice(0, 8).map((time, idx) => (
                <span
                  key={idx}
                  className="rounded border border-border bg-well px-2 py-0.5 font-mono text-ink"
                >
                  #{idx + 1}: {formatTime(time)}
                </span>
              ))}
            </div>
          )}

          {/* Recommendation & Voucher Claim Box */}
          <AnimatePresence>
            {rec && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="hardware-well mt-6 rounded-lg p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-vermilion/30 bg-vermilion-soft px-2 py-0.5 text-xs font-semibold text-vermilion">
                      rekomendasi rubik
                    </span>
                    <span className="text-xs text-ink font-semibold">
                      waktu solve: <span className="font-mono">{last !== undefined ? formatTime(last) : "-"}</span>
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                    {rec.headline}
                  </p>

                  <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-border pt-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="text-xs text-ink-muted">
                        model yang disarankan
                      </div>
                      <div className="text-base font-black text-ink">
                        {rec.product.name}
                      </div>
                      <div className="font-mono text-xs font-bold text-vermilion">
                        {formatRupiah(rec.product.price)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={claim}
                        className="tactile-btn-dark inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                        <span>Klaim Voucher SUB10CUBER</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
