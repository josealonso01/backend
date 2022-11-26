const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const esquemaProducto = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  Descripcion: { type: String, required: true },
  Codigo: { type: String, required: true },
  picture: { type: String, required: true },
  stock: { type: Number, required: true },
});



module.exports = mongoose.model('productos', esquemaProducto);
