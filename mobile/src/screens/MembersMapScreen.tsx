// MembersMapScreen — la « Carte des adhérents » plein écran (FFIE-16), ouverte
// comme une modale depuis la carte « Trouver un pro » de l'Accueil (les deux rôles).
//
// FFIE-16 (carte des adhérents + géolocalisation + consentement RGPD) est bloqué
// côté backend en v1 — il n'y a pas d'annuaire des adhérents ni de service de
// géolocalisation. Cet écran est donc une MAQUETTE honnête de la fonctionnalité :
//   • la vraie carte native (FederationMap, réutilisée de l'annuaire des fédérations),
//   • des repères de DÉMONSTRATION (data/members.ts) — aucun adhérent réel, aucune
//     coordonnée inventée ; toucher un repère affiche « coordonnées à venir »,
//   • un opt-in géolocalisation + RGPD (l'exigence réelle de FFIE-16) : le bouton
//     « Activer la localisation » simule le consentement et recentre la carte,
//   • une recherche locale (ville / spécialité) qui filtre les repères,
//   • un avertissement clair que les données seront connectées à la base FFIE.
//
// La carte EXIGE un build natif (Apple Maps iOS / MapLibre Android) ; sans module
// natif, FederationMap se dégrade en espace réservé « Carte indisponible ».

import React, { useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LocateFixed, MapPin, Search, ShieldCheck, X } from "lucide-react-native";
import { primitives, themes, type ThemeName } from "@tokens";
import { ralewayFamily, displayFamily } from "@/theme/fonts";
import { GUTTER } from "@/components/ui/ios";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  FederationMap,
  type FederationMapHandle,
  type MapRegion,
} from "@/components/ui/FederationMap";
import { MEMBER_PINS, type MemberPin } from "@/data/members";

const WHITE = primitives.colors.white;

// Couleurs d'avatar — toutes lisibles en blanc (AA texte large). Cyclées par id
// pour donner à chaque adhérent une pastille stable. Toutes issues des jetons.
const AVATAR_BG = [
  primitives.colors.brand.navy[700],
  primitives.colors.brand.teal[600],
  primitives.colors.amber[700],
  primitives.colors.blue[600],
  primitives.colors.green[700],
  primitives.colors.brand.navy[500],
];

// Distance de démonstration : une décimale en deçà de 10 km, entier au-delà.
function formatDistance(km: number): string {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

// Initiales de l'avatar — l'override de la donnée, sinon les premières lettres
// des deux premiers mots significatifs (on saute les formes juridiques).
function initialsFor(p: MemberPin): string {
  if (p.initials) return p.initials;
  const words = p.title
    .trim()
    .split(/\s+/)
    .filter((w) => !/^(sas|sarl|sa|eurl|sasu|scop)$/i.test(w));
  const letters = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
  return (letters || p.title.slice(0, 2)).toUpperCase();
}

// Région resserrée autour d'un adhérent — utilisée quand on touche une ligne de
// la liste pour recentrer la carte sur lui.
function regionForPin(p: MemberPin): MapRegion {
  return { latitude: p.lat, longitude: p.lng, latitudeDelta: 0.12, longitudeDelta: 0.12 };
}

// Vue initiale centrée sur la France métropolitaine (même cadrage que l'annuaire
// des fédérations).
const FRANCE_REGION: MapRegion = {
  latitude: 46.6,
  longitude: 2.5,
  latitudeDelta: 9.5,
  longitudeDelta: 9.5,
};

// Région « près de moi » simulée (Île-de-France) — la vraie géolocalisation est
// bloquée côté natif/backend (FFIE-16). On y vole quand l'utilisateur « active
// la localisation », pour illustrer le parcours.
const NEAR_ME_REGION: MapRegion = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 1.4,
  longitudeDelta: 1.4,
};

