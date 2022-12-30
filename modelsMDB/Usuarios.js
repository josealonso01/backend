const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  username: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  cart_id: { type: mongoose.Schema.ObjectId },
});

module.exports = mongoose.model('usuarios', UsuarioSchema);
