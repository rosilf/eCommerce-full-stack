import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { protectedRout } from "./auth.js";
import { ERROR_401, ERROR_400, GET_PRODUCT ,productCategories, UPDATE_PRODUCT, PUT_PRODUCT, DELETE} from "./const.js";
import Products from "./models/products.js";
import Users from "./models/Users.js";

const exampleData = {
  title: "This is a nice example!",
  subtitle: "Good Luck! :)",
};

export const createRoute = (url: string, method: string) => {
  return `${method} ${url}`;
};

export const getProduct = (route, req, res) => {
  const param = route.replace(GET_PRODUCT, "");
  if(productCategories.find(elm => elm === param))
  {
    //thats a GET /api/product/{type} kind of request
    // now the param is the suitacle type (hat/t-shirt,etc.)
    familyProductRoute(param,req,res);
  }
  else{
    //thats a GET /api/product/{id} kind of request
    // now the param is the id
    //notice: if the param is not a valid ID, (can't find in db) we need to return 404 not found
    //that way we handle also the scenario GET /api/product/{type} when {type} is not a valid category
    getProductRoute(param,req,res);
  }
}

export const getProductRoute = async (id, req, res) => {
  const user = await protectedRout(req, res, "A M W");
  if (user !== ERROR_401) {
    res.setHeader("Content-Type", "application/json" );
    const product_id = id;
    const dbRes = await Products.findOne({id: id });
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
      {id:dbRes.id, 
      name:dbRes.name, 
      category: dbRes.category,
      description: dbRes.description,
      price: dbRes.price,
      stock: dbRes.stock,
      image: dbRes.image}));
    res.end();
}
};

export const familyProductRoute = async (category, req, res) => {
  const user = await protectedRout(req, res, "A M W");
  if (user !== ERROR_401){
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json")
    //let data = [];
    const dbRes = await Products.find({category: category});
    //data.push(dbRes);
    let arr = [];
    dbRes.forEach(elm => arr.push({id:elm.id, 
      name:elm.name, 
      category: elm.category,
      description: elm.description,
      price: elm.price,
      stock: elm.stock,
      image: elm.image}));

    res.write(JSON.stringify(arr));
    res.end();
  }
};

export const createProductRoute = async (req, res) => {
  const user = await protectedRout(req, res, "A M");
  if(user !== ERROR_401){
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
  }
  };

export const updateProductRoute = async(route, req, res) =>{
  const user = await protectedRout(req, res, "A M");
  if (user !== ERROR_401) {
    res.setHeader("Content-Type", "application/json");
    const id = route.replace(PUT_PRODUCT, "");
    const dbRes = await Products.findOne({id: id });
    if(dbRes == null){
      res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: id not exist",
            })
          );
          return;
    }
    const goal_product = await Products.findOne({id: id });
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
        await Products.updateOne({id: id}, { price: updated.price });
      }
      if(updated.stock){
        if(!isStockIntegar(updated,res)){return;}
        await Products.updateOne({id: id}, { stock: updated.stock });
      }
      if(updated.category){
        if(!isValidCategory(updated,res)){return;}
        await Products.updateOne({id: id}, { category: updated.category });
      }
      if(updated.name){
        if(!isNameString(updated, res)){return;}
        await Products.updateOne({id: id}, { name: updated.name });
      }
      if(updated.description){
        if(!isDescriptionString(updated, res)){return;}
        await Products.updateOne({id: id}, { description: updated.description });
      }
      if(updated.image){
        if(!isImageString(updated, res)){return;}
        await Products.updateOne({id: id}, { image: updated.image });
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
}

export const removeProductRoute = async(route, req, res) =>{
  const user = await protectedRout(req, res, "A");
  if (user !== ERROR_401) {
    res.setHeader("Content-Type", "application/json");
    const id = route.replace(DELETE, "");
    const check_if_exist = await Products.findOne({id: id});
    if (check_if_exist == null) {
      res.statusCode = 204;
      res.end();
    }
    else {
      res.statusCode = 200;
      const to_delete = await Products.findOneAndDelete({id: id});
      res.end();}
}};

export const updatePrivilegeRoute = async (req, res) => {
  const user = await protectedRout(req, res, "A");
  if(user !== ERROR_401){
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      // Parse request body as JSON
      try{
        const data = JSON.parse(body);
        if(!data.username || !data.permission){
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "username and permission cannot be empty!",
            })
          );
          return;
        }
        if(data.permission != "W" && data.permission != "M"){
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "invalid field permission",
            })
          );
          return;
        }
        await Users.updateOne({ username: data.username }, {permission: data.permission});
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            message: "Premission updated",
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
};


const createNewProduct = (body, res) =>{
  try{
    const product = JSON.parse(body);
    if(!validCreatProductBody(product, res)) {return ERROR_400;}
    const id = String(randomUUID());
    let prod;
    if(product.image){
      if(!isImageString(product, res)){return ERROR_400;}
      prod = new Products({
        id: id,
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
        id: id,
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

const isValidCategory = (product, res) =>{
  // category should be one of the following : t-shirt, hoodie, hat, necklace, bracelet, shoes, pillow, mug, book, puzzle, or cards.
  if(productCategories.find(elm => elm === product.category))
  {
      return true;
  }
  else{
    const message="category should be one of the following : t-shirt, hoodie, hat, necklace, bracelet, shoes, pillow, mug, book, puzzle, or cards.";
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: message,
      })
    );
    return false;
  }
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
  if(!createProductMandatoryFields(product, res) || !isValidCategory(product, res) || !isPriceNumber(product,res) ||
   !isStockIntegar(product, res) || !isNameString(product, res) || !isDescriptionString(product, res)){
    return false;
  }
  return true;
}
