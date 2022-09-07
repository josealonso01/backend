const { options } = require('../options/optionsMDB');
const fs = require('fs');
const { isConstructorDeclaration } = require('typescript');
const knex = require('knex')(options);

class ContenedorDB {
  constructor(options, productos) {
    this.connection = knex(options);
    this.productos = './' + 'productos' + '.json';
  }

  createTable() {
    knex.schema.hasTable('productos').then(function (exists) {
      if (!exists) {
        return knex.schema
          .createTable('productos', (table) => {
            table.increments('id'),
              table.string('name'),
              table.integer('price');
            table.string('Descripcion');
            table.string('Codigo');
            table.string('picture');
            table.integer('stock');
          })
          .then((res) => {
            console.log('tabla de productos creada', res);
          })
          .catch((err) => {
            console.log(err);
            throw new Error(err);
          })
          .finally(() => {
            knex.destroy();
          });
      }
    });
  }

  async getProductos() {
    const queryResult = await knex('productos').select('*');
    let listProducts = [];
    queryResult.forEach((aProd) => {
      console.log(
        `${aProd.id} ${aProd.name}  ${aProd.price} ${aProd.Descripcion} ${aProd.Codigo} ${aProd.picture} ${aProd.stock}`
      );
      listProducts.push(aProd);
    });
    return listProducts;
  }

  async getById(id) {
    const queryResult = await knex('productos')
      .select('*')
      .where('id', '=', id);
    return queryResult;
  }

  async save(nuevoProducto) {
    const queryResult = await knex('productos').insert(nuevoProducto);
    queryResult.push(nuevoProducto);
    return queryResult;
  }

  async deleteById(id) {
    const queryResult = await knex('productos')
      .select('*')
      .where('id', '=', id)
      .del();
    return queryResult;
  }

  async deleteAll() {
    const queryResult = await knex('productos').select('*').del();
    return queryResult;
  }

  async updateById(id, body) {
    const queryResult = await knex('productos')
      .select('*')
      .where('id', '=', id)
      .update(body);
    return queryResult;
  }
}

module.exports = ContenedorDB;
