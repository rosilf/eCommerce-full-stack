import { createServer, IncomingMessage, ServerResponse } from "http";

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { getProduct, createRoute, getProductRoute, familyProductRoute, createProductRoute, updateProductRoute, removeProductRoute, updatePrivilegeRoute} from "./routes.js";
import { GET_SEGEL, LOGIN, SIGNUP, DELETE, PUT_PRODUCT, GET_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, REMOVE_PRODUCT, UPDATE_PRIVILEGES} from "./const.js";
import { loginRoute, signupRoute } from "./auth.js";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const dbURI = `mongodb+srv://DB_ADMIN:${process.env.DBPASS}@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority`;
// const dbURI2 = 'mongodb+srv://DB_ADMIN:DB_ADMIN@cluster0.uyxfmu2.mongodb.net/?retryWrites=true&w=majority'
await mongoose.connect(dbURI);


const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = createRoute(req.url, req.method);
  switch (route) {
    case LOGIN:
      loginRoute(req, res);
      break;
    case SIGNUP:
      signupRoute(req, res);
      break;
    case route.startsWith(GET_PRODUCT) ? route : "":
      getProduct(route, req, res);
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
    case UPDATE_PRIVILEGES:
      updatePrivilegeRoute(req, res);
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
