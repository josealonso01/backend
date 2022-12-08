const express = require('express');
const {
  getAllProductsByCartId,
  createCart,
  addProduct,
  deleteCartById,
  deleteProductById,
} = require('../controllers/Basket');

const routerBasket = express.Router();

routerBasket.post('/', createCart);
routerBasket.delete('/:id', deleteCartById);
routerBasket.get('/:id/productos', getAllProductsByCartId);
routerBasket.post('/:id/productos', addProduct);
routerBasket.delete('/:id/productos/:id_prod', deleteProductById);

module.exports = routerBasket;
