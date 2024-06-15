const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
const PORT = process.env.EXPO_PUBLIC_PORT;
const api = {
  auth: `${DOMAIN}${PORT}/authStaff/login`,
};

export default api;
