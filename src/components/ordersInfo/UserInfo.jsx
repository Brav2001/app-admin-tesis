import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import theme from "../../utils/theme";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useStore } from "../../utils/store";
import Modal from "react-native-modal";
import QrCode from "react-native-qrcode-svg";

const UserInfo = ({ ordersLength }) => {
  const [dataStaff] = useStore((state) => [state.dataStaff]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <View style={styles.userInfoContainer}>
      <View style={styles.infoBox}>
        <FontAwesome6 name="clipboard-user" size={30} color="#FFFFFF" />
        <Text style={styles.infoText}>
          {dataStaff?.Rol?.name === "PACKER" && "RECOLECTOR"}
          {dataStaff?.Rol?.name === "COURIER" && "Repartidor"}
        </Text>
      </View>
      <View style={styles.infoBox}>
        <MaterialCommunityIcons
          name="clipboard-list-outline"
          size={36}
          color="#FFFFFF"
        />
        <Text style={styles.infoText}>{ordersLength}</Text>
      </View>
      {dataStaff?.Rol?.name === "COURIER" && (
        <Pressable style={styles.infoBox} onPress={toggleModal}>
          <MaterialIcons name="qr-code-scanner" size={30} color="#FFFFFF" />
          <Text style={styles.infoText}>MI QR</Text>
        </Pressable>
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Muestre este Qr para recibir un pedido
          </Text>
          {dataStaff?.id ? (
            <View style={styles.qrContainer}>
              <QrCode
                value={dataStaff.id} // El valor que contendrá el QR
                size={200} // Tamaño del QR
                color="#000000" // Color del QR
                backgroundColor="#FFFFFF" // Fondo
              />
            </View>
          ) : (
            <Text style={styles.modalText}>No se encontró ID de usuario</Text>
          )}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.confirmButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    justifyContent: "space-between",
    gap: 10,
  },
  infoBox: {
    maxWidth: "45%",
    backgroundColor: theme.colors.backgroundCards,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.paragraph,
  },
  modalContainer: {
    backgroundColor: theme.colors.backgroundCards,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: theme.fonts.main,
    marginBottom: 10,
    fontFamily: theme.fonts.main,
    color: "#FFF",
    textAlign: "center",
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontFamily: theme.fonts.main,
    color: "#FFF",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: theme.colors.backgroundMain,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: theme.fonts.main,
  },

  qrContainer: {
    backgroundColor: "#FFF", // Fondo blanco para mejor contraste
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default UserInfo;
