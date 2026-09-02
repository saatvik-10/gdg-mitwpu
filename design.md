# GDG MIT-WPU — Design System & Guidelines (`design.md`)

> **Single Source of Truth** for UI/UX design tokens, colors, typography, surface elevations, and component patterns across the GDG MIT-WPU website.

---

## 1. Design Philosophy & Vision

The GDG MIT-WPU design language embodies a **sleek, dark-mode native, premium tech-forward aesthetic** inspired by Google’s modern brand identity and high-end creative web experiences.

- **Dark-First Canvas:** Deep ink blacks provide maximum contrast for vivid Google brand accents.
- **Subtle Depth & Layering:** Built using carefully calibrated surface elevations and hairline borders rather than heavy drop shadows.
- **Typography-Driven:** Crisp, modern Google Sans typography with bold headings and high-legibility body hierarchy.
- **Micro-Interactions & Fluid Motion:** Smooth Lenis scrolling, GSAP/ScrollTrigger reveals, and responsive hover transitions.

---

## 2. Color Palette & Tokens

### 2.1 Backgrounds & Surfaces

| Token Name | Hex / RGBA | CSS Variable | Tailwind Utility | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| **Ink Black** | `#090909` | `--bg-ink` / `--background` | `bg-[#090909]` | **Primary Canvas / Homepage background**, main body layer |
| **Soft Black** | `#111111` | `--bg-soft` | `bg-[#111111]` | **Card backgrounds**, secondary sections, sidebar drawers |
| **Elevated Surface** | `#171717` | `--bg-elevated` | `bg-[#171717]` | **Hover states, modals, popovers, dropdowns, floating elements** |

### 2.2 Borders & Dividers

| Token Name | Value | Tailwind Utility | Usage / Application |
| :--- | :--- | :--- | :--- |
| **Hairline Border** | `rgba(255, 255, 255, 0.12)` | `border-white/[0.12]` | Card borders, section dividers, input outlines, navbars |
| **Hairline Subtle** | `rgba(255, 255, 255, 0.06)` | `border-white/[0.06]` | Subtle nested dividers, inactive tab borders |
| **Hairline Focus** | `rgba(255, 255, 255, 0.25)` | `border-white/[0.25]` | Active card borders, hover states, focused inputs |

### 2.3 Typography & Foreground

| Token Name | Hex Value | Tailwind Utility | Usage / Application |
| :--- | :--- | :--- | :--- |
| **Primary Text** | `#F3F2EE` | `text-[#F3F2EE]` | Headings, hero titles, active labels, primary body |
| **Muted Text** | `#A3A3A3` | `text-[#A3A3A3]` | Subtitles, descriptions, captions, metadata, timestamps |
| **Dimmed Text** | `#666666` | `text-[#666666]` | Footer copyright, placeholder text, disabled actions |

### 2.4 Google Brand Accent Palette

Used for interactive badges, highlights, glow effects, progress states, and brand marks.

| Accent | Hex Value | Background Tint (10% opacity) | Border Tint (25% opacity) | Role / Association |
| :--- | :--- | :--- | :--- | :--- |
| **Google Blue** | `#4285F4` | `bg-[#4285F4]/10` | `border-[#4285F4]/25` | Primary CTA, links, Cloud & AI tracks |
| **Google Red** | `#EA4335` | `bg-[#EA4335]/10` | `border-[#EA4335]/25` | Key highlights, event tags, live indicators |
| **Google Yellow** | `#FBBC04` | `bg-[#FBBC04]/10` | `border-[#FBBC04]/25` | Badges, awards, cautions, community highlights |
| **Google Green** | `#34A853` | `bg-[#34A853]/10` | `border-[#34A853]/25` | Success states, open registrations, active badges |

---

## 3. Typography Hierarchy

### 3.1 Primary Font Family
- **Font Family:** `Google Sans` (`var(--font-google-sans)`), with fallbacks to `Inter`, `system-ui`, `sans-serif`.
- **Import Method:** Configured in Next.js layout via `next/font/google`.

