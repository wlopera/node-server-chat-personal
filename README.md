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
# Version en la WEB
```
ChatPersonal\server\server.js
------------------------------
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

```

```
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
Crear Proyecto Node en VSC 
-----------------------------------------------------------------------------
$ npm init -y
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
- Instalar librerias
  - express
  - socket.io 
  - nodemon (solo para desarrollo: npm i -D nodemon)
  - dotenv (manejo del puerto)

-----------------------------------------------------------------------------
- Agregar archivo: .gitignore -> control de data al repo
-----------------------------------------------------------------------------

-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
Configurar tareas de arranque del servidor
-----------------------------------------------------------------------------
 "start": "node server",
"dev": "nodemon server"
-----------------------------------------------------------------------------

-----------------------------------------------------------------------------
 - Crear servidor con express
     - Inicializamos nuestra aplicacion
     - Creamos nuestro conexion socket

  - Desde Socket.IO v3, debe habilitar explícitamente el uso compartido de recursos de origen cruzado (CORS).
     // Creamos nuestro conexion socket
        const io = require('socket.io')(server, {
            cors: {
                origin: "http://localhost:3001",
                methods: ["GET", "POST"]
            }
        });

 - Creamos respuestas a peticiones
 - Iniciamos el servidor: npm run dev
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
Publicar en Heroku: El repo debe ser: master (IMPORTANTE)
-----------------------------------------------------------------------------
1. Instalar Heroku (window: si no esta instalado)
2. Levantar Heroku
   > heroku login
   
   - Clonar heroku, si el proyecto no esta en un repo: 
      > heroku git:clone -a node-bakery-formula 
 3. Deploy Heroku
   > cd my-project/
   > git init (opcional)
   > heroku git:remote -a node-chat-personal
  
  > git add . (opcional)
  > git commit -am "make it better"
  > git push heroku master

 Notas:
   - Relanzar Heroku: > heroku restart
   - Ver logs: heroku logs -n 200
   - Procesos de consola de heroku: > heroku run rails console
-----------------------------------------------------------------------------
Ajustar el package json
-----------------------------------------------------------------------------
// tarea start debe ser la primera
  "scripts": {
    "start": "node index.js",
    "dev": "set DEBUG=app:* & nodemon index.js"
  },
  
  // Puede requerir la version de node y npm
  "engines": {
    "node": "14.17.0",
    "npm": "8.1.3"
  },

-----------------------------------------------------------------------------
- server.js
-----------------------------------------------------------------------------
// Iniciamos el servidor ==> Heroku necesita: process.env.PORT para asignar puerto
server.listen(process.env.PORT || 8585, () =>
  console.log("Servidor iniciado en el puerto " + process.env.PORT || 8585)
);
-----------------------------------------------------------------------------

URL DE INICIACION DEL API:
   https://node-chat-personal.herokuapp.com/
```

### Publicar en Heroku: Repo master
![Captura](https://user-images.githubusercontent.com/7141537/185003105-4413a285-f48a-44f0-822c-4a7ff140bdc5.PNG)
![Captura1](https://user-images.githubusercontent.com/7141537/185003107-8f21f517-bfa3-4ce1-9928-00fc1c7b1616.PNG)
![Captura2](https://user-images.githubusercontent.com/7141537/185003110-f527f8b0-8bca-4868-afc1-28780110bd2d.PNG)
![Captura3](https://user-images.githubusercontent.com/7141537/185003111-6a8c5c15-79b3-4a63-adaa-a30874c009e6.PNG)
![Captura4](https://user-images.githubusercontent.com/7141537/185003114-f92be1de-6ddf-4a5b-b603-88283563d685.PNG)
![Captura5](https://user-images.githubusercontent.com/7141537/185003115-6dd664cd-9f0f-4905-97a3-78e6d89c9c31.PNG)
![Captura6](https://user-images.githubusercontent.com/7141537/185003094-59b456fc-9252-400c-b139-7988cbb1db32.PNG)
![Captura7](https://user-images.githubusercontent.com/7141537/185003098-4d179692-83fb-4539-8ef1-6085676c895a.PNG)
![Captura8](https://user-images.githubusercontent.com/7141537/185003101-b524216b-cf3e-4ef8-b9d7-647927382017.PNG)


