import { View, Text, StyleSheet, Dimensions } from "react-native";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import MainCard from "@/components/MainCard";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const Map = () => {
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
          <Marker
            coordinate={{ latitude: 4.60971, longitude: -74.08175 }}
            title="Ubicación de ejemplo"
            description="Aquí puedes poner más info"
          />
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
    height: height * 0.4, // Ajusta este valor si deseas más o menos espacio
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default Map;
