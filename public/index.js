sockets = io();
//ATRAPAN MSGS QUE ENVIE EL SERVER

socket.on('connect', function () {
  console.log('connected to server');
});

console.log('entra al index', sockets);

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
  sockets.emit('data-generica', JSON.stringify(mensaje));
  document.getElementById('caja-msg').value = '';
});

const denormalize = (messages) => {
  const author = new normalizr.schema.Entity('authors');
  const mensajes = new normalizr.schema.Entity('mensajes', {
    author: author,
  });
  const chats = new normalizr.schema.Entity('chats', {
    chats: [mensajes],
  });
  const denormalizedMessages = normalizr.denormalize(
    messages.result,
    chats,
    messages.entities
  );
  return denormalizedMessages;
};

sockets.on('arr-chat', (data) => {
  let denormalizedChats = denormalize(data);
  let compression =
    (JSON.stringify(denormalizedChats).length /
      JSON.stringify(data).length) *
    100;
  document.getElementById(
    'div-compres'
  ).innerText = `El porcentaje de compresion es %${compression
    .toString()
    .slice(0, 5)}`;

  const add = denormalizedChats.chats
    .map((chat) => {
      console.log('llega', chat);
      let time = new Date();
      let formatedTime = time
        .toISOString()
        .replace(/([^T]+)T([^\.]+).*/g, '$1 $2');
      return `
  <p>
  <span style="color: blue;">${chat.author.id}</span>
  <span style="color: brown;">[${formatedTime}]: </span>
  <span style="color: green;">${chat.text}</span>
  <img class='avatar' style="width:3rem" src='${chat.author.avatar}'></img>
  </p>
  `;
    })
    .join(' ');

  document.getElementById('html').innerHTML = add;
});
