import * as mongoose from "mongoose";


const ordersSchema = new mongoose.Schema(
    {
      orderId: {type: String, required:true},
      customerId: { type: String, required: true },
      address: { type: String, required: true },
      status: { type: String, required: true },
      products: { type: Array, required: true },
      quantities: { type: Array, required: true },
      price: { type: Number, required: true },
      paymentToken: { type: String, required: true },
    },
    { timestamps: true }
  ); 
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model("Order", ordersSchema);