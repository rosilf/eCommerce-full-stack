import * as mongoose from "mongoose";

//TODO: ENFORCE PREMISSION TO BE JUST A,M,W
const usersSchema = new mongoose.Schema(
    {
      username: {type: String, required:true},
      password: { type: String, required: true },
      permission: {type: String, required:true},
    },
    { timestamps: true }
  ); 
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model("Users", usersSchema);