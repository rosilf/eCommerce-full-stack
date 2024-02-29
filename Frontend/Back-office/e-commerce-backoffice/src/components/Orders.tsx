import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Order, StoreState } from "../utils/types";
import OrderItem from "./OrderItem";
import { fetchOrders } from "../redux/orders/orders.reducer";
import { useEffect } from "react";

export interface OrdersState {
  fetchedOrders: boolean;
  ordersFetching: boolean;
  orders: Array<Order>;
}
const Orders: React.FC = () => {
  const orders: Order[] = useSelector(
    (state: StoreState) => state.orders.orders
  );
  const dispatch = useDispatch();
  useEffect(() => {
    fetchOrders()(dispatch);
  }, [dispatch]);

  return (
    <div>
      {orders.map((order: Order) => (
        <OrderItem key={order.orderId} order={order} />
      ))}
    </div>
  );
};

export default Orders;
