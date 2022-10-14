import express from 'express';
import routerProducts from './routesProducts.js';
import routerBasket from './routesBasket.js';
import ContenedorDB from '../daos/Products.js';
import Messagges from '../daos/Messages.js';
import passport from 'passport';
import { fork } from 'child_process';

const router = express.Router();
const archivo = new ContenedorDB('productos');
const mensajes = new Messagges('mensajes');

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

router.get('/form', (req, res) => {
  res.render('form');
});

router.get('/random', (req, res) => {
  const cant = req.query.cant || 100000;
  const computo = fork('./public/randomsFunction.js');
  computo.send({ message: 'start', cant: cant });
  computo.on('message', (msg) => {
    res.json({ mensaje: msg });
  });
});

router.get('/-test', (req, res, next) => {
  archivo.getProductos().then((prod) => {
    res.render('productsList', { prod, productsExist: true });
    console.log(prod);
  });
});

router.get('/mensajes', (req, res) => {
  res.render('centroMensajes');
});

router.post('/-test', (req, res, next) => {
  archivo.popular().then((prod) => {
    res.json({ prod: prod });
  });
});

router.delete('/mensajes', (req, res) => {
  mensajes.deleteAll().then((productos) => {
    res.json({ productosBorrados: productos });
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
};

router.get('/info', (req, res) => {
  const data = infodelProceso;
  res.render('info', { data });
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
  const { username, password } = req.user;
  const user = { username, password };
  res.send('<h1>Ruta ok!</h1>', user);
});

router.get('/signup', (req, res) => {
  res.render('register');
});

router.post('/signup', (req, res, next) => {
  passport.authenticate(
    'signup',
    passportOptions,
    (err, user, info) => {
      console.log('Info SIGNUP');
      console.log('err', err, 'user:', user, 'info:', info);
      if (err) {
        return next(err);
      }
      if (!user) return res.render('register-error');

      res.render('userCreated');
    }
  )(req, res, next);
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/login-error', (req, res) => {
  res.render('login-error');
});

router.post(
  '/login',
  passport.authenticate('login', {
    failureRedirect: 'login-error',
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect('/api/datos');
  }
);

router.get('/datos', checkAuthentication, async (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  req.session.contador = 0;
  req.session.contador++;
  const datos = req.session;
  res.render('form', { user, datos });
});

router.get('/', (req, res) => {
  res.redirect('api/login');
});

router.get('/logout', (req, res) => {
  const { username } = req.user;
  const user = { username };
  res.render('logout', { user });
  req.session.destroy();
});

export default router;
