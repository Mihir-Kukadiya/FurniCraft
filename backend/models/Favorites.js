import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    img: String,
    price: String,
    category: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
