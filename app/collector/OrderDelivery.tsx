import { View, StyleSheet, Text } from "react-native";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import QrButton from "@/components/general/QrButton";
import MainCard from "@/components/MainCard";
import { useLocalSearchParams } from "expo-router";

const data = {
  id: "1",
  basket: "1",
};

const OrderDelivery = () => {
  //recibimos el id por query params
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id = paramId || "7";
  return (
    <View style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={id} />
        <Text style={styles.titleView}>Detalles de la entrega</Text>
        <View style={styles.containerBasket}>
          <View style={styles.productItemCollected}>
            <View style={styles.textContainer}>
              <Text style={styles.productName}>
                Entregar en la canasta # {data.basket}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.qrContainer}>
          <QrButton />
        </View>
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

  containerBasket: {
    paddingBottom: 5,
    backgroundColor: theme.colors.backgroundMain,
    marginVertical: 10,
    borderRadius: 10,
  },

  productItemCollected: {
    backgroundColor: theme.colors.backgroundCards,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },

  productName: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.subtitle,
    fontWeight: "bold",
  },
  productWeigth: {
    color: theme.colors.textPrimary,
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fonts.sizes.paragraph,
  },

  textContainer: {
    marginRight: 5,
  },

  qrContainer: {
    flexGrow: 1, // Hace que el contenedor QR ocupe el espacio restante y empuje el botón al final
    justifyContent: "flex-end", // Asegura que el botón esté al final
    alignItems: "center", // Centra el botón
  },
});

export default OrderDelivery;
