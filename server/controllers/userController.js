//no need for userSeed.js
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const isAuth = require('../isAuth');
const admin = require('../admin');
const generateToken = require('../token');
//const generateToken2= require('../token');

//users are seeded in the controller instead of the seed file
router.get('/seed', async (req, res) => {
  const seedUser = [
    {
      name: 'clarence',
      email: 'clarence@email.com',
      password: bcrypt.hashSync('hohoho', 10),
      admin: true,
    },
    {
      name: 'george',
      email: 'george@email.com',
      password: bcrypt.hashSync('alexis', 10),
      admin: false,
    },
  ];
  try {
    await User.deleteMany({}); //* delete all users
    const user = await User.create(seedUser);
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get(
  '/:id',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);



router.put(
  '/:id',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.admin = Boolean(req.body.admin);
      const updateUser = await user.save();
      res.send({ message: 'User Updated', user: updateUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  })
);

router.delete(
  ':/id',
  isAuth, 
  admin,
  expressAsyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.admin === true){
        res.status(400).send({message: 'Cannot delete Admin'})
      }
      await user.remove();
      res.send({message: 'User Deleted'});
    }else {
      res.status(404).send({message: 'User not found'});
    }
  })
);

router.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: generateToken(user),
    });
  })
);

//need to define error handler for express in server.js
router.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        //res
        /*
          .status(200)
          .cookie("token", generateToken(user) , { httpOnly: true })
          .json("Login Successful");
        */

        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          admin: user.admin,
          token: generateToken(user),
        });

        //return;
      }
    }
    res
      .status(401)
      .send({ message: 'Unautorized: No such email or password registered' });
  })
);

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
});

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

//update user profile
router.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 10);
      }
      const updateUser = await user.save();
      res.send({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        admin: updateUser.admin,
        token: generateToken(updateUser),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  })
);

router.get(
  '/',
  isAuth,
  admin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);


module.exports = router;
