"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type TickerReel = {
    top: HTMLElement;
    bottom: HTMLElement;
    index: number;
};

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftBracketRef = useRef<HTMLDivElement>(null);
    const rightBracketRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const gdgRef = useRef<HTMLSpanElement>(null);
    const mitwpuRef = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            let ran = false;
            let isCancelled = false;
            let gdgSplit: InstanceType<typeof SplitText> | null = null;
            let mitwpuSplit: InstanceType<typeof SplitText> | null = null;
            let loopTween: gsap.core.Tween | null = null;
            let heroTl: gsap.core.Timeline | null = null;

            const startHeroSequence = () => {
                if (isCancelled || ran) return;
                if (
                    !maskRef.current ||
                    !textRef.current ||
                    !gdgRef.current ||
                    !mitwpuRef.current ||
                    !containerRef.current
                ) {
                    return;
                }
                ran = true;

                // 1. Initialize SplitText with char splitting and word-level masking
                gdgSplit = new SplitText(gdgRef.current, {
                    type: "chars,words",
                    mask: "words",
                    wordsClass: "pr-[2px]",
                });

                mitwpuSplit = new SplitText(mitwpuRef.current, {
                    type: "chars,words",
                    mask: "words",
                    wordsClass: "pr-[2px]",
                });

                // Helper to transform each SplitText character into a dual-stacked ticker reel
                const createReels = (chars: Element[], startIndex: number = 0): TickerReel[] => {
                    return chars.map((charEl, i) => {
                        const el = charEl as HTMLElement;
                        const letter = el.textContent || "";
                        el.innerHTML = "";
                        el.style.display = "inline-block";
                        el.style.position = "relative";
                        el.style.verticalAlign = "top";

                        const top = document.createElement("span");
                        top.textContent = letter;
                        top.className = "block will-change-transform";

                        const bottom = document.createElement("span");
                        bottom.textContent = letter;
                        bottom.className = "block absolute top-full left-0 w-full will-change-transform";

                        el.appendChild(top);
                        el.appendChild(bottom);

                        return { top, bottom, index: startIndex + i };
                    });
                };

                const gdgReels = createReels(gdgSplit.chars, 0);
                const mitwpuReels = createReels(mitwpuSplit.chars, 3);

                const COLOR_PAIRS = [
                    { gdg: "#4285F4", mitwpu: "#EA4335" }, // Cycle 1: GDG Blue, MITWPU Red
                    { gdg: "#FBBC04", mitwpu: "#34A853" }, // Cycle 2: GDG Yellow, MITWPU Green
                ];
                const SETTLED_COLOR = "rgba(243, 242, 238, 0.87)";
                let cycleIndex = 0;

                // Helper to animate rolling ticker across a word's character reels in randomized order
                const createWordTickerTimeline = (
                    reels: TickerReel[],
                    wordColor: string,
                    staggerTime: number
                ) => {
                    const wordTl = gsap.timeline();
                    // Shuffle order so letters ticker randomly rather than linearly
                    const shuffled = [...reels].sort(() => Math.random() - 0.5);

                    shuffled.forEach((reel, i) => {
                        const startTime = i * staggerTime;

                        // 1. Smoothly transition departing letter (top) from settled foreground/87 into the word's Google color
                        wordTl.fromTo(
                            reel.top,
                            { color: SETTLED_COLOR },
                            {
                                color: wordColor,
                                duration: 0.22,
                                ease: "power1.out",
                            },
                            startTime
                        );

                        // 2. Animate vertical roll (incoming reel.bottom stays clean settled foreground/87)
                        wordTl.fromTo(
                            [reel.top, reel.bottom],
                            { yPercent: 0 },
                            {
                                yPercent: -100,
                                duration: 0.46,
                                ease: "power2.inOut",
                                onComplete: () => {
                                    gsap.set([reel.top, reel.bottom], {
                                        yPercent: 0,
                                        clearProps: "color",
                                    });
                                },
                            },
                            startTime
                        );
                    });
                    return wordTl;
                };

                // 2. Build the recurring ticker loop with alternating word color pairs
                const runTickerCycle = () => {
                    const activePair = COLOR_PAIRS[cycleIndex % COLOR_PAIRS.length];
                    cycleIndex++;

                    const cycleTl = gsap.timeline({
                        onComplete: () => {
                            loopTween = gsap.delayedCall(2.2, runTickerCycle);
                        },
                    });

                    // Ticker both GDG and MITWPU simultaneously at the exact same time
                    cycleTl.add(createWordTickerTimeline(gdgReels, activePair.gdg, 0.05), 0);
                    cycleTl.add(createWordTickerTimeline(mitwpuReels, activePair.mitwpu, 0.05), 0);
                };

                // Measure natural unconstrained width of GDG MITWPU with fonts and reels ready
                const targetWidth = Math.ceil(textRef.current.scrollWidth);
                if (!targetWidth || targetWidth <= 0) return;

                heroTl = gsap.timeline();

                // Step 1: Cinematic in-animation for brackets into the center
                heroTl.fromTo(
                    leftBracketRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8, ease: "power3.out" }
                );

                heroTl.fromTo(
                    rightBracketRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.8, ease: "power3.out" },
                    "<"
                );

                // Step 2: Brackets split apart and unmask text
                heroTl.fromTo(
                    maskRef.current,
                    { width: 0 },
                    {
                        width: targetWidth,
                        duration: 0.9,
                        ease: "power3.inOut",
                        onComplete: () => {
                            if (maskRef.current) {
                                maskRef.current.style.width = "auto";
                            }
                            // Start recurring ticker loop immediately after brackets finish revealing
                            runTickerCycle();
                        },
                    },
                    "-=0.2"
                );

                heroTl.fromTo(
                    textRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                    },
                    "<+=0.08"
                );
            };

            const triggerAnimation = () => {
                // Ensure main thread has painted and is idle
                requestAnimationFrame(() => {
                    requestAnimationFrame(startHeroSequence);
                });
            };

            const initSequence = () => {
                if (document.readyState === "complete") {
                    setTimeout(triggerAnimation, 300);
                } else {
                    window.addEventListener("load", () => {
                        setTimeout(triggerAnimation, 300);
                    });
                    // Fallback if load event never fires
                    setTimeout(triggerAnimation, 2000);
                }
            };

            if (document.fonts?.ready) {
                document.fonts.ready.then(initSequence);
            } else {
                initSequence();
            }

            const handleResize = () => {
                if (ran && maskRef.current) {
                    maskRef.current.style.width = "auto";
                }
            };
            window.addEventListener("resize", handleResize);

            return () => {
                isCancelled = true;
                window.removeEventListener("resize", handleResize);
                if (heroTl) {
                    heroTl.kill();
                }
                if (loopTween) {
                    loopTween.kill();
                }
                if (gdgSplit) {
                    gdgSplit.revert();
                }
                if (mitwpuSplit) {
                    mitwpuSplit.revert();
                }
            };
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="h-screen w-full flex flex-col justify-center items-center px-4 overflow-hidden relative select-none"
        >
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image src={"/assets/bg.jpeg"} alt="GDG MIT-WPU community — students collaborating at MIT World Peace University Pune" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/70 via-[#090909]/85 to-[#090909]/90 backdrop-blur-md" />
            </div>
            <div className="flex items-center justify-center max-w-full relative">
                {/* Left bracket (<) */}
                <div
                    ref={leftBracketRef}
                    className="relative z-30 shrink-0 flex items-center justify-center h-20 xs:h-22 sm:h-26 md:h-40 lg:h-52 xl:h-38 aspect-[294/346] will-change-transform"
                    style={{ opacity: 0 }}
                >
                    <Image
                        src="/assets/gdg-logo-left.png"
                        alt=""
                        aria-hidden="true"
                        fill
                        priority
                        className="object-contain select-none pointer-events-none drop-shadow-sm"
                    />
                </div>

                {/* Single unified text aperture: GDG MITWPU */}
                <div
                    ref={maskRef}
                    className="overflow-hidden shrink-0 flex items-center justify-center relative z-10 will-change-[width]"
                    style={{ width: 0 }}
                >
                    <h1
                        ref={textRef}
                        className="text-4xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-[-0.02em] text-foreground dark:text-foreground/87 select-none whitespace-nowrap leading-none text-center shrink-0 flex items-center justify-center pl-1 sm:pl-2 md:pl-3 pr-3 sm:pr-5 md:pr-6"
                        style={{ opacity: 0 }}
                    ><span ref={gdgRef} className="inline-block">GDG</span><span className="inline-block">&nbsp;</span><span ref={mitwpuRef} className="inline-block">MITWPU</span></h1>
                </div>

                {/* Right bracket (>) */}
                <div
                    ref={rightBracketRef}
                    className="relative z-30 shrink-0 flex items-center justify-center h-20 xs:h-22 sm:h-26 md:h-40 lg:h-52 xl:h-38 aspect-[294/346] will-change-transform"
                    style={{ opacity: 0 }}
                >
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
        </section>
    );
}