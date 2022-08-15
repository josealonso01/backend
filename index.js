const express = require('express');
const { Router } = express;
const { engine } = require('express-handlebars');
const Contenedor = require('./Contenedor/Contenedor');

const app = express();
const router = Router();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${server.address().port}`
  );
});

server.on('error', (error) =>
  console.log(`Error en servidor ${error}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/productos', router);


//CONFIGURACION DLE MOTOR
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

const catalogo = {
  title: 'nike',
  price: 123.45,
  thumbnail: 'http://localhost:8080/public/nike.png',
};

const archivo = new Contenedor('productos');

//archivo.getData();
//archivo.getAll().then((x) => console.log(x));
//archivo.save(catalogo);
//archivo.getById(1).then((x) => console.log('getByID', x));
//archivo.deleteById(3).then((x) => console.log('delete', x));
//archivo.deleteAll();

router.get('/', (req, res) => {
  archivo.getAll().then((prod) => {
    res.render('productsList', { prod, productsExist: true });
  });
});

router.get('/:id', (req, res) => {
  let { id } = req.params;
  console.log('id', id);
  archivo.getById(id).then((found) => {
    if (found) {
      res.render('oneProduct', {
        product: found,
        title: 'Detalle de producto',
      });
    } else {
      res.json({ error: 'el producto no existe' });
    }
  });
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

app.get('/form', (req, res) => {
  res.render('form');
});