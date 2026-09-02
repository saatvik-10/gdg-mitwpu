import type { Metadata, Viewport } from "next";
import { Google_Sans, Silkscreen, Micro_5, Felipa, Monofett, Manufacturing_Consent, Labrada, Tagesschrift, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/app/components/providers/smooth-scroll-provider";
import NavMenu from "./components/NavMenu";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/app/components/seo/JsonLd";

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-google-sans",
  display: "swap",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  display: "swap",
});

const micro5 = Micro_5({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-technical",
  display: "swap",
});

const felipa = Felipa({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-design",
  display: "swap",
});

const monofett = Monofett({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-media",
  display: "swap",
});

const manufacturingConsent = Manufacturing_Consent({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pr",
  display: "swap",
});

const tagesschrift = Tagesschrift({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-management",
  display: "swap",
});

const labrada = Labrada({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marketing",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const SITE_URL = "https://gdg-mitwpu.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GDG MIT-WPU — Google Developer Groups on Campus",
    template: "%s | GDG MIT-WPU",
  },
  description:
    "Official Google Developer Groups on Campus at MIT World Peace University, Pune — student tech community for workshops, hackathons, Cloud & AI study jams, and 6 collaborative departments building together.",
  keywords: [
    "GDG MITWPU",
    "GDG MIT-WPU",
    "Google Developer Groups MIT-WPU",
    "Google Developer Groups Pune",
    "MIT WPU tech community",
    "MITWPU hackathons",
    "GDG Pune",
    "GDG on Campus",
  ],
  authors: [{ name: "GDG MIT-WPU", url: SITE_URL }],
  creator: "GDG MIT-WPU",
  publisher: "GDG MIT-WPU",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "GDG MIT-WPU",
    title: "GDG MIT-WPU — Google Developer Groups on Campus",
    description:
      "Pune's student tech community at MIT World Peace University — workshops, hackathons, Cloud & AI jams, and 6 departments building together. Learn, build, and grow with us.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GDG MIT-WPU — Google Developer Groups on Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG MIT-WPU — Google Developer Groups on Campus",
    description:
      "Pune's student tech community at MIT-WPU — workshops, hackathons, Cloud & AI jams, and 6 departments building together.",
    images: ["/twitter-image"],
    creator: "@gdgmitwpu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/gdg-logo-square.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/assets/gdg-logo-square.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/assets/gdg-logo-square.png",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${silkscreen.variable} ${googleSans.variable} ${micro5.variable} ${felipa.variable} ${monofett.variable} ${manufacturingConsent.variable} ${tagesschrift.variable} ${labrada.variable} ${bebasNeue.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SmoothScrollProvider>
          <NavMenu />
          {children}
        </SmoothScrollProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
