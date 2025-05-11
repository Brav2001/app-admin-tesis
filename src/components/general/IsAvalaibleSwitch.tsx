import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import theme from "@/utils/theme.js";

const IsAvailableSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  return (
    <View style={styles.container}>
      <ToggleSwitch
        isOn={isEnabled}
        onColor={theme.colors.backgroundCards}
        offColor="#717171"
        label="¿Estás disponible?"
        labelStyle={styles.labelStyle}
        size="medium"
        onToggle={() => toggleSwitch()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 20,
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  labelStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: theme.fonts.sizes.paragraph,
  },
});

export default IsAvailableSwitch;
