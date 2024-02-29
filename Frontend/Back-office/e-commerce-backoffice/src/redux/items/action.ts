import { SELECT_ITEM } from "./types";
import { Item } from "../../utils/types";

export const selectItem = (item: Item) => {
  return {
    type: SELECT_ITEM,
    payload: item,
  };
};
