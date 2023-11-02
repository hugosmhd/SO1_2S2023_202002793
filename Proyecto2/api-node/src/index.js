import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import {
  getDataRedis
} from './controller/redis.controller.js';
import { 
  getDataMysql,
  getDataFirstChar,
  getDataSecondChar,
  getDataThirdChar,
  getDataTable
} from "./controller/mysql.controller.js";

const app = express();

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

app.get('/', function (req, res) {
  res.send('hello, world!')
})

app.get("/semestre/:parametro", (req, res) => {
  const parametro = req.params.parametro;
  if(parametro == 1) semestre = '1S'
  else semestre = '2S'
  res.send(`Parámetro recibido: ${parametro}`);
});


app.get("/reportes-estaticos", async (req, res) => {
  try {
    const curso_apr = req.query.parametro1.toString().trim();
    const sem_apr = req.query.parametro2.toString().trim();
    const sem_prom = req.query.parametro3.toString().trim();
    const sem_alum = req.query.parametro4.toString().trim();

  // Acceder a los parámetros de consulta y realizar operaciones con ellos
    const result = await getDataMysql(curso_apr, sem_apr, sem_prom, sem_alum);
    res.send({ 
      all_data: result.results, 
      primer_grafica: result.primer_grafica,
      segunda_grafica: result.segunda_grafica,
      tercer_grafica: result.tercer_grafica
    });
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los datos de MySQL' });
  }
});

app.get("/tabla-datos", async (req, res) => {
  try {
  // Acceder a los parámetros de consulta y realizar operaciones con ellos
    const result = await getDataTable();
    res.send({ 
      all_data: result.results, 
    });
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los datos de MySQL' });
  }
});

app.get("/primer-grafica", async (req, res) => {
  try {
    const curso_apr = req.query.parametro1.toString().trim();
    const sem_apr = req.query.parametro2.toString().trim();

  // Acceder a los parámetros de consulta y realizar operaciones con ellos
    const result = await getDataFirstChar(curso_apr, sem_apr);
    res.send({ primer_grafica: result.primer_grafica});
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los datos de MySQL' });
  }
});

app.get("/segunda-grafica", async (req, res) => {
  try {
    const sem_prom = req.query.parametro1.toString().trim();

  // Acceder a los parámetros de consulta y realizar operaciones con ellos
    const result = await getDataSecondChar(sem_prom);
    res.send({ segunda_grafica: result.segunda_grafica});
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Error al obtener los datos de MySQL' });
  }
});

app.get("/tercer-grafica", async (req, res) => {
  try {
    const sem_prom = req.query.parametro1.toString().trim();

  // Acceder a los parámetros de consulta y realizar operaciones con ellos
    const result = await getDataThirdChar(sem_prom);
    res.send({ tercer_grafica: result.tercer_grafica});
  } catch (error) {
    console.log(error);
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
