import { combineReducers } from 'redux';
import { itemsReducer } from './items/reducer';
import { userReducer } from './user/reducer';
import { orderReducer } from './order/reducer';

export const rootReducer = combineReducers({
    items: itemsReducer,
    user: userReducer,
    order: orderReducer,
});