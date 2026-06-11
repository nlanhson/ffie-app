// AgendaModalScreen — the full-screen "Agenda" events window, opened as a
// slide-up modal from the Home "Agenda" quick-access card (both roles).
//
// It surfaces the same events content as the News tab's "Events" segment
// (EventsView: week calendar + event list), but as a dedicated full-screen
// surface with its own large title and a close button — a faster path to the
// agenda than tab → segment.
//
// Sub-navigation is a tiny internal state machine rather than a nested
// NavigationContainer: tapping an event swaps in EventDetailScreen; a guest
// tapping a member-only event swaps in the membership upsell (MemberOnlyPrompt).
// Both transitions are instant cuts (the modal's own slide covers the entrance),
// so there is no decorative motion to gate for reduced-motion (P5).
//
// Locked handling differs by role: members never hit the locked path; for guests
// the upsell CTAs (onApply / onSignIn) are handed back to the shell, which closes
// THIS modal first and then opens the join / sign-in funnel (the staggered
// dismiss pattern used elsewhere, so two full-screen modals never fight on iOS).

import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { themes, type ThemeName } from "@tokens";
import { LargeTitleHeader, useGroupedColors } from "@/components/ui/ios";
import { EventsView } from "./EventsView";
import { EventDetailScreen } from "./EventDetailScreen";
import { MemberOnlyPrompt } from "./MemberOnlyPrompt";

type AgendaView =
  | { type: "list" }
  | { type: "detail"; id: number }
  | { type: "locked"; id: number };

export function AgendaModalScreen({
  themeName = "light",
  onClose,
  onApply,
  onSignIn,
}: {
  themeName?: ThemeName;
  /** Dismiss the whole agenda modal. */
  onClose: () => void;
  /** Guest only: a member-only event's "request membership" CTA. */
  onApply?: () => void;
  /** Guest only: a member-only event's "I already have an account" CTA. */
  onSignIn?: () => void;
}) {
  const [view, setView] = useState<AgendaView>({ type: "list" });
  // Called unconditionally (hooks rule) — only read on the list view.
  const c = useGroupedColors(themeName);

  if (view.type === "detail") {
    return (
      <EventDetailScreen
        id={view.id}
        themeName={themeName}
        onBack={() => setView({ type: "list" })}
      />
    );
  }

  if (view.type === "locked") {
    // Guest upsell for a member-only event. Back returns to the list; the CTAs
    // hand off to the shell (which closes this modal, then opens the funnel).
    return (
      <MemberOnlyPrompt
        themeName={themeName}
        onBack={() => setView({ type: "list" })}
        onApply={onApply}
        onSignIn={onSignIn}
      />
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <LargeTitleHeader
          title="Agenda"
          themeName={themeName}
          trailing={<CloseButton themeName={themeName} onPress={onClose} />}
        />
        <EventsView
          themeName={themeName}
          onOpenEvent={(id) => setView({ type: "detail", id })}
          onOpenLocked={(id) => setView({ type: "locked", id })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// iOS-style modal close: a grey filled disc with an X, sitting in the large
// title's trailing slot. hitSlop lifts the 30pt disc to a ≥44pt target.
function CloseButton({
  themeName,
  onPress,
}: {
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Close"
      accessibilityHint="Closes the agenda"
      style={({ pressed }) => ({
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: t.border.default,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <X size={18} color={t.text.muted} strokeWidth={2.5} />
    </Pressable>
  );
}
