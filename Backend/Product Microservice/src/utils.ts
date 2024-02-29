import Products from "./models/products.js";
import Cart from "./models/cart.js";

export const updateProductStock = async (message: string) => {
  const { products, quantities } = JSON.parse(message);
  for(let i = 0; i<products.length; i++){
    const productId = products[i];
    const quantity = quantities[i];
    console.log(productId, quantity);
  try {
    const product = await Products.findOne({id: productId});
    console.log("found product");
    await Products.updateOne({id: productId}, { stock:product.stock - quantity });
    console.log("updated product");
    } catch (error) {
    console.error(error);
    }
}};

export const clearCart = async (msg : string) => {
  const { username } = JSON.parse(msg);
  try {
      const cart = await Cart.findOne({ username: username });
      if (!cart) {
          return;
      }
      await  Cart.updateOne({username: username}, {items: []});
  } catch (error) {
      console.error(error);
  }
};

export const createNewCart = async (msg : string) => {
  const { username } = JSON.parse(msg);
  let cart;
    cart = new Cart({
    username: username,
    items: [],
  });
  try {
    await cart.save();
    console.log("created new cart for user: " + username);
  } catch (error) {
    console.error(error);
  }
}; 