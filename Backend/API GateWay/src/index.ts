import { createServer, IncomingMessage, ServerResponse } from "http";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import {  createRoute, getProductRoute,  createProductRoute, updateProductRoute, removeProductRoute, updateProductCommentRoute,
   getCartRoute, updateCartRoute, removeCartRoute,
   getOrderRoute, updateOrderRoute, createOrderRoute } from "./routes.js";
import { LOGOUT, LOGIN, SIGNUP, UPDATE_PRIVILEGES,
   DELETE_PRODUCT, PUT_PRODUCT, GET_PRODUCT, GET_PRODUCT_BY_ID, CREATE_PRODUCT,  PUT_PRODUCT_COMMENT,
   GET_CART, PUT_CART, DELETE_CART,
   GET_ORDER, PUT_ORDER, CREATE_ORDER,
   LOCAL_PRODUCTCART_MICROSERVICE, LOCAL_ORDER_MICROSERVICE} from "./const.js";
import { loginRoute, signupRoute, updatePrivilegeRoute, logoutRoute } from "./auth.js";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import express from "express";
// import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PublisherChannel } from "./PublisherChannel.js";

const publisherChannel = new PublisherChannel();

const app = express();
// app.use(bodyParser.urlencoded({extended : false}));
app.use(express.urlencoded()); //Parse URL-encoded bodies
// app.use(bodyParser.json());
app.use(cookieParser({
  sameSite: 'none'
}));
app.use(express.json({
  limit: '1mb',
  strict: true,
  reviver: null,
  inflate: true,
  type: 'application/json',
  verify: undefined
}));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  next();
});


// function handleError(middleware, req, res, next) {
//   middleware(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(400).json({message: "Bad Request"});
//     }

//     next();
//   });
// }

// app.use((req, res, next) => {
//   handleError(express.json(), req, res, next);
// });


dotenv.config();

const port = process.env.PORT || 3010;

const clientApp = process.env.CATALOG || "http://localhost:3000";
console.log(clientApp)
const clientApp2 = process.env.BACKOFFICE || "http://localhost:3002";
export const PRODUCTCART_MICROSERVICE = process.env.PRODUCTCART_MICROSERVICE || LOCAL_PRODUCTCART_MICROSERVICE;
export const ORDER_MICROSERVICE = process.env.ORDER_MICROSERVICE || LOCAL_ORDER_MICROSERVICE ;

const dbURI = `mongodb+srv://DB_ADMIN:${process.env.DBPASS}@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority`;

await mongoose.connect(dbURI);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(clientApp)
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${clientApp},${clientApp2}`);
  next();
});

app.use(cors({credentials: true, origin: true}));


app.post(LOGIN, (req, res) => {
  console.log("login");
  loginRoute(req, res);
});

app.post(SIGNUP, (req, res) => {
  console.log("signup");
  signupRoute(req, res, publisherChannel);
});

app.post(LOGOUT, (req, res) => {
  console.log("logout");
  logoutRoute(req, res);
});

app.put(UPDATE_PRIVILEGES, (req, res) => {
  console.log("update privileges");
  updatePrivilegeRoute(req, res);
});

app.get(GET_PRODUCT, (req, res) => {
  console.log("get product");
  getProductRoute(req.url, req, res);
});

app.get(GET_PRODUCT_BY_ID, (req, res) => {
  console.log("get product");
  getProductRoute(req.url, req, res);
});

app.put(PUT_PRODUCT, (req, res) => { 
  console.log("put product");
  console.log("the body is "+ req.body);
  updateProductRoute(req, res);
});

app.delete(DELETE_PRODUCT, (req, res) => {
  console.log("delete product");
  removeProductRoute(req, res);
});

app.post(CREATE_PRODUCT, (req, res) => {
  console.log("create product");
  createProductRoute(req, res);
});

app.put(PUT_PRODUCT_COMMENT, (req, res) => {
  console.log("put product comment");
  updateProductCommentRoute(req, res);
});
app.get(GET_CART, (req, res) => {
  console.log("get cart");
  getCartRoute(req, res);
  });

app.put(PUT_CART, (req, res) => {
  console.log("put cart");
  updateCartRoute(req, res);
  });

app.delete(DELETE_CART, (req, res) => {
  console.log("delete cart");
  removeCartRoute(req, res);
  });


//order microvservice

app.get(GET_ORDER, (req, res) => {
  console.log("get order");
  getOrderRoute(req, res);
});

app.put(PUT_ORDER, (req, res) => {
  console.log("put order");
  updateOrderRoute(req, res);
});

app.post(CREATE_ORDER, (req, res) => {
  console.log("create order");
  createOrderRoute(req, res);
});




app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).send("Sorry can't find that!")
});


// const server = createServer((req: IncomingMessage, res: ServerResponse) => {
//   const route = createRoute(req.url, req.method);
//   switch (route) {
//     case LOGIN:
//       loginRoute(req, res);
//       break;
//     case SIGNUP:
//       signupRoute(req, res);
//       break;
//     case route.startsWith(GET_PRODUCT) ? route : "":
//       console.log("get product");  
//       getProductRoute(route, req, res);
//       break;
//     case route.startsWith(PUT_PRODUCT) ? route : "":
//       updateProductRoute(route, req, res);
//       break;
//     case route.startsWith(DELETE_PRODUCT) ? route : "":
//       removeProductRoute(route, req, res);
//       break;  
//     case CREATE_PRODUCT:
//       createProductRoute(req, res);
//       break
//     case UPDATE_PRIVILEGES:
//       updatePrivilegeRoute(req, res);
//       break 
//     default:
//       res.statusCode = 404;
//           res.end(
//             JSON.stringify({
//               message: "not found",
//             })
//           );
//       break;
//   }
// });

// server.listen(port);
// console.log(`Server running! port ${port}`);


