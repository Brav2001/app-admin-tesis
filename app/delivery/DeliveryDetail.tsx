import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import MainCard from "@/components/MainCard";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import ProductList from "@/components/delivery/productList";
import Modal from "react-native-modal";
import theme from "@/utils/theme.js";
import axios from "axios";
import api from "@/utils/api";
import { retrieveToken } from "@/utils/storageAuth";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

const DeliveryDetail = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const id =
    paramId || "7"; /* redireccionar a la pantalla orderList si no exite el id*/
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addressId, setAddressId] = useState("");
  const router = useRouter();

  const getCurrentCoords = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }

    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      throw new Error("LOCATION_SERVICES_DISABLED");
    }

    let pos = await Location.getLastKnownPositionAsync();
    if (!pos) {
      pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    }

    const { latitude, longitude, accuracy } = pos.coords;
    return { latitude, longitude, accuracy };
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleVerifyAddress = async () => {
    const token = await retrieveToken();

    const response = await axios.get(api.getAddressByOrderId(id), {
      headers: { "auth-token": token },
    });
    const addressVerified = response.data.data.Address.verified;
    setAddressId(response.data.data.Address.id);
    if (addressVerified) {
      await handleReleaseDelivery();
    } else {
      toggleModal();
    }
  };

  const handleUpdateAddress = async () => {
    const token = await retrieveToken();
    const { latitude, longitude } = await getCurrentCoords();
    console.log({
      id: addressId,
      latitude,
      longitude,
    });

    await axios
      .put(
        api.updateAddress(),
        { id: addressId, latitude, longitude },
        {
          headers: { "auth-token": token },
        }
      )
      .then(async (res) => {
        Toast.show({
          type: "success",
          text1: "Dirección actualizada",
          text2: "La dirección se ha actualizado correctamente.",
        });
        await handleReleaseDelivery();
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Error al actualizar la dirección",
          text2: "Por favor, inténtalo de nuevo.",
        });
        console.error("Error al actualizar la dirección:", err);
      });
  };

  const handleReleaseDelivery = async () => {
    const token = await retrieveToken();
    axios
      .put(api.releaseDelivery(id), { headers: { "auth-token": token } })
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "Entrega liberada",
          text2: "La entrega se ha liberado correctamente.",
        });
        router.replace("/");
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Error al liberar la entrega",
          text2: "Por favor, inténtalo de nuevo.",
        });
        console.error("Error al liberar la entrega:", err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <HeaderContainerCard id={id} />
        <Text style={styles.titleView}>Detalles del pedido</Text>
        <ProductList id={id} />
        <View style={styles.checkContainer}>
          <Text style={styles.textCheck}>
            Confirma que el pedido esta listo antes de entregar
          </Text>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
          />
        </View>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: !isChecked ? "#6a6a6a" : "#D9D9D9",
          }} // Cambia el color del botón según el estado del checkbox
          disabled={!isChecked}
          onPress={handleVerifyAddress}
        >
          <Text style={styles.buttonText}>ENTREGAR</Text>
        </TouchableOpacity>
      </MainCard>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Verificar dirección</Text>
          <Text style={styles.modalText}>
            Te gustaría verificar esta dirección antes de continuar?
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={toggleModal}>
              <Text
                style={{
                  ...styles.buttonText,
                  color: theme.colors.backgroundMain,
                }}
              >
                Entregar
              </Text>
            </Pressable>
            <Pressable
              style={styles.confirmButton}
              onPress={handleUpdateAddress}
            >
              <Text style={styles.cancelButtonText}>Entregar y verificar</Text>
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
  },
  titleView: {
    fontSize: theme.fonts.sizes.bigtitle,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  checkContainer: {
    flexDirection: "row", // Texto a la izquierda, checkbox a la derecha
    alignItems: "center",
    justifyContent: "flex-end", // Todo alineado a la derecha del contenedor
    width: "100%",
    paddingHorizontal: 20,
    gap: 10, // Espacio entre el texto y el checkbox
  },
  textCheck: {
    fontSize: 16,
    color: "#fff",
    textAlign: "right", // Alinea el contenido del texto a la derecha
    flexShrink: 1, // Permite que el texto se ajuste si no cabe
  },
  checkbox: {
    borderColor: "#fff",
    backgroundColor: theme.colors.primary,
    width: 35, // Tamaño fijo para evitar problemas
    aspectRatio: 1,
    borderRadius: 10,
  },
  button: {
    // Color de fondo gris claro
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

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    textAlign: "center",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.main,
    textAlign: "center",
    color: "#FFF", // mismo color que ya usabas
  },

  confirmButtonText: {
    color: "#FFF", // ya usas blanco en el modal; solo corrige contraste
  },
});

export default DeliveryDetail;
