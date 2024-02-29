import * as mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }]
  },
  { timestamps: true }
); 
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model("Cart", cartSchema);