const express = require("express");
const http = require("http");
const tools = require("./util/tools");
const cors = require("cors");

// Inicializamos nuestra aplicacion
const app = express();

// Creaamos el servidor
const server = http.createServer(app);

// Configurar manejo de variables de ambiente
require("dotenv").config();

// Creamos nuestro conexion socket
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Creamos respuestas a peticiones
io.on("connection", (socket) => {
  let name;

  // Cada vez que un cliente se conecta se llama esta funcion
  socket.on("login", (user) => {
    name = user;
    socket.broadcast.emit("messages", {
      type: "login",
      name,
      message: `${name} ha entrado a la sala del chat`,
      time: tools.getTime(),
    });
  });

  // Recibir un mensaje y enviar al grupo
  socket.on("message", (name, message) => {
    io.emit("messages", {
      type: "body",
      name,
      message,
      time: tools.getTime(),
    });
  });

  // Notificar salida de usuario del grupo (disconnect: palabra reservada)
  socket.on("disconnect", () => {
    socket.broadcast.emit("messages", {
      type: "logout",
      name: "Servidor",
      message: `${name} ha abandonado la sala`,
      time: tools.getTime(),
    });
  });
});

// Iniciamos el servidor ==> Heroku necesita: process.env.PORT para asignar puerto
server.listen(process.env.PORT || 8585, () =>
  console.log("Servidor iniciado en el puerto " + process.env.PORT || 8585)
);
