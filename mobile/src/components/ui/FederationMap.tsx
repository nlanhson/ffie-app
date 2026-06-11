// Carte des fédérations — une abstraction scindée par plateforme pour que chaque OS utilise
// une carte native *sans clé*, et que l'écran au-dessus n'ait jamais à se soucier du moteur sous-jacent.
//
//   • iOS     → react-native-maps (Apple Maps). Aucune clé d'API requise.
//   • Android → MapLibre + tuiles raster OpenStreetMap. Aucune clé Google requise.
//
// Pourquoi la scission : react-native-maps sur Android, c'est Google Maps sous le capot,
// qui nécessite une clé d'API Google Maps *facturée*. MapLibre rend les tuiles OSM sans
// clé, donc la carte Android fonctionne sur chaque build d'emblée. iOS obtient déjà Apple
// Maps gratuitement, il garde donc le module qu'il a toujours utilisé.
//
// IMPORTANT — pourquoi les bibliothèques natives sont chargées avec `require()` derrière une
// garde plutôt qu'un `import` de haut niveau :
//   Les composants de MapLibre touchent le TurboModule `MLRNCameraModule` dès que
//   leur JS s'évalue. Un import statique de haut niveau *plante donc toute
//   l'application au démarrage* (« [runtime not ready]: ... 'MLRNCameraModule' could not be
//   found ») sur tout binaire qui ne contient pas le module natif — une installation
//   périmée, Expo Go, ou simplement avant une reconstruction native. Pour rendre cela
//   impossible, on (a) n'évalue MapLibre que sur Android, (b) uniquement quand
//   `TurboModuleRegistry.get` confirme que le module natif est réellement lié dans le
//   binaire en cours d'exécution, et (c) on se replie sinon sur un simple espace réservé. La
//   carte EXIGE toujours un build natif pour s'afficher — mais un module manquant se
//   dégrade désormais en espace réservé au lieu de mettre toute l'application à terre.
//
// Les imports de type ci-dessous sont effacés à la compilation, ils ne déclenchent donc
// jamais le module natif — seuls les `require()` à l'intérieur des fabriques le font.
//
// NOTE : le serveur de tuiles public d'OpenStreetMap convient aux applications à faible
// trafic mais sa politique d'utilisation décourage un usage lourd/en masse. Si l'usage
// croît, pointer OSM_STYLE vers un vrai fournisseur de tuiles (offre gratuite MapTiler /
// Stadia, ou auto-hébergé).

import React from "react";
import {
  Platform,
  Text,
  TurboModuleRegistry,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type RNMapView from "react-native-maps";
import type {
  CameraRef,
  StyleSpecification,
} from "@maplibre/maplibre-react-native";
import { themes } from "@tokens";

/** La portion de la forme de région de react-native-maps avec laquelle l'écran pilote la carte. */
export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type FederationPin = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description: string;
};

/** Handle impératif — correspond volontairement à `MapView.animateToRegion`. */
export type FederationMapHandle = {
  animateToRegion: (region: MapRegion, duration: number) => void;
};

type Props = {
  initialRegion: MapRegion;
  pins: FederationPin[];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  onPinPress: (id: number) => void;
};

type MapComponent = React.ForwardRefExoticComponent<
  Props & React.RefAttributes<FederationMapHandle>
>;

// ─── Repli — affiché uniquement quand aucun moteur de carte natif n'est disponible ───
// (par ex. en exécutant le JS contre un binaire non reconstruit avec le module de carte).

const FallbackMap = React.forwardRef<FederationMapHandle, Props>(
  function FallbackMap({ style, accessibilityLabel }, ref) {
    React.useImperativeHandle(ref, () => ({ animateToRegion: () => {} }), []);
    const t = themes.light;
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: t.surface.subtle,
          },
          style,
        ]}
      >
        <Text style={{ color: t.text.muted, fontSize: 13 }}>
          Carte indisponible
        </Text>
      </View>
    );
  },
);

// ─── iOS : Apple Maps via react-native-maps ─────────────────────────────────

