const express = require('express');
const Basket = require('../daos/Basket.js');
const Products = require('../daos/Products.js');
const userDaos = require('../daos/userDaos.js');
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
    console.log('El id del user', req.user._id);
    const user = await users.getItemById(req.user._id);
    const sanitizedUser = { name: user.username, _id: user._id };

    const response = await basket.getByUserId(req.user._id);

    const allProducts = response.catalogo.map((product) => ({
      name: product.name,
      description: product.Descripcion,
      picture: product.picture,
      price: product.price,
      _id: product._id,
    }));

    return res.render('cartBasket', {
      sanitizedUser,
      cart: { allProducts },
    });
  } catch (err) {
    logger.error(err);
  }
});

routerBasket.get('/:id', (req, res) => {
  let { id } = req.params;
  basket.getById(id).then((found) => {
    if (found) {
      logger.info('RUTA: /api/basket/:id || METODO: get');
      res.json({ product: found });
    } else {
      logger.error('RUTA:  /api/basket/:id || METODO: get');
      res.json({ error: 'el producto no existe' });
    }
  });
});

routerBasket.post('/', async (req, res) => {
  try {
    logger.info('RUTA: /api/basket/ || METODO: post');
    const carrito = await basket.save();
    res.json({
      titulo: 'Carrito creado:',
      data: { carrito },
    });
  } catch (error) {
    logger.error('RUTA:  /api/basket/ || METODO: post');
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

routerBasket.post('/:id/productos/:id_prod', async (req, res) => {
  let { id } = req.params;
  let { id_prod } = req.params;
  try {
    logger.info(
      'RUTA: /api/basket/:id/productos/:id_prod || METODO: post'
    );
    const BuscoProducto = await basket.addProductToCart(id, id_prod);
    res.json({
      msg: 'Los productos de tu carrito son:',
      data: { BuscoProducto },
    });
  } catch (error) {
    logger.error(
      'RUTA:  /api/basket/:id/productos/:id_prod  || METODO: post'
    );
    res.send({ message: error.message });
  }
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
