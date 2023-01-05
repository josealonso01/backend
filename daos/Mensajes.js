

const esquemaMensaje = require('../modelsMDB/schemaMensajes.js');
const ContenedorMongoDb = require('../contenedores/ContenedorMongoDb.js');



class MessaggesDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super(esquemaMensaje);
  }
}

module.exports = MessaggesDaoMongoDb;


