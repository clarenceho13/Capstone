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
      category: 'Electronics',
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
      category: 'Electronics',
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
      category: 'Electronics',
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
      category: 'Electronics',
    },
    {
      name: 'Air Jordan 1 Lost & Found',
      tag: 'Air Jordan 1 Lost & Found',
      description: 'Recreation of the first Jordan 1',
      price: 500,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1674134971/air-jordan-1-2022-lost-and-found-chicago-the-inspiration-behind-the-design_leyqbw.jpg',
      ratings: 5.0,
      reviewNum: 50,
      stock: 0,
      category: 'Sneakers',
    },
    {
      name: 'Nike Dunk Low Panda',
      tag: 'Nike Dunk Low Panda',
      description: 'Most Popular Nike Dunks, everyone is wearing it!',
      price: 300,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1674135205/nike-dunk-low-panda-2022-restock-dd1391-100-lead_na6qj7.jpg',
      ratings: 4.5,
      reviewNum: 35,
      stock: 1,
      category: 'Sneakers',
    },
    {
      name: 'White Shoes',
      tag: 'White Shoes',
      description: 'Just basic white shoes',
      price: 10,
      image:
        'https://res.cloudinary.com/dgmwjjrtf/image/upload/v1672316153/cld-sample-5.jpg',
      ratings: 0.5,
      reviewNum: 60,
      stock: 100,
      category: 'Sneakers',
    },
  ];
  await Product.deleteMany({});
  const product = await Product.insertMany(seedProduct);
  res.json(product);
};

module.exports = seedProduct;
