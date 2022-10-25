const mongoose = require ('mongoose');
const { MongoClient, ServerApiVersion } = require ('mongodb');
const esquemaMensaje = require ('./modelsMDB/schemaMessage.js');
const  dotenv = require ('dotenv');
dotenv.config();

class Messagges {
  async connect() {
    try {
      const url = process.env.URL;
      let rta = await mongoose.connect(url, {
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
      mongoose.disconnect();
      return prod;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async deleteAll() {
    try {
      await this.connect();
      const deleteAll = await esquemaMensaje.deleteMany({});
      mongoose.disconnect();
      return deleteAll;
    } catch (error) {
      throw Error(error.message);
    }
  }
}
module.exports = Messagges;
