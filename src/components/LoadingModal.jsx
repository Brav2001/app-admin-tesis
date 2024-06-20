import React from "react";
import { Modal, View, Image, StyleSheet, Text } from "react-native";
import theme from "../utils/theme";

const LoadingModal = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.containerIndicatorWrapper}>
          <Image
            source={require("../../assets/loadingGIF.gif")}
            style={styles.containerLoadingImage}
          />
          <Text style={styles.containerLoadingText}>Iniciando...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  containerIndicatorWrapper: {
    backgroundColor: theme.colors.backgroundCards,
    height: 150,
    width: 150,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  containerLoadingImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  containerLoadingText: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fonts.sizes.paragraph,
    color: "#053226",
  },
});

export default LoadingModal;
