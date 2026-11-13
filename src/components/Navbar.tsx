import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Box, Menu, MessageCircle, X } from "lucide-react";
import { NAV_LINKS, WA_HERO, scrollToId } from "../data/content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 50);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Brand mark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 whitespace-nowrap transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          aria-label="CuberLab ID, kembali ke bagian atas"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-well text-ink shrink-0">
            <Box className="h-4 w-4 text-accent" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-ink whitespace-nowrap">
            CuberLab<span className="text-accent">.</span>
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="rounded-md px-3.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Primary CTA and Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Pesan WA</span>
          </a>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-well text-ink transition-colors hover:bg-well-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t border-border bg-surface px-4 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="rounded-md px-3.5 py-2 text-left text-xs font-medium text-ink-secondary transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div style={{ scaleX }} className="origin-left h-[1.5px] w-full bg-accent" />
    </header>
  );
}
