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
    <footer className="relative px-4 pb-12 pt-8 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-7xl">
        {/* Final Minimalist CTA Banner */}
        <div className="mb-16 overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center sm:p-14 shadow-lg flex flex-col items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-well px-3.5 py-1 text-xs text-ink-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-vermilion" aria-hidden="true" />
              <span>Konsultasi & Garansi Tuning Gratis</span>
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
              Siap cetak personal best baru minggu ini?
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-ink-secondary sm:text-base">
              Konsultasi gratis dengan admin kami, tentukan setelan tensi sesuai preferensi tanganmu, dan terima rubik yang sudah di-lube siap pakai pecah rekor.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={WA_CONSULT}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Lihat Katalog Flagship</span>
              </button>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border pt-6 text-xs text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-ink" aria-hidden="true" />
                <span>100% Original GAN & MoYu</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-ink" aria-hidden="true" />
                <span>Free Setup Lube</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-ink" aria-hidden="true" />
                <span>Kirim Seluruh Indonesia</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VolumeX className="h-3.5 w-3.5 text-ink" aria-hidden="true" />
                <span>Garansi Resmi</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Index Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Store Credentials */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-well text-ink">
                <Box className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-base font-bold tracking-tight text-ink">
                CuberLab<span className="text-vermilion">.</span>
              </span>
            </div>

            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-ink-secondary">
              Flagship store speedcube dan magnetic puzzle resmi Indonesia. Kami menyediakan unit resmi GAN dan MoYu dengan layanan free setup lube profesional.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-ink-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              <span>Admin Online: Senin - Sabtu, 09.00 - 21.00 WIB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-ink">
              navigasi
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-ink-secondary transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-ink">
              kanal resmi
            </h4>
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
              {STORE_CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-border bg-well px-3 py-2 text-ink-secondary transition-colors hover:bg-well-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
                >
                  <span>{ch.label}</span>
                  <ExternalLink className="h-3 w-3 text-ink-muted" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Notice */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-xs text-ink-muted sm:flex-row sm:text-left">
          <p>© 2026 CuberLab ID. Seluruh hak cipta dilindungi.</p>
          <p>GAN dan MoYu adalah merek dagang milik pemegang hak masing-masing.</p>
        </div>
      </div>
    </footer>
  );
}
