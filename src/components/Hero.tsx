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
    <section className="relative pt-8 sm:pt-12 lg:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: lg:col-span-5 */}
          <div className="flex flex-col lg:col-span-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D9381E]/20 bg-[#FDEBEC] px-3 py-1 text-xs font-semibold text-[#9F2F2D]">
                Official WCA Grade Speedcube Store Indonesia
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#111111] sm:text-5xl lg:text-[54px] leading-[1.08]">
              Pecahkan Rekor Sub-10 Detik dengan Presisi Magnetik MagLev.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#575653] sm:text-lg">
              Distributor resmi GAN dan MoYu di Indonesia. Siap pakai dengan free setup lube dan garansi tuning presisi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WA_HERO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#111111] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2b2b29]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-6 py-3.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              >
                <ShoppingBag className="h-4 w-4 text-[#575653]" />
                <span>Lihat Katalog</span>
              </button>
            </div>
          </div>

          {/* Right Column: lg:col-span-7 */}
          <div className="lg:col-span-7">
            <CubeStage />
          </div>
        </div>
      </div>

      {/* Trust Index Strip: 4-column horizontal ledger */}
      <div className="mt-14 border-y border-[#E4E2DD] bg-[#FFFFFF] sm:mt-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-[#E4E2DD] sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
          <div className="flex items-center gap-3.5 p-4 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EFECE6] text-[#111111]">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <div className="font-mono text-xl font-bold text-[#111111] sm:text-2xl">
                <CountUp to={2400} suffix="+" />
              </div>
              <div className="text-xs font-medium text-[#575653]">Cuber Terdaftar</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EFECE6] text-[#111111]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="font-mono text-xl font-bold text-[#111111] sm:text-2xl">100%</div>
              <div className="text-xs font-medium text-[#575653]">Original GAN & MoYu</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EFECE6] text-[#111111]">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <div className="font-mono text-xl font-bold text-[#111111] sm:text-2xl">0%</div>
              <div className="text-xs font-medium text-[#575653]">Gesekan Pegas MagLev</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EFECE6] text-[#111111]">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <div className="font-mono text-xl font-bold text-[#111111] sm:text-2xl">Gratis</div>
              <div className="text-xs font-medium text-[#575653]">Garansi Tuning & Lube</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
