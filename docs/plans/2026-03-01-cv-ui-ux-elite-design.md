# CV UI/UX Elite Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate all 10 CV templates from "clean" to "elite" with hanging indents, impact bolding, bento grid arsenal, skill-to-experience filtering, action contact cards, and typography harmony.

**Architecture:** Shared utilities (parseBold, SkillHighlightContext, techBrandColors) provide cross-template functionality. Each of the 10 templates gets tailored CSS/JSX changes respecting its unique design language. Templates fall into two pattern groups: 6 use SectionHeader + shared class names (Arctic, Glass, Neon, Terminal, Editorial, Noir) and 4 have custom structures (DarkEmber, ExecutivePro, MidnightPortfolio, MonochromeSplit).

**Tech Stack:** Next.js 14, React 18, CSS Modules, Framer Motion, TypeScript

---

## Task 1: Create `parseBold` utility

**Files:**
- Create: `src/utils/parseBold.tsx`

**Step 1: Create the utility**

```tsx
// src/utils/parseBold.tsx
import React from 'react';

export function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/parseBold.tsx
git commit -m "feat: add parseBold utility for impact-first bolding"
```

---

## Task 2: Create `techBrandColors` utility

**Files:**
- Create: `src/utils/techBrandColors.ts`

**Step 1: Create the color map**

```ts
// src/utils/techBrandColors.ts
export const techBrandColors: Record<string, string> = {
  'React': '#61DAFB',
  'Next.js': '#000000',
  'Next.js 14': '#000000',
  'TypeScript': '#3178C6',
  'Gatsby': '#663399',
  'Storybook': '#FF4785',
  'Material UI': '#007FFF',
  'MUI': '#007FFF',
  'Zustand': '#443E38',
  'React Query': '#FF4154',
  'Webpack': '#8DD6F9',
  'Node.js': '#339933',
  'Nest.js': '#E0234E',
  'Express.js': '#000000',
  'GraphQL': '#E10098',
  'REST APIs': '#6BA539',
  'Kotlin': '#7F52FF',
  'Spring Boot': '#6DB33F',
  'Microservices': '#FF6F00',
  'PostgreSQL': '#336791',
  'Redis': '#DC382D',
  'Docker': '#2496ED',
  'CI/CD': '#40BE46',
  'Git': '#F05032',
  'Monorepo (Lerna)': '#9333EA',
  'Lerna': '#9333EA',
  'Changesets': '#26A69A',
  'Jest': '#C21325',
  'React Testing Library': '#E33332',
  'Playwright': '#2EAD33',
  'Chromatic': '#FC521F',
  'Auth0': '#EB5424',
  'Optimizely': '#0037FF',
  'Contentful': '#2478CC',
  'Google Solar SDK': '#4285F4',
  'Netlify': '#00C7B7',
  'Firebase': '#FFCA28',
  'CSS Modules': '#264DE4',
  'Framer Motion': '#0055FF',
  'AEM': '#EB1000',
  'Jira': '#0052CC',
  'Backbone.js': '#0071B5',
};

export function getTechColor(tech: string): string | undefined {
  return techBrandColors[tech];
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/techBrandColors.ts
git commit -m "feat: add tech brand color map for skill chip hover effects"
```

---

## Task 3: Create `SkillHighlightContext`

**Files:**
- Create: `src/context/SkillHighlightContext.tsx`
- Modify: `src/app/layout.tsx` (wrap with provider)

**Step 1: Create the context**

```tsx
// src/context/SkillHighlightContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SkillHighlightState {
  activeSkill: string | null;
  setActiveSkill: (skill: string | null) => void;
}

const SkillHighlightContext = createContext<SkillHighlightState>({
  activeSkill: null,
  setActiveSkill: () => {},
});

export function SkillHighlightProvider({ children }: { children: ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  return (
    <SkillHighlightContext.Provider value={{ activeSkill, setActiveSkill }}>
      {children}
    </SkillHighlightContext.Provider>
  );
}

export function useSkillHighlight() {
  return useContext(SkillHighlightContext);
}
```

**Step 2: Add provider to layout.tsx**

