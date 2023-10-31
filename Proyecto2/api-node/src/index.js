import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import {
  getDataRedis
} from './controller/redis.controller.js';
import { 
  getDataMysql 
} from "./controller/mysql.controller.js";

const app = express();

// Utiliza app.use para configurar middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

const port = process.env.PORT || 3000;

let semestre = '1S';

app.get("/semestre/:parametro", (req, res) => {
  const parametro = req.params.parametro;
  console.log(parametro);
  if(parametro == 1) semestre = '1S'
  else semestre = '2S'
  res.send(`Parámetro recibido: ${parametro}`);
});


app.get("/reportes-estaticos", async (req, res) => {
  try {
    const result = await getDataMysql();
    console.log((result.primer_grafica));
    res.send({ all_data: result.results, primer_grafica: result.primer_grafica});
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los datos de MySQL' });
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  setInterval(() => {
    getDataRedis(semestre)
      .then((data) => {
        socket.emit("getDataRedis", data);
      })
      .catch((e) => console.log(e));
  }, 1500);

  socket.on("getSemestre", (value) => {
    console.log(value);
  });

});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


// import express from "express";
// const app = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("¡Bienvenido a mi API!");
// });

// app.listen(port, () => {
//   console.log(`Servidor en ejecución en el puerto ${port}`);
// });
