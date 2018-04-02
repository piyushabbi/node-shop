const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // if auth successful, run next, else return error
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;   // Add a new field to the request
    next();
  } catch(error) {
    return res.status(401).json({
      message: 'Auth failed.'
    });
  }
  

};