import BackButton from "@/components/general/BackButton";
import { View, Text, StyleSheet } from "react-native";

const HeaderContainerCard = ({ id }) => {
  return (
    <View style={styles.headerContainer}>
      <BackButton />
      <Text style={styles.textId}>{id.slice(-6).toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
  },
  textId: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HeaderContainerCard;
