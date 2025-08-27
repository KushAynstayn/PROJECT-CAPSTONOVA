// src/app/page.tsx

// These would be components you create in your components folder
import HeroSection from "@/components/ui/searchsection";
import FeaturedProjects from "@/components/ui/featured-projects";
import CapstoneTrends from "@/components/ui/capstone-trends";
import AboutSection from "@/components/ui/about-section";

export default function Home() {
  return (
    // The <main> tag is now in layout.tsx, so we just need a container div or fragment
    <div>
      <HeroSection />
      <FeaturedProjects />
      <CapstoneTrends />
      <AboutSection />
    </div>
  );
}