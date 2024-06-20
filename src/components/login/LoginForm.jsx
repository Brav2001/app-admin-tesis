import { View } from "react-native";
import InputForm from "./InputForm";
import ActionButton from "../ActionButton";
import { useState } from "react";
import axios from "axios";
import api from "../../utils/api";
import { useStore } from "../../utils/store";
import { storeData } from "../../utils/storageAuth";
import LoadingModal from "../LoadingModal.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [ChangeLogged] = useStore((state) => [state.ChangeLogged]);

  const handleLogin = () => {
    //validar datos antes de hacer login
    setLoading(true);

    axios
      .post(api.auth, { email, password })
      .then(async (res) => {
        setLoading(false);
        ChangeLogged(true);
        await storeData(res.data);
      })
      .catch(
        (err) => {
          setLoading(false);
          console.log(err);
        } //manejar errores con una alerta
      );
  };

  return (
    <View>
      <LoadingModal visible={loading} />
      <InputForm type={"text"} value={email} setValue={setEmail} />
      <InputForm type={"password"} value={password} setValue={setPassword} />
      <ActionButton title={"Ingresar"} onPress={handleLogin} />
    </View>
  );
};

export default LoginForm;
