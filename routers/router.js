import express from 'express';

import routerProducts from './routesProducts.js';
import routerBasket from './routesBasket.js';
import ContenedorDB from '../daos/Products.js';
import Messagges from '../daos/Messages.js';

const router = express.Router();
const archivo = new ContenedorDB('productos');
const mensajes = new Messagges('mensajes');

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

router.get('/form', (req, res) => {
  res.render('form');
});

router.get('/-test', (req, res, next) => {
  archivo.getProductos().then((prod) => {
    res.render('productsList', { prod, productsExist: true });
    console.log(prod);
  });
});

router.get('/mensajes', (req, res) => {
  res.render('centroMensajes');
});

router.post('/-test', (req, res, next) => {
  archivo.popular().then((prod) => {
    res.json({ prod: prod });
  });
});

router.delete('/mensajes', (req, res) => {
  mensajes.deleteAll().then((productos) => {
    res.json({ productosBorrados: productos });
  });
});

export default router;
