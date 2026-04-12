# MindStack - Product Roadmap

**Document Version:** 1.0
**Author:** Product Management
**Date:** 2026-04-13
**Status:** Living Document (Updated Quarterly)
**Companion Docs:** [PRD](../MindStack_PRD.md) | Design System | Technical Architecture

---

## Table of Contents

1. [Roadmap Philosophy](#1-roadmap-philosophy)
2. [Current State Summary](#2-current-state-summary)
3. [Phase 1: Foundation (Q2-Q3 2026)](#3-phase-1-foundation-q2q3-2026)
4. [Phase 2: Growth (Q4 2026-Q1 2027)](#4-phase-2-growth-q4-2026q1-2027)
5. [Phase 3: Scale (Q2-Q3 2027)](#5-phase-3-scale-q2q3-2027)
6. [Phase 4: Platform (Q4 2027-2028)](#6-phase-4-platform-q4-20272028)
7. [ICE Scoring Matrix](#7-ice-scoring-matrix)
8. [Dependencies & Risks](#8-dependencies--risks)
9. [Success Criteria](#9-success-criteria)
10. [What We Are NOT Building](#10-what-we-are-not-building)
11. [Release Strategy](#11-release-strategy)

---

## 1. Roadmap Philosophy

### Outcomes Over Outputs

This roadmap is organized around **outcomes we want to achieve**, not features we want to ship. Every initiative must answer: *"What practitioner or client behavior does this change, and how do we measure that change?"*

We do not ship features because competitors have them. We ship capabilities because our users need them and the evidence supports the investment.

### Guiding Principles

| Principle | What It Means in Practice |
|---|---|
| **Outcome-driven** | Each phase has measurable success criteria tied to user behavior and business metrics, not a feature checklist. |
| **Wedge-first** | Supervision tracking is our strategic wedge. We build depth here before breadth elsewhere. A feature no competitor has is worth more than ten features every competitor has. |
| **India-native, not India-adapted** | We build for India from day one (INR, DPDP Act, UPI, regional languages) rather than localizing a US product. This is a moat, not a constraint. |
| **Practitioner-first sequencing** | Supply creates demand. We build for practitioners first, then use their adoption to unlock the client-facing marketplace. Attempting both simultaneously dilutes focus and doubles support burden. |
| **Reversible over perfect** | We prefer shipping a scoped version we can iterate on over designing the "complete" version. Configuration over code where possible. |
| **Boring technology choices** | We use proven infrastructure (PostgreSQL, React, Node.js) unless there is a compelling, specific reason to adopt something new. Novelty in technology is a cost, not a feature. |

### How to Read This Roadmap

- **Phases are directional, not contractual.** Timelines shift based on what we learn. The further out a phase is, the less certain its contents.
- **Phase 1 is high-confidence.** Initiatives are scoped, estimated, and validated. Ship dates are commitments.
- **Phase 2 is medium-confidence.** Initiatives are defined but scope may shift based on Phase 1 learnings.
- **Phases 3-4 are strategic bets.** They represent our current best thinking about where to go next, subject to significant revision based on market feedback and business performance.

---

## 2. Current State Summary

### Where We Are Today (April 2026)

| Dimension | Status |
|---|---|
| **Product** | PRD approved. Design system in progress. No shipped product yet. |
| **Engineering** | Core architecture defined (React + Node.js + PostgreSQL). Auth and database schema work underway. |
| **Users** | 0 live users. 47 practitioners on waitlist from early outreach (LinkedIn, WhatsApp counselor groups, RCI forums). |
| **Revenue** | Pre-revenue. Seed-stage. |
| **Competitive landscape** | No India-focused practice management tool with supervision tracking. SimplePractice/TherapyNotes are US-centric and priced in USD. Practo is patient-first, not practitioner-first. Amaha is a direct care provider, not a SaaS platform for independent practitioners. |

### Competitive Gap Analysis

| Capability | SimplePractice | TherapyNotes | Practo | Amaha | **MindStack** |
|---|---|---|---|---|---|
| Session notes (SOAP/DAP) | Yes | Yes | No | Internal only | **Phase 1** |
| Supervision hour tracking | No | No | No | No | **Phase 1** |
| INR-native payments (UPI/Razorpay) | No | No | Yes | Yes | **Phase 1** |
| DPDP Act compliance | No | No | Partial | Partial | **Phase 1** |
| Client self-booking | Yes | Yes | Yes | Yes | **Phase 2** |
| Multilingual interface | No | No | Partial | Hindi + English | **Phase 2** |
| Clinic multi-seat management | Yes | Yes | No | N/A | **Phase 3** |
| Open API / integrations | Yes | Limited | Limited | No | **Phase 4** |
| Supervision marketplace | No | No | No | No | **Phase 2** |

**Strategic insight:** Supervision tracking is the only capability where *no* competitor has a solution, domestic or international. This is our wedge. Practitioners who come for supervision tracking stay for the full workflow.

---

## 3. Phase 1: Foundation (Q2-Q3 2026)

### Outcome Goal

> **Enable a solo practitioner to run their entire practice on MindStack, replacing their patchwork of Google Docs, spreadsheets, WhatsApp, and manual tracking.**

### Why This Phase First

Solo practitioners represent 70%+ of India's mental health workforce. They have the most acute pain (no admin staff, limited budget, cobbled-together tools) and the lowest switching cost (no existing system to migrate from). Winning them first gives us:

1. A large addressable base with low acquisition cost (word-of-mouth in practitioner communities)
2. Real usage data to inform clinic and client-facing features later
3. Revenue from Solo tier subscriptions to extend runway

### Phase 1 Initiatives

| Initiative | Description | Target Persona | Pricing Tier |
|---|---|---|---|
| **1.1 Practitioner Onboarding** | Sign-up flow, professional profile creation, practice configuration (working hours, session types, fee structure). Credential upload (optional RCI/NMC verification). | All practitioners | Free |
| **1.2 Client Management** | Add/edit/archive clients. Client demographics, contact info, emergency contact, presenting concerns, tags. Search and filter. Import from CSV. | All practitioners | Free (up to 5 clients), Solo |
| **1.3 Session Notes** | Create clinical notes using SOAP, DAP, or free-text templates. Attach to specific client and session date. Lock notes after 72 hours (medico-legal best practice). Template customization. | Therapists, Psychologists | Solo |
| **1.4 Appointment Scheduling** | Calendar view (day/week/month). Create, edit, cancel sessions. Recurring session support. SMS and email reminders via MSG91. Google Calendar two-way sync. | All practitioners | Free (basic), Solo (reminders + sync) |
| **1.5 Supervision Tracking** | Log supervision hours (as supervisee or supervisor). Link to supervisor/supervisee profile. Session type categorization (individual, group, live observation, recorded review). Hour summary dashboard with exportable PDF certificates. | Trainees, Supervisors | Free (log only), Solo (full dashboard + certificates) |
| **1.6 Payments (v1)** | Razorpay integration. Create and send invoices. Track payment status. UPI, card, and netbanking support. GST-compliant invoice generation. | All practitioners | Solo |
| **1.7 Public Profile Page** | Practitioner-facing public page (mindstack.in/dr-anand). Bio, qualifications, languages, specializations, fee range, booking link. SEO-optimized. | All practitioners | Free |
| **1.8 DPDP Compliance Layer** | Consent collection and management. Data export (client right to portability). Data deletion workflows. Audit logging. Encryption at rest and in transit. | Platform-wide | All tiers |

### Phase 1 Milestones

| Milestone | Target Date | Description |
|---|---|---|
| **Alpha (internal)** | June 15, 2026 | Core flows functional. Internal dogfooding with team and 3-5 friendly practitioners. |
| **Closed Beta** | July 15, 2026 | Invite 20 practitioners from waitlist. Full onboarding through notes and scheduling. |
| **Open Beta** | August 15, 2026 | Open sign-ups. Free tier live. Supervision tracking available. |
| **GA (v1.0)** | September 30, 2026 | Paid tiers active. All Phase 1 initiatives stable. SLA commitments begin. |

### Phase 1 Dependencies

| Dependency | Owner | Risk Level | Mitigation |
|---|---|---|---|
| Razorpay merchant account approval | Ops / Finance | Medium | Apply early (May). Have PayU as backup gateway. |
| MSG91 SMS integration for reminders | Engineering | Low | Standard API. Well-documented. 2-day integration. |
| Google Calendar API OAuth verification | Engineering | Medium | Submit for verification in May. Use unverified mode for beta (100-user cap acceptable). |
| RCI database for credential verification | Product / Partnerships | High | RCI has no public API. Manual verification for v1. Automated scraping is legally risky; defer to Phase 2 partnership outreach. |
| DPDP Act final rules publication | Legal / Compliance | Medium | Build to the Act's principles. Adjust when rules are finalized. Conservative interpretation protects us. |

### Phase 1 Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Practitioners resist paying for software (price sensitivity in India) | High | High | Generous free tier to build habit. Solo priced below one session fee (INR 499/mo). Emphasize time saved = sessions gained. |
| Low engagement with session notes (practitioners prefer handwritten) | Medium | Medium | Mobile-first note-taking. Voice-to-text input. Pre-filled templates that require minimal typing. |
| Supervision tracking is a "nice to have," not a driver of adoption | Medium | High | Validate with 10+ trainee interviews pre-launch. If supervision does not drive sign-ups, pivot to scheduling as the wedge and resequence. |
| Google Calendar sync issues cause missed appointments | Low | High | Sync status indicator in UI. Fallback to standalone calendar. Automated conflict detection. |

---

## 4. Phase 2: Growth (Q4 2026-Q1 2027)

### Outcome Goal

> **Turn MindStack from a practitioner tool into a two-sided platform: practitioners manage their practice AND clients discover, book, and engage with practitioners through MindStack.**

### Why This Phase Second

Phase 1 establishes supply (practitioners with active profiles and usage). Phase 2 activates demand (clients who find and book through MindStack). We deliberately wait because:

1. Client-facing features without practitioners to serve them create an empty marketplace problem
2. Practitioners must trust the platform before we route clients to them
3. Phase 1 usage data tells us which practitioner workflows are sticky, informing which client features to build

### Phase 2 Initiatives

| Initiative | Description | Target Persona | Pricing Tier |
|---|---|---|---|
| **2.1 Client Portal** | Client-facing dashboard: upcoming sessions, session history, shared notes/homework, payment history, therapist profile. Secure login via OTP (no password). | Clients | Free (for clients) |
| **2.2 Client Self-Booking** | Browse practitioner availability and book directly. Slot selection, session type choice, pre-session intake form. Automated confirmation via SMS and email. | Clients, Practitioners | Solo (practitioner pays) |
| **2.3 Practitioner Directory** | Public directory (mindstack.in/find-a-therapist). Filter by location, specialization, language, fee range, availability, gender. SEO-optimized city + specialty landing pages. | Clients | Free (organic listing), featured placement (paid) |
| **2.4 Supervision Marketplace** | Supervisees can browse and request supervision from verified supervisors on MindStack. Supervisor profiles show specializations, availability, rates, and verified credentials. Matching based on modality and language. | Trainees, Supervisors | Solo (supervisee pays for platform features) |
| **2.5 Multilingual Interface (v1)** | Hindi language support across entire practitioner and client interface. Translation of all clinical note templates. Language auto-detection based on browser/phone settings. | All users | All tiers |
| **2.6 Secure Messaging** | In-app messaging between practitioner and client. End-to-end encrypted. File/image sharing. Message scheduling. Auto-archive after 90 days of inactivity. | Practitioners, Clients | Solo |
| **2.7 Session Packages & Prepaid Plans** | Practitioners create session packages (e.g., 8 sessions for INR 14,000). Clients purchase and redeem. Automatic session counting and expiry management. | Practitioners, Clients | Solo |
| **2.8 Waitlist Management** | When practitioner is full, clients join a waitlist. Auto-notify when a slot opens. Waitlist analytics for practitioner (demand signals). | Practitioners, Clients | Solo |
| **2.9 Mobile App (PWA)** | Progressive Web App for Android (primary) and iOS. Offline note drafts. Push notifications for appointments and messages. Optimized for 4G networks and mid-range devices. | All users | All tiers |

### Phase 2 Milestones

| Milestone | Target Date | Description |
|---|---|---|
| **Client Portal Beta** | November 1, 2026 | 50 practitioners invite their existing clients. Client onboarding and booking flow live. |
| **Directory Soft Launch** | December 1, 2026 | Directory live with 100+ practitioner profiles. SEO indexing begins. |
| **Supervision Marketplace Beta** | December 15, 2026 | 15 verified supervisors listed. Matching algorithm in testing. |
| **Phase 2 GA** | January 31, 2027 | All initiatives stable. Client acquisition funnel operational. |

### Phase 2 Dependencies

| Dependency | Owner | Risk Level | Mitigation |
|---|---|---|---|
| 100+ active practitioners on platform (from Phase 1) | Growth / Product | High | If Phase 1 reaches only 50, narrow directory to top cities (Bangalore, Mumbai, Delhi) and launch with curated profiles. |
| Hindi translation quality | Content / Product | Medium | Hire native Hindi-speaking UX writer. Do not rely on machine translation for clinical terminology. Clinician review of all translated templates. |
| PWA push notification support on iOS | Engineering | Medium | iOS PWA push is supported since iOS 16.4. Test thoroughly on Safari. Fallback to SMS for critical notifications. |
| Client acquisition cost economics | Growth / Finance | High | Organic SEO is the primary bet. If CAC exceeds INR 500/client in paid channels, pause paid acquisition and double down on practitioner referrals. |

### Phase 2 Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Clients prefer booking via WhatsApp over a new platform | High | High | WhatsApp booking link integration (click opens pre-filled WhatsApp message with booking details). Meet users where they are, then migrate gradually. |
| Supervision marketplace has low liquidity (few supervisors) | Medium | High | Personally onboard 20 supervisors before marketplace launch. Offer first 6 months free for supervisors. Create content marketing around supervision requirements. |
| Practitioners resist sharing client relationships with platform | Medium | High | MindStack never contacts practitioner's clients directly. No cross-selling. Transparent data ownership policy. Practitioners can export all client data at any time. |
| Two-sided marketplace creates chicken-and-egg problem for directory | High | Medium | Seed with practitioner profiles from waitlist. Create value for practitioners even with zero inbound clients (profile acts as professional website). |

---

## 5. Phase 3: Scale (Q2-Q3 2027)

### Outcome Goal

> **Expand from solo practitioners to clinics and group practices. Become the system of record for multi-practitioner organizations, and the analytics backbone for practice growth.**

### Why This Phase Third

Clinics represent the highest revenue per account (INR 1,499/mo per seat, multiple seats) but have higher expectations around reliability, admin features, and support. By Phase 3, we have:

1. A stable product validated by hundreds of solo practitioners
2. Engineering infrastructure that can support multi-tenant, multi-role access
3. Revenue from solo practitioners funding the more complex clinic build

### Phase 3 Initiatives

| Initiative | Description | Target Persona | Pricing Tier |
|---|---|---|---|
| **3.1 Clinic Management** | Multi-practitioner workspace. Admin role with staff management (add/remove practitioners, assign roles). Centralized client database with access controls. Shared calendar view across practitioners. | Clinic owners, Admin staff | Clinic |
| **3.2 Practice Analytics Dashboard** | Revenue trends, session volume, client retention rate, no-show rate, average revenue per client, new vs. returning clients. Cohort analysis. Exportable reports (PDF, CSV). | All practitioners, Clinic owners | Solo (basic), Clinic (advanced) |
| **3.3 Referral Network** | Practitioner-to-practitioner referrals within MindStack. Structured referral notes. Referral tracking (sent, accepted, outcome). Cross-specialty referral matching (therapist to psychiatrist). | Practitioners, Psychiatrists | Solo |
| **3.4 Advanced Scheduling** | Room/resource booking for clinics. Practitioner availability aggregation. Buffer time between sessions. Auto-scheduling based on practitioner and client preferences. Cancellation policy enforcement. | Clinic owners, Practitioners | Clinic |
| **3.5 Group Therapy Support** | Schedule and manage group sessions. Group client list. Shared session notes. Group-specific billing (per-head or flat rate). Attendance tracking. | Practitioners | Solo |
| **3.6 Multilingual Expansion** | Add Tamil, Telugu, Kannada, Marathi, Bengali, Malayalam. Community-contributed translations with clinical review. | All users | All tiers |
| **3.7 Telehealth (v1)** | Built-in video calling (WebRTC). No Zoom/Meet dependency. Session recording (with consent). Auto-link session to calendar event and notes. Low-bandwidth mode for tier-2/3 cities. | Practitioners, Clients | Solo |
| **3.8 Insurance & Reimbursement Support** | Generate documentation formatted for insurance claims. Integration with major Indian insurers' claim submission portals (where APIs exist). Superbill generation. | Practitioners, Clients | Solo, Clinic |

### Phase 3 Milestones

| Milestone | Target Date | Description |
|---|---|---|
| **Clinic Beta** | April 2027 | 5 clinics (3-10 practitioners each) onboarded. Multi-seat billing live. |
| **Analytics Dashboard GA** | May 2027 | Available to all Solo and Clinic tier users. |
| **Telehealth Beta** | June 2027 | Video calling live for 50 practitioners. Quality benchmarking in progress. |
| **Phase 3 GA** | August 2027 | Clinic management stable. 10+ clinics on paid plans. |

### Phase 3 Dependencies

| Dependency | Owner | Risk Level | Mitigation |
|---|---|---|---|
| Multi-tenant architecture for clinic workspaces | Engineering | High | Begin schema design in Phase 2. Role-based access control (RBAC) must be built before any clinic features. |
| WebRTC infrastructure for telehealth | Engineering | High | Evaluate build vs. buy (Daily.co, Twilio Video, 100ms). Build only if cost per session minute is prohibitive with third-party providers. |
| Insurance company partnerships | Business Dev | High | Start outreach in Phase 2. If no API access, provide downloadable claim-ready documents as an interim solution. |
| Regional language clinical terminology standardization | Content / Clinical Advisory | Medium | Form a clinical advisory panel (5-7 practitioners across languages) in Phase 2. Compensate for translation review. |

### Phase 3 Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Clinic sales cycle is long (3-6 months) | High | Medium | Offer 3-month free trial for clinics. Bottom-up adoption: individual practitioners within a clinic already using MindStack advocate for clinic plan. |
| Telehealth quality issues on Indian internet infrastructure | High | High | Adaptive bitrate. Audio-only fallback. Offline-resilient note-taking even if call drops. Pre-session network quality check. |
| Analytics features become scope creep magnet | Medium | Medium | Ship v1 with 5 fixed dashboards. No custom report builder until Phase 4. Validate which metrics practitioners actually check before building more. |
| Multi-language support creates maintenance burden | Medium | Medium | Use i18n framework from day one (Phase 1). Automated translation pipeline with human clinical review as gate. Community translations reduce cost. |

---

## 6. Phase 4: Platform (Q4 2027-2028)

### Outcome Goal

> **Transform MindStack from an application into a platform: enable third-party developers, AI-assisted workflows, and ecosystem integrations that make MindStack the operating system for mental health practice in India.**

### Why This Phase Last

Platform features require:
1. Scale (thousands of practitioners generating meaningful data for AI features)
2. Stability (an API must be reliable; our core product must be battle-tested first)
3. Trust (practitioners and clients must deeply trust MindStack before we introduce AI or third-party access to their data)

### Phase 4 Initiatives

| Initiative | Description | Target Persona | Pricing Tier |
|---|---|---|---|
| **4.1 Public API (v1)** | RESTful API for practitioners to connect MindStack with their own tools. Endpoints for clients, sessions, notes (read), calendar, invoices. OAuth 2.0 authentication. Rate limiting. Comprehensive documentation. | Tech-savvy practitioners, Developers | Clinic, API add-on |
| **4.2 Integration Marketplace** | Pre-built integrations: Google Workspace, Zoom, WhatsApp Business API, Tally (accounting), Zoho CRM. Community-contributed connectors. One-click install. | All practitioners | Solo (3 integrations), Clinic (unlimited) |
| **4.3 AI-Assisted Note Drafting** | Voice-to-structured-note: practitioner records a voice memo post-session, AI generates a draft SOAP/DAP note. Practitioner reviews, edits, and approves. Never auto-submitted. Always human-in-the-loop. | Practitioners | Solo (limited), Clinic (unlimited) |
| **4.4 AI-Powered Insights** | Practice pattern detection: "3 clients cancelled this week, higher than your average." Client risk signals: "This client has missed 2 consecutive sessions." Revenue forecasting. All insights are suggestions, never clinical recommendations. | Practitioners | Clinic |
| **4.5 Outcome Measurement Tools** | Standardized assessment integration (PHQ-9, GAD-7, CORE-OM). Automated scoring. Progress visualization over time. Practitioner and client views. Aggregate (anonymized) outcome data for practice analytics. | Practitioners, Clients | Solo |
| **4.6 White-Label Option** | Clinics can white-label MindStack under their own brand. Custom domain, logo, color scheme. Practitioner-facing only (directory remains MindStack-branded). | Large clinics, Hospital groups | Enterprise (custom pricing) |
| **4.7 Training & Certification Hub** | Continuing education content. Supervision hour requirements by credential type. Auto-tracking of CE hours. Partnership with training institutes. | Trainees, All practitioners | Free (content), Solo (tracking) |
| **4.8 Anonymized Research Data Platform** | Opt-in, fully anonymized, aggregate practice data available for academic researchers. IRB-compliant data sharing framework. Practitioners see how their outcomes compare to anonymized benchmarks. | Researchers, Practitioners | Institutional licensing |

### Phase 4 Milestones

| Milestone | Target Date | Description |
|---|---|---|
| **API Beta** | October 2027 | 10 developer partners with API access. Sandbox environment live. |
| **AI Note Drafting Beta** | December 2027 | 50 practitioners testing voice-to-note. Accuracy benchmarking in progress. |
| **Integration Marketplace Launch** | February 2028 | 5 pre-built integrations live. Community contribution framework documented. |
| **Outcome Measurement GA** | April 2028 | PHQ-9 and GAD-7 integrated. Progress visualization available to all Solo+ users. |

### Phase 4 Dependencies

| Dependency | Owner | Risk Level | Mitigation |
|---|---|---|---|
| LLM infrastructure for AI features | Engineering / ML | High | Use third-party LLM API (not self-hosted) initially. Evaluate fine-tuning on clinical language with anonymized data only after IRB-equivalent review. |
| Clinical validation of AI note accuracy | Clinical Advisory / Product | High | Formal accuracy study with 10+ practitioners before any GA release. Published error rate. Mandatory human review step that cannot be bypassed. |
| Developer community for API/marketplace | Developer Relations | Medium | Start with internal integrations. Open API to select partners. Full public access only after documentation and support are robust. |
| Data anonymization pipeline for research platform | Engineering / Legal | High | Engage privacy counsel. k-anonymity or differential privacy guarantees. Separate data store. No re-identification path. |

### Phase 4 Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| AI-generated notes introduce clinical errors | Medium | Critical | Mandatory human review. Prominent "AI-drafted" watermark. Liability disclaimer. Practitioner training on AI-assisted workflow. Kill switch to disable feature. |
| Practitioners uncomfortable with AI accessing session content | High | High | Fully opt-in. Clear data handling explanation. On-device processing where feasible. Option to use AI features without voice recording (structured input instead). |
| API abuse or data scraping | Medium | High | Rate limiting. OAuth scopes. Audit logging. Terms of service enforcement. API access revocation capability. |
| White-label dilutes MindStack brand | Low | Medium | White-label only for enterprise clients. MindStack attribution in footer. Directory remains branded. |

---

## 7. ICE Scoring Matrix

### Scoring Methodology

Each initiative is scored on three dimensions (1-10 scale):

- **Impact (I):** How much does this move our North Star metrics? (User activation, retention, revenue)
- **Confidence (C):** How sure are we that this will work? Based on user research, data, and analogous evidence.
- **Ease (E):** How easy is this to build? Inverse of effort. 10 = trivial, 1 = massive undertaking.

**ICE Score = I x C x E** (Max: 1000)

### Phase 1 Scoring

| Initiative | Impact (I) | Confidence (C) | Ease (E) | ICE Score | Priority | Rationale |
|---|---|---|---|---|---|---|
| 1.5 Supervision Tracking | 9 | 7 | 7 | **441** | P0 | Strategic wedge. No competitor offers this. 47 waitlist sign-ups cite supervision as primary need. Moderate build complexity but highest differentiation. |
| 1.4 Appointment Scheduling | 8 | 9 | 7 | **504** | P0 | Universal need. High confidence from user interviews (every practitioner manages scheduling). Google Calendar sync adds complexity but is table stakes. |
| 1.2 Client Management | 8 | 9 | 8 | **576** | P0 | Foundation for everything else. Simple CRUD but must be rock-solid. Without this, nothing else works. Highest ICE but not standalone value. |
| 1.3 Session Notes | 9 | 7 | 6 | **378** | P0 | Core clinical workflow. Template engine adds complexity. Risk of low adoption if typing-heavy; mitigate with mobile-optimized input. |
| 1.1 Practitioner Onboarding | 7 | 9 | 8 | **504** | P0 | Gate to all other features. Must be fast (<3 minutes to first value). High confidence and ease. |
| 1.6 Payments (v1) | 8 | 8 | 5 | **320** | P1 | Revenue enabler for practitioners and for MindStack (payment processing margin). Razorpay integration adds third-party dependency. |
| 1.7 Public Profile Page | 6 | 7 | 8 | **336** | P1 | Low effort, provides immediate value (practitioners share link). SEO value compounds over time but slow to realize. |
| 1.8 DPDP Compliance Layer | 7 | 8 | 4 | **224** | P0 | Non-negotiable for a health data platform. Low ease because it touches every data flow. Must be built into architecture, not bolted on. |

### Phase 2 Scoring

| Initiative | Impact (I) | Confidence (C) | Ease (E) | ICE Score | Priority | Rationale |
|---|---|---|---|---|---|---|
| 2.2 Client Self-Booking | 9 | 8 | 6 | **432** | P0 | Highest-value client feature. Reduces practitioner admin time. Direct revenue impact (fewer missed bookings). |
| 2.4 Supervision Marketplace | 9 | 6 | 5 | **270** | P0 | Deepens our strategic wedge. Marketplace dynamics are uncertain (hence C=6), but if it works, it is a defensible moat. |
| 2.1 Client Portal | 7 | 8 | 6 | **336** | P0 | Necessary for two-sided platform. Client retention depends on having a reason to return. |
| 2.3 Practitioner Directory | 8 | 7 | 7 | **392** | P0 | Organic client acquisition engine. SEO value is high but takes 3-6 months to compound. |
| 2.9 Mobile App (PWA) | 8 | 8 | 5 | **320** | P0 | India is mobile-first. 80%+ of our target users will access MindStack primarily via mobile. PWA is faster to ship than native. |
| 2.5 Multilingual (Hindi) | 7 | 7 | 5 | **245** | P1 | Expands TAM significantly. Hindi speakers are 40%+ of India. But clinical terminology translation requires care. |
| 2.6 Secure Messaging | 6 | 7 | 5 | **210** | P1 | Competes with WhatsApp (entrenched habit). Value is compliance (encrypted, auditable) not convenience. |
| 2.7 Session Packages | 7 | 8 | 7 | **392** | P1 | Revenue accelerator. Simple to build. Practitioners already offer packages manually. |
| 2.8 Waitlist Management | 5 | 6 | 8 | **240** | P2 | Only valuable for full practitioners. Nice signal of demand but low immediate impact. |

### Phase 3 Scoring

| Initiative | Impact (I) | Confidence (C) | Ease (E) | ICE Score | Priority | Rationale |
|---|---|---|---|---|---|---|
| 3.1 Clinic Management | 9 | 7 | 3 | **189** | P0 | Highest revenue per account. Low ease due to multi-tenant complexity, RBAC, and shared data models. Worth the investment for ARPU. |
| 3.2 Practice Analytics | 7 | 7 | 6 | **294** | P0 | Retention driver. Practitioners who see their data stay longer. Moderate build on existing data. |
| 3.7 Telehealth (v1) | 8 | 6 | 3 | **144** | P1 | High impact but high risk (quality on Indian internet). Low ease (WebRTC infra). Build vs. buy decision is critical. |
| 3.3 Referral Network | 7 | 6 | 6 | **252** | P1 | Network effect driver. Confidence moderate because referral behavior may stay offline. |
| 3.4 Advanced Scheduling | 6 | 8 | 5 | **240** | P1 | Clinic-specific need. High confidence for the clinic persona but narrow audience until clinic adoption grows. |
| 3.5 Group Therapy Support | 6 | 6 | 5 | **180** | P2 | Niche use case. Important for certain modalities but not a priority for most users. |
| 3.6 Multilingual Expansion | 6 | 6 | 4 | **144** | P2 | Important for TAM but 6 languages is a major ongoing maintenance cost. Prioritize by user demand data from Phase 2. |
| 3.8 Insurance Support | 7 | 4 | 3 | **84** | P2 | High potential impact but very low confidence. Indian insurance coverage for therapy is nascent. Insurer APIs may not exist. |

### Phase 4 Scoring

| Initiative | Impact (I) | Confidence (C) | Ease (E) | ICE Score | Priority | Rationale |
|---|---|---|---|---|---|---|
| 4.3 AI Note Drafting | 9 | 5 | 4 | **180** | P0 | Transformative if it works. Confidence is moderate (clinical accuracy bar is high). Ease is low (LLM integration + clinical validation). |
| 4.5 Outcome Measurement | 8 | 7 | 6 | **336** | P0 | Standardized assessments are well-understood. High clinical value. Moderate build. |
| 4.1 Public API | 7 | 7 | 4 | **196** | P0 | Platform enabler. Required for ecosystem play. Documentation-heavy. |
| 4.2 Integration Marketplace | 7 | 6 | 4 | **168** | P1 | Depends on API. Value scales with number of integrations. |
| 4.4 AI Insights | 7 | 5 | 4 | **140** | P1 | Useful but practitioners may not trust AI insights initially. Requires significant data volume. |
| 4.7 Training Hub | 6 | 6 | 6 | **216** | P1 | Engagement and retention driver. Content partnerships take time. |
| 4.6 White-Label | 6 | 5 | 3 | **90** | P2 | Narrow audience. High effort. Only relevant when enterprise clients demand it. |
| 4.8 Research Data Platform | 5 | 4 | 2 | **40** | P3 | Long-term strategic value. Low confidence in researcher demand. Very high regulatory and privacy complexity. |

---

## 8. Dependencies & Risks

### Cross-Phase Dependency Map

```
Phase 1                    Phase 2                    Phase 3                    Phase 4
--------                   --------                   --------                   --------
Client Management -------> Client Portal -----------> Clinic Management -------> Public API
Session Notes -----------> Secure Messaging --------> Practice Analytics ------> AI Note Drafting
Scheduling --------------> Client Self-Booking -----> Advanced Scheduling -----> AI Insights
Supervision Tracking ----> Supervision Marketplace -> Referral Network -------> Training Hub
Payments (v1) -----------> Session Packages --------> Insurance Support -------> Integration Marketplace
Public Profile ----------> Practitioner Directory --> Group Therapy
DPDP Compliance ---------> Multilingual (Hindi) ----> Multilingual Expansion -> Research Data Platform
                           Mobile App (PWA) --------> Telehealth
```

### Top 10 Risks (Ranked by Severity)

| # | Risk | Phase | Probability | Impact | Severity (P x I) | Mitigation |
|---|---|---|---|---|---|---|
| 1 | AI-generated clinical notes contain errors that affect patient care | 4 | Medium | Critical | **Critical** | Mandatory human review. No auto-submit. Accuracy benchmarking. Kill switch. |
| 2 | Indian practitioners unwilling to pay for SaaS (price sensitivity) | 1-2 | High | High | **Critical** | Generous free tier. Price below one session fee. ROI calculator showing time saved. |
| 3 | Supervision tracking is not the adoption driver we assume | 1 | Medium | High | **High** | Validate with 10+ interviews before launch. If invalidated, pivot wedge to scheduling + India-native payments. |
| 4 | Telehealth quality fails on Indian internet infrastructure | 3 | High | High | **High** | Adaptive bitrate. Audio-only fallback. Partner with CDN provider with Indian PoPs. |
| 5 | Two-sided marketplace chicken-and-egg (directory) | 2 | High | Medium | **High** | Seed supply first. Create standalone value for practitioners (profile as website). |
| 6 | Competitor (Practo, well-funded) launches practitioner tools | 2-3 | Medium | High | **High** | Move fast on supervision wedge (they cannot easily add it). Build community loyalty. Switching cost increases with data depth. |
| 7 | DPDP Act rules are stricter than anticipated | 1-2 | Medium | High | **High** | Conservative implementation. Data minimization by default. Legal counsel on retainer. |
| 8 | Clinic sales cycles too long, burning cash | 3 | High | Medium | **Medium** | Bottom-up adoption. Free trial. Do not depend on clinic revenue until Phase 3 is 6+ months in. |
| 9 | Multilingual clinical terminology is inaccurate | 2-3 | Medium | Medium | **Medium** | Clinical advisory panel. Native-speaker review. User-reported correction workflow. |
| 10 | Key engineer attrition during critical build phases | 1-4 | Medium | Medium | **Medium** | Documentation culture. Code review requirements. Competitive compensation. No single points of failure in architecture. |

---

## 9. Success Criteria

### North Star Metric

**Weekly Active Practitioners (WAP):** Practitioners who log at least one clinical action (note, session, or supervision log) in a given week.

*Why this metric:* It measures habitual, meaningful usage. A practitioner who checks in weekly has embedded MindStack into their workflow. Vanity metrics like sign-ups or page views do not capture this.

### Phase 1 Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Practitioner sign-ups | 200 | Sign-up count |
| Weekly Active Practitioners (WAP) | 50 | Backend event tracking |
| Supervision hours logged | 500 total | Supervision module analytics |
| Session notes created | 1,000 total | Notes module analytics |
| Paid conversions (Free to Solo) | 25 practitioners | Billing system |
| NPS (practitioners) | 40+ | In-app survey at week 4 |
| Time-to-first-value (onboarding to first note/session) | <10 minutes | Funnel analytics |
| Uptime | 99.5% | Infrastructure monitoring |

### Phase 2 Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Weekly Active Practitioners | 200 | Backend event tracking |
| Client portal activations | 500 clients | Client sign-up count |
| Sessions booked via MindStack (not WhatsApp) | 40% of all sessions | Booking source tracking |
| Supervision marketplace matches | 30 | Marketplace analytics |
| Directory organic traffic | 5,000 monthly visits | Google Analytics / Plausible |
| MRR (Monthly Recurring Revenue) | INR 75,000 | Billing system |
| Practitioner retention (month-over-month) | 85%+ | Cohort analysis |
| Client rebooking rate | 60%+ | Booking analytics |

### Phase 3 Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Weekly Active Practitioners | 750 | Backend event tracking |
| Clinics on paid plans | 15 | Billing system |
| Average seats per clinic | 5+ | Billing system |
| MRR | INR 3,00,000 | Billing system |
| Practitioner-to-practitioner referrals | 100 | Referral module analytics |
| Telehealth session completion rate | 90%+ | Video call analytics |
| Practitioner retention | 90%+ | Cohort analysis |
| Languages supported | 3+ (EN, HI, +1 regional) | Release tracking |

### Phase 4 Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Weekly Active Practitioners | 2,000 | Backend event tracking |
| API active consumers | 25 | API analytics |
| AI note drafting adoption | 30% of active note-writers | Feature analytics |
| AI note accuracy (practitioner-accepted without edit) | 70%+ | Note edit tracking |
| MRR | INR 10,00,000 | Billing system |
| Outcome assessments administered | 5,000 total | Assessment module analytics |
| Integration marketplace installs | 500 | Marketplace analytics |
| Annual churn rate | <15% | Cohort analysis |

---

## 10. What We Are NOT Building

Knowing what to say no to is as important as knowing what to build. These are deliberate exclusions, not oversights.

### Explicit Anti-Goals

| What We Will NOT Build | Why Not | What We Do Instead |
|---|---|---|
| **A therapy delivery service** (employing therapists directly) | We are a SaaS platform, not a care provider. Employing therapists changes our unit economics, regulatory exposure, and competitive positioning entirely. Amaha already does this. We enable independent practitioners, not compete with them. | Provide tools that make independent practice viable and professional. |
| **Prescription management / e-prescribing** | Regulated medical act requiring drug database licensing, pharmacy integrations, and medical liability. This is a separate product category (EMR), not a feature. Getting it wrong has serious patient safety consequences. | Integrate with existing EMR/prescription systems via API in Phase 4. Partner, do not build. |
| **A consumer mental health app** (mood tracking, meditation, journaling for general public) | The consumer wellness app market is saturated (Headspace, Calm, Wysa, InnerHour). Our users are professionals, not consumers. Building consumer features dilutes focus and confuses positioning. | Client-facing features serve the practitioner-client relationship, not standalone consumer use. |
| **Video content / teletherapy content library** | Content creation and curation is a different business with different economics. We are a workflow tool, not a media company. | Partner with training institutes (NIMHANS, TISS) for CE content in Phase 4 Training Hub. |
| **Diagnostic tools / clinical decision support** | Clinical diagnosis is a regulated professional act. AI-assisted diagnosis carries enormous liability and ethical risk. Premature entry here could destroy trust with the practitioner community. | Outcome measurement tools (PHQ-9, GAD-7) provide data; clinical interpretation remains with the practitioner. |
| **A general-purpose EHR** | General EHRs serve hospitals and multi-specialty clinics. Mental health practice has unique workflows (supervision, therapeutic alliance, session notes vs. medical records). Building a general EHR dilutes our specialization. | Stay focused on mental health. Integrate with general EHRs if practitioners need it. |
| **Social features / practitioner community** | Community features (forums, groups, feeds) are engagement traps that consume engineering resources without driving core metric improvement. WhatsApp groups and LinkedIn already serve this need adequately. | Curate an email newsletter and partner with existing communities rather than building our own. |
| **Real-time crisis intervention / emergency services** | Crisis intervention requires 24/7 staffing, clinical triage protocols, and liability frameworks we are not equipped to provide. Getting this wrong is life-threatening. | Display crisis helpline numbers (iCall, Vandrevala Foundation) prominently. Auto-detect and surface crisis resources when relevant. Never position MindStack as a crisis tool. |
| **Multi-country expansion before India product-market fit** | Expanding geographically before achieving PMF in India would spread resources thin and dilute our India-native advantage. Each country has different regulations, payment systems, and clinical standards. | Prove the model in India first. International expansion is a 2029+ consideration, and only if India PMF is achieved. |
| **Native mobile apps (iOS/Android) before PWA validation** | Native apps are 3-5x more expensive to build and maintain than PWA. India's Android fragmentation makes native development complex. PWA covers 90%+ of use cases for our target users. | Ship PWA in Phase 2. Monitor usage data. Build native only if PWA limitations demonstrably hurt retention (offline, performance, device access). |

---

## 11. Release Strategy

### How Features Ship

Every feature follows a defined progression from concept to general availability. No feature skips stages.

```
Discovery --> Definition --> Build --> Alpha --> Closed Beta --> Open Beta --> GA --> Iterate
                                        |            |              |          |
                                    Internal     Invited        All users   Stable,
                                    team only    practitioners  opt-in      SLA-backed
```

### Stage Definitions

| Stage | Audience | Duration | Entry Criteria | Exit Criteria |
|---|---|---|---|---|
| **Discovery** | PM + Design + 5 users | 1-3 weeks | Problem validated, opportunity sized | Solution hypothesis documented, user research complete |
| **Definition** | PM + Design + Engineering | 1-2 weeks | Discovery complete | PRD written, designs approved, engineering estimate signed off |
| **Build** | Engineering + QA | 2-6 weeks | Definition complete, sprint planned | Feature complete, unit + integration tests passing, QA sign-off |
| **Alpha** | Internal team (5-10 people) | 1-2 weeks | Build complete | No P0/P1 bugs. Core flow works end-to-end. Performance acceptable. |
| **Closed Beta** | 10-30 invited practitioners | 2-4 weeks | Alpha sign-off | Qualitative feedback collected. No P0 bugs. P1 bugs triaged. Usage metrics collected. |
| **Open Beta** | All users, opt-in | 2-4 weeks | Closed beta learnings addressed | Quantitative success criteria trending toward target. Documentation complete. Support team trained. |
| **GA (General Availability)** | All users, default on | Ongoing | Open beta success criteria met | Feature is stable, SLA-backed, and included in tier pricing. |

### Feature Flags

All features ship behind feature flags. This enables:

- **Gradual rollout:** 1% --> 10% --> 50% --> 100% of users
- **Instant rollback:** Disable a feature in seconds without a deployment
- **Cohort testing:** A/B test feature variants with different user segments
- **Tier gating:** Same codebase, different feature access by pricing tier

### Release Cadence

| Release Type | Frequency | Scope | Communication |
|---|---|---|---|
| **Hotfix** | As needed | Bug fixes, security patches | Changelog only |
| **Minor release** | Bi-weekly (every 2 weeks) | Small improvements, polish, beta features | Changelog + in-app notification |
| **Major release** | Monthly | New features graduating to GA, significant enhancements | Blog post + email to affected users + in-app announcement |
| **Phase release** | Quarterly | Phase milestone (e.g., Phase 2 GA) | Blog post + email to all users + social media + press outreach |

### Rollback Protocol

| Severity | Response Time | Action |
|---|---|---|
| **P0 (data loss, security breach, complete outage)** | <30 minutes | Immediate rollback. Feature flag off. Incident post-mortem within 24 hours. |
| **P1 (major feature broken, payments affected)** | <2 hours | Feature flag off. Hotfix within 24 hours. |
| **P2 (minor feature broken, workaround exists)** | <24 hours | Fix in next minor release. |
| **P3 (cosmetic, low impact)** | <1 week | Fix in next minor release. |

### Beta Feedback Loop

```
Practitioner uses beta feature
        |
        v
In-app feedback widget (thumbs up/down + optional comment)
        |
        v
Feedback triaged by PM (daily during beta)
        |
        +--> Bug --> Engineering backlog (prioritized by severity)
        |
        +--> Feature request --> Parking lot (evaluated at phase planning)
        |
        +--> Usability issue --> Design review (addressed before GA)
        |
        +--> Positive signal --> Documented as evidence for GA decision
```

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **WAP** | Weekly Active Practitioners. North Star metric. |
| **MRR** | Monthly Recurring Revenue. |
| **ARPU** | Average Revenue Per User. |
| **DPDP Act** | Digital Personal Data Protection Act, 2023 (India). |
| **RCI** | Rehabilitation Council of India. Registers clinical psychologists. |
| **NMC** | National Medical Commission. Registers psychiatrists. |
| **SOAP** | Subjective, Objective, Assessment, Plan. Clinical note format. |
| **DAP** | Description, Assessment, Plan. Clinical note format. |
| **PWA** | Progressive Web App. |
| **ICE** | Impact, Confidence, Ease. Prioritization scoring framework. |
| **GA** | General Availability. Feature is stable and available to all users in the appropriate tier. |
| **P0/P1/P2/P3** | Priority levels. P0 = must have, P1 = should have, P2 = nice to have, P3 = future consideration. |

## Appendix B: Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-04-13 | Product Management | Initial roadmap document |

---

*This is a living document. It is reviewed and updated quarterly at the beginning of each phase. The most current version is always the source of truth. Previous versions are archived for reference.*
