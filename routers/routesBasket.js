const express = require ('express');
const Basket = require ('../daos/Basket.js');
const Products = require ('../daos/Products.js');
const router = require ('./router.js');
const routerBasket = express.Router();
const app = express();

const basket = new Basket('basket');
const productos = new Products('productos');

routerBasket.get('/', (req, res) => {
  basket.getAll().then((productos) => {
    res.json({ product: productos });
  });
});

routerBasket.get('/:id', (req, res) => {
  let { id } = req.params;
  basket.getById(id).then((found) => {
    if (found) {
      res.json({ product: found });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});

routerBasket.post('/', async (req, res) => {
  try {
    const carrito = await basket.save();
    res.json({
      titulo: 'Carrito creado:',
      data: { carrito },
    });
  } catch (error) {
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
    const BuscoProducto = await basket.addProductToCart(id, id_prod);
    res.json({
      msg: 'Los productos de tu carrito son:',
      data: { BuscoProducto },
    });
  } catch (error) {
    res.send({ message: error.message });
  }
});

routerBasket.delete(
  '/:id/eliminarProducto/:id_prod',
  async function (req, res) {
    let { id } = req.params;
    let { id_prod } = req.params;
    try {
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
          res.json({ success: 'ok', idProduct });
        } else {
          res.json({ error: 'el producto no existe' });
        }
      });
    });
    
    routerBasket.put('/:id/productos/:id_prod', async (req, res) => {
      let { id } = req.params;
      let { id_prod } = req.params;
  const { body } = req;
  try {
    const nuevoProducto = await basket.updateById(id, id_prod, body);
    res.json({ success: 'ok', nuevoProducto, new: body });
  } catch (error) {
    res.send({ message: error.message });
  }
});

module.exports = routerBasket;
