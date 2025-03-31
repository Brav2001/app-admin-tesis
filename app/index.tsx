import { SafeAreaView, StyleSheet, View } from "react-native";
import { Link } from "expo-router";

import Login from "./auth/Login";
import OrdersCollector from "@/views/orders/OrdersCollector";
import OrdersDetail from "./collector/OrderDetail";
import OrdersList from "./collector/OrderList";
import theme from "@/utils/theme";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { useStore } from "@/utils/store";
import { retrieveAuth } from "@/utils/storageAuth";

SplashScreen.preventAutoHideAsync();

const Main = () => {
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
        {!logged && <OrdersList />}
        {dataStaff?.Rol?.name === "PACKER" && logged && <OrdersCollector />}
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
    padding: 15,
    backgroundColor: theme.colors.backgroundMain,
  },
});

export default Main;
