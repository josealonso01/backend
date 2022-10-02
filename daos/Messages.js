import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import esquemaMensaje from './modelsMDB/schemaMessage.js';

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
export default Messagges;
