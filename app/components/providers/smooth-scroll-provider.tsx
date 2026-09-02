"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
        ignoreMobileResize: true,
    });
}

type SmoothScrollProviderProps = {
    children: ReactNode;
};

export function SmoothScrollProvider({
    children,
}: SmoothScrollProviderProps) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const isMobileOrTouch = window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches;

        if (reducedMotion.matches || isMobileOrTouch) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 1,
        });

        lenisRef.current = lenis;
        (window as any).__lenis = lenis;

        // Synchronize Lenis scroll events with ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Keep Lenis updated whenever ScrollTrigger adds pin spacers or recalculates dimensions
        const onRefresh = () => {
            lenis.resize();
        };
        ScrollTrigger.addEventListener("refresh", onRefresh);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        // Watch for document body height changes (pin spacing, dynamic content)
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                lenis.resize();
            });
            resizeObserver.observe(document.body);
        }

        return () => {
            ScrollTrigger.removeEventListener("refresh", onRefresh);
            gsap.ticker.remove(update);
            resizeObserver?.disconnect();
            lenis.destroy();
            lenisRef.current = null;
            delete (window as any).__lenis;
        };
    }, []);

    // On route change: immediately reset scroll to top and refresh ScrollTrigger & Lenis limits
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
        window.scrollTo(0, 0);

        // Staged refreshes to ensure new page DOM, fonts, and GSAP pin-spacers settle cleanly
        const timeouts = [
            setTimeout(() => {
                if (lenisRef.current) {
                    lenisRef.current.scrollTo(0, { immediate: true });
                    lenisRef.current.resize();
                }
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, 50),
            setTimeout(() => {
                if (lenisRef.current) {
                    lenisRef.current.resize();
                }
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, 250),
            setTimeout(() => {
                if (lenisRef.current) {
                    lenisRef.current.resize();
                }
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, 600),
        ];

        return () => {
            timeouts.forEach((t) => clearTimeout(t));
        };
    }, [pathname]);

    return children;
}