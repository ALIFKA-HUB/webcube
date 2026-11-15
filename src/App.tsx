import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TelemetryMarquee } from "./components/TelemetryMarquee";
import { BentoSection } from "./components/BentoSection";
import { CatalogSection } from "./components/CatalogSection";
import { TimerSection } from "./components/TimerSection";
import { ReviewsFaqSection } from "./components/ReviewsFaqSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans antialiased selection:bg-accent selection:text-accent-ink">
      <Navbar />
      <main>
        <Hero />
        <TelemetryMarquee />
        <BentoSection />
        <CatalogSection />
        <TimerSection />
        <ReviewsFaqSection />
      </main>
      <Footer />
    </div>
  );
}
