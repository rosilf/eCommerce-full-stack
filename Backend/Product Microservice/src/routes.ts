import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { ERROR_401, ERROR_400, GET_PRODUCT ,PUT_PRODUCT_COMMENT, UPDATE_PRODUCT, PUT_PRODUCT, DELETE, GET_CART, PUT_CART, DELETE_CART} from "./const.js";
import Products from "./models/products.js";
import Cart from "./models/cart.js";

export const createRoute = (url: string, method: string) => {
  return `${method} ${url}`;
};

export const getProduct = (route, req, res) => {
  const id = route.replace(GET_PRODUCT, "");
  if("" === id)
  {
    //thats a GET /api/product/ request get all products
    allProductRoute(req,res);
  }
  else{
    //thats a GET /api/product/{id} kind of request
    // now the param is the id
    //notice: if the param is not a valid ID, (can't find in db) we need to return 404 not found
    //that way we handle also the scenario GET /api/product/{type} when {type} is not a valid category
    getProductRoute(id,req,res);
  }
}

export const getProductRoute = async (id, req, res) => {
    res.setHeader("Content-Type", "application/json" );
    const product_id = id;
    const dbRes = await Products.findById(id);
    if(dbRes == null){
      res.statusCode = 404;
          res.end(
            JSON.stringify({
              message: "not found",
            })
          );
          return;
    }
    res.statusCode = 200;
    res.write(JSON.stringify(
      {id:dbRes._id, 
      name:dbRes.name, 
      category: dbRes.category,
      description: dbRes.description,
      price: dbRes.price,
      stock: dbRes.stock,
      image: dbRes.image,
      comments: dbRes.comments}));
    res.end();
};

export const getCommentsRoute = async(id, req, res) =>{
  
}


export const allProductRoute = async (req, res) => {
    console.log("all product route");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    //let data = [];
    const dbRes = await Products.find();
    console.log("db quired for all products");
    //data.push(dbRes);
    let arr = [];
    dbRes.forEach(elm => arr.push({
      id:elm._id, 
      name:elm.name, 
      category: elm.category,
      description: elm.description,
      price: elm.price,
      stock: elm.stock,
      image: elm.image,
      comments: elm.comments
    }));
    res.write(JSON.stringify(arr));
    res.end();
};

export const createProductRoute = async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      // Parse request body as JSON
      const prod = createNewProduct(body, res);
      if(prod !== ERROR_400){
        await prod.save();
        res.statusCode = 201;
        res.write(JSON.stringify({id : prod.id,}));
        res.end();
      }
    });
  };

export const updateProductRoute = async(route, req, res) =>{
    res.setHeader("Content-Type", "application/json");
    const id = route.replace(PUT_PRODUCT, "");
    const dbRes = await Products.findById(id);
    if(dbRes == null){
      res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: id not exist",
            })
          );
          return;
    }
    const goal_product = await Products.findById(id);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      // Parse request body as JSON
      try{
      const updated = JSON.parse(body);
      if(updated.price){
        if(!isPriceNumber(updated,res)){return;}
        await Products.updateOne({_id: id}, { price: updated.price });
      }
      if(updated.stock){
        if(!isStockIntegar(updated,res)){return;}
        await Products.updateOne({_id: id}, { stock: updated.stock });
        // await Products.updateById(id, { stock: updated.stock });
      }
      if(updated.category){
        await Products.updateOne({_id: id}, { category: updated.category });
        // await Products.updateById(id, { category: updated.category });
      }
      if(updated.name){
        if(!isNameString(updated, res)){return;}
        await Products.updateOne({_id: id}, { name: updated.name });
        // await Products.updateById(id, { name: updated.name });
      }
      if(updated.description){
        if(!isDescriptionString(updated, res)){return;}
        await Products.updateOne({_id: id}, { description: updated.description });
        // await products.updateById(id, { description: updated.description });
      }
      if(updated.image){
        if(!isImageString(updated, res)){return;}
        await Products.updateOne({_id: id}, { image: updated.image });
        // await Products.findByIdAndUpdate(id, { image: updated.image });
      }
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          id: id,
        })
        );
      } catch(e){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Error Invalid Json",
          })
        );
      }
    });
}

