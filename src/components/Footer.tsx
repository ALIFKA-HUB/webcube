import { Box, ExternalLink } from "lucide-react";
import { NAV_LINKS, STORE_CHANNELS, scrollToId } from "../data/content";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-band px-4 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          {/* Store Credentials */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-well text-ink">
                <Box className="h-4 w-4 text-accent" aria-hidden="true" />
              </span>
              <span className="text-base font-bold tracking-tight text-ink">
                CuberLab<span className="text-accent">.</span>
              </span>
            </div>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-secondary">
              Flagship store speedcube dan magnetic puzzle resmi Indonesia. Kami menyediakan unit resmi GAN dan MoYu dengan layanan free setup lube profesional.
            </p>

            <div className="mt-5 flex items-center gap-2.5 text-xs text-ink-secondary">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
              </span>
              <span>Admin Online: Senin - Sabtu, 09.00 - 21.00 WIB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-ink">Navigasi</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToId(link.id)}
                    className="text-ink-secondary transition-colors hover:text-ink active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-ink">Kanal Resmi</h4>
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
              {STORE_CHANNELS.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-border bg-well px-3.5 py-2.5 text-ink-secondary transition-colors hover:border-border-strong hover:bg-surface hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
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
