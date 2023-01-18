const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const expressAsyncHandler = require('express-async-handler');
const isAuth = require('../token');

//make new order
router.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      gstPrice: req.body.gstPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const order = await newOrder.save(); //create and save the new order
    res.status(201).send({ message: 'New Order Created', order });
  })
);

//get order history based on user _id
router.get(
  '/ordered',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

//get specific order
router.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  })
);

router.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.paymentStatus = true;
      order.paymentDate = Date.now();
      order.paymentOutcome = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const orderUpdate = await order.save();
      res.json({ message: 'Payment Complete', order: orderUpdate });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  })
);

module.exports = router;
