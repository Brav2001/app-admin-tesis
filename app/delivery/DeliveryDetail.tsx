import { View, Text, StyleSheet } from "react-native";

const DeliveryDetail = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Delivery Detail</Text>
    </View>
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
