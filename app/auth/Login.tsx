import { View, StyleSheet } from "react-native";

import LogoLogin from "@/components/login/LogoLogin";
import MainCard from "@/components/MainCard";
import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  return (
    <View style={styles.container}>
      <LogoLogin />
      <MainCard title={"Iniciar sesión"}>
        <LoginForm />
      </MainCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});

export default Login;
