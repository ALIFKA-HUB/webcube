import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Menu, MessageCircle, X } from "lucide-react";
import { NAV_LINKS, WA_HERO, scrollToId } from "../data/content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 50);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="flex h-13 items-center justify-between rounded-full border border-border bg-canvas px-4 sm:px-5 shadow-lg">
        {/* Minimal Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion rounded-full"
          aria-label="CuberLab ID, kembali ke bagian atas"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-well text-ink shrink-0">
            <Box className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold tracking-tight text-ink whitespace-nowrap">
            CuberLab<span className="text-vermilion">.</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-ink hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Primary Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Pesan WA</span>
          </a>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-well text-ink transition-colors hover:bg-well-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion md:hidden"
            aria-label="Toggle navigasi"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface p-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="rounded-xl px-4 py-2.5 text-left text-xs font-medium text-ink-secondary transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
