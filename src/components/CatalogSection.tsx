import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, MessageCircle } from "lucide-react";
import { CATEGORY_TABS, PRODUCTS } from "../data/products";
import { WA_CONSULT, WA_NUMBER, formatRupiah } from "../data/content";
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

function ProductLedgerRow({ product, index }: { product: Product; index: number }) {
  const [open, setOpen] = useState(false);
  const discount = Math.round((1 - product.price / product.strike) * 100);
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo CuberLab ID, saya mau pesan ${product.name} seharga ${formatRupiah(product.price)}`
  )}`;

  return (
    <article className="p-5 transition-colors hover:bg-well/40 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Left: Isometric Preview on Recessed Pad with Model Number */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-border bg-well p-2 shadow-inner sm:h-32 sm:w-32">
          <span className="absolute left-1.5 top-1.5 font-mono text-[9px] text-ink-muted">
            mod-0{index + 1}
          </span>
          <IsoCube palette={product.palette} seed={index} />
        </div>

        {/* Center: Title, Badges, Metrics & Drawer Toggle */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-vermilion/30 bg-vermilion-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-vermilion">
              {product.badge}
            </span>
            <span className="rounded-md border border-border bg-well px-2.5 py-0.5 font-mono text-xs text-ink-secondary">
              {product.category}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-black tracking-tight text-ink sm:text-xl">
            {product.name}
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-ink-secondary sm:text-sm">
            {product.tagline}
          </p>

          {/* Key Technical Metrics */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ["Core", product.core],
              ["Weight", product.weight],
              ["Finish", product.finish],
            ].map(([k, v]) => (
              <span
                key={k}
                className="rounded-md border border-border bg-well px-2.5 py-1 font-mono text-xs text-ink-secondary"
              >
                <span className="font-bold text-ink">{k}:</span> {v}
              </span>
            ))}
          </div>

          {/* Drawer Toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-ink transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <span>{open ? "Tutup Spesifikasi" : "Lihat Spesifikasi Lengkap"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Right: Price & WhatsApp Action */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center lg:border-t-0 lg:pt-0 lg:flex-col lg:items-end lg:justify-center">
          <div className="lg:text-right">
            <div className="font-mono text-2xl font-black text-ink">
              {formatRupiah(product.price)}
            </div>
            <div className="mt-0.5 flex items-center gap-2 lg:justify-end">
              <span className="font-mono text-xs text-ink-muted line-through">
                {formatRupiah(product.strike)}
              </span>
              <span className="rounded border border-vermilion/30 bg-vermilion-soft px-1.5 py-0.2 font-mono text-[10px] font-bold text-vermilion">
                -{discount}%
              </span>
            </div>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn-dark inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs font-bold sm:w-auto sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <MessageCircle className="h-4 w-4 text-canvas" aria-hidden="true" />
            <span>Pesan via WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Expandable Specification Drawer */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="hardware-well mt-5 grid gap-4 rounded-lg p-4 text-xs sm:grid-cols-2 sm:p-5 sm:text-sm">
              <div>
                <h4 className="text-xs font-bold text-ink-secondary">
                  fitur unggulan
                </h4>
                <ul className="mt-2.5 space-y-1.5">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2 font-medium text-ink">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-ink-secondary">
                  rincian teknis pabrik
                </h4>
                <dl className="mt-2.5 divide-y divide-border rounded-md border border-border bg-surface">
                  {product.details.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2 text-xs">
                      <dt className="font-mono text-ink-secondary">{k}</dt>
                      <dd className="font-mono font-bold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <section id="katalog" className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="02 // katalog flagship"
          title="Katalog Speedcube Flagship Siap Pakai"
          subtitle="Setiap rubik telah disetel oleh spesialis CuberLab dengan lubricant khusus, kompresi presisi, dan garansi keaslian 100%."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`rounded-md px-4 py-2 font-mono text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
                  active ? "tactile-btn-dark" : "tactile-btn-light"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Hardware Spec Ledger */}
        <div className="tactile-card mt-8 overflow-hidden rounded-xl divide-y divide-border">
          {filtered.map((product, idx) => (
            <ProductLedgerRow key={product.id} product={product} index={idx} />
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="hardware-well mt-8 flex flex-col items-center justify-between gap-4 rounded-xl p-6 text-center sm:flex-row sm:text-left">
          <div>
            <h4 className="text-base font-black text-ink">
              Bingung memilih tensi dan seri yang cocok?
            </h4>
            <p className="mt-1 text-xs text-ink-secondary sm:text-sm">
              Konsultasikan gaya putaran dan target waktu Anda langsung dengan teknisi kami.
            </p>
          </div>
          <a
            href={WA_CONSULT}
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn-dark inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <MessageCircle className="h-4 w-4 text-canvas" aria-hidden="true" />
            <span>Konsultasi Gratis</span>
          </a>
        </div>
      </div>
    </section>
  );
}
