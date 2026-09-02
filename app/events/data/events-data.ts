export interface AcademicMonth {
  index: number; // 0 (August) to 11 (July)
  name: string; // "AUGUST", "SEPTEMBER", ...
  shortName: string; // "AUG", "SEP", ...
  code: string; // "01", "02", ... "12"
  accent: "blue" | "red" | "yellow" | "green";
  accentHex: string;
}

export const ACADEMIC_MONTHS: AcademicMonth[] = [
  { index: 0, name: "AUGUST", shortName: "AUG", code: "01", accent: "blue", accentHex: "#4285F4" },
  { index: 1, name: "SEPTEMBER", shortName: "SEP", code: "02", accent: "red", accentHex: "#EA4335" },
  { index: 2, name: "OCTOBER", shortName: "OCT", code: "03", accent: "yellow", accentHex: "#D49D00" },
  { index: 3, name: "NOVEMBER", shortName: "NOV", code: "04", accent: "green", accentHex: "#34A853" },
  { index: 4, name: "DECEMBER", shortName: "DEC", code: "05", accent: "blue", accentHex: "#4285F4" },
  { index: 5, name: "JANUARY", shortName: "JAN", code: "06", accent: "red", accentHex: "#EA4335" },
  { index: 6, name: "FEBRUARY", shortName: "FEB", code: "07", accent: "yellow", accentHex: "#D49D00" },
  { index: 7, name: "MARCH", shortName: "MAR", code: "08", accent: "green", accentHex: "#34A853" },
  { index: 8, name: "APRIL", shortName: "APR", code: "09", accent: "blue", accentHex: "#4285F4" },
  { index: 9, name: "MAY", shortName: "MAY", code: "10", accent: "red", accentHex: "#EA4335" },
  { index: 10, name: "JUNE", shortName: "JUN", code: "11", accent: "yellow", accentHex: "#D49D00" },
  { index: 11, name: "JULY", shortName: "JUL", code: "12", accent: "green", accentHex: "#34A853" },
];

export interface EventGroup {
  id: string;
  name: string;
  date?: string;
  monthIndex: number; // 0 to 11
  monthName: string;
  statement: string;
  description: string;
  aspectRatio: "16:9" | "9:16";
  accent: "blue" | "red" | "yellow" | "green";
  accentHex: string;
  metadata?: {
    label: string;
    value: string;
  }[];
  images?: string[];
}

export const EVENT_GROUPS: EventGroup[] = [
  {
    id: "shubharambh",
    name: "Shubharambh",
    date: "SEP 3 & 4, 2026",
    monthIndex: 0, // AUGUST
    monthName: "AUGUST",
    statement: "The beginning of the GDG MIT-WPU year.",
    description: "Our first chance to meet the new batch and give them a glimpse of GDG. From projection mapping to an IoT gaming glove, our stall was buzzing with students checking out projects, trying activities, and meeting our Dino mascot.",
    aspectRatio: "16:9",
    accent: "blue",
    accentHex: "#4285F4",
    images: [
      "/events/shubharambh/photo-1.jpg",
      "/events/shubharambh/photo-2.jpg"
    ]
  },
  {
    id: "other-events",
    name: "Prompt Wars",
    date: "24 & 25 APRIL 2026",
    monthIndex: 8, // APRIL
    monthName: "APRIL",
    statement: "Two days of learning, building, and competing with the latest AI tools.",
    description: "A two-day event in collaboration with Hack2Skill focused on learning, building, and competing. Day one featured hands-on workshops exploring the latest AI tools, while day two hosted developers competing for a cash prize.",
    aspectRatio: "16:9",
    accent: "red",
    accentHex: "#EA4335",
    images: [
      "/events/other-events/photo-1.jpg",
      "/events/other-events/photo-2.jpg",
      "/events/other-events/photo-3.jpg"
    ]
  },
  {
    id: "devolution",
    name: "Devolution",
    date: "27 & 28 MARCH 2026",
    monthIndex: 7, // MARCH
    monthName: "MARCH",
    statement: "Building, collaborating and turning ideas into something real.",
    description: "Our two-day tech event featured workshops, speeches, and panels with industry experts. Highlights included hands-on sessions in AI and web dev, talks from our tech team, and a job fair connecting students with top companies and new opportunities.",
    aspectRatio: "16:9",
    accent: "yellow",
    accentHex: "#D49D00",
    images: [
      "/events/devolution/photo-1.jpg",
      "/events/devolution/photo-2.jpg",
      "/events/devolution/photo-3.jpg",
      "/events/devolution/photo-4.jpg"
    ]
  },
  {
    id: "embark",
    name: "Embark 2025",
    date: "11 AUG 2025",
    monthIndex: 0, // AUGUST
    monthName: "AUGUST",
    statement: "Opening our doors and starting the journey ahead.",
    description: "Our orientation event introducing the GDG community. The admin panel and alumni shared their experiences, plans, and behind-the-scenes insights. With fun games and quizzes, we wrapped up by opening doors for new members to join our journey.",
    aspectRatio: "16:9",
    accent: "yellow",
    accentHex: "#D49D00",
    images: [
      "/events/embark/photo-1.jpg",
      "/events/embark/photo-2.jpg",
      "/events/embark/photo-3.jpg",
      "/events/embark/photo-4.jpg"
    ]
  }
];
