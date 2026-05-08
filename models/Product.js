const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 10,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
   timestamps: true, 
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;