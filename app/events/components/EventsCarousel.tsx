"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventGroup } from "../data/events-data";
import { EventGroupItem } from "./EventGroupItem";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EventsCarouselProps {
  events: EventGroup[];
  setActiveMonthIndex: (index: number) => void;
  onProgressChange?: (progressPercent: number, isActive: boolean) => void;
}

export function EventsCarousel({ events, setActiveMonthIndex, onProgressChange }: EventsCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || !wrapperRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const slides = gsap.utils.toArray<HTMLElement>(".event-slide", track);
      if (slides.length === 0) return;

      const getSlideOffsets = () => {
        const slides = gsap.utils.toArray<HTMLElement>(".event-slide", track);
        if (slides.length === 0) return { startX: 0, endX: 0, maxScroll: 0, snapPoints: [0] };

        const viewportCenter = window.innerWidth / 2;
        const targetX = slides.map((slide, index) => {
          const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
          return viewportCenter - slideCenter;
        });

        const startX = targetX[0];
        const endX = targetX[targetX.length - 1];
        const maxScroll = Math.abs(startX - endX);

        // Normalize snap points
        const snapPoints = targetX.map((x) => (maxScroll > 0 ? (startX - x) / maxScroll : 0));

        return { startX, endX, maxScroll, snapPoints };
      };

      const { startX, endX, maxScroll, snapPoints } = getSlideOffsets();

      // Early activation ScrollTrigger: illuminates atmospheric grid color earlier as carousel enters viewport (at top 80%)
      ScrollTrigger.create({
        trigger: section,
        end: () => `+=${getSlideOffsets().maxScroll + window.innerHeight}`,
        onToggle: (self) => {
          const mainProgress = stRef.current ? stRef.current.progress : 0;
          onProgressChange?.(mainProgress * 100, self.isActive);
        },
      });

      let cachedSnapPoints = getSlideOffsets().snapPoints;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: true,
          start: "center center", // Pin precisely in the center of the viewport
          end: () => `+=${getSlideOffsets().maxScroll}`,
          invalidateOnRefresh: true,
          onRefresh: () => {
            cachedSnapPoints = getSlideOffsets().snapPoints;
          },
          onUpdate: (self) => {
            const progress = self.progress;
            
            let closestIndex = 0;
            let minDiff = Infinity;
            cachedSnapPoints.forEach((sp, idx) => {
              const diff = Math.abs(sp - progress);
              if (diff < minDiff) {
                minDiff = diff;
                closestIndex = idx;
              }
            });

            setActiveSlideIndex(closestIndex);
            if (events[closestIndex]) {
              setActiveMonthIndex(events[closestIndex].monthIndex);
            }
            onProgressChange?.(progress * 100, true);
          },
        },
      });

      stRef.current = tl.scrollTrigger || null;

      // Smart Momentum Hijacking for Lenis
      let interactionTimeout: NodeJS.Timeout;
      const handleInteractionEnd = () => {
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
          const lenis = (window as any).__lenis;
          const st = stRef.current;
          if (!lenis || !st || !st.isActive) return;

          // Estimate where the current momentum is naturally going to land
          const projectedScroll = lenis.scroll + lenis.velocity * 15; 
          
          // Map that to our ScrollTrigger progress
          const projectedProgress = (projectedScroll - st.start) / (st.end - st.start);
          const clampedProgress = Math.max(0, Math.min(1, projectedProgress));

          // Find the nearest slide to the projected landing spot
          let closestIdx = 0;
          let minDiff = Infinity;
          cachedSnapPoints.forEach((sp, idx) => {
            const diff = Math.abs(sp - clampedProgress);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          // Redirect the remaining momentum smoothly to perfectly land on the slide
          const targetProgress = cachedSnapPoints[closestIdx];
          const targetScroll = st.start + targetProgress * (st.end - st.start);
          
          if (Math.abs(lenis.scroll - targetScroll) > 2) {
             lenis.scrollTo(targetScroll, { lock: false, duration: 0.6, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
          }
        }, 150); // Fire shortly after physical interaction stops, catching the deceleration early
      };

      const handleInteractionStart = () => {
        clearTimeout(interactionTimeout);
      };

      window.addEventListener("wheel", handleInteractionEnd, { passive: true });
      window.addEventListener("touchstart", handleInteractionStart, { passive: true });
      window.addEventListener("touchend", handleInteractionEnd, { passive: true });
      window.addEventListener("keydown", handleInteractionEnd, { passive: true });

      // Using functional values ensures that if the window resizes or layout shifts,
      // GSAP will correctly recalculate the target offsets during ScrollTrigger.refresh()
      tl.fromTo(track, {
        x: () => getSlideOffsets().startX,
      }, {
        x: () => getSlideOffsets().endX,
        ease: "none",
      });

      // Desktop/Large screen scale animations (optional visual flair)
      if (!isMobile) {
        slides.forEach((slide) => {
          // 1) Enter animation (fade/scale IN as it comes from the right)
          gsap.fromTo(
            slide,
            { scale: 0.98, opacity: 0.85 },
            {
              scale: 1, opacity: 1, ease: "power1.out",
              scrollTrigger: {
                trigger: slide,
                containerAnimation: tl,
                start: "left 85%",
                end: "left 45%",
                scrub: true,
              },
            }
          );

          // 2) Exit animation (fade/scale OUT as it goes to the left)
          gsap.fromTo(
            slide,
            { scale: 1, opacity: 1 },
            {
              scale: 0.98, opacity: 0.85, ease: "power1.in",
              immediateRender: false,
              scrollTrigger: {
                trigger: slide,
                containerAnimation: tl,
                start: "right 55%",
                end: "right 15%",
                scrub: true,
              },
            }
          );
        });
      }

      // Cleanup function attached to ctx
      return () => {
        window.removeEventListener("wheel", handleInteractionEnd);
        window.removeEventListener("touchstart", handleInteractionStart);
        window.removeEventListener("touchend", handleInteractionEnd);
        window.removeEventListener("keydown", handleInteractionEnd);
      };
    }); // End of ctx

    ScrollTrigger.refresh();
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(timer);
      stRef.current = null;
      ctx.revert();
    };
  }, [events, setActiveMonthIndex]);

  const scrollToSlide = useCallback((targetIndex: number) => {
    const st = stRef.current || ScrollTrigger.getAll().find((s) => s.trigger === sectionRef.current);
    if (!st) return;

    const clampedIdx = Math.min(events.length - 1, Math.max(0, targetIndex));
    
    // Immediately set active slide state on button click for instantaneous response
    setActiveSlideIndex(clampedIdx);
    if (events[clampedIdx]) {
      setActiveMonthIndex(events[clampedIdx].monthIndex);
    }

    const slides = gsap.utils.toArray<HTMLElement>(".event-slide", trackRef.current);
    const viewportCenter = window.innerWidth / 2;
    const targetX = slides.map((slide) => viewportCenter - (slide.offsetLeft + slide.offsetWidth / 2));
    const startX = targetX[0];
    const maxScroll = Math.abs(startX - targetX[targetX.length - 1]);
    const snapPoints = targetX.map((x) => (maxScroll > 0 ? (startX - x) / maxScroll : 0));

    const targetProgress = snapPoints[clampedIdx] ?? (events.length > 1 ? clampedIdx / (events.length - 1) : 0);

    // Calculate the exact pixel scroll position needed to reach the target slide
    const targetScroll = st.start + targetProgress * (st.end - st.start);

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { 
        lock: true,
        duration: 0.8
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [events, setActiveMonthIndex]);

  return (
    <div ref={wrapperRef} className="relative w-full bg-[#090909] z-10">
      <section
        ref={sectionRef}
        className="relative w-full h-[100svh] flex flex-col justify-center py-safe pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden z-10"
      >
        {/* HORIZONTAL TRACK */}
        <div
          ref={trackRef}
          // items-stretch ensures all slide containers match the height of the tallest slide
          // so controls remain at a consistent distance underneath.
          className="flex items-stretch gap-24 md:gap-14 px-[6vw] md:px-[15vw] w-max will-change-transform"
        >
          {events.map((event, index) => (
            <EventGroupItem key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* NAVIGATION CONTROLS */}
        <div className="mt-auto md:mt-10 px-[6vw] md:px-[15vw] flex items-center justify-center gap-3 flex-col pointer-events-auto select-none">
          <span className="text-xs text-white/50 font-semibold tracking-wider">
            0{activeSlideIndex + 1} / 0{events.length}
          </span>
          <div className="flex items-center justify-center gap-3">
            <button
            type="button"
            onClick={() => scrollToSlide(activeSlideIndex - 1)}
            disabled={mounted ? activeSlideIndex === 0 : true}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-[var(--bg-soft)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg active:scale-95 touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSlide(activeSlideIndex + 1)}
            disabled={mounted ? activeSlideIndex === events.length - 1 : false}
            suppressHydrationWarning
            className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-[var(--bg-soft)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg active:scale-95 touch-manipulation"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          </div>
        </div>
      </section>
    </div>
  );
}
