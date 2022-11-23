const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String },
  cart_id: { type: mongoose.Schema.ObjectId, required: true},
});


module.exports = mongoose.model('usuarios', UsuarioSchema);