export const updateProductCommentRoute = async(route, req, res) =>{
  res.setHeader("Content-Type", "application/json");
  const id = route.replace(PUT_PRODUCT_COMMENT+"/", "");
  console.log(id);
  const dbRes = await Products.findById(id);
  if(dbRes == null){
    res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Bad request: id not exist",
          })
        );
        return;
  }
  const goal_product = await Products.findById(id);
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    // Parse request body as JSON
    try{
    const updated = JSON.parse(body);
    if(updated.comment){
      //if(!isImageString(updated, res)){return;}
      let comment_array = goal_product.comments;
      comment_array.push(updated.comment);
      await Products.updateOne({_id: id}, { comments: comment_array });
    }
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        id: id,
      })
      );
    } catch(e){
      console.log(e);
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: "Error Invalid Json",
        })
      );
    }
  });
}

export const removeProductRoute = async(route, req, res) =>{
    res.setHeader("Content-Type", "application/json");
    const id = route.replace(DELETE, "");
    const check_if_exist = await Products.findById(id);
    if (check_if_exist == null) {
      res.statusCode = 204;
      res.end();
    }
    else {
      res.statusCode = 200;
      const to_delete = await Products.findOneAndDelete({_id: id});
      res.end();}
};

const createNewProduct = (body, res) =>{
  try{
    const product = JSON.parse(body);
    // if(!validCreatProductBody(product, res)) {return ERROR_400;}
    // const id = String(randomUUID());
    let prod;
    if(product.image){
      if(!isImageString(product, res)){return ERROR_400;}
      prod = new Products({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image       
      });
    }
    else{
      prod = new Products({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    }
    return prod;
  }
  catch(e){
    res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: "Error Invalid Json",
        })
      );
      return ERROR_400;
  }
}

export const getCartRoute = async (route, req, res) => {
  //this api call get the cart of the user with the username in the route
  //the route is /cart/username
  //the cart is an array of objects with the following structure:
  // {product: product_id, name: product_name, quantity: quantity , price: product_price*quantity}
  // if the cart contains deleted product, this function will not return them and delete them from the cart
    res.setHeader("Content-Type", "application/json" );
    const username = route.replace(GET_CART, "");
    const dbRes = await Cart.findOne({ username: username });
    if(dbRes == null){
      res.statusCode = 404;
          res.end(
            JSON.stringify({
              message: "not found",
            })
          );
          return;
    }
    if(dbRes.items.length == 0){
      res.statusCode = 200;
      res.write(JSON.stringify([]));
      res.end();}

    await clearDeletedProducts(username);
    const cart = await Cart.findOne({username: username});
    const itemsPromises = cart.items.map(async (elm) => {
      return await createItem(elm.product, elm.quantity, username);
    });
    
    const arr = await Promise.all(itemsPromises);
    console.log(arr);

    console.log(arr); 
    res.statusCode = 200;
    res.write(JSON.stringify(arr));
    res.end();
};

export const getProductFromDB = async (productId) => {
  const product = await Products.findById(productId);
  if (product == null) {
    return null;
  }
  return product;
}

const clearDeletedProducts = async (username) => {
  const cart = await Cart.findOne({username: username});
  const itemsPromises = cart.items.map(async (elm) => {
    return await getProductFromDB(elm.product);
  });
  const products = await Promise.all(itemsPromises);
  const items = cart.items.filter((item, index) => products[index] !== null);
  await Cart.updateOne({username: username}, {items: items});
}

const createItem = async (productId, quantity, username) => {
  const product = await getProductFromDB(productId);
  return {
    product: product.id,
    name: product.name,
    quantity: quantity,
    price: product.price*quantity,};
}

