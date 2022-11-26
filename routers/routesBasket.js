const express = require('express');
const { createTransport } = require('nodemailer');
const Basket = require('../controllers/Basket');
const Products = require('../controllers/Products');
const User = require('../controllers/User');
const { logger } = require('../public/logger.js');
const sendMail = require('../utils/sendMail.js');
const sendSMS = require('../utils/sendMessage.js');
const sendWhatsapp = require('../utils/sendWhatsapp.js');
const router = require('./router.js');
const routerBasket = express.Router();
const app = express();

const basketController = new Basket('basket');
const catalogoController = new Products('productos');
const usersController = new User('usuarios');

routerBasket.get('/', async (req, res) => {
  logger.info('RUTA: /api/basket/ || METODO: get');
  try {
    const user = await usersController.getItemById(req.user._id);

    const sanitizedUser = {
      name: user.username,
      _id: user._id,
      cart_id: user.cart_id.toString(),
    };
    const response = await basketController.getCartByUserId(
      sanitizedUser.cart_id
    );
    const allProducts = response.products.map((product) => ({
      name: product.name,
      description: product.Descripcion,
      picture: product.picture,
      price: product.price,
      _id: product._id,
    }));

    return res.render('cartBasket', {
      sanitizedUser,
      cart: { allProducts, cart_id: response._id },
    });
  } catch (err) {
    logger.error(err);
  }
});

routerBasket.get('/:id/productos', async (req, res) => {
  const products = await basketController.getCartProducts(
    req.params.id
  );
  if (products) return res.json(products);
  return res.json(null);
});

routerBasket.post('/', async (req, res) => {
  if (req.user.cart_id)
    return basketController.getById(req.user.cart_id);
  const newCartId = await basketController.save(req.user._id);
  return res.json(newCartId);
});

routerBasket.post('/:id/productos/', async (req, res) => {
  const product = await catalogoController.getById(req.body.prod_id);
  await basketController.addCartProduct(req.params.id, product);
  return res.redirect('/api/basket');
});

routerBasket.post('/:id', async (req, res) => {
  const cart = await basketController.getItemById(req.params.id);
  const formattedProducts = cart.products.map(
    (product) =>
      `Producto: ${product.name} <br />
        Precio: ${product.price}
        `
  );
  await sendMail(
    null,
    `Nuevo pedido de ${req.user.email}`,
    `<p>${formattedProducts.join('</p><p>')}</p>`
  );
  const newUser = await usersController.deleteCart(cart._id);
  await sendSMS('La orden fue confirmada');
  await sendWhatsapp(
      'Se ha creado una nueva orden de compra de parte de: ' +
        req.user.name
    );
  return res.redirect('/api/home');
});

routerBasket.delete(
  '/:id/eliminarProducto/:id_prod',
  async function (req, res) {
    let { id } = req.params;
    let { id_prod } = req.params;
    try {
      logger.info(
        'RUTA: /api/basket/:id/eliminarProducto/:id_prod || METODO: delete'
      );
      const agregado = await basketController.deleteProductoDeCarrito(
        id,
        id_prod
      );
      res.status(200).send({
        status: 200,
        data: {
          agregado,
        },
        message: 'producto eliminado del carrito',
      });
    } catch (error) {
      logger.error(
        'RUTA:  /api/basket/:id/eliminarProducto/:id_prod || METODO: delete'
      );
      res.status(500).send({
        status: 500,
        message: error.message,
      });
    }
  }
);

routerBasket.delete('/producto/:idProduct', (req, res) => {
  let { idProduct } = req.params;
  basketController.deleteById(idProduct).then((found) => {
    if (found) {
      logger.info(
        'RUTA: /api/basket/producto/:idProduct || METODO: delete'
      );
      res.json({ success: 'ok', idProduct });
    } else {
      logger.error(
        'RUTA: /api/basket/producto/:idProduct || METODO: delete'
      );
      res.json({ error: 'el producto no existe' });
    }
  });
});

routerBasket.put('/:id/productos/:id_prod', async (req, res) => {
  let { id } = req.params;
  let { id_prod } = req.params;
  const { body } = req;
  try {
    logger.info(
      'RUTA: /api/basket/:id/productos/:id_prod || METODO: put'
    );
    const nuevoProducto = await basketController.updateById(
      id,
      id_prod,
      body
    );
    res.json({ success: 'ok', nuevoProducto, new: body });
  } catch (error) {
    logger.error(
      'RUTA: /api/basket/:id/productos/:id_prod || METODO: put'
    );
    res.send({ message: error.message });
  }
});

module.exports = routerBasket;
