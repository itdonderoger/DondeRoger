import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  totalStock: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
