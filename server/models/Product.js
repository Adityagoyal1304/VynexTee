const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["tshirt", "bag"],
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
    badge: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
    },
    sizes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
