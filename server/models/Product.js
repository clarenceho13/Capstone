//! Schema Template
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    image: { type: String, required: true },
    ratings: {type: Number, required: true},
    reviewNum: {type: Number, required: true},
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
