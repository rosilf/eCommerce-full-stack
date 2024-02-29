import * as mongoose from "mongoose";

//TODO: how to set the type to be string from a list of strings
//TODO: try to enforce price between 0-1000
const productsSchema = new mongoose.Schema(
    {
      id: {type: String, required:true},
      name: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      image: { type: String },
    },
    { timestamps: true }
  ); 
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model("Products", productsSchema);