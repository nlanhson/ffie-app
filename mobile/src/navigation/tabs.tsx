// Tab configuration tables.
//
// Bottom-bar order (both roles): Home · News · Docs · Partners · Trades.
// ("Docs" is the bottom-bar label for the `library` key — the screen itself is
// still the Library, DocLibraryScreen; only the tab label was shortened.)
//
// Member tabs (Member — Julien):
//   Home     · the landing surface — first tab, opens here on launch
//   News     · sector + federation news
//   Docs     · load-bearing — daily worksite lookups (Library, key "library")
//   Partners · the federation's partner directory (PartnersScreen). The
//              "Mission & values" / "Organisation" segments are hidden in
//              Phase 1 — see SHOW_FEDERATION_SEGMENTS in PartnersScreen.tsx.
//   Trades   · careers, training, external resources (Trades)
//
// Guest tabs (Non-member company + General public):
//   Home · News · Docs · Partners · Trades
//
// Home / News / Library / Partners / Trades are shared across both roles. Two
// things live OUTSIDE the bottom bar as top-right floating avatars
// (AdhererButton):
//   - Guests:  "Join" → federation directory (BecomeMemberScreen) modal.
//   - Members: Profile → the account/settings page (the "profile" tab key is
//     kept so the avatar can route to it; it just has no bottom-bar entry).
//
// Note: the "partners" tab key routes to PartnersScreen; its label reads
// "Partners", matching the screen's large title and its single visible
// segment now that the federation segments are hidden.

import type { ComponentType } from "react";
import { BookOpen, Compass, Home, Newspaper, Handshake } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import type { Access } from "@/auth/roleContext";

export type MemberTabKey = "home" | "library" | "news" | "partners" | "discover" | "profile";
export type GuestTabKey = "home" | "discover" | "news" | "partners" | "library";

export type TabKey = MemberTabKey | GuestTabKey;

export type TabConfig<K extends TabKey = TabKey> = {
  key: K;
  label: string;
  icon: LucideIcon;
  access: Access;
};

export const MEMBER_TABS: ReadonlyArray<TabConfig<MemberTabKey>> = [
  { key: "home", label: "Home", icon: Home, access: "public" },
  { key: "news", label: "News", icon: Newspaper, access: "public" },
  { key: "library", label: "Docs", icon: BookOpen, access: "member-only" },
  { key: "partners", label: "Partners", icon: Handshake, access: "public" },
  // "discover" tab — labelled "Tools" (the Trades segment is temporarily
  // removed; it now surfaces Videos + Calculators only). See DiscoverScreen.
  { key: "discover", label: "Tools", icon: Compass, access: "public" },
  // Profile is intentionally NOT a bottom-tab — it's reached via the top-right
  // avatar (the "profile" key still exists for that route).
];

export const GUEST_TABS: ReadonlyArray<TabConfig<GuestTabKey>> = [
  { key: "home", label: "Home", icon: Home, access: "public" },
  { key: "news", label: "News", icon: Newspaper, access: "public" },
  // Library + Trades are now part of the guest experience too. Library is
  // marked public here because the guest shell hosts it directly (no
  // RequireRole gate) — non-members browse the same directory.
  { key: "library", label: "Docs", icon: BookOpen, access: "public" },
  { key: "partners", label: "Partners", icon: Handshake, access: "public" },
  { key: "discover", label: "Tools", icon: Compass, access: "public" },
];

// Avoid re-typing in renderers that don't care which role's nav they show.
export type AnyTabConfig = TabConfig<MemberTabKey> | TabConfig<GuestTabKey>;

// Re-exporting LucideIcon so consumers don't need a second import.
export type { ComponentType, LucideIcon };
