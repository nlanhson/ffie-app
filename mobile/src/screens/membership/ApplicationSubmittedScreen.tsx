// Application received — the pending-state confirmation.
//
// Shown right after a successful submit, and again if the user reopens the
// Join flow while an application is pending (the flow seeds straight to here).
// Per the lead-capture model there is no instant access: this screen confirms
// receipt, gives a reference to quote, and sets expectations for the
// out-of-band FFIE review. No payment, no account yet — just "we have it".

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Clock, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { Button } from "@/components/ui/Button";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import type { MembershipApplication } from "@/auth/membershipContext";

const STEPS = [
  "FFIE reviews your application — usually within a few business days.",
  "We confirm your annual dues based on the size of your company.",
  "You receive an email to activate your member account.",
];

export function ApplicationSubmittedScreen({
  themeName = "light",
  application,
  onDone,
}: {
  themeName?: ThemeName;
  application: MembershipApplication;
  onDone: () => void;
}) {
  const t = themes[themeName];

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 0.12 }} />

        {/* Hero — clock, not a checkmark: the state is "pending", not "done". */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: 2,
              borderColor: t.brand.accent,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Clock size={32} color={t.brand.accent} />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              color: t.text.body,
              textAlign: "center",
              letterSpacing: -0.4,
              lineHeight: 30,
            }}
          >
            Application submitted
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: t.text.muted,
              textAlign: "center",
              lineHeight: 22,
              marginTop: 12,
              maxWidth: 320,
            }}
          >
            Your application is awaiting review by FFIE. There's nothing else you need to do for now.
          </Text>
        </View>

        {/* Reference card */}
        <View
          style={{
            marginTop: 28,
            padding: 16,
            borderRadius: primitives.radii.md,
            backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
            borderWidth: 1,
            borderColor: t.border.subtle,
          }}
        >
          <DetailRow label="Reference" value={application.reference} themeName={themeName} />
          <View style={{ height: 1, backgroundColor: t.border.subtle, marginVertical: 12 }} />
          <DetailRow label="Submitted on" value={application.submittedAt} themeName={themeName} />
          <View style={{ height: 1, backgroundColor: t.border.subtle, marginVertical: 12 }} />
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
            <Mail size={16} color={t.text.muted} />
            <Text style={{ flex: 1, fontSize: 13, color: t.text.muted, lineHeight: 18 }}>
              We'll send updates to {application.email}
            </Text>
          </View>
        </View>

        {/* What happens next */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
            color: t.text.muted,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginTop: 28,
            marginBottom: 14,
          }}
        >
          What's next
        </Text>
        <View style={{ rowGap: 14 }}>
          {STEPS.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 12 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: t.brand.institutional,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Text
                  style={{
                    color: t.text.inverse,
                    fontSize: 12,
                    fontFamily: ralewayFamily("700"),
                    fontWeight: "700",
                  }}
                >
                  {i + 1}
                </Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: t.text.body, lineHeight: 20 }}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, minHeight: 24 }} />

        <Button
          themeName={themeName}
          size="lg"
          fullWidth
          onPress={onDone}
          accessibilityLabel="Done"
        >
          Done
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  themeName,
}: {
  label: string;
  value: string;
  themeName: ThemeName;
}) {
  const t = themes[themeName];
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontSize: 13, color: t.text.muted }}>{label}</Text>
      <Text
        style={{
          fontSize: 14,
          color: t.text.body,
          fontFamily: ralewayFamily("600"),
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
