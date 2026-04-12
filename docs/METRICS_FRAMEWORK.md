# Mindstack -- Metrics Framework

> **Product**: Mindstack -- Practice Management for Therapists & Counselors in India
> **Author**: Parth | Product Manager
> **Last Updated**: April 2026
> **Document Type**: PM Portfolio -- Analytical Deep-Dive

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [North Star Metric](#2-north-star-metric)
3. [Input Metrics (Leading Indicators)](#3-input-metrics-leading-indicators)
4. [Output Metrics (Business Outcomes)](#4-output-metrics-business-outcomes)
5. [Health Metrics (Guardrails)](#5-health-metrics-guardrails)
6. [Metric Definitions & Formulas](#6-metric-definitions--formulas)
7. [Leading vs. Lagging Indicator Map](#7-leading-vs-lagging-indicator-map)
8. [Metrics Dashboard Design](#8-metrics-dashboard-design)
9. [Cohort Analysis Framework](#9-cohort-analysis-framework)
10. [Experimentation Framework](#10-experimentation-framework)
11. [Reporting Cadence](#11-reporting-cadence)
12. [Appendix: Revenue Model Reference](#appendix-revenue-model-reference)

---

## 1. Executive Summary

Mindstack is a practice management platform purpose-built for India's therapy and counselling ecosystem. It serves four user types -- therapists/counselors, supervisors, therapy-seeking clients, and student trainees -- across a workflow that spans client management, session documentation, appointment scheduling, and clinical supervision tracking.

**Strategic wedge**: Supervision tracking is the singular capability no Indian competitor offers today. The Rehabilitation Council of India (RCI) requires logged supervision hours for licensure, yet practitioners track these in spreadsheets and WhatsApp groups. Mindstack makes this effortless, creating a network-effect flywheel: trainees join for supervision logging, supervisors follow for verification tools, and both convert into full practice-management users as their careers progress.

This document defines the measurement system that ensures every team decision -- from sprint planning to pricing experiments -- connects back to durable value creation.

---

## 2. North Star Metric

### **Qualified Sessions Documented per Week (QSDW)**

A "qualified session" is any client session or supervision session that has a completed structured note saved within 48 hours of the appointment time.

| Attribute | Detail |
|---|---|
| **Definition** | Count of sessions (therapy + supervision) with a completed note saved within 48 hours, measured as a weekly rolling average |
| **Current Baseline** | To be established in first 8 weeks post-launch |
| **12-Month Target** | 15,000 QSDW across the platform |
| **Owner** | Head of Product |

### Why This Metric?

Choosing the right North Star requires a metric that sits at the intersection of **user value** and **business value** while being actionable by the product team. Here is the reasoning:

| Criterion | How QSDW Satisfies It |
|---|---|
| **Reflects core value delivery** | A documented session is proof that a therapist used Mindstack for its primary job-to-be-done: running and recording clinical work. No vanity -- no "registered accounts" or "page views." |
| **Encompasses all user types** | Therapy sessions involve therapists + clients. Supervision sessions involve supervisors + trainees. One metric captures activity across every persona. |
| **Correlates with retention** | Internal hypothesis (to be validated): therapists who document >= 8 sessions/week in their first month retain at 3x the rate of those who document fewer. Documentation habit = stickiness. |
| **Drives revenue** | Free-tier users who hit the session-note limit (e.g., 10 notes/month) are the primary conversion funnel into Solo/Clinic plans. More QSDW = more limit-hits = more upgrades. |
| **Actionable** | Product can move this metric through onboarding improvements, note-template quality, scheduling reliability, and supervision-matching features. |
| **Not gameable internally** | The 48-hour quality window and "completed note" requirement prevent inflating the number with empty or backdated records. |

**What QSDW is NOT**: It is not a revenue metric (that is an output). It is not a satisfaction metric (that is a health guardrail). It is the atomic unit of value exchange on the platform.

---

## 3. Input Metrics (Leading Indicators)

Input metrics are the levers the product and growth teams pull to drive the North Star upward. They are organized by the stage of the user lifecycle they influence.

### 3.1 Acquisition Inputs

| Metric | Definition | Target | Rationale |
|---|---|---|---|
| **Weekly New Therapist Sign-ups** | Unique therapist/supervisor accounts created per week | 200/wk by Month 6 | Top-of-funnel volume; segmented by referral source (organic, supervision invite, clinic admin invite) |
| **Supervision Invite Acceptance Rate** | % of trainees who accept a supervisor's Mindstack invitation within 7 days | > 65% | Viral loop health; the supervision wedge only works if invitees convert |
| **Clinic Onboarding Completion Rate** | % of Clinic-plan sign-ups that add >= 2 seat members within 14 days | > 50% | Multi-seat expansion signal; incomplete onboarding = churn risk |

### 3.2 Activation Inputs

| Metric | Definition | Target | Rationale |
|---|---|---|---|
| **Time-to-First-Note (TTFN)** | Median hours from account creation to first saved session note | < 24 hours | Speed to value; every hour of delay reduces Week-4 retention by an estimated 2-3% |
| **Activation Rate** | % of new accounts that complete >= 3 session notes in their first 14 days | > 40% | "Aha moment" proxy -- 3 notes means the therapist has integrated Mindstack into real workflow |
| **Profile Completion Rate** | % of therapists who fill in license number, specializations, and availability within 7 days | > 55% | Enables client matching and builds trust; incomplete profiles correlate with early churn |

### 3.3 Engagement Inputs

| Metric | Definition | Target | Rationale |
|---|---|---|---|
| **Weekly Active Therapists (WAT)** | Unique therapists who log in and perform >= 1 core action (note, schedule, supervision log) in a 7-day window | 60% of all registered therapists | Core engagement pulse |
| **Notes per Active Therapist per Week** | Average session notes saved per WAT | >= 6 | Depth of engagement; indicates Mindstack is the primary documentation tool, not a backup |
| **Supervision Sessions Logged per Supervisor per Month** | Average supervision entries per active supervisor | >= 4 | Wedge feature engagement -- if supervisors aren't logging, the differentiator is failing |
| **Scheduling Feature Adoption** | % of WATs who use built-in scheduling (vs. external calendar) for >= 50% of their appointments | > 35% by Month 6 | Scheduling integration deepens lock-in and feeds the session-note pipeline |

### 3.4 Retention Inputs

| Metric | Definition | Target | Rationale |
|---|---|---|---|
| **Week-1 Return Rate** | % of activated users who return in the second week | > 70% | Earliest churn signal; enables rapid intervention |
| **Monthly Retained Therapists** | % of therapists active in Month N who are also active in Month N+1 | > 80% | Steady-state retention floor |
| **Supervision Pair Retention** | % of supervisor-trainee pairs that both remain active after 90 days | > 60% | Network-effect health; if one side churns, the other follows |

---

## 4. Output Metrics (Business Outcomes)

Output metrics are the results the business cares about. The product team influences them **indirectly** through input metrics.

| Metric | Definition | Target (12-Month) | Cadence |
|---|---|---|---|
| **Monthly Recurring Revenue (MRR)** | Sum of all active subscription revenue in a calendar month (INR) | INR 15,00,000 | Monthly |
| **Annual Recurring Revenue (ARR)** | MRR x 12 (normalized) | INR 1,80,00,000 | Quarterly review |
| **Free-to-Paid Conversion Rate** | % of free accounts that upgrade to any paid plan within 60 days of sign-up | > 8% | Monthly |
| **Average Revenue per Therapist (ARPT)** | Total MRR / total active paid therapists | INR 650/month | Monthly |
| **Net Revenue Retention (NRR)** | (Starting MRR + Expansion - Contraction - Churn) / Starting MRR | > 105% | Monthly |
| **Expansion Revenue %** | Revenue from plan upgrades + seat additions as a % of total new MRR in the month | > 30% | Monthly |
| **Payback Period** | Months of subscription revenue needed to recover CAC per therapist | < 4 months | Quarterly |
| **Customer Lifetime Value (LTV)** | ARPT x Gross Margin % x (1 / Monthly Churn Rate) | > INR 12,000 | Quarterly |
| **LTV:CAC Ratio** | LTV / CAC | > 3:1 | Quarterly |

---

## 5. Health Metrics (Guardrails)

Health metrics are lines in the sand. They do not need to go up -- they need to stay within an acceptable range. If any guardrail is breached, the team pauses growth work and investigates.

| Guardrail Metric | Acceptable Range | Breach Protocol |
|---|---|---|
| **App Crash Rate** | < 0.5% of sessions | P0 engineering escalation; halt feature releases |
| **API Latency (p95)** | < 800ms | Performance sprint if exceeded for 3 consecutive days |
| **Note Save Failure Rate** | < 0.1% | Critical -- data loss erodes therapist trust irreversibly |
| **Therapist NPS** | >= 40 | Trigger qualitative research sprint (10 user interviews within 2 weeks) |
| **Client Data Access Incidents** | 0 | Immediate security review; potential regulatory disclosure |
| **Support Ticket Volume per 100 WATs** | < 8 tickets/week | UX audit on top-3 ticket categories |
| **Onboarding Drop-off Rate** | < 40% at any single step | Redesign the offending step; A/B test within 2 sprints |
| **Therapist Monthly Churn Rate** | < 5% | Churn analysis by cohort; fire alarm if > 7% for 2 consecutive months |
| **Payment Failure Rate** | < 3% of renewal attempts | Payment infra review; add retry logic or alternate payment methods |
| **Session Note Completion Time (median)** | < 8 minutes | Template bloat check; consider AI-assisted note drafting |

---

## 6. Metric Definitions & Formulas

### 6.1 Core Formulas

```
NORTH STAR: Qualified Sessions Documented per Week (QSDW)
= COUNT(sessions WHERE note_status = 'complete'
        AND note_saved_at <= session_time + 48 hours)
  measured over a rolling 7-day window
```

```
Activation Rate
= (Users with >= 3 completed notes in first 14 days) / (Total new sign-ups in cohort)
  x 100
```

```
Monthly Retained Therapists
= (Therapists active in Month N AND active in Month N+1) / (Therapists active in Month N)
  x 100
```

```
Net Revenue Retention (NRR)
= (MRR_start + MRR_expansion - MRR_contraction - MRR_churned) / MRR_start
  x 100

Where:
  MRR_expansion  = upgrades (Free->Solo, Solo->Clinic) + additional seats
  MRR_contraction = downgrades
  MRR_churned     = cancelled subscriptions
```

```
Customer Lifetime Value (LTV)
= ARPT x Gross_Margin_% x (1 / Monthly_Churn_Rate)

Example: INR 650 x 0.85 x (1 / 0.04) = INR 13,813
```

```
LTV:CAC Ratio
= LTV / CAC

Where CAC = (Total Sales & Marketing Spend in Period) / (New Paid Customers Acquired in Period)
```

```
Supervision Invite Acceptance Rate
= (Invitations accepted within 7 days) / (Total invitations sent)
  x 100
```

```
Average Revenue per Therapist (ARPT)
= Total MRR / Count of active paid therapist accounts
```

### 6.2 Engagement Scoring (Composite)

To prioritize outreach and identify at-risk accounts, Mindstack uses a **Therapist Engagement Score (TES)** on a 0-100 scale:

| Component | Weight | Scoring Logic |
|---|---|---|
| Session notes saved (last 7 days) | 30% | 0 notes = 0, 1-3 = 40, 4-7 = 70, 8+ = 100 |
| Scheduling feature used (last 7 days) | 20% | No = 0, Yes = 100 |
| Supervision log entries (last 30 days) | 20% | 0 = 0, 1-2 = 50, 3+ = 100 |
| Days since last login | 15% | 0-1 days = 100, 2-3 = 70, 4-7 = 40, 8+ = 0 |
| Profile completeness | 15% | % of fields completed, scaled to 100 |

```
TES = (0.30 x Notes_Score) + (0.20 x Scheduling_Score)
    + (0.20 x Supervision_Score) + (0.15 x Recency_Score)
    + (0.15 x Profile_Score)
```

**Risk thresholds**:
- TES >= 60: Healthy
- TES 30-59: At-risk (trigger automated re-engagement email sequence)
- TES < 30: Critical (trigger CSM outreach for paid users; sunset email for free users)

---

## 7. Leading vs. Lagging Indicator Map

Understanding which metrics predict the future (leading) vs. report on the past (lagging) determines where the team spends its energy.

```
 LEADING (act on these)                          LAGGING (these confirm results)
 ─────────────────────                           ────────────────────────────────
                                    
 Supervision Invite          ───>   Supervision Pair Retention
 Acceptance Rate                                  
                                    
 Time-to-First-Note          ───>   Activation Rate
                                    
 Activation Rate             ───>   Monthly Retained Therapists
                                    
 Weekly Active Therapists    ───>   QSDW (North Star)
                                    
 Notes per Active Therapist  ───>   Free-to-Paid Conversion Rate
                                    
 Free-to-Paid Conversion     ───>   MRR / ARR
                                    
 NPS Score                   ───>   Monthly Churn Rate
                                    
 Scheduling Adoption         ───>   LTV (long-term)
```

### Detailed Mapping Table

| Leading Indicator | Lagging Indicator It Predicts | Time Lag | Confidence |
|---|---|---|---|
| Supervision Invite Acceptance Rate | Supervision Pair Retention (90-day) | 90 days | High -- direct causal chain |
| Time-to-First-Note (TTFN) | Week-4 Activation Rate | 4 weeks | High -- validated in similar SaaS |
| Week-1 Return Rate | Month-3 Retention | 8-12 weeks | Medium -- confounded by external factors |
| Notes per Active Therapist/Week | Free-to-Paid Conversion | 4-8 weeks | High -- usage-limit trigger is mechanical |
| Clinic Onboarding Completion | Net Revenue Retention (NRR) | 3-6 months | Medium -- multi-seat dynamics complex |
| Therapist Engagement Score (TES) | Monthly Churn Rate | 4-6 weeks | High -- composite leading signal |
| Profile Completion Rate | Client Booking Rate (future feature) | 2-4 weeks | Low -- hypothesis stage |

### How to Use This Map

1. **Sprint planning**: Prioritize features that move leading indicators. If TTFN is above target, invest in onboarding UX before building new reporting dashboards.
2. **Escalation**: If a lagging indicator decays (e.g., retention drops), look upstream at its leading indicators to diagnose the root cause rather than treating the symptom.
3. **Forecasting**: Use leading indicator trends to project lagging outcomes 4-12 weeks ahead. Present these projections in monthly business reviews.

---

## 8. Metrics Dashboard Design

### 8.1 Executive Dashboard (Weekly Review)

This is the single-screen view optimized for a 15-minute Monday morning review.

```
 ┌──────────────────────────────────────────────────────────────────────┐
 │                    MINDSTACK -- EXECUTIVE DASHBOARD                  │
 │                    Week of [DATE] | Updated: Monday 9 AM IST        │
 ├──────────────────────────────────────────────────────────────────────┤
 │                                                                      │
 │  ┌─────────────────────────────────────────────────────────────┐    │
 │  │  NORTH STAR: Qualified Sessions Documented This Week        │    │
 │  │                                                             │    │
 │  │     [============================          ] 11,240 / 15,000│    │
 │  │     (+8.2% WoW)    Target: 15,000 by Month 12              │    │
 │  └─────────────────────────────────────────────────────────────┘    │
 │                                                                      │
 │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
 │  │  MRR (INR)   │  │  WAT         │  │  NPS         │              │
 │  │  8,45,000    │  │  1,870       │  │  47          │              │
 │  │  +5.1% MoM   │  │  +3.8% WoW   │  │  Healthy     │              │
 │  └──────────────┘  └──────────────┘  └──────────────┘              │
 │                                                                      │
 │  INPUT METRICS (LEADING)          │  OUTPUT METRICS (LAGGING)       │
 │  ─────────────────────            │  ────────────────────────       │
 │  New Sign-ups:     148/wk [!]     │  Conversion Rate:   7.2%       │
 │  Invite Accept:    68%  [OK]      │  NRR:              108%        │
 │  TTFN (median):    18 hrs [OK]    │  ARPT:         INR 620         │
 │  Activation Rate:  38%  [!]       │  Churn Rate:       4.1%        │
 │  Notes/WAT/wk:     5.8  [!]      │  LTV:CAC:         3.4:1        │
 │                                    │                                 │
 │  GUARDRAIL ALERTS                                                   │
 │  ──────────────────                                                 │
 │  [OK] Crash Rate: 0.3%     [OK] API p95: 620ms                    │
 │  [OK] Note Save Fail: 0.02% [!] Support Tickets: 9.1/100 WAT     │
 │  [OK] Payment Fail: 2.1%   [OK] Onboarding Drop-off: 34%         │
 │                                                                      │
 │  Legend:  [OK] = Within target   [!] = Needs attention              │
 └──────────────────────────────────────────────────────────────────────┘
```

### 8.2 Dashboard Panels -- Detailed Breakdown

**Panel 1: North Star Trend (Top Center)**

| Element | Detail |
|---|---|
| Chart Type | Area chart with 12-week trend line |
| Primary Metric | QSDW (weekly) |
| Overlay | Target trajectory line (dotted) |
| Breakdown Toggle | By session type: therapy vs. supervision |
| Drill-down | Click to see QSDW by user cohort |

**Panel 2: KPI Scorecards (Row of Cards)**

| Card | Metric | Comparison | Alert Threshold |
|---|---|---|---|
| Card 1 | MRR | MoM % change | < 2% growth for 2 consecutive months |
| Card 2 | Weekly Active Therapists | WoW % change | < 0% growth (decline) |
| Card 3 | Therapist NPS | Quarterly | < 40 |
| Card 4 | Free-to-Paid Conversion | MoM | < 5% |

**Panel 3: Funnel Visualization (Left Column)**

```
Sign-up ──> Profile Complete ──> First Note ──> 3rd Note (Activated) ──> Paid
  100%         55%                  47%             38%                   7.2%
```

**Panel 4: Retention Heatmap (Center)**

| Cohort | Week 1 | Week 2 | Week 4 | Week 8 | Week 12 |
|---|---|---|---|---|---|
| Jan W1 | 100% | 72% | 58% | 49% | 44% |
| Jan W2 | 100% | 74% | 61% | 51% | -- |
| Jan W3 | 100% | 69% | 55% | -- | -- |
| Feb W1 | 100% | 76% | 63% | -- | -- |

**Panel 5: Guardrail Status (Bottom Row)**

A horizontal row of status indicators, color-coded:
- Green: Within acceptable range
- Amber: Within 10% of breach threshold
- Red: Breached -- action required

---

## 9. Cohort Analysis Framework

### 9.1 Cohort Definitions

Mindstack segments users into cohorts along three dimensions:

**Dimension 1: Time-based (Sign-up Week)**
- Standard weekly cohorts aligned to Monday-Sunday IST
- Used for retention curves, activation funnels, and revenue maturation

**Dimension 2: Acquisition Channel**

| Cohort | Definition | Strategic Importance |
|---|---|---|
| **Organic Search** | Signed up via website without referral code | Baseline CAC benchmark |
| **Supervision Invite** | Signed up via supervisor/trainee invitation link | Viral loop health; highest expected LTV |
| **Clinic Admin Invite** | Onboarded as part of a Clinic plan seat | Fastest time-to-value (pre-configured workspace) |
| **Conference/Workshop** | Signed up using an event-specific promo code | Burst acquisition; typically lower activation rate |
| **Content/SEO** | Attributed to a specific blog post or resource download | Long-tail; slow to activate but high intent |

**Dimension 3: Plan Tier**

| Cohort | Behavior Hypothesis |
|---|---|
| **Free** | Highest volume, lowest activation; primary conversion funnel |
| **Solo (INR 499/mo)** | Independent practitioners; retention driven by note utility |
| **Annual (INR 4,999/yr)** | Committed users; watch for engagement decay mid-year |
| **Clinic (INR 1,499/mo per seat)** | Multi-therapist practices; expansion revenue opportunity |

### 9.2 Retention Cohort Analysis

**Methodology**: Track the % of each weekly sign-up cohort that remains "active" (>= 1 core action) at Week 1, 2, 4, 8, 12, 24, and 52.

**Target Retention Curve**:

| Milestone | Target | Industry Benchmark (Vertical SaaS) |
|---|---|---|
| Week 1 | 72% | 60-70% |
| Week 4 | 55% | 40-50% |
| Week 12 | 42% | 30-35% |
| Week 24 | 35% | 25-30% |
| Week 52 | 28% | 20-25% |

**Analysis Cadence**: Every 2 weeks, the PM reviews the latest 8 cohorts and asks:
1. Is the most recent cohort's Week-1 retention improving or declining vs. the cohort 4 weeks prior?
2. Are supervision-invite cohorts retaining at a premium over organic cohorts? (Hypothesis: yes, by >= 15 percentage points at Week 12.)
3. Is there a "cliff" at any specific week where retention drops disproportionately? (Signals an unmet need at that lifecycle stage.)

### 9.3 Revenue Cohort Analysis

Track cumulative revenue per cohort over time to understand:

| Analysis | Question Answered |
|---|---|
| **Time-to-Payback by Cohort** | Which acquisition channels pay back fastest? |
| **Revenue Maturation Curve** | How much revenue does a cohort generate in Month 1 vs. Month 6? (Captures upgrades and expansion.) |
| **Expansion Delta** | Is Month-6 revenue per cohort > Month-1 revenue? If yes, the product has positive expansion economics. |

### 9.4 Supervision-Specific Cohort Tracking

Because supervision is the strategic wedge, it gets its own cohort lens:

| Metric | Cohort Split | Insight |
|---|---|---|
| Supervision sessions logged/month | By trainee sign-up month | Are newer trainees logging more? (Product improvement signal) |
| Supervisor-to-trainee ratio | By supervisor sign-up month | Are supervisors inviting more trainees over time? (Network growth signal) |
| Trainee-to-therapist upgrade rate | By trainee sign-up month | What % of trainees who complete supervision requirements upgrade to Solo/Clinic plans within 6 months? (Long-term monetization of the wedge) |

---

## 10. Experimentation Framework

### 10.1 Principles

1. **Default to experimentation**: Any change expected to affect a metric by more than 2% should be tested, not shipped blindly.
2. **Minimize blast radius**: Start with 10% traffic allocation; scale to 50/50 only after 48 hours of stability monitoring.
3. **One metric per experiment**: Each experiment has a single primary metric. Secondary metrics are tracked but do not determine the ship decision.
4. **Statistical rigor**: 95% confidence level, 80% statistical power, minimum 2-week runtime.
5. **Document everything**: Every experiment gets a write-up in the experiment log regardless of outcome.

### 10.2 Experiment Sizing

Given Mindstack's early-stage user base, sample sizes are constrained. This table estimates minimum runtime for common experiments:

| Experiment Type | Primary Metric | Baseline | MDE (Minimum Detectable Effect) | Est. Sample Needed (per arm) | Est. Runtime |
|---|---|---|---|---|---|
| Onboarding flow change | Activation Rate | 38% | 5 pp (to 43%) | ~750 users | 6-8 weeks |
| Note template redesign | Notes/WAT/week | 5.8 | 0.5 notes (+8.6%) | ~400 WATs | 3-4 weeks |
| Pricing page copy | Free-to-Paid Conversion | 7.2% | 1.5 pp (to 8.7%) | ~2,000 users | 10-14 weeks |
| Supervision matching prompt | Invite Acceptance Rate | 68% | 5 pp (to 73%) | ~500 invites | 4-6 weeks |
| Scheduling UX overhaul | Scheduling Adoption | 35% | 5 pp (to 40%) | ~600 WATs | 4-5 weeks |

> **Implication**: With early user volumes, Mindstack can run 2-3 concurrent experiments at most. Ruthless prioritization of experiment slots is essential.

### 10.3 Experiment Lifecycle

```
 ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
 │ Propose  │───>│ Size &   │───>│ Build &  │───>│ Run &  │───>│ Decide & │
 │ Hypothesis│   │ Prioritize│   │ QA       │   │ Monitor│   │ Document │
 └─────────┘    └──────────┘    └──────────┘    └────────┘    └──────────┘
      |               |               |              |              |
   PM writes       PM + DS         Eng + QA      DS monitors    PM writes
   1-pager       estimate MDE,    implement     daily health   experiment
   with hypo-    runtime, and     feature flag  metrics; PM    report with
   thesis &      rank against     + tracking    checks guard-  learnings
   primary       other proposed   events        rail metrics   & next steps
   metric        experiments
```

### 10.4 Experiment Proposal Template

Every proposed experiment must answer these questions before entering the queue:

| Field | Description |
|---|---|
| **Experiment Name** | Short, descriptive (e.g., "Onboarding Checklist v2") |
| **Hypothesis** | "If we [change], then [metric] will [improve/decrease] by [amount] because [reasoning]." |
| **Primary Metric** | Single metric that determines ship/no-ship |
| **Secondary Metrics** | 1-3 metrics to monitor for unintended effects |
| **Guardrail Metrics** | Which health metrics to watch during the experiment |
| **Target Population** | User segment and traffic allocation % |
| **MDE & Sample Size** | Pre-calculated using the sizing table above |
| **Estimated Runtime** | Weeks required to reach significance |
| **Rollback Plan** | How to revert if guardrails are breached |

### 10.5 Decision Framework

After an experiment concludes:

```
                      ┌─────────────────────────┐
                      │ Primary metric improved  │
                      │ at >= 95% confidence?    │
                      └────────┬────────────────┘
                         Yes   │   No
                    ┌──────────┴──────────┐
                    v                      v
         ┌───────────────┐     ┌───────────────────┐
         │ Any guardrail │     │ Was the experiment │
         │ breached?     │     │ underpowered?      │
         └───┬───────┬───┘     └───┬────────────┬───┘
          No │       │ Yes      Yes│            │ No
             v       v             v            v
          SHIP    ITERATE     EXTEND        KILL &
          IT      (fix the    RUNTIME       DOCUMENT
                  trade-off)                LEARNINGS
```

### 10.6 Prioritized Experiment Backlog (Launch Quarter)

| Priority | Experiment | Hypothesis | Primary Metric |
|---|---|---|---|
| P0 | Guided onboarding checklist vs. current free-form | Checklist reduces TTFN by 30% | Time-to-First-Note |
| P0 | Supervision invite email copy (version A vs. B) | Personalized copy increases acceptance by 8 pp | Invite Acceptance Rate |
| P1 | Session note template: structured vs. free-text default | Structured default increases Notes/WAT by 15% | Notes per WAT per Week |
| P1 | Free-tier session note limit: 10 vs. 15 per month | Lower limit increases conversion without harming activation | Free-to-Paid Conversion |
| P2 | In-app prompt to book next session after note completion | Prompt increases scheduling adoption by 10 pp | Scheduling Feature Adoption |

---

## 11. Reporting Cadence

### 11.1 Cadence Overview

| Cadence | Meeting/Artifact | Audience | Metrics Covered | Duration |
|---|---|---|---|---|
| **Daily** | Automated Slack digest | Eng + Product | Guardrail alerts only (crash rate, API latency, note save failures) | Async (no meeting) |
| **Weekly** | Monday Metrics Standup | Product + Eng + Design | North Star trend, input metrics, experiment health checks | 15 min |
| **Bi-weekly** | Cohort Review | PM + Data Science | Retention cohorts (last 8 weeks), supervision funnel, engagement score distribution | 30 min |
| **Monthly** | Business Review | Leadership + Product + Growth | Full dashboard: North Star, all input/output metrics, MRR, NRR, LTV:CAC, experiment results | 45 min |
| **Quarterly** | Strategic Metrics Review | Founders + Product + Finance | ARR trajectory, cohort-level revenue maturation, CAC payback by channel, annual target recalibration | 90 min |

### 11.2 Weekly Standup Agenda (15 minutes)

| Time | Topic | Owner |
|---|---|---|
| 0-3 min | North Star QSDW: this week vs. last week vs. target trajectory | PM |
| 3-7 min | Input metric deltas: what moved, what didn't, and one hypothesis for each | PM + DS |
| 7-10 min | Active experiment status: any reaching significance? Any guardrails tripped? | DS |
| 10-13 min | Guardrail alerts from the past week (if any) | Eng Lead |
| 13-15 min | One decision or action item for the week | PM |

### 11.3 Monthly Business Review Deck Structure

| Slide | Content |
|---|---|
| 1 | North Star: QSDW actual vs. target (area chart, 12 weeks) |
| 2 | Revenue snapshot: MRR, NRR, ARPT, Free-to-Paid conversion |
| 3 | Acquisition funnel: sign-ups by channel, invite acceptance rate |
| 4 | Activation & engagement: TTFN, activation rate, WAT, notes/WAT |
| 5 | Retention: cohort heatmap (latest 8 cohorts), churn rate trend |
| 6 | Supervision wedge health: supervision sessions logged, pair retention, trainee upgrade rate |
| 7 | Experiment results: completed experiments with decisions; upcoming experiment queue |
| 8 | Guardrail review: any breaches in the past month, resolution status |
| 9 | Key risks and open questions for leadership input |

### 11.4 Alerting Rules

| Alert | Trigger | Channel | Responder |
|---|---|---|---|
| Crash rate spike | > 1% in any 1-hour window | Slack (on-call channel) + PagerDuty | Eng on-call |
| Note save failure | > 0.5% in any 4-hour window | Slack (on-call channel) | Eng on-call |
| QSDW weekly decline | > 10% WoW drop | Slack (product channel) | PM |
| Activation rate drop | < 30% for any weekly cohort | Slack (product channel) | PM + Growth |
| MRR decline | Any MoM decrease | Email to leadership | PM + Finance |
| Experiment guardrail breach | Any guardrail metric crosses threshold during active experiment | Slack (experiment channel) | DS + PM |

---

## Appendix: Revenue Model Reference

### Plan Structure

| Plan | Price | Billing | Target User | Notes Limit | Supervision Tracking | Priority Support |
|---|---|---|---|---|---|---|
| **Free** | INR 0 | -- | Early-career therapists, trainees exploring the tool | 10 notes/month | View-only (cannot create supervision entries) | No |
| **Solo** | INR 499/month | Monthly | Independent practitioners | Unlimited | Full (create, manage, export) | Email (48hr SLA) |
| **Annual** | INR 4,999/year | Annual (equivalent to ~INR 417/month) | Cost-conscious practitioners who commit for a year | Unlimited | Full | Email (48hr SLA) |
| **Clinic** | INR 1,499/month per seat | Monthly | Multi-therapist practices and clinics | Unlimited per seat | Full + admin dashboard | Chat + Email (24hr SLA) |

### Revenue Math (Illustrative 12-Month Target)

| Segment | Estimated Paid Users | ARPT (monthly) | Monthly Revenue |
|---|---|---|---|
| Solo (monthly) | 800 | INR 499 | INR 3,99,200 |
| Annual | 500 | INR 417 (amortized) | INR 2,08,500 |
| Clinic (seats) | 200 seats across ~30 clinics | INR 1,499 | INR 2,99,800 |
| **Total** | **1,500 paid users** | **INR 605 (blended)** | **INR 9,07,500** |

> Note: The INR 15,00,000 MRR target assumes accelerating growth in H2 as the supervision network effect compounds and clinic sales pipeline matures.

### Key Pricing Levers for Future Experimentation

| Lever | Experiment Idea | Expected Impact |
|---|---|---|
| Free-tier note limit | Test 10 vs. 15 vs. 20 notes/month | Directly affects conversion rate; lower limit = more conversions but risk of churn if value isn't demonstrated fast enough |
| Annual discount depth | Test INR 4,999 vs. INR 5,499 vs. INR 3,999 | Affects annual plan uptake and cash-flow timing |
| Clinic minimum seats | Test 2-seat minimum vs. no minimum | Affects clinic plan adoption; lower barrier but less initial revenue per account |
| Supervision-specific paid add-on | Charge trainees INR 199/month for supervision logging while keeping therapist features free | Opens a new revenue stream without gating core therapist value |

---

*This metrics framework is a living document. It will be revised quarterly as Mindstack matures from launch through product-market fit and into growth stage. The metrics that matter at 100 users are not the same metrics that matter at 10,000.*

---

> **Built by Parth** | Product Manager | [Mindstack Metrics Framework v1.0]
