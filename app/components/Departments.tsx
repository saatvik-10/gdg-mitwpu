"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface Department {
  name: string;
  description: string;
  color: string;
  fontClass?: string;
  bgColor: string;
  art?: React.ReactNode;
}

const DEPARTMENTS: Department[] = [
  {
    name: "Technical",
    description:
      "Architects and implements projects, workshops, and hackathons with cutting-edge Google technologies.",
    color: "#9DCCFF",
    fontClass: "font-technical text-5xl md:text-6xl",
    bgColor: "#000A2F",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-6 md:right-6 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/tech.png"
          alt="GDG MIT-WPU Technical department — engineering and workshops"
          width={180}
          height={180}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
        />
      </div>
    ),
  },
  {
    name: "Design",
    description:
      "Crafts design systems, responsive web interfaces, and event visual identities in Figma.",
    color: "#FFD9CC",
    fontClass: "font-design text-4xl md:text-6xl tracking-tight",
    bgColor: "#4E181C",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-5 md:right-5 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/design.png"
          alt="GDG MIT-WPU Design department — design systems and visual identity"
          width={180}
          height={180}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
        />
      </div>
    ),
  },
  {
    name: "Media",
    description:
      "Directs cinematic promotional reels, multi-camera livestreams, and post-event documentaries.",
    color: "#2f022c",
    fontClass: "font-media text-4xl md:text-6xl",
    bgColor: "#6D156F",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-4 right-20 sm:top-5 sm:right-28 md:top-6 md:right-36 w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] select-none"
          src="/assets/departments/media-1.png"
          alt="GDG MIT-WPU Media department — cinematic reels and livestreams"
          width={130}
          height={130}
          sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, (max-width: 1024px) 112px, 128px"
        />
        <Image
          className="absolute top-2 right-2 sm:top-3 sm:right-4 md:top-4 md:right-5 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/media-2.png"
          alt="GDG MIT-WPU Media department — video production and documentaries"
          width={160}
          height={160}
          sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, (max-width: 1024px) 144px, 160px"
        />
      </div>
    ),
  },
  {
    name: "PR & Sponsorships",
    description:
      "Connects students with Google Developer Experts, securing keynote speakers and corporate sponsors.",
    color: "#ACC97C",
    fontClass: "font-pr text-3xl md:text-5xl",
    bgColor: "#265112",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-0 right-2 sm:top-0 sm:right-4 md:top-0 md:right-5 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/pr.png"
          alt="GDG MIT-WPU PR and Sponsorships department — partnerships and outreach"
          width={180}
          height={180}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
        />
      </div>
    ),
  },
  {
    name: "Management",
    description:
      "Coordinates auditorium scheduling, budget administration, attendee flow, and on-ground execution.",
    color: "#4285F4",
    fontClass: "font-management text-4xl md:text-6xl",
    bgColor: "#214A6C",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-2 -right-1 sm:top-4 sm:-right-2 md:top-4 md:-right-2 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/management.png"
          alt="GDG MIT-WPU Management department — operations and event coordination"
          width={180}
          height={180}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
        />
      </div>
    ),
  },
  {
    name: "Marketing",
    description:
      "Drives campus-wide promotions, social media campaigns, and community engagement.",
    color: "#AF7D00",
    fontClass: "font-marketing text-4xl md:text-6xl",
    bgColor: "#FFFF7D",
    art: (
      <div className="absolute inset-0 flex pointer-events-none overflow-hidden">
        <Image
          className="absolute top-2 -right-1 sm:top-4 sm:-right-2 md:top-4 md:-right-4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none"
          src="/assets/departments/marketing.png"
          alt="GDG MIT-WPU Marketing department — campaigns and community engagement"
          width={180}
          height={180}
          sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
        />
      </div>
    ),
  },
];

