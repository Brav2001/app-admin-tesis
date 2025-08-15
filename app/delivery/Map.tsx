import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import BackButton from "@/components/general/BackButton";
import MapsCard from "@/components/general/MapsCard";
import { useStore } from "@/utils/store";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.MAP_API_KEY;

type Address = {
  id: string;
  address: string;
  receptor: string;
  numberPhone: string;
  isValidate: boolean;
  latitude: number;
  longitude: number;
};

type AddressWithDistance = Address & { distance: number };

const Map = () => {
  const [addresses] = useStore((state) => [state.addresses]);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [orderedPoints, setOrderedPoints] = useState<AddressWithDistance[]>([]);
  const [selectedPoint, setSelectedPoint] =
    useState<AddressWithDistance | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  const sortByDistance = (
    lat: number,
    lon: number,
    points: Address[]
  ): AddressWithDistance[] => {
    return points
      .map((p) => ({
        ...p,
        distance: Math.hypot(
          Number(p.latitude) - lat,
          Number(p.longitude) - lon
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  };

  // HTML del mapa (Google Maps JS + Directions)
  const buildMapHtml = ({
    apiKey,
    origin,
    waypoints,
    destination,
    points,
  }: {
    apiKey: string;
    origin: { latitude: number; longitude: number } | null;
    waypoints: Array<{ latitude: number; longitude: number }>;
    destination: { latitude: number; longitude: number } | null;
    points: AddressWithDistance[];
  }) => {
    // serializamos datos para JS del WebView
    const jsPoints = JSON.stringify(points);
    const jsOrigin = JSON.stringify(origin);
    const jsDestination = JSON.stringify(destination);
    const jsWaypoints = JSON.stringify(waypoints);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .gmnoprint a, .gmnoprint span, .gm-style-cc { display: none; }
  </style>
  <script>
    // Envía errores a RN para depurar
    window.onerror = function(msg, url, line, col, err){
      if(window.ReactNativeWebView){
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'error', msg, url, line, col}));
      }
    };
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
</head>
<body>
  <div id="map"></div>

  <script>
    const RNW = window.ReactNativeWebView;
    const points = ${jsPoints};
    const origin = ${jsOrigin};
    const destination = ${jsDestination};
    const waypoints = ${jsWaypoints};

    function toLatLng(p){ return {lat: p.latitude, lng: p.longitude}; }

    function init(){
      const startCenter = origin ? toLatLng(origin) :
        (points.length ? toLatLng(points[0]) : {lat: 4.60971, lng: -74.08175});

      const map = new google.maps.Map(document.getElementById('map'), {
        center: startCenter,
        zoom: 13,
        clickableIcons: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      });

      // Markers de puntos
      const bounds = new google.maps.LatLngBounds();
      points.forEach(p => {
        const pos = toLatLng(p);

        const normalIcon = {
          url: "data:image/png;base64,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", // ruta o base64
          scaledSize: new google.maps.Size(35, 50),
        }

        const bigIcon = {
          url: "data:image/png;base64,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", // ruta o base64
          scaledSize: new google.maps.Size(45.5, 65),
        }

        const m = new google.maps.Marker({
          position: pos,
          map,
          title: p.receptor + " - " + p.address,
          icon: normalIcon
        });
        bounds.extend(pos);

        


        m.addListener('click', () => {
          RNW && RNW.postMessage(JSON.stringify({type: 'marker_click', payload: p}));
          m.setIcon(bigIcon);

          setTimeout(() => {
            m.setIcon(normalIcon);
          }, 2000);
        });
      });
      

      // Marker de origen (ubicación actual)
      if(origin){
        const om = new google.maps.Marker({
          position: toLatLng(origin),
          map,
          title: 'Ubicación actual',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6
          }
        });
        bounds.extend(toLatLng(origin));
      }

      // Directions
      if(origin && destination){
        const ds = new google.maps.DirectionsService();
        const dr = new google.maps.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeWeight: 4 } });

        const gWaypoints = (waypoints || []).map(w => ({ location: toLatLng(w), stopover: true }));

        ds.route({
          origin: toLatLng(origin),
          destination: toLatLng(destination),
          waypoints: gWaypoints,
          optimizeWaypoints: true,     // Google puede reordenar para mejor ruta
          travelMode: google.maps.TravelMode.DRIVING
        }, (res, status) => {
          if(status === 'OK'){
            dr.setDirections(res);
            // Ajustamos bounds a la ruta
            const route = res.routes[0];
            const legs = route.legs || [];
            const b = new google.maps.LatLngBounds();
            legs.forEach(l => {
              b.extend(l.start_location);
              b.extend(l.end_location);
            });
            if(!b.isEmpty()) map.fitBounds(b);
          }else{
            RNW && RNW.postMessage(JSON.stringify({type:'directions_error', status}));
            // Si falla, al menos ajustamos a bounds de markers
            if(!bounds.isEmpty()) map.fitBounds(bounds);
          }
        });
      } else {
        if(!bounds.isEmpty()) map.fitBounds(bounds);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  </script>
</body>
</html>`;
  };

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso para acceder a la ubicación fue denegado");
        setLoading(false);
        return;
      }

      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // cada 5 segundos
          distanceInterval: 5, // o cada 5 metros de cambio
        },
        (location) => {
          const { latitude: currentLat, longitude: currentLon } =
            location.coords;

          setLatitude(currentLat);
          setLongitude(currentLon);

          if (addresses?.length > 0) {
            const sorted = sortByDistance(currentLat, currentLon, addresses);
            setOrderedPoints(sorted);
          }
        }
      );

      setLoading(false);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error al obtener ubicación");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setErrorMsg("No hay direcciones disponibles");
      setLoading(false);
      return;
    }

    handleGetLocation();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [addresses]);

  // Prepara datos para el WebView
  const origin = latitude && longitude ? { latitude, longitude } : null;
  const destination = useMemo(() => {
    if (!orderedPoints.length) return null;
    return {
      latitude: orderedPoints[orderedPoints.length - 1].latitude,
      longitude: orderedPoints[orderedPoints.length - 1].longitude,
    };
  }, [orderedPoints]);

  const waypoints = useMemo(() => {
    if (!orderedPoints.length) return [];
    return orderedPoints.slice(0, orderedPoints.length - 1).map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
    }));
  }, [orderedPoints]);

  const mapHtml = useMemo(() => {
    return buildMapHtml({
      apiKey: GOOGLE_API_KEY || "",
      origin,
      waypoints,
      destination,
      points: orderedPoints,
    });
  }, [GOOGLE_API_KEY, origin, waypoints, destination, orderedPoints]);

  const link = `delivery/DeliveryDetail?id=${selectedPoint?.id || ""}`;

  useEffect(() => {
    console.log(selectedPoint);
  }, [selectedPoint]);

  return (
    <SafeAreaView style={styles.container}>
      <MapsCard title={""}>
        {selectedPoint ? (
          <HeaderContainerCard id={selectedPoint.id} />
        ) : (
          <View style={styles.emptyHeader}>
            <BackButton />
            <Text style={styles.emptyHeaderText}>
              Selecciona un pedido en el mapa para ver detalles
            </Text>
          </View>
        )}
      </MapsCard>

      {selectedPoint && (
        <MapsCard title={""}>
          <Link href={link} asChild>
            <TouchableOpacity style={styles.touchableCard}>
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  {!selectedPoint.isValidate && (
                    <View style={styles.warningContainer}>
                      <FontAwesome
                        name="warning"
                        size={20}
                        color="#FFB300"
                        style={styles.warningIcon}
                      />
                      <Text style={styles.warningText}>
                        Esta dirección no ha sido verificada
                      </Text>
                    </View>
                  )}
                  <View style={styles.containerTextDetail}>
                    <Text style={styles.detailTextTitle}>Dirección:</Text>
                    <Text style={styles.detailText}>
                      {selectedPoint.address}
                    </Text>
                  </View>
                  <View style={styles.containerTextDetail}>
                    <Text style={styles.detailTextTitle}>Receptor:</Text>
                    <Text style={styles.detailText}>
                      {selectedPoint.receptor}
                    </Text>
                  </View>
                  <View style={styles.containerTextDetail}>
                    <Text style={styles.detailTextTitle}>Teléfono:</Text>
                    <Text style={styles.detailText}>
                      {selectedPoint.numberPhone}
                    </Text>
                  </View>
                </View>
                <View style={styles.arrowContainer}>
                  <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </MapsCard>
      )}

      <MapsCard title={""} style={{ flex: 1 }}>
        {loading && addresses.length > 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando mapa...</Text>
            {!!errorMsg && (
              <Text
                style={[styles.loadingText, { fontSize: 14, opacity: 0.7 }]}
              >
                {errorMsg}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.containerMap}>
            <WebView
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              geolocationEnabled
              style={styles.map}
              source={{ html: mapHtml }}
              onMessage={(e) => {
                try {
                  const msg = JSON.parse(e.nativeEvent.data);
                  if (msg.type === "marker_click") {
                    setSelectedPoint(msg.payload);
                  } else if (
                    msg.type === "error" ||
                    msg.type === "directions_error"
                  ) {
                    setErrorMsg(
                      `Error al cargar mapa: ${msg.status || "Desconocido"}`
                    );
                  }
                } catch {}
              }}
            />
          </View>
        )}
      </MapsCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundMain,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  containerMap: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 0,
  },
  map: {
    flex: 1,
    width: "100%",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.colors.backgroundMain,
    borderRadius: 12,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  orderButtonText: {
    color: "#FFFFFF",
  },

  touchableCard: {
    backgroundColor: "#1E1E1E", // Oscuro elegante
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardRow: {
    flexDirection: "row",
    gap: 12,
  },

  cardContent: {
    flex: 1,
    gap: 6, // espacio vertical entre bloques
  },

  arrowContainer: {
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    borderLeftWidth: 4,
    borderLeftColor: "#FFB300",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },

  warningIcon: {
    marginRight: 8,
  },

  warningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    flexShrink: 1,
  },

  containerTextDetail: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // evita que se corte el texto
  },

  detailTextTitle: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginRight: 5,
  },

  detailText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    flexShrink: 1, // evita desbordamiento
  },

  emptyHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  emptyHeaderText: {
    marginLeft: 8,
    color: "#bbb",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Map;
