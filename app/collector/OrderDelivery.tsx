import { use, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import QrButton from "@/components/general/QrButton";
import MainCard from "@/components/MainCard";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import api from "@/utils/api";
import { useStore } from "@/utils/store";
import Toast from "react-native-toast-message";
import { retrieveToken } from "@/utils/storageAuth";

const OrderDelivery = () => {
  const [deliveryId, setDeliveryId] = useState(null);
  const [deliveryName, setDeliveryName] = useState(null);
  const [loading, setLoading] = useState(true);
  const { qr, clearQR } = useStore();

  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id = paramId || "7";

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get(api.getDeliveryInformation(id), {
          headers: {
            "auth-token": await retrieveToken(),
          },
        });
        setDeliveryId(response.data.destination.id);
        setDeliveryName(response.data.destination.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, [id]);

  useEffect(() => {
    if (qr && deliveryId) {
      if (qr == deliveryId) {
        clearQR();
        axios
          .put(api.releaseCollector(id), {
            headers: {
              "auth-token": retrieveToken(),
            },
          })
          .then(() => {
            Toast.show({
              type: "success",
              text1: "Orden entregada",
              text2: "Orden entregado correctamente!",
            });
            router.back();
          })
          .catch((error) => {
            console.error("Error releasing collector:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "No se pudo liberar al recolector.",
            });
          });

        Toast.show({
          type: "error",
          text1: "Error",
          text2: "El código QR no coincide con la entrega esperada.",
        });

        clearQR();
      }
    }
  }, [qr, clearQR, deliveryId]);

  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        {loading ? (
          <Text style={styles.titleView}>Cargando...</Text>
        ) : (
          <>
            <HeaderContainerCard id={id} />
            <Text style={styles.titleView}>Detalles de la entrega</Text>
            <View style={styles.containerBasket}>
              <View style={styles.productItemCollected}>
                <View style={styles.textContainer}>
                  <Text style={styles.productName}>Entregar a:</Text>
                  <Text style={styles.productName}>
                    {deliveryName || "No disponible"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.qrContainer}>
              <QrButton />
            </View>
          </>
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
