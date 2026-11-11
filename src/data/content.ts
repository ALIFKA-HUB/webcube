import type {
  FaqItem,
  LevelDesc,
  NavLink,
  StoreChannel,
  StyleProfile,
  Testimonial,
} from "../types";

export const WA_NUMBER = "6281234567890";
export const WA_HERO =
  "https://wa.me/6281234567890?text=Halo%20CuberLab%20ID,%20saya%20tertarik%20pesan%20Speedcube%20Flagship";
export const WA_CONSULT =
  "https://wa.me/6281234567890?text=Halo%20Admin%20CuberLab%20ID,%20saya%20mau%20konsultasi%20dan%20klaim%20promo%20pembelian%20rubik";
export const WA_GENERAL = `https://wa.me/${WA_NUMBER}`;
export const IG_URL = "https://instagram.com/cuberlab.id";

export const STORE_CHANNELS: StoreChannel[] = [
  { label: "WhatsApp", href: WA_GENERAL },
  { label: "Instagram", href: IG_URL },
  { label: "TikTok", href: "https://www.tiktok.com/@cuberlab.id" },
  { label: "Tokopedia", href: "https://www.tokopedia.com/cuberlab-id" },
  { label: "Shopee", href: "https://shopee.co.id/cuberlab.id" },
  { label: "YouTube", href: "https://www.youtube.com/@cuberlab.id" },
];

export const NAV_LINKS: NavLink[] = [
  { label: "Rekayasa MagLev", id: "fitur" },
  { label: "Katalog Flagship", id: "katalog" },
  { label: "WCA Timer", id: "timer" },
  { label: "Ulasan & FAQ", id: "testimoni" },
];

export const STYLE_PROFILES: StyleProfile[] = [
  {
    key: "CFOP",
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    tps: 11.8,
    note: "Cross -> F2L -> OLL/PLL tanpa lock-up.",
  },
  {
    key: "Roux",
    alg: "M' U M' U M' U2 M U M U",
    tps: 12.6,
    note: "Putaran M-slice mulus, anti-pop saat flick cepat.",
  },
  {
    key: "ZZ",
    alg: "R U2 R' U' R U' R' L' U' L U",
    tps: 10.9,
    note: "EOLine dan F2L tanpa rotasi tetap stabil.",
  },
];

export const TENSION_LEVELS: LevelDesc[] = [
  {
    title: "Feather-Light",
    style: "Pemanasan & tangan ringan",
    desc: "Layer sangat lepas, nyaris tanpa hambatan. Cocok untuk warm-up dan cuber dengan flick halus.",
  },
  {
    title: "Ultra-Fast & Loose",
    style: "High TPS",
    desc: "Level 2: Ultra-Fast & Loose for High TPS. Respons secepat kilat untuk algoritma beruntun.",
  },
  {
    title: "Fast & Responsive",
    style: "Speed solving harian",
    desc: "Ringan namun tetap terkendali. Pilihan favorit untuk sesi latihan Ao12 sehari-hari.",
  },
  {
    title: "Balanced Competitive",
    style: "All-round kompetisi",
    desc: "Keseimbangan ideal antara kecepatan dan kontrol. Setelan standar banyak finalis WCA.",
  },
  {
    title: "Stable & Controllable",
    style: "Accuracy",
    desc: "Level 5: Stable & Controllable for Accuracy. Minim overshoot, ideal untuk lookahead panjang.",
  },
  {
    title: "Rock-Solid Precision",
    style: "Kontrol maksimal",
    desc: "Tensi paling kokoh untuk tangan bertenaga dan solve tanpa kompromi akurasi.",
  },
];

