import express from 'express';
import Messagges from '../daos/Messages.js';
import ContenedorDB from '../daos/Products.js';
import router from './router.js';

const routerProducts = express.Router();
const app = express();

const archivo = new ContenedorDB('productos');

routerProducts.get('/', (req, res) => {
  archivo.getProductos().then((productos) => {
    res.json({ product: productos });
  });
});

routerProducts.get('/:id', (req, res) => {
  let { id } = req.params;
  archivo.getById(id).then((producto) => {
    res.json({ product: producto });
  });
});

routerProducts.post('/', (req, res) => {
  const { body } = req;
  archivo.save(body).then((body) => {
    res.json({ productosagregados: body });
  });
});

routerProducts.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  archivo.updateById(id, body).then((prod) => {
    if (prod) {
      res.json({ success: 'ok', new: body });
    } else {
      res.json({ error: 'error' });
    }
  });
});

routerProducts.delete('/:id', (req, res) => {
  let { id } = req.params;
  archivo.deleteById(id).then(() => {
    res.json({ productoBorrado: id });
  });
});

routerProducts.delete('/', (req, res) => {
  archivo.deleteAll().then((productos) => {
    res.json({ productosBorrados: productos });
  });
});

export default routerProducts;
