//no need for userSeed.js
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../token');

//users are seeded in the controller instead of the seed file
router.get('/seed', async (req, res) => {
  const user = [
    {
      name: 'clarence',
      email: 'clarence@email.com',
      phoneNumber: 84770730,
      password: bcrypt.hashSync('hohoho', 10),
      admin: true,
    },
    {
      name: 'george',
      email: 'george@email.com',
      phoneNumber: 84770720,
      password: bcrypt.hashSync('alexis', 10),
      admin: false,
    },
  ];
  try {
    await User.deleteMany({}); //* delete all users
    const newUsers = await User.create(user);
    res.json(newUsers);
  } catch (error) {
    res.status(500).json(error);
  }
});

//might use later
/*
router.get("/", async (req, res) => {
  // Check for the presence of session data
  if (!req.session.username) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const users = await User.find({}).exec();
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});
*/
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//need to define error handler for express in server.js
router.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          admin: user.admin,
          token: generateToken(user),
        });
        return;
      }
    }
    res
      .status(401)
      .send({ message: 'Unautorized: No such email or password registered' });
  })
);
//! Get all users data
//localhost:3000/api/user/
router.get('/', async (req, res) => {
  try {
    const user = await User.find().exec();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
