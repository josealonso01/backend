const dotenv = require('dotenv');
const { response } = require('express');
const CarritosDaoMongoDb = require('../daos/BasketDaos');
const MessaggesDaoMongoDb = require('../daos/mensajes');
const ProductosDaoMongoDb = require('../daos/ProductsDaos');
const esquemaMensaje = require('../modelsMDB/schemaMensajes');

const { logger } = require('../public/logger');
const User = require('./User');
dotenv.config();

const archivoController = new ProductosDaoMongoDb('productos');
const usersController = new User('usuarios');
const menssagesController = new MessaggesDaoMongoDb('mensajes');
const basketController = new CarritosDaoMongoDb('basket');

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
    console.log('msgjson', msgJson);
    res.render('mensajes', { msgJson });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllMessages,
  getByEmail,
};
