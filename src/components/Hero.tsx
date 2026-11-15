import { ArrowRight, ChevronDown, MessageCircle, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { WA_HERO, scrollToId } from "../data/content";
import { CubeStage } from "./CubeStage";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-24 pb-10 overflow-hidden telemetry-grid">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 lg:px-10 flex flex-col justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6 my-auto">
          {/* Left copy column */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-start text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Minimal telemetry badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1.5 text-xs text-ink-secondary">
              <span className="h-2 w-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
              <span className="font-semibold text-accent">Flagship Store 2026</span>
              <span className="text-ink-muted">/</span>
              <span className="text-ink-secondary">Setup &amp; Garansi Tuning Gratis</span>
            </div>

            {/* Monumental headline */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-extrabold tracking-[-0.035em] leading-[1.03] text-ink">
              Kecepatan Murni.
              <br />
              <span className="text-accent">Nol Gesekan.</span>
            </h1>

            {/* Concise lede */}
            <p className="mt-6 max-w-lg text-base sm:text-lg text-ink-secondary leading-relaxed">
              Rubik flagship GAN dan MoYu berteknologi MagLev siap pakai dari kotak.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={WA_HERO}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Pesan via WhatsApp</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canvas/15">
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Lihat Katalog Flagship</span>
              </button>
            </div>

            {/* Monospace spec strip */}
            <div className="mt-10 grid w-full grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <div className="font-mono text-2xl font-bold tracking-tight text-ink">76</div>
                <div className="mt-1 text-xs text-ink-secondary">Neodymium Core</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tracking-tight text-accent">0%</div>
                <div className="mt-1 text-xs text-ink-secondary">Pegas Logam</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold tracking-tight text-ink">45°</div>
                <div className="mt-1 text-xs text-ink-secondary">Auto-Align</div>
              </div>
            </div>
          </motion.div>

          {/* Right 3D stage column */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <CubeStage />
          </div>
        </div>

        {/* Bottom minimal editorial cue */}
        <div className="mt-8 pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-secondary">
          <span className="text-ink-muted">
            Distributor Resmi GAN &amp; MoYu · Indonesia
          </span>

          <button
            onClick={() => scrollToId("fitur")}
            className="group inline-flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors duration-150 cursor-pointer"
          >
            <span>Scroll untuk eksplorasi</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
