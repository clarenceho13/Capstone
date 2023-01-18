//! Schema Template
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        tag: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      number: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentOutcome: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    gstPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentStatus: { type: Boolean, default: false },
    paymentDate: { type: Date },
    deliveryStatus: { type: Boolean, default: false },
    deliveryDate: { type: Date },
  },
  { timestamps: true }
);
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
