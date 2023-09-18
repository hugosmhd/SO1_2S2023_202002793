// const { google } = require('googleapis');

// // Crea un cliente de autenticación
// const auth = new google.auth.GoogleAuth({
//   keyFilename: 'auth_gcp/clave_de_servicio.json', // Reemplaza con la ruta de tu clave de servicio JSON
//   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

// // Crea un cliente de Compute Engine
// const computeEngine = google.compute({
//   version: 'v1',
//   auth,
// });

// // Define el nombre de tu grupo de instancias
// const instanceGroupName = 'instance-group-1';
// const projectId = 'empyrean-box-397402'; // Reemplaza con el ID de tu proyecto GCP

// // Obtiene la lista de instancias
// async function getIPsInZone(zoneName) {
//   try {
//       // Obtiene una lista de todas las zonas en una región específica
//     const res = await computeEngine.instances.list({
//       project: projectId,
//       zone: zoneName,
//       filter: `name:${instanceGroupName}`,
//     });

//     console.log(`Direcciones IP externas en la zona ${zoneName} para el grupo ${instanceGroupName}:`);

//     for (const instance of res.data.items) {
//       const networkInterfaces = instance.networkInterfaces;

//       networkInterfaces.forEach((networkInterface) => {
//         const accessConfigs = networkInterface.accessConfigs;
//         accessConfigs.forEach((accessConfig) => {
//           if (accessConfig.natIP) {
//             console.log(`Dirección IP externa de ${instance.name}: ${accessConfig.natIP}`);
//           }
//         });
//       });
//     }
//   } catch (err) {
//     console.error('Error al obtener las instancias en el grupo:', err);
//   }
// }

// async function getAllZones() {
//   try {
//     const res = await computeEngine.zones.list({
//       project: projectId,
//     });

//     const zones = res.data.items.map(zone => zone.name);

//     console.log('Zonas disponibles:');
//     console.log(zones);

//     // Itera sobre las zonas y obtén las direcciones IP en cada zona
//     for (const zone of zones) {
//       await getIPsInZone(zone);
//     }
//   } catch (err) {
//     console.error('Error al obtener la lista de zonas:', err);
//   }
// }


// getAllZones();


const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise')

const app = express();
const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'secret',
  port: 3306
});

const port = 3000;
app.use(cors());
app.use(express.json());

app.use(express.json()); // Para parsear JSON en las solicitudes

cont = 1
// apiUrlGo = "http://localhost:8000/data-kernel"
apiUrlGo = "http://35.193.160.143:8000/data-kernel"

app.get('/', (req, res) => {
  // res.send("Hola mundo")
    axios.get(apiUrlGo)
    .then(response => {
      // Aquí puedes manejar la respuesta de la API en Go.
      res.json({
        data_ram: response.data.data_ram,
        data_cpu: response.data.data_cpu,
      });
    })
    .catch(error => {
      console.error('Error al obtener datos desde la API en Go:', error.message);
      res.status(500).json({ error: 'Error al obtener datos desde la API en Go' });
    });
});

app.get('/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.send(result[0])
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).send('Error interno del servidor');
  }
});

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


app.post('/', (req, res) => {
  const ipAddress = req.header('x-forwarded-for')  ||
  req.socket.remoteAddress;
  res.send(ipAddress);
  console.log(ipAddress);
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en el puerto ${port}`);
});