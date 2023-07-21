import mongoose from "mongoose";
const { Schema } = mongoose;
import paginate from "mongoose-paginate-v2";
const sizeQuantitySchema = new Schema(
  {
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const colorSizeSchema = new Schema(
  {
    color: {
      type: String,
      enum: ["green", "blue", "pink", "red", "indigo", "yellow", "orange",],
    },
    sizes: [sizeQuantitySchema],
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: String,
    price: Number,
    priceSale: Number,
    image: Array,
    rating: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    description: String,
    quantity: Number,
    description_short: String,
    isVisible: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    hot_sale: {
      type: Number,
      default: 0,
    },
    inventoryStatus: {
      type: String,
      enum: ["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"],
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    colorSizes: [colorSizeSchema],
  },
  { timestamps: { currentTime: () => Date.now() + 7 * 60 * 60 * 1000 }, versionKey: false }
);
productSchema.pre("save", function (next) {
  if (this.isModified("hot_sale") || this.isModified("price")) {
    this.priceSale = this.price * (1 - this.hot_sale / 100);
  }
  let totalQuantity = 0;
  this.colorSizes.forEach((colorSize) => {
    colorSize.sizes.forEach((size) => {
      totalQuantity += size.quantity;
    });
  });

  this.quantity = totalQuantity;
  switch (true) {
    case this.quantity <= 0:
      this.inventoryStatus = "OUTOFSTOCK";
      break;
    case this.quantity <= 10:
      this.inventoryStatus = "LOWSTOCK";
      break;
    default:
      this.inventoryStatus = "INSTOCK";
  }
  next();
});
productSchema.plugin(paginate);
export default mongoose.model("Product", productSchema);
