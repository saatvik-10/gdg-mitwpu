"use client";

import React, { useEffect, useState } from "react";

const GOOGLE_PALETTE = ["#4285F4", "#EA4335", "#D49D00", "#34A853", "#4285F4"];

interface MonthGridProps {
  progressPercent: number; // 0 to 100
  isActive?: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const f = Math.max(0, Math.min(1, factor));
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = c1[0] + f * (c2[0] - c1[0]);
  const g = c1[1] + f * (c2[1] - c1[1]);
  const b = c1[2] + f * (c2[2] - c1[2]);
  return rgbToHex(r, g, b);
}

function getCarouselColor(progress: number): string {
  const p = Math.max(0, Math.min(1, progress));
  const scaled = p * (GOOGLE_PALETTE.length - 1);
  const idx = Math.min(GOOGLE_PALETTE.length - 2, Math.floor(scaled));
  const factor = scaled - idx;
  return interpolateColor(GOOGLE_PALETTE[idx], GOOGLE_PALETTE[idx + 1], factor);
}

// Serpentine Path Grid Coordinates (Col, Row)
const DESKTOP_PATH: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
  [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
  [5, 3], [4, 3], [3, 3], [2, 3], [1, 3], [0, 3],
];

const MOBILE_PATH: [number, number][] = [
  [0, 0], [1, 0], [2, 0],
  [2, 1], [1, 1], [0, 1],
  [0, 2], [1, 2], [2, 2],
  [2, 3], [1, 3], [0, 3],
  [0, 4], [1, 4], [2, 4],
  [2, 5], [1, 5], [0, 5],
];

// Balanced, authentic Google & Developer Ecosystem Calendar Stickers (~35-50% grid size)
const DESKTOP_ARTIFACTS: Record<number, React.ReactNode> = {
  // 1. Firebase Flame Die-Cut Sticker (Cell 2 - Left)
  2: (
    <div className="relative w-20 h-16 sm:w-24 sm:h-20 bg-black/70 rounded-md p-1.5 rotate-[-4deg] border-2 border-white/20 flex flex-col items-center justify-between shadow-xs">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-2 bg-white/30 rotate-[-6deg] rounded-xs" />
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9">
        <path fill="#FFA000" d="M3.8 17.7L1.2 5.1c-.2-.8.8-1.4 1.4-.8l7.6 7.6-1.4-1.4L3.8 17.7z" />
        <path fill="#F57C00" d="M14.6 2.3c-.6-.7-1.7-.5-2 .3L9.5 8.7l5.1-6.4z" />
        <path fill="#FFCA28" d="M20.2 17.7l-4.5-12c-.3-.8-1.4-.8-1.7 0L1.2 17.7c-.4.7.2 1.5 1 1.5h17c.8 0 1.4-.8 1-1.5z" />
      </svg>
      <span className="font-mono text-[8px] font-bold text-[#FFCA28] tracking-widest uppercase">
        FIREBASE
      </span>
    </div>
  ),

  // 2. Angular & Antigravity Developer Badge (Cell 4 - Right Side)
  4: (
    <div className="relative w-22 h-14 sm:w-24 sm:h-16 bg-white/10 rounded-sm p-1.5 rotate-[3deg] border border-white/20 flex items-center justify-between gap-2">
      <div className="absolute -top-1.5 left-2 w-6 h-1.5 bg-white/30 rotate-[-8deg] rounded-xs" />
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <path fill="#DD0031" d="M12 2L2.5 5.3l1.4 12.3L12 22l8.1-4.4 1.4-12.3L12 2z" />
        <path fill="#C3002F" d="M12 2v17.4l6.8-3.7 1.2-10.4L12 2z" />
        <path fill="#FFFFFF" d="M12 5.2L6.8 16.8h2.1l1-2.6h4.2l1 2.6h2.1L12 5.2zm1.4 7.3h-2.8L12 8.7l1.4 3.8z" />
      </svg>
      <div className="flex flex-col font-mono text-[8px] text-white/80 leading-tight">
        <span className="font-bold text-[#DD0031]">ANGULAR</span>
        <span className="text-white/40">DEV TRACK</span>
      </div>
    </div>
  ),

  // 3. Google Cloud Platform (GCP) Paper Badge (Cell 7 - Left)
  7: (
    <div className="relative w-22 h-14 sm:w-26 sm:h-16 bg-white/10 rounded-sm p-1.5 rotate-[3deg] border border-white/20 flex items-center justify-between gap-2">
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
        <path fill="#4285F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
      <div className="flex flex-col font-mono text-[8px] text-white/80 leading-tight">
        <span className="font-bold text-[#4285F4]">GOOGLE CLOUD</span>
        <span className="text-white/40">CLOUD SPRINT</span>
      </div>
    </div>
  ),

  // 4. College Mid-Sem Exam / Workshop Reminder Note (Cell 10 - Right Side)
  10: (
    <div className="relative w-22 h-14 sm:w-26 sm:h-16 bg-white/10 rounded-sm p-1.5 rotate-[-2deg] border border-dashed border-white/30 flex flex-col justify-between">
      <div className="flex justify-between items-center font-mono text-[8px] text-white/70 border-b border-dashed border-white/20 pb-1">
        <span className="font-bold tracking-wider text-[#D49D00]">MID-SEM EXAMS</span>
        <span>OCT &apos;26</span>
      </div>
      <div className="font-mono text-[7px] text-white/50 leading-tight">
        ● MIT-WPU ACADEMIC CALENDAR
      </div>
    </div>
  ),

  // 5. Android & Gemini Ecosystem Sticker (Cell 14 - Center)
  14: (
    <div className="relative w-20 h-16 sm:w-24 sm:h-18 bg-black/70 rounded-md p-1.5 rotate-[-3deg] border-2 border-[#3DDC84]/40 flex items-center justify-around">
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8">
        <path fill="#3DDC84" d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h4v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V9H6v9zm-1.5-9C3.67 9 3 9.67 3 10.5v5c0 .83.67 1.5 1.5 1.5S6 16.33 6 15.5v-5C6 9.67 5.33 9 4.5 9zm15 0c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5zM15.5 4.5l1.3-1.3c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0l-1.4 1.4C13.7 3.3 12.9 3 12 3s-1.7.3-2.7.9L7.9 2.5c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7l1.3 1.3C7.2 5.5 6 7.1 6 9h12c0-1.9-1.2-3.5-2.5-4.5zM9 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6">
        <path fill="#4285F4" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
      </svg>
    </div>
  ),

  // 6. GDG MIT-WPU Hackathon Event Ticket (Cell 17 - Far Right Side)
  17: (
    <div className="relative w-22 h-14 sm:w-26 sm:h-16 bg-white/10 rounded-sm p-1.5 rotate-[4deg] border border-dashed border-white/30 flex flex-col justify-between">
      <div className="flex justify-between items-center font-mono text-[8px] text-white/80 border-b border-dashed border-white/20 pb-1">
        <span className="font-bold tracking-wider text-[#34A853]">HACKATHON</span>
        <span>FEB &apos;27</span>
      </div>
      <div className="font-mono text-[7px] text-white/50">GDG MIT-WPU</div>
    </div>
  ),

  // 7. Kubernetes / Cloud Architecture Badge (Cell 21 - Center Right)
  21: (
    <div className="relative w-22 h-14 sm:w-24 sm:h-16 bg-white/10 rounded-sm p-1.5 rotate-[3deg] border border-white/20 flex items-center gap-2">
      <div className="absolute -top-1.5 right-2 w-6 h-1.5 bg-white/30 rotate-[10deg] rounded-xs" />
      <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
        <path fill="#326CE5" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l7 3.5v7l-7 3.5-7-3.5v-7l7-3.5z" />
      </svg>
      <div className="flex flex-col font-mono text-[8px] text-white/80 leading-tight">
        <span className="font-bold text-[#326CE5]">KUBERNETES</span>
        <span className="text-white/40">DEVOLUTION</span>
      </div>
    </div>
  ),
};

