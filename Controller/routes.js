const express = require('express');
const Contenedor = require('../Contenedor/Contenedor');
const router = express.Router();
const app = express();

const archivo = new Contenedor('productos');

//archivo.getData();
//console.log('he dicho')
//archivo.getAll().then((x) => console.log(x));
//archivo.save();
//archivo.getById(1).then((x) => console.log('getByID', x));
//archivo.deleteById(3).then((x) => console.log('delete', x));
//archivo.deleteAll();

router.get('/form', (req, res) => {
  res.render('form');;
});

router.get('/', (req, res) => {
  archivo.getAll().then((prod) => {
    res.render('productsList', { prod, productsExist: true });;
  });
});

router.get('/:id', (req, res) => {
  let { id } = req.params;
  console.log('id', id);
  /* archivo.getById(id).then((found) => {
    if (found) {
      res.render('oneProduct', {
        product: found,
        title: 'Detalle de producto',
      });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  }); */
});

router.post('/', (req, res) => {
  const { body } = req;
  body.price = parseFloat(body.price);
  archivo.addOne(body).then((n) => {
    if (n) {
      res.render('form');
    } else {
      ({ error: 'error' });
    }
  });
});

router.put('/:id', (req, res) => {
  let { id } = req.params;
  const { body } = req;
  archivo.updateById(id, body).then((prod) => {
    if (prod) {
      res.json({ success: 'ok', new: prod });
    } else {
      res.json({ error: 'error' });
    }
  });
});

router.delete('/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  console.log('id', id);
  archivo.deleteById(id).then((found) => {
    if (found) {
      res.json({ success: 'ok', id });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
});


module.exports = router;