import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Header from "@/components/ordersInfo/HeaderCard";
import UserInfo from "@/components/ordersInfo/UserInfo";
import OrderList from "@/components/ordersInfo/OrdersList";
import MapButton from "@/components/general/MapButton";
import IsAvailableSwitch from "@/components/general/IsAvalaibleSwitch";
import {
  retrieveId,
  retrieveToken,
  saveActiveDelivery,
  retrieveActiveDelivery,
  retrieveGeofencingStart,
  saveGeofencingStart,
} from "@/utils/storageAuth";
import api from "@/utils/api";
import axios from "axios";
import { formatTimeDifference } from "@/utils/functions";
import { useStore } from "@/utils/store";

const DeliveryList = () => {
  const [orders, setOrders] = useState([]);
  const [setAddresses] = useStore((state) => [state.setAddresses]);
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

        if (response.status === 204) {
          return;
        }

        const data = response.data;

        const parsed = data.map((order) => ({
          orderNumber: order.OrderId?.slice(-6).toUpperCase() ?? "N/A",
          time: formatTimeDifference(order.createdAt) ?? "N/A",
          id: order.OrderId ?? "N/A",
        }));

        setOrders(parsed);

        const addressData = data.map((order) => {
          const address = order.Order.Address || {};

          return {
            id: order.OrderId,
            address: address.direction || "N/A",
            receptor: address.contactName || "N/A",
            numberPhone: address.contactPhone || "N/A",
            isValidate: address.verified || false,
            latitude: parseFloat(address.latitude || 0),
            longitude: parseFloat(address.longitude || 0),
          };
        });

        setAddresses(addressData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const intervalId = setInterval(fetchOrders, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <UserInfo ordersLength={orders.length} />
      <IsAvailableSwitch />
      <OrderList orders={orders} />
      {orders.length > 0 && <MapButton />}
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
