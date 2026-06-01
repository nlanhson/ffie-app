// RemoteImage — a remote photo over a tinted placeholder block.
//
// Used for news thumbnails / article heroes (and reusable for Discover video
// stills). It requests a seeded picsum.photos image so each item gets a
// stable-but-distinct photo, and paints a tinted surface behind it so the
// loading state — and the offline / failed-fetch state — reads as a clean
// placeholder rather than a broken image. These are PLACEHOLDER visuals;
// production swaps `seed`-based URLs for real FFIE CMS image URLs.
//
// Pass `showPlay` to overlay a play affordance (video thumbnails).

import React, { useState } from "react";
import { Image, View, type DimensionValue, type ImageSourcePropType } from "react-native";
import { Play } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";

export function RemoteImage({
  // A bundled local asset (`require("../../assets/x.jpg")`). Highest priority —
  // when set it's used directly and never falls back. Use for real FFIE assets
  // that ship with the app rather than load over the network.
  source,
  seed,
  // Real image URL (e.g. an FFIE CMS image). When set it's used directly;
  // otherwise we fall back to a seeded picsum placeholder.
  uri,
  // Pixel size requested from the source. Display size is controlled by
  // width/height/aspectRatio; cover scaling handles the difference.
  pixelWidth = 800,
  pixelHeight = 450,
  width = "100%",
  height,
  aspectRatio,
  radius = 0,
  themeName = "light",
  showPlay = false,
  accessibilityLabel,
}: {
  source?: ImageSourcePropType;
  seed?: string;
  uri?: string;
  pixelWidth?: number;
  pixelHeight?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  aspectRatio?: number;
  radius?: number;
  themeName?: ThemeName;
  showPlay?: boolean;
  accessibilityLabel?: string;
}) {
  const t = themes[themeName];
  const [failed, setFailed] = useState(false);
  // A local `source` wins; otherwise resolve a remote URI (explicit or seeded).
  const remoteUri =
    uri ??
    (seed
      ? `https://picsum.photos/seed/${encodeURIComponent(seed)}/${pixelWidth}/${pixelHeight}`
      : undefined);
  const resolvedSource = source ?? (remoteUri ? { uri: remoteUri } : undefined);

  return (
    <View
      style={{
        width,
        height,
        aspectRatio,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!failed && resolvedSource ? (
        <Image
          source={resolvedSource}
          onError={() => setFailed(true)}
          resizeMode="cover"
          accessible={!!accessibilityLabel}
          accessibilityRole="image"
          accessibilityLabel={accessibilityLabel}
          style={{ width: "100%", height: "100%" }}
        />
      ) : null}

      {showPlay ? (
        <View
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(0,0,0,0.45)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={22} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      ) : null}
    </View>
  );
}

// Keep radii reachable to callers that want to match the design system.
export const IMAGE_RADIUS = primitives.radii.lg;
