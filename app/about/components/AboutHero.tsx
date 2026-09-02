"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function AboutHero() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !headingRef.current || !subHeadingRef.current) return;

      const headingSplit = new SplitText(headingRef.current, {
        type: "chars,words",
        mask: "words",
        wordsClass: "inline-block pr-[3px]",
        charsClass: "inline-block will-change-transform",
      });

      const subHeadingSplit = new SplitText(subHeadingRef.current, {
        type: "words,lines",
        linesClass: "overflow-hidden",
        wordsClass: "inline-block will-change-transform",
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        headingSplit.chars,
        { yPercent: 115, rotateX: -20 },
        {
          yPercent: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.035,
          ease: "power4.out",
        }
      ).fromTo(
        subHeadingSplit.words,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.018,
          ease: "power3.out",
        },
        "-=0.55"
      );

      gsap.to(scrollWrapperRef.current, {
        scale: 0.6,
        y: "-25vh",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
          pinSpacing: false,
        },
      });

      return () => {
        headingSplit.revert();
        subHeadingSplit.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-0"
    >
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        <Image
          src="/assets/about.jpg"
          alt="GDG Community Background"
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      </div>

      <div
        ref={scrollWrapperRef}
        className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <div
          ref={contentInnerRef}
          className="flex flex-col items-center justify-center text-center"
        >
          <h1
            ref={headingRef}
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.95] text-[#F3F2EE] select-none origin-center"
          >
            About Us
          </h1>

          <p
            ref={subHeadingRef}
            className="mt-6 sm:mt-8 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-muted leading-normal"
          >
            A multidisciplinary student collective at MIT-WPU, Pune. Bridging
            engineering, design, media, and leadership with Google technologies.
          </p>
        </div>
      </div>
    </section>
  );
}
