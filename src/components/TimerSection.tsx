import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Check, Copy, Play, RotateCcw, Sparkles, Square } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { WA_NUMBER, formatRupiah, formatTime, scrollToId } from "../data/content";
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

  // State colors strictly matching specification: #111111 idle/running, #9F2F2D holding, #346538 ready
  const timerColor =
    phase === "holding"
      ? "text-[#9F2F2D]"
      : phase === "ready"
      ? "text-[#346538]"
      : "text-[#111111]";

  const hint =
    phase === "holding"
      ? "Tahan... tunggu sampai hijau"
      : phase === "ready"
      ? "Lepas spasi / sentuhan untuk MULAI!"
      : phase === "running"
      ? "Tekan spasi / ketuk untuk BERHENTI"
      : "Tahan Spasi lalu lepas untuk mulai (di mobile: tahan area timer)";

  return (
    <section id="timer" ref={sectionRef} className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="WCA Speedcubing Bench"
          title="Laboratorium Simulasi Timer & Scramble"
          subtitle="Uji refleksmu dengan 20-langkah acakan resmi WCA. Jalankan stopwatch, catat rata-rata Ao5, dan dapatkan rekomendasi hardware presisi."
        />

        {/* Laboratory Workbench Layout */}
        <div className="overflow-hidden rounded-xl border border-[#E4E2DD] bg-[#FFFFFF] p-6 sm:p-8">
          {/* WCA Scramble Bar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#575653]">
                WCA 3x3 Scramble · 20 Langkah
              </span>
              <button
                onClick={newScramble}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-1.5 font-mono text-xs font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
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
                className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-4 font-mono text-base font-semibold tracking-wide text-[#111111] sm:text-lg"
              >
                {scramble.map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stopwatch Digital Timer Display */}
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
            className="relative mt-6 select-none rounded-xl border border-[#E4E2DD] bg-[#EFECE6] p-8 text-center sm:p-12"
            style={{ touchAction: "manipulation" }}
          >
            <motion.div
              className={`font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-8xl ${timerColor}`}
              animate={{ scale: phase === "ready" ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
            >
              {formatTime(phase === "holding" || phase === "ready" ? 0 : elapsed)}
            </motion.div>

            <p className="mt-4 font-mono text-xs text-[#575653] sm:text-sm">{hint}</p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={toggleButton}
                className={`inline-flex min-w-[200px] items-center justify-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-bold text-white transition-colors ${
                  phase === "running"
                    ? "bg-[#D9381E] hover:bg-[#B82E18]"
                    : "bg-[#111111] hover:bg-[#2b2b29]"
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
              </button>

              {solves.length > 0 && (
                <button
                  onClick={() => {
                    setSolves([]);
                    setElapsed(0);
                    setPhase("idle");
                  }}
                  className="rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-4 py-3 font-mono text-xs font-semibold text-[#575653] transition-colors hover:bg-[#F7F6F3] hover:text-[#111111]"
                >
                  Reset Sesi
                </button>
              )}
            </div>
          </div>

          {/* Session Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["Terakhir", last !== undefined ? formatTime(last) : "-"],
              ["Personal Best (PB)", best !== null ? formatTime(best) : "-"],
              ["Ao5 Rata-rata", ao5 !== null ? formatTime(ao5) : "-"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-3 text-center"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#575653]">
                  {k}
                </div>
                <div className="mt-1 font-mono text-base font-bold text-[#111111] sm:text-lg">
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Product Recommendation & Voucher Claim */}
          <AnimatePresence>
            {rec && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-xl border border-[#E4E2DD] bg-[#EFECE6] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#111111] text-white">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-[#111111]">
                        Waktu tercatat:{" "}
                        <span className="font-mono text-[#D9381E]">{formatTime(last!)}</span>
                      </p>
                      <p className="mt-1 text-xs text-[#575653] sm:text-sm">{rec.headline}</p>
                      <p className="mt-2 text-xs text-[#111111] sm:text-sm">
                        Rekomendasi untukmu: <strong>{rec.product.name}</strong> ({formatRupiah(rec.product.price)})
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-md border border-[#E4E2DD] bg-[#FFFFFF] p-3 text-xs text-[#575653]">
                    Gunakan kode voucher{" "}
                    <code className="rounded border border-[#E4E2DD] bg-[#EFECE6] px-1.5 py-0.5 font-mono font-bold text-[#111111]">
                      SUB10CUBER
                    </code>{" "}
                    untuk diskon ekstra <strong>Rp 50.000</strong> pembelian seri MagLev via WhatsApp.
                  </div>

                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                    <button
                      onClick={claim}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-[#111111] px-5 py-2.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-[#2b2b29] sm:text-sm"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? "Kode Tersalin! Membuka WhatsApp..." : "Klaim Voucher SUB10CUBER"}</span>
                    </button>

                    <button
                      onClick={() => scrollToId("katalog")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-5 py-2.5 text-xs font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3] sm:text-sm"
                    >
                      <span>Lihat di Katalog</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Solve History Chips */}
          {solves.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[#E4E2DD] pt-4">
              {solves.slice(0, 8).map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-3 py-1 font-mono text-xs text-[#575653]"
                >
                  #{solves.length - i} · {formatTime(s)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
