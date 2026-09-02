"use client";

import React, { forwardRef, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface ImagePlaceholderProps {
  title: string;
  aspectRatio?: "16:9" | "9:16";
  accentHex: string;
  images?: string[];
  imageSrc?: string;
  className?: string;
}

export const ImagePlaceholder = forwardRef<HTMLDivElement, ImagePlaceholderProps>(
  ({ title, aspectRatio = "16:9", accentHex, images, imageSrc, className = "" }, ref) => {
    const galleryImages = images && images.length > 0 ? images : imageSrc ? [imageSrc] : [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tapFeedback, setTapFeedback] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Preload next & previous images immediately, and remaining progressively
    useEffect(() => {
      if (galleryImages.length <= 1) return;

      const nextIdx = (currentIndex + 1) % galleryImages.length;
      const prevIdx = (currentIndex - 1 + galleryImages.length) % galleryImages.length;

      const imgNext = new window.Image();
      imgNext.src = galleryImages[nextIdx];

      const imgPrev = new window.Image();
      imgPrev.src = galleryImages[prevIdx];

      const timer = setTimeout(() => {
        galleryImages.forEach((src) => {
          const img = new window.Image();
          img.src = src;
        });
      }, 300);

      return () => clearTimeout(timer);
    }, [currentIndex, galleryImages]);

    const handleNext = useCallback(() => {
      if (galleryImages.length <= 1) return;
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
      setTapFeedback(true);
      setTimeout(() => setTapFeedback(false), 180);
    }, [galleryImages.length]);

    // Auto-advance images
    useEffect(() => {
      if (galleryImages.length <= 1) return;
      const timer = setTimeout(() => {
        handleNext();
      }, 4000);
      return () => clearTimeout(timer);
    }, [currentIndex, galleryImages.length, handleNext]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (galleryImages.length <= 1 || !containerRef.current) return;
      handleNext();
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        onClick={handleClick}
        className={`relative overflow-hidden rounded-xs bg-[#0d0e12] border border-white/10 aspect-[16/9] cursor-pointer group select-none touch-manipulation ${className}`}
      >
        {galleryImages.length > 0 ? (
          <>
            {/* Instagram Story Progress Bars */}
            {galleryImages.length > 1 && (
              <div className="absolute top-0 left-0 right-0 z-30 flex gap-0.5 pointer-events-none">
                {galleryImages.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-1 flex-1 rounded-sm overflow-hidden bg-white/20 backdrop-blur-xs transition-all duration-300"
                  >
                    <div
                      className="h-full rounded-sm transition-all duration-200"
                      style={{
                        width: idx <= currentIndex ? "100%" : "0%",
                        backgroundColor: idx === currentIndex ? "#FFFFFF" : idx < currentIndex ? "rgba(255, 255, 255, 0.75)" : "transparent",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Gallery Images Render Stack */}
            {galleryImages.map((src, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-200 ease-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${title} photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 88vw, (max-width: 1200px) 70vw, 65vw"
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              );
            })}

            {/* Subtle Gradient Overlays for Story Feel */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none" />

            {/* Tap Feedback Flash */}
            {tapFeedback && (
              <div className="absolute inset-0 z-30 bg-white/10 animate-pulse pointer-events-none" />
            )}
          </>
        ) : (
          /* Embedded Graphic Fallback */
          <div className="w-full h-full flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-br from-[#141414] via-[#101010] to-[#080808] select-none">
            <div className="flex items-center justify-between font-mono text-xs font-semibold text-white/30 tracking-wider leading-none">
              <span>ASPECT // {aspectRatio}</span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accentHex }}
              />
            </div>

            <div className="my-auto flex flex-col items-center justify-center text-center">
              <div className="font-mono text-xs sm:text-sm font-semibold tracking-wider leading-none text-[#F3F2EE]/80 uppercase">
                {title}
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs font-semibold text-white/20 tracking-wider leading-none">
              <span>GDG MIT-WPU</span>
              <span>EVENTS</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ImagePlaceholder.displayName = "ImagePlaceholder";
