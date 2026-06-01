// RequireRole — declarative access guard.
//
// Wrap any screen or sub-tree that must be gated:
//
//   <RequireRole access="member-only">
//     <DocLibraryScreen ... />
//   </RequireRole>
//
// If the current role passes canAccess, children render. Otherwise the
// guard substitutes a redirect surface — for "member-only" that's the
// MemberOnlyPrompt upsell (Become-a-member CTA). For "admin-only" on a
// mobile build it's a "back-office is web only" notice (we shouldn't
// reach this in practice, but the guard is total).
//
// Why this exists in v1 even with mock auth: the swap-in cost when real
// auth lands is zero — only roleContext.tsx changes. Every guarded screen
// already works.

import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { canAccess, useRole, type Access } from "@/auth/roleContext";
import { MemberOnlyPrompt } from "@/screens/MemberOnlyPrompt";
import { ralewayFamily } from "@/theme/fonts";

export function RequireRole({
  access,
  children,
  fallback,
  themeName = "light",
  onApply,
  onSignIn,
}: {
  access: Access;
  children: React.ReactNode;
  /** Override the default fallback (member-only → upsell, admin-only → web notice). */
  fallback?: React.ReactNode;
  themeName?: ThemeName;
  /** Forwarded to MemberOnlyPrompt when the default fallback is used. */
  onApply?: () => void;
  onSignIn?: () => void;
}) {
  const { role } = useRole();

  if (canAccess(role, access)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  if (access === "member-only") {
    return <MemberOnlyPrompt themeName={themeName} onApply={onApply} onSignIn={onSignIn} />;
  }

  // access === "admin-only" — should not happen on mobile.
  return <AdminWebOnlyNotice themeName={themeName} />;
}

function AdminWebOnlyNotice({ themeName }: { themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <Text style={{ fontSize: 18, fontFamily: ralewayFamily("700"), fontWeight: "700", color: t.text.body, textAlign: "center", letterSpacing: -0.2 }}>
          Admin tools live in the web back-office
        </Text>
        <Text style={{ fontSize: 14, color: t.text.muted, textAlign: "center", marginTop: 8, maxWidth: 320, lineHeight: 20 }}>
          The mobile app does not surface admin features. Open the FFIE back-office on desktop to manage content.
        </Text>
      </View>
    </SafeAreaView>
  );
}
