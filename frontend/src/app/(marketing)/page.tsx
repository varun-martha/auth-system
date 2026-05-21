import { AuthCtaBar } from "@/components/layout/AuthCtaBar";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { HeroSection } from "@/components/marketing/HeroSection";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <AuthCtaBar />
      <HeroSection />
      <FeatureGrid />
    </main>
  );
}
