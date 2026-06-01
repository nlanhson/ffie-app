// Tab configuration tables.
//
// Member tabs (Adhérent — Julien):
//   Library  · load-bearing — daily worksite lookups
//   News     · sector + federation news
//   Partners · Qualifelec / Consuel / OPPBTP
//   Profile  · account, settings, biometric, sign out
//
// Guest tabs (Entreprise non adhérente + Grand public) — defined as a
// placeholder for the next iteration so the tab table contract is total
// across the role taxonomy. Wire when the guest nav lands.

import type { ComponentType } from "react";
import { BookOpen, Compass, Newspaper, UserCircle2, UserPlus, Handshake } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import type { Access } from "@/auth/roleContext";

export type MemberTabKey = "library" | "news" | "partners" | "profile";
export type GuestTabKey = "discover" | "news" | "partners" | "become-member";

export type TabKey = MemberTabKey | GuestTabKey;

export type TabConfig<K extends TabKey = TabKey> = {
  key: K;
  label: string;
  icon: LucideIcon;
  access: Access;
};

export const MEMBER_TABS: ReadonlyArray<TabConfig<MemberTabKey>> = [
  { key: "news", label: "Actualités", icon: Newspaper, access: "public" },
  { key: "partners", label: "Partenaires", icon: Handshake, access: "public" },
  { key: "library", label: "Bibliothèque", icon: BookOpen, access: "member-only" },
  { key: "profile", label: "Profil", icon: UserCircle2, access: "member-only" },
];

export const GUEST_TABS: ReadonlyArray<TabConfig<GuestTabKey>> = [
  { key: "news", label: "Actualités", icon: Newspaper, access: "public" },
  { key: "partners", label: "Partenaires", icon: Handshake, access: "public" },
  { key: "discover", label: "Métiers", icon: Compass, access: "public" },
  { key: "become-member", label: "Adhérer", icon: UserPlus, access: "public" },
];

// Avoid re-typing in renderers that don't care which role's nav they show.
export type AnyTabConfig = TabConfig<MemberTabKey> | TabConfig<GuestTabKey>;

// Re-exporting LucideIcon so consumers don't need a second import.
export type { ComponentType, LucideIcon };
