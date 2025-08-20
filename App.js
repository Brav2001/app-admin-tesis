import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Main from "./src/views/Main";
import "src/utils/geofencing";
import * as Notifications from "expo-notifications";

export default function App() {
  return (
    <View style={styles.container}>
      <Main />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
