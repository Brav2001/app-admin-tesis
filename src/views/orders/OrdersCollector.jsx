import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/ordersInfo/HeaderCard";
import UserInfo from "../../components/ordersInfo/UserInfo";
import OrderList from "../../components/ordersInfo/OrdersList";

const OrdersCollector = () => {
  return (
    <View style={styles.container}>
      <Header />
      <UserInfo />
      <OrderList />
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

export default OrdersCollector;
