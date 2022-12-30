const express = require('express');
const routerProducts = require('./routesProducts.js');
const routerBasket = require('./routesBasket.js');
const passport = require('passport');
const { fork } = require('child_process');
const os = require('os');
const path = require('path');
const compression = require('compression');
const { logger } = require('../public/logger.js');
const { createTransport } = require('nodemailer');
const User = require('../controllers/User');
const ProductosDaoMongoDb = require('../daos/ProductsDaos.js');
const CarritosDaoMongoDb = require('../daos/BasketDaos.js');
const router = express.Router();

const archivoController = new ProductosDaoMongoDb('productos');
const numCPUs = os.cpus().length;

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('login');
  }
}
router.get('/form', checkAuthentication, async (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  req.session.contador = 0;
  req.session.contador++;
  const datos = req.session;
  res.render('form', { user, datos });
});

const scriptPath = path.resolve(
  __dirname,
  '../public/randomsFunction.js'
);

router.get('/random', (req, res) => {
  try {
    logger.info('RUTA: /api/random || METODO: get');
    const cant = req.query.cant || 100000;
    const computo = fork(scriptPath);
    computo.send(cant);
    computo.on('exit', (code) => {
      console.log(`child_process exited with code ${code}`);
    });

    computo.on('message', (resultado) => {
      res.json({
        result: resultado,
      });
    });
  } catch (error) {
    logger.error('RUTA: /api/randoms || METODO: get');
  }
});

router.get('/-test', (req, res, next) => {
  logger.info('RUTA: /api/-test || METODO: get');
  archivoController.getAll().then((prod) => {
    res.render('productsList', { prod, productsExist: true });
  });
});

router.post('/-test', (req, res, next) => {
  logger.info('RUTA: /api/-test || METODO: post');
  archivoController.popular().then((prod) => {
    res.json({ prod: prod });
  });
});

const infodelProceso = {
  args: process.argv.slice(2),
  plataforma: process.platform,
  nodeVersion: process.version,
  memoria: JSON.stringify(process.memoryUsage.rss()),
  execPath: process.cwd(),
  processID: process.pid,
  carpeta: process.argv[1],
  cantidadNucleos: numCPUs,
};

router.get('/info', compression(), (req, res) => {
  try {
    logger.info('RUTA: /api/info || METODO: get');
    const data = infodelProceso;
    res.render('info', { data });
  } catch (error) {
    logger.error('RUTA: /info || METODO: get');
  }
});

const passportOptions = {
  badRequestMessage: 'falta usuario / contraseña',
};

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('login');
  }
}

router.get('/ruta-protegida', checkAuthentication, (req, res) => {
  logger.info('RUTA: /ruta-protegida || METODO: get');
  const { username, password } = req.user;
  const user = { username, password };
  res.send('<h1>Ruta ok!</h1>', user);
});

router.get('/signup', (req, res) => {
  try {
    logger.info('RUTA: /api/signup || METODO: get');
    res.render('register');
  } catch (error) {
    logger.error('RUTA: /signup || METODO: get');
  }
});

const transporter = createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post('/signup', (req, res, next) => {
  const { body } = req;
  const mailOptions = {
    from: 'Servidor Node.js',
    to: body.email,
    subject: 'Nuevo registro',
    html: `<h1 style="color: blue;">Nuevo Registro<span style="color: black;">  tu usario es ${body.username} y tu contraseña ${body.password}</span></h1>`,
  };
  logger.info('RUTA: /api/signup || METODO: post');
  passport.authenticate(
    'signup',
    passportOptions,
    async (err, user, info) => {
      if (user) {
        try {
          const enviarMail = await transporter.sendMail(mailOptions);
        } catch (err) {
          logger.error(err);
        }
      }
      console.log('err', err, 'user:', user, 'info:', info);
      if (err) {
        return next(err);
      }
      if (!user) return res.render('register-error');
      logger.warn('RUTA: /signup || METODO: post');
      res.render('userCreated');
    }
  )(req, res, next);
});

router.get('/login', (req, res) => {
  logger.info('RUTA: /api/login || METODO: get');
  res.render('login');
});

router.get('/login-error', (req, res) => {
  logger.error('RUTA: /api/login || METODO: get');
  res.render('login-error');
});

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: 'login-error',
    failureMessage: true,
  }),
  (req, res) => {
    try {
      logger.info('RUTA: /api/login || METODO: post');
      res.redirect('/api/productos');
    } catch (error) {
      logger.error('RUTA: /api/login || METODO: post');
    }
  }
);

router.get('/datos', checkAuthentication, async (req, res) => {
  try {
    logger.info('RUTA: /api/datos || METODO: get');
    const { username, password } = req.user;
    const user = { username, password };
    req.session.contador = 0;
    req.session.contador++;
    const datos = req.session;
    res.render('form', { user, datos });
  } catch (error) {
    logger.error('RUTA: /datos || METODO: get');
  }
});

router.get('/', (req, res) => {
  logger.info('RUTA: /api/ || METODO: get');
  res.redirect('api/login');
});

router.get('/logout', (req, res) => {
  logger.info('RUTA: /api/logout || METODO: get');
  const { username } = req.user;
  const user = { username };
  res.render('logout', { user });
  req.session.destroy();
});

module.exports = router;
