const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateToken;

//note to self: when doing POST request to test signin in insomnia, use "" instead of '' for the correct formatting
//https://www.telerik.com/blogs/what-is-json-how-to-handle-unexpected-token-error
