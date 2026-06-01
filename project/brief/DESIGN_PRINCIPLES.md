# FFIE — Design Principles

**Project:** FFIE — Fédération Française des Intégrateurs Électriciens — mobile app + back-office
**Date:** 2026-05-28
**Skill:** `ux-strategy--design-principles`
**Source inputs:** [DESIGN_BRIEF.md](./DESIGN_BRIEF.md), [PERSONAS.md](./PERSONAS.md)

---

## How to read this document

These are **seven numbered, opinionated, persona-anchored principles** that govern every design decision on FFIE — mobile app and back-office alike. They are deliberately **sharp**. Each one takes a side. Each one rules out something specific. Each one is testable in a screen review without subjective debate.

**Precedence rule — read this carefully.** When two principles conflict on a given screen, **the lower-numbered principle wins.** The order is not arbitrary. It is anchored to:

1. **Who breaks the project if we fail them?** Julien Marchand (PRIMARY persona) — the FFIE member. If Julien isn't served on a worksite in dead-zone connectivity with gloved hands in bright sun, the app fails its core promise and the engagement fails regardless of how good the public section looks. Julien's three situational realities — **offline, one-handed, glare** — therefore take principles 1, 2, and 3.
2. **What is non-negotiable harm prevention?** Accessibility floors (principle 4) sit above admin safety because they are legally exposed (RGAA, app-store rules) and they protect people we cannot identify in advance.
3. **What is operationally non-negotiable?** Sylvie's CMS PTSD (principle 5) — the back-office is where federation trust either is built or is broken. We design admin safety as a first-class concern, not a final-mile afterthought.
4. **What enables growth?** Public discovery (principles 6 and 7) come last because they are second-order — they expand the franchise but do not save it.

**This precedence is not a "nice to have." When the design-system-architect or ui-designer ships something that violates principle 1, that is a blocking issue. When something violates principle 7, it is a discussion.**

---

## Principle 1 — Field-ready over feature-rich

> **We design for a gloved hand in a dead zone in bright sun, before we design for anything else.**

### Rationale
Julien Marchand opens the app 5–10 times a day in short bursts on rural worksites with 2-bar 3G or no signal at all, often one-handed while holding a tool or wire, in direct sunlight. Every feature decision must pass through that filter first. If a feature is gorgeous on a desk monitor at 100% brightness with full Wi-Fi and two hands, that tells us nothing. Julien is the customer; field conditions are the actual deployment environment.

### What this looks like in practice
- **Primary CTAs live in the bottom third of the screen.** Top-right corner is reserved for low-stakes utilities (settings glyph, dismiss).
- **Touch targets: 48pt for primary actions, 44pt absolute floor for any tap target.** No exceptions — including icon-only buttons.
- **Every screen has a cached or degraded mode.** No infinite spinners. If we're offline, show what we have plus the sync timestamp.
- **Documents render their `version` and `last updated` date in the list view**, before they're opened, because a stale doc on a worksite is a liability.
- **Bright-sun high-contrast variant** of the app theme available via OS-level high-contrast or an in-app toggle accessible without re-auth.

