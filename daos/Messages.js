const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const esquemaMensaje = require('./modelsMDB/schemaMessage.js');
const dotenv = require('dotenv');
dotenv.config();

class Messagges {
  async connect() {
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
      await this.connect();
      await esquemaMensaje.create(nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      console.log('error en el save', error);
    }
  }

  async getAll() {
    try {
      await this.connect();
      const prod = await esquemaMensaje.find({});
      return prod;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteAll() {
    try {
      await this.connect();
      const deleteAll = await esquemaMensaje.deleteMany({});
      return deleteAll;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
module.exports = Messagges;