export const updateCartRoute = async(route, req, res) =>{
  //this req allows user to add product to cart
  //if the product is already in the cart, update the quantity
  //if the product is not in the cart, add the product to the cart
  //if the product is not in the product list, return 400
  //the expected body is {id: "product id", quantity: "quantity"}
  //return the updated cart
    res.setHeader("Content-Type", "application/json");
    const username = route.replace(PUT_CART, "");
    const cart = await Cart.findOne({ username: username });
    if(cart == null){
      res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: user does not have a cart",
            })
          );
          return;
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      // Parse request body as JSON
    try{
      const updates = JSON.parse(body);
      if(!updates.id){
        res.statusCode = 400;
        res.end( 
          JSON.stringify({
            message: "Bad request: productId not exist",
          })
        );
        return;}
      if(!updates.quantity){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Bad request: quantity not exist",
          })
        );
        return;
      }

      let UpdatedItems = [];
      let items = cart.items;
      let product_exist = false;
      items.forEach((element, index) => {
        if(element.product.toString() === updates.id){
          // update an existing product in cart
          items[index].quantity = updates.quantity;
          product_exist = true;
      }});
      if(!product_exist){
        const product = await Products.findById(updates.id);
        if(product == null){
          res.statusCode = 400;
          res.end(
            JSON.stringify({ 
              message: "Bad request: product does not exist",
            })
          );
          return;
        }
        // add a new product to cart
        items.push({product: product._id, quantity: updates.quantity});
      }

      await Cart.updateOne({username: username}, {items: items});
      const UpdatedCart = await Cart.findOne({ username: username });
      //return the updated cart
      res.statusCode = 200;
      res.write(JSON.stringify(UpdatedCart));
      res.end();
      
      } 
      catch(e){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Error Invalid Json",
          })
        );
      }});
}

export const removeCartRoute = async(route, req, res) =>{
  //the expected body is {id: "product id"}
  //return the updated cart
    res.setHeader("Content-Type", "application/json");
    const username = route.replace(DELETE_CART, "");
    const cart = await Cart.findOne({username: username});
    // console.log(cart);
    if (cart == null) {
      res.statusCode = 204;
      res.end();
    }
    else {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // req.on("data", (chunk) => {
      //   body += chunk.toString();
      // });
      
      req.on("end", async () => {
      // Parse request body as JSON
      // let items = cart.items;
      //delete the product from the cart
      const data =  JSON.parse(body);
      const productId = data.id;

      //find the product in the cart items and delete it
      const theItems = cart.items;
      // let compareToString = "new ObjectId("+productId+")";
      const index = theItems.findIndex(elm => elm.product.toString() === productId);
      if(index !== -1){
        theItems.splice(index, 1);
      }
      await Cart.updateOne({username: username}, {items: theItems});
      const UpdatedCart = await Cart.findOne({ username: username });
      // const items = cart.items.filter((item, index) => products[index] !== null);
      // await Cart.updateOne({username: username}, {items: items});


      res.statusCode = 200;
      res.write(JSON.stringify(UpdatedCart));
      res.end();
    });
};};

const createProductMandatoryFields= (product, res)=>{
  // check that all the mandatory field exists in the body of the request: id, name, category, description, price, stock 
  if(!product.name || !product.category || !product.description || !product.price || !product.stock){
    const message="name, category, description, price and stock cannot be empty!";
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
  return true;
}

const isPriceNumber = (product, res) => {
    //  price should be between 0-1000 and type Number (2.5 or 2 but not "2") otherwise res status shold be 400 Bad request!
    if(typeof(product.price) != "number" || product.price < 0 || product.price > 1000){  
      const message = "price should be number between 0-1000"
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: message,
        })
      );
      return false;
    }
    return true;
}

const isStockIntegar = (product, res) =>{
   // stock should be Integer only (2 but not 2.5 and not "2") otherwise res status should be 400 Bad request!
   if(!Number.isInteger(product.stock) || product.stock < 0 ){  
    const message = "stock should be Positive Integer"
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
  return true;  
}

const isDescriptionString = (product, res) =>{
  if(typeof(product.description) != "string" )
  {
    const message = "description should be string"
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
  return true;
}

const isNameString = (product, res) =>{
  if(typeof(product.name) != "string" )
  {
    const message = "name should be string"
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
  return true;
}

const isImageString = (product, res) =>{
  if(typeof(product.image) != "string" )
  {
    const message = "image should be string"
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
  return true;
}


const validCreatProductBody = (product, res) => {
  if(!createProductMandatoryFields(product, res) || !isPriceNumber(product,res) ||
   !isStockIntegar(product, res) || !isNameString(product, res) || !isDescriptionString(product, res)){
    return false;
  }
  return true;
}
