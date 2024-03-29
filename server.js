const express = require('express');
const router = require('./routers/router');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const { engine } = require('express-handlebars');
const passport = require('passport');
const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const minimist = require('minimist');
const LocalStrategy = require('passport-local').Strategy;
const cluster = require('cluster');
const os = require('os');
const MongoStore = require('connect-mongo');
const User = require('./controllers/User');
const UsuarioSchema = require('./modelsMDB/Usuarios');
const socketIO = require('socket.io');
const http = require('http');
const sendMail = require('./utils/sendMail.js');
const Messagges = require('./daos/Mensajes.js');
const { normalizeMessages } = require('./public/normalize.js');

dotenv.config();
//CONECTO SERVIDOR

const app = express();
const PORT = parseInt(process.argv[2]) || process.env.PORT;
//SOCKETS
let server = http.createServer(app);
let io = socketIO(server);
server.listen(PORT);

const mensajes = new Messagges('mensajes');

io.on('connection', async (socket) => {
  console.log('New user connected');
  let messages = await mensajes.getAll();

  io.sockets.emit('arr-chat', normalizeMessages(messages));
  socket.on('data-generica', async (data) => {
    let message = JSON.parse(data);
    await mensajes.save(message);
    let allMessages = await mensajes.getAll({ sort: true });

    console.log('arr-chat adentro del on', allMessages);

    io.sockets.emit('arr-chat', normalizeMessages(allMessages));
  });
});

const optionalArgsObject = {
  alias: {
    port: 'puerto',
    m: 'modo',
  },
  default: {
    port: 8080,
    m: 'FORK',
  },
};
const args = minimist(process.argv.slice(2), optionalArgsObject);
const modoCluster = process.argv[3] == 'CLUSTER';

if (modoCluster && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Número de procesadores: ${numCPUs}`);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(
      'Worker',
      worker.process.pid,
      'died',
      new Date().toLocaleString()
    );
    cluster.fork();
  });
}

//AUTH

function isValidPassword(username, password) {
  return bCrypt.compareSync(password, username.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    secret: 'shhhhh',
  })
);

mongoose
  .connect(process.env.URL)
  .then(() => console.log('Connected to DB'))
  .catch((e) => {
    console.error(e);
    throw 'can not connect to the db';
  });

const usersController = new User('usuarios');

passport.use(
  'login',
  new LocalStrategy(
    { username: 'email' },
    (username, password, done) => {
      UsuarioSchema.findOne({ username }, (err, user) => {
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
    }
  )
);

passport.use(
  'signup',
  new LocalStrategy(
    { username: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await usersController.getByEmail(email);
        if (user)
          return done(null, false, {
            message: 'El nombre de usuario ya esta en uso.',
          });

        const newUser = {
          email: req.body.email,
          password: createHash(password),
          username: req.body.username,
          address: req.body.address,
          phone: req.body.phone,
        };
        UsuarioSchema.create(newUser, (err, userWithId) => {
          if (err) {
            console.log('Error in Saving user: ' + err);
            return done(err);
          }
          console.log(user);
          console.log('User Registration succesful');
          return done(null, userWithId);
        });
        await sendMail(
          process.env.GMAIL_ACCOUNT,
          'Nuevo Registro',
          JSON.stringify(newUser, null, 2)
        );
        return done(null);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Se Ejecuta el serializeUser', user);
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log('Se Ejecuta el deserializeUser', id);
  UsuarioSchema.findById(id, done);
});

//CONFIG APP

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
  res.redirect('/api/login');
});
