const { options } = require('../options/optionsMDB');
const fs = require('fs');
const { json } = require('express');
const knex = require('knex')(options);

class ContenedorDB {
  constructor(options, productos) {
    this.connection = knex(options);
    this.productos = './' + 'productos' + '.json';
  }

  async getData() {
    try {
      return await fs.promises.readFile(this.nuevoJson, 'utf-8');
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

  async insert(nuevoProducto) {
    knex('productos')
      .insert(nuevoProducto)
      .then(() => {
        console.log('data insertada');
        fs.writeFile(this.nombreArchivo, nuevoProducto, (error) => {
          if (error) {
            console.log('el archivo no se puede crear');
          }
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  async select() {
    knex('productos')
      .select('*')
      .then((prod) => {
        console.log(`Found ${prod.length} productos`);
        fs.promises.writeFile(
          this.productos,
          JSON.stringify(prod, null, '\t'),
          (error) => {
            if (error) {
              console.log('el archivo no se puede crear');
            }
          }
         
        );
        prod.forEach((aProd) =>
          console.log(
            `${aProd.id} ${aProd.name}  ${aProd.price} ${aProd.Descripcion} ${aProd.Codigo} ${aProd.picture} ${aProd.stock}`
          )
        );
      })
      .catch((err) => {
        console.log('There was an error inserting table');
        console.log(err);
      });
  }
}

module.exports = ContenedorDB;
