import express from "express";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from './routes/views.router.js'
import {Tateti} from './public/js/Tateti.js'

//Creamos la variable app
const app = express();

//[LINEAS PRINCIPALES PARA UNA PLANTILLA]
app.use(express.static(__dirname+"/public"));
//Indicamos que vamos usar el motor de handlebars
app.engine('handlebars', handlebars.engine());
//Configuramos la ruta en la que se encuentra la vista
app.set("views", __dirname+"/views");
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
//Generamos el servidor que este conectandose en el puerto 8080
const server = app.listen(8080, ()=>console.log("Escuchando..."));
const io = new Server(server); //Le indicamos en que puerto debe estar escuchando 

//lista de mensaje
const message = [];
const tateti = new Tateti();

//io.on -> Escuchador de evento, si se produce una conexion en el servidor
io.on('connection', socket =>{
    //IO es el servidor | SOCKET son los clientes que se conecten
    console.log("socket connected");
    socket.emit('logs', message); //para que los mensajes vayan al cliente que se esta conectando
    
    //Conectamos con la emision que esta haciendo el cliente
    socket.on('message', data=>{
        message.push(data); //guardamos el dato en nuestra lista
        console.log(data)
        io.emit('logs', message); //Enviamos los mensajes para que TODOS lo vean
    })
    socket.on('messageIngreso', data=>{
        console.log(data)
    })
    socket.on('authenticated', username => {
        // Mensaje de bienvenida para el nuevo usuario
        const welcomeMsg = {config: "bienvenida", message: `${username} se ha unido al chat` };
        message.push(welcomeMsg);                  // lo guardamos en el historial
        socket.broadcast.emit('logs', message);    // lo ven TODOS MENOS el que entra
    });

    socket.on("tateti:start", username => {
        
    })
}) 