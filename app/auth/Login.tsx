import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";

import LogoLogin from "@/components/login/LogoLogin";
import MainCard from "@/components/MainCard";
import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  const keyboardOffset = Platform.select({ ios: 0, android: 0 });
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <LogoLogin />
          <MainCard title={"Iniciar sesión"}>
            <LoginForm />
          </MainCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  flex: { flex: 1, width: "100%" },
  content: {
    flexGrow: 1,
    padding: 0,
    alignItems: "center",
  },
});

export default Login;
