import { View, Text, StyleSheet } from "react-native";

const OrdersDetail = () => {
  return (
    <View style={styles.container}>
      <Text>OrdersDetails</Text>
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

export default OrdersDetail;
