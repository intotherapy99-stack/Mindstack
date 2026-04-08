# MindStack — UI/UX Design Brief

## Product Overview
MindStack is a mental health practice management platform for therapists, psychologists, and counselors in India. It serves two user types: **Professionals** (therapists/supervisors) and **Clients** (therapy seekers). The app emphasizes warmth, trust, inclusivity, and calm professionalism.

---

## Brand Identity & Tone
- **Personality**: Warm, professional, inclusive, calming, modern
- **Emotional Goal**: Users should feel safe, supported, and empowered
- **Visual Metaphor**: Growth (plants, paths, milestones), Connection (community, diverse people), Care (hearts, shields)
- **Avoid**: Clinical coldness, corporate stiffness, overly playful/childish

---

## Color System

### Primary (Teal — Trust & Calm)
| Token | Hex | Usage |
|-------|-----|-------|
| primary-50 | #E6F4F4 | Light backgrounds, hover fills |
| primary-100 | #B3DFE0 | Borders, subtle accents |
| primary-200 | #80CBCC | Secondary elements |
| primary-300 | #4DB6B8 | Interactive states |
| primary-400 | #26A7A9 | Active indicators |
| primary-500 | #00979A | **Main brand color** — buttons, nav, links |
| primary-600 | #007A7C | Hover states |
| primary-700 | #005D5F | Pressed states, dark accents |
| primary-800 | #004042 | Dark text on light bg |
| primary-900 | #002325 | Headings on brand panels |

### Accent (Coral — Energy & Warmth)
| Token | Hex | Usage |
|-------|-----|-------|
| accent-50 | #FFF1EE | Warning backgrounds |
| accent-500 | #FF5A42 | CTAs, alerts, decorative accents |
| accent-600 | #E04030 | Hover on accent buttons |

### Neutral (Warm Grays)
| Token | Hex | Usage |
|-------|-----|-------|
| neutral-50 | #FAFAF9 | Page backgrounds |
| neutral-100 | #F5F4F2 | Card backgrounds, input fills |
| neutral-200 | #EBEBEA | Borders, dividers |
| neutral-400 | #BFBDBA | Placeholder text |
| neutral-500 | #8C8A87 | Secondary text |
| neutral-600 | #6B6966 | Body text |
| neutral-800 | #2E2C29 | Primary body text |
| neutral-900 | #1A1815 | Headings |

### Semantic
| Color | Hex | Usage |
|-------|-----|-------|
| Supervision purple | #8B5CF6 | Supervision features, mentor/mentee |
| Supervision light | #EDE9FE | Purple tinted backgrounds |
| Success | #22C55E | Completed states, confirmations |
| Warning | #F59E0B | Pending states, attention needed |
| Error | #EF4444 | Validation errors, destructive actions |
| Info | #3B82F6 | Informational banners |

### Inclusive Skin Tone Palette (for illustrations)
| Name | Hex |
|------|-----|
| Light | #FFE8D6 |
| Fair | #F5D0B0 |
| Medium | #D4A574 |
| Olive | #C19A6B |
| Brown | #A0724A |
| Deep | #6B4226 |

---

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Headings** | Plus Jakarta Sans | 500, 600, 700, 800 | All h1–h6, card titles, nav labels |
| **Body** | Inter | 300, 400, 500, 600, 700 | Paragraphs, labels, inputs, buttons |
| **Monospace** | JetBrains Mono | 400, 500 | Code, IDs, technical data |

### Size Scale
| Size | Pixel | Usage |
|------|-------|-------|
| text-[10px] | 10px | Section labels (uppercase, tracking-wider), micro text |
| text-[11px] | 11px | Badges, timestamps, tertiary info |
| text-xs | 12px | Captions, helper text, footer links |
| text-[13px] | 13px | Form labels |
| text-sm | 14px | Default body, button text, card descriptions |
| text-[15px] | 15px | Login/signup button text, larger body |
| text-base | 16px | Card titles (small) |
| text-xl | 20px | Card titles, section headings |
| text-2xl | 24px | Dashboard greeting, stat numbers |
| text-[28px] | 28px | Login heading (desktop) |
| text-3xl | 30px | Stat numbers (desktop) |

---

## Spacing & Layout

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| rounded-md | 8px | Small elements, icon containers |
| rounded-lg | 12px | Buttons, inputs, cards, nav items |
| rounded-xl | 16px | Large cards, containers, modals |
| rounded-2xl | 20px | Page-level cards, hero sections |
| rounded-full | 9999px | Avatars, pills, badges, dots |

### Common Spacing
- Card padding: 20px (p-5)
- Card gap: 12px (gap-3) to 20px (gap-5)
- Section margin bottom: 20px (mb-5)
- Form field spacing: 16px (space-y-4) to 20px (space-y-5)
- Icon-text gap: 8px (gap-2) to 12px (gap-3)

