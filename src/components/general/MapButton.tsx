import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";

const MapButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/delivery/Map`);
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.container}
      >
        <View style={styles.outerBox}>
          <View
            style={[
              styles.innerBox,
              { backgroundColor: isPressed ? "#1C584B" : "#fff" },
            ]}
          >
            <Entypo
              name="map"
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
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10, // Asegura que esté por encima de otros elementos
  },
});

export default MapButton;
