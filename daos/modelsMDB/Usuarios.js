const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: Number, required: true },
  photo_url: { type: String },
  cart_id: { type: mongoose.Schema.ObjectId, required: true },
});

module.exports = mongoose.model('usuarios', UsuarioSchema);
