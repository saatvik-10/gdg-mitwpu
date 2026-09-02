"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ASSETS = [
    { src: "/assets/gdg-logo.png", alt: "Google" }
];

function RotatingIcon({
    initialIndex = 0,
    intervalMs = 3400,
    delayMs = 200,
}: {
    initialIndex?: number;
    intervalMs?: number;
    delayMs?: number;
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const imgRef = useRef<HTMLDivElement | null>(null);
    const currentIndexRef = useRef(initialIndex);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        // Preload assets for instantaneous switching
        if (typeof window !== "undefined") {
            ASSETS.forEach((asset) => {
                const img = new window.Image();
                img.src = asset.src;
            });
        }

        // Initial smooth pop-in
        if (imgRef.current) {
            gsap.fromTo(
                imgRef.current,
                { scale: 0.98 },
                { scale: 1, duration: 0.3, ease: "back.out(1.8)" }
            );
        }

        let timer: NodeJS.Timeout;
        const initialDelayTimer = setTimeout(() => {
            const runSwitch = () => {
                if (!imgRef.current) return;

                gsap.to(imgRef.current, {
                    scale: 0.98,
                    duration: 0.2,
                    ease: "back.in(1.6)",
                    onComplete: () => {
                        let nextIndex = Math.floor(Math.random() * ASSETS.length);
                        while (nextIndex === currentIndexRef.current && ASSETS.length > 1) {
                            nextIndex = Math.floor(Math.random() * ASSETS.length);
                        }
                        setCurrentIndex(nextIndex);

                        if (imgRef.current) {
                            gsap.fromTo(
                                imgRef.current,
                                { scale: 0.98 },
                                {
                                    scale: 1,
                                    duration: 0.25,
                                    ease: "back.out(2)",
                                }
                            );
                        }
                    },
                });
            };

            runSwitch();
            timer = setInterval(runSwitch, intervalMs);
        }, delayMs + intervalMs);

        return () => {
            clearTimeout(initialDelayTimer);
            if (timer) clearInterval(timer);
        };
    }, [intervalMs, delayMs]);

    const currentAsset = ASSETS[currentIndex] || ASSETS[0];

    return (
        <div
            ref={imgRef}
            className="w-full h-full mx-0 md:mx-2 rounded-xl md:rounded-4xl overflow-hidden flex items-center justify-center will-change-transform"
        >
            <Image
                src={currentAsset.src}
                alt={currentAsset.alt}
                width={200}
                height={200}
                className="size-full object-contain select-none pointer-events-none drop-shadow-md rounded-xl md:rounded-4xl"
                priority
            />
        </div>
    );
}

export default function ScrollMotto() {
    const container = useRef<HTMLElement | null>(null);
    const marqueeTrack = useRef<HTMLHeadingElement | null>(null);

    useEffect(() => {
        const cont = container.current;
        const track = marqueeTrack.current;
        if (!cont || !track) return;

        let split: InstanceType<typeof SplitText> | null = null;
        let ctx: gsap.Context | null = null;

        const init = () => {
            ctx?.revert();
            ctx = gsap.context(() => {
                split?.revert();
                split = new SplitText(track.querySelectorAll(".motto-word"), { type: "chars" });

                const targets: HTMLElement[] = [];
                Array.from(track.children).forEach((child) => {
                    if (child.classList.contains("motto-word")) {
                        targets.push(...(Array.from(child.children) as HTMLElement[]));
                    } else {
                        targets.push(child as HTMLElement);
                    }
                });

                gsap.set(targets, { display: "inline-block", transformOrigin: "center center", force3D: true });

                // Measure relative char offsets without moving the track
                const trackRect = track.getBoundingClientRect();
                const offsets = targets.map((el) => {
                    const r = el.getBoundingClientRect();
                    return (r.left - trackRect.left) + r.width / 2;
                });

                const vw = window.innerWidth;
                const isMobile = vw < 768;
                const startX = vw;
                // Exit cleanly right after 'Grow.' leaves the viewport
                const buffer = isMobile ? 60 : 100;
                const endX = -(track.offsetWidth + buffer);

                // Set initial position off-screen right immediately
                gsap.set(track, { x: startX });

                const setY = targets.map((t) => gsap.quickSetter(t, "y", "px"));
                const setRot = targets.map((t) => gsap.quickSetter(t, "rotation", "deg"));

                // Dynamic scroll distance: ends cleanly right after 'Grow.' goes off screen
                const totalDistance = startX - endX;
                const scrollDistance = isMobile
                    ? Math.max(1500, Math.round(totalDistance * 0.85))
                    : Math.max(2200, Math.round(totalDistance * 0.72));

                gsap.fromTo(
                    track,
                    { x: startX },
                    {
                        x: endX,
                        ease: "none",
                        scrollTrigger: {
                            trigger: cont,
                            start: "top top",
                            end: () => `+=${scrollDistance}`,
                            scrub: true,
                            pin: true,
                            pinSpacing: true,
                            invalidateOnRefresh: true,
                            refreshPriority: 2,
                            onUpdate(self) {
                                const waveLength = isMobile ? vw * 1.1 : vw;
                                const amp = isMobile ? Math.min(window.innerHeight * 0.02, 15) : window.innerHeight * 0.055;
                                const rotScale = isMobile ? 0.35 : 1.0;
                                const tx = startX + self.progress * (endX - startX);
                                for (let i = 0; i < targets.length; i++) {
                                    const phase = ((tx + offsets[i]) / waveLength) * Math.PI * 2;
                                    setY[i](Math.sin(phase) * amp);
                                    setRot[i](
                                        Math.atan(Math.cos(phase) * amp * (Math.PI * 2 / waveLength)) *
                                        (180 / Math.PI) *
                                        rotScale
                                    );
                                }
                            },
                        },
                    }
                );

                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            });
        };

        const raf = requestAnimationFrame(init);

        return () => {
            cancelAnimationFrame(raf);
            split?.revert();
            ctx?.revert();
        };
    }, []);

    return (
        <section
            ref={container}
            className="h-screen w-full flex items-center overflow-hidden bg-background text-white"
        >
            <h1
                ref={marqueeTrack}
                className="motto text-[22vw] md:text-[18vw] font-light tracking-tighter whitespace-nowrap inline-flex items-center select-none w-max shrink-0"
                style={{ transform: "translateX(100vw)" }}
            >
                <span className="motto-word text-foreground/87">Connect.</span>
                <div className="icon-slot size-[16vw] inline-flex items-center justify-center shrink-0 mx-[0.5vw]">
                    <RotatingIcon initialIndex={0} intervalMs={1600} delayMs={0} />
                </div>
                <span className="motto-word text-foreground/87">Learn.</span>
                <div className="icon-slot size-[16vw] inline-flex items-center justify-center shrink-0 mx-[0.5vw]">
                    <RotatingIcon initialIndex={1} intervalMs={1600} delayMs={800} />
                </div>
                <span className="motto-word text-foreground/87">Grow.</span>
            </h1>
        </section>
    );
}
