import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Magnet, Palette, Shuffle, Target, Zap } from "lucide-react";
import { createCubeEngine, type CubeEngine } from "../engine/cubeEngine";
import type { Finish } from "../types";

export function CubeStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CubeEngine | null>(null);
  const [status, setStatus] = useState("Aligned · Home");
  const [busy, setBusy] = useState(false);
  const [finish, setFinish] = useState<Finish>("gloss");
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let engine: CubeEngine | null = null;
    try {
      engine = createCubeEngine(el, { onStatus: setStatus, onBusy: setBusy });
      engineRef.current = engine;
    } catch (err) {
      console.warn("WebGL tidak tersedia", err);
      setWebglOk(false);
    }
    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  const toggleFinish = useCallback(() => {
    setFinish((f) => {
      const next: Finish = f === "gloss" ? "matte" : "gloss";
      engineRef.current?.setFinish(next);
      return next;
    });
  }, []);

  const dock = [
    {
      key: "twist",
      icon: <Layers className="h-4 w-4" aria-hidden="true" />,
      label: "Slice Twist",
      sub: "layer turn",
      action: () => engineRef.current?.twist(),
      lock: true,
    },
    {
      key: "scramble",
      icon: <Shuffle className="h-4 w-4" aria-hidden="true" />,
      label: "Scramble",
      sub: "20 wca moves",
      action: () => engineRef.current?.scramble(),
      lock: true,
    },
    {
      key: "align",
      icon: <Magnet className="h-4 w-4" aria-hidden="true" />,
      label: "Auto-Align",
      sub: "45° snap lock",
      action: () => engineRef.current?.align(),
      lock: true,
    },
    {
      key: "finish",
      icon: <Palette className="h-4 w-4" aria-hidden="true" />,
      label: "Finishing",
      sub: finish === "gloss" ? "uv gloss" : "frosted matte",
      action: toggleFinish,
      lock: false,
    },
  ];

  return (
    <div className="relative">
      <div className="tactile-card-dark relative h-[490px] overflow-hidden rounded-xl border border-dark-border sm:h-[510px]">
        {/* Engineering Corner Registration Marks */}
        <div className="pointer-events-none absolute left-3.5 top-3 z-20 text-[11px] font-semibold text-ink-muted select-none">
          + stage 01 // 3d-physics bench
        </div>
        <div className="pointer-events-none absolute right-3.5 top-3 z-20 hidden text-[11px] text-ink-muted select-none sm:block">
          scale: 55.5mm · ratio 1:1 +
        </div>

        {/* Studio Background Grid Marks */}
        <div className="pointer-events-none absolute inset-0 opacity-25 stage-grid-pattern" />

        {/* Three.js canvas mount */}
        <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" aria-label="Rubik's Cube 3D interaktif" />

        {/* Fallback warning if WebGL unavailable */}
        {!webglOk && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-surface p-8 text-center text-sm text-ink-muted">
            Browser belum mendukung WebGL. Silakan perbarui browser untuk melihat 3D bench.
          </div>
        )}

        {/* Top Status Pill */}
        <div className="pointer-events-none absolute left-3.5 right-3.5 top-9 z-20 flex items-start justify-between gap-2">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-[75%] items-center gap-2 rounded-md border border-dark-border bg-dark-surface/90 px-3 py-1 font-mono text-[10px] text-ink-inverse backdrop-blur-xs sm:text-[11px]"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-vermilion ${
                  busy ? "animate-ping" : "opacity-60"
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-vermilion" />
            </span>
            <span className="truncate font-semibold">{status}</span>
          </motion.div>

          <span className="rounded-md border border-dark-border bg-dark-surface/90 px-2.5 py-1 text-[11px] text-ink-muted backdrop-blur-xs">
            rotasi 360° aktif
          </span>
        </div>

        {/* Floating Architectural Telemetry Chips */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-3.5 top-24 z-20 hidden items-center gap-1.5 rounded-md border border-dark-border bg-dark-surface/90 px-2.5 py-1 text-xs font-bold text-ink-inverse backdrop-blur-xs sm:flex"
        >
          <Magnet className="h-3 w-3 text-vermilion" aria-hidden="true" />
          <span>76 neodymium core</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="pointer-events-none absolute left-3.5 top-[44%] z-20 hidden items-center gap-1.5 rounded-md border border-dark-border bg-dark-surface/90 px-2.5 py-1 text-xs font-bold text-ink-inverse backdrop-blur-xs sm:flex"
        >
          <Target className="h-3 w-3 text-blue" aria-hidden="true" />
          <span>55.5mm chassis</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute right-3.5 top-[52%] z-20 hidden items-center gap-1.5 rounded-md border border-dark-border bg-dark-surface/90 px-2.5 py-1 text-xs font-bold text-ink-inverse backdrop-blur-xs sm:flex"
        >
          <Zap className="h-3 w-3 text-green" aria-hidden="true" />
          <span>62g ultra-light</span>
        </motion.div>

        {/* Bottom Hardware Control Dock */}
        <div className="absolute inset-x-3 bottom-3 z-20">
          <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-dark-border bg-dark-surface/95 p-1.5 backdrop-blur-sm sm:grid-cols-4">
            {dock.map((d) => {
              const disabled = d.lock && busy;
              return (
                <button
                  key={d.key}
                  onClick={d.action}
                  disabled={disabled}
                  className="flex items-center gap-2 rounded-md border border-dark-border bg-dark-canvas px-2.5 py-2 text-left text-ink-inverse transition-colors hover:bg-stage-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dark-border bg-dark-surface text-ink-inverse">
                    {d.icon}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[11px] font-bold text-ink-inverse">{d.label}</span>
                    <span className="block truncate text-[10px] text-ink-muted">{d.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
