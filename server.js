const express = require('express');
const { Router } = express;
const router = require('./Controller/router');
const { engine } = require('express-handlebars');
const path = require('path');
const Contenedor = require('./Contenedor/Contenedor');
const Basket = require('./Contenedor/Basket');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

httpServer.listen(process.env.PORT || 8080, () =>
  console.log('SERVER ON')
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/api', router);

//CONFIGURACION HBS
app.set('view engine', 'hbs');
app.set('views', './views'); //DONDE VAN LOS HTMLS (CARPETA VIWES)
app.engine(
  'hbs',
  engine({
    extname: '.hbs', //EXTENSIONES SON .HBS
    defaultLayout: 'index.hbs', //CUAL ES EL LAYOUT POR DEFECTO (PLANTILLA BASE)
    layoutsDir: __dirname + '/views/layouts', //DONDE VAN A ESTAR LOS LAYOUTS
    partialsDir: __dirname + '/views/partials', //DONDE VAN A ESTAR LOS PARTIALS(PEDAZOS DE HTML QUE QUIERO REUTILIZAR EN DISTINTAS VISTAS)
  })
);

app.get('/', (req, res) => {
  res.sendFile('index.hbs', { root: __dirname });
});

//TODO CHEQUEAR SI LA BASE DE DATOS YA EXISTE ANTES DE CREARLA
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './DB/ecommerce',
  },
  useNullAsDefault: true,
});

knex.schema.hasTable('mensajes').then(function (exists) {
  if (!exists) {
    return knex.schema
      .createTable('mensajes', (table) => {
        table.increments('id'),
          table.string('user'),
          table.string('texto');
        table.dateTime('dateTime');
      })
      .then((res) => {
        console.log('todo bien', res);
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      })
      .finally(() => {
        knex.destroy();
      });
  }
});

let chat = [];

const catalogo = new Contenedor('productos');

const basket = new Basket('carrito');

io.on('connection', (socket) => {
  setTimeout(() => {
    socket.emit('Este es mi mensaje desde el servidor');
  }, 4000);
  socket.on('data-generica', (data) => {
    chat.push(data);
    console.log('arr-chat adentro del on', chat);
    io.sockets.emit('arr-chat', chat);
    knex('mensajes')
      .insert(data)
      .then((res) => console.log('mensajes insertados', res))
      .catch((error) => console.log(error));
  });

  io.sockets.emit('prod', catalogo.getAll());
  socket.on('prod', async () => {
    const productos = await catalogo.getAll();
    productos.forEach((unProducto) => {
      socket.emit('prod', unProducto);
    });
  });
});

io.sockets.on('data-generica', (mensaje) => {
  const enviar = document.createElement('h1');
  enviar.innerHTML = `<div> ${mensaje.msg} </div>`;
  const mensajes = document.getElementById('data');
  mensajes.appendChild(enviar);
});
