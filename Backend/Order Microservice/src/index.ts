import { createServer, IncomingMessage, ServerResponse } from "http";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { createRoute, getOrder, createOrderRoute, updateOrderRoute } from "./routes.js";
import { GET_ORDER, CREATE_ORDER, UPDATE_ORDER } from "./const.js";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import { PublisherChannel } from "./PublisherChannel.js";

dotenv.config();

const port = process.env.PORT || 3020;

const publisherChannel = new PublisherChannel();

const dbURI = `mongodb+srv://DB_ADMIN:${process.env.DBPASS}@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority`;
await mongoose.connect(dbURI);


const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = createRoute(req.url, req.method);
  console.log(route);
  switch (route) {
    case GET_ORDER:
      getOrder(res);
      break;
    case route.startsWith(UPDATE_ORDER) ? route : "":
      updateOrderRoute(route, req, res);
      break;
    case CREATE_ORDER:
      createOrderRoute(req, res, publisherChannel);
      break
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
