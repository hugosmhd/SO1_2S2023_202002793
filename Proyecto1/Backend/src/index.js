const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Para parsear JSON en las solicitudes

app.post('/guardar-datos', (req, res) => {
  const data = req.body; // Los datos enviados desde Go
    console.log(data);
  // Aquí puedes guardar los datos en tu base de datos
  // Ejemplo con MongoDB:
  // const MongoClient = require('mongodb').MongoClient;
  // const url = 'mongodb://localhost:27017';
  // const client = new MongoClient(url, { useNewUrlParser: true });
  // client.connect((err, client) => {
  //   const db = client.db('miBaseDeDatos');
  //   const collection = db.collection('miColeccion');
  //   collection.insertOne(data, (err, result) => {
  //     if (err) {
  //       console.log('Error al insertar datos en la base de datos:', err);
  //       res.status(500).send('Error al insertar datos en la base de datos');
  //     } else {
  //       console.log('Datos insertados con éxito:', result.ops);
  //       res.status(201).json(result.ops);
  //     }
  //     client.close();
  //   });
  // });
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${port}`);
});