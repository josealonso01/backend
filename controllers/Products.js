const dotenv = require('dotenv');
const CarritosDaoMongoDb = require('../daos/BasketDaos');
const ProductosDaoMongoDb = require('../daos/ProductsDaos');

const productosBD = new ProductosDaoMongoDb();

const { logger } = require('../public/logger');
const User = require('./User');
dotenv.config();

const isAdmin = true;

const checkAdmin = (req, res, next) => {
  if (!isAdmin) {
    res.send({
      error: -1,
      descripcion: `ruta 'api/productos' método '${req.method}' no autorizado`,
    });
  } else {
    next();
  }
};

const addProduct = async (req, res) => {
  try {
    const { body } = req;
    const { name, Descripcion, Codigo, picture, price, stock } =
      body;
    const timestamp = Date.now();
    const productoNuevo = {
      timestamp: parseInt(timestamp),
      name,
      Descripcion,
      Codigo,
      picture,
      price: parseFloat(price),
      stock: parseInt(stock),
    };
    await productosBD.save(productoNuevo);
    res.status(200).send({
      status: 200,
      message: 'producto agregado',
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const archivoController = new ProductosDaoMongoDb('productos');
const usersController = new User('usuarios');
const basketController = new CarritosDaoMongoDb('basket');

const getAllProducts = async (req, res) => {
  try {
    const productos = await productosBD.getAll();
    if (productos.length !== 0) {
      const user = await usersController.getItemById(req.user._id);
      const sanitizedUser = {
        name: user.username,
        _id: user._id,
        cart_id: user.cart_id,
      };
      logger.info('entro');
      if (!sanitizedUser.cart_id) {
        const response = await basketController.save(req.user._id);
        await usersController.addCart(user._id, response._id);
      }
      const response = await archivoController.getAll();

      const allProducts = response.map((product) => ({
        name: product.name,
        description: product.Descripcion,
        picture: product.picture,
        price: product.price,
        _id: product._id,
      }));

      return res.render('home', { sanitizedUser, allProducts });
    } else {
      res.status(200).send({
        status: 200,
        message: 'no hay productos',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const unProducto = await productosBD.getById(id);
    if (unProducto) {
      res.status(200).send({
        status: 200,
        data: {
          unProducto,
        },
        message: 'producto encontrado',
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'el producto no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let { body } = req;
    const timestamp = Date.now();
    body = {
      ...body,
      timestamp,
    };
    const result = await productosBD.modify(id, body);
    if (result) {
      res.status(200).send({
        status: 200,
        message: 'producto modificado',
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'el producto no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productosBD.deleteById(id);
    if (result) {
      res.status(200).send({
        status: 200,
        message: 'producto eliminado',
      });
    } else {
      res.status(200).send({
        status: 200,
        message: 'el producto no existe',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  checkAdmin,
  productosBD,
};
