import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Minus, Plus, Star } from "lucide-react";
import { FAQS, TESTIMONIALS } from "../data/content";
import { SectionHeader } from "./SectionHeader";

export function ReviewsFaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="testimoni" className="scroll-mt-24 px-4 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          {/* Left Column: Editorial Reviews */}
          <div className="lg:col-span-6">
            <SectionHeader
              badge="04 // Ulasan & FAQ"
              title="Dipercaya Komunitas Speedcube"
              subtitle="Dari pemula yang mengejar sub-20 hingga pemegang rekor kompetisi nasional di seluruh Indonesia."
              align="left"
            />

            <div className="divide-y divide-border border-y border-border">
              {TESTIMONIALS.map((t, idx) => (
                <motion.article
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="py-7 first:pt-6 last:pb-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1" aria-label={`Rating ${t.rating} dari 5`}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-accent text-accent"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="rounded-md border border-border bg-well px-2.5 py-0.5 font-mono text-xs text-ink-secondary tabular-nums">
                      {t.badge}
                    </span>
                  </div>

                  <blockquote className="mt-4 text-base sm:text-lg leading-relaxed text-ink">
                    "{t.quote}"
                  </blockquote>

                  <div className="mt-5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-ink">{t.name}</div>
                      <div className="mt-0.5 text-ink-secondary">{t.role}</div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Terverifikasi</span>
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky FAQ Accordion */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Pertanyaan yang Sering Diajukan
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
                Informasi seputar garansi resmi, layanan setting pelumas gratis, dan pengiriman aman ke seluruh Indonesia.
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
                      className="flex w-full items-center justify-between gap-4 text-left text-sm sm:text-base font-semibold text-ink transition-colors hover:text-ink-secondary active:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span>{faq.q}</span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isOpen
                            ? "border-accent bg-accent text-accent-ink"
                            : "border-border bg-well text-ink-secondary"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pt-3.5 pr-10 text-xs sm:text-sm leading-relaxed text-ink-secondary">
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
