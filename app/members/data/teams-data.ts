export type TeamAccent = "blue" | "red" | "yellow" | "green";

export interface Member {
  name: string;
  role: string;
  img: string;
  isLead?: boolean;
  isPresident?: boolean;
  objectPosition?: string;
}

export interface Team {
  id: string;
  number: string;
  name: string;
  description: string;
  accent: TeamAccent;
  accentHex: string;
  leaders: Member[];
  members: Member[];
}

export interface NormalizedMember {
  id: string;
  index: number;
  formattedIndex: string;
  name: string;
  role: string;
  department: string;
  departmentId: string;
  departmentNumber: string;
  accent: TeamAccent;
  accentHex: string;
  image: string;
  alt: string;
  isPresident: boolean;
  isLead: boolean;
  objectPosition?: string;
}


export const ACCENT_MAP: Record<TeamAccent, string> = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

export const TEAMS_DATA: Team[] = [
  {
    id: "admin",
    number: "00",
    name: "Admin Panel",
    description: "The core leadership driving vision, strategy, and community direction.",
    accent: "red",
    accentHex: "#EA4335",
    leaders: [],
    members: [
      { name: "Raj Deshmukh", role: "President", img: "/assets/members/raj-deshmukh-president.jpeg", isLead: true, isPresident: true },
      { name: "Nevin Abraham", role: "Vice President", img: "/assets/members/nevin-abraham-vp.jpg", isLead: true },
      { name: "Parnika Tiwari", role: "General Secretary", img: "/assets/members/parnika-tiwari-gs.jpg", isLead: true },
      { name: "Manasee Ambhore", role: "Treasurer", img: "/assets/members/manasee-ambhore-treasurer.jpg", isLead: true },
    ],
  },
  {
    id: "tech",
    number: "01",
    name: "Tech",
    description: "Engineering the future through code, architecture, and technical innovation.",
    accent: "blue",
    accentHex: "#4285F4",
    leaders: [
      { name: "Saatvik Madan", role: "Head of Tech", img: "/assets/members/saatvik-tech-head.jpeg", isLead: true },
      { name: "Shalaka Bhor", role: "Co-Head of Tech", img: "/assets/members/shalaka-tech.jpeg", isLead: true },
    ],
    members: [
      { name: "Soham Paranjape", role: "Tech Member", img: "/assets/members/soham-paranjape-tech.jpeg" },
      { name: "Manas Pasarkar", role: "Tech Member", img: "/assets/members/manas-tech.jpeg" },
      { name: "Geet Lunkad", role: "Tech Member", img: "/assets/members/geet-lunkad-tech.jpeg" },
      { name: "Kanak Patil", role: "Tech Member", img: "/assets/members/kanak-tech.jpeg" },
      { name: "Aayushi Jaju", role: "Tech Member", img: "/assets/members/aayushi-jaju-tech.jpeg" },
      { name: "Siddhi Sawant", role: "Tech Member", img: "/assets/members/siddhi-sawant-tech.jpg" },
      { name: "Himanshu Raghav", role: "Tech Member", img: "/assets/members/himanshu-raghav-tech.png" },
      { name: "Swarali Desai", role: "Tech Member", img: "/assets/members/swarali-desai-tech.jpg" },
    ],
  },
  {
    id: "management",
    number: "02",
    name: "Management",
    description: "Orchestrating logistics, operations, and cross-team coordination.",
    accent: "green",
    accentHex: "#34A853",
    leaders: [
      { name: "Shivank Singh", role: "Head of Management", img: "/assets/members/shivank-singh-man-h.jpeg", isLead: true },
      { name: "Roch Lopez", role: "Co-Head of Management", img: "/assets/members/roch-lopez-man-ch.png", isLead: true },
    ],
    members: [
      { name: "Atharva Kumawat", role: "Management Member", img: "/assets/members/atharva-kumawat-man.jpg" },
      { name: "Diptesh Patil", role: "Management Member", img: "/assets/members/diptesh-patil-man.jpeg" },
      { name: "Jeevan Jadhav", role: "Management Member", img: "/assets/members/jeevan-jadhav-man.webp" },
      { name: "Kartikay Shahi", role: "Management Member", img: "/assets/members/kartikay-shahi-man.jpeg" },
      { name: "Praneet Shukla", role: "Management Member", img: "/assets/members/praneet-shukla-man.webp" },
      { name: "Siddhant Mane", role: "Management Member", img: "/assets/members/siddhant-mane-man.jpg" },
      { name: "Sujan Kotian", role: "Management Member", img: "/assets/members/sujan-kotian-man.jpeg" },
    ],
  },
  {
    id: "pr",
    number: "03",
    name: "PR & Sponsorships",
    description: "Building partnerships, securing sponsorships, and amplifying community reach.",
    accent: "yellow",
    accentHex: "#FBBC04",
    leaders: [
      { name: "Sejal Vitthalkar", role: "Head of PR", img: "/assets/members/sejal-vitthalkar-pr-h.jpg", isLead: true },
      { name: "Harsh Jadhav", role: "Co-Head of PR", img: "/assets/members/harsh-jadhav-pr.jpg", isLead: true },
    ],
    members: [
      { name: "Akshata Jadhav", role: "PR Member", img: "/assets/members/akshata-jadhav-pr.webp" },
      { name: "Ameya Patil", role: "PR Member", img: "/assets/members/ameya-patil-pr.jpeg" },
    ],
  },
  {
    id: "marketing",
    number: "04",
    name: "Marketing",
    description: "Crafting campaigns, driving engagement, and growing the community footprint.",
    accent: "red",
    accentHex: "#EA4335",
    leaders: [
      { name: "Ayush KP", role: "Head of Marketing", img: "/assets/members/ayush-kp-marketing-head.jpeg", isLead: true },
    ],
    members: [
      { name: "Yash Bandary", role: "Marketing Member", img: "/assets/members/yash-bandary-marketing.jpeg" },
      { name: "Pratham Jethwani", role: "Marketing Member", img: "/assets/members/pratham-jethwani-marketing.jpeg" },
      { name: "Ved Chavan", role: "Marketing Member", img: "/assets/members/ved-chavan-marketing.jpeg" },
    ],
  },
  {
    id: "design",
    number: "05",
    name: "Design",
    description: "Shaping the visual identity and creative direction.",
    accent: "blue",
    accentHex: "#4285F4",
    leaders: [
      { name: "Joash Jibu", role: "Head of Design", img: "/assets/members/joash-des-h.jpeg", isLead: true },
      { name: "Manya Rao", role: "Co-Head of Design", img: "/assets/members/manya-des-ch.jpeg", isLead: true },
    ],
    members: [
      { name: "Ridheema Andotra", role: "Design Member", img: "/assets/members/ridheema-des.jpeg" },
      { name: "Anagha Naik", role: "Design Member", img: "/assets/members/anagha-naik-des.jpg" },
      { name: "Atharv Naik", role: "Design Member", img: "/assets/members/atharv-naik-des.jpg" },
    ],
  },
  {
    id: "media",
    number: "06",
    name: "Media",
    description: "Capturing moments and driving media production.",
    accent: "green",
    accentHex: "#34A853",
    leaders: [
      { name: "Khushi Shirbhate", role: "Head of Media", img: "/assets/members/khushi-shirbhate-med-h.jpeg", isLead: true },
      { name: "Jayesh Daithankar", role: "Co-Head of Media", img: "/assets/members/jayesh-daithankar-med-ch.jpeg", isLead: true },
      { name: "Samruddhi Raskar", role: "Media Member", img: "/assets/members/samruddhi-raskar-des.jpg" },
    ],
    members: [],
  },
];

