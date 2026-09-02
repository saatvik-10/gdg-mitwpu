"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(SplitText);
}

type NavLink = { label: string; href: string; external?: boolean };
const NAV_LINKS: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Members", href: "/members" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Join Us", href: "https://recruitment.gdg-mitwpu.in/", external: true },
];

const GOOGLE_COLORS = [
    "#4285F4", // Google Blue
    "#EA4335", // Google Red
    "#FBBC04", // Google Yellow
    "#34A853", // Google Green
];

const SETTLED_COLOR = "rgba(243, 242, 238, 0.87)";

type TickerReel = {
    top: HTMLElement;
    bottom: HTMLElement;
    index: number;
};

export default function NavMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const colorPanelsRef = useRef<(HTMLDivElement | null)[]>([]);
    const mainPanelRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const socialsRef = useRef<HTMLDivElement>(null);
    const logoTextRef = useRef<HTMLHeadingElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    // Prefetch all internal nav links on mount so route transitions are immediate
    useEffect(() => {
        NAV_LINKS.forEach((link) => {
            if (link.external) return;
            router.prefetch(link.href);
        });
    }, [router]);

    // Initialize GSAP Timeline for staggered curtain and SplitText animations
    useEffect(() => {
        const colorPanels = colorPanelsRef.current.filter(Boolean);
        const panels = [...colorPanels, mainPanelRef.current].filter(Boolean);
        const validLinks = linksRef.current.filter(Boolean);

        // Ensure panels start completely above the viewport with generous margin to avoid subpixel bleed
        gsap.set(panels, { yPercent: -110 });

        // Helper to transform each SplitText character into a dual-stacked ticker reel
        const createReels = (chars: Element[]): TickerReel[] => {
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

                return { top, bottom, index: i };
            });
        };

        // Helper to animate rolling ticker across a link's character reels on hover
        const playLinkTicker = (reels: TickerReel[], targetColor: string, onDone?: () => void) => {
            const wordTl = gsap.timeline({
                onComplete: onDone,
            });
            const shuffled = [...reels].sort(() => Math.random() - 0.5);

            shuffled.forEach((reel, i) => {
                const startTime = i * 0.04;

                // 1. Smoothly transition departing letter from settled color into target color
                wordTl.fromTo(
                    reel.top,
                    { color: SETTLED_COLOR },
                    {
                        color: targetColor,
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
                        duration: 0.44,
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

        // Split each navigation link text into characters and words
        const splits: SplitText[] = [];
        const cleanupListeners: (() => void)[] = [];

        validLinks.forEach((link, linkIdx) => {
            if (!link) return;
            const split = new SplitText(link, {
                type: "chars,words",
                mask: "words",
                charsClass: "inline-block will-change-transform",
            });
            splits.push(split);

            // Transform characters into dual-stacked ticker reels
            const reels = createReels(split.chars);
            
            // Assign a single Google color to this entire link based on its index
            const linkColor = GOOGLE_COLORS[linkIdx % GOOGLE_COLORS.length];

            let isHovering = false;
            let currentTl: gsap.core.Timeline | null = null;

            const handleMouseEnter = () => {
                if (isHovering) return;
                isHovering = true;
                currentTl = playLinkTicker(reels, linkColor, () => {
                    isHovering = false;
                });
            };

            link.addEventListener("mouseenter", handleMouseEnter);
            cleanupListeners.push(() => {
                link.removeEventListener("mouseenter", handleMouseEnter);
                if (currentTl) currentTl.kill();
            });
        });

        // Initially hide all characters
        splits.forEach((split) => {
            gsap.set(split.words, { yPercent: 100 });
        });

        if (socialsRef.current) {
            gsap.set(socialsRef.current, { yPercent: 20, opacity: 0 });
        }

        // Split logo header text and hide when closed
        let logoSplit: SplitText | null = null;
        if (logoTextRef.current) {
            logoSplit = new SplitText(logoTextRef.current, {
                type: "chars,words",
                wordsClass: "inline-block pr-[0.35em] last:pr-0",
                charsClass: "inline-block will-change-transform",
            });
            gsap.set(logoTextRef.current, { opacity: 1 });
            gsap.set(logoSplit.words, { yPercent: 100, opacity: 0 });
        }

        const timeline = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
                if (overlayRef.current) {
                    gsap.set(overlayRef.current, { autoAlpha: 0 });
                }
            },
        });

        // 1. Cascading Google colors + main menu panel drop down from top to bottom
        timeline.to(panels, {
            yPercent: 0,
            duration: 0.65,
            ease: "power3.inOut",
            stagger: 0.07,
        });

        // 2. Once the black main panel is down, seamlessly hide underlying color panels
        timeline.set(colorPanels, { opacity: 0 });

        // 2. Animate logo text in smoothly with SplitText
        if (logoSplit) {
            timeline.to(
                logoSplit.words,
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.06,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        }

        // 3. Kinetic character stagger reveal for each navigation link
        splits.forEach((split, linkIdx) => {
            timeline.to(
                split.words,
                {
                    yPercent: 0,
                    duration: 0.45,
                    stagger: 0.02,
                    ease: "power3.out",
                },
                linkIdx === 0 ? "-=0.25" : "<0.08"
            );
        });

        // 4. Social icons fade in
        if (socialsRef.current) {
            timeline.to(
                socialsRef.current,
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.35,
                    ease: "power2.out",
                },
                "-=0.2"
            );
        }

        tlRef.current = timeline;

        return () => {
            timeline.kill();
            cleanupListeners.forEach((cleanup) => cleanup());
            splits.forEach((split) => split.revert());
            if (logoSplit) logoSplit.revert();
        };
    }, [router]);

    // Restore body scroll and state on route change without killing the running reverse animation
    useEffect(() => {
        setIsOpen(false);
        document.body.style.overflow = "";
    }, [pathname]);

    const openMenu = useCallback(() => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#090909");

        if (overlayRef.current) {
            gsap.set(overlayRef.current, { autoAlpha: 1 });
        }
        setIsOpen(true);
        if (tlRef.current) {
            tlRef.current.timeScale(1).play();
        }
    }, []);

    const closeMenu = useCallback(() => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#090909");

        setIsOpen(false);
        if (tlRef.current) {
            tlRef.current.timeScale(1.35).reverse();
        }
    }, []);

    const toggleMenu = useCallback(() => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }, [isOpen, closeMenu, openMenu]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeMenu();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeMenu]);

    return (
        <>
            {/* Top Bar Header (Logo on left, Two (long) bar hamburger button on right) */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-5 pointer-events-none">
                <div className="pointer-events-auto flex items-center">
                    <Link
                        href="/"
                        onClick={() => {
                            if (isOpen) closeMenu();
                        }}
                        className="flex items-center gap-2.5 select-none"
                    >
                        <Image
                            src="/assets/gdg-logo.png"
                            alt="GDG Logo"
                            width={38}
                            height={38}
                            priority
                            className="shrink-0 w-[38px] h-[38px] object-contain"
                        />
                        <h2
                            ref={logoTextRef}
                            className={`shrink-0 overflow-hidden inline-flex items-center text-lg font-medium tracking-normal text-foreground select-none whitespace-nowrap leading-none opacity-0 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                                }`}
                        >
                            GDG MITWPU
                        </h2>
                    </Link>
                </div>

                {/* Two (long) bar hamburger menu button */}
                <button
                    type="button"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 p-0 border-0 bg-transparent focus:outline-none cursor-pointer select-none overflow-visible"
                >
                    <div className="relative flex flex-col justify-between w-9 sm:w-10 h-3.5 pointer-events-none">
                        <span
                            className={`block w-full h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center shrink-0 ${isOpen ? "translate-y-[6px] rotate-45" : "group-hover:opacity-75"
                                }`}
                        />
                        <span
                            className={`block w-full h-[2px] bg-foreground rounded-full transition-all duration-300 ease-in-out origin-center shrink-0 ${isOpen ? "-translate-y-[6px] -rotate-45" : "group-hover:opacity-75"
                                }`}
                        />
                    </div>
                </button>
            </header>

            {/* Overlay with Staggered Google Color Curtains + Main Menu */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 overflow-hidden w-full h-[100dvh] select-none isolate pointer-events-auto"
                style={{
                    visibility: "hidden",
                    opacity: 0,
                }}
            >
                {/* Safari Status-Bar Tint Anchor: locks iOS Safari dynamic theme-color sampler to pure #090909 at (0, 0) */}
                <div
                    className="absolute top-0 left-0 w-px h-px pointer-events-none"
                    style={{ backgroundColor: "#090909", zIndex: 999 }}
                />

                {/* Google Colors cascading behind the main menu div */}
                {GOOGLE_COLORS.map((color, idx) => (
                    <div
                        key={color}
                        ref={(el) => {
                            colorPanelsRef.current[idx] = el;
                        }}
                        className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
                        style={{
                            backgroundColor: color,
                            zIndex: idx + 1,
                            transform: `translateZ(${idx * 2 + 1}px)`,
                        }}
                    />
                ))}

                {/* Main Menu Panel */}
                <div
                    ref={mainPanelRef}
                    className="absolute -top-[2px] inset-x-0 bottom-0 w-full h-[calc(100%+2px)] bg-background text-foreground flex flex-col justify-between pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] px-6 md:px-12 will-change-transform"
                    style={{
                        zIndex: 10,
                        transform: "translateZ(20px)",
                    }}
                >
                    {/* Navigation Links centered on screen */}
                    <nav className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pb-10 flex flex-col gap-5 sm:gap-6 w-full items-center justify-center my-auto">
                        {NAV_LINKS.map((item, idx) =>
                            item.external ? (
                                <div key={item.label} className="relative">
                                    <a
                                        ref={(el) => {
                                            linksRef.current[idx] = el;
                                        }}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={closeMenu}
                                        className="block text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-light text-foreground/87 tracking-tight select-none cursor-pointer"
                                    >
                                        {item.label}
                                    </a>
                                </div>
                            ) : (
                                <div key={item.label} className="relative">
                                    <Link
                                        ref={(el) => {
                                            linksRef.current[idx] = el;
                                        }}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className="block text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-light text-foreground/87 tracking-tight select-none cursor-pointer"
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            )
                        )}
                    </nav>

                    {/* Social Media Links at the bottom */}
                    <div
                        ref={socialsRef}
                        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 flex items-center justify-center gap-6"
                    >
                        <Link
                            href="https://instagram.com/gdgmitwpu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-80 hover:opacity-100 hover:scale-110 transition-all"
                        >
                            <Image
                                src="/assets/instagram-logo.svg"
                                width={22}
                                height={22}
                                alt="Instagram"
                                className="invert-[1]"
                            />
                        </Link>
                        <Link
                            href="https://www.linkedin.com/company/dscmitwpu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-80 hover:opacity-100 hover:scale-110 transition-all pb-1"
                        >
                            <Image
                                src="/assets/linkedin-logo.svg"
                                width={22}
                                height={22}
                                alt="LinkedIn"
                                className="invert-[1]"
                            />
                        </Link>
                        <Link
                            href="https://x.com/gdgmitwpu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-80 hover:opacity-100 hover:scale-110 transition-all rounded-md"
                        >
                            <Image
                                src="/assets/x-logo.svg"
                                width={20}
                                height={20}
                                alt="X"
                                className="invert-[1]"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}