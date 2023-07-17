import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    cityLeeched: String,
    districtLeech: String,
    communeAddress: String,
    apartmentNumber: String,
    detailAddress: String,
    customerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false }
);
export default mongoose.model("Address", addressSchema);