export interface Department {
  id: string;
  number: string;
  name: string;
  headMemberId: string;
  accent: TeamAccent;
  accentHex: string;
  description: string;
}

export const NORMALIZED_MEMBERS: NormalizedMember[] = (() => {
  let counter = 0;
  return TEAMS_DATA.flatMap((team) => {
    const teamMembers = [...team.leaders, ...team.members];
    return teamMembers.map((m, idx) => {
      const isPresident = !!(
        m.isPresident ||
        (m.role.toLowerCase().includes("president") && !m.role.toLowerCase().includes("vice"))
      );
      const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const memberIndex = counter++;
      return {
        id: `${team.id}-${slug}-${idx}`,
        index: memberIndex,
        formattedIndex: String(memberIndex + 1).padStart(2, "0"),
        name: m.name,
        role: m.role,
        department: team.name,
        departmentId: team.id,
        departmentNumber: team.number,
        accent: team.accent,
        accentHex: team.accentHex,
        image: m.img,
        alt: `${m.name} - ${m.role} (${team.name})`,
        isPresident,
        isLead: !!m.isLead,
        objectPosition: m.objectPosition || "center 20%",
      };
    });
  });
})();

export const MEMBERS_BY_ID: Record<string, NormalizedMember> = Object.fromEntries(
  NORMALIZED_MEMBERS.map((m) => [m.id, m])
);

export const DEPARTMENTS: Department[] = TEAMS_DATA.map((t) => {
  const head =
    NORMALIZED_MEMBERS.find((m) => m.departmentId === t.id && (m.isPresident || m.isLead)) ||
    NORMALIZED_MEMBERS.find((m) => m.departmentId === t.id)!;

  return {
    id: t.id,
    number: t.number,
    name: t.name,
    headMemberId: head.id,
    accent: t.accent,
    accentHex: t.accentHex,
    description: t.description,
  };
});



