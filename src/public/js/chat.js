const btnTaTeti = document.getElementById("btnTaTeTi");
const contendorLoading = document.getElementById("contenedorLoading");
console.log(btnTaTeti)
//Este es el cliente 
const socket = io({
    //flag de conexion con el servidor
    autoConnect: false
});
let user; //Información de usuario
const chatBox = document.getElementById("chatBox"); //obtenemos el input del chat

// Generamos un sweet alert
Swal.fire({
    title: "Identificate!",
    input: "text",
    text: "Ingresa el nombre de usuario...",
    //Validamos lo que esta ingresando en el input
    inputValidator: (value) =>{
        //si es falso, enviamos el mensaje
        return !value && "Necesitas colocar un usuario valido para seguir!"
    },
    allowOutsideClick:false, //Cancelamos el cierre de los clic fuera de la aletar
    allowEscapeKey:false //Cancelamos el escape para salir de la alerta
}).then(result=>{
    user = result.value;
    socket.connect();
    socket.emit("authenticated", user)
})

chatBox.addEventListener('keyup', evento =>{
    //Si se presiono el enter
    if(evento.key == "Enter"){
        //Obtenemos el mensaje, limpiamos los espacios(trim) y la cantidad de caracteres que tiene 
        if(chatBox.value.trim().length>0){
            //emitimos el mensaje al socket de tipo message, lo mandamos en un objeto
            socket.emit('message', {user, message: chatBox.value.trim()});
            chatBox.value = ""; //Vaciamos el input 
        }
    }
})

btnTaTeti.addEventListener('click', (evento) =>{
    contendorLoading.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p>Esperando a un contrincante</p>
    `

    /*Detectar cuando un jugador ingrese como contrincante. Vaciar el loading y mostrar a ambos usuarios el modal con sus datos. Esto deberia modificarse con los emit y on para poder configurar bien los turnos y la logica del juego*/
    socket.emit("tateti:start", user)
    socket.emit('message', {config: "game", image:"image/tic-tac-toe.png", message: `${user} a comenzado un juego...`})
})

//Configramos nuestro socket listener del cliente
socket.on('logs', data => {
    const logsPanel = document.getElementById("logsPanel");
    let message = "";
    //Como el io nos devuelve un arreglo
    data.forEach(msg => {
        if(msg.config === "bienvenida") message+= `<p class="msgBienvenida">${msg.message}</p>`
        else if(msg.config === "game") message += `
            <div class="game">
                <img src='${msg.image}' alt="Logo de game" width="70"/>
                <div>
                    <p>${msg.message}</p>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#contenedorGame">Unirse</button>
                </div>
            </div>    
        `
        else message += `<p>${msg.user} dice: ${msg.message}</p>`
    });
    //lo agregamos al HTML
    logsPanel.innerHTML = message;
})
