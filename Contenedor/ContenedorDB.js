const fs = require('fs');
const Knex = require('knex');
const { options } = require('../options/optionsMDB');

class ContenedorDB {
  constructor() {
    this.connection = Knex(options);
  }

  async createTable() {
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

  getData(productos, id) {
    if (id) return this.connection(productos).where('id', id);
    return this.connection(productos);
  }

  create(productos, data) {
    return this.connection(productos).insert(data);
  }

  update(productos, id, data) {
    return this.connection(productos).where('id', id).update(data);
  }

  delete(productos, id) {
    return this.connection(productos).where('id', id).del();
  }
}

module.exports = ContenedorDB;