In `src/app/layout.tsx`, import `SkillHighlightProvider` and wrap it around the existing providers (inside the `<body>` tag, wrapping the content providers). Find the innermost provider wrapper and add `<SkillHighlightProvider>` around the children.

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/context/SkillHighlightContext.tsx src/app/layout.tsx
git commit -m "feat: add SkillHighlightContext for skill-to-experience filtering"
```

---

## Task 4: Update `defaults.ts` — impact bolding + single project

**Files:**
- Modify: `src/data/defaults.ts`

**Step 1: Add `**bold**` to achievement strings**

Replace the `a` arrays for each experience entry. Bold the action/result at the start:

**Driveway.com achievements:**
```
"**Managed server/cache state** with React Query (queries, mutations, optimistic updates) and lean local state",
"**Wired Auth0** for secure login, RBAC, route guards, and session handling with middleware",
"**Toggled features safely in prod** using Optimizely (flags, gradual rollouts, kill-switches)",
"**Established a Material UI (MUI)-based Design System:** tokens, theming, dark mode, accessible components, Storybook docs",
"**Managed a monorepo** (Lerna) to share UI packages, hooks, and configs, with versioning via Changesets",
"**Improved Core Web Vitals** with image optimization, code-splitting, and caching",
"**Delivered backend stories** using Kotlin + Spring Boot in a microservice architecture, integrating PostgreSQL and third-party APIs"
```

**Audi achievements:**
```
"**Developed a charging-history UI** in Next.js + TypeScript with responsive layout, client caching, and cursor-based pagination",
"**Implemented aggregated GraphQL queries** with Base64 caching, cutting server load and speeding cursor navigation",
"**Engineered workflows** ensuring an Audi vehicle can initiate a charging session, with transactions reflected seamlessly across services",
"**Introduced Redis caching** for session state, reducing latency and offloading repeated GraphQL queries",
"**Designed and scheduled cron jobs** to sync session statuses, process retries, and maintain data consistency",
"**Partnered with cross-functional teams** (Product, Design, Backend) to craft dynamic user interfaces"
```

**TD SYNNEX achievements:**
```
"**Collaborated with backend developers, designers, and project managers** to deliver high-quality solutions",
"**Implemented responsive design, accessibility, performance optimization,** and SEO best practices",
"**Leveraged Zustand** to build a robust state management system that enabled complex business solutions",
"**Stayed updated** with the latest trends and technologies in frontend development"
```

**Bewe achievements:**
```
"**Introduced Zustand state management** to simplify global state, improving maintainability and scalability",
"**Built features** for user account control, advertisement management, and an agenda system for fitness scheduling",
"**Ensured smooth backend integration** with Node.js and Express.js"
```

**Step 2: Remove 2nd and 3rd projects**

Delete the "10-Template Portfolio Engine" and "EV Charging Dashboard" entries from the `projects` array. Keep only the first entry ("Optimus Agency — Developer Hub").

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/data/defaults.ts
git commit -m "feat: add impact bolding to achievements, reduce to single project"
```

---

## Task 5: Create `useContactAction` hook + SVG contact icons

**Files:**
- Create: `src/utils/contactActions.ts`
- Create: `src/components/shared/ContactIcons.tsx`

**Step 1: Create the contact action hook**

```ts
// src/utils/contactActions.ts
'use client';

import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return { copied, copy };
}
```

**Step 2: Create SVG contact icons**

```tsx
// src/components/shared/ContactIcons.tsx
import React from 'react';

const iconStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  strokeWidth: 1.5,
  stroke: 'currentColor',
  fill: 'none',
};

export function EmailIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function LocationIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg style={{ ...iconStyle, width: 16, height: 16, color: '#10b981' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
```

**Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/utils/contactActions.ts src/components/shared/ContactIcons.tsx
git commit -m "feat: add contact action hook and SVG icons"
```

---

## Task 6: Update SectionHeader group templates — Noir Elegance (reference implementation)

**Files:**
- Modify: `src/components/templates/NoirElegance.tsx`
- Modify: `src/styles/noir.module.css`

This is the reference implementation. All patterns established here will be replicated to the other 5 SectionHeader templates (Arctic, Glass, Neon, Terminal, Editorial).

**Step 1: Add imports to NoirElegance.tsx**

Add at the top of the file:
```tsx
import { parseBold } from '@/utils/parseBold';
import { useSkillHighlight } from '@/context/SkillHighlightContext';
import { getTechColor } from '@/utils/techBrandColors';
import { useCopyToClipboard } from '@/utils/contactActions';
import { EmailIcon, PhoneIcon, GithubIcon, LocationIcon, CheckIcon } from '@/components/shared/ContactIcons';
```

**Step 2: Add skill highlight hook in the component body**

Inside the component function, add:
```tsx
const { activeSkill, setActiveSkill } = useSkillHighlight();
const { copied, copy } = useCopyToClipboard();
```

**Step 3: Update achievement rendering — use parseBold**

Find the achievement list rendering pattern:
```tsx
{exp.a.map((a, j) => <li key={j} className={s.tcLi}>{a}</li>)}
```
Replace with:
```tsx
{exp.a.map((a, j) => <li key={j} className={s.tcLi}>{parseBold(a)}</li>)}
```

**Step 4: Update skill chips — add hover handlers + brand colors**

Find the skill tag rendering pattern:
```tsx
{skill.tags.map((tag, j) => (
  <span key={j} className={s.tg}>{tag}</span>
))}
```
Replace with:
```tsx
{skill.tags.map((tag, j) => (
  <span
    key={j}
    className={`${s.tg} ${activeSkill === tag ? s.tgActive : ''}`}
    onMouseEnter={() => setActiveSkill(tag)}
    onMouseLeave={() => setActiveSkill(null)}
    style={activeSkill === tag ? { backgroundColor: getTechColor(tag) || undefined, color: '#fff' } : undefined}
  >
    {tag}
  </span>
))}
```

**Step 5: Update experience cards — add highlight/dim behavior**

Find the experience card wrapper (the parent `motion.div` or `div` that contains each experience entry). Add a conditional class and opacity:

For each experience card container, add:
```tsx
className={`${s.tc} ${activeSkill && !exp.tech.includes(activeSkill) ? s.tcDimmed : ''} ${activeSkill && exp.tech.includes(activeSkill) ? s.tcHighlighted : ''}`}
```

**Step 6: Update contact section — replace emojis with SVG icons, add action behavior**

Find each contact card. Replace the emoji patterns:

```tsx
{/* Email card */}
<motion.div variants={staggerItem} whileHover={contactHover}
  className={s.cc} onClick={() => copy(data.email, 'email')} style={{ cursor: 'pointer' }}>
  <div className={s.ci}><EmailIcon /></div>
  <h3 className={s.ccH3}>{copied === 'email' ? 'Copied!' : 'Email'}</h3>
  <span className={s.ccA}>{data.email}</span>
</motion.div>

{/* Phone card */}
<motion.div variants={staggerItem} whileHover={contactHover}
  className={s.cc} onClick={() => copy(data.phone, 'phone')} style={{ cursor: 'pointer' }}>
  <div className={s.ci}><PhoneIcon /></div>
  <h3 className={s.ccH3}>{copied === 'phone' ? 'Copied!' : 'Phone'}</h3>
  <span className={s.ccA}>{data.phone}</span>
</motion.div>

{/* GitHub card */}
<motion.a variants={staggerItem} whileHover={contactHover}
  className={s.cc} href={`https://${data.github}`} target="_blank" rel="noopener noreferrer">
  <div className={s.ci}><GithubIcon /></div>
  <h3 className={s.ccH3}>GitHub</h3>
  <span className={s.ccA}>{data.github}</span>
</motion.a>

{/* Location card */}
<motion.a variants={staggerItem} whileHover={contactHover}
  className={s.cc} href={`https://maps.google.com/?q=${encodeURIComponent(data.loc)}`} target="_blank" rel="noopener noreferrer">
  <div className={s.ci}><LocationIcon /></div>
  <h3 className={s.ccH3}>Location</h3>
  <span className={s.ccA}>{data.loc}</span>
