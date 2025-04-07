import { StyleSheet, View, Text } from "react-native";
import theme from "../../utils/theme";

const CardInfo = ({ title = "", children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    backgroundColor: theme.colors.backgroundMain,
    marginBottom: 10,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: theme.colors.backgroundCards,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.title,
    fontWeight: "bold",
  },

  textContainer: {
    marginRight: 5,
  },
});

export default CardInfo;
