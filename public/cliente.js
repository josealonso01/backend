const socket = io()

socket.on('connection', () => {
  console.log('CONNECTEED');
});

socket.on('productsList', (catalogo) => {
  console.log('aca', catalogo);
  prod = catalogo;
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
                <td >{{prod[i].id}} </td>
                <td>  {{prod[i].title}}</td>
                <td>{{prod[i].price}} </td>
                <td><img src="{{prod[i].thumbnail}}" class="img-thumbnail " style="width: 15%;"/></td>
            </tr>
        </tbody>
        </table>`;
  }
  document.getElementById('productsList').innerHTML = htmlToRender;
});


