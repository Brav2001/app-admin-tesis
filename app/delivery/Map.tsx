import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import MainCard from "@/components/MainCard";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import PolylineDecoder from "@mapbox/polyline";
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.MAP_API_KEY;

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

const sortByDistance = (lat, lon, points) => {
  return points
    .map((point) => ({
      ...point,
      distance: Math.sqrt(
        Math.pow(point.latitude - lat, 2) + Math.pow(point.longitude - lon, 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};

const getGoogleRoute = async (origin, waypoints, destination) => {
  try {
    const waypointsStr = waypoints
      .map((point) => `${point.latitude},${point.longitude}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${waypointsStr}&key=${GOOGLE_API_KEY}`;

    console.log("URL de la API de Google Maps:", url);
    const response = await fetch(url);
    const json = await response.json();

    console.log(json);

    if (json.routes.length) {
      const points = PolylineDecoder.decode(
        json.routes[0].overview_polyline.points
      );
      const routeCoordinates = points.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));
      return routeCoordinates;
    } else {
      console.error("No se encontraron rutas");
      return [];
    }
  } catch (err) {
    console.error("Error al obtener ruta", err);
    return [];
  }
};

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderedPoints, setOrderedPoints] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso para acceder a la ubicación fue denegado");
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

      if (sorted.length > 0) {
        const origin = { latitude: currentLat, longitude: currentLon };
        const destination = {
          latitude: sorted[sorted.length - 1].latitude,
          longitude: sorted[sorted.length - 1].longitude,
        };
        const waypoints = sorted.slice(0, sorted.length - 1);

        const route = await getGoogleRoute(origin, waypoints, destination);
        setRouteCoordinates(route);
      }

      setLoading(false);
    } catch (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleMarkerPress = (item: object) => {
    setSelectedPoint(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={selectedPoint?.id || ""} />
        {
          //vamos a mostrar el detalle del punto seleccionado ( direccion, receptor, telefono)
          selectedPoint && (
            <View>
              <Text style={styles.detailText}>
                Dirección: {selectedPoint.address}
              </Text>
              <Text style={styles.detailText}>
                Receptor: {selectedPoint.receptor}
              </Text>
              <Text style={styles.detailText}>
                Teléfono: {selectedPoint.numberPhone}
              </Text>
              <Text style={styles.detailText}>
                Indicación: {selectedPoint.indication}
              </Text>
            </View>
          )
        }

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando ruta...</Text>
          </View>
        )}
        {!loading && (
          <View style={styles.containerMap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              {orderedPoints.map((item) => (
                <Marker
                  key={item.id}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={item.receptor}
                  description={item.address}
                  onPress={() => handleMarkerPress(item)}
                  image={require("../../assets/pin.png")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    overflow: "hidden",
                    borderWidth: 2,
                    borderColor: "#007AFF",
                  }}
                />
              ))}

              <Marker
                coordinate={{ latitude, longitude }}
                title={"Ubicación Actual"}
                pinColor={"#00FF00"}
                description={"Ubicación actual"}
              />

              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="#007AFF"
                />
              )}
            </MapView>
          </View>
        )}
      </MainCard>
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
  titleView: {
    fontSize: theme.fonts.sizes.bigtitle,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },

  containerMap: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
    marginRight: 0,
  },

  map: {
    flex: 1,
    width: "100%", // Ajusta este valor si deseas más o menos espacio
  },

  detailText: {
    fontSize: theme.fonts.sizes.subtitle,
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
    marginTop: 20,
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: theme.fonts.sizes.subtitle,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Map;
