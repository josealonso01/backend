const esquemaCart = require('../modelsMDB/schemaCart');
const ContenedorMongoDb = require('../contenedores/ContenedorMongoDb');

class CarritosDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super(esquemaCart);
  }
}

module.exports = CarritosDaoMongoDb;
