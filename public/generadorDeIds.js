const faker = require ('faker');

function generarId(id) {
  return {
    id: faker.datatype.uuid(),
  };
}

module.exports = {generarId};
