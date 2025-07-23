const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['man', 'woman'],
  },
  category: {
    type: String,
    required: true,
  },
  carat: {
    type: String,
    required: true,
    enum: ['18K', '22K', '24K'],
  },
  price: {
    type: Number,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  productId: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate product IDs
  },
  showOnWebsite: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
