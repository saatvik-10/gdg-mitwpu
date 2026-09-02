"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !sectionRef.current || !headingRef.current) return;

      const headingSplit = new SplitText(headingRef.current, {
        type: "words,lines",
        linesClass: "overflow-hidden",
        wordsClass: "inline-block will-change-transform",
      });

      const subHeadingSplit = new SplitText(subHeadingRef.current, {
        type: "words,lines",
        linesClass: "overflow-hidden",
        wordsClass: "inline-block will-change-transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      if (tagRef.current) {
        tl.fromTo(
          tagRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }

      tl.fromTo(
        headingSplit.words,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.025,
          ease: "power3.out",
        },
        "-=0.3"
      ).fromTo(
        subHeadingSplit.words,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.015,
          ease: "power3.out",
        },
        "-=0.5"
      );

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      }

      return () => {
        headingSplit.revert();
        subHeadingSplit.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#090909] py-28 sm:py-36 md:py-48 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
        <div className="flex flex-col gap-4 items-center">
          <span
            ref={tagRef}
            className="text-sm uppercase font-silkscreen tracking-normal text-foreground/80 font-semibold will-change-transform"
          >
            Connect · Learn · Grow
          </span>
          <h2
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#F3F2EE] leading-[1.08]"
          >
            Be Part of Our Journey
          </h2>
          <p
            ref={subHeadingRef}
            className="text-base sm:text-lg md:text-xl text-[#A3A3A3] max-w-lg"
          >
            Explore our members, join upcoming workshops, or contribute to campus
            initiatives.
          </p>
        </div>

        {/* Direct Actions with Line-Level Hover Ticker */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4"
        >
          {/* Primary Action */}
          <Link
            href="/members"
            className="group relative px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium tracking-tight hover:opacity-95 active:scale-95 transition-all duration-500 cursor-pointer shadow-lg shadow-white/5 overflow-hidden inline-flex items-center justify-center"
          >
            <span className="relative inline-block overflow-hidden h-[1.25em] leading-tight">
              <span className="block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                meet the team
              </span>
              <span className="block absolute top-full left-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                meet the team
              </span>
            </span>
          </Link>

          {/* Secondary Action */}
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-sm font-mono tracking-wider text-foreground/60 hover:text-foreground transition-colors py-2 cursor-pointer"
          >
            <span className="relative inline-block overflow-hidden h-[1.25em] leading-tight">
              <span className="block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                browse events
              </span>
              <span className="block absolute top-full left-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                browse events
              </span>
            </span>
            <span className="relative inline-block overflow-hidden h-[1.25em] w-[1em] leading-tight text-center">
              <span className="block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                →
              </span>
              <span className="block absolute top-full left-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
