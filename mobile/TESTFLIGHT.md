# FFIE — TestFlight Beta Notes

**App:** FFIE (iOS) · **Version:** 1.0.0 · **Language:** French (UI is in French)

This is an early v1 beta. There is **no real account system yet** — sign-in is
simulated so you can explore the app without credentials. Nothing you enter is
sent anywhere.

---

## Getting in

At the welcome screen you choose one of two paths:

1. **Adhérer (Member)** — on the sign-in screen enter **any email/identifier**
   and **any password**, then tap **Connect**. Or tap **SSO federation
   connection**, **pick your federation** (map or list) + **Continue**, then
   **Continue to sign in** (simulated secure redirect — no password is collected
   in-app). Either way you'll land in the **member** experience.
   Tabs: *Actualités · Partenaires · Bibliothèque · Profil*
2. **Découvrir (Public visitor)** — no sign-in. You'll land in the **public**
   experience.
   Tabs: *Actualités · Partenaires · Métiers · Adhérer*

> **To try the other experience:** delete the app and reinstall, then pick the
> other path. (In-app role switching is intentionally disabled in this build.)

A Face ID / Touch ID prompt may appear during the member path — it's optional,
you can skip it.

---

## What to test

- **Onboarding** — both paths (member + public); the login screen (Connect +
  the SSO federation picker, with search); skipping Face ID.
- **Actualités (News)** — browse the news list and open items.
- **Partenaires (Partners)** — browse partners.
- **Bibliothèque (Library, members only)** — open the document library.
- **Profil (members only)** — review the profile screen.
- **Métiers / Discover (public)** — explore the sector/industry content.
- **Adhérer / Become a Member (public)** — the membership info screen, including
  the **map** of federations (tap markers / callouts).
- **General** — navigation between tabs, scrolling, light/dark appearance
  (change iOS appearance in Control Center), and behaviour with **Reduce Motion**
  turned on (Settings → Accessibility → Motion) — animations should be gentle.

---

## Known & intentional (not bugs)

- **"Details coming" / placeholder content.** Where FFIE has not yet provided
  real data (some federation contacts, document counts, dues), the app shows an
  explicit placeholder instead of inventing details. This is deliberate.
- **The map.** On iPhone the map uses **Apple Maps** and works out of the box.
  (Android would need a Google Maps key — not relevant to this iOS build.)
- **No persistence of login.** Because auth is simulated, reinstalling resets you
  to onboarding.

## How to report a problem

Use the **TestFlight → Send Feedback** option (or a screenshot via the share
sheet) and note: which path you chose (member/public), which screen, and what you
expected vs. what happened.
