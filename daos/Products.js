const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const esquemaProducto = require('./modelsMDB/schemaProduct.js');
const generarUsuario = require('../public/generadorDeProductos.js');
const generarId = require('../public/generadorDeIds.js');
const dotenv = require('dotenv');
dotenv.config();
class ContenedorDB {
  async connectMDB() {
    try {
      await MongoClient.connect(process.env.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('ya estoy conectado');
    } catch (error) {
      console.log(`Ocurrio un error: ${error}`);
    }
  }

  async save(nuevoProducto) {
    try {
      await esquemaProducto.create(nuevoProducto);
      await this.connectMDB();
      return nuevoProducto;
    } catch (error) {
      console.log('error en el save', error);
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
      throw Error(error.message);
    }
  }
  async getProductos() {
    try {
      await this.connectMDB();
      const prod = await esquemaProducto.find({});
      return prod;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getById(id) {
    try {
      await this.connectMDB();
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const prodId = await esquemaProducto.findById(id);
        return prodId;
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteById(id) {
    try {
      await this.connectMDB();
      const deleteId = await esquemaProducto.deleteOne({ id: id });
      return deleteId;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteAll() {
    try {
      await this.connectMDB();
      const deleteAll = await esquemaProducto.deleteMany({});
      return deleteAll;
    } catch (error) {
      throw Error(error.message);
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
      throw Error(error.message);
    }
  }
}

module.exports = ContenedorDB;
