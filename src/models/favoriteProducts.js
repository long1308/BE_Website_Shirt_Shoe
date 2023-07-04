import mongoose from "mongoose";
const favoriteProductSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
export default mongoose.model("FavoriteProduct", favoriteProductSchema);
