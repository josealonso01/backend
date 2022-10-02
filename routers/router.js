import express from 'express';

import routerProducts from './routesProducts.js';
import routerBasket from './routesBasket.js';

const router = express.Router();

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

router.get('/form', (req, res) => {
  res.render('form');
});

export default router;
