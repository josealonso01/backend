const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const esquemaProducto = require('./modelsMDB/schemaProduct');
const generarUsuario = require('../public/generadorDeProductos');
const generarId = require('../public/generadorDeIds');

class ContenedorDB {
  async connectMDB() {
    try {
      const uri =
        'mongodb+srv://joseealonsoo01:josealonso01@cluster0.brkhg8m.mongodb.net/?retryWrites=true&w=majority';
      let rta = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
      });
    } catch (error) {
      console.log('hubo un error conectando mongodb', error);
    }
  }

  async save(nuevoProducto) {
    try {
      let tiempo = new Date();
      await this.connectMDB();
      nuevoProducto.time = tiempo.toString();
      await esquemaProducto.create(nuevoProducto);
      const id = nuevoProducto.id;
      mongoose.disconnect();
      return id;
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
      mongoose.disconnect();
      return nuevos;
    } catch (error) {
      throw Error(error.message);
    }
  }
  async getProductos() {
    try {
      await this.connectMDB();
      const prod = await esquemaProducto.find({});
      mongoose.disconnect();
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
        mongoose.disconnect();
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
      mongoose.disconnect();
      return deleteId;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteAll() {
    try {
      await this.connectMDB();
      const deleteAll = await esquemaProducto.deleteMany({});
      mongoose.disconnect();
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
      mongoose.disconnect();
      return updateId;
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = ContenedorDB;
