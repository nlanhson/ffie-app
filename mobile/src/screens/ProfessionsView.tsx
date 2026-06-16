// ProfessionsView — le segment « Métiers » de l'onglet Découvrir.
//
// « Découvrir les métiers » (WBS Epic 4 / FFIE-TRADES-01), reconstruit
// strictement selon les critères d'acceptation du WBS : une section publique
// dont le cœur est les FICHES MÉTIERS, éventuellement enrichie de contenu
// pédagogique (parcours de formation) et de vidéos de présentation (vrais films
// de témoignages FFIE). Public / sans connexion (P6) ; mené par la vidéo, pas un
// mur de texte (P7).
//
// Disposition : un hero vidéo → les cartes de métiers (toucher → une fiche
// complète) → les parcours de formation « comment y arriver » → « paroles du
// terrain », de vraies vidéos. Le contenu + les types vivent dans
// data/professions.ts. L'imagerie est provisoire (graines RemoteImage).

import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, GraduationCap, Play, X } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { CARD_SHADOW, useHomeColors } from "@/components/home/homeColors";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { youtubeThumb } from "@/data/videos";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  HERO_IMAGE_KEYWORDS,
  HERO_IMAGE_LOCK,
  HERO_VIDEO_ID,
  PROFESSIONS,
  PROFESSIONS_INTRO,
  PROFESSION_VIDEOS,
  TRAINING_PATHS,
  tradeImage,
  type Profession,
} from "@/data/professions";

// Navy[700] de la marque — le navy d'action accessible de l'app (assorti aux CTA / pastilles).
const NAVY = primitives.colors.brand.navy[700];

