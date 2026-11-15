const BASE_TELEMETRY_ITEMS = [
  "76 Neodymium Core",
  "MagLev Repulsion · -68% Friction",
  "20-Magnet Ball-Core · 45° Snap",
  "Free Silicone Lube Setup",
  "55° Corner Cutting",
  "Garansi Tuning Resmi",
] as const;

// Duplicate array per track so wide and ultra-wide viewports stay seamlessly saturated
const TELEMETRY_ITEMS = [...BASE_TELEMETRY_ITEMS, ...BASE_TELEMETRY_ITEMS];

export function TelemetryMarquee() {
  return (
    <div
      className="w-full overflow-hidden border-y border-border bg-band py-4 select-none"
      role="region"
      aria-label="Telemetri Spesifikasi Speedcube"
    >
      <div className="flex w-max items-center animate-marquee">
        {/* Track 1: Accessible primary stream */}
        <div className="flex items-center shrink-0">
          {TELEMETRY_ITEMS.map((item, idx) => (
            <div key={`stream-primary-${idx}`} className="flex items-center">
              <span className="text-xs sm:text-sm font-semibold text-ink whitespace-nowrap">
                {item}
              </span>
              <span
                className="mx-6 sm:mx-8 inline-block h-1.5 w-1.5 rounded-sm bg-accent shrink-0"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Track 2: Duplicate stream for continuous seamless loop */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {TELEMETRY_ITEMS.map((item, idx) => (
            <div key={`stream-duplicate-${idx}`} className="flex items-center">
              <span className="text-xs sm:text-sm font-semibold text-ink whitespace-nowrap">
                {item}
              </span>
              <span
                className="mx-6 sm:mx-8 inline-block h-1.5 w-1.5 rounded-sm bg-accent shrink-0"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
