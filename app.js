const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');

const app = express();

// Logger Middleware
app.use(morgan('dev'));

// Connect via Mongoose
mongoose.connect('mongodb://node-shop:' + process.env.MONGO_ATLAS_PWD + '@node-rest-shop-shard-00-00-zdjhh.mongodb.net:27017,node-rest-shop-shard-00-01-zdjhh.mongodb.net:27017,node-rest-shop-shard-00-02-zdjhh.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin');

// Use bodyParser to use request body
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// CORS Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // For OPTIONS req that browser sends automatically
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// 404 Error
app.use((req, res, next) => {
  const error = new Error('404 Not Found');

  error.status = 404;
  next(error);
});

// Other Errors
app.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({
      error: {
        message: error.message
      }
    });
});

module.exports = app;