const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const seedProduct = require('../seed/productSeed');

// "/api/product"
//! Seed Product
router.get('/seed', seedProduct);

//get specific product data
router.get('/:id',async (req,res)=>{
  const { id } = req.params;
  try {
    const product = await Product.findById(id).exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! Get all product data
router.get('/', async (req, res) => {
  try {
    const product = await Product.find().exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});


//! Get specific product data
/*
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message: 'Product not found'});
  }
});
*/

module.exports = router;

/*
//! Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//! Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error });
  }
});

//! Get all product data
router.get('/', async (req, res) => {
  try {
    const product = await Product.find().exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! Create Product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error });
  }
});
*/