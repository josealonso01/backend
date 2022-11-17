const mongoose = require('mongoose');
const { esquemaProducto } = require('./schemaProduct');

const esquemaCart = new mongoose.Schema(
  {
    productos: { type: [String], required: true },
    user_id: { type: mongoose.Schema.ObjectId, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', esquemaCart);

module.exports = Cart;
