import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { protectedRout } from "./auth.js";
import { GET_SPACE, POST, GET, PUT, ERROR_401, ERROR_400, GET_PRODUCT , PUT_PRODUCT, DELETE_PRODUCT, DELETE} from "./const.js";
import { sendRequest } from "./utils.js";
import {PRODUCTCART_MICROSERVICE, ORDER_MICROSERVICE } from "./index.js";
export const createRoute = (url: string, method: string) => {
  return `${method} ${url}`;
};

export const getProductRoute = async (url, req, res) => {
  // const user = await protectedRout(req, res, "U A M W");
  // if (user !== ERROR_401) {
    const apiPath = url.replace(GET_SPACE, "");
    console.log("the path is "+ apiPath);
    try{
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + apiPath, GET);
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
      console.log(err);
    }
  // }
};

// export const familyProductRoute = async (category, req, res) => {
//   const user = await protectedRout(req, res, "A M W");
//   if (user !== ERROR_401){
//     //TODO: Send API REQ GET product/{type} to Product microservice
//   }
// };

export const createProductRoute = async (req, res) => {
  const user = await protectedRout(req, res, "A M");
  if(user !== ERROR_401){
    //TODO: Send API REQ POST product to Product microservice
    console.log("the path is "+ req.url);
    try{
      console.dir(req.body);
      console.log("the body is "+ JSON.stringify(req.body));
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, POST, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  }
  };

export const updateProductRoute = async(req, res) =>{
  const user = await protectedRout(req, res, "A M");
  if (user !== ERROR_401) {
    console.log("the path is "+ req.url);
    try{
      console.log("the body is "+ JSON.stringify(req.body));
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, PUT, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  }
}

export const removeProductRoute = async(req, res) =>{
  const user = await protectedRout(req, res, "A");
  if (user !== ERROR_401){
    // console.log("the path is "+ req.url);
    try{
      // console.log("the body is "+ req.body);
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, DELETE);
      // const data = await microservice_res.json();
      // console.log("the data is "+ data);
      if(microservice_res.status >=300){
        const data = await microservice_res.json();
        res.status(microservice_res.status).json(data);
        return;
      }
      res.status(microservice_res.status).json(microservice_res);
    }
    catch(err){
      console.log("the error is "+ err);
      res.status(500).json({message: "Internal server error"});
    }
    
  }
    
};

export const updateProductCommentRoute = async (req, res) => {
  const user = await protectedRout(req, res, "A M W U");
  if(user !== ERROR_401){
    try{  
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, PUT, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  }
};

export const getCartRoute = async (req, res) => {
  // const user = await protectedRout(req, res, "U A M W");
  // if (user !== ERROR_401) {
    try{
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, GET);
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"}); 
    }
  }
// };

export const updateCartRoute = async (req, res) => {
  // const user = await protectedRout(req, res, "U A M W");
  // if (user !== ERROR_401) {
    try{
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, PUT, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  // }
};

export const removeCartRoute = async (req, res) => {
  const user = await protectedRout(req, res, "U A M W");
  if (user !== ERROR_401) {
    try{
      let microservice_res = await sendRequest(PRODUCTCART_MICROSERVICE + req.url, DELETE, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  }
};

export const getOrderRoute = async (req, res) => {
  const user = await protectedRout(req, res, "U A M W");
  if (user !== ERROR_401) {
    try{
      let microservice_res = await sendRequest(ORDER_MICROSERVICE + req.url, GET);
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  }
};

export const updateOrderRoute = async(req, res) => {
  const user = await protectedRout(req, res, "A M W");
  if (user !== ERROR_401) {
    console.log("the path is "+ req.url);
    try{
      console.log("the body is "+ JSON.stringify(req.body));
      let microservice_res = await sendRequest(ORDER_MICROSERVICE + req.url, PUT, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  } 
};

export const createOrderRoute = async (req, res) => {
  // const user = await protectedRout(req, res, "U A M W");
  // if (user !== ERROR_401) {
    try{
      let microservice_res = await sendRequest(ORDER_MICROSERVICE + req.url, POST, JSON.stringify(req.body));
      const data = await microservice_res.json();
      res.status(microservice_res.status).json(data);
    }
    catch(err){
      res.status(500).json({message: "Internal server error"});
    }
  // }
};


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

const isCategoryString = (product, res) =>{
  if(typeof(product.category) != "string" )
  {
    const message = "category should be string"
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
  if(!createProductMandatoryFields(product, res) || !isPriceNumber(product,res) || !isImageString(product, res) || !isCategoryString(product, res) ||
   !isStockIntegar(product, res) || !isNameString(product, res) || !isDescriptionString(product, res)){
    return false;
  }
  return true;
}

