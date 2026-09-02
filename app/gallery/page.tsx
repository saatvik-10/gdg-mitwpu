import fs from "fs";
import path from "path";
import { Metadata } from "next";
import InfiniteGrid from "./components/InfiniteGrid";
import { JsonLd, breadcrumbJsonLd } from "@/app/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore the events, workshops, and memories of the GDG MIT-WPU community at MIT World Peace University, Pune.",
  alternates: { canonical: "https://gdg-mitwpu.in/gallery" },
  openGraph: {
    title: "Gallery | GDG MIT-WPU",
    description: "Events, workshops and memories from the GDG MIT-WPU community.",
    url: "https://gdg-mitwpu.in/gallery",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GDG MIT-WPU Gallery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | GDG MIT-WPU",
    description: "Events, workshops and memories from the GDG MIT-WPU community.",
    images: ["/twitter-image"],
  },
};

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public/assets/gallery");
  let images: { src: string; alt: string }[] = [];

  try {
    if (fs.existsSync(galleryDir)) {
      const files = fs.readdirSync(galleryDir);
      images = files
        .filter((file) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(file))
        .map((file, idx) => ({
          src: `/assets/gallery/${file}`,
          alt: `GDG MIT-WPU gallery — workshop and event memories ${idx + 1}: ${file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}`,
        }));
    }
  } catch (error) {
    console.error("Error reading gallery directory:", error);
  }

  // Fallback in case folder is empty or missing
  if (images.length === 0) {
    images = [
      {
        src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        alt: "GDG MIT-WPU community event — students collaborating",
      },
    ];
  }

  return (
    <main className="w-full h-[100dvh] bg-[#090909] overflow-hidden fixed inset-0 z-0">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "https://gdg-mitwpu.in/" }, { name: "Gallery", url: "https://gdg-mitwpu.in/gallery" }])} />
      {/* Crawlable fallback for SEO when JS disabled */}
      <noscript>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 pt-24">
          {images.slice(0, 12).map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.src} src={img.src} alt={img.alt} className="w-full h-auto rounded" />
          ))}
          <p className="col-span-full text-center text-white/60 text-sm mt-4">
            GDG MIT-WPU Gallery — events, workshops, hackathons and community memories at MIT World Peace University, Pune.
          </p>
        </div>
      </noscript>
      <InfiniteGrid images={images} />
      
      {/* Subtle Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(9,9,9,0.6)_100%)]" />

      {/* Top Gradient for Text Visibility */}
      <div className="absolute top-0 left-0 w-full h-40 md:h-56 bg-gradient-to-b from-[#090909]/80 via-[#090909]/60 to-transparent z-10 pointer-events-none" />

      {/* Page Title overlay */}
      <div className="absolute top-[calc(1.25rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-20 pointer-events-none mt-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter uppercase font-technical" style={{ textShadow: "0px 4px 20px rgba(0,0,0,0.8)" }}>
          Gallery
        </h1>
      </div>
    </main>
  );
}
