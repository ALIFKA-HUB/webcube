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
      ? "text-green"
      : "text-ink";

  const hint =
    phase === "holding"
      ? "Tahan sensor... tunggu lampu siap hijau"
      : phase === "ready"
      ? "Lepas spasi atau jari untuk mulai waktu!"
      : phase === "running"
      ? "Tekan spasi atau sentuh layar untuk berhenti"
      : "Tahan tombol [Spasi] atau sentuh area timer untuk bersiap";

  return (
    <section id="timer" ref={sectionRef} className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="WCA Tournament Timer"
          title="Uji Kecepatan Putaranmu"
          subtitle="Gunakan scramble acak standar WCA, tahan tombol spasi atau sentuh layar untuk mencatat rekor personal best Anda."
          align="center"
        />

        {/* Stopwatch Main Bench Card */}
        <div className="spotlight-stage max-w-3xl mx-auto rounded-3xl border border-border bg-surface p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Scramble Strip */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-well px-4 py-2 text-xs">
              <span className="text-ink-muted">scramble:</span>
              <span className="font-mono font-semibold text-ink select-all">
                {scramble.join(" ")}
              </span>
              <div className="flex items-center gap-1 ml-1 border-l border-border pl-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scramble.join(" "));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="rounded-md p-1 text-ink-muted hover:text-ink hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                  aria-label="Salin scramble"
                  title="Salin scramble"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={newScramble}
                  className="rounded-md p-1 text-ink-muted hover:text-ink hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                  aria-label="Acak ulang scramble"
                  title="Acak ulang"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Timer Chronometer Pad */}
          <div
            onMouseDown={pressDown}
            onMouseUp={pressUp}
            onTouchStart={pressDown}
            onTouchEnd={pressUp}
            className="relative z-10 my-10 py-6 select-none cursor-pointer group"
          >
            <div
              className={`font-mono text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight transition-colors duration-150 ${timerColor}`}
            >
              {formatTime(elapsed)}
            </div>

            {/* Hint & Status Pill */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-well px-4 py-1.5 text-xs text-ink-secondary">
              <span
                className={`h-2 w-2 rounded-full ${
                  phase === "holding"
                    ? "bg-vermilion animate-pulse"
                    : phase === "ready"
                    ? "bg-green animate-ping"
                    : phase === "running"
                    ? "bg-blue animate-pulse"
                    : "bg-ink-muted"
                }`}
              />
              <span>{hint}</span>
            </div>
          </div>

          {/* Manual Control Button for Touch / Quick Access */}
          <div className="relative z-10 flex justify-center mb-8">
            <button
              onClick={toggleButton}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap ${
                phase === "running"
                  ? "bg-vermilion text-white hover:bg-red-600 shadow-md"
                  : "btn-primary"
              }`}
            >
              {phase === "running" ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Hentikan Timer</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Mulai Timer</span>
                </>
              )}
            </button>
          </div>

          {/* Session Statistics Bar */}
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border pt-6 text-xs">
            <div className="rounded-2xl border border-border bg-well p-3">
              <div className="text-ink-muted text-[11px]">Terbaik (PB)</div>
              <div className="font-mono text-base font-bold text-ink mt-0.5">
                {best !== null ? formatTime(best) : "-"}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-well p-3">
              <div className="text-ink-muted text-[11px]">Average of 5 (Ao5)</div>
              <div className="font-mono text-base font-bold text-ink mt-0.5">
                {ao5 !== null ? formatTime(ao5) : "-"}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-well p-3">
              <div className="text-ink-muted text-[11px]">Solve Terakhir</div>
              <div className="font-mono text-base font-bold text-ink mt-0.5">
                {last !== undefined ? formatTime(last) : "-"}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-well p-3">
              <div className="text-ink-muted text-[11px]">Total Solves</div>
              <div className="font-mono text-base font-bold text-ink mt-0.5">
                {solves.length}
              </div>
            </div>
          </div>

          {/* Dynamic Recommendation Card (revealed when solve completes) */}
          <AnimatePresence>
            {rec && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-8 rounded-2xl border border-vermilion/30 bg-vermilion-soft p-5 text-left text-xs sm:text-sm text-ink-secondary relative z-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 font-bold text-vermilion text-xs mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Rekomendasi Hardware untuk Catatan Waktumu</span>
                    </div>
                    <p className="text-ink font-medium">{rec.headline}</p>
                    <p className="text-ink-secondary mt-1">
                      Pilihan cocok: <strong className="text-ink">{rec.product.name}</strong> ({formatRupiah(rec.product.price)})
                    </p>
                  </div>
                  <button
                    onClick={claim}
                    className="btn-vermilion shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                  >
                    <span>Klaim Voucher Diskon</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
