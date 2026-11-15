import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { CATEGORY_TABS, PRODUCTS } from "../data/products";
import { WA_NUMBER, formatRupiah } from "../data/content";
import type { Category, Product } from "../types";
import { SectionHeader } from "./SectionHeader";

function IsoCube({ palette, seed }: { palette: string[]; seed: number }) {
  const a: [number, number] = [60, 35];
  const b: [number, number] = [-60, 35];
  const c: [number, number] = [0, 70];
  const O: [number, number] = [100, 14];

  const pt = (
    o: [number, number],
    u: [number, number],
    v: [number, number],
    i: number,
    j: number
  ) =>
    `${o[0] + (u[0] * i) / 3 + (v[0] * j) / 3},${
      o[1] + (u[1] * i) / 3 + (v[1] * j) / 3
    }`;

  const faces: { o: [number, number]; u: [number, number]; v: [number, number]; shade: number }[] = [
    { o: O, u: a, v: b, shade: 0 },
    { o: [O[0] + b[0], O[1] + b[1]], u: a, v: c, shade: 0.22 },
    { o: [O[0] + a[0], O[1] + a[1]], u: b, v: c, shade: 0.42 },
  ];

  return (
    <svg viewBox="0 0 200 170" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`gloss-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {faces.map((f, fi) => (
        <g key={fi}>
          {[0, 1, 2].flatMap((i) =>
            [0, 1, 2].map((j) => {
              const col = palette[(i * 2 + j * 3 + fi * 2 + seed) % palette.length];
              const points = [
                pt(f.o, f.u, f.v, i, j),
                pt(f.o, f.u, f.v, i + 1, j),
                pt(f.o, f.u, f.v, i + 1, j + 1),
                pt(f.o, f.u, f.v, i, j + 1),
              ].join(" ");
              return (
                <g key={`${i}-${j}`}>
                  <polygon
                    points={points}
                    fill={col}
                    stroke="#111111"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {f.shade > 0 && <polygon points={points} fill="#000000" opacity={f.shade} />}
                </g>
              );
            })
          )}
        </g>
      ))}
      <polygon
        points={`${O[0]},${O[1]} ${O[0] + a[0]},${O[1] + a[1]} ${O[0] + a[0] + b[0]},${
          O[1] + a[1] + b[1]
        } ${O[0] + b[0]},${O[1] + b[1]}`}
        fill={`url(#gloss-${seed})`}
      />
    </svg>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [open, setOpen] = useState(false);
  const discount = Math.round((1 - product.price / product.strike) * 100);
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo CuberLab ID, saya mau pesan ${product.name} seharga ${formatRupiah(product.price)}`
  )}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-border-strong transition-colors"
    >
      <div className="grid h-full grid-cols-1 sm:grid-cols-12">
        {/* Left Studio Chamber */}
        <div className="sm:col-span-5 bg-well p-6 flex flex-col justify-between relative overflow-hidden border-b border-border sm:border-b-0 sm:border-r">
          <div
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              background: `radial-gradient(circle at 50% 54%, ${product.aura} 0%, transparent 68%)`,
            }}
            aria-hidden="true"
          />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              {product.badge}
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary capitalize">
              {product.category}
            </span>
          </div>

          {/* Centered Isometric Cube */}
          <div className="relative z-10 flex flex-1 items-center justify-center py-8 sm:py-6">
            <div className="h-36 w-36 sm:h-40 sm:w-40 shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none">
              <IsoCube palette={product.palette} seed={index} />
            </div>
          </div>
        </div>

        {/* Right Spec & Action Panel */}
        <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-ink leading-snug">
              {product.name}
            </h3>
            <p className="mt-1.5 text-sm text-ink-secondary leading-relaxed">
              {product.tagline}
            </p>

            {/* 3 Crisp Hairline Spec Rows */}
            <dl className="mt-5 border-t border-b border-border divide-y divide-border">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-xs text-ink-muted">Core</dt>
                <dd className="font-mono text-xs text-ink text-right">{product.core}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-xs text-ink-muted">Bobot</dt>
                <dd className="font-mono text-xs text-ink text-right">{product.weight}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-xs text-ink-muted">Finishing</dt>
                <dd className="font-mono text-xs text-ink text-right">{product.finish}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6">
            {/* Price & Discount */}
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-2xl font-extrabold text-ink">
                  {formatRupiah(product.price)}
                </div>
                <div className="font-mono text-xs line-through text-ink-muted">
                  {formatRupiah(product.strike)}
                </div>
              </div>
              <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                Hemat <span className="font-mono">{discount}%</span>
              </span>
            </div>

            {/* Primary WhatsApp CTA */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Pesan via WhatsApp</span>
            </a>

            {/* Expandable Technical Specs Drawer */}
            <div className="mt-4 border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                className="flex w-full items-center justify-between text-xs font-medium text-ink-secondary hover:text-ink active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap cursor-pointer"
              >
                <span>{open ? "Tutup Spesifikasi" : "Lihat Spesifikasi Lengkap"}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-reduce:transition-none ${
                    open ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-border bg-well p-3.5 text-xs divide-y divide-border">
                      {product.details.map(([key, val]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-4 py-1.5 first:pt-0 last:pb-0"
                        >
                          <span className="text-ink-muted shrink-0">{key}</span>
                          <span className="font-medium text-ink text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filtered =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="katalog"
      className="scroll-mt-24 border-t border-border px-4 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Top Asymmetric Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            badge="02 // Katalog Flagship"
            title="Rubik Pilihan Juara"
            subtitle="Pilihan terbaik seri GAN dan MoYu terbaru. Setiap unit melalui pengecekan magnet dan setup pelumasan sebelum dikirim."
            align="left"
            className="mb-0 sm:mb-0"
          />

          {/* Filter Category Tabs */}
          <div
            className="inline-flex flex-wrap items-center gap-1 self-start rounded-full border border-border bg-surface p-1.5 lg:self-end shrink-0"
            role="tablist"
            aria-label="Filter kategori rubik"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap cursor-pointer ${
                    active ? "text-accent-ink" : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalog-tab"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wide 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
