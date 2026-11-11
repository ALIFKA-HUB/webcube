import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, ShoppingBag, Users, Wrench, Zap } from "lucide-react";
import { WA_HERO, scrollToId } from "../data/content";
import { CubeStage } from "./CubeStage";

function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
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

export function Hero() {
  return (
    <section className="relative pt-6 sm:pt-10 lg:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Technical Registration Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-xs text-ink-secondary">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-vermilion" aria-hidden="true" />
            <span className="font-semibold text-ink">cuberlab id / lab-spec 2026</span>
            <span className="text-ink-muted">/</span>
            <span className="hidden sm:inline">official wca grade speedcube store</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded border border-border bg-surface px-2 py-0.5 text-[11px] text-ink">
              setup dan garansi tuning gratis
            </span>
            <span className="hidden text-ink-muted md:inline">indonesia / 09:00-21:00 wib</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: 5 Cols */}
          <div className="flex flex-col lg:col-span-5">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-ink">
                dual-repulsion maglev dan ball-core
              </span>
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-ink leading-[1.04]">
              Pecahkan rekor{" "}
              <span className="text-vermilion underline decoration-vermilion decoration-[4px] underline-offset-8">
                sub-10
              </span>{" "}
              dengan presisi MagLev.
            </h1>

            <p className="mt-5 text-base leading-relaxed text-ink-secondary sm:text-lg">
              Rubik flagship GAN dan MoYu berteknologi MagLev siap pakai dari kotak.
            </p>

            {/* Spec Highlights Matrix */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-y border-border py-3 text-xs">
              <div>
                <div className="text-[10px] text-ink-muted">sistem inti</div>
                <div className="mt-0.5 font-bold text-ink"><span className="font-mono">76</span> magnets</div>
              </div>
              <div className="border-x border-border px-2">
                <div className="text-[10px] text-ink-muted">kompresi</div>
                <div className="mt-0.5 font-bold text-ink"><span className="font-mono">0%</span> pegas logam</div>
              </div>
              <div className="pl-2">
                <div className="text-[10px] text-ink-muted">corner cut</div>
                <div className="mt-0.5 font-bold text-ink"><span className="font-mono">45°</span> auto-align</div>
              </div>
            </div>

            {/* Tactile Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WA_HERO}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn-vermilion inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <MessageCircle className="h-4 w-4 text-canvas" aria-hidden="true" />
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="h-4 w-4 text-canvas" aria-hidden="true" />
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="tactile-btn-dark inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <ShoppingBag className="h-4 w-4 text-canvas" aria-hidden="true" />
                <span>Lihat Katalog Flagship</span>
              </button>
            </div>
          </div>

          {/* Right Column: 7 Cols (3D CubeStage) */}
          <div className="lg:col-span-7">
            <CubeStage />
          </div>
        </div>
      </div>

      {/* Trust Index Strip: 4-column horizontal ledger */}
      <div className="mt-14 border-y border-border bg-surface sm:mt-18">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <div className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-well text-ink">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-mono text-xl font-black text-ink sm:text-2xl">
                <CountUp to={2400} suffix="+" />
              </div>
              <div className="text-xs font-medium text-ink-secondary">speedcuber indonesia</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-well text-ink">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-mono text-xl font-black text-ink sm:text-2xl">100%</div>
              <div className="text-xs font-medium text-ink-secondary">original GAN dan MoYu</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-well text-ink">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-mono text-xl font-black text-ink sm:text-2xl">0 dB</div>
              <div className="text-xs font-medium text-ink-secondary">spring noise hening</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-well text-ink">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-mono text-xl font-black text-ink sm:text-2xl">Gratis</div>
              <div className="text-xs font-medium text-ink-secondary">setup lube dan garansi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
