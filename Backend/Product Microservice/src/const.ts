export const ERROR_401 = "ERROR_401";
export const ERROR_400 = "ERROR_400";

// export const productCategories = ["t-shirt", "hoodie", "hat", "necklace", "bracelet", "shoes", "pillow", "mug", "book", "puzzle", "cards"];
export const GET_PRODUCT = "GET /api/product/";
export const PUT_PRODUCT = "PUT /api/product/";
export const DELETE = "DELETE /api/product/";
export const CREATE_PRODUCT = "POST /api/product";
export const UPDATE_PRODUCT = "PUT /api/product/{id}";
export const REMOVE_PRODUCT = "DELETE /api/product/{id}";
export const UPDATE_PRIVILEGES = "PUT /api/permission";
export const PUT_PRODUCT_COMMENT = "PUT /api/product/comment";


export const GET_CART = "GET /api/cart/";
export const PUT_CART = "PUT /api/cart/";
export const DELETE_CART = "DELETE /api/cart/";  ///IF THE BODY IS EMPTY - DELETE THE ENTIRE CART, IF THE BODY IS NOT EMPTY - DELETE THE SPECIFIC PRODUCT
