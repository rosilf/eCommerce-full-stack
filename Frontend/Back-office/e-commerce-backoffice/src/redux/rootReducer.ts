import { combineReducers } from "redux";
import { ordersRedcuer } from "./orders/orders.reducer";
import { productsReducer } from "./products/products.reducer";
import { userReducer } from './user/reducer';

const rootReducer = combineReducers({
  products: productsReducer,
  user: userReducer,
  orders: ordersRedcuer,
});

export default rootReducer;
