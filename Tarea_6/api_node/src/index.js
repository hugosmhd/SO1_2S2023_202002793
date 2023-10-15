import {
  getAllAlbums
} from './controller/album.controller.js';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";


const app = express();
app.use(cors);
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  setInterval(() => {
    getAllAlbums()
      .then((data) => {
        socket.emit("getAllAlbums", data);
      })
      .catch((e) => console.log(e));
  }, 1500);
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});