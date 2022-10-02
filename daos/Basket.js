import admin from 'firebase-admin';
import Producto from './Products.js';
import { query } from 'express';
import arrayRemove from 'firebase-admin';
import FieldValue from 'firebase-admin';
import FirebaseFirestore from 'firebase-admin';
import remove  from './modelsMDB/schemaProduct.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./bd/ecommerce-nodejs-90296-firebase-adminsdk-ltiph-b74c0a1b45.json');

const catalogo = new Producto('productos');
class Basket {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(config),
    });
  }

  async save() {
    const db = admin.firestore();
    const query = db.collection('basket');
    let time = new Date();
    try {
      const doc = query.doc();
      const carrito = await doc.create({
        timestamp: time.toString(),
        productos: [],
      });
      return carrito;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getAll() {
    try {
      const found = await admin
        .firestore()
        .collection('basket')
        .get();
      return found.docs.map((doc) => doc.data());
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getById(id) {
    try {
      const db = admin.firestore();
      const query = db.collection('basket');
      const doc = query.doc(String(id));
      const found = await doc.get();
      return found.data();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async addProductToCart(idcart, idProduct) {
    try {
      function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      let product = await catalogo.getById(idProduct);

      const db = admin.firestore();
      const query = db.collection('basket');
      const doc = query.doc(idcart);

      let idRandom = random(1, 10000);

      product.id = String(idRandom);

      const item = await doc.update({
        productos: admin.firestore.FieldValue.arrayUnion({
          id: product.id,
          name: product.name,
          price: product.price,
          Descripcion: product.Descripcion,
          Codigo: product.Codigo,
          stock: product.stock,
          picture: product.picture,
        }),
      });
      return item;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteById(id) {
    try {
      const db = admin.firestore();
      const query = db.collection('basket');
      const doc = query.doc(String(id));
      const found = await doc.delete();
      return found;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteProductoDeCarrito(idCarrito, idProduct) {
    try {
      let product = await catalogo.getById(idProduct);

      const db = admin.firestore();
      const query = db.collection('basket');
      const doc = query.doc(idCarrito);
      const item = await doc.update({
        productos: admin.firestore.FieldValue.arrayRemove({
          id: product.id,
          name: product.name,
          price: product.price,
          Descripcion: product.Descripcion,
          Codigo: product.Codigo,
          stock: product.stock,
          picture: product.picture,
        }),
      });
      return item;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async updateById(idCart, idProduct, body) {
    try {
      let product = await catalogo.getById(idProduct);
      const db = admin.firestore();
      const query = db.collection('basket');
      const doc = query.doc(idCart);
      const removeItem = await doc.update({
        productos: admin.firestore.FieldValue.arrayRemove({
          id: product.id,
          name: product.name,
          price: product.price,
          Descripcion: product.Descripcion,
          Codigo: product.Codigo,
          stock: product.stock,
          picture: product.picture,
        }),
      });
      const replaceItem = await doc.update({
        productos: admin.firestore.FieldValue.arrayUnion({
          name: body.name,
          price: body.price,
          Descripcion: body.Descripcion,
          Codigo: body.Codigo,
          stock: body.stock,
          picture: body.picture,
        }),
      });
      return replaceItem;
    } catch (error) {
      throw Error(error.message);
    }
  }
}

export default Basket;
