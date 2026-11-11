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
          index="04 // ulasan dan faq"
          title="Dipercaya Speedcuber Kompetitif Indonesia"
          subtitle="Dari pemula yang mengejar sub-20 hingga pemegang rekor kompetisi nasional, cuber di seluruh Indonesia mempercayakan setup dan tuning rubiknya pada CuberLab ID."
        />

        {/* 12-column asymmetric layout: Left 5 cols (Testimonials), Right 7 cols (FAQ) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column (5 cols): 3 Verified Editorial Testimonials */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="tactile-card flex flex-col justify-between rounded-xl p-5 sm:p-6"
              >
                <div>
                  {/* Star Rating & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-vermilion text-vermilion" aria-hidden="true" />
                      ))}
                    </div>
                    <span className="rounded-md border border-border bg-well px-2 py-0.5 font-mono text-xs text-ink-secondary">
                      {t.badge}
                    </span>
                  </div>

                  {/* Quote (<= 3 lines) */}
                  <p className="mt-3.5 text-xs font-medium leading-relaxed text-ink sm:text-sm line-clamp-3">
                    "{t.quote}"
                  </p>
                </div>

                {/* Attribution */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <div>
                    <div className="font-bold text-ink">{t.name}</div>
                    <div className="text-xs text-ink-muted">{t.role}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>terverifikasi</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (7 cols): Minimalist FAQ Accordion */}
          <div className="tactile-card rounded-xl p-6 sm:p-8 lg:col-span-7">
            <div className="mb-6 border-b border-border pb-4">
              <span className="text-xs text-ink-muted">
                tanya jawab resmi
              </span>
              <h3 className="mt-1 text-xl font-black tracking-tight text-ink">
                FAQ Pengiriman & Garansi Setup
              </h3>
            </div>

            <div className="divide-y divide-border">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div key={faq.q} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 text-left text-sm font-bold text-ink transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion sm:text-base"
                    >
                      <span>{faq.q}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-well text-ink">
                        {isOpen ? <Minus className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2.5 text-xs leading-relaxed text-ink-secondary sm:text-sm">
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
