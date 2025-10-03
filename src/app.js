import express from "express";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";

import viewsRouter from './routes/views.router.js'

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