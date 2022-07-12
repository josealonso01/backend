class Usuario {
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }

  librosUsuario = [];

  getFullName() {
    return console.log(
      `el nombre es ${this.nombre} y el apellido es  ${this.apellido}`
    );
  }

  addMascota(nombreMascotas) {
    this.mascotas.push(nombreMascotas);
  }

  countMascotas() {
    return console.log(this.mascotas.length);
  }
  addBook(libro) {
    this.libros.push(libro);
  }
  getBookNames() {
    this.libros.forEach((libro) => {
      this.librosUsuario.push(libro.nombre);
    });
    console.log(this.librosUsuario)
  }
}

const UsuarioNuevo = new Usuario(
  'Josefina',
  'Alonso',
  [
    { nombre: 'harry potter', autor: 'J. K. Rowling' },
    { nombre: 'el principito', autor: 'Antoine de Saint-Exupéry' },
  ],
  ['perro', 'gato']
);

UsuarioNuevo.getFullName();
UsuarioNuevo.addMascota('jirafa');
UsuarioNuevo.countMascotas();
UsuarioNuevo.addBook({
  nombre: 'diez negritos',
  autor: 'Agatha Christie',
});
UsuarioNuevo.getBookNames();
