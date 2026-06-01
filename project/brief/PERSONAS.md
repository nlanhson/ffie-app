# FFIE Personas

**Project:** FFIE — Fédération Française des Intégrateurs Électriciens — mobile app
**Date:** 2026-05-28
**Source:** Synthesized from PRD v0.2 + WBS personas (4) + 29 user stories + reasonable inference about the French electrical-integration trade context. Composite personas — should be validated with FFIE field interviews before Stage 3.

---

## Quick reference

| # | Persona | Role | Priority | Context of use |
|---|---|---|---|---|
| 1 | **Julien Marchand** | Owner-manager, mid-size electrical integration company | **PRIMARY** | On worksites + at his office, daily |
| 2 | **Karim Benali** | Independent electrician, owns a small non-member SARL | Secondary | Discovery + evaluation; rarely after that |
| 3 | **Léa Fontaine** | Student in a CAP/Bac Pro Électricité program | Secondary | Once or twice, evening at home |
| 4 | **Sylvie Rousseau** | FFIE federation staff — content & communications | Internal | Daily desk work in the back office |

**Primary persona rationale:** Julien is the only user whose loyalty and frequency of use determine whether the app justifies its cost. Non-members convert (or don't) once. The public visits once. Admins use the back-office but aren't the customer. **Julien is the customer.** If we satisfy Julien, the rest fall into place. If we don't, the project fails regardless of how good the public section is.

---

## 1. Julien Marchand — The FFIE Member *(PRIMARY)*

> *"I just need the right standard document in my hands before the inspector arrives — not after."*

![Photo placeholder: 47-year-old man, weathered hands, wearing a navy work polo with a company logo, standing in front of an electrical cabinet on a construction site, phone in hand.]

### One-line role
Owner-manager of a 12-person electrical-integration company in a regional French city. Member of FFIE for 9 years.

### Demographics
- **Age:** 47
- **Location:** Tours (Centre-Val de Loire). Splits time between his office in a small industrial zone and active worksites within ~60km.
- **Company size:** 12 employees (8 electricians, 2 apprentices, 1 office manager, himself).
- **Tech literacy:** Medium. Confident with iPhone, WhatsApp, email, his accounting software (EBP). Has tried — and abandoned — three "trade apps" because they were either too generic or too cluttered.
- **Device:** iPhone 12 (he upgrades every 4–5 years), 5G when in town, 3G or dead zones on rural worksites. Sometimes uses an old iPad in the truck.

### Goals (what he wants from the app)
1. **Find the exact NF C 15-100 clause** or technical document he needs **in under a minute**, in front of a client, an inspector, or an apprentice asking him a question.
2. **Stay informed** about regulatory changes (new RE 2020 amendments, Consuel rule updates) without trawling through email newsletters he never reads.
3. **Show clients the FFIE membership badge** as a trust signal during quote presentations.
4. **Quick reference for partner contacts** (Qualifelec, Consuel, OPPBTP) when something goes sideways on a job.
5. **Feel that his federation dues are worth something tangible.**

### Frustrations (pain points the app must address)
1. The FFIE website is **a desktop-era document graveyard** — search is bad, the PDFs don't open well on mobile, login times out constantly.
2. **He gets caught flat-footed in front of clients** because he can't quickly cite a standard. Embarrassing and expensive.
3. **Document versions** — he's not sure if the PDF on his phone is the latest one or three revisions out of date. (Real liability risk.)
4. **Notification fatigue** — if the app spams him, he turns off notifications within a week and never sees the important regulatory alert.
5. **He doesn't trust new apps with his login credentials** after a federation in another sector had a data breach in 2024.

### Behaviors
- Opens the app **5–10 times a day** in short bursts: during a worksite visit, walking back to his van, between client meetings, in the evening on the couch.
- **Reads news in two contexts:** standing on a worksite (skimming, single-handed, often with dirty gloves on) or in bed at 22:30 (slow scroll, full reading).
- **Searches for documents reactively, not proactively** — he opens the doc library because someone just asked him something specific, not to browse.
- **Hates entering credentials.** Will use FaceID/TouchID 100% of the time once set up. Will rage-quit if forced to re-type his password weekly.
- Will absolutely **screenshot a document and send it on WhatsApp** to his team — designing around this is a feature, not a bug.

### A day in his life
07:15 — Coffee at the office. Scrolls FFIE news for 2 minutes while reading email. Sees a push notification about a new Consuel circular. Saves it for later.
08:30 — On a worksite (new construction, rural). His apprentice asks about the required cross-section for a 32A circuit. Julien pulls out his phone, opens the FFIE app, searches "section câble 32A", gets the right document in 20 seconds, points at the table, gives the apprentice the lesson.
11:00 — Driving between jobs. App should not demand his attention right now. **Silence is a feature.**
14:00 — In a client meeting, the customer asks about RE 2020 compliance for their renovation. Julien opens the news section, finds the FFIE summary article from last week, screen-shares his phone, looks competent.
18:30 — Back at office. Downloads the new Consuel circular PDF for offline use, sends it to his foreman via WhatsApp.
22:30 — In bed. Opens the app, reads the saved circular properly. Reads two other news items. Closes the app. The app got him for 6 minutes — that's a win.

### Ability and situational dimensions
- **Vision (situational):** Frequently uses the app in bright outdoor sunlight on rural sites. **Glare is a constant.** High-contrast mode and large readable text matter more than any visual flourish. Also wears reading glasses but doesn't always have them on a worksite.
- **Motor (situational):** Often operates the phone **one-handed** while holding a wire, tool, or document in the other. Sometimes wearing thin work gloves. Sweaty/dirty fingers. **Touch targets must be 44pt minimum; ideally 48pt for primary actions.**
- **Connectivity (situational):** Rural worksites have **2-bar 3G or no signal at all**. The app must work degraded — cached news, downloaded docs, no infinite spinners.
- **Cognitive (situational):** **Interrupt-heavy context** — he opens the app, gets pulled away by an apprentice question or phone call, comes back 90 seconds later. The app must preserve state and not lose his place.
- **Auditory:** No major impairment, but worksites are loud. **No critical info conveyed by sound alone.** Notifications should be visual + haptic.
- **Permanent:** None disclosed. Composite includes a likely slight age-related presbyopia (47 yo) — typography scale must support iOS Dynamic Type.

### Design implications (concrete, non-negotiable)
1. **Offline-first for documents and last 10 news items.** No "you're offline" dead-ends. Cached doc must show its sync date prominently so he knows if it's stale.
2. **Search must be the front door of the document library.** Not browse-by-category. He searches reactively; the search field belongs at the top, focused on tap.
3. **WCAG AA contrast minimum, AAA for body text where possible.** Dark mode required for evening reading. High-contrast bright-sun mode worth investigating.
4. **Touch targets 48pt for primary actions, 44pt absolute floor.** No tiny icon-only toolbars.
5. **One-handed reachability** — primary actions live in the bottom third of the screen. No critical CTAs in the top-right corner.
6. **Biometric login as default after first authentication.** Re-auth window long enough to feel invisible (30 days for low-sensitivity content).
7. **Document version + last-updated date visible without opening the doc.** This is liability protection, not a nice-to-have.
8. **Share-to-WhatsApp / share-to-Mail must be one tap from any document.** Design with the leak, not against it.

---

## 2. Karim Benali — The Non-member Company

> *"Why should I pay 600€ a year for a federation? Show me what I get."*

![Photo placeholder: 38-year-old man, short beard, polo shirt with no logo, sitting on the tailgate of his Renault Kangoo with a thermos of coffee. Phone in hand, brow slightly furrowed.]

### One-line role
Owner-operator of a 2-person electrical SARL in Lyon's outer suburbs. Founded the company 5 years ago after working as a salaried electrician for 12 years.

### Demographics
- **Age:** 38
- **Location:** Vénissieux (Lyon metro). Works across the whole Greater Lyon area, mostly residential renovation and small tertiary.
- **Company size:** 2 — himself and one full-time electrician he hired last year.
- **Tech literacy:** Medium-high. Uses Tolteck for quotes, Pennylane for accounting, Google Maps and WhatsApp constantly. Comfortable with subscriptions and SaaS.
- **Device:** Android (Samsung Galaxy A54). Generally good 4G coverage.

### Goals (what he wants from the app)
1. **Evaluate whether joining FFIE is worth it** — see the value proposition concretely, not as a marketing brochure.
2. **Understand who FFIE is** and what they do (he's heard of Qualifelec and Consuel but is fuzzy on FFIE's role).
3. **See what reserved content exists** without being able to read it — enough to know what he'd unlock.
4. **Get clear pricing and a fast path to apply** when he's ready.
5. **Stay informed** about the broader trade — he'd read news even before joining.

### Frustrations (pain points the app must address)
1. **Federations feel opaque and old-school.** Web pages full of jargon. He suspects he's paying for a logo, not value.
2. **Doesn't know who to ask.** No clear sales contact. Calling a federation feels like calling a notary — intimidating.
3. **Joining processes are usually paper-heavy.** If FFIE wants him to mail a printed form, he'll close the app.
4. Mixed messages from peers — half say "join, it pays for itself," half say "waste of money."

### Behaviors
- Will **install the app once** — probably from a Google search or a peer recommendation — and decide in 5 minutes whether it's worth keeping.
- Skims rather than reads. Pricing and "what's included" must be one tap from the home screen.
- **Compares.** He'll check the FFIE app side-by-side with Qualifelec's communication. The bar is set by his other professional tools, not by other federations.

### A day in his life
A peer mentions FFIE at a supplier counter. That evening at 21:00, on his couch, Karim Googles "FFIE", downloads the app, opens it. Sees the public news. Taps "Become a member" — he expects either a clear sales page or a brochure. **If the path is clear, FFIE gets a lead. If it's vague, he closes the app and forgets they exist.**

### Ability and situational dimensions
- **Cognitive (situational):** Short evaluation window (~5 min). **Information density must be high but scannable.** Buries the value-prop and you lose him.
- **Trust:** No prior relationship with FFIE. **First impression carries enormous weight** — visual polish signals seriousness.
- **Other dimensions:** No permanent impairments disclosed. Standard accessibility requirements apply.

### Design implications
1. **"Become a member" CTA visible without scroll** on the home / news feed.
2. **A "What I'd get as a member" preview page** showing locked document categories with counts (e.g., "247 technical documents, 18 standards summaries, 32 templates") — not just a paywall.
3. **Membership flow on mobile, no PDF forms.** If FFIE backend can't accept digital applications, capture lead + email and follow up.
4. **Public news section must be high-quality on its own.** It's the bait — if it's thin, the conversion case collapses.
5. **No login wall on anything Karim should see.** Every gated screen that he can't access is a lost trust moment.

---

## 3. Léa Fontaine — The General Public

> *"I think I want to be an electrician but I don't know anyone who is one."*

![Photo placeholder: 17-year-old, headphones around her neck, scrolling on her phone in a school courtyard at break time.]

### One-line role
Première-year student in a Bac Pro MELEC (Métiers de l'Électricité et de ses Environnements Connectés) program, exploring whether to commit to the trade after graduation.

### Demographics
- **Age:** 17
- **Location:** Outskirts of Marseille. Lives with her parents.
- **Tech literacy:** Very high (Gen Z), but for **consumer** apps — TikTok, Instagram, Snapchat. Professional apps are a foreign genre.
- **Device:** Android mid-range (Samsung Galaxy A14), always-on 4G/Wi-Fi.

### Goals (what she wants from the app)
1. **See what the actual job looks like** day-to-day, not the school version.
2. **Find role models** — especially women in the trade (the field is 1.5% women in France).
3. **Understand career paths** — what comes after CAP/Bac Pro, salary expectations, specializations.
4. **Watch videos.** Reading long pages is not how she learns.

### Frustrations (pain points the app must address)
1. School career counseling is generic and dated.
2. Online content about electricians is either marketing fluff ("rejoignez un métier d'avenir!") or technical PDFs from 2015.
3. **Nothing speaks to her age, gender, or visual literacy.**

### Behaviors
- 30-second attention windows. Will tap, skim, swipe away.
- **Video-first.** Will watch a 60-second video before reading a 200-word page.
- Will likely come back to the app **once or twice total**, then move on.

### A day in her life
After career-orientation class she pulls out her phone, searches "métier électricien France", sees the FFIE app in the results, downloads it. Spends 4 minutes scrolling the "Discover the trades" section. Watches one video. Closes the app. **In a good outcome, she leaves with one new mental image of the job that wasn't there before.**

### Ability and situational dimensions
- **Cognitive (situational):** Very short attention budget. **Hierarchy and chunking matter more than completeness.**
- **Auditory:** Will watch videos with **sound off** in public (school, transit). **All videos need captions** — non-negotiable.
- **Vision:** No impairment disclosed, but uses phone outdoors frequently — sunlight glare applies here too.
- **Inclusion:** The "Discover the trades" section must depict women and people of color in the trade. Defaulting to white-male-electrician stock photos actively pushes Léa away.

### Design implications
1. **Video captions are mandatory** for FFIE-VIDEO-01. Plan caption workflow with FFIE before content production.
2. **The Discover section opens with a video, not a wall of text.** Hero-video pattern, with a short scannable text outline below.
3. **Visual diversity in all imagery and persona content.** Audit every illustration / photo for representation.
4. **No login wall.** Léa would never create an account just to see careers content.
5. **Pacing:** chunks of <80 words, swipeable. Modeled on social media reading habits, not corporate brochures.

---

## 4. Sylvie Rousseau — The FFIE Administrator

> *"If I have to call our IT provider every time I publish a news item, this app is worse than the website."*

![Photo placeholder: 53-year-old woman, glasses, navy blazer, at her desk in the FFIE Paris headquarters with two monitors. A printed editorial calendar on the wall behind her.]

### One-line role
Communications & content lead at FFIE headquarters in Paris. Manages news publication, document library curation, member communications.

### Demographics
- **Age:** 53
- **Location:** Paris 8e (FFIE offices).
- **Tech literacy:** Medium. Comfortable with Word, Outlook, the old FFIE website CMS (which she resents), Canva. Has never used a "design system" or anything like Notion. Cautious with new tools — she's seen vendors over-promise and disappear.
- **Device:** Windows desktop at work, iPhone personally. **The back-office must be desktop-first.**

### Goals (what she wants from the app)
1. **Publish a news item in under 5 minutes** from when she receives the source content.
2. **Schedule posts** in advance (especially around regulatory deadlines, federation events).
3. **Manage the document library** — upload, categorize, set member-only access, deprecate old versions.
4. **See real metrics** — how many people opened a news item, downloaded a document, opened a push notification. (The current site gives her almost nothing.)
5. **Trust the system** — no "did it actually publish?" anxiety. Status must be unambiguous.

### Frustrations (pain points the app must address)
1. **Loss of control.** She's the editor; she should not need a developer to publish a press release at 17:00 on a Friday.
2. **The current CMS dates from ~2014.** Pasting from Word breaks formatting. Image uploads silently fail.
3. **No visibility into what users do.** She doesn't know which docs are downloaded vs. ignored.
4. **Push notifications terrify her** — sending one to all members is a one-way action and she's afraid of typos or sending the wrong thing.
5. **Versioning.** When a regulatory document is updated, she has no clean way to replace the old one without breaking links.

### Behaviors
- Spends roughly **40% of her week in the back-office** during normal periods, spiking during events or regulatory news.
- **Cross-references multiple sources** before publishing — works with the FFIE president's office, technical commission, external press.
- **Prints things.** A real workflow detail — she'll print a draft, mark it up in pen, retype corrections. The back-office should support a clean "preview" view that prints well.

### A day in her life
09:30 — Drafts a news article in Word about a new RE 2020 amendment. Pastes into back-office, attaches the official PDF, sets category "Réglementation", schedules for 11:00 publication. Previews on a mobile mockup (back-office should show this). Hits publish at 11:00.
14:00 — Uploads three updated technical sheets to the doc library. Marks the old versions as deprecated rather than deleting them. Sets a member-only access flag. Verifies the download counter starts.
16:00 — Sends a push notification announcing the new amendment. **Double-confirmation required, with preview of exactly what users will see.**
17:30 — Pulls last week's analytics — top-read articles, most-downloaded docs, push open rate — for the Friday team meeting.

### Ability and situational dimensions
- **Vision:** Wears bifocals. **Body type sizing in the back-office matters.** No 11px gray-on-white labels.
- **Motor:** Mouse + keyboard primary. **Keyboard shortcuts** for publish, schedule, preview are a productivity multiplier.
- **Cognitive:** Risk-averse. **Destructive actions need confirmation + undo windows** (especially: send push, delete doc, deprecate news item).
- **Auditory:** No impairment. Office environment.
- **Trust:** Burned by previous vendors. Will not adopt a tool that hides errors. **Surface every failure clearly with a fix.**

### Design implications
1. **Two-step send for push notifications** with full preview (title, body, what users will see on iOS + Android lock screens).
2. **Undo window of 60s** for "publish news item" — common publishing pattern, removes panic.
3. **Status badges everywhere:** draft / scheduled / published / archived / deprecated. No ambiguity.
4. **Per-document analytics inline** — download count visible next to the document name in the library list. This is in FFIE-BO-04 as a requirement; design it as a first-class element, not a buried stat.
5. **Built-in mobile preview** in the back-office. She must not have to install the app to see what a news item looks like in production.
6. **Keyboard shortcuts**: Cmd/Ctrl+S save draft, Cmd/Ctrl+Enter publish, Cmd/Ctrl+P preview.
7. **Print-friendly preview view** (one detail that builds enormous trust with this specific user).
8. **Activity log** — who published what, when. For accountability and her own audit trail.

---

## Research gaps to close before Stage 3

These personas are composites grounded in the PRD and reasonable inference about the French electrical-integration trade context. Before locking design decisions in Stage 3, FFIE should validate:

1. **The Julien composite.** Field interviews with 4–6 actual FFIE members across company sizes (solo, 5-person, 15-person, 30+). Especially: do they actually search docs on worksites, or only at the office?
2. **The Karim assumption.** Talk to 3–4 non-member electricians who have considered joining and decided against. What stopped them?
3. **Léa's representativeness.** The Bac Pro MELEC student archetype is only one slice of "general public". Confirm with FFIE who the trades section is *really* meant to reach — students? Career-changers? Parents researching for their kids?
4. **Sylvie's actual workflow.** Shadow the real FFIE communications lead for a half-day. The back-office requirements depend entirely on this.

---

## Next step

These personas now feed:
- **Journey maps** — start with Julien's "find a document on a worksite" journey, then his "stay informed" journey.
- **Information architecture** — the home screen must serve all four personas without a profile-selection step (per FFIE-AUTH-05).
- **Design principles** — the next skill (`ux-strategy--design-principles`) will codify the non-negotiables that fall out of these personas, especially the access and situational ones.
