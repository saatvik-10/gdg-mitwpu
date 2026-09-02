# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Undergraduate and graduate engineering/CS students at MIT World Peace University (MIT-WPU), Pune, seeking to learn Google technologies, attend workshops/hackathons, collaborate on technical projects, and connect with peer developers.
- **Secondary:** Aspiring student leaders and contributors applying for the annual GDG MIT-WPU core team recruitment; industry speakers, alumni mentors, and sponsors evaluating community reach and collaboration opportunities.

## Product Purpose

The GDG MIT-WPU platform serves as the official digital headquarters and community portal for Google Developer Groups on Campus at MIT-WPU. It facilitates campus developer engagement through frictionless event discovery and registration (RSVP for bootcamps, workshops, hackathons), community onboarding (Discord, WhatsApp, and social channels), and transparent showcases of student team leadership and technical domains. Success is measured by active event participation, registration completion, and campus community growth.

## Positioning

The authoritative, student-led campus developer hub directly bridging MIT-WPU students with Google developer technologies, peer-to-peer technical mentorship, and real-world project building, tailored specifically to the MIT-WPU Pune academic ecosystem.

## Operating Context

- Multi-device responsive web application accessed frequently via mobile smartphones (via campus poster QR codes, WhatsApp announcements, and social links) and desktop workstations (during hackathons, hands-on coding workshops, and project collaboration).
- Fast, fluid browsing with smooth scrolling, crisp surface contrast in ambient or dark environments, and responsive navigation across all viewport widths.

## Capabilities and Constraints

- **Capabilities:**
  - Dynamic landing page (`/`) featuring hero branding, department tracks, community motto, spotlighted events, and call-to-action onboarding.
  - Dedicated Events directory (`/events`) with track categorization, chronological listings, and direct RSVP flows.
  - Dedicated Members portal (`/members`) showcasing team leadership, department leads, core members, and social profiles.
  - Smooth scroll acceleration powered by Lenis and choreographed scroll animations powered by GSAP.
- **Constraints:**
  - Minimal, clean aesthetic with no extraneous screens, modals, or redundant interactions.
  - React 19 functional components utilizing standard hooks (`useState`, `useEffect`, `useRef`).
  - Strict adherence to Tailwind CSS v4 design token variables.

## Brand Commitments

- **Entity & Identity:** Google Developer Groups on Campus — MIT World Peace University (GDG MIT-WPU).
- **Binding Design System Tokens:**
  - **Ink Black (Canvas):** `#090909`
  - **Soft Black (Card / Base Surface):** `#111111`
  - **Elevated Surface (Modals / Hovers):** `#171717`
  - **Hairline Border:** `rgba(255, 255, 255, 0.12)`
  - **Primary Text:** `#F3F2EE`
  - **Muted Text:** `#A3A3A3`
  - **Google Brand Palette:**
    - Blue: `#4285F4`
    - Red: `#EA4335`
    - Yellow: `#FBBC04`
    - Green: `#34A853`
- **Typography:** Google Sans as primary UI font; Silkscreen for accent tags and retro-technical badges.
- **Voice:** Technically credible, welcoming, energetic, and community-driven.

## Evidence on Hand

- **Existing Routes:** `/` (Home), `/events` (Events Directory), `/members` (Team & Leads Directory).
- **Active Technical Tracks:** Web Development, Cloud & DevOps, Machine Learning & AI, Android Development, UI/UX Design, Management & PR.
- **Brand Assets:** GDG visual brackets (`/public/assets/gdg-logo-left.png`, `/public/assets/gdg-logo-right.png`).

## Product Principles

1. **Developer-Centric Clarity:** Put event schedules, RSVP actions, and track resources directly in focus without unnecessary decorative obstacles.
2. **Frictionless Onboarding:** Keep pathways from event discovery to registration as immediate and seamless as possible.
3. **Calibrated Dark Elegance:** Ground the UI in deep ink surfaces with subtle hairline elevations and purposeful Google four-color highlights.
4. **Purposeful Motion:** Use fluid transitions and reveals to guide attention and communicate spatial hierarchy, never for gratuitous flair.

## Accessibility & Inclusion

- High contrast text hierarchy adhering to WCAG AA standards against deep dark canvases (`#090909` / `#111111`).
- Semantic HTML landmarks (`<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`, `<button>`, `<a>`) with visible keyboard focus rings.
- Respect for user motion preferences (`prefers-reduced-motion`).
