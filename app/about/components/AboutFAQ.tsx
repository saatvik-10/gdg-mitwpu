"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-experience",
    question: "Do I need prior coding experience to join?",
    answer:
      "No. GDG MIT-WPU operates across 6 collaborative departments: Technical, Design, Media, PR & Sponsorships, Management, and Marketing. Whether you design in Figma, edit video, organize operations, or code, there is an active place for you.",
  },
  {
    id: "faq-recruitment",
    question: "When are Core Team recruitments held?",
    answer:
      "Official Core Team recruitments take place annually at the beginning of the academic year. Details and application links are announced on our official Instagram, LinkedIn, and community channels.",
  },
  {
    id: "faq-eligibility",
    question: "Can first-year students and non-CS branches join?",
    answer:
      "Yes. Students from all academic years and all branches across MIT World Peace University are eligible to apply and attend all public events.",
  },
  {
    id: "faq-fees",
    question: "Are workshops and events free to attend?",
    answer:
      "Yes. All regular technical workshops, study jams, speaker webinars, and peer learning sessions organized by GDG MIT-WPU are free and open to students.",
  },
  {
    id: "faq-google",
    question: "How is the chapter connected to Google?",
    answer:
      "Google Developer Groups on Campus is a global student developer program supported by Google. Our chapter receives direct guidance, resources, cloud credits, and mentorship from Google Developer Relations teams.",
  },
];

export function AboutFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const answerContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const answerTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const chevronRefs = useRef<(SVGSVGElement | null)[]>([]);
  const answerSplitsRef = useRef<(InstanceType<typeof SplitText> | null)[]>([]);
  const faqTimelinesRef = useRef<(gsap.core.Timeline | null)[]>([]);

  const isFirstRender = useRef(true);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Initial Section Entrance and SplitText setup
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !sectionRef.current || !headingRef.current) return;

      const headingSplit = new SplitText(headingRef.current, {
        type: "chars,words",
        wordsClass: "inline-block pr-[2px]",
        charsClass: "inline-block will-change-transform",
      });
      gsap.set(headingSplit.words, {
        overflow: "hidden",
        paddingBottom: "0.08em",
        marginBottom: "-0.08em",
        verticalAlign: "top",
      });

      // Split each FAQ answer
      answerSplitsRef.current = [];
      FAQS.forEach((_, idx) => {
        const textEl = answerTextRefs.current[idx];
        if (textEl) {
          const split = new SplitText(textEl, {
            type: "words,lines",
            linesClass: "overflow-hidden",
            wordsClass: "inline-block will-change-transform",
          });
          answerSplitsRef.current[idx] = split;
          gsap.set(split.lines, {
            overflow: "hidden",
            paddingBottom: "0.08em",
            marginBottom: "-0.08em",
          });
        }
      });

      // Set initial open/closed rest state
      FAQS.forEach((_, idx) => {
        const isOpen = idx === 0;
        const container = answerContainerRefs.current[idx];
        const chevron = chevronRefs.current[idx];
        const split = answerSplitsRef.current[idx];

        if (container) {
          gsap.set(container, {
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
            overflow: "hidden",
          });
        }
        if (chevron) {
          gsap.set(chevron, { rotate: isOpen ? 180 : 0 });
        }
        if (split?.words) {
          gsap.set(split.words, {
            yPercent: isOpen ? 0 : 108,
            opacity: isOpen ? 1 : 0,
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
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
        headingSplit.chars,
        { yPercent: 108 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
        },
        "-=0.3"
      );

      if (accordionRef.current) {
        tl.fromTo(
          accordionRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      return () => {
        headingSplit.revert();
        answerSplitsRef.current.forEach((s) => s?.revert());
        faqTimelinesRef.current.forEach((t) => t?.kill());
      };
    },
    { scope: sectionRef }
  );

  // Smooth accordion expand and collapse animations
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    FAQS.forEach((_, idx) => {
      const isOpen = openIndex === idx;
      const container = answerContainerRefs.current[idx];
      const chevron = chevronRefs.current[idx];
      const split = answerSplitsRef.current[idx];

      if (!container) return;

      // Kill previous timeline
      if (faqTimelinesRef.current[idx]) {
        faqTimelinesRef.current[idx]?.kill();
        faqTimelinesRef.current[idx] = null;
      }
      gsap.killTweensOf(container);
      if (chevron) gsap.killTweensOf(chevron);
      if (split?.words) gsap.killTweensOf(split.words);

      const tl = gsap.timeline();
      faqTimelinesRef.current[idx] = tl;

      if (isOpen) {
        // Expand height smoothly
        tl.fromTo(
          container,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0
        );

        // Rotate chevron
        if (chevron) {
          tl.to(
            chevron,
            {
              rotate: 180,
              duration: 0.4,
              ease: "power3.out",
            },
            0
          );
        }

        // Reveal split words cascade
        if (split?.words) {
          tl.fromTo(
            split.words,
            { yPercent: 108, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.005,
              ease: "power4.out",
            },
            0.06
          );
        }
      } else {
        // Animate words out first
        if (split?.words) {
          tl.to(
            split.words,
            {
              yPercent: 108,
              opacity: 0,
              duration: 0.2,
              stagger: 0.003,
              ease: "power2.in",
            },
            0
          );
        }

        // Collapse height smoothly
        tl.to(
          container,
          {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power3.inOut",
          },
          0.05
        );

        // Rotate chevron back
        if (chevron) {
          tl.to(
            chevron,
            {
              rotate: 0,
              duration: 0.4,
              ease: "power3.out",
            },
            0
          );
        }
      }
    });
  }, [openIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-[#090909] py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-12 md:gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center">
          <span
            ref={tagRef}
            className="text-xs uppercase font-silkscreen tracking-widest text-[#EA4335] font-semibold will-change-transform"
          >
            Questions
          </span>
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#F3F2EE] leading-[1.15]"
          >
            Frequently Asked
          </h2>
        </div>

        {/* Clean Accordion */}
        <div
          ref={accordionRef}
          className="flex flex-col divide-y divide-white/[0.08]"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id} className="py-6 sm:py-8">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={faq.id}
                  className="w-full flex items-center justify-between text-left cursor-pointer gap-4 min-h-[48px] py-2 rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4285F4] group select-none"
                >
                  <span className="text-lg sm:text-xl font-semibold text-[#F3F2EE] tracking-tight group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    ref={(el) => {
                      chevronRefs.current[index] = el;
                    }}
                    className="size-5 text-[#A3A3A3] group-hover:text-white shrink-0"
                  />
                </button>

                {/* Animated Accordion Content Container */}
                <div
                  id={faq.id}
                  ref={(el) => {
                    answerContainerRefs.current[index] = el;
                  }}
                  role="region"
                  aria-labelledby={faq.id}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2">
                    <p
                      ref={(el) => {
                        answerTextRefs.current[index] = el;
                      }}
                      className="text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-3xl font-normal"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
