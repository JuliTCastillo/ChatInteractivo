//Este es el cliente 
const socket = io({
    //flag de conexion con el servidor
    autoConnect: false
});
let user; //Información de usuario
const chatBox = document.getElementById("chatBox"); //obtenemos el input del chat

//Generamos un sweet alert
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
    console.log(user)
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

//Configramos nuestro socket listener del cliente
socket.on('logs', data => {
    const logsPanel = document.getElementById("logsPanel");
    let message = "";
    //Como el io nos devuelve un arreglo
    data.forEach(msg => {
        message += `<p>${msg.user} dice: ${msg.message}</p>`
    });
    //lo agregamos al HTML
    logsPanel.innerHTML = message;
})

socket.on('newUserConnected', data =>{
    if(!user) return;
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000, //2seg
        title: `${data} se ha unido al chat`,
        icon: 'success'
    })
})