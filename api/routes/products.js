const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

// Storage Strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // callback args: potential error obj | null, path to store, 
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `date_${file.originalname}` )
  }
});

// Filter files for uploading
const fileFilter = (req, file, cb) => {
  if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // Store the file 
    cb(null, true);
  } else {
    console.log('Enter correct mime-type. We can also throw an error.');
    // reject a file. This will not throw an error, but will not save the file.
    cb(null, false);
  }
};

// Initialize object  with multer
const upload = multer({
  //dest: 'uploads/'      // Path to folder to store files
  storage: storage,
  limits: {
    fileSize: 1024*1024*3     // Limit File Size to 3Mb in bytes
  },
  fileFilter: fileFilter
});

const Product = require('../models/products');

// GET Products
router.get('/', (req, res, next) => {
  // res.status(200).json({
  //   message: 'Handling GET requests to /products.'
  // });
  Product.find()
    .select('name price _id productImage')   // Select method specifies which fields to select.
    .exec()
    .then(docs => {
      //console.log(docs);
      //res.status(200).json(docs)
      
      // Form a response body
      const responseObj = {
        count: docs.length,
        products: docs.map(m => {
          return {
            _id: m.id,
            name: m.name,
            price: m.price,
            productImage: m.productImage,
            url: `http://localhost:3000/products/${m._id}`
          }
        })
      };
      res.status(200).json(responseObj);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error })
    })

});

// POST Product. Upload single file, with name productImage
router.post('/', checkAuth, upload.single('productImage') ,(req, res, next) => {

  console.log(req.file);    // Due to upload middleware, we get access to req.file

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  // Save to db
  product.save()
    .then(result => {
      const responseObj = {
        _id: result.id,
        name: result.name,
        price: result.price,
        url: `http://localhost:3000/products/${result.id}`
      };
      res.status(201)
        .json({
          message: 'Created 1 product.',
          createdProduct: responseObj
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
    .select('_id name price productImage')
    .exec()
    .then(doc => {
      if (doc) {
        const responseObj = {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          url: `http://localhost:3000/products/${doc._id}`
        }
        res.status(200).json(responseObj);
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
router.patch('/:productId', checkAuth, (req, res, next) => {
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
      //res.status(200).json(result);
      const responseObj = {
        message: 'Product Updated',
        request: {
          method: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      };
      res.status(200).json(responseObj);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    })
});

// DELETE Product
router.delete('/:productId', checkAuth, (req, res, next) => {
  // res.status(200).json({
  //   message: 'Deleted Product.'
  // });
  const id = req.params.productId;
  Product.remove({ _id: id }).exec()
    .then(result => {
      const responseObj = {
        message: 'Product Deleted',
        request: {
          method: 'GET',
          url: 'http://localhost:3000/products'
        }
      };
      //res.status(200).json(result);
      res.status(200).json(responseObj);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    })
});

module.exports = router;