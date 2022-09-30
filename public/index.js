
const sockets = io();
//ATRAPAN MSGS QUE ENVIE EL SERVER

sockets.on('connect', () => {
  console.log('me conecte!');
});


 function denormalizedMessages(messages) {
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
  let denormalizedChats = denormalizedMessages(data);
  let compression =
    (JSON.stringify(denormalizedChats).length /
      JSON.stringify(data).length) *
    100;
  document.getElementById(
    'div-compres'
  ).innerText = `El porcentaje de compresion es %${compression
    .toString()
    .slice(0, 5)}`;

  const add = denormalizedChats.chats.map(() => {
    console.log('add', data.entities);
    let time = new Date();
    let formatedTime = time
    return `
      <p>
  <span style="color: blue;">${data.entities.authors}</span>
  <span style="color: brown;">[${formatedTime}]: </span>
  <span style="color: green;">${data.entities.mensajes.text}</span>
  <img class='avatar' style="width:3rem" src='${data.entities.authors.avatar}'></img>
  </p>
    `;
  });
  document.getElementById('html').innerHTML = add;
});
