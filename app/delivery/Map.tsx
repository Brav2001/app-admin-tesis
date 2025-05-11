import { View, Text, StyleSheet } from "react-native";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import MainCard from "@/components/MainCard";
import MapView, { Marker } from "react-native-maps";

// const { width, height } = Dimensions.get("window");
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
const Map = () => {
  const handleMarkerPress = (id) => {
    console.log(`Marcador con ID ${id} presionado`);
  };

  return (
    <View style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={""} />
        <Text style={styles.titleView}>MAPA</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 4.60971, // Bogotá por ejemplo
            longitude: -74.08175,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {data.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.receptor}
              description={item.address}
              onPress={() => handleMarkerPress(item.id)}
            />
          ))}
        </MapView>
      </MainCard>
    </View>
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

  map: {
    width: "100%",
    aspectRatio: 1 / 1.7, // Ajusta este valor si deseas más o menos espacio
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default Map;
