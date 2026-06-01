// Profile tab — member account & settings, styled to iOS HIG (grouped inset
// lists, large title) via the shared iOS primitives (components/ui/ios).
//
// Settings rows we already know we need:
//   - Account / company info
//   - Notifications
//   - Offline cache management (FULL for member, per access matrix)
//   - Biometric on/off (moved from onboarding to settings)
//   - Sign out (its own group, destructive, iOS-style)
//
// Rows are tappable but actions are stubs. Sign out drops role to guest in v1.

import React from "react";
import {
  BellRing,
  Database,
  Fingerprint,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { useRole } from "@/auth/roleContext";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import {
  GUTTER,
  InsetGroup,
  InsetRow,
  LargeTitleHeader,
  useGroupedColors,
} from "@/components/ui/ios";

export function ProfileScreen({
  themeName = "light",
  onRowPress,
}: {
  themeName?: ThemeName;
  onRowPress?: (rowKey: string) => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);
  const { role, setRole } = useRole();

  const handlePress = (rowKey: string) => {
    if (rowKey === "signout") {
      // v1 mock: drop role back to guest. Real flow clears the session.
      setRole("guest-public");
      return;
    }
    onRowPress?.(rowKey);
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <LargeTitleHeader title="Profil" themeName={themeName} />

        {/* Account card — avatar + identity, iOS profile-header style */}
        <View
          style={{
            marginHorizontal: GUTTER,
            marginBottom: 28,
            backgroundColor: c.cardBg,
            borderRadius: primitives.radii.lg,
            borderWidth: c.cardBorder ? 1 : 0,
            borderColor: c.cardBorder,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 14,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: t.brand.institutional,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: t.text.inverse, fontSize: 22, fontFamily: displayFamily("700"), fontWeight: "700" }}>
              JM
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.text.body, fontSize: 18, fontFamily: ralewayFamily("700"), fontWeight: "700", letterSpacing: -0.2 }}>
              Julien Marchand
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 5, marginTop: 3 }}>
              <ShieldCheck size={13} color={t.feedback.success} />
              <Text style={{ color: t.text.muted, fontSize: 13 }}>
                Adhérent FFIE · {role === "admin" ? "Admin" : "Adhérent"}
              </Text>
            </View>
          </View>
        </View>

        {/* Account group */}
        <InsetGroup header="Compte" themeName={themeName}>
          <InsetRow
            icon={User}
            iconBg="#5B6577"
            title="Compte & informations entreprise"
            themeName={themeName}
            onPress={() => handlePress("account")}
          />
          <InsetRow
            icon={BellRing}
            iconBg={t.feedback.danger}
            title="Notifications"
            themeName={themeName}
            isLast
            onPress={() => handlePress("notifications")}
          />
        </InsetGroup>

        {/* Preferences group */}
        <InsetGroup
          header="Préférences"
          footer="Le cache hors-ligne complet est inclus avec l'adhésion FFIE."
          themeName={themeName}
        >
          <InsetRow
            icon={Database}
            iconBg={t.brand.accent}
            title="Cache hors-ligne"
            value="Complet"
            themeName={themeName}
            onPress={() => handlePress("offline")}
          />
          <InsetRow
            icon={Fingerprint}
            iconBg={t.brand.institutional}
            title="Connexion biométrique"
            subtitle="Face ID / Touch ID"
            themeName={themeName}
            isLast
            onPress={() => handlePress("biometric")}
          />
        </InsetGroup>

        {/* Sign out — own group, destructive, centered iOS-style */}
        <InsetGroup themeName={themeName}>
          <InsetRow
            icon={LogOut}
            iconBg={t.feedback.danger}
            title="Se déconnecter"
            themeName={themeName}
            isLast
            destructive
            showChevron={false}
            onPress={() => handlePress("signout")}
          />
        </InsetGroup>

        <Text style={{ textAlign: "center", fontSize: 12, color: t.text.muted, opacity: 0.7 }}>
          FFIE mobile v0.7 · aperçu design
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
