const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const expressAsyncHandler = require('express-async-handler');
const seedProduct = require('../seed/productSeed');
const isAuth = require('../isAuth');
const admin = require('../admin');

// "/api/product"
//! Seed Product
router.get('/seed', seedProduct);

//get categories
router.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

router.post(
  '/',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name' + Date.now(),
      tag: 'sample-name-' + Date.now(),
      description: 'sample description',
      price: 0,
      image: '/images/p1.jpg',
      ratings: 0,
      reviewNum: 0,
      stock: 0,
      category: 'sample category',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

router.put(
  '/:id',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.tag = req.body.tag;
      product.description = req.body.description;
      product.price = req.body.price;
      product.image = req.body.image;
      product.ratings = req.body.ratings;
      product.reviewNum = req.body.reviewNum;
      product.stock = req.body.stock;
      product.category = req.body.category;
      await product.save();
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).json({ message: 'Product not Found' });
    }
  })
);

router.delete(
  '/:id',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).json({ message: 'Product not Found' });
    }
  })
);
const PAGE_SIZE = 3;

router.get(
  '/admin',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

router.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated';

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//get specific product data
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).exec();
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: 'Product not found, hahaha' }); //fetch from error.jsx in frontend
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

//always put most specific in front

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
