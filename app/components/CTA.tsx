"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const WORDS = [
    { text: "connect.", color: "var(--color-blue, #4285F4)" },
    { text: "learn.", color: "var(--color-red, #EA4335)" },
    { text: "grow.", color: "var(--color-green, #34A853)" },
];

export default function CTA() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLSpanElement | null>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const splitsRef = useRef<InstanceType<typeof SplitText>[]>([]);
    const widthsRef = useRef<number[]>([]);

    // Ticker character-level rolling animation with real-time width morphing
    useGSAP(
        () => {
            if (!slotRef.current) return;

            // 1. Create SplitText on each word and measure natural widths
            splitsRef.current = [];
            widthsRef.current = [];

            wordRefs.current.forEach((el, idx) => {
                if (!el) return;

                const measuredWidth = Math.ceil(el.getBoundingClientRect().width) + 6;
                widthsRef.current[idx] = measuredWidth;

                const split = new SplitText(el, {
                    type: "chars",
                    charsClass: "inline-block will-change-transform pr-[1px]",
                });
                splitsRef.current.push(split);

                // Set initial states: first word active, others hidden below
                if (idx === 0) {
                    gsap.set(split.chars, { yPercent: 0, opacity: 1 });
                    gsap.set(el, { opacity: 1 });
                } else {
                    gsap.set(split.chars, { yPercent: 100, opacity: 0 });
                    gsap.set(el, { opacity: 0 });
                }
            });

            // Set initial slot width to the first word's exact width
            if (widthsRef.current[0]) {
                gsap.set(slotRef.current, { width: widthsRef.current[0] });
            }

            let currentIndex = 0;
            const total = WORDS.length;

            const rotateTicker = () => {
                const nextIndex = (currentIndex + 1) % total;
                const currentSplit = splitsRef.current[currentIndex];
                const nextSplit = splitsRef.current[nextIndex];
                const currentEl = wordRefs.current[currentIndex];
                const nextEl = wordRefs.current[nextIndex];
                const targetWidth = widthsRef.current[nextIndex];

                if (!currentSplit || !nextSplit || !currentEl || !nextEl) return;

                const tl = gsap.timeline({
                    onComplete: () => {
                        currentIndex = nextIndex;
                        gsap.delayedCall(2.2, rotateTicker);
                    },
                });

                // 1. Smoothly morph slot width so the question mark glides seamlessly with the word length
                tl.to(
                    slotRef.current,
                    {
                        width: targetWidth,
                        duration: 0.44,
                        ease: "power2.inOut",
                    },
                    0
                );

                // 2. Roll outgoing characters up and out
                tl.to(
                    currentSplit.chars,
                    {
                        yPercent: -100,
                        opacity: 0,
                        duration: 0.42,
                        stagger: 0.024,
                        ease: "power2.inOut",
                        onComplete: () => {
                            gsap.set(currentEl, { opacity: 0 });
                        },
                    },
                    0
                );

                // 3. Make incoming word visible and roll characters up into view
                gsap.set(nextEl, { opacity: 1 });
                gsap.set(nextSplit.chars, { yPercent: 100, opacity: 0 });

                tl.to(
                    nextSplit.chars,
                    {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.42,
                        stagger: 0.024,
                        ease: "power2.inOut",
                    },
                    0.05
                );
            };

            const initialTimer = gsap.delayedCall(2.2, rotateTicker);

            return () => {
                initialTimer.kill();
                splitsRef.current.forEach((s) => s.revert());
            };
        },
        { scope: sectionRef }
    );

    // Scroll entrance animation
    useGSAP(
        () => {
            if (!contentRef.current || !sectionRef.current) return;

            gsap.fromTo(
                contentRef.current,
                {
                    y: 40,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background select-none flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[80vh] py-24 sm:py-36 px-6 md:px-12 font-sans overflow-hidden"
        >
            <div
                ref={contentRef}
                className="w-full max-w-5xl flex flex-col items-center justify-center text-center gap-8 sm:gap-10 will-change-transform"
            >
                {/* Dynamic Kinetic Ticker Headline with Perfect Baseline Alignment and Static Brackets */}
                <div className="flex items-center justify-center max-w-full relative">
                    {/* Left bracket (<) */}
                    <div className="relative z-10 shrink-0 flex items-center justify-center h-12 xs:h-14 sm:h-20 md:h-28 lg:h-36 aspect-[294/346]">
                        <Image
                            src="/assets/gdg-logo-left.png"
                            alt=""
                            aria-hidden="true"
                            fill
                            priority
                            className="object-contain select-none pointer-events-none drop-shadow-sm"
                        />
                    </div>

                    <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tighter text-foreground leading-[1.15] select-none text-center pl-1 sm:pl-2 md:pl-3 pr-2 sm:pr-4 md:pr-5">
                        <span>ready to&nbsp;</span>
                        <span
                            ref={slotRef}
                            className="inline-block relative overflow-hidden align-top text-left will-change-[width] pr-1.5"
                            style={{ height: "1.15em" }}
                        >
                            {WORDS.map((word, idx) => (
                                <span
                                    key={word.text}
                                    ref={(el) => {
                                        wordRefs.current[idx] = el;
                                    }}
                                    className="absolute left-0 top-0 whitespace-nowrap will-change-transform font-medium leading-[1.15] pr-1.5"
                                    style={{
                                        color: word.color,
                                        opacity: idx === 0 ? 1 : 0,
                                    }}
                                >
                                    {word.text}
                                </span>
                            ))}
                        </span>
                        <span className="text-foreground">?</span>
                    </h2>

                    {/* Right bracket (>) */}
                    <div className="relative z-10 shrink-0 flex items-center justify-center h-12 xs:h-14 sm:h-20 md:h-28 lg:h-36 aspect-[294/346]">
                        <Image
                            src="/assets/gdg-logo-right.png"
                            alt=""
                            aria-hidden="true"
                            fill
                            priority
                            className="object-contain select-none pointer-events-none drop-shadow-sm"
                        />
                    </div>
                </div>

                {/* Direct Actions with Line-Level Hover Ticker */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
                    {/* Primary Join Action */}
                    <a
                        href="https://recruitment.gdg-mitwpu.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium tracking-tight hover:opacity-95 active:scale-95 transition-all duration-500 cursor-pointer shadow-lg shadow-white/5 overflow-hidden inline-flex items-center justify-center"
                    >
                        <span className="relative inline-block overflow-hidden h-[1.25em] leading-tight">
                            <span className="block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                                join the community
                            </span>
                            <span className="block absolute top-full left-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                                join the community
                            </span>
                        </span>
                    </a>

                    {/* Secondary Members Action */}
                    <Link
                        href="/members"
                        className="group inline-flex items-center gap-2 text-sm font-mono tracking-wider text-foreground/60 hover:text-foreground transition-colors py-2 cursor-pointer"
                    >
                        <span className="relative inline-block overflow-hidden h-[1.25em] leading-tight">
                            <span className="block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                                meet the team
                            </span>
                            <span className="block absolute top-full left-0 w-full will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:-translate-y-full">
                                meet the team
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
