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
      label: "Twist",
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
      label: "Align 45°",
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
    <div className="relative h-[440px] sm:h-[540px] lg:h-[620px] w-full flex items-center justify-center">
      {/* Behind WebGL canvas: Ambient spotlight */}
      <div className="pointer-events-none absolute inset-0 spotlight-cube" />

      {/* Behind WebGL canvas: Delicate geometric SVG crosshair reticle */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25 text-border-strong"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="300" cy="288" r="140" strokeDasharray="3 6" />
        <circle cx="300" cy="288" r="220" strokeDasharray="2 8" />
        <line x1="300" y1="48" x2="300" y2="180" />
        <line x1="300" y1="396" x2="300" y2="528" />
        <line x1="60" y1="288" x2="192" y2="288" />
        <line x1="408" y1="288" x2="540" y2="288" />
        <path d="M 230 218 L 218 218 L 218 230" />
        <path d="M 370 218 L 382 218 L 382 230" />
        <path d="M 230 358 L 218 358 L 218 346" />
        <path d="M 370 358 L 382 358 L 382 346" />
        <text x="312" y="64" fill="currentColor" fontSize="10" fontFamily="monospace" stroke="none" opacity="0.8">
          AXIS::Z
        </text>
        <text x="470" y="280" fill="currentColor" fontSize="10" fontFamily="monospace" stroke="none" opacity="0.8">
          ROT::45°
        </text>
      </svg>

      {/* Top-right floating live status pill */}
      <div className="pointer-events-none absolute top-4 right-4 sm:right-6 z-20 flex items-center gap-2 rounded-full border border-border bg-surface/80 backdrop-blur-md px-3.5 py-1.5 text-xs text-ink-secondary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
        </span>
        <span className="font-medium whitespace-nowrap text-ink">{status}</span>
        <span className="text-ink-muted">·</span>
        <span className="whitespace-nowrap">Drag 3D</span>
      </div>

      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        aria-label="Rubik's Cube 3D interaktif"
      />

      {/* WebGL error fallback */}
      {!webglOk && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-canvas/90 p-8 text-center text-sm text-ink-secondary">
          Browser belum mendukung WebGL. Silakan aktifkan hardware acceleration.
        </div>
      )}

      {/* Bottom centered single-row slim control dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex w-max max-w-[calc(100%-1.5rem)] items-center divide-x divide-border rounded-xl border border-border bg-surface/90 backdrop-blur-md p-1">
        {controls.map((btn) => {
          const isDisabled = btn.lock && busy;
          return (
            <button
              key={btn.key}
              onClick={btn.action}
              disabled={isDisabled}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-ink transition-colors duration-150 first:rounded-l-lg last:rounded-r-lg hover:bg-well hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent whitespace-nowrap"
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
