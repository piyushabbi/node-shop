const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

// GET Products
router.get('/', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Handling GET requests to /products.'
  // });
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error })
    })

});

// POST Products
router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  // Save to db
  product.save()
    .then(result => {
      console.log(result);
      res
        .status(201)
        .json({
          message: 'Handling POST requests to /products.',
          createdProduct: result
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error })
    });
});

// Get ProductId
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;

  // Get Product from db. exec() will convert it to promise.
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'No valid entry found!' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error })
    })
});

// PATCH Product
router.patch('/:productId', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Updted | Patched Product'
  // });
  /**
   * For updating, specify which property to be updated and its corresponding value
   * The update req body is defined below:-
   [{
    "propName": "name",
    "value": "Siver"
  }]
   * Using above, update the name of the product. And the new name is silver. 
   */
  const id = req.params.productId;
  const updateTerm = {};

  for (let term of req.body) {
    updateTerm[term.propName] = term.value;
  }

  Product.update({ _id: id }, { $set: updateTerm }).exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    })
});

// DELETE Product
router.delete('/:productId', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Deleted Product.'
  // });
  const id = req.params.productId;
  Product.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    })
});

module.exports = router;