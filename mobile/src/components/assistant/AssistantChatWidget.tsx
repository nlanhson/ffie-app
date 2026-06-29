// AssistantChatWidget — la boîte de discussion flottante « Assistant IA FFIE »
// (Epic : aide IA). Un FAB de coin se déploie en un panneau de discussion aux
// couleurs de Claude : un en-tête corail, trois onglets de mode (Technique /
// Documents / Rédaction), un message d'accueil, une rangée de saisie et le pied
// d'attribution Anthropic.
//
// MAQUETTE SEULEMENT (v1). Comme SignInFlow et les parcours d'adhésion, rien ici
// ne dialogue avec un backend : les onglets basculent un état local, la saisie
// est éditable mais le bouton d'envoi ne fait rien, et le message d'accueil est
// un texte statique. Brancher ceci à un véritable endpoint Claude est
// délibérément hors périmètre jusqu'à instruction contraire.
//
// NOTE COULEUR : ce widget est volontairement EN DEHORS du design system FFIE. Il
// porte les couleurs de marque propres à Claude/Anthropic (le corail terracotta
// + le crème papier ci-dessous) parce qu'il représente un assistant tiers — la
// même raison pour laquelle les marques partenaires ne sont pas recolorées au
// marine+sarcelle de l'app. Ces valeurs hexadécimales de marque externes vivent
// dans la constante CLAUDE ici plutôt que dans tokens.ts (qui est la source de
// vérité unique pour la palette de *la FFIE*, pas celle d'Anthropic). Tout ce qui
// est structurel (rayons, mouvement, zone sûre, mouvement réduit) provient
// toujours du design system / des hooks partagés.

import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FileText,
  PenLine,
  Send,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { primitives } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Palette de marque Claude / Anthropic (externe — voir NOTE COULEUR ci-dessus).
// ---------------------------------------------------------------------------
const CLAUDE = {
  // Le « corail » terracotta de Claude, utilisé pour le dégradé de l'en-tête, le
  // FAB et le bouton d'envoi. Deux arrêts donnent à l'en-tête son éclat diagonal.
  coral: "#D97757",
  coralDeep: "#BD5D3A",
  coralPressed: "#A94E2F",
  // Le papier « ivoire » d'Anthropic — la teinte de la bulle d'assistant + du
  // canevas du panneau.
  paper: "#F4F1EA",
  paperBorder: "#E6E0D4",
  // Encre quasi noire utilisée pour la pastille d'onglet sélectionnée + le texte
  // principal.
  ink: "#1F1E1D",
  inkMuted: "#6B6862",
  // Surface du panneau.
  surface: "#FFFFFF",
  hairline: "#ECE9E2",
  onCoral: "#FFFFFF",
  onCoralMuted: "rgba(255,255,255,0.82)",
} as const;

// Onglets de mode en haut de la conversation. Maquette seulement : en
// sélectionner un ne change que la surbrillance locale (une vraie version
// piloterait le prompt système).
type ModeKey = "technical" | "docs" | "writing";
const MODES: { key: ModeKey; label: string; icon: LucideIcon }[] = [
  { key: "technical", label: "Technique", icon: Zap },
  { key: "docs", label: "Documents", icon: FileText },
  { key: "writing", label: "Rédaction", icon: PenLine },
];

// La hauteur de la barre d'onglets inférieure AU-DESSUS de la marge de zone sûre
// (BottomTabBar : 8 de padding haut + onglet ~40 — icône 23 + libellé ; le padding
// bas vaut l'inset de safe area, ajouté à part via insets.bottom — soit ≈ 48).
// Le widget est monté comme un frère pleine largeur de la barre d'onglets, donc
// ses enfants sont positionnés en coordonnées APPAREIL — on ajoute ceci + la
// marge à la main pour dégager la rangée de navigation. NB : doit rester aligné
// sur la hauteur réelle de BottomTabBar, sinon le FAB (et les boutons « retour en
// haut » qui s'empilent au-dessus) se décalent — c'est la source de vérité unique.
const TAB_BAR_HEIGHT = 48;
// Écart entre la barre d'onglets et le FAB.
export const ASSISTANT_FAB_GAP = 16;
// Diamètre du FAB. Exporté pour que les boutons « retour en haut » des écrans le
// reproduisent exactement (ils s'empilent au-dessus de ce FAB et doivent se lire
// comme le même contrôle) — source de vérité unique pour que les deux tailles ne
// puissent pas diverger.
export const ASSISTANT_FAB_SIZE = 50;

