# MindStack - Product Requirements Document (PRD)

**Document Version:** 1.0
**Author:** Product Management
**Date:** 2026-03-26
**Status:** Approved
**Stakeholders:** Engineering, Design, QA, Founders

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas](#2-user-personas)
3. [Information Architecture](#3-information-architecture)
4. [Epics & User Stories](#4-epics--user-stories)
5. [Sprint Plan](#5-sprint-plan)
6. [Technical Architecture](#6-technical-architecture)
7. [KPIs & Success Metrics](#7-kpis--success-metrics)
8. [Risk Register](#8-risk-register)
9. [Release Plan](#9-release-plan)
10. [Competitive Analysis](#10-competitive-analysis)
11. [Prioritization Matrix (MoSCoW)](#11-prioritization-matrix-moscow)

---

## 1. Product Overview

### Vision

To become India's most trusted practice management platform for mental health professionals — enabling them to focus on healing, not logistics.

### Mission

Provide an affordable, India-first, regulation-aware SaaS platform that unifies client management, clinical documentation, scheduling, payments, and supervision tracking for every category of mental health professional operating in India.

### Target Audience

MindStack serves the entire spectrum of mental health professionals in India, including but not limited to:

- **Therapists** (individual, couples, family)
- **Counselors** (school, career, rehabilitation)
- **Clinical Psychologists** (RCI-registered and in-training)
- **Psychiatrists** (medication management, integrated care)
- **Social Workers** (community mental health, case management)
- **Life Coaches** (wellness, executive coaching, personal development)
- **Art / Music / Dance Movement Therapists**
- **Trainees and Interns** under supervision

> **Note:** MindStack does NOT gate access behind RCI registration. Any practicing or in-training mental health professional can use the platform. Credential verification is optional and displayed as a trust badge.

### Value Proposition

| For Practitioners | For Clients |
|---|---|
| One platform to manage entire practice | Easy discovery of verified professionals |
| India-specific clinical note templates | Multilingual interface (Hindi, English, regional) |
| Built-in supervision hour tracking | Secure messaging and session booking |
| Razorpay-native INR payments | Transparent pricing, digital receipts |
| DPDP Act compliant data handling | Full control over personal health data |
| Public profile page for discoverability | Session history and progress tracking |

### Key Differentiators

1. **India-Focused:** Built for the Indian mental health ecosystem — INR pricing, Indian regulatory awareness (DPDP Act, MHA 2017 context), regional language support, and integration with Indian payment and messaging infrastructure (Razorpay, MSG91).

2. **Multilingual:** Interface and clinical templates available in English, Hindi, and planned support for Tamil, Telugu, Kannada, Marathi, Bengali, and Malayalam.

3. **Supervision Tracking:** First-class support for tracking supervision hours — a critical requirement for trainees and early-career professionals working toward licensure or certification.

4. **DPDP Act Compliant:** Purpose-built for India's Digital Personal Data Protection Act, 2023 — including consent management, data minimization, right to erasure, and breach notification workflows.

5. **Inclusive Professional Scope:** Unlike platforms that only serve psychiatrists or RCI-registered psychologists, MindStack welcomes counselors, coaches, social workers, and trainees.

---

## 2. User Personas

### Persona 1: Junior Counselor — Priya

| Attribute | Detail |
|---|---|
| **Name** | Priya Sharma |
| **Age** | 26 |
| **Location** | Pune, Maharashtra |
| **Qualification** | M.A. in Counseling Psychology |
| **Experience** | 1.5 years post-graduation |
| **Registration** | Not RCI-registered (counselor, not clinical psychologist) |
| **Practice Setup** | Rented cabin in a wellness center, 3 days/week |
| **Client Load** | 8-12 clients/week |
| **Supervisor** | Dr. Anand (remote supervision, bi-weekly) |
| **Income** | INR 25,000-40,000/month from practice |
| **Tech Comfort** | High — uses smartphone and laptop daily |

**Goals:**
- Track supervision hours to meet her 200-hour requirement for certification
- Maintain professional clinical notes (currently using Google Docs)
- Accept online payments without chasing clients for cash
- Build a professional online presence to attract clients

**Pain Points:**
- Manually logs supervision hours in a spreadsheet — error-prone
- No structured way to share session summaries with her supervisor
- Loses track of which clients have paid and which haven't
- WhatsApp-based scheduling leads to missed appointments and double-bookings

**Quote:** *"I spend more time managing my practice admin than actually seeing clients. I need something simple that just works."*

---

### Persona 2: Senior Clinical Psychologist — Dr. Anand

| Attribute | Detail |
|---|---|
| **Name** | Dr. Anand Krishnamurthy |
| **Age** | 45 |
| **Location** | Bengaluru, Karnataka |
| **Qualification** | M.Phil Clinical Psychology, Ph.D. |
| **Experience** | 18 years |
| **Registration** | RCI-registered (CRR No. active) |
| **Practice Setup** | Own clinic + visiting consultant at 2 hospitals |
| **Client Load** | 50+ active clients |
| **Supervisees** | 4 junior professionals |
| **Income** | INR 3,00,000+/month |
| **Tech Comfort** | Moderate — prefers clean, minimal interfaces |

**Goals:**
- Manage a large caseload efficiently across multiple practice locations
- Provide and document supervision for junior professionals
- Generate analytics on practice performance (revenue, client retention, session types)
- Maintain medico-legal quality clinical documentation

**Pain Points:**
- Uses three different tools: one for scheduling, one for billing, one for notes
- Supervision documentation is ad-hoc — no centralized log
- Cannot easily see which clients are overdue for follow-up
- Wants to delegate admin tasks but has no staff portal

**Quote:** *"At this stage in my career, I need systems that scale. I can't afford to lose a client record because it was in some random notebook."*

---

### Persona 3: Client / Patient — Meera

| Attribute | Detail |
|---|---|
| **Name** | Meera Iyer |
| **Age** | 32 |
| **Location** | Mumbai, Maharashtra |
| **Occupation** | Product Manager at a fintech startup |
| **Reason for Therapy** | Work-related anxiety, burnout |
| **Sessions** | Weekly, online (video call) |
| **Budget** | INR 2,000-3,000 per session |
| **Tech Comfort** | Very high |

**Goals:**
- Find a verified therapist who speaks her language (English + Tamil)
- Book sessions easily without back-and-forth on WhatsApp
- Pay online and get proper invoices for insurance/reimbursement
- Track her own progress over time
- Feel confident her personal data is safe

**Pain Points:**
- Therapist discovery is fragmented — relies on Instagram recommendations
- No single place to see session history, homework, or invoices
- Worried about data privacy after reading about data leaks
- Scheduling changes require multiple messages

**Quote:** *"I want therapy to feel seamless — like booking a flight, not like coordinating with a government office."*

---

### Persona 4: Psychiatrist — Dr. Kapoor

| Attribute | Detail |
|---|---|
| **Name** | Dr. Rajesh Kapoor |
| **Age** | 40 |
| **Location** | Delhi NCR |
| **Qualification** | MD Psychiatry |
| **Experience** | 12 years |
| **Registration** | MCI/NMC registered |
| **Practice Setup** | Private clinic + hospital OPD |
| **Client Load** | 80+ active patients |
| **Referral Network** | 6 therapists he regularly refers to |
| **Income** | INR 5,00,000+/month |
| **Tech Comfort** | Moderate |

**Goals:**
- Quick, structured medication notes (not lengthy SOAP notes)
- Manage referrals to therapists and receive shared progress updates
- Track medication adherence and side-effect reports
- Efficient 15-minute follow-up workflow

**Pain Points:**
- EMR systems are hospital-focused, not private-practice friendly
- No easy way to coordinate care with referring therapists
- Prescription tracking is manual
- Needs a fast documentation workflow for high-volume practice

**Quote:** *"I see 20 patients a day. I need to document in under 2 minutes per patient or I fall behind."*

---

## 3. Information Architecture

### 3.1 Practitioner Portal — Sitemap

```
/practitioner
├── /dashboard                          # Overview: today's sessions, pending tasks, revenue snapshot
├── /clients
│   ├── /                               # Client list (search, filter, sort)
│   ├── /new                            # Add new client
│   └── /[clientId]
│       ├── /overview                   # Client summary, demographics, status
│       ├── /sessions                   # Session history for this client
│       ├── /notes                      # Clinical notes (SOAP, DAP, free-text)
│       ├── /documents                  # Uploaded files (consent forms, assessments)
│       ├── /invoices                   # Payment history, pending invoices
│       └── /settings                   # Client-specific preferences, tags
├── /calendar
│   ├── /                               # Weekly/monthly calendar view
│   ├── /availability                   # Set recurring availability slots
│   └── /[sessionId]                    # Session detail / edit
├── /notes
│   ├── /                               # All notes (cross-client, searchable)
│   ├── /templates                      # Note templates (SOAP, DAP, custom)
│   └── /new                            # Quick note creation
├── /payments
│   ├── /                               # Revenue overview, transaction list
│   ├── /invoices                       # All invoices (sent, paid, overdue)
│   ├── /create-invoice                 # Manual invoice creation
│   └── /settings                       # Razorpay config, fee structure, packages
├── /supervision
│   ├── /                               # Supervision dashboard
│   ├── /as-supervisee                  # My supervision hours, log
│   ├── /as-supervisor                  # Supervisees list, hours provided
│   ├── /book                           # Book a supervision session
│   └── /log                            # Manual hour logging
├── /analytics
│   ├── /                               # Practice analytics overview
│   ├── /clients                        # Client demographics, retention
│   ├── /revenue                        # Revenue trends, forecasts
│   └── /sessions                       # Session type breakdown, no-show rate
├── /profile
│   ├── /                               # Edit professional profile
│   ├── /public-page                    # Preview public-facing page
│   └── /credentials                    # Upload qualifications, verifications
├── /notifications
│   └── /                               # Notification center (all channels)
└── /settings
    ├── /account                        # Email, password, 2FA
    ├── /practice                       # Practice name, locations, working hours
    ├── /billing                        # Subscription plan, payment method
    ├── /integrations                   # Google Calendar, Razorpay, etc.
    ├── /privacy                        # Data export, deletion requests
    └── /preferences                    # Language, theme, notification prefs
```

### 3.2 Client Portal — Sitemap

```
/client
├── /dashboard                          # Upcoming sessions, therapist info, quick actions
├── /therapist
│   ├── /                               # My therapist's profile
│   └── /reviews                        # Leave/view reviews
├── /sessions
│   ├── /                               # Session history
│   ├── /book                           # Book a new session
│   ├── /[sessionId]                    # Session detail (date, notes shared, homework)
│   └── /reschedule                     # Reschedule existing session
├── /payments
│   ├── /                               # Payment history
│   ├── /pending                        # Outstanding invoices
│   └── /receipts                       # Download receipts/invoices
├── /documents
│   ├── /                               # Shared documents (consent forms, worksheets)
│   └── /upload                         # Upload documents for therapist
├── /progress
│   └── /                               # Self-reported mood tracking, session summaries
├── /notifications
│   └── /                               # Notification center
└── /settings
    ├── /account                        # Email, phone, password
    ├── /privacy                        # Data export, consent management, deletion
    └── /preferences                    # Language, notification prefs
```

### 3.3 Admin Panel — Sitemap

```
/admin
├── /dashboard                          # Platform metrics overview
├── /users
│   ├── /practitioners                  # All practitioners (verify, suspend, support)
│   └── /clients                        # All clients (support, data requests)
├── /verification                       # Credential verification queue
├── /reports                            # Revenue, growth, usage analytics
├── /content                            # Manage templates, help articles
├── /compliance                         # DPDP audit log, data requests
└── /settings                           # Platform configuration
```

---

## 4. Epics & User Stories

### EPIC: MS-100 — Authentication & Onboarding

**Priority:** P0
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 1-2
**Status:** DONE

```
MS-100-1: As a practitioner, I want to sign up using my email and password
          so that I can create my MindStack account.
  Acceptance Criteria:
    - [ ] Email + password registration with validation (min 8 chars, 1 uppercase, 1 number)
    - [ ] Email verification via OTP or magic link
    - [ ] Duplicate email detection with clear error message
    - [ ] Password stored as bcrypt hash (min 12 rounds)
  Story Points: 5
  Labels: [backend, frontend, auth]

MS-100-2: As a practitioner, I want to sign in with Google OAuth
          so that I can access my account without remembering another password.
  Acceptance Criteria:
    - [ ] Google OAuth 2.0 via NextAuth v5
    - [ ] Auto-link if email already exists in the system
    - [ ] Profile picture pulled from Google account
    - [ ] Fallback to email/password if OAuth fails
  Story Points: 3
  Labels: [backend, auth, integration]

MS-100-3: As a new practitioner, I want to complete an onboarding wizard
          so that my profile is set up correctly from day one.
  Acceptance Criteria:
    - [ ] Step 1: Professional details (title, specializations, languages)
    - [ ] Step 2: Practice setup (location, online/in-person, session fees)
    - [ ] Step 3: Availability (working days, time slots)
    - [ ] Step 4: Upload profile photo and bio
    - [ ] Progress indicator visible at all steps
    - [ ] Can skip and complete later (but dashboard shows completion prompt)
  Story Points: 8
  Labels: [frontend, backend, design]

MS-100-4: As a practitioner, I want to reset my password securely
          so that I can regain access if I forget it.
  Acceptance Criteria:
    - [ ] Reset link sent via email (expires in 30 minutes)
    - [ ] Rate-limited to 3 requests per hour per email
    - [ ] Previous sessions invalidated on password change
    - [ ] Confirmation email after successful reset
  Story Points: 3
  Labels: [backend, auth]

MS-100-5: As a client, I want to create an account using my phone number or email
          so that I can book sessions with my therapist.
  Acceptance Criteria:
    - [ ] Phone number + OTP registration (via MSG91)
    - [ ] Email + password registration as alternative
    - [ ] Minimal onboarding: name, preferred language, emergency contact (optional)
    - [ ] Consent form presented and accepted before account activation
  Story Points: 5
  Labels: [backend, frontend, auth]

MS-100-6: As a platform admin, I want role-based access control (RBAC)
          so that users only access features appropriate to their role.
  Acceptance Criteria:
    - [ ] Roles: PRACTITIONER, CLIENT, ADMIN, SUPER_ADMIN
    - [ ] Middleware-level route protection
    - [ ] API-level permission checks on all endpoints
    - [ ] Role displayed in session token (JWT claims)
  Story Points: 5
  Labels: [backend, auth, security]
```

---

### EPIC: MS-200 — Practitioner Dashboard

**Priority:** P0
**Owner:** Frontend Team
**Sprint Target:** Sprint 3
**Status:** IN PROGRESS

```
MS-200-1: As a practitioner, I want to see today's sessions on my dashboard
          so that I know my schedule at a glance.
  Acceptance Criteria:
    - [ ] List of today's sessions sorted by time
    - [ ] Each card shows: client name, time, session type (online/in-person), status
    - [ ] Click to open session detail or start video link
    - [ ] Empty state if no sessions today
  Story Points: 5
  Labels: [frontend, backend]

MS-200-2: As a practitioner, I want to see a revenue snapshot for the current month
          so that I can track my earnings.
  Acceptance Criteria:
    - [ ] Total revenue (current month) in INR
    - [ ] Comparison with previous month (% change)
    - [ ] Breakdown: collected vs. pending
    - [ ] Data refreshed on dashboard load (no stale cache > 5 min)
  Story Points: 3
  Labels: [frontend, backend]

MS-200-3: As a practitioner, I want to see pending tasks and action items
          so that I don't miss important follow-ups.
  Acceptance Criteria:
    - [ ] Unsigned/incomplete clinical notes
    - [ ] Unpaid invoices (overdue > 7 days)
    - [ ] Clients without a next session booked
    - [ ] Supervision hours due this month
    - [ ] Each item is clickable and navigates to relevant page
  Story Points: 5
  Labels: [frontend, backend]

MS-200-4: As a practitioner, I want a quick-action bar on the dashboard
          so that I can perform frequent tasks in one click.
  Acceptance Criteria:
    - [ ] Buttons: "New Client", "New Session", "Create Note", "Send Invoice"
    - [ ] Keyboard shortcuts for power users (Cmd/Ctrl + K command palette)
    - [ ] Responsive layout — stacks vertically on mobile
  Story Points: 3
  Labels: [frontend, design]

MS-200-5: As a practitioner, I want to see upcoming sessions for the next 7 days
          so that I can plan my week.
  Acceptance Criteria:
    - [ ] Scrollable list or mini-calendar for next 7 days
    - [ ] Count of sessions per day
    - [ ] Click on a day to expand session list
  Story Points: 3
  Labels: [frontend]
```

---

### EPIC: MS-300 — Client Management

**Priority:** P0
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 3-4
**Status:** NOT STARTED

```
MS-300-1: As a practitioner, I want to add a new client with their demographic details
          so that I can maintain a client registry.
  Acceptance Criteria:
    - [ ] Fields: name, email, phone, DOB, gender, preferred language, emergency contact
    - [ ] Optional: referral source, presenting concern (free text), tags
    - [ ] Phone/email uniqueness check within practitioner's client list
    - [ ] Client receives invite to Client Portal (optional, togglable)
  Story Points: 5
  Labels: [frontend, backend]

MS-300-2: As a practitioner, I want to search, filter, and sort my client list
          so that I can quickly find any client.
  Acceptance Criteria:
    - [ ] Search by name, email, phone (instant, debounced)
    - [ ] Filter by: status (active, inactive, discharged), tags, date added
    - [ ] Sort by: name (A-Z), last session date, date added
    - [ ] Pagination (20 clients/page) with total count
  Story Points: 5
  Labels: [frontend, backend]

MS-300-3: As a practitioner, I want to view a comprehensive client profile page
          so that I have all relevant information in one place.
  Acceptance Criteria:
    - [ ] Overview tab: demographics, presenting concern, status, tags
    - [ ] Sessions tab: chronological session history with notes link
    - [ ] Notes tab: all clinical notes for this client
    - [ ] Documents tab: uploaded consent forms, assessments, reports
    - [ ] Invoices tab: payment history, outstanding amounts
    - [ ] Activity log: timestamped record of all actions on this client record
  Story Points: 8
  Labels: [frontend, backend]

MS-300-4: As a practitioner, I want to update a client's status
          (active, on-hold, discharged) so that I can manage my caseload.
  Acceptance Criteria:
    - [ ] Status options: Active, On Hold, Discharged, Waitlist
    - [ ] Discharge requires a discharge summary (optional but prompted)
    - [ ] Status change logged in activity history
    - [ ] Discharged clients moved to separate archive view
  Story Points: 3
  Labels: [frontend, backend]

MS-300-5: As a practitioner, I want to tag clients with custom labels
          so that I can organize and segment my caseload.
  Acceptance Criteria:
    - [ ] Create custom tags (e.g., "anxiety", "couples", "corporate", "supervision-case")
    - [ ] Assign multiple tags per client
    - [ ] Filter client list by tags
    - [ ] Tags are color-coded
  Story Points: 3
  Labels: [frontend, backend]

MS-300-6: As a practitioner, I want to send an intake form to new clients
          so that I can collect preliminary information before the first session.
  Acceptance Criteria:
    - [ ] Default intake form template (customizable)
    - [ ] Sent via email or SMS link
    - [ ] Client fills form on Client Portal (no login required for first form)
    - [ ] Responses auto-populate client profile fields
    - [ ] Practitioner notified when form is submitted
  Story Points: 8
  Labels: [frontend, backend, integration]

MS-300-7: As a practitioner, I want to export a client's complete record
          so that I can share it with another provider or comply with data requests.
  Acceptance Criteria:
    - [ ] Export as PDF (formatted) or JSON (machine-readable)
    - [ ] Includes: demographics, session history, notes, invoices
    - [ ] Requires 2FA confirmation before export
    - [ ] Export event logged in audit trail
  Story Points: 5
  Labels: [backend, security]
```

---

### EPIC: MS-400 — Session & Calendar Management

**Priority:** P0
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 3-4
**Status:** NOT STARTED

```
MS-400-1: As a practitioner, I want to set my recurring weekly availability
          so that clients can only book during my working hours.
  Acceptance Criteria:
    - [ ] Set availability per day of week (e.g., Mon 10am-1pm, 3pm-6pm)
    - [ ] Support multiple time blocks per day
    - [ ] Set session duration (30/45/60/90 min) and buffer between sessions
    - [ ] Override availability for specific dates (holidays, leave)
  Story Points: 5
  Labels: [frontend, backend]

MS-400-2: As a practitioner, I want to create a new session (manual booking)
          so that I can schedule sessions for existing clients.
  Acceptance Criteria:
    - [ ] Select client, date, time, duration, type (individual/couple/group)
    - [ ] Mode: online (auto-generate video link) or in-person (location)
    - [ ] Recurring session option (weekly/biweekly for N weeks)
    - [ ] Conflict detection against existing sessions and availability
    - [ ] Client notified via email + SMS on booking
  Story Points: 8
  Labels: [frontend, backend, integration]

MS-400-3: As a practitioner, I want a weekly/monthly calendar view
          so that I can visualize my schedule.
  Acceptance Criteria:
    - [ ] Weekly view (default): time grid with session blocks
    - [ ] Monthly view: day cells with session count
    - [ ] Color-coded by session type or client tag
    - [ ] Drag-and-drop to reschedule (with confirmation)
    - [ ] Click on empty slot to create new session
  Story Points: 8
  Labels: [frontend, design]

MS-400-4: As a practitioner, I want to sync my MindStack calendar with Google Calendar
          so that I have one unified schedule.
  Acceptance Criteria:
    - [ ] Two-way sync via Google Calendar API
    - [ ] MindStack sessions appear as events in Google Calendar
    - [ ] Google Calendar events block availability in MindStack
    - [ ] Sync frequency: real-time via webhooks, fallback polling every 5 min
    - [ ] Privacy: Google Calendar events show as "Busy" only (no client names)
  Story Points: 8
  Labels: [backend, integration]

MS-400-5: As a client, I want to book a session from available slots
          so that I can schedule my therapy appointment independently.
  Acceptance Criteria:
    - [ ] View available slots for next 4 weeks
    - [ ] Select preferred date and time
    - [ ] Confirm booking with payment (pre-pay) or pay-later option
    - [ ] Receive confirmation via email + SMS
    - [ ] Session appears in client dashboard
  Story Points: 8
  Labels: [frontend, backend]

MS-400-6: As a practitioner or client, I want to reschedule or cancel a session
          so that I can accommodate changes in availability.
  Acceptance Criteria:
    - [ ] Reschedule: select new slot, notify other party
    - [ ] Cancel: with reason (optional), notify other party
    - [ ] Cancellation policy enforcement (e.g., no free cancel within 24h)
    - [ ] Refund handling per practitioner's cancellation policy
    - [ ] Session status updated: Scheduled -> Rescheduled / Cancelled
  Story Points: 5
  Labels: [frontend, backend]

MS-400-7: As a practitioner, I want to mark a session as completed or no-show
          so that I can track attendance and trigger post-session workflows.
  Acceptance Criteria:
    - [ ] Status options: Completed, No-Show, Cancelled (late)
    - [ ] Completing a session prompts clinical note creation
    - [ ] No-show triggers configurable action (charge fee, send follow-up)
    - [ ] Session status feeds into analytics
  Story Points: 3
  Labels: [frontend, backend]
```

---

### EPIC: MS-500 — Clinical Notes

**Priority:** P0
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 4
**Status:** NOT STARTED

```
MS-500-1: As a practitioner, I want to write SOAP notes for a session
          so that I maintain structured clinical documentation.
  Acceptance Criteria:
    - [ ] Template: Subjective, Objective, Assessment, Plan — each as rich-text field
    - [ ] Auto-linked to session and client
    - [ ] Auto-save every 30 seconds (draft state)
    - [ ] Sign/lock note (makes it immutable, timestamped)
    - [ ] Signed notes cannot be edited, only addended
  Story Points: 8
  Labels: [frontend, backend]

MS-500-2: As a practitioner, I want to write DAP notes
          so that I can use my preferred documentation format.
  Acceptance Criteria:
    - [ ] Template: Data, Assessment, Plan — each as rich-text field
    - [ ] Same auto-save, sign/lock behavior as SOAP
    - [ ] Practitioner can set default note type in settings
  Story Points: 5
  Labels: [frontend, backend]

MS-500-3: As a practitioner, I want to write free-text notes
          so that I can document sessions without a rigid template.
  Acceptance Criteria:
    - [ ] Single rich-text editor (bold, italic, bullet points, headings)
    - [ ] Optional title field
    - [ ] Same auto-save and sign/lock behavior
  Story Points: 3
  Labels: [frontend, backend]

MS-500-4: As a practitioner, I want to create custom note templates
          so that I can standardize documentation for my practice.
  Acceptance Criteria:
    - [ ] Template builder: add named sections with placeholder text
    - [ ] Save as reusable template
    - [ ] Share template with other practitioners (opt-in)
    - [ ] Platform provides starter templates (SOAP, DAP, Progress Note, Intake Note)
  Story Points: 5
  Labels: [frontend, backend]

MS-500-5: As a practitioner, I want to search across all my clinical notes
          so that I can quickly find past documentation.
  Acceptance Criteria:
    - [ ] Full-text search across note content
    - [ ] Filter by: client, date range, note type, signed/draft
    - [ ] Results highlight matching terms
    - [ ] Search respects data access permissions (practitioner sees only own notes)
  Story Points: 5
  Labels: [frontend, backend]

MS-500-6: As a practitioner, I want to add an addendum to a signed note
          so that I can append corrections without altering the original.
  Acceptance Criteria:
    - [ ] Addendum appears below original note with separate timestamp
    - [ ] Original note text remains unchanged and visible
    - [ ] Addendum also requires signing/locking
    - [ ] Audit trail: "Addendum added by [name] on [date]"
  Story Points: 3
  Labels: [frontend, backend]
```

---

### EPIC: MS-600 — Payments & Invoicing

**Priority:** P1
**Owner:** Backend Team
**Sprint Target:** Sprint 5
**Status:** NOT STARTED

```
MS-600-1: As a practitioner, I want to set my session fee structure
          so that clients know my rates.
  Acceptance Criteria:
    - [ ] Set fee per session type (individual, couple, group)
    - [ ] Support packages (e.g., 4 sessions for INR 7,000)
    - [ ] Sliding scale / reduced fee option (private, not shown publicly)
    - [ ] All amounts in INR
  Story Points: 5
  Labels: [backend, frontend]

MS-600-2: As a practitioner, I want to generate and send invoices to clients
          so that I can collect payments professionally.
  Acceptance Criteria:
    - [ ] Auto-generate invoice after session completion
    - [ ] Manual invoice creation for custom charges
    - [ ] Invoice fields: practitioner details, client details, session date, amount, GST (if applicable), due date
    - [ ] Send via email with PDF attachment
    - [ ] Invoice statuses: Draft, Sent, Paid, Overdue, Cancelled
  Story Points: 8
  Labels: [backend, frontend, integration]

MS-600-3: As a client, I want to pay my invoice online via Razorpay
          so that I can pay conveniently using UPI, cards, or net banking.
  Acceptance Criteria:
    - [ ] Razorpay payment link embedded in invoice
    - [ ] Supported methods: UPI, Credit/Debit Card, Net Banking, Wallets
    - [ ] Payment confirmation with receipt (email + in-app)
    - [ ] Invoice status auto-updated to "Paid" on webhook confirmation
    - [ ] Failed payment retry flow
  Story Points: 8
  Labels: [backend, integration]

MS-600-4: As a practitioner, I want to view my revenue dashboard
          so that I can understand my financial performance.
  Acceptance Criteria:
    - [ ] Monthly revenue chart (last 12 months)
    - [ ] Total collected vs. total outstanding
    - [ ] Payment method breakdown (UPI, card, cash, etc.)
    - [ ] Export transactions as CSV
  Story Points: 5
  Labels: [frontend, backend]

MS-600-5: As a practitioner, I want to record cash/offline payments
          so that my records are complete even for non-digital transactions.
  Acceptance Criteria:
    - [ ] Mark invoice as "Paid — Cash" or "Paid — Bank Transfer"
    - [ ] Add payment date and optional reference note
    - [ ] Reflected in revenue dashboard
  Story Points: 3
  Labels: [frontend, backend]

MS-600-6: As a practitioner, I want to configure Razorpay split payments
          so that platform fees are automatically deducted.
  Acceptance Criteria:
    - [ ] Razorpay Route (split payment) integration
    - [ ] Platform commission configurable per plan (e.g., 2% on Pro, 0% on Enterprise)
    - [ ] Practitioner sees net amount after platform fee
    - [ ] Settlement to practitioner's bank account per Razorpay schedule
  Story Points: 8
  Labels: [backend, integration]
```

---

### EPIC: MS-700 — Supervision

**Priority:** P1
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 5-6
**Status:** NOT STARTED

```
MS-700-1: As a supervisee, I want to log supervision hours
          so that I can track my progress toward certification requirements.
  Acceptance Criteria:
    - [ ] Log entry: date, duration, supervisor name, modality (individual/group)
    - [ ] Attach session/case discussed (optional)
    - [ ] Running total of hours with progress bar toward target
    - [ ] Configurable target (e.g., 200 hours for RCI M.Phil)
  Story Points: 5
  Labels: [frontend, backend]

MS-700-2: As a supervisee, I want to book supervision sessions with my supervisor
          so that I can schedule our meetings through the platform.
  Acceptance Criteria:
    - [ ] Search for supervisor by name or invite via email
    - [ ] View supervisor's available supervision slots
    - [ ] Book and pay for supervision session
    - [ ] Confirmation sent to both parties
  Story Points: 8
  Labels: [frontend, backend]

MS-700-3: As a supervisor, I want to view all my supervisees and their logged hours
          so that I can track their progress.
  Acceptance Criteria:
    - [ ] Dashboard showing all supervisees
    - [ ] Each supervisee: total hours logged, hours remaining, last session date
    - [ ] Click to view detailed log for each supervisee
    - [ ] Verify/approve logged hours (optional workflow)
  Story Points: 5
  Labels: [frontend, backend]

MS-700-4: As a supervisee, I want to export my supervision hours as a certificate/report
          so that I can submit it to RCI or my institution.
  Acceptance Criteria:
    - [ ] PDF export with: supervisor details, total hours, date range, session breakdown
    - [ ] Option for supervisor to digitally sign the report
    - [ ] Includes MindStack verification QR code / unique ID
    - [ ] Formatted per common institutional requirements
  Story Points: 5
  Labels: [backend, frontend]

MS-700-5: As a supervisor, I want to share session notes or feedback with my supervisee
          so that they have written guidance for their development.
  Acceptance Criteria:
    - [ ] Supervision note template (distinct from clinical note)
    - [ ] Shared securely with supervisee only
    - [ ] Supervisee can view but not edit
    - [ ] Linked to the supervision session
  Story Points: 5
  Labels: [frontend, backend]
```

---

### EPIC: MS-800 — Analytics & Reporting

**Priority:** P1
**Owner:** Frontend Team
**Sprint Target:** Sprint 6
**Status:** NOT STARTED

```
MS-800-1: As a practitioner, I want to see client demographics analytics
          so that I understand the composition of my caseload.
  Acceptance Criteria:
    - [ ] Charts: age distribution, gender breakdown, presenting concerns
    - [ ] New clients per month (trend)
    - [ ] Active vs. discharged vs. on-hold ratio
    - [ ] Filter by date range
  Story Points: 5
  Labels: [frontend, backend]

MS-800-2: As a practitioner, I want to see session analytics
          so that I can optimize my scheduling.
  Acceptance Criteria:
    - [ ] Total sessions per month (trend)
    - [ ] Breakdown by type (individual, couple, group)
    - [ ] No-show rate and cancellation rate
    - [ ] Average sessions per client
    - [ ] Busiest day of week / time of day
  Story Points: 5
  Labels: [frontend, backend]

MS-800-3: As a practitioner, I want to see revenue analytics
          so that I can make informed business decisions.
  Acceptance Criteria:
    - [ ] Monthly revenue trend (12 months)
    - [ ] Revenue per client (top 10)
    - [ ] Collection rate (invoiced vs. collected)
    - [ ] Outstanding amount aging (30/60/90 days)
  Story Points: 5
  Labels: [frontend, backend]

MS-800-4: As a practitioner, I want to download reports as PDF
          so that I can share them with accountants or stakeholders.
  Acceptance Criteria:
    - [ ] One-click PDF export for each analytics section
    - [ ] Branded with practice name and MindStack logo
    - [ ] Date range and filters reflected in report
  Story Points: 3
  Labels: [frontend, backend]
```

---

### EPIC: MS-900 — Profile & Public Page

**Priority:** P1
**Owner:** Frontend Team
**Sprint Target:** Sprint 5
**Status:** NOT STARTED

```
MS-900-1: As a practitioner, I want to create a professional public profile page
          so that potential clients can find and learn about me.
  Acceptance Criteria:
    - [ ] URL: mindstack.in/p/[slug] (custom slug)
    - [ ] Sections: photo, bio, qualifications, specializations, languages, fees, location
    - [ ] Verification badges (RCI, MCI/NMC) displayed if verified
    - [ ] "Book a Session" CTA button
    - [ ] SEO optimized (meta tags, structured data)
  Story Points: 8
  Labels: [frontend, backend, design]

MS-900-2: As a practitioner, I want to upload and manage my credentials
          so that I can get verified on the platform.
  Acceptance Criteria:
    - [ ] Upload: degree certificates, RCI/NMC registration, experience letters
    - [ ] Files stored on Cloudinary (encrypted at rest)
    - [ ] Verification request submitted to admin queue
    - [ ] Status: Pending, Verified, Rejected (with reason)
  Story Points: 5
  Labels: [frontend, backend, integration]

MS-900-3: As a client, I want to view a practitioner's public profile
          so that I can decide if they are the right fit for me.
  Acceptance Criteria:
    - [ ] Profile loads without login
    - [ ] Shows: bio, qualifications, specializations, languages, fee range
    - [ ] "Book a Session" redirects to booking flow (login required)
    - [ ] Mobile-responsive design
  Story Points: 5
  Labels: [frontend]
```

---

### EPIC: MS-1000 — Settings & Preferences

**Priority:** P2
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 6
**Status:** NOT STARTED

```
MS-1000-1: As a practitioner, I want to manage my account settings
           so that I can update my email, password, and security preferences.
  Acceptance Criteria:
    - [ ] Change email (requires re-verification)
    - [ ] Change password (requires current password)
    - [ ] Enable/disable 2FA (TOTP-based)
    - [ ] View active sessions and revoke them
  Story Points: 5
  Labels: [frontend, backend, auth]

MS-1000-2: As a practitioner, I want to set my preferred language
           so that the interface is in a language I am comfortable with.
  Acceptance Criteria:
    - [ ] Language options: English, Hindi (more in future releases)
    - [ ] Persisted in user preferences (DB, not just browser)
    - [ ] Applied across all pages and email communications
  Story Points: 3
  Labels: [frontend, backend]

MS-1000-3: As a practitioner, I want to configure my notification preferences
           so that I only receive the alerts I care about.
  Acceptance Criteria:
    - [ ] Toggle per notification type: session reminders, payment received, new client, etc.
    - [ ] Toggle per channel: email, SMS, in-app
    - [ ] Default: all on (opt-out model)
  Story Points: 3
  Labels: [frontend, backend]

MS-1000-4: As a practitioner, I want to manage my subscription plan
           so that I can upgrade, downgrade, or cancel.
  Acceptance Criteria:
    - [ ] View current plan and usage (clients, storage)
    - [ ] Upgrade/downgrade with prorated billing
    - [ ] Cancel with 30-day notice (data retained for 90 days)
    - [ ] Invoice history for subscription payments
  Story Points: 5
  Labels: [frontend, backend]
```

---

### EPIC: MS-1100 — Client Portal

**Priority:** P1
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 7-8
**Status:** NOT STARTED

```
MS-1100-1: As a client, I want a dashboard showing my upcoming sessions and therapist info
           so that I can stay on top of my therapy journey.
  Acceptance Criteria:
    - [ ] Next session: date, time, therapist name, mode (online/in-person)
    - [ ] Quick actions: reschedule, cancel, message therapist
    - [ ] Therapist's photo and specialization visible
    - [ ] Mood check-in prompt (optional, configurable by therapist)
  Story Points: 5
  Labels: [frontend, backend]

MS-1100-2: As a client, I want to view my session history
           so that I can track my therapy progress over time.
  Acceptance Criteria:
    - [ ] Chronological list of past sessions
    - [ ] Each entry: date, duration, note summary (if shared by therapist)
    - [ ] Homework or action items from session (if shared)
    - [ ] No access to full clinical notes (practitioner-only)
  Story Points: 5
  Labels: [frontend, backend]

MS-1100-3: As a client, I want to log my mood between sessions
           so that my therapist has data to reference.
  Acceptance Criteria:
    - [ ] Daily mood rating (1-5 scale with emoji/labels)
    - [ ] Optional free-text journal entry
    - [ ] Mood trend chart visible to client
    - [ ] Shared with therapist (client can toggle sharing on/off)
  Story Points: 5
  Labels: [frontend, backend]

MS-1100-4: As a client, I want to access and sign consent forms digitally
           so that I don't have to deal with paper forms.
  Acceptance Criteria:
    - [ ] View consent form sent by therapist
    - [ ] Digital signature (typed name + checkbox or drawn signature)
    - [ ] Signed form stored and accessible to both parties
    - [ ] Timestamp and IP address logged
  Story Points: 5
  Labels: [frontend, backend]

MS-1100-5: As a client, I want to securely message my therapist
           so that I can share updates or ask questions between sessions.
  Acceptance Criteria:
    - [ ] Text-based messaging (not real-time chat — async)
    - [ ] Therapist can set boundaries (e.g., "I respond within 48h")
    - [ ] Messages encrypted in transit and at rest
    - [ ] Therapist can disable messaging for specific clients
  Story Points: 8
  Labels: [frontend, backend, security]
```

---

### EPIC: MS-1200 — Notifications

**Priority:** P1
**Owner:** Backend Team
**Sprint Target:** Sprint 7
**Status:** NOT STARTED

```
MS-1200-1: As a user, I want to receive email notifications for key events
           so that I stay informed about my practice/therapy.
  Acceptance Criteria:
    - [ ] Events: session booked/rescheduled/cancelled, payment received, new message
    - [ ] Branded email templates (responsive HTML)
    - [ ] Unsubscribe link in every email
    - [ ] Sent via transactional email service (MSG91 or similar)
  Story Points: 5
  Labels: [backend, integration]

MS-1200-2: As a user, I want to receive SMS notifications for session reminders
           so that I don't miss appointments.
  Acceptance Criteria:
    - [ ] SMS sent via MSG91 API
    - [ ] Reminder: 24 hours before + 1 hour before session
    - [ ] Content: session time, therapist/client name, join link (if online)
    - [ ] DND compliance (SMS sent only between 9am-9pm IST)
    - [ ] SMS costs tracked per practitioner
  Story Points: 5
  Labels: [backend, integration]

MS-1200-3: As a user, I want in-app notifications
           so that I see updates while using the platform.
  Acceptance Criteria:
    - [ ] Bell icon in header with unread count badge
    - [ ] Dropdown showing recent notifications
    - [ ] Click to navigate to relevant page
    - [ ] Mark as read (individual + mark all as read)
    - [ ] Persisted in database (not just ephemeral)
  Story Points: 5
  Labels: [frontend, backend]

MS-1200-4: As a practitioner, I want to send custom reminders to clients
           so that I can nudge them for follow-ups or homework.
  Acceptance Criteria:
    - [ ] Select client(s), compose message, select channel (email/SMS)
    - [ ] Schedule for later or send immediately
    - [ ] Template messages for common reminders
    - [ ] Delivery status tracking
  Story Points: 5
  Labels: [frontend, backend, integration]
```

---

### EPIC: MS-1300 — Admin Panel

**Priority:** P2
**Owner:** Full-Stack Team
**Sprint Target:** Sprint 9
**Status:** NOT STARTED

```
MS-1300-1: As an admin, I want a dashboard showing platform-wide metrics
           so that I can monitor the health of the platform.
  Acceptance Criteria:
    - [ ] Total practitioners, total clients, total sessions (all time + this month)
    - [ ] Revenue processed through platform
    - [ ] New sign-ups trend (daily/weekly/monthly)
    - [ ] Active users (DAU, WAU, MAU)
  Story Points: 5
  Labels: [frontend, backend]

MS-1300-2: As an admin, I want to verify practitioner credentials
           so that we can display trust badges on profiles.
  Acceptance Criteria:
    - [ ] Queue of pending verification requests
    - [ ] View uploaded documents inline
    - [ ] Approve or reject with reason
    - [ ] Practitioner notified of outcome via email
    - [ ] Verification badge auto-displayed on public profile
  Story Points: 5
  Labels: [frontend, backend]

MS-1300-3: As an admin, I want to manage user accounts
           so that I can handle support requests and policy violations.
  Acceptance Criteria:
    - [ ] Search users by name, email, phone
    - [ ] View user details, login history, activity log
    - [ ] Suspend or deactivate accounts (with reason)
    - [ ] Impersonate user for support debugging (logged, admin-only)
  Story Points: 5
  Labels: [frontend, backend, security]

MS-1300-4: As an admin, I want to view and respond to DPDP data requests
           so that we remain compliant with the law.
  Acceptance Criteria:
    - [ ] Incoming data requests: access, correction, erasure
    - [ ] Assigned to compliance team member
    - [ ] Track status: Received, In Progress, Completed, Rejected
    - [ ] Deadline tracking (72-hour response for breach notifications)
    - [ ] Audit log for all actions taken
  Story Points: 8
  Labels: [backend, security]
```

---

### EPIC: MS-1400 — Integrations

**Priority:** P1
**Owner:** Backend Team
**Sprint Target:** Sprint 9-10
**Status:** NOT STARTED

```
MS-1400-1: As a platform, I want Razorpay integration
           so that practitioners can accept online payments.
  Acceptance Criteria:
    - [ ] Razorpay Standard Checkout (web + mobile)
    - [ ] Razorpay Route for split payments
    - [ ] Webhook handling for payment confirmation, refund, dispute
    - [ ] PCI-DSS compliant (no card data stored on our servers)
  Story Points: 8
  Labels: [backend, integration]

MS-1400-2: As a platform, I want MSG91 integration
           so that we can send transactional SMS and OTPs.
  Acceptance Criteria:
    - [ ] OTP sending and verification for phone auth
    - [ ] Transactional SMS for session reminders
    - [ ] DLT template registration for TRAI compliance
    - [ ] Delivery status callbacks
    - [ ] Fallback provider configuration
  Story Points: 5
  Labels: [backend, integration]

MS-1400-3: As a platform, I want Cloudinary integration
           so that we can handle file uploads (profile photos, documents) efficiently.
  Acceptance Criteria:
    - [ ] Image upload with auto-optimization (resize, format conversion)
    - [ ] Secure PDF/document storage
    - [ ] Signed URLs for private documents (time-limited access)
    - [ ] Storage quota tracking per practitioner
  Story Points: 5
  Labels: [backend, integration]

MS-1400-4: As a platform, I want Google Calendar integration
           so that practitioners can sync their schedules.
  Acceptance Criteria:
    - [ ] OAuth 2.0 consent flow for Google Calendar
    - [ ] Two-way sync (as specified in MS-400-4)
    - [ ] Graceful handling of token expiry and re-auth
    - [ ] Privacy controls (no client data sent to Google)
  Story Points: 8
  Labels: [backend, integration]
```

---

### EPIC: MS-1500 — Security & Compliance

**Priority:** P0
**Owner:** Backend Team + Security
**Sprint Target:** Ongoing (every sprint)
**Status:** IN PROGRESS

```
MS-1500-1: As a platform, I want all data encrypted at rest and in transit
           so that user data is protected from unauthorized access.
  Acceptance Criteria:
    - [ ] TLS 1.3 enforced for all connections
    - [ ] Database encryption at rest (AES-256 via provider)
    - [ ] Sensitive fields (notes, documents) encrypted at application level
    - [ ] Encryption keys managed via environment variables (not in code)
  Story Points: 5
  Labels: [backend, security, infrastructure]

MS-1500-2: As a platform, I want to comply with India's DPDP Act, 2023
           so that we operate lawfully and protect user rights.
  Acceptance Criteria:
    - [ ] Consent collection before processing personal data
    - [ ] Purpose limitation: data collected only for stated purposes
    - [ ] Right to access: users can download their data
    - [ ] Right to correction: users can update their data
    - [ ] Right to erasure: users can request deletion (with 30-day grace period)
    - [ ] Data breach notification workflow (72-hour to DPBI)
    - [ ] Privacy policy reflecting DPDP requirements
  Story Points: 13
  Labels: [backend, security, legal]

MS-1500-3: As a platform, I want a comprehensive audit trail
           so that all data access and modifications are logged.
  Acceptance Criteria:
    - [ ] Log: who accessed/modified what, when, from where (IP)
    - [ ] Immutable log (append-only, no deletion)
    - [ ] Retention: 3 years minimum
    - [ ] Searchable by admin (user, action, date range)
  Story Points: 8
  Labels: [backend, security]

MS-1500-4: As a platform, I want rate limiting and abuse prevention
           so that the system is protected from attacks.
  Acceptance Criteria:
    - [ ] Rate limiting on auth endpoints (5 attempts/min)
    - [ ] Rate limiting on API endpoints (100 requests/min per user)
    - [ ] CAPTCHA on login after 3 failed attempts
    - [ ] IP-based blocking for brute force patterns
    - [ ] CSRF protection on all state-changing requests
  Story Points: 5
  Labels: [backend, security]

MS-1500-5: As a practitioner, I want session timeout and auto-logout
           so that my clinical data is safe if I leave my device unattended.
  Acceptance Criteria:
    - [ ] Configurable session timeout (default: 30 minutes of inactivity)
    - [ ] Warning dialog 5 minutes before timeout
    - [ ] Extend session with one click
    - [ ] Auto-save any in-progress clinical notes before logout
  Story Points: 3
  Labels: [frontend, backend, security]
```

---

## 5. Sprint Plan

All sprints are 2 weeks. Team composition: 3 full-stack engineers, 1 designer, 1 QA, 1 PM.

### Sprint 1-2: Foundation (Weeks 1-4) — DONE

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 1 | Infrastructure & Auth | MS-100, MS-1500 | Next.js project setup, Prisma schema, NextAuth config, DB provisioning, CI/CD pipeline, email/password auth, Google OAuth |
| Sprint 2 | Onboarding & Base UI | MS-100, MS-200 | Onboarding wizard, RBAC middleware, design system (components, theme), responsive shell layout, seed data |

**Sprint 1-2 Exit Criteria:**
- Users can register, login, and complete onboarding
- Role-based routing works (practitioner vs. client vs. admin)
- Database schema covers core entities (User, Client, Session, Note, Invoice)
- CI/CD pipeline deploys to staging on merge to main

---

### Sprint 3-4: Core Features (Weeks 5-8)

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 3 | Dashboard & Client Management | MS-200, MS-300 | Practitioner dashboard, client CRUD, client profile page, search/filter, tagging |
| Sprint 4 | Sessions & Notes | MS-400, MS-500 | Calendar view, availability management, session booking, SOAP/DAP/free-text notes, auto-save, sign/lock |

**Sprint 3-4 Exit Criteria:**
- Practitioner can add clients, view dashboard, and manage caseload
- Sessions can be created, viewed on calendar, and marked complete
- Clinical notes (all 3 formats) can be created, saved, signed
- Notes linked to sessions and clients

---

### Sprint 5-6: Payments, Supervision, Analytics (Weeks 9-12)

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 5 | Payments & Profile | MS-600, MS-900 | Fee configuration, invoice generation, Razorpay checkout, public profile page, credential upload |
| Sprint 6 | Supervision & Analytics | MS-700, MS-800, MS-1000 | Supervision hour logging, supervisor dashboard, practice analytics charts, settings pages |

**Sprint 5-6 Exit Criteria:**
- End-to-end payment flow works (invoice -> pay -> receipt)
- Public profile pages are live and SEO-indexed
- Supervision hours can be logged, tracked, and exported
- Analytics dashboards show real data

---

### Sprint 7-8: Client Portal & Notifications (Weeks 13-16)

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 7 | Client Portal & Notifications | MS-1100, MS-1200 | Client dashboard, session history, mood tracking, consent forms, email/SMS/in-app notifications |
| Sprint 8 | Client Portal Polish & Messaging | MS-1100, MS-1200 | Async messaging, custom reminders, notification preferences, mobile responsiveness pass |

**Sprint 7-8 Exit Criteria:**
- Clients can log in, view sessions, book new sessions, pay invoices
- Mood tracking and consent forms functional
- Notifications firing for all key events (email + SMS + in-app)
- SMS compliant with TRAI DLT requirements

---

### Sprint 9-10: Admin, Integrations, Polish (Weeks 17-20)

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 9 | Admin Panel & Integrations | MS-1300, MS-1400 | Admin dashboard, credential verification queue, user management, Google Calendar sync, Cloudinary integration |
| Sprint 10 | Polish & Edge Cases | All | Error handling pass, empty states, loading skeletons, accessibility audit (WCAG 2.1 AA), performance optimization |

**Sprint 9-10 Exit Criteria:**
- Admin can verify credentials and manage users
- Google Calendar sync operational
- All file uploads go through Cloudinary
- Lighthouse score > 90 on key pages
- No P0/P1 bugs in backlog

---

### Sprint 11-12: Beta & Launch Prep (Weeks 21-24)

| Sprint | Focus | Epics | Key Deliverables |
|---|---|---|---|
| Sprint 11 | Beta Testing | N/A | Beta onboarding 100 practitioners, feedback collection, bug triage, data migration tools |
| Sprint 12 | Launch Prep | N/A | Performance load testing, security audit, documentation, marketing site, GA release |

**Sprint 11-12 Exit Criteria:**
- Beta feedback incorporated (top 10 issues resolved)
- Load test: 500 concurrent users, p95 response < 500ms
- Third-party security audit completed (no critical/high findings)
- Marketing site live with waitlist
- Production environment provisioned and validated

---

## 6. Technical Architecture

### 6.1 Stack Overview

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Server components, built-in API routes, excellent DX |
| **UI Components** | Tailwind CSS + shadcn/ui | Consistent design system, accessible components |
| **State Management** | React Server Components + TanStack Query | Minimal client state, server-first architecture |
| **Authentication** | NextAuth v5 (Auth.js) | First-class Next.js integration, multiple providers |
| **ORM** | Prisma | Type-safe database access, excellent migration tooling |
| **Database** | PostgreSQL (Supabase or Railway) | Relational data model, JSONB for flexible schemas, row-level security |
| **File Storage** | Cloudinary | Image optimization, secure document storage, CDN |
| **Payments** | Razorpay | India-native, UPI support, split payments |
| **SMS/OTP** | MSG91 | India-focused, DLT compliant, competitive pricing |
| **Email** | MSG91 Email / Resend | Transactional emails, templates |
| **Calendar Sync** | Google Calendar API | Dominant calendar in target demographic |
| **Deployment** | Vercel | Edge network, automatic previews, zero-config deploys |
| **Monitoring** | Vercel Analytics + Sentry | Performance monitoring, error tracking |
| **CI/CD** | GitHub Actions | Automated testing, linting, deployment |

### 6.2 Architecture Diagram (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
│              (Next.js App - SSR + Client Components)            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────────────┐
│                     Vercel Edge Network                          │
│              (CDN, Edge Middleware, Serverless Functions)        │
└──────┬──────────────┬──────────────┬───────────────┬────────────┘
       │              │              │               │
┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  NextAuth   │ │  API       │ │  Server    │ │  Webhooks  │
│  (Auth.js)  │ │  Routes    │ │  Actions   │ │  Handlers  │
└──────┬──────┘ └─────┬─────┘ └─────┬──────┘ └─────┬──────┘
       │              │              │               │
       └──────────────┼──────────────┘               │
                      │                              │
              ┌───────▼──────────┐                   │
              │     Prisma ORM   │                   │
              └───────┬──────────┘                   │
                      │                              │
              ┌───────▼──────────┐           ┌───────▼──────────┐
              │   PostgreSQL     │           │  External APIs   │
              │   (Supabase /    │           │  - Razorpay      │
              │    Railway)      │           │  - MSG91         │
              └──────────────────┘           │  - Cloudinary    │
                                             │  - Google Cal    │
                                             └──────────────────┘
```

### 6.3 Database Schema (Core Entities)

```
User (id, email, phone, name, role, avatar, language, createdAt)
PractitionerProfile (userId, title, bio, specializations[], languages[], locations[], fees, slug, isVerified)
ClientRecord (id, practitionerId, name, email, phone, dob, gender, status, tags[], presentingConcern)
Session (id, practitionerId, clientId, dateTime, duration, mode, type, status, videoLink, notes)
ClinicalNote (id, sessionId, clientId, practitionerId, type, content, isDraft, signedAt, signedBy)
Invoice (id, practitionerId, clientId, sessionId, amount, currency, gst, status, razorpayPaymentId, dueDate)
SupervisionLog (id, superviseeId, supervisorId, date, duration, modality, sessionId, isApproved)
Notification (id, userId, type, channel, title, body, isRead, createdAt)
AuditLog (id, userId, action, entity, entityId, metadata, ip, createdAt)
```

### 6.4 Key Technical Decisions

1. **Server Components First:** Minimize client-side JavaScript. Use RSC for data fetching and render clinical data on the server to reduce exposure.

2. **Application-Level Encryption:** Clinical notes are encrypted before storage using AES-256-GCM. Encryption keys derived per-practitioner.

3. **Multi-Tenancy via Row-Level Filtering:** Prisma middleware enforces that practitioners only access their own data. No shared data between practitioners unless explicitly configured (e.g., supervision).

4. **Soft Deletes:** All clinical data uses soft deletes (`deletedAt` timestamp) to comply with DPDP Act retention requirements while respecting erasure requests.

5. **Idempotent Webhooks:** Razorpay and MSG91 webhooks are processed idempotently using event IDs to prevent duplicate processing.

---

## 7. KPIs & Success Metrics

### 7.1 North Star Metric

**Monthly Active Practitioners (MAP)** — Practitioners who logged in and performed at least one clinical action (note, session, invoice) in the past 30 days.

### 7.2 Primary KPIs

| Metric | Definition | Target (6 months post-GA) |
|---|---|---|
| **Practitioner Activation Rate** | % of sign-ups who complete onboarding + add first client within 7 days | > 40% |
| **Monthly Active Practitioners** | Practitioners with >= 1 clinical action / month | 500 |
| **Session Booking Rate** | Sessions booked via MindStack / total sessions (vs. external booking) | > 60% |
| **Payment Completion Rate** | Invoices paid online / total invoices sent | > 50% |
| **NPS** | Net Promoter Score (quarterly survey) | > 40 |
| **Client Portal Adoption** | % of practitioners whose clients have active portal accounts | > 30% |

### 7.3 Secondary KPIs

| Metric | Definition | Target |
|---|---|---|
| **Clinical Notes Per Session** | % of completed sessions with a signed note | > 70% |
| **Supervision Feature Usage** | % of practitioners using supervision tracking | > 15% |
| **Revenue Per Practitioner** | Average monthly GMV processed per active practitioner | INR 30,000 |
| **Churn Rate** | % of paying practitioners who cancel subscription / month | < 5% |
| **Client Retention** | % of clients who book 4+ sessions | > 50% |
| **Time to First Value** | Time from sign-up to first completed session | < 48 hours |
| **Uptime** | Platform availability | 99.9% |
| **p95 Response Time** | 95th percentile API response time | < 500ms |

### 7.4 Instrumentation Plan

- **Vercel Analytics:** Page load performance, Web Vitals
- **Sentry:** Error tracking, performance transactions
- **Custom Events (PostHog or Mixpanel):** Feature usage, funnel tracking, cohort analysis
- **In-App NPS:** Triggered after 30 days of active use, then quarterly

---

## 8. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Low practitioner adoption due to tech resistance among older professionals | High | High | Onboarding wizard, minimal-click workflows, WhatsApp-based onboarding support, vernacular UI |
| R2 | DPDP Act enforcement timeline uncertainty | Medium | High | Build compliance from day one; engage legal counsel for ongoing advisory; modular consent framework |
| R3 | Razorpay integration issues (KYC delays, settlement disputes) | Medium | Medium | Pre-test KYC flow with 10 beta practitioners; implement offline payment recording as fallback |
| R4 | Data breach or security incident | Low | Critical | Encryption at rest + in transit, regular penetration testing, bug bounty program post-GA, incident response plan documented |
| R5 | Scope creep delaying launch | High | Medium | Strict MoSCoW prioritization; PM sign-off required for any scope addition; 20% sprint buffer for unplanned work |
| R6 | Google Calendar API quota limits or deprecation | Low | Medium | Implement polling fallback; cache sync state; abstract calendar integration behind interface for future providers |
| R7 | MSG91 SMS delivery failures or DLT compliance rejection | Medium | Medium | Pre-register DLT templates 4 weeks before launch; configure fallback SMS provider; email as backup channel |
| R8 | Competition from well-funded entrants (Practo expanding into practice management) | Medium | High | Focus on niche (mental health only); build community (webinars, supervision network); fast iteration on user feedback |
| R9 | Practitioner data migration from existing tools (spreadsheets, other software) | High | Medium | CSV import tool; manual migration support for beta users; migration guide documentation |
| R10 | Scaling issues as user base grows (slow queries, storage costs) | Low | Medium | Database indexing strategy; query performance monitoring; Cloudinary storage tiers; auto-scaling on Vercel |

---

## 9. Release Plan

### 9.1 Alpha Release (Internal)

**Target Date:** End of Sprint 6 (Week 12)
**Audience:** Internal team + 5-10 friendly practitioners (advisors)

**Included:**
- Practitioner auth and onboarding
- Dashboard
- Client management (CRUD, search, filter)
- Session creation and calendar view
- Clinical notes (SOAP, DAP, free-text)
- Basic invoicing (no Razorpay — manual payment recording only)
- Supervision hour logging
- Basic settings

**Not Included:**
- Client Portal
- Razorpay online payments
- SMS notifications
- Admin panel
- Google Calendar sync
- Public profile pages

**Success Criteria:**
- 5 practitioners actively using the platform for 2+ weeks
- Core workflow (add client -> create session -> write note -> send invoice) completes without errors
- Average task completion time for core workflow < 10 minutes

---

### 9.2 Beta Release (Limited)

**Target Date:** End of Sprint 10 (Week 20)
**Audience:** 100 practitioners (waitlist sign-ups, diverse professional types)

**Included (in addition to Alpha):**
- Client Portal (dashboard, booking, payments, mood tracking)
- Razorpay online payments
- Email + SMS notifications
- Public profile pages
- Google Calendar sync
- Supervision session booking
- Analytics dashboards
- Admin panel (credential verification)
- Cloudinary file uploads

**Not Included:**
- Multilingual (Hindi) — English only
- Custom note templates sharing
- Advanced admin features
- Bulk import/export

**Success Criteria:**
- 100 practitioners onboarded within 2 weeks of beta launch
- 40%+ activation rate (onboarding complete + first client added)
- < 10 P0/P1 bugs reported
- NPS > 30 (early signal)
- Payment flow success rate > 90%

---

### 9.3 General Availability (GA)

**Target Date:** End of Sprint 12 (Week 24)
**Audience:** All mental health professionals in India

**Included (in addition to Beta):**
- Hindi language support
- Custom note templates
- Bulk client import (CSV)
- Full admin panel
- Marketing/landing site
- Help center and documentation
- Subscription billing (Razorpay Subscriptions)

**Launch Channels:**
- Product Hunt launch
- Mental health professional associations (outreach)
- Instagram and LinkedIn targeted campaigns
- Partnerships with training institutes (M.Phil programs, counseling schools)
- Referral program (1 month free for each referred practitioner)

**Success Criteria:**
- 500 practitioner sign-ups in first month
- 200 MAP (monthly active practitioners) by end of month 2
- < 5% churn rate in first 3 months
- Media coverage in at least 2 Indian health/tech publications

---

## 10. Competitive Analysis

### 10.1 Competitor Overview

| Feature | MindStack | Practo | Simply.Coach | TherapyNotes (US) | Jane App (Canada) |
|---|---|---|---|---|---|
| **Target Market** | India — Mental Health Professionals | India — All Doctors | Global — Coaches | US — Therapists | Canada/Global — Health & Wellness |
| **Mental Health Focus** | Dedicated | Generic (all specialties) | Coaching (not clinical) | Dedicated | Generic (wellness) |
| **Clinical Notes (SOAP/DAP)** | Yes | No (generic EMR) | No | Yes | Yes |
| **Supervision Tracking** | Yes (first-class) | No | No | No | No |
| **DPDP Act Compliance** | Yes (built-in) | Partial | No (not India-focused) | No (HIPAA only) | No (PIPEDA only) |
| **INR Payments (UPI)** | Yes (Razorpay) | Yes | No | No | No |
| **Multilingual (Indian)** | Yes (English + Hindi + planned regional) | English + Hindi | English only | English only | English + French |
| **Client Portal** | Yes | Partial (appointment only) | Limited | Yes | Yes |
| **Pricing (Entry)** | INR 499/month (planned) | Free tier (limited) | $9/month | $49/month | $79/month |
| **Inclusive Professional Scope** | All MH professionals | All doctors | Coaches only | Licensed therapists | All health |

### 10.2 MindStack's Competitive Positioning

```
                    India-Specific
                         ▲
                         │
         MindStack ●     │
                         │
    Practo ●             │          ● Jane App
                         │
  ──────────────────────►──────────────────────────►
  Generic                │              Mental Health
  (all doctors)          │              Specialized
                         │
                         │     ● TherapyNotes
    Simply.Coach ●       │
                         │
                         │
                    Global/Western
```

**MindStack's Unique Position:** The only platform that is simultaneously:
1. **India-first** (payments, compliance, languages, pricing)
2. **Mental health-specific** (clinical notes, supervision, therapy workflows)
3. **Inclusive** (not limited to licensed/registered professionals)

### 10.3 Competitive Moats (Planned)

1. **Supervision Network Effect:** As more supervisors and supervisees join, the platform becomes more valuable for professional development — a feature no competitor offers.
2. **India Regulatory Expertise:** DPDP Act compliance, MHA 2017 awareness, RCI/NMC credential verification — deep local knowledge that global competitors won't prioritize.
3. **Pricing Advantage:** At INR 499/month entry point, significantly more affordable than Western alternatives and comparable to or below Indian generic tools.
4. **Community-Led Growth:** Webinars, peer supervision groups, and training institute partnerships create organic distribution.

---

## 11. Prioritization Matrix (MoSCoW)

### Must Have (P0 — Required for GA)

| Feature | Epic | Rationale |
|---|---|---|
| Email/Password + Google Auth | MS-100 | Cannot use platform without auth |
| Practitioner Onboarding | MS-100 | First-run experience, activation driver |
| Client CRUD + Profile | MS-300 | Core data entity — everything depends on this |
| Session Creation + Calendar | MS-400 | Primary workflow for practitioners |
| Clinical Notes (SOAP, DAP, Free-text) | MS-500 | Legal/ethical requirement for documentation |
| Basic Invoicing | MS-600 | Revenue generation for practitioners |
| Practitioner Dashboard | MS-200 | Daily landing page, engagement driver |
| Data Encryption (at rest + in transit) | MS-1500 | Non-negotiable security baseline |
| DPDP Consent Management | MS-1500 | Legal compliance |
| RBAC | MS-100 | Security fundamental |
| Session Reminders (Email) | MS-1200 | Reduce no-shows — core value |

### Should Have (P1 — Strongly expected for GA)

| Feature | Epic | Rationale |
|---|---|---|
| Razorpay Online Payments | MS-600 | Key differentiator; manual payments as fallback |
| Client Portal | MS-1100 | Two-sided marketplace value |
| Supervision Hour Tracking | MS-700 | Unique differentiator, strong demand signal |
| Public Profile Page | MS-900 | Client acquisition channel for practitioners |
| SMS Notifications (MSG91) | MS-1200 | High engagement channel in India |
| In-App Notifications | MS-1200 | Platform stickiness |
| Google Calendar Sync | MS-1400 | Reduces friction for practitioners |
| Analytics (Basic) | MS-800 | Business intelligence for practitioners |
| Credential Verification | MS-1300 | Trust signal for clients |

### Could Have (P2 — Desirable, can defer to v1.1)

| Feature | Epic | Rationale |
|---|---|---|
| Hindi Language Support | MS-1000 | Important for scale, but English-first users in beta |
| Custom Note Templates | MS-500 | Power user feature |
| Mood Tracking (Client) | MS-1100 | Nice-to-have, not core workflow |
| Async Messaging | MS-1100 | Risk of scope creep; WhatsApp used as interim |
| Supervision Booking + Payments | MS-700 | Logging is P1; booking is P2 |
| Admin Panel (Full) | MS-1300 | Basic admin for beta; full panel for GA |
| Bulk Client Import | MS-300 | Migration convenience, not blocking |
| Revenue Forecasting | MS-800 | Advanced analytics, post-launch |

### Won't Have (This Release — Backlog for Future)

| Feature | Rationale |
|---|---|
| Video Calling (built-in) | Use Google Meet / Zoom links instead — building video is out of scope |
| Prescription Management | Regulatory complexity; defer until psychiatrist base is larger |
| AI-Assisted Note Generation | Promising but premature; ethical and accuracy concerns |
| Mobile App (Native) | PWA-first approach; native app after product-market fit |
| Multi-Practice / Clinic Management | Enterprise feature; focus on solo practitioners first |
| Insurance Claim Integration | Indian insurance landscape for mental health is nascent |
| Marketplace / Therapist Discovery | Post-GA; requires critical mass of practitioners |
| Regional Languages (Tamil, Telugu, etc.) | Post-GA; Hindi + English covers 70%+ of target users |
| Group Practice / Team Features | Post-GA; solo and small practice first |
| Waiting Room (Virtual) | Nice-to-have for telehealth; not core |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **DPDP Act** | Digital Personal Data Protection Act, 2023 (India) |
| **DPBI** | Data Protection Board of India |
| **RCI** | Rehabilitation Council of India — regulatory body for clinical psychologists |
| **MCI/NMC** | Medical Council of India / National Medical Commission — regulatory body for doctors including psychiatrists |
| **MHA 2017** | Mental Healthcare Act, 2017 (India) |
| **SOAP** | Subjective, Objective, Assessment, Plan — clinical note format |
| **DAP** | Data, Assessment, Plan — clinical note format |
| **DLT** | Distributed Ledger Technology — TRAI requirement for SMS sender registration |
| **MAP** | Monthly Active Practitioners |
| **GMV** | Gross Merchandise Value — total payment volume processed |
| **NPS** | Net Promoter Score |
| **INR** | Indian Rupee |

---

## Appendix B: Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| Q1 | What subscription tiers and pricing should we launch with? | PM + Founders | In Discussion |
| Q2 | Should we require credential verification before practitioners can accept payments? | PM + Legal | Open |
| Q3 | What is the minimum viable admin panel for beta? | PM + Engineering | Open |
| Q4 | Should clients be able to switch therapists within the platform? | PM + Design | Deferred to v1.1 |
| Q5 | What is the data retention policy for discharged clients? | Legal + PM | In Discussion |
| Q6 | Should we support video session recordings? (consent and storage implications) | PM + Legal | Deferred |
| Q7 | Partnership model with training institutes — free tier for students? | PM + Business | Open |

---

*This document is a living artifact and will be updated as requirements evolve. All changes are tracked via version history. For questions, contact the Product Management team.*

**Document History:**

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-03-26 | Product Management | Initial PRD — full scope for v1.0 GA release |
