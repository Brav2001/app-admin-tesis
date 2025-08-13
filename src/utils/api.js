const DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
const api = {
  auth: `${DOMAIN}/authStaff/loginMobile`,
  getOrderByCollector: (id) =>
    `${DOMAIN}/order_staff/getOrdersByCollector/${id}`,
  getOrderProductAllDetail: (id) =>
    `${DOMAIN}/order_product/getProductsByOrderId/${id}`,
  getOneOrderProductDetail: (id) =>
    `${DOMAIN}/order_product/getOneProductByOrderId/${id}`,
  collectProductOrder: (id) =>
    `${DOMAIN}/order_product_basket/collectProductFromBasket/${id}`,
  getDeliveryInformation: (id) =>
    `${DOMAIN}/order_staff/getDeliveryInformation/${id}`,
  releaseCollector(id) {
    return `${DOMAIN}/order_staff/releaseCollector/${id}`;
  },
  getOrdersByCourier: (id) => `${DOMAIN}/order_staff/getOrdersByCourier/${id}`,
};

export default api;