</motion.a>
```

**Step 7: Update noir.module.css — all CSS changes**

Add/modify these classes in `src/styles/noir.module.css`:

```css
/* --- HANGING INDENTS --- */
.tcLi {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 0 0.5rem;
  align-items: start;
}
.tcLi::before {
  /* Keep existing bullet styling but ensure it sits in column 1 */
  grid-column: 1;
  justify-self: center;
}

/* --- DATE METADATA HIERARCHY --- */
/* Find the date element class and update: */
/* Use font-family: var(--font-space-mono); font-size: 0.8rem; opacity: 0.5; letter-spacing: 0.03em; */

/* --- EXPERIENCE CARD DEPTH --- */
/* Add to existing timeline card class: */
/* border: 1px solid rgba(255,255,255,0.08); */
/* box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); */

/* --- TIMELINE DOT GLOW --- */
/* Find timeline dot element and add: */
/* box-shadow: 0 0 12px 3px rgba(accent, 0.3); */

/* --- SKILL HIGHLIGHT/DIM --- */
.tcDimmed {
  opacity: 0.35;
  transition: opacity 0.3s ease;
}
.tcHighlighted {
  border-color: var(--accent, currentColor);
  box-shadow: 0 0 20px rgba(var(--accent-rgb, 255,255,255), 0.15);
  transition: all 0.3s ease;
}

/* --- BENTO GRID FOR SKILLS --- */
/* Update the skills grid container to use bento layout: */
/* grid-template-columns: repeat(4, 1fr) at desktop */
/* First child: grid-column: span 2 */

