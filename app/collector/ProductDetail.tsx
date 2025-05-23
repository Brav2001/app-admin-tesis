import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import MainCard from "@/components/MainCard";
import CardInfo from "@/components/general/CardInfo";
import { useLocalSearchParams } from "expo-router";
import QrButton from "@/components/general/QrButton";
import { useStore } from "@/utils/store";
import { useEffect } from "react";

const ProductDetail = () => {
  const { qr, clearQR } = useStore();
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id =
    paramId || "7"; /* redireccionar a la pantalla orderList si no exite el id*/
  const data = {
    name: "Papa",
    weigth: "1kg",
    image:
      "https://olimpica.vtexassets.com/arquivos/ids/765776-800-450?v=637806525173900000&width=800&height=450&aspect=true",
    aisle: "A1",
    shelve: "B2",
    level: "C3",
    basket: "D4",
  };

  useEffect(() => {
    if (qr) {
      // Aquí puedes manejar el QR escaneado
      console.log("QR escaneado:", qr);
      clearQR(); // Limpia el QR después de usarlo
    }
  }, [qr, clearQR]);
  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={id} />
        <Text style={styles.titleView}>Detalles del producto</Text>
        <Image source={{ uri: data.image }} style={styles.image} />
        <CardInfo title={data.name}>
          <Text style={styles.infoText}>{data.weigth}</Text>
          <Text style={styles.infoText}>Pasillo: {data.aisle}</Text>
          <Text style={styles.infoText}>Estante: {data.shelve}</Text>
          <Text style={styles.infoText}>Nivel: {data.level}</Text>
          <Text style={styles.infoText}>Canasta: {data.basket}</Text>
        </CardInfo>
        <QrButton />
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
  },
  titleView: {
    fontSize: theme.fonts.sizes.bigtitle,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  infoText: {
    color: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fonts.sizes.subtitle,
    marginTop: 5,
  },
});

export default ProductDetail;
