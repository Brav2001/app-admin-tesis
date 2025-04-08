import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useStore } from "@/utils/store";

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const { setQR } = useStore();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View />; // Mientras se carga la info de permisos
  }

  if (!permission.granted) {
    return <View style={styles.container} />; // Pantalla vacía mientras se piden permisos
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    setQR(data); // Guarda en el store
    router.back(); // Vuelve a la pantalla anterior
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
