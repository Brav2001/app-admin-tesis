import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import theme from "../../utils/theme";
import { FontAwesome } from "@expo/vector-icons";

const OrderItem = ({ order }) => {
  const link = `delivery/DeliveryDetail?id=${order?.id || ""}`;

  return (
    <View style={styles.container}>
      <Link href={link} asChild>
        <TouchableOpacity style={styles.touchableCard}>
          <View style={styles.cardRow}>
            <View style={styles.cardContent}>
              {!order.isValidate && (
                <View style={styles.warningContainer}>
                  <FontAwesome
                    name="warning"
                    size={20}
                    color="#FFB300"
                    style={styles.warningIcon}
                  />
                  <Text style={styles.warningText}>
                    Esta dirección no ha sido verificada
                  </Text>
                </View>
              )}
              <View style={styles.containerTextDetail}>
                <Text style={styles.detailTextTitle}>Número:</Text>
                <Text style={styles.detailText}>
                  # {order.id.slice(-6).toUpperCase()}
                </Text>
              </View>
              <View style={styles.containerTextDetail}>
                <Text style={styles.detailTextTitle}>Dirección:</Text>
                <Text style={styles.detailText}>{order.address}</Text>
              </View>
              <View style={styles.containerTextDetail}>
                <Text style={styles.detailTextTitle}>Receptor:</Text>
                <Text style={styles.detailText}>{order.receptor}</Text>
              </View>
              <View style={styles.containerTextDetail}>
                <Text style={styles.detailTextTitle}>Teléfono:</Text>
                <Text style={styles.detailText}>{order.numberPhone}</Text>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <FontAwesome name="arrow-right" size={30} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundMain,
    marginBottom: 15,
    borderRadius: 10,
  },
  containerTextDetail: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // evita que se corte el texto
  },
  detailTextTitle: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    marginRight: 5,
  },
  arrowContainer: {
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  detailText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    flexShrink: 1, // evita desbordamiento
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    flexShrink: 1,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    borderLeftWidth: 4,
    borderLeftColor: "#FFB300",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    gap: 6, // espacio vertical entre bloques
  },
  touchableCard: {
    backgroundColor: "#1E1E1E", // Oscuro elegante
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
});

export default OrderItem;
