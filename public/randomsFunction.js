const max = 1000;
const min = 1;
var count = Math.floor(Math.random() * (max - min));

process.on('message', (msg) => {
  console.log('CHILD: message received from parent process', msg);
  const cant = msg;
  count = parseInt(msg) + 1;
  console.log('CHILD');
  if (cant <= 1000) process.send(count);
  else process.exit(1);
});

console.log(count);
process.send(count);
