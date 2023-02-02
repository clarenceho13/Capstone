const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require ('../models/User');
const Product= require('../models/Product');
const expressAsyncHandler = require('express-async-handler');
const isAuth = require('../isAuth');
const admin = require('../admin');

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

router.get(
  '/summary',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const orders= await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: {$sum: 1},
          totalSales: {$sum: '$totalPrice'},
        }
      }
    ]);
    const users= await User.aggregate([
      {
        $group: {
          _id: null,
          numOrders: {$sum: 1},
          
        }
      }
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
          orders: { $sum: 1},
          sales: { $sum: '$totalPrice'},
        },
      },
      {$sort: {_id:1}},
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum:1 },
        },
      },
    ]);
    res.send({users, orders, dailyOrders, productCategories });
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

//https://www.mongodb.com/docs/manual/aggregation/
//testing