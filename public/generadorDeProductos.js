import faker from 'faker';

function generarUsuario(id) {
  return {
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    website: faker.internet.url(),
    Descripcion: faker.lorem.paragraph(),
    picture: faker.image.avatar(),
    stock: faker.finance.amount(0, 1000),
    Codigo: faker.finance.bic(),
  };
}

export default generarUsuario;
