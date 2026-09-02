"use client";

import React from "react";
import { AcademicMonth } from "../data/events-data";

interface AcademicMonthSectionProps {
  month: AcademicMonth;
}

export function AcademicMonthSection({ month }: AcademicMonthSectionProps) {
  return (
    <div
      data-month-index={month.index}
      className="relative w-full h-8 sm:h-16 md:h-24 pointer-events-none select-none"
      aria-hidden="true"
    />
  );
}
