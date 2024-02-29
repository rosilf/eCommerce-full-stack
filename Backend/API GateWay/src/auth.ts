import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import Users from "./models/Users.js";

import { ERROR_401 } from "./const.js";
import { sendRequest, announceNewUser } from "./utils.js";
import  {PublisherChannel}  from "./PublisherChannel.js";

// TODO: You need to config SERCRET_KEY in render.com dashboard, under Environment section.
const secretKey = process.env.SECRET_KEY || "your_secret_key";

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
export const protectedRout = async (req, res, allowedPremission : string) => {
  console.log("protectedRout");
  const token = req.cookies.token ||  req.headers.authorization?.split(" ")[1];
  console.log("cookie_from_header = " + token);
  if(token === null){
    res.status(401).json({message: "No authorization header"});
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

export const loginRoute = async (req, res) => {
      const credentials = req.body;
      
      if(!credentials.username || !credentials.password){
        return res.status(400).json({message: "username and passwrod cannot be empty!",});
      }
      // Check if username and password match
      const user = await Users.findOne({ username : credentials.username});
      if (!user) {
        return res.status(401).json({message: "Invalid username or password.",});
      }

      // bcrypt.hash create single string with all the informatin of the password hash and salt.
      // Read more here: https://en.wikipedia.org/wiki/Bcrypt
      // Compare password hash & salt.
      const passwordMatch = await bcrypt.compare(
        credentials.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({message: "Invalid username or password.",});
      }

      // Create JWT token.
      // This token contain the userId in the data section.
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: 86400, // expires in 24 hours
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 86400 * 1000,
      });
      return res.status(200).json({token: token,});
};

export const signupRoute = async (req, res, publisherChannel) => {
    try{
      // console.log(req.body);
      const credentials = req.body;

      const userExsits = await Users.findOne({ username : credentials.username});
      if(userExsits){
        return res.status(400).json({message: "User Already Exists!"});
      }
      if(!credentials.username || !credentials.password){
        return res.status(400).json({message: "username and passwrod cannot be empty!"});
      }
      const username = credentials.username;
      const password = await bcrypt.hash(credentials.password, 10);

      const user = new Users({
        username: username,
        password: password,
        permission: "U",
      });
    
      await user.save();
      res.status(201).json({username: username});
      announceNewUser(publisherChannel, username);
      return;
    } catch(e){
      return res.status(400).json({message: "Error Invalid Json"});
    }
};

export const logoutRoute = async (req, res) => {
  const token = req.cookies.token;
  res.clearCookie(token);
  return res.status(200).json({message: "Logout successful"});
};

export const updatePrivilegeRoute = async (req, res) => {
  const user = await protectedRout(req, res, "A");
  if(user !== ERROR_401){
    const data = req.body;
    if(!data.username || !data.permission){
      return res.status(400).json({message: "username and permission cannot be empty!"});
    }
    if(data.permission != "W" && data.permission != "M" && data.permission != "U"){
      return res.status(400).json({message: "invalid field permission"});
    }
    try{
      await Users.updateOne({ username: data.username }, {permission: data.permission});
      return res.status(200).json({message: "Premission updated"});
    }
    catch(err){
      return res.status(500).json({message: "Internal server error"});
    }      
  }
};

const checkUserPremission = async (user, allowed : string) =>{
  let authorized = allowed.split(" ");
  const userEntry = await Users.findById(user.id);
  let userPremission = String(userEntry.permission);
  if(authorized.find(elm => elm === userPremission)){
    return true;
  }
  return false;
};

