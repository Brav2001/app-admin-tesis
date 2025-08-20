import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Login from "./auth/Login";
import OrdersCollector from "@/views/orders/OrdersCollector";
import DeliveryList from "./delivery/DeliveryList";
import theme from "@/utils/theme";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { useStore } from "@/utils/store";
import { retrieveAuth } from "@/utils/storageAuth";
import * as Notifications from "expo-notifications";
import "src/utils/geofencing";

SplashScreen.preventAutoHideAsync();

const Main = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  const [logged, ChangeLogged, dataStaff] = useStore((state) => [
    state.logged,
    state.ChangeLogged,
    state.dataStaff,
  ]);

  const [fontsLoaded, fontError] = useFonts({
    Courier: require("@/assets/fonts/Courier-Prime.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permisos de notificación no concedidos");
      }
    }
    const res = await retrieveAuth();
    ChangeLogged(res && dataStaff);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaView style={styles.containerSafe}>
        {!logged && <Login />}
        {dataStaff?.Rol?.name === "PACKER" && logged && <OrdersCollector />}
        {dataStaff?.Rol?.name === "COURIER" && logged && <DeliveryList />}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: theme.colors.backgroundMain,
  },
  containerSafe: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.backgroundMain,
  },
});

export default Main;
