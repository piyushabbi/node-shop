const mongoose = require('mongoose');

/**
 * Note:-
 * MongoDb is non relational. So, inorder to specify relation/reference to the product schema, use ref and point it to the schema we want to create the relation to.
 */
// Create Schema
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});


// Export Schema wrapped in a model
module.exports = mongoose.model('Order', orderSchema);