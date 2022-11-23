const fs = require ('fs');
const { uuidv4 } = require ('uuid');

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

}

module.exports = Contenedor;
