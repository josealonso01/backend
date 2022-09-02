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
  basket.getAll().then((addToCart) => {
    res.render('cartBasket', { addToCart });
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

routerBasket.post('/', async (req, res) => {
  const addToCart = await basket.addProductToCart();
  res.json({
    titulo: 'Carrito creado con el ID:',
    id: addToCart,
  });
});


module.exports = routerBasket;
