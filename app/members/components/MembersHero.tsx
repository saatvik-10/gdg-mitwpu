"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export function MembersHero() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollWrapperRef.current || !contentInnerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance is applied to the inner wrapper 
      // so it doesn't conflict with ScrollTrigger's recorded state
      gsap.fromTo(
        contentInnerRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // 2. Scroll animation applied to the outer wrapper
      // Pin the hero, move text upward and scale down without fading it out early.
      // Once the pin ends, it will naturally scroll off the screen.
      gsap.to(scrollWrapperRef.current, {
        scale: 0.5,
        y: "-30vh", // Move to the upper portion of the viewport
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", // Scroll distance for transition
          scrub: true,
          pin: true,
          pinSpacing: false, // Admin Panel slides up underneath
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-0">
      {/* Hero Background Image */}
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        <Image
          src="/assets/g2.jpeg"
          alt="Members Hero Background"
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      </div>

      <div ref={scrollWrapperRef} className="flex flex-col items-center px-4 w-full">
        <div ref={contentInnerRef} className="flex flex-col items-center max-w-4xl mx-auto">
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.95] text-[#F3F2EE] select-none origin-center">
            Members
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#F3F2EE] text-center max-w-md">
            The people who make it all happen.
          </p>
        </div>
      </div>
    </section>
  );
}
