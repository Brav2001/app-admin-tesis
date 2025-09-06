import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import MapsCard from "@/components/general/MapsCard";
import BackButton from "@/components/general/BackButton";
import theme from "@/utils/theme.js";
import OrderItem from "@/components/delivery/orderItem";
import { retrieveToken, retrieveId } from "@/utils/storageAuth";
import axios from "axios";
import api from "@/utils/api";
import Modal from "react-native-modal";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const OrderListForDirection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { latitude: paramLatitude } = useLocalSearchParams<{
    latitude: string;
  }>();
  const latitude = paramLatitude || "0";
  const { longitude: paramLongitude } = useLocalSearchParams<{
    longitude: string;
  }>();
  const longitude = paramLongitude || "0";

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleReleaseDelivery = async (): Promise<void> => {
    try {
      const token = await retrieveToken();

      if (!orders?.length) {
        Toast.show({
          type: "info",
          text1: "Nada que liberar",
          text2: "No hay órdenes en la lista.",
        });
        return;
      }

      Toast.show({
        type: "info",
        text1: "Liberando entrega",
        text2: "Por favor, espera...",
      });

      await Promise.all(
        orders.map((order) =>
          axios.put(api.releaseDelivery(order.id), null, {
            headers: { "auth-token": token },
          })
        )
      );

      Toast.show({
        type: "success",
        text1: "Entrega liberada",
        text2: "La entrega se ha liberado correctamente.",
      });
      router.replace("/");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error al liberar la entrega",
        text2: "Por favor, inténtalo de nuevo.",
      });
      console.error("Error al liberar la entrega:", err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await retrieveToken();
        const id = await retrieveId();
        const response = await axios.get(api.getOrderByDeliveryAndLocation(), {
          params: {
            staffId: id,
            latitude,
            longitude,
          },
          headers: {
            "auth-token": token,
          },
        });
        const parsed = response.data.orders.map((order) => ({
          id: order.id ?? "N/A",
          address: order.Address.direction ?? "N/A",
          receptor: order.Address.contactName ?? "N/A",
          numberPhone: order.Address.contactPhone ?? "N/A",
          isValidate: order.Address.verified ?? false,
        }));

        setOrders(parsed);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [latitude, longitude]);

  return (
    <SafeAreaView style={styles.container}>
      <MapsCard title={""}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerText}>
            Estos son los pedidos en esta dirección
          </Text>
        </View>
      </MapsCard>
      <MapsCard title={""} style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
          keyExtractor={(item) => item.id}
          style={styles.orderList}
        />
      </MapsCard>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: "#D9D9D9",
        }}
        onPress={toggleModal}
      >
        <Text style={styles.buttonText}>ENTREGAR TODOS</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Entregar todos los pedidos</Text>
          <Text style={styles.modalText}>
            Estás a punto de entregar todos los pedidos en esta dirección.
            Confirma si deseas continuar.
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={handleReleaseDelivery}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  color: theme.colors.backgroundMain,
                }}
              >
                Entregar
              </Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={toggleModal}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  headerText: {
    marginLeft: 8,
    color: "#bbb",
    fontSize: 14,
    fontStyle: "italic",
  },
  orderList: {
    width: "100%",
    flex: 1,
  },
  button: {
    borderRadius: 10, // Bordes redondeados
    paddingVertical: 12, // Espaciado interno vertical
    paddingHorizontal: 24, // Espaciado interno horizontal
    alignItems: "center", // Centrar el texto
    shadowColor: "#000", // Sombra negra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5,
    marginTop: 15, // Elevación para Android
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: theme.colors.backgroundCards,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: theme.fonts.main,
    color: "#FFF",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: theme.fonts.main,
    color: "#FFF",
    fontWeight: "normal",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: theme.colors.backgroundMain,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    textAlign: "center",
    color: "#FFF",
  },
});
export default OrderListForDirection;
