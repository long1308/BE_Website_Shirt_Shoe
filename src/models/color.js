import mongoose from "mongoose";
const colorSchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false }
);
export default mongoose.model("Color", colorSchema);
