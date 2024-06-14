import React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";
import theme from "../../utils/theme";
import { FontAwesome } from "@expo/vector-icons";

const Header = ({ name, onLogout }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = () => {
    setModalVisible(false);
    onLogout();
  };
  return (
    <View>
      <View style={styles.container}>
        <Pressable style={styles.logoutButton} onPress={toggleModal}>
          <FontAwesome
            name="power-off"
            size={40}
            color={theme.colors.backgroundCards}
          />
        </Pressable>
        <Text style={styles.headerText}>JUAN SEBASTIAN BAUTISTA</Text>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cerrar sesión</Text>
          <Text style={styles.modalText}>
            ¿Estás seguro que deseas cerrar la sesión?
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: theme.colors.backgroundCards,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 10,
  },

  logoutButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "20%",
    height: "70",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.main,
    flex: 1,
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
    fontWeight: theme.fonts.main,
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  cancelButton: {
    backgroundColor: "red",
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
  },
});

export default Header;
