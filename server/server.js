require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cors= require ('cors');
const stripe= require("stripe")(process.env.STRIPE_SECRET_KEY);

//import controllers and models here
//if model is already export to controller, then you only need to import the controller
const productController = require('../server/controllers/productController');
//const User = require('../server/models/User'); (note:use this code to set login)
const userController = require('../server/controllers/userController');
const orderController= require('../server/controllers/orderController');

//! CONFIGURATION AND CONNECTION
const app = express();
const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI;

console.log('Mongo_URI', MONGO_URI);
mongoose.set('strictQuery', false);
mongoose.set('runValidators', true);
mongoose.set('debug', true);
mongoose.connect(MONGO_URI);

// Connection Error/Success
// Define callback functions for various events
mongoose.connection.on('error', (err) =>
  console.log(err.message + ' is mongod not running?')
);
mongoose.connection.on('connected', () =>
  console.log('mongo connected: ', MONGO_URI)
);
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'));

//! MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json()); //to send json to frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../client/dist')); //express static for react
app.use(cors());
app.use('/api/keys/paypal',(req,res)=>{
res.send(process.env.PAYPAL_CLIENT_ID || 'sb' );
});


//Make routes here
app.use('/api/product', productController);
app.use('/api/user', userController);
app.use('/api/orders', orderController);

//middleware for error
app.use((err, req, res, next )=>{
  res.status(500).send({message: err.message})
})

app.get('/api/', (req, res) => {
  res.json({ msg: 'Hello World!' });
});

//! SAFETY NET
app.get('*', (req, res) =>
  res.sendFile(path.resolve('../client/dist', 'index.html'))
);

//! LISTENER
mongoose.connection.once('open', () => {
  console.log('connected to mongoose', MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
});

//https://www.npmjs.com/package/@paypal/react-paypal-js 
//install in client