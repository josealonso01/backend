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
  socket.emit('data-generica', nombre + ' dice ' + msg);
  console.log(nombre + ' dice ' + msg);
}

let prod = [];

sockets.on('prod', (data) => {
  prod = data;

  let htmlToRender = '';

  for (let i = 0; i < prod.length; i++) {
    htmlToRender =
      htmlToRender +
      `<table class="table table-dark">
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
      <td >${prod[i].id} </td>
      <td>  ${prod[i].title}</td>
      <td>${prod[i].price} </td>
       <td><img src="${prod[i].thumbnail}" class="img-thumbnail " style="width: 15%;"/></td>
    </tr>
  </tbody>
</table>`;
  }
  document.getElementById('lista').innerHTML = htmlToRender;
});
