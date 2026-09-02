"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { NORMALIZED_MEMBERS, MEMBERS_BY_ID, DEPARTMENTS } from "../data/teams-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const TOTAL_MEMBERS = NORMALIZED_MEMBERS.length;
const GDG_COLORS = ["#EA4335", "#4285F4", "#34A853", "#FBBC05"];

export function MembersScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // We cache the exact DOM elements of the cards to calculate their absolute offset within the track.
  const cardsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevScrollFocalRef = useRef<string>(NORMALIZED_MEMBERS[0].id);

  // We no longer use virtual indices, since the list is finite and members appear only once.
  const [scrollFocalMemberId, setScrollFocalMemberId] = useState<string>(NORMALIZED_MEMBERS[0].id);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Track coordinate measurements (populated dynamically on client)
  const dimsRef = useRef({
    cardW: 160,
    gap: 12,
    vw: 1200,
    startTrackX: 0,
    totalTravelDistance: 0,
    cardCenters: [] as { id: string; center: number }[],
  });

  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined" || !trackRef.current || !stageRef.current) return;

    // Use clientWidth to prevent scrollbar from shifting the true center
    const vw = document.documentElement.clientWidth;
    
    if (vw === 0) return;

    let cardW = 160;
    let gap = 12;

    if (vw >= 1536) {
      cardW = 280;
      gap = 24;
    } else if (vw >= 1280) {
      cardW = 240;
      gap = 20;
    } else if (vw >= 1024) {
      cardW = 200;
      gap = 16;
    } else if (vw >= 768) {
      cardW = 160;
      gap = 12;
    } else if (vw >= 400) {
      // Larger, more cinematic focus on mobile
      cardW = 180; 
      gap = 20;
    } else {
      // Tiny mobile screens
      cardW = 150;
      gap = 16;
    }

    // Temporarily reset track x to 0 for accurate measurement
    const currentX = gsap.getProperty(trackRef.current, "x");
    gsap.set(trackRef.current, { x: 0 });

    const trackRect = trackRef.current.getBoundingClientRect();
    const trackWidth = trackRect.width;

    // Start position: center the first card unconditionally
    let startX = vw / 2 - cardW / 2;

    // End position: the very last card is centered at progress = 1
    const endX = vw / 2 - trackWidth + cardW / 2;

    // Total travel required to get from start to end
    const totalTravel = startX - endX;

    // Calculate exact center of each card relative to the track's left edge
    const cardCenters: { id: string; center: number }[] = [];
    cardsRef.current.forEach((el, id) => {
      const elRect = el.getBoundingClientRect();
      cardCenters.push({
        id,
        center: (elRect.left - trackRect.left) + cardW / 2,
      });
    });

    gsap.set(trackRef.current, { x: currentX });

    dimsRef.current = {
      cardW,
      gap,
      vw,
      startTrackX: startX,
      totalTravelDistance: totalTravel,
      cardCenters,
    };

    if (stageRef.current) {
      stageRef.current.style.setProperty("--card-w", `${cardW}px`);
      stageRef.current.style.setProperty("--card-g", `${gap}px`);
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) return;

    // Initial measurement
    updateDimensions();

    const ctx = gsap.context(() => {
      const dims = dimsRef.current;

      gsap.set(trackRef.current, {
        x: dims.startTrackX,
        force3D: true,
      });

      // Make the vertical scroll distance directly proportional to the horizontal travel distance.
      // We multiply by 1.2 to make the scroll speed slightly slower and more deliberate, 
      // preventing users from accidentally skipping members.
      const pinDistance = Math.max(window.innerHeight * 2, dims.totalTravelDistance * 1.2);

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "members-scroll-trigger",
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 2, dimsRef.current.totalTravelDistance * 1.2)}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            updateDimensions();
          },
          onUpdate: (self) => {
            const progress = self.progress; // 0 to 1
            const { startTrackX, totalTravelDistance, vw, cardCenters } = dimsRef.current;

            const currentTrackX = startTrackX - totalTravelDistance * progress;
            const screenCenterRelative = vw / 2 - currentTrackX;
            let closestId = NORMALIZED_MEMBERS[0].id;
            let minDiff = Infinity;

            for (const card of cardCenters) {
              const diff = Math.abs(card.center - screenCenterRelative);
              if (diff < minDiff) {
                minDiff = diff;
                closestId = card.id;
              }
            }

            if (closestId !== prevScrollFocalRef.current) {
              prevScrollFocalRef.current = closestId;
              setScrollFocalMemberId(closestId);
            }
          },
        }
      });

      tl.fromTo(trackRef.current, {
        x: () => dimsRef.current.startTrackX
      }, {
        x: () => dimsRef.current.startTrackX - dimsRef.current.totalTravelDistance,
        ease: "none"
      });

      const st = tl.scrollTrigger;

      const handleResize = () => {
        updateDimensions();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (scrollTweenRef.current) {
          scrollTweenRef.current.kill();
        }
        window.removeEventListener("resize", handleResize);
        st?.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [updateDimensions]);

  // Derive department active highlight
  const activeFocalMember = MEMBERS_BY_ID[scrollFocalMemberId];
  const activeDepartmentId = activeFocalMember ? activeFocalMember.departmentId : DEPARTMENTS[0].id;

  // Exact vertical page scroll targeting based on calculated left offsets
  const handleDepartmentClick = (deptId: string) => {
    const dept = DEPARTMENTS.find((d) => d.id === deptId);
    if (!dept) return;

    const targetHead = MEMBERS_BY_ID[dept.headMemberId];
    if (!targetHead) return;

    const { cardCenters, startTrackX, totalTravelDistance, vw } = dimsRef.current;
    
    const targetCard = cardCenters.find(c => c.id === targetHead.id);
    if (!targetCard) return;

    // Target progress calculated by reversing the onUpdate formula
    let targetProgress = (startTrackX - (vw / 2) + targetCard.center) / totalTravelDistance;
    targetProgress = Math.max(0, Math.min(1, targetProgress));

    const st = ScrollTrigger.getById("members-scroll-trigger");
    if (st) {
      const targetScrollY = st.start + targetProgress * (st.end - st.start);

      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
      }

      scrollTweenRef.current = gsap.to(window, {
        scrollTo: { y: targetScrollY, autoKill: true },
        duration: 1.1,
        ease: "power2.out",
        onComplete: () => {
          scrollTweenRef.current = null;
        },
      });
    }
  };

  // Accessible fallback for reduced motion users
  if (isReducedMotion) {
    return (
      <section className="relative w-full bg-[#090909] text-[#F3F2EE] px-4 sm:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-tighter text-white">
              Our Team
            </h2>
          </div>
          {DEPARTMENTS.map((dept) => {
            const members = NORMALIZED_MEMBERS.filter((m) => m.departmentId === dept.id);
            return (
              <div key={dept.id} className="mb-16">
                <h3 className="text-2xl font-medium mb-6" style={{ color: dept.accentHex }}>{dept.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {members.map((m) => (
                    <div key={m.id} className="flex flex-col group">
                      <div className="relative w-full aspect-[9/16] bg-[#141414] overflow-hidden mb-2.5">
                        <Image
                          src={m.image}
                          alt={m.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover"
                          style={{ objectPosition: m.objectPosition || "center 20%" }}
                        />
                      </div>
                      <div className="text-sm sm:text-base md:text-lg tracking-tight uppercase text-white font-bold mt-1">
                        {m.name}
                      </div>
                      <div className="text-xs sm:text-sm tracking-wider uppercase text-white/70 mt-0.5">
                        {m.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="members-scroll-section"
      className="relative w-full bg-[#090909] text-[#F3F2EE] overflow-hidden select-none"
    >
      <div
        ref={stageRef}
        className="relative w-full h-screen flex flex-col justify-between overflow-hidden px-6 sm:px-10 md:px-16 py-8 md:py-12 z-20"
        style={
          {
            "--card-w": "160px",
            "--card-g": "12px",
          } as React.CSSProperties
        }
      >
        <div className="w-full h-4 pointer-events-none" />

        <div className="relative w-full flex-1 flex flex-col justify-center overflow-visible my-auto">
          <div className="relative w-full flex items-center justify-start">
            
            <div
              ref={trackRef}
              suppressHydrationWarning
              className="flex flex-row w-max items-center will-change-transform select-none py-16 pl-0 mt-16 sm:mt-24 md:mt-32"
            >
              {DEPARTMENTS.map((dept, deptIdx) => {
                const members = NORMALIZED_MEMBERS.filter((m) => m.departmentId === dept.id);
                const isLastDept = deptIdx === DEPARTMENTS.length - 1;

                return (
                  <div 
                    key={dept.id} 
                    className={`relative flex flex-col justify-center ${isLastDept ? "" : "mr-[35vw] sm:mr-[40vw]"}`}
                  >
                    {/* Department Title */}
                    <div 
                      className={`absolute bottom-[calc(100%+96px)] whitespace-nowrap z-10 ${
                        deptIdx === 0 ? "left-0 md:left-1/2 md:-translate-x-1/2 md:flex md:justify-center w-max" : "left-0 w-max"
                      }`}
                    >
                      <h2
                        style={{
                          color: GDG_COLORS[deptIdx % GDG_COLORS.length],
                          fontFamily:
                            dept.id === "tech"
                              ? "var(--font-technical)"
                              : dept.id === "admin"
                              ? "var(--font-google-sans)"
                              : `var(--font-${dept.id})`,
                        }}
                        className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter select-none inline-flex flex-nowrap justify-start items-baseline gap-x-[0.3em]"
                      >
                        {dept.name}
                      </h2>
                    </div>

                    {/* Members Row */}
                    <div className="flex flex-row items-center">
                      {members.map((member, memberIdx) => {
                        const isScrollFocal = scrollFocalMemberId === member.id;
                        const isLastMember = memberIdx === members.length - 1;

                        return (
                          <div
                            key={member.id}
                            ref={(el) => {
                              if (el) cardsRef.current.set(member.id, el);
                              else cardsRef.current.delete(member.id);
                            }}
                            tabIndex={0}
                            aria-label={`${member.name}, ${member.role} (${member.department})`}
                            className="member-tile-wrap relative flex-shrink-0 flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                            style={{
                              width: "var(--card-w, 160px)",
                              marginRight: isLastMember ? "0px" : "var(--card-g, 12px)",
                              zIndex: isScrollFocal ? 30 : 10,
                            }}
                          >
                            {/* TOP: Name (Straddling the top edge half-in, half-out) */}
                            <div
                              className={`absolute top-0 left-0 w-full flex justify-center transition-all duration-300 ease-out pointer-events-none z-20 ${
                                isScrollFocal ? "opacity-100 -translate-y-1/3" : "opacity-0 -translate-y-3/4"
                              }`}
                            >
                              <div className="text-4xl md:text-6xl tracking-wide text-foreground font-bold leading-[0.85] font-bebas-neue text-center px-2 drop-shadow-md">
                                {member.name}
                              </div>
                            </div>

                            {/* Photographic Tile Container */}
                            <div
                              className={`relative w-full aspect-[9/16] bg-[#141414] overflow-hidden transition-transform duration-500 ease-out ${
                                isScrollFocal
                                  ? "scale-105 opacity-100 shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
                                  : "scale-95 opacity-45"
                              }`}
                            >
                              <Image
                                src={member.image}
                                alt={member.alt}
                                fill
                                sizes="(max-width: 768px) 300px, (max-width: 1024px) 300px, (max-width: 1536px) 450px, 600px"
                                className={`object-cover transition-all duration-500 pointer-events-none select-none object-bottom ${
                                  isScrollFocal ? "grayscale-0" : "grayscale"
                                }`}
                                style={{
                                  objectPosition: member.objectPosition || "center 20%",
                                }}
                                priority={deptIdx === 0 && memberIdx < 5}
                              />

                              {/* Gradient Overlay (Darkens top edge for the overlapping text) */}
                              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/80 via-black/50 to-transparent pointer-events-none" />
                            </div>

                            {/* BOTTOM: Role & Department */}
                            <div
                              className={`absolute top-full left-0 mt-4 sm:mt-5 w-full flex flex-col items-center justify-center transition-all duration-300 ease-out pointer-events-none ${
                                isScrollFocal ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                              }`}
                            >
                              <div className="text-sm sm:text-base md:text-lg font-semibold tracking-normal uppercase text-white/90 leading-tight text-center">
                                {member.role}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>


                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
