import type { Metadata } from "next";
import { MembersPageClient } from "./components/MembersPageClient";
import { JsonLd, breadcrumbJsonLd } from "@/app/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Members",
  description:
    "Meet the people behind GDG MIT-WPU — leadership, engineering, design, content, and community teams building together.",
  alternates: { canonical: "https://gdg-mitwpu.in/members" },
  openGraph: {
    title: "Members | GDG MIT-WPU",
    description: "The students behind GDG MIT-WPU — leadership, tech, design, media, PR, management and marketing.",
    url: "https://gdg-mitwpu.in/members",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GDG MIT-WPU Members" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Members | GDG MIT-WPU",
    description: "Meet the GDG MIT-WPU team — leadership and 6 departments building together.",
    images: ["/twitter-image"],
  },
};

export default function MembersPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#090909] font-sans text-[#F3F2EE] selection:bg-[#4285F4]/20 overflow-x-hidden">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "https://gdg-mitwpu.in/" }, { name: "Members", url: "https://gdg-mitwpu.in/members" }])} />
      <MembersPageClient />
    </main>
  );
}