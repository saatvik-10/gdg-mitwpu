"use client";

import React from "react";
import { AboutHero } from "./AboutHero";
import { AboutOrigins } from "./AboutOrigins";
import { AboutLifecycle } from "./AboutLifecycle";
import { AboutPrograms } from "./AboutPrograms";
import { AboutFAQ } from "./AboutFAQ";
import { AboutCTA } from "./AboutCTA";
import Footer from "@/app/components/Footer";

export function AboutPageClient() {
  return (
    <>
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Origins & Mission */}
      <AboutOrigins />

      {/* 5. Student FAQ */}
      <AboutFAQ />

      {/* 6. Call to Action */}
      <AboutCTA />

      {/* 7. Footer */}
      <Footer />
    </>
  );
}