export default function Departments() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const collapsedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const artRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const floatTweensRef = useRef<(gsap.core.Tween | null)[]>([]);

  const titleSplitsRef = useRef<(InstanceType<typeof SplitText> | null)[]>([]);
  const descSplitsRef = useRef<(InstanceType<typeof SplitText> | null)[]>([]);
  const cardTimelinesRef = useRef<(gsap.core.Timeline | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(0);

  // Hover takes immediate precedence; fallback to clickedIndex or default to 0 (Technical)
  const activeIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : clickedIndex !== null
      ? clickedIndex
      : 0;

  const isFirstRender = useRef(true);

  const startFloatingAnimation = (idx: number, el: HTMLDivElement | null) => {
    if (!el) return;
    if (floatTweensRef.current[idx]) {
      floatTweensRef.current[idx]?.kill();
      floatTweensRef.current[idx] = null;
    }
    floatTweensRef.current[idx] = gsap.to(el, {
      y: "-=6",
      rotation: 1.5,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  };

  const stopFloatingAnimation = (idx: number) => {
    if (floatTweensRef.current[idx]) {
      floatTweensRef.current[idx]?.kill();
      floatTweensRef.current[idx] = null;
    }
  };

  // Initialize SplitText on cards
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !sectionRef.current) return;

      // Split each card's title and description with minimal descender safety padding
      titleSplitsRef.current = [];
      descSplitsRef.current = [];

      DEPARTMENTS.forEach((_, idx) => {
        const titleEl = titleRefs.current[idx];
        const descEl = descRefs.current[idx];

        if (titleEl) {
          const split = new SplitText(titleEl, {
            type: "chars,words",
            wordsClass: "inline-block pr-[2px]",
            charsClass: "inline-block will-change-transform",
          });
          titleSplitsRef.current[idx] = split;
          gsap.set(split.words, {
            overflow: "hidden",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
            verticalAlign: "top",
          });
        }

        if (descEl) {
          const split = new SplitText(descEl, {
            type: "words,lines",
            linesClass: "overflow-hidden",
            wordsClass: "inline-block will-change-transform",
          });
          descSplitsRef.current[idx] = split;
          gsap.set(split.lines, {
            overflow: "hidden",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
          });
        }
      });

      // Set initial rest state for active index 0 vs others
      DEPARTMENTS.forEach((_, idx) => {
        const isExpanded = idx === 0;
        const card = cardRefs.current[idx];
        const collapsedEl = collapsedRefs.current[idx];
        const titleSplit = titleSplitsRef.current[idx];
        const descSplit = descSplitsRef.current[idx];
        const artEl = artRefs.current[idx];

        if (card) gsap.set(card, { flexGrow: isExpanded ? 4 : 1 });
        if (collapsedEl) gsap.set(collapsedEl, { opacity: isExpanded ? 0 : 1, y: isExpanded ? -15 : 0 });
        if (titleSplit?.chars) {
          gsap.set(titleSplit.chars, { yPercent: isExpanded ? 0 : 108 });
        }
        if (descSplit?.words) {
          gsap.set(descSplit.words, { yPercent: isExpanded ? 0 : 108 });
        }
        if (artEl) {
          gsap.set(artEl, {
            opacity: isExpanded ? 1 : 0,
            scale: isExpanded ? 1 : 0.8,
            y: isExpanded ? 0 : 20,
            rotate: isExpanded ? 0 : -3,
          });
          if (isExpanded) {
            startFloatingAnimation(idx, artEl);
          }
        }
      });

      // Parallax slam-in for the cards content (matches EventsSpotlight pattern)
      if (contentRef.current) {
        const isMob = typeof window !== "undefined" && window.innerWidth < 768;
        gsap.fromTo(
          contentRef.current,
          {
            y: isMob ? 100 : 200,
            opacity: 0.4,
          },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      return () => {
        titleSplitsRef.current.forEach((s) => s?.revert());
        descSplitsRef.current.forEach((s) => s?.revert());
        cardTimelinesRef.current.forEach((t) => t?.kill());
        floatTweensRef.current.forEach((t) => t?.kill());
      };
    },
    { scope: sectionRef }
  );

  // GSAP Smooth SplitText Expansion & Compression with dedicated, cancelable timelines
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    DEPARTMENTS.forEach((_, idx) => {
      const card = cardRefs.current[idx];
      const collapsedEl = collapsedRefs.current[idx];
      const titleSplit = titleSplitsRef.current[idx];
      const descSplit = descSplitsRef.current[idx];
      const artEl = artRefs.current[idx];
      const isExpanded = activeIndex === idx;

      if (!card) return;

      // 1. Immediately kill any ongoing timeline and individual tweens for this card
      if (cardTimelinesRef.current[idx]) {
        cardTimelinesRef.current[idx]?.kill();
        cardTimelinesRef.current[idx] = null;
      }
      stopFloatingAnimation(idx);

      gsap.killTweensOf(card);
      if (collapsedEl) gsap.killTweensOf(collapsedEl);
      if (titleSplit?.chars) gsap.killTweensOf(titleSplit.chars);
      if (descSplit?.words) gsap.killTweensOf(descSplit.words);
      if (artEl) gsap.killTweensOf(artEl);

      const tl = gsap.timeline();
      cardTimelinesRef.current[idx] = tl;

      if (isExpanded) {
        // Expand Card smoothly over 0.85s with power3.inOut
        tl.to(
          card,
          {
            flexGrow: 4,
            duration: prefersReducedMotion ? 0.01 : 0.85,
            ease: "power3.inOut",
          },
          0
        );

        // Hide Collapsed vertical label immediately
        if (collapsedEl) {
          tl.to(
            collapsedEl,
            {
              opacity: 0,
              y: prefersReducedMotion ? 0 : -20,
              duration: prefersReducedMotion ? 0.01 : 0.25,
              ease: "power3.out",
            },
            0
          );
        }

        // Animate Art in smoothly with subtle scale, lift, and opacity
        if (artEl) {
          if (prefersReducedMotion) {
            tl.to(artEl, { opacity: 1, duration: 0.1 }, 0);
          } else {
            tl.fromTo(
              artEl,
              { opacity: 0, scale: 0.78, y: 20, rotate: -3 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: 0,
                duration: 0.7,
                ease: "back.out(1.2)",
                onComplete: () => {
                  if (activeIndex === idx) {
                    startFloatingAnimation(idx, artEl);
                  }
                },
              },
              0.1
            );
          }
        }

        // Roll in Title Characters with power4.out
        if (titleSplit?.chars) {
          tl.to(
            titleSplit.chars,
            {
              yPercent: 0,
              duration: prefersReducedMotion ? 0.01 : 0.6,
              stagger: prefersReducedMotion ? 0 : 0.015,
              ease: "power4.out",
            },
            0.1
          );
        }

        // Cascade in Description Words with power4.out
        if (descSplit?.words) {
          tl.to(
            descSplit.words,
            {
              yPercent: 0,
              duration: prefersReducedMotion ? 0.01 : 0.55,
              stagger: prefersReducedMotion ? 0 : 0.008,
              ease: "power4.out",
            },
            0.15
          );
        }
      } else {
        // Compress Card smoothly over 0.85s with power3.inOut
        tl.to(
          card,
          {
            flexGrow: 1,
            duration: prefersReducedMotion ? 0.01 : 0.85,
            ease: "power3.inOut",
          },
          0
        );

        // Animate out Art immediately
        if (artEl) {
          if (prefersReducedMotion) {
            tl.to(artEl, { opacity: 0, duration: 0.1 }, 0);
          } else {
            tl.to(
              artEl,
              {
                opacity: 0,
                scale: 0.8,
                y: 15,
                rotate: 2,
                duration: 0.35,
                ease: "power2.in",
              },
              0
            );
          }
        }

        // Animate out Title Characters immediately with power4.out
        if (titleSplit?.chars) {
          tl.to(
            titleSplit.chars,
            {
              yPercent: 108,
              duration: prefersReducedMotion ? 0.01 : 0.35,
              stagger: prefersReducedMotion ? 0 : 0.008,
              ease: "power4.out",
            },
            0
          );
        }

        // Animate out Description Words immediately with power4.out
        if (descSplit?.words) {
          tl.to(
            descSplit.words,
            {
              yPercent: 108,
              duration: prefersReducedMotion ? 0.01 : 0.32,
              stagger: prefersReducedMotion ? 0 : 0.004,
              ease: "power4.out",
            },
            0
          );
        }

        // Reveal Collapsed vertical label smoothly
        if (collapsedEl) {
          tl.to(
            collapsedEl,
            {
              opacity: 1,
              y: 0,
              duration: prefersReducedMotion ? 0.01 : 0.45,
              ease: "power3.out",
            },
            0.2
          );
        }
      }
    });
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-background select-none flex flex-col items-center font-sans"
    >
      {/* Section Header — sits above the content, not affected by slam-in */}
      <div className="w-full pt-10 sm:pt-14 pb-16 sm:pb-24 flex items-center justify-center text-center z-20">
        <h2
          className="text-md sm:text-3xl font-medium font-silkscreen tracking-tighter select-none text-foreground/90"
        >
          what we do
        </h2>
      </div>

      {/* Content wrapper — slams in from below via parallax */}
      <div
        ref={contentRef}
        className="w-full max-w-6xl mx-auto flex flex-col gap-12 md:gap-16 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32 md:pb-40 will-change-transform"
      >
        {/* Responsive Cards Layout */}
        <div className="w-full">
          <div
            ref={containerRef}
            className="flex flex-col md:flex-row gap-3 sm:gap-4 h-[620px] sm:h-[680px] md:h-[480px] w-full items-stretch select-none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {DEPARTMENTS.map((dept, index) => {
              const isExpanded = activeIndex === index;

              return (
                <div
                  key={dept.name}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() =>
                    setClickedIndex((prev) => (prev === index ? 0 : index))
                  }
                  style={{
                    flexBasis: "0%",
                    flexShrink: 1,
                    backgroundColor:
                      "color-mix(in srgb, " + dept.bgColor + " 80%, #090909 20%)",
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setClickedIndex((prev) => (prev === index ? 0 : index));
                    }
                  }}
                  className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-[background-color] duration-300 outline-none"
                >
                  {/* Collapsed State */}
                  <div
                    ref={(el) => {
                      collapsedRefs.current[index] = el;
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 md:px-0 overflow-hidden will-change-transform"
                  >
                    <span
                      className={`whitespace-nowrap font-medium text-[#A3A3A3] group-hover:text-[#F3F2EE] transition-colors rotate-0 md:-rotate-90 md:origin-center ${
                        dept.fontClass || ""
                      }`}
                      style={{ color: dept.color }}
                    >
                      {dept.name}
                    </span>
                  </div>

                  {/* Department Art Graphic */}
                  <div
                    ref={(el) => {
                      artRefs.current[index] = el;
                    }}
                    className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform"
                    aria-hidden="true"
                  >
                    {dept.art}
                  </div>

                  {/* Expanded State */}
                  <div
                    ref={(el) => {
                      expandedRefs.current[index] = el;
                    }}
                    className={`absolute bottom-0 left-0 p-5 sm:p-8 md:p-10 w-full md:w-[460px] flex flex-col justify-end ${
                      isExpanded
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <h3
                          ref={(el) => {
                            titleRefs.current[index] = el;
                          }}
                          className={`font-medium tracking-tight whitespace-nowrap ${
                            dept.fontClass || ""
                          }`}
                          style={{ color: dept.color }}
                        >
                          {dept.name}
                        </h3>
                      </div>
                      <div>
                        <p
                          ref={(el) => {
                            descRefs.current[index] = el;
                          }}
                          className="text-sm sm:text-base font-medium"
                          style={{
                            color:
                              dept.name === "Media"
                                ? "color-mix(in srgb, " + dept.color + " 40%, #dfdfdf 60%)"
                                : dept.name === "Management"
                                ? "color-mix(in srgb, " + dept.color + " 80%, #090909 20%)"
                                : dept.name === "Marketing"
                                ? "color-mix(in srgb, " + dept.color + " 60%, #090909 40%)"
                                : "color-mix(in srgb, " + dept.color + " 60%, #090909 40%)",
                          }}
                        >
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle "know more" link */}
        <div className="flex items-center justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 text-md sm:text-xl font-medium tracking-normal text-foreground/80 hover:text-foreground dark:hover:text-white transition-colors duration-200"
          >
            <span>know more</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}