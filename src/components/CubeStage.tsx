import { useCallback, useEffect, useRef, useState } from "react";
import { Layers, Magnet, Palette, Shuffle } from "lucide-react";
import { createCubeEngine, type CubeEngine } from "../engine/cubeEngine";
import type { Finish } from "../types";

export function CubeStage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CubeEngine | null>(null);
  const [status, setStatus] = useState("Siap Dimainkan");
  const [busy, setBusy] = useState(false);
  const [finish, setFinish] = useState<Finish>("gloss");
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let engine: CubeEngine | null = null;
    try {
      engine = createCubeEngine(el, {
        onStatus: (st) => {
          if (st.includes("Slice Twist")) setStatus("Putaran Slice Selesai");
          else if (st.includes("Scrambled")) setStatus("20 Gerakan Diacak");
          else if (st.includes("Aligned")) setStatus("Terkunci Magnet 45°");
          else setStatus(st);
        },
        onBusy: setBusy,
      });
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

  const controls = [
    {
      key: "twist",
      icon: <Layers className="h-3.5 w-3.5" aria-hidden="true" />,
      label: "Slice Twist",
      action: () => engineRef.current?.twist(),
      lock: true,
    },
    {
      key: "scramble",
      icon: <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />,
      label: "Scramble",
      action: () => engineRef.current?.scramble(),
      lock: true,
    },
    {
      key: "align",
      icon: <Magnet className="h-3.5 w-3.5" aria-hidden="true" />,
      label: "Auto-Align 45°",
      action: () => engineRef.current?.align(),
      lock: true,
    },
    {
      key: "finish",
      icon: <Palette className="h-3.5 w-3.5" aria-hidden="true" />,
      label: finish === "gloss" ? "UV Gloss" : "Matte",
      action: toggleFinish,
      lock: false,
    },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Container card with subtle border & atmospheric lighting */}
      <div className="sleek-card spotlight-stage relative h-[440px] sm:h-[500px] w-full overflow-hidden rounded-3xl">
        {/* Floating Top Telemetry Status Pill */}
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-border bg-well px-4 py-1.5 text-xs text-ink-secondary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="font-medium whitespace-nowrap text-ink">{status}</span>
          <span className="text-ink-muted">·</span>
          <span className="text-ink-secondary hidden sm:inline whitespace-nowrap">Drag untuk Memutar 3D</span>
        </div>

        {/* Three.js canvas mount */}
        <div
          ref={mountRef}
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
          aria-label="Rubik's Cube 3D interaktif"
        />

        {/* Fallback warning if WebGL unavailable */}
        {!webglOk && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-canvas p-8 text-center text-sm text-ink-secondary">
            Browser belum mendukung WebGL. Silakan aktifkan hardware acceleration.
          </div>
        )}

        {/* Bottom Floating Control Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-surface p-1.5 shadow-lg">
          {controls.map((btn) => {
            const isDisabled = btn.lock && busy;
            return (
              <button
                key={btn.key}
                onClick={btn.action}
                disabled={isDisabled}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-well disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion whitespace-nowrap"
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
