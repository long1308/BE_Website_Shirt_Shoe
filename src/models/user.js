import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "member",
    },
    image_url: {
      type: String,
    },
    favoriteProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "FavoriteProduct",
      },
    ],
    addressUser: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  { timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false }
);

export default mongoose.model("User", userSchema);
