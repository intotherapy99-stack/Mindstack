# MindStack

**India's first practice management platform purpose-built for mental health professionals.**

MindStack is a full-stack SaaS application that gives therapists, psychologists, counselors, and trainees a single workspace to manage clients, clinical notes, scheduling, payments, supervision tracking, and peer community — all while staying compliant with India's Digital Personal Data Protection (DPDP) Act.

---

## Why This Exists

India has 10,000+ practicing mental health professionals — and that number is growing fast as stigma recedes and demand surges. Yet most practitioners still manage their practice with WhatsApp, Google Sheets, and manual bank transfers. There is no purpose-built tool that understands:

- **India's supervision requirements** — RCI mandates logged supervision hours for licensure
- **Indian payment patterns** — UPI, cash, split payments, GST invoicing in INR
- **India's professional landscape** — counselors, trainees, and coaches (not just licensed psychologists)
- **India's data protection law** — DPDP Act compliance with consent management

MindStack fills this gap.

---

## Product Artifacts

This repository doubles as a **product management portfolio**. Each document below demonstrates a specific PM competency:

| Document | PM Competency | Description |
|----------|--------------|-------------|
| [Product Requirements Document](docs/MindStack_PRD.md) | Spec Writing & Execution | 1,700-line PRD with personas, features, acceptance criteria, and sprint plan |
| [Product Strategy](docs/PRODUCT_STRATEGY.md) | Strategic Thinking | Vision, positioning, defensibility moat, and long-term bets |
| [Competitive Analysis](docs/COMPETITIVE_ANALYSIS.md) | Market Awareness | Landscape mapping, feature comparison, and differentiation strategy |
| [User Research](docs/USER_RESEARCH.md) | Customer Empathy | Persona deep-dives, Jobs-to-be-Done framework, and interview insights |
| [Metrics Framework](docs/METRICS_FRAMEWORK.md) | Data-Driven Decisions | North Star metric, input/output metrics, and dashboard design |
| [Product Roadmap](docs/ROADMAP.md) | Prioritization & Sequencing | Phased roadmap with ICE scoring and rationale |
| [UI/UX Design Brief](UI_UX_DESIGN_BRIEF.md) | Design Sensibility | Complete design system: colors, typography, components, animations |

---

## Key Features

### For Practitioners
- **Client Management** — Add clients, track session history, manage balances
- **Clinical Notes** — SOAP, DAP, and free-text templates with auto-save
- **Smart Calendar** — Availability slots, booking links, automated reminders
- **Payments & Invoicing** — Log payments (UPI/cash/card), generate GST invoices
- **Supervision Tracking** — Log hours, find supervisors, track quarterly progress
- **Peer Community** — Discussion spaces, peer referrals, moderated forums
- **Analytics Dashboard** — Revenue trends, session stats, client retention

### For Clients
- **Find a Therapist** — Search by specialization, city, modality, fee range
- **Book Sessions** — Self-serve booking through practitioner's public profile
- **Payment History** — Track payments and outstanding balances
- **Secure Portal** — Token-based access without requiring account creation

---

## Technical Architecture

```
Next.js 14 (App Router)
├── (auth)              Login, Signup, Onboarding
├── (dashboard)         Practitioner portal (13 pages)
├── (client-dashboard)  Client portal (6 pages)
├── (public)            Public profiles, booking, legal pages
├── (client)            Token-based client portal
└── api/                35+ REST endpoints
```

**Stack:**
- **Frontend:** Next.js 14, React, Tailwind CSS, Radix UI, Recharts
- **Backend:** Next.js API Routes, NextAuth v5, Prisma ORM
- **Database:** PostgreSQL (35+ models, see [schema](prisma/schema.prisma))
- **Payments:** Razorpay (UPI, cards, netbanking)
- **Infrastructure:** Vercel, Upstash Redis, Cloudinary, Resend, MSG91

**Design System:** Tonal surface hierarchy with glassmorphism, inclusive SVG illustrations featuring diverse skin tones, and zero-border "No-Line" UI philosophy. Full spec in [UI/UX Design Brief](UI_UX_DESIGN_BRIEF.md).

---

## Data Model (Simplified)

```
User ─┬─ Profile (practitioner)
      ├─ ClientProfile (client)
      ├─ Subscription
      ├─ Client ─┬─ Appointment ─── Note
      │          └─ Payment ─── Invoice
      ├─ SupervisionSession (as supervisee or supervisor)
      ├─ Availability
      ├─ ReferralPost ─── ReferralResponse
      └─ SpaceMembership ─── SpacePost ─── Comment
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Razorpay account (for payments)

### Setup

```bash
# Clone
git clone https://github.com/intotherapy99-stack/Mindstack.git
cd Mindstack

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in your database URL, auth secrets, and API keys

# Set up database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Design Philosophy

MindStack's design is guided by three principles:

1. **Warmth over clinical** — Teal and coral palette, hand-drawn illustrations, organic shapes. Mental health tools should feel safe, not sterile.

2. **Inclusive by default** — 8 diverse character illustrations spanning skin tones, hairstyles, ages, and cultural presentations (including hijab). No single "default" appearance.

3. **No borders, just depth** — UI uses tonal surface layering and ambient shadows instead of hard lines. Glassmorphic nav panels. Focus states use soft glows instead of hard outlines.

---

## License

This project is proprietary. All rights reserved.

---

Built with care for India's mental health community.
