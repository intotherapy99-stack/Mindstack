# MindStack — Competitive Analysis

## Market Landscape

The mental health practice management space can be segmented into three tiers:

1. **Global EHR/Practice Management** — Built for US/UK, retrofitted for other markets
2. **India Health-Tech** — Broad healthcare platforms, not MH-specific
3. **DIY Tools** — WhatsApp, Google Sheets, Calendly — the real incumbent

---

## Direct Competitors

### 1. SimplePractice (US)
**What they do:** All-in-one practice management for US therapists. Scheduling, notes, telehealth, insurance billing.

| Dimension | SimplePractice | MindStack |
|-----------|---------------|-----------|
| Market | US-focused | India-focused |
| Pricing | $29-99/mo USD | Free - 999 INR/mo |
| Payments | US insurance billing, credit cards | UPI, cash, Razorpay, GST invoicing |
| Supervision | Not a feature | Core feature with hour tracking |
| Telehealth | Built-in video | Integration approach (Zoom/Meet) |
| Compliance | HIPAA | DPDP Act |
| Languages | English only | English + Hindi (planned regional) |

**Our advantage:** SimplePractice costs 10x more, doesn't support INR payments, and has zero awareness of Indian supervision requirements. They will never localize deeply enough for India.

### 2. TherapyNotes (US)
**What they do:** EHR + billing for US behavioral health. Strong on documentation and insurance claims.

**Our advantage:** Same as SimplePractice — US-centric, expensive, no Indian payment or regulatory support. TherapyNotes is even more insurance-focused, which is irrelevant in India where mental health insurance coverage is minimal.

### 3. Practo (India)
**What they do:** India's largest doctor discovery and appointment platform. Covers all medical specialties.

| Dimension | Practo | MindStack |
|-----------|--------|-----------|
| Focus | All healthcare | Mental health only |
| Features | Discovery + booking | Full practice management |
| Notes | None | SOAP/DAP templates |
| Supervision | None | Core feature |
| Community | None | Peer referrals, discussion spaces |
| Client management | Minimal | Full CRM with session history |

**Our advantage:** Practo is a marketplace — it helps clients find doctors but provides zero practice management tools. A therapist on Practo still needs a separate system for notes, payments, and client tracking. MindStack replaces the entire stack.

### 4. Amaha (India)
**What they do:** B2C mental health platform. Connects clients with therapists, offers self-help tools.

**Our advantage:** Amaha is client-facing — therapists are contractors, not customers. MindStack serves the therapist directly, giving them ownership of their practice data and client relationships.

### 5. Wysa / YourDOST / Talkspace (Digital Therapy)
**What they do:** AI chatbots or marketplace models for therapy delivery.

**Our advantage:** These are therapy delivery platforms, not practice management. A therapist using Wysa as a side gig still needs MindStack for their private practice.

---

## Indirect Competitors (The Real Incumbents)

| Tool | Usage | Why Practitioners Use It | Why They'll Switch |
|------|-------|--------------------------|-------------------|
| **WhatsApp** | Scheduling, reminders, payments | Free, everyone has it | No structure, no records, no confidentiality |
| **Google Sheets** | Client tracking, payment logs | Free, flexible | No automation, no templates, manual everything |
| **Calendly** | Scheduling | Easy booking links | No Indian payment integration, no clinical features |
| **Google Calendar** | Appointments | Familiar | No client context, no session tracking |
| **Pen & Paper** | Clinical notes | Habitual, private | Not searchable, not backed up, not shareable |
| **Bank App Screenshots** | Payment verification | "Proof" of payment | Not organized, not reconcilable |

**Key insight:** Our biggest competitor is not another software product. It is the **cobbled-together workflow** of 5-6 free tools that every Indian therapist currently uses. We win by being 10x more convenient than the DIY stack, not by being marginally better than another SaaS.

---

## Feature Comparison Matrix

| Feature | MindStack | SimplePractice | Practo | WhatsApp+Sheets |
|---------|-----------|---------------|--------|----------------|
| Client management | Full CRM | Full CRM | Basic listing | Manual |
| Clinical notes (SOAP/DAP) | Yes | Yes | No | No |
| Scheduling + booking link | Yes | Yes | Yes | Manual |
| UPI payments | Yes | No | No | Screenshots |
| INR invoicing with GST | Yes | No | No | Manual |
| Supervision hour tracking | Yes | No | No | Manual |
| Peer referral network | Yes | No | No | WhatsApp groups |
| Community discussion | Yes | No | No | WhatsApp groups |
| DPDP Act compliance | Yes | No (HIPAA) | Partial | No |
| Mobile-optimized | Yes | Yes | Yes | Yes |
| Price (INR/mo) | 0-999 | 2,400-8,200 | Free (limited) | Free |

---

## Differentiation Strategy

### 1. Supervision-First Entry
No competitor — global or Indian — tracks supervision hours. This is our uncontested entry point. We own this feature category entirely.

### 2. India-Native Payments
UPI is how India pays. Cash is how many therapy clients pay. Our payment system understands both, plus generates GST-compliant invoices. Global tools can't do this.

### 3. Inclusive Professional Scope
SimplePractice requires a license number. Practo requires a medical degree. MindStack welcomes counselors, trainees, coaches, and students — the fastest-growing segment of India's mental health workforce.

### 4. Community as a Feature
Peer referrals and discussion spaces are built into the product, not a separate Slack/WhatsApp group. This creates network effects and daily engagement beyond transactional tool usage.

### 5. Price-to-Value
At 999 INR/month (~$12 USD), MindStack is 5-10x cheaper than global alternatives while offering India-specific features they lack entirely.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Practo adds practice management | Medium | High | Move fast, build supervision moat, create switching costs through data lock-in |
| SimplePractice enters India | Low | Medium | They've shown no interest in non-English markets; our localization depth is years ahead |
| Government builds a free tool | Low | Medium | Government tools are notoriously poor UX; we win on experience |
| Practitioners resist paying | High | High | Generous free tier; prove value before asking for money; supervision tracking is "free" |
| WhatsApp launches business tools for healthcare | Medium | Medium | WhatsApp will never build SOAP notes or supervision tracking; we integrate with WhatsApp, not compete |
