import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email no es valido")
    .required("Email es requerido"),

  password: yup.string().min(2).max(100).required("Contraseña es requerido"),
});

export default loginSchema;
