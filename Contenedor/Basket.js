const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Contenedor  = require('../Contenedor/Contenedor');

const catalogo = new Contenedor('productos');
class Basket {
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

  async save() {
    let contenido = await this.getData();
    let contenidoEnJson = JSON.parse(contenido);
    let newCart = {
      id: uuidv4(),
      timestamp: Date.now(),
      usercart: [],
    };
    contenidoEnJson.push(newCart);
    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(contenidoEnJson, null, '\t')
    );
    return newCart.id;
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

  async filterCart(idCart) {
    // Traigo todos los carritos
    let contenido = await this.getData();
    let contenidoEnJson = JSON.parse(contenido);
    // Filtro al carrito especifico;
    const indice = contenidoEnJson.find((carrito) => {
      if (carrito.id === idCart) return true;
      else return false;
    });
    const filterCart = contenidoEnJson[indice];
    return filterCart;
  }

  async addProductToCart(idcart, idProduct) {
    let contenido = await this.getData();
    let contenidoEnJson = JSON.parse(contenido);
    console.log(contenidoEnJson);
    const indice = contenidoEnJson.findIndex(
      (item) => item.id == idcart
    );
    const filter = contenidoEnJson[indice];
    console.log('aca', filter);
    const ProductToAdd = await catalogo.getById(idProduct);
    console.log('id producto a agregar', ProductToAdd);
    const cart = filter.usercart;
    console.log('cart', cart);
    cart.push(ProductToAdd);
    filter.usercart = [];
    cart.forEach((element) => {
      filter.usercart.push(element);
    });
    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(contenidoEnJson, null, '\t')
    );
    return filter;
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

module.exports = Basket;