### Grid Patterns
- Dashboard stats: 1 col → 2 col (sm) → 4 col (lg)
- Main content: 1 col → 3 col (lg) with 2:1 split
- Auth pages: Stack (mobile) → 50/50 split (md+)

---

## Elevation & Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| Flat | none | Inline elements, text |
| Subtle | `0 1px 3px rgba(0,0,0,0.06)` | Default cards |
| Raised | `0 4px 12px rgba(0,0,0,0.1)` | Hovered cards |
| Lifted | `0 8px 25px rgba(0,0,0,0.08)` | Interactive card hover |
| Glow (teal) | `0 0 20px rgba(0,151,154,0.15)` | Primary feature emphasis |
| Glow (purple) | `0 0 20px rgba(139,92,246,0.15)` | Supervision features |
| Glass | `bg rgba(255,255,255,0.7) + blur(12px)` | Overlays, mobile nav, trust pills |

---

## Gradient Backgrounds

### Warm Gradient (Auth pages)
```css
linear-gradient(135deg, #E6F4F4 0%, #FFF1EE 50%, #EDE9FE 100%)
```
Teal → Coral → Purple, gentle and welcoming.

### Hero Gradient (Brand panels)
```css
linear-gradient(135deg, #00979A 0%, #007A7C 40%, #005D5F 100%)
```
Deep teal for branded headers and banners.

### Mesh Gradient (Dashboard background)
```css
radial-gradient(at 40% 20%, rgba(0,151,154,0.08), transparent 50%),
radial-gradient(at 80% 0%, rgba(139,92,246,0.06), transparent 50%),
radial-gradient(at 0% 50%, rgba(255,90,66,0.05), transparent 50%),
linear-gradient(180deg, #FAFAF8, #F7F5F3)
```
Subtle multi-color radial blobs on warm off-white.

### Dashboard Banner
```css
linear-gradient(to right, #00979A, #007A7C, #005D5F)
```
With decorative semi-transparent white circles (8%, 5%, 10% opacity).

---

## Component Patterns

### Buttons
| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | gradient primary-500→600 | white | none | darker gradient |
| Secondary | white | neutral-800 | neutral-300 | neutral-50 bg |
| Danger | accent-500 | white | none | accent-600 |
| Ghost | transparent | primary-500 | none | primary-50 bg |
| Outline | transparent | primary-500 | 2px primary-500 | primary-50 bg |
| Supervision | #8B5CF6 | white | none | slightly transparent |

**Sizes**: sm (32px h), default (40px h), lg (48px h), icon (40x40px)
**Touch**: min-height 44px on mobile
**Press feedback**: scale(0.98) on active

### Cards
- Background: white
- Border: 1px neutral-100
- Radius: 20px (rounded-2xl)
- Shadow: subtle by default, lifts on hover
- Header: 20px padding, title + optional description
- Content: 20px padding, no top padding
- Stat cards use gradient backgrounds (primary-50, green-50, purple-50, amber-50)

### Navigation (Desktop Sidebar)
- Width: 260px expanded / 68px collapsed
- Background: white with right border
- Section labels: 10px uppercase, tracking-wider, neutral-400
- Items: 14px medium, 12px radius, 20px icons
- Active state: primary-50 bg, primary-600 text
- Supervision items: purple-tinted active state
- Collapsible parent/children pattern for grouped items

### Navigation (Mobile Bottom Bar)
- Fixed bottom, full width, z-50
- Semi-transparent white (80%) + backdrop blur
- 5 items evenly distributed
- Active: primary-500 color + dot indicator
- Touch: 44px minimum targets
- Safe area inset for notched phones

### Form Inputs
- Height: 48px (h-12) for touch friendliness
- Border: neutral-200, rounded-lg
- Focus: shadow-md transition
- Labels: 13px, above input with 6px gap
- Errors: red-50 background, red-600 text, pulsing red dot indicator

### Badges
- Small rounded pills with colored background
- Font: 11px–12px, font-medium or font-semibold
- Padding: px-2 py-0.5 to px-3 py-1

---

## Animation System

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page enter (fadeIn) | 300ms | ease | Page transitions — fade up 4px |
| Bounce in | 300ms | ease-out | Modal/card appearance |
| Slide up | 300ms | ease-out | Toasts, notifications |
| Float | 4s | ease-in-out, infinite | Illustrations, decorative elements |
| Float slow | 6s | ease-in-out, infinite | Subtle background elements |
| Soft pulse | 2s | ease-in-out, infinite | Live/status indicators |
| Shimmer | 2s | linear, infinite | Loading skeletons |
| Shake | 400ms | ease-in-out | Error feedback |
| Sparkle | 1.5s | ease-in-out, 3x | Verification badges |
| Badge pulse | 2s | ease-in-out, 3x | New item indicators |
| Stagger children | 300ms each | ease, 50ms delay between | Grid/list entrance (up to 8 children) |
| Card hover lift | 200ms | ease | translateY(-2px) + enhanced shadow |
| Press feedback | 100ms | ease | scale(0.98) on active |

