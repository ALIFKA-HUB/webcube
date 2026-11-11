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
        <div className="mb-16 overflow-hidden rounded-xl bg-[#111111] p-8 text-white sm:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-white">
              Konsultasi & Garansi Setup CuberLab
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              Siap Cetak Personal Best Baru Minggu Ini?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
              Konsultasi gratis dengan admin kami, tentukan setelan tensi sesuai preferensi tanganmu, dan terima rubik yang sudah di-lube siap pakai pecah rekor.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WA_CONSULT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFFFFF] px-6 py-3.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#EFECE6]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan via WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => scrollToId("katalog")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Lihat Katalog Flagship</span>
              </button>
            </div>

            {/* Trust indicators strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-white" />
                <span>100% Original GAN & MoYu</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-white" />
                <span>Free Setup Lube</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-white" />
                <span>Kirim Seluruh Indonesia</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VolumeX className="h-4 w-4 text-white" />
                <span>Garansi Tuning Resmi</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Index */}
        <div className="grid grid-cols-1 gap-10 border-t border-[#E4E2DD] pt-12 md:grid-cols-12 md:gap-12">
          {/* Store Credentials */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#111111] text-white">
                <Box className="h-4 w-4" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-[#111111]">
                CuberLab ID
              </span>
            </div>

            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-[#575653] sm:text-sm">
              Flagship store speedcube dan magnetic puzzle Indonesia. Kami menghadirkan unit resmi GAN dan MoYu dengan layanan free setup lube, tuning profesional, serta pengiriman aman bergaransi.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#575653]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#346538] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#346538]" />
              </span>
              <span>Admin online: Senin - Sabtu, 09.00 - 21.00 WIB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#575653]">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm">
              {[...NAV_LINKS, { label: "FAQ", id: "testimoni" }].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-[#575653] transition-colors hover:text-[#111111]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Channels */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#575653]">
              Kanal Resmi
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {STORE_CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-2 text-[#575653] transition-colors hover:bg-[#EFECE6] hover:text-[#111111]"
                  >
                    <span className="font-medium">{channel.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-[#E4E2DD] pt-6 text-[11px] text-[#575653] sm:flex-row">
          <span>© {new Date().getFullYear()} CuberLab ID. Seluruh hak cipta dilindungi.</span>
          <span>GAN dan MoYu adalah merek dagang milik pemegang hak masing-masing.</span>
        </div>
      </div>
    </footer>
  );
}
