import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ToggleSwitch from "toggle-switch-react-native";
import theme from "@/utils/theme.js";
import {
  saveActiveDelivery,
  retrieveActiveDelivery,
  retrieveGeofencingStart,
} from "@/utils/storageAuth";
import { startGeofencing, stopGeofencing } from "@/utils/geofencing";
import { inactiveStaff } from "@/utils/functions";
import Toast from "react-native-toast-message";

const IsAvailableSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    saveActiveDelivery(isEnabled ? "false" : "true");
    setIsEnabled((previousState) => !previousState);
  };

  const checkActiveDelivery = async () => {
    const activeDelivery = (await retrieveActiveDelivery()) || "false";
    if (activeDelivery == "true" || activeDelivery == "false") {
      setIsEnabled(activeDelivery == "true");
    } else {
      await saveActiveDelivery("false");
    }
  };

  useEffect(() => {
    checkActiveDelivery();
  }, []);

  useEffect(() => {
    const manageGeofencing = async () => {
      console.log("Gestionando geofencing, estado:", isEnabled);
      const geofencingStart = (await retrieveGeofencingStart()) || "false";
      console.log("Estado actual de geofencing:", geofencingStart);

      if (isEnabled) {
        // Solo iniciar si no está ya activo
        if (geofencingStart === "false") {
          console.log("Iniciando geofencing...");
          await startGeofencing();
        } else {
          console.log("Geofencing ya estaba activo");
        }
      } else {
        // Solo detener si está activo
        if (geofencingStart === "true") {
          console.log("Deteniendo geofencing...");
          await inactiveStaff();
          await stopGeofencing();
          Toast.show({
            type: "info",
            text1: "Ahora estás inactivo",
            text2: "No recibirás nuevas órdenes.",
            visibilityTime: 6000,
          });
        } else {
          console.log("Geofencing ya estaba inactivo");
        }
      }
    };

    manageGeofencing();
  }, [isEnabled]);

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
