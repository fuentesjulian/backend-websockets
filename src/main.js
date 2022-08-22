const express = require("express");

const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");
const ContenedorMensajes = require("../contenedores/ContenedorMensajes.js");
const ContenedorProductos = require("../contenedores/ContenedorProductos.js");

//--------------------------------------------
// instancio servidor, socket y api
const contenedorMensajes = new ContenedorMensajes("mensajes");
const contenedorProductos = new ContenedorProductos("productos");

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
    // apenas se genera la conexión tengo que cargar mensajes y productos
  const productos = await contenedorProductos.getAll();
  io.sockets.emit("productos", productos);
  const mensajes = await contenedorMensajes.getAll();
  io.sockets.emit("mensajes", mensajes);

  console.log("Nueva conexion");
  // cuando llega un producto nuevo grabo, obtengo data, hago emit
  socket.on("newProduct", async (data) => {
    await contenedorProductos.save(data);
    const productos = await contenedorProductos.getAll();
    io.sockets.emit("productos", productos);
  });

  // cuando llega un producto nuevo grabo, obtengo data, hago emit
  socket.on("newMessage", async (data) => {
    const message = { dateTime: new Date().toLocaleString("es-AR"), ...data };
    await contenedorMensajes.save(message);
    const mensajes = await contenedorMensajes.getAll();
    io.sockets.emit("mensajes", mensajes);
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//--------------------------------------------
// inicio el servidor

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on("error", (error) => console.log(`Error en servidor ${error}`));