export function AssistantChatWidget() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModeKey>("technical");
  const [draft, setDraft] = useState("");

  // Entrée/sortie du panneau : fondu + une petite montée/mise à l'échelle ancrée
  // au coin du FAB. Le mouvement réduit ramène les deux à une coupure instantanée
  // (sécurité vestibulaire, P5).
  const anim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (reducedMotion) {
        anim.setValue(1);
        return;
      }
      Animated.timing(anim, {
        toValue: 1,
        duration: primitives.motion.duration.base,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      if (reducedMotion) {
        anim.setValue(0);
        setMounted(false);
        return;
      }
      Animated.timing(anim, {
        toValue: 0,
        duration: primitives.motion.duration.fast,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open, reducedMotion, anim]);

  // Annonce l'ouverture/la fermeture pour les utilisateurs de lecteur d'écran
  // (le panneau est une surface transitoire, pas un écran routé).
  const toggle = (next: boolean) => {
    setOpen(next);
    AccessibilityInfo.announceForAccessibility?.(
      next ? "Assistant FFIE ouvert" : "Assistant FFIE fermé",
    );
  };

  // Ancrage vertical (coordonnées appareil, mesurées depuis le bas de l'écran) :
  //   - le FAB se place à un écart au-dessus de la barre d'onglets.
  //   - le panneau flotte juste au-dessus du FAB pour que le lanceur de coin
  //     reste visible.
  const fabBottom = insets.bottom + TAB_BAR_HEIGHT + ASSISTANT_FAB_GAP;
  const panelBottom = fabBottom + ASSISTANT_FAB_SIZE + 10;

  // Géométrie du panneau : pleine largeur moins les marges, plafonnée pour qu'il
  // se lise comme une boîte de coin sur tablette ; hauteur plafonnée à l'espace
  // au-dessus du FAB (jamais sous la barre d'état / l'encoche).
  const panelWidth = Math.min(width - GUTTER * 2, 360);
  const panelHeight = Math.min(520, height - panelBottom - insets.top - 16);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  return (
    // Couche pleine largeur, non interactive, pour que le FAB + le panneau
    // flottent par-dessus l'onglet monté, quel qu'il soit. pointerEvents="box-none"
    // laisse les touchers traverser la zone vide jusqu'à l'écran en dessous.
    <View pointerEvents="box-none" style={{ position: "absolute", inset: 0 }}>
      {/* Panneau de discussion (monté uniquement à l'ouverture / pendant la sortie animée) */}
      {mounted ? (
        <Animated.View
          accessibilityViewIsModal
          style={{
            position: "absolute",
            right: GUTTER,
            bottom: panelBottom,
            width: panelWidth,
            height: panelHeight,
            borderRadius: 20,
            backgroundColor: CLAUDE.surface,
            overflow: "hidden",
            opacity: anim,
            transform: [{ translateY }, { scale }],
            // Carte surélevée — ombre douce et large pour se lire comme une feuille flottante.
            shadowColor: "#000",
            shadowOpacity: 0.22,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 24,
            elevation: 12,
            borderWidth: 1,
            borderColor: CLAUDE.hairline,
          }}
        >
          <Header onClose={() => toggle(false)} />
          <ModeTabs mode={mode} onSelect={setMode} />

          {/* Canevas de conversation — teinté papier, avec le message d'accueil statique. */}
          <View style={{ flex: 1, backgroundColor: CLAUDE.paper, padding: 14 }}>
            <AssistantBubble>
              Bonjour ! Je suis l'assistant IA de la FFIE. Comment puis-je vous
              aider ? (NF C 15-100, IRVE, chantier…)
            </AssistantBubble>
          </View>

          <Composer
            value={draft}
            onChangeText={setDraft}
            onSend={() => setDraft("")}
          />

          {/* Pied d'attribution — requis tant que l'assistant repose sur Claude. */}
          <View
            style={{
              paddingVertical: 8,
              alignItems: "center",
              backgroundColor: CLAUDE.surface,
              borderTopWidth: 1,
              borderTopColor: CLAUDE.hairline,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: CLAUDE.inkMuted,
                fontFamily: ralewayFamily("500"),
              }}
            >
              Claude · Anthropic — usage professionnel FFIE
            </Text>
          </View>
        </Animated.View>
      ) : null}

      {/* Le FAB de coin — bascule le panneau. Masqué (derrière le panneau)
          visuellement quand il est ouvert, mais maintenu monté pour que sa cible
          d'appui reste cohérente. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? "Fermer l'assistant FFIE" : "Ouvrir l'assistant FFIE"}
        accessibilityState={{ expanded: open }}
        onPress={() => toggle(!open)}
        style={({ pressed }) => ({
          position: "absolute",
          right: GUTTER,
          bottom: fabBottom,
          width: ASSISTANT_FAB_SIZE,
          height: ASSISTANT_FAB_SIZE,
          borderRadius: ASSISTANT_FAB_SIZE / 2,
          backgroundColor: pressed ? CLAUDE.coralPressed : CLAUDE.coral,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: CLAUDE.coralDeep,
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 10,
          elevation: 8,
        })}
      >
        {open ? (
          <X size={24} color={CLAUDE.onCoral} strokeWidth={2.4} />
        ) : (
          <Sparkles size={24} color={CLAUDE.onCoral} strokeWidth={2.2} />
        )}
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Header — barre à dégradé corail : badge étincelle, titre + attribution
// Anthropic, et l'indice de fermeture.
// ---------------------------------------------------------------------------
function Header({ onClose }: { onClose: () => void }) {
  return (
    <LinearGradient
      colors={[CLAUDE.coral, CLAUDE.coralDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 13,
        columnGap: 11,
      }}
    >
      {/* Badge étincelle dans un disque translucide. */}
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: "rgba(255,255,255,0.22)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles size={19} color={CLAUDE.onCoral} strokeWidth={2.2} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: CLAUDE.onCoral,
            fontSize: 16,
            fontFamily: displayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.2,
          }}
        >
          Assistant IA FFIE
        </Text>
        <Text
          style={{
            color: CLAUDE.onCoralMuted,
            fontSize: 11.5,
            marginTop: 1,
            fontFamily: ralewayFamily("500"),
          }}
        >
          Propulsé par Claude · Anthropic
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fermer l'assistant"
        onPress={onClose}
        hitSlop={10}
        style={({ pressed }) => ({
          width: 30,
          height: 30,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? "rgba(255,255,255,0.22)" : "transparent",
        })}
      >
        <X size={20} color={CLAUDE.onCoral} strokeWidth={2.2} />
      </Pressable>
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// ModeTabs — les trois modes de l'assistant. Sélectionné = pastille d'encre
// pleine (icône + étiquette blanches) ; non sélectionné = pastille papier avec
// un filet. L'état est exposé aux technologies d'assistance, et l'icône appuie le
// changement de couleur (jamais la couleur seule).
// ---------------------------------------------------------------------------
function ModeTabs({
  mode,
  onSelect,
}: {
  mode: ModeKey;
  onSelect: (m: ModeKey) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        columnGap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: CLAUDE.surface,
        borderBottomWidth: 1,
        borderBottomColor: CLAUDE.hairline,
      }}
    >
      {MODES.map((m) => {
        const selected = m.key === mode;
        const Icon = m.icon;
        return (
          <Pressable
            key={m.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={m.label}
            onPress={() => onSelect(m.key)}
            hitSlop={{ top: 6, bottom: 6 }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              columnGap: 5,
              height: 32,
              paddingHorizontal: 11,
              borderRadius: primitives.radii.full,
              backgroundColor: selected
                ? CLAUDE.ink
                : pressed
                  ? CLAUDE.paperBorder
                  : CLAUDE.paper,
              borderWidth: 1,
              borderColor: selected ? CLAUDE.ink : CLAUDE.paperBorder,
            })}
          >
            <Icon
              size={14}
              color={selected ? CLAUDE.onCoral : CLAUDE.inkMuted}
              strokeWidth={2.2}
            />
            <Text
              style={{
                fontSize: 12.5,
                color: selected ? CLAUDE.onCoral : CLAUDE.ink,
                fontFamily: ralewayFamily(selected ? "600" : "500"),
                fontWeight: selected ? "600" : "500",
              }}
            >
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// AssistantBubble — un seul message de l'assistant : carte papier-sur-papier
// avec une bordure subtile, alignée à gauche.
// ---------------------------------------------------------------------------
function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        maxWidth: "92%",
        backgroundColor: CLAUDE.surface,
        borderRadius: 14,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: CLAUDE.paperBorder,
        paddingHorizontal: 13,
        paddingVertical: 11,
      }}
    >
      <Text
        style={{
          color: CLAUDE.ink,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: ralewayFamily("400"),
        }}
      >
        {children}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Composer — la rangée de saisie : champ texte en pastille + bouton d'envoi
// corail. Éditable pour le réalisme, mais l'envoi ne fait rien dans la maquette
// (il vide simplement le brouillon).
// ---------------------------------------------------------------------------
function Composer({
  value,
  onChangeText,
  onSend,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 9,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: CLAUDE.surface,
        borderTopWidth: 1,
        borderTopColor: CLAUDE.hairline,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 42,
          borderRadius: primitives.radii.full,
          backgroundColor: CLAUDE.paper,
          borderWidth: 1,
          borderColor: CLAUDE.paperBorder,
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Posez votre question…"
          placeholderTextColor={CLAUDE.inkMuted}
          returnKeyType="send"
          onSubmitEditing={onSend}
          style={{
            fontSize: 14,
            color: CLAUDE.ink,
            fontFamily: ralewayFamily("400"),
            padding: 0,
          }}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Envoyer le message"
        onPress={onSend}
        style={({ pressed }) => ({
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: pressed ? CLAUDE.coralPressed : CLAUDE.coral,
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Send size={19} color={CLAUDE.onCoral} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}
