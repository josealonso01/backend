const express = require('express');
const Messagges = require('../daos/Messages');
const ContenedorDB = require('../daos/Products');
const routerProducts = express.Router();
const router = require('./router');
const app = express();

const archivo = new ContenedorDB('productos');
const mensajes = new Messagges('mensajes');

routerProducts.get('/-test', (req, res, next) => {
  archivo.getProductos().then((prod) => {
    res.render('productsList', { prod, productsExist: true });
    console.log(prod);
  });
});

routerProducts.post('/-test', (req, res, next) => {
  archivo.popular().then((prod) => {
    res.json({ prod: prod });
  });
});

routerProducts.get('/', (req, res) => {
  archivo.getProductos().then((productos) => {
    res.json({ product: productos });
  });
});

routerProducts.get('/mensajes', (req, res) => {
  res.render('centroMensajes');
});

routerProducts.get('/:id', (req, res) => {
  let { id } = req.params;
  archivo.getById(id).then((producto) => {
    res.json({ product: producto });
  });
});

routerProducts.post('/', (req, res) => {
  const { body } = req;
  archivo.save(body).then((body) => {
    res.json({ productosagregados: body });
  });
});

routerProducts.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  archivo.updateById(id, body).then((prod) => {
    if (prod) {
      res.json({ success: 'ok', new: body });
    } else {
      res.json({ error: 'error' });
    }
  });
});

routerProducts.delete('/:id', (req, res) => {
  let { id } = req.params;
  archivo.deleteById(id).then(() => {
    res.json({ productoBorrado: id });
  });
});

routerProducts.delete('/', (req, res) => {
  archivo.deleteAll().then((productos) => {
    res.json({ productosBorrados: productos });
  });
});

module.exports = routerProducts;
