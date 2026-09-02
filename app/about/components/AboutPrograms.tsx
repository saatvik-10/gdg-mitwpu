"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Program {
  title: string;
  category: string;
  accentColor: string;
  description: string;
}

const PROGRAMS: Program[] = [
  {
    title: "Google Solution Challenge",
    category: "Global Competition",
    accentColor: "#4285F4",
    description:
      "Annual global competition where student teams engineer applications addressing the United Nations 17 Sustainable Development Goals using Google technologies.",
  },
  {
    title: "Cloud & AI Study Jams",
    category: "Hands-on Pathways",
    accentColor: "#FBBC04",
    description:
      "Structured certification sprints covering Generative AI, Cloud Architecture, Kubernetes, and Machine Learning with Google Cloud Skill badges.",
  },
  {
    title: "DevFest & Annual Hackathons",
    category: "Flagship Gatherings",
    accentColor: "#EA4335",
    description:
      "Collegiate hackathons and tech symposiums bringing together hundreds of developers, industry jury members, and cash prize pools.",
  },
  {
    title: "Build Sprints & Open Source",
    category: "Engineering Sprints",
    accentColor: "#34A853",
    description:
      "Collaborative development sprints where students ship production chapter software, learn Git workflows, and contribute to open source.",
  },
];

export function AboutPrograms() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        listRef.current?.children || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#090909] py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#FBBC04] font-semibold">
            Annual Initiatives
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F3F2EE] leading-[1.15]">
            Flagship Programs
          </h2>
        </div>

        {/* Clean Typographic Program Index */}
        <div ref={listRef} className="flex flex-col divide-y divide-white/[0.08]">
          {PROGRAMS.map((program) => (
            <div
              key={program.title}
              className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline group"
            >
              {/* Title */}
              <div className="md:col-span-4 flex items-center gap-3">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: program.accentColor }}
                />
                <h3 className="text-xl sm:text-2xl font-bold text-[#F3F2EE] tracking-tight group-hover:text-white transition-colors">
                  {program.title}
                </h3>
              </div>

              {/* Category */}
              <div className="md:col-span-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#A3A3A3]">
                  {program.category}
                </span>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm sm:text-base text-[#737373] leading-relaxed group-hover:text-[#A3A3A3] transition-colors">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
