const { LOADIPHLPAPI } = require('dns');
const fs = require('fs');
const { Z_ASCII } = require('zlib');

class Contenedor {
  constructor(nombreArchivo) {
    this.nombreArchivo = './' + nombreArchivo + '.json';
  }

  async getData() {
    try {
      return await fs.promises.readFile(this.nombreArchivo, 'utf-8');
    } catch (error) {
      if (error.code == 'ENOENT') {
        fs.writeFile(this.nombreArchivo, '[]', (error) => {
          if (error) {
            console.log('el archivo no se puede crear');
          }
        });
      }
    }
  }

  async save(productos) {
    let contenido = await this.getData();
    let contenidoEnJson = JSON.parse(contenido);
    let array = [];
    const indice = contenidoEnJson.map((x) => x.id).sort();
    productos.id = indice[indice.length - 1] + 1;

    if (!productos.id) {
      productos.id = 1;
      array = [{ ...productos }];
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(array)
      );
      return array[0].id;
    }

    contenidoEnJson.push(productos);

    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(contenidoEnJson)
    );
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }
}

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


const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

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
