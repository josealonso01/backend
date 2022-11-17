const MongoClient = require('mongodb').MongoClient;
const Usuarios = require('./modelsMDB/Usuarios');

class userDaos {
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

  async getItemById(id) {
    try {
      await this.connectMDB();
      const usuario = await Usuarios.findById(id);
      return usuario;
    } catch (error) {
      throw Error(error.message);
    }
  }

  getByEmail = async (email) => {
    console.log('entro');
    try {
      const user = await Usuarios.findOne({ email });
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  addCart = async (userId, cartId) => {
    try {
      const user = await Usuarios.findOneAndUpdate(
        { _id: userId },
        { cart_id: cartId }
      );
      return cartId;
    } catch (err) {
      console.log(err);
    }
  };

  deleteCart = async (id) => {
    try {
      const user = Usuarios.findOneAndUpdate(
        { cart_id: id },
        { $unset: { cart_id: 1 } }
      );
      return user;
    } catch (e) {
      console.log(e);
    }
  };
}

module.exports = userDaos;
