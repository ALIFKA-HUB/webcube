import { ArrowRight, MessageCircle, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { WA_HERO, scrollToId } from "../data/content";
import { CubeStage } from "./CubeStage";

export function Hero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Minimal Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-well px-4 py-1.5 text-xs text-ink-secondary">
          <span className="flex h-2 w-2 rounded-full bg-vermilion" aria-hidden="true" />
          <span className="font-medium">Flagship Speedcube Store 2026</span>
          <span className="text-ink-muted">/</span>
          <span className="text-ink-secondary hidden sm:inline">Setup & Garansi Tuning Gratis</span>
        </div>

        {/* Monumental Headline */}
        <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink leading-[1.08]">
          Kecepatan Murni. <br className="hidden sm:inline" />
          <span className="text-vermilion">Nol Gesekan.</span>
        </h1>

        {/* Lede Text (strictly 11 words) */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink-secondary leading-relaxed">
          Rubik flagship GAN dan MoYu berteknologi MagLev siap pakai dari kotak.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Pesan via WhatsApp</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canvas/10">
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </a>

          <button
            onClick={() => scrollToId("katalog")}
            className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Lihat Katalog Flagship</span>
          </button>
        </div>

        {/* Subtle Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-secondary">
          <span className="rounded-full border border-border bg-well px-3.5 py-1">
            <span className="font-mono text-ink">76</span> Neodymium Core
          </span>
          <span className="rounded-full border border-border bg-well px-3.5 py-1">
            <span className="font-mono text-ink">0%</span> Pegas Logam
          </span>
          <span className="rounded-full border border-border bg-well px-3.5 py-1">
            <span className="font-mono text-ink">45°</span> Auto-Align
          </span>
        </div>

        {/* 3D Rubik's Cube Showcase Stage */}
        <div className="mt-12 sm:mt-16 w-full">
          <CubeStage />
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-ink-secondary">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-ink" aria-hidden="true" />
            <span>100% Original GAN & MoYu</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-ink" aria-hidden="true" />
            <span>Free Setup Lube Kompetisi</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-ink" aria-hidden="true" />
            <span>Pengiriman Cepat Seluruh Indonesia</span>
          </span>
        </div>
      </div>
    </section>
  );
}
