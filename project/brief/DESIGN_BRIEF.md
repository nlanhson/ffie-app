# FFIE — Design Brief

**Version:** 0.1 (Draft for FFIE validation)
**Date:** 2026-05-28
**Skill:** `ux-strategy--design-brief`
**Source inputs:** [PRD v0.2](./FFIE_PRD_v0.2_EN.docx.pdf), [Personas CSV](./FFIE_WBS%20Fonctionnel%20-%200_Persona.csv), [Epics CSV](./FFIE_WBS%20Fonctionnel%20-%201_Epic.csv), [Stories CSV](./FFIE_WBS%20Fonctionnel%20-%202_Stories.csv)

---

## 1. Project Overview

**Name:** FFIE Mobile App (and supporting back-office)

**Summary:**
A native iOS + Android application for the **Fédération Française des Intégrateurs Électriciens (FFIE)** — the French professional federation for electrical integrators. The app is the federation's first dedicated digital channel for its three audiences:

1. **FFIE members** (electrical integration companies) — get a private, authenticated experience with federation news, a secure document library (technical, regulatory, business), and member-only resources.
2. **The general public and prospective members** — discover the trades of electrical integration through editorial content, video, and partner directories, with the goal of demystifying the profession and attracting new entrants.
3. **FFIE administrators** — manage app content (news, documents, videos, partners, push notifications) through a back-office, without engineering involvement.

**Business context:**
FFIE represents an industry under structural pressure (workforce shortage, regulatory complexity, energy transition). The federation needs a modern channel to (a) **retain members** by delivering tangible value beyond paper communications, (b) **attract new members** through visibility and credibility, and (c) **promote the trades** to a younger and broader audience. The mobile app is the cornerstone of this strategy for the 2026–2027 cycle.

**Primary stakeholder:** FFIE communications & digital lead (single point of contact for content and approvals). Engineering and design are external.

---

## 2. Problem Statement

**What:**
FFIE today communicates with its members primarily through paper, email blasts, and an under-used website. There is no fast, mobile-first channel for time-sensitive professional information (regulatory updates, member alerts, sector news, technical documentation). The general public has no narrative-driven entry point into the profession.

**Who is hurt:**
- **Members** miss or delay acting on federation communications. Finding a specific regulatory document is slow and friction-heavy. Members under-use their membership benefits because the benefits are not surfaced where they actually work — on their phones, between job sites.
- **Prospective members and the public** form opinions about electrical-integration trades through generic, often outdated sources. FFIE has no surface to tell its own story.
- **FFIE staff** spend disproportionate time forwarding documents, answering "where do I find X" emails, and pushing announcements that get lost.

**Evidence (from PRD):**
- Both core member pain points in the PRD are marked "TBC" — they are stakeholder hypotheses, not validated. We flag this and treat it as the **first research risk** to close (see Open Questions).
- The PRD names "loss of attractiveness of the trades" and "workforce shortage" as macro drivers — these are well-documented in the French BTP/electrical sector but not specific to FFIE members.
- The federation has chosen a mobile-app form factor explicitly because the audience is field-mobile (integrators rarely sit at desks).

**Consequences of doing nothing:**
- Continued member churn risk at renewal.
- The federation loses voice to LinkedIn, manufacturer apps, and informal channels.
- The trades-attraction objective stays a wish, not a program.

---

## 3. Target Audience

Four personas exist in the PRD/WBS at sketch level. We will flesh them out in the next step (`design-research--user-persona`). Brief summaries here:

### 3.1 FFIE Member — PRIMARY persona
A representative of an FFIE-member electrical-integration company — typically the owner, technical director, or office manager of a small/mid SME. Time-poor, mobile-first, oscillates between site, vehicle, and office. Wants regulatory clarity, fast access to federation documents, and proof that membership pays off. **The product must satisfy this persona before any other.**

### 3.2 Non-member Company
A representative of a non-affiliated electrical-integration company evaluating whether to join FFIE. Reads the public-facing parts of the app to gauge value and credibility. Conversion-sensitive.

