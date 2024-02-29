import { Item } from "../../utils/types";
import { PRODUCTS_ACTION_TYPES } from "./products.types";
import axios from "axios";

export const SetSelectedProduct = (product: Item | null) => ({
  type: PRODUCTS_ACTION_TYPES.SET_SELECTED_PRODUCT,
  payload: product,
});

export const addNewProduct = (product: Item) => ({
  type: PRODUCTS_ACTION_TYPES.ADD_NEW_PRODUCT,
  payload: product,
});

export const updateProduct = (product: Item) => ({
  type: PRODUCTS_ACTION_TYPES.UPDATE_PRODUCT,
  payload: product,
});

export const deleteProduct = (product: Item) => ({
  type: PRODUCTS_ACTION_TYPES.DELETE_PRODUCT,
  payload: product.id,
});
