import React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";
import theme from "../../utils/theme";
import { FontAwesome } from "@expo/vector-icons";
import { removeData } from "../../utils/storageAuth";
import { useStore } from "../../utils/store";
import { stopGeofencing } from "@/utils/geofencing";
import { inactiveStaff } from "@/utils/functions";

const Header = () => {
  const [ChangeLogged, dataStaff] = useStore((state) => [
    state.ChangeLogged,
    state.dataStaff,
  ]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = async () => {
    await inactiveStaff();
    await stopGeofencing();
    setModalVisible(false);
    removeData();
    ChangeLogged(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            backgroundColor: "#C3C3C3",
            paddingBottom: 5,
            borderRadius: 10,
            paddingRight: 5,
          }}
        >
          <Pressable style={styles.logoutButton} onPress={toggleModal}>
            <FontAwesome
              name="power-off"
              size={35}
              color={theme.colors.backgroundCards}
            />
          </Pressable>
        </View>

        <View style={styles.containerNameUser}>
          <Text style={styles.headerText}>
            {dataStaff?.name} {dataStaff?.lastName}
          </Text>
        </View>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cerrar sesión</Text>
          <Text style={styles.modalText}>
            ¿Estás seguro que deseas cerrar la sesión?
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={toggleModal}>
              <Text
                style={{
                  ...styles.buttonText,
                  color: theme.colors.backgroundMain,
                }}
              >
                Cancelar
              </Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Sí</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 0,
    alignItems: "center",
  },
  containerNameUser: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: theme.colors.backgroundCards,
    borderRadius: 10,
    marginLeft: 10,
  },

  logoutButton: {
    padding: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    aspectRatio: 1 / 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: theme.fonts.main,
    flex: 1,
    textAlign: "left",
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
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: theme.fonts.main,
    color: "#FFF",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  cancelButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
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
});

export default Header;
