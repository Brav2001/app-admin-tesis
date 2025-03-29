import BackButton from "@/components/general/BackButton";
import { View, Text, StyleSheet } from "react-native";

const HeaderContainerCard = ({ id }) => {
  return (
    <View style={styles.headerContainer}>
      <BackButton />
      <Text style={styles.textId}>{id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  textId: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HeaderContainerCard;
