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
    <article className="flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-6 sm:p-7 hover:border-border-strong transition-colors">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-vermilion/30 bg-vermilion-soft px-2.5 py-0.5 text-[11px] font-semibold text-vermilion">
            {product.badge}
          </span>
          <span className="rounded-full border border-border bg-well px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary capitalize">
            {product.category}
          </span>
        </div>

        {/* Isometric Cube Visual Pad */}
        <div className="spotlight-stage relative my-6 flex h-40 w-full items-center justify-center rounded-2xl border border-border bg-well p-4 overflow-hidden">
          <div className="h-28 w-28 shrink-0 relative z-10 transition-transform duration-300 hover:scale-105">
            <IsoCube palette={product.palette} seed={index} />
          </div>
        </div>

        {/* Product Title & Tagline */}
        <h3 className="text-lg font-bold text-ink tracking-tight leading-snug">
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs text-ink-secondary leading-relaxed">
          {product.tagline}
        </p>

        {/* Key Hardware Specs */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-border bg-well px-2.5 py-1 text-[11px] text-ink-secondary">
            {product.core}
          </span>
          <span className="rounded-full border border-border bg-well px-2.5 py-1 text-[11px] text-ink-secondary">
            {product.weight}
          </span>
          <span className="rounded-full border border-border bg-well px-2.5 py-1 text-[11px] text-ink-secondary">
            {product.finish}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        {/* Price & Discount */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="font-mono text-xl font-extrabold text-ink">
              {formatRupiah(product.price)}
            </div>
            <div className="font-mono text-xs text-ink-muted line-through">
              {formatRupiah(product.strike)}
            </div>
          </div>
          <span className="rounded-full bg-green-soft border border-green/30 px-2 py-0.5 text-[11px] font-semibold text-green">
            Hemat {discount}%
          </span>
        </div>

        {/* Action Button */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pesan via WhatsApp</span>
        </a>

        {/* Expandable Technical Specs Drawer */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs text-ink-secondary hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
        >
          <span>{open ? "Tutup Spesifikasi" : "Lihat Spesifikasi Lengkap"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-hidden rounded-2xl border border-border bg-well p-3.5 text-xs"
            >
              <div className="space-y-2">
                {product.details.map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between border-b border-border pb-1.5 last:border-b-0 last:pb-0">
                    <span className="text-ink-secondary">{key}</span>
                    <span className="font-medium text-ink text-right">{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filtered =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="katalog" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Katalog Flagship"
          title="Rubik Pilihan Juara"
          subtitle="Setiap unit disetel presisi, dilumasi dengan pelumas silikon performa tinggi, dan siap digunakan kompetisi langsung dari kotak."
          align="center"
        />

        {/* Filter Category Tabs */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-surface p-1.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap ${
                  selectedCategory === tab.key
                    ? "bg-ink text-canvas shadow-xs"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
