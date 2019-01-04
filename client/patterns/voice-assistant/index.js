var io = require('socket.io-client'),
    socket = io("http://localhost:3000"),
    model = {type: 'e-commerce'};

socket.on('notify', notify);

function notify(pack){
  console.log('notify');
  //alert("Notify!");
  //$.notify({message: pack.message}, {allow_dismiss: true, type: 'success'});
  model = pack.sessionAttributes.model;
  console.log(JSON.stringify(pack));
  console.log('model',model);
}

function getModel () {
  return model;
}

exports.notify = notify;
exports.getModel = getModel;
