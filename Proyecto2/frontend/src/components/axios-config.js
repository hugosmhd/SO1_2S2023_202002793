// axios-config.js

import axios from 'axios';

const instance = axios.create({
  // baseURL: 'localhost:3000/', // Cambia la URL base según tu servidor
  baseURL: 'http://34.172.151.223:3000/', // Cambia la URL base según tu servidor
  headers: {
    'Content-Type': 'application/json', // Tipo de contenido común
    'Access-Control-Allow-Origin': '*', // Configura las cabeceras CORS según tus necesidades
  },
});

export default instance;