import { AnyAction } from "redux";
import { OrdersState, Order } from "../../utils/types";
import { ORDERSS_ACTION_TYPES } from "./orders.types";
import axios from 'axios'
import {gw} from '../../utils/api';

const INITAIL_STATE = {
  fetchedOrders: false,
  ordersFetching: false,
  orders: [],
  selectedProduct: null,
};

export const fetchOrders = () => async (dispatch: any) => {
  try {
    dispatch({ type: ORDERSS_ACTION_TYPES.FETCH_ORDER_START });
    const response = await axios.get(gw+"order/",{ withCredentials: true});
    const orders = response.data;
    dispatch({
      type: ORDERSS_ACTION_TYPES.FETCH_ORDER_SUCCESS,
      payload: orders,
    });
  } catch (error) {
    dispatch({
      type: ORDERSS_ACTION_TYPES.FETCH_ORDER_FAILURE,
      payload: error,
    });
  }
};

export const ordersRedcuer = (
  state = INITAIL_STATE,
  action: AnyAction
): OrdersState => {
  switch (action.type) {
    case ORDERSS_ACTION_TYPES.FETCH_ORDER_START:
      return {
        ...state,
        fetchedOrders: false,
        ordersFetching: true,
        orders: [],
      };
      case ORDERSS_ACTION_TYPES.FETCH_ORDER_SUCCESS:
        return {
          ...state,
          ordersFetching: false,
          fetchedOrders: true,
          orders: action.payload,
        };
        case ORDERSS_ACTION_TYPES.FETCH_ORDER_FAILURE:
          return {
            ...state,
            ordersFetching: false,
            fetchedOrders: false,
            orders: [],
          };
     case ORDERSS_ACTION_TYPES.CHANGE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map((order: Order) => {
          if (order.orderId === action.payload) {
            return {
              ...order,
              status: "delivered",
            };
          }
          return order;
        }),
      };
    default:
      return state;
  }
};