import type { Metadata } from "next";
import { AboutPageClient } from "./components/AboutPageClient";
import { JsonLd, breadcrumbJsonLd } from "@/app/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "Explore Google Developer Groups on Campus MIT-WPU — our history, collaborative 6-department ecosystem, flagship programs, and student community.",
  alternates: { canonical: "https://gdg-mitwpu.in/about" },
  openGraph: {
    title: "About | GDG MIT-WPU",
    description:
      "History, 6-department ecosystem, flagship programs and community behind GDG MIT-WPU at MIT World Peace University, Pune.",
    url: "https://gdg-mitwpu.in/about",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "About GDG MIT-WPU" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | GDG MIT-WPU",
    description: "History, 6-department ecosystem and flagship programs of GDG MIT-WPU.",
    images: ["/twitter-image"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need prior coding experience to join?",
      acceptedAnswer: { "@type": "Answer", text: "No. GDG MIT-WPU operates across 6 collaborative departments: Technical, Design, Media, PR & Sponsorships, Management, and Marketing. Whether you design in Figma, edit video, organize operations, or code, there is an active place for you." },
    },
    { "@type": "Question", name: "When are Core Team recruitments held?", acceptedAnswer: { "@type": "Answer", text: "Official Core Team recruitments take place annually at the beginning of the academic year. Details and application links are announced on our official Instagram, LinkedIn, and community channels." } },
    { "@type": "Question", name: "Can first-year students and non-CS branches join?", acceptedAnswer: { "@type": "Answer", text: "Yes. Students from all academic years and all branches across MIT World Peace University are eligible to apply and attend all public events." } },
    { "@type": "Question", name: "Are workshops and events free to attend?", acceptedAnswer: { "@type": "Answer", text: "Yes. All regular technical workshops, study jams, speaker webinars, and peer learning sessions organized by GDG MIT-WPU are free and open to students." } },
    { "@type": "Question", name: "How is the chapter connected to Google?", acceptedAnswer: { "@type": "Answer", text: "Google Developer Groups on Campus is a global student developer program supported by Google. Our chapter receives direct guidance, resources, cloud credits, and mentorship from Google Developer Relations teams." } },
  ],
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#090909] text-[#F3F2EE] font-sans overflow-x-hidden selection:bg-[#4285F4]/30 selection:text-white">
      <JsonLd data={[faqJsonLd, breadcrumbJsonLd([{ name: "Home", url: "https://gdg-mitwpu.in/" }, { name: "About", url: "https://gdg-mitwpu.in/about" }])]} />
      <AboutPageClient />
    </main>
  );
}
