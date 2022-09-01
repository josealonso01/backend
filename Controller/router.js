const express = require('express');

const routerProducts = require('./routesProducts');
const routerBasket = require('./routesBasket');

const router = express.Router();

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

router.get('/form', (req, res) => {
  res.render('form');
});

module.exports = router;