/* --- STANDARDIZED CHIPS --- */
.tg {
  padding: 0.35rem 0.85rem;
  font-size: 0.78rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tg:hover {
  transform: scale(1.05);
}
.tgActive {
  color: #fff;
  transform: scale(1.08);
}

/* --- CONTACT ICON SIZING --- */
.ci {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Note:** The exact CSS class names and property overrides depend on what's already in noir.module.css. Read the file first and adapt the changes to the existing class definitions — update existing properties rather than duplicating classes.

**Step 8: Verify visually**

Run: `npm run dev`
Open the Noir template in the browser. Check:
- Hanging indents on achievement bullets
- Bold text on impact phrases
- Dates in monospace, lighter color
- Bento grid on skills section (Frontend spanning 2 cols)
- Skill chips are interactive (hover shows brand color)
- Hovering a skill chip dims non-matching experience cards
- Contact cards have SVG icons, click copies email/phone
- Card depth enhanced with inner border

**Step 9: Commit**

```bash
git add src/components/templates/NoirElegance.tsx src/styles/noir.module.css
git commit -m "feat(noir): add elite UI/UX improvements — hanging indents, impact bolding, bento grid, skill filtering, action contacts"
```

---

## Task 7: Replicate to Arctic Minimal

**Files:**
- Modify: `src/components/templates/ArcticMinimal.tsx`
- Modify: `src/styles/arctic.module.css`

Apply the same pattern from Task 6 (Noir). Arctic uses identical JSX patterns (`s.tcUl`, `s.tcLi`, `s.tgs`, `s.tg`, `s.cc`, `s.ci`, `s.ccH3`, `s.ccA`, `s.pc`). Apply:

1. Same imports (parseBold, useSkillHighlight, getTechColor, useCopyToClipboard, icons)
2. Same hook calls in component body
3. `parseBold(a)` in achievement items
4. Skill chip hover handlers + brand color style
5. Experience card dimming/highlighting classes
6. Contact section SVG icons + copy action
7. CSS changes in `arctic.module.css`: hanging indents, date hierarchy, card depth, bento grid, chip styling, dim/highlight classes, icon sizing

Adapt colors to Arctic's light theme (e.g., dimmed opacity on light bg, highlight border in Arctic's accent color).

**Commit:**
```bash
git add src/components/templates/ArcticMinimal.tsx src/styles/arctic.module.css
git commit -m "feat(arctic): add elite UI/UX improvements"
```

---

## Task 8: Replicate to Glassmorphism

**Files:**
- Modify: `src/components/templates/Glassmorphism.tsx`
- Modify: `src/styles/glass.module.css`

Same pattern as Task 6. Glass uses identical JSX class names. Adapt CSS to glassmorphism aesthetic (frosted glass highlight effect on matched cards, blur-enhanced dimming).

**Commit:**
```bash
git add src/components/templates/Glassmorphism.tsx src/styles/glass.module.css
git commit -m "feat(glass): add elite UI/UX improvements"
```

---

## Task 9: Replicate to Neon Cyber

**Files:**
- Modify: `src/components/templates/NeonCyber.tsx`
- Modify: `src/styles/neon.module.css`

Same pattern as Task 6. Adapt CSS to neon aesthetic (neon glow on highlighted cards, pink accent brand, strong chip glow effects).

**Commit:**
```bash
git add src/components/templates/NeonCyber.tsx src/styles/neon.module.css
git commit -m "feat(neon): add elite UI/UX improvements"
```

---

## Task 10: Replicate to Terminal Hacker

**Files:**
- Modify: `src/components/templates/TerminalHacker.tsx`
- Modify: `src/styles/terminal.module.css`

Same pattern as Task 6. Adapt CSS to terminal aesthetic (green monospace glow, matrix-style highlight, terminal cursor feel on chips).

**Commit:**
```bash
git add src/components/templates/TerminalHacker.tsx src/styles/terminal.module.css
git commit -m "feat(terminal): add elite UI/UX improvements"
```

---

## Task 11: Replicate to Editorial Luxe

**Files:**
- Modify: `src/components/templates/EditorialLuxe.tsx`
- Modify: `src/styles/editorial.module.css`

Same pattern as Task 6. Adapt CSS to editorial/magazine aesthetic (elegant serif headings, refined highlight borders, muted luxury tones).

**Commit:**
```bash
git add src/components/templates/EditorialLuxe.tsx src/styles/editorial.module.css
git commit -m "feat(editorial): add elite UI/UX improvements"
```

---

## Task 12: Update DarkEmber (custom structure)

**Files:**
- Modify: `src/components/templates/DarkEmber.tsx`
- Modify: `src/styles/ember.module.css`

DarkEmber has a unique structure:
- Experience uses `s.expCard` wrapper, achievements as list items inside cards
- Skills use `s.skillCard` + `s.skillTag` classes
- Contact uses CTA buttons (not 4-card grid) — convert to action cards
- Has timeline dots that need glow

Apply all improvements but using DarkEmber's class names:
1. Imports + hooks
2. `parseBold(a)` on achievement items
3. Skill chip handlers on `s.skillTag` elements
4. Experience card dim/highlight on `s.expCard`
5. Date styling on `s.expDate`
6. Timeline dot glow
7. Bento grid on skill section (`.skillGrid` or equivalent)
8. Contact: Add a 4-card contact grid section (DarkEmber currently only has CTA buttons — add contact detail cards above or below)
9. CSS updates: hanging indents, chip standardization, brand colors, dim/highlight, icon sizing

**Commit:**
```bash
git add src/components/templates/DarkEmber.tsx src/styles/ember.module.css
git commit -m "feat(ember): add elite UI/UX improvements"
```

---

## Task 13: Update Executive Pro (custom structure)

**Files:**
- Modify: `src/components/templates/ExecutivePro.tsx`
- Modify: `src/styles/executive.module.css`

ExecutivePro has a sidebar layout with unique structure:
- Experience uses `s.expAchievements` / `s.expAchievementItem`
- Skills use `s.skillPill` with motion.span
- Contact is in sidebar as `s.contactList` / `s.contactItem`
- Has its own section header pattern (`s.secHeader`, `s.secTag`, `s.secTitle`)

Apply all improvements using Executive's class names:
1. Imports + hooks
2. `parseBold(achievement)` in achievement items
3. Skill pill handlers (add onMouseEnter/Leave to motion.span)
4. Experience card dim/highlight on card wrappers
5. Sidebar contact: make items clickable with copy action, replace emojis with SVG icons
6. Bento grid on skill section
7. CSS updates for Executive's class names

**Commit:**
```bash
git add src/components/templates/ExecutivePro.tsx src/styles/executive.module.css
git commit -m "feat(executive): add elite UI/UX improvements"
```

---

## Task 14: Update Midnight Portfolio (custom structure)

**Files:**
- Modify: `src/components/templates/MidnightPortfolio.tsx`
- Modify: `src/styles/midnight.module.css`

Midnight has a 3-column layout:
- Experience uses `s.expList` / `s.expListItem`
- Skills use `s.serviceTags` / `s.serviceTag`
- Contact is sidebar `s.contactList` / `s.contactItem`
- Section headers use `s.sectionLabel` + `s.sectionTitle`

Apply all improvements using Midnight's class names.

**Commit:**
```bash
git add src/components/templates/MidnightPortfolio.tsx src/styles/midnight.module.css
git commit -m "feat(midnight): add elite UI/UX improvements"
```

---

## Task 15: Update Monochrome Split (custom structure)

**Files:**
- Modify: `src/components/templates/MonochromeSplit.tsx`
- Modify: `src/styles/monochrome.module.css`

Monochrome has a B&W split layout:
- Experience uses `s.timelineList` / `s.timelineListItem`
- Skills use `s.skillTags` / `s.skillTag`
- Contact uses `s.contactGrid` / `s.contactCard` / `s.contactCardIco`
- Section headers use `s.sectionHeader` / `s.sectionTag` / `s.sectionTitle`

Apply all improvements using Monochrome's class names. Adapt to B&W aesthetic (highlight with border-weight change rather than color).

**Commit:**
```bash
git add src/components/templates/MonochromeSplit.tsx src/styles/monochrome.module.css
git commit -m "feat(monochrome): add elite UI/UX improvements"
```

---

## Task 16: Final visual verification across all templates

**Step 1: Run dev server**

Run: `npm run dev`

**Step 2: Test each template**

For each of the 10 templates, verify:
- [ ] Hanging indents on bullet points (text doesn't wrap under bullet)
- [ ] Impact bolding shows `**text**` as bold
- [ ] Dates are monospace, lighter color
- [ ] Skills section uses bento grid (Frontend wider)
- [ ] Skill chips have hover brand-color effect
- [ ] Hovering skill chip dims non-matching experience cards
- [ ] Contact icons are SVG, consistent 48px sizing
- [ ] Email/Phone click copies to clipboard with "Copied!" feedback
- [ ] GitHub/Location cards open correct links
- [ ] Card depth enhanced with inner border
- [ ] Timeline dots glow (where applicable)
- [ ] Section sub-headers have consistent typography
- [ ] Single project card displayed, centered
- [ ] Responsive: check 768px and 480px breakpoints

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix: polish UI/UX improvements across all templates"
```

---

## Implementation Notes

### Template Pattern Groups (for efficient implementation)

**SectionHeader Group (identical JSX patterns):**
- NoirElegance (Task 6 — reference)
- ArcticMinimal (Task 7)
- Glassmorphism (Task 8)
- NeonCyber (Task 9)
- TerminalHacker (Task 10)
- EditorialLuxe (Task 11)

These share: `s.tcUl`, `s.tcLi`, `s.tgs`, `s.tg`, `s.cc`, `s.ci`, `s.ccH3`, `s.ccA`

**Custom Structure Group (unique JSX):**
- DarkEmber (Task 12)
- ExecutivePro (Task 13)
- MidnightPortfolio (Task 14)
- MonochromeSplit (Task 15)

### Key CSS Variables per Template

| Template | Accent Color | Font Stack |
|----------|-------------|-----------|
| Noir | Gold (#c9a84c) | Cormorant + Montserrat |
| Arctic | Teal (#0d9488) | Outfit + Outfit |
| Glass | Purple (#a855f7) | Outfit + Syne |
| Neon | Pink (#ff0080) | Space Mono + Syne |
| Terminal | Green (#00ff41) | Space Mono |
| Editorial | Warm (#b45309) | Playfair + Outfit |
| DarkEmber | Orange (#f97316) | Syne + Outfit |
| Executive | Navy (#1e40af) | Montserrat |
| Midnight | Cyan (#06b6d4) | Syne + Outfit |
| Monochrome | Black (#000) | Outfit + Syne |
