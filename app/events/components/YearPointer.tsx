"use client";

import React from "react";
import { ACADEMIC_MONTHS } from "../data/events-data";

interface YearPointerProps {
  activeMonthIndex: number;
  progressPercent: number; // 0 to 100
  isActive?: boolean;
}

export function YearPointer({
  activeMonthIndex,
  progressPercent,
  isActive = false,
}: YearPointerProps) {
  const currentMonth = ACADEMIC_MONTHS[activeMonthIndex] || ACADEMIC_MONTHS[0];
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));
  const shortMonthName = currentMonth.name.substring(0, 3); // SEP, OCT, etc.

  const visibilityClass = `transition-opacity duration-300 ${
    isActive ? "opacity-100" : "opacity-0 pointer-events-none"
  }`;

  // Use CSS media queries to handle responsiveness instead of JS state to prevent hydration mismatches and layout bugs.
  return (
    <>
      {/* MOBILE: Horizontal 2px Line at Bottom */}
      <aside
        aria-label="Academic Year Progress Indicator - Mobile"
        className={`fixed bottom-3 left-4 right-4 z-30 select-none flex md:hidden items-center gap-2 mix-blend-difference ${visibilityClass}`}
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-mono text-xs font-semibold tracking-wider uppercase leading-none text-[#F3F2EE]">
            {shortMonthName}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#F3F2EE]" />
        </div>

        <div className="relative flex-1 h-[2px] bg-white/25">
          <div
            className="absolute top-0 bottom-0 left-0 bg-white/50 transition-all duration-75 ease-out"
            style={{ width: `${clampedProgress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#F3F2EE] transition-colors duration-150"
            style={{ left: `${clampedProgress}%` }}
          />
        </div>

        <span className="font-mono text-xs font-semibold tracking-wider leading-none text-[#F3F2EE]">
          {Math.round(clampedProgress)}%
        </span>
      </aside>

      {/* DESKTOP & TABLET: Vertical 2px Line on Right Side */}
      <aside
        aria-label="Academic Year Progress Indicator - Desktop"
        className={`fixed right-3 sm:right-5 md:right-6 top-16 sm:top-20 bottom-16 sm:bottom-20 z-30 select-none hidden md:flex flex-col items-end justify-between mix-blend-difference ${visibilityClass}`}
      >
        <div className="relative w-full flex-1 mb-3 flex justify-end">
          <div className="relative h-full w-[2px] bg-white/25">
            <div
              className="absolute top-0 w-[2px] bg-white/50 transition-all duration-75 ease-out"
              style={{ height: `${clampedProgress}%` }}
            />
            <div
              className="absolute right-0 -translate-y-1/2 flex items-center gap-2 pr-0 whitespace-nowrap transition-all duration-75 ease-out"
              style={{ top: `${clampedProgress}%` }}
            >
              <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase leading-none text-[#F3F2EE]">
                {shortMonthName}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F3F2EE] translate-x-[4px]" />
            </div>
          </div>
        </div>

        <div className="font-mono text-xs font-semibold tracking-wider leading-none text-[#F3F2EE]">
          {Math.round(clampedProgress)}%
        </div>
      </aside>
    </>
  );
}

// Export alias for backwards compatibility
export { YearPointer as YearCursor };
