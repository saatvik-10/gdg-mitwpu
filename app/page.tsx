import type { Metadata } from "next";
import ScrollMotto from "@/app/components/ScrollMotto";
import Departments from "./components/Departments";
import Hero from "./components/Hero";
import AboutPara from "./components/AboutPara";
import EventsSpotlight from "./components/EventsSpotlight";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "GDG MIT-WPU — Google Developer Groups on Campus",
  },
  description:
    "GDG MIT-WPU at MIT World Peace University, Pune — join our student tech community for hands-on workshops, hackathons, Cloud & AI jams, and 6 departments. Learn, build, and grow with us.",
  alternates: { canonical: "https://gdg-mitwpu.in/" },
  openGraph: {
    title: "GDG MIT-WPU — Google Developer Groups on Campus",
    description:
      "Pune's student tech community at MIT-WPU — workshops, hackathons, Cloud & AI jams, and 6 collaborative departments.",
    url: "https://gdg-mitwpu.in/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GDG MIT-WPU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG MIT-WPU — Google Developer Groups on Campus",
    description: "Pune's student tech community at MIT-WPU — workshops, hackathons, Cloud & AI jams.",
    images: ["/twitter-image"],
  },
};

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-bg-ink font-sans text-text-primary overflow-x-hidden">
      <Hero />
      <AboutPara />
      <ScrollMotto />
      <Departments />
      <EventsSpotlight />
      <CTA />
      <Footer />
    </div>
  );
}
