import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/utils/theme.js";
import HeaderContainerCard from "@/components/general/HeaderContainerCard";
import ProductList from "@/components/productInfo/productList";
import MainCard from "@/components/MainCard";
import { useLocalSearchParams } from "expo-router";

const OrdersDetail = () => {
  const { id: paramId } = useLocalSearchParams<{ id: string }>();
  const { time: paramTime } = useLocalSearchParams<{ time: string }>();
  const id =
    paramId || "7"; /* redireccionar a la pantalla orderList si no exite el id*/
  const time =
    paramTime ||
    "0"; /* redireccionar a la pantalla orderList si no exite el time*/

  return (
    <SafeAreaView style={styles.container}>
      <MainCard title={""}>
        <View style={styles.containerList}>
          <HeaderContainerCard id={id} />
          <Text style={styles.titleView}>Detalles del pedido</Text>
          <ProductList id={id} />
        </View>

        <Text style={styles.time}>{time}</Text>
      </MainCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundMain,
    paddingHorizontal: 15,
  },
  containerList: {
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  titleView: {
    fontSize: theme.fonts.sizes.bigtitle,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    textAlign: "center",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default OrdersDetail;
