import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  remaining: { type: Number, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Batch", batchSchema);
