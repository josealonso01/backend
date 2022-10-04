import express from 'express';

import routerProducts from './routesProducts.js';
import routerBasket from './routesBasket.js';
import ContenedorDB from '../daos/Products.js';
import Messagges from '../daos/Messages.js';

const router = express.Router();
const archivo = new ContenedorDB('productos');
const mensajes = new Messagges('mensajes');
let usuarios = [{ nombre: 'Josefina' }];

router.use('/productos', routerProducts);
router.use('/basket', routerBasket);

router.get('/form', (req, res) => {
  res.render('form');
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

const validateLogIn = (req, res, next) => {
  if (req.session.info && req.session.info.loggedIn) next();
  else res.redirect('login');
};

router.get('/', validateLogIn, (req, res) => {
  req.session.contador++;
  res.redirect('/datos');
});

/* --------- LOGIN ---------- */
router.get('/login', (req, res) => {
  res.render('login');
});

/* --------- REGISTER ---------- */
router.get('/register', (req, res) => {
  res.render('register');
});

/* --------- DATOS ---------- */
router.get('/datos', validateLogIn, (req, res) => {
  req.session.contador++;
  const datos = req.session;
  console.log(datos);
  res.render('datos', { datos });
});
///////////////////////////////////////////////////////////////
/* --------- LOGIN ---------- */
router.post('/login', (req, res) => {
  let { nombre } = req.body;

  const index = usuarios.findIndex(
    (aUser) => aUser.nombre === nombre
  );

  if (index < 0) res.render('nologin', {});
  else {
    req.session.nombre = nombre;
    req.session.contador = 0;
    req.session.info = { loggedIn: true };
    res.redirect('datos');
  }
});

/*-----------------REGISTER----------------- */
router.post('/register', (req, res) => {
  let { nombre } = req.body;
  console.log('nombre', nombre);
  let encontrado = usuarios.filter(
    (usuario) => usuario.nombre == nombre
  ).length;
  if (!encontrado) {
    usuarios.push(req.body);
    req.session.nombre = nombre;
    req.session.contador = 0;

    res.redirect('datos');
  } else {
    res.render('register-error', {});
  }
});

/* --------- LOGOUT ---------- */
router.get('/logout', (req, res) => {
  const datos = req.session;
  res.render('logout', { datos });
  req.session.destroy();
});


export default router;