### 3.3 General Public
A student, parent, career-changer, or curious citizen exploring electrical-integration trades. Has zero baseline knowledge. Needs the profession explained in plain language, with concrete examples (video, day-in-the-life, partners).

### 3.4 FFIE Administrator
Internal FFIE staff member (likely 1–3 people) who publishes news, uploads documents, configures push notifications, and curates the partner directory. Not a designer or engineer. Needs a back-office that is forgiving, fast, and forgiving again.

> **Note:** The CSV gives names, roles, and high-level pains but no validated demographics, journey maps, or behavioral evidence. Persona deepening is the next stage.

---

## 4. Goals and Success Criteria

The PRD does not specify measurable success criteria. We propose the following targets. **All KPIs marked "Proposed" must be validated with FFIE before they become commitments.**

### 4.1 Design Goal (north star)
> Make FFIE membership *feel useful every week*, and make the electrical-integration trades *feel desirable* to a curious outsider.

### 4.2 Quantitative KPIs (Proposed — to be validated with FFIE)

| # | KPI | Target | Why this number | Measurement |
|---|-----|--------|----------------|-------------|
| K1 | **Member monthly active rate** | **60% of FFIE members active monthly within 6 months of launch** | A retained-but-passive member never opens the app. 60% MAU is the industry benchmark for high-value B2B/association apps; below 40% signals the app is failing its core promise. | (Unique active members per month) / (Total FFIE members with account) |
| K2 | **Document library task success** | **≥ 85% of members can find a target document in under 60 seconds (moderated test, n=8)** | Document retrieval is the hardest-working member feature. Below 85% means search/IA needs rework. | Moderated usability test at launch and at +3 months |
| K3 | **News engagement** | **≥ 35% open rate on federation news push within 24h** | Federation push beats most email open rates (industry email avg ~20%); 35% reflects the trust premium of an opted-in pro audience. | Push delivery → app open within 24h |
| K4 | **Trades discovery reach (public)** | **5,000+ unique public-section sessions in first 6 months** | Modest but real — proves the federation now has a public voice. Anchors a later content strategy. | Anonymous public-section analytics |
| K5 | **Trades discovery depth** | **Avg. 3+ pieces of content consumed per public session** | Distinguishes a real "discovery" experience from a bounce. | Avg. content cards / videos viewed per public session |
| K6 | **Admin self-sufficiency** | **FFIE admins publish news, documents, videos, and push notifications with zero engineering escalations for 90 consecutive days** | The back-office only earns its keep if it removes engineering from the content loop. | Support-ticket tracking against the back-office |
| K7 | **Accessibility compliance** | **WCAG 2.2 AA pass on all Phase 1 screens (audited)** | Public sector adjacency + ageing member base + RGAA exposure in France. Non-negotiable. | Third-party or internal audit at handoff |
| K8 | **Offline resilience** | **Members can read the last 10 news items and 5 most-recent documents with no network** | The PRD asks for "partial offline cache." This is what that means in practice. | Manual test on flight mode |

> **Reasoning summary:** K1 and K3 measure whether members come back; K2 measures whether the hardest feature works; K4–K5 measure whether the public funnel breathes; K6 measures whether the back-office actually shifts work off engineering; K7–K8 are non-negotiable quality bars derived from audience constraints (field workers, French regulatory context).

### 4.3 Qualitative Indicators
- A member opens the app on a job site, finds a regulatory document, and shows it to a client — without coaching.
- A student watches a "discover the trades" video and can name two concrete day-to-day activities of an electrical integrator afterwards.
- An FFIE admin publishes a news item from a phone in under 3 minutes.
- The federation receives unsolicited member feedback that the app is "the most useful thing FFIE has done in years."

---

## 5. Scope and Constraints

### 5.1 In Scope — Phase 1 (~4–5 months from 23/04/2026)
The 10 Phase 1 epics / 25 user stories from the WBS:

