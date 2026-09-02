"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export type GalleryImage = {
  src: string;
  alt: string;
};

// We use generous cell counts to guarantee off-screen wrapping even on ultrawide monitors.
const COLS = 14; // Must be even for seamless staggering
const ROWS = 8;

const FRICTION = 0.88; // Lower friction = stops sooner, covers less distance
const DRAG_SMOOTHING = 0.08; // Lower = heavier, smoother pull
const DRAG_RESISTANCE = 0.85; // Increased drag coverage

type Props = {
  images: GalleryImage[];
};

export default function InfiniteGrid({ images }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial dummy cells for React render.
  // Real coordinates and dimensions are applied by GSAP instantly on mount.
  const cellsRef = useRef(
    Array.from({ length: COLS * ROWS }).map((_, i) => {
      const col = i % COLS;
      
      // Give each column a distinct, semi-random shear magnitude to break uniformity.
      // Keeps alternating up/down directions but randomizes how far they shift.
      const colDir = col % 2 === 0 ? 1 : -1;
      const magnitude = 0.4 + Math.abs(Math.sin(col * 74.543)) * 1.2;
      const shearMultiplier = colDir * magnitude;
      
      const row = Math.floor(i / COLS);

      const L = Math.max(images.length, 1);
      // Pick a step size that is guaranteed not to divide evenly into the number of images
      const step = (L % 3 !== 0) ? 3 : (L % 5 !== 0) ? 5 : 7;
      
      return {
        id: i,
        col,
        row,
        baseX: 0,
        baseY: 0,
        shearMultiplier,
        currentSpeedScale: 1, // Lerped scale based on drag speed
        
        // Col offset ensures adjacent columns never start on the same image.
        // Row steps sequentially to ensure the same column never repeats vertically.
        image: images[(row + col * step) % L],
      };
    })
  );

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let dragTargetX = 0;
    let dragTargetY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let smoothedVelX = 0;
    let smoothedVelY = 0;
    let lastTime = 0;
    let lastDragX = 0;
    let lastDragY = 0;
    let lastCurrentX = 0;
    let lastCurrentY = 0;
    
    let lastPointerX = 0;
    let lastPointerY = 0;

    // These will be overridden immediately on resize/mount
    let wrapX = gsap.utils.wrap(0, 0);
    let wrapY = gsap.utils.wrap(0, 0);

    const updateLayout = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      let step, itemSize;
      const gap = 4; // 8px gap

      if (vw < 768) {
        // Mobile: Fit ~1.6 columns
        step = vw / 1.6;
        itemSize = step - gap;
      } else {
        // Desktop: Fit ~4 columns
        step = vw / 4.2; 
        itemSize = step - gap;
      }

      // Cap size for huge ultrawide displays
      if (itemSize > 400) {
        itemSize = 400;
        step = 400 + gap;
      }

      const tileWidth = COLS * step;
      const tileHeight = ROWS * step;

      wrapX = gsap.utils.wrap(-tileWidth / 2, tileWidth / 2);
      wrapY = gsap.utils.wrap(-tileHeight / 2, tileHeight / 2);

      cellsRef.current.forEach((cell, i) => {
        const staggerY = cell.col % 2 === 1 ? step / 2 : 0;
        cell.baseX = cell.col * step - tileWidth / 2;
        cell.baseY = cell.row * step - tileHeight / 2 + staggerY;

        const el = itemRefs.current[i];
        if (el) {
          gsap.set(el, {
            width: itemSize,
            height: itemSize,
            marginLeft: -itemSize / 2,
            marginTop: -itemSize / 2,
            borderRadius: Math.max(4, itemSize * 0.015),
          });
        }
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      
      velocityX = 0;
      velocityY = 0;
      lastDragX = dragTargetX;
      lastDragY = dragTargetY;
      lastTime = gsap.ticker.time;
      
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      
      // Apply drag resistance so it feels heavy and covers less distance
      dragTargetX += dx * DRAG_RESISTANCE;
      dragTargetY += dy * DRAG_RESISTANCE;
      
      const now = gsap.ticker.time;
      const dt = now - lastTime;
      if (dt > 0) {
        velocityX = (dragTargetX - lastDragX) / dt;
        velocityY = (dragTargetY - lastDragY) / dt;
        lastTime = now;
        lastDragX = dragTargetX;
        lastDragY = dragTargetY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    container.style.cursor = "grab";

    const tick = () => {
      if (isDragging) {
        currentX += (dragTargetX - currentX) * DRAG_SMOOTHING;
        currentY += (dragTargetY - currentY) * DRAG_SMOOTHING;
      } else {
        // Apply subtle, constant automatic upward scrolling, adjusted for frame rate
        currentY -= 0.35 * gsap.ticker.deltaRatio(); 

        velocityX *= FRICTION;
        velocityY *= FRICTION;
        
        if (Math.abs(velocityX) < 0.1) velocityX = 0;
        if (Math.abs(velocityY) < 0.1) velocityY = 0;
        
        const dt = 0.016;
        currentX += velocityX * dt;
        currentY += velocityY * dt;
        
        dragTargetX = currentX;
        dragTargetY = currentY;
      }

      smoothedVelX += (velocityX - smoothedVelX) * 0.1;
      smoothedVelY += (velocityY - smoothedVelY) * 0.1;

      // Calculate true visual speed based on how much the grid actually moved this frame
      const dx = currentX - lastCurrentX;
      const dy = currentY - lastCurrentY;
      lastCurrentX = currentX;
      lastCurrentY = currentY;
      
      const visualSpeed = Math.sqrt(dx * dx + dy * dy) * 60;
      
      const normalizedSpeed = Math.min(visualSpeed / 50, 1);
      // Extremely subtle scale amount: max 1% reduction (0.99)
      const targetSpeedScale = 1 - (normalizedSpeed * 0.01); 

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxRadius = Math.max(vw, vh) * 0.6; 

      for (let i = 0; i < cellsRef.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        
        const cell = cellsRef.current[i];
        const trueX = wrapX(cell.baseX + currentX);
        const trueY = wrapY(cell.baseY + currentY);
        
        // Apply individualized column shear magnitude to break uniformity
        const shearY = cell.shearMultiplier * (smoothedVelX * 0.0035 + smoothedVelY * 0.002);

        // Slowed down the interpolation (0.08 instead of 0.3) for a much softer, lazier ease back in
        cell.currentSpeedScale += (targetSpeedScale - cell.currentSpeedScale) * 0.08;

        // Extremely subtle edge fade: max 1% reduction (0.99)
        const distFromCenter = Math.sqrt(trueX * trueX + (trueY + shearY) ** 2);
        const edgeScale = 1 - Math.min(distFromCenter / maxRadius, 1) * 0.01; 

        const finalScale = cell.currentSpeedScale * edgeScale;

        gsap.set(el, { 
          x: trueX, 
          y: trueY + shearY,
          scale: finalScale,
        });
      }
    };

    gsap.ticker.add(tick);

    const elements = itemRefs.current.filter(Boolean);
    gsap.fromTo(
      elements,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: { amount: 0.3, from: "center" },
        ease: "power2.out",
        delay: 0.1,
        clearProps: "opacity", // Clear opacity so it doesn't conflict, keep scale dynamic
      }
    );

    return () => {
      window.removeEventListener("resize", updateLayout);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#090909] touch-none select-none"
    >
      <div className="absolute top-1/2 left-1/2 w-0 h-0">
        {cellsRef.current.map((cell, i) => (
          <div
            key={cell.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute bg-[#111] overflow-hidden"
            style={{
              willChange: "transform",
            }}
          >
            <Image
              src={cell.image.src}
              alt={cell.image.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover pointer-events-none will-change-transform"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
