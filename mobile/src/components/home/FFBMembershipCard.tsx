// FFBMembershipCard — the institutional "member of the FFB" card that closes
// the Home "Public space" section. The FFIE is a member of the Fédération
// Française du Bâtiment (FFB); this surfaces that affiliation and links out to
// the FFB site (opened by the parent, via the in-app browser).
//
// Full-width white card: the FFB logo in a framed tile, the affiliation line,
// and a muted descriptor. A faint external-link glyph signals it opens the
// FFB website rather than an in-app screen.

import React from "react";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import { ExternalLink } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { FFBLogo } from "@/components/ui/FFBLogo";
import { CARD_SHADOW, useHomeColors } from "./homeColors";

export function FFBMembershipCard({
  themeName = "light",
  onPress,
}: {
  themeName?: ThemeName;
  onPress?: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);

  return (
    <View style={{ paddingHorizontal: GUTTER }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="The FFIE is a member of the FFB, French Building Federation"
        accessibilityHint="Opens the FFB website"
        style={({ pressed }): ViewStyle => ({
          flexDirection: "row",
          alignItems: "center",
          columnGap: 14,
          backgroundColor: c.cardBg,
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          paddingVertical: 14,
          paddingHorizontal: 16,
          opacity: pressed ? 0.85 : 1,
          ...(CARD_SHADOW as ViewStyle),
        })}
      >
        {/* The FFB mark renders directly — the logo asset carries its own white
            field, so on the white card it reads as the logo with no framing box
            (a hairline tile here would create a card-within-card seam). */}
        <FFBLogo size={36} />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              color: t.text.body,
              fontSize: 14.5,
              lineHeight: 19,
              fontFamily: ralewayFamily("600"),
              fontWeight: "600",
              letterSpacing: -0.1,
            }}
          >
            The FFIE is a member of the FFB
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: t.text.muted,
              fontSize: 12.5,
              fontFamily: ralewayFamily("400"),
              marginTop: 2,
            }}
          >
            French Building Federation
          </Text>
        </View>

        {/* External-link affordance — full strength (no dimming) so it reads
            clearly as "opens the FFB site" rather than a faint decoration. */}
        <ExternalLink size={18} color={t.text.muted} strokeWidth={2.25} />
      </Pressable>
    </View>
  );
}
