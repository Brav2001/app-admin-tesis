import { Slot } from "expo-router";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message"; // <-- Importa Toast
import "../src/utils/geofencing"; // <-- Importa geofencing
import * as Notifications from "expo-notifications";

export default function Layout() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#4BB543",
          backgroundColor: "#ffffff",
          borderRadius: 10,
          paddingVertical: 10,
        }}
        text1Style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#000",
        }}
        text2Style={{
          fontSize: 16,
          color: "#333",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#FF3333",
          backgroundColor: "#fff",
          borderRadius: 10,
          paddingVertical: 10,
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#000",
        }}
        text2Style={{
          fontSize: 14,
          color: "#333",
        }}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: "#3b82f6",
          backgroundColor: "#ffffff",
          borderRadius: 10,
          paddingVertical: 10,
        }}
        text1Style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#000",
        }}
        text2Style={{
          fontSize: 16,
          color: "#333",
        }}
      />
    ),
  };
  return (
    <>
      <Slot />
      <Toast config={toastConfig} />
    </>
  );
}
