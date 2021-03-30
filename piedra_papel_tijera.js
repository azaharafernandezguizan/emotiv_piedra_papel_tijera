let Cortex = require('./cortex');
let socketUrl = 'wss://localhost:6868';
let user = {
    "license":"",
    "clientId":"miClientID",
    "clientSecret":"miSecret",
    "debit":1
}
console.log('created user');
let currentRecord = new Cortex(user, socketUrl);
console.log('initialized user');
let streams = ['fac'];
console.log('Entrando en expresiones faciales');
currentRecord.sub(streams);

let GameLogic = require('./game');
let currentGame = new GameLogic();

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'a') {
    process.exit();
  } else {
    console.log("A continuación aparecerá una cuenta atrás, justo cuando debes hacer los siguiente:");
    console.log("");
    console.log("");
    setTimeout(function(){ 
        console.log("Sonrie si quieres seleccionar tijeras"); 
        console.log("");
    }, 2200);
    setTimeout(function(){ 
        console.log("Guiña un ojo si quieres seleccionar piedra"); 
        console.log("");
    }, 4200);
    setTimeout(function(){ 
        console.log("No hagas nada si quieres seleccionar papel"); 
        console.log("");
        console.log("");
    }, 6200);
    setTimeout(function(){ 
        console.log("Para que todo funcione bien, has de poner la expresión en cuanta pongamos la cuenta atrás y mantenerlo hasta que digamos ¡Listo!"); 
        console.log("");
        console.log("");
    }, 8200);
    setTimeout(function(){ 
        console.log("Allá vamos!!"); 
        console.log("");
        console.log("");
    }, 10200);
    setTimeout(
        function(){ 
            console.log("3"); 
            console.log("");
            console.log("");
            console.log("");
            console.log("");
    }, 12200);
    setTimeout(function(){ 
        console.log("2"); 
        console.log("");
        console.log("");
        console.log("");
        console.log("");
    }, 14200);
    setTimeout(function(){ 
        console.log("1");
        console.log("");
        console.log(""); 
        console.log("");
        console.log("");
    }, 16200);
    setTimeout(function(){ 
        console.log("0");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        currentRecord.recordResponse();
     }, 18200);
    setTimeout(function(){ console.log("¡Listo!"); }, 20200);
    setTimeout(function(){ 
        selectedResponse = currentRecord.getCurrentData();
        currentGame.setUserResponse(selectedResponse);

        currentGame.calculateMachineOption();

        currentGame.getResult();
     }, 25200);
  }
});
console.log('Hola! Has entrado en piedra, papel o tijera, uno de los juegos más conocidos pero esta vez jugaras con tus expresiones faciales.');
console.log('Aprieta cualquier tecla para comenzar una partida o Ctrl + A para salir');
