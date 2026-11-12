import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, Star } from "lucide-react";
import { FAQS, TESTIMONIALS } from "../data/content";
import { SectionHeader } from "./SectionHeader";

export function ReviewsFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="testimoni" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Ulasan & FAQ"
          title="Dipercaya Komunitas Speedcube"
          subtitle="Dari pemula yang mengejar sub-20 hingga pemegang rekor kompetisi nasional di seluruh Indonesia."
          align="center"
        />

        {/* 3-Column Clean Testimonial Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-7 hover:border-border-strong transition-colors"
            >
              <div>
                {/* Star Rating & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-vermilion text-vermilion"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="rounded-full border border-border bg-well px-2.5 py-0.5 font-mono text-[11px] text-ink-muted">
                    {t.badge}
                  </span>
                </div>

                {/* Quote */}
                <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                  "{t.quote}"
                </p>
              </div>

              {/* Attribution */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                <div>
                  <div className="font-bold text-ink">{t.name}</div>
                  <div className="text-ink-muted">{t.role}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Terverifikasi</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist FAQ Accordion (Clean Single-Line) */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-ink">
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="mt-2 text-xs text-ink-secondary">
              Seputar garansi, setting pelumas gratis, dan pengiriman aman.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {FAQS.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={faq.q} className="py-5">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink transition-colors hover:text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-well text-ink-secondary">
                      {isOpen ? (
                        <Minus className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <Plus className="h-3 w-3" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-xs sm:text-sm leading-relaxed text-ink-secondary">
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
    </section>
  );
}
