const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const esquemaMensaje = require('./modelsMDB/schemaMessage');

class Messagges {
  async connect() {
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
      await this.connect();
      await esquemaMensaje.create(nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      console.log('error en el save', error);
    }
  }

  async getAll(options) {
    try {
      let messages;
      if (options?.sort == true) {
        messages = await esquemaMensaje
          .find({})
          .sort({ timestamp: -1 });
      } else {
        messages = await esquemaMensaje.find({});
      }

      return messages;
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = Messagges;
