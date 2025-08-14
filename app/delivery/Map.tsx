import React, { useEffect, useMemo, useState } from "react";
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
import MapsCard from "@/components/general/MapsCard";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.MAP_API_KEY;

// === Tus datos de ejemplo ===
const data = [
  {
    id: "12345",
    address: "Calle 19A #9-08",
    receptor: "Juan",
    numberPhone: "3160435877",
    isValidate: false,
    indication: "calle ciega",
    latitude: 8.229234260676808,
    longitude: -73.34841776783851,
  },
  {
    id: "12346",
    address: "Parque central",
    receptor: "Un man",
    numberPhone: "3160435877",
    isValidate: false,
    indication: "en el parque",
    latitude: 8.235429733004436,
    longitude: -73.35387872339746,
  },
  {
    id: "12347",
    address: "Cancha del marabel",
    receptor: "Otro man",
    numberPhone: "3160435877",
    isValidate: false,
    indication: "calle ciega",
    latitude: 8.246368251818762,
    longitude: -73.35775388858092,
  },
];

// Orden rápido por distancia euclidiana (suficiente para demo)
const sortByDistance = (lat: number, lon: number, points: typeof data) => {
  return points
    .map((p) => ({
      ...p,
      distance: Math.hypot(p.latitude - lat, p.longitude - lon),
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
  points: typeof data;
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
        const m = new google.maps.Marker({
          position: pos,
          map,
          title: p.receptor + " - " + p.address,
        });
        bounds.extend(pos);

        m.addListener('click', () => {
          RNW && RNW.postMessage(JSON.stringify({type: 'marker_click', payload: p}));
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

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [orderedPoints, setOrderedPoints] = useState<typeof data>([]);
  const [selectedPoint, setSelectedPoint] = useState<
    (typeof data)[number] | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso para acceder a la ubicación fue denegado");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const currentLat = location.coords.latitude;
      const currentLon = location.coords.longitude;

      setLatitude(currentLat);
      setLongitude(currentLon);

      const sorted = sortByDistance(currentLat, currentLon, data);
      setOrderedPoints(sorted);

      setLoading(false);
    } catch (error: any) {
      setErrorMsg(error?.message || "Error al obtener ubicación");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <MapsCard title={""}>
        <HeaderContainerCard id={selectedPoint?.id || ""} />
      </MapsCard>

      {selectedPoint && (
        <MapsCard title={""}>
          <Link href={link} asChild>
            <TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
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
                  <View style={styles.containerTextDetail}>
                    <Text style={styles.detailTextTitle}>Indicación:</Text>
                    <Text style={styles.detailText}>
                      {selectedPoint.indication}
                    </Text>
                  </View>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.orderButtonText}>
                    <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </MapsCard>
      )}

      <MapsCard title={""} style={{ flex: 1 }}>
        {loading ? (
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
                    // Puedes loguear/mostrar toast si quieres
                    // console.log("MAP MSG:", msg);
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
  containerTextDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  detailTextTitle: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginRight: 5,
  },
  detailText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
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
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});

export default Map;
