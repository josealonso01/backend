const express = require('express');
const ContenedorDB = require('../controllers/Products');
const { logger } = require('../public/logger.js');
const router = require('./router.js');

const routerProducts = express.Router();
const app = express();
const archivo = new ContenedorDB('productos');

routerProducts.get('/', (req, res) => {
  archivo.getProductos().then((prod) => {
    logger.info('RUTA: /api/products/ || METODO: get');
    res.render('productsList', { prod, productsExist: true });
  });
});

routerProducts.get('/:id', (req, res) => {
  let { id } = req.params;
  archivo.getById(id).then((producto) => {
    logger.info('RUTA: /api/products//:id || METODO: get');
    res.json({ product: producto });
  });
});

routerProducts.post('/', (req, res) => {
  const { body } = req;

  archivo.save(body).then((body) => {
    if (body) {
      logger.info('RUTA: /api/products/ || METODO: post');
      res.render('oneProduct', { body });
    } else {
      logger.error('RUTA:  /api/basket/:id || METODO: get');
      res.render('errorProductos');
    }
  });
});

routerProducts.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  archivo.updateById(id, body).then((prod) => {
    if (prod) {
      logger.info('RUTA: /api/products/:id || METODO: put');
      res.json({ success: 'ok', new: body });
    } else {
      logger.error('RUTA: /api/products/:id || METODO: put');
      res.json({ error: 'error' });
    }
  });
});

routerProducts.delete('/:id', (req, res) => {
  let { id } = req.params;
  archivo.deleteById(id).then(() => {
    logger.info('RUTA: /api/products/:id || METODO: delete');
    res.json({ productoBorrado: id });
  });
});

routerProducts.delete('/', (req, res) => {
  archivo.deleteAll().then((productos) => {
    logger.info('RUTA: /api/products/ || METODO: delete');
    res.json({ productosBorrados: productos });
  });
});

module.exports = routerProducts;
