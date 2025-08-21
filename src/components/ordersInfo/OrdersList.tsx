import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import OrderItem from "./OrderItem";
import theme from "../../utils/theme";
import MainCard from "../MainCard";

const OrderList = ({ orders }) => {
  return (
    <MainCard title={"PENDIENTES"}>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay órdenes pendientes</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
          keyExtractor={(item) => item.id}
          style={styles.orderList}
        />
      )}
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
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default OrderList;