1. **Authentication & 3-profile navigation** — member (logged-in), non-member, public; identity tied to FFIE member-management API.
2. **News feed** — federation news with categories, push-driven priority items.
3. **Document library** — searchable, filterable, with permission tiers (public, member-only).
4. **Discover the trades** — public editorial section: written content + media.
5. **Video** — embedded video player tied to news, document library, and discovery content.
6. **Partners directory** — searchable list of FFIE partners (suppliers, training bodies).
7. **Push notifications** — admin-triggered, segmentable by audience.
8. **Offline cache** — partial offline support for recently viewed news and documents.
9. **Security & GDPR** — auth flow, data minimization, RGPD-compliant data handling, password recovery, account deletion.
10. **Back-office** — web admin for FFIE staff to publish news, manage documents/videos/partners, and send push notifications.

### 5.2 Phase 2 — deferred
- **Tutorials** — structured, step-based how-to content.
- **Calculators** — sector-specific calculation tools (exact list TBC with FFIE).

### 5.3 Explicit Out of Scope (PRD)
- Payments and e-commerce
- Event ticketing
- In-app messaging / chat between members
- Member-to-member forum
- AI assistant / conversational interface
- Public API

### 5.4 Technical Constraints
- **Native iOS + Android** (no PWA, no hybrid Phase 1).
- **Partial offline cache** required for news + documents.
- **GDPR / RGPD compliance** — French jurisdiction, FFIE is data controller.
- **Member identity** depends on an existing FFIE member-management API (spec referenced but not yet attached — see Open Questions).
- **Back-office** is web-based (platform TBC — likely a CMS or a custom React admin).

### 5.5 Brand & Visual Identity Constraints
- **TBD.** No brand guidelines, visual identity, logo specifications, or tone-of-voice document has been provided. We will design a system that is neutral-professional by default and flag the brand gap as an Open Question.

### 5.6 Timeline Constraint
- Phase 1 must ship **~4–5 months from contract signature (23/04/2026)** → target window **late August to late September 2026**. Design milestones must protect engineering's build window (see §8).

### 5.7 Legal & Privacy
- RGPD: consent, data retention, right to erasure, data portability — all surfaced in the app UX, not buried in a settings menu.
- App store compliance: Apple App Store + Google Play guidelines, including the trickier rules around restricted membership content.

---

## 6. Context and Inputs

### Documents on file
- **PRD v0.2 (Draft, 30/04/2026)** — [./FFIE_PRD_v0.2_EN.docx.pdf](./FFIE_PRD_v0.2_EN.docx.pdf) — bilingual (FR/EN), 5 pages, structured but with multiple TBCs (opportunity statement, persona age, pain validation, acceptance criteria for US-01/02/03, post-Phase 2 features, calculator list).
- **Personas CSV** — [./FFIE_WBS Fonctionnel - 0_Persona.csv](./FFIE_WBS%20Fonctionnel%20-%200_Persona.csv) — 4 personas, name/role/pain at sketch level.
- **Epics CSV** — [./FFIE_WBS Fonctionnel - 1_Epic.csv](./FFIE_WBS%20Fonctionnel%20-%201_Epic.csv) — 12 epics (10 Phase 1 + 2 Phase 2).
- **Stories CSV** — [./FFIE_WBS Fonctionnel - 2_Stories.csv](./FFIE_WBS%20Fonctionnel%20-%202_Stories.csv) — 29 stories, with acceptance criteria for most but "TBC" on US-01/02/03 (the auth + 3-profile-nav stories — the most important ones).

### References folder
- [./references/](./references/) — empty. To be populated with competitor apps (other French professional federations, comparable B2B association apps), FFIE existing communications (newsletters, website screenshots), and any brand assets FFIE provides.

### Competitive / inspiration scan (to do in next stage)
Suggested benchmarks: CAPEB app, FFB Bâtiment app, Qualifelec, Ordre des Architectes, association.com style portals. Goal: see what the French professional-federation app pattern looks like before we propose our own.

### Previous attempts
None known. This is FFIE's first dedicated mobile app.

