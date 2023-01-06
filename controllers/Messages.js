const MessaggesDaoMongoDb = require('../daos/Mensajes');
const esquemaMensaje = require('../modelsMDB/schemaMensajes');

const menssagesController = new MessaggesDaoMongoDb('mensajes');

const getAllMessages = async (req, res) => {
  try {
    const msg = await menssagesController.getAll();
    if (msg) {
      res.render('centroMensajes');
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

const getByEmail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const mensajes = await esquemaMensaje.find({ id });
    const msgJson = [];
    for (let i = 0; i < mensajes.length; i++) {
      const msg = mensajes[i];
      if (msg.author.id === id) {
        msgJson.push(msg);
      }
    }
    res.render('mensajes', { msgJson });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllMessages,
  getByEmail,
};
