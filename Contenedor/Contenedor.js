const fs = require('fs');

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
    return dataEnJson.find((item) => item.id == id);
  }

  async addOne(productos) {
    const data = await this.getData();
    let dataEnJson = JSON.parse(data);
    const lastItem = dataEnJson[dataEnJson.length - 1];
    let lastId = 1;
    if (lastItem) {
      lastId = lastItem.id + 1;
    }
    productos.id = lastId;
    dataEnJson.push(productos);
    return dataEnJson[dataEnJson.length - 1];
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
      return id
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

module.exports = Contenedor;
