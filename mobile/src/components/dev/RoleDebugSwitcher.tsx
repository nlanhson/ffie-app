// RoleDebugSwitcher — preview-only chips that cycle the current Role and
// reset logged session data.
//
// Floats above the whole app (rendered last in AppRoot, absolutely
// positioned) so the client preview can flip between Julien (member),
// Karim (guest-company), Léa (guest-public) without re-running onboarding.
// Triggers RequireRole guards in real-time — cycle to "guest-public" while
// looking at the Library and the MemberOnlyPrompt slides in.
//
// Draggable: the cluster starts docked top-right but can be dragged anywhere
// so it never sits on top of whatever you're previewing. Taps still land on
// the individual chips — the container only claims the gesture once the
// finger moves past a small threshold (onStartShouldSetPanResponder stays
// false; onMoveShouldSetPanResponder fires on drag). Built on RN-core
// PanResponder + Animated, so no gesture-handler/reanimated dependency.
//
// Gated behind ENABLE_ROLE_DEBUG in App.tsx. NOT for production builds.

import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bug } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { useRole, type Role } from "@/auth/roleContext";
import { ralewayFamily } from "@/theme/fonts";

// Cycle order chosen for client preview narrative — start in the public
// guest state, then member (the killer use case). guest-company is omitted
// from the cycle because it's behaviourally identical to guest-public today
// (canAccess treats both as public-only); it stays in the Role type for the
// planned non-member conversion surface. Admin is also excluded: it's a
// web-only back-office role that never appears on a mobile session.
const CYCLE: Role[] = ["guest-public", "member"];

const LABEL: Record<Role, string> = {
  "guest-public": "Grand public",
  "guest-company": "Entreprise non adhérente",
  member: "Adhérent",
  admin: "Admin (web-only)",
};

// Edge inset kept between the cluster and the screen bounds when docking/clamping.
// Sets the default top-right dock gap (≈16px right padding) and the drag bounds.
const MARGIN = 16;
// Movement (in pt) past which a gesture becomes a drag rather than a chip tap.
const DRAG_THRESHOLD = 6;
// Gap below the safe-area top edge before the docked cluster. Android's status
// inset sits tighter, so give it a touch more breathing room than iOS.
const TOP_GAP = Platform.OS === "android" ? 24 : 4;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function RoleDebugSwitcher({ themeName = "light" }: { themeName?: ThemeName }) {
  const { role, setRole } = useRole();
  const t = themes[themeName];
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = useWindowDimensions();

  const next = () => {
    const i = CYCLE.indexOf(role);
    const nextRole = CYCLE[(i + 1) % CYCLE.length] ?? CYCLE[0];
    setRole(nextRole);
  };

  // --- Drag plumbing ---------------------------------------------------------
  // Layout values live in refs so the long-lived PanResponder reads current
  // screen size / inset on release (e.g. after an orientation change).
  const winW = useRef(screenW);
  const winH = useRef(screenH);
  const topInset = useRef(insets.top + 4);
  winW.current = screenW;
  winH.current = screenH;
  topInset.current = insets.top + TOP_GAP;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const posRef = useRef({ x: 0, y: 0 }); // committed (post-release) position
  const sizeRef = useRef({ w: 0, h: 0 });
  const placedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      // Let taps fall through to the chips; only claim the gesture on drag.
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > DRAG_THRESHOLD || Math.abs(g.dy) > DRAG_THRESHOLD,
      onPanResponderGrant: () => {
        setDragging(true);
        pan.setOffset(posRef.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        setDragging(false);
        pan.flattenOffset();
        // Clamp the dropped position back inside the safe area.
        const maxX = winW.current - sizeRef.current.w - MARGIN;
        const maxY = winH.current - sizeRef.current.h - MARGIN;
        const x = clamp(posRef.current.x + g.dx, MARGIN, Math.max(MARGIN, maxX));
        const y = clamp(
          posRef.current.y + g.dy,
          topInset.current,
          Math.max(topInset.current, maxY)
        );
        posRef.current = { x, y };
        Animated.spring(pan, {
          toValue: { x, y },
          useNativeDriver: false,
          friction: 8,
          tension: 90,
        }).start();
      },
      onPanResponderTerminate: () => setDragging(false),
    })
  ).current;

  return (
    <View style={styles.host} pointerEvents="box-none">
      <Animated.View
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          sizeRef.current = { w: width, h: height };
          // First measured frame: dock to the top-right safe area.
          if (!placedRef.current && width > 0) {
            const x = screenW - width - MARGIN;
            const y = insets.top + TOP_GAP;
            posRef.current = { x, y };
            pan.setValue({ x, y });
            placedRef.current = true;
            setReady(true);
          }
        }}
        {...panResponder.panHandlers}
        style={[
          styles.cluster,
          {
            opacity: ready ? 1 : 0,
            transform: pan.getTranslateTransform(),
            shadowOpacity: dragging ? 0.28 : 0.15,
            shadowRadius: dragging ? 12 : 6,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Debug : changer de rôle. Actuel : ${LABEL[role]}. Glisser pour déplacer.`}
          onPress={next}
          style={({ pressed }) => [
            styles.chip,
            styles.roleChip,
            {
              backgroundColor: pressed ? t.action.primary.bgPressed : t.action.primary.bg,
              borderColor: t.action.primary.bg,
            },
          ]}
        >
          {/* Big, high-contrast title — "Role - Persona" */}
          <View style={styles.roleTitleRow}>
            <Bug size={13} color={t.action.primary.fg} style={{ marginTop: 2 }} />
            <Text
              numberOfLines={2}
              style={[styles.title, { color: t.action.primary.fg }]}
            >
              {LABEL[role]}
            </Text>
          </View>
          {/* Small, tinted action hint */}
          <Text style={[styles.hint, { color: t.action.primary.fg }]} numberOfLines={1}>
toucher pour changer · glisser pour déplacer
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    // Sit above app content. (Native Modals render in their own window above
    // this — inherent to RN; not something a debug chip fights.)
    zIndex: 9999,
    elevation: 9999,
  },
  cluster: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 8,
    // Shadow lives on the cluster so it lifts as a unit while dragging.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: primitives.radii.full,
    borderWidth: 1,
    maxWidth: 240,
    elevation: 3,
  },
  // Role chip uses a vertical stack: big title row over a tinted hint.
  // Hugs its content; maxWidth caps it so the long label ("Entreprise non
  // adhérente") wraps to two lines instead of running off-screen, while
  // shorter labels sit on one line.
  roleChip: {
    flexDirection: "column",
    alignItems: "flex-start",
    columnGap: 0,
    rowGap: 2,
    borderRadius: 16,
    maxWidth: 170,
  },
  roleTitleRow: {
    flexDirection: "row",
    // Top-align so the icon sits beside the first line when the title wraps.
    alignItems: "flex-start",
    columnGap: 6,
  },
  title: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: ralewayFamily("700"), fontWeight: "700",
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 10,
    opacity: 0.8,
  },
});
