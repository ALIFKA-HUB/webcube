import {
  ArrowRight,
  Box,
  Droplets,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  VolumeX,
} from "lucide-react";
import { NAV_LINKS, STORE_CHANNELS, WA_CONSULT, scrollToId } from "../data/content";

export function Footer() {
  return (
    <footer className="relative px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Final Dispatch CTA: High-contrast architectural block */}
        <div className="mb-16 overflow-hidden rounded-xl bg-ink p-8 text-canvas sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs text-canvas">
              konsultasi dan garansi tuning cuberlab
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Siap cetak personal best baru minggu ini?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              Konsultasi gratis dengan admin kami, tentukan setelan tensi sesuai preferensi tanganmu, dan terima rubik yang sudah di-lube siap pakai pecah rekor.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WA_CONSULT}
                target="_blank"
                rel="noopener noreferrer"
                className="tactile-btn-vermilion inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <MessageCircle className="h-4 w-4 text-canvas" aria-hidden="true" />
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="h-4 w-4 text-canvas" aria-hidden="true" />
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="tactile-btn-dark inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
              >
                <ShoppingBag className="h-4 w-4 text-canvas" aria-hidden="true" />
                <span>Lihat Katalog Flagship</span>
              </button>
            </div>

            {/* Trust indicators strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-white" aria-hidden="true" />
                <span>100% Original GAN & MoYu</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-white" aria-hidden="true" />
                <span>Free Setup Lube</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-white" aria-hidden="true" />
                <span>Kirim Seluruh Indonesia</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VolumeX className="h-4 w-4 text-white" aria-hidden="true" />
                <span>Garansi Tuning Resmi</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Index */}
        <div className="grid grid-cols-1 gap-10 border-t border-border pt-12 md:grid-cols-12 md:gap-12">
          {/* Store Credentials */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-canvas">
                <Box className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-ink">
                CuberLab ID
              </span>
            </div>

            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-ink-secondary sm:text-sm">
              Flagship store speedcube dan magnetic puzzle Indonesia. Kami menghadirkan unit resmi GAN dan MoYu dengan layanan free setup lube, tuning profesional, serta pengiriman aman bergaransi.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-ink-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              <span>Admin online: Senin - Sabtu, 09.00 - 21.00 WIB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-ink">
              navigasi
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs sm:text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-ink-secondary transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-ink">
              kanal resmi
            </h4>
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {STORE_CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-ink transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
                >
                  <span>{ch.label}</span>
                  <ExternalLink className="h-3 w-3 text-ink-muted" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Compliance Notice */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-xs text-ink-muted sm:flex-row sm:text-left">
          <p>© 2026 CuberLab ID. Seluruh hak cipta dilindungi.</p>
          <p>GAN dan MoYu adalah merek dagang milik pemegang hak masing-masing.</p>
        </div>
      </div>
    </footer>
  );
}
