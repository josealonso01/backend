const admin = require('firebase-admin');
const Producto = require('./Products.js');
const esquemaCart = require('../modelsMDB/schemaCart.js');
const esquemaProducto = require('../modelsMDB/schemaProduct.js');
const MongoClient = require('mongodb').MongoClient;
const { logger } = require('../../public/logger.js');

const catalogoController = new Producto('productos');
class Basket {
  async connectMDB() {
    try {
      await MongoClient.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      logger.error(err);
    }
  }

  async save(nuevoProducto) {
    try {
      await this.connectMDB();
      await esquemaCart.create(nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      logger.error(error)
    }
  }

  getItems = async () => {
    await this.connectMDB();
    let arr = [];
    try {
      arr = await esquemaCart.find({});
    } catch (err) {
      logger.error(err);
    }
    return arr;
  };

  getItemById = async (id) => {
    let item = {};
    try {
      item = esquemaCart.findById(id);
    } catch (err) {
      logger.error(err);
    }
    return item;
  };

  createItem = async (item) => {
    await this.connectMDB();
    let newItem = new esquemaCart(item);
    try {
      await newItem.save();
      return newItem;
    } catch (err) {
      throw Error(err);
    }
  };

  updateItem = async (id, newItem) => {
    await this.connectMDB();
    try {
      let product = await this.getItemById(id);
      Object.assign(product, newItem);
      await product.save();
    } catch (err) {
      logger.error(err);
    }
  };

  deleteItem = async (id) => {
    await this.connectMDB();
    try {
      await esquemaCart.deleteOne({ _id: id });
    } catch (err) {
      logger.error(err);
    }
  };

  deleteCartProduct = async (id, prodId) => {
    await this.connectMDB();
    let cart;
    try {
      cart = await this.getItemById(id);
      cart.products.id(prodId).remove();
      await cart.save();
    } catch (err) {
      logger.error(err);
    }
  };

  getCartByUserId = async (id) => {
    await this.connectMDB();
    let cart;
    console.log('a ver el getcarts by user id');
    try {
      cart = await esquemaCart.findOne({ user_id: id });
    } catch (err) {
      logger.error(err);
    }
    return cart ? cart : undefined;
  };

  getCartProducts = (id) => {
    const cart = this.getItemById(Number(id));
    return cart.products;
  };

  addCartProduct = async (id_user, id_prod) => {
    const cart = await this.getCartByUserId({ _id: id_user });
    if (cart == null) {
      let newCartData = {
        products: [],
        user_id: id_user,
      };
      cart = await this.createItem(newCartData);
    }
    const prod = await catalogoController.getById(id_prod);
    cart.products.push(prod);
    await cart.save();
    return;
  };
}

module.exports = Basket;
