import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import theme from "../../utils/theme";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import { retrieveRol } from "@/utils/storageAuth";

const OrderItem = ({ order }) => {
  const [link, setLink] = useState("");
  useEffect(() => {
    const getLink = async () => {
      const rol = await retrieveRol();
      const link =
        rol === "PACKER"
          ? `collector/OrderDetail?id=${order.id}&time=${order.time}`
          : `delivery/DeliveryDetail?id=${order.id}&time=${order.time}`;

      setLink(link);
    };

    getLink();
  }, [order]);

  return (
    <View style={styles.container}>
      <Link href={link} asChild>
        <TouchableOpacity>
          <View style={styles.orderItemContainer}>
            <View style={styles.orderDetails}>
              <Feather name="shopping-bag" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.orderNumber}># {order.orderNumber}</Text>
              <Text style={styles.orderTime}>
                <Ionicons name="time-outline" size={24} color="#FFFFF" />{" "}
                {order.time}
              </Text>
            </View>
            <Text style={styles.orderButtonText}>
              <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    backgroundColor: theme.colors.backgroundMain,
    marginBottom: 5,
    borderRadius: 10,
  },
  orderItemContainer: {
    backgroundColor: theme.colors.backgroundCards,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
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
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fonts.sizes.paragraph,
  },
  orderButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  textContainer: {
    marginRight: 5,
  },
});

export default OrderItem;
