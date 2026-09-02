"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PHRASES: string[][] = [
    ["make", "things", "happen."],
    ["build", "what's", "next."],
    ["solve", "real", "problems."],
    ["ship", "great", "ideas."],
];

export default function AboutPara() {
    const containerRef = useRef<HTMLElement | null>(null);
    const desktopStaticRef = useRef<HTMLSpanElement | null>(null);
    const mobileStaticRef = useRef<HTMLSpanElement | null>(null);
    const tickerWrapperRef = useRef<HTMLSpanElement | null>(null);
    const tickerInnerRef = useRef<HTMLSpanElement | null>(null);
    const phraseRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const widthsRef = useRef<number[]>([]);
    const leftBgRef = useRef<HTMLDivElement | null>(null);
    const rightBgRef = useRef<HTMLDivElement | null>(null);

    useGSAP(
        () => {
            if (!containerRef.current || !tickerWrapperRef.current || !tickerInnerRef.current) {
                return;
            }

            const mm = gsap.matchMedia();
            let tickerCycleTimer: gsap.core.Tween | null = null;
            let activeTickerTl: gsap.core.Timeline | null = null;
            let currentPhraseIndex = 0;
            let isTickerRunning = false;

            // 1. Measure natural widths of each phrase
            const measureWidths = () => {
                widthsRef.current = [];
                phraseRefs.current.forEach((el, idx) => {
                    if (!el) return;
                    widthsRef.current[idx] = Math.ceil(el.getBoundingClientRect().width);
                });
                if (widthsRef.current[currentPhraseIndex] && tickerWrapperRef.current) {
                    gsap.set(tickerWrapperRef.current, { width: widthsRef.current[currentPhraseIndex] });
                }
            };

            measureWidths();

            // 2. Word-by-word staggered kinetic ticker roll with smooth container width morph for auto-centering
            const rotateTicker = () => {
                if (!isTickerRunning) return;

                // Kill any active animation to prevent overlapping cycles
                if (activeTickerTl) {
                    activeTickerTl.kill();
                    activeTickerTl = null;
                }

                const total = PHRASES.length;
                const nextIndex = (currentPhraseIndex + 1) % total;
                const currentEl = phraseRefs.current[currentPhraseIndex];
                const nextEl = phraseRefs.current[nextIndex];
                const targetWidth = widthsRef.current[nextIndex];

                if (!currentEl || !nextEl) return;

                const currWords = Array.from(currentEl.querySelectorAll(".phrase-word")) as HTMLElement[];
                const nextWords = Array.from(nextEl.querySelectorAll(".phrase-word")) as HTMLElement[];

                // Kill any pending tweens on individual words
                gsap.killTweensOf(currWords);
                gsap.killTweensOf(nextWords);

                // Explicitly ensure all inactive phrases are hidden and primed below mask
                phraseRefs.current.forEach((el, idx) => {
                    if (!el) return;
                    if (idx !== currentPhraseIndex && idx !== nextIndex) {
                        el.style.visibility = "hidden";
                        const w = el.querySelectorAll(".phrase-word");
                        gsap.set(w, { yPercent: 100 });
                    }
                });

                // Ensure current is visible at 0, and incoming is visible primed at 100
                currentEl.style.visibility = "visible";
                gsap.set(currWords, { yPercent: 0 });

                nextEl.style.visibility = "visible";
                gsap.set(nextWords, { yPercent: 100 });

                const cycleTl = gsap.timeline({
                    onComplete: () => {
                        if (currentEl) {
                            currentEl.style.visibility = "hidden";
                            gsap.set(currWords, { yPercent: 100 });
                        }
                        currentPhraseIndex = nextIndex;
                        activeTickerTl = null;
                        if (isTickerRunning) {
                            tickerCycleTimer = gsap.delayedCall(1.4, rotateTicker);
                        }
                    },
                });
                activeTickerTl = cycleTl;

                // Smoothly morph ticker container width so the entire line auto-centers flawlessly
                if (targetWidth && tickerWrapperRef.current) {
                    cycleTl.to(
                        tickerWrapperRef.current,
                        {
                            width: targetWidth,
                            duration: 0.9,
                            ease: "power3.inOut",
                        },
                        0
                    );
                }

                // Outgoing words roll up and out with stagger
                cycleTl.to(
                    currWords,
                    {
                        yPercent: -100,
                        duration: 0.9,
                        stagger: 0.08,
                        ease: "power4.out",
                    },
                    0
                );

                // Incoming words roll up into view with stagger
                cycleTl.to(
                    nextWords,
                    {
                        yPercent: 0,
                        duration: 0.9,
                        stagger: 0.08,
                        ease: "power4.out",
                    },
                    0.02
                );
            };

            const startTicker = () => {
                if (isTickerRunning) return;
                isTickerRunning = true;
                tickerCycleTimer = gsap.delayedCall(0.6, rotateTicker);
            };

            const stopTicker = () => {
                if (!isTickerRunning) return;
                isTickerRunning = false;
                if (tickerCycleTimer) {
                    tickerCycleTimer.kill();
                    tickerCycleTimer = null;
                }
                if (activeTickerTl) {
                    activeTickerTl.kill();
                    activeTickerTl = null;
                }

                // Cleanly restore initial phrase state without breaking scrub references
                currentPhraseIndex = 0;
                if (widthsRef.current[0] && tickerWrapperRef.current) {
                    gsap.set(tickerWrapperRef.current, { width: widthsRef.current[0] });
                }
                phraseRefs.current.forEach((el, idx) => {
                    if (!el) return;
                    const words = el.querySelectorAll(".phrase-word");
                    if (idx === 0) {
                        el.style.visibility = "visible";
                        gsap.set(words, { yPercent: 0 });
                    } else {
                        el.style.visibility = "hidden";
                        gsap.set(words, { yPercent: 100 });
                    }
                });
            };

            // 3. Helper to setup time-based entrance animation
            const setupEntranceAnimation = (targetStaticEl: HTMLElement) => {
                measureWidths();

                const split = new SplitText(targetStaticEl, {
                    type: "words",
                    mask: "words",
                    wordsClass: "pr-[2px] inline-block will-change-transform",
                });

                // Initialize all phrases: Phrase 0 visible at 0, all others hidden at 100
                phraseRefs.current.forEach((el, idx) => {
                    if (!el) return;
                    const words = el.querySelectorAll(".phrase-word");
                    if (idx === 0) {
                        el.style.visibility = "visible";
                        gsap.set(words, { yPercent: 0 });
                    } else {
                        el.style.visibility = "hidden";
                        gsap.set(words, { yPercent: 100 });
                    }
                });

                const entranceTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%", // Starts when top of container reaches 60% of viewport
                        once: true,
                    },
                    onComplete: () => {
                        startTicker();
                    }
                });

                // Pure kinetic masked reveal
                entranceTl.fromTo(
                    split.words,
                    { yPercent: 115 },
                    {
                        yPercent: 0,
                        stagger: 0.03,
                        ease: "power3.out",
                        duration: 0.8,
                    },
                    0
                );

                // Ticker slot entrance animates smoothly on the inner wrapper
                if (tickerInnerRef.current) {
                    const tickerStartTime = split.words.length * 0.03;
                    entranceTl.fromTo(
                        tickerInnerRef.current,
                        { yPercent: 115 },
                        {
                            yPercent: 0,
                            duration: 0.6,
                            ease: "power3.out",
                        },
                        tickerStartTime
                    );
                }

                // Smooth floating motion for corner GDG logo brackets
                if (leftBgRef.current) {
                    entranceTl.fromTo(
                        leftBgRef.current,
                        { y: 60, rotate: 16, scale: 0.9, opacity: 0 },
                        { y: -30, rotate: 34, scale: 1.05, opacity: 1, ease: "power3.out", duration: 1.6 },
                        0
                    );
                }
                if (rightBgRef.current) {
                    entranceTl.fromTo(
                        rightBgRef.current,
                        { y: 70, rotate: 6, scale: 0.9, opacity: 0 },
                        { y: -40, rotate: 26, scale: 1.05, opacity: 1, ease: "power3.out", duration: 1.6 },
                        0
                    );
                }

                return () => {
                    stopTicker();
                    split.revert();
                };
            };

            // Responsive GSAP setups without pin distances
            mm.add("(max-width: 767px)", () => {
                if (mobileStaticRef.current) {
                    return setupEntranceAnimation(mobileStaticRef.current);
                }
            });

            mm.add("(min-width: 768px)", () => {
                if (desktopStaticRef.current) {
                    return setupEntranceAnimation(desktopStaticRef.current);
                }
            });

            // Refresh layout metrics only when horizontal width actually changes (prevents mobile Safari address bar resize jumping)
            let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
            const handleResize = () => {
                if (typeof window !== "undefined" && window.innerWidth === lastWidth) return;
                lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
                measureWidths();
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            };
            window.addEventListener("resize", handleResize);

            if (document.fonts?.ready) {
                document.fonts.ready.then(() => {
                    measureWidths();
                    ScrollTrigger.sort();
                    ScrollTrigger.refresh();
                });
            }

            return () => {
                window.removeEventListener("resize", handleResize);
                stopTicker();
                mm.revert();
            };
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="flex justify-center h-screen w-full bg-background select-none relative z-10 overflow-hidden items-center"
        >
            <h2
                className="text-3xl sm:text-3xl md:text-5xl text-center max-w-[90vw] md:max-w-[62vw] text-pretty leading-[1em] md:leading-[1.25em] tracking-tight text-foreground/87 relative z-20"
            >
                {/* Desktop Full Text */}
                <span ref={desktopStaticRef} className="hidden md:inline">
                    A student community for people who want to{" "}
                    <span className="text-[var(--color-blue)]">learn</span>,{" "}
                    <span className="text-[var(--color-red)]">build</span>, and{" "}
                    <span className="text-[var(--color-yellow)]">grow</span> with technology.
                    From hands-on sessions to ambitious projects, we bring curious minds together to turn ideas into{" "}
                    <span className="text-[var(--color-green)]">meaningful work</span>.
                    Meet people who are excited to{" "}
                </span>

                {/* Mobile Shorter Text */}
                <span ref={mobileStaticRef} className="inline md:hidden">
                    A student community to{" "}
                    <span className="text-[var(--color-blue)]">learn</span>,{" "}
                    <span className="text-[var(--color-red)]">build</span>, and{" "}
                    <span className="text-[var(--color-yellow)]">grow</span>.
                    From ideas to{" "}
                    <span className="text-[var(--color-green)]">meaningful work</span>,
                    meet people excited to{" "}
                </span>

                {/* Ticker Phrase Slot with permanent DOM phrases and overflow masking */}
                <span
                    ref={tickerWrapperRef}
                    className="inline-block relative overflow-hidden align-top text-foreground font-medium text-left whitespace-nowrap will-change-[width] h-[1em] md:h-[1.25em] isolate"
                    style={{
                        clipPath: "inset(0)",
                        WebkitClipPath: "inset(0)",
                    }}
                >
                    <span ref={tickerInnerRef} className="block w-full h-full relative will-change-transform">
                        {PHRASES.map((words, idx) => (
                            <span
                                key={words.join("-")}
                                ref={(el) => {
                                    phraseRefs.current[idx] = el;
                                }}
                                className="absolute left-0 top-0 whitespace-nowrap will-change-transform"
                                style={{
                                    visibility: idx === 0 ? "visible" : "hidden",
                                }}
                            >
                                {words.map((w, wIdx) => (
                                    <span key={wIdx} className="phrase-word inline-block will-change-transform mr-[0.28em] last:mr-0">
                                        {w}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </span>
                </span>
            </h2>

            {/* Corner Decorative GDG Graphics */}
            <div
                ref={leftBgRef}
                className="absolute top-10 md:top-14 -left-10 md:left-1/11 h-24 sm:h-32 md:h-38 aspect-[294/346] will-change-transform pointer-events-none z-10"
            >  
                <Image priority className="object-contain select-none pointer-events-none drop-shadow-sm" src={"/assets/gdg-logo-left.png"} alt="" aria-hidden="true" fill />
            </div>
            <div
                ref={rightBgRef}
                className="absolute bottom-10 md:bottom-0 -right-10 md:right-1/9 h-24 sm:h-32 md:h-38 aspect-[294/346] will-change-transform pointer-events-none z-10"
            >  
                <Image priority className="object-contain select-none pointer-events-none drop-shadow-sm" src={"/assets/gdg-logo-right.png"} alt="" aria-hidden="true" fill />
            </div>
        </section>
    );
}