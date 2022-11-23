const mongoose = require('mongoose');
const esquemaProducto = require(__dirname + '/schemaProduct');

const esquemaCart = new mongoose.Schema(
  {
    products: { type: [esquemaProducto.schema], required: true },
    user_id: { type: mongoose.Schema.ObjectId },
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', esquemaCart);

module.exports = Cart;
