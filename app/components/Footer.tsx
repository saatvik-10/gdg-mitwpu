"use client";

import Link from "next/link";
import Image from "next/image";

type PageLink = { label: string; href: string; external?: boolean };
const PAGE_LINKS: PageLink[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Members", href: "/members" },
    { label: "Events", href: "/events" },
    { label: "Join Us", href: "https://recruitment.gdg-mitwpu.in/", external: true },
];

const COMMUNITY_LINKS = [
    { label: "Google Developer Groups", href: "https://developers.google.com/community/gdg", external: true },
    { label: "MIT World Peace University", href: "https://mitwpu.edu.in", external: true },
    { label: "DevFest Pune", href: "/events", external: false },
    { label: "Solution Challenge", href: "/events", external: false },
];

const SOCIAL_LINKS = [
    {
        name: "Instagram",
        href: "https://instagram.com/gdgmitwpu",
        icon: "/assets/instagram-logo.svg",
        invert: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/dscmitwpu",
        icon: "/assets/linkedin-logo.svg",
        invert: true,
    },
    {
        name: "X",
        href: "https://x.com/gdgmitwpu",
        icon: "/assets/x-logo.svg",
        invert: true,
    },
];

export default function Footer() {
    return (
        <footer className="relative w-full bg-background select-none pt-20 sm:pt-16 pb-8 sm:pb-4 px-0 font-sans border-t border-white/5 overflow-hidden">
            <div className="w-full mx-auto flex flex-col justify-between items-center gap-12">
                {/* Top Section: 2 Columns of Links + Socials */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-7xl px-6 md:px-0 w-full gap-10 sm:gap-14 items-start">
                    {/* Column 1: Site Pages */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-silkscreen uppercase tracking-widest text-foreground/40 pb-1">
                            Pages
                        </span>
                        {PAGE_LINKS.map((link) =>
                            link.external ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors w-fit"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors w-fit"
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                    </div>

                    {/* Column 2: Community & Campus */}
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-silkscreen uppercase tracking-widest text-foreground/40 pb-1">
                            Community
                        </span>
                        {COMMUNITY_LINKS.map((link) =>
                            link.external ? (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors w-fit"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors w-fit"
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                    </div>

                    {/* Column 4: Social Links & Location */}
                    <div className="flex flex-col gap-4 col-span-2 sm:col-span-1 md:col-span-2 md:items-end">
                        <span className="text-xs font-silkscreen uppercase tracking-widest text-foreground/40 pb-1">
                            Connect
                        </span>
                        <div className="flex items-center gap-5">
                            {SOCIAL_LINKS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="opacity-70 hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                                >
                                    <Image
                                        src={social.icon}
                                        alt={social.name}
                                        width={20}
                                        height={20}
                                        className={social.invert ? "invert-[1]" : "grayscale-[1]"}
                                    />
                                </a>
                            ))}
                        </div>
                        <span className="text-xs text-foreground/40 font-mono pt-1">
                            Pune, Maharashtra, India
                        </span>
                    </div>
                </div>

                {/* Bottom Section: Massive Wordmark with inline right-aligned Copyright */}
                <div className="w-full pt-8 sm:pt-14 px-2 md:px-6 flex flex-col md:flex-row items-start md:items-baseline justify-between md:gap-4 gap-2">
                    <div aria-hidden="true" className="text-[14.5vw] md:text-[12.5vw] tracking-tighter leading-none text-foreground/90 font-medium select-none text-left inline-flex items-center gap-2">
                        <div className="relative w-[1.5em] aspect-[8.5/5] md:w-[1.25em]">
                            <Image src={"/assets/gdg-logo.png"} alt="GDG MIT-WPU logo" fill />
                        </div>
                        <span className="text-[12.5vw] md:text-[10.5vw]">MITWPU</span>
                    </div>

                    <div className="flex flex-col items-start md:items-end text-xs text-foreground/40 font-mono shrink-0 gap-1 pb-1">
                        <span>© 2026 GDG MIT-WPU</span>
                        <span>Google Developer Groups on Campus</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

