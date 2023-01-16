//! Schema Template
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, minValue: 3, maxValue:20, required: true },
    email: { type: String, lowercase: true, required: true, unique: true},
    password: { type: String, minValue:6, required: true },
    admin: {type: Boolean, default: false, required: true}, //status spring? referred from ambrose and paul's project
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

module.exports = User;

//if you want to change you schema, drop your collection on mongodb and reping on insomnia again