export function ProfessionsView({ themeName = "light" }: { themeName?: ThemeName }) {
  // Quelle fiche est ouverte dans le lecteur plein écran (null = fermé), et quelle
  // vidéo est en lecture (null = fermé). Jamais les deux à la fois, donc pas de modales imbriquées.
  const [active, setActive] = useState<Profession | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  return (
    <>
      <Hero themeName={themeName} onWatch={() => setVideoId(HERO_VIDEO_ID)} />

      <Text style={{ color: themes[themeName].text.muted, fontSize: 15, lineHeight: 22, paddingHorizontal: GUTTER, paddingTop: 16 }}>
        {PROFESSIONS_INTRO}
      </Text>

      <SectionHeader title="Explorer les métiers" themeName={themeName} />
      <View style={{ paddingHorizontal: GUTTER, rowGap: 12 }}>
        {PROFESSIONS.map((p) => (
          <ProfessionCard key={p.id} profession={p} themeName={themeName} onPress={() => setActive(p)} />
        ))}
      </View>

      <SectionHeader title="Comment y arriver" themeName={themeName} />
      <TrainingPaths themeName={themeName} />

      <SectionHeader title="Paroles du terrain" themeName={themeName} />
      <VideoRow themeName={themeName} onPlay={setVideoId} />

      <ProfessionDetailModal profession={active} themeName={themeName} onClose={() => setActive(null)} />
      <VideoModal youtubeId={videoId} themeName={themeName} onClose={() => setVideoId(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero — une carte image pleine largeur avec un voile sombre, le titre de section
// et une pastille « Voir le film » (P7 — mené par la vidéo). Le texte blanc sur le
// voile passe l'AA pour les grandes tailles d'affichage ; la pastille est une puce
// blanche avec un libellé navy[700].
// ---------------------------------------------------------------------------
function Hero({ themeName, onWatch }: { themeName: ThemeName; onWatch: () => void }) {
  return (
    <View style={{ paddingHorizontal: GUTTER, paddingTop: 8 }}>
      {/* La vue externe projette l'ombre ; la vue interne découpe l'image au
          rayon — une ombre + overflow:hidden sur une seule vue découperait l'ombre. */}
      <View style={{ borderRadius: primitives.radii.xl, backgroundColor: "#0A0E18", ...CARD_SHADOW }}>
        <View style={{ height: 264, borderRadius: primitives.radii.xl, overflow: "hidden" }}>
          <RemoteImage
            uri={tradeImage(HERO_IMAGE_KEYWORDS, HERO_IMAGE_LOCK, 1000, 760)}
            width="100%"
            height="100%"
            themeName={themeName}
            accessibilityLabel="Une équipe diversifiée d'électriciens travaillant sur un chantier de bâtiment connecté"
          />
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(8,12,31,0.55)" }} />
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 20 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 12, fontFamily: ralewayFamily("700"), fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>
              FFIE · Métiers de l'électricité
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 30, lineHeight: 34, fontFamily: displayFamily("700"), fontWeight: "700", letterSpacing: -0.6, marginTop: 8 }}>
              Trouvez votre place dans le métier
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.92)", fontSize: 15, lineHeight: 21, marginTop: 8 }}>
              Un secteur en pleine croissance — et sans doute bien différent de ce que vous imaginez.
            </Text>
            <Pressable
              onPress={onWatch}
              accessibilityRole="button"
              accessibilityLabel="Voir le film"
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginTop: 16,
                height: 44,
                paddingHorizontal: 16,
                borderRadius: primitives.radii.full,
                backgroundColor: "#FFFFFF",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Play size={16} color={NAVY} fill={NAVY} />
              <Text style={{ color: NAVY, fontSize: 15, fontFamily: ralewayFamily("700"), fontWeight: "700", marginLeft: 8 }}>
                Voir le film
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader — le sur-titre en majuscules au-dessus de chaque bloc (assorti
// aux en-têtes de section du hub Outils + des listes groupées).
// ---------------------------------------------------------------------------
function SectionHeader({ title, themeName }: { title: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <Text
      accessibilityRole="header"
      style={{
        color: t.text.brand,
        fontSize: 12.5,
        fontFamily: ralewayFamily("700"),
        fontWeight: "700",
        letterSpacing: 0.6,
        textTransform: "uppercase",
        paddingHorizontal: GUTTER,
        marginTop: 28,
        marginBottom: 12,
      }}
    >
      {title}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// ProfessionCard — un métier dans la liste : un portrait, l'intitulé du poste,
// sa puce de domaine et une accroche d'une ligne. Toucher ouvre la fiche complète.
// ---------------------------------------------------------------------------
function ProfessionCard({
  profession,
  themeName,
  onPress,
}: {
  profession: Profession;
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  return (
    // La vue externe projette l'ombre ; le Pressable interne découpe le portrait
    // au rayon de la carte (ombre + overflow:hidden sur une seule vue découperait l'ombre).
    <View style={{ borderRadius: primitives.radii.lg, backgroundColor: c.cardBg, ...CARD_SHADOW }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${profession.role}. ${profession.tagline}`}
        style={({ pressed }) => ({
          flexDirection: "row",
          backgroundColor: c.cardBg,
          borderRadius: primitives.radii.lg,
          borderWidth: 1,
          borderColor: c.cardBorder,
          overflow: "hidden",
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <RemoteImage
          uri={tradeImage(profession.imageKeywords, profession.imageLock, 320, 360)}
          width={104}
          height={120}
          themeName={themeName}
          accessibilityLabel={profession.imageAlt}
        />
        <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14, justifyContent: "center" }}>
          <DomainChip label={profession.domain} themeName={themeName} />
          <Text numberOfLines={1} style={{ color: t.text.body, fontSize: 16, lineHeight: 21, fontFamily: ralewayFamily("700"), fontWeight: "700", letterSpacing: -0.2, marginTop: 6 }}>
            {profession.role}
          </Text>
          <Text numberOfLines={2} style={{ color: t.text.muted, fontSize: 13, lineHeight: 18, marginTop: 3 }}>
            {profession.tagline}
          </Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", paddingRight: 10 }}>
          <ChevronRight size={20} color={t.text.muted} />
        </View>
      </Pressable>
    </View>
  );
}

// DomainChip — une petite pastille de catégorie (teinte de surface + libellé atténué).
function DomainChip({ label, themeName }: { label: string; themeName: ThemeName }) {
  const t = themes[themeName];
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: t.surface.subtle, borderRadius: primitives.radii.full, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: t.text.muted, fontSize: 11, fontFamily: ralewayFamily("700"), fontWeight: "700", letterSpacing: 0.3, textTransform: "uppercase" }}>
        {label}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TrainingPaths — la couche pédagogique optionnelle : les vraies filières
// françaises vers le métier, à deux colonnes. Cartes informatives (sans
// destination — le contenu est fictif).
// ---------------------------------------------------------------------------
function TrainingPaths({ themeName }: { themeName: ThemeName }) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const rows: (typeof TRAINING_PATHS)[number][][] = [];
  for (let i = 0; i < TRAINING_PATHS.length; i += 2) rows.push(TRAINING_PATHS.slice(i, i + 2));

  return (
    <View style={{ paddingHorizontal: GUTTER, rowGap: 12 }}>
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row", columnGap: 12 }}>
          {row.map((tp) => (
            <View
              key={tp.id}
              style={{
                flex: 1,
                backgroundColor: c.cardBg,
                borderRadius: primitives.radii.lg,
                borderWidth: 1,
                borderColor: c.cardBorder,
                padding: 14,
                ...CARD_SHADOW,
              }}
            >
              <GraduationCap size={20} color={NAVY} strokeWidth={1.9} />
              {/* Réserver 2 lignes pour le libellé et la note pour que chaque
                  carte ait la même hauteur et que le niveau/la note s'alignent
                  sur toute la grille (des libellés comme « BTS Électrotechnique »
                  passent sur deux lignes). */}
              <Text
                numberOfLines={2}
                style={{ color: t.text.body, fontSize: 15, lineHeight: 19, fontFamily: ralewayFamily("700"), fontWeight: "700", marginTop: 10, minHeight: 38 }}
              >
                {tp.label}
              </Text>
              <Text numberOfLines={1} style={{ color: t.text.muted, fontSize: 12, marginTop: 4 }}>
                {tp.level}
              </Text>
              <Text numberOfLines={2} style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 17, marginTop: 6, minHeight: 34 }}>
                {tp.note}
              </Text>
            </View>
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// VideoRow — la couche optionnelle de vidéos de présentation : de vrais
// témoignages FFIE dans un rail horizontal. Toucher une carte ouvre le lecteur intégré.
// ---------------------------------------------------------------------------
function VideoRow({ themeName, onPlay }: { themeName: ThemeName; onPlay: (id: string) => void }) {
  const t = themes[themeName];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: GUTTER, columnGap: 12 }}
    >
      {PROFESSION_VIDEOS.map((v) => (
        <Pressable
          key={v.youtubeId}
          onPress={() => onPlay(v.youtubeId)}
          accessibilityRole="button"
          accessibilityLabel={`Lire le témoignage de ${v.name}`}
          style={({ pressed }) => ({ width: 208, opacity: pressed ? 0.9 : 1 })}
        >
          <RemoteImage
            uri={youtubeThumb(v.youtubeId)}
            width={208}
            height={120}
            radius={primitives.radii.lg}
            showPlay
            themeName={themeName}
            accessibilityLabel={`${v.name} — ${v.role}`}
          />
          <Text numberOfLines={1} style={{ color: t.text.body, fontSize: 14, fontFamily: ralewayFamily("700"), fontWeight: "700", marginTop: 8 }}>
            {v.name}
          </Text>
          <Text numberOfLines={1} style={{ color: t.text.muted, fontSize: 12.5, marginTop: 1 }}>
            {v.role}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// ProfessionDetailModal — la fiche métier complète : portrait, le résumé du
// poste, « ce que vous feriez », les compétences, et comment s'y former. Une page
// sheet assortie aux autres modales de détail de l'app ; le mouvement réduit la
// fait apparaître d'un coup (P4).
// ---------------------------------------------------------------------------
function ProfessionDetailModal({
  profession,
  themeName,
  onClose,
}: {
  profession: Profession | null;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const c = useHomeColors(themeName);
  const reduceMotion = useReducedMotion();
  const p = profession;

  return (
    <Modal
      visible={p != null}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["bottom"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
        {p ? (
          <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
            <View>
              <RemoteImage
                uri={tradeImage(p.imageKeywords, p.imageLock, 1000, 620)}
                width="100%"
                height={216}
                themeName={themeName}
                accessibilityLabel={p.imageAlt}
              />
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
                hitSlop={8}
                style={({ pressed }) => ({
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(8,12,31,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <X size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={{ paddingHorizontal: GUTTER, paddingTop: 16 }}>
              <DomainChip label={p.domain} themeName={themeName} />
              <Text style={{ color: t.text.body, fontSize: 28, lineHeight: 33, fontFamily: displayFamily("700"), fontWeight: "700", letterSpacing: -0.6, marginTop: 10 }}>
                {p.role}
              </Text>
              <Text style={{ color: t.text.muted, fontSize: 16, lineHeight: 22, marginTop: 6 }}>{p.tagline}</Text>
              <Text style={{ color: t.text.body, fontSize: 15, lineHeight: 23, marginTop: 14 }}>{p.summary}</Text>

              <DetailSection title="Ce que vous feriez" themeName={themeName}>
                <View style={{ rowGap: 10 }}>
                  {p.dayInLife.map((item, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "flex-start" }}>
                      <View style={{ width: 22, paddingTop: 2 }}>
                        <Check size={16} color={NAVY} strokeWidth={2.4} />
                      </View>
                      <Text style={{ flex: 1, color: t.text.body, fontSize: 15, lineHeight: 22 }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </DetailSection>

              <DetailSection title="Compétences mobilisées" themeName={themeName}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {p.skills.map((s) => (
                    <View key={s} style={{ backgroundColor: t.surface.subtle, borderWidth: 1, borderColor: t.border.subtle, borderRadius: primitives.radii.full, paddingHorizontal: 12, paddingVertical: 7 }}>
                      <Text style={{ color: t.text.body, fontSize: 13, fontFamily: ralewayFamily("500"), fontWeight: "500" }}>{s}</Text>
                    </View>
                  ))}
                </View>
              </DetailSection>

              <DetailSection title="Comment y arriver" themeName={themeName}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={{ width: 26, paddingTop: 1 }}>
                    <GraduationCap size={18} color={NAVY} strokeWidth={1.9} />
                  </View>
                  <Text style={{ flex: 1, color: t.text.body, fontSize: 15, lineHeight: 23 }}>{p.pathIn}</Text>
                </View>
              </DetailSection>
            </View>
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

// DetailSection — un bloc titré dans la fiche (en-tête en majuscules bleu marine).
function DetailSection({
  title,
  themeName,
  children,
}: {
  title: string;
  themeName: ThemeName;
  children: React.ReactNode;
}) {
  const t = themes[themeName];
  return (
    <View style={{ marginTop: 22 }}>
      <Text
        accessibilityRole="header"
        style={{ color: t.text.brand, fontSize: 13, fontFamily: ralewayFamily("700"), fontWeight: "700", letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 12 }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// VideoModal — le lecteur intégré pour le film du hero + le rail de témoignages.
// Les sous-titres sont activés par défaut (YouTubeEmbed). Le mouvement réduit le
// fait apparaître d'un coup.
// ---------------------------------------------------------------------------
function VideoModal({
  youtubeId,
  themeName,
  onClose,
}: {
  youtubeId: string | null;
  themeName: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const reduceMotion = useReducedMotion();
  return (
    <Modal
      visible={youtubeId != null}
      animationType={reduceMotion ? "none" : "slide"}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 8, paddingTop: 4 }}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
            hitSlop={8}
            style={({ pressed }) => ({ width: 44, height: 44, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.6 : 1 })}
          >
            <X size={26} color={t.text.body} />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 8 }}>
          {youtubeId ? <YouTubeEmbed youtubeId={youtubeId} /> : null}
          <Text style={{ color: t.text.muted, fontSize: 13, lineHeight: 19, marginTop: 12 }}>
            Les sous-titres sont activés par défaut — touchez le lecteur pour démarrer.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
