const sockets = io();

//ATRAPAN MSGS QUE ENVIE EL SERVER
sockets.on('connect', () => {
  console.log('me conecte!');
});

sockets.on('data-generica', (data) => {
  console.log(data);
});

sockets.on('arr-chat', (data) => {
  console.log(data);
  const html = data.reduce(
    (html, item) => html + '<div>' + item + '</div>',
    ''
  );
  document.getElementById('html').innerHTML = html;
});

function enviar() {
  const nombre = document.getElementById('caja-nombre').value;
  const msg = document.getElementById('caja-msg').value;
  sockets.emit('data-generica', nombre + ' [ ' + new Date () + ' ] dice: ' + msg);
  console.log(nombre + ' dice ' + msg);
}

function agregarAlCarrito() {
  
}

sockets.emit('prod');

sockets.on('prod', (unProducto) => {
  attachRow(unProducto);
});

const attachRow = (unProducto) => {
  const fila = document.createElement('h1');
  fila.innerHTML = `
  <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">NOMBRE</th>
      <th scope="col">PRECIO</th>
      <th scope="col">FOTO</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td >${unProducto.id} </td>
      <td>  ${unProducto.name}</td>
      <td>${unProducto.price} </td>
       <td><img src="${unProducto.picture}" class="img-thumbnail " style="width: 15%;"/></td>
    </tr>
  </tbody>
</table>
  `;
  const mitabla = document.getElementById('myTable');
  mitabla.appendChild(fila);
};

