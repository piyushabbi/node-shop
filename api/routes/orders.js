const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

// GET Orders
router.get('/', (req, res, next) => {
  Order.find()
    .select('_id quantity product')
    .populate('product', 'name')    // To link data of product into orders. While creating schema, we have 1 ref to Prouct stored in product property. 1st arg is the name of the property, 2nd arg is what all values we need.
    .exec()
    .then(docs => {
      const responseObj = {
        message: 'Orders Fetched!',
        count: docs.length,
        orders: docs.map(m => {
          return {
            _id: m._id,
            product: m.product,
            quantity: m.quantity,
            request: {
              type: 'GET',
              url: `http://localhost:3000/orders/${m._id}`
            }
          };
        })
      };
      res.status(200).json(responseObj);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// POST Orders
router.post('/', (req, res, next) => {
  // Create an order, only if the product with that Id exists
  Product.findById(req.body.productId)
    .exec()
    .then(product => {
      if(!product) {
        return res.status(404).json({
          message: 'Product not found!'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      // Save Order
      return order.save()
    })
    .then(result => {
      const responseObj = {
        _id: result._id,
        quantity: result.quantity,
        product: result.product
      };
      res.status(201).json({
        message: "Order Added.",
        createdOrder: {
          _id: result._id,
          quantity: result.quantity,
          product: result.product
        },
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${result._id}`
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Product not found.'
      });
    });
});

// GET orderId
router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product', '_id name price')
    .exec()
    .then(doc => {
      if(!doc) {
        return res.status(404).json({
          message: 'Order not found.'
        });
      }
      res.status(200).json({
        order: doc,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders`
        }
      });
    })
    .catch(error => {
      res.status(500).json(error);
    })
});

// DELETE orderId
router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order Deleted',
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders`
        }
      });
    })
    .catch(error => {
      res.status(500).json(error);
    })
});


module.exports = router;