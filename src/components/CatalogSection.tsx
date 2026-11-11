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
    <svg viewBox="0 0 200 170" className="h-full w-full">
      <defs>
        <linearGradient id={`gloss-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.05" />
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
                  {f.shade > 0 && <polygon points={points} fill="#000" opacity={f.shade} />}
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
    <article className="p-5 transition-colors hover:bg-[#F7F6F3]/50 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Left: Isometric Preview on Recessed Pad */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-2 sm:h-32 sm:w-32">
          <IsoCube palette={product.palette} seed={index} />
        </div>

        {/* Center: Title, Badges, Metrics & Drawer Toggle */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#D9381E]/20 bg-[#FDEBEC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#9F2F2D]">
              {product.badge}
            </span>
            <span className="rounded-full border border-[#E4E2DD] bg-[#EFECE6] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#575653]">
              {product.category}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-extrabold tracking-tight text-[#111111] sm:text-xl">
            {product.name}
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-[#575653] sm:text-sm">
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
                className="rounded-md border border-[#E4E2DD] bg-[#EFECE6] px-2.5 py-1 font-mono text-xs text-[#575653]"
              >
                <span className="font-semibold text-[#111111]">{k}:</span> {v}
              </span>
            ))}
          </div>

          {/* Drawer Toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] transition-colors hover:text-[#D9381E]"
          >
            <span>{open ? "Tutup Spesifikasi" : "Lihat Spesifikasi Lengkap"}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Right: Price & WhatsApp Action */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-[#E4E2DD] pt-4 sm:flex-row sm:items-center lg:border-t-0 lg:pt-0 lg:flex-col lg:items-end lg:justify-center">
          <div className="lg:text-right">
            <div className="font-mono text-2xl font-black text-[#111111]">
              {formatRupiah(product.price)}
            </div>
            <div className="mt-0.5 flex items-center gap-2 lg:justify-end">
              <span className="font-mono text-xs text-[#8A8884] line-through">
                {formatRupiah(product.strike)}
              </span>
              <span className="rounded border border-[#D9381E]/20 bg-[#FDEBEC] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#9F2F2D]">
                -{discount}%
              </span>
            </div>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#111111] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2b2b29] sm:w-auto sm:text-sm"
          >
            <MessageCircle className="h-4 w-4" />
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-4 rounded-lg border border-[#E4E2DD] bg-[#EFECE6] p-4 text-xs sm:grid-cols-2 sm:p-5 sm:text-sm">
              <div>
                <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#575653]">
                  Fitur Unggulan
                </h4>
                <ul className="mt-2.5 space-y-1.5">
                  {product.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2 text-[#111111]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#346538]" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#575653]">
                  Rincian Teknis
                </h4>
                <dl className="mt-2.5 divide-y divide-[#E4E2DD] rounded-md border border-[#E4E2DD] bg-[#FFFFFF]">
                  {product.details.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 px-3 py-2">
                      <dt className="text-[#575653]">{key}</dt>
                      <dd className="font-medium text-[#111111] text-right">{value}</dd>
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
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredProducts =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === activeCategory);

  return (
    <section id="katalog" className="relative scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Katalog Flagship"
          title="Pilih Senjata Rekor Berikutnya"
          subtitle="Setiap unit 100% original, sudah di-lube dan di-tuning presisi oleh tim CuberLab sebelum dikirim. Garansi tuning resmi tanpa biaya tambahan."
        />

        {/* Category Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`rounded-md px-4 py-2 font-mono text-xs font-semibold transition-colors ${
                activeCategory === tab.key
                  ? "bg-[#111111] text-white"
                  : "border border-[#E4E2DD] bg-[#FFFFFF] text-[#575653] hover:bg-[#EFECE6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Hardware Spec Ledger */}
        <div className="overflow-hidden rounded-xl border border-[#E4E2DD] bg-[#FFFFFF] divide-y divide-[#E4E2DD]">
          {filteredProducts.map((product, index) => (
            <ProductLedgerRow key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Consultation Prompt */}
        <p className="mt-6 text-center text-xs text-[#575653] sm:text-sm">
          Butuh saran spesifik?{" "}
          <a
            href={WA_CONSULT}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#111111] underline underline-offset-4 hover:text-[#D9381E]"
          >
            Konsultasi gratis dengan admin kami via WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
