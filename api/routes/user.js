const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/users');

// Post route for sign-up
router.post('/signup', (req, res, next) => {
  // Check if user email exists
  User.find({ email: req.body.email })
    .exec()
    .then(doc => {
      if (doc.length >= 1) {
        return res.status(422).json({ message: 'Email Already exists.' });
      } else {
        // Encrypt the password. If success, create and store the user in db
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            // save user
            user.save()
              .then(result => {
                res.status(201).json({ message: 'User Created', result });
              })
              .catch(error => {
                res.status(500).json({ error });
              });
          }
        });
      }
    });
});

// Delete User from DB
router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({ message: 'User deleted successfuly.' });
    })
    .catch(error => {
      res.status(500).json({error});
    })
});

module.exports = router;