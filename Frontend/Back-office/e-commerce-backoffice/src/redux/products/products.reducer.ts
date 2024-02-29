// Redux Imports
import { AnyAction } from "redux";
import axios from 'axios';
import {gw} from '../../utils/api';
// Project Imports
import { Item, ProductsState } from "../../utils/types";
// import { ProductsData } from "../../sample/data";
import { PRODUCTS_ACTION_TYPES } from "./products.types";

const INITAIL_STATE = {
  fetchedProducts: false,
  productsFetching: false,
  products: [],
  selectedProduct: null,
};

export const fetchProducts = () => async (dispatch: any) => {
  try {
    dispatch({ type: PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_START });
    const response = await axios.get(gw+"product/",{ withCredentials: true});
    const products = response.data;
    dispatch({
      type: PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_SUCCESS,
      payload: products,
    });
  } catch (error) {
    dispatch({
      type: PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_FAILURE,
      payload: error,
    });
  }
};

export const productsReducer = (
  state = INITAIL_STATE,
  action: AnyAction
): ProductsState => {
  switch (action.type) {
    case PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_START:
      return {
        ...state,
        productsFetching: true,
        fetchedProducts: false,
        products: [],
      };
    case PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        productsFetching: false,
        fetchedProducts: true,
        products: action.payload,
      };
    case PRODUCTS_ACTION_TYPES.FETCH_PRODUCT_FAILURE:
      return {
        ...state,
        productsFetching: false,
        fetchedProducts: false,
        products: [],
      };
    case PRODUCTS_ACTION_TYPES.SET_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      };
    case PRODUCTS_ACTION_TYPES.ADD_NEW_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case PRODUCTS_ACTION_TYPES.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product: Item) => {
          if (product.id === action.payload.id) {
            return action.payload;
          }
          return product;
        }),
      };
    case PRODUCTS_ACTION_TYPES.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product: Item) => product.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
