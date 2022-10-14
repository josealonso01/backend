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
import passport from 'passport';
import bCrypt from 'bcrypt';
import redis from 'redis';
import mongoose from 'mongoose';
import session from 'express-session';
import { createRequire } from 'module';
import * as dotenv from 'dotenv';
import minimist from 'minimist';
import Usuarios from './daos/modelsMDB/Usuarios.js';
const require = createRequire(import.meta.url);
const LocalStrategy = require('passport-local').Strategy;
const RedisStore = require('connect-redis')(session);
dotenv.config();

//CONECTO SERVIDOR

const app = express();

const optionalArgsObject = {
  alias: {
    port: 'puerto',
  },
  default: {
    port: 8080,
  },
};
const args = minimist(process.argv.slice(2), optionalArgsObject);

const PORT = args.puerto;

const httpServer = createServer(app);
const io = new Server(httpServer, {});

httpServer.listen(process.env.PORT || PORT, () =>
  console.log('Servidor Funcionando en Puerto: ' + PORT)
);
httpServer.on('error', (error) =>
  console.log(`Error en servidor ${error}`)
);



//AUTH
const client = redis.createClient({
  legacyMode: true,
});

client.connect();

function isValidPassword(username, password) {
  return bCrypt.compareSync(password, username.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

mongoose
  .connect(process.env.MONGOOSE)
  .then(() => console.log('Connected to DB'))
  .catch((e) => {
    console.error(e);
    throw 'can not connect to the db';
  });

passport.use(
  'login',
  new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log('usuario no encontrado' + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log('contraseña invalida');
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  'signup',
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
        if (user) {
          console.log('User already exists');
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            console.log('Error in Saving user: ' + err);
            return done(err);
          }
          console.log(user);
          console.log('User Registration succesful');
          return done(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Se Ejecuta el serializeUser');
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log('Se Ejecuta el deserializeUser');
  Usuarios.findById(id, done);
});

app.use(
  session({
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      client,
      ttl: 300,
    }),
    secret: 'keyboard cat',
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 86400000, // 1 dia
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

//CONFIG APP

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
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

//SOCKETS

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