### 3.2 Type Scale & Style Guide

| Level | Size | Weight | Tracking (Letter Spacing) | Line Height | CSS / Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 64px – 96px (4rem – 6rem) | Black (900) / Bold (700) | `-0.03em` (`tracking-tight`) | 1.05 – 1.1 | `text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#F3F2EE]` |
| **Section Title (H1)** | 36px – 48px (2.25rem – 3rem) | Bold (700) | `-0.02em` | 1.15 | `text-3xl md:text-5xl font-bold tracking-tight text-[#F3F2EE]` |
| **Card Header (H2)** | 24px – 30px (1.5rem – 1.875rem) | Semi-Bold (600) | `-0.01em` | 1.25 | `text-xl md:text-2xl font-semibold text-[#F3F2EE]` |
| **Subheading (H3)** | 18px – 20px (1.125rem – 1.25rem) | Medium (500) | `normal` | 1.4 | `text-lg font-medium text-[#F3F2EE]` |
| **Body Large** | 18px (1.125rem) | Regular (400) / Medium (500) | `normal` | 1.6 | `text-lg leading-relaxed text-[#A3A3A3]` |
| **Body Regular** | 16px (1rem) | Regular (400) | `normal` | 1.5 | `text-base leading-normal text-[#A3A3A3]` |
| **Small / Metadata** | 14px (0.875rem) | Medium (500) | `+0.01em` | 1.4 | `text-sm text-[#A3A3A3]` |
| **Overline / Tag** | 12px (0.75rem) | Semi-Bold (600) | `+0.05em` (`tracking-wider`) | 1.0 | `text-xs uppercase font-semibold tracking-wider` |

---

## 4. Elevation & Surface Hierarchy

