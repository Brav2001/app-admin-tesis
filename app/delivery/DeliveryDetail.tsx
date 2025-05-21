import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DeliveryDetail = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "white" }}>Delivery Detail</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});

export default DeliveryDetail;
