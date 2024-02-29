import { GOTO_CHECKOUT } from "./types";
import { CartItem } from "../../utils/types";

export const gotoCheckout = (items: CartItem[]) => {
  return {
    type: GOTO_CHECKOUT,
    payload: items,
  };
};
