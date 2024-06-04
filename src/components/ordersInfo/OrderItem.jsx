import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import theme from "../../utils/theme";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";

const OrderItem = ({ order }) => {
  return (
    <View style={styles.orderItemContainer}>
      <View style={styles.orderDetails}>
        <Feather name="shopping-bag" size={40} color="#FFFFFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.orderNumber}># {order.orderNumber}</Text>
        <Text style={styles.orderTime}>
          <Ionicons name="time-outline" size={24} color="#FFFFF" /> {order.time}
        </Text>
      </View>
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>
          <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItemContainer: {
    backgroundColor: theme.colors.backgroundCards,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  orderDetails: {
    flexDirection: "column",
  },
  orderNumber: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.paragraph,
    fontWeight: "bold",
  },
  orderTime: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.paragraph,
  },
  // orderButton: {
  //   backgroundColor: theme.colors.backgroundMain,
  //   padding: 10,
  //   borderRadius: 10,
  // },
  orderButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  textContainer: {
    marginRight: 5,
  },
});

export default OrderItem;
