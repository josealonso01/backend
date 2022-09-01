const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
      userCart: [],
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
    return dataEnJson.find((item) => item.id == id);
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

  async filterCart(idcart) {
    // Traigo todos los carritos
    const FULLCART = await this.getData();

    // Filtro al carrito especifico;
    const IDCART = FULLCART.findIndex((CART) => {
      if (CART.id === idcart) return true;
      else return false;
    });
    if (IDCART === -1) return null;
    const FILTERCART = FULLCART[IDCART];
    return FILTERCART;
  }

  async deleteProductOfCart(idcart, idproduct) {
    // Traigo todos los carritos
    const FULLCART = await this.getData();

    // Filtro al carrito especifico;
    const IDCART = FULLCART.findIndex((CART) => {
      if (CART.id === idcart) return true;
      else return false;
    });
    if (IDCART === -1) return null;
    const FILTERCART = FULLCART[IDCART];

    // Borro el producto del carrito;
    const FILTERPRODUCT = FILTERCART.usercart.filter(
      (product) => product.id != idproduct
    );

    // Reemplazo el array del carrito especifico por el nuevo carrito
    const newCart = [];
    FILTERPRODUCT.forEach((element) => {
      newCart.push(element);
    });

    //Reemplazo el carrito especifico en el array de carritos
    FILTERCART.usercart = [];
    newCart.forEach((element) => {
      FILTERCART.usercart.push(element);
    });

    //Escribo el archivo con el array de carritos.
    await this.save(FULLCART);
    return FILTERCART;
  }

  async addProductToCart(idcart, idproduct) {
    // Traigo todos los carritos
    const FULLCART = await this.getData();
    // Filtro al carrito especifico;
    const IDCART = FULLCART.findIndex((CART) => {
      if (CART.id === idcart) return true;
      else return false;
    });
    if (IDCART === -1) return null;
    const FILTERCART = FULLCART[IDCART];
    // Traigo el producto para agregar al carro
    const ProductToAdd = await this.getById(idproduct);
    console.log('id producto a agregar', ProductToAdd);
    // Sumo el producto al carro.
    const cart = FILTERCART.usercart;
    cart.push(ProductToAdd);
    //Reemplazo el carrito especifico en el array de carritos

    FILTERCART.usercart = [];

    cart.forEach((element) => {
      FILTERCART.usercart.push(element);
    });
    //Guardo la DB
    await this.save(FULLCART);
    return FILTERCART;
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
