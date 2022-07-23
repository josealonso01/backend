 const productos = [
  { id: 1, nombre: 'Escuadra', precio: 323.45 },
  { id: 2, nombre: 'Calculadora', precio: 234.56 },
  { id: 3, nombre: 'Globo Terráqueo', precio: 45.67 },
  { id: 4, nombre: 'Paleta Pintura', precio: 456.78 },
  { id: 5, nombre: 'Reloj', precio: 67.89 },
  { id: 6, nombre: 'Agenda', precio: 78.9 },
];


const nombres = () => {
  let nombre = "";
  let precio = 0;
  let promedio;
  let menorPrecio = 9999;
  let mayorPrecio = 1;
  productos.forEach(element => {
    nombre += element.nombre + ',';
    precio += element.precio
    if (menorPrecio > element.precio) {
      menorPrecio = element.precio
    }
    if (mayorPrecio < element.precio) {
      mayorPrecio = element.precio
    }
  });
  promedio = precio/productos.length;
  /* console.log(nombre);
  console.log( Math.trunc(precio) );
  console.log( Math.trunc(promedio) );
  console.log(Math.trunc(menorPrecio));
  console.log(Math.trunc(mayorPrecio)); */
 
  return {
    nombre: nombre,
    precio: parseFloat(precio.toFixed(2)),
    promedio: parseFloat(promedio.toFixed(2)),
    menorPrecio: parseFloat(menorPrecio.toFixed(2)),
    mayorPrecio: parseFloat(mayorPrecio.toFixed(2)),
  };

}


console.log(nombres(productos)); 

const moment = require('moment');

var a = moment([2022, 07, 23]);
var b = moment([1997, 06, 07]);
const dif = a.diff(b, 'years', 'days'); 

console.log(dif);



