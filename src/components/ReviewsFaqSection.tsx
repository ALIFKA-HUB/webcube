import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, Star } from "lucide-react";
import { FAQS, TESTIMONIALS } from "../data/content";
import { SectionHeader } from "./SectionHeader";

export function ReviewsFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="testimoni" className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Ulasan & FAQ"
          title="Dipercaya Speedcuber Kompetitif"
          subtitle="Dari pelajar yang baru menembus sub-12 hingga kompetitor regional, cuber di seluruh Indonesia mempercayakan setup rubiknya pada CuberLab ID."
        />

        {/* 12-column asymmetric layout: Left 5 cols (Testimonials), Right 7 cols (FAQ) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column (5 cols): 3 Verified Editorial Testimonials */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-xl border border-[#E4E2DD] bg-[#FFFFFF] p-5 sm:p-6"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#D97706] text-[#D97706]" />
                    ))}
                  </div>

                  {/* Benchmark Badge */}
                  <div className="mt-3">
                    <span className="rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#575653]">
                      {t.badge}
                    </span>
                  </div>

                  {/* Quote (<= 3 lines) */}
                  <p className="mt-3 text-xs leading-relaxed text-[#111111] sm:text-sm line-clamp-3">
                    "{t.quote}"
                  </p>
                </div>

                {/* Attribution */}
                <div className="mt-4 flex items-center justify-between border-t border-[#E4E2DD] pt-3 text-xs">
                  <div>
                    <div className="font-bold text-[#111111]">{t.name}</div>
                    <div className="text-[11px] text-[#575653]">{t.role}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#346538]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Terverifikasi
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (7 cols): Minimalist FAQ Accordion */}
          <div className="rounded-xl border border-[#E4E2DD] bg-[#FFFFFF] p-6 sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-[#E4E2DD] pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#575653]">
                Pertanyaan Umum
              </span>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[#111111]">
                FAQ Pengiriman & Garansi Setup
              </h3>
            </div>

            <div className="divide-y divide-[#E4E2DD]">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left text-sm font-bold text-[#111111] transition-colors hover:text-[#D9381E] sm:text-base"
                    >
                      <span>{faq.q}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#E4E2DD] bg-[#EFECE6] text-[#111111]">
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2.5 text-xs leading-relaxed text-[#575653] sm:text-sm">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
