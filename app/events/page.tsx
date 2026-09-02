import type { Metadata } from "next";
import { EventsContainer } from "./components/EventsContainer";
import { JsonLd, breadcrumbJsonLd } from "@/app/components/seo/JsonLd";
import { EVENT_GROUPS } from "./data/events-data";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore the GDG MIT-WPU academic year events — connecting, learning, and growing through tech workshops, hackathons, and community innovation.",
  alternates: { canonical: "https://gdg-mitwpu.in/events" },
  openGraph: {
    title: "Events | GDG MIT-WPU",
    description:
      "Academic-year workshops, hackathons and study jams at GDG MIT-WPU — connecting, learning and growing together.",
    url: "https://gdg-mitwpu.in/events",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GDG MIT-WPU Events" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | GDG MIT-WPU",
    description: "Workshops, hackathons and study jams — GDG MIT-WPU academic year events.",
    images: ["/twitter-image"],
  },
};

function eventsJsonLd() {
  return EVENT_GROUPS.map((ev) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.name,
    description: ev.description,
    url: "https://gdg-mitwpu.in/events",
    image: ev.images?.map((img) => `https://gdg-mitwpu.in${img}`),
    organizer: { "@type": "Organization", name: "GDG MIT-WPU", url: "https://gdg-mitwpu.in" },
    location: {
      "@type": "Place",
      name: "MIT World Peace University, Pune",
      address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
    },
    eventStatus: "https://schema.org/EventScheduled",
  }));
}

export default function EventsPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#090909] text-[#F3F2EE] font-sans selection:bg-[#4285F4]/30 selection:text-white overflow-x-clip">
      <JsonLd data={[...eventsJsonLd(), breadcrumbJsonLd([{ name: "Home", url: "https://gdg-mitwpu.in/" }, { name: "Events", url: "https://gdg-mitwpu.in/events" }])]} />
      <EventsContainer />
    </main>
  );
}