### What this rules out
- Hover-dependent interactions (worksite hands don't hover).
- Critical actions in the top status-bar zone (unreachable one-handed on a 6"+ phone).
- Network-required confirmations for actions Julien expects to complete offline (e.g., opening a cached doc, reading saved news, sharing to WhatsApp).

### How we'd test it
Screenshot review with a gloved-hand reachability overlay: can the user trigger every primary action with the thumb of the hand holding the phone, on iPhone 12 and Samsung Galaxy A14 screen sizes? If no, the screen fails principle 1.

---

## Principle 2 — Offline is the default, not the exception

> **The app must be useful on the cellular cliff edge. Connectivity is a bonus, not a requirement.**

### Rationale
Per PRD and Julien's persona, rural worksites have 2-bar 3G or no signal at all. The PRD asks for "partial offline cache"; we interpret that as a design stance, not a feature toggle. KPI K8 commits us to "last 10 news items + 5 most recent documents readable on flight mode." Designing offline-first forces clarity about state, sync, and freshness — which incidentally produces a better online experience too.

### What this looks like in practice
- **Sync status is visible on the home screen** as a small, calm indicator — last synced timestamp, never a red error unless we genuinely need user action.
- **Cached documents are marked with a small "cached" glyph and date**, so Julien knows what's local and what isn't.
- **"Save offline" is a one-tap action on any document detail page**, with a clear filled/unfilled state.
- **No login wall on cached content.** A re-auth that fails offline must not lock Julien out of docs he already downloaded.
- **The news feed degrades gracefully** — show what's cached, show the timestamp, never a blank "you're offline" wall.

### What this rules out
- Modal "you must be online to use this app" interstitials.
- Pull-to-refresh that wipes cached content if the refresh fails.
- Search results that depend entirely on a server roundtrip — local indexing of cached documents and news titles is required.
- Sign-out flows that purge cached content silently (Julien expects his saved circulars to still be there).

### How we'd test it
Manual flight-mode test on iPhone 12 and Galaxy A14: cold-launch the app, navigate to the last 10 news items, search for a cached document, share it to WhatsApp. If any step shows a spinner that never resolves or an error wall, the screen fails principle 2.

---

## Principle 3 — Search is the front door, not a feature

> **For the document library, the search input is the first thing the member sees. Browsing categories is the fallback.**

### Rationale
Julien searches reactively — "an apprentice just asked about the cross-section for a 32A circuit" — not proactively. He doesn't browse. Building a beautiful category tree as the primary IA would be misreading him. KPI K2 (≥85% find a target doc in <60 seconds) is impossible if the path is "tap Library → tap category → scroll → tap subcategory → tap doc." Search-first inverts that. Categories exist as filters, not as the primary navigation.

### What this looks like in practice
- **Document library opens with the search input focused and the keyboard up** (configurable: opt-out for return visitors who land on recent docs).
- **The search input lives in the bottom or middle of the screen on mobile**, in the thumb arc, not pinned to the top out of reach.
- **Search results are scoped by default to "all docs the user has access to"**, with filter chips below (category, version, format, member-only).
- **Search is the primary action on the doc-library tab.** Categories appear *below* the search input as scannable chips, not as the screen's main affordance.
- **Search-by-standard-code is treated as a first-class query** — `NF C 15-100` returns the canonical doc as the top hit, not as a fuzzy text match.

### What this rules out
- A document library home that opens to a category grid with search hidden behind an icon.
- Search inputs in the top-right corner (principle 1 + principle 3 reinforcing).
- "No results" pages without a fallback action (suggested categories, recent docs, ask FFIE).
- Server-only search that fails offline (principle 2 still applies).

### How we'd test it
Moderated test, n=8 members, prompt: "Find the FFIE summary of the latest Consuel circular." Measure time-to-document. Anything over 60 seconds for ≥15% of users means principle 3 is violated somewhere in the flow.

---

## Principle 4 — Accessibility is a floor, not a ceiling

> **WCAG 2.2 AA is the minimum on every screen. AAA on body text where it costs us nothing. Accessibility decisions trump aesthetic preferences.**

### Rationale
Three forces converge here: (a) the member base skews 40+ with normal age-related presbyopia (Julien is 47, Sylvie is 53, wearing bifocals); (b) French context — RGAA applies, FFIE has public-facing surface; (c) the audience uses the app in conditions that *simulate* permanent impairments (glare = low vision, gloves = reduced motor, loud worksite = no audio). Designing for accessibility serves the situational case too. AA is not a stretch goal; it is the lower bound below which we do not ship.

### What this looks like in practice
- **Body text contrast ratio ≥ 7:1 (AAA) on light and dark themes**, where layered surfaces allow.
- **No information conveyed by color alone** — status uses icon + label + color, never color alone.
- **Type scale supports iOS Dynamic Type and Android font scaling up to 200%** without layout breakage.
- **All videos in the public section have captions**, hard-coded into the production workflow (FFIE-VIDEO-01).
- **Every interactive element has a keyboard equivalent and a screen-reader label** in the back-office.
- **`prefers-reduced-motion` respected** — any animation has a reduced or disabled variant.

### What this rules out
- Gray-on-white labels under 4.5:1 (e.g., placeholder text used as a label).
- Toast notifications that disappear before a screen reader can announce them.
- Icon-only buttons without `aria-label` (back-office) or accessibility-label (mobile).
- Animations that ignore reduced-motion preferences.
- Videos shipped without captions, on either the public or member side.

### How we'd test it
Automated: axe / Lighthouse / Accessibility Inspector pass with zero AA violations on every Phase 1 screen. Manual: VoiceOver / TalkBack walkthrough of the two top member tasks (find a document, read a news item). For body text specifically: contrast check at ≥ 7:1 on any text under 18px regular / 14px bold.

---

## Principle 5 — Forgive the editor, even before the publisher

> **In the back-office, dangerous actions are two-step, reversible, and visible. We design for Sylvie's worst Friday afternoon, not her best Tuesday morning.**

### Rationale
Sylvie Rousseau has been burned by previous vendors and the legacy CMS. Her trust in the back-office is the federation's communication infrastructure. KPI K6 commits us to "90 consecutive days of admin self-sufficiency, zero engineering escalations." That target is only reachable if the back-office is *forgiving*. A back-office that punishes a typo by spamming 6,000 members is a back-office that gets used once. Forgiveness is not a feature; it is the operating model.

### What this looks like in practice
- **Push notification send is a two-step flow with full preview** — exact iOS and Android lock-screen rendering, audience count, scheduled time, and a final "Send to N members" button that requires deliberate confirmation.
- **Publish actions have a 60-second undo window**, with a persistent toast — long enough to catch a typo, short enough to feel like publishing actually happened.
- **Destructive actions (delete document, deprecate news, revoke push) require a typed-confirmation or double-tap** with the resource name in the dialog, not a generic "Are you sure?"
- **Status is unambiguous and persistent** — `draft / scheduled / published / archived / deprecated`, visible in lists and detail views, no ambiguity about state.
- **Every failure surfaces with a fix** — "Upload failed" is incomplete; "Upload failed: file is 14 MB, max is 10 MB. [Compress and retry]" is correct.
- **Activity log** — who did what when, accessible to Sylvie without a support ticket.

### What this rules out
- One-click destructive actions (delete, send-to-all-members, deprecate).
- Confirmation dialogs that say "Are you sure?" without naming the resource and consequence.
- Silent failures (upload, publish, schedule) — no toast, no log, no recovery.
- "Saved" toasts that disappear so fast Sylvie isn't sure they appeared.
- Status badges with ambiguous wording ("Live" vs "Published" vs "Sent" used interchangeably).

### How we'd test it
Walkthrough: Sylvie sends a push notification, then immediately realizes the title has a typo. Can she stop it within 60 seconds, with no support ticket? If no, principle 5 is violated. Secondary check: every destructive action in the back-office has a recovery path documented in the spec.

---

## Principle 6 — No login wall on what the public should see

> **Anything Karim or Léa is meant to evaluate is one tap from app-open. No account, no email gate, no "register to continue."**

### Rationale
Karim Benali (non-member evaluator) installs the app once, gives it five minutes, and decides. Léa Fontaine (student, public discovery) opens it once or twice in her life. A login wall in front of either of them is a self-inflicted churn event. The PRD explicitly designs for a non-authenticated public experience (FFIE-AUTH-05: no profile-selection step). Member-only content is gated; *everything else* is open, and the gate's existence itself is a sales tool (principle 7).

### What this looks like in practice
- **App opens directly to the home / news feed in public mode** — no splash sign-in, no profile picker.
- **The "Discover the trades" section is fully readable, watchable, and shareable without an account.**
- **The "Become a member" CTA is visible above the fold on the public home**, but not as a modal interruption.
- **Member-only content shows a clear "member-only" badge** with a one-tap "What I'd unlock" preview (counts of documents, summaries, templates) — gate is visible but informative.
- **Public news is high-quality on its own**, not a trimmed teaser of member content. Karim must come away thinking "the federation is serious" from the free content alone.

### What this rules out
- Sign-in walls on the home screen.
- Email-capture interstitials before the public can see news or the discovery section.
- "Login to read more" cuts in the middle of a public article.
- Required account creation to play a public video.

### How we'd test it
Cold-install walkthrough: install the app, do not sign in, attempt every public task (read news, watch a Discover video, look up a partner, view membership pricing). If any of those steps requires an account or an email, principle 6 is violated.

---

## Principle 7 — Show the value before asking for the relationship

> **For non-members and the public, every screen earns the next tap. We sell with content, not with claims.**

### Rationale
Karim is skeptical of federations; Léa has zero context about FFIE. Brochure-style copy ("Join a future-proof profession!") actively repels both of them. The currency that converts is *substance* — concrete documents, specific videos, real partner contacts. The "what I'd get as a member" page must show real counts and real categories; the "Discover the trades" section must lead with a 60-second video, not a wall of text. This principle governs content strategy, IA, and copy tone alike.

### What this looks like in practice
- **The "What I'd get" preview shows real counts**: "247 technical documents, 18 standards summaries, 32 templates" — never marketing claims.
- **The Discover section opens with a hero video**, with a short scannable outline below, not a paragraph header.
- **Public news has the same editorial quality bar as member news.** No deliberate dumbing-down.
- **Imagery represents the real, diverse field** — women, people of color, range of ages and contexts. Defaulting to white-male-electrician stock photography violates this principle.
- **Membership CTA copy is specific** — "See pricing & apply" beats "Join the federation". Specific button labels (per Vercel Web Interface Guidelines).

### What this rules out
- Hero copy that uses words like "innovative," "future-proof," "your partner of choice."
- Stock photography of generic "electricians" that doesn't reflect the real demographic mix.
- Membership pricing buried more than two taps from the public home.
- Video sections without captions (principle 4 reinforcing).
- "Become a member!" modal pop-ups that interrupt content consumption.

### How we'd test it
Five-second test with non-electricians: show the public home for five seconds, ask "what is this app about, and who is it for?" If they say "marketing for a federation" — fail. If they say "information for electricians and people curious about the trade" — pass.

---

## How to use these principles

### In design critique
- Open the screen, open this document, name the principle being violated by line number. "This violates principle 1 — the primary CTA is in the top-right and the touch target is 36pt."
- When two designers disagree, name the principles in tension. Lower number wins. Move on.
- If a critique can't be tied to a principle, either the critique is taste (note it but don't block) or the principles are missing one (propose an amendment, see below).

### In handoff
- The QA checklist (`design-ops--design-qa-checklist`) inherits these principles. Every check should trace back to a principle by number.
- The handoff spec (`design-ops--handoff-spec`) calls these out by number when describing acceptance criteria.

### When invoking other skills
- The design-system-architect must read this document before defining tokens. Principles 1, 2, and 4 constrain the color and type system directly (sunlight-readable contrast variant, Dynamic Type support, 48pt touch-target token, offline-state token).
- The ui-designer must reference principles 1 and 3 when designing the document library tab.
- The design-reviewer must use these as their primary heuristic alongside Nielsen.

### Amending these principles
- Principles are versioned with the brief. To amend: open a PR-equivalent (a session with Unicorn), propose the change, name the persona evidence that justifies it. Replacing or reordering principles 1–3 requires explicit FFIE sign-off, since they encode promises to the primary persona. Principles 4–7 can be tightened or expanded on studio judgment, then re-validated at the next FFIE review.
- We **do not** quietly drift. Either a principle is in this document and binding, or it is not.

---

## Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| FFIE — Communications & Digital Lead | _TBD_ | | |
| Studio — Lead Designer | _TBD_ | | |

*Principles drafted by Unicorn (studio lead), 2026-05-28. To be confirmed with FFIE alongside the design brief at the end of Stage 1.*
