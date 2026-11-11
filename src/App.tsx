import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { BentoSection } from "./components/BentoSection";
import { CatalogSection } from "./components/CatalogSection";
import { TimerSection } from "./components/TimerSection";
import { ReviewsFaqSection } from "./components/ReviewsFaqSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased selection:bg-ink selection:text-canvas">
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
