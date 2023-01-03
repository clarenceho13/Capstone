require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

//import controllers here
const productController = require('../server/controllers/productController');

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
app.use(express.json());
app.use(express.static('../client/dist')); //express static for react

//Make routes here
app.use('/api/product/', productController);

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
