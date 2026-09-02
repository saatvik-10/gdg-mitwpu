export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

export const SITE_URL = "https://gdg-mitwpu.in";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Google Developer Groups on Campus MIT-WPU",
    alternateName: "GDG MIT-WPU",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/gdg-logo-square.png`,
    description:
      "Official Google Developer Groups on Campus at MIT World Peace University, Pune — student tech community for workshops, hackathons, Cloud & AI study jams.",
    sameAs: [
      "https://instagram.com/gdgmitwpu",
      "https://www.linkedin.com/company/dscmitwpu",
      "https://x.com/gdgmitwpu",
      "https://developers.google.com/community/gdg",
    ],
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "MIT World Peace University",
      url: "https://mitwpu.edu.in",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    location: {
      "@type": "Place",
      name: "MIT World Peace University, Pune",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GDG MIT-WPU",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/events?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