export function MembersMapScreen({
  themeName = "light",
  onClose,
}: {
  themeName?: ThemeName;
  onClose: () => void;
}) {
  const t = themes[themeName];
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const mapRef = useRef<FederationMapHandle>(null);
  const [query, setQuery] = useState("");
  const [located, setLocated] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Recherche locale : filtre les repères par ville ou spécialité.
  const pins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEMBER_PINS;
    return MEMBER_PINS.filter(
      (p) => p.city.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = selectedId != null ? MEMBER_PINS.find((p) => p.id === selectedId) ?? null : null;

  // Liste « à proximité » : mêmes repères que la carte (filtrés par la
  // recherche), triés par distance croissante.
  const nearby = useMemo(
    () => [...pins].sort((a, b) => a.distanceKm - b.distanceKm),
    [pins],
  );

  // Géolocalisation simulée (FFIE-16, RGPD bloqué en v1) : on suppose le
  // consentement accordé et on recentre sur l'Île-de-France.
  const handleLocate = () => {
    setLocated(true);
    setSelectedId(null);
    mapRef.current?.animateToRegion(NEAR_ME_REGION, reducedMotion ? 0 : 600);
  };

  // Toucher une ligne de la liste : sélectionne l'adhérent et recentre la carte
  // sur lui (durée 0 si « réduire les animations » est actif).
  const handleSelectMember = (p: MemberPin) => {
    setSelectedId(p.id);
    mapRef.current?.animateToRegion(regionForPin(p), reducedMotion ? 0 : 600);
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: t.surface.default }}>
      {/* En-tête : fermeture + titre */}
      <View style={styles.header}>
        <CloseButton themeName={themeName} onPress={onClose} />
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={{
            flex: 1,
            color: t.text.body,
            fontSize: 18,
            fontFamily: displayFamily("700"),
            fontWeight: "700",
            letterSpacing: -0.3,
          }}
        >
          Carte des adhérents
        </Text>
      </View>

      {/* Recherche + « me localiser » */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchField,
            { backgroundColor: t.surface.subtle, borderColor: t.border.subtle },
          ]}
        >
          <Search size={18} color={t.text.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Trouver un pro près de chez vous"
            placeholderTextColor={t.text.placeholder}
            accessibilityLabel="Rechercher un adhérent par ville ou spécialité"
            returnKeyType="search"
            style={{
              flex: 1,
              color: t.text.body,
              fontSize: 14,
              fontFamily: ralewayFamily("400"),
              paddingVertical: 0,
            }}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Effacer la recherche"
            >
              <X size={16} color={t.text.muted} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          onPress={handleLocate}
          accessibilityRole="button"
          accessibilityLabel="Me localiser"
          accessibilityHint="Recentre la carte sur votre position (avec votre consentement)"
          style={({ pressed }): ViewStyle => ({
            width: 44,
            height: 44,
            borderRadius: primitives.radii.md,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: t.action.primary.bg,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <LocateFixed size={20} color={t.action.primary.fg} />
        </Pressable>
      </View>

      {/* Carte */}
      <View style={{ flex: 1 }}>
        <FederationMap
          ref={mapRef}
          initialRegion={FRANCE_REGION}
          pins={pins}
          onPinPress={(id) => setSelectedId(id)}
          accessibilityLabel="Carte des adhérents FFIE"
          style={{ flex: 1 }}
        />
      </View>

      {/* Bas de page : carte du repère sélectionné OU opt-in RGPD, + avertissement */}
      <View
        style={[
          styles.bottom,
          {
            backgroundColor: t.surface.default,
            borderTopColor: t.border.subtle,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {selected ? (
          <SelectedPinCard
            themeName={themeName}
            title={selected.title}
            city={selected.city}
            specialty={selected.specialty}
            distanceKm={selected.distanceKm}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <>
            {!located ? <ConsentCard themeName={themeName} onLocate={handleLocate} /> : null}
            <NearbyMembers themeName={themeName} members={nearby} onSelect={handleSelectMember} />
          </>
        )}

        <Text style={{ color: t.text.muted, fontSize: 11.5, lineHeight: 16 }}>
          Données de démonstration — l'annuaire géolocalisé des adhérents sera
          connecté à la base FFIE avec votre consentement (RGPD · FFIE-16).
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Opt-in géolocalisation + RGPD (l'exigence réelle de FFIE-16).
function ConsentCard({
  themeName,
  onLocate,
}: {
  themeName: ThemeName;
  onLocate: () => void;
}) {
  const t = themes[themeName];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surface.subtle, borderColor: t.border.subtle },
      ]}
    >
      <ShieldCheck size={22} color={t.brand.accent} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: t.text.body,
            fontSize: 14,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
          }}
        >
          Trouvez un adhérent près de chez vous
        </Text>
        <Text style={{ color: t.text.muted, fontSize: 12.5, lineHeight: 17, marginTop: 3 }}>
          Activez la localisation pour voir les adhérents FFIE autour de vous.
          Votre position n'est utilisée qu'avec votre consentement (RGPD).
        </Text>
        <Pressable
          onPress={onLocate}
          accessibilityRole="button"
          accessibilityLabel="Activer la localisation"
          style={({ pressed }): ViewStyle => ({
            alignSelf: "flex-start",
            marginTop: 10,
            backgroundColor: t.action.primary.bg,
            borderRadius: primitives.radii.md,
            paddingHorizontal: 14,
            paddingVertical: 9,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              color: t.action.primary.fg,
              fontSize: 13.5,
              fontFamily: ralewayFamily("600"),
              fontWeight: "600",
            }}
          >
            Activer la localisation
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Fiche du repère sélectionné — aucune coordonnée inventée : espace réservé
// « à venir » jusqu'à ce que l'annuaire FFIE-16 soit connecté.
function SelectedPinCard({
  themeName,
  title,
  city,
  specialty,
  distanceKm,
  onClose,
}: {
  themeName: ThemeName;
  title: string;
  city: string;
  specialty: string;
  distanceKm: number;
  onClose: () => void;
}) {
  const t = themes[themeName];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.surface.subtle, borderColor: t.border.subtle },
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: primitives.radii.md,
          backgroundColor: t.brand.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MapPin size={20} color={WHITE} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: t.text.body,
              fontSize: 15,
              fontFamily: ralewayFamily("700"),
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          <DistanceBadge themeName={themeName} km={distanceKm} />
        </View>
        <Text style={{ color: t.text.muted, fontSize: 12.5, marginTop: 2 }} numberOfLines={1}>
          {city} · {specialty}
        </Text>
        <Text style={{ color: t.text.muted, fontSize: 12, lineHeight: 16, marginTop: 8 }}>
          Coordonnées à venir — la fiche détaillée sera connectée à la base FFIE
          (FFIE-16).
        </Text>
      </View>
      <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fermer la fiche">
        <X size={18} color={t.text.muted} />
      </Pressable>
    </View>
  );
}

// Liste « Adhérents à proximité » — repères triés par distance, façon liste de
// résultats (avatar, raison sociale, ville · spécialité, badge distance).
// Hauteur plafonnée + défilement pour ne pas écraser la carte au-dessus.
function NearbyMembers({
  themeName,
  members,
  onSelect,
}: {
  themeName: ThemeName;
  members: MemberPin[];
  onSelect: (p: MemberPin) => void;
}) {
  const t = themes[themeName];
  return (
    <View style={{ rowGap: 8 }}>
      <View style={styles.listHeader}>
        <Text
          style={{
            color: t.text.muted,
            fontSize: 12,
            fontFamily: ralewayFamily("700"),
            fontWeight: "700",
            letterSpacing: 0.6,
          }}
        >
          ADHÉRENTS À PROXIMITÉ
        </Text>
        <Text
          style={{
            color: t.brand.accent,
            fontSize: 12,
            fontFamily: ralewayFamily("600"),
            fontWeight: "600",
          }}
        >
          {members.length} résultat{members.length > 1 ? "s" : ""}
        </Text>
      </View>

      {members.length === 0 ? (
        <Text style={{ color: t.text.muted, fontSize: 13, lineHeight: 18 }}>
          Aucun adhérent ne correspond à votre recherche.
        </Text>
      ) : (
        <ScrollView
          style={{ maxHeight: 260 }}
          contentContainerStyle={{ rowGap: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {members.map((m) => (
            <MemberRow key={m.id} themeName={themeName} member={m} onPress={() => onSelect(m)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// Une ligne adhérent — pastille d'initiales colorée, raison sociale, méta
// ville · spécialité, badge distance. Toute la ligne est une cible tactile.
function MemberRow({
  themeName,
  member,
  onPress,
}: {
  themeName: ThemeName;
  member: MemberPin;
  onPress: () => void;
}) {
  const t = themes[themeName];
  const bg = AVATAR_BG[(member.id - 1) % AVATAR_BG.length];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${member.title}, ${member.city}, ${member.specialty}, à ${formatDistance(member.distanceKm)}`}
      style={({ pressed }): ViewStyle => ({
        ...styles.row,
        backgroundColor: t.surface.default,
        borderColor: t.border.subtle,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={[styles.avatar, { backgroundColor: bg }]}>
        <Text
          style={{ color: WHITE, fontSize: 15, fontFamily: ralewayFamily("700"), fontWeight: "700" }}
        >
          {initialsFor(member)}
        </Text>
      </View>
      <View style={{ flex: 1, rowGap: 3 }}>
        <Text
          numberOfLines={1}
          style={{ color: t.text.body, fontSize: 15, fontFamily: ralewayFamily("700"), fontWeight: "700" }}
        >
          {member.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}>
          <MapPin size={13} color={t.brand.accent} />
          <Text numberOfLines={1} style={{ flex: 1, color: t.text.muted, fontSize: 12.5 }}>
            {member.city} · {member.specialty}
          </Text>
        </View>
      </View>
      <DistanceBadge themeName={themeName} km={member.distanceKm} />
    </Pressable>
  );
}

// Badge de distance — pastille discrète, teinte de marque (navy) sur surface
// subtile, cohérente avec les 3 thèmes (clair / sombre / plein soleil).
function DistanceBadge({ themeName, km }: { themeName: ThemeName; km: number }) {
  const t = themes[themeName];
  return (
    <View
      style={{
        backgroundColor: t.surface.subtle,
        borderRadius: primitives.radii.full,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Text
        style={{ color: t.brand.accent, fontSize: 12.5, fontFamily: ralewayFamily("700"), fontWeight: "700" }}
      >
        {formatDistance(km)}
      </Text>
    </View>
  );
}

// Fermeture style iOS : disque gris plein avec un X (même traitement que la
// modale Agenda). hitSlop élève le disque de 30 pt à une cible ≥ 44 pt.
function CloseButton({
  themeName,
  onPress,
}: {
  themeName: ThemeName;
  onPress: () => void;
}) {
  const t = themes[themeName];
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Fermer"
      accessibilityHint="Ferme la carte des adhérents"
      style={({ pressed }): ViewStyle => ({
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: t.border.default,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <X size={18} color={t.text.muted} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: GUTTER,
    paddingTop: 6,
    paddingBottom: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: GUTTER,
    paddingBottom: 12,
  },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    height: 44,
    borderRadius: primitives.radii.md,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  bottom: {
    paddingHorizontal: GUTTER,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    rowGap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    columnGap: 12,
    borderRadius: primitives.radii.lg,
    borderWidth: 1,
    padding: 14,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    borderRadius: primitives.radii.lg,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: primitives.radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
