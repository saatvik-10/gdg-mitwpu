"use client";

import React from "react";
import { MembersHero } from "./MembersHero";
import { MembersScrollSection } from "./MembersScrollSection";

export function MembersPageClient() {
  return (
    <>
      {/* Hero */}
      <MembersHero />

      {/* Scroll-Driven Horizontal Member Presentation */}
      <MembersScrollSection />
    </>
  );
}