Build depth through layered backgrounds and crisp hairline borders:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 0: Canvas (Ink Black #090909)                     │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Layer 1: Base Card (Soft Black #111111)         │   │
│   │ Border: rgba(255,255,255,0.12)                  │   │
│   │                                                 │   │
│   │   ┌─────────────────────────────────────────┐   │   │
│   │   │ Layer 2: Elevated Surface (#171717)     │   │   │
│   │   │ (Modal, Dropdown, Active/Hover state)   │   │   │
│   │   │ Border: rgba(255,255,255,0.18)          │   │   │
│   │   └─────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

1. **Canvas Layer (`#090909`):** The foundational page background for all routes.
2. **Surface Layer 1 (`#111111`):** Content cards, member cards, event cards, navigation bars, and section wrappers. Always paired with `border border-white/[0.12]` and rounded corners (`rounded-2xl` or `rounded-3xl`).
3. **Surface Layer 2 (`#171717`):** Hover states of cards, dropdown menus, dialogs, floating action buttons, and tooltips.

---

## 5. Standard Component Guidelines

### 5.1 Cards & Containers (e.g., `MemberCard`, `EventCard`)
- **Background:** `#111111`
- **Border:** `1px solid rgba(255, 255, 255, 0.12)` (`border-white/[0.12]`)
- **Corner Radius:** `rounded-2xl` (16px) or `rounded-3xl` (24px)
- **Padding:** `p-6` to `p-8`
- **Hover State:** Transition to `bg-[#171717]`, `border-white/[0.25]`, and subtle upward translation (`-translate-y-1`).
- **Tailwind Recipe:**
  ```tsx
  <div className="rounded-2xl border border-white/[0.12] bg-[#111111] p-6 text-[#F3F2EE] transition-all duration-300 hover:border-white/[0.25] hover:bg-[#171717] hover:-translate-y-1">
    {/* Card Content */}
  </div>
  ```

### 5.2 Buttons & Interactive Elements

- **Primary Button (Google Blue or Solid White):**
  ```tsx
  <button className="inline-flex items-center justify-center rounded-full bg-[#F3F2EE] px-6 py-3 text-sm font-semibold text-[#090909] transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95">
    Join Community
  </button>
  ```
- **Secondary / Glass Button:**
  ```tsx
  <button className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-[#171717] px-6 py-3 text-sm font-medium text-[#F3F2EE] transition-all duration-200 hover:border-white/[0.25] hover:bg-[#222222] active:scale-95">
    Learn More
  </button>
  ```
- **Accent Brand Buttons (e.g. Google Blue):**
  ```tsx
  <button className="inline-flex items-center justify-center rounded-full bg-[#4285F4] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3367d6] hover:shadow-[0_0_20px_rgba(66,133,244,0.4)] active:scale-95">
    RSVP Now
  </button>
  ```

### 5.3 Badges & Category Tags
Pill badges with translucent Google accent fills and matching borders:
```tsx
{/* Blue Badge */}
<span className="inline-flex items-center gap-1.5 rounded-full border border-[#4285F4]/25 bg-[#4285F4]/10 px-3 py-1 text-xs font-semibold text-[#4285F4]">
  AI & Cloud
</span>

{/* Green Badge */}
<span className="inline-flex items-center gap-1.5 rounded-full border border-[#34A853]/25 bg-[#34A853]/10 px-3 py-1 text-xs font-semibold text-[#34A853]">
  Active
</span>
```

### 5.4 Form Inputs
- **Background:** `#111111`
- **Border:** `border-white/[0.12]`, transitioning to `focus:border-[#4285F4]` and `focus:ring-1 focus:ring-[#4285F4]`
- **Text Color:** `#F3F2EE` with placeholder `#666666`
- **Corner Radius:** `rounded-xl`
```tsx
<input 
  type="text" 
  placeholder="Enter your email" 
  className="w-full rounded-xl border border-white/[0.12] bg-[#111111] px-4 py-3 text-sm text-[#F3F2EE] placeholder-[#666666] transition-colors duration-200 focus:border-[#4285F4] focus:outline-none focus:ring-1 focus:ring-[#4285F4]"
/>
```

---

## 6. Layout, Spacing & Container Standards

- **Maximum Content Widths:**
  - Standard Content Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px)
  - Narrow / Text Container: `max-w-4xl mx-auto px-4 sm:px-6` (896px)
- **Section Spacing:**
  - Desktop vertical padding: `py-24` or `py-32`
  - Mobile vertical padding: `py-16`
- **Grid Layouts:**
  - Team / Member Grid: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
  - Feature / Bento Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`

---

## 7. Motion & Animation Standards

1. **Smooth Scrolling:** Powered by `@studio-freight/lenis` via `<SmoothScrollProvider>`.
2. **Scroll Reveals:** Use GSAP ScrollTrigger for pinned animations, word-by-word text revelations (`SplitText`), and staggered fade-ins.
3. **Transition Durations:**
   - Fast (hovers, tooltips, buttons): `150ms` – `200ms` (`ease-out`)
   - Medium (modals, dropdowns, card lifts): `300ms` (`cubic-bezier(0.16, 1, 0.3, 1)`)
   - Slow (page transitions, large reveals): `500ms` – `800ms`

---

## 8. CSS & Tailwind Code Reference

To keep styling consistent across all files, use these CSS variable definitions and utility classes:

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  /* Core Palette */
  --bg-ink: #090909;
  --bg-soft: #111111;
  --bg-elevated: #171717;
  
  --border-hairline: rgba(255, 255, 255, 0.12);
  
  --text-primary: #F3F2EE;
  --text-muted: #A3A3A3;
  --text-dimmed: #666666;
  
  /* Google Accent Palette */
  --google-blue: #4285F4;
  --google-red: #EA4335;
  --google-yellow: #FBBC04;
  --google-green: #34A853;

  /* Global defaults */
  --background: var(--bg-ink);
  --foreground: var(--text-primary);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-google-sans), system-ui, sans-serif;
  overflow-x: hidden;
}
```
