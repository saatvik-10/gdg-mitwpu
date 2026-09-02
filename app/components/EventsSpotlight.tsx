"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface EventItem {
    id: string;
    name: string;
    color: string;
    image: string;
}

type TickerReel = {
    top: HTMLElement;
    bottom: HTMLElement;
    index: number;
};

const EVENTS: EventItem[] = [
    {
        id: "shubharambh",
        name: "Shubharambh",
        color: "var(--color-blue, #4285F4)",
        image: "/assets/g1.jpg",
    },
    {
        id: "embark",
        name: "Embark",
        color: "var(--color-yellow, #FBBC04)",
        image: "/assets/embark.jpg",
    },
    {
        id: "devolution",
        name: "Devolution",
        color: "var(--color-red, #EA4335)",
        image: "/assets/devolution.jpg",
    },
];

export default function EventsSpotlight() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nameRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const eventReelsRef = useRef<TickerReel[][]>([]);
    const activeTickerTlRef = useRef<gsap.core.Timeline | null>(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const lastIndexRef = useRef<number>(0);

    const displayedIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

    // Helper to transform each SplitText character into dual-stacked ticker reels
    const createReels = (chars: Element[], startIndex = 0): TickerReel[] => {
        return chars.map((charEl, i) => {
            const el = charEl as HTMLElement;
            const letter = el.textContent || "";
            el.innerHTML = "";
            el.style.display = "inline-block";
            el.style.position = "relative";
            el.style.verticalAlign = "top";
            el.style.overflow = "hidden";

            const top = document.createElement("span");
            top.textContent = letter === " " ? "\u00A0" : letter;
            top.className = "block will-change-transform";

            const bottom = document.createElement("span");
            bottom.textContent = letter === " " ? "\u00A0" : letter;
            bottom.className = "block absolute top-full left-0 w-full will-change-transform";

            el.appendChild(top);
            el.appendChild(bottom);

            return { top, bottom, index: startIndex + i };
        });
    };

    // Helper to safely reset all character reels to their 0% rest state
    const resetAllReels = () => {
        eventReelsRef.current.forEach((reels) => {
            if (!reels) return;
            reels.forEach((reel) => {
                gsap.killTweensOf([reel.top, reel.bottom]);
                gsap.set([reel.top, reel.bottom], { yPercent: 0 });
            });
        });
    };

    // Helper to animate rolling character ticker across an event name's character reels
    const playEventTicker = (reels: TickerReel[]) => {
        if (!reels || reels.length === 0) return;

        // 1. Kill any active ticker timeline
        if (activeTickerTlRef.current) {
            activeTickerTlRef.current.kill();
            activeTickerTlRef.current = null;
        }

        // 2. Immediately reset ALL reels across all events so no character gets stuck mid-roll
        resetAllReels();

        const tl = gsap.timeline();
        activeTickerTlRef.current = tl;

        // Shuffle order for organic, tactile kinetic ticker feel
        const shuffled = [...reels].sort(() => Math.random() - 0.5);

        shuffled.forEach((reel, i) => {
            const startTime = i * 0.028;

            tl.fromTo(
                [reel.top, reel.bottom],
                { yPercent: 0 },
                {
                    yPercent: -100,
                    duration: 0.44,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set([reel.top, reel.bottom], { yPercent: 0 });
                    },
                },
                startTime
            );
        });
    };

    // Initialize SplitText on each event name and build ticker reels
    useGSAP(
        () => {
            if (!containerRef.current) return;

            const splits: InstanceType<typeof SplitText>[] = [];
            eventReelsRef.current = [];

            nameRefs.current.forEach((nameEl, idx) => {
                if (!nameEl) return;

                const split = new SplitText(nameEl, {
                    type: "chars,words",
                    mask: "words",
                    wordsClass: "pr-[3px]",
                });
                splits.push(split);

                const reels = createReels(split.chars, 0);
                eventReelsRef.current[idx] = reels;
            });

            // Initial ticker roll on first active event
            if (eventReelsRef.current[0]) {
                playEventTicker(eventReelsRef.current[0]);
            }

            const total = EVENTS.length;

            // Parallax up while scrolling past the "where we meet" header
            const isMob = typeof window !== "undefined" && window.innerWidth < 768;
            if (contentRef.current) {
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
                            trigger: containerRef.current,
                            start: "top bottom",
                            end: "top top",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    }
                );
            }

            const trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: () => `+=${Math.max(window.innerHeight * 2.2, 1600)}`,
                pin: true,
                pinSpacing: true,
                scrub: true,
                invalidateOnRefresh: true,
                refreshPriority: 0,
                onUpdate(self) {
                    const nextIndex = Math.min(
                        total - 1,
                        Math.max(0, Math.floor(self.progress * total))
                    );
                    if (lastIndexRef.current !== nextIndex) {
                        lastIndexRef.current = nextIndex;
                        setActiveIndex(nextIndex);
                    }
                },
            });

            return () => {
                trigger.kill();
                if (activeTickerTlRef.current) activeTickerTlRef.current.kill();
                resetAllReels();
                splits.forEach((s) => s.revert());
            };
        },
        { scope: containerRef }
    );

    // Play ticker & crossfade images whenever active / hovered index changes
    const prevDisplayedRef = useRef<number>(-1);

    useEffect(() => {
        if (prevDisplayedRef.current !== displayedIndex) {
            prevDisplayedRef.current = displayedIndex;

            // Trigger character ticker on the newly active event name
            if (eventReelsRef.current[displayedIndex]) {
                playEventTicker(eventReelsRef.current[displayedIndex]);
            }
        }

        // Smooth image crossfade
        imageRefs.current.forEach((imgEl, idx) => {
            if (!imgEl) return;
            gsap.killTweensOf(imgEl);
            if (idx === displayedIndex) {
                gsap.to(imgEl, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: true,
                });
            } else {
                gsap.to(imgEl, {
                    opacity: 0,
                    scale: 1.04,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: true,
                });
            }
        });
    }, [displayedIndex]);

    return (
        <section className="relative w-full bg-background select-none flex flex-col items-center justify-center font-sans">
            {/* Minimalist Section Header */}
            <div className="w-full pt-20 sm:pt-28 pb-6 sm:pb-8 flex items-center justify-center text-center z-20">
                <h2 className="text-md sm:text-3xl font-medium font-silkscreen tracking-tighter select-none text-foreground/90">
                    where we meet
                </h2>
            </div>

            {/* Pinned 2-Column Split: Left Vertical List, Right Synchronized Image */}
            <div
                ref={containerRef}
                className="relative w-full h-screen bg-background flex items-center justify-center overflow-hidden px-6 md:px-12"
            >
                <div
                    ref={contentRef}
                    className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10 md:gap-14 z-20 will-change-transform"
                >
                    {/* Left: Vertical List of Event Names */}
                    <div className="flex flex-col items-start gap-4 sm:gap-6 w-full md:w-1/2">
                        <div className="flex flex-col gap-3 sm:gap-5 w-full">
                            {EVENTS.map((event, idx) => {
                                const isSelected = displayedIndex === idx;

                                return (
                                    <div
                                        key={event.id}
                                        onMouseEnter={() => setHoveredIndex(idx)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => {
                                            setActiveIndex(idx);
                                            setHoveredIndex(null);
                                        }}
                                        className="cursor-pointer transition-transform duration-300 w-full border-b border-foreground/10 pb-5 last:border-b-0 last:pb-0"
                                    >
                                        <h3
                                            ref={(el) => {
                                                nameRefs.current[idx] = el;
                                            }}
                                            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6vw] tracking-tight leading-[1.05] font-normal transition-all duration-300 select-none overflow-hidden"
                                            style={{
                                                color: isSelected ? event.color : "rgba(243, 242, 238, 0.28)",
                                            }}
                                        >
                                            {event.name}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Direct link to full events page */}
                        <Link
                            href="/events"
                            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider text-foreground/60 hover:text-foreground transition-colors pt-2 sm:pt-4 select-none"
                        >
                            <span>explore all events</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Right: Direct Image Display with Smooth Crossfade */}
                    <div className="w-full md:w-1/2 max-w-[420px] md:max-w-[460px] aspect-[16/10] overflow-hidden relative shadow-2xl bg-neutral-900 border border-white/5 shrink-0">
                        {EVENTS.map((event, idx) => (
                            <div
                                key={event.id}
                                ref={(el) => {
                                    imageRefs.current[idx] = el;
                                }}
                                className="absolute inset-0 will-change-transform"
                                style={{
                                    opacity: idx === 0 ? 1 : 0,
                                }}
                            >
                                <Image
                                    src={event.image}
                                    alt={`GDG MIT-WPU event — ${event.name} workshop and community meetup`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 460px"
                                    priority={idx === 0}
                                    className="object-cover select-none pointer-events-none will-change-transform"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
