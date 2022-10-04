import express from 'express';

import router from './routers/router.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { engine } from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Products from './daos/Products.js';
import Messagges from './daos/Messages.js';
import { normalizeMessages } from './src/normalize.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';

const app = express();
const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {});

//Inicio de Servidor
httpServer.listen(process.env.PORT || PORT, () =>
  console.log('Servidor Funcionando en Puerto: ' + PORT)
);
httpServer.on('error', (error) =>
  console.log(`Error en servidor ${error}`)
);

app.use(cookieParser('A secret'));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://joseealonsoo01:josealonso01@cluster0.brkhg8m.mongodb.net/?retryWrites=true&w=majority',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.get('/', (req, res) => {
  res.sendFile('index.hbs', { root: __dirname });
});

let chat = [];

const catalogo = new Products('productos');
const mensajes = new Messagges('mensajes');

io.on('connection', async (socket) => {
  setTimeout(() => {
    socket.emit('Este es mi mensaje desde el servidor');
  }, 4000);

  let messages = await mensajes.getAll();

  io.sockets.emit('arr-chat', normalizeMessages(messages));
  socket.on('data-generica', async (data) => {
    let message = JSON.parse(data);
    await mensajes.save(message);
    let allMessages = await mensajes.getAll({ sort: true });

    console.log('arr-chat adentro del on', allMessages);

    io.sockets.emit('arr-chat', normalizeMessages(allMessages));
  });

  io.sockets.emit('prod', catalogo.getProductos());
  socket.on('prod', async () => {
    const productos = await catalogo.getProductos();
    productos.forEach((unProducto) => {
      socket.emit('prod', unProducto);
    });
  });
});
