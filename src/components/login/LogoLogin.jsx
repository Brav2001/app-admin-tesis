import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import adaptiveIcon from "./../../../assets/adaptive-icon.png";
import theme from "../../utils/theme";

const LogoLogin = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={adaptiveIcon}
        contentFit="contain"
        transition={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundCards,
    width: "66%",
    aspectRatio: 1 / 1,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  image: {
    width: "135%",
    aspectRatio: 1 / 1,
    borderRadius: 1000,
  },
});

export default LogoLogin;