const MOBILE_ARTIFACTS: Record<number, React.ReactNode> = {
  // Cell 1: Firebase
  1: (
    <div className="relative w-18 h-14 bg-black/70 rounded-md p-1 rotate-[-3deg] border border-white/20 flex flex-col items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#FFA000" d="M3.8 17.7L1.2 5.1c-.2-.8.8-1.4 1.4-.8l7.6 7.6-1.4-1.4L3.8 17.7z" />
        <path fill="#F57C00" d="M14.6 2.3c-.6-.7-1.7-.5-2 .3L9.5 8.7l5.1-6.4z" />
        <path fill="#FFCA28" d="M20.2 17.7l-4.5-12c-.3-.8-1.4-.8-1.7 0L1.2 17.7c-.4.7.2 1.5 1 1.5h17c.8 0 1.4-.8 1-1.5z" />
      </svg>
      <span className="font-mono text-[7px] font-bold text-[#FFCA28]">FIREBASE</span>
    </div>
  ),

  // Cell 7: Google Cloud Badge
  7: (
    <div className="relative w-20 h-12 bg-white/10 rounded-sm p-1 rotate-[3deg] border border-white/20 flex items-center justify-between gap-1">
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
        <path fill="#4285F4" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
      <span className="font-mono text-[7px] font-bold text-[#4285F4]">GCP CLOUD</span>
    </div>
  ),

  // Cell 11: Mid-Sem Exam Reminder
  11: (
    <div className="relative w-20 h-12 bg-white/10 rounded-sm p-1 rotate-[-2deg] border border-dashed border-white/30 flex flex-col justify-between">
      <span className="font-mono text-[7px] font-bold text-[#D49D00]">MID-SEM EXAMS</span>
      <span className="font-mono text-[6px] text-white/50">OCT 2026</span>
    </div>
  ),

  // Cell 13: Android & Gemini
  13: (
    <div className="relative w-20 h-12 bg-black/70 rounded-md p-1 rotate-[-2deg] border border-[#3DDC84]/30 flex items-center justify-around">
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#3DDC84" d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h4v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V9H6v9zm-1.5-9C3.67 9 3 9.67 3 10.5v5c0 .83.67 1.5 1.5 1.5S6 16.33 6 15.5v-5C6 9.67 5.33 9 4.5 9zm15 0c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5zM15.5 4.5l1.3-1.3c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0l-1.4 1.4C13.7 3.3 12.9 3 12 3s-1.7.3-2.7.9L7.9 2.5c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7l1.3 1.3C7.2 5.5 6 7.1 6 9h12c0-1.9-1.2-3.5-2.5-4.5zM9 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
      </svg>
    </div>
  ),
};

