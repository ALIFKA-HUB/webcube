# Desain Spesifikasi: 2.5D Isometric Mechanical Anatomy untuk CuberLab ID

## 1. Latar Belakang & Tujuan
Pada Bento Section landing page CuberLab ID, dua card utama:
1. **Dual-Repulsion MagLev**
2. **20-Magnet Ball-Core 45° Auto-Align**

Sebelumnya menggunakan diagram 2D flat yang terlalu sederhana dan abstrak (lingkaran dan kotak flat biasa). Desain ini akan ditingkatkan mengacu pada standar visual dan metodologi repository [**`wheresryan22/anatomy`**](https://github.com/wheresryan22/anatomy):
- Menerjemahkan sistem fisik nyata ke dalam **ilustrasi anatomi mekanikal isometrik (2.5D exploded cutaway)** yang presisi.
- Menggunakan proyeksi isometrik (sudut 30°), teknik *4-tone mechanical shading* (highlight, mid-tone, shadow, cavity), dan animasi dinamis berbasis SVG + Framer Motion.
- Menjaga performa tetap ringan (<50KB), 60 FPS, dan bebas dari overhead multi-kanvas WebGL yang berat.

---

## 2. Rincian Desain Komponen

### A. Anatomi Card 1: Dual-Repulsion MagLev Assembly
- **Metaphor**: Potongan bedah isometrik (*exploded cutaway*) dari tabung *center-piece* rubik flagship.
- **Komponen Visual (Atas ke Bawah)**:
  1. **Center Cap & Acrylic Spindle**: Silinder pelindung transparan dengan potongan melintang (*cross-section cutaway*).
  2. **Upper Ring Magnet (N-Pole, Floating)**:
     - Bentuk cincin elips isometrik bergradasi metalik krom dengan aksen chamfer.
     - Mengapung secara dinamis pada mode *MagLev*, dengan animasi getaran mikro (*micro-levitation floating*).
  3. **Medan Levitasi Magnetik (Magnetic Flux Void)**:
     - Garis fluks magnetik melengkung yang memancarkan aura tolak-menolak antar kutub sejenis (N-N).
     - Label indikator dinamis: *Celah Levitasi: 1.8mm · 0% Kontak Logam*.
  4. **Lower Ring Magnet (N-Pole, Fixed)**:
     - Cincin magnet elips bawah yang tertanam kuat pada base collar *center piece*.
  5. **Poros Inti (Center Shaft) & Mur GES Pro+**:
     - Batang logam titanium yang menembus lubang tengah kedua magnet hingga ke mur setelan tensi bertakik mikro di dasar.
- **Interaktivitas**:
  - Tombol toggle: `Pegas Tradisional` vs `MagLev Repulsion`.
  - Pada mode *Pegas Tradisional*, cincin magnet atas dan aura tolak digantikan oleh ilustrasi pegas heliks baja yang terkompresi, dengan indikator gesekan merah berdecit (*42 dB* dan *100% Friksi*).
  - Pada mode *MagLev*, pegas hilang, cincin melayang, aura fluks aktif, suara menjadi *0 dB Hening*, dan friksi berkurang *-68%*.

---

### B. Anatomi Card 2: 20-Magnet Ball-Core Positioning Assembly
- **Metaphor**: Bola inti isometrik (*central spherical ball-core*) dengan kaki sudut (*corner feet stalks*) yang tertarik secara magnetik.
- **Komponen Visual**:
  1. **Central Sphere Core Housing**:
     - Bola inti isometrik dengan shading pencahayaan specular halus.
     - 8 soket magnet silinder neodymium N52 tertanam di sekeliling equator dan kuadran bola.
  2. **Corner Piece Magnetic Stalks (4 Kaki Sudut)**:
     - 4 tangkai sudut berstruktur rusuk penguat mekanis yang mengarah ke pusat bola.
     - Ujung tiap tangkai memiliki magnet silindris dengan polaritas yang berpasangan presisi dengan magnet bola inti.
  3. **Garis Gaya Magnetik (Attraction Vector Rays)**:
     - Garis vektor tarikan magnetik yang menghubungkan magnet ujung kaki dengan magnet bola inti.
- **Interaktivitas**:
  - Pengguna dapat mengklik diagram atau menekan tombol `Uji Snap 45°`.
  - Simulasi bergerak: tangkai kaki miring 45° (*under-turn angle*), medan magnet meregang, lalu tiba-tiba terjadi gaya tarik magnetik (*magnetic snap*) yang menarik tangkai kembali ke posisi 0° (*Locked*).
  - Feedback visual berupa kilatan gelombang magnetik hijau dan status: `0° · LOCKED ✓ (Snap Otomatis Aktif)`.

---

## 3. Integrasi Layout & Standar Kualitas
- **Desain UI**: Menyatu secara proporsional ke dalam grid Bento Section 12 kolom (`md:col-span-7` untuk MagLev dan `md:col-span-5` untuk Ball-Core).
- **Dark Tech Minimalism**: Menggunakan semantic tokens (`--color-surface`, `--color-well`, `--color-border`, `--color-ink`, `--color-vermilion`).
- **Hallmark Standards**:
  - 0 FAIL, 0 WARN pada Sloplint.
  - Bebas `transition: all`, bebas emoji, bebas em-dash.
  - Aksesibilitas: Dukungan penuh keyboard (`focus-visible`), aria labels pada diagram interaktif, dan `prefers-reduced-motion`.

---

## 4. Rencana File yang Diubah
- `src/components/BentoSection.tsx`: Mengganti rendering SVG sederhana pada `MagLevCard` dan `BallCoreCard` dengan komponen anatomi isometrik baru.
