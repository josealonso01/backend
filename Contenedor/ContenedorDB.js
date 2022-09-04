const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class ContenedorDB {
  constructor(nombreArchivo) {
    this.nombreArchivo = './' + nombreArchivo + '.json';

    //TODO CREAR LA BASE DE DATOS DE MARIA DB
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
    let array = [{ id: uuidv4(), timestamp: Date.now(), code: [] }];
    const indice = contenidoEnJson.map((x) => x.id).sort();
    productos.id = indice[indice.length - 1] + 1;

    if (!productos.id) {
      productos.id = 1;
      array = [
        {
          id: uuidv4(),
          timestamp: Date.now(),
          name: objeto.name,
          descripcion: objeto.descripcion,
          codigo: objeto.codigo,
          picture: objeto.picture,
          price: objeto.price,
          stock: objeto.stock,
        },
      ];
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
    const indice = dataEnJson.findIndex((item) => {
      if (item.id === id) return true;
      else return false;
    });
    if (indice === -1) return null;

    return dataEnJson[indice];
  }

  async addOne(nuevoProducto) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    if (dataEnJson.length == 0) {
      nuevoProducto.id = 1;
      let nuevoJson = [nuevoProducto];
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(nuevoJson, null, '\t')
      );
    } else {
      nuevoProducto.id = dataEnJson.length + 1;
      dataEnJson.push(nuevoProducto);
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(dataEnJson, null, '\t')
      );
      return dataEnJson[dataEnJson.length - 1];
    }
  }

  async updateById(id, productos) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    const productToInsert = { ...productos, id };
    for (let i = 0; i < dataEnJson.length; i++) {
      if (dataEnJson[i].id == id) {
        dataEnJson[i] = productToInsert;
        return productToInsert;
      }
    }
    return undefined;
  }

  async deleteById(id) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    const ob = dataEnJson.filter((ob) => {
      ob.id !== id;
    });
    if (ob == null) {
      return null;
    } else {
      return id;
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

module.exports = ContenedorDB;
