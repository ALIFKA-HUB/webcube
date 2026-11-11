import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { BentoSection } from "./components/BentoSection";
import { CatalogSection } from "./components/CatalogSection";
import { TimerSection } from "./components/TimerSection";
import { ReviewsFaqSection } from "./components/ReviewsFaqSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <BentoSection />
        <CatalogSection />
        <TimerSection />
        <ReviewsFaqSection />
      </main>
      <Footer />
    </div>
  );
}
