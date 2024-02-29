import { ORDERSS_ACTION_TYPES } from "./orders.types";

// action to change order status
export const changeOrderStatus = (orderId: string) => ({
  type: ORDERSS_ACTION_TYPES.CHANGE_ORDER_STATUS,
  payload: orderId,
});
