const admin = (req, res, next)=>{
    if(req.user && req.user.admin){
        next();
    }else {
        res.status(401).json({message: 'Invalid Admin Token'})
    }
  }

  module.exports = admin;