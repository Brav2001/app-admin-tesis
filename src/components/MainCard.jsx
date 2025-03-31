import { StyleSheet, View, Text } from "react-native";
import theme from "../utils/theme";

const MainCard = ({ children, title = "" }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.backgroundSeccions,
    paddingHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    height: "auto",
    paddingVertical: 15,
  },
  title: {
    fontFamily: theme.fonts.main,
    fontSize: theme.fonts.sizes.title,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default MainCard;
