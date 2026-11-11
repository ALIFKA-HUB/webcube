import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Magnet, Palette, Shuffle, Target, Zap } from "lucide-react";
import { createCubeEngine, type CubeEngine } from "../engine/cubeEngine";
import type { Finish } from "../types";

export function CubeStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CubeEngine | null>(null);
  const [status, setStatus] = useState("Status: Aligned - Home");
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
      icon: <Layers className="h-4 w-4" />,
      label: "Slice Twist",
      sub: "Putar Layer",
      action: () => engineRef.current?.twist(),
      lock: true,
    },
    {
      key: "scramble",
      icon: <Shuffle className="h-4 w-4" />,
      label: "Scramble Mode",
      sub: "20 Moves",
      action: () => engineRef.current?.scramble(),
      lock: true,
    },
    {
      key: "align",
      icon: <Magnet className="h-4 w-4" />,
      label: "Auto-Align",
      sub: "45° Snap",
      action: () => engineRef.current?.align(),
      lock: true,
    },
    {
      key: "finish",
      icon: <Palette className="h-4 w-4" />,
      label: "Mode Finishing",
      sub: finish === "gloss" ? "UV High-Gloss" : "Frosted Matte",
      action: toggleFinish,
      lock: false,
    },
  ];

  return (
    <div className="relative">
      <div className="relative h-[480px] overflow-hidden rounded-xl border border-[#E4E2DD] bg-[#EFECE6] sm:h-[500px]">
        {/* Three.js canvas mount */}
        <div ref={mountRef} className="absolute inset-0" aria-label="Rubik's Cube 3D interaktif" />

        {/* Fallback warning if WebGL unavailable */}
        {!webglOk && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#EFECE6] p-8 text-center text-sm text-[#575653]">
            Browser kamu belum mendukung WebGL. Perbarui browser untuk melihat showroom 3D.
          </div>
        )}

        {/* Top status bar */}
        <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-[75%] items-center gap-2 rounded-full border border-[#E4E2DD] bg-[#FFFFFF] px-3 py-1 font-mono text-[10px] text-[#111111] shadow-xs sm:text-[11px]"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-[#346538] ${
                  busy ? "animate-ping" : "opacity-60"
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#346538]" />
            </span>
            <span className="truncate">{status}</span>
          </motion.div>

          <span className="rounded-full border border-[#E4E2DD] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[10px] text-[#575653] shadow-xs">
            Drag untuk rotasi 360°
          </span>
        </div>

        {/* Floating HUD tags */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-3 top-16 hidden items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#FFFFFF]/90 px-2.5 py-1 text-[11px] font-semibold text-[#111111] shadow-xs sm:flex"
        >
          <Magnet className="h-3 w-3 text-[#575653]" /> 76 Neodymium Magnets
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="pointer-events-none absolute left-3 top-[44%] hidden items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#FFFFFF]/90 px-2.5 py-1 text-[11px] font-semibold text-[#111111] shadow-xs sm:flex"
        >
          <Target className="h-3 w-3 text-[#575653]" /> 55.5mm Ergonomic Size
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute right-3 top-[50%] hidden items-center gap-1.5 rounded-full border border-[#E4E2DD] bg-[#FFFFFF]/90 px-2.5 py-1 text-[11px] font-semibold text-[#111111] shadow-xs sm:flex"
        >
          <Zap className="h-3 w-3 text-[#575653]" /> 62g Ultra-Light
        </motion.div>

        {/* Bottom hardware dock: 4 tactile buttons */}
        <div className="absolute inset-x-2.5 bottom-2.5">
          <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-[#E4E2DD] bg-[#FFFFFF]/95 p-1.5 backdrop-blur-sm sm:grid-cols-4">
            {dock.map((d) => {
              const disabled = d.lock && busy;
              return (
                <motion.button
                  key={d.key}
                  onClick={d.action}
                  disabled={disabled}
                  whileHover={disabled ? undefined : { y: -1 }}
                  whileTap={disabled ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2 rounded-md border border-[#E4E2DD] bg-[#FFFFFF] px-2.5 py-2 text-left transition-colors hover:bg-[#F7F6F3] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#EFECE6] text-[#111111]">
                    {d.icon}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[11px] font-bold text-[#111111]">{d.label}</span>
                    <span className="block truncate font-mono text-[9px] text-[#575653]">{d.sub}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
