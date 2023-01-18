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

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({message: 'No Token'});
  }
};

module.exports = isAuth;

//note to self: when doing POST request to test signin in insomnia, use "" instead of '' for the correct formatting
//https://www.telerik.com/blogs/what-is-json-how-to-handle-unexpected-token-error
