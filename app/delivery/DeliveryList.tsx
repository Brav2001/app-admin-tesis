import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Header from "@/components/ordersInfo/HeaderCard";
import UserInfo from "@/components/ordersInfo/UserInfo";
import OrderList from "@/components/ordersInfo/OrdersList";
import MapButton from "@/components/general/MapButton";
import IsAvailableSwitch from "@/components/general/IsAvalaibleSwitch";
import { retrieveId, retrieveToken } from "@/utils/storageAuth";
import api from "@/utils/api";
import axios from "axios";
import { formatTimeDifference } from "@/utils/functions";

const DeliveryList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const id = await retrieveId();
        const token = await retrieveToken();
        const response = await axios.get(api.getOrdersByCourier(id), {
          headers: {
            "auth-token": token,
          },
        });

        const data = response.data;

        const parsed = data.map((order) => ({
          orderNumber: order.OrderId?.slice(-6).toUpperCase() ?? "N/A",
          time: formatTimeDifference(order.createdAt) ?? "N/A",
          id: order.OrderId ?? "N/A",
        }));

        setOrders(parsed);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <UserInfo ordersLength={orders.length} />
      <IsAvailableSwitch />
      <OrderList orders={orders} />
      <MapButton />
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

export default DeliveryList;
