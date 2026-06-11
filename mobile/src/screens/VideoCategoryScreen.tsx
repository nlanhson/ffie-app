// Lecteur de catégorie de vidéos — affiché quand une tuile du segment Vidéos de
// l'onglet Métiers est tapée. Clone une page vidéo FFIE (p. ex. « Intelligence
// artificielle ») : une barre fine retour/partage, le titre de la catégorie, puis chaque
// film sous forme d'un titre + un lecteur YouTube intégré (YouTubeEmbed) qui se lit DANS
// l'app — aucune redirection vers le site (FFIE-VIDEO-01, sous-titres activés par
// défaut).
//
// Sans état au-delà de l'appel à Share — le parent (la pile de DiscoverScreen) décide
// quelle catégorie est ouverte et gère la transition de retour.

import React from "react";
import { ChevronLeft, Share2 } from "lucide-react-native";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import type { VideoCategory } from "@/data/videos";

export function VideoCategoryScreen({
  category,
  themeName = "light",
  onBack,
}: {
  category: VideoCategory;
  themeName?: ThemeName;
  onBack: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);

  const share = async () => {
    try {
      await Share.share({ title: category.title, message: `${category.title}\n\nvia FFIE` });
    } catch {
      // L'utilisateur a fermé la feuille de partage — aucune action.
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Barre de nav fine : retour + partage (à l'image des lecteurs Actualités / cours). */}
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
          accessibilityLabel="Retour aux vidéos"
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
          <Text style={{ color: t.brand.accent, fontSize: 16 }}>Vidéos</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Partager cette vidéo"
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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Titre de la catégorie. */}
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 4, paddingBottom: 18 }}>
          <Text
            accessibilityRole="header"
            style={{
              color: t.text.body,
              fontSize: 28,
              lineHeight: 34,
              fontFamily: displayFamily("700"),
              fontWeight: "700",
              letterSpacing: -0.5,
            }}
          >
            {category.title}
          </Text>
        </View>

        {/* Un titre + un lecteur intégré par film. */}
        <View style={{ paddingHorizontal: GUTTER, rowGap: 28 }}>
          {category.videos.map((video) => (
            <View key={video.youtubeId} style={{ rowGap: 12 }}>
              {video.title && video.title !== category.title ? (
                <Text
                  style={{
                    color: t.text.body,
                    fontSize: 18,
                    lineHeight: 24,
                    fontFamily: ralewayFamily("700"),
                    fontWeight: "700",
                    letterSpacing: -0.2,
                  }}
                >
                  {video.title}
                </Text>
              ) : null}
              <YouTubeEmbed
                youtubeId={video.youtubeId}
                accessibilityLabel={`Vidéo : ${video.title ?? category.title}`}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
