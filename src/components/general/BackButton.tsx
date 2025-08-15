import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.back()}>
      <AntDesign name="caretleft" size={28} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    marginLeft: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default BackButton;
