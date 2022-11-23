const express = require('express');
const Basket = require('../daos/controllers/Basket.js');
const Products = require('../daos/controllers/Products.js');
const userDaos = require('../daos/controllers/userDaos.js');
const { logger } = require('../public/logger.js');
const router = require('./router.js');
const routerBasket = express.Router();
const app = express();

const basket = new Basket('basket');
const catalogo = new Products('productos');
const users = new userDaos('usuarios');

routerBasket.get('/', async (req, res) => {
  logger.info('RUTA: /api/basket/ || METODO: get');
  try {
    const user = await users.getItemById(req.user._id);
    const sanitizedUser = {
      name: user.username,
      _id: user._id,
      cart_id: user.cart_id,
    };
    const response = await basket.getItemById(req.user._id);

    const allProducts = response.catalogo.map((product) => ({
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
  const products = await basket.getCartProducts(req.params.id);
  if (products) return res.json(products);
  return res.json(null);
});

routerBasket.post('/', async (req, res) => {
  if (req.user.cart_id) return basket.getById(req.user.cart_id);
  const newCartId = await basket.save(req.user._id);
  return res.json(newCartId);
});

routerBasket.post('/:id/productos/', async (req, res) => {
  const product = await catalogo.getById(req.body.prod_id);
  await basket.addCartProduct(req.params.id, product);
  return res.sendStatus(204);
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
      const agregado = await basket.deleteProductoDeCarrito(
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
  basket.deleteById(idProduct).then((found) => {
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
    const nuevoProducto = await basket.updateById(id, id_prod, body);
    res.json({ success: 'ok', nuevoProducto, new: body });
  } catch (error) {
    logger.error(
      'RUTA: /api/basket/:id/productos/:id_prod || METODO: put'
    );
    res.send({ message: error.message });
  }
});

module.exports = routerBasket;
