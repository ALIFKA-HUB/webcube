import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, Copy, Play, RotateCcw, Sparkles, Square } from "lucide-react";
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

  // Spacebar Support when Timer is in view
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
    const msg = `Halo CuberLab ID, saya mau klaim voucher ${code} (diskon ekstra Rp 50.000). Waktu solve saya ${
      last !== undefined ? formatTime(last) : "-"
    }. Mohon rekomendasi rubiknya ya!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const timerColor =
    phase === "holding"
      ? "text-vermilion"
      : phase === "ready"
      ? "text-accent"
      : "text-ink";

  const hint =
    phase === "holding"
      ? "Tahan sensor... tunggu indikator siap"
      : phase === "ready"
      ? "Lepas spasi atau jari untuk mulai waktu!"
      : phase === "running"
      ? "Tekan spasi atau sentuh layar untuk berhenti"
      : "Tahan tombol [Spasi] atau sentuh area timer untuk bersiap";

  const glowImage =
    phase === "holding"
      ? "radial-gradient(circle at 50% 54%, var(--color-vermilion-soft) 0%, transparent 66%)"
      : phase === "ready"
      ? "radial-gradient(circle at 50% 54%, var(--color-accent-soft) 0%, transparent 66%)"
      : phase === "running"
      ? "radial-gradient(circle at 50% 54%, var(--color-blue-soft) 0%, transparent 66%)"
      : "none";

  const recentSolves = solves.slice(0, 5);

  return (
    <section
      id="timer"
      ref={sectionRef}
      className="scroll-mt-24 border-y border-border bg-band px-4 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          badge="03 // WCA Tournament Timer"
          title="Uji Kecepatan Putaranmu"
          subtitle="Gunakan scramble acak standar WCA, tahan tombol spasi atau sentuh layar untuk mencatat rekor personal best Anda."
          align="left"
        />

        {/* 12-Column Telemetry Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Chronometer Arena */}
          <div className="lg:col-span-8 rounded-2xl border border-border bg-canvas p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Reactive ambient radial glow behind digits */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                phase === "holding" || phase === "ready" || phase === "running"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{ backgroundImage: glowImage }}
            />

            {/* Top WCA Scramble Bar */}
            <div className="relative z-10 rounded-xl border border-border bg-well px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="shrink-0 text-ink-muted">Scramble:</span>
                <span className="font-mono font-semibold text-ink select-all break-words">
                  {scramble.join(" ")}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1 border-l border-border pl-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(scramble.join(" ")).catch(() => undefined);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Salin scramble"
                  title="Salin scramble"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-accent" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  onClick={newScramble}
                  disabled={phase === "running"}
                  className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-ink active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Acak ulang scramble"
                  title="Acak ulang"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Interactive Timer Chronometer Pad */}
            <div
              onMouseDown={pressDown}
              onMouseUp={pressUp}
              onTouchStart={pressDown}
              onTouchEnd={pressUp}
              className="relative z-10 my-10 py-8 sm:py-12 flex flex-col items-center justify-center text-center select-none cursor-pointer"
            >
              <div
                className={`font-mono text-6xl sm:text-8xl lg:text-[112px] font-black tracking-tight leading-none tabular-nums transition-colors duration-150 ${timerColor}`}
              >
                {formatTime(elapsed)}
              </div>

              {/* Status Pill */}
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-border bg-well px-4 py-1.5 text-xs text-ink-secondary">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    phase === "holding"
                      ? "bg-vermilion motion-safe:animate-pulse"
                      : phase === "ready"
                      ? "bg-accent motion-safe:animate-ping"
                      : phase === "running"
                      ? "bg-blue motion-safe:animate-pulse"
                      : "bg-ink-muted"
                  }`}
                />
                <span>{hint}</span>
              </div>
            </div>

            {/* Manual Control Row */}
            <div className="relative z-10 flex items-center justify-center border-t border-border pt-6">
              <button
                onClick={toggleButton}
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold whitespace-nowrap transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  phase === "running"
                    ? "bg-vermilion text-white hover:bg-vermilion-deep"
                    : "btn-accent"
                }`}
              >
                {phase === "running" ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    <span>Hentikan</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    <span>Mulai Timer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Telemetry Sidebar */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5">
            {/* 2x2 Stat Grid */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between text-xs text-ink-secondary">
                <span className="font-semibold text-ink">Telemetri Sesi</span>
                <span>WCA Format</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-well p-3.5">
                  <div className="text-xs text-ink-muted">Terbaik (PB)</div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-accent">
                    {best !== null ? formatTime(best) : "-"}
                  </div>
                </div>
                <div className="rounded-xl bg-well p-3.5">
                  <div className="text-xs text-ink-muted">Average of 5</div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                    {ao5 !== null ? formatTime(ao5) : "-"}
                  </div>
                </div>
                <div className="rounded-xl bg-well p-3.5">
                  <div className="text-xs text-ink-muted">Solve Terakhir</div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                    {last !== undefined ? formatTime(last) : "-"}
                  </div>
                </div>
                <div className="rounded-xl bg-well p-3.5">
                  <div className="text-xs text-ink-muted">Total Solves</div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-ink">
                    {solves.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Solves Strip */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink">Riwayat Terakhir</span>
                <span className="font-mono text-ink-muted tabular-nums">
                  {recentSolves.length}/5
                </span>
              </div>

              {recentSolves.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSolves.map((ms, idx) => (
                    <span
                      key={`${idx}-${ms}`}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs tabular-nums ${
                        idx === 0
                          ? "bg-accent-soft text-accent font-semibold"
                          : "bg-well text-ink-secondary"
                      }`}
                    >
                      {formatTime(ms)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
                  Catatan 5 waktu solve terakhir Anda akan muncul di sini setelah timer dihentikan.
                </p>
              )}
            </div>

            {/* Dynamic Recommendation & Voucher Claim */}
            <AnimatePresence mode="wait">
              {rec ? (
                <motion.div
                  key={rec.product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-accent/40 bg-accent-soft p-5 text-left"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Rekomendasi Hardware</span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-ink">
                    {rec.headline}
                  </p>

                  <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-border/70 pt-3 text-xs">
                    <span className="font-semibold text-ink">{rec.product.name}</span>
                    <span className="font-mono font-bold text-ink tabular-nums">
                      {formatRupiah(rec.product.price)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <span className="text-ink-secondary">Kode Voucher:</span>
                    <code className="rounded-md bg-canvas px-2 py-0.5 font-mono font-bold text-accent">
                      SUB10CUBER
                    </code>
                  </div>

                  <button
                    onClick={claim}
                    className="btn-accent mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span>Klaim Voucher Diskon</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="voucher-idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-surface p-5 text-xs leading-relaxed text-ink-secondary"
                >
                  <div className="flex items-center justify-between gap-2 font-semibold text-ink">
                    <span>Bonus Sesi Latihan</span>
                    <code className="rounded-md bg-well px-2 py-0.5 font-mono text-accent">
                      SUB10CUBER
                    </code>
                  </div>
                  <p className="mt-2 text-ink-secondary">
                    Selesaikan 1 kali solve di timer untuk mendapatkan rekomendasi rubik sesuai kecepatan Anda dan klaim potongan harga Rp 50.000.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
