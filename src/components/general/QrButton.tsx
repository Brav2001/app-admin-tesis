import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // o react-native-vector-icons

const QrButton = ({ id }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <View style={styles.outerBox}>
          <View
            style={[
              styles.innerBox,
              { backgroundColor: isPressed ? "#1C584B" : "#fff" },
            ]}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={70}
              color={isPressed ? "#fff" : "#044131"}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  outerBox: {
    backgroundColor: "#044131",
    borderRadius: 16,
    padding: 5,
  },
  innerBox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 5,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});

export default QrButton;
