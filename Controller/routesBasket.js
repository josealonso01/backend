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
  const addToCart = await basket.save();
  res.render('cartBasket', { addToCart });
});

routerBasket.post("/:id/productos/:id_prod", async (req, res) => {
  const BuscoProducto = await basket.getById(req.params.id_prod);

  if (BuscoProducto == null) {
    return res.status(404).json({
      msj: "El producto no existe",
    });
  }

  const product = await basket.addProductToCart(
    req.params.id,
    req.params.id_prod
  );

  res.json({
    msg: "Los productos de tu carrito son:",
    data: product,
  });
});


routerBasket.delete('/:id/productos', (req, res) => {
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
