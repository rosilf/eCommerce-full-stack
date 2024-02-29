import { Item } from "../../utils/types";
//function to get a single Product frm Products array
export const getProductFromProducts = (Product: Item, Products: Item[]) => {
  let foundProduct = Products.find((i) => i.id === Product.id);
  return foundProduct ? foundProduct : null;
};
