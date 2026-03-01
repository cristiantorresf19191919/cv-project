# CV UI/UX Elite Redesign

**Date:** 2026-03-01
**Scope:** All 10 templates
**Approach:** Template-by-template (tailored per template's design language)

---

## 1. Shared Infrastructure

### 1A. Markdown Bold Parser
- New utility: `src/utils/parseBold.tsx`
- Parses `**text**` patterns in achievement strings into `<strong>` elements
- Used by all templates when rendering experience bullet points

### 1B. Skill Highlight Context
- New context: `src/context/SkillHighlightContext.tsx`
- State: `activeSkill: string | null` + `setActiveSkill`
- Arsenal skill chips call `setActiveSkill` on hover, reset on mouse leave
- Experience cards check if their `tech[]` contains `activeSkill`
- Non-matching cards dim to 35% opacity; matching cards get accent glow
- Smooth 0.3s CSS transitions

### 1C. Tech Brand Color Map
- New utility: `src/utils/techBrandColors.ts`
- Maps tech names to brand hex colors (React → #61DAFB, TypeScript → #3178C6, etc.)
- Used by skill chips for brand-colored hover glow
- Fallback: template's accent color for unmapped techs

### 1D. Updated Default Data (`defaults.ts`)
- **Impact bolding:** Wrap key phrases in `**bold**` in achievement strings
- **Projects:** Remove 2nd and 3rd projects, keep only "Optimus Agency — Developer Hub"
- First project already has correct URL and image

---

## 2. Experience Section ("Career Journey")

### 2A. Hanging Indents
- Achievement items use CSS Grid: `grid-template-columns: 1.5rem 1fr`
- Bullet icon sits in its own column; text forms a clean vertical block
- Applies to all templates

### 2B. Impact-First Bolding
- `parseBold()` renders `**text**` as `<strong>` in achievement lines
- Bold the result/action at the start of each bullet

### 2C. Date Metadata Hierarchy
- Dates use `var(--font-space-mono)` at `0.8rem`
- Lighter color (template's muted text color)
- Letter-spacing: 0.03em
- Creates clear distinction between role and metadata

### 2D. Card Depth Enhancement
- Inner border: `1px solid rgba(255,255,255,0.08)`
- Inner highlight: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`
- Timeline dots: `box-shadow: 0 0 12px 3px <accent at 30%>`

---

## 3. Technical Expertise ("The Arsenal")

### 3A. Bento Grid Layout
- CSS Grid with varying cell sizes
- Frontend card spans 2 columns on desktop (most tags)
- Tablet (< 1024px): 2-column grid
- Mobile (< 768px): single column
- Balanced bottom edge, no "jagged" rhythm

### 3B. Standardized Chip Styling
- Padding: 0.35rem 0.85rem
- Font-size: 0.78rem
- Border-radius: 6px
- Font-weight: 500
- Cursor: pointer (interactive)
- Transition: all 0.2s ease

### 3C. Interactive Skill Chips
- Hover: scale(1.05) + brand-color background glow
- Active state (when filtering): full accent background
- On hover: sets `activeSkill` in context → dims non-matching experience cards
- On leave: resets → all cards return to normal

### 3D. Micro-interactions
- Card hover: translateY(-4px) + border glow
- Standardized across all templates

---

## 4. Contact Section ("Get In Touch")

### 4A. Action Cards
- Entire card is clickable (not just text)
- Email: copies to clipboard + "Copied!" visual feedback
- Phone: copies to clipboard
- GitHub: opens in new tab
- Location: opens Google Maps
- Hover: scale(1.03) + translateY(-2px) + accent outer glow + elevated background

### 4B. Standardized Icon Sizing
- Replace emoji icons with SVG icons (inline SVGs for consistency)
- All icons in a fixed 48x48px container
- Consistent visual weight across all 4 contact cards

### 4C. Copy-to-Clipboard Feedback
- Brief "Copied!" text or checkmark animation after clicking email/phone
- Fades out after 1.5s

---

## 5. Typography Harmony

### 5A. Section Sub-headers
All uppercase label text ("MY ARSENAL", "CAREER JOURNEY", "GET IN TOUCH", "PORTFOLIO") share:
- Font: template's sans-serif
- Letter-spacing: 0.2em
- Font-size: 0.75rem
- Color: template's accent at ~60% opacity

### 5B. Heading Consistency
- Serif fonts (Cormorant, Playfair) used only for H1/H2 display headings
- Body text, chips, dates, and metadata use sans-serif throughout

---

## 6. Featured Projects

### 6A. Single Project Display
- Remove 2nd and 3rd projects from `defaults.ts`
- Only "Optimus Agency — Developer Hub" remains
- URL: `https://agencypartner2.netlify.app/es/developer-section`
- Image: `/images/project-optimus.png` (exists in public/)
- Single card centered on desktop, full-width on mobile

---

## 7. Accessibility

- All interactive elements have focus-visible outlines
- Contrast ratios meet WCAG AA (4.5:1 minimum)
- Skill chip hover colors checked against backgrounds
- Action cards have appropriate ARIA labels
- Copy-to-clipboard provides screen reader announcement

---

## Implementation Order

1. Shared infrastructure (parseBold, SkillHighlightContext, techBrandColors)
2. Update defaults.ts (impact bolding, single project)
3. Template-by-template CSS/component changes (DarkEmber first as reference)
4. Roll out to remaining 9 templates
5. Test responsive behavior + accessibility
