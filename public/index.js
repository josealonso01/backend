const sockets = io();
const { denormalizeMessages } = require('./functions');
//ATRAPAN MSGS QUE ENVIE EL SERVER
sockets.on('connect', () => {
  console.log('me conecte!');
});


const button = document.getElementById('submitMessage');
button.addEventListener('click', (e) => {
  const mensaje = {
    author: {
      id: document.getElementById('email').value,
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      edad: document.getElementById('edad').value,
      alias: document.getElementById('alias').value,
      avatar: document.getElementById('avatar').value,
    },
    text: document.getElementById('caja-msg').value,
  };
  sockets.emit('data-generica', mensaje);
  mensaje.toString();
  document.getElementById('caja-msg').value = '';
  console.log('data-generica', mensaje);
});

sockets.on('arr-chat', (data) => {
  let denormalizedChats = denormalizeMessages(data);
  let compression =
    (JSON.stringify(denormalizedChats).length /
      JSON.stringify(data).length) *
    100;
  document.getElementById(
    'div-compres'
  ).innerText = `El porcentaje de compresion es %${compression
    .toString()
    .slice(0, 5)}`;

  const add = denormalizedChats.chats.map((chat) => {
    let time = new Date(chat.timestamp);
    let formatedTime = time
      .toISOString()
      .replace(/([^T]+)T([^\.]+).*/g, '$1 $2');
    return `
      '<div>' +
      <div style="color: brown;">${formatedTime} </div> +
      time +
      ' dice: ' +
      <div style="color: green;">${item.text} </div> +
      <img class='avatar' style="width:3rem" src=${item.author.avatar}> </img> +
      '</div>',
    `;
  });
  document.getElementById('html').innerHTML = add;
});
