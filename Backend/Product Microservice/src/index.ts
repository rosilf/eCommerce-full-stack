import { createServer, IncomingMessage, ServerResponse } from "http";
import { updateProductStock, clearCart, createNewCart } from "./utils.js";
// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { getProduct, createRoute, createProductRoute, updateProductCommentRoute, updateProductRoute, removeProductRoute, getCartRoute, updateCartRoute, removeCartRoute } from "./routes.js";
import { DELETE_CART, GET_CART, PUT_CART,  DELETE, PUT_PRODUCT, GET_PRODUCT, CREATE_PRODUCT, PUT_PRODUCT_COMMENT, UPDATE_PRODUCT, REMOVE_PRODUCT} from "./const.js";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as amqp from "amqplib";

dotenv.config();

const port = process.env.PORT || 3001;

const dbURI = `mongodb+srv://DB_ADMIN:${process.env.DBPASS}@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority`;
// const dbURI2 = 'mongodb+srv://DB_ADMIN:DB_ADMIN@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority'
await mongoose.connect(dbURI);

const consumeMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(
      `amqps://ralhibwc:${process.env.MESSAGE_BROKER_KEY}@sparrow.rmq.cloudamqp.com/ralhibwc`
    );
    const channel = await conn.createChannel();

    // create the exchange if it doesn't exist
    const order_exchange = "order_exchange";
    const signup_exchane = "signup_exchange";
    await channel.assertExchange(order_exchange, "fanout", { durable: false });
    await channel.assertExchange(signup_exchane, "fanout", { durable: true });

    // create the queue if it doesn't exist
    const order_queue = "order_queue";
    const signup_queue = "signup_queue";
    await channel.assertQueue(order_queue, { durable: false });
    await channel.assertQueue(signup_queue, { durable: true });

    // bind the queue to the exchange
    await channel.bindQueue(order_queue, order_exchange, "");
    await channel.bindQueue(signup_queue, signup_exchane, "");

    // consume messages from the queue
    await channel.consume(order_queue, (msg) => {
      console.log(`Comsumer >>> received message: ${msg.content.toString()}`);
      channel.ack(msg);
      updateProductStock(msg.content.toString());
      clearCart(msg.content.toString());
    });

    await channel.consume(signup_queue, (msg) => {
      console.log(`Comsumer >>> received message: ${msg.content.toString()}`);
      channel.ack(msg);
      createNewCart(msg.content.toString());
    });
  } catch (error) {
    console.error(error);
  }
};

// start consuming messages
consumeMessages();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = createRoute(req.url, req.method);
  console.log(route);
  switch (route) {
    case route.startsWith(GET_PRODUCT) ? route : "":
      console.log("get product");
      getProduct(route, req, res);
      break;
    case route.startsWith(PUT_PRODUCT_COMMENT) ? route : "":
    console.log("COMMMENTTTTTTTTT");
    updateProductCommentRoute(route, req, res);
      break;
    case route.startsWith(PUT_PRODUCT) ? route : "":
      updateProductRoute(route, req, res);
      break;
    case route.startsWith(DELETE) ? route : "":
      removeProductRoute(route, req, res);
      break;  
    case CREATE_PRODUCT:
      createProductRoute(req, res);
      break
    case route.startsWith(GET_CART) ? route : "":
      console.log("get CART");
      getCartRoute(route, req, res);
    break;
    case route.startsWith(DELETE_CART) ? route : "":
      removeCartRoute(route, req, res);
      break;
    case route.startsWith(PUT_CART) ? route : "":
      updateCartRoute(route, req, res);
      break;
    default:
      res.statusCode = 404;
          res.end(
            JSON.stringify({
              message: "not found",
            })
          );
      break;
  }
});

server.listen(port);
console.log(`Server running! port ${port}`);
