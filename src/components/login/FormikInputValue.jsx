import { useField } from "formik";
import InputForm from "./InputForm";
import { StyleSheet, Text } from "react-native";
import theme from "../../utils/theme";

const FormikInputValue = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <>
      <InputForm
        value={field.value}
        onChangeText={(value) => helpers.setValue(value)}
        {...props}
      />
      {meta.error && <Text style={styles.error}>{meta.error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontFamily: theme.fonts.main,
    marginTop: -15,
  },
});

export default FormikInputValue;
