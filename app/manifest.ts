import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GDG MIT-WPU — Google Developer Groups on Campus",
    short_name: "GDG MIT-WPU",
    description:
      "Official Google Developer Groups on Campus at MIT World Peace University, Pune — workshops, hackathons, Cloud & AI study jams.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    icons: [
      { src: "/assets/gdg-logo-square.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/assets/gdg-logo-square.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/assets/gdg-logo-square.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