---

## Illustration Style

### Character Illustrations
- **Style**: Hand-drawn line-art SVG, warm and friendly
- **Skin tones**: 6 diverse tones (light → deep)
- **Hair**: Realistic dark tones (black, brown, auburn, blonde, gray)
- **Features**: Simple circles for eyes with white highlight dots, curved smile paths
- **Clothing**: Brand colors (teal, purple, coral, sage green)
- **Diversity**: Multiple genders, ages, cultural representations (hijab, glasses, hairstyles)

### Decorative Elements
- **Organic blobs**: Low-opacity (6–8%) gradient fills, teal-to-purple and coral-to-sage
- **Floating dots**: Small circles (1.5–3px) at 40–60% opacity in brand colors
- **Connection lines**: Dashed strokes between figures, 40% opacity
- **Hearts/sparkles**: Tiny decorative touches near illustrations
- **Wave dividers**: Smooth SVG wave shapes for section breaks
- **Leaf/botanical**: Simple two-tone leaf spot illustrations

### Illustration Subjects
- Therapist at desk with notepad and plant
- Meditation figure with aura circles
- Supervision: Two figures facing each other with conversation dots
- Community: Four diverse people with connection lines
- Success: Celebrating figure with confetti
- Empty states: Welcoming figure with dotted placeholder

---

## Page Layout Patterns

### Auth Pages (Login/Signup)
- **Desktop**: 50/50 split — left brand panel (warm gradient + illustration + social proof) / right form panel (white)
- **Mobile**: Full-width form with compact brand header
- **Social proof**: Row of 5 diverse face avatars overlapping, with user count text
- **Trust pills**: Icon + text in frosted glass capsules

### Dashboard
- **Background**: Mesh gradient (subtle multi-color radials)
- **Greeting banner**: Full-width teal gradient with decorative circles and user info
- **Stats row**: 4-column responsive grid of gradient-tinted stat cards
- **Main content**: 3-column grid (2:1 split) — schedule left, quick actions + quote right
- **Quick actions**: Vertical list of icon + label + arrow rows

### List/Table Pages (Clients, Notes, Payments)
- **Header**: Title + count badge + search input + primary action button
- **Filters**: Horizontal pill strip, scrollable on mobile
- **Content**: Card-based list with status badges and contextual actions
- **Empty state**: Centered illustration + heading + description + CTA button

### Detail Pages
- **Header**: Back button + title + status badge
- **Tabs**: Horizontal tab bar, scrollable on mobile, gradient underline on active
- **Content**: Card sections with labeled fields

### Onboarding
- **Background**: Mesh gradient
- **Progress**: Horizontal step indicators (icon circles with connecting lines)
- **Content**: Centered card (max-width 512px) with step-specific form
- **Navigation**: Progress bar + back/next buttons

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Default | 0px+ | Single column, bottom nav, compact spacing |
| sm | 640px+ | 2-column grids, slightly larger text |
| md | 768px+ | Desktop sidebar appears, bottom nav hides, side-by-side layouts |
| lg | 1024px+ | 3–4 column grids, max-width containers, full feature display |

### Mobile-Specific Patterns
- Bottom navigation bar (fixed, 5 items)
- 44px minimum touch targets on all interactive elements
- Safe area insets for notched devices (iOS)
- Momentum scrolling on filter strips
- Collapsible sidebar → sheet/overlay on mobile
- Single-column layouts with vertical stacking

---

## Accessibility

- **Focus indicators**: 2px solid teal outline, 2px offset on all focusable elements
- **Touch targets**: Minimum 44x44px on mobile
- **Color contrast**: neutral-800/900 text on white (WCAG AA+)
- **Selection color**: Teal-tinted (rgba(0,151,154,0.15))
- **Reduced motion**: card-lift hover disabled on touch devices
- **Font rendering**: Antialiased on all platforms

---

## Dark Mode Tokens (Defined, Not Yet Active)
| Token | Value |
|-------|-------|
| Background primary | #0F1215 |
| Background secondary | #1A1D23 |
| Background elevated | #2A2E37 |
| Text primary | #F0F0F2 |
| Text secondary | #A0A4AD |
| Border | #2E3340 |
| Teal accent | #00B4B8 |
| Purple accent | #A78BFA |
| Coral accent | #FF7A5C |
