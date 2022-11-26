const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const esquemaProducto = require('../modelsMDB/schemaProduct.js');
const generarUsuario = require('../public/generadorDeProductos');
const generarId = require('../public/generadorDeIds');
const dotenv = require('dotenv');
const { logger } = require('../public/logger');
dotenv.config();
class ContenedorDB {
  async connectMDB() {
    try {
      await MongoClient.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async save(nuevoProducto) {
    try {
      await esquemaProducto.create(nuevoProducto);
      await this.connectMDB();
      return nuevoProducto;
    } catch (error) {
      logger.error(error);
    }
  }

  async popular(cant = 5) {
    try {
      const nuevos = [];
      for (let i = 0; i < cant; i++) {
        const nuevoUsuario = generarUsuario(generarId());
        const guardado = await this.save(nuevoUsuario);
        nuevos.push(guardado);
      }
      return nuevos;
    } catch (error) {
      logger.error(error);
    }
  }
  async getProductos() {
    try {
      await this.connectMDB();
      const prod = await esquemaProducto.find({});
      return prod;
    } catch (error) {
      logger.error(error);
    }
  }

  async getById(id) {
    try {
      await this.connectMDB();
      if (id) {
        const prodId = await esquemaProducto.findById(id);
        return prodId;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteById(id) {
    try {
      await this.connectMDB();
      const deleteId = await esquemaProducto.deleteOne({ id: id });
      return deleteId;
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteAll() {
    try {
      await this.connectMDB();
      const deleteAll = await esquemaProducto.deleteMany({});
      return deleteAll;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateById(id, nuevo) {
    try {
      await this.connectMDB();
      const updateId = await esquemaProducto.updateOne(
        { id: id },
        { $set: nuevo }
      );
      return updateId;
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = ContenedorDB;
