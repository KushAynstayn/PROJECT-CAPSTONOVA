// src/app/page.tsx

// These would be components you create in your components folder
import HeroSection from "@/components/ui/searchsection";
import RealWorldSolutions from "@/components/ui/capstone-projects";
import AnalyticsSpotlight from "@/components/ui/prog-languages";
import FrameworksArea from "@/components/ui/frameworks";
import CapstoneTrends from "@/components/ui/capstonova-universe";
import HowItWorks from "@/components/ui/how-it-works";
import AboutSection from "@/components/ui/about-section";

export default function Home() {
  return (
    // The <main> tag is now in layout.tsx, so we just need a container div or fragment
    <div>
      <HeroSection />
      <RealWorldSolutions />
      <AnalyticsSpotlight />
      <FrameworksArea />
      <CapstoneTrends />
      <HowItWorks />
      <AboutSection />
    </div>
  );
}