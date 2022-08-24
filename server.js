const express = require('express');
const { Router } = express;
const router = require('../backend/Controller/routes');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const Contenedor = require('./Contenedor/Contenedor');
const archivo = new Contenedor('productos');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin:'*' },
});

httpServer.listen(process.env.PORT || 8080, () =>
  console.log('SERVER ON')
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/productos', router);
app.use('/', router);

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
  res.render('productsList', {root: __dirname + '/public'});
});

let chat = [{
  email: 'admin@admin.com',
  message: 'hola',
  date: new Date().toLocaleDateString()
}];


const catalogo = {
  title: 'nike',
  price: 123.45,
  thumbnail: 'http://localhost:8080/public/nike.png',
};

io.on('connection', (socket) => {
  console.log('new connection');
  io.sockets.emit('productsList', catalogo);
  io.sockets.emit('chat', chat);
  socket.on('newMessage', (msg) => {
   chat.push(msg),
   io.sockets.emit('chat', chat)
  });
  socket.on('newProduct', (product) => {
    archivo.push(product), 
    io.sockets.emit('archivo', catalogo);
  });
});
