"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function AboutOrigins() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

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

      const paragraphs = narrativeRef.current?.querySelectorAll("p") || [];
      const paragraphSplits: InstanceType<typeof SplitText>[] = [];
      const paragraphWords: HTMLElement[] = [];

      paragraphs.forEach((p) => {
        const split = new SplitText(p, {
          type: "words,lines",
          linesClass: "overflow-hidden",
          wordsClass: "inline-block will-change-transform",
        });
        paragraphSplits.push(split);
        paragraphWords.push(...(split.words as HTMLElement[]));
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
        paragraphWords,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.012,
          ease: "power3.out",
        },
        "-=0.5"
      );

      return () => {
        headingSplit.revert();
        paragraphSplits.forEach((s) => s.revert());
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#090909] py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left Column: Bold Statement */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span
            ref={tagRef}
            className="text-sm uppercase tracking-widest text-[#4285F4] font-semibold font-silkscreen will-change-transform"
          >
            Origin and Mission
          </span>
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#F3F2EE] leading-[1.15]"
          >
            Bridging the gap between university theory and production reality.
          </h2>
        </div>

        {/* Right Column: Editorial Narrative */}
        <div
          ref={narrativeRef}
          className="lg:col-span-7 flex flex-col gap-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed"
        >
          <p>
            Google Developer Groups on Campus at MIT World Peace University, Pune,
            was founded with a clear premise: building real-world products requires
            more than isolated coding skills.
          </p>
          <p>
            From our beginnings as Developer Student Clubs (DSC) to GDSC and today&apos;s
            GDG on Campus, we have operated as an open collective uniting software
            engineers, UI/UX designers, filmmakers, partnership leads, and community
            managers.
          </p>
          <p className="text-[#F3F2EE] font-medium">
            We don&apos;t just host events — we design, build, produce, and launch
            technology experiences for our campus.
          </p>
        </div>
      </div>
    </section>
  );
}
