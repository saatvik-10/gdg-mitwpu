"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

interface MemberCardProps {
  name: string;
  role: string;
  img?: string;
  accentHex?: string;
  isLead?: boolean;
  index?: number;
  hideText?: boolean;
  customAspect?: string;
}

export function MemberCard({
  name,
  role,
  img,
  hideText = false,
  customAspect = "aspect-[9/16]",
}: MemberCardProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [isMobileActive, setIsMobileActive] = useState(false);

  const animateIn = () => {
    if (visualRef.current) {
      gsap.to(visualRef.current, {
        y: -6,
        scale: 1.04,
        boxShadow: "0 22px 40px rgba(0, 0, 0, 0.4)",
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (infoRef.current) {
      gsap.to(infoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const animateOut = () => {
    if (visualRef.current) {
      gsap.to(visualRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 10px 24px rgba(0, 0, 0, 0.22)",
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (infoRef.current) {
      gsap.to(infoRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }
    animateIn();
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }
    animateOut();
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      if (isMobileActive) {
        animateOut();
        setIsMobileActive(false);
      } else {
        window.dispatchEvent(new CustomEvent("member-card-opened", { detail: { name } }));
        animateIn();
        setIsMobileActive(true);
      }
    }
  };

  useEffect(() => {
    const handleOtherCardOpened = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string }>;
      if (customEvent.detail?.name !== name && isMobileActive) {
        animateOut();
        setIsMobileActive(false);
      }
    };


    window.addEventListener("member-card-opened", handleOtherCardOpened);
    return () => window.removeEventListener("member-card-opened", handleOtherCardOpened);
  }, [name, isMobileActive]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="member-card relative w-full flex flex-col max-w-[320px] mx-auto cursor-pointer select-none touch-manipulation active:scale-[0.99] transition-transform duration-150"
    >
      {/* 1. Unified Portrait Visual Assembly (Card Background + Cutout Image + Shared Shadow) */}
      <div
        ref={visualRef}
        className={`member-card-visual relative w-full ${customAspect} rounded-[8px] bg-[#E9E5DC] shadow-[0_10px_24px_rgba(0,0,0,0.22)] will-change-transform overflow-hidden`}
      >
        {/* Member Image Layer */}
        {img && (
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="member-image object-cover object-center pointer-events-none select-none z-10 transition-transform duration-500"
          />
        )}

        {/* Gradient Overlay on hover */}
        {!hideText && (
          <div
            ref={gradientRef}
            className="mobile-text-overlay absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:opacity-0 opacity-0 pointer-events-none"
          />
        )}

        {/* 2. Member Information Overlay */}
        {!hideText && (
          <div
            ref={infoRef}
            className="mobile-text-overlay member-info absolute bottom-0 inset-x-0 z-30 p-4 sm:p-5 flex flex-col text-left md:opacity-0 opacity-0 md:translate-y-[10px] translate-y-0 pointer-events-none"
          >
            <h3 className="member-name text-base sm:text-lg md:text-xl font-medium text-foreground tracking-tight leading-none break-words drop-shadow-md">
              {name}
            </h3>
            <p className="member-role mt-1 text-xs sm:text-sm text-gray-200 font-medium leading-normal break-words drop-shadow-sm">
              {role}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


