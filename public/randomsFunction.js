const datos = {
  puerto: process.argv.puerto,
  proceso: process.pid,
};

const calcularNumeros = (cant) => {
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const salida = {};

  for (let i = 0; i < cant; i++) {
    const valor = randomNumber(1, 1000);

    if (salida[valor]) salida[valor] = salida[valor] + 1;
    else salida[valor] = 1;
  }
  return salida;
};

process.on('message', (msg) => {
  let sum;
  if (msg) {
    const cant = msg;
    sum = calcularNumeros(cant);
  }
  process.send(datos);
});
