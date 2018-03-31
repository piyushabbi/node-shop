const express = require('express');
const router = express.Router();

// GET Orders
router.get('/', (req, res, next) => {
  res
    .status(200)
    .json({
      message: 'Orders Fetched!'
    });
});

// POST Orders
router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productd,
    quantity: req.body.quantity
  };
  res
    .status(201)
    .json({
      message: 'Order was created.',
      order
    });
});

// GET orderId
router.get('/:orderId', (req, res, next) => {
  res
    .status(200)
    .json({
      message: 'OrderId passed',
      orderId: req.params.orderId
    });
});

// DELETE orderId
router.delete('/:orderId', (req, res, next) => {
  res
    .status(200)
    .json({
      message: 'OrderId deleted',
      orderId: req.params.orderId
    });
});


module.exports = router;