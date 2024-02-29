import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import Users from "./models/Users.js";
import { ERROR_401 } from "./const.js";

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";

const users = Users;

// Verify JWT token
const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
    // Read more here: https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    // Read about the diffrence between jwt.verify and jwt.decode.
  } catch (err) {
    return false;
  }
};

// Middelware for all protected routes. You need to expend it, implement premissions and handle with errors.
// allowedPremission format is "A M W" or "A" or "A"
export const protectedRout = async (req: IncomingMessage, res: ServerResponse, allowedPremission : string) => {
  let authHeader = req.headers["authorization"] as string;

  let authHeaderSplited = authHeader && authHeader.split(" ");

  if(authHeaderSplited == null || authHeaderSplited[0] != "Bearer" || authHeaderSplited[1] == null)
  {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "Bad authorization header",
      })
    );
    return ERROR_401;
  }
  const token = authHeaderSplited && authHeaderSplited[1];

  if (!token) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "No token.",
      })
    );
    return ERROR_401;
  }

  // Verify JWT token
  const user = verifyJWT(token);
  if (!user) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "Failed to verify JWT.",
      })
    );
    return ERROR_401;
  }
  const authorized = await checkUserPremission(user, allowedPremission);
  if(!authorized){
    res.statusCode = 403;
    res.end(
      JSON.stringify({
        message: "Premission Denied.",
      })
    );
    return ERROR_401;
  }
  // We are good!
  return user;
};

export const loginRoute = (req: IncomingMessage, res: ServerResponse) => {
  // Read request body.
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    // Parse request body as JSON
    try{
      const credentials = JSON.parse(body);
      
      if(!credentials.username || !credentials.password){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "username and passwrod cannot be empty!",
          })
        );
        return;
      }
      // Check if username and password match
      const user = await users.findOne({ username : credentials.username});
      if (!user) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid username or password.",
          })
        );
        return;
      }

      // bcrypt.hash create single string with all the informatin of the password hash and salt.
      // Read more here: https://en.wikipedia.org/wiki/Bcrypt
      // Compare password hash & salt.
      const passwordMatch = await bcrypt.compare(
        credentials.password,
        user.password
      );
      if (!passwordMatch) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "Invalid username or password.",
          })
        );
        return;
      }

      // Create JWT token.
      // This token contain the userId in the data section.
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 86400, // expires in 24 hours
      });

      res.end(
        JSON.stringify({
          token: token,
        })
      );
    } catch(e){
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: "Error Invalid Json",
        })
      );
      return;
    }

  });
};

export const signupRoute = (req: IncomingMessage, res: ServerResponse) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    // Parse request body as JSON
    try{
      const credentials = JSON.parse(body);

      const userExsits = await users.findOne({ username : credentials.username});
      if(userExsits){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "User Already Exists!",
          })
        );
        return;
      }
      if(!credentials.username || !credentials.password){
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            message: "username and passwrod cannot be empty!",
          })
        );
        return;
      }
      const username = credentials.username;
      const password = await bcrypt.hash(credentials.password, 10);

      const user = new Users({
        username: username,
        password: password,
        permission: "W",
      });
    
      const dbRes = await user.save();
      console.log(dbRes);

      res.statusCode = 201; // Created a new user!
      res.end(
        JSON.stringify({
          username,
        })
      );
    } catch(e){
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          message: "Error Invalid Json",
        })
      );
      return;
    }
  });
};

const checkUserPremission = async (user, allowed : string) =>{
  let authorized = allowed.split(" ");
  const userEntry = await users.findById(user.id);
  let userPremission = String(userEntry.permission);
  if(authorized.find(elm => elm === userPremission)){
    return true;
  }
  return false;
};