---

## 7. Open Questions for FFIE

These are the questions we would send back to the client before locking the design direction. We do not need all answered to start designing, but we do need them all answered before lock-down.

1. **Member pain points** — the two pains listed in the PRD are marked "TBC / not validated." Can we run 5–8 short interviews with member companies (mix of owner/technical/office roles, mix of company size) to validate or replace those pains before we lock IA?
2. **Acceptance criteria for US-01, US-02, US-03** (authentication and 3-profile navigation) — these are the highest-risk stories and currently have no AC. Can FFIE walk us through the expected login flow, including how member identity is verified against the existing member-management API (does the user enter a member number? email-based SSO? something else)?
3. **Member-management API** — can we get the API spec (or a sandbox), the data fields available per member, and the authentication model? This blocks the auth flow design.
4. **Brand & visual identity** — does FFIE have a logo, color palette, type system, tone-of-voice guide, or any visual references we should respect? If not, are we authorized to propose one as part of this engagement?
5. **Opportunity statement (PRD §2.3)** — the PRD leaves this blank. What is the *business* opportunity statement: member retention? member acquisition? federation revenue? influence? Knowing which is primary changes what we optimize the experience for.

---

## 8. Deliverables and Timeline

### 8.1 Deliverables (this engagement)
- Validated design brief (this document, after FFIE review).
- Deepened personas (4) with disability dimensions.
- Journey maps for the 2 most important member tasks (find a regulatory document; act on a federation news push).
- Design system: tokens (color, type, spacing, elevation, motion), component library, accessibility baseline.
- High-fidelity screens for the 10 Phase 1 epics, native iOS + Android.
- Back-office wireframes + high-fidelity screens.
- Interaction specs (states, transitions, error handling, offline behavior).
- Accessibility audit + WCAG 2.2 AA compliance report.
- Developer handoff package (specs, tokens, assets, Code Connect mappings where applicable).

### 8.2 Timeline — Phase 1 (anchor: signature 23/04/2026; target ship late Aug – late Sep 2026)

| Week | Milestone | Skill / agent |
|---|---|---|
| W1 (now — late May) | Brief locked, personas + journeys done, principles set | `ux-strategy--design-brief` (this doc), `user-persona`, `journey-map`, `design-principles` |
| W2–W3 | Research validation interviews (5–8 members), competitive scan, IA proposal | `competitive-analysis`, `card-sort` if needed |
| W3–W5 | Design system v1: tokens, color, type, spacing, key components | `design-system-architect` agent + `design-systems--*` skills |
| W5–W9 | UI v1 — all 10 Phase 1 epics, mobile screens, back-office wireframes | `ui-designer` agent + `figma-generate-design` |
| W9–W11 | UI v2 — critique, accessibility pass, motion pass, error/offline/empty states | `design-reviewer`, `inclusive-*` skills, `emil-design-eng` |
| W11–W13 | Back-office high-fidelity, handoff prep | `design-ops--handoff-spec`, `figma-code-connect` |
| W13–W14 | Final handoff + design QA support during build | `design-ops--design-qa-checklist` |
| Ongoing | Design QA during engineering build (post-handoff support) | — |

> **Buffer note:** This schedule assumes FFIE responds to the Open Questions within 1 week and provides member-interview access by W3. Slippage on either pushes design-system lock-down — which pushes everything.

### 8.3 Review Points
- **End of W1** — brief, personas, principles signed off by FFIE.
- **End of W3** — IA and design-system tokens signed off.
- **End of W9** — UI v1 review with FFIE + engineering lead.
- **End of W11** — UI v2 + accessibility sign-off.
- **End of W14** — handoff complete, design QA process agreed.

---

## 9. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| FFIE — Communications & Digital Lead | _TBD_ | | |
| Studio — Lead Designer | _TBD_ | | |
| Studio — Engineering Lead | _TBD_ | | |

*Brief drafted by Unicorn (studio lead), 2026-05-28. To be reviewed with FFIE before stage 1 close.*
