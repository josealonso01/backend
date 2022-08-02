const Contenedor = require('./Contenedor/Contenedor');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const catalogo = {
  title: 'Escuadra',
  price: 123.45,
  thumbnail:
    'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
};

const archivo = new Contenedor('productos');
archivo.getData();
archivo.getAll().then((x) => console.log(x));
archivo.save(catalogo);
//archivo.getById(1).then((x) => console.log('getByID', x));
//archivo.deleteById(3).then((x) => console.log('delete', x));
//archivo.deleteAll();

const server = app.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${server.address().port}`
  );
});
server.on('error', (error) =>
  console.log(`Error en servidor ${error}`)
);
app.get('/productos', (req, res) => {
  archivo.getAll().then((prod) => {
    res.send(JSON.stringify(prod, null));
  });
});
app.get('/productoRandom', (req, res) => {
  archivo.getAll().then((response) => {
    let random = Math.floor(Math.random() * response.length);
    res.send(response[random]);
  });
});
