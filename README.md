# node-server-chat-personal
Chat personal realizado con NodeJS y Socket.io

ver: https://github.com/wlopera/react_client_chat_pwa_app

## Código fuente: ChatPersonal\server\server.js
```
const express = require("express");
const http = require("http");

// Inicializamos nuestra aplicacion
const app = express();

// Creaamos el servidor
const server = http.createServer(app);

// Creamos nuestro conexion socket
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Creamos respuestas a peticiones
io.on("connection", (socket) => {
  let name;

  // Cada vez que un cliente se conecta se llama esta funcion
  socket.on("login", (user) => {
    console.log("Usuario conectado...");
    name = user;
    socket.broadcast.emit("mensajes", {
      name,
      message: `${name} ha entrado a la sala del chat`,
    });
  });

  // Recibir un mensaje y enviar al grupo
  socket.on("message", (name, message) => {
    io.emit("messages", { name, message });
  });

  // Notificar salida de usuario del grupo (disconnect: palabra reservada)
  socket.on("disconnect", () => {
    socket.broadcast.emit("messages", {
      servidor: "Servidor",
      message: `${name} ha abandonado la sala`,
    });
  });
});

// Iniciamos el servidor
server.listen(3000, () => console.log("Servidor inicado en el puerto 3000"));

```
