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

let chat = [];

const catalogo = new Contenedor('productos');

const basket = new Basket('carrito');

io.on('connection', (socket) => {
  console.log('Usuario conectado ' + socket.id);
  chat.push('se unio al chat ' + socket.id);
  io.sockets.emit('arr-chat', chat);
  setTimeout(() => {
    socket.emit('Este es mi mensaje desde el servidor');
  }, 4000);

  socket.on('data-generica', (data) => {
    chat.push(data);
    io.sockets.emit('arr-chat', chat);
  });

  io.sockets.emit('prod', catalogo.getAll());

  socket.on('prod', async () => {
    const productos = await catalogo.getAll();
    productos.forEach((unProducto) => {
      socket.emit('prod', unProducto);
    });
  });
});
