const express = require('express');
const Basket = require('../Contenedor/Basket');
const router = require('./router');
const routerBasket = express.Router();
const app = express();

const basket = new Basket('basket');

basket.getData();
//basket.getAll().then((x) => console.log(x));
basket.save();
//basket.getById().then((x) => console.log('getByID', x));
//basket.deleteById().then((x) => console.log('delete', x));
//basket.deleteAll(); 


routerBasket.get('/', (req, res) => {
  basket.getAll().then((prod) => {
    res.render('cartBasket', { prod, productsExist: true });
  });
});

routerBasket.get('/:id/productos', (req, res) => {
  let { id } = req.params;
  console.log('id', id);
  basket.getById(id).then((found) => {
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

routerBasket.post('/', (req, res) => {
  const { body } = req;
  body.price = parseFloat(body.price);
  basket.addOne(body).then((n) => {
    if (n) {
      res.render('cartBasket');
    } else {
      ({ error: 'error' });
    }
  });
});

routerBasket.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  basket.updateById(id, body).then((prod) => {
    if (prod) {
      res.json({ success: 'ok', new: prod });
    } else {
      res.json({ error: 'error' });
    }
  });
});

routerBasket.delete('/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  console.log('id', id);
  basket.deleteById(id).then((found) => {
    if (found) {
      res.json({ success: 'ok', id });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});


module.exports = routerBasket;