export function MonthGrid({ progressPercent, isActive = false }: MonthGridProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const numCols = isMobile ? 3 : 6;
  const numRows = isMobile ? 6 : 4;
  const path = isMobile ? MOBILE_PATH : DESKTOP_PATH;
  const artifacts = isMobile ? MOBILE_ARTIFACTS : DESKTOP_ARTIFACTS;

  // Normalize scroll progress 0 to 1
  const normProgress = Math.max(0, Math.min(1, progressPercent / 100));

  // Single overall carousel progress controls color evolution (0% -> 100%)
  const activeColor = getCarouselColor(normProgress);

  // Map progress to path position: hold at 0 while viewing the first event so the blue grid boxes stay solidly illuminated
  let gridProgress = normProgress;
  if (normProgress < 0.14) {
    gridProgress = 0;
  } else {
    gridProgress = (normProgress - 0.14) / 0.86;
  }

  // Continuous floating index along path
  const currentPathIdx = gridProgress * (path.length - 1);
  const activeStep = Math.floor(currentPathIdx);
  const subStep = currentPathIdx - activeStep;

  const currentSquare = path[activeStep];
  const nextSquare = path[Math.min(path.length - 1, activeStep + 1)];

  // Active center 2D coordinates (col, row)
  const activeCol = currentSquare[0] + subStep * (nextSquare[0] - currentSquare[0]);
  const activeRow = currentSquare[1] + subStep * (nextSquare[1] - currentSquare[1]);

  // Compute 2D spatial distance per cell to create a balanced square footprint centered on active square
  const cellStates = Array.from({ length: numCols * numRows }).map((_, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);

    const dx = col - activeCol;
    const dy = row - activeRow;
    const dist2D = Math.sqrt(dx * dx + dy * dy);

    let fluidIntensity = 0;
    if (dist2D < 1.85) {
      fluidIntensity = Math.max(0, 1 - dist2D / 1.85);
    }

    // Grid border opacity: 0.025 baseline, up to 0.065 near active square center when active
    const gridBorderOpacity = isActive ? 0.025 + fluidIntensity * 0.04 : 0.025;

    return {
      fluidIntensity,
      gridBorderOpacity,
    };
  });

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none select-none overflow-hidden bg-[#090909]">
      {/* 1. Soft Color Layer (2D spatial square footprint diffusion, blurred ONLY on color, underneath grid lines) */}
      <div
        className="absolute inset-0 z-0 grid grid-cols-3 md:grid-cols-6 grid-rows-6 md:grid-rows-4 gap-0 pointer-events-none transition-all duration-300"
        style={{ filter: "blur(18px)" }}
      >
        {isActive && cellStates.map((cell, i) => (
          <div key={`color-${i}`} className="w-full h-full aspect-square relative">
            {cell.fluidIntensity > 0 && (
              <div
                className="absolute inset-0 transition-opacity duration-300 ease-out"
                style={{
                  backgroundColor: activeColor,
                  opacity: cell.fluidIntensity * 0.36,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 2. Crisp Architectural Grid Lines Layer & Embedded Authentic Google Ecosystem Tech Sticker Layer */}
      <div className="relative z-10 w-full h-full grid grid-cols-3 md:grid-cols-6 grid-rows-6 md:grid-rows-4 gap-0 border-t border-l border-white/[0.025]">
        {cellStates.map((cell, i) => {
          const artifact = artifacts[i];
          const hasArtifact = Boolean(artifact);

          // CRITICAL: 0 opacity when inactive (100% invisible!). Smoothly reveals up to ~0.55 as active scroll color passes through.
          const artifactOpacity = isActive && hasArtifact && cell.fluidIntensity > 0
            ? Math.min(0.55, cell.fluidIntensity * 0.65)
            : 0;

          return (
            <div
              key={`grid-${i}`}
              className="w-full h-full aspect-square border-r border-b rounded-none bg-transparent transition-colors duration-300 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden"
              style={{
                borderColor: `rgba(255, 255, 255, ${cell.gridBorderOpacity.toFixed(3)})`,
              }}
            >
              {/* Digital Calendar Memory Artifact (100% INVISIBLE when inactive, smoothly reveals when active color arrives) */}
              {hasArtifact && (
                <div
                  className="transition-opacity duration-300 ease-out pointer-events-none select-none"
                  style={{
                    opacity: artifactOpacity,
                  }}
                >
                  {artifact}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
