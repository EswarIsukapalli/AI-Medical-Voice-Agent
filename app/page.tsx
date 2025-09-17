"use client";
import HeroSectionOne from "@/components/hero-section-demo-1";
import { FeatureBentoGrid } from "@/app/_components/FeatureBentoGrid";

export default function Home() {
  return (
    <div>
      <HeroSectionOne />
      <div className="py-20">
        <FeatureBentoGrid />
      </div>
    </div>
  );
}
