"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EventGroup, ACADEMIC_MONTHS } from "../data/events-data";
import { ImagePlaceholder } from "./ImagePlaceholder";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventGroupItemProps {
  event: EventGroup;
  index: number;
  isFirst?: boolean;
}

export function EventGroupItem({ event, index, isFirst }: EventGroupItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  const monthData = ACADEMIC_MONTHS[event.monthIndex] || ACADEMIC_MONTHS[0];
  const yearSuffix = event.id === "embark" ? "2025" : event.monthIndex >= 5 ? "2027" : "2026";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Text & Image Subtle Reveal
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      if (imageWrapperRef.current) {
        revealTl.from(
          imageWrapperRef.current,
          { opacity: 0, scale: 0.98, duration: 0.5, ease: "power2.out" },
          0.05
        );
      }

      // 2. Restrained Parallax on Image (Felt, Not Noticed: y: -10 to +10)
      if (imageInnerRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { y: -10 },
          {
            y: 10,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={containerRef}
      id={event.id}
      data-event-section="true"
      data-month-index={event.monthIndex}
      className="event-slide shrink-0 self-stretch w-[88vw] sm:w-[78vw] md:w-[70vw] lg:w-[65vw] max-w-5xl px-2 sm:px-4 lg:px-6 z-10 select-none"
    >
      {/* Event Moment Stack Composition */}
      <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full">
        {/* Content Section (Top) */}
        <div className="flex flex-col items-center justify-start w-full text-center">
          {/* Subtle Date Cue Annotation */}
          <div className="font-silkscreen text-xs font-semibold text-white/40 tracking-wider leading-none uppercase mb-1.5 sm:mb-2 flex items-center justify-center gap-2">
            <span>{event.date || `${monthData.shortName} ${yearSuffix}`}</span>
          </div>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-[1.15] text-[#F3F2EE] text-center"
          >
            {event.name}
          </h2>

          {/* Statement */}
          <p
            ref={statementRef}
            className="mt-2 sm:mt-3 text-lg sm:text-lg md:text-xl font-medium tracking-tight text-[#F3F2EE]/90 leading-[1.25] text-center"
          >
            {event.statement}
          </p>

          {/* Description */}
          <p
            ref={descRef}
            className="mt-2 sm:mt-3 text-md sm:text-sm md:text-base font-normal text-[#A3A3A3] leading-relax max-w-2xl text-center mx-auto text-balance"
          >
            {event.description}
          </p>

          {event.metadata && event.metadata.length > 0 && (
            <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 flex flex-wrap justify-center gap-x-5 gap-y-1.5 font-mono text-xs text-[#A3A3A3] w-full max-w-xl mx-auto">
              {event.metadata.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-white/40 uppercase text-[9px] sm:text-[11px] font-semibold tracking-wider leading-none">
                    {item.label}:
                  </span>
                  <span className="text-[#F3F2EE] text-[11px] sm:text-xs font-medium tracking-[0.01em] leading-[1.4]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {event.images !== undefined && (
          <div className="w-full mt-auto flex justify-center">
            <div ref={imageWrapperRef} className="relative w-full">
              <ImagePlaceholder
                ref={imageInnerRef}
                title={event.name}
                aspectRatio={event.aspectRatio}
                accentHex={event.accentHex}
                images={event.images}
                className="w-full max-w-[calc(35vh*16/9)] md:max-w-[calc(40vh*16/9)] lg:max-w-[calc(45vh*16/9)] mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
