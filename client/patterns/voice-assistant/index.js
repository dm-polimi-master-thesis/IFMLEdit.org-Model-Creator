var io = require('socket.io-client'),
    socket = io("http://localhost:3000"),
    model = {};

socket.on('notify', notify);

function notify(options){
  console.log('notify');
  $.notify({message: options.message}, {allow_dismiss: true, type: options.messageType});
  model = pack.sessionAttributes.model;
}

function demo(options){
  
}

function getModel () {
  return model;
}

exports.notify = notify;
exports.getModel = getModel;
