import { Hero } from "@/components/home/Hero";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { FeaturedDevelopments } from "@/components/home/FeaturedDevelopments";
import { CampoGrandeSection } from "@/components/home/CampoGrandeSection";
import { RuralSection } from "@/components/home/RuralSection";
import { CoverageSection } from "@/components/home/CoverageSection";
import { AboutSection } from "@/components/home/AboutSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <DestinationGrid />
      <FeaturedDevelopments />
      <CampoGrandeSection />
      <RuralSection />
      <CoverageSection />
      <AboutSection />
      <EditorialSection />
      <CTASection />
    </>
  );
}
