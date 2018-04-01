const mongoose = require('mongoose');

// Create Schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true }
});

// Export Schema wrapped in a model
module.exports = mongoose.model('Product', productSchema);