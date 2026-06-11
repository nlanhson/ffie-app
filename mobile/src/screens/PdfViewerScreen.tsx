// Lecteur PDF intégré — affiche le vrai PDF d'un document dans l'app au lieu de
// le confier à un navigateur externe (FFIE-DOC-02 : « les documents peuvent être
// ouverts dans l'application »). Même react-native-webview que celui qui alimente
// YouTubeEmbed, donc il fonctionne dans Expo Go ; un build dev/TestFlight
// personnalisé nécessite une reconstruction pour inclure le module natif.
//
// Note de plateforme (honnête, pas un bug) : le WKWebView d'iOS affiche un PDF
// distant en ligne, on charge donc l'URL du fichier directement. Le WebView
// système d'Android ne le peut pas, on enveloppe donc l'URL dans la visionneuse
// de documents hébergée par Google — qui ne fonctionne que pour les PDF
// PUBLIQUEMENT accessibles. Aujourd'hui, exactement un document FFIE expose une
// URL de fichier publique (le plan d'électrification) ; les autres sont des pages
// de détail HTML et n'arrivent jamais ici (DocDetailScreen les envoie plutôt au
// navigateur intégré). Quand le backend commencera à synchroniser de vraies URL
// de fichiers de documents adhérents, elles passeront toutes par ce lecteur.
//
// Pas d'impasse (Principe 2) : si l'intégration échoue (hors ligne, 404, un
// fichier adhérent derrière une authentification), on retombe sur une carte
// claire avec une action « ouvrir dans le navigateur ».

import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { ChevronLeft, FileText, Share2 } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { themes, type ThemeName } from "@tokens";
import { GUTTER, useGroupedColors } from "@/components/ui/ios";

export function PdfViewerScreen({
  uri,
  title,
  themeName = "light",
  onBack,
  onShare,
}: {
  /** L'URL du vrai fichier PDF du document (doc.sourceUrl). */
  uri: string;
  /** Titre du document — affiché dans la barre de navigation et utilisé comme option de retour. */
  title: string;
  themeName?: ThemeName;
  onBack: () => void;
  /** Action de partage facultative, reprise de l'écran de détail. */
  onShare?: () => void;
}) {
  const t = themes[themeName];
  const c = useGroupedColors(themeName);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Android ne peut pas afficher un PDF distant en ligne — on le fait passer par la
  // visionneuse de Google (PDF publics uniquement). iOS charge le fichier directement.
  const displayUri =
    Platform.OS === "android"
      ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`
      : uri;

  const openInBrowser = () => {
    WebBrowser.openBrowserAsync(uri, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    }).catch(() => {
      // navigateur indisponible — sans effet
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.pageBg }}>
      {/* Fine barre de navigation : retour + partage (facultatif) — assortie à DocDetailScreen. */}
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
          accessibilityLabel="Fermer le document"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            columnGap: 1,
            opacity: pressed ? 0.5 : 1,
            paddingVertical: 6,
            paddingRight: 8,
            flexShrink: 1,
          })}
        >
          <ChevronLeft size={26} color={t.brand.accent} />
          <Text numberOfLines={1} style={{ color: t.brand.accent, fontSize: 16, flexShrink: 1 }}>
            {title}
          </Text>
        </Pressable>

        {onShare ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Partager ce document"
            onPress={onShare}
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
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {/* Lecteur, ou le repli honnête si l'intégration ne peut pas se charger. */}
      {failed ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, rowGap: 14 }}>
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
          <Text
            accessibilityRole="header"
            style={{ color: t.text.body, fontSize: 17, fontWeight: "600", textAlign: "center" }}
          >
            Aperçu indisponible
          </Text>
          <Text style={{ color: t.text.muted, fontSize: 14, textAlign: "center", lineHeight: 20 }}>
            Ce PDF ne peut pas être affiché ici. Vous pouvez l'ouvrir dans votre navigateur.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le document dans le navigateur"
            onPress={openInBrowser}
            style={({ pressed }) => ({
              marginTop: 4,
              paddingHorizontal: 22,
              height: 48,
              borderRadius: 24,
              backgroundColor: pressed ? t.action.primary.bgPressed : t.action.primary.bg,
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "600" }}>
              Ouvrir dans le navigateur
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: displayUri }}
            originWhitelist={["*"]}
            onLoadEnd={() => setLoading(false)}
            onError={() => setFailed(true)}
            onHttpError={() => setFailed(true)}
            style={{ flex: 1, backgroundColor: c.pageBg }}
            // Les PDF sont statiques — JS désactivé garde le lecteur léger ; gview en a besoin activé.
            javaScriptEnabled={Platform.OS === "android"}
            domStorageEnabled={Platform.OS === "android"}
            setSupportMultipleWindows={false}
          />

          {/* Surcouche de chargement jusqu'au premier rendu. */}
          {loading ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                { alignItems: "center", justifyContent: "center", backgroundColor: c.pageBg },
              ]}
            >
              <ActivityIndicator color={t.brand.accent} />
              <Text style={{ color: t.text.muted, fontSize: 13, marginTop: 10 }}>
                Chargement du document…
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}