export const TRAVEL_LEVELS: LevelDesc[] = [
  {
    title: "Minimal Travel",
    desc: "Center nyaris tanpa celah: super stabil, minim wobble.",
  },
  {
    title: "Short Travel",
    desc: "Gerakan center pendek, responsif untuk gaya presisi.",
  },
  {
    title: "Moderate Travel",
    desc: "Ruang gerak cukup untuk corner cutting tanpa mengorbankan kontrol.",
  },
  {
    title: "Flexible Travel",
    desc: "Toleransi lebih besar saat layer sedikit miring di tengah algoritma.",
  },
  {
    title: "Wide Travel",
    desc: "Corner cutting agresif dengan center yang lega dan forgiving.",
  },
  {
    title: "Maximum Travel",
    desc: "Kelonggaran penuh untuk gaya speed-demon dan reaksi instan.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rizky Pratama",
    role: "Mahasiswa Teknik, Bandung",
    badge: "PB Single: 7.42s | Ao5: 9.15s",
    quote:
      "Pesan GAN 16 MagLev hari Senin, Rabu sudah sampai. Setup lube rapi langsung siap pakai latihan, dan auto-align 45 derajat sangat membantu saat solve cepat.",
    rating: 5,
  },
  {
    name: "Aulia Safitri",
    role: "Pelajar SMA, Surabaya",
    badge: "PB Single: 9.88s | Ao5: 11.64s",
    quote:
      "Admin CuberLab bantu konsultasi setelan tensi sesuai gaya putarku. WRM V9 langsung kencang dan stabil, Ao5 turun signifikan dalam sebulan latihan.",
    rating: 5,
  },
  {
    name: "Bagas Wicaksono",
    role: "Kompetitor Regional, Yogyakarta",
    badge: "PB Single: 6.87s | Ao5: 8.52s",
    quote:
      "Layanan free setup lube sangat konsisten dan packing aman ke luar Jawa. Super WeiLong V2 jadi andalan di kompetisi resmi tanpa kendala pop.",
    rating: 5,
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "Apakah produk CuberLab ID 100% original dan bergaransi resmi?",
    a: "Ya. Semua GAN dan MoYu kami ambil langsung dari distributor resmi dan dikirim dengan segel pabrik. Kamu mendapat garansi tuning gratis serta garansi penggantian untuk cacat produksi. Jika ada masalah, cukup hubungi admin via WhatsApp dengan video unboxing.",
  },
  {
    q: "Apa bedanya sistem MagLev dengan pegas biasa?",
    a: "Pegas logam menekan layer lewat kontak fisik sehingga menimbulkan gesekan, suara, dan makin lemah seiring waktu. MagLev memakai dua magnet cincin yang saling tolak (tanpa kontak), sehingga putaran lebih halus, hening, dan tensinya konsisten, dengan gesekan kinetik turun hingga 68%.",
  },
  {
    q: "Apa itu layanan Free Setup Lube sebelum dikirim?",
    a: "Setiap cube dibongkar, dibersihkan, diberi lubrikan (lube) pada core dan layer, lalu di-tuning sesuai preferensimu: speed, balanced, atau control. Cube sampai di tanganmu sudah siap latihan atau kompetisi. Sebutkan preferensi gayamu saat chat admin ya.",
  },
  {
    q: "Apakah bisa dikirim ke seluruh Indonesia? Berapa lama sampai?",
    a: "Bisa. Kami mengirim ke seluruh Indonesia via JNE, J&T, SiCepat, dan kurir instan untuk Jabodetabek. Pesanan sebelum pukul 15.00 WIB diproses di hari yang sama, estimasi 1-3 hari untuk Jawa dan 3-6 hari untuk luar Jawa. Semua paket diberi bubble wrap ekstra dan asuransi.",
  },
];

export const formatRupiah = (n: number): string =>
  "Rp " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const scrollToId = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const formatTime = (ms: number): string => {
  const total = ms / 1000;
  if (total >= 60) {
    const m = Math.floor(total / 60);
    const s = total - m * 60;
    return `${m}:${s.toFixed(3).padStart(6, "0")}s`;
  }
  return `${total.toFixed(3).padStart(6, "0")}s`;
};
