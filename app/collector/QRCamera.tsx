import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStore } from "@/utils/store";
import theme from "@/utils/theme";

export default function ScanScreen() {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [scanAreaHeight, setScanAreaHeight] = useState(0);
  const [scanned, setScanned] = useState(false);
  const { setQR } = useStore();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>("back");

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setQR(data);
    router.back();
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#333", marginTop: 50, textAlign: "center" }}>
          Solicitando permiso de cámara...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        <View style={styles.viewContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Escanea el código QR</Text>
          </View>

          {/* Marco QR */}
          <View style={styles.qrFrame}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={styles.qrRow}>
                {[0, 1, 2].map((col) => {
                  const index = row * 3 + col;
                  const borderStyle = qrBorders[index] || {};
                  return (
                    <View
                      key={col}
                      style={[styles.qrCell, styles.qrBorderStyle, borderStyle]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          {/* Línea de escaneo */}
          <View
            style={styles.scanLineContainer}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setScanAreaHeight(height);
            }}
          >
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanLineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, scanAreaHeight],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Botón de cancelar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const qrBorders = [
  // Fila 1
  { borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  {},
  { borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  // Fila 2
  {},
  {},
  {},
  // Fila 3
  { borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  {},
  { borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewContainer: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -150 }],
    backgroundColor: "#b00020",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 300,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  qrFrame: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "transparent",
  },
  qrRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  qrCell: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  qrBorderStyle: {
    borderColor: "#fff",
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundCards,
  },
  scanLineContainer: {
    width: "60%",
    aspectRatio: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "35.5%",
    alignSelf: "center",
  },
});
