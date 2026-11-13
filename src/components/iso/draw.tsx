import type { KeyboardEvent, ReactNode } from "react";
import type { Solid as SolidGeometry, Vec2 } from "./iso-kit";

export type Tone =
  | "hi"
  | "mid"
  | "lo"
  | "faint"
  | "lit"
  | "halo"
  | "vermilion"
  | "blue"
  | "green";

export type Weight = "thick" | "mid" | "thin" | "hair" | "halo";

export type Accent = "vermilion" | "blue" | "green";

export interface SolidProps {
  geometry: SolidGeometry;
  lit?: boolean;
  accent?: Accent;
}

/**
 * Render an extruded or curved 2.5D solid with 4-tone CSS shading, top cap,
 * crease, optional bevel line, and outer silhouette outline.
 */
export function Solid({ geometry, lit = false, accent }: SolidProps) {
  return (
    <g
      className="iso-solid"
      data-lit={lit ? "true" : undefined}
      data-accent={accent}
    >
      {geometry.fill && <path className="iso-fill" d={geometry.fill} />}
      {geometry.shades.map((d, idx) =>
        d ? (
          <path key={idx} className="iso-shade" data-shade={idx} d={d} />
        ) : null,
      )}
      {geometry.top && <path className="iso-top" d={geometry.top} />}
      {geometry.crease && (
        <path
          className="iso-line"
          data-role="crease"
          data-tone="mid"
          data-w="thin"
          d={geometry.crease}
        />
      )}
      {geometry.bevel && (
        <path
          className="iso-line"
          data-role="bevel"
          data-tone="lo"
          data-w="hair"
          d={geometry.bevel}
        />
      )}
      {geometry.outline && (
        <path
          className="iso-line"
          data-role="outline"
          data-tone={lit ? "lit" : "hi"}
          data-w="mid"
          d={geometry.outline}
        />
      )}
    </g>
  );
}

export interface LineProps {
  d: string;
  tone?: Tone;
  w?: Weight;
  dash?: boolean;
  flow?: boolean;
}

/**
 * Render an isometric technical stroke path styled via CSS classes and data attributes.
 */
export function Line({
  d,
  tone = "mid",
  w = "thin",
  dash = false,
  flow = false,
}: LineProps) {
  if (!d) return null;

  return (
    <path
      className="iso-line"
      data-tone={tone}
      data-w={w}
      data-dash={dash ? "true" : undefined}
      data-flow={flow ? "true" : undefined}
      d={d}
    />
  );
}

export interface WireProps {
  d: string;
  a: Vec2;
  b: Vec2;
  tone?: Tone;
  dash?: boolean;
  flow?: boolean;
  halo?: boolean;
}

/**
 * Render a curved magnetic/mechanical vector wire with optional halo and endpoint dots.
 */
export function Wire({
  d,
  a,
  b,
  tone = "vermilion",
  dash = false,
  flow = false,
  halo = true,
}: WireProps) {
  if (!d) return null;

  return (
    <g className="iso-wire" data-tone={tone}>
      {halo && <Line d={d} tone="halo" w="halo" />}
      <Line d={d} tone={tone} w="mid" dash={dash} flow={flow} />
      <circle
        className="iso-wire-end"
        data-tone={tone}
        cx={a[0]}
        cy={a[1]}
        r={2.4}
      />
      <circle
        className="iso-wire-end"
        data-tone={tone}
        cx={b[0]}
        cy={b[1]}
        r={2.4}
      />
    </g>
  );
}

export interface DotsProps {
  points: Vec2[];
  r?: number;
  tone?: Tone;
}

/**
 * Render circular screws/pins/poles at projected 2D coordinates.
 */
export function Dots({ points, r = 1.8, tone = "hi" }: DotsProps) {
  if (points.length === 0) return null;

  return (
    <g className="iso-dots" data-tone={tone}>
      {points.map(([x, y], idx) => (
        <circle key={idx} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

export interface IsoPlateProps {
  fig?: string;
  title: string;
  hint?: string;
  readout?: ReactNode;
  viewBox?: string;
  interactive?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Framed isometric anatomy plate following wheresryan22/anatomy corner metadata rules.
 */
export function IsoPlate({
  fig,
  title,
  hint,
  readout,
  viewBox = "-160 -120 320 240",
  interactive = false,
  onClick,
  ariaLabel,
  children,
}: IsoPlateProps) {
  const isActionable = Boolean(interactive || onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <figure
      className={`iso-plate m-0 flex flex-col ${isActionable ? "iso-plate-interactive" : ""}`}
      role={isActionable ? "button" : undefined}
      tabIndex={isActionable ? 0 : undefined}
      aria-label={ariaLabel ?? (isActionable ? title : undefined)}
      onClick={onClick}
      onKeyDown={isActionable ? handleKeyDown : undefined}
    >
      <div className="iso-plate-header">
        {fig && <span className="iso-plate-fig">{fig}</span>}
        <span className="iso-plate-title">{title}</span>
      </div>

      <svg
        viewBox={viewBox}
        className="iso-svg"
        aria-hidden={ariaLabel ? undefined : true}
      >
        {children}
      </svg>

      {(hint || readout !== undefined) && (
        <div className="iso-plate-footer">
          {hint && <span className="iso-plate-hint">{hint}</span>}
          {readout !== undefined && (
            <span className="iso-plate-readout">{readout}</span>
          )}
        </div>
      )}
    </figure>
  );
}
