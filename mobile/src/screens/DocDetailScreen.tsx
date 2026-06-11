// Détail d'un document — le lecteur réservé aux adhérents pour un document de la
// Bibliothèque.
//
// C'est ici que vivent les comportements hors ligne + partage prévus au cahier des
// charges :
//   - FFIE-DOC-03 (adhérent) : télécharger un document « pour le garder en local ».
//     Présenté ici comme un interrupteur « Enregistré hors ligne ». Les invités
//     peuvent parcourir la liste de la Bibliothèque (GUEST_TABS), mais taper un
//     document réservé aux adhérents les redirige vers l'incitation (MemberOnlyPrompt)
//     plutôt qu'ici — donc ce détail n'est atteint que pour les documents que le
//     visiteur peut ouvrir (tous les documents pour les adhérents ; le document public
//     pour tous).
//   - PERSONAS n° 8 : « Le partage vers WhatsApp / le partage vers Mail doit être à un
//     tap de n'importe quel document. » → l'action de partage dans la barre de nav.
//
// « Ouvrir le document » ouvre un vrai PDF (doc.sourceUrl) dans le PdfViewerScreen
// intégré — un lecteur react-native-webview embarqué avec le chrome de l'app
// (FFIE-DOC-02 : « ouvert dans l'application »). Les documents qui n'ont qu'une page de
// détail HTML (pas d'URL de fichier publique) s'ouvrent plutôt dans le navigateur
// intégré — le motif PAGE_SHEET d'expo-web-browser utilisé partout dans l'app, le bon
// outil pour une page web. Une fois que le backend synchronisera les vraies URL de
// fichiers réservés aux adhérents, tout passera par le lecteur intégré.

import React, { useState } from "react";
import { ChevronLeft, FileText, Share2, WifiOff } from "lucide-react-native";
import { Image, Pressable, ScrollView, Share, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { primitives, themes, type ThemeName } from "@tokens";
import { displayFamily } from "@/theme/fonts";
import { GUTTER, InsetGroup, InsetRow, useGroupedColors } from "@/components/ui/ios";
import { SavedBadge } from "@/components/ui/SavedBadge";
import { PdfViewerScreen } from "@/screens/PdfViewerScreen";
import { docSubtitle, type Doc } from "@/data/docs";

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

  // État hors ligne fictif — initialisé depuis l'indicateur saved du document. En
  // production cela reflète le véritable état du cache local et l'interrupteur déclenche
  // le téléchargement / la suppression.
  const [savedOffline, setSavedOffline] = useState(doc.saved);
  // Vraie image de couverture — bascule sur le repli FileText si elle ne peut pas être
  // récupérée.
  const [coverFailed, setCoverFailed] = useState(false);
  // Lecteur PDF intégré ouvert par-dessus le détail (documents PDF réels uniquement).
  const [pdfOpen, setPdfOpen] = useState(false);

  const share = async () => {
    try {
      await Share.share({ title: doc.title, message: `${doc.title}\n\nvia FFIE` });
    } catch {
      // annulé — aucune action
    }
  };

  // Un vrai PDF s'ouvre dans le lecteur intégré ; une page de détail uniquement HTML
  // s'ouvre dans le navigateur intégré (le bon outil pour une page web).
  const hasPdf = !!doc.sourceUrl;
  const openLabel = hasPdf ? "Ouvrir le document (PDF)" : "Voir sur ffie.fr";
  const openDocument = () => {
    if (hasPdf) {
      setPdfOpen(true);
      return;
    }
    WebBrowser.openBrowserAsync(doc.detailUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    }).catch(() => {
      // navigateur indisponible — aucune action
    });
  };

  // Le lecteur intégré remplace le détail tant qu'il est ouvert (motif de nav maison).
  if (pdfOpen && doc.sourceUrl) {
    return (
      <PdfViewerScreen
        uri={doc.sourceUrl}
        title={doc.title}
        themeName={themeName}
        onBack={() => setPdfOpen(false)}
        onShare={share}
      />
    );
  }

  const showCover = !!doc.thumbUrl && !coverFailed;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Barre de nav fine : retour + partage */}
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
        {/* Aperçu — la vraie couverture FFIE, avec un repli honnête en cas d'absence */}
        <View style={{ paddingHorizontal: GUTTER, marginBottom: 20 }}>
          <View
            style={{
              height: 220,
              borderRadius: primitives.radii.lg,
              backgroundColor: themeName === "dark" ? t.surface.raised : t.surface.subtle,
              borderWidth: c.cardBorder ? 1 : 0,
              borderColor: c.cardBorder,
              alignItems: "center",
              justifyContent: "center",
              rowGap: 10,
              overflow: "hidden",
            }}
          >
            {showCover ? (
              <Image
                source={{ uri: doc.thumbUrl }}
                onError={() => setCoverFailed(true)}
                resizeMode="contain"
                style={StyleSheet.absoluteFill}
                accessibilityLabel={`Couverture : ${doc.title}`}
              />
            ) : (
              <>
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
                <Text style={{ color: t.text.muted, fontSize: 12 }}>Aperçu du document FFIE</Text>
              </>
            )}
          </View>
        </View>

        {/* Titre + méta */}
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
          <Text style={{ color: t.text.muted, fontSize: 14, marginTop: 6 }}>{docSubtitle(doc)}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <SavedBadge saved={savedOffline} size="sm" themeName={themeName} />
          </View>
        </View>

        {/* Hors ligne — le contrôle FFIE-DOC-03 (adhérents uniquement) */}
        <InsetGroup
          header="Hors ligne"
          footer="Les documents enregistrés s'ouvrent sans connexion internet."
          themeName={themeName}
        >
          <InsetRow
            icon={WifiOff}
            iconBg={t.brand.accent}
            title="Enregistré hors ligne"
            subtitle={savedOffline ? "Disponible sans internet" : "Télécharger pour garder sur cet appareil"}
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
            title={openLabel}
            themeName={themeName}
            onPress={openDocument}
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

        {/* Détails */}
        <InsetGroup header="Détails" themeName={themeName}>
          <InsetRow title="Format" value="PDF" themeName={themeName} showChevron={false} />
          <InsetRow
            title="Famille"
            value={doc.family}
            themeName={themeName}
            showChevron={false}
            isLast={doc.categories.length === 0}
          />
          {doc.categories.length > 0 ? (
            <InsetRow
              title={doc.categories.length > 1 ? "Catégories" : "Catégorie"}
              subtitle={doc.categories.join(" · ")}
              themeName={themeName}
              showChevron={false}
              isLast
            />
          ) : null}
        </InsetGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
