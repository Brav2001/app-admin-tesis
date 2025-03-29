import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";

const OrdersDetail = () => {
  const id = "Ordenes";
  return (
    <View style={styles.container}>
      <HeaderContainerCard id={id} />
      <Text style={styles.titleView}>Detalles del pedido</Text>
      <View>
        {/* Aquí irán los items del pedido*/}

        <TouchableOpacity>
          <View style={styles.orderItemContainer}>
            <View style={styles.orderDetails}>
              <Feather name="shopping-bag" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.orderNumber}># 17</Text>
              <Text style={styles.orderTime}>
                <Ionicons name="time-outline" size={24} color="#FFFFF" /> 8:50
              </Text>
            </View>
            <Text style={styles.orderButtonText}>
              <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  titleView: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 20,
  },
  itemContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
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

export default OrdersDetail;
