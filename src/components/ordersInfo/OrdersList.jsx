import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import OrderItem from "./OrderItem";
import theme from "../../utils/theme";
import MainCard from "../MainCard";

const orders = [
  { id: "1", orderNumber: "34565778", time: "25 minutos" },
  { id: "2", orderNumber: "34565778", time: "25 minutos" },
  { id: "3", orderNumber: "34565778", time: "25 minutos" },
  { id: "4", orderNumber: "34565778", time: "25 minutos" },
];

const OrderList = () => {
  return (
    <MainCard title={"PENDIENTES"}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderItem order={item} />}
        keyExtractor={(item) => item.id}
        style={styles.orderList}
      />
    </MainCard>
  );
};

const styles = StyleSheet.create({
  orderListContainer: {
    width: "90%",
    marginVertical: 10,
  },
  orderListTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderList: {
    width: "100%",
  },
});

export default OrderList;
