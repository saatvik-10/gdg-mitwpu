"use client";

import React, { useState } from "react";
import { MonthGrid } from "./MonthGrid";
import { YearPointer } from "./YearPointer";
import { EventsHero } from "./EventsHero";
import { EventsCarousel } from "./EventsCarousel";
import { EVENT_GROUPS } from "../data/events-data";

export function EventsContainer() {
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isCarouselActive, setIsCarouselActive] = useState<boolean>(false);

  const handleProgressChange = (percent: number, active: boolean) => {
    setProgressPercent(percent);
    setIsCarouselActive(active);
  };

  return (
    <div className="relative w-full min-h-screen">

      {/* Hero */}
      <EventsHero />

      {/* 3. Horizontal Scroll-Driven Event Carousel */}
      <div className="relative z-10">
        <EventsCarousel
          events={EVENT_GROUPS}
          setActiveMonthIndex={setActiveMonthIndex}
          onProgressChange={handleProgressChange}
        />
      </div>
    </div>
  );
}


