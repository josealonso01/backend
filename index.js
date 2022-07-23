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

  async getById(id) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    const ob = dataEnJson.filter((el) => {
      return el.id == id;
    });
    if (ob == null) {
      console.log('El producto no existe');
      return null;
    } else return ob[0];
  }

  async deleteById(id) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    const ob = dataEnJson.filter((ob) => {
      return ob.id !== id;
    });
    if (ob == null) {
      return null;
    } else {
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(ob)
      );
    }
  }

  async deleteAll() {
    const data = [];
    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(data)
    );
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
//archivo.getAll().then((x) => console.log(x));
//archivo.save(catalogo);
//archivo.getById(1).then((x) => console.log('getByID', x));
//archivo.deleteById(3).then((x) => console.log('delete', x));
//archivo.deleteAll();
