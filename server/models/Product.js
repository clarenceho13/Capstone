//! Schema Template
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tag: {type: String},
    description: { type: String },
    price: { type: Number },
    image: { type: String, required: true },
    ratings: {type: Number, required: true},
    reviewNum: {type: Number, required: true},
    stock: {type: Number, required: true},
    category: { type: String, required: true},
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
