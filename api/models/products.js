const mongoose = require('mongoose');

// Create Schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

// Export Schema wrapped in a model
module.exports = mongoose.model('Product', productSchema);