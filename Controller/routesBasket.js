const express = require('express');
const Basket = require('../Contenedor/Basket');
const Contenedor = require('../Contenedor/Contenedor');
const router = require('./router');
const routerBasket = express.Router();
const app = express();

const basket = new Basket('basket');
const contenedor = new Contenedor('productos');

//basket.getData();
//basket.getAll().then((x) => console.log(x));
//basket.save();
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
  res.json({
    titulo: 'Carrito creado con el ID:',
    id: addToCart,
  });
});

routerBasket.post('/:id/productos/:id_prod', async (req, res) => {
  let { id } = req.params;
  let { id_prod } = req.params;
  console.log('el id_prod', id_prod);
  const BuscoProducto = await basket.getById(id);

  if (BuscoProducto == null) {
    return res.json({
      msj: 'El producto no existe',
    });
  }
  const product = await basket.addProductToCart(id, id_prod);
  res.json({
    msg: 'Los productos de tu carrito son:',
    data: product,
  });
});

routerBasket.delete('/:id', (req, res) => {
  let { id } = req.params;
  console.log('id', id);
  basket.deleteById(id).then((found) => {
    if (found) {
      res.json({ success: 'ok', id });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});

routerBasket.delete('/:id/productos/:id_prod', (req, res) => {
  let { id } = req.params;
  let { id_prod } = req.params;
  console.log('id', id);
  basket.deleteById(id, id_prod).then((found) => {
    if (found) {
      res.json({ success: 'ok', id, id_prod });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});

module.exports = routerBasket;
