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
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 text-left whitespace-nowrap transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          aria-label="cuberlab id, kembali ke atas"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-canvas shrink-0">
            <Box className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="leading-none whitespace-nowrap">
            <span className="block text-[15px] font-extrabold tracking-tight text-ink whitespace-nowrap">
              CuberLab ID
            </span>
            <span className="mt-0.5 block text-[10px] text-ink-muted whitespace-nowrap">
              speedcube flagship store
            </span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn-dark inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            <MessageCircle className="h-4 w-4 text-canvas" aria-hidden="true" />
            <span>Pesan via WhatsApp</span>
          </a>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border bg-surface px-4 py-3 md:hidden"
          >
            <div className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="rounded-md px-3 py-2 text-left text-sm font-medium text-ink-secondary transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
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
