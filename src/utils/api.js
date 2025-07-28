const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
const PORT = process.env.EXPO_PUBLIC_PORT;
const api = {
  auth: `${DOMAIN}${PORT}/authStaff/loginMobile`,
  getOrderByCollector: (id) =>
    `${DOMAIN}${PORT}/order_staff/getOrdersByCollector/${id}`,
  getOrderProductAllDetail: (id) =>
    `${DOMAIN}${PORT}/order_product/getProductsByOrderId/${id}`,
  getOneOrderProductDetail: (id) =>
    `${DOMAIN}${PORT}/order_product/getOneProductByOrderId/${id}`,
  collectProductOrder: (id) =>
    `${DOMAIN}${PORT}/order_product_basket/collectProductFromBasket/${id}`,
};

export default api;
