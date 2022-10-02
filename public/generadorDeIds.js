import faker from 'faker';

function generarId(id) {
  return {
    id: faker.datatype.uuid(),
  };
}

export default generarId;
