const express = require('express');
const {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProductById,
  updateProductById,
  checkAdmin,
} = require('../controllers/Products');

const routerProducts = express.Router();

routerProducts.get('/', getAllProducts);
routerProducts.get('/:id', getProductById);
routerProducts.post('/', checkAdmin, addProduct);
routerProducts.put('/:id', checkAdmin, updateProductById);
routerProducts.delete('/:id', checkAdmin, deleteProductById);

module.exports = routerProducts;
