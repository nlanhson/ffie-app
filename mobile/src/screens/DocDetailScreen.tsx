// Document detail — the member-only reader for a Library document.
//
// This is where the spec'd offline + share behaviours live:
//   - FFIE-DOC-03 (member): download a document "to keep locally". Surfaced
//     here as a "Saved for offline" toggle. Public users never reach this —
//     the whole Library tab is member-gated.
//   - PERSONAS #8: "Share-to-WhatsApp / share-to-Mail must be one tap from
//     any document." → the share action in the nav bar.
//
// The actual PDF render needs a viewer (e.g. a PDF lib + a dev build), so the
// preview here is an honest placeholder, not a fake div-screenshot. "Open
// document" is a stub until that lands.

import React, { useState } from "react";
import { ChevronLeft, FileText, Share2, WifiOff } from "lucide-react-native";
import { Pressable, ScrollView, Share, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { primitives, themes, type ThemeName } from "@tokens";
import { displayFamily } from "@/theme/fonts";
import { GUTTER, InsetGroup, InsetRow, useGroupedColors } from "@/components/ui/ios";
import { SavedBadge } from "@/components/ui/SavedBadge";
import type { Doc } from "@/data/docs";

export function DocDetailScreen({
  doc,
  themeName = "light",
  onBack,
}: {
  doc: Doc;
  themeName?: ThemeName;
  onBack: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);

  // Mock offline state — seeded from the doc's saved flag. In production this
  // reflects the real local-cache state and the toggle triggers the
  // download / eviction.
  const [savedOffline, setSavedOffline] = useState(doc.saved);

  const share = async () => {
    try {
      await Share.share({ title: doc.title, message: `${doc.title}\n\nvia FFIE` });
    } catch {
      // dismissed — no-op
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Slim nav bar: back + share */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: GUTTER - 4,
          height: 44,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour à la bibliothèque"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            opacity: pressed ? 0.5 : 1,
            paddingVertical: 6,
            paddingRight: 8,
          })}
        >
          <ChevronLeft size={26} color={t.brand.accent} />
          <Text style={{ color: t.brand.accent, fontSize: 16 }}>Bibliothèque</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Partager ce document"
          onPress={share}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Share2 size={20} color={t.brand.accent} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Preview placeholder — honest stand-in for the PDF render */}
        <View style={{ paddingHorizontal: GUTTER, marginBottom: 20 }}>
          <View
            style={{
              height: 200,
              borderRadius: primitives.radii.lg,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: c.cardBorder ? 1 : 0,
              borderColor: c.cardBorder,
              alignItems: "center",
              justifyContent: "center",
              rowGap: 10,
            }}
          >
            <View
              style={{
                width: 56,
                height: 68,
                borderRadius: 8,
                backgroundColor: t.brand.institutional,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={28} color="#FFFFFF" />
            </View>
            <Text style={{ color: t.text.muted, fontSize: 12 }}>Aperçu PDF · s'ouvre dans l'application complète</Text>
          </View>
        </View>

        {/* Title + meta */}
        <View style={{ paddingHorizontal: GUTTER, marginBottom: 20 }}>
          <Text
            accessibilityRole="header"
            style={{
              color: t.text.body,
              fontSize: 24,
              lineHeight: 30,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.4,
            }}
          >
            {doc.title}
          </Text>
          <Text style={{ color: t.text.muted, fontSize: 14, marginTop: 6 }}>{doc.subtitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <SavedBadge saved={savedOffline} size="sm" themeName={themeName} />
          </View>
        </View>

        {/* Offline — the FFIE-DOC-03 control (member only) */}
        <InsetGroup
          header="Hors ligne"
          footer="Les documents enregistrés s'ouvrent sans connexion internet."
          themeName={themeName}
        >
          <InsetRow
            icon={WifiOff}
            iconBg={t.brand.accent}
            title="Enregistré hors ligne"
            subtitle={savedOffline ? "Disponible sans internet" : "Télécharger pour conserver sur cet appareil"}
            themeName={themeName}
            isLast
            showChevron={false}
            trailing={
              <Switch
                value={savedOffline}
                onValueChange={setSavedOffline}
                trackColor={{ true: t.brand.accent, false: t.border.default }}
                accessibilityLabel="Enregistrer ce document pour un accès hors ligne"
              />
            }
          />
        </InsetGroup>

        {/* Actions */}
        <InsetGroup themeName={themeName}>
          <InsetRow
            icon={FileText}
            iconBg={t.brand.institutional}
            title="Ouvrir le document"
            themeName={themeName}
            onPress={() => {
              // TODO: open in the PDF viewer when it lands.
            }}
          />
          <InsetRow
            icon={Share2}
            iconBg="#5B6577"
            title="Partager"
            themeName={themeName}
            isLast
            showChevron={false}
            onPress={share}
          />
        </InsetGroup>

        {/* Details */}
        <InsetGroup header="Détails" themeName={themeName}>
          <InsetRow title="Format" value="PDF" themeName={themeName} showChevron={false} />
          <InsetRow title="Catégorie" value={doc.category} themeName={themeName} isLast showChevron={false} />
        </InsetGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