function createAppleMap(): MapComponent {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNMaps = require("react-native-maps");
  const MapView = RNMaps.default as typeof import("react-native-maps").default;
  const Marker = RNMaps.Marker as typeof import("react-native-maps").Marker;

  return React.forwardRef<FederationMapHandle, Props>(function AppleMap(
    { initialRegion, pins, style, accessibilityLabel, onPinPress },
    ref,
  ) {
    const mapRef = React.useRef<RNMapView>(null);
    React.useImperativeHandle(
      ref,
      () => ({
        animateToRegion: (region, duration) =>
          mapRef.current?.animateToRegion(region, duration),
      }),
      [],
    );

    return (
      <MapView
        ref={mapRef}
        style={style}
        initialRegion={initialRegion}
        accessibilityLabel={accessibilityLabel}
      >
        {pins.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.title}
            description={p.description}
            onPress={() => onPinPress(p.id)}
          />
        ))}
      </MapView>
    );
  });
}

// ─── Android : MapLibre + tuiles raster OpenStreetMap ───────────────────────

// Style MapLibre minimal : une source + une couche raster OSM. Cast via unknown
// car un littéral en ligne élargit « raster »/8 au-delà des littéraux de la spec.
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
} as unknown as StyleSpecification;

// react-native-maps raisonne en (centre, latitudeDelta) ; MapLibre raisonne en
// (centre, zoom). À l'équateur, une étendue complète de 360° est le zoom 0, l'étendue
// étant divisée par deux à chaque niveau — suffisant pour notre cadrage pays/région.
const regionToZoom = (region: MapRegion) =>
  Math.log2(360 / region.longitudeDelta);

function createMapLibreMap(): MapComponent {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const MapLibre = require("@maplibre/maplibre-react-native");
  const MapLibreMap = MapLibre.Map;
  const Camera = MapLibre.Camera;
  const GeoJSONSource = MapLibre.GeoJSONSource;
  const Layer = MapLibre.Layer;

  return React.forwardRef<FederationMapHandle, Props>(function AndroidMap(
    { initialRegion, pins, style, accessibilityLabel, onPinPress },
    ref,
  ) {
    const cameraRef = React.useRef<CameraRef>(null);
    React.useImperativeHandle(
      ref,
      () => ({
        animateToRegion: (region, duration) => {
          const center: [number, number] = [region.longitude, region.latitude];
          const zoom = regionToZoom(region);
          // durée 0 (mouvement réduit) → transition instantanée, sinon adoucissement comme Apple Maps.
          if (duration > 0) cameraRef.current?.easeTo({ center, zoom, duration });
          else cameraRef.current?.jumpTo({ center, zoom });
        },
      }),
      [],
    );

    // Un point GeoJSON par épingle, rendu en cercles GPU — passe à l'échelle de centaines
    // d'épingles sans les vues natives par marqueur qu'un Marker-par-épingle créerait.
    const data = React.useMemo<GeoJSON.FeatureCollection>(
      () => ({
        type: "FeatureCollection",
        features: pins.map((p) => ({
          type: "Feature",
          id: p.id,
          properties: { id: p.id },
          geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        })),
      }),
      [pins],
    );

    return (
      <MapLibreMap
        style={style}
        mapStyle={OSM_STYLE}
        logo={false}
        attribution
        accessibilityLabel={accessibilityLabel}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: [initialRegion.longitude, initialRegion.latitude],
            zoom: regionToZoom(initialRegion),
          }}
        />
        <GeoJSONSource
          id="federations"
          data={data}
          onPress={(e: { nativeEvent: { features?: GeoJSON.Feature[] } }) => {
            const id = e.nativeEvent.features?.[0]?.properties?.id;
            if (typeof id === "number") onPinPress(id);
          }}
        >
          <Layer
            id="federation-pins"
            type="circle"
            source="federations"
            paint={{
              "circle-radius": 7,
              "circle-color": themes.light.brand.accent,
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 2,
            }}
          />
        </GeoJSONSource>
      </MapLibreMap>
    );
  });
}

// Choisir l'implémentation une fois, défensivement. MapLibre n'est touché que sur
// Android ET uniquement quand son TurboModule est réellement présent dans le binaire —
// `.get()` (contrairement à `.getEnforcing()`) renvoie null au lieu de lever une exception.
function pickImplementation(): MapComponent {
  if (Platform.OS === "ios") return createAppleMap();
  if (
    Platform.OS === "android" &&
    TurboModuleRegistry.get("MLRNCameraModule") != null
  ) {
    return createMapLibreMap();
  }
  return FallbackMap;
}

export const FederationMap: MapComponent = pickImplementation();
