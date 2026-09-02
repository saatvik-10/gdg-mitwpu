"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="h-[100dvh] w-full flex flex-col justify-center items-center px-4 overflow-hidden relative select-none bg-[#090909] text-[#F3F2EE]">
            {/* Dark, subtle background matching the Hero */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image src={"/assets/bg.jpeg"} alt="Background" fill priority className="object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/80 via-[#090909]/90 to-[#090909]/95 backdrop-blur-md" />
            </div>
            
            <div className="flex flex-col items-center justify-center max-w-full relative z-10">
                
                {/* 404 Bracket Wrapper */}
                <div className="flex items-center justify-center">
                    {/* Left bracket (<) - grayscale and static */}
                    <div className="relative z-30 shrink-0 flex items-center justify-center h-20 xs:h-22 sm:h-26 md:h-28 aspect-[294/346] grayscale opacity-40">
                        <Image src="/assets/gdg-logo-left.png" alt="Left" fill priority className="object-contain drop-shadow-md" />
                    </div>
                    
                    {/* Center Content - static */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground/95 leading-none drop-shadow-xl px-0">
                        404
                    </h1>
                    
                    {/* Right bracket (>) - grayscale and static */}
                    <div className="relative z-30 shrink-0 flex items-center justify-center h-20 xs:h-22 sm:h-26 md:h-28 aspect-[294/346] grayscale opacity-40">
                        <Image src="/assets/gdg-logo-right.png" alt="Right" fill priority className="object-contain drop-shadow-md" />
                    </div>
                </div>

                {/* Secondary Info & Actions */}
                <p className="mt-2 text-lg text-[#A3A3A3] text-center">
                    Not Found
                </p>
                
                <Link href="/" className="mt-4 inline-flex items-center justify-center rounded-full bg-bg-elevated px-6 py-3 text-sm font-medium text-[#F3F2EE] transition-all duration-200 hover:border-white/[0.25] hover:bg-[#222222] active:scale-95">
                    Return to Home
                </Link>
            </div>
        </main>
    );
}
