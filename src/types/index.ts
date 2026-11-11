export type Category = "all" | "flagship" | "mid" | "entry";

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  badge: string;
  price: number;
  strike: number;
  aura: string;
  accent: string;
  palette: string[];
  weight: string;
  core: string;
  finish: string;
  tagline: string;
  specs: string[];
  details: [string, string][];
}

export type Axis = "x" | "y" | "z";
export type Finish = "gloss" | "matte";

export interface CubeMove {
  axis: Axis;
  index: number;
  dir: number;
  dur: number;
  snap?: boolean;
  record?: boolean;
  onDone?: () => void;
}

export interface EngineCallbacks {
  onStatus: (s: string) => void;
  onBusy: (b: boolean) => void;
}

export type Phase = "idle" | "holding" | "ready" | "running" | "stopped";

export interface StyleProfile {
  key: string;
  alg: string;
  tps: number;
  note: string;
}

export interface LevelDesc {
  title: string;
  style?: string;
  desc: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  badge: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface StoreChannel {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  id: string;
}
