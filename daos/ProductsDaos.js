const esquemaProducto = require('../modelsMDB/schemaProduct');
const ContenedorMongoDb = require('../contenedores/ContenedorMongoDb');

class ProductosDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super(esquemaProducto);
  }
}

module.exports = ProductosDaoMongoDb;
