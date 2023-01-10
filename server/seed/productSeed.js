const Product = require('../models/Product');

const seedProduct = async (req, res) => {
  const seedProduct = [
    {
      name: 'iPhone 14',
      tag: 'iPhone 14',
      description: 'Comes with a 6.1 inch display',
      price: 1300,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1672316205/Apple-iPhone-14-iPhone-14-Plus-hero-220907_Full-Bleed-Image.jpg.large_r0kksa.jpg',
      ratings: 3.5,
      reviewNum: 5,
      stock: 3,
    },
    {
      name: 'iPhone 14 Pro',
      tag: 'iPhone 14 Pro',
      description: 'Comes with a 6.1 inch display and 120hz screen.',
      price: 1650,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1672316272/iphone-14-pro_overview__e414c54gtu6a_og_bmadrb.png',
      ratings: 4.5,
      reviewNum: 12,
      stock: 0,
    },
    {
      name: 'iPhone 14 Pro Max',
      tag: 'iPhone 14 Pro Max',
      description: 'Comes with a 6.7 inch display and 120hz screen.',
      price: 1800,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1672316311/iphone-14-pro-model-unselect-gallery-1-202209_ku5mql.jpg',
      ratings: 5.0,
      reviewNum: 6,
      stock: 10,
    },
    {
      name: 'AirPods Pro',
      tag: 'AirPods Pro',
      description: 'True Wireless Earbuds',
      price: 350,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1672901197/MQD83_swjpak.jpg',
      ratings: 4.0,
      reviewNum: 5,
      stock: 23,
    },
  ];
  await Product.deleteMany({});
  const product = await Product.insertMany(seedProduct);
  res.json(product);
};

module.exports = seedProduct;
