const { connectMDB, disconnectMDB } = require('../config');

class ContenedorMongoDb {
  constructor(name) {
    this.name = name;
  }

  async save(obj) {
    try {
      await connectMDB();
      const objNuevo = new this.name({ ...obj });
      const objCreado = await objNuevo.save();
      disconnectMDB();
      return objCreado._id;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      await connectMDB();
      const objEncontrado = await this.name.findById(id);
      disconnectMDB();
      return objEncontrado;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      await connectMDB();
      const objEncontrados = await this.name.find();
      disconnectMDB();
      return objEncontrados;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      await connectMDB();
      const objEncontrado = await this.name.findById(id);
      await this.name.findByIdAndDelete(id);
      disconnectMDB();
      return objEncontrado;
    } catch (error) {
      console.log(error);
    }
  }

  async modify(id, replace) {
    try {
      await connectMDB();
      const objModificado = await this.name.findByIdAndUpdate(id, {
        $set: { ...replace },
      });
      disconnectMDB();
      return objModificado;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ContenedorMongoDb;
