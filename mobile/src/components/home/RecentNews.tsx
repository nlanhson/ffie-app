// RecentNews — the horizontal "Recent news" carousel that closes the Home hub.
//
// A peek-scrolling rail of the newest articles (ARTICLES is pre-sorted newest
// first in data/news). Each card shows the article image, a category eyebrow,
// the title, and read time. Tapping a card hands the article up to the parent,
// which routes to the News tab (a full reader lands when detail nav is wired).
//
// The rail bleeds past the page gutter on the right (cards scroll off-edge),
// so it manages its own horizontal padding rather than sitting inside the
// dashboard's section padding. snapToInterval gives a gentle card-by-card
// settle without any custom animation.

import React from "react";
import { Pressable, ScrollView, Text, View, type ViewStyle } from "react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { CARD_SHADOW, useHomeColors } from "./homeColors";
import { ARTICLES, type Article } from "@/data/news";

const CARD_W = 264;
const CARD_GAP = 14;
// Newest few only — the rail is a teaser; the full feed lives in the News tab.
const ITEMS = ARTICLES.slice(0, 6);

export function RecentNews({
  themeName = "light",
  onPressArticle,
}: {
  themeName?: ThemeName;
  onPressArticle?: (article: Article) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_W + CARD_GAP}
      snapToAlignment="start"
      contentContainerStyle={{
        paddingHorizontal: GUTTER,
        columnGap: CARD_GAP,
      }}
    >
      {ITEMS.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          themeName={themeName}
          onPress={() => onPressArticle?.(article)}
        />
      ))}
    </ScrollView>
  );
}

function NewsCard({
  article,
  themeName,
  onPress,
}: {
  article: Article;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);

  // Shadow on the OUTER wrapper, rounded clip (overflow: hidden, so the top
  // image honours the corners) on the inner Pressable — on a single view iOS
  // clips its own shadow when overflow is hidden.
  return (
    <View
      style={{
        width: CARD_W,
        backgroundColor: c.cardBg,
        borderRadius: primitives.radii.lg,
        ...CARD_SHADOW,
      }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={article.title}
        accessibilityHint={`${article.category}, ${article.readMinutes} minute read`}
        style={({ pressed }): ViewStyle => ({
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          overflow: "hidden",
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <RemoteImage
          seed={`ffie-news-${article.id}`}
          uri={article.imageUrl}
          width="100%"
          aspectRatio={16 / 10}
          pixelWidth={640}
          pixelHeight={400}
          themeName={themeName}
          accessibilityLabel={`Illustration for ${article.title}`}
        />
        <View style={{ padding: 14 }}>
        <Text
          style={{
            color: t.brand.accent,
            fontSize: 11,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          {article.category}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: t.text.body,
            fontSize: 14.5,
            lineHeight: 19,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
            letterSpacing: -0.2,
            minHeight: 38, // reserve two lines so card feet align
          }}
        >
          {article.title}
        </Text>
        <Text
          style={{
            color: t.text.muted,
            fontSize: 12,
            fontFamily: ralewayFamily("400"),
            marginTop: 8,
          }}
        >
          {article.date} · {article.readMinutes} min read
        </Text>
        </View>
      </Pressable>
    </View>
  );
}
