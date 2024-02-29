import { randomUUID } from "crypto";
import { IncomingMessage, ServerResponse } from "http";
import { ERROR_401, ERROR_400,  UPDATE_ORDER, PAYMENT_PROVIDER} from "./const.js";
import Order from "./models/Order.js";
import { announceNewOrder, sendRequest } from "./utils.js";


export const createRoute = (url: string, method: string) => {
  return `${method} ${url}`;
};

export const getOrder = async (res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json")
  //let data = [];
  const dbRes = await Order.find({});
  //data.push(dbRes);
  let arr = [];
  dbRes.forEach(elm => arr.push({
    orderId: elm.orderId,
    customerId: elm.customerId,
    address: elm.address,
    status: elm.status,
    price: elm.price,
  }));
  res.write(JSON.stringify(arr));
  res.end();
};

export const createOrderRoute = async (req, res, publisherChannel) => {
  //this is a create order api call
  //the expected body is:
  // {customerId, address, status, products, quantities, price, cc, holder, cvv, exp}
  console.log("create order route");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      //payment provider
      const data = JSON.parse(body);
      let paymentBody = {
        cc: data.cc,
        holder: data.holder,
        cvv: data.cvv,
        exp: data.exp,
        charge: data.price,
      };
      const payment_provider_res = await sendRequest(PAYMENT_PROVIDER, "POST", body);
      const payment_provider_res_body = await payment_provider_res.text();
      const parsed_res = JSON.parse(payment_provider_res_body);
      // console.log(payment_provider_res);
      // console.log(payment_provider_res_body);
      if (payment_provider_res.status !== 200) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Bad request: payment provider error",
          })
        );
        return;
      }
      const paymentToken=parsed_res.paymentToken; 
      const order = createNewOrder(body, res, paymentToken);
      
      if(order !== ERROR_400){
        try{
          await order.save();
          res.statusCode = 201;
          res.write(JSON.stringify({id : order.id,}));
          res.end();
          announceNewOrder(publisherChannel, order);
        }
        catch{
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: order not created",
            })
          );
        }
      }
      else{
        //refund
      const payment_provider_res_refund = await sendRequest(PAYMENT_PROVIDER, "POST", JSON.stringify({paymentToken: paymentToken, refund: data.price}));
      const payment_provider_res_refund_body = await payment_provider_res_refund.text();
      const parsed_res_refund = JSON.parse(payment_provider_res_refund_body);
      // console.log(payment_provider_res);
      // console.log(parsed_res_refund);
      if (payment_provider_res.status !== 200) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Bad request: payment provider error contact support with payment token for refund"+paymentToken,
          })
        );
      }
      else{
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "Bad request: order not created we refunded your payment",
          })
        );
      }
      }
    });
  };

export const updateOrderRoute = async(route, req, res) =>{
    res.setHeader("Content-Type", "application/json");
    const id = route.replace(UPDATE_ORDER, "");
    const order = await Order.findOne({orderId: id });
    if(order == null){
      res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: id not exist",
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
      const updated = JSON.parse(body);
      if(updated.status){
        if(order.status == "delivered"){
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              message: "Bad request: order already delivered",
            })
          );
          return;
        }
        await Order.updateOne({orderId: id}, { status: updated.status });
      }
      else{
        res.statusCode = 400;
        res.end(  
          JSON.stringify({
            message: "Bad request: invalid body",   
          })
        );
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
  };

const createNewOrder = (body, res, paymentToken) =>{
  //expecting body: {customerId, address, status, products, quantities, price}
  try{
    const orderBody = JSON.parse(body);
    // if(!validCreatProductBody(order_body, res)) {return ERROR_400;}
    const id = String(randomUUID());
    let order;
    order = new Order({
      orderId: id,
      customerId: orderBody.customerId,
      address: orderBody.address,
      status: orderBody.status,
      products: orderBody.products,
      quantities: orderBody.quantities,
      price: orderBody.price,
      paymentToken: paymentToken,
    });

    return order;
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

const validCreatProductBody = (product, res) => {
  if(!createProductMandatoryFields(product, res) || !isPriceNumber(product,res) ||
   !isStockIntegar(product, res) || !isNameString(product, res) || !isDescriptionString(product, res)){
    return false;
  }
  return true;
}
