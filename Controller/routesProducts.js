const express = require('express');
const ContenedorDB = require('../Contenedor/ContenedorDB');
const routerProducts = express.Router();
const router = require('./router');
const app = express();

const archivo = new ContenedorDB('productos');

routerProducts.get('/', (req, res) => {
  archivo.select().then((prod) => {
    console.log('aca', prod);
    res.json({ productos: prod });
  });
});

routerProducts.get('/:id', (req, res) => {
  let { id } = req.params;
  archivo.getById(id).then((found) => {
    if (found) {
      res.render('oneProduct', {
        product: found,
        title: 'Detalle de producto',
      });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});

routerProducts.post('/', (req, res) => {
  const { body } = req;
  body.price = parseFloat(body.price);
  body.stock = parseFloat(body.stock);
  archivo.insert(body).then((n) => {
    if (n) {
      res.render('form');
    } else {
      ({ error: 'error' });
    }
  });
});

routerProducts.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  archivo.updateById(id, body).then((prod) => {
    if (prod) {
      res.json({ success: 'ok', new: prod });
    } else {
      res.json({ error: 'error' });
    }
  });
});

routerProducts.delete('/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  archivo.deleteById(id).then((found) => {
    if (found) {
      res.json({ success: 'ok', id });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});

module.exports = routerProducts;
